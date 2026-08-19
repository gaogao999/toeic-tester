/**
 * 文法教材の設問文から、まだ単語データに無い語を拾う。
 *
 *   node tools/build-vocab-from-grammar.mjs          … 一覧を出すだけ
 *   node tools/build-vocab-from-grammar.mjs --emit   … js/data.js に**追記**する
 *
 * 元にするのは js/grammar-data.js の question と choices。
 * **OCR そのままの本文は使わない。**教材のページは OCR の傷が多く、そこから語を拾うと
 * つづりの壊れた語が混ざる（`7ih` `l'm` のたぐい）。設問文と選択肢は取り込みのときに
 * 1問ずつ人が読んで書き写したものなので、つづりが確かめてある。
 *
 * 選択肢は捨てずに使う。**教材が誤答としてわざわざ並べた語**（stationed / illogical /
 * captivating など）は、その教材が「この語を知っているか」を試している語なので、
 * 覚える価値がいちばん高い。
 *
 * 例文は、設問文の空所に正解を入れて組み立てる。**空所のままでは例文にならない**ので。
 *
 * ID は既存の最大値の次から振る。**既存の ID には触らない**（学習記録のキーなので）。
 */
import fs from 'node:fs';
import path from 'node:path';
import {
  ROOT, load, FUNCTION_WORDS, candidates, loadDictionary, loadPhonetics, pickSense, posOf
} from './vocab-lib.mjs';
// 長文から取り込むときと**同じ手直し表**を使う。同じ語が入り口によって
// 違う見出し・違う意味で2つ入るのを防ぐため
import { MEANINGS, DROP, REWRITE, POS, SPELLING_FIX } from './passage-vocab-overrides.mjs';
import { GRAMMAR_DROP, GRAMMAR_MEANINGS, GRAMMAR_POS, KEEP_AS_IS } from './grammar-vocab-overrides.mjs';

const WORD_DATA = load('js/data.js', 'WORD_DATA');
const GRAMMAR_DATA = load('js/grammar-data.js', 'GRAMMAR_DATA');

/** 出どころが分かるようにカテゴリを分ける。既存の分類は話題別だが、これは出典別 */
const CATEGORY = '文法問題の語';

/** 設問文の空所に正解を入れて、ふつうの英文に戻す */
const filled = (q) => q.question.replace('___', q.choices[q.answer]);

/**
 * 固有名詞を落とす。設問文の中で**一度も小文字で出てこない**語は人名・地名とみなす。
 * Bartholdi / Antoinette / Colosseum などがこれで落ちる。
 */
function properNouns(texts) {
  const cap = new Set();
  const low = new Set();
  for (const t of texts) {
    for (const w of t.match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g) || []) {
      (/^[A-Z]/.test(w) ? cap : low).add(w.toLowerCase());
    }
  }
  return new Set([...cap].filter((w) => !low.has(w)));
}

const dict = loadDictionary();
const phonetics = loadPhonetics();
const known = new Set(WORD_DATA.map((w) => w.word.toLowerCase()));

// 設問1つにつき「空所を埋めた文」と「選択肢すべて」を見る
const texts = [];
for (const q of GRAMMAR_DATA) texts.push(filled(q), ...q.choices);
const proper = properNouns(texts);

/**
 * 語形から見出し語を決める。入らないものは null を返す。
 *
 * **その語形そのものを見出しにする**（辞書に載っていれば）。
 * 「いちばん短い候補を選ぶ」ようにしたら number → numb、mother → moth、
 * brother → broth になった。candidates() は語尾を機械的に削るだけなので、
 * 短いほうが原形とはかぎらない。
 *
 * そのうえで、**すでに知っている語の活用形にすぎないもの**は落とす。
 * working（work を収録済み）を別の単語カードにしても覚えることが増えない。
 * wedding・building のように活用形ではなく独立した語として覚えるものは
 * KEEP_AS_IS に書いて、この判定から外す。
 */
function headwordOf(raw) {
  if (!dict.has(raw)) {
    // 語形のままでは辞書に無い。語尾を削った形をさがす（studies → study）
    const base = candidates(raw).find((c) => c !== raw && dict.has(c));
    return base ? gate(base) : null;
  }
  if (!KEEP_AS_IS.has(raw)) {
    const inflectionOfKnown = candidates(raw).some((c) => c !== raw && known.has(c));
    if (inflectionOfKnown) return null;
  }
  return gate(raw);
}

/** 手直し表を通してから、収録してよいかを判定する */
function gate(word) {
  let head = REWRITE[word] || word;
  head = SPELLING_FIX[head] || head;   // 英式のつづりは米式へ（アメリカ式の学校を受けるため）
  if (FUNCTION_WORDS.has(head)) return null;
  if (DROP.has(head) || GRAMMAR_DROP.has(head)) return null;
  if (known.has(head)) return null;    // すでに単語データにある語は足さない
  return head;
}

/** 見出し語 → { 初出のレベル, 例文 } */
const found = new Map();
for (const q of GRAMMAR_DATA) {
  const example = filled(q);
  for (const source of [example, ...q.choices]) {
    for (const raw of source.toLowerCase().match(/[a-z]+(?:['’][a-z]+)?/g) || []) {
      if (raw.length < 3 || raw.includes("'") || raw.includes('’')) continue;
      if (FUNCTION_WORDS.has(raw) || proper.has(raw)) continue;

      const head = headwordOf(raw);
      if (!head) continue;

      const cur = found.get(head);
      if (!cur) found.set(head, { count: 1, level: q.level, example, from: q.id });
      else {
        cur.count += 1;
        // より易しいレベルで出てきたら、そちらを初出とする
        if (q.level < cur.level) Object.assign(cur, { level: q.level, example, from: q.id });
      }
    }
  }
}

// 意味が引けないものは入れない。意味の無い単語カードは出しても覚えられない
const entries = [...found.entries()]
  .map(([word, v]) => ({
    word,
    ...v,
    // 手直し表 → 英和辞書 の順。辞書の語義が場違いなものはここで直す
    meaning: GRAMMAR_MEANINGS[word] || MEANINGS[word] || pickSense(dict.get(word) || '')
  }))
  .filter((e) => e.meaning)
  .sort((a, b) => a.level - b.level || b.count - a.count || a.word.localeCompare(b.word));

const nextId = Math.max(...WORD_DATA.map((w) => w.id)) + 1;
const rows = entries.map((e, i) => ({
  id: nextId + i,
  word: e.word,
  phonetic: phonetics.get(e.word) || '',
  pos: GRAMMAR_POS[e.word] || POS[e.word] || posOf(e.word, e.meaning),
  meaning: e.meaning,
  note: '',
  // 例文は**その語が実際に出ている**ものだけ付ける。
  // 見出しを原形に寄せると、例文には活用形しか入っていないことがある
  // （enable の初出が enabling だけ、など）。点検が「別の語の例文が付いている」で落とす
  example:
    e.example.length <= 160 && new RegExp(`\\b${e.word}`, 'i').test(e.example) ? e.example : '',
  exampleJa: '',
  level: e.level,
  category: CATEGORY,
  from: e.from,
  count: e.count
}));

const q = (v) => `'${String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const serialize = (w) =>
  `  { id: ${w.id}, word: ${q(w.word)}, phonetic: ${q(w.phonetic)}, pos: ${q(w.pos)}, ` +
  `meaning: ${q(w.meaning)}, note: ${q(w.note)}, example: ${q(w.example)}, exampleJa: '', ` +
  `level: ${w.level}, category: ${q(w.category)}, toefl: true }`;

if (process.argv.includes('--emit')) {
  const file = path.join(ROOT, 'js/data.js');
  const src = fs.readFileSync(file, 'utf8');
  const at = src.lastIndexOf('\n];');
  if (at < 0) throw new Error('js/data.js の配列の終わりが見つからない');
  const added = rows.map(serialize).join(',\n');
  fs.writeFileSync(file, `${src.slice(0, at)},\n${added}${src.slice(at)}`);
  console.log(`js/data.js に ${rows.length} 語を追記しました（id ${nextId}〜${nextId + rows.length - 1}）`);
} else {
  const byLevel = {};
  rows.forEach((r) => (byLevel[r.level] = (byLevel[r.level] || 0) + 1));
  console.log(`設問 ${GRAMMAR_DATA.length} 問から抽出`);
  console.log(`  まだ入っていない語（辞書に当たったもの）: ${found.size}`);
  console.log(`  収録できるもの（意味が引けたもの）: ${rows.length}`);
  console.log(`  レベル別: ${JSON.stringify(byLevel)}`);
  console.log(`  発音記号あり: ${rows.filter((r) => r.phonetic).length} / 例文あり: ${rows.filter((r) => r.example).length}`);
  console.log('\n先頭40語:');
  rows.slice(0, 40).forEach((r) => console.log(`  ${r.word} (${r.pos}) ${r.meaning}  [lv${r.level} ×${r.count}]`));
}

export { rows };
