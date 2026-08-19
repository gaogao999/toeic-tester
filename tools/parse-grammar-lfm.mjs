/**
 * B1 / B2 教材の「Language Form and Meaning」設問（4択）を読む。
 *
 * A2 の Check-up（2択、1行で完結）と違い、B1/B2 は**長文の空所補充**。
 * 紙面が2段組みなので、OCR は本文と選択肢を取り違えた順序で吐き出す。
 *
 *   12. Schedule            ← 空所の前
 *   (A) blocking
 *   (B) applying
 *   (C) changing
 *   (D) breaking
 *   is one of the reasons…  ← 空所の後
 *
 * ここまではよいが、設問が隣り合うと前後が入れ替わる（p22 など）。
 * **前後の地の文は当てにならない。**当てになるのは次の2つだけ:
 *
 *   - 選択肢4つの組
 *   - その組がページ内で何番目か（＝設問の順番。ここは崩れない）
 *
 * なので、このファイルは**選択肢の組だけ**を返す。
 * 問題文（空所を含む1文）と正解は、人が読んで書いた grammar-b1.mjs /
 * grammar-b2.mjs 側が持つ。**解答欄は OCR で完全に潰れていて復元できない**
 * （`1(0)` `IDI` `2NC)` のような状態）。
 */
import { readFileSync } from 'node:fs';

/** ページの飾り。設問とは関係ない */
const NOISE = [
  /^www\.nhantriviet\.com$/i,
  /^Answer Key p\.\s*\d+/i,
  /^GO ON TO THE NEXT PAGE$/i,
  /^\[?GO ON/i,
  /^STOP$/i,
  /^PART\s+\d+$/i,
  /^Master TOEFL Junior/i
];

/**
 * 選択肢の組をページごとに拾う。
 * (A) で始まる行を組の始まりとし、(D) までの4行を1組とする。
 */
export function parseLfm(path) {
  const lines = readFileSync(path, 'utf8').split('\n');
  const out = [];
  let page = 0;
  let idx = 0;
  let cur = null;

  const flush = () => {
    // (D) まで揃わなかったものは OCR の落丁。捨てる
    if (cur && cur.opts.length === 4) out.push(cur);
    cur = null;
  };

  for (const raw of lines) {
    const l = raw.trim();
    const pm = l.match(/^===== PAGE (\d+) =====$/);
    if (pm) { flush(); page = Number(pm[1]); idx = 0; continue; }
    if (!l || NOISE.some((r) => r.test(l))) continue;

    // 地の文では組を切らない。**選択肢の途中に本文が挟まる**ことが普通にある
    // （p17 の (C) と (D) の間に「! The 6th graders will be throwing candy to」）。
    // 切ってしまうと、その設問が丸ごと落ちる。
    //
    // さらに、**本文と選択肢が同じ行に混ざる**ことがある
    //   「2. when they do not share a native language. (C) To speaking」
    // ので、行頭だけを見ずに (A)〜(D) の位置で切り分ける。
    for (const frag of l.split(/(?=\([A-D]\))/)) {
      const om = frag.match(/^\(([A-D])\)\s*(.*)$/);
      if (!om) continue;
      const [, letter, text] = om;
      if (letter === 'A') { flush(); cur = { page, idx: ++idx, opts: [] }; }
      // (B) が先に来るような崩れ方をしたものは組にしない
      if (!cur || cur.opts.length !== 'ABCD'.indexOf(letter)) { cur = null; continue; }
      cur.opts.push(text.trim());
    }
  }
  flush();
  return out;
}

/** 単体で走らせると、ページごとの選択肢を出す（問題文を書くときの下敷き） */
if (process.argv[1] && process.argv[1].endsWith('parse-grammar-lfm.mjs')) {
  const [path, from = 0, to = 999] = process.argv.slice(2);
  if (!path) { console.error('使い方: node tools/parse-grammar-lfm.mjs <教材のテキスト> [開始ページ] [終了ページ]'); process.exit(1); }
  const all = parseLfm(path);
  for (const b of all) {
    if (b.page < +from || b.page > +to) continue;
    console.log(`p${b.page}-${b.idx}  ` + b.opts.map((t, i) => `(${'ABCD'[i]}) ${t}`).join('  |  '));
  }
  console.error(`計 ${all.length} 組`);
}
