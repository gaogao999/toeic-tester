/**
 * 英単語プリント — 紙を組んで印刷するだけ。
 *
 * **学習記録は持たない。**覚えたかどうかは紙の上の話で、アプリが持つ理由がない。
 * 画面に出ているものが、そのまま印刷される（プレビュー用に別の組み方をしない）。
 */
(() => {
  'use strict';

  const $ = (sel) => document.querySelector(sel);

  /**
   * 画面の左上に出すリビジョン。
   * ビルド工程が無いので実行時に git を読めない。コミットの直前に
   * tools/stamp-version.mjs で書き換える。
   */
  const APP_VERSION = '2026-08-24 (10400a2)';

  const LEVEL_LABELS = { 2: '基礎 A2', 3: '標準 B1', 4: '応用 B2' };

  /**
   * 1枚に入る行数。**用紙ごとに決め打ちにしてある。**
   *
   * ブラウザの改ページ任せにすると、画面のプレビューと刷り上がりがずれる。
   * こちらで行を枚数ぶんに切り分けておけば、**画面の1枚＝紙の1枚**になる。
   * 数は**目分量ではなく実測**で決めてある。A4（1122px）から上下の余白と
   * 見出しを引くと本文に使えるのが 938px で、それを1行の高さで割った数。
   * 最初は目分量で置いていたら、画面2枚が紙3ページに割れた。
   *
   * 例文つきの一覧だけ、**例文の無い語がある**ぶん余る。
   * 全部に例文が付いた最悪の場合で収まる数にしてある（余るほうは害がない）。
   *
   * **行の高さを CSS で変えたら、ここも対で直すこと。**
   * `node tools/audit-print.mjs` が、画面の枚数と刷り上がりのページ数が
   * 合っているかを見ている。
   */
  const ROWS_PER_PAGE = {
    list: 23,
    listExample: 14,
    ja2en: 22,
    en2ja: 22,
    write: 18,
    answer: 30
  };

  const SHEET_TITLES = {
    list: '英単語 おぼえる用',
    ja2en: '英単語テスト　意味 → 英語',
    en2ja: '英単語テスト　英語 → 意味',
    write: '英単語 書いて覚える'
  };

  const KEY = 'eis-print:v1';

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);
  }

  // ============================================================
  // 設定の読み書き
  // ============================================================
  //
  // **古いアプリの保存キー（eis-app:v1）には触らない。**
  // あちらには学習記録が入ったままで、アプリを戻せば読み出せる。
  // こちらは「前に選んだ範囲」を覚えておくだけなので、別のキーを使う。

  const DEFAULTS = {
    sheet: 'list',
    level: 'all',
    category: 'all',
    order: 'id',
    start: 1,
    count: 40,
    example: false,
    answer: true,
    phonetic: true
  };

  function loadSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      if (!saved || typeof saved !== 'object') return { ...DEFAULTS };
      const out = { ...DEFAULTS };
      for (const k of Object.keys(DEFAULTS)) {
        if (typeof saved[k] === typeof DEFAULTS[k]) out[k] = saved[k];
      }
      return out;
    } catch (e) {
      return { ...DEFAULTS };
    }
  }

  function saveSettings(s) {
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch (e) {
      /* 保存できなくても紙は作れる。黙って続ける */
    }
  }

  let settings = loadSettings();

  // ランダムの並びを、設定をいじるまで固定しておくためのたね。
  // 毎回組み直すと、1枚目を刷ってから2枚目を刷るあいだに中身が変わる
  let shuffleSeed = Date.now();

  // ============================================================
  // 語を選ぶ
  // ============================================================

  /** たねから決まる擬似乱数。同じたねなら同じ並びになる */
  function seeded(seed) {
    let s = seed >>> 0;
    return () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  function shuffleWith(array, seed) {
    const rand = seeded(seed);
    const a = array.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /** レベルと分野で絞り、並べ替えたもの。範囲（何語目から）はこの中での位置 */
  function pool() {
    let words = WORD_DATA.filter((w) => {
      if (settings.level !== 'all' && String(w.level) !== String(settings.level)) return false;
      if (settings.category !== 'all' && w.category !== settings.category) return false;
      return true;
    });

    if (settings.order === 'alpha') {
      words = words.slice().sort((a, b) => a.word.localeCompare(b.word));
    } else if (settings.order === 'random') {
      words = shuffleWith(words, shuffleSeed);
    }
    return words;
  }

  /** 実際に紙に載る語 */
  function selected() {
    const all = pool();
    const start = Math.min(Math.max(1, settings.start), Math.max(1, all.length));
    return { all, start, words: all.slice(start - 1, start - 1 + settings.count) };
  }

  // ============================================================
  // 紙を組む
  // ============================================================

  /** 1枚ぶんの枠。中身（行）は用紙ごとに作る */
  function sheetHtml(inner, meta) {
    return `<section class="sheet">
        <header class="sheet-head">
          <div class="sheet-title">
            <b>${escapeHtml(meta.title)}</b>
            <span class="sheet-range">${escapeHtml(meta.range)}</span>
          </div>
          <div class="sheet-meta">
            <span class="name-field">名前 <i></i></span>
            <span class="page-no">${meta.page} / ${meta.pages}</span>
          </div>
        </header>
        ${inner}
      </section>`;
  }

  /** 行を1枚ぶんずつに切り分ける。**画面の1枚＝紙の1枚**にするため */
  function paginate(rows, perPage) {
    const pages = [];
    for (let i = 0; i < rows.length; i += perPage) pages.push(rows.slice(i, i + perPage));
    return pages.length ? pages : [[]];
  }

  const phoneticCell = (w) =>
    settings.phonetic ? `<td class="c-ph">${escapeHtml(w.phonetic || '')}</td>` : '';
  const phoneticHead = () => (settings.phonetic ? '<th class="c-ph">発音</th>' : '');

  /** おぼえる用の一覧。覚えたか自分で印を付けられるよう、チェック欄を3つ置く */
  function buildList(words, meta) {
    const withExample = settings.example;
    const perPage = withExample ? ROWS_PER_PAGE.listExample : ROWS_PER_PAGE.list;

    const rows = words.map((w, i) => {
      const example = withExample && w.example
        ? `<tr class="row-example"><td></td><td colspan="${settings.phonetic ? 4 : 3}"
             class="c-example">${escapeHtml(w.example)}</td></tr>`
        : '';
      return `<tr>
          <td class="c-no">${meta.start + i}</td>
          <td class="c-word">${escapeHtml(w.word)}</td>
          ${phoneticCell(w)}
          <td class="c-pos">${escapeHtml(w.pos || '')}</td>
          <td class="c-meaning">${escapeHtml(w.meaning)}</td>
          <td class="c-check"><i></i><i></i><i></i></td>
        </tr>${example}`;
    });

    return paginate(rows, perPage).map((page, i) =>
      sheetHtml(
        `<table class="sheet-table">
          <thead><tr>
            <th class="c-no">#</th><th class="c-word">単語</th>${phoneticHead()}
            <th class="c-pos">品詞</th><th class="c-meaning">意味</th>
            <th class="c-check">チェック</th>
          </tr></thead>
          <tbody>${page.join('')}</tbody>
        </table>`,
        { ...meta, page: i + 1, pages: Math.max(1, Math.ceil(rows.length / perPage)) }
      )
    );
  }

  /**
   * テストの紙。**問題だけを出し、答えは書かない。**
   * 解答は別の紙にして最後に付ける（折って隠せるように）
   */
  function buildQuiz(words, meta, dir) {
    const perPage = ROWS_PER_PAGE[dir];
    const askJa = dir === 'ja2en';

    const rows = words.map((w, i) => `<tr>
        <td class="c-no">${meta.start + i}</td>
        <td class="${askJa ? 'c-meaning' : 'c-word'}">${escapeHtml(askJa ? w.meaning : w.word)}</td>
        ${askJa || !settings.phonetic ? '' : `<td class="c-ph">${escapeHtml(w.phonetic || '')}</td>`}
        <td class="c-blank"></td>
      </tr>`);

    const cols = askJa ? 3 : settings.phonetic ? 4 : 3;
    return paginate(rows, perPage).map((page, i) =>
      sheetHtml(
        `<table class="sheet-table sheet-quiz">
          <thead><tr>
            <th class="c-no">#</th>
            <th class="${askJa ? 'c-meaning' : 'c-word'}">${askJa ? '意味' : '単語'}</th>
            ${askJa || !settings.phonetic ? '' : '<th class="c-ph">発音</th>'}
            <th class="c-blank">${askJa ? '英単語を書く' : '意味を書く'}</th>
          </tr></thead>
          <tbody>${page.join('')}</tbody>
        </table>
        <p class="sheet-foot">${cols ? '' : ''}</p>`,
        { ...meta, page: i + 1, pages: Math.max(1, Math.ceil(rows.length / perPage)) }
      )
    );
  }

  /** 書いて覚える。薄い字をなぞってから、自分で2回書く */
  function buildWrite(words, meta) {
    const perPage = ROWS_PER_PAGE.write;
    const rows = words.map((w, i) => `<tr>
        <td class="c-no">${meta.start + i}</td>
        <td class="c-word">${escapeHtml(w.word)}</td>
        <td class="c-meaning">${escapeHtml(w.meaning)}</td>
        <td class="c-trace">${escapeHtml(w.word)}</td>
        <td class="c-blank"></td>
      </tr>`);

    return paginate(rows, perPage).map((page, i) =>
      sheetHtml(
        `<table class="sheet-table sheet-write">
          <thead><tr>
            <th class="c-no">#</th><th class="c-word">単語</th><th class="c-meaning">意味</th>
            <th class="c-trace">なぞる</th><th class="c-blank">書く</th>
          </tr></thead>
          <tbody>${page.join('')}</tbody>
        </table>`,
        { ...meta, page: i + 1, pages: Math.max(1, Math.ceil(rows.length / perPage)) }
      )
    );
  }

  /** 解答。**詰めて組む**（答え合わせに使うだけなので、書く欄が要らない） */
  function buildAnswer(words, meta) {
    const perPage = ROWS_PER_PAGE.answer;
    const rows = words.map((w, i) => `<tr>
        <td class="c-no">${meta.start + i}</td>
        <td class="c-word">${escapeHtml(w.word)}</td>
        <td class="c-meaning">${escapeHtml(w.meaning)}</td>
      </tr>`);

    return paginate(rows, perPage).map((page, i) =>
      sheetHtml(
        `<table class="sheet-table sheet-answer">
          <thead><tr>
            <th class="c-no">#</th><th class="c-word">単語</th><th class="c-meaning">意味</th>
          </tr></thead>
          <tbody>${page.join('')}</tbody>
        </table>`,
        { ...meta, title: `${meta.title}　解答`, page: i + 1, pages: Math.max(1, Math.ceil(rows.length / perPage)) }
      )
    );
  }

  // ============================================================
  // 描く
  // ============================================================

  function rangeLabel(start, words) {
    const level = settings.level === 'all' ? 'すべてのレベル' : LEVEL_LABELS[settings.level];
    const category = settings.category === 'all' ? '' : ` ・ ${settings.category}`;
    const span = words.length ? `${start}〜${start + words.length - 1}語目` : '該当なし';
    return `${level}${category} ・ ${span}`;
  }

  function render() {
    const { all, start, words } = selected();
    const meta = { title: SHEET_TITLES[settings.sheet], range: rangeLabel(start, words), start };

    let sheets = [];
    if (!words.length) {
      $('#papers').innerHTML =
        '<p class="empty">この範囲に単語がありません。レベル・分野・範囲を変えてください。</p>';
    } else {
      if (settings.sheet === 'list') sheets = buildList(words, meta);
      else if (settings.sheet === 'write') sheets = buildWrite(words, meta);
      else sheets = buildQuiz(words, meta, settings.sheet);

      // 解答はテストのときだけ。一覧と書いて覚えるは答えが紙の上にある
      const quiz = settings.sheet === 'ja2en' || settings.sheet === 'en2ja';
      if (quiz && settings.answer) sheets = sheets.concat(buildAnswer(words, meta));

      $('#papers').innerHTML = sheets.join('');
    }

    $('#range-note').textContent = all.length
      ? `対象 ${all.length.toLocaleString()}語のうち ${start}語目から（例文つきの語は ${
          all.filter((w) => w.example).length.toLocaleString()
        }語）`
      : '対象の単語がありません';
    $('#page-note').textContent = sheets.length ? `全 ${sheets.length} 枚（A4 縦）` : '';
    window.scrollTo(0, 0);
  }

  // ============================================================
  // 画面
  // ============================================================

  function syncVisibility() {
    // 効かない項目を出しておくと、押しても何も起きない欄になる
    $('#opt-example').hidden = settings.sheet !== 'list';
    $('#opt-answer').hidden = !(settings.sheet === 'ja2en' || settings.sheet === 'en2ja');
    $('#do-shuffle').hidden = settings.order !== 'random';
  }

  function syncInputs() {
    $('#f-sheet').value = settings.sheet;
    $('#f-level').value = settings.level;
    $('#f-category').value = settings.category;
    $('#f-order').value = settings.order;
    $('#f-start').value = settings.start;
    $('#f-count').value = String(settings.count);
    $('#f-example').checked = settings.example;
    $('#f-answer').checked = settings.answer;
    $('#f-phonetic').checked = settings.phonetic;
    syncVisibility();
  }

  function update(patch) {
    settings = { ...settings, ...patch };
    // 絞り込みを変えたら、前の範囲が在庫を飛び越していることがある
    const total = pool().length;
    if (settings.start > total) settings.start = 1;
    if (settings.start < 1) settings.start = 1;
    saveSettings(settings);
    syncInputs();
    render();
  }

  function init() {
    $('#app-version').textContent = APP_VERSION;

    $('#f-category').innerHTML =
      '<option value="all">すべて</option>' +
      CATEGORIES.map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');

    syncInputs();
    render();

    $('#f-sheet').addEventListener('change', (e) => update({ sheet: e.target.value }));
    $('#f-level').addEventListener('change', (e) => update({ level: e.target.value, start: 1 }));
    $('#f-category').addEventListener('change', (e) => update({ category: e.target.value, start: 1 }));
    $('#f-order').addEventListener('change', (e) => update({ order: e.target.value, start: 1 }));
    $('#f-count').addEventListener('change', (e) => update({ count: Number(e.target.value) }));
    $('#f-start').addEventListener('change', (e) => update({ start: Number(e.target.value) || 1 }));
    $('#f-example').addEventListener('change', (e) => update({ example: e.target.checked }));
    $('#f-answer').addEventListener('change', (e) => update({ answer: e.target.checked }));
    $('#f-phonetic').addEventListener('change', (e) => update({ phonetic: e.target.checked }));

    // 「次の分」で刷り進められるようにする。これが毎日の使い方になる
    $('#f-next').addEventListener('click', () => {
      const total = pool().length;
      const next = settings.start + settings.count;
      update({ start: next > total ? total : next });
    });
    $('#f-prev').addEventListener('click', () =>
      update({ start: Math.max(1, settings.start - settings.count) })
    );

    $('#do-shuffle').addEventListener('click', () => {
      shuffleSeed = Date.now();
      render();
    });
    $('#do-print').addEventListener('click', () => window.print());
  }

  document.addEventListener('DOMContentLoaded', init);
})();
