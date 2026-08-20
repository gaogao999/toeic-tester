/**
 * 模擬試験の結果から「いまどのくらいの level か」を診断する。
 *
 * 2通りの経路がある。
 *   1. Claude API に投げる … 講評まで文章で返る。APIキーを入れた場合のみ
 *   2. その場で計算する   … キーが無い / 通信に失敗したときの代わり。
 *                           段階ごとの正答率から到達段階を機械的に決める
 *
 * どちらでも同じ形のオブジェクトを返すので、画面側は区別せずに描ける。
 *
 * APIキーはブラウザの localStorage に置く。学習データとは別のキーに保存し、
 * 「学習データを書き出す」の JSON には入れない（バックアップから漏れないように）。
 */
const AI = (() => {
  const KEY_STORE = 'eis-app:apikey';
  const ENDPOINT = 'https://api.anthropic.com/v1/messages';
  const MODEL = 'claude-opus-5';

  // 難易度の並び。低いほうから。
  // 英検ではなく CEFR で示す。教材（TOEFL Junior）は ETS が CEFR との対応を
  // 公表しているが、EIS が英検を基準にしている証拠は無いため。
  const LEVELS = ['入門（A1）', '基礎 A2', '標準 B1', '応用 B2'];

  // **いま出していない段は診断でも語らない。**
  // A2 は易しすぎるので伏せてあり、そこに「到達しました」と言われても行き先が無い。
  // **js/app.js の MIN_LEVEL と対で直すこと。**片方だけ動かすと、
  // アプリでは出せない段を診断が名指しすることになる
  const MIN_LEVEL = { word: 3, reading: 3 };
  const VISIBLE_LEVELS = LEVELS.slice(MIN_LEVEL.word - 1);

  // 算数は CEFR ではなく学年で語る。**js/app.js の MATH_LEVEL_LABELS と同じ並び**
  const MATH_LEVELS = ['Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7'];

  // ============================================================
  // APIキーの保管
  // ============================================================

  function getKey() {
    try {
      return localStorage.getItem(KEY_STORE) || '';
    } catch (e) {
      return '';
    }
  }

  function setKey(value) {
    try {
      if (value) localStorage.setItem(KEY_STORE, value.trim());
      else localStorage.removeItem(KEY_STORE);
    } catch (e) {
      console.warn('APIキーを保存できませんでした。', e);
    }
  }

  const hasKey = () => getKey().length > 0;

  // ============================================================
  // AIに渡す材料をまとめる
  // ============================================================

  /**
   * 段階ごとの正答率。模擬試験1回では単語が数問しか出ないので、
   * これまでの学習記録も合わせて集計する（判定の根拠を厚くするため）。
   */
  function accuracyByLevel() {
    const rows = LEVELS.map((name) => ({ level: name, correct: 0, wrong: 0 }));
    for (const w of WORD_DATA) {
      // 伏せている段の記録は数えない。**いま出していない段の古い成績で
      // 「基礎 A2 に到達」と判定されると、そこへ戻る道が画面に無い**
      if (w.level < MIN_LEVEL.word) continue;
      const rec = Storage.getRecord(w.id);
      const row = rows[w.level - 1];
      if (!row) continue;
      row.correct += rec.correct;
      row.wrong += rec.wrong;
    }
    return rows
      .filter((r) => VISIBLE_LEVELS.includes(r.level))
      .map((r) => ({
        level: r.level,
        answered: r.correct + r.wrong,
        accuracy: r.correct + r.wrong > 0 ? Math.round((r.correct / (r.correct + r.wrong)) * 100) : null
      }));
  }

  /**
   * 分野別の正答率のうち、解答数が一定以上あるものだけ（少数の偶然を拾わないため）。
   *
   * どの科目の分野かも持たせる。「◯◯を復習しましょう」の案内先が
   * 単語なのか算数なのかで変わるため。単語の分野は出典の長文のテーマなので、
   * 長文と同じ名前になることがある。そのときは両方を覚えておく。
   */
  function accuracyByCategory(minAnswers = 3) {
    const map = new Map();
    const add = (name, rec, subject) => {
      if (!name) return;
      const cur = map.get(name) || { correct: 0, wrong: 0, subjects: new Set() };
      cur.correct += rec.correct;
      cur.wrong += rec.wrong;
      if (rec.correct + rec.wrong > 0) cur.subjects.add(subject);
      map.set(name, cur);
    };
    // 伏せている段は数えない。出せない段の古い成績で「ここが苦手」と言われても、
    // 案内した先にその問題が無い
    WORD_DATA.filter((w) => w.level >= MIN_LEVEL.word)
      .forEach((w) => add(w.category, Storage.getRecord(w.id), '単語'));
    MATH_DATA.forEach((p) => add(p.category, Storage.getRecord(p.id), '算数'));
    READING_DATA.filter((r) => r.level >= MIN_LEVEL.reading).forEach((r) =>
      r.questions.forEach((q, i) => add(r.topic, Storage.getRecord(`${r.id}-${i + 1}`), '長文読解'))
    );

    return [...map.entries()]
      .map(([name, v]) => ({
        name,
        answered: v.correct + v.wrong,
        accuracy: Math.round((v.correct / (v.correct + v.wrong)) * 100),
        subjects: [...v.subjects]
      }))
      .filter((x) => x.answered >= minAnswers)
      .sort((a, b) => a.accuracy - b.accuracy);
  }

  /**
   * 弱点と呼ぶ line。正答率がこれ未満のものだけを「弱点」として挙げる。
   * 70% は模擬試験の階段が落ち着く高さと同じ。判定の物差しを一本にするため。
   */
  const WEAK_LINE = 70;

  /** 弱点への助言。案内先が科目でちがうので、分野が属する科目に合わせて出し分ける */
  function weakAdvice(row) {
    const s = row.subjects || [];
    if (s.length === 1 && s[0] === '算数') return '算数の「分野」でこの分野に絞って解き直しましょう。';
    if (s.length === 1 && s[0] === '長文読解') return 'このテーマの長文をもう一度読み、間違えた設問を確かめましょう。';
    if (s.length === 1 && s[0] === '単語') return 'クイズの「対象」でこの分野の単語に絞って復習しましょう。';
    return `${s.join('と')}のこの分野を、まとめて復習しましょう。`;
  }

  /** 診断の材料。AIに渡すものと、その場で計算するときの材料を兼ねる */
  function buildSnapshot(mockResult, daysLeft) {
    const weak = accuracyByCategory();
    return {
      試験まで残り日数: daysLeft,
      今回の模擬試験: {
        形式: mockResult.adaptive ? 'レベル判定（やさしい問題から難易度を上下させる適応型）' : '本番形式（固定の問題数と制限時間）',
        正答数: mockResult.correct,
        問題数: mockResult.total,
        正答率: mockResult.rate,
        所要分: mockResult.minutes,
        制限分: mockResult.limitMinutes,
        科目別: mockResult.byKind,
        // 適応型のときだけ。難易度をどう行き来したかと、そこから出した推定レベル
        レベル判定: mockResult.adaptive || null
      },
      これまでの段階別正答率: accuracyByLevel(),
      // 全部できていても「いちばん下の6つ」を弱点として挙げてしまわないよう、
      // 正答率が線を下回っているものだけを弱点にする
      苦手な分野: weak.filter((x) => x.accuracy < WEAK_LINE).slice(0, 6),
      得意な分野: weak.filter((x) => x.accuracy >= WEAK_LINE).slice(-4).reverse(),
      過去の模擬試験: (Storage.getSettings().mockHistory || []).map((h) => ({
        正答率: h.rate,
        所要分: h.minutes
      }))
    };
  }

  // ============================================================
  // その場で計算する診断（AIを使わない経路）
  // ============================================================

  /**
   * 到達段階を決める。
   *   1. 適応型テストを受けたなら、その推定レベルを優先する
   *      （難易度を上下させて出した値のほうが、たまたまの出題運に左右されにくい）
   *   2. そうでなければ「正答率70%以上を保てている一番上の段階」
   *      解答数が5問に満たない段階は、判断材料が足りないので数えない
   */
  /**
   * 適応型の判定根拠。**科目ごとの結果を並べる。**
   * 見出しの1つの段だけを語ると、単語は取れているのに長文が落ちている、といった
   * いちばん役に立つ情報が消えてしまう
   */
  function adaptiveReason(a) {
    const rows = a['科目ごと'] || [];
    const each = rows.map((r) => `${r.科目} ${r.推定レベル}（${r.正答}/${r.出題}）`).join(' ／ ');
    const why = a['見出しの根拠'] ? `見出しは ${a['見出しの根拠']} に合わせています。` : '';
    return `${each}。${why}`;
  }

  function diagnoseLocally(snapshot) {
    const rows = snapshot['これまでの段階別正答率'];
    let reached = null;
    for (const row of rows) {
      if (row.answered >= 5 && row.accuracy !== null && row.accuracy >= 70) reached = row.level;
    }

    const mock = snapshot['今回の模擬試験'];
    // 算数だけのレベル判定は CEFR を語れないので、英語の判定には使わない
    const adaptive = mock['レベル判定'];
    const forGrade = adaptive && adaptive['CEFRで語れる'] ? adaptive : null;
    const weak = snapshot['苦手な分野'];
    const overTime = mock.制限分 !== null && mock.所要分 > mock.制限分;

    // 算数だけの回で英語の段階を見出しに出しても意味がないので、算数の学年を見出しにする
    const mathOnly = adaptive && !forGrade;

    const level = forGrade
      ? forGrade['推定レベル']
      : mathOnly
        ? adaptive['推定レベル']
        : reached || '判定するには解答数が不足';
    const levelReason = forGrade
      ? adaptiveReason(forGrade)
      : mathOnly
        ? `${adaptiveReason(adaptive)}（算数の学年です。英語の段階は英語を含む回で測ります）`
        : reached
          ? `${reached} までの語で正答率70%以上を保てています。`
          : '各段階の単語を5問以上解くと判定できます。';

    const notes = [];
    notes.push(
      forGrade
        ? `難易度を調整しながら ${mock.問題数} 問を解いた結果、いまの到達点は ${forGrade['推定レベル']} 相当と見ています。`
        : mathOnly
          ? `算数の難易度を上下させながら ${mock.問題数} 問を解いた結果、到達段階は ${adaptive['推定レベル']} でした。`
          : reached
            ? `段階ごとの正答率から、いまの到達点は ${reached} 相当と見ています。`
            : '判定にはまだ解答数が足りません。各段階の単語を5問以上解くと判定できます。'
    );
    if (mock.制限分 === null) {
      notes.push(`所要 ${mock.所要分} 分。次は本番形式で、時間内に解き切る練習もしておきましょう。`);
    } else {
      notes.push(
        overTime
          ? `所要 ${mock.所要分} 分は制限 ${mock.制限分} 分を超えています。まず時間内に解き切ることを目標にしましょう。`
          : `所要 ${mock.所要分} 分（制限 ${mock.制限分} 分）。時間配分は問題ありません。`
      );
    }

    return {
      source: 'local',
      level,
      levelReason,
      comment: notes.join(' '),
      strengths: snapshot['得意な分野'].map((x) => `${x.name}（${x.accuracy}%）`),
      weaknesses: weak.slice(0, 3).map((x) => ({
        area: `${x.name}（${x.accuracy}%）`,
        advice: weakAdvice(x)
      })),
      nextActions: [
        weak[0] ? `${weak[0].name} を重点的に復習する` : '今日の学習メニューをこなす',
        mock.制限分 === null
          ? '本番形式の模擬試験で、時間内に解き切る練習をする'
          : overTime
            ? '短い模擬試験（20問15分）で時間内に解く練習をする'
            : '一つ上の段階にも手を広げる'
      ],
      encouragement: `試験まであと ${snapshot['試験まで残り日数']} 日。今日の積み重ねが効きます。`
    };
  }

  // ============================================================
  // Claude API を呼ぶ診断
  // ============================================================

  // 返してほしい形をスキーマで固定する。文章を後から切り出さずに済む
  const RESULT_SCHEMA = {
    type: 'object',
    properties: {
      level: {
        type: 'string',
        // 算数だけの回は見出しが学年になるので、Grade も許す。
        // CEFR しか許していないと、算数だけのレベル判定で AI が返せる値が無くなる
        enum: [
          ...VISIBLE_LEVELS,
          `${VISIBLE_LEVELS[0]} より下`,
          ...MATH_LEVELS,
          `${MATH_LEVELS[0]} より下`,
          '判定するには解答数が不足'
        ],
        description: '現時点で到達していると考えられる CEFR の段階'
      },
      levelReason: { type: 'string', description: 'その段階と判断した根拠。数字を挙げて1〜2文で' },
      comment: { type: 'string', description: '今回の模擬試験の講評。2〜3文' },
      strengths: { type: 'array', items: { type: 'string' }, description: '得意な分野。最大3つ' },
      weaknesses: {
        type: 'array',
        description: '弱点と、その対策。最大3つ',
        items: {
          type: 'object',
          properties: {
            area: { type: 'string' },
            advice: { type: 'string' }
          },
          required: ['area', 'advice'],
          additionalProperties: false
        }
      },
      nextActions: { type: 'array', items: { type: 'string' }, description: '次にやること。2〜3つ' },
      encouragement: { type: 'string', description: '受験生を励ます一言' }
    },
    required: ['level', 'levelReason', 'comment', 'strengths', 'weaknesses', 'nextActions', 'encouragement'],
    additionalProperties: false
  };

  const SYSTEM_PROMPT = [
    'あなたは Ekamai International School の Grade 8 入試を目指す日本人の中学生を指導する家庭教師です。',
    '入試科目は英語（単語・長文読解）と算数の2つ。試験日は2027年1月7日です。',
    '渡される学習データを読み、いまの到達段階（CEFR）と、次にやるべきことを日本語で伝えてください。',
    '',
    '守ること:',
    '- 「レベル判定」があり、その「CEFRで語れる」が true の回は、それを到達段階の主な根拠にする。',
    '  これはやさしい問題から始めて、2問続けて正解したら難易度を1段上げ、間違えたら1段下げる方式で測ったもの。',
    '  難易度が上下を繰り返す高さがその子の実力なので、「推定レベル」を尊重し、覆すなら理由を数字で示す。',
    '- **「科目ごと」が判定の中身。**単語・長文読解・文法・算数それぞれに別の階段で測った結果が入っている。',
    '  講評では**科目ごとの差**に必ず触れる。「単語は取れているが長文が落ちている」のような差がいちばん役に立つ。',
    '  算数の段は学年（Grade）であって CEFR ではないので、英語の段と混ぜて語らない。',
    '- 各科目の「測り方」を見ること。',
    '  「一番難しいところまで上がりきった」は用意した問題の上限に達しただけで、本当の実力はもっと上かもしれない。',
    '  「これ以上は測れていない」と正直に伝える。',
    '  「問題数が足りない」の科目は**判定しない**。「この科目はまだ測れていない」と述べ、次に測る方法を勧める。',
    '- 「正答率で下げた」が true の科目は、難易度は上がったがその段で7割を取れていない。',
    '  4択はまぐれでも当たるので、「最高到達難易度」を到達点として語らないこと。',
    '  「推定レベル」（正答率で見直した後の値）を使い、上げられなかった理由を数字で示す。',
    '- 「CEFRで語れる」が false の回（算数だけ）の「推定レベル」は学年の段階であって CEFR ではない。',
    '  この場合の英語の判定は「これまでの段階別正答率」で行い、算数の到達段階は別に述べる。',
    '- 「レベル判定」が null の回は、「これまでの段階別正答率」を主な根拠にする。解答数が少ない段階は判断材料にしない。',
    '- 「レベル判定」がある回は、難易度がどこで止まったか（伸び悩んだ高さ）に触れ、次に狙う段階を具体的に示す。',
    '- 数字を挙げて理由を述べる。「頑張りましょう」だけの中身のない講評にしない。',
    '- 相手は中学生。専門用語を避け、短く具体的に書く。',
    '- 事実にない数字を作らない。データに無いことは述べない。'
  ].join('\n');

  async function diagnoseWithClaude(snapshot) {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': getKey(),
        'anthropic-version': '2023-06-01',
        // ブラウザから直接呼ぶときに必要（これが無いと CORS で弾かれる）
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: MODEL,
        // Claude Opus 5 は既定で思考する。max_tokens は思考と本文の合計に効くので余裕を持たせる
        max_tokens: 8000,
        output_config: {
          effort: 'medium', // 統計を読み取って講評するだけなので中程度で足りる
          format: { type: 'json_schema', schema: RESULT_SCHEMA }
        },
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `次の学習データから、いまの到達段階と次にやることを診断してください。\n\n${JSON.stringify(snapshot, null, 2)}`
          }
        ]
      })
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(apiErrorMessage(res.status, body));
    }

    const data = await res.json();

    // 安全上の理由で回答を断られることがある。content を読む前に確かめる
    if (data.stop_reason === 'refusal') {
      throw new Error('AIが回答を差し控えました。');
    }
    if (data.stop_reason === 'max_tokens') {
      throw new Error('回答が長すぎて途中で切れました。');
    }

    // 思考ブロックが先に入るので、content[0] ではなく text ブロックを探す
    const text = (data.content || []).find((b) => b.type === 'text');
    if (!text) throw new Error('AIの回答を読み取れませんでした。');

    return { source: 'claude', ...JSON.parse(text.text) };
  }

  function apiErrorMessage(status, body) {
    const detail = body && body.error && body.error.message ? `（${body.error.message}）` : '';
    switch (status) {
      case 401:
        return `APIキーが正しくありません${detail}`;
      case 403:
        return `このAPIキーには権限がありません${detail}`;
      case 429:
        return `API の利用上限に達しました。しばらく待ってから試してください${detail}`;
      default:
        return status >= 500
          ? `Anthropic 側で問題が起きています。しばらく待ってから試してください${detail}`
          : `AI の呼び出しに失敗しました（${status}）${detail}`;
    }
  }

  // ============================================================
  // 入口
  // ============================================================

  /**
   * 診断する。APIキーがあれば Claude に、無ければその場で計算する。
   * Claude 側が失敗しても診断そのものは返す（fallbackReason に理由が入る）。
   */
  async function diagnose(mockResult, daysLeft) {
    const snapshot = buildSnapshot(mockResult, daysLeft);
    const local = diagnoseLocally(snapshot);

    if (!hasKey()) return local;

    try {
      return await diagnoseWithClaude(snapshot);
    } catch (e) {
      console.warn('AI診断に失敗したため、その場での計算に切り替えます。', e);
      return { ...local, fallbackReason: e.message };
    }
  }

  // ============================================================
  // 例文の和訳
  // ============================================================
  //
  // 単語 2,300 語ぶんの和訳を先に用意するのは現実的でないので、
  // カードをめくったときにその1文だけ訳す。実際に見る語は限られるので、
  // 全部を用意するより無駄がない。
  //
  // 訳したものは localStorage に貯める。同じ文を二度訳さない。
  // 学習データとは別のキーに置く（書き出しに混ざらないように）。

  const TRANSLATION_STORE = 'eis-app:translations';

  // 1文を訳すだけなので、速くて安いモデルを使う。診断のほうは opus のまま。
  // カードをめくってから訳が出るまでの待ち時間がそのまま体験になるため。
  const TRANSLATE_MODEL = 'claude-haiku-4-5';

  function loadTranslations() {
    try {
      return JSON.parse(localStorage.getItem(TRANSLATION_STORE) || '{}');
    } catch (e) {
      return {};
    }
  }

  function saveTranslation(text, ja) {
    try {
      const all = loadTranslations();
      all[text] = ja;
      localStorage.setItem(TRANSLATION_STORE, JSON.stringify(all));
    } catch (e) {
      // 容量が尽きても学習は続けられるので、黙って諦める
      console.warn('和訳を保存できませんでした。', e);
    }
  }

  /** 訳済みなら即返す。まだなら null */
  function cachedTranslation(text) {
    return loadTranslations()[text] || null;
  }

  const TRANSLATE_SYSTEM = [
    '英文を日本語に訳してください。',
    '',
    '守ること:',
    '- 訳文だけを返す。前置き・説明・引用符を付けない。',
    '- 読むのは中学生。平易で自然な日本語にする。直訳調にしない。',
    '- 固有名詞はカタカナにする。'
  ].join('\n');

  /**
   * 例文を訳す。APIキーが無ければ null を返す（画面側は和訳を出さないだけ）。
   * 失敗しても投げない。和訳が出ないだけで学習は止めない。
   */
  async function translateExample(text) {
    if (!text) return null;

    const hit = cachedTranslation(text);
    if (hit) return hit;
    if (!hasKey()) return null;

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': getKey(),
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: TRANSLATE_MODEL,
          max_tokens: 400,
          system: TRANSLATE_SYSTEM,
          messages: [{ role: 'user', content: text }]
        })
      });

      if (!res.ok) throw new Error(`翻訳に失敗しました（${res.status}）`);

      const data = await res.json();
      if (data.stop_reason === 'refusal') return null;

      const block = (data.content || []).find((b) => b.type === 'text');
      const ja = block && block.text.trim();
      if (!ja) return null;

      saveTranslation(text, ja);
      return ja;
    } catch (e) {
      console.warn('例文の和訳に失敗しました。', e);
      return null;
    }
  }

  // ------------------------------------------------------------
  // ふりがな
  // ------------------------------------------------------------
  //
  // 意味に使う漢字は、小学生・中学生には読めないものが混じる
  // （漆喰・胞子・疫病・遺棄 など）。読めないと意味も覚えられないので、
  // 和訳と同じやり方で、必要になったぶんだけ読みを作って貯める。

  const FURIGANA_STORE = 'eis-app:furigana';

  const FURIGANA_SYSTEM = [
    '日本語にふりがなを付けてください。',
    '',
    '守ること:',
    '- 漢字を含む語の直後に、その読みを丸かっこで書く。例: 漆喰(しっくい)を塗る',
    '- 小学校で習う漢字（山・川・見る など）には付けない。読めるので邪魔になる。',
    '- ひらがな・カタカナ・記号はそのまま残す。',
    '- 訳したり言い換えたりしない。もとの文字はそのままにする。',
    '- 結果だけを返す。前置きを付けない。'
  ].join('\n');

  function loadFurigana() {
    try {
      return JSON.parse(localStorage.getItem(FURIGANA_STORE) || '{}');
    } catch (e) {
      return {};
    }
  }

  const cachedFurigana = (text) => loadFurigana()[text] || null;

  /**
   * ふりがなを付ける。付ける必要が無い（漢字が無い）ときは元の文字を返す。
   * キーが無い・失敗したときは null を返し、画面はふりがな無しで出す。
   */
  async function addFurigana(text) {
    if (!text) return null;
    if (!/[一-龯]/.test(text)) return text; // 漢字が無ければそのまま

    const hit = cachedFurigana(text);
    if (hit) return hit;
    if (!hasKey()) return null;

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': getKey(),
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: TRANSLATE_MODEL,
          max_tokens: 300,
          system: FURIGANA_SYSTEM,
          messages: [{ role: 'user', content: text }]
        })
      });
      if (!res.ok) throw new Error(`ふりがなの作成に失敗しました（${res.status}）`);

      const data = await res.json();
      if (data.stop_reason === 'refusal') return null;
      const block = (data.content || []).find((b) => b.type === 'text');
      const out = block && block.text.trim();
      if (!out) return null;

      try {
        const all = loadFurigana();
        all[text] = out;
        localStorage.setItem(FURIGANA_STORE, JSON.stringify(all));
      } catch (e) {
        console.warn('ふりがなを保存できませんでした。', e);
      }
      return out;
    } catch (e) {
      console.warn('ふりがなの作成に失敗しました。', e);
      return null;
    }
  }

  function clearFurigana() {
    try {
      localStorage.removeItem(FURIGANA_STORE);
    } catch (e) {
      console.warn('ふりがなを消せませんでした。', e);
    }
  }

  /** 貯めた和訳の数。設定画面で見せる */
  const translationCount = () => Object.keys(loadTranslations()).length;

  function clearTranslations() {
    try {
      localStorage.removeItem(TRANSLATION_STORE);
    } catch (e) {
      console.warn('和訳を消せませんでした。', e);
    }
  }

  return {
    diagnose,
    getKey,
    setKey,
    hasKey,
    accuracyByLevel,
    translateExample,
    cachedTranslation,
    translationCount,
    clearTranslations,
    addFurigana,
    cachedFurigana,
    clearFurigana
  };
})();
