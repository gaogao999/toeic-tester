/**
 * 単語リストの取り込みスクリプト
 *
 * data/raw/ に置いたテキスト（Webページからのコピペ、または保存したHTML）を読み取り、
 * js/data.js を再生成する。
 *
 *   node tools/import-words.mjs
 *
 * 読み取り対象と割り当てられるレベル:
 *   data/raw/level1.txt → レベル1（基礎）
 *   data/raw/level2.txt → レベル2（標準）
 *   data/raw/level3.txt → レベル3（応用）
 *
 * 既存の単語（js/data.js にすでにあるもの）は、発音記号・例文・カテゴリを保ったまま
 * レベルだけ更新する。新しい単語は末尾に追加される。id は一度割り当てたら変わらないため、
 * 利用者の学習履歴は取り込み後も引き継がれる。
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA_JS = join(ROOT, 'js', 'data.js');
const RAW_DIR = join(ROOT, 'data', 'raw');

const SOURCES = [
  { file: 'level1.txt', level: 1 }, // 基礎
  { file: 'level2.txt', level: 2 }, // 標準
  { file: 'level3.txt', level: 3 }  // 応用
];

// ============================================================
// 既存データの読み込み
// ============================================================

function loadExisting() {
  if (!existsSync(DATA_JS)) return [];
  const src = readFileSync(DATA_JS, 'utf8');
  // data.js はブラウザ用のプレーンなスクリプトなので、評価して配列を取り出す
  const fn = new Function(`${src}; return WORD_DATA;`);
  return fn();
}

// ============================================================
// 行の解析
// ============================================================

const JA_SET = '[぀-ヿ㐀-鿿]';        // ひらがな・カタカナ・漢字
const HAS_JA = new RegExp(JA_SET);
const LATIN_SET = 'A-Za-zÀ-ÖØ-öø-ÿ';  // アクセント付きラテン文字を含む
const LATIN = `[${LATIN_SET}]`;
const POS_MAP = {
  名: 'n.', 動: 'v.', 形: 'adj.', 副: 'adv.', 前: 'prep.', 接: 'conj.', 熟: 'phr.', 句: 'phr.'
};

function stripHtml(text) {
  if (!text.includes('<')) return text;
  return text
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<\/(tr|div|p|li|h[1-6])>/gi, '\n')
    .replace(/<\/t[dh]>/gi, '\t')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

/** 1行から { word, phonetic, pos, meaning } を取り出す。取れなければ null */
function parseLine(rawLine) {
  let line = rawLine.replace(/　/g, ' ').trim();
  if (!line) return null;

  // 行頭の番号・記号・チェックボックス・音声ボタンの残骸を落とす。
  // 「□ 音声 1 abandon …」のように交互に並ぶので、変化しなくなるまで繰り返す。
  for (let i = 0; i < 6; i++) {
    const before = line;
    line = line.replace(/^[\s\d０-９.．、,:：|｜*・\-–—□■☐☑◇◆○●▲▼]+/, '');
    line = line.replace(/^(音声|発音|再生|チェック|check|sound)\s*/i, '');
    if (line === before) break;
  }
  if (!line) return null;

  // 英語部分と日本語部分の両方が必要
  if (!HAS_JA.test(line)) return null;

  // 発音記号 [..] / /../ を抜き出す
  let phonetic = '';
  const phoneticMatch = line.match(/[\[\/]([^\]\/]*[ˈˌːəɪʊæɑɔɛθðʃʒŋaeiou][^\]\/]*)[\]\/]/i);
  if (phoneticMatch && !HAS_JA.test(phoneticMatch[1])) {
    phonetic = `/${phoneticMatch[1].replace(/^[\[\/]|[\]\/]$/g, '').trim()}/`;
    line = line.replace(phoneticMatch[0], ' ');
  }

  // 先頭の英語（見出し語）を取り出す。熟語もあるので空白を許し、résumé のような
  // アクセント付きの文字も1語として扱う。区切りは日本語文字か記号で判定する。
  const wordMatch = line.match(
    new RegExp(`^(${LATIN}[${LATIN_SET}'’.\\- ]*?)(?=\\s*[\\t：:（(【\\[]|\\s*${JA_SET}|\\s*$)`)
  );
  if (!wordMatch) return null;

  const word = wordMatch[1].replace(/\s+/g, ' ').trim();
  if (!word || word.length > 40) return null;

  let rest = line.slice(wordMatch[0].length).trim();
  rest = rest.replace(/^[\t：:|｜\-–—=＝\s]+/, '');

  // 品詞表記（名）(動) 【形】など。
  // 「名前」のような通常の語を品詞と誤認しないよう、括弧付きか区切り文字が続く場合だけ拾う。
  let pos = '';
  const posMatch =
    rest.match(/^[（(【\[]\s*([名動形副前接熟句])詞?\s*[）)】\]][\s:：]*/) ||
    rest.match(/^([名動形副前接熟句])詞?[\s:：\t]+/);
  if (posMatch) {
    pos = POS_MAP[posMatch[1]] || '';
    rest = rest.slice(posMatch[0].length).trim();
  }

  const meaning = rest.replace(/\s+/g, ' ').trim();
  if (!meaning || !HAS_JA.test(meaning)) return null;

  return { word, phonetic, pos, meaning };
}

/**
 * 単語と意味が別々の行に並ぶ形式を「単語\t意味」の1行にまとめ直す。
 *
 *   1              →  company\t会社、仲間
 *   company
 *   会社、仲間
 *   ＋   0
 */
function reflowBlocks(text) {
  const lines = text.split(/\r?\n/).map((l) => l.replace(/\t+/g, '\t').trim());
  const isNoise = (l) => l === '' || /^\d+$/.test(l) || /^[＋+]\s*\d*$/.test(l) || /^[＋+]?\t?\d*$/.test(l);
  const isWordOnly = (l) =>
    !HAS_JA.test(l) && new RegExp(`^${LATIN}[${LATIN_SET}'’.\\- ]*$`).test(l) && l.length <= 40;

  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (isNoise(line)) continue;

    if (isWordOnly(line)) {
      // 次に現れる意味らしき行（日本語を含む行）と結合する
      let j = i + 1;
      while (j < lines.length && isNoise(lines[j])) j++;
      if (j < lines.length && HAS_JA.test(lines[j]) && !isWordOnly(lines[j])) {
        out.push(`${line}\t${lines[j]}`);
        i = j;
        continue;
      }
    }
    out.push(line);
  }
  return out.join('\n');
}

function parseFile(path) {
  const text = reflowBlocks(stripHtml(readFileSync(path, 'utf8')));
  const parsed = [];
  const skipped = [];
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const entry = parseLine(line);
    if (entry) parsed.push(entry);
    else if (HAS_JA.test(line) || /[A-Za-z]{3}/.test(line)) skipped.push(line.trim());
  }
  return { parsed, skipped };
}

// ============================================================
// 出力
// ============================================================

function esc(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function serialize(words) {
  const lines = words.map(
    (w) =>
      `  { id: ${w.id}, word: '${esc(w.word)}', phonetic: '${esc(w.phonetic)}', pos: '${esc(w.pos)}', ` +
      `meaning: '${esc(w.meaning)}', note: '${esc(w.note || '')}', example: '${esc(w.example)}', ` +
      `exampleJa: '${esc(w.exampleJa)}', ` +
      `level: ${w.level}, category: '${esc(w.category)}' }`
  );

  return `/**
 * 英単語データ
 *
 * このファイルは tools/import-words.mjs によって生成・更新されます。
 * 手で編集しても構いませんが、再取り込みの際は既存の id・例文・カテゴリが引き継がれます。
 *
 * 各エントリの構造:
 *   id       : 一意なID（学習履歴の保存キーになるので変更しないこと）
 *   word     : 英単語
 *   phonetic : 発音記号
 *   pos      : 品詞 (n. / v. / adj. / adv. / prep. / phr.)
 *   meaning  : 日本語の意味（クイズの問題文に使うので日本語だけにする）
 *   note     : 補足（混同しやすい語など／空でも可）
 *   example  : 例文（英語／空でも可）
 *   exampleJa: 例文（日本語訳／空でも可）
 *   level    : 難易度 (1=基礎 / 2=標準 / 3=応用)
 *   category : 出題されやすい場面
 */
const WORD_DATA = [
${lines.join(',\n')}
];

const LEVELS = [1, 2, 3];
const CATEGORIES = [...new Set(WORD_DATA.map((w) => w.category))];
`;
}

// ============================================================
// 実行
// ============================================================

function main() {
  if (!existsSync(RAW_DIR)) {
    console.error(`取り込み元が見つかりません: ${RAW_DIR}`);
    console.error('data/raw/ に level1.txt / level2.txt / level3.txt を置いてから実行してください。');
    process.exit(1);
  }

  const existing = loadExisting();
  const byWord = new Map(existing.map((w) => [w.word.toLowerCase(), w]));
  const result = existing.map((w) => ({ ...w }));
  let nextId = existing.reduce((max, w) => Math.max(max, w.id), 0) + 1;

  const assignedThisRun = new Set(); // 同じ語が複数のリストに載っている場合の二重更新を防ぐ
  let added = 0;
  let updated = 0;
  let found = 0;

  for (const { file, level } of SOURCES) {
    const path = join(RAW_DIR, file);
    if (!existsSync(path)) {
      console.log(`- ${file}: 見つかりません（スキップ）`);
      continue;
    }

    const { parsed, skipped } = parseFile(path);
    found += parsed.length;
    console.log(`- ${file}: ${parsed.length} 語を認識（レベル ${level}）`);
    if (skipped.length) {
      console.log(`  取り込めなかった行 ${skipped.length} 件（先頭3件）:`);
      skipped.slice(0, 3).forEach((l) => console.log(`    ${l.slice(0, 60)}`));
    }

    for (const entry of parsed) {
      const key = entry.word.toLowerCase();
      const hit = byWord.get(key);

      if (hit) {
        // 既存の語は例文などを残したままレベルだけ更新する。
        // ただし今回の取り込みで既にレベルを決めた語は、先に現れた（＝低い）レベルを優先する。
        const target = result.find((w) => w.id === hit.id);
        if (!assignedThisRun.has(key)) {
          if (target.level !== level) {
            target.level = level;
            updated += 1;
          }
          assignedThisRun.add(key);
        }
        if (!target.phonetic && entry.phonetic) target.phonetic = entry.phonetic;
        continue;
      }

      const created = {
        id: nextId++,
        word: entry.word,
        phonetic: entry.phonetic,
        pos: entry.pos,
        meaning: entry.meaning,
        note: '',
        example: '',
        exampleJa: '',
        level,
        category: '未分類'
      };
      result.push(created);
      byWord.set(key, created);
      assignedThisRun.add(key);
      added += 1;
    }
  }

  if (found === 0) {
    console.error('取り込める単語が1件もありませんでした。data/raw/ の中身を確認してください。');
    process.exit(1);
  }

  writeFileSync(DATA_JS, serialize(result), 'utf8');

  const byLevel = { 1: 0, 2: 0, 3: 0 };
  result.forEach((w) => { byLevel[w.level] = (byLevel[w.level] || 0) + 1; });

  console.log('');
  console.log(`js/data.js を更新しました: 合計 ${result.length} 語`);
  console.log(`  新規追加 ${added} 語 / レベル更新 ${updated} 語`);
  console.log(`  レベル1 ${byLevel[1]} 語 / レベル2 ${byLevel[2]} 語 / レベル3 ${byLevel[3]} 語`);
  const noExample = result.filter((w) => !w.example).length;
  if (noExample) console.log(`  例文が未設定: ${noExample} 語（穴埋めクイズの対象外になります）`);
}

main();

// ファイル一覧を出しておくと、置き場所を間違えたときに気づきやすい
if (existsSync(RAW_DIR)) {
  const files = readdirSync(RAW_DIR).filter((f) => !f.startsWith('.'));
  if (files.length) console.log(`\ndata/raw/ の中身: ${files.join(', ')}`);
}
