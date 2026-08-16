/**
 * Basic (A2) のステージング JSON に解答をマージし、OCR ノイズを掃除して
 * data/raw/reading-import/basic-draft.json を作る。
 *
 * - 正解は answers-basic-solved.txt（本文から解いたもの）を読む
 * - OCR で選択肢が壊れた設問は FIXUPS で上書きする（ページ画像を目視して復元済み）
 * - 段落の再構成は「文末記号で終わり、かつ行が平均より短い行」を段落末とみなす近似。
 *   仕上がりはブラウザで目視確認する前提
 * - 日本語のタイトル・解説・語注はここでは作らない。annotations-basic.json（手書き）を
 *   tools/emit-reading-basic.mjs が合流させる
 */
import { readFileSync, writeFileSync } from 'node:fs';

const STAGE = 'data/raw/reading-import/908965484-Master-TOEFL-Junior-Basic-Reading.json';
const ANSWERS = 'data/raw/reading-import/answers-basic-solved.txt';
const OUT = 'data/raw/reading-import/basic-draft.json';

// ページ画像を目視して復元した選択肢と正解（OCR で崩れていた設問のみ）
const FIXUPS = {
  'p68-5': {
    q: 'In the passage, the word We in "We ran home and told our parents" refers to',
    choices: ['the sisters', 'the parents', 'the policemen', 'the brother and sister'],
    answer: 3
  },
  'p69-8': {
    q: 'In the passage, the word they in "In the places where they are coming apart" refers to',
    choices: ['plates', 'volcanoes', 'substances', 'puzzle pieces'],
    answer: 0
  },
  'p69-9': {
    q: 'In the passage, the word it in "The rest of it has resulted in the ridge rising" refers to',
    choices: ['mantle melting', 'creation of crust', 'volcanic activity', 'pressure reduction'],
    answer: 2
  },
  'p72-3': {
    q: 'In the passage, the word skip is closest in meaning to',
    choices: ['need', 'jump', 'miss', 'enjoy'],
    answer: 2
  },
  'p74-12': {
    q: 'Which of the following does NOT happen because of a freak wave?',
    choices: [
      'Ships are hit and then sink.',
      'Scientists are proved wrong.',
      'Houses along the coast are destroyed.',
      'Oil rigs and other floating machines are destroyed.'
    ],
    answer: 2
  }
};

// 紙面が表（スケジュール）になっている本文は OCR で列が崩れて復元できないため、
// ページ画像を目視して読み上げ形式のテキストに書き直したもの
const PASSAGE_FIXUPS = {
  46: [
    'SPOOKY DAY AT SULLY SCHOOL',
    "Hello, Sully School students. On Wednesday, October 20, we'll be having a school-wide Spooky Day to celebrate Halloween. Get excited. Everyone should wear their Halloween costumes. Below is the schedule for Spooky Day.",
    '1:00 - 2:00 P.M. — Scary Snacks, with Mrs. Lamps, in the School Cafeteria.',
    '2:00 - 3:00 P.M. — Pumpkin Carving, with Mr. Dodge and Ms. Grange, in Room 307.',
    '3:00 - 3:30 P.M. — Costume Contest, with Mrs. Godding, in the School Theater.',
    'All day — Bobbing for Apples, The Haunted House, and Face Painting.'
  ].join('\n'),
  113: [
    'Reading Festival',
    'On Friday, March 6, Sullivan School will have a Reading Festival. Grade 6, 7, and 8 students will all participate in special activities.',
    '10:00 - 11:00 A.M. — Grade 6: Book Sharing / Grade 7: Snacks with a Writer / Grade 8: Speed Reading.',
    '11:15 A.M. - 12:15 P.M. — Grade 6: Snacks with a Writer / Grade 7: Speed Reading / Grade 8: Radio Bookblast.',
    '12:30 - 1:30 P.M. — Grade 6: Speed Reading / Grade 7: Book Sharing / Grade 8: Snacks with a Writer.',
    '1:30 P.M. — SPECIAL LUNCH FOR ALL.',
    "The special lunch will be held in the cafeteria. Activity leaders will travel from homeroom to homeroom. All activities will happen in students' regular homeroom classrooms."
  ].join('\n')
};

// --- 解答ファイルを読む ---------------------------------------------------
const answerMap = new Map(); // 'p17' -> ['C','A','B','B']
for (const line of readFileSync(ANSWERS, 'utf8').split('\n')) {
  const m = line.match(/^p\.(\d+)\s+Q[\d-]+\s*:\s*([^#]+)/);
  if (!m) continue;
  answerMap.set('p' + m[1], m[2].trim().split(/\s+/));
}

// --- 本文の掃除 -----------------------------------------------------------
function cleanLine(l) {
  let s = l.trim();
  s = s.replace(/^[•‹«»·▪\*"”'’\\]+\s*/, '');          // 行頭の飾り・引用符の残骸
  s = s.replace(/^(?:\d{1,2}[.:]?|[si]|is|1s|1s\.|10\.|i)\s+(?=[a-zA-Z"“])/, ''); // 行番号の読み違い
  s = s.replace(/^(?:(?:VE|S)\s+\d+|50m)\s*$/, '');    // 紙面の飾りの読み違いだけの行（VE 21 / S 38 / 50m）
  s = s.replace(/\s*\[?Answer\s*[Kk]e.*$/, '');        // 行末に食い込んだ Answer Key 表記（欠けも含む）
  s = s.replace(/\s+\d[\d\s]{8,}.*$/, '');             // 行末に食い込んだ数字の羅列（紙面のメモ欄など）
  s = s.replace(/\s*Question$/, '');                   // 次コーナーの見出しが行末に食い込んだもの
  s = s.replace(/\s*®\s*$/, '');
  s = s.replace(/([a-z])- ([a-z])/g, '$1-$2');         // 行またぎのハイフン（try- outs → try-outs）
  s = s.replace(/[«»]/g, '"');
  // OCR の読み違いが明らかな語だけ直す
  s = s.replace(/\bdiy\b/g, 'dry')
    .replace(/\bCO,\s/g, 'CO2 ')
    .replace(/\braround\b/g, 'around')
    .replace(/\bbeautifull\b/g, 'beautiful')
    .replace(/\binformation Is I need\b/g, 'information I need');
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
  return paras.join('\n');
}

function cleanChoice(c) {
  return cleanLine(c).replace(/\s+/g, ' ').trim();
}

function cleanQuestion(q) {
  let s = cleanLine(q).replace(/\s+/g, ' ').trim();
  // アプリには行番号が無いので「In line N,」は「In the passage,」に置き換える
  s = s.replace(/\bIn line \d+,\s*/i, 'In the passage, ');
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
  out.push({
    page: b.page,
    range: b.range,
    kind: b.kind,
    passage: PASSAGE_FIXUPS[b.page] ?? rebuildParagraphs(b.passage),
    questions
  });
}

writeFileSync(OUT, JSON.stringify(out, null, 2));
console.log(`本文 ${out.length} 件 / 設問 ${out.reduce((s, b) => s + b.questions.length, 0)} 問 -> ${OUT}`);
if (problems.length) {
  console.log('要確認:');
  problems.forEach((p) => console.log('  ' + p));
}
