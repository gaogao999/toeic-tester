/**
 * Grade 6 の問題。日本の小学6年生に相当する。
 *
 * 扱う範囲:
 *   分数のかけ算・わり算 / 比 / 割合の応用（増減・割引）/ 速さ
 *   円周と円の面積 / 角柱・円柱の体積 / データの代表値（平均・中央値・最頻値・範囲）
 *
 * 円は円周率 3.14 を使う。入試が小数で扱う形式のため、π のままにはしない。
 */
import { rng, int, pick, gcd, reduce, problem, collect } from './math-gen.mjs';

const G = 4; // レベル4 = Grade 6

export function fractionMulDiv(seed, n) {
  const r = rng(seed);
  const out = [];
  for (let i = 0; i < n; i++) {
    const kind = i % 4;
    const d1 = pick(r, [2, 3, 4, 5, 6, 8]);
    const d2 = pick(r, [2, 3, 4, 5, 6, 8]);
    const a = int(r, 1, d1 - 1);
    const b = int(r, 1, d2 - 1);
    if (kind === 0) {
      const [p, q] = reduce(a * b, d1 * d2);
      out.push(problem({
        question: `Calculate: ${a}/${d1} × ${b}/${d2}. Give the answer as a fraction in simplest form (numerator/denominator).`,
        answer: `${p}/${q}`,
        explanation: `分子どうし・分母どうしをかけて ${a * b}/${d1 * d2}。約分して ${p}/${q}。`,
        grade: G, category: '分数'
      }));
    } else if (kind === 1) {
      const [p, q] = reduce(a * d2, d1 * b);
      out.push(problem({
        question: `Calculate: ${a}/${d1} ÷ ${b}/${d2}. Give the answer as a fraction in simplest form (numerator/denominator).`,
        answer: `${p}/${q}`,
        explanation: `わり算は逆数をかける。${a}/${d1} × ${d2}/${b} = ${a * d2}/${d1 * b}。約分して ${p}/${q}。`,
        grade: G, category: '分数'
      }));
    } else if (kind === 2) {
      const whole = d1 * int(r, 2, 9); // 割り切れる数だけ選ぶ
      out.push(problem({
        question: `Calculate: ${whole} × ${a}/${d1}`,
        answer: (whole / d1) * a,
        explanation: `${whole} ÷ ${d1} = ${whole / d1}、それを ${a} 倍して ${(whole / d1) * a}。`,
        grade: G, category: '分数'
      }));
    } else {
      const k = int(r, 2, 9);
      const [p, q] = reduce(a, d1 * k);
      out.push(problem({
        question: `Calculate: ${a}/${d1} ÷ ${k}. Give the answer as a fraction in simplest form (numerator/denominator).`,
        answer: `${p}/${q}`,
        explanation: `整数で割るときは分母にかける。${a}/${d1 * k}${p !== a ? ` を約分して ${p}/${q}` : ''}。`,
        grade: G, category: '分数'
      }));
    }
  }
  return out;
}

export function ratios(seed, n) {
  const r = rng(seed);
  const out = [];
  for (let i = 0; i < n; i++) {
    const kind = i % 3;
    if (kind === 0) {
      const g = int(r, 2, 9);
      const a = int(r, 2, 9), b = int(r, 2, 9);
      if (gcd(a, b) !== 1) { i--; continue; }
      out.push(problem({
        question: `Simplify the ratio ${a * g} : ${b * g}. Write it as a:b with no spaces.`,
        answer: `${a}:${b}`,
        explanation: `両方を ${g} で割って ${a} : ${b}。`,
        grade: G, category: '比'
      }));
    } else if (kind === 1) {
      const a = int(r, 2, 7), b = int(r, 2, 7);
      const unitSize = int(r, 3, 12);
      out.push(problem({
        question: `${(a + b) * unitSize} sweets are shared in the ratio ${a}:${b}. How many does the first person get?`,
        answer: a * unitSize, unit: '個',
        explanation: `${a} + ${b} = ${a + b} 等分にする。${(a + b) * unitSize} ÷ ${a + b} = ${unitSize}。1人目は ${unitSize} × ${a} = ${a * unitSize} 個。`,
        grade: G, category: '比'
      }));
    } else {
      const a = int(r, 2, 8), b = int(r, 2, 8);
      const k = int(r, 2, 7);
      out.push(problem({
        question: `Solve for x: ${a} : ${b} = ${a * k} : x`,
        answer: b * k,
        explanation: `左を ${k} 倍すると右になる。x = ${b} × ${k} = ${b * k}。`,
        grade: G, category: '比'
      }));
    }
  }
  return out;
}

export function percentApplied(seed, n) {
  const r = rng(seed);
  const out = [];
  for (let i = 0; i < n; i++) {
    const kind = i % 3;
    if (kind === 0) {
      const price = int(r, 4, 30) * 100;
      const off = pick(r, [10, 20, 25, 30, 40, 50]);
      out.push(problem({
        question: `A shirt costs ${price} yen. It is on sale for ${off}% off. What is the sale price?`,
        answer: price - (price * off) / 100, unit: '円',
        explanation: `値引き額は ${price} × ${off / 100} = ${(price * off) / 100} 円。${price} − ${(price * off) / 100} = ${price - (price * off) / 100} 円。`,
        grade: G, category: '割合'
      }));
    } else if (kind === 1) {
      const before = int(r, 2, 20) * 50;
      const up = pick(r, [10, 20, 25, 50]);
      // 人数が小数になる組み合わせは引き直す
      if (((before * up) / 100) % 1 !== 0) { i--; continue; }
      out.push(problem({
        question: `The number of members increased from ${before} by ${up}%. How many members are there now?`,
        answer: before + (before * up) / 100, unit: '人',
        explanation: `増えた分は ${before} × ${up / 100} = ${(before * up) / 100} 人。合計 ${before + (before * up) / 100} 人。`,
        grade: G, category: '割合'
      }));
    } else {
      const p = pick(r, [10, 20, 25, 40, 50]);
      const whole = int(r, 2, 20) * 10;
      // 「〜は◯%にあたる」の数が小数になる組み合わせは引き直す
      if (((whole * p) / 100) % 1 !== 0) { i--; continue; }
      out.push(problem({
        question: `${(whole * p) / 100} is ${p}% of what number?`,
        answer: whole,
        explanation: `${p}% = ${p / 100}。もとの数 = ${(whole * p) / 100} ÷ ${p / 100} = ${whole}。`,
        grade: G, category: '割合'
      }));
    }
  }
  return out;
}

export function speed(seed, n) {
  const r = rng(seed);
  const out = [];
  for (let i = 0; i < n; i++) {
    const kind = i % 3;
    const v = int(r, 3, 20) * 5;
    const t = int(r, 2, 8);
    if (kind === 0) {
      out.push(problem({
        question: `A car travels at ${v} km/h for ${t} hours. How far does it go?`,
        answer: v * t, unit: 'km',
        explanation: `道のり = 速さ × 時間 = ${v} × ${t} = ${v * t} km。`,
        grade: G, category: '速さ'
      }));
    } else if (kind === 1) {
      out.push(problem({
        question: `A train covers ${v * t} km in ${t} hours. What is its speed in km/h?`,
        answer: v, unit: 'km/h',
        explanation: `速さ = 道のり ÷ 時間 = ${v * t} ÷ ${t} = ${v} km/h。`,
        grade: G, category: '速さ'
      }));
    } else {
      out.push(problem({
        question: `How many hours does it take to travel ${v * t} km at ${v} km/h?`,
        answer: t, unit: '時間',
        explanation: `時間 = 道のり ÷ 速さ = ${v * t} ÷ ${v} = ${t} 時間。`,
        grade: G, category: '速さ'
      }));
    }
  }
  return out;
}

export function circles(seed, n) {
  const r = rng(seed);
  const out = [];
  for (let i = 0; i < n; i++) {
    const kind = i % 3;
    const rad = int(r, 2, 15);
    if (kind === 0) {
      out.push(problem({
        question: `A circle has a radius of ${rad} cm. What is its circumference? (Use 3.14)`,
        answer: Math.round(2 * rad * 3.14 * 100) / 100, unit: 'cm',
        explanation: `円周 = 直径 × 3.14 = ${2 * rad} × 3.14 = ${Math.round(2 * rad * 3.14 * 100) / 100} cm。`,
        figure: { kind: 'circle', r: rad, show: 'r', unit: 'cm' },
        grade: G, category: '円'
      }));
    } else if (kind === 1) {
      out.push(problem({
        question: `A circle has a radius of ${rad} cm. What is its area? (Use 3.14)`,
        answer: Math.round(rad * rad * 3.14 * 100) / 100, unit: 'cm²',
        explanation: `円の面積 = 半径 × 半径 × 3.14 = ${rad} × ${rad} × 3.14 = ${Math.round(rad * rad * 3.14 * 100) / 100} cm²。`,
        figure: { kind: 'circle', r: rad, show: 'r', unit: 'cm' },
        grade: G, category: '円'
      }));
    } else {
      const d = rad * 2;
      out.push(problem({
        question: `A circle has a diameter of ${d} cm. What is its radius?`,
        answer: rad, unit: 'cm',
        explanation: `半径は直径の半分。${d} ÷ 2 = ${rad} cm。`,
        figure: { kind: 'circle', d, show: 'd', ask: 'r', unit: 'cm' },
        grade: G, category: '円'
      }));
    }
  }
  return out;
}

export function solids(seed, n) {
  const r = rng(seed);
  const out = [];
  for (let i = 0; i < n; i++) {
    const kind = i % 3;
    if (kind === 0) {
      const b = int(r, 2, 10) * 2, ht = int(r, 3, 12), len = int(r, 3, 15);
      out.push(problem({
        question: `A prism has a triangular base with a base of ${b} cm and a height of ${ht} cm. The prism is ${len} cm long. What is its volume?`,
        answer: ((b * ht) / 2) * len, unit: 'cm³',
        explanation: `角柱の体積 = 底面積 × 高さ。底面積は ${b} × ${ht} ÷ 2 = ${(b * ht) / 2} cm²。${(b * ht) / 2} × ${len} = ${((b * ht) / 2) * len} cm³。`,
        figure: { kind: 'prism', base: b, height: ht, length: len, unit: 'cm' },
        grade: G, category: '立体図形'
      }));
    } else if (kind === 1) {
      const rad = int(r, 2, 8), ht = int(r, 3, 12);
      const v = Math.round(rad * rad * 3.14 * ht * 100) / 100;
      out.push(problem({
        question: `A cylinder has a radius of ${rad} cm and a height of ${ht} cm. What is its volume? (Use 3.14)`,
        answer: v, unit: 'cm³',
        explanation: `円柱の体積 = 底面積 × 高さ = ${rad} × ${rad} × 3.14 × ${ht} = ${v} cm³。`,
        figure: { kind: 'cylinder', r: rad, h: ht, unit: 'cm' },
        grade: G, category: '立体図形'
      }));
    } else {
      const s = int(r, 2, 12);
      out.push(problem({
        question: `A cube has edges of ${s} cm. What is its surface area?`,
        answer: 6 * s * s, unit: 'cm²',
        explanation: `立方体の面は6つ。1面は ${s} × ${s} = ${s * s} cm²。${s * s} × 6 = ${6 * s * s} cm²。`,
        figure: { kind: 'cube', s, unit: 'cm' },
        grade: G, category: '立体図形'
      }));
    }
  }
  return out;
}

export function statistics(seed, n) {
  const r = rng(seed);
  const out = [];
  for (let i = 0; i < n; i++) {
    const kind = i % 3;
    if (kind === 0) {
      // 中央値。個数を奇数にして「真ん中の1つ」に決まるようにする
      const k = pick(r, [5, 7, 9]);
      const vals = [];
      for (let j = 0; j < k; j++) vals.push(int(r, 1, 40));
      const sorted = [...vals].sort((x, y) => x - y);
      out.push(problem({
        question: `Find the median of: ${vals.join(', ')}.`,
        answer: sorted[(k - 1) / 2],
        explanation: `小さい順に並べると ${sorted.join(', ')}。${k} 個の真ん中は ${(k + 1) / 2} 番目で ${sorted[(k - 1) / 2]}。`,
        grade: G, category: 'データの活用'
      }));
    } else if (kind === 1) {
      const base = int(r, 2, 20);
      const vals = [base, base, int(r, 21, 40), int(r, 21, 40), base, int(r, 21, 40)];
      // 他の数が3回そろうと最頻値が2つになってしまうので引き直す
      const tie = vals.filter((v) => v !== base);
      if (new Set(tie).size < tie.length) { i--; continue; }
      out.push(problem({
        question: `Find the mode of: ${vals.join(', ')}.`,
        answer: base,
        explanation: `いちばん多く出てくる数を探す。${base} が3回で最多なので最頻値は ${base}。`,
        grade: G, category: 'データの活用'
      }));
    } else {
      const lo = int(r, 1, 20), hi = lo + int(r, 5, 40);
      const vals = [lo, int(r, lo, hi), int(r, lo, hi), hi, int(r, lo, hi)];
      out.push(problem({
        question: `Find the range of: ${vals.join(', ')}.`,
        answer: hi - lo,
        explanation: `いちばん大きい ${hi} から、いちばん小さい ${lo} を引く。${hi} − ${lo} = ${hi - lo}。`,
        grade: G, category: 'データの活用'
      }));
    }
  }
  return out;
}

export function build() {
  return [
    ...collect(fractionMulDiv, 6001, 20),
    ...collect(ratios, 6002, 16),
    ...collect(percentApplied, 6003, 18),
    ...collect(speed, 6004, 15),
    ...collect(circles, 6005, 18),
    ...collect(solids, 6006, 15),
    ...collect(statistics, 6007, 15),
    ...collect(numberTheory, 6008, 15),
    ...collect(unitRate, 6009, 15)
  ];
}

/** 素因数分解と、最小公倍数・最大公約数を使う文章題 */
export function numberTheory(seed, n) {
  const r = rng(seed);
  const out = [];
  for (let i = 0; i < n; i++) {
    const kind = i % 3;
    if (kind === 0) {
      const v = pick(r, [36, 48, 60, 72, 84, 90, 96, 120, 144, 180, 200, 210]);
      const fs = [];
      let t = v;
      for (let d = 2; d * d <= t; d++) while (t % d === 0) { fs.push(d); t /= d; }
      if (t > 1) fs.push(t);
      out.push(problem({
        question: `How many prime factors does ${v} have, counting repeats? (For example, 12 = 2 × 2 × 3 has 3.)`,
        answer: fs.length,
        explanation: `${v} = ${fs.join(' × ')}。全部で ${fs.length} 個。`,
        grade: G, category: '約数と倍数'
      }));
    } else if (kind === 1) {
      const a = pick(r, [4, 6, 8, 9, 10, 12]);
      const b = pick(r, [5, 6, 7, 8, 9, 15]);
      if (a === b) { i--; continue; }
      out.push(problem({
        question: `Bus A comes every ${a} minutes and bus B every ${b} minutes. They leave together now. In how many minutes will they next leave together?`,
        answer: (a / gcd(a, b)) * b, unit: '分',
        explanation: `次にそろうのは最小公倍数。${a} と ${b} の最小公倍数は ${(a / gcd(a, b)) * b} 分。`,
        grade: G, category: '約数と倍数'
      }));
    } else {
      const g = pick(r, [4, 6, 8, 9, 12]);
      const a = g * int(r, 2, 7), b = g * int(r, 2, 7);
      if (gcd(a / g, b / g) !== 1) { i--; continue; }
      out.push(problem({
        question: `${a} pencils and ${b} erasers are shared equally among children with none left over. What is the greatest number of children?`,
        answer: g, unit: '人',
        explanation: `両方を割り切れる最大の数、つまり最大公約数。${a} と ${b} の最大公約数は ${g} 人。`,
        grade: G, category: '約数と倍数'
      }));
    }
  }
  return out;
}

/** 単位量あたりの大きさ。人口密度・燃費・単価をそろえて出す */
export function unitRate(seed, n) {
  const r = rng(seed);
  const out = [];
  for (let i = 0; i < n; i++) {
    const kind = i % 3;
    if (kind === 0) {
      const per = int(r, 3, 30) * 10, area = int(r, 2, 9);
      out.push(problem({
        question: `A town has ${per * area} people living in ${area} km². What is the population density in people per km²?`,
        answer: per, unit: '人/km²',
        explanation: `人口密度 = 人口 ÷ 面積 = ${per * area} ÷ ${area} = ${per} 人/km²。`,
        grade: G, category: '単位量あたり'
      }));
    } else if (kind === 1) {
      const kmPerL = int(r, 8, 20), litres = int(r, 3, 12);
      out.push(problem({
        question: `A car runs ${kmPerL} km on 1 litre of petrol. How far can it go on ${litres} litres?`,
        answer: kmPerL * litres, unit: 'km',
        explanation: `1 L で ${kmPerL} km なので ${kmPerL} × ${litres} = ${kmPerL * litres} km。`,
        grade: G, category: '単位量あたり'
      }));
    } else {
      const unitPrice = int(r, 2, 20) * 10, count = int(r, 3, 12);
      out.push(problem({
        question: `${count} apples cost ${unitPrice * count} yen in total. How much is one apple?`,
        answer: unitPrice, unit: '円',
        explanation: `1個あたり = 合計 ÷ 個数 = ${unitPrice * count} ÷ ${count} = ${unitPrice} 円。`,
        grade: G, category: '単位量あたり'
      }));
    }
  }
  return out;
}
