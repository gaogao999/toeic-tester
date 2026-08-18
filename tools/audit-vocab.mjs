/**
 * 単語データの総点検。
 *
 * 自動生成した意味は、放っておくと次のような壊れ方をする。
 * 過去に実際に出たものを検査項目にしてある。
 *
 *   固有名詞との衝突      tell→テル  job→ヨブ  nice→ニース
 *   場違い・古い語義      coach→大型四輪馬車  cell→独房
 *   辞書の記法が残る      「〜の過去分詞」「=shuttlecock」
 *   クイズの答えが漏れる  意味の中に英単語が混ざる
 *   選択肢が作れない      複数の語がまったく同じ意味を持つ
 *
 *   node tools/audit-vocab.mjs          … 要約
 *   node tools/audit-vocab.mjs --all    … 該当する語をすべて並べる
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WORD_DATA = new Function(
  fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8') + ';return WORD_DATA;'
)();

const showAll = process.argv.includes('--all');
const findings = [];

/** 検査を1つ登録する。level は 'error'（直すべき）か 'warn'（見て判断） */
function check(level, name, hits, why) {
  findings.push({ level, name, hits, why });
}

const list = (items, n = 12) =>
  items.slice(0, showAll ? items.length : n).map((w) => `${w.word}→${w.meaning}`).join(', ') +
  (!showAll && items.length > n ? ` … 他${items.length - n}件` : '');

// ---- 1. 日本語が無い / 壊れている ----
check('error', '意味が空', WORD_DATA.filter((w) => !w.meaning || !w.meaning.trim()),
  'クイズに出せない');

check('error', '意味に日本語が1文字も無い',
  WORD_DATA.filter((w) => w.meaning && !/[ぁ-んァ-ヴ一-龯０-９]/.test(w.meaning)),
  '意味として成立していない');

check('error', '意味に英単語が混ざる（答えが漏れる）',
  WORD_DATA.filter((w) => /[A-Za-z]{2,}/.test(w.meaning)),
  '4択やタイピングで答えが見えてしまう');

check('error', '辞書の記法が残っている',
  WORD_DATA.filter((w) => /(過去分詞|の複数形|の比較級|の最上級|＝|=)/.test(w.meaning)),
  '語義ではなく文法の説明になっている');

// 全角の（）は「（音が）大きい」のように語義を絞る補足として意図的に使っている。
// 落とすべきなのは辞書の記法のほう
check('error', '辞書の記法が意味に残っている',
  WORD_DATA.filter((w) => /[《》〈〉『』{}\[\]]/.test(w.meaning)),
  '整形しきれていない');

// ---- 2. 固有名詞との衝突 ----
// カタカナだけの意味は、正しいもの（ペンギン）と衝突（テル）が混在する。
// 英語の綴りをローマ字読みしたものに近いカタカナは怪しい
const KATA_OK = /(ー|ン)/; // 外来語らしさの手がかり。弱いので警告どまり
check('warn', 'カタカナだけの意味（固有名詞の衝突が紛れる）',
  WORD_DATA.filter((w) => /^[ァ-ヴー]+$/.test(w.meaning) && w.meaning.length <= 4 && !KATA_OK.test(w.meaning)),
  '過去に tell→テル / job→ヨブ / nice→ニース が起きた');

// ---- 3. 意味の重複（4択の選択肢が作れない）----
const byMeaning = new Map();
WORD_DATA.forEach((w) => {
  const k = w.meaning.trim();
  if (!byMeaning.has(k)) byMeaning.set(k, []);
  byMeaning.get(k).push(w);
});
const dupes = [...byMeaning.entries()].filter(([, ws]) => ws.length > 1);
check('warn', '同じ意味を持つ語が複数ある',
  dupes.map(([m, ws]) => ({ word: ws.map((w) => w.word).join('/'), meaning: m })),
  '4択で「どれも正解」になりうる');

// ---- 4. 長さ ----
check('warn', '意味が長すぎる（16文字超）',
  WORD_DATA.filter((w) => w.meaning.length > 16),
  '4択の選択肢に収まらない');

// ---- 5. 見出し語の形 ----
check('warn', '見出し語が屈折形のまま',
  WORD_DATA.filter((w) => /(ing|ed|ies)$/.test(w.word) && w.word.length > 5 && !/^(during|building|feeling|meaning|morning|evening|ceiling|painting|reading|writing|training|meeting|clothing|swimming|shopping|drawing|warning|finding|sibling|wedding|breeding|need|speed|feed|seed|deed|indeed|proceed|succeed|exceed|bleed|greed|freed|weed|species|series)$/.test(w.word)),
  '原形にまとめたほうが覚えやすい');

check('error', '見出し語に記号や空白の異常',
  WORD_DATA.filter((w) => /[^a-zA-Z' -]/.test(w.word) || /^\s|\s$/.test(w.word)),
  'データの取り込み事故');

// ---- 6. 付帯情報 ----
check('warn', '発音記号が無い', WORD_DATA.filter((w) => !w.phonetic), '読み上げと発音の確認ができない');
check('warn', '例文が無い', WORD_DATA.filter((w) => !w.example), '穴埋めクイズに出ない');

// 不規則変化（make→made, good→best, foot→feet）は語幹が一致しないので、
// その分を織り込んでから判定する
const IRREGULAR_FORMS = {
  make: ['made'], get: ['got'], know: ['knew', 'known'], good: ['best', 'better'],
  say: ['said'], come: ['came'], take: ['took', 'taken'], give: ['gave', 'given'],
  foot: ['feet'], leave: ['left'], man: ['men'], run: ['ran'], go: ['went', 'gone'],
  see: ['saw', 'seen'], find: ['found'], think: ['thought'], tell: ['told'],
  buy: ['bought'], bring: ['brought'], catch: ['caught'], child: ['children'],
  woman: ['women'], tooth: ['teeth'], mouse: ['mice'], life: ['lives'], leaf: ['leaves'],
  knife: ['knives'], wolf: ['wolves'], shelf: ['shelves'], lead: ['led'], hold: ['held'],
  eat: ['ate', 'eaten'], fall: ['fell'], feel: ['felt'], fly: ['flew'], grow: ['grew'],
  hear: ['heard'], hold: ['held'], keep: ['kept'], lose: ['lost'], meet: ['met'],
  pay: ['paid'], rise: ['rose'], sit: ['sat'], send: ['sent'], speak: ['spoke'],
  spend: ['spent'], stand: ['stood'], teach: ['taught'], throw: ['threw'],
  wear: ['wore'], win: ['won'], write: ['wrote', 'written'], build: ['built'],
  bad: ['worse', 'worst'], begin: ['began', 'begun'], choose: ['chose'], drive: ['drove'],
  sell: ['sold'], sing: ['sang'], swim: ['swam'], understand: ['understood']
};
/** その語が例文の中に何らかの語形で現れているか */
function appearsIn(word, example) {
  const ex = example.toLowerCase();
  const w = word.toLowerCase();
  const forms = new Set([w]);
  if (w.endsWith('e')) forms.add(w.slice(0, -1));       // give → giv(ing)
  if (w.endsWith('y')) forms.add(w.slice(0, -1) + 'i'); // dry → dri(es)
  forms.add(w.slice(0, Math.max(4, w.length - 3)));     // 長い語の語幹
  (IRREGULAR_FORMS[w] || []).forEach((f) => forms.add(f));
  return [...forms].some((f) => f.length >= 3 && ex.includes(f));
}

check('error', '例文に見出し語が含まれない',
  WORD_DATA.filter((w) => w.example && !appearsIn(w.word, w.example)),
  '別の語の例文が付いている');

// ---- 7. 品詞 ----
const posCount = {};
WORD_DATA.forEach((w) => (posCount[w.pos] = (posCount[w.pos] || 0) + 1));

check('warn', '品詞と意味の形が合わない（名詞なのに動詞の語義）',
  WORD_DATA.filter((w) => w.pos === 'n.' && /(する|される|れる)$/.test(w.meaning.split('、')[0])),
  '');
check('warn', '品詞と意味の形が合わない（動詞なのに名詞の語義）',
  WORD_DATA.filter((w) => w.pos === 'v.' && /(こと|もの|人|者|物|性|力|化)$/.test(w.meaning.split('、')[0])),
  '');

/**
 * 同じ語が2回入っていないか。
 * `theater` と `theatre` が別々の見出し語として入っていた（同じ語の英式・米式）。
 * 子は「別の単語」として2回覚えることになる。
 */
const byWord = new Map();
WORD_DATA.forEach((w) => {
  const k = w.word.toLowerCase();
  if (!byWord.has(k)) byWord.set(k, []);
  byWord.get(k).push(w);
});
check('error', '同じ見出し語が2回ある',
  [...byWord.values()].filter((v) => v.length > 1).map((v) => v[0]),
  'どちらか1つに絞る');

/**
 * 英式のつづり。**受けるのはアメリカ式の学校（EIS）なので米式にそろえる。**
 * 見出し語と例文の両方を見る。
 * ただし固有名詞（Defence of Fort McHenry は史実の詩の題名）は除く。
 */
const BRITISH = /\b(metres?|litres?|centimetres?|kilometres?|millilitres?|colours?|coloured|theatre|sweets|petrol|maths|practise|favourite|realise|organise|behaviour|neighbour|programme|trapezium)\b/i;
const PROPER_NOUN = /Defence of Fort McHenry/;
check('error', 'つづりが英式（米式にそろえる）',
  WORD_DATA.filter((w) => {
    const t = `${w.word} ${w.example || ''}`;
    return BRITISH.test(t) && !PROPER_NOUN.test(t);
  }),
  'meters / liters / color / theater / candy などに');

// ---- 出力 ----
console.log(`単語データ ${WORD_DATA.length} 語を点検\n`);
const lv = {};
WORD_DATA.forEach((w) => (lv[w.level] = (lv[w.level] || 0) + 1));
console.log(`レベル: ${JSON.stringify(lv)}   品詞: ${JSON.stringify(posCount)}\n`);

let errors = 0;
for (const f of findings) {
  const n = f.hits.length;
  if (f.level === 'error') errors += n;
  const mark = n === 0 ? '✓' : f.level === 'error' ? '✗' : '△';
  console.log(`${mark} ${f.name}: ${n} 件${f.why && n ? `   — ${f.why}` : ''}`);
  if (n > 0) console.log(`    ${list(f.hits)}`);
}
console.log(`\n直すべきもの（✗）の合計: ${errors} 件`);
