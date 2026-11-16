/**
 * 花の英単語 — 紙で覚えて、アプリは記録と進捗。
 *
 *   朝  「今日の20語」を作って印刷する（復習の期限がきた語＋新しい語）
 *   昼  紙で覚える
 *   夜  紙と同じ番号で、まちがえた語だけ押して記録する → 次の日の20語が決まる
 *
 * **紙からアプリへの戻し方は「まちがえた語だけ押す」に絞ってある。**
 * 20語ぜんぶに ○× を付けさせると3日で続かなくなる。ふつうは2〜5回押せば終わる。
 */
(() => {
  'use strict';

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  /**
   * 設定画面の下に出すリビジョン。ビルド工程が無いので実行時に git を読めない。
   * コミットの直前に tools/stamp-version.mjs で書き換える。
   */
  const APP_VERSION = '2026-11-15 (9670ce3)';

  const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);
  }

  let toastTimer = null;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 2200);
  }

  // ============================================================
  // 単語
  // ============================================================

  const GRADE_NAME = { g2: '2級', jun1: '準1級', ws: 'ワークシート' };

  /**
   * 使う語のぜんぶ。**単語帳（js/data.js）に、ワークシートで出た語を足したもの。**
   * ワークシートの語が単語帳にあれば単語帳の意味を使い、無ければワークシートの意味を使う
   * （単語帳に無い語の級は 'ws'）
   */
  const BY_KEY = new Map();
  for (const w of WORDS) BY_KEY.set(Store.keyOf(w.word), { ...w, ws: false });
  for (const w of WORKSHEET_WORDS) {
    const k = Store.keyOf(w.word);
    const have = BY_KEY.get(k);
    if (have) have.ws = true;
    else BY_KEY.set(k, { word: w.word, meaning: w.meaning, grade: 'ws', ws: true });
  }
  // 例文（js/examples.js）。無い語は ex が null で、紙にも画面にも何も出さない
  for (const [k, w] of BY_KEY) w.ex = EXAMPLES[k] || null;
  const ALL = [...BY_KEY.values()];
  const WS_KEYS = new Set(WORKSHEET_WORDS.map((w) => Store.keyOf(w.word)));

  const lookup = (word) => BY_KEY.get(Store.keyOf(word)) || { word, meaning: '', grade: 'ws' };

  /**
   * プリントに出してよい語。設定の「出す範囲」で決まる。
   * **ワークシートの語は範囲にかかわらず入れる**（文章の中で出会った語なので）
   */
  function pool() {
    const range = Store.getSettings().range;
    const inRange = (w) => w.ws || range === 'all' || w.grade === range;
    // 'all' のときは 2級 → 準1級 の順。js/data.js の並びがすでにそうなっている
    return ALL.filter(inRange);
  }

  // ============================================================
  // 画面の切り替え
  // ============================================================

  // 印刷する紙。今日のプリントか、記録の画面で選んだ過去のプリント
  let printTarget = null;
  // 答え合わせ中の ○×（まだ記録していないもの）
  let checking = {};

  function showView(name) {
    $$('.view').forEach((v) => v.classList.toggle('is-active', v.id === `view-${name}`));
    // 答え合わせと印刷は「今日」のタブの中の画面
    const tab = ['check', 'print'].includes(name) ? 'today' : name;
    $$('.tab').forEach((t) => t.classList.toggle('is-active', t.dataset.view === tab));
    document.body.classList.toggle('printing', name === 'print');
    window.scrollTo(0, 0);
    if (name === 'today') renderToday();
    if (name === 'check') renderCheck();
    if (name === 'print') renderPrint();
    if (name === 'progress') renderProgress();
    if (name === 'words') renderWordsFromTop();
    if (name === 'settings') renderSettings();
    renderHeader();
  }

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-view]');
    if (t) showView(t.dataset.view);
    // 発音。単語の行ならどこを押してもよい（押す的を大きくする）
    const s = e.target.closest('[data-speak]');
    if (s) Speech.speak(s.dataset.speak);
  });

  // 見出しには**今月やった日数**を出す。連続日数は1日休むと0に戻り、再開しにくくなる
  function renderHeader() {
    const n = Store.monthDays();
    $('#streak').hidden = n === 0;
    $('#streak').querySelector('b').textContent = n;
  }

  // ============================================================
  // 日付の表し方
  // ============================================================

  function dateLabel(key, long) {
    const [y, m, d] = key.split('-').map(Number);
    const wd = WEEKDAYS[new Date(y, m - 1, d).getDay()];
    return long ? `${y}年${m}月${d}日（${wd}）` : `${m}/${d}（${wd}）`;
  }

  // ============================================================
  // 今日
  // ============================================================

  /** 今日のプリントの見込み。復習が何語・新しい語が何語か */
  function mixOf(words) {
    let review = 0;
    let ws = 0;
    for (const w of words) {
      const r = Store.rec(w);
      if (r && r.ok + r.ng > 0) review += 1;
      else if (WS_KEYS.has(Store.keyOf(w))) ws += 1;
    }
    return { review, fresh: words.length - review, ws };
  }

  function mixText(m) {
    const parts = [];
    if (m.review) parts.push(`復習 ${m.review}語`);
    if (m.fresh) parts.push(`新しい語 ${m.fresh}語${m.ws ? `（うちワークシートの語 ${m.ws}）` : ''}`);
    return parts.join(' ＋ ');
  }

  function renderToday() {
    const pending = Store.pendingSheet();
    $('#today-make').hidden = !!pending;
    $('#today-sheet').hidden = !pending;

    if (pending) {
      const m = mixOf(pending.words);
      // **前の日の紙が残っていたら、それを記録するのが先。**新しい紙は作れないので、
      // 何をすればよいかをはっきり出す（責める言い方はしない）
      const old = pending.date < Store.dateKey();
      $('#sheet-label').innerHTML = old
        ? `${escapeHtml(dateLabel(pending.date))}の紙が、まだ記録されていません`
        : `${escapeHtml(dateLabel(pending.date))}の${pending.words.length}語　<span class="muted">${escapeHtml(mixText(m))}</span>`;
      $('#sheet-note').innerHTML = old
        ? 'やってあれば「答え合わせ」で記録してください。やっていなければ、下の「作り直す」で今日の紙にできます。'
        : 'テストが終わったら、<b>すぐに</b>「答え合わせ」で<b>まちがえた語だけ</b>押してください。';
      $('#do-check').textContent = old ? 'この紙を記録する' : '答え合わせ';
      $('#sheet-words').innerHTML = pending.words.map((w, i) => wordRow(lookup(w), i + 1)).join('');
      return;
    }

    const settings = Store.getSettings();
    const plan = Store.plan(pool(), WS_KEYS);
    const per = plan.length || settings.perDay;
    const today = Store.dateKey();
    const doneToday = Store.sheetsOn(today).filter((s) => s.results);
    const catchUp = Store.catchingUp(pool());

    $('#make-label').textContent = doneToday.length ? `今日の${doneToday.length + 1}枚目` : `今日の${per}語`;
    $('#do-make').textContent = doneToday.length ? `もう${per}語作る` : `今日の${per}語を作る`;
    $('#make-mix').textContent = plan.length ? mixText(mixOf(plan)) : '出せる語がありません';
    $('#do-make').disabled = !plan.length;
    // 今日の分が終わったら、追加は目立たせない（「決めた数で終わり」にする）
    $('#do-make').classList.toggle('btn-ink', !doneToday.length);
    $('#do-make').classList.toggle('btn-lg', !doneToday.length);
    $('#do-make').classList.toggle('btn-ghost', !!doneToday.length);
    // 少なめの日。休み明けや疲れた日の逃げ道。「やらない」より「5語だけ」のほうが戻ってきやすい
    $('#do-make-small').hidden = !plan.length || per <= 5 || !!doneToday.length;
    $('#make-note').textContent = catchUp
      ? '復習がたまっているので、今日は復習だけにしました。新しい語は、たまった分が減ってから出ます。'
      : '作ると、紙の並びと答え合わせの番号がそろいます。作ったら印刷してください。';

    // 続いてきたら、語数を増やすかを**一度だけ**聞く。こちらから勝手には増やさない
    const askUp = settings.perDay === 10 && !settings.upAsked && !catchUp && !doneToday.length &&
      Store.daysWithin(14) >= UP_AFTER_DAYS;
    $('#up-ask').hidden = !askUp;
    if (askUp) {
      $('#up-ask-text').textContent =
        `この2週間で${Store.daysWithin(14)}日やりました。1日20語に増やしますか？ あとから設定でも変えられます。`;
    }

    // 今日すでに記録した分。**正解の数は出さない。**やったこと（語数）だけ
    const t = Store.dayTally(today);
    $('#today-done').hidden = !t.total;
    if (t.total) {
      $('#today-done').innerHTML =
        `<p class="card-label">今日の記録</p>
         <p class="done-line"><b>${t.total}</b> 語 やりました。今日はここまでで大丈夫です。</p>
         <p class="hint">明日の復習: ${Store.dueWithin(1)}語</p>`;
    }
  }

  /** 何日やったら20語をすすめるか（直近2週間のうち） */
  const UP_AFTER_DAYS = 10;

  /** 単語の1行。押すと発音 */
  function wordRow(w, no) {
    const stage = Store.stageOf(w.word);
    const chip = { learned: '覚えた', learning: '覚えかけ', missed: 'まちがえた', new: '' }[stage];
    return `<button class="word-row" data-speak="${escapeHtml(w.word)}">
        ${no ? `<span class="w-no">${no}</span>` : ''}
        <span class="w-word">${escapeHtml(w.word)}</span>
        <span class="w-meaning">${escapeHtml(w.meaning)}</span>
        ${w.ex ? `<span class="w-ex" data-speak="${escapeHtml(w.ex.en)}">🔊 ${escapeHtml(w.ex.en)}<small>${escapeHtml(w.ex.ja)}</small></span>` : ''}
        <span class="w-tags">
          ${w.ws ? '<span class="tag tag-ws">ワークシート</span>' : ''}
          <span class="tag">${escapeHtml(GRADE_NAME[w.grade] || '')}</span>
          ${chip ? `<span class="tag tag-${stage}">${chip}</span>` : ''}
        </span>
        <span class="w-speak" aria-hidden="true">🔊</span>
      </button>`;
  }

  // ============================================================
  // 答え合わせ
  // ============================================================

  function renderCheck() {
    const sheet = Store.pendingSheet();
    if (!sheet) {
      showView('today');
      return;
    }
    // 全部 ○ から始める。**まちがえた語だけ押せば終わる**ようにするため。
    // 途中で閉じていたら、押してあった ✕ を戻す（sheet.draft）
    if (checking.__id !== sheet.id) {
      const ng = new Set(sheet.draft || []);
      checking = { __id: sheet.id };
      for (const w of sheet.words) checking[w] = !ng.has(w);
    }

    $('#check-label').textContent = `${dateLabel(sheet.date)}の${sheet.words.length}語`;
    $('#check-rows').innerHTML = sheet.words
      .map((w, i) => {
        const x = lookup(w);
        const ok = checking[w];
        return `<div class="check-row ${ok ? '' : 'is-ng'}">
            <span class="w-no">${i + 1}</span>
            <button class="c-word" data-speak="${escapeHtml(x.word)}">${escapeHtml(x.word)} <span aria-hidden="true">🔊</span></button>
            <span class="c-meaning">${escapeHtml(x.meaning)}</span>
            <button class="c-mark" data-mark="${escapeHtml(w)}" aria-label="${ok ? '正解' : 'まちがい'}">${ok ? '○' : '✕'}</button>
          </div>`;
      })
      .join('');
    const ng = sheet.words.filter((w) => !checking[w]).length;
    $('#check-sum').textContent = `○ ${sheet.words.length - ng}　✕ ${ng}`;
  }

  $('#check-rows').addEventListener('click', (e) => {
    const b = e.target.closest('[data-mark]');
    if (!b) return;
    checking[b.dataset.mark] = !checking[b.dataset.mark];
    const sheet = Store.pendingSheet();
    if (sheet) Store.saveDraft(sheet.id, sheet.words.filter((w) => checking[w] === false));
    renderCheck();
  });

  $('#do-record').addEventListener('click', () => {
    const sheet = Store.pendingSheet();
    if (!sheet) return;
    const results = {};
    for (const w of sheet.words) results[w] = checking[w] !== false;
    if (!Store.recordSheet(sheet.id, results)) {
      toast('記録できませんでした。ブラウザの保存領域がいっぱいかもしれません');
      return;
    }
    checking = {};
    // 正解の数は出さない。✕ は「次にまた出る」だけの意味で、点数ではない
    toast('記録しました。✕ の語は、また近いうちに出てきます');
    showView('today');
  });

  // ============================================================
  // 印刷
  // ============================================================

  /**
   * 1枚に入る行数。**用紙ごとに決め打ちにしてある。**
   *
   * ブラウザの改ページ任せにすると、画面のプレビューと刷り上がりがずれる。
   * こちらで行を枚数ぶんに切り分けておけば、**画面の1枚＝紙の1枚**になる。
   * 数は**目分量ではなく実測**で決める（A4 1122px から余白と見出しを引いた本文の高さ ÷ 1行の高さ）。
   * **行の高さを CSS で変えたら、ここも対で直すこと。**`node tools/audit-print.mjs` が見ている
   */
  // **最悪の日でも割れない数**にしてある。意味がいちばん長い語ばかりの日と、
  // 英語がいちばん長い語（threaten with extinction など熟語）ばかりの日。
  // 割れないのは、行の高さが語で変わらないようにしてあるから:
  //   英語は折り返さない（長い熟語は字を小さく）・紙の意味は16字まで（paperMeaning）。
  // 最悪の日に1枚いっぱいで、下に 20〜60px 残る。audit-print.mjs が最悪の日を3通り確かめている。
  // おぼえるは**例文つきで2行になる語**に合わせて15（例文のない語ばかりの日は下が空く。
  // 語ごとに行数を変えると、画面と紙の枚数が合わなくなるので、そろえるほうを取った）
  const ROWS_PER_PAGE = { study: 15, ja2en: 22, en2ja: 22, write: 17, answer: 25 };

  const PART_TITLES = {
    study: 'おぼえる',
    ja2en: 'テスト　意味 → 英語',
    en2ja: 'テスト　英語 → 意味',
    write: '書いて覚える',
    answer: '解答'
  };

  // 刷る順。おぼえる → テスト → 書く → 解答（解答は最後。折って隠せるように）
  const PART_ORDER = ['study', 'ja2en', 'en2ja', 'write', 'answer'];

  function paginate(rows, per) {
    const pages = [];
    for (let i = 0; i < rows.length; i += per) pages.push(rows.slice(i, i + per));
    return pages.length ? pages : [[]];
  }

  /** 1枚ぶんの枠 */
  function sheetHtml(part, inner, meta, page, pages) {
    const test = part === 'ja2en' || part === 'en2ja';
    return `<section class="sheet">
        <header class="sheet-head">
          <div class="sheet-title">
            <b>${escapeHtml(PART_TITLES[part])}</b>
            <span class="sheet-range">${escapeHtml(meta.date)} ・ ${meta.count}語</span>
          </div>
          <div class="sheet-meta">
            ${test ? `<span class="score-field"><i></i> / ${meta.count}</span>` : ''}
            ${pages > 1 ? `<span class="page-no">${page} / ${pages}</span>` : ''}
          </div>
        </header>
        ${inner}
      </section>`;
  }

  /**
   * 紙に載せる意味。**言い換えの並びを、頭から PAPER_MEANING 字まで**に切る。
   * 長い意味は「当たり前の事だが、もちろんのことだが、当然のことながら」のような
   * 同じことの言い換えで、紙では最初の1〜2つで足りる。これで1行が2行を超えなくなり、
   * ROWS_PER_PAGE を最悪の日に合わせて大きく減らさずに済む。
   * 最初の1つは長くても必ず残す。アプリの画面には全部出す
   */
  const PAPER_MEANING = 16;
  const LONG_WORD = 16;
  function paperMeaning(m) {
    const parts = String(m || '').split('、');
    let out = parts[0];
    for (const p of parts.slice(1)) {
      if ((out + '、' + p).length > PAPER_MEANING) break;
      out += '、' + p;
    }
    return out;
  }

  function buildPart(part, words, meta) {
    const per = ROWS_PER_PAGE[part];
    const items = words.map((w, i) => {
      const x = lookup(w);
      return { ...x, meaning: paperMeaning(x.meaning), no: i + 1 };
    });
    // 長い熟語の行は字を小さくする（CSS の .is-long。英語を1行に収めるため）
    const tr = (x, extra) => {
      const cls = [x.word.length > LONG_WORD ? 'is-long' : '', extra || ''].filter(Boolean).join(' ');
      return `<tr${cls ? ` class="${cls}"` : ''}>`;
    };

    const row = {
      // 例文のある語は2行にする。2行目は単語と意味の欄をまたいで英文だけ（訳は載せない。
      // 載せると3行になり1枚に入る語が減る。訳はアプリで見られる）
      study: (x) => x.ex
        // 2行をまたぐ（rowspan）と、Chrome がその欄の下線を引かずに線が途中で切れたので、
        // 2行目にも空の欄を置いて線を通す
        ? `${tr(x, 'has-ex')}<td class="c-no">${x.no}</td><td class="c-word">${escapeHtml(x.word)}</td>
            <td class="c-meaning">${escapeHtml(x.meaning)}</td><td class="c-check"><i></i><i></i><i></i></td></tr>
           <tr class="ex-row"><td></td><td class="c-ex" colspan="2">${escapeHtml(x.ex.en)}</td><td></td></tr>`
        : `${tr(x)}<td class="c-no">${x.no}</td><td class="c-word">${escapeHtml(x.word)}</td>
          <td class="c-meaning">${escapeHtml(x.meaning)}</td><td class="c-check"><i></i><i></i><i></i></td></tr>`,
      ja2en: (x) => `${tr(x)}<td class="c-no">${x.no}</td><td class="c-meaning">${escapeHtml(x.meaning)}</td><td class="c-blank"></td></tr>`,
      en2ja: (x) => `${tr(x)}<td class="c-no">${x.no}</td><td class="c-word">${escapeHtml(x.word)}</td><td class="c-blank"></td></tr>`,
      write: (x) => `${tr(x)}<td class="c-no">${x.no}</td><td class="c-word">${escapeHtml(x.word)}</td>
          <td class="c-meaning">${escapeHtml(x.meaning)}</td><td class="c-trace">${escapeHtml(x.word)}</td><td class="c-blank"></td></tr>`,
      answer: (x) => `${tr(x)}<td class="c-no">${x.no}</td><td class="c-word">${escapeHtml(x.word)}</td><td class="c-meaning">${escapeHtml(x.meaning)}</td></tr>`
    }[part];

    const head = {
      study: '<th class="c-no">#</th><th class="c-word">単語</th><th class="c-meaning">意味</th><th class="c-check">チェック</th>',
      ja2en: '<th class="c-no">#</th><th class="c-meaning">意味</th><th class="c-blank">英語を書く</th>',
      en2ja: '<th class="c-no">#</th><th class="c-word">単語</th><th class="c-blank">意味を書く</th>',
      write: '<th class="c-no">#</th><th class="c-word">単語</th><th class="c-meaning">意味</th><th class="c-trace">なぞる</th><th class="c-blank">書く</th>',
      answer: '<th class="c-no">#</th><th class="c-word">単語</th><th class="c-meaning">意味</th>'
    }[part];

    const pages = paginate(items.map(row), per);
    return pages.map((p, i) =>
      sheetHtml(
        part,
        `<table class="sheet-table sheet-${part}"><thead><tr>${head}</tr></thead><tbody>${p.join('')}</tbody></table>`,
        meta,
        i + 1,
        pages.length
      )
    );
  }

  function renderPrint() {
    const sheet = printTarget || Store.pendingSheet();
    if (!sheet) {
      showView('today');
      return;
    }
    const parts = Store.getSettings().parts;
    $$('#parts [data-part]').forEach((c) => { c.checked = !!parts[c.dataset.part]; });

    const meta = { date: dateLabel(sheet.date, true), count: sheet.words.length };
    // 解答はテストがあるときだけ意味がある
    const hasTest = parts.ja2en || parts.en2ja;
    const html = PART_ORDER.filter((p) => parts[p] && (p !== 'answer' || hasTest))
      .flatMap((p) => buildPart(p, sheet.words, meta));

    $('#papers').innerHTML = html.join('') ||
      '<p class="empty">印刷する紙を1つ以上えらんでください。</p>';
    $('#page-count').textContent = html.length;
    $('#do-print').disabled = !html.length;
    // 解答だけ選んでいてテストが無いときは、解答が出ないことを伝える
    $('[data-part="answer"]').closest('label').classList.toggle('is-off', !hasTest);
  }

  $('#parts').addEventListener('change', (e) => {
    const c = e.target.closest('[data-part]');
    if (!c) return;
    const parts = { ...Store.getSettings().parts, [c.dataset.part]: c.checked };
    Store.updateSettings({ parts });
    renderPrint();
  });

  $('#do-print').addEventListener('click', () => window.print());
  $('#print-back').addEventListener('click', () => {
    const back = printTarget ? 'progress' : 'today';
    printTarget = null;
    showView(back);
  });

  // ============================================================
  // 記録（進捗）
  // ============================================================

  function renderProgress() {
    const grades = [
      { key: 'g2', name: '2級', words: ALL.filter((w) => w.grade === 'g2') },
      { key: 'jun1', name: '準1級', words: ALL.filter((w) => w.grade === 'jun1') },
      { key: 'ws', name: 'ワークシートの語', words: ALL.filter((w) => w.ws) }
    ];

    let learnedAll = 0;
    $('#p-grades').innerHTML = grades
      .map((g) => {
        const c = { learned: 0, learning: 0, new: 0 };
        for (const w of g.words) {
          const s = Store.stageOf(w.word);
          if (s === 'learned') c.learned += 1;
          else if (s === 'new') c.new += 1;
          else c.learning += 1;
        }
        if (g.key !== 'ws') learnedAll += c.learned;
        const total = g.words.length || 1;
        const pct = (n) => `${(n / total) * 100}%`;
        return `<div class="grade-row">
            <div class="grade-head">
              <span class="grade-name">${escapeHtml(g.name)}</span>
              <span class="grade-num"><b>${c.learned.toLocaleString()}</b> / ${g.words.length.toLocaleString()}語
                <span class="muted">（覚えかけ ${c.learning}）</span></span>
            </div>
            <div class="bar">
              <span class="seg-learned" style="width:${pct(c.learned)}"></span>
              <span class="seg-learning" style="width:${pct(c.learning)}"></span>
            </div>
          </div>`;
      })
      .join('');

    $('#p-learned').textContent = learnedAll.toLocaleString();
    $('#p-month').textContent = Store.monthDays();
    $('#p-due').textContent = `復習の予定: 明日まで ${Store.dueWithin(1)}語 ／ 1週間以内 ${Store.dueWithin(7)}語`;

    // この2週間。棒の高さは記録した語数。**正解の割合は出さない**（日ごとに比べる材料になる）
    const days = [];
    for (let i = 13; i >= 0; i--) days.push(Store.addDays(Store.dateKey(), -i));
    const tallies = days.map((d) => ({ d, ...Store.dayTally(d) }));
    const max = Math.max(Store.getSettings().perDay, ...tallies.map((t) => t.total));
    $('#p-days').innerHTML = tallies
      .map((t, i) => {
        const [, m, d] = t.d.split('-').map(Number);
        const h = t.total ? Math.max(6, (t.total / max) * 100) : 3;
        return `<div class="day ${i === tallies.length - 1 ? 'is-today' : ''}" title="${t.d}: ${t.total}語">
            <div class="day-bar ${t.total ? '' : 'is-empty'}" style="height:${h}%"></div>
            <span class="day-label">${i === tallies.length - 1 ? '今日' : `${m}/${d}`}</span>
          </div>`;
      })
      .join('');

    // これまでのプリント（新しい順）。押すともう一度印刷できる
    const sheets = Store.allSheets().filter((s) => s.results).reverse().slice(0, 30);
    $('#p-sheets').innerHTML = sheets.length
      ? sheets
        .map((s) => {
          return `<button class="sheet-line" data-reprint="${escapeHtml(s.id)}">
              <span>${escapeHtml(dateLabel(s.date))}</span>
              <span class="sheet-score">${s.words.length}語</span>
              <span class="muted">🖨</span>
            </button>`;
        })
        .join('')
      : '<p class="hint">まだ記録がありません。「今日」から始めてください。</p>';
  }

  $('#p-sheets').addEventListener('click', (e) => {
    const b = e.target.closest('[data-reprint]');
    if (!b) return;
    printTarget = Store.allSheets().find((s) => s.id === b.dataset.reprint) || null;
    if (printTarget) showView('print');
  });

  // ============================================================
  // 単語
  // ============================================================

  const LIST_PAGE = 150;
  let listLimit = LIST_PAGE;

  function filteredWords() {
    const q = $('#w-search').value.trim().toLowerCase();
    const grade = $('#w-grade').value;
    const stage = $('#w-stage').value;
    return ALL.filter((w) => {
      if (grade === 'ws' ? !w.ws : grade !== 'all' && w.grade !== grade) return false;
      if (stage !== 'all') {
        const s = Store.stageOf(w.word);
        const bucket = s === 'missed' ? 'learning' : s;
        if (bucket !== stage) return false;
      }
      if (q && !w.word.toLowerCase().includes(q) && !w.meaning.includes(q)) return false;
      return true;
    });
  }

  function renderWords() {
    const list = filteredWords();
    const shown = list.slice(0, listLimit);
    $('#w-count').textContent = `${list.length.toLocaleString()}語`;
    $('#w-rows').innerHTML = shown.map((w) => wordRow(w)).join('') ||
      '<p class="hint">見つかりませんでした。</p>';
    $('#w-more').hidden = list.length <= listLimit;
    $('#w-more').textContent = `さらに表示（残り ${(list.length - listLimit).toLocaleString()}語）`;
  }

  function renderWordsFromTop() {
    listLimit = LIST_PAGE;
    renderWords();
  }

  $('#w-search').addEventListener('input', renderWordsFromTop);
  $('#w-grade').addEventListener('change', renderWordsFromTop);
  $('#w-stage').addEventListener('change', renderWordsFromTop);
  $('#w-more').addEventListener('click', () => {
    listLimit += LIST_PAGE;
    renderWords();
  });

  // ============================================================
  // 設定
  // ============================================================

  function renderVoices() {
    const sel = $('#s-voice');
    const vs = Speech.voices();
    const cur = Speech.current();
    if (!Speech.supported || !vs.length) {
      sel.innerHTML = '<option>（この端末には英語の声がありません）</option>';
      sel.disabled = true;
      $('#s-voice-note').textContent = '';
      return;
    }
    sel.disabled = false;
    sel.innerHTML = vs
      .map((v) => `<option value="${escapeHtml(v.name)}" ${cur && cur.name === v.name ? 'selected' : ''}>${escapeHtml(Speech.label(v))}</option>`)
      .join('');
    // 高品質の声が無い端末には、無料で入れられることを教える（えいごペットと同じ案内）
    $('#s-voice-note').innerHTML = Speech.hasGood()
      ? '「高品質」と付いた声がいちばん自然です。'
      : 'もっと自然な声にできます。iPhone・iPad の <b>設定 → アクセシビリティ → 読み上げコンテンツ → 声 → 英語</b> で「拡張」や「Premium」の声をダウンロードすると、ここに「高品質」として出てきます（無料）。';
  }

  function renderSettings() {
    const s = Store.getSettings();
    $('#s-perday').value = String(s.perDay);
    $('#s-range').value = s.range;
    $('#s-rate').value = String(s.rate);
    renderVoices();
  }

  $('#s-perday').addEventListener('change', (e) => Store.updateSettings({ perDay: Number(e.target.value) }));
  $('#s-range').addEventListener('change', (e) => Store.updateSettings({ range: e.target.value }));
  $('#s-rate').addEventListener('change', (e) => {
    Store.updateSettings({ rate: Number(e.target.value) });
    Speech.speak('Hello. This is my voice.');
  });
  $('#s-voice').addEventListener('change', (e) => {
    Speech.setVoice(e.target.value);
    Speech.speak('Hello. This is my voice.');
  });
  $('#s-voice-test').addEventListener('click', () => Speech.speak('Hello. This is my voice.'));

  $('#s-export').addEventListener('click', () => {
    const blob = new Blob([Store.exportJSON()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hana-eitango-${Store.dateKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast('記録を書き出しました');
  });
  $('#s-import').addEventListener('click', () => $('#s-import-file').click());
  $('#s-import-file').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        if (!confirm('いまの記録を、このファイルの記録で置き換えます。よろしいですか？')) return;
        Store.importJSON(String(reader.result));
        toast('記録を読み込みました');
        showView('progress');
      } catch (err) {
        toast(`読み込めませんでした: ${err.message}`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  });
  $('#s-restore').addEventListener('click', () => {
    if (!Store.hasBackup()) {
      toast('まだバックアップがありません');
      return;
    }
    if (!confirm('前日までの状態に戻します。今日の記録は消えます。よろしいですか？')) return;
    if (Store.restoreBackup()) {
      toast('1日前の状態に戻しました');
      showView('progress');
    }
  });
  $('#s-reset').addEventListener('click', () => {
    if (!confirm('すべての記録を消します。よろしいですか？')) return;
    if (!confirm('本当に消しますか？ 書き出していなければ戻せません。')) return;
    Store.reset();
    toast('記録を消しました');
    showView('today');
  });

  // ============================================================
  // 今日の画面のボタン
  // ============================================================

  function makeAndPrint(count) {
    const sheet = Store.makeSheet(pool(), WS_KEYS, count);
    if (!sheet) {
      toast('出せる語がありません');
      return;
    }
    checking = {};
    printTarget = null;
    showView('print');
  }
  $('#do-make').addEventListener('click', () => makeAndPrint());
  $('#do-make-small').addEventListener('click', () => makeAndPrint(5));
  $('#up-yes').addEventListener('click', () => {
    Store.updateSettings({ perDay: 20, upAsked: true });
    toast('1日20語にしました');
    renderToday();
  });
  $('#up-no').addEventListener('click', () => {
    Store.updateSettings({ upAsked: true });
    renderToday();
  });
  $('#do-print-view').addEventListener('click', () => {
    printTarget = null;
    showView('print');
  });
  $('#do-check').addEventListener('click', () => showView('check'));
  $('#do-discard').addEventListener('click', () => {
    if (!confirm('このプリントを捨てて、作り直しますか？（記録はされません）')) return;
    Store.discardPending();
    checking = {};
    showView('today');
  });

  // ============================================================
  // 初期化
  // ============================================================

  function init() {
    $('#app-version').textContent = APP_VERSION;
    Speech.init(() => {
      if ($('#view-settings').classList.contains('is-active')) renderVoices();
    });
    showView('today');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
