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
    600: 'レベル1（基礎）',
    750: 'レベル2（標準）',
    900: 'レベル3（応用）'
  };
  const levelLabel = (level) => LEVEL_LABELS[level] || `レベル${level}`;

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
    $$('.view').forEach((v) => v.classList.toggle('is-active', v.id === `view-${name}`));
    $$('.tab').forEach((t) => t.classList.toggle('is-active', t.dataset.view === name));
    window.scrollTo(0, 0);

    if (name === 'home') renderHome();
    if (name === 'flashcard') startFlashcards();
    if (name === 'quiz') resetQuizToSetup();
    if (name === 'list') renderListFromTop();
    if (name === 'stats') renderStats();
  }

  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-view]');
    if (target) showView(target.dataset.view);
  });

  // ============================================================
  // ホーム画面
  // ============================================================

  function renderHome() {
    const studied = WORD_DATA.filter((w) => Storage.getRecord(w.id).lastStudied).length;
    const learned = WORD_DATA.filter((w) => Storage.isLearned(w.id)).length;
    const due = WORD_DATA.filter(
      (w) => Storage.getRecord(w.id).lastStudied && Storage.isDue(w.id)
    ).length;

    $('#home-total').textContent = WORD_DATA.length;
    $('#home-studied').textContent = studied;
    $('#home-learned').textContent = learned;
    $('#home-due').textContent = due;

    // 全体の進捗は「覚えた」チェックの割合で示す
    const percent = Math.round((learned / WORD_DATA.length) * 100);
    $('#home-progress-fill').style.width = `${percent}%`;
    $('#home-progress-text').textContent = `${learned} / ${WORD_DATA.length} 語（${percent}%）`;

    updateFilterCount();
  }

  function updateFilterCount() {
    $('#filter-count').textContent = `対象: ${getFilteredWords().length} 語`;
  }

  /** 保存済みの設定を各入力欄に反映する */
  function syncFilterInputs() {
    const s = Storage.getSettings();
    $('#filter-level').value = s.level;
    $('#filter-category').value = s.category;
    $('#filter-scope').value = s.scope;
    $('#list-scope').value = s.scope;
    $('#filter-quiz-length').value = String(s.quizLength);
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
    const enough = getFilteredWords().length > 0;
    $('#quiz-body').hidden = true;
    $('#quiz-result').hidden = true;
    $('#quiz-empty').hidden = enough;
    $('#quiz-setup').hidden = !enough;
  }

  function startQuiz(mode, wordsOverride) {
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

  function showResult() {
    const total = quiz.questions.length;
    const rate = Math.round((quiz.correct / total) * 100);

    $('#quiz-body').hidden = true;
    $('#quiz-result').hidden = false;
    $('#result-correct').textContent = quiz.correct;
    $('#result-total').textContent = total;
    $('#result-rate').textContent = `正答率 ${rate}%`;
    $('#result-emoji').textContent = rate === 100 ? '🏆' : rate >= 80 ? '🎉' : rate >= 50 ? '💪' : '📖';

    $('#result-list').innerHTML = quiz.results
      .map(
        (r) => `<div class="result-item ${r.isCorrect ? 'ok' : 'ng'}">
          <span>${r.isCorrect ? '⭕️' : '❌'}</span>
          <b>${escapeHtml(r.word.word)}</b>
          <span>${escapeHtml(r.isCorrect || !r.typed ? r.word.meaning : `入力: ${r.typed}`)}</span>
        </div>`
      )
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

  function initStats() {
    $('#export-btn').addEventListener('click', () => {
      const blob = new Blob([Storage.exportJSON()], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `toeic-tester-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast('学習データを書き出しました');
    });

    $('#import-btn').addEventListener('click', () => $('#import-file').click());

    $('#import-file').addEventListener('change', (e) => {
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
    initFlashcards();
    initQuiz();
    initList();
    initStats();
    renderHome();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
