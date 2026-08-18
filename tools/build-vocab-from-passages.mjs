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
 *   node tools/build-vocab-from-passages.mjs --emit   … js/data.js を書き出す
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MEANINGS, DROP, REWRITE, POS, EXAMPLES, SPELLING_FIX } from './passage-vocab-overrides.mjs';
import { KEY_MEANINGS, RELATIONS, UNITS, WORD_LIST } from './toefl-junior-wordlist.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const load = (file, name) =>
  new Function(fs.readFileSync(path.join(ROOT, file), 'utf8') + `;return ${name};`)();

const READING_DATA = load('js/reading-data.js', 'READING_DATA');

// 教材由来の長文だけ（r1〜r22 は書き下ろしなので除く）
const MATERIAL = READING_DATA.filter((r) => {
  const n = Number(r.id.slice(1));
  return n >= 23 && n <= 134;
});

/**
 * 機能語。これらは「覚える単語」として出しても意味がないので収録しない。
 * 中学生なら既に知っているか、文法として学ぶもの。
 */
const FUNCTION_WORDS = new Set(
  (
    'a an the and or but if because so that than then as of to in on at for with by from into onto ' +
    'up down out off over under about through during before after above below between among against ' +
    'is are was were be been being am do does did done have has had having will would shall should ' +
    'can could may might must need ought used ' +
    'i me my mine myself you your yours yourself he him his himself she her hers herself it its itself ' +
    'we us our ours ourselves they them their theirs themselves ' +
    'this that these those who whom whose which what where when why how ' +
    'not no nor none never very too also just only even still yet already ' +
    'there here all both each every few many much more most other another some any such own same ' +
    'one two three four five six seven eight nine ten first second third next last ' +
    'yes ok okay please thank thanks ' +
    'however until whether although though while since unless upon within without across along around ' +
    'toward towards behind beside besides beyond despite except inside outside per plus versus via ' +
    'anyone anything anybody everyone everything everybody someone something somebody nothing nobody ' +
    'cannot going ' +
    's t re ve ll d m'
  ).split(' ')
);

/** 不規則変化。辞書には said も載っているが「sayの過去」としか書かれていないので原形へ寄せる */
const IRREGULAR = {
  said:'say', went:'go', gone:'go', got:'get', gotten:'get', saw:'see', seen:'see', came:'come',
  built:'build', children:'child', feet:'foot', teeth:'tooth', men:'man', women:'woman', mice:'mouse',
  took:'take', taken:'take', made:'make', knew:'know', known:'know', found:'find', thought:'think',
  told:'tell', became:'become', began:'begin', begun:'begin', brought:'bring', bought:'buy',
  caught:'catch', chose:'choose', chosen:'choose', drove:'drive', driven:'drive', ate:'eat', eaten:'eat',
  fell:'fall', fallen:'fall', felt:'feel', flew:'fly', flown:'fly', forgot:'forget', gave:'give',
  given:'give', grew:'grow', grown:'grow', heard:'hear', held:'hold', kept:'keep', led:'lead',
  left:'leave', lost:'lose', met:'meet', paid:'pay', ran:'run', rose:'rise', risen:'rise', sat:'sit',
  sent:'send', shown:'show', sang:'sing', sung:'sing', spoke:'speak', spoken:'speak', spent:'spend',
  stood:'stand', swam:'swim', taught:'teach', threw:'throw', thrown:'throw', understood:'understand',
  wore:'wear', worn:'wear', won:'win', wrote:'write', written:'write', rode:'ride', ridden:'ride',
  hid:'hide', hidden:'hide', bit:'bite', dug:'dig', hung:'hang', shot:'shoot', slept:'sleep',
  lives:'life', leaves:'leaf', wolves:'wolf', knives:'knife', better:'good', best:'good',
  worse:'bad', worst:'bad', sold:'sell', stole:'steal', swum:'swim'
};

/** 屈折を原形に近づける。辞書に当たるかどうかで採否を決めるので、候補を返す */
function candidates(token) {
  if (IRREGULAR[token]) return [IRREGULAR[token]];
  const out = [token];
  const add = (w) => w && w.length > 1 && out.push(w);
  if (token.endsWith('ies')) add(token.slice(0, -3) + 'y');
  if (token.endsWith('ied')) add(token.slice(0, -3) + 'y');
  if (token.endsWith('es')) { add(token.slice(0, -2)); add(token.slice(0, -1)); }
  if (token.endsWith('s')) add(token.slice(0, -1));
  if (token.endsWith('ed')) { add(token.slice(0, -2)); add(token.slice(0, -1)); }
  if (token.endsWith('ing')) { add(token.slice(0, -3)); add(token.slice(0, -3) + 'e'); }
  if (token.endsWith('er')) { add(token.slice(0, -2)); add(token.slice(0, -1)); }
  if (token.endsWith('est')) { add(token.slice(0, -3)); add(token.slice(0, -2)); }
  if (token.endsWith('ly')) add(token.slice(0, -2));
  // running → run のような重ね字
  const dbl = token.replace(/([bdgklmnprt])\1(ed|ing|er|est)$/, '$1');
  if (dbl !== token) add(dbl);
  return [...new Set(out)];
}

/** EJDict（英和辞書）を読む。意味の出どころ */
function loadDictionary() {
  const dir = path.join(ROOT, 'data/raw/vocab-sources');
  const dict = new Map();
  for (const letter of 'abcdefghijklmnopqrstuvwxyz'.split('')) {
    const file = path.join(dir, `ejdict-${letter}.txt`);
    if (!fs.existsSync(file)) continue;
    for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
      const [head, sense] = line.split('\t');
      if (!head || !sense) continue;
      for (const w of head.split(',')) {
        const k = w.trim().toLowerCase();
        if (k && !dict.has(k)) dict.set(k, sense.trim());
      }
    }
  }
  return dict;
}

function loadPhonetics() {
  const file = path.join(ROOT, 'data/raw/vocab-sources/ipa.txt');
  const map = new Map();
  if (!fs.existsSync(file)) return map;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const [w, ipa] = line.split('\t');
    if (!w || !ipa) continue;
    const k = w.toLowerCase();
    if (!map.has(k)) map.set(k, ipa.split(',')[0].trim());
  }
  return map;
}

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

/**
 * EJDict の語義から、覚える価値のある意味を1つ選ぶ。
 *
 * この辞書は語義を ` / ` で並べ、важな意味を『』で囲っている。
 * 単純に先頭を取ると `school → 教習所`、`dolphin → シイラ` のような
 * 場違いな語義を拾ってしまうので、『』のあるものを優先する。
 */
function pickSense(raw) {
  const senses = raw.split(' / ').map((s) => s.trim()).filter(Boolean);

  const clean = (s) => {
    let t = s
      .replace(/\{[^}]*\}/g, '')
      .replace(/《[^》]*》/g, '')
      .replace(/〈[^〉]*〉/g, '')
      .replace(/〔[^〕]*〕/g, '');
    // 『』は残したまま括弧の補足だけ落とす
    for (let i = 0; i < 3; i++) t = t.replace(/\([^()]*\)/g, '');
    return t.replace(/[[\]（）()]/g, '').replace(/\s+/g, ' ').trim();
  };

  const usable = (t) => {
    if (!t) return false;
    // ラテン文字が残るものは略語の展開や「〜の過去形」なので採らない。
    // クイズの答えが問題文に漏れるのも防げる
    if (/[A-Za-z]{2,}/.test(t)) return false;
    if (/の(過去|複数|比較級|最上級|現在分詞|過去分詞)/.test(t)) return false;
    return true;
  };

  // ① 『』つきの語義を探す
  for (const s of senses) {
    const c = clean(s);
    const m = c.match(/『([^』]+)』/);
    if (m && usable(m[1])) return trim2(m[1]);
  }
  // ② 無ければ、使える最初の語義
  for (const s of senses) {
    const c = clean(s).replace(/[『』]/g, '');
    if (usable(c)) return trim2(c);
  }
  return '';
}

/** 語義は最大2つまで。長いと4択の選択肢に収まらない */
function trim2(s) {
  const parts = s.split(/[,、;・]/).map((x) => x.trim()).filter(Boolean);
  return parts.slice(0, 2).join('、');
}

/**
 * 品詞を当てる。英和辞書は品詞を持たないので、日本語の語尾から判断する。
 *
 * 日本語の動詞は必ずウ段（る・う・く・ぐ・す・つ・ぬ・ぶ・む）で終わり、
 * 形容詞は「い」か「な」で終わる。名詞がウ段で終わることはほとんどない。
 * この規則で大半は取れる。取り切れないものは overrides で直す。
 */
function posOf(word, sense) {
  if (word.includes(' ')) return 'phr.';
  const s = sense.split('、')[0]; // 最初の語義で判断する

  // 「…を」「…に」で始まるものは他動詞
  if (/^[…～]/.test(s)) return 'v.';
  // サ変・受身・可能はまず動詞
  if (/(する|される|できる)$/.test(s)) return 'v.';
  // 「費用のかかる」「栄光ある」は連体形なので形容詞
  if (/(のある|のかかる|のない|ある)$/.test(s) && s.length >= 3) return 'adj.';
  // ウ段で終わるものは動詞。ただし「〜的」などは除く
  if (/[るうくぐすつぬぶむ]$/.test(s) && !/(名|物|者|所|人|事|数|量)$/.test(s)) return 'v.';
  // 「〜な」「〜的」「〜の」は形容詞（male→男性の, human→人間の）
  if (/(な|的|の)$/.test(s)) return 'adj.';
  // 「死んだ」「飢えた」のように過去形で状態を表すものも形容詞
  if (/[たさだ]$/.test(s) && s.length >= 3) return 'adj.';
  if (/い$/.test(s) && s.length >= 2 && !/(合い|扱い|使い|願い|行い|勢い)$/.test(s)) return 'adj.';
  // 「繰り返して」「静かに」など。長さでは切らない
  if (/て$/.test(s) && s.length >= 3) return 'adv.';
  if (/[くに]$/.test(s) && s.length <= 5) return 'adv.';
  return 'n.';
}

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
  const footer = `\n];\n\nconst LEVELS = [1, 2, 3];\n// カテゴリの一覧は単語データから作る\nconst CATEGORIES = [...new Set(WORD_DATA.map((w) => w.category))];\n`;
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
