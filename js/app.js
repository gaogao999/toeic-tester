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

  // 難易度の表示名。データ側の level はそのまま（600/750/900）で、表示だけを切り替える
  const LEVEL_LABELS = {
    1: 'レベル1（基礎）',
    2: 'レベル2（標準）',
    3: 'レベル3（応用）'
  };
  const levelLabel = (level) => LEVEL_LABELS[level] || `レベル${level}`;

  // 算数は学年で示したほうが分かりやすいので、別の表示名を使う
  const MATH_LEVEL_LABELS = { 1: '小学校の復習', 2: '中1の基本', 3: '中1の発展' };
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
      return matchesScope(w, s.scope);
    });
  }

  // ============================================================
  // 画面切り替え
  // ============================================================

  function showView(name) {
    stopTempo(); // 別の画面へ移ったらサクサク4択のタイマーを止める
    $$('.view').forEach((v) => v.classList.toggle('is-active', v.id === `view-${name}`));
    $$('.tab').forEach((t) => t.classList.toggle('is-active', t.dataset.view === name));
    window.scrollTo(0, 0);

    scrollActiveTabIntoView();

    if (name === 'home') renderHome();
    if (name === 'flashcard') startFlashcards();
    if (name === 'quiz') resetQuizToSetup();
    if (name === 'math') resetMathToSetup();
    if (name === 'reading') showReadingList();
    if (name === 'mock') resetMockToSetup();
    if (name === 'list') renderListFromTop();
    if (name === 'stats') renderStats();
  }

  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-view]');
    if (target) showView(target.dataset.view);
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
    const current = names.indexOf($('.tab.is-active').dataset.view);
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
  }

  function updateFilterCount() {
    $('#filter-count').textContent = `対象: ${getFilteredWords().length} 語`;
  }

  // ============================================================
  // 今日の学習メニュー
  // ============================================================

  /**
   * 残り日数と未習得の数から、今日やる量を決める。
   * 極端な数にならないよう上限と下限を設けている。
   */
  function todayGoals() {
    const days = Math.max(daysUntilExam(), 1);

    const wordsLeft = WORD_DATA.filter((w) => !Storage.isLearned(w.id)).length;
    const mathLeft = MATH_DATA.filter((p) => !Storage.isLearned(p.id)).length;
    const readingLeft = READING_DATA.filter(
      (r) => r.questions.some((q, i) => !Storage.isLearned(`${r.id}-${i + 1}`))
    ).length;

    const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

    return [
      {
        key: 'word',
        icon: '📖',
        name: '単語',
        goal: wordsLeft === 0 ? 10 : clamp(Math.ceil(wordsLeft / days), 5, 30),
        unit: '語',
        left: wordsLeft,
        view: 'quiz'
      },
      {
        key: 'math',
        icon: '🔢',
        name: '算数',
        goal: mathLeft === 0 ? 5 : clamp(Math.ceil(mathLeft / days), 3, 20),
        unit: '問',
        left: mathLeft,
        view: 'math'
      },
      {
        key: 'reading',
        icon: '📕',
        name: '長文読解',
        // 長文は1本あたりの設問数で数える。未読があれば1本、なければ復習1本
        goal: readingLeft === 0 ? 4 : Math.min(...READING_DATA.map((r) => r.questions.length)),
        unit: '問',
        left: readingLeft,
        view: 'reading'
      }
    ];
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
    const wordsLeft = goals[0].left;
    $('#today-note').textContent =
      days > 0
        ? `未習得の単語 ${wordsLeft} 語を残り ${days} 日で割り振っています。`
        : '試験日を過ぎました。';
  }

  /** 保存済みの設定を各入力欄に反映する */
  function syncFilterInputs() {
    const s = Storage.getSettings();
    $('#filter-level').value = s.level;
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
    });
    $('#filter-tempo-time').addEventListener('change', (e) => {
      Storage.updateSettings({ tempoTime: Number(e.target.value) });
    });
  }

  // ============================================================
  // 受験までのカウントダウンとカレンダー
  // ============================================================

  // 受験日は固定。EIS Grade 8 の入学試験日
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
      label.textContent = '試験日まで';
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
      $('#countdown-pace').textContent =
        remaining > 0
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

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(cal.year, cal.month, d);
      const key = dateKeyOf(date);
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
    $('#fc-meaning').textContent = w.meaning;
    $('#fc-note').textContent = w.note ? `⚠ ${w.note}` : '';
    $('#fc-note').hidden = !w.note;
    $('#fc-example').textContent = w.example;
    $('#fc-example-ja').textContent = w.exampleJa;
    // 取り込んだばかりで例文がない単語では、例文欄ごと隠す
    $('#fc-example-box').hidden = !w.example;

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
    'ja-en': 'この意味を表す英単語を入力してください',
    fill: '空所に入る語を入力してください',
    listening: '読み上げられた単語を入力してください',
    spell: '表示された単語をそのまま入力してください'
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
  function makeBlank(word, example) {
    if (!example) return null;
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`\\b${escaped}(s|es|ed|d|ing|ies)?\\b`, 'i');
    const match = example.match(re);
    if (!match) return null;
    return { text: example.replace(re, '______'), matched: match[0] };
  }

  function buildQuestions(words, mode, length) {
    let source = shuffle(words);
    if (mode === 'fill') source = source.filter((w) => makeBlank(w.word, w.example));
    source = source.slice(0, length);

    return source.map((w) => {
      const accepted = [w.word];
      let prompt = '';

      if (mode === 'ja-en') {
        prompt = w.meaning;
      } else if (mode === 'fill') {
        const blank = makeBlank(w.word, w.example);
        prompt = blank.text;
        accepted.push(blank.matched); // 例文中の形でも正解にする
      } else if (mode === 'listening') {
        prompt = '🎧 音声を聞いてください';
      } else {
        prompt = w.word;
      }

      return { word: w, prompt, accepted };
    });
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
      toast(
        mode === 'fill'
          ? '例文のある単語が範囲内にありません'
          : '出題できる単語がありません'
      );
      return;
    }

    Storage.incrementSessions();
    $('#quiz-setup').hidden = true;
    $('#quiz-result').hidden = true;
    $('#tempo-body').hidden = true;
    $('#quiz-body').hidden = false;
    $('#quiz-replay').hidden = mode !== 'listening';
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

    const questionEl = $('#quiz-question');
    questionEl.classList.toggle('sentence', quiz.mode === 'fill');
    if (quiz.mode === 'fill') {
      questionEl.innerHTML = escapeHtml(q.prompt).replace(
        '______',
        '<span class="blank">______</span>'
      );
    } else {
      questionEl.textContent = q.prompt;
    }

    const input = $('#quiz-input');
    input.value = '';
    input.disabled = false;
    input.classList.remove('is-correct', 'is-wrong');
    $('#quiz-hint').textContent = '';
    $('#quiz-form').hidden = false;
    $('#quiz-feedback').hidden = true;
    input.focus();

    if (quiz.mode === 'listening') Speech.speak(q.word.word);
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
    $('#quiz-replay').addEventListener('click', () => {
      const q = quiz.questions[quiz.index];
      if (q) Speech.speak(q.word.word);
    });
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

  function isMathCorrect(input, answer) {
    const a = toNumber(input);
    const b = toNumber(answer);
    if (Number.isFinite(a) && Number.isFinite(b)) return Math.abs(a - b) < 1e-9;
    return String(input).trim().toLowerCase() === String(answer).trim().toLowerCase();
  }

  function resetMathToSetup() {
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

  function renderMathQuestion() {
    const p = mathQuiz.questions[mathQuiz.index];
    mathQuiz.answered = false;

    $('#math-counter').textContent = `${mathQuiz.index + 1} / ${mathQuiz.questions.length}`;
    $('#math-progress').style.width = `${(mathQuiz.index / mathQuiz.questions.length) * 100}%`;
    $('#math-score').textContent = `正解 ${mathQuiz.correct}`;
    $('#math-tag').textContent = `${p.category} ／ ${mathLevelLabel(p.level)}`;
    $('#math-question').textContent = p.question;
    $('#math-unit').textContent = p.unit;
    $('#math-unit').hidden = !p.unit;

    const input = $('#math-input');
    input.value = '';
    input.disabled = false;
    input.classList.remove('is-correct', 'is-wrong');
    $('#math-form').hidden = false;
    $('#math-feedback').hidden = true;
    input.focus();
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

    const input = $('#math-input');
    input.disabled = true;
    input.classList.add(isCorrect ? 'is-correct' : 'is-wrong');

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
  // 模擬試験
  // ============================================================

  const MOCK_SIZES = {
    short: { total: 20, minutes: 15 },
    standard: { total: 30, minutes: 30 },
    full: { total: 40, minutes: 45 }
  };

  const mock = { questions: [], index: 0, answers: [], endAt: 0, timer: null, startedAt: 0 };

  /** 単語の4択（英単語 → 意味）を作る */
  function buildWordChoice(word) {
    const distractors = shuffle(WORD_DATA.filter((w) => w.id !== word.id && w.meaning !== word.meaning))
      .slice(0, 3);
    const options = shuffle([word, ...distractors]);
    return {
      kind: 'word',
      id: word.id,
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
      tag: `算数 ／ ${p.category}`,
      question: p.question,
      unit: p.unit,
      answer: p.answer,
      explanation: p.explanation
    };
  }

  /** 出題内容を組み立てる。英語は単語と長文を混ぜ、長文は1本ぶんまとめて出す */
  function buildMockQuestions(subject, total) {
    const questions = [];

    if (subject === 'math') {
      return shuffle(MATH_DATA).slice(0, total).map(buildMathQuestion);
    }

    if (subject === 'english') {
      const passage = shuffle(READING_DATA)[0];
      passage.questions.forEach((q, i) => questions.push(buildReadingQuestion(passage, q, i)));
      const words = shuffle(WORD_DATA).slice(0, Math.max(total - questions.length, 0));
      words.forEach((w) => questions.push(buildWordChoice(w)));
      return questions.slice(0, total);
    }

    // 英語＋算数。おおよそ英語6割・算数4割
    const englishCount = Math.round(total * 0.6);
    const mathCount = total - englishCount;

    const passage = shuffle(READING_DATA)[0];
    passage.questions.forEach((q, i) => questions.push(buildReadingQuestion(passage, q, i)));
    shuffle(WORD_DATA)
      .slice(0, Math.max(englishCount - questions.length, 0))
      .forEach((w) => questions.push(buildWordChoice(w)));

    shuffle(MATH_DATA).slice(0, mathCount).forEach((p) => questions.push(buildMathQuestion(p)));
    return questions;
  }

  function updateMockPlan() {
    const subject = $('#mock-subject').value;
    const size = MOCK_SIZES[$('#mock-size').value];
    const label =
      subject === 'math' ? '算数のみ' : subject === 'english' ? '英語のみ（長文＋単語）' : '英語6割・算数4割';
    $('#mock-plan').textContent = `${label}／全 ${size.total} 問／制限時間 ${size.minutes} 分`;
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
    const size = MOCK_SIZES[$('#mock-size').value];

    mock.questions = buildMockQuestions(subject, size.total);
    mock.answers = new Array(mock.questions.length).fill(null);
    mock.index = 0;
    mock.startedAt = Date.now();
    mock.endAt = Date.now() + size.minutes * 60 * 1000;

    if (mock.questions.length === 0) {
      toast('出題できる問題がありません');
      return;
    }

    Storage.incrementSessions();
    $('#mock-setup').hidden = true;
    $('#mock-result').hidden = true;
    $('#mock-body').hidden = false;

    startMockTimer();
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
    if (q.kind === 'math') mock.answers[mock.index] = $('#mock-input').value.trim() || null;
  }

  function renderMockQuestion() {
    const q = mock.questions[mock.index];
    const total = mock.questions.length;

    $('#mock-counter').textContent = `${mock.index + 1} / ${total}`;
    $('#mock-progress').style.width = `${((mock.index + 1) / total) * 100}%`;
    $('#mock-tag').textContent = q.tag;

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

    if (q.kind === 'math') {
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
      q.choices.forEach((choice, i) => {
        const btn = document.createElement('button');
        btn.className = 'choice' + (mock.answers[mock.index] === i ? ' is-picked' : '');
        btn.textContent = `${'ABCD'[i]}. ${choice}`;
        btn.addEventListener('click', () => {
          mock.answers[mock.index] = i;
          renderMockQuestion();
        });
        box.appendChild(btn);
      });
    }

    $('#mock-prev').disabled = mock.index === 0;
    $('#mock-next').textContent = mock.index === total - 1 ? '採点する' : '次へ →';
    window.scrollTo(0, 0);
  }

  function moveMock(step) {
    saveCurrentMockAnswer();
    const next = mock.index + step;
    if (next < 0) return;
    if (next >= mock.questions.length) {
      finishMock();
      return;
    }
    mock.index = next;
    renderMockQuestion();
  }

  function finishMock() {
    saveCurrentMockAnswer();
    stopMockTimer();

    const byKind = { word: { c: 0, n: 0 }, reading: { c: 0, n: 0 }, math: { c: 0, n: 0 } };
    const results = mock.questions.map((q, i) => {
      const given = mock.answers[i];
      const isCorrect =
        q.kind === 'math'
          ? given !== null && isMathCorrect(given, q.answer)
          : given === q.answer;
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

    saveMockHistory({ date: new Date().toISOString(), correct, total, rate, minutes });

    $('#mock-body').hidden = true;
    $('#mock-result').hidden = false;
    $('#mock-score').textContent = correct;
    $('#mock-total').textContent = total;
    $('#mock-rate').textContent = `正答率 ${rate}%　／　所要 ${minutes} 分`;
    $('#mock-emoji').textContent = rate >= 90 ? '🏆' : rate >= 70 ? '🎉' : rate >= 50 ? '💪' : '📖';

    const names = { word: '単語', reading: '長文読解', math: '算数' };
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
        const yourAnswer =
          r.q.kind === 'math'
            ? r.given || '（無回答）'
            : r.given === null
              ? '（無回答）'
              : `${'ABCD'[r.given]}`;
        const rightAnswer = r.q.kind === 'math' ? r.q.answer : `${'ABCD'[r.q.answer]}`;
        return `<div class="result-item ${r.isCorrect ? 'ok' : 'ng'}">
            <span>${r.isCorrect ? '⭕️' : '❌'}</span>
            <b>${i + 1}. ${escapeHtml(r.q.tag.split(' ／ ')[0])}</b>
            <span>${r.isCorrect ? escapeHtml(r.q.question.slice(0, 40)) : `あなた: ${escapeHtml(yourAnswer)} ／ 正解: ${escapeHtml(rightAnswer)}`}</span>
          </div>`;
      })
      .join('');

    window.scrollTo(0, 0);
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
            <span class="mock-history-score">${h.correct}/${h.total}</span>
            <span class="mock-history-rate">${h.rate}%</span>
            <span class="mock-history-time">${h.minutes}分</span>
          </div>`;
      })
      .join('');
  }

  function initMock() {
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

    // ボックス分布
    const counts = new Array(Storage.MAX_BOX + 1).fill(0);
    WORD_DATA.forEach((w) => { counts[Storage.getRecord(w.id).box] += 1; });
    const names = ['未習得', '1日後', '3日後', '7日後', '14日後', '30日後'];
    $('#box-dist').innerHTML = counts
      .map((count, i) => {
        const width = (count / WORD_DATA.length) * 100;
        return `<div class="box-row">
            <span class="box-name">${names[i] || `箱${i}`}</span>
            <span class="box-track"><span class="box-fill" style="width:${width}%"></span></span>
            <span class="box-num">${count}</span>
          </div>`;
      })
      .join('');
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
    initMock();
    initFlashcards();
    initQuiz();
    initTempo();
    initList();
    initStats();
    renderHome();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
