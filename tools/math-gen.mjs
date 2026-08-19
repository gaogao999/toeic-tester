/**
 * 算数の問題を組み立てる部品。
 *
 * 手書きだけでは必要な問題数に届かないので、テンプレートに数値を振って作る。
 * ただし乱数は固定のたねから作る。**同じたねなら毎回まったく同じ問題ができる**ので、
 * 作り直しても ID がずれず、学習履歴が壊れない。
 *
 * 問題文は英語、解説は日本語。入試がその形式のため。
 */

/** たねから乱数を作る（mulberry32）。Math.random と違い、結果が毎回同じになる */
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** a 以上 b 以下の整数 */
export const int = (r, a, b) => a + Math.floor(r() * (b - a + 1));

/** 配列から1つ選ぶ */
export const pick = (r, arr) => arr[Math.floor(r() * arr.length)];

/** 重複しない整数を n 個 */
export function ints(r, a, b, n) {
  const out = new Set();
  let guard = 0;
  while (out.size < n && guard++ < 500) out.add(int(r, a, b));
  return [...out];
}

/** 最大公約数・最小公倍数 */
export const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
export const lcm = (a, b) => (a / gcd(a, b)) * b;

/** 分数を約分して [分子, 分母] で返す */
export function reduce(n, d) {
  const g = gcd(Math.abs(n), Math.abs(d)) || 1;
  return [n / g, d / g];
}

/**
 * 答えの文字列を作る。
 * 割り切れない小数は、採点で揉めないよう問題側で避ける。
 * ここでは浮動小数の誤差だけ落とす。
 */
export function num(v) {
  const rounded = Math.round(v * 1e6) / 1e6;
  return String(rounded);
}

/** 数を3桁区切りにせずそのまま出す（採点はカンマを吸収するが、問題文は素直に） */
export const fmt = (v) => String(v);

/**
 * 問題を作るヘルパ。
 * category と grade は呼び出し側で決め、ここでは形だけ整える。
 */
export function problem({ question, answer, unit = '', explanation, grade, category, figure = null, wrong = null }) {
  const p = { question, answer: String(answer), unit, explanation, level: grade, category };
  // 図は形の指定だけを持つ。SVG を組み立てるのは js/math-figure.js の仕事
  if (figure) p.figure = figure;
  // 4択の誤答。**この単元ならこう間違える**という候補を生成器が知っているとき。
  // 無ければ js/math-choices.js が答えの形から作る
  if (wrong && wrong.length) p.wrong = wrong.map(String);
  return p;
}

/**
 * 生成関数から n 問を取り出す。**問題文が同じものは捨てる。**
 *
 * 数値を乱数で振る以上、狭い範囲の単元（単位換算・正多角形など）では
 * どうしても同じ問題が出る。たねが同じなら fn(seed, N) の先頭は fn(seed, n) と
 * 一致するので、多めに作って重複を落としても ID の並びは変わらない。
 */
export function collect(fn, seed, n) {
  const seen = new Set();
  const out = [];
  for (const p of fn(seed, n * 6)) {
    if (seen.has(p.question)) continue;
    seen.add(p.question);
    out.push(p);
    if (out.length === n) break;
  }
  if (out.length < n) throw new Error(`たね ${seed}: ${n} 問そろわない（${out.length} 問）。問題の型を増やすこと`);
  return out;
}
