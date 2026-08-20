/**
 * EIS合格応援アプリ — 画面制御と学習ロジック
 */
(() => {
  'use strict';

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  // ============================================================
  // 汎用ユーティリティ
  // ============================================================

  function shuffle(array) {
    const a = array.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);
  }

  // 難易度は CEFR で示す。データ側の level は 1〜4 のまま、表示だけを切り替える。
  //
  // 以前は「英検◯級」と出していたが、EIS が英検を基準にしている証拠は無く、
  // こちらで勝手に置いた物差しだった。いまの単語と長文は TOEFL Junior 教材から
  // 取っており、ETS が CEFR との対応を公表しているので、そちらで示す。
  // 教材の3分冊（Basic / Intermediate / Advanced）が level 2 / 3 / 4 に対応する。
  const LEVEL_LABELS = {
    1: '入門（A1）',
    2: '基礎 A2',
    3: '標準 B1',
    4: '応用 B2'
  };
  const levelLabel = (level) => LEVEL_LABELS[level] || `レベル${level}`;

  // 算数は学年で示したほうが分かりやすいので、別の表示名を使う
  // 算数も単語・長文と同じ4段階にそろえた。受けるのは EIS の Grade 8 入試なので、
  // 日本の学年ではなくインター校の学年（Grade 7 ≒ 中1）で範囲を区切る
  const MATH_LEVEL_LABELS = { 1: 'Grade 3', 2: 'Grade 4', 3: 'Grade 5', 4: 'Grade 6', 5: 'Grade 7' };
  const mathLevelLabel = (level) => MATH_LEVEL_LABELS[level] || `レベル${level}`;

  let toastTimer = null;
  function toast(message) {
    const el = $('#toast');
    el.textContent = message;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 1800);
  }

  // ============================================================
  // 音声読み上げ（Web Speech API）
  // ============================================================

  const Speech = {
    supported: typeof window.speechSynthesis !== 'undefined',
    voice: null,
    init() {
      if (!this.supported) return;
      const pick = () => {
        const voices = window.speechSynthesis.getVoices();
        this.voice =
          voices.find((v) => v.lang === 'en-US') ||
          voices.find((v) => v.lang.startsWith('en')) ||
          null;
      };
      pick();
      window.speechSynthesis.onvoiceschanged = pick;
    },
    speak(text) {
      if (!this.supported) {
        toast('このブラウザは音声読み上げに対応していません');
        return;
      }
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = 0.9;
      if (this.voice) u.voice = this.voice;
      window.speechSynthesis.speak(u);
    }
  };

  // ============================================================
  // 出題範囲のフィルタリング
  // ============================================================

  function matchesScope(word, scope) {
    switch (scope) {
      case 'learned':
        return Storage.isLearned(word.id);
      case 'unlearned':
        return !Storage.isLearned(word.id);
      case 'due':
        return Storage.isDue(word.id);
      case 'weak':
        return Storage.isWeak(word.id);
      case 'starred':
        return Storage.getRecord(word.id).starred;
      case 'new':
        return !Storage.getRecord(word.id).lastStudied;
      default:
        return true;
    }
  }

  function getFilteredWords() {
    const s = Storage.getSettings();
    return WORD_DATA.filter((w) => {
      if (s.level !== 'all' && String(w.level) !== String(s.level)) return false;
      if (s.category !== 'all' && w.category !== s.category) return false;
      // 教材由来の語だけに絞る（toefl の印は tools/build-gloss-vocab.mjs が付ける）
      if (s.source === 'toefl' && !w.toefl) return false;
      return matchesScope(w, s.scope);
    });
  }

  // ============================================================
  // 画面切り替え
  // ============================================================

  // 下タブは4つだけなので、その中の画面（単語カード・単語一覧など）は親タブを光らせる
  const TAB_GROUP = {
    home: 'home',
    quiz: 'quiz',
    flashcard: 'quiz',
    reading: 'quiz',
    grammar: 'quiz',
    math: 'quiz',
    list: 'quiz',
    mock: 'mock',
    stats: 'stats',
    settings: null // 設定はどのタブにも属さない
  };

  function showView(name) {
    stopTempo(); // 別の画面へ移ったらサクサク4択のタイマーを止める
    $$('.view').forEach((v) => v.classList.toggle('is-active', v.id === `view-${name}`));
    const group = TAB_GROUP[name] !== undefined ? TAB_GROUP[name] : name;
    $$('.tab').forEach((t) => t.classList.toggle('is-active', t.dataset.view === group));
    window.scrollTo(0, 0);

    if (name === 'home') renderHome();
    if (name === 'flashcard') startFlashcards();
    if (name === 'quiz') resetQuizToSetup();
    if (name === 'math') resetMathToSetup();
    if (name === 'reading') showReadingList();
    if (name === 'grammar') resetGrammarToSetup();
    if (name === 'mock') resetMockToSetup();
    if (name === 'list') renderListFromTop();
    if (name === 'stats') renderStats();
    if (name === 'settings') refreshAiStatus();
  }

  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-view]');
    if (!target) return;
    // 習得マップのマスは「その単元・その学年に絞って算数へ」。
    // showView より先に絞り込みを保存する（画面を開くときに設定を読むため）
    if (target.dataset.mcat) {
      Storage.updateSettings({
        mathCategory: target.dataset.mcat,
        mathLevel: target.dataset.mlv,
        mathScope: 'all'
      });
    }
    showView(target.dataset.view);
  });

  // ============================================================
  // スワイプでのタブ移動
  // ============================================================

  const SWIPE_MIN_X = 60;      // これ以上横に動いたらスワイプとみなす
  const SWIPE_MAX_Y = 60;      // 縦の移動がこれを超えたら、ページのスクロールとみなして無視する
  const SWIPE_MAX_TIME = 600;  // ゆっくりした動きは無視する

  // スワイプの終わりに click が続けて発生するので、その1回だけ無効にする
  let suppressClickUntil = 0;
  const swipe = { x: 0, y: 0, at: 0, active: false };

  function tabNames() {
    return $$('.tab').map((t) => t.dataset.view);
  }

  function moveTab(step) {
    const names = tabNames();
    const active = $('.tab.is-active');
    if (!active) return false; // 設定画面などタブに属さない画面ではスワイプ移動しない
    const current = names.indexOf(active.dataset.view);
    const next = current + step;
    if (next < 0 || next >= names.length) return false;
    showView(names[next]);
    return true;
  }

  document.addEventListener(
    'touchstart',
    (e) => {
      swipe.active = false;
      if (e.touches.length !== 1) return;
      // 文字入力中と、横スクロールする場所では反応させない
      if (e.target.closest('input, textarea, select, .tabs')) return;
      swipe.x = e.touches[0].clientX;
      swipe.y = e.touches[0].clientY;
      swipe.at = Date.now();
      swipe.active = true;
    },
    { passive: true }
  );

  document.addEventListener(
    'touchend',
    (e) => {
      if (!swipe.active) return;
      swipe.active = false;

      const touch = e.changedTouches[0];
      const dx = touch.clientX - swipe.x;
      const dy = touch.clientY - swipe.y;

      if (Date.now() - swipe.at > SWIPE_MAX_TIME) return;
      if (Math.abs(dx) < SWIPE_MIN_X) return;
      if (Math.abs(dy) > SWIPE_MAX_Y) return;
      if (Math.abs(dy) > Math.abs(dx)) return;

      // 左へ払えば次のタブ、右へ払えば前のタブ
      if (moveTab(dx < 0 ? 1 : -1)) {
        suppressClickUntil = Date.now() + 400;
        scrollActiveTabIntoView();
      }
    },
    { passive: true }
  );

  // スワイプ直後の click（カードのめくり等）を打ち消す
  document.addEventListener(
    'click',
    (e) => {
      if (Date.now() < suppressClickUntil) {
        e.stopPropagation();
        e.preventDefault();
      }
    },
    true
  );

  /** タブ全体が画面に収まらないので、選択中のタブが見えるところまで寄せる */
  function scrollActiveTabIntoView() {
    const active = $('.tab.is-active');
    if (active && active.scrollIntoView) {
      active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  // ============================================================
  // ホーム画面
  // ============================================================

  function renderHome() {
    // ホームは「試験日までの残り日数」「今日の学習メニュー」「カレンダー」の3つだけ
    if (cal.year === null) {
      const today = startOfToday();
      cal.year = today.getFullYear();
      cal.month = today.getMonth();
    }
    renderCountdown();
    renderTodayMenu();
    renderCalendar();
    renderHeaderStreak();
    renderWeakSpot();
  }

  function renderHeaderStreak() {
    const streak = Storage.getStreak();
    const badge = $('#header-streak');
    badge.hidden = streak === 0;
    badge.querySelector('b').textContent = streak;
  }

  /**
   * 弱点分野を横断で集める。正答率の低い順（十分に解いた分野だけ）。
   *
   * **正答率が7割を下回るものだけ**を弱点と呼ぶ。ただ低い順に並べて上から3つ取ると、
   * 全部できている人にも「伸ばせる分野: 100%」と出てしまう。
   * 7割は模擬試験の階段が落ち着く高さ・AI診断の合格ラインと同じ線。
   */
  const WEAK_LINE = 70;

  function weakRows(minAnswered) {
    const readingItems = READING_DATA.flatMap((r) =>
      r.questions.map((q, i) => ({ id: `${r.id}-${i + 1}`, category: r.topic }))
    );
    return [
      ...accuracyByCategory(WORD_DATA).map((r) => ({ ...r, subject: '単語', view: 'quiz' })),
      ...accuracyByCategory(readingItems).map((r) => ({ ...r, subject: '長文読解', view: 'reading' })),
      ...accuracyByCategory(MATH_DATA).map((r) => ({ ...r, subject: '算数', view: 'math' })),
      // 文法は分野の欄に単元名（unit）を入れて、同じ集計に乗せる
      ...accuracyByCategory(GRAMMAR_DATA.map((q) => ({ ...q, category: q.unit })))
        .map((r) => ({ ...r, subject: '文法', view: 'grammar' }))
    ]
      .filter((r) => r.answered >= minAnswered && r.rate < WEAK_LINE)
      .sort((a, b) => a.rate - b.rate);
  }

  const weakRowHtml = (r) => `<button class="row-line" data-view="${r.view}">
      <span class="row-main">
        <span class="row-name">${escapeHtml(r.subject)}　${escapeHtml(r.category)}</span>
      </span>
      <span class="row-rate ${r.rate >= 80 ? 't-high' : r.rate >= 60 ? 't-mid' : 't-low'}">${r.rate}%</span>
      <span class="row-solve">解く</span>
    </button>`;

  function renderWeakSpot() {
    const rows = weakRows(4);
    const w = rows[0];
    $('#weak-spot').hidden = !w;
    if (w) $('#weak-spot-row').innerHTML = weakRowHtml(w);
  }

  function updateFilterCount() {
    $('#filter-count').textContent = `対象: ${getFilteredWords().length} 語`;
    renderFilterSummary();
  }

  /** 畳んだ出題範囲の1行要約（例: 基礎 A2 ・ まだ覚えていない ・ 10問） */
  function renderFilterSummary() {
    const text = (sel) => {
      const el = $(sel);
      return el.options[el.selectedIndex] ? el.options[el.selectedIndex].textContent : '';
    };
    $('#filter-summary').textContent =
      `${text('#filter-level')} ・ ${text('#filter-scope')} ・ ${text('#filter-quiz-length')}`;
  }

  // ============================================================
  // 今日の学習メニュー
  // ============================================================

  // 1日のノルマ。曜日で決め打ちにしてある（残り日数からは計算しない）
  const DAILY_GOALS = {
    weekday: { word: 20, math: 15, grammar: 10 },
    weekend: { word: 25, math: 20, grammar: 15 }
  };

  function isWeekend(date = new Date()) {
    const d = date.getDay();
    return d === 0 || d === 6; // 日曜と土曜
  }

  function todayGoals() {
    const quota = isWeekend() ? DAILY_GOALS.weekend : DAILY_GOALS.weekday;

    const wordsLeft = WORD_DATA.filter((w) => !Storage.isLearned(w.id)).length;
    const mathLeft = MATH_DATA.filter((p) => !Storage.isLearned(p.id)).length;
    const readingLeft = READING_DATA.filter(
      (r) => r.questions.some((q, i) => !Storage.isLearned(`${r.id}-${i + 1}`))
    ).length;
    const grammarLeft = GRAMMAR_DATA.filter((q) => !Storage.isLearned(q.id)).length;

    // データが無い科目は献立に出さない。達成できないノルマを残すと
    // 「今日の分は達成」に一生ならず、続ける気を削ぐため
    return [
      {
        key: 'word',
        icon: '📖',
        name: '単語',
        goal: quota.word,
        unit: '語',
        left: wordsLeft,
        view: 'quiz',
        available: WORD_DATA.length > 0
      },
      {
        key: 'math',
        icon: '🔢',
        name: '算数',
        goal: quota.math,
        unit: '問',
        left: mathLeft,
        view: 'math',
        available: MATH_DATA.length > 0
      },
      {
        key: 'grammar',
        icon: '✏️',
        name: '文法',
        goal: quota.grammar,
        unit: '問',
        left: grammarLeft,
        view: 'grammar',
        available: GRAMMAR_DATA.length > 0
      },
      {
        key: 'passages',
        icon: '📕',
        name: '長文読解',
        // 本文は最後まで読んで初めて練習になる。設問の数で数えると、
        // 2問しかない本文を解いただけで達成になってしまう
        goal: 1,
        unit: '本',
        left: readingLeft,
        view: 'reading',
        available: READING_DATA.length > 0
      }
    ].filter((g) => g.available);
  }

  function renderTodayMenu() {
    const counts = Storage.getTodayCounts();
    const goals = todayGoals();
    const doneCount = goals.filter((g) => counts[g.key] >= g.goal).length;

    $('#today-status').textContent =
      doneCount === goals.length ? '✓ 今日の分は達成' : `${doneCount} / ${goals.length} 達成`;
    $('#today-status').classList.toggle('is-done', doneCount === goals.length);

    $('#today-list').innerHTML = goals
      .map((g) => {
        const done = counts[g.key];
        const complete = done >= g.goal;
        const percent = Math.min((done / g.goal) * 100, 100);
        return `<button class="today-item ${complete ? 'is-complete' : ''}" data-view="${g.view}">
            <span class="today-icon">${complete ? '✓' : g.icon}</span>
            <span class="today-main">
              <span class="today-name">${g.name}</span>
              <span class="progress-bar slim"><span class="progress-fill" style="width:${percent}%"></span></span>
            </span>
            <span class="today-count">${done} / ${g.goal} ${g.unit}</span>
          </button>`;
      })
      .join('');

    const days = daysUntilExam();
    const word = goals.find((g) => g.key === 'word');
    const quota = isWeekend() ? '土日' : '平日';
    $('#today-note').textContent =
      days > 0
        ? word
          ? `${quota}のノルマです。未習得の単語はあと ${word.left} 語、試験まで ${days} 日。`
          : `${quota}のノルマです。試験まで ${days} 日。単語データがまだありません。`
        : '試験日を過ぎました。';
  }

  /** 保存済みの設定を各入力欄に反映する */
  function syncFilterInputs() {
    const s = Storage.getSettings();
    $('#filter-level').value = s.level;
    $('#filter-source').value = s.source || 'all';
    $('#filter-category').value = s.category;
    $('#filter-scope').value = s.scope;
    $('#list-scope').value = s.scope;
    $('#filter-quiz-length').value = String(s.quizLength);
    $('#filter-tempo-time').value = String(s.tempoTime);
    updateFilterCount();
  }

  function initFilters() {
    const catSelect = $('#filter-category');
    catSelect.innerHTML =
      '<option value="all">すべて</option>' +
      CATEGORIES.map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');

    syncFilterInputs();

    $('#filter-level').addEventListener('change', (e) => {
      Storage.updateSettings({ level: e.target.value });
      updateFilterCount();
    });
    $('#filter-source').addEventListener('change', (e) => {
      Storage.updateSettings({ source: e.target.value });
      updateFilterCount();
    });
    catSelect.addEventListener('change', (e) => {
      Storage.updateSettings({ category: e.target.value });
      updateFilterCount();
    });
    $('#filter-scope').addEventListener('change', (e) => {
      Storage.updateSettings({ scope: e.target.value });
      $('#list-scope').value = e.target.value;
      updateFilterCount();
    });
    $('#filter-quiz-length').addEventListener('change', (e) => {
      Storage.updateSettings({ quizLength: Number(e.target.value) });
      renderFilterSummary();
    });

    // 学習ハブの「単語一覧」行に総語数を出す
    $('#list-total-note').textContent = `${WORD_DATA.length.toLocaleString()}語`;
    $('#filter-tempo-time').addEventListener('change', (e) => {
      Storage.updateSettings({ tempoTime: Number(e.target.value) });
    });
  }

  // ============================================================
  // 受験までのカウントダウンとカレンダー
  // ============================================================

  // 受験日は固定。EIS Grade 8 の入学試験日
  /**
   * 画面の左上に出すリビジョン。
   * ビルド工程が無いので実行時に git を読めない。コミットの直前に
   * tools/stamp-version.mjs で書き換える。
   * スマホで開いたときに、手元のものが最新かを確かめるためのもの。
   */
  const APP_VERSION = '2026-08-20 (abf79d0)';

  const EXAM_DATE = '2027-01-07';

  const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

  // 表示中の月。初期値は初回描画時に決める
  const cal = { year: null, month: null };

  /** 'YYYY-MM-DD' をその日の 0 時のローカル日付として読む */
  function parseDateKey(key) {
    const [y, m, d] = key.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  function dateKeyOf(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function startOfToday() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  /** 試験日までの残り日数。過ぎていれば負の数 */
  function daysUntilExam() {
    const exam = parseDateKey(EXAM_DATE);
    const diff = exam.getTime() - startOfToday().getTime();
    return Math.round(diff / (1000 * 60 * 60 * 24));
  }

  function renderCountdown() {
    const examDate = parseDateKey(EXAM_DATE);
    const days = daysUntilExam();

    const label = $('#countdown-label');
    const number = $('#countdown-number');
    const unit = $('.countdown-unit');

    if (days > 0) {
      label.textContent = 'EIS入試まで';
      number.textContent = days;
      unit.hidden = false;
    } else if (days === 0) {
      label.textContent = '今日が試験日です';
      number.textContent = '🎯';
      unit.hidden = true;
    } else {
      label.textContent = '試験日から';
      number.textContent = Math.abs(days);
      unit.hidden = false;
      label.textContent = '試験日を過ぎました';
    }

    $('#countdown-date').textContent =
      `${examDate.getFullYear()}年${examDate.getMonth() + 1}月${examDate.getDate()}日（${WEEKDAYS[examDate.getDay()]}）`;

    // 残り週数と、間に合わせるための1日あたりの語数
    if (days > 0) {
      const weeks = Math.floor(days / 7);
      const rest = days % 7;
      $('#countdown-weeks').textContent =
        weeks > 0 ? `あと ${weeks} 週間と ${rest} 日` : `あと ${rest} 日`;

      const remaining = WORD_DATA.filter((w) => !Storage.isLearned(w.id)).length;
      const perDay = Math.ceil(remaining / days);
      // 単語データが空のときに「全て覚えました」と出ると嘘になるので分ける
      $('#countdown-pace').textContent = WORD_DATA.length === 0
        ? '単語データがありません'
        : remaining > 0
          ? `未習得 ${remaining} 語 → 1日 ${perDay} 語のペース`
          : '全ての単語を覚えました';
    } else {
      $('#countdown-weeks').textContent = '';
      $('#countdown-pace').textContent = '';
    }
  }

  function renderCalendar() {
    const today = startOfToday();
    const todayKey = dateKeyOf(today);
    const examKey = EXAM_DATE;
    const studied = Storage.getStudiedDates();

    const first = new Date(cal.year, cal.month, 1);
    const daysInMonth = new Date(cal.year, cal.month + 1, 0).getDate();
    const leading = first.getDay(); // 月初の曜日ぶんだけ空ける

    $('#cal-title').textContent = `${cal.year}年 ${cal.month + 1}月`;

    const cells = [];
    WEEKDAYS.forEach((w, i) => {
      cells.push(`<div class="cal-dow ${i === 0 ? 'sun' : ''}${i === 6 ? 'sat' : ''}">${w}</div>`);
    });
    for (let i = 0; i < leading; i++) cells.push('<div class="cal-cell is-empty"></div>');

    let studiedThisMonth = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(cal.year, cal.month, d);
      const key = dateKeyOf(date);
      if (studied.has(key)) studiedThisMonth += 1;
      const classes = ['cal-cell'];
      if (key === examKey) classes.push('is-exam');
      if (key === todayKey) classes.push('is-today');
      if (date.getDay() === 0) classes.push('sun');
      if (date.getDay() === 6) classes.push('sat');

      const day = Storage.getDay(key);
      const mark = studied.has(key) ? `<i class="cal-dot" title="${day.answered}問"></i>` : '';
      const flag = key === examKey ? '<span class="cal-flag">🎯</span>' : '';
      cells.push(`<div class="${classes.join(' ')}"><span class="cal-num">${d}</span>${flag}${mark}</div>`);
    }

    $('#calendar').innerHTML = cells.join('');
    // 畳んだ状態でも様子が分かるよう、1行の要約を出す
    $('#cal-summary').textContent = `${cal.month + 1}月は ${studiedThisMonth}日 学習`;
  }

  function moveMonth(step) {
    const d = new Date(cal.year, cal.month + step, 1);
    cal.year = d.getFullYear();
    cal.month = d.getMonth();
    renderCalendar();
  }

  function initCountdown() {
    $('#cal-prev').addEventListener('click', () => moveMonth(-1));
    $('#cal-next').addEventListener('click', () => moveMonth(1));

    $('#cal-today').addEventListener('click', () => {
      const today = startOfToday();
      cal.year = today.getFullYear();
      cal.month = today.getMonth();
      renderCalendar();
    });

    $('#cal-exam').addEventListener('click', () => {
      const exam = parseDateKey(EXAM_DATE);
      cal.year = exam.getFullYear();
      cal.month = exam.getMonth();
      renderCalendar();
    });
  }

  // ============================================================
  // 単語カード
  // ============================================================

  const fc = { deck: [], index: 0, flipped: false };

  function startFlashcards() {
    fc.deck = shuffle(getFilteredWords());
    fc.index = 0;
    fc.flipped = false;

    const empty = fc.deck.length === 0;
    $('#fc-empty').hidden = !empty;
    $('#fc-body').hidden = empty;
    if (!empty) renderFlashcard();
  }

  /**
   * 例文の和訳を出す。
   *
   * 教材から取り込んだ語には和訳が付いていないので、APIキーがあれば
   * めくったときにその1文だけ訳す。訳は貯めるので、二度目からは即出る。
   * キーが無ければ何も出さない（英文だけでも読める）。
   */
  async function showExampleJa(w) {
    const box = $('#fc-example-ja');
    if (!w.example) {
      box.hidden = true;
      return;
    }

    // データに元から和訳があるものと、訳済みのものは待たせずに出す
    const ready = w.exampleJa || AI.cachedTranslation(w.example);
    if (ready) {
      box.textContent = ready;
      box.hidden = false;
      return;
    }
    if (!AI.hasKey()) {
      box.hidden = true;
      return;
    }

    box.textContent = '和訳を作っています…';
    box.hidden = false;

    const ja = await AI.translateExample(w.example);

    // 待っている間に別のカードへ移っていたら書き換えない
    if (fc.deck[fc.index] !== w) return;
    box.textContent = ja || '';
    box.hidden = !ja;
  }

  /**
   * 意味にふりがなを付けて出す。
   * 読める漢字にまで付くと逆に読みにくいので、AI 側で小学校の漢字は外している。
   * 「漆喰(しっくい)」の形で返るので、ruby に組み直す。
   */
  async function showMeaning(w) {
    const el = $('#fc-meaning');
    el.textContent = w.meaning;
    if (!Storage.getSettings().furigana) return;

    const ready = AI.cachedFurigana(w.meaning);
    const text = ready || (AI.hasKey() ? await AI.addFurigana(w.meaning) : null);
    if (!text) return;
    if (fc.deck[fc.index] !== w) return; // 待っている間に次のカードへ移っていたら書き換えない

    el.innerHTML = text.replace(
      /([一-龯々]+)\(([ぁ-ん]+)\)/g,
      (m, kanji, yomi) => `<ruby>${escapeHtml(kanji)}<rt>${escapeHtml(yomi)}</rt></ruby>`
    );
  }

  function renderFlashcard() {
    const w = fc.deck[fc.index];
    if (!w) return;

    $('#flashcard-inner').classList.toggle('is-flipped', fc.flipped);
    $('#fc-word').textContent = w.word;
    $('#fc-phonetic').textContent = w.phonetic;
    $('#fc-level').textContent = levelLabel(w.level);
    $('#fc-category').textContent = w.category;
    $('#fc-pos').textContent = w.pos;
    $('#fc-pos').hidden = !w.pos;
    showMeaning(w);
    // 補足は2種類ある。「混同しやすい語」の注意と、同義語・対義語の参考情報。
    // 後者は警告ではないので ⚠ を付けず、見た目も分ける
    const isRelation = /^(同義語|対義語)/.test(w.note || '');
    $('#fc-note').textContent = w.note ? (isRelation ? w.note : `⚠ ${w.note}`) : '';
    $('#fc-note').classList.toggle('is-relation', isRelation);
    $('#fc-note').hidden = !w.note;
    $('#fc-example').textContent = w.example;
    // 取り込んだばかりで例文がない単語では、例文欄ごと隠す
    $('#fc-example-box').hidden = !w.example;
    showExampleJa(w);

    const rec = Storage.getRecord(w.id);
    $('#fc-learned-badge').hidden = !rec.learned;

    const starBtn = $('#fc-star');
    starBtn.textContent = rec.starred ? '★ 覚えにくい' : '☆ 覚えにくい';
    starBtn.classList.toggle('is-on', rec.starred);

    $('#fc-counter').textContent = `${fc.index + 1} / ${fc.deck.length}`;
    $('#fc-progress').style.width = `${((fc.index + 1) / fc.deck.length) * 100}%`;
    $('#fc-flip').textContent = fc.flipped ? '単語に戻る' : '意味を見る';

    if (Storage.getSettings().autoSpeak) Speech.speak(w.word);
  }

  function flipCard() {
    fc.flipped = !fc.flipped;
    renderFlashcard();
  }

  function moveCard(step) {
    const next = fc.index + step;
    if (next < 0) return;
    if (next >= fc.deck.length) {
      toast(`${fc.deck.length} 語すべて確認しました`);
      showView('home');
      return;
    }
    fc.index = next;
    fc.flipped = false;
    renderFlashcard();
  }

  /** 「覚えた」チェックを付け外ししつつ、復習間隔にも反映する */
  function answerCard(isLearned) {
    const w = fc.deck[fc.index];
    if (!w) return;
    Storage.recordAnswer(w.id, isLearned);
    Storage.setLearned(w.id, isLearned);
    toast(isLearned ? '✓ 覚えたにチェックしました' : 'チェックを外しました');
    moveCard(1);
  }

  function initFlashcards() {
    $('#flashcard').addEventListener('click', flipCard);
    $('#fc-flip').addEventListener('click', flipCard);
    $('#fc-prev').addEventListener('click', () => moveCard(-1));
    $('#fc-next').addEventListener('click', () => moveCard(1));
    $('#fc-again').addEventListener('click', () => answerCard(false));
    $('#fc-known').addEventListener('click', () => answerCard(true));

    $('#fc-speak').addEventListener('click', (e) => {
      e.stopPropagation();
      const w = fc.deck[fc.index];
      if (w) Speech.speak(w.word);
    });

    $('#fc-star').addEventListener('click', (e) => {
      e.stopPropagation();
      const w = fc.deck[fc.index];
      if (!w) return;
      const on = Storage.toggleStar(w.id);
      toast(on ? '★ をつけました' : '★ を外しました');
      renderFlashcard();
    });

    // キーボード操作（PC向け）
    document.addEventListener('keydown', (e) => {
      if (!$('#view-flashcard').classList.contains('is-active')) return;
      if (e.key === ' ') { e.preventDefault(); flipCard(); }
      if (e.key === 'ArrowRight') moveCard(1);
      if (e.key === 'ArrowLeft') moveCard(-1);
    });
  }

  // ============================================================
  // タイピングクイズ
  // ============================================================

  const quiz = {
    questions: [],
    index: 0,
    correct: 0,
    results: [],
    mode: 'ja-en',
    answered: false,
    hintLevel: 0
  };

  const MODE_LABELS = {
    'ja-en': 'この意味を表す英単語を入力してください'
  };

  /** 採点用に表記を揃える（大小文字・前後の空白・記号の違いを吸収） */
  function normalize(text) {
    return String(text)
      .toLowerCase()
      .replace(/[’‘]/g, "'")
      .replace(/[.,!?;:]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * 例文中の該当語を空所に置き換える。
   * 語形변化した形（-s / -ed / -ing など）も探し、その形も正解として受け付ける。
   */
  function buildQuestions(words, mode, length) {
    return shuffle(words)
      .slice(0, length)
      .map((w) => ({ word: w, prompt: w.meaning, accepted: [w.word] }));
  }

  function resetQuizToSetup() {
    stopTempo();
    updateFilterCount();
    const enough = getFilteredWords().length > 0;
    $('#quiz-body').hidden = true;
    $('#tempo-body').hidden = true;
    $('#quiz-result').hidden = true;
    $('#quiz-empty').hidden = enough;
    $('#quiz-setup').hidden = !enough;
  }

  function startQuiz(mode, wordsOverride) {
    // サクサク4択は入力ではなくタップで答えるので、専用の画面に切り替える
    if (mode === 'tempo') {
      startTempo(wordsOverride);
      return;
    }

    const settings = Storage.getSettings();
    const words = wordsOverride || getFilteredWords();
    quiz.mode = mode;
    quiz.questions = buildQuestions(words, mode, settings.quizLength);
    quiz.index = 0;
    quiz.correct = 0;
    quiz.results = [];

    if (quiz.questions.length === 0) {
      toast('出題できる単語がありません');
      return;
    }

    Storage.incrementSessions();
    $('#quiz-setup').hidden = true;
    $('#quiz-result').hidden = true;
    $('#tempo-body').hidden = true;
    $('#quiz-body').hidden = false;
    renderQuestion();
  }

  function renderQuestion() {
    const q = quiz.questions[quiz.index];
    quiz.answered = false;
    quiz.hintLevel = 0;

    $('#quiz-counter').textContent = `${quiz.index + 1} / ${quiz.questions.length}`;
    $('#quiz-progress').style.width = `${(quiz.index / quiz.questions.length) * 100}%`;
    $('#quiz-score').textContent = `正解 ${quiz.correct}`;
    $('#quiz-label').textContent = MODE_LABELS[quiz.mode];

    $('#quiz-question').textContent = q.prompt;

    const input = $('#quiz-input');
    input.value = '';
    input.disabled = false;
    input.classList.remove('is-correct', 'is-wrong');
    $('#quiz-hint').textContent = '';
    $('#quiz-form').hidden = false;
    $('#quiz-feedback').hidden = true;
    input.focus();
  }

  function showHint() {
    if (quiz.answered) return;
    const q = quiz.questions[quiz.index];
    quiz.hintLevel += 1;

    const word = q.word.word;
    const shown = Math.min(quiz.hintLevel, word.length - 1);
    const masked = word
      .split('')
      .map((ch, i) => (i < shown ? ch : ch === ' ' ? ' ' : '_'))
      .join(' ');

    $('#quiz-hint').textContent = `${masked}（${word.replace(/\s/g, '').length} 文字）`;
  }

  function gradeAnswer(typed) {
    const q = quiz.questions[quiz.index];
    const isCorrect = q.accepted.some((a) => normalize(a) === normalize(typed));

    quiz.answered = true;
    Storage.recordAnswer(q.word.id, isCorrect);
    // 正解した単語は自動で「覚えた」にチェックが付く
    if (isCorrect) Storage.setLearned(q.word.id, true);
    if (isCorrect) quiz.correct += 1;
    quiz.results.push({ word: q.word, isCorrect, typed: typed.trim() });

    const input = $('#quiz-input');
    input.disabled = true;
    input.classList.add(isCorrect ? 'is-correct' : 'is-wrong');

    $('#quiz-score').textContent = `正解 ${quiz.correct}`;
    $('#feedback-title').textContent = isCorrect ? '⭕️ 正解' : '❌ 不正解';
    $('#feedback-typed').textContent = isCorrect
      ? ''
      : typed.trim()
        ? `あなたの入力: ${typed.trim()} ／ 正解: ${q.word.word}`
        : `正解: ${q.word.word}`;
    $('#feedback-detail').textContent =
      [q.word.word, q.word.phonetic, q.word.pos].filter(Boolean).join(' ') + ` … ${q.word.meaning}`;
    $('#feedback-note').textContent = q.word.note ? `⚠ ${q.word.note}` : '';
    $('#feedback-note').hidden = !q.word.note;
    $('#feedback-example').textContent = q.word.example
      ? `${q.word.example} / ${q.word.exampleJa}`
      : '';
    $('#quiz-next').textContent =
      quiz.index === quiz.questions.length - 1 ? '結果を見る →' : '次の問題 →';
    $('#quiz-feedback').hidden = false;
    $('#quiz-next').focus();
  }

  function nextQuestion() {
    if (quiz.index === quiz.questions.length - 1) {
      showResult();
      return;
    }
    quiz.index += 1;
    renderQuestion();
  }

  function showResult(extra) {
    const total = quiz.questions.length;
    const rate = Math.round((quiz.correct / total) * 100);

    $('#result-extra').textContent = extra || '';
    $('#result-extra').hidden = !extra;

    $('#quiz-body').hidden = true;
    $('#tempo-body').hidden = true;
    $('#quiz-result').hidden = false;
    $('#result-correct').textContent = quiz.correct;
    $('#result-total').textContent = total;
    $('#result-rate').textContent = `正答率 ${rate}%`;
    $('#result-emoji').textContent = rate === 100 ? '🏆' : rate >= 80 ? '🎉' : rate >= 50 ? '💪' : '📖';

    $('#result-list').innerHTML = quiz.results
      .map((r) => {
        // detail はサクサク4択で使う補足（選んだ答え・時間切れ）
        const right = r.isCorrect
          ? r.word.meaning
          : r.detail || (r.typed ? `入力: ${r.typed}` : r.word.meaning);
        return `<div class="result-item ${r.isCorrect ? 'ok' : 'ng'}">
          <span>${r.isCorrect ? '⭕️' : '❌'}</span>
          <b>${escapeHtml(r.word.word)}</b>
          <span>${escapeHtml(right)}</span>
        </div>`;
      })
      .join('');

    const wrongWords = quiz.results.filter((r) => !r.isCorrect).map((r) => r.word);
    $('#result-wrong-only').hidden = wrongWords.length === 0;
    $('#result-wrong-only').onclick = () => startQuiz(quiz.mode, wrongWords);
  }

  function initQuiz() {
    $$('[data-quiz-mode]').forEach((btn) => {
      btn.addEventListener('click', () => startQuiz(btn.dataset.quizMode));
    });

    // Enter で採点 → もう一度 Enter で次の問題へ進める
    $('#quiz-form').addEventListener('submit', (e) => {
      e.preventDefault();
      if (quiz.answered) nextQuestion();
      else gradeAnswer($('#quiz-input').value);
    });

    $('#quiz-skip').addEventListener('click', () => {
      if (!quiz.answered) gradeAnswer('');
    });
    $('#quiz-hint-btn').addEventListener('click', showHint);
    $('#quiz-next').addEventListener('click', nextQuestion);
    $('#result-retry').addEventListener('click', () => startQuiz(quiz.mode));
  }

  // ============================================================
  // サクサク4択（テンポ重視・制限時間つき）
  // ============================================================
  //
  // 入力式のクイズは1問に時間がかかるので、暗記の初期段階では
  // 「短い時間で大量の単語に触れる」ほうが効く。そのための軽い形式。

  const tempo = {
    questions: [],
    index: 0,
    correct: 0,
    results: [],
    combo: 0,      // 連続正解数
    bestCombo: 0,
    totalTime: 0,  // 解答にかかった時間の合計（ミリ秒）
    startedAt: 0,
    limit: 5,      // 1問あたりの制限時間（秒）。0 なら無制限
    locked: true,  // 採点後、次の問題までの入力を止める
    timerId: null,
    advanceId: null
  };

  const TEMPO_CORRECT_WAIT = 550;  // 正解ならすぐ次へ
  const TEMPO_WRONG_WAIT = 1600;   // 間違えたら正解を読む時間を置く

  /** 4択を作る。誤答は同じカテゴリの語を優先して選ぶ */
  function buildTempoQuestions(words, length) {
    const source = shuffle(words).slice(0, length);

    return source.map((w) => {
      const sameCategory = WORD_DATA.filter((x) => x.category === w.category && x.id !== w.id);
      const anyOther = WORD_DATA.filter((x) => x.id !== w.id);
      const used = new Set([w.meaning]);
      const wrong = [];

      for (const cand of shuffle(sameCategory).concat(shuffle(anyOther))) {
        if (wrong.length >= 3) break;
        if (used.has(cand.meaning)) continue; // 同じ意味が2つ並ばないようにする
        used.add(cand.meaning);
        wrong.push(cand.meaning);
      }

      return { word: w, choices: shuffle([w.meaning, ...wrong]) };
    });
  }

  function startTempo(wordsOverride) {
    const settings = Storage.getSettings();
    const words = wordsOverride || getFilteredWords();

    tempo.questions = buildTempoQuestions(words, settings.quizLength);
    if (tempo.questions.length === 0) {
      toast('出題できる単語がありません');
      return;
    }

    tempo.index = 0;
    tempo.correct = 0;
    tempo.results = [];
    tempo.combo = 0;
    tempo.bestCombo = 0;
    tempo.totalTime = 0;
    tempo.limit = Number(settings.tempoTime) || 0;

    quiz.mode = 'tempo'; // 結果画面の「もう一度」から戻ってこられるように

    Storage.incrementSessions();
    $('#quiz-setup').hidden = true;
    $('#quiz-result').hidden = true;
    $('#quiz-body').hidden = true;
    $('#tempo-body').hidden = false;
    renderTempo();
  }

  function renderTempo() {
    const q = tempo.questions[tempo.index];
    tempo.locked = false;

    $('#tempo-counter').textContent = `${tempo.index + 1} / ${tempo.questions.length}`;
    $('#tempo-progress').style.width = `${(tempo.index / tempo.questions.length) * 100}%`;
    $('#tempo-score').textContent = `正解 ${tempo.correct}`;
    renderCombo();

    $('#tempo-word').textContent = q.word.word;
    $('#tempo-phonetic').textContent = q.word.phonetic || '';

    $('#tempo-choices').innerHTML = q.choices
      .map(
        (c, i) => `<button type="button" class="tempo-choice" data-tempo-choice="${i}">
          <span class="tempo-num">${i + 1}</span><span>${escapeHtml(c)}</span>
        </button>`
      )
      .join('');

    if (Storage.getSettings().autoSpeak) Speech.speak(q.word.word);

    tempo.startedAt = Date.now();
    startTempoTimer();
  }

  function renderCombo() {
    // 2連続からは炎を出して勢いが見えるようにする
    $('#tempo-combo').textContent = tempo.combo >= 2 ? `🔥 ${tempo.combo} 連続正解` : '';
  }

  function startTempoTimer() {
    const track = $('#tempo-timer-track');
    const fill = $('#tempo-timer');

    if (!tempo.limit) {
      track.hidden = true;
      return;
    }

    track.hidden = false;
    // いったんアニメーションを切って幅を戻し、次のフレームから縮め始める
    fill.style.transition = 'none';
    fill.style.width = '100%';
    void fill.offsetWidth;
    fill.style.transition = `width ${tempo.limit}s linear`;
    fill.style.width = '0%';

    tempo.timerId = setTimeout(() => answerTempo(-1), tempo.limit * 1000);
  }

  /** 採点した時点でバーの動きを止める */
  function freezeTempoTimer() {
    const fill = $('#tempo-timer');
    if (!fill) return;
    const current = getComputedStyle(fill).width;
    fill.style.transition = 'none';
    fill.style.width = current;
  }

  /** 画面を離れたときなど、動いているタイマーをすべて止める */
  function stopTempo() {
    if (tempo.timerId) clearTimeout(tempo.timerId);
    if (tempo.advanceId) clearTimeout(tempo.advanceId);
    tempo.timerId = null;
    tempo.advanceId = null;
    tempo.locked = true;
    freezeTempoTimer();
  }

  /** choiceIndex が -1 なら時間切れ */
  function answerTempo(choiceIndex) {
    if (tempo.locked) return;
    tempo.locked = true;

    if (tempo.timerId) clearTimeout(tempo.timerId);
    tempo.timerId = null;
    freezeTempoTimer();

    const q = tempo.questions[tempo.index];
    const timedOut = choiceIndex < 0;
    const chosen = timedOut ? null : q.choices[choiceIndex];
    const isCorrect = !timedOut && chosen === q.word.meaning;

    tempo.totalTime += Date.now() - tempo.startedAt;
    Storage.recordAnswer(q.word.id, isCorrect);
    // 4択はまぐれ当たりもあるので、ここでは「覚えた」チェックは付けない

    if (isCorrect) {
      tempo.correct += 1;
      tempo.combo += 1;
      tempo.bestCombo = Math.max(tempo.bestCombo, tempo.combo);
    } else {
      tempo.combo = 0;
    }

    tempo.results.push({
      word: q.word,
      isCorrect,
      detail: timedOut ? '⏰ 時間切れ' : `選んだ答え: ${chosen}`
    });

    const correctIndex = q.choices.indexOf(q.word.meaning);
    $$('#tempo-choices .tempo-choice').forEach((btn, i) => {
      btn.disabled = true;
      if (i === correctIndex) btn.classList.add('is-correct');
      if (!isCorrect && i === choiceIndex) btn.classList.add('is-wrong');
    });

    $('#tempo-score').textContent = `正解 ${tempo.correct}`;
    renderCombo();

    tempo.advanceId = setTimeout(nextTempo, isCorrect ? TEMPO_CORRECT_WAIT : TEMPO_WRONG_WAIT);
  }

  function nextTempo() {
    tempo.advanceId = null;
    if (tempo.index === tempo.questions.length - 1) {
      showTempoResult();
      return;
    }
    tempo.index += 1;
    renderTempo();
  }

  function showTempoResult() {
    // 結果画面は入力式クイズと共通のものを使う
    quiz.questions = tempo.questions;
    quiz.results = tempo.results;
    quiz.correct = tempo.correct;
    quiz.mode = 'tempo';

    const avg = (tempo.totalTime / tempo.questions.length / 1000).toFixed(1);
    showResult(`平均 ${avg} 秒／問 ・ 最高 ${tempo.bestCombo} 連続正解`);
  }

  function initTempo() {
    $('#tempo-choices').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-tempo-choice]');
      if (btn) answerTempo(Number(btn.dataset.tempoChoice));
    });

    $('#tempo-speak').addEventListener('click', () => {
      const q = tempo.questions[tempo.index];
      if (q) Speech.speak(q.word.word);
    });

    $('#tempo-quit').addEventListener('click', resetQuizToSetup);

    // PC では 1〜4 のキーでも答えられる
    document.addEventListener('keydown', (e) => {
      if ($('#tempo-body').hidden) return;
      const n = Number(e.key);
      const q = tempo.questions[tempo.index];
      if (q && n >= 1 && n <= q.choices.length) {
        e.preventDefault();
        answerTempo(n - 1);
      }
    });
  }

  // ============================================================
  // 長文読解
  // ============================================================

  // order は選択肢の表示順。毎回シャッフルするので、正解の位置を覚えてしまうことがない
  const reading = { passage: null, index: 0, correct: 0, results: [], answered: false, order: [] };

  /** 設問ごとの学習履歴IDを作る（例: r3-2） */
  const readingQuestionId = (passage, i) => `${passage.id}-${i + 1}`;

  function readingSolved(passage) {
    return passage.questions.filter((q, i) => Storage.isLearned(readingQuestionId(passage, i))).length;
  }

  function showReadingList() {
    $('#reading-body').hidden = true;
    $('#reading-result').hidden = true;
    $('#reading-list-view').hidden = false;

    const level = $('#reading-level').value;
    const list = READING_DATA.filter((r) => level === 'all' || String(r.level) === level);

    $('#reading-list').innerHTML = list
      .map((r) => {
        const solved = readingSolved(r);
        const done = solved === r.questions.length;
        return `<button class="reading-item ${done ? 'is-done' : ''}" data-passage="${r.id}">
            <span class="reading-item-head">
              <span class="reading-item-title">${done ? '✓ ' : ''}${escapeHtml(r.title)}</span>
              <span class="badge badge-ghost">${levelLabel(r.level)}</span>
            </span>
            <span class="reading-item-meta">${escapeHtml(r.topic)} ／ 約${r.words}語 ／ 設問${r.questions.length}問</span>
            <span class="reading-item-progress">正解 ${solved} / ${r.questions.length}</span>
          </button>`;
      })
      .join('') || '<p class="hint">該当する長文がありません。</p>';

    const done = list.filter((r) => readingSolved(r) === r.questions.length).length;
    $('#reading-count').textContent = `${list.length} 本中 ${done} 本が全問正解`;
  }

  /**
   * ランダムに1本選ぶ。
   * まだ全問正解していない本文を優先する。全部終わっていたら、そのときは
   * 全体から選び直す（復習になる）。何を読むか迷う時間をなくすためのもの。
   */
  function startRandomReading() {
    const level = $('#reading-level').value;
    const pool = READING_DATA.filter((r) => level === 'all' || String(r.level) === level);
    if (!pool.length) {
      toast('この難易度の長文がありません');
      return;
    }
    const unfinished = pool.filter((r) => readingSolved(r) < r.questions.length);
    const from = unfinished.length ? unfinished : pool;
    startReading(from[Math.floor(Math.random() * from.length)].id);
  }

  function startReading(passageId) {
    const passage = READING_DATA.find((r) => r.id === passageId);
    if (!passage) return;

    reading.passage = passage;
    reading.index = 0;
    reading.correct = 0;
    reading.results = [];

    Storage.incrementSessions();
    $('#reading-list-view').hidden = true;
    $('#reading-result').hidden = true;
    $('#reading-body').hidden = false;

    $('#passage-meta').textContent = `${passage.topic} ／ ${levelLabel(passage.level)} ／ 約${passage.words}語`;
    $('#passage-title').textContent = passage.title;
    $('#passage-text').innerHTML = passage.passage
      .split('\n')
      .map((line) => `<p>${escapeHtml(line)}</p>`)
      .join('');
    $('#glossary-list').innerHTML = passage.glossary
      .map((g) => `<dt>${escapeHtml(g.w)}</dt><dd>${escapeHtml(g.m)}</dd>`)
      .join('');
    $('#passage-glossary').hidden = passage.glossary.length === 0;
    $('#passage-glossary').open = false;

    renderReadingQuestion();
    window.scrollTo(0, 0);
  }

  function renderReadingQuestion() {
    const passage = reading.passage;
    const q = passage.questions[reading.index];
    reading.answered = false;

    $('#reading-counter').textContent = `設問 ${reading.index + 1} / ${passage.questions.length}`;
    $('#reading-progress').style.width = `${(reading.index / passage.questions.length) * 100}%`;
    $('#reading-score').textContent = `正解 ${reading.correct}`;
    $('#reading-question').textContent = q.q;

    // 選択肢の並びは毎回シャッフルする
    reading.order = shuffle(q.choices.map((_, i) => i));

    const box = $('#reading-choices');
    box.innerHTML = '';
    reading.order.forEach((originalIndex, displayIndex) => {
      const btn = document.createElement('button');
      btn.className = 'choice';
      btn.textContent = `${'ABCD'[displayIndex]}. ${q.choices[originalIndex]}`;
      btn.addEventListener('click', () => answerReading(originalIndex, btn));
      box.appendChild(btn);
    });

    $('#reading-feedback').hidden = true;
  }

  function answerReading(picked, btn) {
    if (reading.answered) return;
    reading.answered = true;

    const passage = reading.passage;
    const q = passage.questions[reading.index];
    const isCorrect = picked === q.answer;
    const id = readingQuestionId(passage, reading.index);

    Storage.recordAnswer(id, isCorrect);
    if (isCorrect) {
      Storage.setLearned(id, true);
      reading.correct += 1;
    }
    reading.results.push({ q, isCorrect });

    const correctDisplayIndex = reading.order.indexOf(q.answer);
    $$('#reading-choices .choice').forEach((el, i) => {
      el.disabled = true;
      if (i === correctDisplayIndex) el.classList.add('is-correct');
    });
    if (!isCorrect) btn.classList.add('is-wrong');

    $('#reading-score').textContent = `正解 ${reading.correct}`;
    $('#reading-feedback-title').textContent = isCorrect
      ? '⭕️ 正解'
      : `❌ 不正解（正解は ${'ABCD'[correctDisplayIndex]}）`;
    $('#reading-explanation').textContent = q.explanation;
    $('#reading-next').textContent =
      reading.index === passage.questions.length - 1 ? '結果を見る →' : '次の設問 →';
    $('#reading-feedback').hidden = false;
  }

  function nextReadingQuestion() {
    if (reading.index === reading.passage.questions.length - 1) {
      showReadingResult();
      return;
    }
    reading.index += 1;
    renderReadingQuestion();
  }

  function showReadingResult() {
    const total = reading.passage.questions.length;
    const rate = Math.round((reading.correct / total) * 100);

    // 献立は「何本読んだか」で数えるので、ここで1本ぶん記録する
    Storage.completePassage();

    $('#reading-body').hidden = true;
    $('#reading-result').hidden = false;
    $('#reading-result-correct').textContent = reading.correct;
    $('#reading-result-total').textContent = total;
    $('#reading-result-rate').textContent = `正答率 ${rate}%`;
    $('#reading-result-emoji').textContent =
      rate === 100 ? '🏆' : rate >= 80 ? '🎉' : rate >= 50 ? '💪' : '📖';

    $('#reading-result-list').innerHTML = reading.results
      .map(
        (r, i) => `<div class="result-item ${r.isCorrect ? 'ok' : 'ng'}">
          <span>${r.isCorrect ? '⭕️' : '❌'}</span>
          <b>設問${i + 1}</b>
          <span>${escapeHtml(r.q.q)}</span>
        </div>`
      )
      .join('');
    window.scrollTo(0, 0);
  }

  function initReading() {
    $('#reading-level').addEventListener('change', showReadingList);
    $('#reading-random').addEventListener('click', startRandomReading);

    $('#reading-list').addEventListener('click', (e) => {
      const item = e.target.closest('[data-passage]');
      if (item) startReading(item.dataset.passage);
    });

    $('#reading-back').addEventListener('click', showReadingList);
    $('#reading-to-list').addEventListener('click', showReadingList);
    $('#reading-next').addEventListener('click', nextReadingQuestion);
    $('#reading-retry').addEventListener('click', () => startReading(reading.passage.id));
  }

  // ============================================================
  // 算数
  // ============================================================

  const mathQuiz = { questions: [], index: 0, correct: 0, results: [], answered: false };

  function getFilteredMath() {
    const s = Storage.getSettings();
    return MATH_DATA.filter((p) => {
      if (s.mathLevel !== 'all' && String(p.level) !== String(s.mathLevel)) return false;
      if (s.mathCategory !== 'all' && p.category !== s.mathCategory) return false;
      if (s.mathScope === 'unlearned') return !Storage.isLearned(p.id);
      if (s.mathScope === 'weak') return Storage.getRecord(p.id).wrong > 0;
      return true;
    });
  }

  function updateMathCount() {
    $('#math-count').textContent = `対象: ${getFilteredMath().length} 問`;
  }

  /** 答えの表記ゆれを吸収する。分数（3/4）も受け付ける */
  function toNumber(text) {
    const t = String(text).trim().replace(/[,\s]/g, '').replace(/^\+/, '');
    if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t);
    const frac = t.match(/^(-?\d+)\/(\d+)$/);
    if (frac) return Number(frac[1]) / Number(frac[2]);
    return NaN;
  }

  /**
   * 図を出す。図の無い問題も多いので、呼び出し側では分岐させない。
   * SVG は数値から組み立てたものだけで、外から来た文字列は入らない
   */
  function showFigure(el, spec) {
    const svg = MathFigure.render(spec);
    el.innerHTML = svg;
    el.hidden = !svg;
  }

  function isMathCorrect(input, answer) {
    const a = toNumber(input);
    const b = toNumber(answer);
    if (Number.isFinite(a) && Number.isFinite(b)) return Math.abs(a - b) < 1e-9;
    // 比（3:4）など数にならない答え。空白の入れ方で不正解にしないよう詰めて比べる
    const flat = (t) => String(t).replace(/\s/g, '').toLowerCase();
    return flat(input) === flat(answer);
  }

  function resetMathToSetup() {
    // 習得マップから飛んでくると設定だけが変わっているので、選択欄を合わせ直す
    const s = Storage.getSettings();
    $('#math-category').value = s.mathCategory;
    $('#math-level').value = s.mathLevel;
    $('#math-scope').value = s.mathScope;
    $('#math-format').value = s.mathFormat;

    updateMathCount();
    $('#math-body').hidden = true;
    $('#math-result').hidden = true;
    $('#math-setup').hidden = false;
  }

  function startMath(override) {
    const settings = Storage.getSettings();
    const source = override || shuffle(getFilteredMath());
    mathQuiz.questions = source.slice(0, override ? source.length : settings.mathLength);
    mathQuiz.index = 0;
    mathQuiz.correct = 0;
    mathQuiz.results = [];

    if (mathQuiz.questions.length === 0) {
      toast('出題できる問題がありません');
      return;
    }

    Storage.incrementSessions();
    $('#math-setup').hidden = true;
    $('#math-result').hidden = true;
    $('#math-body').hidden = false;
    renderMathQuestion();
  }

  /**
   * 4択を出すかどうか。設定が4択で、その問題の選択肢が作れるときだけ。
   * 選択肢が作れない問題（誤答が3つそろわない）は自由入力に落とす
   */
  function choicesFor(p) {
    if (Storage.getSettings().mathFormat !== 'choice') return null;
    return MathChoices.build(p);
  }

  function renderMathQuestion() {
    const p = mathQuiz.questions[mathQuiz.index];
    mathQuiz.answered = false;
    mathQuiz.choice = choicesFor(p);

    $('#math-counter').textContent = `${mathQuiz.index + 1} / ${mathQuiz.questions.length}`;
    $('#math-progress').style.width = `${(mathQuiz.index / mathQuiz.questions.length) * 100}%`;
    $('#math-score').textContent = `正解 ${mathQuiz.correct}`;
    $('#math-tag').textContent = `${p.category} ／ ${mathLevelLabel(p.level)}`;
    $('#math-question').textContent = p.question;
    showFigure($('#math-figure'), p.figure);
    $('#math-unit').textContent = p.unit;
    $('#math-unit').hidden = !p.unit;

    const box = $('#math-choices');
    const input = $('#math-input');
    input.value = '';
    input.disabled = false;
    input.classList.remove('is-correct', 'is-wrong');
    $('#math-feedback').hidden = true;

    if (mathQuiz.choice) {
      box.innerHTML = '';
      mathQuiz.choice.choices.forEach((text, i) => {
        const btn = document.createElement('button');
        btn.className = 'choice';
        btn.textContent = `${'ABCD'[i]}. ${text}${p.unit ? ' ' + p.unit : ''}`;
        btn.addEventListener('click', () => {
          if (!mathQuiz.answered) gradeMath(mathQuiz.choice.choices[i]);
        });
        box.appendChild(btn);
      });
      box.hidden = false;
      $('#math-form').hidden = true;
    } else {
      box.hidden = true;
      $('#math-form').hidden = false;
      input.focus();
    }
  }

  function gradeMath(typed) {
    const p = mathQuiz.questions[mathQuiz.index];
    const isCorrect = typed.trim() !== '' && isMathCorrect(typed, p.answer);

    mathQuiz.answered = true;
    Storage.recordAnswer(p.id, isCorrect);
    if (isCorrect) {
      Storage.setLearned(p.id, true);
      mathQuiz.correct += 1;
    }
    mathQuiz.results.push({ problem: p, isCorrect, typed: typed.trim() });

    if (mathQuiz.choice) {
      // 押したものと正解の両方に印を付ける。どれが正解だったかが分からないと復習にならない
      [...$('#math-choices').children].forEach((btn, i) => {
        btn.disabled = true;
        if (i === mathQuiz.choice.answer) btn.classList.add('is-correct');
        else if (mathQuiz.choice.choices[i] === typed.trim()) btn.classList.add('is-wrong');
      });
    } else {
      const input = $('#math-input');
      input.disabled = true;
      input.classList.add(isCorrect ? 'is-correct' : 'is-wrong');
    }

    $('#math-score').textContent = `正解 ${mathQuiz.correct}`;
    $('#math-feedback-title').textContent = isCorrect ? '⭕️ 正解' : '❌ 不正解';
    $('#math-feedback-answer').textContent = isCorrect
      ? ''
      : `正解: ${p.answer}${p.unit ? ' ' + p.unit : ''}${typed.trim() ? `（あなたの入力: ${typed.trim()}）` : ''}`;
    $('#math-explanation').textContent = p.explanation;
    $('#math-next').textContent =
      mathQuiz.index === mathQuiz.questions.length - 1 ? '結果を見る →' : '次の問題 →';
    $('#math-feedback').hidden = false;
    $('#math-next').focus();
  }

  function nextMathQuestion() {
    if (mathQuiz.index === mathQuiz.questions.length - 1) {
      showMathResult();
      return;
    }
    mathQuiz.index += 1;
    renderMathQuestion();
  }

  function showMathResult() {
    const total = mathQuiz.questions.length;
    const rate = Math.round((mathQuiz.correct / total) * 100);

    $('#math-body').hidden = true;
    $('#math-result').hidden = false;
    $('#math-result-correct').textContent = mathQuiz.correct;
    $('#math-result-total').textContent = total;
    $('#math-result-rate').textContent = `正答率 ${rate}%`;
    $('#math-result-emoji').textContent =
      rate === 100 ? '🏆' : rate >= 80 ? '🎉' : rate >= 50 ? '💪' : '📖';

    $('#math-result-list').innerHTML = mathQuiz.results
      .map(
        (r) => `<div class="result-item ${r.isCorrect ? 'ok' : 'ng'}">
          <span>${r.isCorrect ? '⭕️' : '❌'}</span>
          <b>${escapeHtml(r.problem.category)}</b>
          <span>${escapeHtml(r.isCorrect ? r.problem.question : `正解 ${r.problem.answer}`)}</span>
        </div>`
      )
      .join('');

    const wrong = mathQuiz.results.filter((r) => !r.isCorrect).map((r) => r.problem);
    $('#math-wrong-only').hidden = wrong.length === 0;
    $('#math-wrong-only').onclick = () => startMath(wrong);
  }

  function initMath() {
    $('#math-category').innerHTML =
      '<option value="all">すべて</option>' +
      MATH_CATEGORIES.map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');

    const s = Storage.getSettings();
    $('#math-category').value = s.mathCategory;
    $('#math-level').value = s.mathLevel;
    $('#math-scope').value = s.mathScope;
    $('#math-format').value = s.mathFormat;
    $('#math-length').value = String(s.mathLength);

    const bind = (sel, key, cast) => {
      $(sel).addEventListener('change', (e) => {
        Storage.updateSettings({ [key]: cast ? cast(e.target.value) : e.target.value });
        updateMathCount();
      });
    };
    bind('#math-category', 'mathCategory');
    bind('#math-level', 'mathLevel');
    bind('#math-scope', 'mathScope');
    bind('#math-format', 'mathFormat');
    bind('#math-length', 'mathLength', Number);

    $('#math-start').addEventListener('click', () => startMath());
    $('#math-retry').addEventListener('click', () => startMath());
    $('#math-next').addEventListener('click', nextMathQuestion);
    $('#math-skip').addEventListener('click', () => {
      if (!mathQuiz.answered) gradeMath('');
    });

    // Enter で採点 → もう一度 Enter で次の問題へ
    $('#math-form').addEventListener('submit', (e) => {
      e.preventDefault();
      if (mathQuiz.answered) nextMathQuestion();
      else gradeMath($('#math-input').value);
    });
  }

  // ============================================================
  // 文法（Language Usage）
  // ============================================================
  //
  // 本番（MAP Growth）の Language Usage にあたる科目。
  // データは js/grammar-data.js（TOEFL Junior 対策教材3冊から取り込んだ706問）。
  //
  // 算数と違って**自由入力は無い**。文法は「正しい形を選べるか」を問うもので、
  // 綴りを打たせても測るものが変わるだけなので、常に選択式にしてある。

  const grammarQuiz = { questions: [], index: 0, correct: 0, results: [], answered: false, order: [] };

  function getFilteredGrammar() {
    const s = Storage.getSettings();
    return GRAMMAR_DATA.filter((q) => {
      if (s.grammarLevel !== 'all' && String(q.level) !== String(s.grammarLevel)) return false;
      if (s.grammarUnit !== 'all' && q.unit !== s.grammarUnit) return false;
      if (s.grammarScope === 'unlearned') return !Storage.isLearned(q.id);
      if (s.grammarScope === 'weak') return Storage.getRecord(q.id).wrong > 0;
      return true;
    });
  }

  function updateGrammarCount() {
    $('#grammar-count').textContent = `対象: ${getFilteredGrammar().length} 問`;
  }

  function resetGrammarToSetup() {
    const s = Storage.getSettings();
    $('#grammar-unit').value = s.grammarUnit;
    $('#grammar-level').value = s.grammarLevel;
    $('#grammar-scope').value = s.grammarScope;

    updateGrammarCount();
    $('#grammar-body').hidden = true;
    $('#grammar-result').hidden = true;
    $('#grammar-setup').hidden = false;
  }

  function startGrammar(override) {
    const settings = Storage.getSettings();
    const source = override || shuffle(getFilteredGrammar());
    grammarQuiz.questions = source.slice(0, override ? source.length : settings.grammarLength);
    grammarQuiz.index = 0;
    grammarQuiz.correct = 0;
    grammarQuiz.results = [];

    if (grammarQuiz.questions.length === 0) {
      toast('出題できる問題がありません');
      return;
    }

    Storage.incrementSessions();
    $('#grammar-setup').hidden = true;
    $('#grammar-result').hidden = true;
    $('#grammar-body').hidden = false;
    renderGrammarQuestion();
  }

  function renderGrammarQuestion() {
    const q = grammarQuiz.questions[grammarQuiz.index];
    grammarQuiz.answered = false;
    // 選択肢の並びは毎回混ぜる。データの並び順を覚えても正解できないようにするため
    grammarQuiz.order = shuffle(q.choices.map((_, i) => i));

    $('#grammar-counter').textContent = `${grammarQuiz.index + 1} / ${grammarQuiz.questions.length}`;
    $('#grammar-progress').style.width =
      `${(grammarQuiz.index / grammarQuiz.questions.length) * 100}%`;
    $('#grammar-score').textContent = `正解 ${grammarQuiz.correct}`;
    $('#grammar-tag').textContent = `${q.unit} ／ ${levelLabel(q.level)}`;
    $('#grammar-question').textContent = q.question;

    const box = $('#grammar-choices');
    box.innerHTML = '';
    grammarQuiz.order.forEach((originalIndex, displayIndex) => {
      const btn = document.createElement('button');
      btn.className = 'choice';
      btn.textContent = `${'ABCD'[displayIndex]}. ${q.choices[originalIndex]}`;
      btn.addEventListener('click', () => {
        if (!grammarQuiz.answered) gradeGrammar(originalIndex);
      });
      box.appendChild(btn);
    });
    $('#grammar-feedback').hidden = true;
  }

  function gradeGrammar(pickedIndex) {
    const q = grammarQuiz.questions[grammarQuiz.index];
    const isCorrect = pickedIndex === q.answer;

    grammarQuiz.answered = true;
    Storage.recordAnswer(q.id, isCorrect);
    if (isCorrect) {
      Storage.setLearned(q.id, true);
      grammarQuiz.correct += 1;
    }
    grammarQuiz.results.push({ q, isCorrect });

    // 押したものと正解の両方に印を付ける。どれが正解だったかが分からないと復習にならない
    const correctDisplayIndex = grammarQuiz.order.indexOf(q.answer);
    [...$('#grammar-choices').children].forEach((btn, i) => {
      btn.disabled = true;
      if (i === correctDisplayIndex) btn.classList.add('is-correct');
      else if (grammarQuiz.order[i] === pickedIndex) btn.classList.add('is-wrong');
    });

    $('#grammar-score').textContent = `正解 ${grammarQuiz.correct}`;
    $('#grammar-feedback-title').textContent = isCorrect ? '⭕️ 正解' : '❌ 不正解';
    // **空にするだけでは消えない。**この2つは背景色を持つので、
    // 中身が無いと灰色の帯だけが残る（正解したときにそれが出ていた）
    const answerLine = $('#grammar-feedback-answer');
    answerLine.textContent = isCorrect ? '' : `正解: ${q.choices[q.answer]}`;
    answerLine.hidden = isCorrect;
    const explLine = $('#grammar-explanation');
    explLine.textContent = q.explanation;
    explLine.hidden = !q.explanation;
    $('#grammar-next').textContent =
      grammarQuiz.index === grammarQuiz.questions.length - 1 ? '結果を見る →' : '次の問題 →';
    $('#grammar-feedback').hidden = false;
    $('#grammar-next').focus();
  }

  function nextGrammarQuestion() {
    if (grammarQuiz.index === grammarQuiz.questions.length - 1) {
      showGrammarResult();
      return;
    }
    grammarQuiz.index += 1;
    renderGrammarQuestion();
  }

  function showGrammarResult() {
    const total = grammarQuiz.questions.length;
    const rate = Math.round((grammarQuiz.correct / total) * 100);

    $('#grammar-body').hidden = true;
    $('#grammar-result').hidden = false;
    $('#grammar-result-correct').textContent = grammarQuiz.correct;
    $('#grammar-result-total').textContent = total;
    $('#grammar-result-rate').textContent = `正答率 ${rate}%`;
    $('#grammar-result-emoji').textContent =
      rate === 100 ? '🏆' : rate >= 80 ? '🎉' : rate >= 50 ? '💪' : '📖';

    $('#grammar-result-list').innerHTML = grammarQuiz.results
      .map(
        (r) => `<div class="result-item ${r.isCorrect ? 'ok' : 'ng'}">
          <span>${r.isCorrect ? '⭕️' : '❌'}</span>
          <b>${escapeHtml(r.q.unit)}</b>
          <span>${escapeHtml(r.isCorrect ? r.q.question : `正解 ${r.q.choices[r.q.answer]}`)}</span>
        </div>`
      )
      .join('');

    const wrong = grammarQuiz.results.filter((r) => !r.isCorrect).map((r) => r.q);
    $('#grammar-wrong-only').hidden = wrong.length === 0;
    $('#grammar-wrong-only').onclick = () => startGrammar(wrong);
  }

  function initGrammar() {
    // 単元の一覧はデータ側の並び（習う順）をそのまま使う。
    // 問題が1問も無い単元は出さない（選んでも0問になるだけなので）
    const used = new Set(GRAMMAR_DATA.map((q) => q.unit));
    $('#grammar-unit').innerHTML =
      '<option value="all">すべて</option>' +
      GRAMMAR_UNITS.filter((u) => used.has(u))
        .map((u) => `<option value="${escapeHtml(u)}">${escapeHtml(u)}</option>`)
        .join('');

    const s = Storage.getSettings();
    $('#grammar-unit').value = s.grammarUnit;
    $('#grammar-level').value = s.grammarLevel;
    $('#grammar-scope').value = s.grammarScope;
    $('#grammar-length').value = String(s.grammarLength);

    const bind = (sel, key, cast) => {
      $(sel).addEventListener('change', (e) => {
        Storage.updateSettings({ [key]: cast ? cast(e.target.value) : e.target.value });
        updateGrammarCount();
      });
    };
    bind('#grammar-unit', 'grammarUnit');
    bind('#grammar-level', 'grammarLevel');
    bind('#grammar-scope', 'grammarScope');
    bind('#grammar-length', 'grammarLength', Number);

    $('#grammar-start').addEventListener('click', () => startGrammar());
    $('#grammar-retry').addEventListener('click', () => startGrammar());
    $('#grammar-next').addEventListener('click', nextGrammarQuestion);
  }

  // ============================================================
  // 模擬試験
  // ============================================================

  const MOCK_SIZES = {
    short: { total: 20, minutes: 15 },
    standard: { total: 30, minutes: 30 },
    full: { total: 40, minutes: 45 }
  };

  // レベル判定のときは時間制限を外すぶん、問題数を少なくする
  const ADAPTIVE_SIZES = { short: { total: 15 }, standard: { total: 20 }, full: { total: 30 } };

  const MOCK_SIZE_LABELS = {
    fixed: { short: '短め（20問・15分）', standard: '標準（30問・30分）', full: '本番想定（40問・45分）' },
    adaptive: { short: '短め（15問）', standard: '標準（20問）', full: 'じっくり（30問）' }
  };

  // 単語と長文は4段階（CEFR B2 まで）、算数は3段階しかないので上限で頭打ちにする
  // 文法だけ**レベル1の問題が無い**（教材が A2 から始まるため）。
  // poolFor が空を返しても nextAdaptiveQuestion が別の科目へ回すので、階段は止まらない
  const MAX_LEVEL = { word: 4, math: 5, reading: 4, grammar: 4 };

  // 上下の向きが変わった回数がこれだけ溜まれば、レベルは十分に絞れたとみなす
  const ENOUGH_REVERSALS = 6;
  const MIN_ADAPTIVE_QUESTIONS = 10;

  const mock = {
    mode: 'fixed',
    questions: [],
    index: 0,
    answers: [],
    endAt: 0,
    timer: null,
    startedAt: 0,
    // ここから下はレベル判定のときだけ使う
    subject: 'both',
    maxQuestions: 0,
    level: 1,
    streak: 0,
    dir: 0,
    reversals: [],
    used: new Set(),
    done: false
  };

  /** 単語の4択（英単語 → 意味）を作る */
  function buildWordChoice(word) {
    const distractors = shuffle(WORD_DATA.filter((w) => w.id !== word.id && w.meaning !== word.meaning))
      .slice(0, 3);
    const options = shuffle([word, ...distractors]);
    return {
      kind: 'word',
      id: word.id,
      level: word.level,
      tag: `単語 ／ ${word.category}`,
      question: word.word,
      choices: options.map((o) => o.meaning),
      answer: options.findIndex((o) => o.id === word.id),
      explanation: `${word.word} … ${word.meaning}${word.example ? `／${word.example}` : ''}`
    };
  }

  function buildReadingQuestion(passage, q, i) {
    const order = shuffle(q.choices.map((_, k) => k));
    return {
      kind: 'reading',
      id: `${passage.id}-${i + 1}`,
      level: passage.level,
      tag: `長文読解 ／ ${passage.topic}`,
      passage,
      question: q.q,
      choices: order.map((k) => q.choices[k]),
      answer: order.indexOf(q.answer),
      explanation: q.explanation
    };
  }

  function buildMathQuestion(p) {
    return {
      kind: 'math',
      id: p.id,
      level: p.level,
      tag: `算数 ／ ${p.category}`,
      question: p.question,
      unit: p.unit,
      answer: p.answer,
      figure: p.figure,
      // 本番（MAP Growth）は4択。模擬試験では設定に関係なく4択にそろえる。
      // 選択肢が作れない問題だけ自由入力のまま
      choice: MathChoices.build(p),
      explanation: p.explanation
    };
  }

  function buildGrammarMockQuestion(q) {
    // 選択肢の並びは毎回混ぜる。データの並び順を覚えても意味が無いようにするため
    const order = shuffle(q.choices.map((_, k) => k));
    return {
      kind: 'grammar',
      id: q.id,
      level: q.level,
      tag: `文法 ／ ${q.unit}`,
      question: q.question,
      choices: order.map((k) => q.choices[k]),
      answer: order.indexOf(q.answer),
      explanation: q.explanation
    };
  }

  /** 出題内容を組み立てる。英語は単語・長文・文法を混ぜ、長文は1本ぶんまとめて出す */
  function buildMockQuestions(subject, total) {
    const questions = [];

    if (subject === 'math') {
      return shuffle(MATH_DATA).slice(0, total).map(buildMathQuestion);
    }

    if (subject === 'english') {
      const passage = shuffle(READING_DATA)[0];
      passage.questions.forEach((q, i) => questions.push(buildReadingQuestion(passage, q, i)));
      // 本番（MAP Growth）は Reading と Language Usage が別のセクションなので、
      // 英語のうちおよそ3分の1を文法にあてる
      shuffle(GRAMMAR_DATA)
        .slice(0, Math.max(Math.round(total / 3), 0))
        .forEach((g) => questions.push(buildGrammarMockQuestion(g)));
      shuffle(WORD_DATA)
        .slice(0, Math.max(total - questions.length, 0))
        .forEach((w) => questions.push(buildWordChoice(w)));
      return shuffle(questions).slice(0, total);
    }

    // 英語＋算数。おおよそ英語6割・算数4割
    const englishCount = Math.round(total * 0.6);
    const mathCount = total - englishCount;

    const passage = shuffle(READING_DATA)[0];
    passage.questions.forEach((q, i) => questions.push(buildReadingQuestion(passage, q, i)));
    shuffle(GRAMMAR_DATA)
      .slice(0, Math.max(Math.round(englishCount / 3), 0))
      .forEach((g) => questions.push(buildGrammarMockQuestion(g)));
    shuffle(WORD_DATA)
      .slice(0, Math.max(englishCount - questions.length, 0))
      .forEach((w) => questions.push(buildWordChoice(w)));

    shuffle(MATH_DATA).slice(0, mathCount).forEach((p) => questions.push(buildMathQuestion(p)));
    return questions;
  }

  // ---------- レベル判定（適応型）----------
  //
  // やさしい問題から始めて、2問続けて正解したら1段上げ、1問間違えたら1段下げる。
  // この上げ下げを繰り返すと、正答率がおよそ7割になる高さで行ったり来たりする。
  // その折り返し地点の平均を「いまのレベル」とみなす。
  // （2問上げ・1問下げの階段法。7割は AI 診断で使っている合格ラインとも揃う）

  /** その科目・そのレベルで出せる問題の一覧 */
  function poolFor(kind, level) {
    const lv = Math.min(level, MAX_LEVEL[kind]);
    if (kind === 'word') return WORD_DATA.filter((w) => w.level === lv);
    if (kind === 'math') return MATH_DATA.filter((p) => p.level === lv);
    if (kind === 'grammar') return GRAMMAR_DATA.filter((q) => q.level === lv);
    const out = [];
    READING_DATA.filter((r) => r.level === lv).forEach((r) =>
      r.questions.forEach((q, i) => out.push({ passage: r, q, i }))
    );
    return out;
  }

  /** 出題の混ぜ具合。単語ばかりにならないよう重みで散らす */
  const ADAPTIVE_KINDS = {
    both: ['word', 'word', 'reading', 'grammar', 'math', 'math'],
    english: ['word', 'word', 'reading', 'reading', 'grammar', 'grammar'],
    math: ['math']
  };

  const questionKey = (kind, item) =>
    kind === 'reading' ? `${item.passage.id}-${item.i + 1}` : String(item.id);

  /**
   * 階段の高さの上限。算数も Grade 4〜7 の4段になったので、いまはどちらも4。
   * 段数が食い違ったときに気づけるよう MAX_LEVEL から引く（直接 4 と書かない）
   */
  const ladderTop = () => (mock.subject === 'math' ? MAX_LEVEL.math : MAX_LEVEL.word);

  /** 階段の高さの呼び名。英語は CEFR、算数だけのときは学年の段階 */
  const ladderLabel = (level) =>
    mock.subject === 'math' ? MATH_LEVEL_LABELS[level] : LEVEL_LABELS[level];

  /** 近いレベルから順に探す。中央→下→上の順で、在庫切れでも止まらないようにする */
  function levelsNear(level) {
    const out = [level];
    for (let d = 1; d < ladderTop(); d++) {
      if (level - d >= 1) out.push(level - d);
      if (level + d <= ladderTop()) out.push(level + d);
    }
    return out;
  }

  /**
   * いまのレベルから1問取り出す。
   * 科目は重み付きで引き、その科目が尽きていたら他の科目、
   * それでも無ければ近いレベルへと順に手を広げる。
   */
  function nextAdaptiveQuestion() {
    const weighted = ADAPTIVE_KINDS[mock.subject];
    // 引いた科目を先頭に、残りは控えとして後ろに並べる
    const wanted = weighted[Math.floor(Math.random() * weighted.length)];
    const kinds = [wanted, ...shuffle([...new Set(weighted)].filter((k) => k !== wanted))];

    for (const lv of levelsNear(mock.level)) {
      for (const kind of kinds) {
        const pool = poolFor(kind, lv).filter((x) => !mock.used.has(questionKey(kind, x)));
        if (!pool.length) continue;
        const item = pool[Math.floor(Math.random() * pool.length)];
        mock.used.add(questionKey(kind, item));
        const q =
          kind === 'word'
            ? buildWordChoice(item)
            : kind === 'math'
              ? buildMathQuestion(item)
              : kind === 'grammar'
                ? buildGrammarMockQuestion(item)
                : buildReadingQuestion(item.passage, item.q, item.i);
        // 語そのものの級ではなく、階段のどの高さで出したかを残す
        q.askedAt = mock.level;
        return q;
      }
    }
    return null;
  }

  /** 正解なら2問で1段上げ、不正解なら即1段下げる。折り返した高さを控えておく */
  function stepStaircase(isCorrect) {
    const before = mock.level;

    if (isCorrect) {
      mock.streak += 1;
      if (mock.streak >= 2) {
        mock.level = Math.min(ladderTop(), mock.level + 1);
        mock.streak = 0;
      }
    } else {
      mock.streak = 0;
      mock.level = Math.max(1, mock.level - 1);
    }

    const dir = mock.level > before ? 1 : mock.level < before ? -1 : 0;
    if (dir !== 0) {
      if (mock.dir !== 0 && dir !== mock.dir) mock.reversals.push(before);
      mock.dir = dir;
    }
  }

  /**
   * 推定レベル。折り返し地点の平均を使う。
   * 最初の折り返しは、下から上がってくる途中の勢いが残っているので捨てる。
   * 折り返しが足りないときは、後半に出した問題の高さの平均で代える。
   */
  function estimateAdaptiveLevel() {
    const rev = mock.reversals.length >= 3 ? mock.reversals.slice(1) : mock.reversals;
    if (rev.length >= 2) {
      return rev.reduce((a, b) => a + b, 0) / rev.length;
    }
    const asked = mock.questions.map((q) => q.askedAt);
    const half = asked.slice(Math.floor(asked.length / 2));
    if (!half.length) return 1;
    return half.reduce((a, b) => a + b, 0) / half.length;
  }

  /** 十分に絞れたか。折り返しが溜まれば残り問題数にかかわらず終える */
  function adaptiveShouldStop() {
    if (mock.questions.length >= mock.maxQuestions) return true;
    return mock.questions.length >= MIN_ADAPTIVE_QUESTIONS && mock.reversals.length >= ENOUGH_REVERSALS;
  }

  function isAnswerCorrect(q, given) {
    // 算数でも4択なら、ほかの科目と同じく「選んだ番号」で比べる
    if (q.kind === 'math' && !q.choice) {
      return given !== null && given !== '' && isMathCorrect(given, q.answer);
    }
    return given === (q.kind === 'math' ? q.choice.answer : q.answer);
  }

  function updateMockPlan() {
    const subject = $('#mock-subject').value;
    const mode = $('#mock-format').value;
    const sizeKey = $('#mock-size').value;

    // 形式によって問題数も時間も変わるので、選択肢の文言ごと入れ替える
    [...$('#mock-size').options].forEach((opt) => {
      opt.textContent = MOCK_SIZE_LABELS[mode][opt.value];
    });

    const label =
      subject === 'math' ? '算数のみ' : subject === 'english' ? '英語のみ（長文＋単語）' : '英語＋算数';

    if (mode === 'adaptive') {
      $('#mock-intro').textContent =
        'やさしい問題から始めて、正解すると少しずつ難しく、間違えるとやさしくなります。行き来した高さから、いまの実力がどのあたりかを見積もります。';
      $('#mock-plan').textContent = `${label}／最大 ${ADAPTIVE_SIZES[sizeKey].total} 問／時間制限なし（レベルが定まれば早めに終わります）`;
    } else {
      $('#mock-intro').textContent =
        '本番と同じように、途中で答え合わせをせず最後にまとめて採点します。制限時間内に解き切る練習です。';
      $('#mock-plan').textContent =
        `${subject === 'both' ? '英語6割・算数4割' : label}／全 ${MOCK_SIZES[sizeKey].total} 問／制限時間 ${MOCK_SIZES[sizeKey].minutes} 分`;
    }
  }

  function resetMockToSetup() {
    stopMockTimer();
    $('#mock-body').hidden = true;
    $('#mock-result').hidden = true;
    $('#mock-setup').hidden = false;
    updateMockPlan();
    renderMockHistory();
  }

  function startMock() {
    const subject = $('#mock-subject').value;
    const mode = $('#mock-format').value;
    const sizeKey = $('#mock-size').value;

    mock.mode = mode;
    mock.subject = subject;
    mock.index = 0;
    mock.startedAt = Date.now();
    mock.level = 1; // かならずやさしい問題から始める
    mock.streak = 0;
    mock.dir = 0;
    mock.reversals = [];
    mock.used = new Set();
    mock.done = false;

    if (mode === 'adaptive') {
      mock.maxQuestions = ADAPTIVE_SIZES[sizeKey].total;
      const first = nextAdaptiveQuestion();
      mock.questions = first ? [first] : [];
      mock.answers = first ? [null] : [];
      mock.endAt = 0;
    } else {
      const size = MOCK_SIZES[sizeKey];
      mock.maxQuestions = size.total;
      mock.questions = buildMockQuestions(subject, size.total);
      mock.answers = new Array(mock.questions.length).fill(null);
      mock.endAt = Date.now() + size.minutes * 60 * 1000;
    }

    if (mock.questions.length === 0) {
      toast('出題できる問題がありません');
      return;
    }

    Storage.incrementSessions();
    $('#mock-setup').hidden = true;
    $('#mock-result').hidden = true;
    $('#mock-body').hidden = false;

    // レベル判定は時間制限を設けない（急がせると実力より低く出る）
    $('#mock-timer').hidden = mode === 'adaptive';
    $('#mock-level').hidden = mode !== 'adaptive';
    // レベル判定は前に戻れない（戻られると難易度の上げ下げが辻褄の合わないものになる）
    $('#mock-prev').hidden = mode === 'adaptive';
    $('.mock-nav').classList.toggle('solo', mode === 'adaptive');
    $('#mock-note').textContent =
      mode === 'adaptive'
        ? '1問ずつ答えます。正解すると難しく、間違えるとやさしくなります。前の問題には戻れません。'
        : '答えは最後にまとめて採点されます。飛ばして後から戻れます。';

    if (mode === 'fixed') startMockTimer();
    renderMockQuestion();
  }

  function startMockTimer() {
    stopMockTimer();
    const tick = () => {
      const left = Math.max(0, Math.round((mock.endAt - Date.now()) / 1000));
      const m = String(Math.floor(left / 60)).padStart(2, '0');
      const sec = String(left % 60).padStart(2, '0');
      $('#mock-timer').textContent = `${m}:${sec}`;
      $('#mock-timer').classList.toggle('is-low', left <= 60);
      if (left === 0) {
        stopMockTimer();
        toast('時間切れです。採点します');
        finishMock();
      }
    };
    tick();
    mock.timer = setInterval(tick, 1000);
  }

  function stopMockTimer() {
    if (mock.timer) clearInterval(mock.timer);
    mock.timer = null;
  }

  function saveCurrentMockAnswer() {
    const q = mock.questions[mock.index];
    if (q.kind === 'math' && !q.choice) mock.answers[mock.index] = $('#mock-input').value.trim() || null;
  }

  function renderMockQuestion() {
    const q = mock.questions[mock.index];
    const adaptive = mock.mode === 'adaptive';
    // レベル判定は途中で終わることがあるので、進み具合は上限に対して見せる
    const total = adaptive ? mock.maxQuestions : mock.questions.length;

    $('#mock-counter').textContent = adaptive ? `${mock.index + 1} 問目` : `${mock.index + 1} / ${total}`;
    $('#mock-progress').style.width = `${((mock.index + 1) / total) * 100}%`;
    $('#mock-tag').textContent = q.tag;
    if (adaptive) $('#mock-level').textContent = `いまの難易度 ${ladderLabel(q.askedAt)}`;

    // 長文は本文を一緒に見せる
    if (q.kind === 'reading') {
      $('#mock-passage').hidden = false;
      $('#mock-passage').innerHTML =
        `<p class="mock-passage-title">${escapeHtml(q.passage.title)}</p>` +
        q.passage.passage.split('\n').map((line) => `<p>${escapeHtml(line)}</p>`).join('');
    } else {
      $('#mock-passage').hidden = true;
    }

    $('#mock-question').textContent = q.question;
    showFigure($('#mock-figure'), q.figure);

    if (q.kind === 'math' && !q.choice) {
      $('#mock-choices').innerHTML = '';
      $('#mock-form').hidden = false;
      $('#mock-input').value = mock.answers[mock.index] || '';
      $('#mock-unit').textContent = q.unit || '';
      $('#mock-unit').hidden = !q.unit;
      $('#mock-input').focus();
    } else {
      $('#mock-form').hidden = true;
      const box = $('#mock-choices');
      box.innerHTML = '';
      const list = q.kind === 'math' ? q.choice.choices : q.choices;
      list.forEach((choice, i) => {
        const btn = document.createElement('button');
        btn.className = 'choice' + (mock.answers[mock.index] === i ? ' is-picked' : '');
        btn.textContent = `${'ABCD'[i]}. ${choice}${q.kind === 'math' && q.unit ? ' ' + q.unit : ''}`;
        btn.addEventListener('click', () => {
          mock.answers[mock.index] = i;
          renderMockQuestion();
        });
        box.appendChild(btn);
      });
    }

    $('#mock-prev').disabled = mock.index === 0;
    $('#mock-next').textContent =
      !adaptive && mock.index === total - 1 ? '採点する' : '次へ →';
    window.scrollTo(0, 0);
  }

  function moveMock(step) {
    saveCurrentMockAnswer();
    if (mock.mode === 'adaptive') {
      if (step > 0) advanceAdaptive();
      return;
    }

    const next = mock.index + step;
    if (next < 0) return;
    if (next >= mock.questions.length) {
      finishMock();
      return;
    }
    mock.index = next;
    renderMockQuestion();
  }

  /** レベル判定の1問ぶんを確定させ、結果に応じて次の高さを決める */
  function advanceAdaptive() {
    const given = mock.answers[mock.index];
    if (given === null || given === undefined || given === '') {
      toast('答えてから次へ進みます');
      return;
    }

    stepStaircase(isAnswerCorrect(mock.questions[mock.index], given));

    if (adaptiveShouldStop()) {
      finishMock();
      return;
    }

    const next = nextAdaptiveQuestion();
    if (!next) {
      // 出せる問題を使い切った場合もそこで打ち切る
      finishMock();
      return;
    }
    mock.questions.push(next);
    mock.answers.push(null);
    mock.index += 1;
    renderMockQuestion();
  }

  function finishMock() {
    saveCurrentMockAnswer();
    stopMockTimer();

    const byKind = {
      word: { c: 0, n: 0 }, reading: { c: 0, n: 0 }, grammar: { c: 0, n: 0 }, math: { c: 0, n: 0 }
    };
    const results = mock.questions.map((q, i) => {
      const given = mock.answers[i];
      const isCorrect = isAnswerCorrect(q, given);
      Storage.recordAnswer(q.id, isCorrect);
      if (isCorrect) Storage.setLearned(q.id, true);
      byKind[q.kind].n += 1;
      if (isCorrect) byKind[q.kind].c += 1;
      return { q, given, isCorrect };
    });

    const correct = results.filter((r) => r.isCorrect).length;
    const total = results.length;
    const rate = Math.round((correct / total) * 100);
    const minutes = Math.max(1, Math.round((Date.now() - mock.startedAt) / 60000));

    const adaptive = mock.mode === 'adaptive' ? buildAdaptiveSummary(results) : null;

    saveMockHistory({ date: new Date().toISOString(), correct, total, rate, minutes, mode: mock.mode });

    const limitMinutes = mock.mode === 'adaptive' ? null : MOCK_SIZES[$('#mock-size').value].minutes;
    runDiagnosis({ correct, total, rate, minutes, limitMinutes, byKind, adaptive });
    renderAdaptiveSummary(adaptive, results);

    $('#mock-body').hidden = true;
    $('#mock-result').hidden = false;
    $('#mock-score').textContent = correct;
    $('#mock-total').textContent = total;
    $('#mock-rate').textContent = `正答率 ${rate}%　／　所要 ${minutes} 分`;
    $('#mock-emoji').textContent = rate >= 90 ? '🏆' : rate >= 70 ? '🎉' : rate >= 50 ? '💪' : '📖';

    const names = { word: '単語', reading: '長文読解', grammar: '文法', math: '算数' };
    $('#mock-breakdown').innerHTML = Object.entries(byKind)
      .filter(([, v]) => v.n > 0)
      .map(([k, v]) => {
        const r = Math.round((v.c / v.n) * 100);
        return `<div class="mock-break-row">
            <span>${names[k]}</span>
            <span class="mock-break-bar"><span style="width:${r}%"></span></span>
            <span class="mock-break-num">${v.c}/${v.n}（${r}%）</span>
          </div>`;
      })
      .join('');

    $('#mock-review').innerHTML = results
      .map((r, i) => {
        const freeInput = r.q.kind === 'math' && !r.q.choice;
        const yourAnswer = freeInput
          ? r.given || '（無回答）'
          : r.given === null || r.given === undefined
            ? '（無回答）'
            : `${'ABCD'[r.given]}`;
        const rightAnswer = freeInput
          ? r.q.answer
          : `${'ABCD'[r.q.kind === 'math' ? r.q.choice.answer : r.q.answer]}. ${r.q.kind === 'math' ? r.q.answer : ''}`.trim();
        return `<div class="result-item ${r.isCorrect ? 'ok' : 'ng'}">
            <span>${r.isCorrect ? '⭕️' : '❌'}</span>
            <b>${i + 1}. ${escapeHtml(r.q.tag.split(' ／ ')[0])}</b>
            <span>${r.isCorrect ? escapeHtml(r.q.question.slice(0, 40)) : `あなた: ${escapeHtml(yourAnswer)} ／ 正解: ${escapeHtml(rightAnswer)}`}</span>
          </div>`;
      })
      .join('');

    window.scrollTo(0, 0);
  }

  /**
   * 推定レベルを級の名前にする。
   * 一番下から一度も上がれず、しかも取りこぼしが多いときだけ「5級未満」とする。
   */
  function adaptiveLevelLabel(estimate, byLevel) {
    const low = byLevel[1];
    const bottomedOut = estimate < 1.25 && low && low.answered >= 3 && low.correct / low.answered < 0.5;
    if (bottomedOut) {
      return mock.subject === 'math' ? `${MATH_LEVEL_LABELS[1]}より前` : 'A1未満';
    }
    return ladderLabel(Math.min(ladderTop(), Math.max(1, Math.round(estimate))));
  }

  /** レベル判定の結果をまとめる。画面にも AI 診断にも同じものを渡す */
  function buildAdaptiveSummary(results) {
    const byLevel = {};
    results.forEach((r) => {
      const lv = r.q.askedAt;
      byLevel[lv] = byLevel[lv] || { correct: 0, answered: 0 };
      byLevel[lv].answered += 1;
      if (r.isCorrect) byLevel[lv].correct += 1;
    });

    const estimate = estimateAdaptiveLevel();
    const reached = Math.max(...results.map((r) => r.q.askedAt));

    // どういう終わり方をしたかで、推定の確からしさが変わる
    const shape =
      mock.reversals.length >= 2
        ? '上下を繰り返して落ち着いた'
        : reached >= ladderTop()
          ? '一番難しいところまで上がりきった'
          : reached <= 1
            ? '一番やさしいところから上がれなかった'
            : '上下がまだ少ない';

    return {
      対象: mock.subject === 'math' ? '算数のみ' : mock.subject === 'english' ? '英語のみ' : '英語＋算数',
      // 算数だけのときの「レベル」は学年の段階であって CEFR ではない
      CEFRで語れる: mock.subject !== 'math',
      推定レベル: adaptiveLevelLabel(estimate, byLevel),
      推定値: Math.round(estimate * 10) / 10,
      最高到達難易度: ladderLabel(reached),
      折り返し回数: mock.reversals.length,
      測り方: shape,
      難易度ごとの正答: Object.keys(byLevel)
        .sort()
        .map((lv) => ({
          難易度: ladderLabel(lv),
          正答: byLevel[lv].correct,
          出題: byLevel[lv].answered
        })),
      出題順の難易度: results.map((r) => ({ 難易度: r.q.askedAt, 正解: r.isCorrect }))
    };
  }

  /** 難易度がどう上下したかを棒グラフで見せる */
  function renderAdaptiveSummary(adaptive, results) {
    $('#mock-adaptive').hidden = !adaptive;
    if (!adaptive) return;

    const top = ladderTop();
    $('#mock-adaptive-chart').innerHTML = results
      .map((r, i) => {
        const lv = r.q.askedAt;
        const title = `${i + 1}問目 ${ladderLabel(lv)} ${r.isCorrect ? '正解' : '不正解'}`;
        return `<span class="adaptive-step ${r.isCorrect ? 'ok' : 'ng'}"
                      style="height:${(lv / top) * 100}%" title="${escapeHtml(title)}"></span>`;
      })
      .join('');

    const rev = adaptive['折り返し回数'];
    const level = adaptive['推定レベル'];
    const what = mock.subject === 'math' ? '問題' : '単語';
    const notes = {
      '上下を繰り返して落ち着いた': `難易度が ${rev} 回上下しました。行き来した高さの平均から、いまの実力は ${level} あたりと見ています。`,
      '一番難しいところまで上がりきった': `最後まで難易度が上がり続け、用意した中で一番難しい ${ladderLabel(top)} の問題まで正解できました。ここで測れるのは ${ladderLabel(top)} までです。`,
      '一番やさしいところから上がれなかった': `一番やさしい ${ladderLabel(1)} から難易度を上げられませんでした。まずはここの${what}を確実にしていきましょう。`,
      '上下がまだ少ない': `まだ難易度の上下が少ないため、後半に出した問題の高さから ${level} あたりと見ています。問題数を増やすとより正確になります。`
    };
    $('#mock-adaptive-note').textContent = notes[adaptive['測り方']];
  }

  /**
   * 採点のあとに実力診断を出す。
   * AI を待たせないよう、採点結果は先に描き、診断だけ後から差し込む。
   */
  async function runDiagnosis(mockResult) {
    $('#diagnosis-loading').hidden = false;
    $('#diagnosis-body').hidden = true;
    $('#diagnosis-loading').textContent = AI.hasKey()
      ? 'AIが診断しています…'
      : '診断しています…';

    let d;
    try {
      d = await AI.diagnose(mockResult, daysUntilExam());
    } catch (e) {
      console.warn('診断に失敗しました。', e);
      $('#diagnosis-loading').textContent = '診断を出せませんでした。';
      return;
    }

    $('#diagnosis-level').textContent = d.level;
    $('#diagnosis-reason').textContent = d.levelReason;
    $('#diagnosis-comment').textContent = d.comment;

    $('#diagnosis-strengths').innerHTML =
      (d.strengths || []).map((x) => `<li>${escapeHtml(x)}</li>`).join('') ||
      '<li class="muted">まだ判断できません</li>';

    // 弱点が空でも理由は2つある。得意な分野が出ているなら「解いたが弱点は無かった」、
    // 何も出ていないなら「まだ解答数が足りない」。同じ文言にすると誤解される
    const noWeak = (d.strengths || []).length
      ? '正答率が7割を下回る分野はありません'
      : 'まだ判断できません';
    $('#diagnosis-weaknesses').innerHTML =
      (d.weaknesses || [])
        .map((w) => `<li><b>${escapeHtml(w.area)}</b><br>${escapeHtml(w.advice)}</li>`)
        .join('') || `<li class="muted">${noWeak}</li>`;

    $('#diagnosis-actions').innerHTML = (d.nextActions || [])
      .map((x) => `<li>${escapeHtml(x)}</li>`)
      .join('');

    $('#diagnosis-cheer').textContent = d.encouragement || '';

    // どちらの経路で出した診断かを明かす（AIの文章と機械判定を混同させないため）
    $('#diagnosis-source').textContent = d.fallbackReason
      ? `AIを呼べなかったため、正答率から判定しました（${d.fallbackReason}）`
      : d.source === 'claude'
        ? 'Claude による診断'
        : '正答率からの判定（APIキーを設定するとAIが講評します）';

    $('#diagnosis-loading').hidden = true;
    $('#diagnosis-body').hidden = false;
  }

  // 設定画面を開くたびに呼ぶ。和訳の件数はカードをめくるたびに増えるので、
  // 初期化のときに一度描くだけでは古いままになる
  let refreshAiStatus = () => {};

  function initVersion() {
    $('#app-version').textContent = APP_VERSION;
  }

  function initApiKey() {
    const input = $('#api-key');
    const status = $('#api-key-status');
    const trStatus = $('#translation-status');

    const show = () => {
      status.textContent = AI.hasKey()
        ? '✓ 保存済み。診断を文章で書き、例文に和訳を付けます。'
        : '未設定。診断は正答率から判定し、例文は英文だけを出します。';

      // 和訳は一度作ると貯まる。消す手段があることも見せておく
      const n = AI.translationCount();
      trStatus.textContent = n > 0 ? `例文の和訳を ${n} 件おぼえています。` : '例文の和訳はまだありません。';
      $('#translation-clear').hidden = n === 0;
    };
    refreshAiStatus = show;
    show();

    $('#api-key-save').addEventListener('click', () => {
      AI.setKey(input.value);
      input.value = '';
      show();
      toast(AI.hasKey() ? 'APIキーを保存しました' : 'APIキーを削除しました');
    });
    $('#api-key-clear').addEventListener('click', () => {
      AI.setKey('');
      input.value = '';
      show();
      toast('APIキーを削除しました');
    });
    // 自動読み上げとふりがな。設定は保存され、次に開いたときも保たれる
    const speak = $('#auto-speak');
    const furi = $('#show-furigana');
    speak.checked = !!Storage.getSettings().autoSpeak;
    furi.checked = !!Storage.getSettings().furigana;
    speak.addEventListener('change', (e) => {
      Storage.updateSettings({ autoSpeak: e.target.checked });
      toast(e.target.checked ? '単語を自動で読み上げます' : '自動読み上げを止めました');
    });
    furi.addEventListener('change', (e) => {
      Storage.updateSettings({ furigana: e.target.checked });
      if (e.target.checked && !AI.hasKey()) toast('APIキーを入れるとふりがなが付きます');
    });

    $('#translation-clear').addEventListener('click', () => {
      if (!confirm('おぼえている例文の和訳を消しますか。次に見たときに作り直します。')) return;
      AI.clearTranslations();
      show();
      toast('和訳を消しました');
    });
  }

  // 模擬試験の結果は設定と一緒に保存しておく（直近5回ぶん）
  function saveMockHistory(entry) {
    const s = Storage.getSettings();
    const list = [entry, ...(s.mockHistory || [])].slice(0, 5);
    Storage.updateSettings({ mockHistory: list });
  }

  function renderMockHistory() {
    const list = Storage.getSettings().mockHistory || [];
    $('#mock-history-panel').hidden = list.length === 0;
    $('#mock-history').innerHTML = list
      .map((h) => {
        const d = new Date(h.date);
        return `<div class="mock-history-row">
            <span>${d.getMonth() + 1}/${d.getDate()}</span>
            <span class="mock-history-mode">${h.mode === 'adaptive' ? 'レベル判定' : '本番形式'}</span>
            <span class="mock-history-score">${h.correct}/${h.total}</span>
            <span class="mock-history-rate">${h.rate}%</span>
            <span class="mock-history-time">${h.minutes}分</span>
          </div>`;
      })
      .join('');
  }

  function initMock() {
    $('#mock-format').addEventListener('change', updateMockPlan);
    $('#mock-subject').addEventListener('change', updateMockPlan);
    $('#mock-size').addEventListener('change', updateMockPlan);
    $('#mock-start').addEventListener('click', startMock);
    $('#mock-again').addEventListener('click', resetMockToSetup);
    $('#mock-prev').addEventListener('click', () => moveMock(-1));
    $('#mock-next').addEventListener('click', () => moveMock(1));
    $('#mock-quit').addEventListener('click', () => {
      if (confirm('模擬試験を中断しますか。ここまでの解答は採点されません。')) {
        stopMockTimer();
        resetMockToSetup();
      }
    });
    $('#mock-form').addEventListener('submit', (e) => {
      e.preventDefault();
      moveMock(1);
    });
  }

  // ============================================================
  // 単語一覧
  // ============================================================

  function masteryInfo(wordId) {
    const rec = Storage.getRecord(wordId);
    if (rec.correct + rec.wrong === 0) return { label: '未学習', cls: '' };
    if (rec.box >= Storage.MAX_BOX) return { label: 'マスター', cls: 'm-high' };
    if (rec.box >= 3) return { label: `習得度 ${rec.box}/${Storage.MAX_BOX}`, cls: 'm-high' };
    if (rec.box >= 2) return { label: `習得度 ${rec.box}/${Storage.MAX_BOX}`, cls: 'm-mid' };
    return { label: `習得度 ${rec.box}/${Storage.MAX_BOX}`, cls: 'm-low' };
  }

  let listedWords = [];

  // 3000語を一度に描画すると重いので、少しずつ表示する
  const LIST_PAGE_SIZE = 200;
  let listLimit = LIST_PAGE_SIZE;

  function updateListCount() {
    const learned = listedWords.filter((w) => Storage.isLearned(w.id)).length;
    const shown = Math.min(listLimit, listedWords.length);
    $('#list-count').textContent =
      `${listedWords.length} 語中 ${shown} 語を表示（うち ✓ 覚えた ${learned} 語）`;
  }

  function renderList() {
    const keyword = $('#list-search').value.trim().toLowerCase();
    const sort = $('#list-sort').value;

    let words = getFilteredWords();
    if (keyword) {
      words = words.filter(
        (w) =>
          w.word.toLowerCase().includes(keyword) ||
          w.meaning.includes(keyword) ||
          w.note.includes(keyword) ||
          w.example.toLowerCase().includes(keyword)
      );
    }

    if (sort === 'alpha') {
      words = words.slice().sort((a, b) => a.word.localeCompare(b.word));
    } else if (sort === 'weak') {
      words = words.slice().sort((a, b) => {
        const ra = Storage.getRecord(a.id);
        const rb = Storage.getRecord(b.id);
        return rb.wrong - ra.wrong || ra.box - rb.box;
      });
    } else if (sort === 'box') {
      words = words.slice().sort((a, b) => Storage.getRecord(a.id).box - Storage.getRecord(b.id).box);
    }

    listedWords = words;
    updateListCount();
    const visible = words.slice(0, listLimit);
    const remaining = words.length - visible.length;

    $('#word-list').innerHTML =
      (visible
        .map((w) => {
          const rec = Storage.getRecord(w.id);
          const m = masteryInfo(w.id);
          return `<div class="word-row ${rec.learned ? 'is-learned' : ''}" data-word-id="${w.id}">
            <input type="checkbox" class="learn-check" data-learn-id="${w.id}"
                   ${rec.learned ? 'checked' : ''} title="覚えたらチェック" />
            <div class="word-main">
              <div class="word-en">${escapeHtml(w.word)} <span class="word-ja">${escapeHtml(w.pos)}</span></div>
              <div class="word-ja">${escapeHtml(w.meaning)}</div>
            </div>
            <span class="mastery ${m.cls}">${m.label}</span>
            <button class="star-btn" data-star-id="${w.id}" title="★ をつける">${rec.starred ? '★' : '☆'}</button>
          </div>
          <div class="word-detail" id="detail-${w.id}">
            <div>${[w.phonetic, levelLabel(w.level), w.category].filter(Boolean).map(escapeHtml).join(' ／ ')}</div>
            ${w.note ? `<div>⚠ ${escapeHtml(w.note)}</div>` : ''}
            ${w.example ? `<div>${escapeHtml(w.example)}</div><div>${escapeHtml(w.exampleJa)}</div>` : ''}
            <div>正解 ${rec.correct} 回 ／ 不正解 ${rec.wrong} 回</div>
            <button class="btn btn-icon" data-speak="${escapeHtml(w.word)}">🔊 発音</button>
          </div>`;
        })
        .join('') || '<p class="hint">該当する単語がありません。</p>') +
      (remaining > 0
        ? `<button class="btn btn-secondary list-more" id="list-more">さらに表示（残り ${remaining} 語）</button>`
        : '');
  }

  /** 検索やフィルタを変えたときは先頭から表示し直す */
  function renderListFromTop() {
    listLimit = LIST_PAGE_SIZE;
    renderList();
  }

  function initList() {
    // 末尾に近づいたら自動で続きを読み込む（「さらに表示」を押さなくて済むように）
    window.addEventListener(
      'scroll',
      () => {
        if (!$('#view-list').classList.contains('is-active')) return;
        if (!$('#list-more')) return;
        if (window.innerHeight + window.scrollY < document.body.offsetHeight - 400) return;
        listLimit += LIST_PAGE_SIZE;
        renderList();
      },
      { passive: true }
    );

    $('#list-search').addEventListener('input', renderListFromTop);
    $('#list-sort').addEventListener('change', renderListFromTop);

    // 表示の絞り込みはホームの「対象」と同じ設定を共有する
    $('#list-scope').addEventListener('change', (e) => {
      Storage.updateSettings({ scope: e.target.value });
      $('#filter-scope').value = e.target.value;
      renderListFromTop();
    });

    $('#word-list').addEventListener('click', (e) => {
      if (e.target.closest('#list-more')) {
        listLimit += LIST_PAGE_SIZE;
        renderList();
        return;
      }
      const check = e.target.closest('[data-learn-id]');
      if (check) {
        const on = Storage.setLearned(Number(check.dataset.learnId), check.checked);
        check.closest('.word-row').classList.toggle('is-learned', on);
        // 「覚えたものだけ」表示中は、チェックを外した語が一覧から外れるので描き直す
        const scope = Storage.getSettings().scope;
        if (scope === 'learned' || scope === 'unlearned') renderList();
        else updateListCount();
        return;
      }
      const speakBtn = e.target.closest('[data-speak]');
      if (speakBtn) {
        Speech.speak(speakBtn.dataset.speak);
        return;
      }
      const starBtn = e.target.closest('[data-star-id]');
      if (starBtn) {
        Storage.toggleStar(Number(starBtn.dataset.starId));
        renderList();
        return;
      }
      const row = e.target.closest('[data-word-id]');
      if (row) $(`#detail-${row.dataset.wordId}`).classList.toggle('is-open');
    });
  }

  // ============================================================
  // 学習記録
  // ============================================================

  function renderStats() {
    const stats = Storage.getStats();
    const rate = stats.totalAnswers
      ? Math.round((stats.totalCorrect / stats.totalAnswers) * 100)
      : 0;

    $('#stats-answers').textContent = stats.totalAnswers;
    $('#stats-rate').textContent = `${rate}%`;
    $('#stats-streak').textContent = Storage.getStreak();
    $('#stats-weak').textContent = WORD_DATA.filter((w) => Storage.isWeak(w.id)).length;
    $('#stats-learned').textContent = WORD_DATA.filter((w) => Storage.isLearned(w.id)).length;
    $('#stats-mastered').textContent = WORD_DATA.filter((w) => Storage.isMastered(w.id)).length;

    renderWeakAreas();
    renderAccuracyByCategory();

    // 直近14日の棒グラフ
    const history = Storage.getHistory(14);
    const max = Math.max(1, ...history.map((h) => h.answered));
    $('#chart').innerHTML = history
      .map((h) => {
        const height = (h.answered / max) * 100;
        return `<div class="chart-col" title="${h.date}: ${h.answered}問">
            <div class="chart-bar ${h.answered ? '' : 'empty'}" style="height:${Math.max(height, 2)}%"></div>
            <span class="chart-label">${h.date.slice(8)}</span>
          </div>`;
      })
      .join('');

    renderMasteryByLevel();
    renderMathMap();
  }

  /**
   * レベルごとの覚え具合を、1本の帯で見せる。
   *
   * これまでは Leitner の箱を「1日後・3日後…」と復習間隔で並べていたが、
   * 何を意味する数字なのか伝わらなかった。覚えた度合いは箱の番号から作り、
   * 濃さで表す。濃い緑で埋まればそのレベルは仕上がり、という読み方になる。
   */
  const MASTERY_STAGES = [
    { key: 'mastered', name: '覚えた', hint: '5回以上続けて正解' },
    { key: 'almost', name: 'ほぼ覚えた', hint: '3〜4回正解' },
    { key: 'vague', name: 'うろ覚え', hint: '1〜2回正解' },
    { key: 'weak', name: '苦手', hint: '間違えて箱が戻った' },
    { key: 'new', name: 'まだ', hint: '一度も解いていない' }
  ];

  /** 学習記録から、その語がどの段階かを決める */
  function masteryStage(rec) {
    const answered = rec.correct + rec.wrong;
    if (answered === 0) return 'new';
    if (rec.box >= Storage.MAX_BOX) return 'mastered';
    if (rec.box >= 3) return 'almost';
    if (rec.box >= 1) return 'vague';
    return 'weak'; // 箱0まで戻っている＝間違え続けている
  }

  function renderMasteryByLevel() {
    const levels = [...new Set(WORD_DATA.map((w) => w.level))].sort();

    $('#mastery-levels').innerHTML = levels
      .map((lv) => {
        const words = WORD_DATA.filter((w) => w.level === lv);
        const counts = {};
        words.forEach((w) => {
          const k = masteryStage(Storage.getRecord(w.id));
          counts[k] = (counts[k] || 0) + 1;
        });
        const done = (counts.mastered || 0) + (counts.almost || 0);

        const segments = MASTERY_STAGES.filter((st) => counts[st.key])
          .map((st) => {
            const pct = (counts[st.key] / words.length) * 100;
            return `<span class="mastery-seg is-${st.key}" style="width:${pct}%"
                          title="${st.name} ${counts[st.key]}語"></span>`;
          })
          .join('');

        return `<div class="mastery-row">
            <div class="mastery-head">
              <span class="mastery-level">${levelLabel(lv)}</span>
              <span class="mastery-num">${done} / ${words.length} 語</span>
            </div>
            <div class="mastery-bar">${segments}</div>
          </div>`;
      })
      .join('');

    $('#mastery-legend').innerHTML = MASTERY_STAGES.map(
      (st) => `<span class="mastery-key"><i class="mastery-chip is-${st.key}"></i>${st.name}</span>`
    ).join('');
  }

  /**
   * 算数の「単元 × 学年」の習得マップ。
   *
   * 模擬試験が返すのは「Grade 5 相当」という**数ひとつ**で、
   * どの単元に穴があるかは分からなかった。25単元 × 5学年のマス目にすると
   * 「計算は G6 まで進んでいるが図形は G4 で止まっている」が一目で分かる。
   *
   * マスの色は単語の習得段階バーと同じ考え方（覚えた＝濃い緑）。
   * **マスを押すとその単元・その学年に絞って出題**する。
   * 穴が見えても埋めに行けないと意味がないため。
   */
  function mathMapCell(problems) {
    if (problems.length === 0) return null; // その学年にその単元の問題が無い
    const counts = {};
    problems.forEach((p) => {
      const k = masteryStage(Storage.getRecord(p.id));
      counts[k] = (counts[k] || 0) + 1;
    });
    const done = (counts.mastered || 0) + (counts.almost || 0);
    const touched = problems.length - (counts.new || 0);
    return {
      total: problems.length,
      done,
      touched,
      weak: counts.weak || 0,
      // 0〜3 の4段。**凡例の4つとちょうど対応させる。**
      // 5段にしていたときは、暗いテーマで中間の2つが見分けられなかった
      //   0 まだ / 1 やった（半分未満）/ 2 覚えてきた（半分以上）/ 3 仕上がり（全部）
      shade:
        touched === 0 ? 0
        : done === problems.length ? 3
        : done * 2 >= problems.length ? 2
        : 1
    };
  }

  function renderMathMap() {
    const box = $('#math-map');
    if (!box) return;

    const levels = [...new Set(MATH_DATA.map((p) => p.level))].sort((a, b) => a - b);
    // 単元の並びは MATH_CATEGORIES。習う順に並べてあるので、
    // 上から下へ読むとそのまま学年が上がっていく
    const cats = MATH_CATEGORIES;

    // 問題を (単元, 学年) ごとに1回だけ振り分ける。
    // マスごとに MATH_DATA を filter すると 884 問 × 125 マスを走ることになる
    const bucket = new Map();
    for (const p of MATH_DATA) {
      const key = `${p.category} ${p.level}`;
      const arr = bucket.get(key);
      if (arr) arr.push(p);
      else bucket.set(key, [p]);
    }
    const cellAt = (cat, lv) => mathMapCell(bucket.get(`${cat} ${lv}`) || []);

    const head =
      '<div class="mm-row mm-head"><span class="mm-name"></span>' +
      levels.map((lv) => `<span class="mm-cell mm-th">G${lv + 2}</span>`).join('') +
      '<span class="mm-sum">計</span></div>';

    // 次にやるとよい1つ。まだ手を付けていないマスのうち、いちばんやさしい学年のもの
    let next = null;

    const rows = cats
      .map((cat) => {
        let done = 0;
        let total = 0;
        const cells = levels
          .map((lv) => {
            const c = cellAt(cat, lv);
            if (!c) return '<span class="mm-cell mm-none" aria-hidden="true"></span>';
            done += c.done;
            total += c.total;
            if (c.touched === 0 && (!next || lv < next.lv)) next = { cat, lv };
            const title = `${cat} / Grade ${lv + 2}｜覚えた ${c.done} / ${c.total} 問`;
            return `<button class="mm-cell mm-s${c.shade}${c.weak ? ' has-weak' : ''}"
                        data-view="math" data-mcat="${escapeHtml(cat)}" data-mlv="${lv}"
                        title="${escapeHtml(title)}" aria-label="${escapeHtml(title)}"></button>`;
          })
          .join('');
        return `<div class="mm-row">
            <button class="mm-name" data-view="math" data-mcat="${escapeHtml(cat)}" data-mlv="all"
                    title="${escapeHtml(cat)} を全部解く">${escapeHtml(cat)}</button>
            ${cells}
            <span class="mm-sum">${done}/${total}</span>
          </div>`;
      })
      .join('');

    box.innerHTML = head + rows;

    const hint = $('#math-map-next');
    hint.hidden = false;
    if (next) {
      hint.innerHTML = `まだ手を付けていない中でいちばんやさしいのは
        <button class="linkish" data-view="math" data-mcat="${escapeHtml(next.cat)}" data-mlv="${next.lv}">${escapeHtml(next.cat)}（Grade ${next.lv + 2}）</button> です。`;
    } else {
      hint.textContent = 'すべての単元に手が付いています。薄いマスを埋めていきましょう。';
    }
  }

  /**
   * 分野ごとの正答率を出す。
   * items は { id, category } を持つ配列で、学習履歴から正解数と解答数を集計する。
   */
  function accuracyByCategory(items) {
    const totals = new Map();
    for (const item of items) {
      const rec = Storage.getRecord(item.id);
      const answered = rec.correct + rec.wrong;
      if (answered === 0) continue;
      const t = totals.get(item.category) || { correct: 0, answered: 0 };
      t.correct += rec.correct;
      t.answered += answered;
      totals.set(item.category, t);
    }
    return [...totals.entries()]
      .map(([category, t]) => ({
        category,
        correct: t.correct,
        answered: t.answered,
        rate: Math.round((t.correct / t.answered) * 100)
      }))
      .sort((a, b) => a.rate - b.rate); // 弱い順
  }

  /** 記録画面の「伸ばせる分野」。弱い順に3件だけ */
  function renderWeakAreas() {
    const rows = weakRows(4).slice(0, 3);
    $('#stats-weak-areas').innerHTML =
      rows.map(weakRowHtml).join('') ||
      `<p class="hint">${
        Storage.getStats().totalAnswers > 0
          ? '正答率が7割を下回る分野はありません。下の単元マップで、まだ薄いところを埋めていきましょう。'
          : 'まだ解答が少なく、分野を絞れません。学習を進めるとここに出ます。'
      }</p>`;
  }

  function renderAccuracyByCategory() {
    // 長文は「本」単位ではなく題材で集計する
    const readingItems = READING_DATA.flatMap((r) =>
      r.questions.map((q, i) => ({ id: `${r.id}-${i + 1}`, category: r.topic }))
    );

    const groups = [
      { name: '📖 単語', rows: accuracyByCategory(WORD_DATA) },
      { name: '📕 長文読解', rows: accuracyByCategory(readingItems) },
      { name: '🔢 算数', rows: accuracyByCategory(MATH_DATA) }
    ].filter((g) => g.rows.length > 0);

    if (groups.length === 0) {
      $('#accuracy-groups').innerHTML =
        '<p class="hint">まだ解答がありません。学習を始めるとここに出ます。</p>';
      return;
    }

    $('#accuracy-groups').innerHTML = groups
      .map(
        (g) => `<div class="accuracy-group">
          <p class="accuracy-group-name">${g.name}</p>
          ${g.rows
            .map((r) => {
              const tone = r.rate >= 80 ? 'high' : r.rate >= 60 ? 'mid' : 'low';
              return `<div class="accuracy-row">
                  <span class="accuracy-name">${escapeHtml(r.category)}</span>
                  <span class="accuracy-track"><span class="accuracy-fill t-${tone}" style="width:${r.rate}%"></span></span>
                  <span class="accuracy-rate t-${tone}">${r.rate}%</span>
                  <span class="accuracy-count">${r.correct}/${r.answered}</span>
                </div>`;
            })
            .join('')}
        </div>`
      )
      .join('');
  }

  function initStats() {
    $('#export-btn')?.addEventListener('click', () => {
      const blob = new Blob([Storage.exportJSON()], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `toeic-tester-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast('学習データを書き出しました');
    });

    $('#import-btn')?.addEventListener('click', () => $('#import-file').click());

    $('#import-file')?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          Storage.importJSON(String(reader.result));
          syncFilterInputs();
          renderStats();
          toast('学習データを読み込みました');
        } catch (err) {
          toast(`読み込みに失敗しました: ${err.message}`);
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    });

    $('#reset-btn').addEventListener('click', () => {
      if (!confirm('すべての学習記録を削除します。よろしいですか？')) return;
      Storage.reset();
      syncFilterInputs();
      renderStats();
      toast('学習記録をリセットしました');
    });

    $('#restore-backup-btn')?.addEventListener('click', () => {
      if (!Storage.hasBackup()) {
        toast('バックアップがまだありません');
        return;
      }
      if (!confirm('前日までの自動バックアップに戻します。今日の分の記録は消える可能性があります。よろしいですか？')) return;
      if (Storage.restoreBackup()) {
        syncFilterInputs();
        renderStats();
        renderHome();
        toast('バックアップから復元しました');
      } else {
        toast('復元に失敗しました');
      }
    });
  }

  // ============================================================
  // 初期化
  // ============================================================

  function init() {
    Speech.init();
    initFilters();
    initCountdown();
    initMath();
    initReading();
    initGrammar();
    initMock();
    initVersion();
    initApiKey();
    initFlashcards();
    initQuiz();
    initTempo();
    initList();
    initStats();
    renderHome();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
