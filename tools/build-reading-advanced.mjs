/**
 * Advanced (B2) のステージング JSON に解答をマージし、OCR ノイズを掃除して
 * data/raw/reading-import/advanced-draft.json を作る。
 *
 * - 正解は answers-advanced-solved.txt（本文から解いたもの）
 * - OCR で選択肢が壊れた設問（p.88 の Q5-6、p.129 の Q35/38/39/40）は
 *   FIXUPS で上書き（ページ画像を目視して復元済み）
 * - 表がある本文（p.117 の予定表）は列が崩れるため PASSAGE_FIXUPS で
 *   読み上げ形式に書き直した
 * - この本は紙面の挿絵ラベル（地図の国名など）や透かし（facebook.com/LinguaLIB）が
 *   本文に混入するため、Intermediate 版より行単位の除去ルールが多い
 * - 日本語のタイトル・解説・語注は annotations-advanced.json（手書き）を
 *   tools/emit-reading-advanced.mjs が合流させる
 */
import { readFileSync, writeFileSync } from 'node:fs';

const STAGE = 'data/raw/reading-import/539050860-TOEFL-Junior-Advanced-B2-Reading-skills.json';
const ANSWERS = 'data/raw/reading-import/answers-advanced-solved.txt';
const OUT = 'data/raw/reading-import/advanced-draft.json';

// ページ画像を目視して復元した設問（OCR で選択肢が壊れていたもののみ）
const FIXUPS = {
  'p88-5': {
    q: 'In the passage, the word they refers to',
    choices: ['animals', 'people', 'areas', 'plant lives'],
    answer: 1
  },
  'p88-6': {
    q: 'In the passage, the word these refers to',
    choices: ['dry homes', 'desert species', 'large mammals', 'seventy kinds of mammals'],
    answer: 3
  },
  'p50-1': {
    q: 'The students are allowed to eat at all of the following times EXCEPT',
    choices: ['3:00 P.M.', '12:00 P.M.', '7:00 A.M.', '9:30 P.M.'],
    answer: 0
  },
  'p129-35': {
    q: 'Which title best expresses the main idea of the passage?',
    choices: [
      "Sacagawea's Devotion to the Shoshone Tribe",
      'Early American Feminism in the Sacagawea Legend',
      "The Life of Sacagawea Shown in William Clark's Journal",
      'Sacagawea and Her Role in the Lewis and Clark Expedition'
    ],
    answer: 3
  },
  'p129-38': {
    q: 'The author mentions all of the following EXCEPT',
    choices: [
      'Sacagawea becoming a mother',
      'the marriage of Charbonneau and Sacagawea',
      'Sacagawea reuniting with the Shoshone people',
      "Thomas Jefferson's specific goals for the journey"
    ],
    answer: 3
  },
  'p129-39': {
    q: "What does the author say about Sacagawea's death?",
    choices: [
      'It made her a heroine.',
      "It doesn't have a clear story.",
      'It was written about by Clark.',
      'It occurred while she was running away.'
    ],
    answer: 1
  },
  'p129-40': {
    q: 'In the passage, the word He refers to',
    choices: ['Shoshone chief', "Sacagawea's son", "Sacagawea's brother", "Sacagawea's husband"],
    answer: 1
  }
};

// 紙面が表になっている本文は OCR で列が崩れるため、目視で読み上げ形式に書き直したもの
const PASSAGE_FIXUPS = {
  50: [
    "This week our cafeteria is going to have a different schedule. As all of you know, exam week is a very stressful time. We recognize this and want students to have more flexibility in planning their meal times. This semester we'll be keeping the cafeteria open longer so that students can find time to eat. We wish you luck during finals and hope that you can enjoy the food (there won't be any changes to the menu).",
    'Below are the exam week hours for the cafeteria.',
    'Breakfast — Open 7:00 A.M. / Closed 10:30 A.M.',
    'Lunch — Open 11:30 A.M. / Closed 2:00 P.M.',
    'Dinner — Open 5:00 P.M. / Closed 7:30 P.M.',
    'After-hours* — Open 8:00 P.M. / Closed 10:00 P.M.',
    '*After-hours snacks will not include hot meals, but there will be cold cuts for sandwiches and a salad bar open for any students studying late or kept on campus for athletics.'
  ].join('\n'),
  117: [
    'Molly was having trouble finding time to do her schoolwork because of all her activities, so she decided to make a schedule showing when she has free time. Writing everything down showed her that she has more time than she thought.',
    "Molly's After-School Activities",
    'Monday — 3:00-4:30 P.M.: Soccer Practice / 6:30-7:00 P.M.: Clarinet Lesson.',
    'Tuesday — 3:00-4:30 P.M.: Volunteering at Shelter (every other week) / 5:00-6:00 P.M.: Math Tutoring.',
    'Wednesday — 3:00-4:30 P.M.: Soccer Practice.',
    'Thursday — 5:00-6:00 P.M.: Math Tutoring.',
    'Friday — 3:00-4:30 P.M.: Soccer Practice.'
  ].join('\n')
};

// 行結合後にしか直せない箇所（ページ単位）。主に OCR が落としたセリフの開き引用符と、
// 行番号（5,10,15…）が本文に食い込んだもの
const PASSAGE_REPLACES = {
  21: [
    [/\bHIN1\b/, 'H1N1'],
    [/reported in 20 1981/, 'reported in 1981'],
    [/claimed many lives, In particular/, 'claimed many lives. In particular']
  ],
  45: [[/given fishing touches/, 'given finishing touches']],
  63: [[/This because Mars has/, 'This is because Mars has']],
  67: [
    [/^Take this telescope/, '"Take this telescope'],
    [/(^|\n)Tonight is going to be very clear,"/, '$1"Tonight is going to be very clear,"'],
    [/hours\. Adam, what is that\?"/, 'hours. "Adam, what is that?"'],
    [/(^|\n)It is coming right for us!"/, '$1"It is coming right for us!"'],
    [/speak\. We are from the planet/, 'speak. "We are from the planet'],
    [/(^|\n)Good luck in your astronomy class next week,"/, '$1"Good luck in your astronomy class next week,"']
  ],
  77: [[/plenty of siow dances/, 'plenty of slow dances']],
  88: [[/called the Sahara Desert ecoregion\."/, 'called the "Sahara Desert ecoregion."']],
  89: [[/left behind by\. Ancient Egyptians/, 'left behind by Ancient Egyptians']],
  121: [[/which one of the best in the country/, 'which is one of the best in the country']],
  123: [
    [/me\. I'm so happy, I'm so happy!"/, 'me. "I\'m so happy, I\'m so happy!"'],
    [/routines\. Let's go! Move it!"/, 'routines. "Let\'s go! Move it!"'],
    [/(^|\n)You girls have done a great job/, '$1"You girls have done a great job'],
    [/(^|\n)Are you ready\?"/, '$1"Are you ready?"'],
    [/city\. I am feeling great!"/, 'city. "I am feeling great!"'],
    [/(^|\n)What are these for\?"/, '$1"What are these for?"'],
    [/(^|\n)For being great dancers/, '$1"For being great dancers'],
    [/That's what important\./, "That's what is important."]
  ],
  129: [
    [/today's Idaho in s 1788/, "today's Idaho in 1788"],
    [/of women\. 2s Because/, 'of women. Because']
  ]
};

// --- 解答ファイルを読む ---------------------------------------------------
const answerMap = new Map(); // 'p17' -> ['A','C','B','D']
for (const line of readFileSync(ANSWERS, 'utf8').split('\n')) {
  const m = line.match(/^p\.(\d+)\s+Q[\d-]+\s*:\s*([^#]+)/);
  if (!m) continue;
  answerMap.set('p' + m[1], m[2].trim().split(/\s+/));
}

// --- 本文の掃除 -----------------------------------------------------------
function cleanLine(l) {
  let s = l.trim();
  s = s.replace(/^[•‹«»·▪\*"”'’\\]+\s*/, '');          // 行頭の飾り・引用符の残骸
  s = s.replace(/^\.\s+/, '');                          // 行頭に食い込んだ点
  s = s.replace(/^(?:\d{1,2}[.:]?|[si]|is|1s|1s\.|10\.|i)\s+(?=[a-zA-Z"“])/, ''); // 行番号の読み違い
  // 透かし（facebook.com/LinguaLIB）の残骸。行末に食い込むほか、単独行にもなる
  // OCR の崩れ方が多彩（com/LinguaL| / ace com/Lingua / facebook.co 1 …）なので広めに取る
  s = s.replace(/\s*(?:f?ace(?:book)?l?[\s.]*)?\S*com\/Lin.*$/i, '');
  s = s.replace(/\s*facebook\.?\s?co\b.*$/i, '');
  s = s.replace(/\s+acel?\s*$/, '');                    // 透かし facebook の断片が単独で残ったもの
  s = s.replace(/.*gu[al]a?\s*LIB.*$/, '');
  s = s.replace(/^[©®\s]*(?:Master\s+TO[EF]+L|Reading Comprehension)\b.*$/, ''); // 紙面フッター
  // 行末に食い込んだ Answer Key 表記（Anewer Key / iswer Ke / Answer Ray / Alvet Key など読み違い含む）
  s = s.replace(/\s*[\[|]?\s*(?:A?[a-z]{0,4}wer|Alvet|Angier|Agener)\s+(?:[Kk]e?y?|[Rr]ay)\b.*$/, '');
  s = s.replace(/\s*[|\[]?\s*GO ON TO THE NEXT PAGE.*$/, ''); // 紙面のページ送り表示
  s = s.replace(/\s*\.{3,}\s*Unit \d+.*$/, '');        // 行末に食い込んだ紙面フッター（Unit N • …）
  s = s.replace(/\s+Unit \d+\s*[-•·].*$/, '');
  s = s.replace(/\s+(?:www\.)?[a-z]*hantrivie[rt]\.com.*$/i, ''); // 出版社 URL の残骸
  s = s.replace(/(?:^|\s+)(?:PART\s.*|LYLL|BB80|1-0|00-00550)\s*.*$/, ''); // 紙面の飾りの読み違い
  s = s.replace(/^(?:1o|i0|IO)\s+/, '');               // 行番号 10 の読み違いが行頭に残ったもの
  s = s.replace(/\s+\d[\d\s]{8,}.*$/, '');             // 行末に食い込んだ数字の羅列（紙面のメモ欄など）
  s = s.replace(/\s*Question$/, '');                   // 次コーナーの見出しが行末に食い込んだもの
  s = s.replace(/\s*[®•]\s*$/, '');
  s = s.replace(/([a-z])- ([a-z])/g, '$1-$2');         // 行またぎのハイフン（try- outs → try-outs）
  s = s.replace(/[«»]/g, '"');
  // 行番号（5,10,15…）が文中に食い込んだもの（1o = 10 / i0 = 10 の読み違い）
  s = s.replace(/\s(?:1o|i0|IO)\s/g, ' ');
  s = s.replace(/\s›\s/g, ' ');                         // 文中に紛れた飾り文字
  // OCR の読み違いが明らかな語だけ直す
  s = s.replace(/\bMr:\s/g, 'Mr. ')
    .replace(/\bmeaming\b/g, 'meaning')
    .replace(/\b1l years\b/g, '11 years');
  s = s.trim();
  // 挿絵のラベル（地図の国名 NEW GRANADA など）や紙面の飾り（2E23 / WE 43）は
  // 小文字を含まない短い行として混入するので、行ごと捨てる
  if (s && !/[a-z]/.test(s)) return '';
  if (/^\d+k$/.test(s)) return '';
  return s;
}

function rebuildParagraphs(passage) {
  const lines = passage.split('\n').map(cleanLine).filter(Boolean);
  if (!lines.length) return '';
  const avg = lines.reduce((s, l) => s + l.length, 0) / lines.length;
  const paras = [];
  let cur = [];
  for (const l of lines) {
    cur.push(l);
    const endsSentence = /[.!?"”]$/.test(l);
    const short = l.length < avg * 0.72; // 段落最終行は詰め残りで短いことが多い
    if (endsSentence && short) { paras.push(cur.join(' ')); cur = []; }
  }
  if (cur.length) paras.push(cur.join(' '));
  // 行またぎのハイフンは行結合後にしか直せない（good- looking → good-looking）
  return paras.join('\n').replace(/([a-z])- ([a-z])/g, '$1-$2');
}

function cleanChoice(c) {
  return cleanLine(c).replace(/\s+/g, ' ').trim();
}

function cleanQuestion(q) {
  let s = cleanLine(q).replace(/\s+/g, ' ').trim();
  // アプリには行番号が無いので「In line N,」は「In the passage,」に置き換える
  // OCR は数字を Il と読み違えることがある（In line Il,）
  s = s.replace(/\bIn line [\dIl]+,\s*/i, 'In the passage, ');
  s = s.replace(/\s+in lines? [\dIl-]+(,?)(?=\s|$)/i, '$1'); // 「in lines 22-24」のような範囲指定も落とす
  return s;
}

// --- 組み立て -------------------------------------------------------------
const stage = JSON.parse(readFileSync(STAGE, 'utf8'));
const out = [];
const problems = [];
for (const b of stage.blocks) {
  const key = 'p' + b.page;
  const letters = answerMap.get(key);
  if (!letters) { problems.push(`${key}: 解答なし（スキップ）`); continue; }
  const questions = b.questions.map((q, i) => {
    const fix = FIXUPS[`p${b.page}-${q.n}`];
    if (fix) return { q: fix.q, choices: fix.choices, answer: fix.answer };
    const letter = letters[i];
    const idx = letter ? letter.charCodeAt(0) - 65 : -1;
    const choices = q.choices.map(cleanChoice);
    if (idx < 0 || idx > 3 || choices.length !== 4) {
      problems.push(`p${b.page} Q${q.n}: 選択肢${choices.length}件 / 解答 ${letter ?? '?'}`);
    }
    return { q: cleanQuestion(q.q), choices, answer: idx };
  });
  let passage = PASSAGE_FIXUPS[b.page] ?? rebuildParagraphs(b.passage);
  for (const [re, to] of PASSAGE_REPLACES[b.page] ?? []) passage = passage.replace(re, to);
  out.push({ page: b.page, range: b.range, kind: b.kind, passage, questions });
}

writeFileSync(OUT, JSON.stringify(out, null, 2));
console.log(`本文 ${out.length} 件 / 設問 ${out.reduce((s, b) => s + b.questions.length, 0)} 問 -> ${OUT}`);
if (problems.length) {
  console.log('要確認:');
  problems.forEach((p) => console.log('  ' + p));
}
