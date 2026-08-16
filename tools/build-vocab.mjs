/**
 * 公開データから単語リストを組み立てて js/data.js を更新する。
 *
 * 使い方:
 *   node tools/build-vocab.mjs            … キャッシュを使う（無ければ取得）
 *   node tools/build-vocab.mjs --fetch    … 元データを取り直す
 *   node tools/build-vocab.mjs --target 3000
 *
 * 出典（いずれも公開データ。詳細と利用条件は README.md を参照）:
 *   - CEFR-J Wordlist Version 1.5 … どの語をどのレベルに置くかの根拠
 *   - ejdict-hand                 … 日本語の意味
 *   - ipa-dict                    … 発音記号
 *   - FrequencyWords              … 同レベル内での優先順位
 *
 * 既存の単語は id・例文・意味・カテゴリをそのまま残す。学習履歴は id で
 * 結び付いているため、id は決して振り直さない。
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = join(ROOT, 'data/raw/vocab-sources');

const SOURCES = {
  cefrj: 'https://raw.githubusercontent.com/openlanguageprofiles/olp-en-cefrj/master/cefrj-vocabulary-profile-1.5.csv',
  ipa: 'https://raw.githubusercontent.com/open-dict-data/ipa-dict/master/data/en_US.txt',
  freq: 'https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/en/en_50k.txt'
};
const EJDICT = (letter) =>
  `https://raw.githubusercontent.com/kujirahand/EJDict/master/src/${letter}.txt`;

const argv = process.argv.slice(2);
const FORCE_FETCH = argv.includes('--fetch');
const TARGET = Number((argv[argv.indexOf('--target') + 1] || '').match(/^\d+$/)?.[0] || 3000);

// ============================================================
// 取得（取得済みならキャッシュを使う）
// ============================================================

async function grab(name, url) {
  const path = join(CACHE, name);
  if (!FORCE_FETCH && existsSync(path)) return readFileSync(path, 'utf8');
  mkdirSync(CACHE, { recursive: true });
  process.stdout.write(`  取得中 ${name} … `);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} が ${res.status} を返しました`);
  const text = await res.text();
  writeFileSync(path, text, 'utf8');
  console.log(`${(text.length / 1024).toFixed(0)}KB`);
  return text;
}

async function loadSources() {
  console.log('元データ');
  const cefrj = await grab('cefrj.csv', SOURCES.cefrj);
  const ipa = await grab('ipa.txt', SOURCES.ipa);
  const freq = await grab('freq.txt', SOURCES.freq);
  let ejdict = '';
  for (const letter of 'abcdefghijklmnopqrstuvwxyz') {
    ejdict += await grab(`ejdict-${letter}.txt`, EJDICT(letter));
  }
  return { cefrj, ipa, freq, ejdict };
}

// ============================================================
// 解析
// ============================================================

/** CEFR-J: 見出し語 → いちばん低いレベルと品詞 */
function parseCefrj(csv) {
  const ORDER = ['A1', 'A2', 'B1', 'B2'];
  const map = new Map();
  for (const line of csv.split('\n').slice(1)) {
    if (!line.trim()) continue;
    const cells = line.split(',');
    const head = cells[0].replace(/"/g, '').split('/')[0].trim().toLowerCase();
    const pos = cells[1];
    const cefr = cells[2];
    if (!head || !ORDER.includes(cefr)) continue;
    const prev = map.get(head);
    // 同じ語が複数のレベルに出てくることがあるので、低いほうを採る
    if (!prev || ORDER.indexOf(cefr) < ORDER.indexOf(prev.cefr)) map.set(head, { cefr, pos });
  }
  return map;
}

/** ejdict-hand: 見出し語 → 語義の生データ */
function parseEjdict(text) {
  const map = new Map();
  for (const line of text.split('\n')) {
    const tab = line.indexOf('\t');
    if (tab < 1) continue;
    const body = line.slice(tab + 1).trim();
    for (const key of line.slice(0, tab).split(',')) {
      const k = key.trim().toLowerCase();
      if (k && !map.has(k)) map.set(k, body);
    }
  }
  return map;
}

function parseIpa(text) {
  const map = new Map();
  for (const line of text.split('\n')) {
    const [w, p] = line.split('\t');
    if (w && p && !map.has(w)) map.set(w, p.split(',')[0].trim());
  }
  return map;
}

function parseFreq(text) {
  const map = new Map();
  text.split('\n').forEach((line, i) => {
    const w = line.split(' ')[0];
    if (w && !map.has(w)) map.set(w, i + 1);
  });
  return map;
}

// ============================================================
// 語義の整形
// ============================================================

/**
 * 辞書の1つの語義を、カードに出せる短さに整える。
 *   例) 〈U〉『休息』,休憩;休息の時間(期間) → 休息、休憩
 */
function tidySense(sense) {
  let s = sense;
  s = s.replace(/《[^》]*》/g, ''); // 用法注記
  s = s.replace(/[『』]/g, ''); // 強調記号
  s = s.replace(/〈[^〉]*〉/g, ''); // 可算不可算・目的語の説明
  for (let i = 0; i < 3; i++) {
    s = s.replace(/\([^()]*\)/g, ''); // 丸括弧の補足（入れ子があるので繰り返す）
    s = s.replace(/\[[^[\]]*\]/g, ''); // 角括弧の補足
  }
  // 《》や〈〉を外した拍子に片方だけ残る括弧があるので、そこから先は捨てる
  s = s.replace(/[([].*$/, '').replace(/^[^()[\]]*[)\]]/, '');
  s = s.split(/[;；]/)[0]; // セミコロン以降は別語義
  s = s
    .split(/[,、\/・]/) // 「いす/権威のある座」のような区切りも訳語の境目として扱う
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 2)
    .join('、');
  return s.replace(/\s+/g, '').replace(/^[・…\-—=]+|[・…\-—]+$/g, '').trim();
}

/** 整えた語義が、その品詞らしい形をしているか */
function fitsPos(meaning, pos) {
  const first = meaning.split('、')[0];
  const isVerbish = /^[をにがへと]/.test(first) || /(する|される|なる|れる|せる|む|く|ぐ|す|つ|ぬ|ぶ|る|う)$/.test(first);
  const isAdjish = /(な|い|的|の)$/.test(first);
  const isAdverbish = /(に|く|て|と|り)$/.test(first);

  switch (pos) {
    case 'v.':
      return isVerbish;
    case 'adj.':
      // 「を〜する」で始まるものは動詞の語義なので形容詞には向かない
      return isAdjish && !/^[をに]/.test(first);
    case 'adv.':
      return (isAdverbish || isAdjish) && !/^[をに]/.test(first);
    case 'n.':
      // 名詞なのに「を〜する」「〜な」で終わるものは別品詞の語義
      return !/^[をにがへと]/.test(first) && !/(する|な|い)$/.test(first);
    default:
      return true;
  }
}

/**
 * 辞書の語義の並びから、その品詞に合うものを選ぶ。
 * ejdict は1つの見出しに動詞・名詞・形容詞の語義が混在しているため、
 * 先頭を機械的に採ると surprise が「を驚かす」(動詞) になってしまう。
 */
export function cleanMeaning(raw, pos) {
  const senses = raw
    .split(' / ')
    .map(tidySense)
    // 訳語に見えないものは捨てる。記号が残っている＝整形しきれていない印
    .map((s) => s.split('、').filter((t) => t && !/[…‐+〈〉《》『』()[\]]/.test(t)).join('、'))
    .filter((s) => s && s.length <= 18 && !/[A-Za-z]{3}/.test(s));
  if (senses.length === 0) return '';
  return senses.find((s) => fitsPos(s, pos)) || senses[0];
}

const POS_LABEL = {
  noun: 'n.',
  verb: 'v.',
  adjective: 'adj.',
  adverb: 'adv.',
  preposition: 'prep.',
  conjunction: 'conj.'
};

// 単語カードに向かない品詞は落とす（冠詞・代名詞・be動詞など）
const SKIP_POS = new Set([
  'pronoun',
  'determiner',
  'number',
  'modal auxiliary',
  'be-verb',
  'do-verb',
  'have-verb',
  'infinitive-to',
  'interjection'
]);

/**
 * カードにしても学習にならない語。
 * 冠詞・基本の前置詞・あいさつ・be動詞や -ing 形など、
 * 「意味を覚える」対象になりにくいものを外す。
 */
const SKIP_WORDS = new Set([
  'and', 'but', 'that', 'this', 'for', 'on', 'in', 'at', 'with', 'not', 'there',
  'here', 'out', 'up', 'from', 'when', 'by', 'too', 'into', 'over', 'than',
  'down', 'away', 'yes', 'no', 'sir', 'hello', 'hi', 'oh', 'ok', 'okay',
  'being', 'working', 'used', 'saw', 'thanks', 'am', 'is', 'are', 'was', 'were'
]);

/**
 * ejdict の語義が古い・別語義・同綴りの固有名詞になってしまう語の訂正。
 * 生成結果を目視で確認して見つかったものを、ここで上書きする。
 */
const OVERRIDES = {
  // 同じつづりの固有名詞を拾ってしまうもの
  tell: 'を伝える、話す', man: '男、人', nice: 'すてきな、親切な', job: '仕事、職',
  turkey: '七面鳥', grant: 'を与える、補助金', coke: 'コーラ', kite: 'たこ',
  skate: 'スケートをする', bath: '風呂、入浴', mug: 'マグカップ', champagne: 'シャンパン',
  // 差別的な言い回しを含むもの
  crazy: 'とてもおかしな、夢中で', mad: '腹を立てて、とても怒って',
  // 第1語義が現代の中心的な意味とずれているもの
  why: 'なぜ、どうして', just: 'ちょうど、ただ〜だけ', well: 'よく、うまく',
  still: 'まだ、今でも', even: '〜さえ、〜でも', back: '背中、後ろへ',
  sorry: 'すまなく思って、気の毒で', off: '離れて、はずれて', never: '決して〜ない',
  then: 'その時、それから', again: '再び、もう一度', lot: 'たくさん', dead: '死んだ',
  pay: 'を支払う', set: 'を置く、を整える', fun: '楽しみ、おもしろいこと',
  ready: '用意ができた', side: '側、横', matter: '問題、事柄', bank: '銀行',
  computer: 'コンピューター', balance: '均衡、つり合い', present: '贈り物、現在の',
  later: '後で', excuse: 'を許す、言い訳', sister: '姉、妹', bye: 'さようなら',
  guy: '男、やつ', hold: 'を持つ、抱える', worry: '心配する', point: '点、要点',
  kid: '子供', miss: 'を逃す、がいなくて寂しい', couple: '2つ、夫婦', car: '自動車',
  check: 'を調べる、確認する', front: '前面、正面', hope: 'を望む、希望',
  course: '進路、講座', haven: '避難場所', deal: '取引、を扱う'
};

// 中学生向けのアプリに出したくない語
const BLOCKLIST = new Set([
  'sex', 'sexual', 'sexy', 'drunk', 'drug', 'cigarette', 'tobacco', 'beer', 'wine',
  'whisky', 'alcohol', 'gun', 'weapon', 'bullet', 'kill', 'murder', 'suicide',
  'stupid', 'idiot', 'fool', 'damn', 'hell', 'naked', 'nude', 'gamble', 'bet',
  'corpse', 'rape', 'slave', 'torture', 'terror', 'terrorist'
]);

const CEFR_TO_LEVEL = { A1: 1, A2: 2, B1: 3 };

/** 意味の語尾から、大まかなカテゴリを当てる */
function guessCategory(word, meaning, pos) {
  const has = (...keys) => keys.some((k) => meaning.includes(k));

  if (word.includes(' ')) return '熟語・句動詞';
  if (has('学校', '学年', '授業', '教室', '宿題', '試験', '生徒', '教師', '大学')) return '学校生活';
  if (has('食べ', '料理', '野菜', '果物', '肉', '飲み', 'パン', '米', '菓子')) return '食べ物・料理';
  if (has('動物', '鳥', '魚', '虫', '花', '木', '植物', '葉')) return '動物・植物';
  if (has('天気', '雨', '雪', '風', '空', '海', '山', '川', '自然', '季節')) return '自然・天気';
  if (has('体', '手', '足', '頭', '目', '耳', '口', '病気', '健康', '医者', 'けが')) return '体・健康';
  if (has('家族', '父', '母', '兄', '姉', '弟', '妹', '親', '子供', '友人', '結婚')) return '家族・人間関係';
  if (has('気持', '感情', 'うれし', '悲し', '怒', '心配', '好き', '嫌い', '喜')) return '気持ち・性格';
  if (has('時間', '時刻', '曜日', '月', '年', '朝', '昼', '夜', '週')) return '時間・日付';
  if (has('数', '量', '割合', '計算', '長さ', '重さ', '面積', '倍')) return '数・量';
  if (has('国', '都市', '町', '村', '政府', '社会', '法律', '戦争', '文化', '歴史')) return '社会・地理';
  if (has('科学', '実験', '技術', '機械', '電気', '研究', 'エネルギー', '宇宙')) return '科学・技術';
  if (has('仕事', '会社', '職', '働', '店', '売', '買', '金', '経済')) return '仕事・お金';
  if (has('旅行', '駅', '電車', '車', '船', '飛行機', '道', '橋', '空港')) return '旅行・交通';
  if (has('家', '部屋', '台所', '窓', '戸', 'いす', '机', '建物', '庭')) return '家・建物';
  if (has('服', '着', '靴', '帽子', 'かばん')) return '衣服・持ち物';
  if (has('スポーツ', '試合', '選手', '音楽', '歌', '絵', '映画', '本', '遊')) return 'スポーツ・趣味';

  if (pos === 'v.') return '基本の動詞';
  if (pos === 'adj.' || pos === 'adv.') return '基本の形容詞・副詞';
  if (pos === 'conj.' || pos === 'prep.') return 'つなぎ言葉';
  return '基本の名詞';
}

// ============================================================
// 組み立て
// ============================================================

function readExisting() {
  const src = readFileSync(join(ROOT, 'js/data.js'), 'utf8');
  return new Function(`${src}; return WORD_DATA;`)();
}

function serialize(words) {
  const esc = (v) => String(v ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  const body = words
    .map(
      (w) =>
        `  { id: ${w.id}, word: '${esc(w.word)}', phonetic: '${esc(w.phonetic)}', ` +
        `pos: '${esc(w.pos)}', meaning: '${esc(w.meaning)}', note: '${esc(w.note)}', ` +
        `example: '${esc(w.example)}', exampleJa: '${esc(w.exampleJa)}', ` +
        `level: ${w.level}, category: '${esc(w.category)}' }`
    )
    .join(',\n');

  return `/**
 * 英単語データ — Ekamai International School (EIS) Grade 8 受験向け
 *
 * 各エントリの構造:
 *   id       : 一意なID（学習履歴の保存キーになるので変更しないこと）
 *   word     : 英単語
 *   phonetic : 発音記号
 *   pos      : 品詞 (n. / v. / adj. / adv. / prep. / conj. / phr.)
 *   meaning  : 日本語の意味（クイズの問題文に使うので日本語だけにする）
 *   note     : 補足（混同しやすい語など／空でも可）
 *   example  : 例文（英語／空でも可。空の語は穴埋めクイズには出ない）
 *   exampleJa: 例文の日本語訳
 *   level    : 難易度 (1=基礎 / 2=標準 / 3=応用)
 *   category : 出題される場面・分野
 *
 * レベルは CEFR-J Wordlist の A1 / A2 / B1 に対応する。
 * このファイルは tools/build-vocab.mjs で生成・更新できる（出典は README.md）。
 */
const WORD_DATA = [
${body}
];

const LEVELS = [1, 2, 3];
const CATEGORIES = [...new Set(WORD_DATA.map((w) => w.category))];
`;
}

async function main() {
  const raw = await loadSources();
  const cefrj = parseCefrj(raw.cefrj);
  const ejdict = parseEjdict(raw.ejdict);
  const ipa = parseIpa(raw.ipa);
  const freq = parseFreq(raw.freq);

  console.log(
    `\n元データの規模: CEFR-J ${cefrj.size} 語 / 英和 ${ejdict.size} 語 / 発音 ${ipa.size} 語`
  );

  const existing = readExisting();
  const have = new Set(existing.map((w) => w.word.toLowerCase()));
  let nextId = existing.reduce((m, w) => Math.max(m, w.id), 0) + 1;

  const dropped = { pos: 0, blocked: 0, noMeaning: 0, longMeaning: 0, already: 0 };
  const candidates = [];

  for (const [word, { cefr, pos }] of cefrj) {
    if (!CEFR_TO_LEVEL[cefr]) continue; // B2 は範囲外
    if (!/^[a-z][a-z' -]*$/.test(word)) continue;
    if (have.has(word)) { dropped.already++; continue; }
    if (SKIP_POS.has(pos) || SKIP_WORDS.has(word)) { dropped.pos++; continue; }
    if (BLOCKLIST.has(word)) { dropped.blocked++; continue; }

    const rawMeaning = ejdict.get(word);
    if (!rawMeaning && !OVERRIDES[word]) { dropped.noMeaning++; continue; }

    const label = word.includes(' ') ? 'phr.' : POS_LABEL[pos] || 'n.';
    // 目視で直した語は辞書より訂正表を優先する
    const meaning = OVERRIDES[word] || cleanMeaning(rawMeaning, label);
    if (!meaning) { dropped.noMeaning++; continue; }
    if (meaning.length > 18) { dropped.longMeaning++; continue; }
    if (/[A-Za-z]{3}/.test(meaning)) { dropped.noMeaning++; continue; }
    candidates.push({
      word,
      phonetic: ipa.get(word) || '',
      pos: label,
      meaning,
      note: '',
      example: '',
      exampleJa: '',
      level: CEFR_TO_LEVEL[cefr],
      category: guessCategory(word, meaning, label),
      rank: freq.get(word) ?? Number.MAX_SAFE_INTEGER
    });
  }

  // レベルの低い順、同じレベルなら使用頻度の高い順に採る
  candidates.sort((a, b) => a.level - b.level || a.rank - b.rank);
  const room = Math.max(0, TARGET - existing.length);
  const picked = candidates.slice(0, room);

  const result = [...existing.map((w) => ({ ...w }))];
  for (const c of picked) {
    delete c.rank;
    result.push({ id: nextId++, ...c });
  }

  writeFileSync(join(ROOT, 'js/data.js'), serialize(result), 'utf8');

  // ---- 集計 ----
  const count = (arr, key) =>
    arr.reduce((m, w) => ((m[w[key]] = (m[w[key]] || 0) + 1), m), {});
  console.log(`\n除外: 品詞 ${dropped.pos} / 収録済み ${dropped.already} / ` +
    `和訳なし ${dropped.noMeaning} / 語義が長い ${dropped.longMeaning} / 不適切 ${dropped.blocked}`);
  console.log(`候補 ${candidates.length} 語のうち ${picked.length} 語を追加`);
  console.log(`\n合計 ${result.length} 語`);
  console.log('レベル別:', JSON.stringify(count(result, 'level')));
  console.log('発音記号なし:', result.filter((w) => !w.phonetic).length);
  console.log('例文なし:', result.filter((w) => !w.example).length);
  console.log(
    'カテゴリ別:',
    Object.entries(count(result, 'category'))
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${k} ${v}`)
      .join(', ')
  );
}

main().catch((e) => {
  console.error('失敗しました:', e.message);
  process.exit(1);
});
