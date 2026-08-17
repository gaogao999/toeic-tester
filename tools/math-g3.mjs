/**
 * Grade 3 の問題。日本の小学3年生に相当する。
 *
 * 扱う範囲:
 *   3桁の加減 / 2桁×1桁のかけ算 / あまりのあるわり算 / 大きな数の位取り
 *   分数のはじまり / 小数のはじまり（0.1の位）/ 単位（mm・km・g・kg・時間）
 *   円の半径と直径 / まわりの長さ / 表とぼうグラフ
 *
 * ここが一番下の段。**つまずいた子が戻ってくる場所**なので、
 * 問題文は短く、数はきりのよいものにする。
 */
import { rng, int, pick, problem, collect } from './math-gen.mjs';

const G = 1; // レベル1 = Grade 3

export function arithmetic(seed, n) {
  const r = rng(seed);
  const out = [];
  for (let i = 0; i < n; i++) {
    const kind = i % 4;
    if (kind === 0) {
      const a = int(r, 120, 899);
      const b = int(r, 120, 899);
      out.push(problem({
        question: `Calculate: ${a} + ${b}`,
        answer: a + b,
        explanation: `位をそろえて足す。一の位から順に、繰り上がりに気をつけて ${a} + ${b} = ${a + b}。`,
        grade: G, category: '四則計算'
      }));
    } else if (kind === 1) {
      const b = int(r, 110, 480);
      const a = b + int(r, 110, 500);
      out.push(problem({
        question: `Calculate: ${a} − ${b}`,
        answer: a - b,
        explanation: `位をそろえて引く。引けないときは上の位から借りる。${a} − ${b} = ${a - b}。`,
        grade: G, category: '四則計算'
      }));
    } else if (kind === 2) {
      const a = int(r, 12, 99);
      const b = int(r, 3, 9);
      out.push(problem({
        question: `Calculate: ${a} × ${b}`,
        answer: a * b,
        explanation: `${a} を位ごとに分けて ${Math.floor(a / 10) * 10} × ${b} = ${Math.floor(a / 10) * 10 * b} と ${a % 10} × ${b} = ${(a % 10) * b}。足して ${a * b}。`,
        grade: G, category: '四則計算'
      }));
    } else {
      // 九九の穴うめ。かけ算の意味が定着しているかを見る
      const a = int(r, 3, 9);
      const b = int(r, 3, 9);
      out.push(problem({
        question: `Fill in the blank: ${a} × ☐ = ${a * b}`,
        answer: b,
        explanation: `${a} の段で ${a * b} になるのを探す。${a} × ${b} = ${a * b} なので ☐ は ${b}。`,
        grade: G, category: '四則計算'
      }));
    }
  }
  return out;
}

/** あまりのあるわり算。Grade 3 の山場 */
export function division(seed, n) {
  const r = rng(seed);
  const out = [];
  for (let i = 0; i < n; i++) {
    const kind = i % 3;
    const b = int(r, 3, 9);
    const q = int(r, 2, 9);
    if (kind === 0) {
      out.push(problem({
        question: `Calculate: ${b * q} ÷ ${b}`,
        answer: q,
        explanation: `${b} の段で ${b * q} になるのを探す。${b} × ${q} = ${b * q} なので答えは ${q}。`,
        grade: G, category: 'わり算'
      }));
    } else if (kind === 1) {
      const rem = int(r, 1, b - 1);
      out.push(problem({
        question: `What is the remainder when ${b * q + rem} is divided by ${b}?`,
        answer: rem, unit: 'あまり',
        explanation: `${b} × ${q} = ${b * q}。${b * q + rem} − ${b * q} = ${rem} が残る。あまりは割る数より小さくなる。`,
        grade: G, category: 'わり算'
      }));
    } else {
      const rem = int(r, 1, b - 1);
      out.push(problem({
        question: `${b * q + rem} sweets are shared equally among ${b} children. How many does each child get?`,
        answer: q, unit: '個',
        explanation: `${b * q + rem} ÷ ${b} = ${q} あまり ${rem}。1人分は ${q} 個で、${rem} 個あまる。`,
        grade: G, category: 'わり算'
      }));
    }
  }
  return out;
}

/** 大きな数と位取り */
export function bigNumbers(seed, n) {
  const r = rng(seed);
  const out = [];
  for (let i = 0; i < n; i++) {
    const kind = i % 3;
    if (kind === 0) {
      const digits = [int(r, 1, 9), int(r, 0, 9), int(r, 0, 9), int(r, 0, 9), int(r, 0, 9)];
      const v = Number(digits.join(''));
      const names = ['ten thousands', 'thousands', 'hundreds', 'tens', 'ones'];
      const ja = ['一万', '千', '百', '十', '一'];
      const k = int(r, 0, 4);
      out.push(problem({
        question: `In the number ${v}, what digit is in the ${names[k]} place?`,
        answer: digits[k],
        explanation: `${v} を位で区切って読む。${ja[k]}の位は ${digits[k]}。`,
        grade: G, category: '概数と位取り'
      }));
    } else if (kind === 1) {
      const a = int(r, 12, 98);
      const k = pick(r, [10, 100]);
      out.push(problem({
        question: `What is ${a} × ${k}?`,
        answer: a * k,
        explanation: `${k} 倍は右に 0 を ${k === 10 ? 1 : 2} つ付けるだけ。${a} → ${a * k}。`,
        grade: G, category: '概数と位取り'
      }));
    } else {
      const a = int(r, 1000, 9999);
      const b = int(r, 1000, 9999);
      if (a === b) { i--; continue; }
      out.push(problem({
        question: `Which is greater, ${a} or ${b}? Write the greater number.`,
        answer: Math.max(a, b),
        explanation: `大きい位から順に比べる。答えは ${Math.max(a, b)}。`,
        grade: G, category: '概数と位取り'
      }));
    }
  }
  return out;
}

/** 分数のはじまり。同じ分母どうしだけを扱う */
export function fractions(seed, n) {
  const r = rng(seed);
  const out = [];
  for (let i = 0; i < n; i++) {
    const kind = i % 3;
    const d = pick(r, [3, 4, 5, 6, 8, 10]);
    if (kind === 0) {
      const a = int(r, 1, d - 1);
      out.push(problem({
        question: `A cake is cut into ${d} equal pieces. Ken eats ${a} pieces. What fraction of the cake did he eat? (Write it as numerator/denominator.)`,
        answer: `${a}/${d}`,
        explanation: `${d} 等分のうち ${a} つ分なので ${a}/${d}。分母は分けた数、分子は取った数。`,
        grade: G, category: '分数'
      }));
    } else if (kind === 1) {
      const a = int(r, 1, d - 2);
      const b = int(r, 1, d - a - 1);
      out.push(problem({
        question: `Calculate: ${a}/${d} + ${b}/${d}. (Write the answer as numerator/denominator.)`,
        answer: `${a + b}/${d}`,
        explanation: `分母が同じときは分子だけ足す。${a} + ${b} = ${a + b} なので ${a + b}/${d}。分母は変えない。`,
        grade: G, category: '分数'
      }));
    } else {
      const a = int(r, 2, d - 1);
      const b = int(r, 1, a - 1);
      out.push(problem({
        question: `Which is greater, ${a}/${d} or ${b}/${d}? (Write the answer as numerator/denominator.)`,
        answer: `${a}/${d}`,
        explanation: `分母が同じなら、分子が大きいほうが大きい。${a} > ${b} なので ${a}/${d}。`,
        grade: G, category: '分数'
      }));
    }
  }
  return out;
}

/** 小数のはじまり。0.1 の位まで */
export function decimals(seed, n) {
  const r = rng(seed);
  const out = [];
  for (let i = 0; i < n; i++) {
    const kind = i % 3;
    if (kind === 0) {
      const k = int(r, 2, 9);
      out.push(problem({
        question: `What number is ${k} lots of 0.1?`,
        answer: Math.round(k * 0.1 * 10) / 10,
        explanation: `0.1 が ${k} つ分で ${Math.round(k * 0.1 * 10) / 10}。0.1 が10こ集まると 1 になる。`,
        grade: G, category: '小数'
      }));
    } else if (kind === 1) {
      const a = int(r, 11, 89) / 10;
      const b = int(r, 11, 89) / 10;
      out.push(problem({
        question: `Calculate: ${a} + ${b}`,
        answer: Math.round((a + b) * 10) / 10,
        explanation: `小数点をそろえて足す。${a} + ${b} = ${Math.round((a + b) * 10) / 10}。`,
        grade: G, category: '小数'
      }));
    } else {
      const b = int(r, 11, 60) / 10;
      const a = Math.round((b + int(r, 11, 40) / 10) * 10) / 10;
      out.push(problem({
        question: `Calculate: ${a} − ${b}`,
        answer: Math.round((a - b) * 10) / 10,
        explanation: `小数点をそろえて引く。${a} − ${b} = ${Math.round((a - b) * 10) / 10}。`,
        grade: G, category: '小数'
      }));
    }
  }
  return out;
}

export function measurement(seed, n) {
  const r = rng(seed);
  const table = [
    { q: (v) => `How many millimetres are in ${v} centimetres?`, f: (v) => v * 10, a: [3, 6, 8, 12, 14], u: 'mm', e: (v) => `1 cm は 10 mm。${v} × 10 = ${v * 10} mm。` },
    { q: (v) => `How many metres are in ${v} kilometres?`, f: (v) => v * 1000, a: [2, 3, 4, 7], u: 'm', e: (v) => `1 km は 1000 m。${v} × 1000 = ${v * 1000} m。` },
    { q: (v) => `How many grams are in ${v} kilograms?`, f: (v) => v * 1000, a: [2, 3, 5, 8], u: 'g', e: (v) => `1 kg は 1000 g。${v} × 1000 = ${v * 1000} g。` },
    { q: (v) => `How many seconds are in ${v} minutes?`, f: (v) => v * 60, a: [2, 4, 6, 9], u: '秒', e: (v) => `1 分は 60 秒。${v} × 60 = ${v * 60} 秒。` },
    { q: (v) => `How many centimetres are in ${v} metres?`, f: (v) => v * 100, a: [3, 5, 6, 9], u: 'cm', e: (v) => `1 m は 100 cm。${v} × 100 = ${v * 100} cm。` }
  ];
  const out = [];
  for (let i = 0; i < n; i++) {
    if (i % 3 === 2) {
      // 時こくと時間。分をまたぐ引き算が Grade 3 のつまずきどころ
      const h = int(r, 8, 16);
      const m1 = int(r, 5, 55);
      const add = int(r, 20, 50);
      const endM = (m1 + add) % 60;
      const endH = h + Math.floor((m1 + add) / 60);
      const two = (v) => String(v).padStart(2, '0');
      out.push(problem({
        question: `How many minutes are there from ${two(h)}:${two(m1)} to ${two(endH)}:${two(endM)}?`,
        answer: add, unit: '分',
        explanation: `${two(h)}:${two(m1)} から次の正時 ${two(h + 1)}:00 までが ${60 - m1} 分。そこから ${two(endH)}:${two(endM)} までが ${add - (60 - m1)} 分。合わせて ${add} 分。`,
        grade: G, category: '単位と量'
      }));
      continue;
    }
    const t = table[i % table.length];
    const v = pick(r, t.a);
    out.push(problem({ question: t.q(v), answer: t.f(v), unit: t.u, explanation: t.e(v), grade: G, category: '単位と量' }));
  }
  return out;
}

export function geometry(seed, n) {
  const r = rng(seed);
  const out = [];
  for (let i = 0; i < n; i++) {
    const kind = i % 4;
    if (kind === 0) {
      const rad = int(r, 2, 15);
      out.push(problem({
        question: `A circle has a radius of ${rad} cm. What is its diameter?`,
        answer: rad * 2, unit: 'cm',
        figure: { kind: 'circle', r: rad, show: 'r', unit: 'cm' },
        explanation: `直径は半径の2倍。${rad} × 2 = ${rad * 2} cm。`,
        grade: G, category: '円'
      }));
    } else if (kind === 1) {
      const s = int(r, 3, 18);
      out.push(problem({
        question: `A square has sides of ${s} cm. What is its perimeter?`,
        answer: s * 4, unit: 'cm',
        figure: { kind: 'rect', w: s, h: s, unit: 'cm' },
        explanation: `正方形は4つの辺が同じ長さ。${s} × 4 = ${s * 4} cm。`,
        grade: G, category: '平面図形'
      }));
    } else if (kind === 2) {
      // long のほうが wide より短いと言い回しがおかしくなるので、大きいほうを long にする
      const a = int(r, 4, 18);
      const b = int(r, 3, 15);
      const w = Math.max(a, b);
      const h = Math.min(a, b);
      if (w === h) { i--; continue; }
      out.push(problem({
        question: `A rectangle is ${w} cm long and ${h} cm wide. What is its perimeter?`,
        answer: 2 * (w + h), unit: 'cm',
        figure: { kind: 'rect', w, h, unit: 'cm' },
        explanation: `たてとよこを足して2倍する。(${w} + ${h}) × 2 = ${2 * (w + h)} cm。`,
        grade: G, category: '平面図形'
      }));
    } else {
      // 二等辺三角形のまわりの長さ。等しい辺が2本あることに気づけるか。
      // 底辺は斜辺2本より短くないと三角形にならない（等号も除く）
      const side = int(r, 5, 15);
      const base = int(r, 3, 2 * side - 2);
      // 底辺と等しい辺が同じ長さだと正三角形。2辺だけにしるしを付けるのは誤解のもと
      if (base === side) { i--; continue; }
      out.push(problem({
        question: `An isosceles triangle has two equal sides of ${side} cm and a base of ${base} cm. What is its perimeter?`,
        answer: side * 2 + base, unit: 'cm',
        figure: { kind: 'isoTriangle', side, base, unit: 'cm' },
        explanation: `等しい辺が2本あるので ${side} × 2 = ${side * 2}。底辺を足して ${side * 2} + ${base} = ${side * 2 + base} cm。`,
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
      const box = int(r, 3, 9);
      const per = int(r, 4, 12);
      out.push(problem({
        question: `${name} has ${box} boxes with ${per} pencils in each box. How many pencils are there in total?`,
        answer: box * per, unit: '本',
        explanation: `1箱 ${per} 本が ${box} 箱なので ${per} × ${box} = ${box * per} 本。`,
        grade: G, category: '文章題'
      }));
    } else if (kind === 1) {
      const start = int(r, 200, 800);
      const spend = int(r, 50, 190);
      out.push(problem({
        question: `${name} had ${start} yen and spent ${spend} yen. How much is left?`,
        answer: start - spend, unit: '円',
        explanation: `${start} − ${spend} = ${start - spend} 円。`,
        grade: G, category: '文章題'
      }));
    } else if (kind === 2) {
      const per = int(r, 3, 9);
      const groups = int(r, 3, 9);
      out.push(problem({
        question: `${per * groups} children are put into groups of ${per}. How many groups are there?`,
        answer: groups, unit: '組',
        explanation: `${per * groups} ÷ ${per} = ${groups} 組。`,
        grade: G, category: '文章題'
      }));
    } else {
      const a = int(r, 120, 480);
      const more = int(r, 30, 200);
      out.push(problem({
        question: `${name} read ${a} pages. Sam read ${more} pages more than ${name}. How many pages did Sam read?`,
        answer: a + more, unit: 'ページ',
        explanation: `「〜より多い」は足す。${a} + ${more} = ${a + more} ページ。`,
        grade: G, category: '文章題'
      }));
    }
  }
  return out;
}

/**
 * 表とぼうグラフ。**グラフから読み取らせる**ので、値は必ず図に持たせる。
 * 問題文には数を書かない（書いたらグラフを見る必要がなくなる）
 */
export function barCharts(seed, n) {
  const r = rng(seed);
  const sets = [
    { labels: ['Mina', 'Tom', 'Anna', 'Ken'], what: 'books each child read', unit: '冊', yLabel: '冊' },
    { labels: ['Mon', 'Tue', 'Wed', 'Thu'], what: 'glasses of water drunk each day', unit: '杯', yLabel: '杯' },
    { labels: ['Cats', 'Dogs', 'Birds', 'Fish'], what: 'pets kept by the class', unit: 'ひき', yLabel: 'ひき' },
    { labels: ['Red', 'Blue', 'Green', 'Yellow'], what: 'children who chose each colour', unit: '人', yLabel: '人' }
  ];
  const out = [];
  for (let i = 0; i < n; i++) {
    const set = sets[i % sets.length];
    // 目盛りに載る整数だけを使う。半端な高さだと読み取れない
    const values = set.labels.map(() => int(r, 2, 12));
    const fig = { kind: 'bars', labels: set.labels, values, yLabel: set.yLabel };
    const kind = i % 3;
    if (kind === 0) {
      const k = int(r, 0, set.labels.length - 1);
      out.push(problem({
        question: `The bar chart shows the ${set.what}. How many for ${set.labels[k]}?`,
        answer: values[k], unit: set.unit, figure: fig,
        explanation: `${set.labels[k]} の棒の高さを目盛りで読む。${values[k]} ${set.unit}。`,
        grade: G, category: 'データの活用'
      }));
    } else if (kind === 1) {
      const hi = values.indexOf(Math.max(...values));
      const lo = values.indexOf(Math.min(...values));
      if (hi === lo) { i--; continue; }
      out.push(problem({
        question: `The bar chart shows the ${set.what}. How many more for ${set.labels[hi]} than for ${set.labels[lo]}?`,
        answer: values[hi] - values[lo], unit: set.unit, figure: fig,
        explanation: `いちばん高い ${set.labels[hi]} は ${values[hi]}、いちばん低い ${set.labels[lo]} は ${values[lo]}。${values[hi]} − ${values[lo]} = ${values[hi] - values[lo]}。`,
        grade: G, category: 'データの活用'
      }));
    } else {
      const total = values.reduce((a, b) => a + b, 0);
      out.push(problem({
        question: `The bar chart shows the ${set.what}. What is the total?`,
        answer: total, unit: set.unit, figure: fig,
        explanation: `棒の高さを全部読んで足す。${values.join(' + ')} = ${total}。`,
        grade: G, category: 'データの活用'
      }));
    }
  }
  return out;
}

export function build() {
  return [
    ...collect(arithmetic, 3001, 24),
    ...collect(division, 3002, 18),
    ...collect(bigNumbers, 3003, 15),
    ...collect(fractions, 3004, 18),
    ...collect(decimals, 3005, 15),
    ...collect(measurement, 3006, 18),
    ...collect(geometry, 3007, 18),
    ...collect(wordProblems, 3008, 16),
    ...collect(barCharts, 3009, 14)
  ];
}
