/**
 * 文法教材から、まだ単語データに無い語を拾う。
 *
 *   node tools/build-vocab-from-grammar.mjs          … 一覧を出すだけ
 *   node tools/build-vocab-from-grammar.mjs --emit   … js/data.js に**追記**する
 *
 * 元にするのは次の2つ。
 *
 *   ① js/grammar-data.js の question と choices
 *      取り込みのときに1問ずつ人が読んで書き写したもの。つづりが確かめてある。
 *      選択肢も使う。**教材が誤答としてわざわざ並べた語**（stationed / illogical /
 *      captivating など）は「この語を知っているか」を試している語なので、
 *      覚える価値がいちばん高い。
 *
 *   ② 教材の本文にある**完全な英文**（materials/*.txt）
 *      解説ページの例文（`Look at the huge sculptures.`）と長文の地の文。
 *      設問文だけでは日常語（wallet / haircut / umbrella）がほとんど拾えないので足した。
 *
 * ②で **OCR の傷をどう避けているか**が肝。ページの語をそのまま拾うのではなく、
 *
 *   - 大文字で始まり文末の記号で終わる、4〜40語の行だけを「文」とみなす
 *   - **その文に含まれる語がすべて辞書に当たること**を条件にする。
 *     1語でも壊れていれば文ごと捨てる（`infor` `mation` のような分断はこれで落ちる）
 *   - 拾った文をそのまま例文として使う。例文が壊れていないことが保証される
 *
 * さらに、教材が**英語について語るために使う語**（verb / gerund / participle …）は
 * METALANGUAGE で落とす。頻度で並べると上位を独占するが、入試で問われる語ではない。
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
import {
  GRAMMAR_DROP, GRAMMAR_MEANINGS, GRAMMAR_POS, KEEP_AS_IS, METALANGUAGE
} from './grammar-vocab-overrides.mjs';

const WORD_DATA = load('js/data.js', 'WORD_DATA');
const GRAMMAR_DATA = load('js/grammar-data.js', 'GRAMMAR_DATA');

/** 出どころが分かるようにカテゴリを分ける。既存の分類は話題別だが、これは出典別 */
const CATEGORY = '文法教材の語';

/** 教材3冊。レベルはその冊子の CEFR に合わせる */
const BOOKS = [
  ['materials/grammar-basic-a2.txt', 2],
  ['materials/grammar-inter-b1.txt', 3],
  ['materials/grammar-adv-b2.txt', 4]
];

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

/**
 * 教材の本文から「文らしい行」だけを拾う。
 *
 * OCR は版面をそのまま流すので、見出し・ページ番号・選択肢・表がすべて行として混ざる。
 * **文になっている行だけを通す**ことで、そのほとんどを落とせる。
 */
function sentencesOf(text) {
  const out = [];
  for (const raw of text.split('\n')) {
    // 教材は例文を2つ、1行に「 / 」でつないで並べることがある。
    // 分けずに拾うと、無関係な2文がくっついた例文になる
    //   「I'm packing my backpack. / She is studying linguistics at Durham University.」
    for (const part of raw.split(/\s+\/\s+/)) {
      const l = part.trim();
      if (!/^["'“]?[A-Z]/.test(l)) continue;      // 大文字で始まる
      if (!/[.!?]["'”]?$/.test(l)) continue;      // 文末の記号で終わる（見出しはここで落ちる）
      if (/\([A-D]\)/.test(l)) continue;          // 選択肢の記号を含む行
      if (/www\.|@|http/.test(l)) continue;       // URL・メールアドレス
      if (/^\d|\d{3,}/.test(l)) continue;         // ページ番号・年号の羅列
      // 設問の指示文。英文ではあるが、覚える語の例文としては中身が無い
      if (/^Questions?\s+\d|refer to the following/i.test(l)) continue;
      const words = l.match(/[A-Za-z]+/g) || [];
      if (words.length < 4 || words.length > 40) continue;
      out.push(l.replace(/\s+/g, ' '));
    }
  }
  return out;
}

const bookText = new Map(BOOKS.map(([path]) => [path, fs.readFileSync(path, 'utf8')]));

// 設問1つにつき「空所を埋めた文」と「選択肢すべて」、それに教材の本文を見る
const texts = [];
for (const q of GRAMMAR_DATA) texts.push(filled(q), ...q.choices);
// 固有名詞の判定は**教材の全文**で行う。設問文だけだと、教材に何度も出てくる
// 人名（Bartholdi など）が設問文では小文字で現れず、判定を誤ることがある
const proper = properNouns([...texts, ...bookText.values()]);

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
  if (METALANGUAGE.has(head)) return null;   // 英語について語るための語は覚える対象ではない
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

      remember(head, q.level, example, q.id);
    }
  }
}

/** 見つけた語を控える。より易しいレベルで出てきたら、そちらを初出とする */
function remember(head, level, example, from) {
  const cur = found.get(head);
  if (!cur) found.set(head, { count: 1, level, example, from });
  else {
    cur.count += 1;
    if (level < cur.level) Object.assign(cur, { level, example, from });
  }
}

// ---- ② 教材の本文の、完全な英文から ----
let seenSentences = 0;
let usedSentences = 0;
for (const [path, level] of BOOKS) {
  for (const sentence of sentencesOf(bookText.get(path))) {
    seenSentences += 1;
    const tokens = sentence.toLowerCase().match(/[a-z]+(?:['’][a-z]+)?/g) || [];

    // **文まるごとの健全性を先に見る。**語が1つでも壊れていれば文ごと捨てる。
    // OCR は語を分断する（infor / mation）ので、拾った語だけを見ていると気づけない。
    // 例文としてそのまま出すものなので、文が壊れていないことのほうが大事
    const broken = tokens.some(
      (t) =>
        t.length > 2 &&
        !t.includes("'") &&
        !t.includes('’') &&
        !proper.has(t) &&
        !FUNCTION_WORDS.has(t) &&
        !known.has(t) &&
        !candidates(t).some((c) => dict.has(c))
    );
    if (broken) continue;
    usedSentences += 1;

    for (const raw of tokens) {
      if (raw.length < 3 || raw.includes("'") || raw.includes('’')) continue;
      if (FUNCTION_WORDS.has(raw) || proper.has(raw)) continue;
      const head = headwordOf(raw);
      if (!head) continue;
      remember(head, level, sentence, path.replace(/^materials\/|\.txt$/g, ''));
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

// **同じ回で原形も入る活用形は落とす。**headwordOf が見ているのは「すでに単語データに
// ある語」だけなので、steal と stealing、jog と jogging のように、原形も活用形も
// 今回まとめて入ってくる組は素通りしてしまう
const batch = new Set(entries.map((e) => e.word));
const deduped = entries.filter(
  (e) => KEEP_AS_IS.has(e.word) || !candidates(e.word).some((c) => c !== e.word && batch.has(c))
);

const nextId = Math.max(...WORD_DATA.map((w) => w.id)) + 1;
const rows = deduped.map((e, i) => ({
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
  console.log(`設問 ${GRAMMAR_DATA.length} 問と、教材の英文 ${usedSentences} / ${seenSentences} 文から抽出`);
  console.log(`  まだ入っていない語（辞書に当たったもの）: ${found.size}`);
  console.log(`  収録できるもの（意味が引けたもの）: ${rows.length}`);
  const dropped = entries.filter((e) => !deduped.includes(e)).map((e) => e.word);
  if (dropped.length) console.log(`  同じ回に原形も入るので落とした活用形: ${dropped.join(' ')}`);
  console.log(`  レベル別: ${JSON.stringify(byLevel)}`);
  console.log(`  発音記号あり: ${rows.filter((r) => r.phonetic).length} / 例文あり: ${rows.filter((r) => r.example).length}`);
  console.log('\n先頭40語:');
  rows.slice(0, 40).forEach((r) => console.log(`  ${r.word} (${r.pos}) ${r.meaning}  [lv${r.level} ×${r.count}]`));
}

export { rows };
