/**
 * 単語データの点検。
 *
 *   node tools/audit-words.mjs
 *
 * js/data.js（えいごペットからの取り込み）と js/worksheet.js（花さんのワークシートの語）を読み、
 * **紙に刷ったら困るもの**と、**記録がずれる原因になるもの**を探す。
 *
 * 記録は語（小文字）をキーにしているので、同じ語が2つあると記録が混ざる。
 * 取り込み直したあとは必ず走らせること。
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ctx = {};
vm.createContext(ctx);
// const で宣言された値は vm の外から見えないので、最後に取り出す
for (const f of ['js/data.js', 'js/worksheet.js', 'js/examples.js']) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8') + '\n;this.__ = { ...(this.__ || {}), ...(typeof WORDS !== "undefined" ? { WORDS, GRADE_LABELS } : {}), ...(typeof WORKSHEET_WORDS !== "undefined" ? { WORKSHEET_WORDS } : {}), ...(typeof EXAMPLES !== "undefined" ? { EXAMPLES } : {}) };', ctx);
}
const { WORDS, GRADE_LABELS, WORKSHEET_WORDS, EXAMPLES } = ctx.__;

const problems = [];
const bad = (msg) => problems.push(msg);
const keyOf = (w) => String(w).trim().toLowerCase();

// --- data.js ---
const seen = new Map();
for (const [i, w] of WORDS.entries()) {
  const at = `data.js ${i + 1}語目「${w.word}」`;
  if (!w.word || !w.meaning || !w.grade) { bad(`${at}: 語・意味・級のどれかが空`); continue; }
  if (!GRADE_LABELS[w.grade]) bad(`${at}: 知らない級 ${w.grade}`);
  if (/[^\x20-\x7E]/.test(w.word)) bad(`${at}: 英語に半角英数字以外が入っている`);
  if (w.word !== w.word.trim() || /\s{2,}/.test(w.word)) bad(`${at}: 英語の空白がおかしい`);
  // 取り込みで直しているはずのもの。残っていたら import-eigo-pet.mjs の直しが効いていない
  if (/，/.test(w.meaning)) bad(`${at}: 意味に全角カンマ「，」が残っている`);
  if (/[^\x00-\x7F] +[^\x00-\x7F]/.test(w.meaning)) bad(`${at}: 意味の日本語のあいだに空白（PDF の改行の名残）`);
  const k = keyOf(w.word);
  if (seen.has(k)) bad(`${at}: 同じ語がもう1つある（${seen.get(k)}語目）。記録が混ざる`);
  else seen.set(k, i + 1);
}

// --- worksheet.js ---
const wsSeen = new Set();
let wsOnly = 0;
for (const w of WORKSHEET_WORDS) {
  const at = `worksheet.js「${w.word}」`;
  if (!w.word || !w.meaning) bad(`${at}: 語か意味が空`);
  if (!Array.isArray(w.from) || !w.from.length) bad(`${at}: どのワークシートの語か（from）が無い`);
  const k = keyOf(w.word);
  if (wsSeen.has(k)) bad(`${at}: 同じ語がもう1つある`);
  wsSeen.add(k);
  if (!seen.has(k)) wsOnly += 1;
}

// --- examples.js ---
// 紙の「おぼえる」で1行に収まる長さ。超えると行が2行に折れて、1枚に入る語の数が狂う
const EX_MAX = 60;
// 英式つづり。受ける学校はアメリカ式
const BRITISH = /\b(colour|favour|honour|neighbour|behaviour|centre|metre|litre|theatre|organis|realis|recognis|apologis|travelled|travelling|cancelled|practise|defence|licence|grey|programme)/i;
// 見出し語のうち、例文では形が変わってよい語・置きかえる語
const FLEX = /^(a|b|be|is|am|are|was|were|do|does|did|have|has|had|come|came|go|went|take|took|get|got|make|made|one's|oneself|someone|something|~|～)$/i;
let exCount = 0;
for (const [k, x] of Object.entries(EXAMPLES)) {
  const at = `examples.js「${k}」`;
  exCount += 1;
  if (k !== k.toLowerCase()) bad(`${at}: キーは小文字にする`);
  if (!seen.has(k) && !wsSeen.has(k)) bad(`${at}: 単語データに無い語の例文`);
  if (!x || !x.en || !x.ja) { bad(`${at}: en か ja が空`); continue; }
  if (x.en.length > EX_MAX) bad(`${at}: 例文が${x.en.length}文字（${EX_MAX}文字まで）`);
  const n = x.en.split(/\s+/).length;
  if (n < 6 || n > 13) bad(`${at}: 例文が${n}語（8〜12語の目安）`);
  if (BRITISH.test(x.en)) bad(`${at}: 英式つづり（${x.en.match(BRITISH)[0]}）`);
  // 見出し語の各語が、語幹の形で文に出ているか（活用は許す）
  const en = x.en.toLowerCase();
  const miss = k.split(/\s+/).filter((t) => !FLEX.test(t)).filter((t) => {
    const stem = t.replace(/(ies|ied|es|ed|ing|e|y|s)$/, '').slice(0, Math.max(3, t.length - 3));
    return !en.includes(stem);
  });
  if (miss.length) bad(`${at}: 見出し語（${miss.join(' ')}）が例文に見当たらない`);
}

const byGrade = {};
for (const w of WORDS) byGrade[w.grade] = (byGrade[w.grade] || 0) + 1;
const longest = (f) => WORDS.reduce((a, w) => (w[f].length > a[f].length ? w : a));

console.log('単語データ');
for (const [g, n] of Object.entries(byGrade)) console.log(`  ${GRADE_LABELS[g].padEnd(4)} ${n}語`);
console.log(`  ワークシートの語 ${WORKSHEET_WORDS.length}語（うち2級・準1級に無い語 ${wsOnly}）`);
console.log(`  ぜんぶで ${seen.size + wsOnly}語（例文つき ${exCount}語）`);
console.log(`  いちばん長い英語: ${longest('word').word}（${longest('word').word.length}字）`);
console.log(`  いちばん長い意味: ${longest('meaning').meaning}（${longest('meaning').meaning.length}字）`);

if (problems.length) {
  console.log(`\n問題 ${problems.length} 件:`);
  problems.slice(0, 50).forEach((p) => console.log(`  ✗ ${p}`));
  if (problems.length > 50) console.log(`  …ほか ${problems.length - 50} 件`);
}
console.log(problems.length ? `\n❌ ${problems.length} 件` : '\n✅ エラー 0 件');
process.exit(problems.length ? 1 : 0);
