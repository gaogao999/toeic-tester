/**
 * Grade 4 の問題。日本の小学4年生に相当する。
 *
 * 扱う範囲:
 *   多桁のかけ算・わり算 / 約数と倍数 / 分数の基礎（同分母の加減・大小）
 *   小数（1/10, 1/100 の位）/ 単位の換算 / 角度 / 長方形の面積と周
 *
 * 各関数は「その単元の問題を n 問」返す。数値は固定のたねから振るので、
 * 作り直しても同じ問題ができる。
 */
import { rng, int, pick, ints, gcd, problem, collect } from './math-gen.mjs';

const G = 1; // レベル1 = Grade 4

export function arithmetic(seed, n) {
  const r = rng(seed);
  const out = [];
  for (let i = 0; i < n; i++) {
    const kind = i % 4;
    if (kind === 0) {
      const a = int(r, 12, 99);
      const b = int(r, 12, 99);
      out.push(problem({
        question: `Calculate: ${a} × ${b}`,
        answer: a * b,
        explanation: `${a} × ${b} は ${a} × ${Math.floor(b / 10) * 10} = ${a * Math.floor(b / 10) * 10} と ${a} × ${b % 10} = ${a * (b % 10)} に分けて足すと ${a * b}。`,
        grade: G, category: '四則計算'
      }));
    } else if (kind === 1) {
      const b = int(r, 3, 12);
      const q = int(r, 20, 99);
      out.push(problem({
        question: `Calculate: ${b * q} ÷ ${b}`,
        answer: q,
        explanation: `${b} × ${q} = ${b * q} なので、答えは ${q}。`,
        grade: G, category: '四則計算'
      }));
    } else if (kind === 2) {
      const a = int(r, 2, 9);
      const b = int(r, 2, 9);
      const c = int(r, 10, 40);
      out.push(problem({
        question: `Calculate: ${c} + ${a} × ${b}`,
        answer: c + a * b,
        explanation: `かけ算が先。${a} × ${b} = ${a * b}。そのあと ${c} + ${a * b} = ${c + a * b}。`,
        grade: G, category: '四則計算'
      }));
    } else {
      const a = int(r, 2, 9);
      const b = int(r, 2, 9);
      const c = int(r, 2, 6);
      out.push(problem({
        question: `Calculate: (${a} + ${b}) × ${c}`,
        answer: (a + b) * c,
        explanation: `かっこが先。${a} + ${b} = ${a + b}。そのあと ${a + b} × ${c} = ${(a + b) * c}。`,
        grade: G, category: '四則計算'
      }));
    }
  }
  return out;
}

export function factors(seed, n) {
  const r = rng(seed);
  const out = [];
  for (let i = 0; i < n; i++) {
    if (i % 3 === 0) {
      const num = pick(r, [12, 18, 20, 24, 28, 30, 36, 40, 42, 45, 48, 54, 60]);
      const divisors = [];
      for (let d = 1; d <= num; d++) if (num % d === 0) divisors.push(d);
      out.push(problem({
        question: `How many factors does ${num} have?`,
        answer: divisors.length,
        explanation: `${num} を割り切れる数は ${divisors.join(', ')} の ${divisors.length} 個。`,
        grade: G, category: '約数と倍数'
      }));
    } else if (i % 3 === 1) {
      const a = int(r, 4, 12);
      const b = int(r, 4, 12);
      out.push(problem({
        question: `What is the greatest common factor of ${a * 3} and ${b * 3}?`,
        answer: gcd(a * 3, b * 3),
        explanation: `${a * 3} と ${b * 3} の両方を割り切れる数のうち最大のものは ${gcd(a * 3, b * 3)}。`,
        grade: G, category: '約数と倍数'
      }));
    } else {
      const a = pick(r, [3, 4, 6, 8]);
      const k = int(r, 4, 9);
      out.push(problem({
        question: `What is the ${k}th multiple of ${a}?`,
        answer: a * k,
        explanation: `${a} の倍数を順に並べると ${a}, ${a * 2}, ${a * 3}, … ${k} 番目は ${a} × ${k} = ${a * k}。`,
        grade: G, category: '約数と倍数'
      }));
    }
  }
  return out;
}

export function fractions(seed, n) {
  const r = rng(seed);
  const out = [];
  for (let i = 0; i < n; i++) {
    const kind = i % 3;
    if (kind === 0) {
      const d = pick(r, [5, 6, 8, 10, 12]);
      const a = int(r, 1, d - 2);
      const b = int(r, 1, d - a - 1);
      const g = gcd(a + b, d);
      out.push(problem({
        question: `Calculate: ${a}/${d} + ${b}/${d}. Give the answer as a fraction in simplest form (numerator/denominator).`,
        answer: `${(a + b) / g}/${d / g}`,
        explanation: `分母が同じなので分子を足して ${a + b}/${d}。${g > 1 ? `${g} で約分して ${(a + b) / g}/${d / g}。` : 'これ以上約分できない。'}`,
        grade: G, category: '分数'
      }));
    } else if (kind === 1) {
      const d = pick(r, [4, 5, 8, 10]);
      const whole = pick(r, [20, 30, 40, 50, 60]);
      const a = int(r, 1, d - 1);
      if ((whole / d) % 1 !== 0) { i--; continue; }
      out.push(problem({
        question: `What is ${a}/${d} of ${whole}?`,
        answer: (whole / d) * a,
        explanation: `${whole} ÷ ${d} = ${whole / d}。それを ${a} 倍して ${(whole / d) * a}。`,
        grade: G, category: '分数'
      }));
    } else {
      const d = pick(r, [6, 8, 10, 12]);
      const a = int(r, 2, d - 1);
      const b = int(r, 1, a - 1);
      const g = gcd(a - b, d);
      out.push(problem({
        question: `Calculate: ${a}/${d} − ${b}/${d}. Give the answer as a fraction in simplest form (numerator/denominator).`,
        answer: `${(a - b) / g}/${d / g}`,
        explanation: `分子を引いて ${a - b}/${d}。${g > 1 ? `${g} で約分して ${(a - b) / g}/${d / g}。` : 'これ以上約分できない。'}`,
        grade: G, category: '分数'
      }));
    }
  }
  return out;
}

export function decimals(seed, n) {
  const r = rng(seed);
  const out = [];
  for (let i = 0; i < n; i++) {
    const kind = i % 3;
    if (kind === 0) {
      const a = int(r, 10, 99) / 10;
      const b = int(r, 100, 999) / 100;
      const sum = Math.round((a + b) * 100) / 100;
      out.push(problem({
        question: `Calculate: ${a} + ${b}`,
        answer: sum,
        explanation: `小数点をそろえて ${a.toFixed(2)} + ${b.toFixed(2)} = ${sum}。`,
        grade: G, category: '小数'
      }));
    } else if (kind === 1) {
      const a = int(r, 100, 999) / 100;
      const k = int(r, 2, 9);
      const v = Math.round(a * k * 100) / 100;
      out.push(problem({
        question: `Calculate: ${a} × ${k}`,
        answer: v,
        explanation: `${a} を ${k} 倍する。小数点を外して ${Math.round(a * 100)} × ${k} = ${Math.round(a * 100) * k}、小数点を2桁戻して ${v}。`,
        grade: G, category: '小数'
      }));
    } else {
      const v = int(r, 11, 99) / 100;
      out.push(problem({
        question: `Write ${v} as a fraction with denominator 100. What is the numerator?`,
        answer: Math.round(v * 100),
        explanation: `${v} は 100 分の ${Math.round(v * 100)}。分子は ${Math.round(v * 100)}。`,
        grade: G, category: '小数'
      }));
    }
  }
  return out;
}

export function measurement(seed, n) {
  const r = rng(seed);
  const table = [
    { q: (v) => `How many centimetres are in ${v} metres?`, f: (v) => v * 100, a: [2, 3, 4, 5, 7, 8], u: 'cm', e: (v) => `1 m = 100 cm なので ${v} × 100 = ${v * 100} cm。` },
    { q: (v) => `How many grams are in ${v} kilograms?`, f: (v) => v * 1000, a: [2, 3, 4, 6, 9], u: 'g', e: (v) => `1 kg = 1000 g なので ${v} × 1000 = ${v * 1000} g。` },
    { q: (v) => `How many millilitres are in ${v} litres?`, f: (v) => v * 1000, a: [2, 3, 5, 6, 8], u: 'mL', e: (v) => `1 L = 1000 mL なので ${v} × 1000 = ${v * 1000} mL。` },
    { q: (v) => `How many minutes are in ${v} hours?`, f: (v) => v * 60, a: [2, 3, 4, 5, 6, 7], u: '分', e: (v) => `1 時間 = 60 分なので ${v} × 60 = ${v * 60} 分。` },
    { q: (v) => `How many millimetres are in ${v} centimetres?`, f: (v) => v * 10, a: [4, 7, 9, 12, 15], u: 'mm', e: (v) => `1 cm = 10 mm なので ${v} × 10 = ${v * 10} mm。` }
  ];
  const out = [];
  for (let i = 0; i < n; i++) {
    const t = table[i % table.length];
    const v = pick(r, t.a);
    out.push(problem({
      question: t.q(v), answer: t.f(v), unit: t.u, explanation: t.e(v),
      grade: G, category: '単位と量'
    }));
  }
  return out;
}

export function geometry(seed, n) {
  const r = rng(seed);
  const out = [];
  for (let i = 0; i < n; i++) {
    const kind = i % 4;
    if (kind === 0) {
      const w = int(r, 4, 18);
      const h = int(r, 3, 15);
      out.push(problem({
        question: `A rectangle is ${w} cm long and ${h} cm wide. What is its area?`,
        answer: w * h, unit: 'cm²',
        explanation: `長方形の面積 = たて × よこ = ${w} × ${h} = ${w * h} cm²。`,
        figure: { kind: 'rect', w, h, unit: 'cm' },
        grade: G, category: '平面図形'
      }));
    } else if (kind === 1) {
      const w = int(r, 4, 18);
      const h = int(r, 3, 15);
      out.push(problem({
        question: `A rectangle is ${w} cm long and ${h} cm wide. What is its perimeter?`,
        answer: 2 * (w + h), unit: 'cm',
        explanation: `まわりの長さ = (${w} + ${h}) × 2 = ${2 * (w + h)} cm。`,
        figure: { kind: 'rect', w, h, unit: 'cm' },
        grade: G, category: '平面図形'
      }));
    } else if (kind === 2) {
      const a = pick(r, [25, 35, 40, 55, 65, 70, 110, 125, 140]);
      out.push(problem({
        question: `Two angles are on a straight line. One angle is ${a}°. What is the other angle?`,
        answer: 180 - a, unit: '°',
        explanation: `一直線は 180°。180 − ${a} = ${180 - a}°。`,
        figure: { kind: 'straightLine', a },
        grade: G, category: '平面図形'
      }));
    } else {
      const a = int(r, 20, 80);
      const b = int(r, 20, 80);
      if (a + b >= 175) { i--; continue; }
      out.push(problem({
        question: `Two angles of a triangle are ${a}° and ${b}°. What is the third angle?`,
        answer: 180 - a - b, unit: '°',
        explanation: `三角形の内角の和は 180°。180 − ${a} − ${b} = ${180 - a - b}°。`,
        figure: { kind: 'triangleAngles', a, b },
        grade: G, category: '平面図形'
      }));
    }
  }
  return out;
}

export function wordProblems(seed, n) {
  const r = rng(seed);
  const names = ['Mina', 'Tom', 'Anna', 'Ken', 'Emma', 'Ryo', 'Sara', 'Leo'];
  const out = [];
  for (let i = 0; i < n; i++) {
    const kind = i % 4;
    const name = pick(r, names);
    if (kind === 0) {
      const packs = int(r, 4, 12);
      const per = int(r, 6, 15);
      out.push(problem({
        question: `${name} buys ${packs} packs of pencils. Each pack has ${per} pencils. How many pencils does ${name} have?`,
        answer: packs * per, unit: '本',
        explanation: `1袋 ${per} 本が ${packs} 袋なので ${per} × ${packs} = ${packs * per} 本。`,
        grade: G, category: '文章題'
      }));
    } else if (kind === 1) {
      const total = int(r, 4, 12) * int(r, 3, 9);
      const groups = [...Array(20).keys()].map((k) => k + 2).filter((k) => total % k === 0);
      const g = pick(r, groups);
      out.push(problem({
        question: `${total} students are put into ${g} equal groups. How many students are in each group?`,
        answer: total / g, unit: '人',
        explanation: `${total} ÷ ${g} = ${total / g} 人ずつ。`,
        grade: G, category: '文章題'
      }));
    } else if (kind === 2) {
      const price = int(r, 3, 9) * 100;
      const count = int(r, 3, 8);
      const paid = Math.ceil((price * count) / 1000) * 1000;
      out.push(problem({
        question: `${name} buys ${count} notebooks for ${price} yen each and pays with ${paid} yen. How much change does ${name} get?`,
        answer: paid - price * count, unit: '円',
        explanation: `代金は ${price} × ${count} = ${price * count} 円。おつりは ${paid} − ${price * count} = ${paid - price * count} 円。`,
        grade: G, category: '文章題'
      }));
    } else {
      const start = int(r, 20, 60);
      const gave = int(r, 5, 15);
      const got = int(r, 5, 20);
      out.push(problem({
        question: `${name} had ${start} stickers, gave away ${gave}, and then received ${got} more. How many stickers does ${name} have now?`,
        answer: start - gave + got, unit: '枚',
        explanation: `${start} − ${gave} = ${start - gave}、そこに ${got} 足して ${start - gave + got} 枚。`,
        grade: G, category: '文章題'
      }));
    }
  }
  return out;
}

export function build() {
  return [
    ...collect(arithmetic, 4001, 20),
    ...collect(factors, 4002, 12),
    ...collect(fractions, 4003, 16),
    ...collect(decimals, 4004, 15),
    ...collect(measurement, 4005, 12),
    ...collect(geometry, 4006, 16),
    ...collect(wordProblems, 4007, 16),
    ...collect(rounding, 4008, 14),
    ...collect(patterns, 4009, 14)
  ];
}

/** 概数と位取り。G4 の要。四捨五入は「どの位までにするか」を必ず問題文に書く */
export function rounding(seed, n) {
  const r = rng(seed);
  const places = [
    { name: 'ten', ja: '十', unit: 10 },
    { name: 'hundred', ja: '百', unit: 100 },
    { name: 'thousand', ja: '千', unit: 1000 }
  ];
  const out = [];
  for (let i = 0; i < n; i++) {
    if (i % 2 === 0) {
      const p = places[i % places.length];
      const v = int(r, p.unit * 2, p.unit * 40);
      const rounded = Math.round(v / p.unit) * p.unit;
      out.push(problem({
        question: `Round ${v} to the nearest ${p.name}.`,
        answer: rounded,
        explanation: `${p.ja}の位までの概数にする。1つ下の位を四捨五入して ${rounded}。`,
        grade: G, category: '概数と位取り'
      }));
    } else {
      const digits = [int(r, 1, 9), int(r, 0, 9), int(r, 0, 9), int(r, 0, 9)];
      const v = Number(digits.join(''));
      const names = ['thousands', 'hundreds', 'tens', 'ones'];
      const ja = ['千', '百', '十', '一'];
      const k = int(r, 0, 3);
      out.push(problem({
        question: `In the number ${v}, what digit is in the ${names[k]} place?`,
        answer: digits[k],
        explanation: `${v} の${ja[k]}の位は ${digits[k]}。`,
        grade: G, category: '概数と位取り'
      }));
    }
  }
  return out;
}

/** 数の並びのきまり。等差・等比・図形数を混ぜる */
export function patterns(seed, n) {
  const r = rng(seed);
  const out = [];
  for (let i = 0; i < n; i++) {
    const kind = i % 3;
    if (kind === 0) {
      const a = int(r, 2, 20), d = int(r, 2, 12);
      const seq = [a, a + d, a + 2 * d, a + 3 * d];
      out.push(problem({
        question: `What is the next number in the pattern: ${seq.join(', ')}, ...?`,
        answer: a + 4 * d,
        explanation: `毎回 ${d} ずつ増えている。${a + 3 * d} + ${d} = ${a + 4 * d}。`,
        grade: G, category: '数のきまり'
      }));
    } else if (kind === 1) {
      const a = int(r, 1, 5), k = int(r, 2, 3);
      const seq = [a, a * k, a * k * k, a * k ** 3];
      out.push(problem({
        question: `What is the next number in the pattern: ${seq.join(', ')}, ...?`,
        answer: a * k ** 4,
        explanation: `毎回 ${k} 倍になっている。${a * k ** 3} × ${k} = ${a * k ** 4}。`,
        grade: G, category: '数のきまり'
      }));
    } else {
      const start = int(r, 40, 120), d = int(r, 3, 11);
      const seq = [start, start - d, start - 2 * d, start - 3 * d];
      out.push(problem({
        question: `What is the next number in the pattern: ${seq.join(', ')}, ...?`,
        answer: start - 4 * d,
        explanation: `毎回 ${d} ずつ減っている。${start - 3 * d} − ${d} = ${start - 4 * d}。`,
        grade: G, category: '数のきまり'
      }));
    }
  }
  return out;
}
