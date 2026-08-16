/**
 * materials/text/*.txt（OCR済みの教材テキスト）から長文読解ブロックを抽出し、
 * data/raw/reading-import/ にステージング JSON として書き出す。
 *
 * ここで完成品を作らない理由:
 *   - スキャンの Answer Key は段組みが崩れていて OCR から正解を復元できない。
 *     正解は後工程（手入力または本文からの検算）で埋めるため、answer は null のまま出す。
 *   - OCR ノイズ（行番号・ヘッダー・フッター）の除去に失敗した箇所を目視確認してから
 *     js/reading-data.js に反映するため。
 *
 * 使い方: node tools/import-reading.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, basename } from 'node:path';

const SRC_DIR = 'materials/text';
const OUT_DIR = 'data/raw/reading-import';

// 教材ごとのレベル対応（アプリの4段階に合わせる）
const BOOK_LEVEL = [
  { match: /Basic/i, level: 2, label: 'Basic (A2)' },
  { match: /Intermediate/i, level: 3, label: 'Intermediate (B1)' },
  { match: /Advanced/i, level: 4, label: 'Advanced (B2)' }
];

// 本文でも設問でもない紙面の飾り・ヘッダー・フッター
const NOISE = [
  /^www\.nhantriviet/i,
  /^GO ON TO THE NEXT PAGE/i,
  /^Answer\s*[Kk]ey/,
  /^STOP$/,
  /^PART\s*\d/i,
  /^Master TOEFL/i,
  /^Diagnostic Test$/i,
  /^Actual Test/i,
  /^Practice Test/i,
  /^Review Test/i,
  /^Unit\s*\d+\s*[•·]/,
  /^\d{1,3}$/, // 行番号（5,10,15…）とページ番号
  /^[a-z]?\d{1,2}$/i, // OCRが拾う音声トラック番号など
  /^facebook\.com/i
];

function isNoise(line) {
  return NOISE.some((re) => re.test(line.trim()));
}

function parseBook(path) {
  const raw = readFileSync(path, 'utf8');
  // ページ区切りは残し、どのページから来たかを追えるようにする
  let page = 0;
  const lines = [];
  for (const l of raw.split('\n')) {
    const m = l.match(/^--- p\.(\d+) ---$/);
    if (m) { page = Number(m[1]); continue; }
    // OCR が設問番号の 1 を I や l と読み違えることがある（I. / I0. / II. など）
    const t = l.replace(/^([Il]{1,2})(\d*)([.,]\s)/, (_, a, b, c) => a.replace(/[Il]/g, '1') + b + c);
    // 2段組の選択肢が1行にまとまることがある（「(A) 〜 (C) 〜」）ので行を分ける
    if (/^\([A-D]\)\s/.test(t) && /\s\([A-D]\)\s/.test(t.slice(4))) {
      const parts = t.split(/\s(?=\([A-D]\)\s)/);
      for (const p of parts) lines.push({ page, text: p });
      continue;
    }
    lines.push({ page, text: t });
  }

  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    const head = lines[i].text.match(
      /^Questions?\s+(\d+)\s*[-–]\s*(\d+)\s+are about the following\s+(.+?)\.?\s*$/i
    );
    if (!head) { i++; continue; }
    const [, from, to, kind] = head;
    const first = Number(from);
    const last = Number(to);
    const startPage = lines[i].page;
    i++;

    // --- 本文: 最初の設問番号が現れるまで ---
    const passage = [];
    while (i < lines.length) {
      const t = lines[i].text.trim();
      if (new RegExp(`^${first}\\.\\s`).test(t)) break; // 設問開始
      if (/^Questions?\s+\d+\s*[-–]\s*\d+\s+are about/i.test(t)) break; // 次のブロック（設問が拾えなかった）
      if (t && !isNoise(t)) passage.push(t);
      i++;
    }

    // --- 設問: (A)〜(D) の4択を集める ---
    const questions = [];
    let cur = null;
    let curChoice = null;
    while (i < lines.length) {
      const t = lines[i].text.trim();
      if (/^Questions?\s+\d+\s*[-–]\s*\d+\s+are about/i.test(t)) break;
      const qm = t.match(/^(\d{1,2})[.,]\s+(.*)$/);
      const cm = t.match(/^\(([A-Da-d])\)\s*(.*)$/);
      if (qm && Number(qm[1]) >= first && Number(qm[1]) <= last) {
        cur = { n: Number(qm[1]), q: qm[2], choices: [], answer: null };
        questions.push(cur);
        curChoice = null;
      } else if (cm && cur) {
        curChoice = cm[2];
        cur.choices.push(curChoice);
      } else if (t && !isNoise(t)) {
        // 折り返し行: 直前の選択肢か設問文に連結する
        if (curChoice !== null && cur) {
          cur.choices[cur.choices.length - 1] += ' ' + t;
        } else if (cur) {
          cur.q += ' ' + t;
        }
      }
      i++;
      // このブロックの設問を全部取り終えて次の見出しに近づいたら抜ける
      if (cur && cur.n === last && cur.choices.length >= 4) {
        // 残りの折り返しを少しだけ読み進める
        const t2 = (lines[i]?.text ?? '').trim();
        if (!t2 || isNoise(t2) || /^Questions?\s/i.test(t2)) break;
      }
    }

    questions.sort((a, b) => a.n - b.n); // 2段組で順番が乱れることがある
    blocks.push({
      page: startPage,
      range: `${first}-${last}`,
      kind: kind.toLowerCase(),
      expected: last - first + 1,
      passage: passage.join('\n'),
      questions
    });
  }
  return blocks;
}

mkdirSync(OUT_DIR, { recursive: true });
for (const file of readdirSync(SRC_DIR).filter((f) => f.endsWith('.txt'))) {
  const book = BOOK_LEVEL.find((b) => b.match.test(file));
  if (!book) continue;
  const blocks = parseBook(join(SRC_DIR, file));
  const out = { source: file, level: book.level, label: book.label, blocks };
  const outPath = join(OUT_DIR, basename(file, '.txt') + '.json');
  writeFileSync(outPath, JSON.stringify(out, null, 2));

  const total = blocks.reduce((s, b) => s + b.questions.length, 0);
  const clean = blocks.filter(
    (b) =>
      b.questions.length === b.expected &&
      b.questions.every((q) => q.choices.length === 4) &&
      b.passage.split(/\s+/).length > 60
  );
  console.log(`${book.label}: ${blocks.length} blocks / ${total} questions ` +
    `(完全に取れた本文: ${clean.length}/${blocks.length}) -> ${outPath}`);
}
