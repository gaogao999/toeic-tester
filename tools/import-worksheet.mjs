/**
 * 花さんのワークシートで出た語を取り込む。
 *
 *   node tools/import-worksheet.mjs <used_words_hana.json>
 *
 * js/worksheet.js を書き出す。**ワークシートを作るたびに走らせ直すと増える。**
 * （元の記録は g7lit-hana-worksheet スキルの used_words_hana.json）
 *
 * ---
 *
 * ## なぜ別に持つか
 *
 * **文章の中で実際に出会った語**だから、単語帳の並び順より先に覚える価値がある。
 * アプリはここの語を「新しい語」の先頭に回す。
 *
 * 級は元データ（2級・準1級）と一致しないことが多い。花さんの42語のうち、
 * えいごペットで2級なのは9語・準1級は4語で、21語は準2級、8語はどこにも無かった。
 * **級にかかわらず全部入れる。**出会ったという事実のほうが大事なので。
 * 単語帳に無い語は、ワークシートで付けた意味をそのまま使う。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = process.argv[2];
if (!SRC) {
  console.error('使い方: node tools/import-worksheet.mjs <used_words_hana.json>');
  process.exit(1);
}

const log = JSON.parse(fs.readFileSync(SRC, 'utf8'));
if (!Array.isArray(log)) {
  console.error('used_words_hana.json の形が想定と違います（配列ではない）。');
  process.exit(1);
}

const q = (v) => `'${String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const seen = new Set();
const rows = [];
for (const x of log) {
  if (!x || !x.word) continue;
  const key = String(x.word).trim().toLowerCase();
  if (seen.has(key)) continue;
  seen.add(key);
  rows.push({
    word: String(x.word).trim(),
    meaning: String(x.meaning || '').trim(),
    from: (x.used_in || []).map(String)
  });
}

const out = `/**
 * 花さんのワークシートで出た語 — **文章の中で実際に出会った語**
 *
 * **このファイルは手で直さない。**作り直しは
 *   node tools/import-worksheet.mjs <used_words_hana.json>
 *
 * アプリはここの語を「新しい語」の先頭に回す。単語帳（js/data.js）に無い語は
 * ここの意味をそのまま使う。
 *
 * 取り込んだ日: ${new Date().toISOString().slice(0, 10)}（${rows.length}語）
 */
const WORKSHEET_WORDS = [
${rows.map((r) => `  { word: ${q(r.word)}, meaning: ${q(r.meaning)}, from: [${r.from.map(q).join(', ')}] }`).join(',\n')}
];
`;

fs.writeFileSync(path.join(ROOT, 'js/worksheet.js'), out);
console.log(`js/worksheet.js を書き出しました: ${rows.length}語`);
