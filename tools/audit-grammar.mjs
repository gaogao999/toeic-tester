/**
 * 文法データの点検。
 *
 *   node tools/audit-grammar.mjs
 *
 * **正解が合っているかは機械では確かめられない**（算数と違って計算し直せない）。
 * ここで見るのは、それ以外の壊れ方:
 *
 *   - 空所 ___ が無い、選択肢が足りない、正解の番号がずれている
 *   - 選択肢が重複している（同じものが2つあると正解が2つになる）
 *   - OCR の傷が残っている（`7ih` `l'm` `SO` のような字面）
 *   - 問題文が重複している
 *   - 解説が日本語でない
 *
 * emit のあとに必ず走らせること。
 */
import { readFileSync } from 'node:fs';

const src = readFileSync('js/grammar-data.js', 'utf8');
// データはこのファイルだけで完結しているので、そのまま評価して読む
const DATA = new Function(`${src}\nreturn { GRAMMAR_DATA, GRAMMAR_UNITS };`)();
const { GRAMMAR_DATA: items, GRAMMAR_UNITS: units } = DATA;

const errors = [];
const warns = [];

/** OCR が残しがちな傷。**選択肢に出たら人が直す** */
const OCR_SMELL = [
  { re: /\d+(ih|th\b\s*grade\b)?['’]/, why: '数字のあとに変な記号（7ih / 8’h）' },
  { re: /\bl['’](m|s|d|ll|ve)\b/, why: 'I が l に化けている' },
  { re: /^[A-Z]{2,}$/, why: '全部大文字（SO / IDI）' },
  { re: /[.,;:]$/, why: '文末の記号が残っている' },
  { re: /\s\s/, why: '空白が続いている' },
  { re: /[|•■]/, why: '版面の記号が混ざっている' }
];

const seen = new Map();
for (const q of items) {
  const at = `${q.id}`;
  if (!q.question || !q.question.includes('___')) errors.push(`${at}: 問題文に空所 ___ が無い`);
  if (!Array.isArray(q.choices) || q.choices.length < 2) errors.push(`${at}: 選択肢が足りない`);
  if (!(q.answer >= 0 && q.answer < q.choices.length)) errors.push(`${at}: 正解の番号が範囲外`);
  if (q.choices.some((c) => !c || !c.trim())) errors.push(`${at}: 空の選択肢がある`);

  const lower = q.choices.map((c) => c.toLowerCase().trim());
  if (new Set(lower).size !== lower.length) errors.push(`${at}: 選択肢が重複している → ${q.choices.join(' / ')}`);

  if (!units.includes(q.unit)) errors.push(`${at}: 知らない単元 ${q.unit}`);
  if (![2, 3, 4].includes(q.level)) errors.push(`${at}: レベルが不正 ${q.level}`);

  // 解説は全問に、日本語で。「なぜそれが正解か」が無いと、間違えても次に生きない
  if (!q.explanation) errors.push(`${at}: 解説が無い`);
  else if (!/[ぁ-んァ-ヶ一-龠]/.test(q.explanation)) errors.push(`${at}: 解説に日本語が無い`);

  for (const c of q.choices) {
    for (const s of OCR_SMELL) if (s.re.test(c)) warns.push(`${at}: ${s.why} → 「${c}」`);
  }
  if (/\bundefined\b|\bNaN\b/.test(JSON.stringify(q))) errors.push(`${at}: undefined / NaN が入っている`);

  const key = q.question.replace(/\s+/g, ' ').trim().toLowerCase();
  if (seen.has(key)) warns.push(`${at}: 問題文が ${seen.get(key)} と同じ → ${q.question}`);
  else seen.set(key, q.id);
}

// レベルごとに問題が偏っていないか
const byLevel = {};
items.forEach((q) => (byLevel[q.level] = (byLevel[q.level] || 0) + 1));
for (const lv of [2, 3, 4]) if (!byLevel[lv]) errors.push(`レベル ${lv} の問題が1問も無い`);

// 正解の位置が片寄っていないか。4択だけを見る（2択は半々で当たり前）
const pos = [0, 0, 0, 0];
items.filter((q) => q.choices.length === 4).forEach((q) => pos[q.answer]++);
const four = pos.reduce((a, b) => a + b, 0);
if (four && Math.max(...pos) / four > 0.4) warns.push(`正解の位置が片寄っている: ${pos.join(' / ')}`);

console.log(`${items.length} 問を点検`);
console.log(`  レベル別: ${JSON.stringify(byLevel)}`);
console.log(`  4択の正解の位置: ${pos.join(' / ')}`);
errors.forEach((e) => console.log(`❌ ${e}`));
warns.forEach((w) => console.log(`⚠️  ${w}`));
console.log(`\nエラー ${errors.length} 件 / 気になるところ ${warns.length} 件`);
if (errors.length) process.exitCode = 1;

export { errors, warns };
