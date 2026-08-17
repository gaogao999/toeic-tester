/**
 * Grade 5 の問題。日本の小学5年生に相当する。
 *
 * 扱う範囲:
 *   計算の順序 / 異分母の分数 / 小数のかけ算・わり算 / 平均
 *   三角形・平行四辺形・台形の面積 / 直方体の体積 / 割合（百分率の入口）
 *
 * わり算はすべて割り切れる数値だけを選ぶ。小数の答えが循環すると、
 * 「どこまで書けば正解か」で採点が揉めるため。
 */
import { rng, int, pick, gcd, lcm, problem, collect } from './math-gen.mjs';

const G = 3; // レベル3 = Grade 5

export function orderOfOperations(seed, n) {
  const r = rng(seed);
  const out = [];
  for (let i = 0; i < n; i++) {
    const kind = i % 4;
    if (kind === 0) {
      const a = int(r, 2, 9), b = int(r, 2, 9), c = int(r, 2, 9), d = int(r, 2, 9);
      out.push(problem({
        question: `Calculate: ${a} × ${b} + ${c} × ${d}`,
        answer: a * b + c * d,
        explanation: `かけ算を先に。${a} × ${b} = ${a * b}、${c} × ${d} = ${c * d}。足して ${a * b + c * d}。`,
        grade: G, category: '計算の順序'
      }));
    } else if (kind === 1) {
      const b = int(r, 2, 9), q = int(r, 2, 9), c = int(r, 5, 30);
      out.push(problem({
        question: `Calculate: ${c} − ${b * q} ÷ ${b}`,
        answer: c - q,
        explanation: `わり算を先に。${b * q} ÷ ${b} = ${q}。そのあと ${c} − ${q} = ${c - q}。`,
        grade: G, category: '計算の順序'
      }));
    } else if (kind === 2) {
      const a = int(r, 3, 12), b = int(r, 2, 9), c = int(r, 2, 6);
      out.push(problem({
        question: `Calculate: ${a} × (${b} + ${c})`,
        answer: a * (b + c),
        explanation: `かっこが先。${b} + ${c} = ${b + c}。${a} × ${b + c} = ${a * (b + c)}。`,
        grade: G, category: '計算の順序'
      }));
    } else {
      const a = int(r, 2, 6);
      out.push(problem({
        question: `Calculate: ${a}³`,
        answer: a ** 3,
        explanation: `${a}³ は ${a} を3回かける。${a} × ${a} × ${a} = ${a ** 3}。`,
        grade: G, category: '計算の順序'
      }));
    }
  }
  return out;
}

export function fractions(seed, n) {
  const r = rng(seed);
  const pairs = [[2, 3], [3, 4], [4, 6], [3, 5], [2, 5], [6, 8], [4, 5], [3, 8], [5, 6], [2, 7]];
  const out = [];
  for (let i = 0; i < n; i++) {
    const kind = i % 3;
    const [d1, d2] = pick(r, pairs);
    if (kind === 0) {
      const L = lcm(d1, d2);
      const a = int(r, 1, d1 - 1), b = int(r, 1, d2 - 1);
      const num = a * (L / d1) + b * (L / d2);
      const g = gcd(num, L);
      out.push(problem({
        question: `Calculate: ${a}/${d1} + ${b}/${d2}. Give the answer as a fraction in simplest form (write it as numerator/denominator).`,
        answer: `${num / g}/${L / g}`,
        explanation: `分母を ${L} にそろえる。${a}/${d1} = ${a * (L / d1)}/${L}、${b}/${d2} = ${b * (L / d2)}/${L}。足して ${num}/${L}${g > 1 ? `、${g} で約分して ${num / g}/${L / g}` : ''}。`,
        grade: G, category: '分数'
      }));
    } else if (kind === 1) {
      const L = lcm(d1, d2);
      let a = int(r, 1, d1 - 1), b = int(r, 1, d2 - 1);
      let num = a * (L / d1) - b * (L / d2);
      if (num <= 0) { i--; continue; }
      const g = gcd(num, L);
      out.push(problem({
        question: `Calculate: ${a}/${d1} − ${b}/${d2}. Give the answer as a fraction in simplest form (write it as numerator/denominator).`,
        answer: `${num / g}/${L / g}`,
        explanation: `分母を ${L} にそろえる。${a * (L / d1)}/${L} − ${b * (L / d2)}/${L} = ${num}/${L}${g > 1 ? `、${g} で約分して ${num / g}/${L / g}` : ''}。`,
        grade: G, category: '分数'
      }));
    } else {
      // 帯分数を仮分数に直す。分子だけ答えさせて表記のゆれを避ける
      const w = int(r, 2, 6), d = pick(r, [3, 4, 5, 6, 8]), a = int(r, 1, d - 1);
      out.push(problem({
        question: `Write ${w} ${a}/${d} as an improper fraction. What is the numerator?`,
        answer: w * d + a,
        explanation: `整数部分 ${w} は ${w * d}/${d}。それに ${a}/${d} を足して ${w * d + a}/${d}。分子は ${w * d + a}。`,
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
      const a = int(r, 11, 99) / 10;
      const b = int(r, 11, 99) / 10;
      const v = Math.round(a * b * 100) / 100;
      out.push(problem({
        question: `Calculate: ${a} × ${b}`,
        answer: v,
        explanation: `小数点を外して ${a * 10} × ${b * 10} = ${a * 10 * b * 10}。小数点を合わせて2桁戻すと ${v}。`,
        grade: G, category: '小数'
      }));
    } else if (kind === 1) {
      // 割り切れる組だけを作る（商を先に決める）
      const q = int(r, 11, 99) / 10;
      const b = int(r, 2, 9);
      const a = Math.round(q * b * 10) / 10;
      out.push(problem({
        question: `Calculate: ${a} ÷ ${b}`,
        answer: q,
        explanation: `${b} × ${q} = ${a} なので、答えは ${q}。`,
        grade: G, category: '小数'
      }));
    } else {
      const a = int(r, 101, 999) / 100;
      const k = pick(r, [10, 100]);
      out.push(problem({
        question: `Calculate: ${a} × ${k}`,
        answer: Math.round(a * k * 100) / 100,
        explanation: `${k} 倍は小数点を右に ${k === 10 ? 1 : 2} つ動かす。${a} → ${Math.round(a * k * 100) / 100}。`,
        grade: G, category: '小数'
      }));
    }
  }
  return out;
}

export function averages(seed, n) {
  const r = rng(seed);
  const out = [];
  for (let i = 0; i < n; i++) {
    if (i % 2 === 0) {
      const k = pick(r, [4, 5, 6]);
      const mean = int(r, 10, 40);
      // 平均が整数になるよう、合計を先に決めてから散らす
      const vals = [];
      let rest = mean * k;
      for (let j = 0; j < k - 1; j++) {
        const v = int(r, Math.max(1, mean - 8), mean + 8);
        vals.push(v); rest -= v;
      }
      if (rest < 1) { i--; continue; }
      vals.push(rest);
      out.push(problem({
        question: `Find the mean of these numbers: ${vals.join(', ')}.`,
        answer: mean,
        explanation: `合計は ${vals.join(' + ')} = ${mean * k}。${k} で割って ${mean}。`,
        grade: G, category: '平均'
      }));
    } else {
      const k = int(r, 4, 8);
      const mean = int(r, 5, 20);
      out.push(problem({
        question: `The mean of ${k} numbers is ${mean}. What is their total?`,
        answer: k * mean,
        explanation: `合計 = 平均 × 個数 = ${mean} × ${k} = ${k * mean}。`,
        grade: G, category: '平均'
      }));
    }
  }
  return out;
}

export function area(seed, n) {
  const r = rng(seed);
  const out = [];
  for (let i = 0; i < n; i++) {
    const kind = i % 4;
    if (kind === 0) {
      const b = int(r, 2, 12) * 2; // 底辺を偶数にして面積を整数に保つ
      const h = int(r, 3, 15);
      out.push(problem({
        question: `A triangle has a base of ${b} cm and a height of ${h} cm. What is its area?`,
        answer: (b * h) / 2, unit: 'cm²',
        explanation: `三角形の面積 = 底辺 × 高さ ÷ 2 = ${b} × ${h} ÷ 2 = ${(b * h) / 2} cm²。`,
        figure: { kind: 'triangle', base: b, height: h, unit: 'cm' },
        grade: G, category: '平面図形'
      }));
    } else if (kind === 1) {
      const b = int(r, 4, 16), h = int(r, 3, 12);
      out.push(problem({
        question: `A parallelogram has a base of ${b} cm and a height of ${h} cm. What is its area?`,
        answer: b * h, unit: 'cm²',
        explanation: `平行四辺形の面積 = 底辺 × 高さ = ${b} × ${h} = ${b * h} cm²。`,
        figure: { kind: 'parallelogram', base: b, height: h, unit: 'cm' },
        grade: G, category: '平面図形'
      }));
    } else if (kind === 2) {
      const a = int(r, 3, 10), b = a + int(r, 2, 8);
      const h = int(r, 2, 8) * 2; // 高さを偶数にして ÷2 を整数に
      out.push(problem({
        question: `A trapezoid has parallel sides of ${a} cm and ${b} cm, and a height of ${h} cm. What is its area?`,
        answer: ((a + b) * h) / 2, unit: 'cm²',
        explanation: `台形の面積 = (上底 + 下底) × 高さ ÷ 2 = (${a} + ${b}) × ${h} ÷ 2 = ${((a + b) * h) / 2} cm²。`,
        figure: { kind: 'trapezoid', top: a, bottom: b, height: h, unit: 'cm' },
        grade: G, category: '平面図形'
      }));
    } else {
      const s = int(r, 3, 15);
      out.push(problem({
        question: `A square has sides of ${s} cm. What is its area?`,
        answer: s * s, unit: 'cm²',
        explanation: `正方形の面積 = 1辺 × 1辺 = ${s} × ${s} = ${s * s} cm²。`,
        figure: { kind: 'rect', w: s, h: s, unit: 'cm' },
        grade: G, category: '平面図形'
      }));
    }
  }
  return out;
}

export function volume(seed, n) {
  const r = rng(seed);
  const out = [];
  for (let i = 0; i < n; i++) {
    const kind = i % 3;
    if (kind === 0) {
      const a = int(r, 2, 12), b = int(r, 2, 10), c = int(r, 2, 9);
      out.push(problem({
        question: `A rectangular box is ${a} cm by ${b} cm by ${c} cm. What is its volume?`,
        answer: a * b * c, unit: 'cm³',
        explanation: `直方体の体積 = たて × よこ × 高さ = ${a} × ${b} × ${c} = ${a * b * c} cm³。`,
        figure: { kind: 'box', a, b, c, unit: 'cm' },
        grade: G, category: '立体図形'
      }));
    } else if (kind === 1) {
      const s = int(r, 2, 9);
      out.push(problem({
        question: `A cube has edges of ${s} cm. What is its volume?`,
        answer: s ** 3, unit: 'cm³',
        explanation: `立方体の体積 = 1辺³ = ${s} × ${s} × ${s} = ${s ** 3} cm³。`,
        figure: { kind: 'cube', s, unit: 'cm' },
        grade: G, category: '立体図形'
      }));
    } else {
      // 体積の単位換算。立体そのものを問うていないので単位の分野に入れる
      const v = int(r, 2, 20) * 1000;
      out.push(problem({
        question: `A tank holds ${v} cm³ of water. How many litres is that?`,
        answer: v / 1000, unit: 'L',
        explanation: `1 L = 1000 cm³ なので ${v} ÷ 1000 = ${v / 1000} L。`,
        grade: G, category: '単位と量'
      }));
    }
  }
  return out;
}

export function percent(seed, n) {
  const r = rng(seed);
  const out = [];
  for (let i = 0; i < n; i++) {
    const kind = i % 3;
    if (kind === 0) {
      const base = int(r, 2, 20) * 10;
      const p = pick(r, [10, 20, 25, 50, 75]);
      out.push(problem({
        question: `What is ${p}% of ${base}?`,
        answer: (base * p) / 100,
        explanation: `${p}% は ${p / 100}。${base} × ${p / 100} = ${(base * p) / 100}。`,
        grade: G, category: '割合'
      }));
    } else if (kind === 1) {
      const whole = pick(r, [20, 25, 40, 50, 80, 200]);
      const part = whole * pick(r, [0.1, 0.2, 0.25, 0.4, 0.5]);
      // 人数が小数になる組み合わせは問題として成立しないので引き直す
      if (part % 1 !== 0) { i--; continue; }
      out.push(problem({
        question: `${part} out of ${whole} students wear glasses. What percent is that?`,
        answer: Math.round((part / whole) * 100), unit: '%',
        explanation: `${part} ÷ ${whole} = ${part / whole}。100 倍して ${Math.round((part / whole) * 100)}%。`,
        grade: G, category: '割合'
      }));
    } else {
      const d = pick(r, [2, 4, 5, 10, 20, 25]);
      const a = int(r, 1, d - 1);
      out.push(problem({
        question: `Write ${a}/${d} as a percent.`,
        answer: (a / d) * 100, unit: '%',
        explanation: `${a} ÷ ${d} = ${a / d}。100 倍して ${(a / d) * 100}%。`,
        grade: G, category: '割合'
      }));
    }
  }
  return out;
}

export function build() {
  return [
    ...collect(orderOfOperations, 5001, 18),
    ...collect(fractions, 5002, 18),
    ...collect(decimals, 5003, 16),
    ...collect(averages, 5004, 12),
    ...collect(area, 5005, 18),
    ...collect(volume, 5006, 14),
    ...collect(percent, 5007, 16),
    ...collect(coordinates, 5008, 14),
    ...collect(unitConversion, 5009, 14)
  ];
}

/** 座標。第1象限だけ扱う（負の座標は G7 の正負の数のあと） */
export function coordinates(seed, n) {
  const r = rng(seed);
  const out = [];
  for (let i = 0; i < n; i++) {
    const kind = i % 3;
    const x = int(r, 1, 12), y = int(r, 1, 12);
    if (kind === 0) {
      const dx = int(r, 2, 8);
      out.push(problem({
        question: `Point A is at (${x}, ${y}). Point B is at (${x + dx}, ${y}). What is the distance from A to B?`,
        answer: dx, unit: '目盛り',
        explanation: `y が同じなので横に並んでいる。${x + dx} − ${x} = ${dx}。`,
        figure: { kind: 'points', pts: [[x, y], [x + dx, y]], labels: ['A', 'B'] },
        grade: G, category: '座標'
      }));
    } else if (kind === 1) {
      const w = int(r, 2, 9), h = int(r, 2, 9);
      out.push(problem({
        question: `A rectangle has corners at (${x}, ${y}), (${x + w}, ${y}), (${x + w}, ${y + h}) and (${x}, ${y + h}). What is its area?`,
        answer: w * h, unit: '平方目盛り',
        explanation: `よこは ${x + w} − ${x} = ${w}、たては ${y + h} − ${y} = ${h}。${w} × ${h} = ${w * h}。`,
        figure: { kind: 'points', pts: [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], closed: true },
        grade: G, category: '座標'
      }));
    } else {
      const dy = int(r, 2, 8);
      out.push(problem({
        question: `Point P is at (${x}, ${y}). It moves up ${dy} units. What is its new y-coordinate?`,
        answer: y + dy,
        explanation: `上に動くと y が増える。${y} + ${dy} = ${y + dy}。`,
        figure: { kind: 'points', pts: [[x, y]], labels: ['P'] },
        grade: G, category: '座標'
      }));
    }
  }
  return out;
}

/** 面積・体積の単位の換算。1辺の換算率を2乗・3乗する所でつまずくので厚めに */
export function unitConversion(seed, n) {
  const r = rng(seed);
  const table = [
    { q: (v) => `How many square centimetres are in ${v} square metres?`, f: (v) => v * 10000, a: [2, 3, 5, 7], u: 'cm²', e: (v) => `1辺が100倍なので面積は 100 × 100 = 10000 倍。${v} × 10000 = ${v * 10000} cm²。` },
    { q: (v) => `How many cubic centimetres are in ${v} litres?`, f: (v) => v * 1000, a: [2, 3, 4, 6, 8], u: 'cm³', e: (v) => `1 L は1辺 10 cm の立方体ぶんで 1000 cm³。${v} × 1000 = ${v * 1000} cm³。` },
    { q: (v) => `How many metres are in ${v} kilometres?`, f: (v) => v * 1000, a: [2, 3, 5, 6, 9], u: 'm', e: (v) => `キロは1000倍を表す。${v} × 1000 = ${v * 1000} m。` },
    { q: (v) => `How many seconds are in ${v} minutes?`, f: (v) => v * 60, a: [3, 4, 7, 8, 11], u: '秒', e: (v) => `1 分 = 60 秒。${v} × 60 = ${v * 60} 秒。` },
    { q: (v) => `How many square metres are in ${v} hectares?`, f: (v) => v * 10000, a: [2, 4, 6, 9], u: 'm²', e: (v) => `1 ha は1辺 100 m の正方形の面積で 10000 m²。${v} × 10000 = ${v * 10000} m²。` },
    { q: (v) => `${v} grams is how many kilograms?`, f: (v) => v / 1000, a: [2000, 3500, 4000, 7500], u: 'kg', e: (v) => `1000 g で 1 kg になる。${v} ÷ 1000 = ${v / 1000} kg。` }
  ];
  const out = [];
  for (let i = 0; i < n; i++) {
    const t = table[i % table.length];
    const v = pick(r, t.a);
    out.push(problem({ question: t.q(v), answer: t.f(v), unit: t.u, explanation: t.e(v), grade: G, category: '単位と量' }));
  }
  return out;
}
