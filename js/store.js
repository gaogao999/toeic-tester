/**
 * 記録 — 語ごとの覚え具合と、毎日のプリント。
 *
 * **記録はこのブラウザの中（localStorage）に残る。**消えたら戻らないので、
 *   - 1日1回、その日はじめて書き込む前の状態を自動でとっておく（BACKUP_KEY）
 *   - 読めないデータが出てきたら、捨てずに BROKEN_KEY へ退避する
 *   - 設定画面から JSON で書き出せる
 *
 * **保存キーは変えない。**変えると花さんの記録が全部読めなくなる。
 * 形を変えたくなったら、キーはそのままで load() の中で直す。
 *
 * 前のアプリの保存キー（eis-app:v1 / eis-print:v1）には触らない。
 * 同じドメイン（gaogao999.github.io）の別アプリ（えいごペット等）の記録にも触らない。
 */
const Store = (() => {
  const KEY = 'hana-eiken:v1';
  const BACKUP_KEY = 'hana-eiken:v1:backup';
  const BACKUP_DATE_KEY = 'hana-eiken:v1:backup-date';
  const BROKEN_KEY = 'hana-eiken:v1:broken';

  /**
   * 次に出すまでの日数。正解するたびに1段上がる。**まちがえたら0段に戻す。**
   *
   * えいごペットと同じ階段にしてある（1→3→7→14→30→60日）。
   * えいごペットの README に根拠の研究が書いてある（Cepeda 2008 など）。
   * 0段は「まだ覚えていない」で、次の日のプリントにまた出る。
   */
  const INTERVALS = [1, 1, 3, 7, 14, 30, 60];
  const MAX_LV = INTERVALS.length - 1;

  /** 「覚えた」とみなす段。間隔が7日以上になったら（＝3回続けて正解） */
  const LEARNED_LV = 3;

  /** 何枚ぶんのプリントを手元に残すか。記録の画面で振り返るのに使う */
  const KEEP_SHEETS = 400;

  const DEFAULTS = {
    v: 1,
    // { [小文字の語]: { lv, due, ok, ng, first, last } }
    //   lv    いまの段（0〜6）
    //   due   次に出す日（YYYY-MM-DD）
    //   ok/ng 正解・不正解の回数
    //   first はじめて記録した日 / last 最後に記録した日
    words: {},
    // [{ id, date, words: [...], results: { 語: true/false } | null, recordedAt }]
    //   date は**覚えた日**（印刷した日）。記録を夜中に付けても、その日の勉強として数える
    sheets: [],
    settings: {
      perDay: 20,          // 1枚の語数
      range: 'all',        // 'all'（2級→準1級）/ 'g2' / 'jun1'
      parts: { study: true, ja2en: true, en2ja: false, write: false, answer: true },
      voiceName: '',
      rate: 0.85
    }
  };

  // ---------- 日付 ----------

  function dateKey(d = new Date()) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function addDays(key, n) {
    const [y, m, d] = key.split('-').map(Number);
    return dateKey(new Date(y, m - 1, d + n));
  }

  // ---------- 読み書き ----------

  const clone = (o) => JSON.parse(JSON.stringify(o));

  /** 生の文字列を state の形に整える。壊れていたら null（例外は投げない） */
  function tryParse(raw) {
    if (!raw) return null;
    try {
      const p = JSON.parse(raw);
      if (!p || typeof p !== 'object' || typeof p.words !== 'object' || !Array.isArray(p.sheets)) return null;
      return {
        v: 1,
        words: p.words || {},
        sheets: p.sheets || [],
        settings: {
          ...clone(DEFAULTS.settings),
          ...(p.settings || {}),
          parts: { ...DEFAULTS.settings.parts, ...((p.settings && p.settings.parts) || {}) }
        }
      };
    } catch (e) {
      return null;
    }
  }

  function load() {
    let raw = null;
    try {
      raw = localStorage.getItem(KEY);
    } catch (e) {
      return clone(DEFAULTS);
    }
    const main = tryParse(raw);
    if (main) return main;
    if (raw) {
      // 壊れたデータでも捨てずに退避しておく。初期化で上書きしてしまうと二度と戻せない
      try { localStorage.setItem(BROKEN_KEY, raw); } catch (e) { /* 退避すら失敗したら諦める */ }
      const backup = tryParse(localStorage.getItem(BACKUP_KEY));
      if (backup) {
        console.warn('保存データが壊れていたため、自動バックアップから戻しました。');
        return backup;
      }
    }
    return clone(DEFAULTS);
  }

  let state = load();

  function save() {
    try {
      // その日最初の保存の前に、前日までの状態をとっておく。誤操作でも1日前までは戻せる
      const today = dateKey();
      if (localStorage.getItem(BACKUP_DATE_KEY) !== today) {
        const prev = localStorage.getItem(KEY);
        if (prev) {
          localStorage.setItem(BACKUP_KEY, prev);
          localStorage.setItem(BACKUP_DATE_KEY, today);
        }
      }
      localStorage.setItem(KEY, JSON.stringify(state));
      return true;
    } catch (e) {
      console.warn('保存に失敗しました。', e);
      return false;
    }
  }

  // ---------- 語ごとの記録 ----------

  const keyOf = (word) => String(word).trim().toLowerCase();

  function rec(word) {
    return state.words[keyOf(word)] || null;
  }

  /** 段階: 'new'（まだ）/ 'learning'（覚えかけ）/ 'learned'（覚えた） */
  function stageOf(word) {
    const r = rec(word);
    if (!r || r.ok + r.ng === 0) return 'new';
    if (r.lv >= LEARNED_LV) return 'learned';
    return r.ok > 0 ? 'learning' : 'missed';
  }

  /** 1語ぶんの正誤を反映する。date は**勉強した日**（プリントの日付） */
  function apply(word, ok, date) {
    const k = keyOf(word);
    const r = state.words[k] || { lv: 0, due: date, ok: 0, ng: 0, first: date, last: date };
    if (ok) {
      r.ok += 1;
      r.lv = Math.min(r.lv + 1, MAX_LV);
    } else {
      r.ng += 1;
      r.lv = 0;
    }
    r.due = addDays(date, INTERVALS[r.lv]);
    r.last = date;
    state.words[k] = r;
  }

  // ---------- プリント（今日の20語） ----------

  function shuffle(a) {
    const b = a.slice();
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [b[i], b[j]] = [b[j], b[i]];
    }
    return b;
  }

  function pendingSheet() {
    return state.sheets.find((s) => !s.results) || null;
  }

  function sheetsOn(date) {
    return state.sheets.filter((s) => s.date === date);
  }

  /**
   * 今日のプリントに載せる語を選ぶ。
   *
   *   1. 復習の期限がきた語（期限がふるい順）を**最大で6割**
   *   2. のこりを新しい語。**ワークシートで出会った語**を先に、そのあと単語帳の順
   *   3. 新しい語が尽きたら、期限のきた語でうめる
   *
   * 復習を6割で止めるのは、休んだあとに復習だけで埋まって
   * 新しい語が1つも入らない日が続くと、進んでいる感じがしなくなるから。
   * （えいごペットは5問中3問まで。同じ割合）
   */
  function pickWords(pool, worksheetKeys, perDay, today) {
    const seen = (w) => {
      const r = rec(w.word);
      return r && r.ok + r.ng > 0;
    };
    const due = pool
      .filter((w) => seen(w) && rec(w.word).due <= today)
      .sort((a, b) => (rec(a.word).due < rec(b.word).due ? -1 : rec(a.word).due > rec(b.word).due ? 1 : 0));

    const maxReview = Math.round(perDay * 0.6);
    const review = due.slice(0, maxReview);

    const fresh = pool.filter((w) => !seen(w));
    const freshFirst = fresh
      .filter((w) => worksheetKeys.has(keyOf(w.word)))
      .concat(fresh.filter((w) => !worksheetKeys.has(keyOf(w.word))));

    const picked = review.concat(freshFirst.slice(0, perDay - review.length));
    // 新しい語が足りなければ、残りの期限切れで埋める
    if (picked.length < perDay) {
      picked.push(...due.slice(review.length, review.length + (perDay - picked.length)));
    }
    return picked.map((w) => w.word);
  }

  /** 今日のプリントを作る。**記録していないプリントがあるうちは作らない**（null を返す） */
  function makeSheet(pool, worksheetKeys) {
    if (pendingSheet()) return null;
    const today = dateKey();
    // **並びは作るときに1回だけ混ぜる。**復習の語と新しい語が固まっていると、
    // テストで「前半は知っている語」と分かってしまう。混ぜた並びは保存するので、
    // どの紙も答え合わせの画面も**同じ番号**になる
    const words = shuffle(pickWords(pool, worksheetKeys, state.settings.perDay, today));
    if (!words.length) return null;
    const n = sheetsOn(today).length + 1;
    const sheet = { id: `${today}-${n}`, date: today, words, results: null, recordedAt: null };
    state.sheets.push(sheet);
    if (state.sheets.length > KEEP_SHEETS) state.sheets = state.sheets.slice(-KEEP_SHEETS);
    save();
    return sheet;
  }

  /** 記録していないプリントを捨てる（作り直したいとき） */
  function discardPending() {
    const p = pendingSheet();
    if (!p) return false;
    state.sheets = state.sheets.filter((s) => s !== p);
    save();
    return true;
  }

  /**
   * プリントの答え合わせを記録する。results は { 語: true/false }。
   * **語の日付はプリントの日**（夜中を過ぎてから付けても、その日の勉強）
   */
  function recordSheet(id, results) {
    const sheet = state.sheets.find((s) => s.id === id);
    if (!sheet || sheet.results) return false;
    for (const w of sheet.words) {
      if (typeof results[w] === 'boolean') apply(w, results[w], sheet.date);
    }
    sheet.results = { ...results };
    sheet.recordedAt = new Date().toISOString();
    return save();
  }

  // ---------- 集計 ----------

  /** 記録を付けた日（＝プリントを1枚以上記録した日）の集合 */
  function studiedDates() {
    return new Set(state.sheets.filter((s) => s.results).map((s) => s.date));
  }

  /** 今日を含む連続日数。今日まだなら昨日から数える（今日の分で途切れたことにしない） */
  function streak() {
    const days = studiedDates();
    let n = 0;
    let d = dateKey();
    if (!days.has(d)) d = addDays(d, -1);
    while (days.has(d)) {
      n += 1;
      d = addDays(d, -1);
    }
    return n;
  }

  /** ある日の記録: 何語・何問正解 */
  function dayTally(date) {
    let ok = 0;
    let total = 0;
    for (const s of state.sheets) {
      if (s.date !== date || !s.results) continue;
      for (const v of Object.values(s.results)) {
        total += 1;
        if (v) ok += 1;
      }
    }
    return { ok, total };
  }

  /** これから n 日のうちに復習の期限がくる語の数 */
  function dueWithin(n) {
    const until = addDays(dateKey(), n);
    return Object.values(state.words).filter((r) => r.ok + r.ng > 0 && r.due <= until).length;
  }

  // ---------- 設定 ----------

  function getSettings() {
    return clone(state.settings);
  }

  function updateSettings(patch) {
    state.settings = { ...state.settings, ...patch };
    save();
  }

  // ---------- 書き出し・読み込み ----------

  function exportJSON() {
    return JSON.stringify({ app: 'hana-eiken', exportedAt: new Date().toISOString(), ...state }, null, 2);
  }

  /**
   * 書き出したファイルを読み込む。**外から来たものは信用しない**ので、項目ごとに型を直す
   * （想定外の文字列が画面に HTML として入るのを防ぐ）
   */
  function importJSON(text) {
    const p = JSON.parse(text);
    if (!p || typeof p !== 'object' || typeof p.words !== 'object' || !Array.isArray(p.sheets)) {
      throw new Error('このアプリの記録ではありません');
    }
    const num = (v) => (typeof v === 'number' && isFinite(v) ? v : 0);
    const day = (v) => (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null);

    const words = {};
    for (const [k, r] of Object.entries(p.words)) {
      if (!r || typeof r !== 'object') continue;
      const d = day(r.due);
      if (!d) continue;
      words[String(k).toLowerCase()] = {
        lv: Math.min(Math.max(Math.round(num(r.lv)), 0), MAX_LV),
        due: d,
        ok: num(r.ok),
        ng: num(r.ng),
        first: day(r.first) || d,
        last: day(r.last) || d
      };
    }

    const sheets = p.sheets
      .filter((s) => s && typeof s === 'object' && day(s.date) && Array.isArray(s.words))
      .slice(-KEEP_SHEETS)
      .map((s) => {
        const results = s.results && typeof s.results === 'object' ? {} : null;
        if (results) for (const [w, v] of Object.entries(s.results)) results[String(w)] = !!v;
        return {
          id: String(s.id || s.date),
          date: s.date,
          words: s.words.map(String),
          results,
          recordedAt: typeof s.recordedAt === 'string' ? s.recordedAt : null
        };
      });

    const ps = p.settings && typeof p.settings === 'object' ? p.settings : {};
    const settings = clone(DEFAULTS.settings);
    if ([10, 20, 30, 40].includes(ps.perDay)) settings.perDay = ps.perDay;
    if (['all', 'g2', 'jun1'].includes(ps.range)) settings.range = ps.range;
    if (typeof ps.voiceName === 'string') settings.voiceName = ps.voiceName;
    if (typeof ps.rate === 'number' && ps.rate >= 0.5 && ps.rate <= 1.2) settings.rate = ps.rate;
    if (ps.parts && typeof ps.parts === 'object') {
      for (const k of Object.keys(settings.parts)) {
        if (typeof ps.parts[k] === 'boolean') settings.parts[k] = ps.parts[k];
      }
    }

    state = { v: 1, words, sheets, settings };
    save();
  }

  function restoreBackup() {
    const b = tryParse(localStorage.getItem(BACKUP_KEY));
    if (!b) return false;
    state = b;
    localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  }

  function hasBackup() {
    try {
      return !!tryParse(localStorage.getItem(BACKUP_KEY));
    } catch (e) {
      return false;
    }
  }

  function reset() {
    state = clone(DEFAULTS);
    save();
  }

  return {
    INTERVALS,
    LEARNED_LV,
    dateKey,
    addDays,
    keyOf,
    rec,
    stageOf,
    pendingSheet,
    sheetsOn,
    makeSheet,
    // 作る前の見込み（復習が何語・新しい語が何語になるか）をホームに出すのに使う
    plan: (pool, worksheetKeys) => pickWords(pool, worksheetKeys, state.settings.perDay, dateKey()),
    discardPending,
    recordSheet,
    studiedDates,
    streak,
    dayTally,
    dueWithin,
    getSettings,
    updateSettings,
    exportJSON,
    importJSON,
    restoreBackup,
    hasBackup,
    reset,
    allSheets: () => state.sheets.slice()
  };
})();

// ブラウザが容量逼迫時に localStorage を勝手に消さないよう、永続化を頼んでおく。
// 対応していないブラウザ（file:// など）では黙って無視される
if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
  navigator.storage.persist().catch(() => {});
}
