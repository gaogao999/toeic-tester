/**
 * 文法（Language Usage）の設問を教材から取り込む。
 *
 *   node tools/import-grammar.mjs materials/grammar-basic-a2.txt
 *
 * 教材の「Check-up」は2択で、本文側と解答側が別々の場所にある。
 *
 *   本文  1. Dave (broke, broken) the window.
 *   解答  1. (broke)
 *
 * **解答欄は OCR で崩れている**（番号が飛ぶ、かっこが欠ける、順序が入れ替わる）ので、
 * 番号で突き合わせない。代わりに「解答の語が2つの選択肢のどちらかと一致するか」で決める。
 * 片方だけ一致すれば確定、両方または一方も一致しなければ**人が決める**（OVERRIDES）。
 *
 * 出力は data/raw/grammar-items.json（git 管理外）。
 * ここから js/grammar-data.js を作るのは emit-grammar.mjs の仕事。
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

/**
 * 解答欄から決まらなかったものの手決め。
 * 教材の解答が読み取れない場合に、文法的に正しいほうを人が選んで書く。
 * キーは「2つの選択肢を / でつないだもの」。
 */
const OVERRIDES = {
  // --- 主語と動詞の一致。is/are は解答欄の他の場所にもあるので自動では決まらない
  'is/are': 'is',        // 動名詞句が主語 → 単数（Making spaghetti and pies / Selling flowers）
  'are/is': 'are',       // ふつうの複数主語
  'is/am': 'am',         // not only A but also B は **B に合わせる**（… but also I → am）
  // --- 時制
  'will be performing/was performing': 'will be performing', // tomorrow なので未来
  'is/was': 'was',       // at that time なので過去
  // --- 代名詞
  'that/those': 'that',  // 単数のものを受ける（smile）
  // --- 語順
  'very beautiful/beautiful very': 'very beautiful'
};

/**
 * 同じ選択肢の組でも、文によって答えが変わるものは文ごとに決める。
 * 「Either A or B」「One of ～」「The number of ～」はどれも is/are の組だが、
 * 主語の取り方がそれぞれ違う。
 *
 * キーは文の**一部**にする。全文で持つと OCR の空白の揺れで当たらなくなるため。
 */
const BY_FRAGMENT = [
  { has: 'characters in that book', answer: 'are' },   // 主語は characters（複数）
  { has: 'Either you or he', answer: 'is' },           // either A or B は近いほうに合わせる
  { has: 'players and the coach', answer: 'are' },     // and で結んだ主語は複数
  { has: 'One of the girls', answer: 'is' },           // 主語は One（単数）
  { has: 'The number of', answer: 'is' },              // the number of ～ は単数（a number of なら複数）
  { has: 'who help themselves', answer: 'those' }      // 複数の人を受ける
];

/**
 * 章と単元。教材の目次から取った並び。
 * 設問がどの単元のものかは、本文中の見出しからは機械的に取れないので、
 * ページ番号の範囲で振り分ける。
 */
const UNITS = [
  { unit: '文の要素', from: 13, to: 29 },
  { unit: '主語と動詞の一致', from: 30, to: 39 },
  { unit: '時制', from: 40, to: 49 },
  { unit: '受動態', from: 50, to: 57 },
  { unit: '助動詞', from: 58, to: 67 },
  { unit: '不定詞', from: 68, to: 75 },
  { unit: '動名詞', from: 76, to: 81 },
  { unit: '分詞', from: 82, to: 87 },
  { unit: '名詞と冠詞', from: 88, to: 95 },
  { unit: '代名詞と数量詞', from: 96, to: 103 },
  { unit: '形容詞と副詞', from: 104, to: 109 },
  { unit: '比較', from: 110, to: 115 },
  { unit: '前置詞', from: 116, to: 121 },
  { unit: '接続詞', from: 122, to: 127 },
  { unit: '名詞節', from: 128, to: 131 },
  { unit: '副詞節', from: 132, to: 135 },
  { unit: '形容詞節', from: 136, to: 140 }
];

const unitFor = (page) => (UNITS.find((u) => page >= u.from && page <= u.to) || { unit: 'その他' }).unit;

function main() {
  const path = process.argv[2];
  if (!path) {
    console.error('使い方: node tools/import-grammar.mjs <教材のテキスト>');
    process.exit(1);
  }
  const lines = readFileSync(path, 'utf8').split('\n');

  // 解答欄の始まり。ここより前が本文
  const keyStart = lines.findIndex((l, i) => l.trim() === 'Answer Key' && i > lines.length * 0.8);
  if (keyStart < 0) throw new Error('Answer Key の位置が分からない');
  const body = lines.slice(0, keyStart);
  const key = lines.slice(keyStart);

  // 解答側にある語をすべて集める。番号は当てにしない
  const answers = new Set();
  for (const l of key) {
    const m = l.trim().match(/^\d+\.\s*\(([A-Za-z][A-Za-z '’-]*)\)$/);
    if (!m) continue;
    const w = m[1];
    const t = w.trim();
    // (C) のような1文字の記号は選択肢の番号であって語ではない
    if (t.length > 1 || !'ABCDEFGH'.includes(t)) answers.add(t.toLowerCase());
  }

  const itemRe = /^(\d+)\.\s(.*?)\(([A-Za-z][A-Za-z '’-]*),\s*([A-Za-z][A-Za-z '’-]*)\)(.*)$/;
  const items = [];
  let page = 0;
  const unresolved = [];

  for (const raw of body) {
    const l = raw.trim();
    const pm = l.match(/^===== PAGE (\d+) =====$/);
    if (pm) { page = Number(pm[1]); continue; }
    const m = l.match(itemRe);
    if (!m) continue;

    const [, , pre, a, b, post] = m;
    const [A, B] = [a.trim(), b.trim()];
    const inA = answers.has(A.toLowerCase());
    const inB = answers.has(B.toLowerCase());

    // OCR で文末のピリオドがコロンになることがある
    const sentence = `${pre.trim()} ___ ${post.trim()}`
      .replace(/\s+/g, ' ')
      .replace(/\s+([.,?!])/g, '$1')
      .replace(/[:;]\s*$/, '.')
      .trim();

    let correct = null;
    if (inA && !inB) correct = A;
    else if (inB && !inA) correct = B;
    // 文ごとの手決めが先。同じ選択肢の組でも主語の取り方で答えが変わる
    else correct = (BY_FRAGMENT.find((f) => sentence.includes(f.has)) || {}).answer
      || OVERRIDES[`${A}/${B}`] || null;

    const item = { page, unit: unitFor(page), sentence, options: [A, B], answer: correct };
    if (!correct) unresolved.push(item);
    items.push(item);
  }

  mkdirSync('data/raw', { recursive: true });
  writeFileSync('data/raw/grammar-items.json', JSON.stringify(items, null, 2));

  const byUnit = {};
  items.forEach((i) => (byUnit[i.unit] = (byUnit[i.unit] || 0) + 1));
  console.log(`設問 ${items.length} 件 → data/raw/grammar-items.json`);
  console.log(`  解答が決まった: ${items.length - unresolved.length} 件`);
  console.log(`  決まらなかった: ${unresolved.length} 件（OVERRIDES に書く）`);
  console.log('単元別:', byUnit);
  if (unresolved.length) {
    console.log('\n決まらなかったもの:');
    unresolved.forEach((i) => console.log(`  ['${i.options[0]}/${i.options[1]}']  ${i.sentence}`));
  }
}

main();
