/**
 * 長文の設問に「設問タイプ」を付ける。
 *
 *   node tools/reading-types.mjs          … 何がどう分類されるかを数え、あやしいものを出す
 *   node tools/reading-types.mjs --emit   … js/reading-data.js の設問に type: を挿し込む
 *
 * **type だけを足す。id も本文も選択肢も正解も触らない**（id は学習記録のキー）。
 *
 * ---
 *
 * ## なぜ必要か
 *
 * 記録タブが出せるのは「長文の正答率 72%」という数ひとつだった。ところが長文で
 * つまずく場所は人によって違う。**主題は取れているのに文脈中の語義だけ落ちている**
 * 子に「長文をやりましょう」と言っても、どこを直せばいいのか分からない。
 *
 * 設問タイプごとの正答率が出れば、次にやることが1つに決まる。
 * データの冒頭コメントにも「設問は5種類を組み合わせている」と最初から書いてあるので、
 * 種類そのものは前からあった。**データに印が無かっただけ**なので、それを付ける。
 *
 * ## どう決めているか
 *
 * 設問文の言い回しで決める。TOEFL Junior の設問は定型なので、これで十分に割れる。
 *
 *   main   主題をつかむ … best title / mainly about / main purpose
 *   vocab  文脈中の語義 … closest in meaning / the word X means
 *   ref    指示語       … the word X refers to
 *   infer  推測する     … infer / imply / probably / most likely / suggest
 *   detail 細部を探す   … 上のどれでもないもの
 *
 * **detail は「その他」ではなく、本文に書いてある事実をそのまま探す設問**である。
 * 上の4つはどれも決まった言い回しを持つのに対し、事実を問う設問は
 * `Why did Mina …` `What time does the library open?` のように自由に書かれる。
 * つまり **「型が無い」ことが detail の特徴**なので、残りを detail に寄せてよい。
 * 取りこぼしが無いことは下の点検（`SUSPECT`）で見ている。
 *
 * 順番に意味がある。**vocab より先に ref を見る**こと。
 * `the word "it" in line 3 refers to` は両方に当たるが、指示語の問題である。
 */
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, load } from './vocab-lib.mjs';

/** 設問タイプ。key は data に書く値、name は画面に出す名前 */
export const QUESTION_TYPES = [
  { key: 'main', name: '主題をつかむ' },
  { key: 'detail', name: '細部を探す' },
  { key: 'vocab', name: '文脈中の語義' },
  { key: 'ref', name: '指示語' },
  { key: 'infer', name: '推測する' }
];

/** 設問文からタイプを決める。**上から順に当てる**（ref は vocab より先） */
export function classify(q) {
  const s = String(q).toLowerCase();
  if (/\brefers? to\b|\brefer(ring)? to\b/.test(s)) return 'ref';
  if (/(best|good|suitable|appropriate|another) title|\btitle for\b|main idea|mainly about|mostly about|main purpose|main topic|primarily about|purpose of (the |this )?(passage|text|article|story|reading)|what is the passage about|best summar/.test(s)) return 'main';
  if (/closest in meaning|opposite in meaning|the word .*\bmeans?\b|\bmean\b.*\bin line\b|another word for/.test(s)) return 'vocab';
  // **語尾を切らない。**infer は inferred / inference、suggest は suggested と出る。
  // `\binfer\b` にしていたときは「What can be inferred about …」が30問まるごと
  // detail に落ちていた（推測の設問が細部の正答率に混ざる）
  if (/infer|imply|implies|implied|suggest|probably|likely|would most|can be concluded|what will .* next/.test(s)) return 'infer';
  return 'detail';
}

const READING_DATA = load('js/reading-data.js', 'READING_DATA');

const all = READING_DATA.flatMap((r) =>
  r.questions.map((q, i) => ({ id: `${r.id}-${i + 1}`, q: q.q, type: classify(q.q), level: r.level }))
);

// ---- 点検 ----
//
// detail に落ちたものの中に、**型を持つのに拾えなかった設問**が混じっていないかを見る。
// 「meaning」「purpose」といった語を含むのに detail になっているものは、
// 言い回しが想定と違う可能性が高いので目で確かめる
const SUSPECT = /meaning|purpose|title|refer|infer|imply|suggest|likely|about the passage/i;
const suspect = all.filter((x) => x.type === 'detail' && SUSPECT.test(x.q));

const counts = {};
all.forEach((x) => { counts[x.type] = (counts[x.type] || 0) + 1; });

console.log(`長文 ${READING_DATA.length} 本 ／ 設問 ${all.length} 問`);
for (const t of QUESTION_TYPES) {
  const n = counts[t.key] || 0;
  console.log(`  ${t.key.padEnd(7)} ${t.name.padEnd(7)} ${String(n).padStart(4)} 問（${Math.round((n / all.length) * 100)}%）`);
}
console.log(`\n  detail に落ちたが型を持つかもしれないもの: ${suspect.length}`);
suspect.slice(0, 20).forEach((x) => console.log(`    ${x.id}  ${x.q}`));

if (process.argv.includes('--emit')) {
  // **`q: '…'` の行の直後に `type: '…'` を1行足す。**
  // 読み直して書き出し直すと、手で直した本文や解説を落とす危険がある。
  // 既に type がある場合は書き換える（付け直しても同じ結果になるように）
  const file = path.join(ROOT, 'js/reading-data.js');
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  const out = [];
  let current = null;   // いま読んでいる本文の id
  let qIndex = 0;       // その本文の中で何問目か
  let inQuestions = false;
  let done = 0;

  for (const line of lines) {
    const idLine = line.match(/^\s*id: '(r\d+)',\s*$/);
    if (idLine) {
      current = idLine[1];
      qIndex = 0;
      inQuestions = false;
      out.push(line);
      continue;
    }
    if (/^\s*questions: \[\s*$/.test(line)) {
      inQuestions = true;
      out.push(line);
      continue;
    }
    // 既にある type の行は捨てる（下で付け直す）
    if (inQuestions && /^\s*type: '[a-z]+',\s*$/.test(line)) continue;

    out.push(line);

    // 設問文は `q: '…'` か `q:` から始まる複数行。開始行だけを数える
    const qLine = inQuestions && line.match(/^(\s*)q:/);
    if (qLine && current) {
      qIndex += 1;
      const passage = READING_DATA.find((r) => r.id === current);
      const target = passage && passage.questions[qIndex - 1];
      if (!target) throw new Error(`設問が見つからない: ${current} の ${qIndex} 問目`);
      out.push(`${qLine[1]}type: '${classify(target.q)}',`);
      done += 1;
    }
  }

  if (done !== all.length) throw new Error(`書き足した行が合わない: ${done} / ${all.length}`);
  fs.writeFileSync(file, out.join('\n'));
  console.log(`\njs/reading-data.js の設問 ${done} 問に type を付けました（id・本文・選択肢は触っていません）`);
}
