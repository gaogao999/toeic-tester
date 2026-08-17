/**
 * 教材（TOEFL Junior）の語注から単語データを作る。
 *
 * 取り込んだ長文 r23〜r134 の glossary は、教材自身が「この語は難しい」と
 * 印を付けたもの。EIS の入試対策としては、頻度リストから機械的に選ぶより
 * 信号が強い。ここではその語注のうち、まだ js/data.js に無いものを拾う。
 *
 * 例文は本文からそのまま取る。教材の文脈で覚えられるほうが定着するため。
 * 日本語訳だけは自動で作れないので、gloss-examples.mjs に手で書いてある。
 *
 *   node tools/build-gloss-vocab.mjs            … 不足語の一覧を出すだけ
 *   node tools/build-gloss-vocab.mjs --emit     … js/data.js に追記する
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { OVERRIDES } from './gloss-overrides.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const load = (file, name) =>
  new Function(fs.readFileSync(path.join(ROOT, file), 'utf8') + `;return ${name};`)();

const WORD_DATA = load('js/data.js', 'WORD_DATA');
const READING_DATA = load('js/reading-data.js', 'READING_DATA');

// 教材由来の長文だけを対象にする（r1〜r22 は書き下ろしなので除く）
const fromMaterial = (r) => {
  const n = Number(r.id.slice(1));
  return n >= 23 && n <= 134;
};

// 本文の題材を、単語データ側のカテゴリに寄せる
const TOPIC_TO_CATEGORY = {
  学校生活: '学校生活',
  お知らせ: '学校生活',
  '手紙・メール': '日常・生活',
  日常生活: '日常・生活',
  理科: '理科',
  科学: '理科',
  '科学・生活': '理科',
  生物: '動物・植物',
  環境: '自然・天気',
  '環境・経済': '社会・地理',
  技術: '科学・技術',
  歴史: '社会・地理',
  社会: '社会・地理',
  文化: '社会・地理',
  伝記: '社会・地理'
};

/** 意味の書きぶりから品詞を当てる。語注は日本語なので、その語尾で判断できる */
function guessPos(word, meaning) {
  if (/\s/.test(word)) return 'phr.'; // 複数語はまとめて熟語扱い
  if (/(する|される|せる|れる|む|ぶ|つ|く|ぐ|す|う|る)$/.test(meaning) && !/^.{1,2}$/.test(meaning)) {
    if (/(的な|な|い|の)$/.test(meaning)) return 'adj.';
    return 'v.';
  }
  if (/(な|い|の|的)$/.test(meaning)) return 'adj.';
  if (/(に|く|て)$/.test(meaning)) return 'adv.';
  return 'n.';
}

/** ipa-dict から発音記号を引く */
function loadPhonetics() {
  const file = path.join(ROOT, 'data/raw/vocab-sources/ipa.txt');
  const map = new Map();
  if (!fs.existsSync(file)) return map;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const [w, ipa] = line.split('\t');
    if (!w || !ipa) continue;
    const first = ipa.split(',')[0].trim();
    if (!map.has(w.toLowerCase())) map.set(w.toLowerCase(), first);
  }
  return map;
}

/** 本文からその語を含む一文を取り出す。長すぎる文は例文に向かないので避ける */
function findSentence(passage, word) {
  const sentences = passage
    .replace(/\n/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const re = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');
  const hits = sentences.filter((s) => re.test(s) && s.length >= 30 && s.length <= 150);
  if (!hits.length) return '';
  // 短いほうが例文として読みやすい
  return hits.sort((a, b) => a.length - b.length)[0];
}

// ---- 語注を集める ----

const glossary = new Map();
for (const r of READING_DATA.filter(fromMaterial)) {
  for (const g of r.glossary || []) {
    const key = g.w.toLowerCase().trim();
    const entry = glossary.get(key);
    if (!entry) {
      glossary.set(key, { word: g.w.trim(), meaning: g.m, level: r.level, sources: [r] });
    } else {
      entry.sources.push(r);
      // 同じ語が複数の本文に出る場合、いちばんやさしいレベルを採用する
      if (r.level < entry.level) entry.level = r.level;
    }
  }
}

const known = new Set(WORD_DATA.map((w) => w.word.toLowerCase()));
const missing = [...glossary.values()].filter((g) => !known.has(g.word.toLowerCase()));

const phonetics = loadPhonetics();
const nextId = Math.max(...WORD_DATA.map((w) => Number(w.id))) + 1;

const built = missing.map((g, i) => {
  const source = g.sources[0];
  const ov = OVERRIDES[g.word.toLowerCase()] || {};
  return {
    id: nextId + i,
    word: g.word,
    phonetic: phonetics.get(g.word.toLowerCase()) || '',
    // 品詞の推測は外すことがあるので、手直しがあればそちらを採る
    pos: ov.pos || guessPos(g.word, g.meaning),
    meaning: g.meaning,
    note: '',
    example: ov.example || findSentence(source.passage, g.word),
    exampleJa: ov.ja || '',
    level: g.level,
    category: TOPIC_TO_CATEGORY[source.topic] || '読解の名詞',
    // 教材由来であることの印。出題範囲の絞り込みに使う
    toefl: true,
    from: source.id
  };
});

export { built, glossary, missing };

/** js/data.js の1行と同じ書きぶりにする */
function serialize(w) {
  const s = (v) => `'${String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  return (
    `  { id: ${w.id}, word: ${s(w.word)}, phonetic: ${s(w.phonetic)}, pos: ${s(w.pos)}, ` +
    `meaning: ${s(w.meaning)}, note: ${s(w.note)}, example: ${s(w.example)}, ` +
    `exampleJa: ${s(w.exampleJa)}, level: ${w.level}, category: ${s(w.category)}, toefl: true }`
  );
}

if (process.argv.includes('--emit')) {
  const file = path.join(ROOT, 'js/data.js');
  let src = fs.readFileSync(file, 'utf8');

  // すでに取り込み済みなら二重に足さない
  if (src.includes('toefl: true')) {
    console.error('js/data.js には既に toefl の印が入っています。先に git で戻してください。');
    process.exit(1);
  }

  // ① 既存の語のうち、教材の語注に載っているものへ印を付ける
  const glossWords = new Set([...glossary.keys()]);
  let flagged = 0;
  // 行末は " }," なので、そこまで含めて捉える
  src = src.replace(/^(\s*\{ id: \d+, word: '((?:[^'\\]|\\.)*)'.*?)\s\}(,?)$/gm, (line, body, word, comma) => {
    if (!glossWords.has(word.replace(/\\'/g, "'").toLowerCase())) return line;
    flagged += 1;
    return `${body}, toefl: true }${comma}`;
  });

  // ② 不足していた語を末尾に足す
  const block = built.map(serialize).join(',\n');
  const marker = '\n];';
  const at = src.lastIndexOf(marker);
  if (at < 0) throw new Error('WORD_DATA の終わりが見つかりません');
  src = `${src.slice(0, at)},\n\n  // ---- 教材（TOEFL Junior）の語注から取り込んだ語 ----\n${block}${src.slice(at)}`;

  fs.writeFileSync(file, src);
  console.log(`既存の語に印を付けた: ${flagged} 語`);
  console.log(`新しく追加した語:     ${built.length} 語`);
} else if (process.argv.includes('--json')) {
  fs.writeFileSync(path.join(ROOT, 'data/raw/gloss-vocab.json'), JSON.stringify(built, null, 1));
  console.log(`data/raw/gloss-vocab.json に ${built.length} 語を書き出しました`);
} else {
  console.log(`語注 ${glossary.size} 語 / 既存 ${glossary.size - missing.length} 語 / 不足 ${missing.length} 語`);
  const noPhonetic = built.filter((b) => !b.phonetic).length;
  const noExample = built.filter((b) => !b.example).length;
  console.log(`  発音記号が引けなかった: ${noPhonetic} 語`);
  console.log(`  本文から例文を取れなかった: ${noExample} 語`);
  const byPos = {};
  built.forEach((b) => (byPos[b.pos] = (byPos[b.pos] || 0) + 1));
  console.log('  品詞の推定:', JSON.stringify(byPos));
  const byCat = {};
  built.forEach((b) => (byCat[b.category] = (byCat[b.category] || 0) + 1));
  console.log('  カテゴリ:', JSON.stringify(byCat));
}
