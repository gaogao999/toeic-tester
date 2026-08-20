/**
 * **語彙練習リスト（別ファイルの xlsx）から入った語**を単語データから取り除く。
 *
 *   node tools/prune-list-vocab.mjs          … 何が消えるかを出すだけ
 *   node tools/prune-list-vocab.mjs --emit   … js/data.js から取り除く
 *
 * この単語帳は「収録の根拠は、その語が**教材に出ている**という事実だけ」という方針で作っている。
 * リスト由来の語は、たとえ教材に出ていても、**エントリそのものの出どころが教材ではない**。
 *
 *   - レベルが 3 の決め打ちで入った（あとから初出で付け直したが、元は根拠が無い）
 *   - **例文が付かない。**リストは語の一覧で、本文を持たない
 *   - note に載る同義語・対義語はリスト側の情報で、教材には出てこない
 *
 * `tools/prune-vocab.mjs` が消したのは「教材に出てこない453語」で、こちらは
 * **残った167語（教材に出てはいるが、入り口がリストだったもの）**を消す。
 *
 * **教材に出る語は、教材を見る取り込み口が入れ直す。**
 * 消したあとに `node tools/build-vocab-from-grammar.mjs --emit` を走らせると、
 * 文法教材の本文・設問から同じ語が**例文つきで**入る。入り口が変われば
 * 出どころが教材になり、方針と辻褄が合う。
 *
 * 消した ID は二度と使い回さない（新しい語は最大値の次から振る）。
 * 残る語の ID は動かさない。
 *
 * ---
 *
 * ## どうやってリスト由来と見分けるか
 *
 * データに印は付いていないので、**当時と同じ手順を踏み直して**特定する。
 * `build-vocab-from-passages.mjs` は
 *
 *     for (const [word, [unit, topic]] of Object.entries(UNITS)) {
 *       if (!WORD_LIST.has(word)) continue;
 *       if (words.has(word)) continue;   // ← 本文に出る語はもう入っている
 *       ...
 *     }
 *
 * という枝でリストの語を足していた。同じ条件を回せば候補620語が再現でき、
 * そのうち js/data.js に今も残っているものが消す対象になる。
 */
import fs from 'node:fs';
import path from 'node:path';
import { KEY_MEANINGS, UNITS, WORD_LIST } from './toefl-junior-wordlist.mjs';
import { MEANINGS, DROP } from './passage-vocab-overrides.mjs';
import { ROOT, load, FUNCTION_WORDS, pickSense } from './vocab-lib.mjs';

const EMIT = process.argv.includes('--emit');
// **読み込む先が argv を見て止まる。**build-vocab-from-passages.mjs は --emit が
// 付いていると「ID が振り直される」と言って process.exit する作りで、
// import しただけでそれが走る。こちらの --emit とは意味が違うので、取り込む前に外す
process.argv = process.argv.filter((a) => a !== '--emit');
const { collect } = await import('./build-vocab-from-passages.mjs');

const { words, dict } = collect();

/** 当時 fromList 枝で入った語を再現する */
const fromList = new Set();
for (const word of Object.keys(UNITS)) {
  if (!WORD_LIST.has(word)) continue;
  if (words.has(word)) continue;
  if (FUNCTION_WORDS.has(word) || DROP.has(word)) continue;
  if (!KEY_MEANINGS[word] && !dict.has(word)) continue;
  // 意味が引けないものは当時の最後の filter で落ちている
  if (!(MEANINGS[word] || KEY_MEANINGS[word] || pickSense(dict.get(word) || ''))) continue;
  fromList.add(word);
}

const WORD_DATA = load('js/data.js', 'WORD_DATA');

/**
 * **入れ直したぶんを巻き添えにしない。**
 *
 * 削除のあと `build-vocab-from-grammar.mjs` が同じ語を教材から入れ直しているので、
 * 語だけを見ると「リスト由来」と区別が付かない（もともとリストの候補620語なので当然）。
 * 入り口が教材のものはカテゴリが「文法教材の語」になるので、そこで分ける。
 * これが無いと、走らせるたびに入れ直したカードを消してしまう。
 */
const FROM_MATERIAL = new Set(['文法教材の語']);

const drop = WORD_DATA.filter(
  (w) => fromList.has(w.word.toLowerCase()) && !FROM_MATERIAL.has(w.category)
);

const byLv = {};
drop.forEach((w) => (byLv[w.level] = (byLv[w.level] || 0) + 1));
console.log(`単語 ${WORD_DATA.length} 語`);
console.log(`  リスト由来の候補（当時の枝を再現）: ${fromList.size}`);
console.log(`  いま残っていて消すもの: ${drop.length}`);
console.log(`    レベル別: ${JSON.stringify(byLv)}`);
console.log(`    例文あり: ${drop.filter((w) => w.example).length}`);
console.log(`  残る語: ${WORD_DATA.length - drop.length}`);
console.log(`\n消す語:\n  ${drop.map((w) => w.word).join(' ')}`);

if (EMIT) {
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
