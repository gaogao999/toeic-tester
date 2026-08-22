/**
 * 学習履歴の保存と間隔反復（Leitnerシステム）の管理。
 * データは localStorage に保存されるため、同じブラウザなら次回も引き継がれる。
 */
const Storage = (() => {
  // このキーは今後のアップデートでも絶対に変えない。変えると全員の学習記録が読めなくなる。
  // データ形式を変えたくなったら、キーはそのままにして load() の中でマイグレーションする。
  const KEY = 'eis-app:v1';
  const BACKUP_KEY = 'eis-app:v1:backup'; // 1日1回の自動バックアップ（その日最初の保存の直前の状態）
  const BACKUP_DATE_KEY = 'eis-app:v1:backup-date';
  const BROKEN_KEY = 'eis-app:v1:broken'; // 壊れて読めなかった生データの退避先（手動復旧用）

  // Leitner の各ボックスに対応する復習間隔（日数）
  const INTERVALS = [0, 1, 3, 7, 14, 30];
  const MAX_BOX = INTERVALS.length - 1;

  const DEFAULT_STATE = {
    records: {}, // { [wordId]: { box, correct, wrong, lastStudied, nextDue, starred, learned } }
    stats: { totalAnswers: 0, totalCorrect: 0, sessions: 0 },
    // [{ date, answered, correct, word, math, reading, grammar, minutes }]
    // 真ん中の4つは科目別の解答数。minutes は**座っていた時間**（20分セッションの積み上げ）
    history: [],
    settings: {
      level: 'all',
      category: 'all',
      scope: 'all',
      source: 'all',
      quizLength: 10,
      tempoTime: 5, // サクサク4択の1問あたりの制限時間（秒）。0 なら無制限
      autoSpeak: false,
      furigana: false,
      // 長文のレベルも保存する。ほかの科目と同じく、次に開いたときも同じ範囲で始めたい
      readingLevel: 'all',
      // **レベル判定で出た段。**「今日の学習」から開くとき、この段に絞る。
      // { word: 3, reading: 4, grammar: 3, math: 5, at: '2026-08-20' }。
      // まだ受けていなければ null
      judged: null,
      // **出題の重心。**セッションが問題を選ぶときの方針。
      //   judged … レベル判定で出た段（既定）／ top … 一番上の段だけ／ weak … 間違えたものだけ
      focus: 'judged',
      // 何分のセッションを選んだか。次に開いたときも同じ長さを出す
      sessionMinutes: 20,
      /**
       * **やりかけのセッション。**中断したときここに丸ごと入り、次に開くと続きから出る。
       * { startedAt, minutes, kinds, queue:[…], index, results:[…], elapsed }
       *
       * 設定ではないが settings に置いている。**保存キー（eis-app:v1）と state の形は
       * 壊さない**という決まりがあり、tryParse が records/stats/history/settings の
       * 4つしか読まないため、新しい最上位キーを足すと古いデータから復元できなくなる
       */
      session: null,
      // 終わったセッションの記録（直近20回）。[{ date, minutes, answered, correct, perKind }]
      sessionHistory: [],
      mathLevel: 'all',
      mathCategory: 'all',
      mathScope: 'all',
      // 本番（MAP Growth）が4択なので既定も4択。自由入力のほうが難しいので選べる
      mathFormat: 'choice',
      mathLength: 10,
      grammarLevel: 'all',
      grammarUnit: 'all',
      grammarScope: 'all',
      grammarLength: 10
    }
  };

  let state = load();

  /** 生の文字列を state の形に整える。壊れていたら null（例外は投げない） */
  function tryParse(raw) {
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || typeof parsed.records !== 'object') return null;
      // 新しい項目が増えても DEFAULT_STATE 側の初期値で埋まるので、古いデータのまま読める
      return {
        records: parsed.records || {},
        stats: { ...DEFAULT_STATE.stats, ...(parsed.stats || {}) },
        history: parsed.history || [],
        settings: { ...DEFAULT_STATE.settings, ...(parsed.settings || {}) }
      };
    } catch (e) {
      return null;
    }
  }

  function load() {
    const raw = localStorage.getItem(KEY);
    const main = tryParse(raw);
    if (main) return main;

    if (raw) {
      // 壊れたデータでも捨てずに退避しておく。初期化で上書きしてしまうと二度と戻せないため
      try {
        localStorage.setItem(BROKEN_KEY, raw);
      } catch (e) {
        /* 退避すら失敗したら諦める */
      }
      // 自動バックアップ（最大1日前の状態）から復元を試みる
      const backup = tryParse(localStorage.getItem(BACKUP_KEY));
      if (backup) {
        console.warn('保存データが壊れていたため、自動バックアップから復元しました。');
        return backup;
      }
      console.warn('保存データを読み込めませんでした。初期化します（元データは退避済み）。');
    }
    return structuredCloneSafe(DEFAULT_STATE);
  }

  function structuredCloneSafe(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function save() {
    try {
      // その日最初の保存の前に、前日までの状態をバックアップとして残す。
      // アップデートの不具合や誤操作（リセット等）があっても、1日前までは戻せる。
      const today = todayKey();
      if (localStorage.getItem(BACKUP_DATE_KEY) !== today) {
        const prev = localStorage.getItem(KEY);
        if (prev) {
          localStorage.setItem(BACKUP_KEY, prev);
          localStorage.setItem(BACKUP_DATE_KEY, today);
        }
      }
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('保存に失敗しました。', e);
    }
  }

  function todayKey(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  /**
   * IDから科目を判定する。
   *   単語 … 1, 2, 3 …（数値）
   *   算数 … m1, m2 …
   *   長文 … r1-1, r1-2 …
   *   文法 … g2001, g3001 …
   */
  function kindOf(id) {
    const s = String(id);
    if (s.startsWith('m')) return 'math';
    if (s.startsWith('r')) return 'reading';
    if (s.startsWith('g')) return 'grammar';
    return 'word';
  }

  /** 今日の1行を取り出す。無ければ作る。**解答数・長文の本数・分は同じ行に積む** */
  function dayRecord() {
    const key = todayKey();
    let day = state.history.find((h) => h.date === key);
    if (!day) {
      day = { date: key, answered: 0, correct: 0, word: 0, math: 0, reading: 0, grammar: 0 };
      state.history.push(day);
    }
    return day;
  }

  function getRecord(wordId) {
    return (
      state.records[wordId] || {
        box: 0,
        correct: 0,
        wrong: 0,
        lastStudied: null,
        nextDue: null,
        starred: false,
        learned: false // 「覚えた」チェック
      }
    );
  }

  /** 正誤を記録し、Leitner のボックスを昇降させる */
  function recordAnswer(wordId, isCorrect) {
    const rec = { ...getRecord(wordId) };

    if (isCorrect) {
      rec.correct += 1;
      rec.box = Math.min(rec.box + 1, MAX_BOX);
    } else {
      rec.wrong += 1;
      rec.box = Math.max(rec.box - 1, 0); // 間違えたら1つ前の箱に戻す
    }

    const now = new Date();
    rec.lastStudied = now.toISOString();
    const next = new Date(now);
    next.setDate(next.getDate() + INTERVALS[rec.box]);
    rec.nextDue = next.toISOString();

    state.records[wordId] = rec;
    state.stats.totalAnswers += 1;
    if (isCorrect) state.stats.totalCorrect += 1;

    const day = dayRecord();
    day.answered += 1;
    if (isCorrect) day.correct += 1;

    // 科目別の解答数（古い記録には無いので、無ければ0から数え始める）
    const kind = kindOf(wordId);
    day[kind] = (day[kind] || 0) + 1;

    save();
    return rec;
  }

  /** 「覚えた」チェックの付け外し */
  function setLearned(wordId, value) {
    const rec = { ...getRecord(wordId) };
    rec.learned = value;
    state.records[wordId] = rec;
    save();
    return rec.learned;
  }

  function toggleLearned(wordId) {
    return setLearned(wordId, !getRecord(wordId).learned);
  }

  function isLearned(wordId) {
    return getRecord(wordId).learned;
  }

  function toggleStar(wordId) {
    const rec = { ...getRecord(wordId) };
    rec.starred = !rec.starred;
    state.records[wordId] = rec;
    save();
    return rec.starred;
  }

  function isDue(wordId) {
    const rec = state.records[wordId];
    if (!rec || !rec.nextDue) return true; // 未学習は常に対象
    return new Date(rec.nextDue) <= new Date();
  }

  /** 正答率が低い、またはボックスが低い単語を「苦手」とみなす */
  function isWeak(wordId) {
    const rec = state.records[wordId];
    if (!rec) return false;
    const total = rec.correct + rec.wrong;
    if (total === 0) return false;
    return rec.wrong > 0 && (rec.correct / total < 0.7 || rec.box <= 1);
  }

  function isMastered(wordId) {
    const rec = state.records[wordId];
    return !!rec && rec.box >= MAX_BOX;
  }

  function getSettings() {
    return { ...state.settings };
  }

  function updateSettings(patch) {
    state.settings = { ...state.settings, ...patch };
    save();
  }

  function incrementSessions() {
    state.stats.sessions += 1;
    save();
  }

  function getStats() {
    return { ...state.stats };
  }

  function getHistory(days = 14) {
    const result = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = todayKey(d);
      const found = state.history.find((h) => h.date === key);
      result.push(found || { date: key, answered: 0, correct: 0 });
    }
    return result;
  }

  /** 学習した日（1問以上解答した日）の一覧 */
  function getStudiedDates() {
    return new Set(state.history.filter((h) => h.answered > 0).map((h) => h.date));
  }

  /** 指定した日の学習量。学習していなければ null */
  function getDay(dateKey) {
    return state.history.find((h) => h.date === dateKey) || null;
  }

  /** 今日の科目別の解答数 */
  function getTodayCounts() {
    const day = getDay(todayKey());
    return {
      word: (day && day.word) || 0,
      math: (day && day.math) || 0,
      reading: (day && day.reading) || 0,
      grammar: (day && day.grammar) || 0,
      // 読み終えた長文の本数。献立はこちらで数える
      passages: (day && day.passages) || 0,
      answered: (day && day.answered) || 0,
      minutes: (day && day.minutes) || 0
    };
  }

  /**
   * 長文を1本読み終えたことを記録する。
   *
   * 設問の数で数えると、設問が2問しかない本文を解いただけで
   * 「今日の分は達成」になってしまう。300語読んで2問では練習にならないので、
   * 献立では「何本読んだか」で数える。設問ごとの記録（day.reading）は
   * 統計用にそのまま残す。
   */
  function completePassage() {
    const day = dayRecord();
    day.passages = (day.passages || 0) + 1;
    save();
    return day.passages;
  }

  /**
   * 座っていた時間を足す。セッションを終えたときと中断したときに呼ぶ。
   *
   * **問題数ではなく分で数える。**「20分だけ座る」を約束にしている以上、
   * 記録も分で見せないと守れたかどうかが分からない。1問あたりの時間は
   * 科目でまるで違う（単語20秒・長文90秒）ので、問題数では代わりにならない。
   */
  function addMinutes(minutes) {
    const n = Math.max(0, Math.round(minutes));
    if (!n) return 0;
    const day = dayRecord();
    day.minutes = (day.minutes || 0) + n;
    save();
    return day.minutes;
  }

  /** 直近 days 日ぶんの学習時間（分）。今日を最後に古い順で返す */
  function getMinutes(days = 7) {
    return getHistory(days).map((h) => ({ date: h.date, minutes: h.minutes || 0 }));
  }

  /** 今日を含む連続学習日数 */
  function getStreak() {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const found = state.history.find((h) => h.date === todayKey(d));
      if (found && found.answered > 0) {
        streak += 1;
      } else if (i > 0) {
        break; // 今日まだ学習していない場合は昨日以前から数える
      }
    }
    return streak;
  }

  /**
   * これまでで一番長かった連続日数。セッション結果の「最長◯日まであと◯日」に使う。
   *
   * **記録の全期間を見る**（getStreak は今日から遡るだけなので、過去の記録は出せない）。
   * 日付の穴で切れるので、history を日付順に並べてから隣り合いを数える。
   */
  function getBestStreak() {
    const days = state.history
      .filter((h) => h.answered > 0)
      .map((h) => h.date)
      .sort();
    let best = 0;
    let run = 0;
    let prev = null;
    for (const key of days) {
      const d = new Date(`${key}T00:00:00`);
      // 前の日のちょうど翌日なら続き、そうでなければ数え直し
      run = prev && (d - prev) === 86400000 ? run + 1 : 1;
      prev = d;
      if (run > best) best = run;
    }
    return best;
  }

  function reset() {
    state = structuredCloneSafe(DEFAULT_STATE);
    save();
  }

  /** 自動バックアップ（最大1日前の状態）に戻す。誤リセット等からの復旧用 */
  function restoreBackup() {
    const backup = tryParse(localStorage.getItem(BACKUP_KEY));
    if (!backup) return false;
    state = backup;
    localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  }

  /** バックアップが存在するか（復旧ボタンの表示判定用） */
  function hasBackup() {
    return !!tryParse(localStorage.getItem(BACKUP_KEY));
  }

  function exportJSON() {
    return JSON.stringify(state, null, 2);
  }

  function importJSON(text) {
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== 'object' || !parsed.records) {
      throw new Error('形式が正しくありません');
    }
    // 外から持ち込まれるファイルは信用しない。項目ごとに型を強制し、
    // 想定外の文字列が画面に HTML として挿入される（XSS）のを防ぐ
    state = sanitizeImported(parsed);
    save();
  }

  /** 取り込んだデータを想定の型に矯正する。数値でないものは0、余計な項目は捨てる */
  function sanitizeImported(parsed) {
    const num = (v) => (typeof v === 'number' && isFinite(v) ? v : 0);
    const iso = (v) => (typeof v === 'string' && !isNaN(Date.parse(v)) ? v : null);

    const records = {};
    for (const [id, r] of Object.entries(parsed.records || {})) {
      if (!r || typeof r !== 'object') continue;
      records[id] = {
        box: Math.min(Math.max(Math.round(num(r.box)), 0), MAX_BOX),
        correct: num(r.correct),
        wrong: num(r.wrong),
        lastStudied: iso(r.lastStudied),
        nextDue: iso(r.nextDue),
        starred: !!r.starred,
        learned: !!r.learned
      };
    }

    const history = (Array.isArray(parsed.history) ? parsed.history : [])
      .filter((h) => h && typeof h === 'object' && /^\d{4}-\d{2}-\d{2}$/.test(h.date))
      .map((h) => ({
        date: h.date,
        answered: num(h.answered),
        correct: num(h.correct),
        word: num(h.word),
        math: num(h.math),
        reading: num(h.reading),
        grammar: num(h.grammar),
        passages: num(h.passages),
        minutes: num(h.minutes)
      }));

    // settings は既知の項目だけ受け取り、型が合わないものは初期値のままにする
    const s = parsed.settings || {};
    const settings = { ...DEFAULT_STATE.settings };
    for (const key of Object.keys(DEFAULT_STATE.settings)) {
      if (typeof s[key] === typeof DEFAULT_STATE.settings[key]) settings[key] = s[key];
    }
    // judged（レベル判定の結果）は出題範囲の絞り込みに使うので、
    // 知っている科目の整数だけを受け取る。typeof は null も 'object' なので上の輪では弾けない
    settings.judged = null;
    if (s.judged && typeof s.judged === 'object' && !Array.isArray(s.judged)) {
      const j = {};
      for (const k of ['word', 'reading', 'grammar', 'math']) {
        const v = Math.round(num(s.judged[k]));
        if (v >= 1 && v <= 5) j[k] = v;
      }
      if (Object.keys(j).length) settings.judged = { ...j, at: iso(s.judged.at) };
    }

    // やりかけのセッションは**受け取らない。**別の端末で書き出したファイルの途中経過を
    // 復元しても、そのとき出ていた問題は手元に無い。null にして「やりかけ無し」から始める。
    // judged と同じく typeof null === 'object' なので上の輪では弾けない
    settings.session = null;

    // 出題の重心は知っている値だけ
    settings.focus = ['judged', 'top', 'weak'].includes(s.focus) ? s.focus : 'judged';

    // セッションの履歴は記録タブにそのまま出すので、数値と既知の科目だけに矯正する
    settings.sessionHistory = (Array.isArray(s.sessionHistory) ? s.sessionHistory : [])
      .filter((h) => h && typeof h === 'object')
      .slice(0, 20)
      .map((h) => {
        const perKind = {};
        for (const k of ['word', 'reading', 'grammar', 'math']) {
          const v = h.perKind && h.perKind[k];
          if (v && typeof v === 'object') {
            perKind[k] = { correct: num(v.correct), answered: num(v.answered), ms: num(v.ms) };
          }
        }
        return {
          date: iso(h.date) || new Date().toISOString(),
          minutes: num(h.minutes),
          answered: num(h.answered),
          correct: num(h.correct),
          perKind
        };
      });

    // mockHistory（模擬試験の履歴）は画面にそのまま出すので、数値と既知の値に矯正する
    if (Array.isArray(s.mockHistory)) {
      settings.mockHistory = s.mockHistory
        .filter((h) => h && typeof h === 'object')
        .slice(0, 5)
        .map((h) => ({
          date: iso(h.date) || new Date().toISOString(),
          mode: h.mode === 'adaptive' ? 'adaptive' : 'exam',
          correct: num(h.correct),
          total: num(h.total),
          rate: num(h.rate),
          minutes: num(h.minutes)
        }));
    }

    return {
      records,
      stats: {
        totalAnswers: num(parsed.stats && parsed.stats.totalAnswers),
        totalCorrect: num(parsed.stats && parsed.stats.totalCorrect),
        sessions: num(parsed.stats && parsed.stats.sessions)
      },
      history,
      settings
    };
  }

  return {
    MAX_BOX,
    INTERVALS,
    getRecord,
    recordAnswer,
    setLearned,
    toggleLearned,
    isLearned,
    toggleStar,
    isDue,
    isWeak,
    isMastered,
    getSettings,
    updateSettings,
    incrementSessions,
    getStats,
    getHistory,
    getStudiedDates,
    getDay,
    getTodayCounts,
    completePassage,
    addMinutes,
    getMinutes,
    kindOf,
    todayKey,
    getStreak,
    getBestStreak,
    reset,
    restoreBackup,
    hasBackup,
    exportJSON,
    importJSON
  };
})();

// ブラウザが容量逼迫時などに localStorage を自動削除しないよう、永続化を要求しておく。
// 対応していないブラウザ（file:// など）では黙って無視される。
if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
  navigator.storage.persist().catch(() => {});
}
