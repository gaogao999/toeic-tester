/**
 * basic-draft.json（本文・設問・正解）と annotations-basic.json（日本語の
 * タイトル・解説・語注）を合流させて、js/reading-data.js の READING_DATA 末尾に
 * r23 以降のエントリとして追記する。
 *
 * - 既に r23 以降が入っている場合は二重追記になるので、実行前に検知して止める
 * - words は本文から数える（宣言値と実物がずれるのを防ぐ）
 * - annotations に無いページはスキップして報告する（解答が無いページはそもそも draft に無い）
 *
 * 使い方: node tools/emit-reading-basic.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';

const DRAFT = 'data/raw/reading-import/basic-draft.json';
const NOTES = 'data/raw/reading-import/annotations-basic.json';
const TARGET = 'js/reading-data.js';
const FIRST_ID = 23; // r22 までは既存
const LEVEL = 2; // Basic = A2

const draft = JSON.parse(readFileSync(DRAFT, 'utf8'));
const notes = JSON.parse(readFileSync(NOTES, 'utf8'));
let src = readFileSync(TARGET, 'utf8');

if (src.includes(`'r${FIRST_ID}'`)) {
  console.error(`r${FIRST_ID} は既に ${TARGET} に存在する。二重追記になるので中止。`);
  process.exit(1);
}

// JS ソースとして埋め込むための文字列リテラル化（シングルクォート）
const q = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

const skipped = [];
const entries = [];
let n = FIRST_ID;
for (const b of draft) {
  const note = notes['p' + b.page];
  if (!note) { skipped.push('p' + b.page); continue; }
  if (note.explanations.length !== b.questions.length) {
    console.error(`p${b.page}: 解説${note.explanations.length}件に対し設問${b.questions.length}問。中止。`);
    process.exit(1);
  }
  const paras = b.passage.split('\n');
  const words = b.passage.split(/\s+/).filter(Boolean).length;
  const questions = b.questions.map((qu, i) => [
    '      {',
    `        q: ${q(qu.q)},`,
    '        choices: [',
    qu.choices.map((c) => `          ${q(c)}`).join(',\n'),
    '        ],',
    `        answer: ${qu.answer},`,
    `        explanation: ${q(note.explanations[i])}`,
    '      }'
  ].join('\n')).join(',\n');
  entries.push([
    '  {',
    `    id: 'r${n}',`,
    `    title: ${q(note.title)},`,
    `    level: ${LEVEL},`,
    `    topic: ${q(note.topic)},`,
    `    words: ${words},`,
    '    passage:',
    // 既存データと同じ「'段落' + '\n' + …」の形。q() は \ をエスケープするので改行は外で足す
    paras.map((p, i) => `      ${q(p)}${i < paras.length - 1 ? " + '\\n'" : ','}`).join(' +\n'),
    '    glossary: [',
    note.glossary.map((g) => `      { w: ${q(g.w)}, m: ${q(g.m)} }`).join(',\n'),
    '    ],',
    '    questions: [',
    questions,
    '    ]',
    '  }'
  ].join('\n'));
  n++;
}

const insertAt = src.lastIndexOf('\n];');
if (insertAt < 0) { console.error('READING_DATA の終端が見つからない'); process.exit(1); }
src = src.slice(0, insertAt) + ',\n' + entries.join(',\n') + src.slice(insertAt);
writeFileSync(TARGET, src);
console.log(`r${FIRST_ID}〜r${n - 1}（${entries.length}本 / ` +
  `${draft.filter((b) => notes['p' + b.page]).reduce((s, b) => s + b.questions.length, 0)}問）を ${TARGET} に追記した`);
if (skipped.length) console.log('注釈なしでスキップ: ' + skipped.join(', '));
