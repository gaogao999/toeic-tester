/**
 * 模擬試験の結果から「いまどのくらいの level か」を診断する。
 *
 * 2通りの経路がある。
 *   1. Claude API に投げる … 講評まで文章で返る。APIキーを入れた場合のみ
 *   2. その場で計算する   … キーが無い / 通信に失敗したときの代わり。
 *                           級ごとの正答率から到達級を機械的に決める
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

  // 級の並び。低いほうから
  const LEVELS = ['英検5級・4級', '英検3級', '英検準2級', '英検2級'];

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
   * 級ごとの正答率。模擬試験1回では単語が数問しか出ないので、
   * これまでの学習記録も合わせて集計する（判定の根拠を厚くするため）。
   */
  function accuracyByLevel() {
    const rows = LEVELS.map((name, i) => ({ level: name, correct: 0, wrong: 0 }));
    for (const w of WORD_DATA) {
      const rec = Storage.getRecord(w.id);
      const row = rows[w.level - 1];
      if (!row) continue;
      row.correct += rec.correct;
      row.wrong += rec.wrong;
    }
    return rows.map((r) => ({
      level: r.level,
      answered: r.correct + r.wrong,
      accuracy: r.correct + r.wrong > 0 ? Math.round((r.correct / (r.correct + r.wrong)) * 100) : null
    }));
  }

  /** 分野別の正答率のうち、解答数が一定以上あるものだけ（少数の偶然を拾わないため） */
  function accuracyByCategory(minAnswers = 3) {
    const map = new Map();
    const add = (name, rec) => {
      if (!name) return;
      const cur = map.get(name) || { correct: 0, wrong: 0 };
      cur.correct += rec.correct;
      cur.wrong += rec.wrong;
      map.set(name, cur);
    };
    WORD_DATA.forEach((w) => add(w.category, Storage.getRecord(w.id)));
    MATH_DATA.forEach((p) => add(p.category, Storage.getRecord(p.id)));
    READING_DATA.forEach((r) =>
      r.questions.forEach((q, i) => add(r.topic, Storage.getRecord(`${r.id}-${i + 1}`)))
    );

    return [...map.entries()]
      .map(([name, v]) => ({
        name,
        answered: v.correct + v.wrong,
        accuracy: Math.round((v.correct / (v.correct + v.wrong)) * 100)
      }))
      .filter((x) => x.answered >= minAnswers)
      .sort((a, b) => a.accuracy - b.accuracy);
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
      これまでの級別正答率: accuracyByLevel(),
      苦手な分野: weak.slice(0, 6),
      得意な分野: weak.slice(-4).reverse(),
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
   * 到達級を決める。
   *   1. 適応型テストを受けたなら、その推定レベルを優先する
   *      （難易度を上下させて出した値のほうが、たまたまの出題運に左右されにくい）
   *   2. そうでなければ「正答率70%以上を保てている一番上の級」
   *      解答数が5問に満たない級は、判断材料が足りないので数えない
   */
  /** 適応型の判定根拠。終わり方によって言えることが違うので分ける */
  function adaptiveReason(a) {
    switch (a['測り方']) {
      case '一番難しいところまで上がりきった':
        return `やさしい問題から始めて、用意した中で一番難しい ${a['最高到達難易度']} まで正解し続けました。`;
      case '一番やさしいところから上がれなかった':
        return `一番やさしい ${a['最高到達難易度']} の問題で取りこぼしが続き、難易度を上げられませんでした。`;
      case '上下がまだ少ない':
        return `${a['最高到達難易度']} まで難易度が上がり、後半に出した問題の高さの平均が ${a['推定値']} でした。`;
      default:
        return `難易度を上下させたところ ${a['折り返し回数']} 回折り返し、その平均が ${a['推定値']}（最高 ${a['最高到達難易度']}）でした。`;
    }
  }

  function diagnoseLocally(snapshot) {
    const rows = snapshot['これまでの級別正答率'];
    let reached = null;
    for (const row of rows) {
      if (row.answered >= 5 && row.accuracy !== null && row.accuracy >= 70) reached = row.level;
    }

    const mock = snapshot['今回の模擬試験'];
    // 算数だけのレベル判定は英検の級を語れないので、級の判定には使わない
    const adaptive = mock['レベル判定'];
    const forGrade = adaptive && adaptive['英検の級として使える'] ? adaptive : null;
    const weak = snapshot['苦手な分野'];
    const overTime = mock.制限分 !== null && mock.所要分 > mock.制限分;

    const level = forGrade ? forGrade['推定レベル'] : reached || '判定するには解答数が不足';
    const levelReason = forGrade
      ? adaptiveReason(forGrade)
      : reached
        ? `${reached} までの語で正答率70%以上を保てています。`
        : '各級の単語を5問以上解くと判定できます。';

    const notes = [];
    notes.push(
      forGrade
        ? `難易度を調整しながら ${mock.問題数} 問を解いた結果、いまの到達点は ${forGrade['推定レベル']} 相当と見ています。`
        : reached
          ? `級ごとの正答率から、いまの到達点は ${reached} 相当と見ています。`
          : '判定にはまだ解答数が足りません。各級の単語を5問以上解くと級が出ます。'
    );
    if (adaptive && !forGrade) {
      notes.push(`算数は難易度を上下させた結果、到達段階は ${adaptive['推定レベル']} でした。`);
    }
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
        advice: 'クイズの「対象」で苦手な単語に絞って復習しましょう。'
      })),
      nextActions: [
        weak[0] ? `${weak[0].name} を重点的に復習する` : '今日の学習メニューをこなす',
        mock.制限分 === null
          ? '本番形式の模擬試験で、時間内に解き切る練習をする'
          : overTime
            ? '短い模擬試験（20問15分）で時間内に解く練習をする'
            : '一つ上の級のレベルにも手を広げる'
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
        enum: [...LEVELS, '英検5級未満', '判定するには解答数が不足'],
        description: '現時点で到達していると考えられる英検の級'
      },
      levelReason: { type: 'string', description: 'その級と判断した根拠。数字を挙げて1〜2文で' },
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
    '渡される学習データを読み、いまの到達級と、次にやるべきことを日本語で伝えてください。',
    '',
    '守ること:',
    '- 「レベル判定」があり、その「英検の級として使える」が true の回は、それを級の判定の主な根拠にする。',
    '  これはやさしい問題から始めて、2問続けて正解したら難易度を1段上げ、間違えたら1段下げる方式で測ったもの。',
    '  難易度が上下を繰り返す高さがその子の実力なので、「推定レベル」を尊重し、覆すなら理由を数字で示す。',
    '  ただし「測り方」が「一番難しいところまで上がりきった」の場合、それは用意した問題の上限に達しただけで、',
    '  本当の実力はもっと上かもしれない。「これ以上は測れていない」と正直に伝える。',
    '- 「英検の級として使える」が false の回（算数だけ）の「推定レベル」は学年の段階であって英検の級ではない。',
    '  この場合の級の判定は「これまでの級別正答率」で行い、算数の到達段階は別に述べる。',
    '- 「レベル判定」が null の回は、「これまでの級別正答率」を主な根拠にする。解答数が少ない級は判断材料にしない。',
    '- 「レベル判定」がある回は、難易度がどこで止まったか（伸び悩んだ高さ）に触れ、次に狙う級を具体的に示す。',
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
            content: `次の学習データから、いまの到達級と次にやることを診断してください。\n\n${JSON.stringify(snapshot, null, 2)}`
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
    clearTranslations
  };
})();
