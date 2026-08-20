/**
 * 単語のレベルを、**教材での初出**から付け直す。
 *
 *   node tools/relevel-vocab.mjs           … 何がどう動くかを出すだけ
 *   node tools/relevel-vocab.mjs --report  … 教材ごとの内訳も出す
 *   node tools/relevel-vocab.mjs --emit    … js/data.js の level を書き換える
 *
 * この単語帳の方針は「**その語が最初に出てくる本文のレベル**をその語のレベルとする」。
 * 教材そのものが Basic(A2) / Intermediate(B1) / Advanced(B2) と難易度順に分かれているので、
 * 外部の物差し（CEFR-J など）は持ち込まない。
 *
 * **level だけを書き換える。id には触らない**（学習記録のキーなので）。
 *
 * ---
 *
 * ## 何を「その冊子のレベルで書かれた英文」とみなすか
 *
 * ここを間違えると、易しい冊子に載っているだけの語がまとめて A2 に落ちる。
 * 実際に踏んだ失敗を踏まえ、教材を1冊ずつ確かめて次のように決めた。
 *
 * ### 文法教材（3冊とも同じ作り）
 *
 * | 冊子 | 前付 | 本編 | Directions | 後付 |
 * | --- | --- | --- | --- | --- |
 * | A2 Basic | p1–12 | **p13–136** | p14 / p125 | p137–147 |
 * | B1 Intermediate | p1–14 | **p15–138** | p16 / p126 | p139–143 |
 * | B2 Advanced | p1–14 | **p15–138** | p16 / p126 | p139–143 |
 *
 * - **前付を入れない。**「TOEFL Junior とはどんな試験か」を大人向けに説明した文章で、
 *   その冊子のレベルの英文ではない。ここを含めていたために
 *   communication / relationship / research / council が A2 になっていた
 * - **後付（解答・索引）を入れない。**英文ではない
 * - **Directions を入れない。**試験の受け方の説明で、**3冊とも同じ文**が載っている
 *   （違うのは OCR の揺れだけ）。全レベルに同じ文がある以上、レベルの手がかりにならない。
 *   ここを含めると、共通のサンプル問題から concept / theory / relatively / Newton が A2 になる
 * - **版面の柱と設問の定型文を入れない。**`www.nhantriviet.com`、`PART 2`、
 *   `GO ON TO THE NEXT PAGE`、`Questions 1-4 refer to the following announcement` など。
 *   ここを含めると announcement / biography / notice / passage が A2 になる
 *
 * ### 読解教材（r23〜r134）
 *
 * - **入れる**: 本文・題・語注・選択肢。語注は教材自身が「この語は難しい」と印を付けたもの
 * - **入れない**: 設問の文。`In the passage, the word X is closest in meaning to` のような
 *   定型で、どのレベルにも同じ言い回しが出る。ここだけに出る語は
 *   infer / paragraph / summarize / conclude など12語
 *
 * ### 文法の設問データ（js/grammar-data.js）
 *
 * 取り込みのときに人が書き写した本編の設問。冊子のレベルをそのまま持つので入れる。
 */
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, load, FUNCTION_WORDS, candidates, loadDictionary } from './vocab-lib.mjs';
// 取り込み側が語形を寄せているものは、こちらも同じに寄せる。そろえないと
// `angles → angle` のように、収録はされるが初出を引けない語ができる
import { GRAMMAR_REWRITE } from './grammar-vocab-overrides.mjs';

/** 文法教材3冊。[表示名, ファイル, レベル, 本編の開始, 本編の終了, Directions のページ] */
const BOOKS = [
  ['文法 A2 Basic', 'materials/grammar-basic-a2.txt', 2, 13, 136, [14, 125]],
  ['文法 B1 Intermediate', 'materials/grammar-inter-b1.txt', 3, 15, 138, [16, 126]],
  ['文法 B2 Advanced', 'materials/grammar-adv-b2.txt', 4, 15, 138, [16, 126]]
];

/** 版面の柱と設問の定型文。どのレベルの冊子にも同じものが載る */
const BOILERPLATE = [
  /^www\.nhantriv\w*/i,
  /^Master TOEFL Junior/i,
  /^TOEFL$/i,
  /^Junior$/i,
  /^PART\s+\d+$/i,
  /^GO ON TO THE NEXT PAGE/i,
  /^\[?GO ON/i,
  /^STOP$/i,
  /^Answer Key/i,
  /^\d{1,3}$/,
  /^Questions?\s+\d+\s*[-–]\s*\d+\s+refer to the following/i,
  /^(Diagnostic|Chapter|Unit|Actual) Test\*?$/i,
  /^(Guided Exercise|Wrap-up|Check-?up)\*?/i,
  /^(Sentence Formation|Verb Forms|Verbals|Language Form and Meaning)$/i
];

const dict = loadDictionary();
const WORD_DATA = load('js/data.js', 'WORD_DATA');
const READING_DATA = load('js/reading-data.js', 'READING_DATA');
const GRAMMAR_DATA = load('js/grammar-data.js', 'GRAMMAR_DATA');

/** 教材を1つずつ、レベルと本文を組にして返す */
function gradedSources() {
  const out = [];

  // ---- 読解教材。冊子ごとにまとめる ----
  const READING_BOOKS = [
    ['読解 A2 Basic', 2],
    ['読解 B1 Intermediate', 3],
    ['読解 B2 Advanced', 4]
  ];
  for (const [name, level] of READING_BOOKS) {
    const parts = [];
    for (const r of READING_DATA) {
      const n = Number(r.id.slice(1));
      // r1〜r22 は書き下ろしなのでレベルの根拠が別。教材由来だけを見る
      if (n < 23 || n > 134 || r.level !== level) continue;
      parts.push(r.passage, r.title);
      for (const g of r.glossary || []) parts.push(g.w);
      for (const q of r.questions) parts.push(...q.choices); // 設問の文は入れない
    }
    out.push({ name, level, text: parts.join('\n') });
  }

  // ---- 文法教材。本編から Directions と版面の柱を除く ----
  for (const [name, file, level, from, to, dirs] of BOOKS) {
    const full = path.join(ROOT, file);
    if (!fs.existsSync(full)) {
      console.warn(`※ ${file} が無いので飛ばす（教材は git 管理外）`);
      continue;
    }
    const pages = fs.readFileSync(full, 'utf8').split(/^===== PAGE (\d+) =====$/m);
    const keep = [];
    for (let i = 1; i < pages.length; i += 2) {
      const n = Number(pages[i]);
      if (n < from || n > to || dirs.includes(n)) continue;
      for (const line of pages[i + 1].split('\n')) {
        const l = line.trim();
        if (l && !BOILERPLATE.some((r) => r.test(l))) keep.push(l);
      }
    }
    out.push({ name, level, text: keep.join('\n') });
  }

  // ---- 文法の設問データ。冊子のレベルを持つ ----
  for (const level of [2, 3, 4]) {
    const parts = [];
    for (const q of GRAMMAR_DATA) if (q.level === level) parts.push(q.question, ...q.choices);
    out.push({ name: `文法の設問 レベル${level}`, level, text: parts.join('\n') });
  }

  return out;
}

/** 文字列から見出し語を取り出す */
function headwords(text) {
  const out = new Set();
  for (const raw of text.toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) || []) {
    if (raw.length < 3 || FUNCTION_WORDS.has(raw)) continue;
    const head = candidates(raw).find((c) => dict.has(c));
    if (!head) continue;
    out.add(head);
    if (GRAMMAR_REWRITE[head]) out.add(GRAMMAR_REWRITE[head]);
  }
  return out;
}

const sources = gradedSources();

// 見出し語 → { level, from }。**易しい教材を優先**
const at = new Map();
const perSource = [];
for (const s of sources) {
  const hw = headwords(s.text);
  let claimed = 0;
  for (const w of hw) {
    const cur = at.get(w);
    if (cur === undefined || s.level < cur.level) { at.set(w, { level: s.level, from: s.name }); claimed += 1; }
  }
  perSource.push({ ...s, size: hw.size, claimed });
}

if (process.argv.includes('--report')) {
  console.log('教材ごとの内訳（順に見て、より易しい教材が勝つ）\n');
  console.log('教材                    レベル   異なり語   この教材で初出と決まった語');
  for (const s of perSource) {
    console.log(
      `${s.name.padEnd(24)}${String(s.level).padStart(4)}${String(s.size).padStart(11)}${String(s.claimed).padStart(14)}`
    );
  }
  const byLevel = {};
  for (const v of at.values()) byLevel[v.level] = (byLevel[v.level] || 0) + 1;
  console.log(`\n教材に出てくる見出し語 ${at.size}（初出レベル別 ${JSON.stringify(byLevel)}）\n`);
}

const moves = [];
const noEvidence = [];
for (const w of WORD_DATA) {
  const hit = at.get(w.word.toLowerCase());
  if (!hit) { noEvidence.push(w); continue; }
  if (hit.level !== w.level) moves.push({ ...w, to: hit.level, from: hit.from });
}

const kind = {};
moves.forEach((m) => (kind[`${m.level}→${m.to}`] = (kind[`${m.level}→${m.to}`] || 0) + 1));
console.log(`単語 ${WORD_DATA.length} 語`);
console.log(`  レベルが変わる: ${moves.length}`);
for (const [k, v] of Object.entries(kind).sort()) {
  const ex = moves.filter((m) => `${m.level}→${m.to}` === k).slice(0, 8).map((m) => m.word);
  console.log(`    ${k}: ${String(v).padStart(4)}   例) ${ex.join(' ')}`);
}
console.log(`  教材に出てこないので判定できない: ${noEvidence.length}`);
const byCat = {};
noEvidence.forEach((w) => (byCat[w.category] = (byCat[w.category] || 0) + 1));
console.log(`    ${JSON.stringify(byCat)}`);

const before = {};
const after = {};
WORD_DATA.forEach((w) => {
  before[w.level] = (before[w.level] || 0) + 1;
  const lv = at.get(w.word.toLowerCase())?.level ?? w.level;
  after[lv] = (after[lv] || 0) + 1;
});
console.log(`\n  いまのレベル分布: ${JSON.stringify(before)}`);
console.log(`  直したあと      : ${JSON.stringify(after)}`);

if (process.argv.includes('--emit')) {
  // **1行1語の形をそのまま使い、level: の数字だけを置き換える。**
  // 読み直して書き出し直すと、手で直した箇所（例文の差し替えなど）を落とす危険がある
  const file = path.join(ROOT, 'js/data.js');
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  const want = new Map(moves.map((m) => [m.id, m.to]));
  let changed = 0;
  const out = lines.map((line) => {
    const m = line.match(/^\s*\{ id: (\d+),/);
    if (!m) return line;
    const to = want.get(Number(m[1]));
    if (to === undefined) return line;
    changed += 1;
    return line.replace(/level: \d+/, `level: ${to}`);
  });
  if (changed !== moves.length) throw new Error(`書き換えた行が合わない: ${changed} / ${moves.length}`);
  fs.writeFileSync(file, out.join('\n'));
  console.log(`\njs/data.js の level を ${changed} 語ぶん書き換えました（id は触っていません）`);
}
