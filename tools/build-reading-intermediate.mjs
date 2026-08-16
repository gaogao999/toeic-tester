/**
 * Intermediate (B1) のステージング JSON に解答をマージし、OCR ノイズを掃除して
 * data/raw/reading-import/intermediate-draft.json を作る。
 *
 * - 正解は answers-intermediate-solved.txt（本文から解き、紙面の黄色マーカーで検証）
 * - OCR で選択肢が壊れた設問は FIXUPS で上書き、設問ごと消えたページ（p.96）は
 *   QUESTION_INJECT で丸ごと補う（いずれもページ画像を目視して復元済み）
 * - 表がある本文（p.16 / p.51 / p.118）は列が崩れるため PASSAGE_FIXUPS で
 *   読み上げ形式に書き直した
 * - 日本語のタイトル・解説・語注は annotations-intermediate.json（手書き）を
 *   tools/emit-reading-intermediate.mjs が合流させる
 */
import { readFileSync, writeFileSync } from 'node:fs';

const STAGE = 'data/raw/reading-import/622710269-Master-TOEFL-Junior-Intermediate-B1-Reading-Comprehension.json';
const ANSWERS = 'data/raw/reading-import/answers-intermediate-solved.txt';
const OUT = 'data/raw/reading-import/intermediate-draft.json';

// ページ画像を目視して復元した選択肢と正解（OCR で崩れていた設問のみ）
const FIXUPS = {
  'p42-5': {
    q: 'What does the author like best about French food?',
    choices: ['Desserts', 'Big dinners', 'Pastries and cheeses', 'Desserts and pastries'],
    answer: 0
  },
  'p42-6': {
    q: 'Why does the author like the French language?',
    choices: ['It is easy to learn.', 'It is pleasing to the ear.', 'It is useful in many countries.', 'All of the above'],
    answer: 3
  }
};

// OCR で設問が丸ごと拾えなかったページ（ページ画像から書き起こし）
const QUESTION_INJECT = {
  96: [
    {
      q: 'What would be the best title for this story?',
      choices: ['The Big Pet Decision', 'A New Year at School', 'Buck the Class Bunny', 'Timmy the Turtle Returns'],
      answer: 0
    },
    {
      q: 'What can be inferred about the students in the class?',
      choices: ['The class is all boys.', 'There are more girls.', 'There are more boys.', 'There are the same number of boys and girls.'],
      answer: 2
    },
    {
      q: "What is likely true about this year's class pet?",
      choices: ['It is a dog.', 'It is a rabbit.', 'It is a turtle.', 'It is a lizard.'],
      answer: 3
    }
  ]
};

// 紙面が表になっている本文は OCR で列が崩れるため、目視で読み上げ形式に書き直したもの
const PASSAGE_FIXUPS = {
  16: [
    'Parent-Teacher Conference',
    "On Thursday, September 22, we are going to have a day where parents can come and meet their children's teachers. There will be several meetings and events throughout the day. I hope you can make it to some or all of them. Thank you very much. — Principal Edward Shinner",
    '10:00 - 11:00 A.M. — English, Parent Meetings, with Mrs. Crowe.',
    '11:00 A.M. - 12:00 P.M. — Math, Parent Meetings, with Mr. Simpson.',
    '12:00 - 1:00 P.M. — Science, Parent Meetings, with Mr. Flanders.',
    '1:00 - 2:00 P.M. — Lunch and Speech, Presentation, with Ms. Fox.',
    '2:00 - 3:00 P.M. — Athletics, Presentation and Demonstration, with Coach Kay.',
    '3:00 - 4:00 P.M. — After-School Programs, Parent Activities, with Mr. Magoo.',
    'Notes: All parents must send notes to school with their children saying if they are going to come. We need to know how many meetings to schedule and how much food to make. We would like all parents to participate in the final activity, so make sure to wear comfortable clothing.'
  ].join('\n'),
  51: [
    "This is Monday's exam schedule for students in grades 7-8. All grade 7 students will take their tests in the gym. All grade 8 students will take their tests in the cafeteria. Please make sure you go to the right place on time. Doors will be locked ten minutes after the times written below. Each exam is one hour long. All students will get a lunch break from 11:30 A.M. to 1:00 P.M. and a fifteen-minute rest between exams.",
    'Gymnasium (Grade 7) — Math: 9:00 A.M. / Science: 10:15 A.M. / English: 1:15 P.M. / History: 2:30 P.M.',
    'Cafeteria (Grade 8) — Math: 10:00 A.M. / Science: 1:15 P.M. / English: 2:30 P.M. / History: Tuesday Exam.',
    'Note: If a student cannot make it to an exam for emergency reasons, please bring a letter to the school office. All missed exams will be taken on Wednesday.'
  ].join('\n'),
  118: [
    "Friday, August 19 is our third annual Global Warming Day. We are happy to say that this year's event will be bigger than last year's. It is very important to get together and learn about something that is going to change all of our lives. We hope you all can come and enjoy this wonderful day with us.",
    '10:00 - 11:30 A.M. — Greenhouses in America, a lecture by Dr. Aaron.',
    '11:30 A.M. - 12:30 P.M. — Healthy Lunch, lunch and a health talk.',
    '12:30 - 2:00 P.M. — Free Energy, a demonstration by Mr. Witherspoon.',
    '2:00 - 4:00 P.M. — Melting Icebergs, a student activity with Mrs. Neimeyer.',
    '4:00 - 6:00 P.M. — Our Gentle Planet, a movie presented by Dr. Lynch.',
    'Note: If you want to participate in the Melting Icebergs activity, bring a bathing suit. If you have any food allergies, make sure to report them to the cafeteria before Friday.'
  ].join('\n')
};

// OCR が落としたセリフの開き引用符など、行結合後にしか直せない箇所（ページ単位）
const PASSAGE_REPLACES = {
  62: [[/'I want the new Rendla video game\."/, '"I want the new Rendla video game."']],
  78: [
    [/(^|\n)Yes, I am\. Is breakfast ready\?"/, '$1"Yes, I am. Is breakfast ready?"'],
    [/(^|\n)Come down when you are ready,"/, '$1"Come down when you are ready,"'],
    [/bang\. Jacob! What happened\?"/, 'bang. "Jacob! What happened?"'],
    [/to it\. It's okay, honey\."/, 'to it. "It\'s okay, honey."']
  ],
  // 設問が本文の続きとして貼り付いてしまったページ: 物語の結びで打ち切る
  96: [[/announced Mrs\. Jones\.[\s\S]*$/, 'announced Mrs. Jones.']]
};

// --- 解答ファイルを読む ---------------------------------------------------
const answerMap = new Map(); // 'p16' -> ['B','D','C','C']
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
  s = s.replace(/\s*\[?An(?:swer|gier)\s*[Kk]e.*$/, ''); // 行末に食い込んだ Answer Key 表記（読み違い含む）
  s = s.replace(/\s*[|\[]?\s*GO ON TO THE NEXT PAGE.*$/, ''); // 紙面のページ送り表示
  s = s.replace(/\s*\.{3,}\s*Unit \d+.*$/, '');        // 行末に食い込んだ紙面フッター（Unit N • …）
  s = s.replace(/\s+Unit \d+\s*[-•·].*$/, '');
  s = s.replace(/\s+Ter\s+n\.\d+.*$/, '');             // フッターの読み違い
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
  // OCR の読み違いが明らかな語だけ直す
  s = s.replace(/\bMr:\s/g, 'Mr. ')
    .replace(/\btaliness\b/g, 'tallness')
    .replace(/\bIo tell\b/g, 'To tell')
    .replace(/speaker\?\?/g, 'speaker"?')
    .replace(/\bshortened it to This\b/g, "shortened it to '95. This")
    .replace(/which one of the most renowned/g, 'which is one of the most renowned');
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
  const src = QUESTION_INJECT[b.page]
    ? QUESTION_INJECT[b.page]
    : b.questions;
  const questions = src.map((q, i) => {
    if (QUESTION_INJECT[b.page]) return q; // 書き起こし済み（answer も確定済み）
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
