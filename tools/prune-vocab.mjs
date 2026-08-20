/**
 * **教材に出てこない語**を単語データから取り除く。
 *
 *   node tools/prune-vocab.mjs          … 何が消えるかを出すだけ
 *   node tools/prune-vocab.mjs --emit   … js/data.js から取り除く
 *
 * この単語帳は「収録の根拠は、その語が教材に出ているという事実だけ」という方針で作っている。
 * ところが、語彙練習ワークブック（別ファイルの xlsx）から取り込んだ620語のうち、
 * **多くは教材3冊の本文に一度も出てこなかった。**取り込みツールが
 *
 *     if (words.has(word)) continue;   // 本文に出る語はもう入っている
 *
 * という条件で「本文に**無い**語だけ」をリストから足していたため、構造的にそうなる。
 *
 * これらは次の3つを同時に満たせない。
 *
 *   - **レベルが決まらない。**教材に出てこないので初出のレベルを引けず、3 の決め打ちだった
 *   - **例文が付かない。**リストは語の一覧で、本文を持たない
 *   - **4択の誤答として互いに干渉する。**Key Word の同義語・対義語を集めたリストなので、
 *     意味の同じ語が何組も入っている
 *
 * OCR の失敗ではないことは確かめてある。435語は教材の生テキストに痕跡がなく、
 * 語が割れている例は0件、OCR の傷と1文字違いの語は4語だけで、
 * そのうち3語は登場人物の名前（Manson / Aiden / Junior）だった。
 *
 * **教材に出てくる語は残す。**同じリストから来ていても、教材で裏が取れていれば
 * 収録の根拠があり、レベルも初出から決まる。
 *
 * 消した ID は二度と使い回さない（新しい語は最大値の次から振る）。
 * 残る語の ID は動かさないので、学習記録は保たれる。
 */
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, load, FUNCTION_WORDS, candidates, loadDictionary } from './vocab-lib.mjs';

/** レベル判定と**同じ教材・同じ範囲**を見る。片方だけ基準が違うと辻褄が合わなくなる */
const BOOKS = [
  ['materials/grammar-basic-a2.txt', 13, 136, [14, 125]],
  ['materials/grammar-inter-b1.txt', 15, 138, [16, 126]],
  ['materials/grammar-adv-b2.txt', 15, 138, [16, 126]]
];

const BOILERPLATE = [
  /^www\.nhantriv\w*/i, /^Master TOEFL Junior/i, /^TOEFL$/i, /^Junior$/i,
  /^PART\s+\d+$/i, /^GO ON TO THE NEXT PAGE/i, /^\[?GO ON/i, /^STOP$/i,
  /^Answer Key/i, /^\d{1,3}$/,
  /^Questions?\s+\d+\s*[-–]\s*\d+\s+refer to the following/i,
  /^(Diagnostic|Chapter|Unit|Actual) Test\*?$/i,
  /^(Guided Exercise|Wrap-up|Check-?up)\*?/i,
  /^(Sentence Formation|Verb Forms|Verbals|Language Form and Meaning)$/i
];

const dict = loadDictionary();
const WORD_DATA = load('js/data.js', 'WORD_DATA');
const READING_DATA = load('js/reading-data.js', 'READING_DATA');
const GRAMMAR_DATA = load('js/grammar-data.js', 'GRAMMAR_DATA');

const texts = [];
for (const r of READING_DATA) {
  const n = Number(r.id.slice(1));
  if (n < 23 || n > 134) continue;
  texts.push(r.passage, r.title);
  for (const g of r.glossary || []) texts.push(g.w);
  for (const q of r.questions) texts.push(...q.choices);
}
for (const [file, from, to, dirs] of BOOKS) {
  const full = path.join(ROOT, file);
  if (!fs.existsSync(full)) throw new Error(`${file} が無い。教材を置いてから走らせること`);
  const pages = fs.readFileSync(full, 'utf8').split(/^===== PAGE (\d+) =====$/m);
  for (let i = 1; i < pages.length; i += 2) {
    const n = Number(pages[i]);
    if (n < from || n > to || dirs.includes(n)) continue;
    for (const line of pages[i + 1].split('\n')) {
      const l = line.trim();
      if (l && !BOILERPLATE.some((r) => r.test(l))) texts.push(l);
    }
  }
}
for (const q of GRAMMAR_DATA) texts.push(q.question, ...q.choices);

/** 教材に出てくる見出し語 */
const inMaterial = new Set();
for (const raw of texts.join('\n').toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) || []) {
  if (raw.length < 3 || FUNCTION_WORDS.has(raw)) continue;
  const head = candidates(raw).find((c) => dict.has(c));
  if (head) inMaterial.add(head);
}

const drop = WORD_DATA.filter((w) => !inMaterial.has(w.word.toLowerCase()));
const keep = WORD_DATA.filter((w) => inMaterial.has(w.word.toLowerCase()));

const byCat = {};
drop.forEach((w) => (byCat[w.category] = (byCat[w.category] || 0) + 1));
console.log(`単語 ${WORD_DATA.length} 語`);
console.log(`  教材に出てくる（残す）: ${keep.length}`);
console.log(`  教材に出てこない（消す）: ${drop.length}`);
console.log(`    出どころ別: ${JSON.stringify(byCat)}`);
const byLv = {};
keep.forEach((w) => (byLv[w.level] = (byLv[w.level] || 0) + 1));
console.log(`  残る語のレベル分布: ${JSON.stringify(byLv)}`);
console.log(`\n消す語（先頭60）:\n  ${drop.slice(0, 60).map((w) => w.word).join(' ')}`);

if (process.argv.includes('--emit')) {
  const file = path.join(ROOT, 'js/data.js');
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  const gone = new Set(drop.map((w) => w.id));
  const out = [];
  let removed = 0;
  for (const line of lines) {
    const m = line.match(/^\s*\{ id: (\d+),/);
    if (m && gone.has(Number(m[1]))) { removed += 1; continue; }
    out.push(line);
  }
  if (removed !== drop.length) throw new Error(`消した行が合わない: ${removed} / ${drop.length}`);
  // 最後の要素の行末コンマを落とす（配列の閉じかっこの直前）
  for (let i = out.length - 1; i >= 0; i--) {
    if (/^\s*\{ id: \d+,/.test(out[i])) { out[i] = out[i].replace(/,\s*$/, ''); break; }
  }
  fs.writeFileSync(file, out.join('\n'));
  console.log(`\njs/data.js から ${removed} 語を取り除きました（残る語の id は動かしていません）`);
}
