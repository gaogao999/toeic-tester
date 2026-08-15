/**
 * TOEIC 単語トレーナー — 画面制御と学習ロジック
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

  function getFilteredWords() {
    const s = Storage.getSettings();
    return WORD_DATA.filter((w) => {
      if (s.level !== 'all' && String(w.level) !== String(s.level)) return false;
      if (s.category !== 'all' && w.category !== s.category) return false;
      switch (s.scope) {
        case 'due':
          return Storage.isDue(w.id);
        case 'weak':
          return Storage.isWeak(w.id);
        case 'starred':
          return Storage.getRecord(w.id).starred;
        case 'new':
          return !Storage.getRecord(w.id).lastStudied;
        default:
          return true;
      }
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
    if (name === 'list') renderList();
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
    const mastered = WORD_DATA.filter((w) => Storage.isMastered(w.id)).length;
    const due = WORD_DATA.filter(
      (w) => Storage.getRecord(w.id).lastStudied && Storage.isDue(w.id)
    ).length;

    $('#home-total').textContent = WORD_DATA.length;
    $('#home-studied').textContent = studied;
    $('#home-mastered').textContent = mastered;
    $('#home-due').textContent = due;

    // 習得状況はボックスの進み具合を平均して算出する
    const progress = WORD_DATA.reduce(
      (sum, w) => sum + Storage.getRecord(w.id).box / Storage.MAX_BOX,
      0
    ) / WORD_DATA.length;
    const percent = Math.round(progress * 100);
    $('#home-progress-fill').style.width = `${percent}%`;
    $('#home-progress-text').textContent = `${percent}%`;

    updateFilterCount();
  }

  function updateFilterCount() {
    const count = getFilteredWords().length;
    $('#filter-count').textContent = `対象: ${count} 語`;
  }

  /** 保存済みの設定を各セレクトボックスに反映する */
  function syncFilterInputs() {
    const s = Storage.getSettings();
    $('#filter-level').value = s.level;
    $('#filter-category').value = s.category;
    $('#filter-scope').value = s.scope;
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
    $('#fc-level').textContent = `${w.level}点`;
    $('#fc-category').textContent = w.category;
    $('#fc-pos').textContent = w.pos;
    $('#fc-pos').hidden = !w.pos;
    $('#fc-meaning').textContent = w.meaning;
    $('#fc-example').textContent = w.example;
    $('#fc-example-ja').textContent = w.exampleJa;
    // 取り込んだばかりで例文がない単語では、例文欄ごと隠す
    $('#fc-example-box').hidden = !w.example;

    const starred = Storage.getRecord(w.id).starred;
    const starBtn = $('#fc-star');
    starBtn.textContent = starred ? '★ 覚えにくい' : '☆ 覚えにくい';
    starBtn.classList.toggle('is-on', starred);

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

  function answerCard(isCorrect) {
    const w = fc.deck[fc.index];
    if (!w) return;
    Storage.recordAnswer(w.id, isCorrect);
    toast(isCorrect ? '覚えた！次の復習まで間隔が延びます' : 'もう一度出題されます');
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
  // クイズ
  // ============================================================

  const quiz = { questions: [], index: 0, correct: 0, results: [], mode: 'en-ja', answered: false };

  const MODE_LABELS = {
    'en-ja': '意味として正しいものを選んでください',
    'ja-en': 'この意味を表す英単語を選んでください',
    fill: '空所に入る最も適切な語を選んでください',
    listening: '読み上げられた単語を選んでください'
  };

  /** 例文中の該当語を空所に置き換える。見つからなければ null */
  function makeBlank(word, example) {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`\\b${escaped}(s|es|ed|d|ing|ies)?\\b`, 'i');
    if (!re.test(example)) return null;
    return example.replace(re, '______');
  }

  function pickDistractors(answer, pool, count) {
    const sameCategory = pool.filter(
      (w) => w.id !== answer.id && w.category === answer.category
    );
    const others = pool.filter((w) => w.id !== answer.id && w.category !== answer.category);
    const candidates = shuffle(sameCategory).concat(shuffle(others));

    const picked = [];
    for (const w of candidates) {
      if (picked.length >= count) break;
      // 表示が同じ選択肢は除外する
      if (picked.some((p) => p.meaning === w.meaning || p.word === w.word)) continue;
      if (w.meaning === answer.meaning || w.word === answer.word) continue;
      picked.push(w);
    }
    return picked;
  }

  function buildQuestions(words, mode, length) {
    const pool = WORD_DATA; // 選択肢は全単語から作るので範囲が狭くても成立する
    let source = shuffle(words);

    if (mode === 'fill') {
      source = source.filter((w) => makeBlank(w.word, w.example) !== null);
    }
    source = source.slice(0, length);

    return source
      .map((w) => {
        const distractors = pickDistractors(w, pool, 3);
        if (distractors.length < 3) return null;

        const useWord = mode === 'ja-en' || mode === 'fill' || mode === 'listening';
        const choices = shuffle([w, ...distractors]).map((c) => ({
          id: c.id,
          text: useWord ? c.word : c.meaning
        }));

        let prompt;
        if (mode === 'en-ja') prompt = w.word;
        else if (mode === 'ja-en') prompt = w.meaning;
        else if (mode === 'fill') prompt = makeBlank(w.word, w.example);
        else prompt = '🎧 音声を聞いてください';

        return { word: w, prompt, choices };
      })
      .filter(Boolean);
  }

  function resetQuizToSetup() {
    const enough = getFilteredWords().length >= 4;
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
    quiz.answered = false;

    if (quiz.questions.length === 0) {
      toast(
        mode === 'fill'
          ? '穴埋めに使える単語が範囲内にありません'
          : '出題できる単語が足りません'
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

    const choicesEl = $('#quiz-choices');
    choicesEl.innerHTML = '';
    q.choices.forEach((c) => {
      const btn = document.createElement('button');
      btn.className = 'choice';
      btn.textContent = c.text;
      btn.addEventListener('click', () => answerQuestion(c.id, btn));
      choicesEl.appendChild(btn);
    });

    $('#quiz-feedback').hidden = true;

    if (quiz.mode === 'listening') Speech.speak(q.word.word);
  }

  function answerQuestion(choiceId, btn) {
    if (quiz.answered) return;
    quiz.answered = true;

    const q = quiz.questions[quiz.index];
    const isCorrect = choiceId === q.word.id;

    Storage.recordAnswer(q.word.id, isCorrect);
    if (isCorrect) quiz.correct += 1;
    quiz.results.push({ word: q.word, isCorrect });

    $$('#quiz-choices .choice').forEach((el, i) => {
      el.disabled = true;
      if (q.choices[i].id === q.word.id) el.classList.add('is-correct');
    });
    if (!isCorrect) btn.classList.add('is-wrong');

    $('#quiz-score').textContent = `正解 ${quiz.correct}`;
    $('#feedback-title').textContent = isCorrect ? '⭕️ 正解' : '❌ 不正解';
    $('#feedback-detail').textContent = [q.word.word, q.word.phonetic, q.word.pos]
      .filter(Boolean)
      .join(' ') + ` … ${q.word.meaning}`;
    $('#feedback-example').textContent = q.word.example
      ? `${q.word.example} / ${q.word.exampleJa}`
      : '';
    $('#quiz-next').textContent =
      quiz.index === quiz.questions.length - 1 ? '結果を見る →' : '次の問題 →';
    $('#quiz-feedback').hidden = false;
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
          <span>${escapeHtml(r.word.meaning)}</span>
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
    const total = rec.correct + rec.wrong;
    if (total === 0) return { label: '未学習', cls: '' };
    if (rec.box >= Storage.MAX_BOX) return { label: 'マスター', cls: 'm-high' };
    if (rec.box >= 3) return { label: `習得度 ${rec.box}/${Storage.MAX_BOX}`, cls: 'm-high' };
    if (rec.box >= 2) return { label: `習得度 ${rec.box}/${Storage.MAX_BOX}`, cls: 'm-mid' };
    return { label: `習得度 ${rec.box}/${Storage.MAX_BOX}`, cls: 'm-low' };
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

    $('#list-count').textContent = `${words.length} 語を表示中`;

    const html = words
      .map((w) => {
        const rec = Storage.getRecord(w.id);
        const m = masteryInfo(w.id);
        return `<div class="word-row" data-word-id="${w.id}">
            <div class="word-main">
              <div class="word-en">${escapeHtml(w.word)} <span class="word-ja">${escapeHtml(w.pos)}</span></div>
              <div class="word-ja">${escapeHtml(w.meaning)}</div>
            </div>
            <span class="mastery ${m.cls}">${m.label}</span>
            <button class="star-btn" data-star-id="${w.id}" title="★ をつける">${rec.starred ? '★' : '☆'}</button>
          </div>
          <div class="word-detail" id="detail-${w.id}">
            <div>${[w.phonetic, `${w.level}点レベル`, w.category].filter(Boolean).map(escapeHtml).join(' ／ ')}</div>
            ${w.example ? `<div>${escapeHtml(w.example)}</div><div>${escapeHtml(w.exampleJa)}</div>` : ''}
            <div>正解 ${rec.correct} 回 ／ 不正解 ${rec.wrong} 回</div>
            <button class="btn btn-icon" data-speak="${escapeHtml(w.word)}">🔊 発音</button>
          </div>`;
      })
      .join('');

    $('#word-list').innerHTML = html || '<p class="hint">該当する単語がありません。</p>';
  }

  function initList() {
    $('#list-search').addEventListener('input', renderList);
    $('#list-sort').addEventListener('change', renderList);

    $('#word-list').addEventListener('click', (e) => {
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
      if (row) {
        $(`#detail-${row.dataset.wordId}`).classList.toggle('is-open');
      }
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

    // 直近14日の棒グラフ
    const history = Storage.getHistory(14);
    const max = Math.max(1, ...history.map((h) => h.answered));
    $('#chart').innerHTML = history
      .map((h) => {
        const height = (h.answered / max) * 100;
        const day = h.date.slice(5).replace('-', '/');
        return `<div class="chart-col" title="${h.date}: ${h.answered}問">
            <div class="chart-bar ${h.answered ? '' : 'empty'}" style="height:${Math.max(height, 2)}%"></div>
            <span class="chart-label">${day.slice(3)}</span>
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
