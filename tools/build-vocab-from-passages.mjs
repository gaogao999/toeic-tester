/**
 * 教材（TOEFL Junior 3冊）の本文に実際に出てくる語から単語データを作る。
 *
 * これまでの単語データは CEFR-J から機械的に組んだもので、EIS の入試とも
 * 使っている教材とも無関係だった。ここでは「教材に出てくる語」だけを収録する。
 * 根拠が「その語が教材に出ている」という事実だけで説明できる状態にする。
 *
 * レベルは、その語が初めて出てくる本文のレベルを使う。
 * Basic(A2) の本文に出る語は A2、Advanced(B2) にしか出ない語は B2 とみなす。
 * 教材そのものが難易度順に並んでいるので、外部の物差しを持ち込まずに済む。
 *
 *   node tools/build-vocab-from-passages.mjs          … 集計だけ
 *   node tools/build-vocab-from-passages.mjs --emit   … js/data.js を**丸ごと**書き直す
 *
 * ⚠ **--emit はもう使えない。**
 * このファイルは ID を並び順（i + 1）で振る。書き出したあとに js/data.js を
 * 手で直したもの（重複していた theatre を消した・例文を差し替えた）が
 * ここには入っていないので、走らせると theater が id 379 に戻り、
 * **それ以降の ID が全部1つずれる**。ID は学習記録の保存キーなので、
 * 利用者のこれまでの記録が消える。
 *
 * 実際に走らせて確かめた（2,919語のうち id 379 以降が総入れ替えになる）。
 * 語を足したいときは、追記する道具のほうを使うこと:
 *   tools/build-gloss-vocab.mjs        … 教材の語注から
 *   tools/build-vocab-from-grammar.mjs … 文法教材の設問文から
 * どうしても丸ごと作り直すなら、先に手直しを overrides へ移してから。
 */
import fs from 'node:fs';
import path from 'node:path';
import { MEANINGS, DROP, REWRITE, POS, EXAMPLES, SPELLING_FIX } from './passage-vocab-overrides.mjs';
import { KEY_MEANINGS, RELATIONS, UNITS, WORD_LIST } from './toefl-junior-wordlist.mjs';
// 機能語の一覧・見出し語の当て方・語義の選び方は、ほかの取り込み口と**同じもの**を使う
import {
  ROOT, load, FUNCTION_WORDS, candidates, loadDictionary, loadPhonetics, pickSense, posOf
} from './vocab-lib.mjs';

const READING_DATA = load('js/reading-data.js', 'READING_DATA');

// 教材由来の長文だけ（r1〜r22 は書き下ろしなので除く）
const MATERIAL = READING_DATA.filter((r) => {
  const n = Number(r.id.slice(1));
  return n >= 23 && n <= 134;
});

/** 語注は教材が付けた日本語なので、辞書より優先する */
function loadGlossary() {
  const gl = new Map();
  for (const r of MATERIAL) {
    for (const g of r.glossary || []) {
      const k = g.w.toLowerCase().trim();
      if (!gl.has(k)) gl.set(k, g.m);
    }
  }
  return gl;
}

// ---- 本文を走査する ----

/** 本文中で常に大文字始まりの語は固有名詞とみなして落とす */
function properNouns() {
  const cap = new Map();
  const low = new Set();
  for (const r of MATERIAL) {
    for (const w of r.passage.match(/[A-Za-z]+(?:'[A-Za-z]+)?/g) || []) {
      const l = w.toLowerCase();
      if (/^[A-Z]/.test(w)) cap.set(l, (cap.get(l) || 0) + 1);
      else low.add(l);
    }
  }
  return new Set([...cap.keys()].filter((w) => !low.has(w)));
}

export function collect() {
  const dict = loadDictionary();
  const proper = properNouns();

  // 見出し語 → { 回数, 最小レベル, 出てきた本文 }
  const words = new Map();

  for (const r of MATERIAL) {
    const sentences = r.passage
      .replace(/\n/g, ' ')
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);

    for (const sentence of sentences) {
      for (const raw of sentence.toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) || []) {
        if (raw.length < 3) continue;
        if (raw.includes("'")) continue;
        if (FUNCTION_WORDS.has(raw)) continue;
        if (proper.has(raw)) continue;

        // 辞書に当たる形を見出し語にする
        let head = candidates(raw).find((c) => dict.has(c));
        if (!head) continue;
        head = REWRITE[head] || head;          // -ing 形などを原形へ寄せる
        head = SPELLING_FIX[head] || head;     // 英式のつづりは米式へ（アメリカ式の学校を受けるため）
        if (FUNCTION_WORDS.has(head)) continue;
        if (DROP.has(head)) continue;          // 間投詞や略語の断片は収録しない

        const cur = words.get(head);
        if (!cur) {
          words.set(head, { count: 1, level: r.level, sentence, from: r.id, topic: r.topic });
        } else {
          cur.count += 1;
          if (r.level < cur.level) {
            cur.level = r.level;
            cur.sentence = sentence;
            cur.from = r.id;
            cur.topic = r.topic;
          }
        }
      }
    }
  }
  return { words, dict, proper };
}

// ---- 出力 ----

const TOPIC_TO_CATEGORY = {
  学校生活: '学校生活', お知らせ: '学校生活', '手紙・メール': '日常・生活', 日常生活: '日常・生活',
  理科: '理科', 科学: '理科', '科学・生活': '理科', 生物: '動物・植物', 環境: '自然・天気',
  '環境・経済': '社会・地理', 技術: '科学・技術', 歴史: '社会・地理', 社会: '社会・地理',
  文化: '社会・地理', 伝記: '社会・地理'
};


const { words, dict } = collect();
const gloss = loadGlossary();
const phonetics = loadPhonetics();

// 語彙練習リストにしか無い語も足す。本文には出ないが、同じ TOEFL Junior の
// 教材なので根拠は同じ。ユニットの題材を出典として持たせる
for (const [word, [unit, topic]] of Object.entries(UNITS)) {
  if (!WORD_LIST.has(word)) continue;   // v3 の一覧に無い項目は採らない
  if (words.has(word)) continue;
  if (FUNCTION_WORDS.has(word) || DROP.has(word)) continue;
  if (!KEY_MEANINGS[word] && !dict.has(word)) continue; // 意味が用意できないものは入れない
  words.set(word, { count: 0, level: 3, sentence: '', from: unit, topic, fromList: true });
}

const entries = [...words.entries()]
  // 本文に出る語はすべて入れる。1回しか出ない語も、その分野の鍵になることが
  // 多いので落とさない。語彙練習リストにしか無い語（count が 0）も収録する
  .filter(([, v]) => v.count >= 1 || v.fromList)
  .sort((a, b) => a[1].level - b[1].level || b[1].count - a[1].count)
  .map(([word, v], i) => {
    // 教材が付けた語注があればそれを使い、無ければ英和辞書から引く
    // 手直し表 → 語彙リストの Key Word → 教材の語注 → 英和辞書 の順に採る。
    // Key Word は資料が直接与えている日本語なので、辞書より信用できる
    const meaning = MEANINGS[word] || KEY_MEANINGS[word] || gloss.get(word) || pickSense(dict.get(word) || '');

    // 同義語・対義語があれば補足に出す。単語カードの「⚠」欄に表示される
    const rel = RELATIONS[word];
    const note = rel
      ? [rel.syn.length ? `同義語: ${rel.syn.join(', ')}` : '', rel.ant.length ? `対義語: ${rel.ant.join(', ')}` : '']
          .filter(Boolean)
          .join(' ／ ')
      : '';
    return {
      id: i + 1,
      word,
      phonetic: phonetics.get(word) || '',
      pos: POS[word] || posOf(word, meaning),
      meaning,
      note,
      example: EXAMPLES[word] || (v.sentence.length <= 160 ? v.sentence : ''),
      exampleJa: '',
      level: v.level,
      category: TOPIC_TO_CATEGORY[v.topic] || '読解の名詞',
      count: v.count,
      from: v.from
    };
  })
  .filter((e) => e.meaning);

export { entries };

/** js/data.js の1行の書きぶりに合わせる */
function serialize(w) {
  const q = (v) => `'${String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  return (
    `  { id: ${w.id}, word: ${q(w.word)}, phonetic: ${q(w.phonetic)}, pos: ${q(w.pos)}, ` +
    `meaning: ${q(w.meaning)}, note: ${q(w.note)}, example: ${q(w.example)}, exampleJa: '', ` +
    `level: ${w.level}, category: ${q(w.category)}, toefl: true }`
  );
}

if (process.argv.includes('--emit') && !process.argv.includes('--i-know-ids-will-shift')) {
  // ここを通すと ID が振り直され、利用者の学習記録が壊れる。ファイル冒頭の警告を読むこと
  console.error('--emit は止めてある。ID が振り直されて学習記録が壊れるため。冒頭のコメントを読むこと。');
  process.exit(1);
}

if (process.argv.includes('--emit')) {
  const header = `/**
 * 英単語データ — Ekamai International School (EIS) Grade 8 受験向け
 *
 * 出どころは1つだけ。**TOEFL Junior 教材3冊の本文に実際に出てくる語**。
 * 「その語が教材に出ている」という事実以外の根拠は使っていない。
 * 以前の CEFR-J 由来のデータは、EIS の入試とも教材とも無関係だったので捨てた。
 *
 * レベルは、その語が最初に出てくる本文のレベル。
 *   2 = Basic(A2)  3 = Intermediate(B1)  4 = Advanced(B2)
 * 教材そのものが難易度順に並んでいるので、外部の物差しを持ち込んでいない。
 *
 * 本文に出てくる語はすべて収録する。1回しか出ない語も、その分野の鍵に
 * なることが多いので落とさない（頻度は出題順の手がかりとして持っている）。
 *
 * 意味は次の順で決めている:
 *   ① tools/passage-vocab-overrides.mjs の手直し
 *   ② 教材が本文に付けた語注
 *   ③ 英和辞書 EJDict（『』で示された主要語義を優先）
 *
 * 例文は本文からそのまま取っている。日本語訳はまだ無い。
 *
 * 作り直すには:  node tools/build-vocab-from-passages.mjs --emit
 *
 * 各エントリの構造:
 *   id / word / phonetic / pos / meaning / note / example / exampleJa / level / category / toefl
 *   id は学習履歴の保存キーになるので、既存のものを振り直さないこと。
 */
const WORD_DATA = [\n`;
  const body = entries.map(serialize).join(',\n');
  // LEVELS はどこからも参照されておらず、値も実態（2〜4）と食い違っていたので書き出さない。
  // 難易度の呼び名は js/app.js の LEVEL_LABELS、出す段は MIN_LEVEL / MAX_LEVEL が持つ
  const footer = `\n];\n\n// カテゴリの一覧は単語データから作る\nconst CATEGORIES = [...new Set(WORD_DATA.map((w) => w.category))];\n`;
  fs.writeFileSync(path.join(ROOT, 'js/data.js'), header + body + footer);
  console.log(`js/data.js に ${entries.length} 語を書き出しました`);
} else {
  const byLevel = {};
  entries.forEach((e) => (byLevel[e.level] = (byLevel[e.level] || 0) + 1));
  console.log(`教材 ${MATERIAL.length} 本から抽出`);
  console.log(`  異なり語（辞書に当たったもの）: ${words.size}`);
  console.log(`  収録（意味が引けたもの）: ${entries.length}`);
  console.log(`  レベル別: ${JSON.stringify(byLevel)}`);
  console.log(`  発音記号あり: ${entries.filter((e) => e.phonetic).length}`);
  console.log(`  例文あり: ${entries.filter((e) => e.example).length}`);
}
