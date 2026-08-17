/**
 * js/math-data.js を書き出す。
 *
 *   既存 m1〜m149 … ID と問題文・答え・解説はそのまま。level と category だけ振り直す
 *   新規          … m150 から続き番号で追加
 *
 * ID を振り直さないのは学習記録を守るため。追加は必ず末尾に、番号は飛ばさない。
 *
 *   node tools/emit-math.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { RELEVEL, FIXES, FIGURES, CATEGORY_ORDER } from './math-relevel.mjs';

const url = (p) => new URL(p, import.meta.url);

const src = readFileSync(url('../js/math-data.js'), 'utf8');
const current = new Function('return ' + src.slice(src.indexOf('['), src.lastIndexOf(']') + 1))();

// **自分が書き出したファイルを読み直す**ので、手作りの問題だけを拾う。
// 生成ぶんは毎回ゼロから作り直す（そうしないと実行するたびに増えていく）
const existing = current.filter((p) => RELEVEL[p.id]);
const extra = Object.keys(RELEVEL).filter((id) => !current.some((p) => p.id === id));
if (extra.length) throw new Error(`存在しない ID が振り直し表にある: ${extra.join(', ')}`);
if (existing.length !== Object.keys(RELEVEL).length) throw new Error('手作りの問題を取りこぼしている');

const kept = existing.map((p) => {
  const [level, category] = RELEVEL[p.id];
  const fixed = { ...p, ...(FIXES[p.id] || {}), level, category };
  if (FIGURES[p.id]) fixed.figure = FIGURES[p.id];
  return fixed;
});

const stale = [...Object.keys(FIXES), ...Object.keys(FIGURES)].filter((id) => !RELEVEL[id]);
if (stale.length) throw new Error(`存在しない ID の手直し・図がある: ${stale.join(', ')}`);

const mods = await Promise.all([
  import('./math-g3.mjs'), import('./math-g4.mjs'),
  import('./math-g5.mjs'), import('./math-g6.mjs'), import('./math-g7.mjs')
]);

// 既存と問題文がぶつかるものは捨てる（同じ問題が2回出ると学習にならない）
const seen = new Set(kept.map((p) => p.question.trim()));
let next = kept.length + 1;
const added = [];
for (const p of mods.flatMap((m) => m.build())) {
  const key = p.question.trim();
  if (seen.has(key)) continue;
  seen.add(key);
  added.push({ id: `m${next++}`, ...p });
}

const all = [...kept, ...added];

const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
/** 図の指定。数値と、あらかじめ決めた語だけを書き出す（データに任意の文字列を入れない） */
const figureLiteral = (f) =>
  '{ ' +
  Object.entries(f)
    .map(([k, v]) => {
      if (Array.isArray(v)) return `${k}: [${v.map((x) => (Array.isArray(x) ? `[${x.join(', ')}]` : JSON.stringify(x))).join(', ')}]`;
      return `${k}: ${typeof v === 'number' || typeof v === 'boolean' ? v : `'${esc(v)}'`}`;
    })
    .join(', ') +
  ' }';

const line = (p) =>
  `  { id: '${p.id}', question: '${esc(p.question)}', answer: '${esc(p.answer)}', unit: '${esc(p.unit || '')}', ` +
  `explanation: '${esc(p.explanation)}', level: ${p.level}, category: '${esc(p.category)}'` +
  (p.figure ? `, figure: ${figureLiteral(p.figure)}` : '') +
  ' }';

const byLevel = {};
const byCat = {};
all.forEach((p) => { byLevel[p.level] = (byLevel[p.level] || 0) + 1; byCat[p.category] = (byCat[p.category] || 0) + 1; });

const header = `/**
 * 算数・数学のデータ。Grade 3 から Grade 7 までの内容をひととおり入れてある。
 *
 * 受けるのは EIS の Grade 8 入試なので、日本の学年ではなく **インター校の学年** で
 * 範囲を決めている（Grade 7 ≒ 中1。確率のように日本の中1にない単元も入る）。
 *
 *   id          … 'm' + 連番。**変えないこと。** 学習記録がこの ID で保存されている
 *   question    … 問題文。英語。入試が英語で出るため
 *   answer      … 答え。文字列だが採点は数として比べる（'3/4' と '0.75' はどちらも正解）
 *   unit        … 単位。表示だけに使う。答えに単位を書かせない
 *   explanation … 解説。**日本語。** 解けなかったときに読むものなので
 *   level       … 1=Grade 3, 2=Grade 4, 3=Grade 5, 4=Grade 6, 5=Grade 7
 *   figure      … 図の形の指定（あれば）。SVG に組み立てるのは js/math-figure.js
 *   category    … 分野。絞り込みに使う
 *
 * m1〜m${kept.length} は手作りのデータ。m${kept.length + 1} 以降は tools/math-g3〜g7.mjs が作っている。
 * 作り直すときは \`node tools/emit-math.mjs\`、点検は \`node tools/audit-math.mjs\`。
 * 乱数は固定のたねから振るので、作り直しても同じ問題・同じ ID になる。
 *
 * 件数 ${all.length}（${Object.entries(byLevel).map(([k, v]) => `Grade ${Number(k) + 2}: ${v}`).join(' / ')}）
 */
const MATH_DATA = [
`;

// 分野の一覧。絞り込みの選択肢と単元マップの行の並びになるので、**習う順**で書き出す。
// 出現順のままだと、手作り問題に無い単元（わり算など）が末尾にまとまってしまう
const used = [...new Set(all.map((p) => p.category))];
const unordered = used.filter((c) => !CATEGORY_ORDER.includes(c));
if (unordered.length) throw new Error(`並び順の表に無い分野: ${unordered.join(', ')}`);
const orderedCats = CATEGORY_ORDER.filter((c) => used.includes(c));

const footer =
  '];\n\n// 分野の一覧。習う順（tools/math-relevel.mjs の CATEGORY_ORDER）\n' +
  `const MATH_CATEGORIES = [${orderedCats.map((c) => `'${esc(c)}'`).join(', ')}];\n`;

writeFileSync(url('../js/math-data.js'), header + all.map(line).join(',\n') + '\n' + footer);

console.log(`既存 ${kept.length} 問を振り直し、${added.length} 問を追加。合計 ${all.length} 問`);
console.log('レベル別', byLevel);
console.log('分野別', byCat);
