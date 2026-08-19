/**
 * 算数の問題に4つの選択肢を作る。
 *
 * 本番（MAP Growth）は4択なので、練習も4択で揃える。
 * 自由入力と4択は**別の技能**で、4択には「選択肢から絞る」「明らかに違うものを消す」
 * という戦略がある。そこを練習しないまま本番に行くことになる。
 *
 * **でたらめな数を並べない。** 選択肢は「実際にやりがちな間違い」にする。
 *
 *   三角形の面積（底辺8・高さ6）→ 正解 24 と、÷2 を忘れた 48
 *   2 km は何 m               → 正解 2000 と、桁を1つ間違えた 200
 *   −4²                       → 正解 −16 と、符号を取り違えた 16
 *
 * でたらめな数だと「明らかに違うもの」がすぐ消せてしまい、練習にならない。
 * 本番で実際に引っかかる誤答を並べてこそ意味がある。
 *
 * 誤答は2通りの出どころがある。
 *   ① 問題データの `wrong`  … 生成器が「この単元ならこう間違える」を知っている場合
 *   ② 答えの形から作る       … ①が無い問題のための受け皿
 *
 * 選択肢の並びは **ID から決める**（毎回同じ）。解くたびに並びが変わると、
 * 「前は B だった」という覚え方ができてしまい、記録も比べられなくなる。
 */
const MathChoices = (() => {
  /** ID から決まる乱数。同じ問題なら毎回同じ並びになる */
  function seedFrom(id) {
    let h = 2166136261;
    for (const ch of String(id)) {
      h ^= ch.charCodeAt(0);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /** 答えの文字列を数にする。app.js の toNumber と同じ判定 */
  function toNumber(text) {
    const t = String(text).trim().replace(/[,\s]/g, '').replace(/^\+/, '');
    if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t);
    const m = t.match(/^(-?\d+)\/(\d+)$/);
    if (m) return Number(m[1]) / Number(m[2]);
    return NaN;
  }

  /** 浮動小数の誤差を落として文字列に戻す */
  const clean = (v) => String(Math.round(v * 1e6) / 1e6);

  /** 小数の桁数 */
  const decimals = (s) => (String(s).split('.')[1] || '').length;

  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

  /**
   * 答えの形から「やりがちな間違い」を作る。
   * 前に来るものほどよくある間違いなので、優先して選ぶ。
   */
  function derive(answer, signedTopic) {
    const s = String(answer).trim();

    // 分数 a/b
    const frac = s.match(/^(-?\d+)\/(\d+)$/);
    if (frac) {
      const [a, b] = [Number(frac[1]), Number(frac[2])];
      // 約分して返す。ただし 15/1 のように分母が1になるものは分数として不自然で、
      // 「これは違う」と考えるまでもなく消せてしまうので誤答にしない
      const red = (n, d) => {
        const g = gcd(Math.abs(n), Math.abs(d)) || 1;
        const [nn, dd] = [n / g, d / g];
        return dd === 1 || nn === 0 ? null : `${nn}/${dd}`;
      };
      return [
        // 分子と分母を取り違えた。ただし 15/1 のような形は分数として不自然で、
        // 考えるまでもなく消せてしまうので出さない
        b !== 0 && Math.abs(a) > 1 ? `${b}/${Math.abs(a)}` : null,
        red(a + 1, b),                                     // 分子を1つずらした
        b > 1 ? red(a, b + 1) : null,                      // 分母を1つずらした
        red(a * 2, b),
        a > 1 ? red(a - 1, b) : null,
        red(a, b * 2)                                      // 約分し忘れの逆
      ];
    }

    // 比 a:b
    const ratio = s.match(/^(\d+):(\d+)$/);
    if (ratio) {
      const [a, b] = [Number(ratio[1]), Number(ratio[2])];
      return [`${b}:${a}`, `${a + 1}:${b}`, `${a}:${b + 1}`, `${a * 2}:${b}`, `${a}:${b * 2}`];
    }

    const v = toNumber(s);
    if (!Number.isFinite(v) || v === 0) return [];

    const d = decimals(s);
    if (d > 0) {
      // 小数。**小数点の位置を間違える**のが群を抜いて多い
      return [
        clean(v * 10), clean(v / 10),
        clean(v * 2), clean(v / 2),
        clean(Math.round((v + 0.1) * 1e6) / 1e6),
        clean(Math.round((v - 0.1) * 1e6) / 1e6)
      ];
    }

    // 整数。**どの間違いがありそうかは答えの性質で変わる**
    const sign = clean(-v);
    const scale = [clean(v * 10), clean(v / 10)];      // 桁を間違えた（単位換算・小数）
    const half = [clean(v * 2), v % 2 === 0 ? clean(v / 2) : null];  // ÷2 を忘れた（面積）
    const near = [clean(v + 1), clean(v - 1), clean(v + 2), clean(v - 2)]; // 数え間違い

    // 正負の数を扱う問題なら、符号ミスが群を抜いて多い。まずそれを出す
    if (signedTopic) return [sign, ...near, ...half, ...scale];
    // 小さい数（個数・角度の一部・代表値）で「10倍」は起こりにくい。近い数を先に
    if (Math.abs(v) <= 20) return [...half, ...near, ...scale, sign];
    return [...half, ...scale, ...near, sign];
  }

  /**
   * 4つの選択肢を作る。
   * 返すのは { choices: [文字列4つ], answer: 正解の位置 }。
   * 選択肢が作れないときは null（呼び出し側は自由入力に落とす）
   */
  function build(problem) {
    const correct = String(problem.answer).trim();
    const correctNum = toNumber(correct);
    const r = rng(seedFrom(problem.id));
    // 負の数が出てくる問題か。問題文にマイナスがあるか、答えが負なら
    const signedTopic = /[−-]\s*\d/.test(problem.question) || correctNum < 0;

    const seen = new Set([correct]);
    const wrongs = [];
    const add = (cand) => {
      if (cand === null || cand === undefined) return;
      const c = String(cand).trim();
      if (!c || seen.has(c)) return;
      // 見た目が違っても数として同じなら誤答にならない（3/4 と 0.75 など）
      const n = toNumber(c);
      if (Number.isFinite(n) && Number.isFinite(correctNum) && Math.abs(n - correctNum) < 1e-9) return;
      // 負の選択肢。個数や人数の問題では考えるまでもなく消せてしまうので出さない。
      // ただし正負の数を扱う問題では **符号ミスこそが本命の誤答**なので通す
      if (Number.isFinite(n) && n < 0 && correctNum >= 0 && !signedTopic) return;
      seen.add(c);
      wrongs.push(c);
    };

    // ① 生成器が知っている「この単元でのやりがちな間違い」を先に使う
    (problem.wrong || []).forEach(add);
    // ② 足りないぶんを答えの形から補う
    derive(correct, signedTopic).forEach(add);

    if (wrongs.length < 3) return null;

    // 誤答は前にあるものほどよくある間違い。上から3つ取る
    const picked = wrongs.slice(0, 3);
    const all = [correct, ...picked];

    // ID から決まる並びに混ぜる（毎回同じ並び）
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    return { choices: all, answer: all.indexOf(correct) };
  }

  return { build, toNumber };
})();
