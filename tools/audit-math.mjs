/**
 * 算数データの総点検。
 *
 * 作った本人（ジェネレータ）が計算した答えを、そのまま信じない。
 * ここでは **問題文を読み直して答えを計算しなおす**。式の形ごとに正解を独立に出し、
 * data 側の answer と食い違ったら落とす。
 *
 *   node tools/audit-math.mjs            … js/math-data.js を点検
 *   node tools/audit-math.mjs --gen      … ジェネレータの出力を点検（マージ前）
 */
import { readFileSync } from 'node:fs';

const errors = [];
const warns = [];
const fail = (p, msg) => errors.push(`[${p.id || '(new)'}] ${msg}｜${p.question}`);
const warn = (p, msg) => warns.push(`[${p.id || '(new)'}] ${msg}｜${p.question}`);

/** 答えの文字列を数にする。app.js の toNumber と同じ判定にそろえる */
function toNumber(text) {
  const t = String(text).trim().replace(/[,\s]/g, '').replace(/^\+/, '');
  if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t);
  const m = t.match(/^(-?\d+)\/(\d+)$/);
  if (m) return Number(m[1]) / Number(m[2]);
  return NaN;
}

const near = (a, b) => Math.abs(a - b) < 1e-6;

/**
 * 問題文から答えを計算しなおす。
 * 対応できた形なら数値を、手が出ない形なら null を返す（null は検算なしとして数える）。
 */
function recompute(q) {
  const s = q.replace(/−/g, '-').replace(/×/g, '*').replace(/÷/g, '/').replace(/³/g, '^3').replace(/²/g, '^2');
  let m;

  // 分数式が先。「3/4 ÷ 1/2」を式として左から割ると 0.375 になってしまうため、
  // 一般の式より前に分数として読む
  m = q.match(/^Calculate:\s*(-?\d+)\/(\d+)\s*([+\-−×÷*/])\s*(-?\d+)(?:\/(\d+))?\s*[.(]?/);
  if (m) {
    const a = Number(m[1]) / Number(m[2]);
    const b = m[5] ? Number(m[4]) / Number(m[5]) : Number(m[4]);
    const op = m[3];
    if (op === '+') return a + b;
    if (op === '-' || op === '−') return a - b;
    if (op === '×' || op === '*') return a * b;
    return a / b;
  }

  // Calculate: 式  … 四則とかっこ・累乗だけの式を自前で評価する
  m = s.match(/^Calculate:\s*(.+?)\s*$/);
  if (m && /^[-()0-9+*/.\s^]+$/.test(m[1])) return evalExpr(m[1]);

  // Calculate: 整数 × a/b
  m = q.match(/^Calculate:\s*(\d+)\s*×\s*(\d+)\/(\d+)$/);
  if (m) return (Number(m[1]) * Number(m[2])) / Number(m[3]);

  m = q.match(/^How many factors does (\d+) have\?/);
  if (m) { let c = 0; for (let d = 1; d <= +m[1]; d++) if (+m[1] % d === 0) c++; return c; }

  m = q.match(/greatest common factor of (\d+) and (\d+)/);
  if (m) { const g = (a, b) => (b === 0 ? a : g(b, a % b)); return g(+m[1], +m[2]); }

  m = q.match(/What is the (\d+)(?:st|nd|rd|th) multiple of (\d+)\?/);
  if (m) return +m[1] * +m[2];

  m = q.match(/What is (\d+)\/(\d+) of (\d+)\?/);
  if (m) return (+m[3] / +m[2]) * +m[1];

  m = q.match(/Write (\d+) tenths as a decimal/);
  if (m) return +m[1] / 10;

  m = q.match(/Write ([\d.]+) as a fraction with denominator 100/);
  if (m) return Math.round(+m[1] * 100);

  m = q.match(/Write (\d+) (\d+)\/(\d+) as an improper fraction/);
  if (m) return +m[1] * +m[3] + +m[2];

  m = q.match(/Write (\d+)\/(\d+) as a percent/);
  if (m) return (+m[1] / +m[2]) * 100;

  m = q.match(/What is ([\d.]+)% of (\d+)\?/);
  if (m) return (+m[2] * +m[1]) / 100;

  m = q.match(/^([\d.]+) is ([\d.]+)% of what number\?/);
  if (m) return (+m[1] * 100) / +m[2];

  m = q.match(/(\d+) out of (\d+) students wear glasses/);
  if (m) return Math.round((+m[1] / +m[2]) * 100);

  m = q.match(/costs (\d+) yen.*?(\d+)% off/s);
  if (m) return +m[1] - (+m[1] * +m[2]) / 100;

  m = q.match(/increased from (\d+) by (\d+)%/);
  if (m) return +m[1] + (+m[1] * +m[2]) / 100;

  m = q.match(/How many centimetres are in (\d+) metres/); if (m) return +m[1] * 100;
  m = q.match(/How many grams are in (\d+) kilograms/); if (m) return +m[1] * 1000;
  m = q.match(/How many millilitres are in (\d+) litres/); if (m) return +m[1] * 1000;
  m = q.match(/How many minutes are in (\d+) hours/); if (m) return +m[1] * 60;
  m = q.match(/How many millimetres are in (\d+) centimetres/); if (m) return +m[1] * 10;
  m = q.match(/holds (\d+) cm³ of water.*litres/s); if (m) return +m[1] / 1000;

  m = q.match(/rectangle is (\d+) cm long and (\d+) cm wide.*area/s);
  if (m) return +m[1] * +m[2];
  m = q.match(/rectangle is (\d+) cm long and (\d+) cm wide.*perimeter/s);
  if (m) return 2 * (+m[1] + +m[2]);
  m = q.match(/square has sides of (\d+) cm.*area/s);
  if (m) return +m[1] * +m[1];
  m = q.match(/straight line\. One angle is (\d+)°/);
  if (m) return 180 - +m[1];
  m = q.match(/Two angles of a triangle are (\d+)° and (\d+)°/);
  if (m) return 180 - +m[1] - +m[2];
  m = q.match(/triangle has a base of (\d+) cm and a height of (\d+) cm/);
  if (m) return (+m[1] * +m[2]) / 2;
  m = q.match(/parallelogram has a base of (\d+) cm and a height of (\d+) cm/);
  if (m) return +m[1] * +m[2];
  m = q.match(/trapezoid has parallel sides of (\d+) cm and (\d+) cm, and a height of (\d+) cm/);
  if (m) return ((+m[1] + +m[2]) * +m[3]) / 2;
  m = q.match(/box is (\d+) cm by (\d+) cm by (\d+) cm.*volume/s);
  if (m) return +m[1] * +m[2] * +m[3];
  m = q.match(/box is (\d+) cm by (\d+) cm by (\d+) cm.*surface area/s);
  if (m) { const [a, b, c] = [+m[1], +m[2], +m[3]]; return 2 * (a * b + b * c + a * c); }
  m = q.match(/cube has edges of (\d+) cm.*volume/s);
  if (m) return Number(m[1]) ** 3;
  m = q.match(/cube has edges of (\d+) cm.*surface area/s);
  if (m) return 6 * Number(m[1]) ** 2;
  m = q.match(/circle has a radius of (\d+) cm.*circumference/s);
  if (m) return Math.round(2 * +m[1] * 3.14 * 100) / 100;
  m = q.match(/circle has a radius of (\d+) cm.*area/s);
  if (m) return Math.round(Number(m[1]) ** 2 * 3.14 * 100) / 100;
  m = q.match(/circle has a diameter of (\d+) cm.*radius/s);
  if (m) return +m[1] / 2;
  m = q.match(/sector has a radius of (\d+) cm and a central angle of (\d+)°/);
  if (m) {
    const [rad, ang] = [+m[1], +m[2]];
    // 同じ書き出しで「面積」と「弧の長さ」の2種類があるので、後半を見て分ける
    if (/arc/.test(q)) return Math.round(2 * rad * 3.14 * (ang / 360) * 100) / 100;
    return Math.round(rad ** 2 * 3.14 * (ang / 360) * 100) / 100;
  }
  m = q.match(/cylinder has a radius of (\d+) cm and a height of (\d+) cm.*total surface area/s);
  if (m) { const [a, h] = [+m[1], +m[2]]; return Math.round((2 * a * a * 3.14 + 2 * a * 3.14 * h) * 100) / 100; }
  m = q.match(/cylinder has a radius of (\d+) cm and a height of (\d+) cm.*volume/s);
  if (m) return Math.round(Number(m[1]) ** 2 * 3.14 * +m[2] * 100) / 100;
  m = q.match(/pyramid has a square base with sides of (\d+) cm and a height of (\d+) cm/);
  if (m) return (Number(m[1]) ** 2 * +m[2]) / 3;
  m = q.match(/prism has a triangular base with a base of (\d+) cm and a height of (\d+) cm.*?(\d+) cm long/s);
  if (m) return ((+m[1] * +m[2]) / 2) * +m[3];

  m = q.match(/sum of the interior angles of a polygon with (\d+) sides/);
  if (m) return (+m[1] - 2) * 180;
  m = q.match(/one interior angle of a regular polygon with (\d+) sides/);
  if (m) return ((+m[1] - 2) * 180) / +m[1];
  m = q.match(/One angle is (\d+)°\. What is the co-interior/);
  if (m) return 180 - +m[1];

  m = q.match(/travels at (\d+) km\/h for (\d+) hours/);
  if (m) return +m[1] * +m[2];
  m = q.match(/covers (\d+) km in (\d+) hours/);
  if (m) return +m[1] / +m[2];
  m = q.match(/travel (\d+) km at (\d+) km\/h/);
  if (m) return +m[1] / +m[2];

  m = q.match(/Find the mean of these numbers: ([\d, ]+)\./);
  if (m) { const v = m[1].split(',').map(Number); return v.reduce((a, b) => a + b, 0) / v.length; }
  m = q.match(/mean of (\d+) numbers is (\d+)\. What is their total/);
  if (m) return +m[1] * +m[2];
  m = q.match(/Find the median of: ([\d, ]+)\./);
  if (m) {
    const v = m[1].split(',').map(Number).sort((a, b) => a - b);
    const h = v.length / 2;
    return v.length % 2 ? v[(v.length - 1) / 2] : (v[h - 1] + v[h]) / 2;
  }
  m = q.match(/Find the mode of: ([\d, ]+)\./);
  if (m) {
    const v = m[1].split(',').map(Number);
    const c = new Map();
    v.forEach((x) => c.set(x, (c.get(x) || 0) + 1));
    const top = Math.max(...c.values());
    const modes = [...c].filter(([, n]) => n === top);
    return modes.length === 1 ? modes[0][0] : NaN; // 最頻値が複数ある問題は不正
  }
  m = q.match(/Find the range of: ([\d, ]+)\./);
  if (m) { const v = m[1].split(',').map(Number); return Math.max(...v) - Math.min(...v); }

  m = q.match(/Solve for x: (\d+) : (\d+) = (\d+) : x/);
  if (m) return (+m[2] * +m[3]) / +m[1];

  m = q.match(/(\d+) red balls and (\d+) blue balls/);
  if (m) return +m[1] / (+m[1] + +m[2]);
  m = q.match(/class of (\d+) students, (\d+) chose tennis/);
  if (m) return Math.round((+m[2] / +m[1]) * 100) / 100;

  m = q.match(/y = (\d+) when x = (\d+)\. What is y when x = (\d+)\?/);
  if (m) {
    if (/inversely/.test(q)) return (+m[1] * +m[2]) / +m[3];
    return (+m[1] / +m[2]) * +m[3];
  }
  m = q.match(/point \((\d+), (\d+)\) is on the line y = ax/);
  if (m) return +m[2] / +m[1];

  m = q.match(/Round (\d+) to the nearest (ten|hundred|thousand)\./);
  if (m) { const u = { ten: 10, hundred: 100, thousand: 1000 }[m[2]]; return Math.round(+m[1] / u) * u; }
  // 位は**右から**数える。左から数えると桁数が変わったとたんにずれる
  m = q.match(/In the number (\d+), what digit is in the (ten thousands|thousands|hundreds|tens|ones) place\?/);
  if (m) {
    const back = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands'].indexOf(m[2]);
    const d = m[1];
    return back < d.length ? Number(d[d.length - 1 - back]) : 0;
  }

  // 数の並び。前3つの差／比が一定なら、その続きを出す
  m = q.match(/next number in the pattern: ([\d, ]+), \.\.\./);
  if (m) {
    const v = m[1].split(',').map(Number);
    const d = v[1] - v[0];
    if (v.every((x, k) => k === 0 || x - v[k - 1] === d)) return v[v.length - 1] + d;
    const k = v[1] / v[0];
    if (v.every((x, j) => j === 0 || x / v[j - 1] === k)) return v[v.length - 1] * k;
    return NaN;
  }

  m = q.match(/Point A is at \((\d+), (\d+)\)\. Point B is at \((\d+), (\d+)\)/);
  if (m) return Math.abs(+m[3] - +m[1]) + Math.abs(+m[4] - +m[2]);
  m = q.match(/corners at \((\d+), (\d+)\), \((\d+), (\d+)\), \((\d+), (\d+)\) and \((\d+), (\d+)\)/);
  if (m) return Math.abs(+m[3] - +m[1]) * Math.abs(+m[6] - +m[4]);
  m = q.match(/Point P is at \((\d+), (\d+)\)\. It moves up (\d+) units/);
  if (m) return +m[2] + +m[3];

  m = q.match(/How many square centimetres are in (\d+) square metres/); if (m) return +m[1] * 10000;
  m = q.match(/How many cubic centimetres are in (\d+) litres/); if (m) return +m[1] * 1000;
  m = q.match(/How many metres are in (\d+) kilometres/); if (m) return +m[1] * 1000;
  m = q.match(/How many seconds are in (\d+) minutes/); if (m) return +m[1] * 60;
  m = q.match(/How many square metres are in (\d+) hectares/); if (m) return +m[1] * 10000;
  m = q.match(/^(\d+) grams is how many kilograms/); if (m) return +m[1] / 1000;

  m = q.match(/How many prime factors does (\d+) have/);
  if (m) { let t = +m[1], c = 0; for (let d = 2; d * d <= t; d++) while (t % d === 0) { c++; t /= d; } if (t > 1) c++; return c; }
  m = q.match(/Bus A comes every (\d+) minutes and bus B every (\d+) minutes/);
  if (m) { const g = (a, b) => (b === 0 ? a : g(b, a % b)); return (+m[1] / g(+m[1], +m[2])) * +m[2]; }
  m = q.match(/(\d+) pencils and (\d+) erasers are shared equally/);
  if (m) { const g = (a, b) => (b === 0 ? a : g(b, a % b)); return g(+m[1], +m[2]); }

  m = q.match(/(\d+) people living in (\d+) km²/); if (m) return +m[1] / +m[2];
  m = q.match(/runs (\d+) km on 1 litre.*?on (\d+) litres/s); if (m) return +m[1] * +m[2];
  m = q.match(/^(\d+) apples cost (\d+) yen in total/); if (m) return +m[2] / +m[1];

  m = q.match(/Notebooks cost (\d+) yen each\. With (\d+) yen/);
  if (m) return Math.floor(+m[2] / +m[1]);
  m = q.match(/Solve: (-?−?)(\d+)x \+ (\d+) ([<>]) (-?−?\d+)\./);
  if (m) {
    const a = m[1] ? -+m[2] : +m[2];
    const rhs = Number(String(m[5]).replace('−', '-'));
    return (rhs - +m[3]) / a;
  }

  m = q.match(/has (\d+) more marbles than Sam\. Together they have (\d+) marbles/);
  if (m) return (+m[2] - +m[1]) / 2;
  m = q.match(/number multiplied by (\d+) and then increased by (\d+) gives (\d+)/);
  if (m) return (+m[3] - +m[2]) / +m[1];
  m = q.match(/rectangle is (\d+) cm longer than it is wide\. Its perimeter is (\d+) cm/);
  if (m) return (+m[2] / 2 - +m[1]) / 2;
  m = q.match(/is (\d+) years old\. In (\d+) years,.*?will be (\d+) times as old/s);
  if (m) return +m[3] * (+m[1] + +m[2]) - +m[2];

  return null;
}

/** かっこ・四則・^ だけの式を左から評価する（eval は使わない） */
function evalExpr(src) {
  const tokens = src.match(/\d+\.?\d*|[-+*/()^]/g);
  if (!tokens) return null;
  let i = 0;
  const peek = () => tokens[i];
  const expr = () => {
    let v = term();
    while (peek() === '+' || peek() === '-') { const op = tokens[i++]; const t = term(); v = op === '+' ? v + t : v - t; }
    return v;
  };
  const term = () => {
    let v = unary();
    while (peek() === '*' || peek() === '/') { const op = tokens[i++]; const t = unary(); v = op === '*' ? v * t : v / t; }
    return v;
  };
  // マイナスは累乗より弱い。−4² は −(4²) = −16 であって (−4)² = 16 ではない
  const unary = () => (peek() === '-' ? (i++, -unary()) : pow());
  const pow = () => {
    let v = atom();
    while (peek() === '^') { i++; v = v ** unary(); }
    return v;
  };
  const atom = () => {
    if (peek() === '(') { i++; const v = expr(); i++; return v; }
    return Number(tokens[i++]);
  };
  const v = expr();
  return i === tokens.length && Number.isFinite(v) ? v : null;
}

/**
 * 図の点検。
 *
 * 図形の分野なのに図が無い問題を落とす。ただし理由があって付けないものは
 * ここに書き出しておく（黙って抜けているのか、決めて外したのかを区別するため）。
 */
// 図が**必ず要る**分野。図が無ければ落とす
/**
 * 英語の言い回しの点検。
 *
 * 解くのは日本語話者の子で、**算数でなく英語でつまずかせないこと**が大事。
 * ここに挙げるのは「英語圏の教室では通じるが、日本の子には別の意味に読める」言い回し。
 *
 * つづりは **米式に統一**する。受けるのがアメリカ式の学校（EIS）だから。
 * meters / liters / color / candy。英式（metres / litres / colour）は使わない。
 */
const BAD_WORDING = [
  { re: /\blots of\b/i, why: '「たくさんの」と読まれる。「◯ tenths」「◯ groups of」にする' },
  { re: /\bof a number\b/i, why: '何を指すか曖昧。具体的に書く' }
];
/** ひらがな・カタカナ・漢字。解説以外に出てきたら落とす */
const JA = /[\u3040-\u30ff\u4e00-\u9faf]/;

const BR_SPELLING = [
  { re: /\bmetres?\b/i, use: 'meters' },
  { re: /\blitres?\b/i, use: 'liters' },
  { re: /\bkilometres?\b/i, use: 'kilometers' },
  { re: /\bcentimetres?\b/i, use: 'centimeters' },
  { re: /\bmillimetres?\b/i, use: 'millimeters' },
  { re: /\bmillilitres?\b/i, use: 'milliliters' },
  { re: /\bcolours?\b/i, use: 'color' },
  { re: /\bsweets\b/i, use: 'candy / candies' },
  { re: /\bpetrol\b/i, use: 'gas' },
  { re: /\btrapezium\b/i, use: 'trapezoid' },
  { re: /\bmaths\b/i, use: 'math' }
];

const FIGURE_REQUIRED = ['平面図形', '円', '立体図形', '座標'];
// 図が**あってもよい**分野。ぼうグラフは「データの活用」だが図がないと読めない
const FIGURE_ALLOWED = [...FIGURE_REQUIRED, 'データの活用'];
const NO_FIGURE_OK = {
  m99: '負の座標。いまの描画が第1象限しか描けない',
  m117: '一般の四角形の話。図を出すと「この四角形の」と読めてしまう'
};

/** js/math-choices.js を読み込む（4択が作れるかを点検するため） */
function loadChoices() {
  const src = readFileSync(new URL('../js/math-choices.js', import.meta.url), 'utf8');
  return new Function(`${src}; return MathChoices;`)();
}

/** js/math-figure.js が実際に描ける形の一覧を読み出す */
function figureKinds() {
  const src = readFileSync(new URL('../js/math-figure.js', import.meta.url), 'utf8');
  return new Function(`${src}; return MathFigure.kinds;`)();
}

export function audit(list) {
  errors.length = 0;
  warns.length = 0;
  const seenQ = new Map();
  const seenId = new Set();
  const kinds = figureKinds();
  const MC = loadChoices();
  let choiceless = 0;
  let checked = 0;
  let figured = 0;

  for (const p of list) {
    if (p.id) {
      if (seenId.has(p.id)) fail(p, 'ID が重複');
      seenId.add(p.id);
    }
    if (!p.question || !/[A-Za-z]/.test(p.question)) fail(p, '問題文が英語でない');
    if (p.answer === undefined || String(p.answer).trim() === '') fail(p, '答えが空');
    if (!p.explanation) fail(p, '解説が空');
    else if (!/[ぁ-んァ-ヶ一-龥]/.test(p.explanation)) fail(p, '解説に日本語がない');
    if (!p.category) fail(p, 'カテゴリが空');
    if (![1, 2, 3, 4, 5].includes(p.level)) fail(p, `レベルが不正: ${p.level}`);

    // 解説に「undefined」「NaN」「Infinity」が混じっていないか（テンプレートの事故）
    if (/undefined|NaN|Infinity/.test(`${p.question} ${p.explanation} ${p.answer}`)) fail(p, '生成の事故（undefined/NaN）');

    // 答えの表記。小数は3桁以上続かないこと（採点で揉める）
    const numeric = toNumber(p.answer);
    // 0.375 のように割り切れる3桁はよい。4桁以上は打ち切った疑いが強いので落とす
    if (Number.isFinite(numeric) && String(p.answer).includes('.')) {
      const dec = String(p.answer).split('.')[1];
      if (dec.length > 3) fail(p, `小数が ${dec.length} 桁ある（採点が割れる）`);
      else if (dec.length === 3) warn(p, '小数3桁。割り切れているか確かめること');
    }

    // 問題文が同じものは出題が単調になるので落とす
    const key = p.question.trim();
    if (seenQ.has(key)) fail(p, `問題文が ${seenQ.get(key)} と重複`);
    else seenQ.set(key, p.id || key.slice(0, 20));

    // 図
    if (p.figure) {
      figured++;
      if (!kinds.includes(p.figure.kind)) fail(p, `描けない図の形: ${p.figure.kind}`);
      if (!FIGURE_ALLOWED.includes(p.category)) warn(p, `図の付く想定でない分野に図がある（${p.category}）`);
    } else if (FIGURE_REQUIRED.includes(p.category) && !NO_FIGURE_OK[p.id]) {
      fail(p, '図形の分野なのに図が無い');
    }
    // グラフを見せずに「グラフによると」と聞く問題は解きようがない
    if (/bar chart|graph shows/i.test(p.question) && !p.figure) fail(p, 'グラフの問題なのに図が無い');

    // 4択。本番（MAP Growth）が4択なので、選択肢が作れることを確かめる
    const c = MC.build(p);
    if (!c) {
      choiceless++;
      warn(p, '4択が作れない（誤答が3つそろわない）。自由入力で出る');
    } else {
      if (new Set(c.choices).size !== 4) fail(p, '選択肢に重複がある');
      if (c.choices[c.answer] !== String(p.answer).trim()) fail(p, '正解の位置がずれている');
      // 誤答が正解と数として同じだと、2つ正解がある問題になってしまう
      const dup = c.choices.filter((x, i) => i !== c.answer && MC.toNumber(x) === MC.toNumber(String(p.answer).trim()));
      if (dup.length) fail(p, `誤答が正解と同じ値: ${dup.join(', ')}`);
    }

    // 英語の言い回し
    for (const b of BAD_WORDING) if (b.re.test(p.question)) fail(p, `読み違えられる言い回し: ${b.why}`);
    for (const u of BR_SPELLING) if (u.re.test(p.question)) fail(p, `つづりが米式でない（${u.use} に）`);

    // **子が読む場所に日本語を混ぜない。**解説だけが日本語で、それ以外は英語。
    // 単位は答えの横と4択にそのまま出るし、図のラベルは画面に描かれる。
    // 「A circle has a diameter of 8 cm」の図に「半径 ?」と出ていたのを実際に踏んだ
    if (JA.test(p.question)) fail(p, '問題文に日本語が混ざっている');
    if (JA.test(p.unit || '')) fail(p, `単位に日本語が混ざっている（${p.unit}）`);
    if (p.figure && JA.test(JSON.stringify(p.figure))) fail(p, `図の指定に日本語が混ざっている（${JSON.stringify(p.figure)}）`);

    // 検算
    const expected = recompute(p.question);
    if (expected === null) continue;
    checked++;
    if (!Number.isFinite(expected)) { fail(p, '検算で答えが定まらない'); continue; }
    if (!Number.isFinite(numeric)) { fail(p, `答えが数として読めない: ${p.answer}`); continue; }
    if (!near(expected, numeric)) fail(p, `答えが合わない（検算 ${expected} / データ ${p.answer}）`);
  }

  // errors/warns も返す。検査そのものが効いているかを外から確かめられるように
  return { checked, figured, choiceless, total: list.length, errors: [...errors], warns: [...warns] };
}

function report(list, label) {
  const { checked, figured, choiceless, total } = audit(list);
  console.log(`\n== ${label} ==`);
  console.log(`件数 ${total}／検算できた ${checked} 問（${Math.round((checked / total) * 100)}%）／図あり ${figured} 問／4択が作れない ${choiceless} 問`);
  const byLevel = {};
  const byCat = {};
  list.forEach((p) => { byLevel[p.level] = (byLevel[p.level] || 0) + 1; byCat[p.category] = (byCat[p.category] || 0) + 1; });
  console.log('レベル別', byLevel);
  console.log('分野別', byCat);
  if (warns.length) { console.log(`\n注意 ${warns.length} 件`); warns.slice(0, 20).forEach((w) => console.log('  ' + w)); }
  if (errors.length) {
    console.log(`\n❌ エラー ${errors.length} 件`);
    errors.slice(0, 60).forEach((e) => console.log('  ' + e));
    process.exitCode = 1;
  } else {
    console.log('\n✅ エラー 0 件');
  }
}

if (process.argv[1] && process.argv[1].endsWith('audit-math.mjs')) {
  if (process.argv.includes('--gen')) {
    const mods = await Promise.all([
      import('./math-g3.mjs'), import('./math-g4.mjs'),
      import('./math-g5.mjs'), import('./math-g6.mjs'), import('./math-g7.mjs')
    ]);
    report(mods.flatMap((m) => m.build()), 'ジェネレータ出力');
  } else {
    const src = readFileSync(new URL('../js/math-data.js', import.meta.url), 'utf8');
    const body = src.slice(src.indexOf('['), src.lastIndexOf(']') + 1);
    report(new Function('return ' + body)(), 'js/math-data.js');
  }
}
