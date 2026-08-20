/**
 * 単語のレベルを、**教材での初出**から付け直す。
 *
 *   node tools/relevel-vocab.mjs          … 何がどう動くかを出すだけ
 *   node tools/relevel-vocab.mjs --emit   … js/data.js の level を書き換える
 *
 * この単語帳の方針は「**その語が最初に出てくる本文のレベル**をその語のレベルとする」。
 * 教材そのものが Basic(A2) / Intermediate(B1) / Advanced(B2) と難易度順に分かれているので、
 * 外部の物差し（CEFR-J など）は持ち込まない。
 *
 * ところが、次の3つの理由でレベルが実態とずれていた。
 *
 *   1. **語彙練習リスト由来の620語がレベル3の決め打ち**だった。
 *      リストにレベルの情報が無いので、取り込みのときに 3 を入れていた
 *   2. **読解教材しか見ていなかった。**あとから文法教材3冊が入ったので、
 *      同じ語がより易しい冊子に出ていることがある（piano / exam / color が B1 のままだった）
 *   3. **冊子の巻頭・巻末まで数えていた。**巻頭は「TOEFL Junior とはどんな試験か」を
 *      大人向けに説明した文章で、その冊子のレベルで書かれた英文ではない。
 *      これを A2 の本文として数えていたため、communication / relationship が A2 になっていた
 *
 * **level だけを書き換える。id には触らない**（学習記録のキーなので）。
 */
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, load, FUNCTION_WORDS, candidates, loadDictionary } from './vocab-lib.mjs';

/**
 * 文法教材の**本編**のページ範囲。
 * これより前は奥付と試験の説明、これより後は解答と索引で、どちらも
 * その冊子のレベルで書かれた英文ではない。
 */
const BOOK_BODY = [
  ['materials/grammar-basic-a2.txt', 2, 13, 136],
  ['materials/grammar-inter-b1.txt', 3, 15, 139],
  ['materials/grammar-adv-b2.txt', 4, 15, 139]
];

const dict = loadDictionary();
const WORD_DATA = load('js/data.js', 'WORD_DATA');
const READING_DATA = load('js/reading-data.js', 'READING_DATA');
const GRAMMAR_DATA = load('js/grammar-data.js', 'GRAMMAR_DATA');

/** レベルの分かっている教材を集める */
function gradedSources() {
  const out = [];

  // 読解教材（r23〜r134）。本文・題・設問・選択肢・語注のどれに出ても、その本文のレベル
  for (const r of READING_DATA) {
    const n = Number(r.id.slice(1));
    if (n < 23 || n > 134) continue; // r1〜r22 は書き下ろしでレベルの根拠が別
    const parts = [r.passage, r.title];
    for (const q of r.questions) parts.push(q.q, ...q.choices);
    for (const g of r.glossary || []) parts.push(g.w);
    out.push({ level: r.level, text: parts.join('\n') });
  }

  // 文法教材の本編
  for (const [file, level, from, to] of BOOK_BODY) {
    const full = path.join(ROOT, file);
    if (!fs.existsSync(full)) {
      console.warn(`※ ${file} が無いので飛ばす（教材は git 管理外）`);
      continue;
    }
    const pages = fs.readFileSync(full, 'utf8').split(/^===== PAGE (\d+) =====$/m);
    const keep = [];
    for (let i = 1; i < pages.length; i += 2) {
      const n = Number(pages[i]);
      if (n >= from && n <= to) keep.push(pages[i + 1]);
    }
    out.push({ level, text: keep.join('\n') });
  }

  // 文法の設問データ。人が書き写したもので、冊子のレベルを持っている
  for (const q of GRAMMAR_DATA) out.push({ level: q.level, text: [q.question, ...q.choices].join(' ') });

  return out;
}

/** 見出し語 → 最初に出てくる教材のレベル */
function firstAppearance() {
  const at = new Map();
  for (const s of gradedSources()) {
    for (const raw of s.text.toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) || []) {
      if (raw.length < 3 || FUNCTION_WORDS.has(raw)) continue;
      const head = candidates(raw).find((c) => dict.has(c));
      if (!head) continue;
      const cur = at.get(head);
      if (cur === undefined || s.level < cur) at.set(head, s.level);
    }
  }
  return at;
}

const at = firstAppearance();

const moves = [];
const noEvidence = [];
for (const w of WORD_DATA) {
  const lv = at.get(w.word.toLowerCase());
  if (lv === undefined) { noEvidence.push(w); continue; }
  if (lv !== w.level) moves.push({ ...w, to: lv });
}

// ---- 出力 ----
const kind = {};
moves.forEach((m) => (kind[`${m.level}→${m.to}`] = (kind[`${m.level}→${m.to}`] || 0) + 1));
console.log(`単語 ${WORD_DATA.length} 語 / 教材に出てくる見出し語 ${at.size}`);
console.log(`  レベルが変わる: ${moves.length}`);
for (const [k, v] of Object.entries(kind).sort()) {
  const ex = moves.filter((m) => `${m.level}→${m.to}` === k).slice(0, 10).map((m) => m.word);
  console.log(`    ${k}: ${String(v).padStart(4)}   例) ${ex.join(' ')}`);
}
console.log(`  教材に出てこないので判定できない: ${noEvidence.length}`);
const byCat = {};
noEvidence.forEach((w) => (byCat[w.category] = (byCat[w.category] || 0) + 1));
console.log(`    ${JSON.stringify(byCat)}`);

const after = {};
WORD_DATA.forEach((w) => {
  const lv = at.get(w.word.toLowerCase()) ?? w.level;
  after[lv] = (after[lv] || 0) + 1;
});
const before = {};
WORD_DATA.forEach((w) => (before[w.level] = (before[w.level] || 0) + 1));
console.log(`\n  いまのレベル分布: ${JSON.stringify(before)}`);
console.log(`  直したあと      : ${JSON.stringify(after)}`);

if (process.argv.includes('--emit')) {
  // **1行1語の形をそのまま使い、level: の数字だけを置き換える。**
  // 読み直して書き出し直すと、手で直した箇所（例文の差し替えなど）を
  // 落とす危険があるので、行そのものには触らない
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
