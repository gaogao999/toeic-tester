/**
 * Grade 7 の問題。日本の中学1年生に相当する。
 *
 * 扱う範囲:
 *   正負の数 / 文字式 / 一次方程式 / 比例と反比例
 *   角と平行線・おうぎ形 / 立体の表面積と体積 / 度数分布と相対度数 / 確率の入口
 *
 * 確率は日本の中1では扱わないが、インター校の Grade 7 では標準的な単元なので入れる。
 * 受けるのは EIS の Grade 8 入試なので、日本の指導要領ではなく学年で範囲を決める。
 */
import { rng, int, pick, gcd, reduce, problem, collect } from './math-gen.mjs';

const G = 4; // レベル4 = Grade 7

export function integers(seed, n) {
  const r = rng(seed);
  const out = [];
  for (let i = 0; i < n; i++) {
    const kind = i % 5;
    if (kind === 0) {
      const a = int(r, 2, 20), b = int(r, 2, 20);
      // 答えが 0 になると「絶対値の大きいほう」の説明が成り立たないので引き直す
      if (a === b) { i--; continue; }
      out.push(problem({
        question: `Calculate: (−${a}) + ${b}`,
        answer: b - a,
        explanation: `符号のちがう数の足し算は、絶対値の大きいほうから小さいほうを引き、大きいほうの符号をつける。答えは ${b - a}。`,
        grade: G, category: '正負の数'
      }));
    } else if (kind === 1) {
      const a = int(r, 2, 20), b = int(r, 2, 20);
      out.push(problem({
        question: `Calculate: ${a} − (−${b})`,
        answer: a + b,
        explanation: `負の数を引くのは足すのと同じ。${a} + ${b} = ${a + b}。`,
        grade: G, category: '正負の数'
      }));
    } else if (kind === 2) {
      const a = int(r, 2, 12), b = int(r, 2, 12);
      out.push(problem({
        question: `Calculate: (−${a}) × (−${b})`,
        answer: a * b,
        explanation: `負 × 負 は正。${a} × ${b} = ${a * b}。`,
        grade: G, category: '正負の数'
      }));
    } else if (kind === 3) {
      const b = int(r, 2, 9), q = int(r, 2, 12);
      out.push(problem({
        question: `Calculate: (−${b * q}) ÷ ${b}`,
        answer: -q,
        explanation: `負 ÷ 正 は負。${b * q} ÷ ${b} = ${q} なので、答えは −${q}。`,
        grade: G, category: '正負の数'
      }));
    } else {
      const a = int(r, 2, 9);
      out.push(problem({
        question: `Calculate: (−${a})²`,
        answer: a * a,
        explanation: `(−${a})² は (−${a}) × (−${a})。負 × 負 は正なので ${a * a}。−${a}² との違いに注意。`,
        grade: G, category: '正負の数'
      }));
    }
  }
  return out;
}

export function expressions(seed, n) {
  const r = rng(seed);
  const out = [];
  for (let i = 0; i < n; i++) {
    const kind = i % 4;
    if (kind === 0) {
      const a = int(r, 2, 9), b = int(r, 2, 9), x = int(r, 2, 9);
      out.push(problem({
        question: `If x = ${x}, what is the value of ${a}x + ${b}?`,
        answer: a * x + b,
        explanation: `x に ${x} を入れる。${a} × ${x} + ${b} = ${a * x + b}。`,
        grade: G, category: '文字式'
      }));
    } else if (kind === 1) {
      const a = int(r, 2, 9), b = int(r, 2, 9), x = int(r, 2, 6);
      out.push(problem({
        question: `If x = −${x}, what is the value of ${a}x − ${b}?`,
        answer: -a * x - b,
        explanation: `${a} × (−${x}) = −${a * x}。そこから ${b} を引いて ${-a * x - b}。`,
        grade: G, category: '文字式'
      }));
    } else if (kind === 2) {
      const a = int(r, 2, 9), b = int(r, 2, 9), x = int(r, 2, 7);
      out.push(problem({
        question: `Simplify ${a}x + ${b}x, then find its value when x = ${x}.`,
        answer: (a + b) * x,
        explanation: `同じ文字はまとめられる。${a}x + ${b}x = ${a + b}x。x = ${x} を入れて ${a + b} × ${x} = ${(a + b) * x}。`,
        grade: G, category: '文字式'
      }));
    } else {
      const a = int(r, 2, 6), b = int(r, 2, 9), c = int(r, 2, 6), x = int(r, 2, 6);
      // a − c が 0 や負だと解説の「${a-c}x」が読みづらいので、a が大きい組だけ使う
      if (a <= c) { i--; continue; }
      out.push(problem({
        question: `If x = ${x}, what is the value of ${a}(x + ${b}) − ${c}x?`,
        answer: a * (x + b) - c * x,
        explanation: `かっこを外して ${a}x + ${a * b} − ${c}x = ${a - c}x + ${a * b}。x = ${x} を入れて ${(a - c) * x + a * b}。`,
        grade: G, category: '文字式'
      }));
    }
  }
  return out;
}

export function equations(seed, n) {
  const r = rng(seed);
  const out = [];
  for (let i = 0; i < n; i++) {
    const kind = i % 4;
    if (kind === 0) {
      const a = int(r, 2, 9), x = int(r, 2, 15), b = int(r, 2, 20);
      out.push(problem({
        question: `Solve for x: ${a}x + ${b} = ${a * x + b}`,
        answer: x,
        explanation: `両辺から ${b} を引いて ${a}x = ${a * x}。${a} で割って x = ${x}。`,
        grade: G, category: '方程式'
      }));
    } else if (kind === 1) {
      const a = int(r, 2, 9), x = int(r, 2, 15), b = int(r, 2, 20);
      out.push(problem({
        question: `Solve for x: ${a}x − ${b} = ${a * x - b}`,
        answer: x,
        explanation: `両辺に ${b} を足して ${a}x = ${a * x}。${a} で割って x = ${x}。`,
        grade: G, category: '方程式'
      }));
    } else if (kind === 2) {
      // 両辺に x がある形。係数の差で必ず割り切れるよう a > c にする
      const c = int(r, 2, 5), a = c + int(r, 1, 5), x = int(r, 2, 12), b = int(r, 1, 15);
      out.push(problem({
        question: `Solve for x: ${a}x + ${b} = ${c}x + ${(a - c) * x + b}`,
        answer: x,
        explanation: `${c}x を左に移して ${a - c}x + ${b} = ${(a - c) * x + b}。${b} を右に移して ${a - c}x = ${(a - c) * x}。x = ${x}。`,
        grade: G, category: '方程式'
      }));
    } else {
      const a = int(r, 2, 6), x = int(r, 2, 10), b = int(r, 1, 9);
      out.push(problem({
        question: `Solve for x: ${a}(x + ${b}) = ${a * (x + b)}`,
        answer: x,
        explanation: `両辺を ${a} で割って x + ${b} = ${x + b}。${b} を引いて x = ${x}。`,
        grade: G, category: '方程式'
      }));
    }
  }
  return out;
}

export function proportion(seed, n) {
  const r = rng(seed);
  const out = [];
  for (let i = 0; i < n; i++) {
    const kind = i % 3;
    if (kind === 0) {
      const k = int(r, 2, 12), x = int(r, 2, 9);
      out.push(problem({
        question: `y is proportional to x, and y = ${k * x} when x = ${x}. What is y when x = ${x + 3}?`,
        answer: k * (x + 3),
        explanation: `比例なので y = ax。${k * x} = a × ${x} より a = ${k}。x = ${x + 3} のとき y = ${k} × ${x + 3} = ${k * (x + 3)}。`,
        grade: G, category: '比例と反比例'
      }));
    } else if (kind === 1) {
      const k = pick(r, [12, 24, 36, 48, 60]);
      const divs = [2, 3, 4, 6].filter((d) => k % d === 0);
      const x1 = pick(r, divs);
      const x2 = pick(r, divs.filter((d) => d !== x1));
      out.push(problem({
        question: `y is inversely proportional to x, and y = ${k / x1} when x = ${x1}. What is y when x = ${x2}?`,
        answer: k / x2,
        explanation: `反比例なので xy は一定。${x1} × ${k / x1} = ${k}。x = ${x2} のとき y = ${k} ÷ ${x2} = ${k / x2}。`,
        grade: G, category: '比例と反比例'
      }));
    } else {
      const a = int(r, 2, 8), x = int(r, 2, 9);
      out.push(problem({
        question: `A point (${x}, ${a * x}) is on the line y = ax. What is a?`,
        answer: a,
        explanation: `${a * x} = a × ${x} なので a = ${a * x} ÷ ${x} = ${a}。`,
        grade: G, category: '比例と反比例'
      }));
    }
  }
  return out;
}

export function angles(seed, n) {
  const r = rng(seed);
  const out = [];
  for (let i = 0; i < n; i++) {
    const kind = i % 4;
    if (kind === 0) {
      const a = pick(r, [35, 42, 55, 68, 74, 115, 128]);
      out.push(problem({
        question: `Two parallel lines are cut by a transversal. One angle is ${a}°. What is the co-interior (same-side interior) angle?`,
        answer: 180 - a, unit: '°',
        explanation: `平行線の同側内角の和は 180°。180 − ${a} = ${180 - a}°。`,
        grade: G, category: '平面図形'
      }));
    } else if (kind === 1) {
      const sides = pick(r, [5, 6, 8, 9, 10, 12]);
      out.push(problem({
        question: `What is the sum of the interior angles of a polygon with ${sides} sides?`,
        answer: (sides - 2) * 180, unit: '°',
        explanation: `内角の和 = (n − 2) × 180°。(${sides} − 2) × 180 = ${(sides - 2) * 180}°。`,
        grade: G, category: '平面図形'
      }));
    } else if (kind === 2) {
      const sides = pick(r, [3, 4, 5, 6, 8, 9, 10, 12]);
      out.push(problem({
        question: `What is the size of one interior angle of a regular polygon with ${sides} sides?`,
        answer: ((sides - 2) * 180) / sides, unit: '°',
        explanation: `内角の和は (${sides} − 2) × 180 = ${(sides - 2) * 180}°。正多角形なので ${sides} で割って ${((sides - 2) * 180) / sides}°。`,
        grade: G, category: '平面図形'
      }));
    } else {
      // おうぎ形。中心角は 360 の約数にして弧長・面積を割り切れるようにする
      const rad = int(r, 2, 12);
      const ang = pick(r, [30, 45, 60, 90, 120, 180]);
      const area = Math.round(rad * rad * 3.14 * (ang / 360) * 100) / 100;
      out.push(problem({
        question: `A sector has a radius of ${rad} cm and a central angle of ${ang}°. What is its area? (Use 3.14)`,
        answer: area, unit: 'cm²',
        explanation: `おうぎ形は円の ${ang}/360 の部分。${rad} × ${rad} × 3.14 × ${ang}/360 = ${area} cm²。`,
        grade: G, category: '平面図形'
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
      const a = int(r, 2, 10), b = int(r, 2, 10), c = int(r, 2, 10);
      out.push(problem({
        question: `A rectangular box is ${a} cm by ${b} cm by ${c} cm. What is its surface area?`,
        answer: 2 * (a * b + b * c + a * c), unit: 'cm²',
        explanation: `向かい合う面が2枚ずつ。(${a}×${b} + ${b}×${c} + ${a}×${c}) × 2 = ${2 * (a * b + b * c + a * c)} cm²。`,
        grade: G, category: '立体図形'
      }));
    } else if (kind === 1) {
      const rad = int(r, 2, 9), ht = int(r, 3, 12);
      const s = Math.round((2 * rad * rad * 3.14 + 2 * rad * 3.14 * ht) * 100) / 100;
      out.push(problem({
        question: `A cylinder has a radius of ${rad} cm and a height of ${ht} cm. What is its total surface area? (Use 3.14)`,
        answer: s, unit: 'cm²',
        explanation: `上下の円が ${rad} × ${rad} × 3.14 × 2 = ${Math.round(2 * rad * rad * 3.14 * 100) / 100} cm²。側面は 円周 × 高さ = ${Math.round(2 * rad * 3.14 * 100) / 100} × ${ht} = ${Math.round(2 * rad * 3.14 * ht * 100) / 100} cm²。合わせて ${s} cm²。`,
        grade: G, category: '立体図形'
      }));
    } else {
      // 角錐の体積は底面積 × 高さ ÷ 3。高さを3の倍数にして答えを整数に保つ
      const ht = int(r, 2, 8) * 3;
      const s = int(r, 2, 9);
      out.push(problem({
        question: `A pyramid has a square base with sides of ${s} cm and a height of ${ht} cm. What is its volume?`,
        answer: (s * s * ht) / 3, unit: 'cm³',
        explanation: `角錐の体積 = 底面積 × 高さ ÷ 3 = ${s} × ${s} × ${ht} ÷ 3 = ${(s * s * ht) / 3} cm³。`,
        grade: G, category: '立体図形'
      }));
    }
  }
  return out;
}

export function dataAndChance(seed, n) {
  const r = rng(seed);
  const out = [];
  for (let i = 0; i < n; i++) {
    const kind = i % 4;
    if (kind === 0) {
      const total = pick(r, [20, 25, 40, 50]);
      const f = Math.round(total * pick(r, [0.1, 0.2, 0.4]));
      out.push(problem({
        question: `In a class of ${total} students, ${f} chose tennis. What is the relative frequency for tennis? Give the answer as a decimal.`,
        answer: Math.round((f / total) * 100) / 100,
        explanation: `相対度数 = 度数 ÷ 全体 = ${f} ÷ ${total} = ${Math.round((f / total) * 100) / 100}。`,
        grade: G, category: 'データの活用'
      }));
    } else if (kind === 1) {
      const red = int(r, 2, 8), blue = int(r, 2, 8);
      const [p, q] = reduce(red, red + blue);
      out.push(problem({
        question: `A bag has ${red} red balls and ${blue} blue balls. One ball is taken at random. What is the probability it is red? Give the answer as a fraction (numerator/denominator) in simplest form.`,
        answer: `${p}/${q}`,
        explanation: `全部で ${red + blue} 個、うち赤は ${red} 個。${red}/${red + blue}${p !== red ? ` を約分して ${p}/${q}` : ''}。`,
        grade: G, category: 'データの活用'
      }));
    } else if (kind === 2) {
      const faces = 6;
      const nums = [...Array(faces).keys()].map((k) => k + 1);
      const cond = pick(r, [
        { t: 'an even number', f: (v) => v % 2 === 0 },
        { t: 'a number greater than 4', f: (v) => v > 4 },
        { t: 'a multiple of 3', f: (v) => v % 3 === 0 }
      ]);
      const hit = nums.filter(cond.f);
      const [p, q] = reduce(hit.length, faces);
      out.push(problem({
        question: `A fair six-sided die is rolled. What is the probability of getting ${cond.t}? Give the answer as a fraction (numerator/denominator) in simplest form.`,
        answer: `${p}/${q}`,
        explanation: `あてはまる目は ${hit.join(', ')} の ${hit.length} 通り。全部で 6 通りなので ${hit.length}/6${p !== hit.length ? ` を約分して ${p}/${q}` : ''}。`,
        grade: G, category: 'データの活用'
      }));
    } else {
      const k = pick(r, [6, 8, 10]);
      const vals = [];
      for (let j = 0; j < k; j++) vals.push(int(r, 1, 30));
      const sorted = [...vals].sort((x, y) => x - y);
      const med = (sorted[k / 2 - 1] + sorted[k / 2]) / 2;
      if (med % 0.5 !== 0) { i--; continue; }
      out.push(problem({
        question: `Find the median of: ${vals.join(', ')}.`,
        answer: med,
        explanation: `小さい順に並べると ${sorted.join(', ')}。個数が偶数なので真ん中2つ ${sorted[k / 2 - 1]} と ${sorted[k / 2]} の平均をとって ${med}。`,
        grade: G, category: 'データの活用'
      }));
    }
  }
  return out;
}

export function build() {
  return [
    ...collect(integers, 7001, 22),
    ...collect(expressions, 7002, 18),
    ...collect(equations, 7003, 20),
    ...collect(proportion, 7004, 15),
    ...collect(angles, 7005, 18),
    ...collect(solids, 7006, 15),
    ...collect(dataAndChance, 7007, 18),
    ...collect(inequalities, 7008, 15),
    ...collect(equationWords, 7009, 16)
  ];
}

/** 一次不等式。答えは境界の値を書かせる（不等号を打たせると採点が割れるため） */
export function inequalities(seed, n) {
  const r = rng(seed);
  const out = [];
  for (let i = 0; i < n; i++) {
    const kind = i % 3;
    if (kind === 0) {
      const a = int(r, 2, 8), x = int(r, 2, 12), b = int(r, 1, 15);
      out.push(problem({
        question: `Solve: ${a}x + ${b} > ${a * x + b}. The answer has the form x > k. What is k?`,
        answer: x,
        explanation: `両辺から ${b} を引いて ${a}x > ${a * x}。正の数 ${a} で割るので不等号の向きは変わらず x > ${x}。k = ${x}。`,
        grade: G, category: '不等式'
      }));
    } else if (kind === 1) {
      const a = int(r, 2, 8), x = int(r, 2, 12), b = int(r, 1, 15);
      out.push(problem({
        question: `Solve: −${a}x + ${b} < ${-a * x + b}. The answer has the form x > k. What is k?`,
        answer: x,
        explanation: `${b} を移項して −${a}x < ${-a * x}。負の数 −${a} で割るので不等号の向きが変わり x > ${x}。k = ${x}。`,
        grade: G, category: '不等式'
      }));
    } else {
      const price = int(r, 2, 9) * 100, budget = price * int(r, 3, 9) + int(r, 0, price - 1);
      out.push(problem({
        question: `Notebooks cost ${price} yen each. With ${budget} yen, what is the greatest number you can buy?`,
        answer: Math.floor(budget / price), unit: '冊',
        explanation: `${price}x ≦ ${budget} を解くと x ≦ ${Math.round((budget / price) * 100) / 100}。冊数は整数なので最大 ${Math.floor(budget / price)} 冊。`,
        grade: G, category: '不等式'
      }));
    }
  }
  return out;
}

/** 方程式を立てて解く文章題。式を立てる所が本番なので、型を変えて数を打つ */
export function equationWords(seed, n) {
  const r = rng(seed);
  const names = ['Mina', 'Tom', 'Anna', 'Ken', 'Emma', 'Ryo', 'Sara', 'Leo'];
  const out = [];
  for (let i = 0; i < n; i++) {
    const kind = i % 4;
    const name = pick(r, names);
    if (kind === 0) {
      const x = int(r, 5, 40), d = int(r, 2, 15);
      out.push(problem({
        question: `${name} has ${d} more marbles than Sam. Together they have ${2 * x + d} marbles. How many does Sam have?`,
        answer: x, unit: '個',
        explanation: `サムを x とすると ${name} は x + ${d}。x + (x + ${d}) = ${2 * x + d}。2x = ${2 * x} なので x = ${x} 個。`,
        grade: G, category: '方程式'
      }));
    } else if (kind === 1) {
      const x = int(r, 3, 20), k = int(r, 2, 5);
      out.push(problem({
        question: `A number multiplied by ${k} and then increased by ${k * 2} gives ${k * x + k * 2}. What is the number?`,
        answer: x,
        explanation: `もとの数を x とすると ${k}x + ${k * 2} = ${k * x + k * 2}。${k * 2} を移項して ${k}x = ${k * x}。${k} で割って x = ${x}。`,
        grade: G, category: '方程式'
      }));
    } else if (kind === 2) {
      const w = int(r, 3, 20), extra = int(r, 2, 10);
      out.push(problem({
        question: `A rectangle is ${extra} cm longer than it is wide. Its perimeter is ${2 * (2 * w + extra)} cm. What is its width?`,
        answer: w, unit: 'cm',
        explanation: `よこを x とすると たては x + ${extra}。周は 2(x + x + ${extra}) = ${2 * (2 * w + extra)}。4x = ${4 * w} なので x = ${w} cm。`,
        grade: G, category: '方程式'
      }));
    } else {
      const age = int(r, 8, 16), years = int(r, 2, 10), k = int(r, 2, 3);
      // 「n 年後に k 倍」が成り立つ親の年齢を逆算する
      const parent = k * (age + years) - years;
      out.push(problem({
        question: `${name} is ${age} years old. In ${years} years, ${name}'s parent will be ${k} times as old as ${name}. How old is the parent now?`,
        answer: parent, unit: '歳',
        explanation: `${years} 年後、${name} は ${age + years} 歳。親はその ${k} 倍で ${k * (age + years)} 歳。いまは ${k * (age + years)} − ${years} = ${parent} 歳。`,
        grade: G, category: '方程式'
      }));
    }
  }
  return out;
}
