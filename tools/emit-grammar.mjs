/**
 * 文法（Language Usage）のデータを書き出す。
 *
 *   node tools/emit-grammar.mjs
 *
 * 元は教材3冊。**教材そのものは公開リポジトリに置かない**ので（materials/ は .gitignore）、
 * この道具を走らせ直せるのは教材が手元にある人だけ。
 * リポジトリに残るのは書き出した js/grammar-data.js のほう。
 *
 *   A2（Basic）        2択 92問   … import-grammar.mjs が data/raw に出したもの
 *   B1（Intermediate） 4択 306問  … 選択肢は parse-grammar-lfm.mjs、正解は grammar-b1.mjs
 *   B2（Advanced）     4択 308問  … 同上 grammar-b2.mjs
 *
 * **ID はレベルごとに桁を分ける**（g2001〜 / g3001〜 / g4001〜）。
 * 学習記録は ID をキーに保存しているので、あとから1冊を作り直しても
 * ほかのレベルの ID がずれないようにするため。
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { parseLfm } from './parse-grammar-lfm.mjs';
import { unitFor } from './grammar-units.mjs';
import { B1_ITEMS } from './grammar-b1.mjs';
import { B2_ITEMS } from './grammar-b2.mjs';
import { A2_NOTES, A2_FIXES } from './grammar-a2.mjs';

/**
 * OCR の読み違い。選択肢の**中身の違い**（文法）には関わらない、字面だけの傷を直す。
 * 意味が変わる直しはここでせず、grammar-b1.mjs / grammar-b2.mjs の o に全文で書く。
 */
const OCR_FIX = [
  [/\b[6６]['’ʼ]?h\s+grade/g, '6th grade'],
  [/\b7(ih|['’]|th)?\s+grade/g, '7th grade'],
  [/\bT(ih|th)\s+grade/g, '7th grade'],
  [/\b8(['’]h|t|th)?\s+grade/g, '8th grade'],
  [/\bgth\s+grade/g, '8th grade'],
  [/\bl['’]/g, "I'"],          // 行頭の I が l に化ける
  [/\s{2,}/g, ' ']
];

/** 選択肢の字面を整える。文末の記号は問題文側が持つので落とす */
function clean(text) {
  let t = text.trim();
  for (const [re, to] of OCR_FIX) t = t.replace(re, to);
  return t.replace(/\s*[.,;:!]+$/, '').trim();
}

/** 4択の教材1冊ぶんを問題に組み立てる */
function buildBook(path, items, level, idBase) {
  const blocks = new Map(parseLfm(path).map((b) => [`p${b.page}-${b.idx}`, b.opts]));
  const out = [];
  for (const it of items) {
    const raw = it.o || blocks.get(it.k);
    if (!raw) throw new Error(`${path}: ${it.k} の選択肢が見つからない`);
    const choices = raw.map(clean);
    const answer = 'ABCD'.indexOf(it.a);
    if (answer < 0 || !choices[answer]) throw new Error(`${it.k}: 正解 ${it.a} が選択肢に無い`);
    out.push({
      id: `g${idBase + out.length + 1}`,
      question: it.s,
      choices,
      answer,
      explanation: it.j,
      level,
      unit: unitFor(Number(it.k.match(/^p(\d+)/)[1]))
    });
  }
  return out;
}

/**
 * A2 の2択。教材の Check-up から取ったもので、選択肢は2つしかない。
 * **4択に水増ししない。**もっともらしい誤答を機械で足すと、
 * 「どちらも正しい」問題ができてしまう（実際に作ってみて捨てた）。
 */
function buildA2(idBase) {
  const path = 'data/raw/grammar-items.json';
  if (!existsSync(path)) {
    console.warn(`※ ${path} が無いので A2 は飛ばす（node tools/import-grammar.mjs materials/grammar-basic-a2.txt で作れる）`);
    return [];
  }
  const items = JSON.parse(readFileSync(path, 'utf8'));
  const missing = [];
  const out = items
    .filter((it) => it.answer)
    .map((it, i) => {
      const choices = it.options.map(clean);
      // OCR の読み違いを直してから解説を引く（キーは直したあとの問題文）
      const question = A2_FIXES[it.sentence] || it.sentence;
      const explanation = A2_NOTES[question] || '';
      if (!explanation) missing.push(question);
      return {
        id: `g${idBase + i + 1}`,
        question,
        choices,
        answer: choices.indexOf(clean(it.answer)),
        explanation,
        level: 2,
        unit: it.unit
      };
    })
    .filter((q) => q.answer >= 0);
  // 解説はキーを問題文で持っているので、問題文が変わると静かに外れる。必ず知らせる
  if (missing.length) {
    console.warn(`※ 解説の付かない A2 の設問が ${missing.length} 件（grammar-a2.mjs に足す）:`);
    missing.forEach((q) => console.warn(`   ${q}`));
  }
  return out;
}

const all = [
  ...buildA2(2000),
  ...buildBook('materials/grammar-inter-b1.txt', B1_ITEMS, 3, 3000),
  ...buildBook('materials/grammar-adv-b2.txt', B2_ITEMS, 4, 4000)
];

/** 単元は「習う順」に並べる。記録タブのマス目がこの順で出る */
const UNIT_ORDER = [
  '文の要素', '主語と動詞の一致', '時制', '受動態', '助動詞', '仮定法',
  '不定詞', '動名詞', '分詞', '名詞と冠詞', '代名詞と数量詞', '形容詞と副詞',
  '比較', '前置詞', '接続詞', '名詞節', '副詞節', '形容詞節', '総合'
];
const unknown = [...new Set(all.map((q) => q.unit))].filter((u) => !UNIT_ORDER.includes(u));
if (unknown.length) throw new Error(`UNIT_ORDER に無い単元: ${unknown.join(', ')}`);

const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
const line = (q) =>
  `  { id: '${q.id}', question: '${esc(q.question)}', ` +
  `choices: [${q.choices.map((c) => `'${esc(c)}'`).join(', ')}], answer: ${q.answer}, ` +
  `explanation: '${esc(q.explanation)}', level: ${q.level}, unit: '${esc(q.unit)}' }`;

const header = `/**
 * 文法（Language Usage）の設問。
 *
 * **このファイルは tools/emit-grammar.mjs が書き出している。手で直さないこと。**
 * 直すときは tools/grammar-b1.mjs / tools/grammar-b2.mjs（問題文・正解・解説）か
 * tools/emit-grammar.mjs（字面の整え方）のほうを直して、書き出し直す。
 *
 *   id          … g<レベル><通し番号>。**学習記録のキー。振り直さないこと**
 *   question    … 空所を ___ で表した1文
 *   choices     … 選択肢。A2 は2つ、B1・B2 は4つ
 *   answer      … 正解の番号（0 から数える）
 *   explanation … 日本語の解説。**全問にある**（A2 は教材に解説が無いので書き足した）
 *   level       … 2=A2 / 3=B1 / 4=B2。**レベル1は今のところ無い**
 *   unit        … 単元。GRAMMAR_UNITS の並びが「習う順」
 *
 * 出典は TOEFL Junior 対策教材3冊（Basic / Intermediate / Advanced）。
 * **B1・B2 の正解は教材の解答欄が OCR で復元できなかったため、こちらで判定したもの。**
 * 判定の根拠は explanation に1問ずつ残してある。
 * A2 の解説も教材には無く、こちらで書いた（tools/grammar-a2.mjs）。
 */
`;

writeFileSync(
  'js/grammar-data.js',
  `${header}const GRAMMAR_DATA = [\n${all.map(line).join(',\n')}\n];\n\n` +
    `const GRAMMAR_UNITS = [\n${UNIT_ORDER.map((u) => `  '${u}'`).join(',\n')}\n];\n`
);

const byLevel = {};
const byUnit = {};
all.forEach((q) => {
  byLevel[q.level] = (byLevel[q.level] || 0) + 1;
  byUnit[q.unit] = (byUnit[q.unit] || 0) + 1;
});
console.log(`${all.length} 問 → js/grammar-data.js`);
console.log('レベル別:', byLevel);
console.log('単元別:', byUnit);
