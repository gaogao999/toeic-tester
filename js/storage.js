/**
 * 学習履歴の保存と間隔反復（Leitnerシステム）の管理。
 * データは localStorage に保存されるため、同じブラウザなら次回も引き継がれる。
 */
const Storage = (() => {
  const KEY = 'eis-app:v1'; // 単語データを入れ替えたため、旧バージョンの履歴は引き継がない

  // Leitner の各ボックスに対応する復習間隔（日数）
  const INTERVALS = [0, 1, 3, 7, 14, 30];
  const MAX_BOX = INTERVALS.length - 1;

  const DEFAULT_STATE = {
    records: {}, // { [wordId]: { box, correct, wrong, lastStudied, nextDue, starred, learned } }
    stats: { totalAnswers: 0, totalCorrect: 0, sessions: 0 },
    // [{ date, answered, correct, word, math, reading }] — 後ろ3つは科目別の解答数
    history: [],
    settings: {
      level: 'all',
      category: 'all',
      scope: 'all',
      quizLength: 10,
      tempoTime: 5, // サクサク4択の1問あたりの制限時間（秒）。0 なら無制限
      autoSpeak: false,
      mathLevel: 'all',
      mathCategory: 'all',
      mathScope: 'all',
      mathLength: 10
    }
  };

  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return structuredCloneSafe(DEFAULT_STATE);
      const parsed = JSON.parse(raw);
      return {
        records: parsed.records || {},
        stats: { ...DEFAULT_STATE.stats, ...(parsed.stats || {}) },
        history: parsed.history || [],
        settings: { ...DEFAULT_STATE.settings, ...(parsed.settings || {}) }
      };
    } catch (e) {
      console.warn('保存データを読み込めませんでした。初期化します。', e);
      return structuredCloneSafe(DEFAULT_STATE);
    }
  }

  function structuredCloneSafe(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function save() {
    try {
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
   */
  function kindOf(id) {
    const s = String(id);
    if (s.startsWith('m')) return 'math';
    if (s.startsWith('r')) return 'reading';
    return 'word';
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

    const key = todayKey();
    let day = state.history.find((h) => h.date === key);
    if (!day) {
      day = { date: key, answered: 0, correct: 0, word: 0, math: 0, reading: 0 };
      state.history.push(day);
    }
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
      answered: (day && day.answered) || 0
    };
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

  function reset() {
    state = structuredCloneSafe(DEFAULT_STATE);
    save();
  }

  function exportJSON() {
    return JSON.stringify(state, null, 2);
  }

  function importJSON(text) {
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== 'object' || !parsed.records) {
      throw new Error('形式が正しくありません');
    }
    state = {
      records: parsed.records || {},
      stats: { ...DEFAULT_STATE.stats, ...(parsed.stats || {}) },
      history: parsed.history || [],
      settings: { ...DEFAULT_STATE.settings, ...(parsed.settings || {}) }
    };
    save();
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
    kindOf,
    todayKey,
    getStreak,
    reset,
    exportJSON,
    importJSON
  };
})();
