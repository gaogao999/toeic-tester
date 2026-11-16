/**
 * えいごペットの単語データから、英検2級・準1級を取り込む。
 *
 *   node tools/import-eigo-pet.mjs ../eigo-pet/words.js
 *
 * js/data.js を書き出す。**えいごペットの側は読むだけで、触らない。**
 *
 * ---
 *
 * ## なぜえいごペットから取るか
 *
 * 花さんの範囲（2級〜準1級）がまるごと入っているから。2級 1,044語・準1級 2,782語に
 * 日本語の意味が付いている。以前このアプリにあった TOEFL Junior の3,037語は、
 * 花さんがワークシートで実際に出会った42語のうち25語しか持っていなかった。
 *
 * えいごペットの単語はさらに [bangluutru/eiken-workbook] から来ている。
 * そちらには**ライセンスも出どころの説明も無い**。公開リポジトリに置いている以上、
 * そのことは README に書いておく。
 *
 * ## 直していること
 *
 * - **全角カンマ「，」を読点「、」にする。**意味の区切り。紙の上で読みやすくするため
 * - **日本語のあいだの半角空白を消す。**元の PDF の改行の名残で
 *   「丁度間に 合って」「やむを得ず する」のように割れている（7語）
 *
 * - **見出し語の誤りを直す**（WORD_FIXES）。つづり誤り・崩れた熟語が5語あった
 *
 * ## 持ってこないもの
 *
 * - **品詞。当てにならない。**produce・defend・dizzy・dispose が「名詞」になっている
 *   （2級と準1級で名詞が 1,754語＝半分近い）。紙に出すと嘘を刷ることになるので外す
 * - 読みがなとやさしいいみ。えいごペットは小学生向けで、花さんには要らない
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = process.argv[2];
if (!SRC) {
  console.error('使い方: node tools/import-eigo-pet.mjs <えいごペットの words.js>');
  process.exit(1);
}

const ctx = {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(SRC, 'utf8'), ctx);
const BANK = ctx.WORDBANK;
if (!BANK || !BANK.g2 || !BANK.jun1) {
  console.error('WORDBANK.g2 / WORDBANK.jun1 が見つかりません。えいごペットの words.js を指定してください。');
  process.exit(1);
}

/** 意味を紙に載る形に整える */
function cleanMeaning(s) {
  return String(s)
    .trim()
    .replace(/，/g, '、')
    // 日本語（かな・漢字・記号）にはさまれた半角空白は、PDF の改行の名残
    .replace(/([^\x00-\x7F]) +(?=[^\x00-\x7F])/g, '$1');
}

/**
 * 取り込む級。**並びはえいごペットのまま**にする（毎日の「新しい語」はこの順に出す）。
 * 級の中の並びは元データの順で、見たところ頻度順に近い（deal with, result in, no longer …）
 */
const GRADES = [
  { key: 'g2', label: '英検2級' },
  { key: 'jun1', label: '英検準1級' }
];

/**
 * 見出し語そのものが誤っている語。**元データの誤り**で、例文を付けるときの見直しで見つかった。
 * null は取り込まない（何の語か決められないもの）。
 * 直したら、記録のキー（小文字の語）も変わる。すでに記録のある語を直すときは注意
 */
const WORD_FIXES = {
  neverthless: { word: 'nevertheless' },                       // つづりの誤り
  'be threatened to': { word: 'be threatened by' },            // 「に脅かされる」は by
  'absorb in': { word: 'be absorbed in', meaning: '没頭する' }, // 熟語は受け身。「吸収する」は absorb 単独の意味
  // 「停止、行き詰まり」は名詞 standstill の意味（準1級に別にある）。stand still は「じっとしている」
  'stand still': { meaning: 'じっとしている、静止する' },
  'in tough': null                                             // こういう熟語は無い。「に強い」とも合わない
};

const words = [];
const seen = new Set();
let fixedSpace = 0;
let fixedWords = 0;
for (const g of GRADES) {
  for (const w of BANK[g.key].words) {
    let word = String(w[0]).trim();
    let fix = WORD_FIXES[word.toLowerCase()];
    if (fix === null) {
      fixedWords += 1;
      continue;
    }
    if (fix) {
      fixedWords += 1;
      word = fix.word || word;
    }
    const key = word.toLowerCase();
    // 級をまたいだ重複は無いはずだが、あれば先に出た級（易しいほう）を残す
    if (seen.has(key)) continue;
    seen.add(key);
    const before = String(w[1]);
    const meaning = fix && fix.meaning ? fix.meaning : cleanMeaning(before);
    if (/[^\x00-\x7F] +[^\x00-\x7F]/.test(before.replace(/，/g, '、'))) fixedSpace += 1;
    words.push({ word, meaning, grade: g.key });
  }
}

const q = (v) => `'${String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const today = new Date().toISOString().slice(0, 10);
const counts = Object.fromEntries(GRADES.map((g) => [g.key, words.filter((w) => w.grade === g.key).length]));

const out = `/**
 * 英単語データ — 花さんの英検2級〜準1級
 *
 * **このファイルは手で直さない。**作り直しは
 *   node tools/import-eigo-pet.mjs <えいごペットの words.js>
 *
 * 出どころ: えいごペット（gaogao999/eigo-pet）の WORDBANK。
 * えいごペットはさらに bangluutru/eiken-workbook から取っている。
 * **そちらにはライセンスも出どころの説明も無い。**
 *
 * 取り込んだ日: ${today}
 *   2級   ${counts.g2}語
 *   準1級 ${counts.jun1}語
 *
 * 各エントリ: { word, meaning, grade }
 *   grade は 'g2'（2級）か 'jun1'（準1級）。
 *   **学習記録は word（小文字）をキーに持つ。**並べ替えても記録はずれない。
 *   品詞は持たない（元データの品詞が当てにならないため。tools/import-eigo-pet.mjs を見ること）
 */
const GRADE_LABELS = { g2: '2級', jun1: '準1級' };

const WORDS = [
${words.map((w) => `  { word: ${q(w.word)}, meaning: ${q(w.meaning)}, grade: ${q(w.grade)} }`).join(',\n')}
];
`;

fs.writeFileSync(path.join(ROOT, 'js/data.js'), out);
console.log(`js/data.js を書き出しました: 2級 ${counts.g2}語 ／ 準1級 ${counts.jun1}語 ／ 計 ${words.length}語`);
console.log(`  意味の中の改行くずれを直した語: ${fixedSpace}`);
console.log(`  見出し語の誤りを直した・外した語: ${fixedWords}（WORD_FIXES）`);
