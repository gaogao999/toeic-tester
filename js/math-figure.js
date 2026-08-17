/**
 * 算数の図を描く。
 *
 * 問題データは SVG そのものではなく **形の指定だけ**を持つ。
 *   { kind: 'rect', w: 8, h: 5, unit: 'cm' }
 * これを受け取って SVG の文字列を返すのがこのファイル。
 *
 * なぜ SVG を直に持たせないか:
 *   - データが何倍にも膨らむ（159個ぶんの SVG を math-data.js に置くと 60KB 超える）
 *   - 色をテーマに追従させられない。SVG 側は CSS 変数を参照するだけにしておき、
 *     明暗の切り替えは css/style.css 一箇所で面倒を見る
 *   - 描き方を直したくなったとき、データを作り直さずに済む
 *
 * 図は **本番の入試に形式を寄せるため**に入れている。文章だけだと公式を覚えているかしか
 * 測れず、図を読む力が別に必要になる。
 *
 * 縮尺について: 辺の比はできるだけ実物どおりに描くが、細長すぎるとラベルが載らないので
 * 3.2:1 で頭打ちにする（教科書の図と同じ扱い。長さは必ず数字で書いてあるので、
 * 見た目の比だけで解かせることはしていない）。
 */
const MathFigure = (() => {
  // 図の論理サイズ。viewBox なので実際の表示幅は CSS が決める
  const W = 320;
  const H = 200;
  const PAD = 30; // ラベルを置く余白
  const MAX_RATIO = 3.2; // 辺の比の頭打ち

  const num = (v) => Math.round(v * 100) / 100;
  const esc = (s) => String(s).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));

  // ---------- SVG の部品 ----------

  const line = (x1, y1, x2, y2, cls = 'f-edge') =>
    `<line x1="${num(x1)}" y1="${num(y1)}" x2="${num(x2)}" y2="${num(y2)}" class="${cls}"/>`;

  const poly = (pts, cls = 'f-face') =>
    `<polygon points="${pts.map(([x, y]) => `${num(x)},${num(y)}`).join(' ')}" class="${cls}"/>`;

  const path = (d, cls = 'f-face') => `<path d="${d}" class="${cls}"/>`;

  const circleEl = (cx, cy, r, cls = 'f-face') =>
    `<circle cx="${num(cx)}" cy="${num(cy)}" r="${num(r)}" class="${cls}"/>`;

  const ellipse = (cx, cy, rx, ry, cls = 'f-face') =>
    `<ellipse cx="${num(cx)}" cy="${num(cy)}" rx="${num(rx)}" ry="${num(ry)}" class="${cls}"/>`;

  const label = (x, y, str, cls = 'f-label', anchor = 'middle') =>
    `<text x="${num(x)}" y="${num(y)}" text-anchor="${anchor}" class="${cls}">${esc(str)}</text>`;

  /** 直角のしるし。垂線の足に置く小さな四角 */
  function rightAngle(x, y, dx, dy, size = 9) {
    const ux = Math.sign(dx) * size;
    const uy = Math.sign(dy) * size;
    return poly(
      [[x, y], [x + ux, y], [x + ux, y + uy], [x, y + uy]],
      'f-right'
    );
  }

  /**
   * 角の弧。cx,cy を頂点に、from から to（度・数学の向き＝反時計回り）まで。
   *
   * sweep-flag は **0**。SVG は y が下向きなので、数学の反時計回りは
   * SVG から見ると時計の逆、つまり sweep 0 になる。1 にすると弧が
   * 反対側（外角のほう）に回ってしまう。
   */
  function arc(cx, cy, r, from, to, cls = 'f-arc') {
    const rad = (d) => (d * Math.PI) / 180;
    const p = (d) => [cx + r * Math.cos(rad(d)), cy - r * Math.sin(rad(d))];
    const [x1, y1] = p(from);
    const [x2, y2] = p(to);
    const large = Math.abs(to - from) > 180 ? 1 : 0;
    return path(`M ${num(x1)} ${num(y1)} A ${num(r)} ${num(r)} 0 ${large} 0 ${num(x2)} ${num(y2)}`, cls);
  }

  /** 角のラベルを置く位置（頂点から二等分線の方向に少し出したところ） */
  function anglePos(cx, cy, r, from, to) {
    const mid = ((from + to) / 2) * (Math.PI / 180);
    return [cx + r * Math.cos(mid), cy - r * Math.sin(mid)];
  }

  const svg = (body) =>
    `<svg viewBox="0 0 ${W} ${H}" role="img" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;

  /**
   * 実寸 (a, b) を、細長すぎない見た目の大きさに直す。
   * 比は保つが MAX_RATIO を超える分だけ詰める
   */
  function fit(a, b, boxW, boxH) {
    let ratio = a / b;
    if (ratio > MAX_RATIO) ratio = MAX_RATIO;
    if (ratio < 1 / MAX_RATIO) ratio = 1 / MAX_RATIO;
    let w = boxW;
    let h = w / ratio;
    if (h > boxH) {
      h = boxH;
      w = h * ratio;
    }
    return [w, h];
  }

  const withUnit = (v, unit) => (unit ? `${v} ${unit}` : String(v));

  // ---------- 平面図形 ----------

  function rect(f) {
    const [w, h] = fit(f.w, f.h, W - 2 * PAD - 30, H - 2 * PAD - 20);
    const x = (W - w) / 2;
    const y = (H - h) / 2;
    // 辺の長さを問う問題では、辺に数字を書いてしまうと答えが図に出てしまう。
    // その場合は「?」にして、代わりに面積を中に書く
    const askSide = Boolean(f.ask);
    const sideLabel = (v) => (askSide ? '?' : withUnit(v, f.unit));
    const sideCls = askSide ? 'f-ask' : 'f-label';
    return svg(
      poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]]) +
        label(x + w / 2, y - 10, sideLabel(f.w), sideCls) +
        label(x + w + 10, y + h / 2 + 4, sideLabel(f.h), sideCls, 'start') +
        (f.area ? label(x + w / 2, y + h / 2 + 5, `${f.area} ${f.unit || ''}²`, 'f-inner') : '')
    );
  }

  function triangle(f) {
    const [w, h] = fit(f.base, f.height, W - 2 * PAD - 30, H - 2 * PAD - 20);
    const x = (W - w) / 2;
    const y = (H - h) / 2;
    // 頂点は底辺の内側に置く（高さの垂線が底辺の上に落ちて、直角のしるしが描ける）
    const apex = x + w * 0.62;
    return svg(
      poly([[x, y + h], [x + w, y + h], [apex, y]]) +
        line(apex, y, apex, y + h, 'f-dash') +
        rightAngle(apex, y + h, -1, -1) +
        label(x + w / 2, y + h + 18, withUnit(f.base, f.unit)) +
        label(apex + 8, y + h / 2, f.askHeight ? '?' : withUnit(f.height, f.unit), f.askHeight ? 'f-ask' : 'f-label', 'start') +
        (f.area ? label(x + w * 0.42, y + h * 0.72, `${f.area} ${f.unit || ''}²`, 'f-inner') : '')
    );
  }

  /**
   * 二等辺三角形。**等しい2辺に同じしるし（|）を入れる。**
   * 「等しい辺が2本ある」と気づけるかがこの問題のねらいなので、
   * 長さを書くだけでなく、しるしでも見せる
   */
  function isoTriangle(f) {
    const base = f.base;
    const side = f.side;
    // 底辺の半分と斜辺から高さを出す。実際の形どおりに描く
    const h = Math.sqrt(Math.max(side * side - (base / 2) ** 2, 1));
    const [w, hh] = fit(base, h, W - 2 * PAD - 40, H - 2 * PAD - 22);
    const cx = W / 2;
    const y = (H - hh) / 2;
    const bl = [cx - w / 2, y + hh];
    const br = [cx + w / 2, y + hh];
    const apex = [cx, y];

    // 辺の中点に、辺と直交する短い線を引く
    const tick = (p, q) => {
      const mx = (p[0] + q[0]) / 2;
      const my = (p[1] + q[1]) / 2;
      const dx = q[0] - p[0];
      const dy = q[1] - p[1];
      const len = Math.hypot(dx, dy) || 1;
      const nx = (-dy / len) * 5;
      const ny = (dx / len) * 5;
      return line(mx - nx, my - ny, mx + nx, my + ny, 'f-edge');
    };

    return svg(
      poly([bl, br, apex]) +
        tick(bl, apex) +
        tick(br, apex) +
        label(bl[0] - 6, y + hh / 2, withUnit(side, f.unit), 'f-label', 'end') +
        label(br[0] + 6, y + hh / 2, withUnit(side, f.unit), 'f-label', 'start') +
        label(cx, y + hh + 18, withUnit(base, f.unit))
    );
  }

  function parallelogram(f) {
    const [w, h] = fit(f.base, f.height, W - 2 * PAD - 50, H - 2 * PAD - 20);
    const slant = Math.min(34, w * 0.28);
    const x = (W - w - slant) / 2;
    const y = (H - h) / 2;
    return svg(
      poly([[x, y + h], [x + w, y + h], [x + w + slant, y], [x + slant, y]]) +
        line(x + slant, y, x + slant, y + h, 'f-dash') +
        rightAngle(x + slant, y + h, 1, -1) +
        label(x + w / 2, y + h + 18, withUnit(f.base, f.unit)) +
        label(x + slant + 8, y + h / 2, withUnit(f.height, f.unit), 'f-label', 'start')
    );
  }

  function trapezoid(f) {
    const big = Math.max(f.top, f.bottom);
    const [w, h] = fit(big, f.height, W - 2 * PAD - 40, H - 2 * PAD - 20);
    const topW = (f.top / big) * w;
    const botW = (f.bottom / big) * w;
    const y = (H - h) / 2;
    const cx = W / 2;
    const tl = cx - topW / 2;
    const bl = cx - botW / 2;
    return svg(
      poly([[bl, y + h], [bl + botW, y + h], [tl + topW, y], [tl, y]]) +
        line(cx, y, cx, y + h, 'f-dash') +
        rightAngle(cx, y + h, 1, -1) +
        label(cx, y - 9, withUnit(f.top, f.unit)) +
        label(cx, y + h + 18, withUnit(f.bottom, f.unit)) +
        label(cx + 8, y + h / 2, withUnit(f.height, f.unit), 'f-label', 'start')
    );
  }

  function rhombus(f) {
    const [w, h] = fit(f.d1, f.d2, W - 2 * PAD - 40, H - 2 * PAD - 20);
    const cx = W / 2;
    const cy = H / 2;
    return svg(
      poly([[cx - w / 2, cy], [cx, cy - h / 2], [cx + w / 2, cy], [cx, cy + h / 2]]) +
        line(cx - w / 2, cy, cx + w / 2, cy, 'f-dash') +
        line(cx, cy - h / 2, cx, cy + h / 2, 'f-dash') +
        label(cx - w / 4, cy - 7, withUnit(f.d1, f.unit)) +
        label(cx + 8, cy + h / 4, withUnit(f.d2, f.unit), 'f-label', 'start')
    );
  }

  /** 一直線上の2つの角 */
  function straightLine(f) {
    const cx = W / 2;
    const cy = H * 0.68;
    const L = 120;
    const rad = (f.a * Math.PI) / 180;
    const rx = cx + L * Math.cos(rad);
    const ry = cy - L * Math.sin(rad);
    const [lx, ly] = anglePos(cx, cy, 46, 0, f.a);
    const [ux, uy] = anglePos(cx, cy, 46, f.a, 180);
    return svg(
      line(cx - L, cy, cx + L, cy) +
        line(cx, cy, rx, ry) +
        arc(cx, cy, 34, 0, f.a) +
        arc(cx, cy, 34, f.a, 180, 'f-arc f-arc-ask') +
        label(lx, ly + 4, `${f.a}°`) +
        label(ux, uy + 4, '?', 'f-ask')
    );
  }

  /** 三角形の内角。2つ与えて残り1つを問う */
  function triangleAngles(f) {
    const rad = (d) => (d * Math.PI) / 180;
    const L = 210;
    const ta = Math.tan(rad(f.a));
    const tb = Math.tan(rad(f.b));
    const px = (L * tb) / (ta + tb);
    const py = px * ta;
    const scale = Math.min(1, (H - 2 * PAD - 14) / py);
    const bw = L * scale;
    const bx = (W - bw) / 2;
    const by = H - PAD - 6;
    const cxp = bx + px * scale;
    const cyp = by - py * scale;
    // 頂点Cの角。C から A・B を見た向きのあいだに弧を引く。
    // 画面の y は下向きなので、数学の向きに直すため縦の差は符号を返す
    const dirTo = (px, py) => (Math.atan2(cyp - py, px - cxp) * 180) / Math.PI;
    const a1 = dirTo(bx, by);
    const a2 = dirTo(bx + bw, by);
    const [from, to] = [Math.min(a1, a2), Math.max(a1, a2)];
    const [lx, ly] = anglePos(cxp, cyp, 32, from, to);
    return svg(
      poly([[bx, by], [bx + bw, by], [cxp, cyp]]) +
        arc(bx, by, 26, 0, f.a) +
        arc(bx + bw, by, 26, 180 - f.b, 180) +
        arc(cxp, cyp, 22, from, to, 'f-arc f-arc-ask') +
        label(bx + 36, by - 9, `${f.a}°`) +
        label(bx + bw - 36, by - 9, `${f.b}°`) +
        label(lx, ly + 4, '?', 'f-ask')
    );
  }

  /** 平行線と同側内角 */
  function parallelLines(f) {
    const y1 = 58;
    const y2 = 148;
    const rad = (f.a * Math.PI) / 180;
    // 上の交点で右下向きに a° の内角ができるよう、傾きを角度から出す
    const dx = (y2 - y1) / Math.tan(rad);
    const x1 = W / 2 - dx / 2;
    const x2 = W / 2 + dx / 2;
    const ext = 46;
    const ux = x1 - (ext / (y2 - y1)) * dx;
    const dxe = x2 + (ext / (y2 - y1)) * dx;
    // 同側内角は「2本の平行線にはさまれた側」で「横断線の同じ側」にある2つ。
    // 上の交点では線の右へ伸びる向き(0°)から斜線が下る向き(−a°)まで、
    // 下の交点では 0° から斜線が上る向き(180−a°)まで。どちらも内側を向く
    const [ax, ay] = anglePos(x1, y1, 40, -f.a, 0);
    const [qx, qy] = anglePos(x2, y2, 44, 0, 180 - f.a);
    return svg(
      line(20, y1, W - 20, y1) +
        line(20, y2, W - 20, y2) +
        line(ux, y1 - ext, dxe, y2 + ext, 'f-edge') +
        arc(x1, y1, 28, -f.a, 0) +
        arc(x2, y2, 28, 0, 180 - f.a, 'f-arc f-arc-ask') +
        label(ax, ay + 4, `${f.a}°`) +
        label(qx, qy + 4, '?', 'f-ask') +
        label(W - 24, y1 - 7, '∥', 'f-mini', 'end') +
        label(W - 24, y2 - 7, '∥', 'f-mini', 'end')
    );
  }

  /** 正多角形。regular が真なら1つの内角に印を付ける */
  function polygon(f) {
    const n = f.n;
    const r = 68;
    const cx = W / 2;
    const cy = H / 2 + 4;
    const start = n % 2 === 0 ? Math.PI / n : Math.PI / 2;
    const pts = [];
    for (let i = 0; i < n; i++) {
      const t = start + (i * 2 * Math.PI) / n;
      pts.push([cx + r * Math.cos(t), cy - r * Math.sin(t)]);
    }
    const marks = f.regular
      ? (() => {
          // 頂点0の内角に弧を引く
          const [vx, vy] = pts[0];
          const to = (p) => (Math.atan2(vy - p[1], p[0] - vx) * 180) / Math.PI;
          const a1 = to(pts[n - 1]);
          const a2 = to(pts[1]);
          const [lx, ly] = anglePos(vx, vy, 34, Math.min(a1, a2), Math.max(a1, a2));
          return arc(vx, vy, 22, Math.min(a1, a2), Math.max(a1, a2), 'f-arc f-arc-ask') + label(lx, ly + 4, '?', 'f-ask');
        })()
      : label(cx, cy + 5, '?', 'f-ask');
    return svg(poly(pts) + marks + label(cx, H - 8, `${n} sides`, 'f-mini'));
  }

  function circle(f) {
    const r = 62;
    const cx = W / 2;
    const cy = H / 2;
    const show = f.show || 'r';
    let mark = '';
    if (show === 'd') {
      mark =
        line(cx - r, cy, cx + r, cy, 'f-dash') +
        label(cx, cy - 8, withUnit(f.d, f.unit)) +
        (f.ask === 'r' ? label(cx + r / 2, cy + 20, '半径 ?', 'f-ask') : '');
    } else {
      mark = line(cx, cy, cx + r, cy, 'f-dash') + label(cx + r / 2, cy - 8, withUnit(f.r, f.unit));
    }
    return svg(circleEl(cx, cy, r) + circleEl(cx, cy, 2.5, 'f-dot') + mark);
  }

  function sector(f) {
    const r = 82;
    const cx = W / 2 - 20;
    const cy = H / 2 + 28;
    const rad = (d) => (d * Math.PI) / 180;
    const ex = cx + r * Math.cos(rad(f.angle));
    const ey = cy - r * Math.sin(rad(f.angle));
    const large = f.angle > 180 ? 1 : 0;
    const [lx, ly] = anglePos(cx, cy, 40, 0, f.angle);
    return svg(
      path(`M ${num(cx)} ${num(cy)} L ${num(cx + r)} ${num(cy)} A ${r} ${r} 0 ${large} 0 ${num(ex)} ${num(ey)} Z`) +
        arc(cx, cy, 26, 0, f.angle, 'f-arc f-arc-ask') +
        label(lx + 4, ly + 4, `${f.angle}°`) +
        label(cx + r / 2, cy + 16, withUnit(f.r, f.unit))
    );
  }

  /** x 軸（y = 0）の画面上の位置。負の座標があると原点が下端より上に来る */
  const zeroYOf = (loY, oy, sy) => oy + loY * sy;

  /** 座標平面。点を打ってラベルを付ける */
  function points(f) {
    const xs = f.pts.map((p) => p[0]);
    const ys = f.pts.map((p) => p[1]);
    const maxX = Math.max(...xs, 1);
    const maxY = Math.max(...ys, 1);
    const minY = Math.min(...ys, 0);
    const ox = 34;
    const oy = H - 30;
    const sx = (W - ox - 26) / (maxX + 1);
    const sy = (oy - 22) / (maxY - Math.min(0, minY) + 1);
    const at = (p) => [ox + p[0] * sx, oy - (p[1] - Math.min(0, minY)) * sy];
    const zeroY = zeroYOf(Math.min(0, minY), oy, sy);

    // 目盛りの数字。全部書くと潰れるので、5目盛りごと（狭ければ2目盛りごと）に間引く
    const stepX = sx < 12 ? 5 : sx < 24 ? 2 : 1;
    const stepY = sy < 12 ? 5 : sy < 24 ? 2 : 1;
    const loY = Math.min(0, minY);

    let grid = '';
    let ticks = '';
    for (let i = 1; i <= maxX + 1; i++) {
      grid += line(ox + i * sx, 18, ox + i * sx, oy, 'f-grid');
      if (i % stepX === 0) ticks += label(ox + i * sx, zeroYOf(loY, oy, sy) + 13, String(i), 'f-tick');
    }
    for (let j = 1; j <= maxY - loY + 1; j++) {
      grid += line(ox, oy - j * sy, W - 14, oy - j * sy, 'f-grid');
      const v = j + loY;
      if (v !== 0 && j % stepY === 0) ticks += label(ox - 6, oy - j * sy + 4, String(v), 'f-tick', 'end');
    }

    const shape = f.closed ? poly(f.pts.map(at), 'f-face') : '';
    const dots = f.pts
      .map((p, i) => {
        const [x, y] = at(p);
        return (
          circleEl(x, y, 3.6, 'f-dot') +
          label(x + 7, y - 8, f.labels && f.labels[i] ? `${f.labels[i]}(${p[0]}, ${p[1]})` : `(${p[0]}, ${p[1]})`, 'f-mini', 'start')
        );
      })
      .join('');

    return svg(
      grid +
        line(ox, 14, ox, oy + 8, 'f-axis') +
        line(ox - 8, zeroY, W - 12, zeroY, 'f-axis') +
        ticks +
        label(ox - 6, zeroY + 13, '0', 'f-tick', 'end') +
        label(W - 10, zeroY + 14, 'x', 'f-mini', 'end') +
        label(ox + 4, 12, 'y', 'f-mini', 'start') +
        shape +
        dots
    );
  }

  /**
   * ぼうグラフ。**棒に数字は書かない。**
   * 目盛りから読み取らせるのが Grade 3 のねらいなので、数字を書くと問題が成り立たない
   */
  function bars(f) {
    const ox = 34;
    const oy = H - 30;
    const top = 26;
    const maxV = Math.max(...f.values);
    // 目盛りの刻み。棒の高さが目盛りにぴったり載るよう、値はすべて整数にしてある
    const step = maxV <= 6 ? 1 : maxV <= 12 ? 2 : maxV <= 30 ? 5 : 10;
    const ticks = Math.ceil(maxV / step);
    const sy = (oy - top) / (ticks * step);
    const slot = (W - ox - 18) / f.values.length;
    const bw = Math.min(30, slot * 0.6);

    let grid = '';
    for (let i = 1; i <= ticks; i++) {
      const y = oy - i * step * sy;
      grid += line(ox, y, W - 14, y, 'f-grid') + label(ox - 6, y + 4, String(i * step), 'f-tick', 'end');
    }
    const cols = f.values
      .map((v, i) => {
        const x = ox + slot * i + (slot - bw) / 2;
        const h = v * sy;
        return (
          poly([[x, oy - h], [x + bw, oy - h], [x + bw, oy], [x, oy]], 'f-face') +
          label(x + bw / 2, oy + 14, String(f.labels[i]), 'f-tick')
        );
      })
      .join('');

    return svg(
      grid +
        line(ox, top - 8, ox, oy, 'f-axis') +
        line(ox, oy, W - 14, oy, 'f-axis') +
        label(ox - 6, oy + 4, '0', 'f-tick', 'end') +
        (f.yLabel ? label(ox + 4, 14, f.yLabel, 'f-mini', 'start') : '') +
        cols
    );
  }

  // ---------- 立体図形 ----------
  //
  // 斜投影で描く。奥に向かう辺は右上へ一定量ずらす。
  // 見えない辺は破線にする（実物を思い浮かべやすくするため）

  const DX = 34; // 奥行きの見かけの横ずれ
  const DY = 22; // 同・縦ずれ

  function box(f) {
    const [w, h] = fit(f.a, f.c, 150, 96);
    const x = (W - w - DX) / 2;
    const y = (H - h - DY) / 2 + DY;
    const front = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
    const bx = x + DX;
    const by = y - DY;
    return svg(
      poly([[bx, by], [bx + w, by], [bx + w, by + h], [bx, by + h]], 'f-face f-back') +
        line(bx, by + h, bx + w, by + h, 'f-dash') +
        line(bx, by, bx, by + h, 'f-dash') +
        poly(front) +
        line(x, y, bx, by) +
        line(x + w, y, bx + w, by) +
        line(x + w, y + h, bx + w, by + h) +
        label(x + w / 2, y + h + 18, withUnit(f.a, f.unit)) +
        label(x - 8, y + h / 2 + 4, withUnit(f.c, f.unit), 'f-label', 'end') +
        label(x + w + DX / 2 + 12, y + h - DY / 2 + 4, withUnit(f.b, f.unit), 'f-label', 'start')
    );
  }

  function cube(f) {
    const s = 96;
    const x = (W - s - DX) / 2;
    const y = (H - s - DY) / 2 + DY;
    const bx = x + DX;
    const by = y - DY;
    return svg(
      poly([[bx, by], [bx + s, by], [bx + s, by + s], [bx, by + s]], 'f-face f-back') +
        line(bx, by + s, bx + s, by + s, 'f-dash') +
        line(bx, by, bx, by + s, 'f-dash') +
        poly([[x, y], [x + s, y], [x + s, y + s], [x, y + s]]) +
        line(x, y, bx, by) +
        line(x + s, y, bx + s, by) +
        line(x + s, y + s, bx + s, by + s) +
        (f.plain ? '' : label(x + s / 2, y + s + 18, withUnit(f.s, f.unit)))
    );
  }

  function cylinder(f) {
    const [rw, hh] = fit(f.r * 2, f.h, 110, 104);
    const rx = rw / 2;
    const ry = Math.max(10, rx * 0.32);
    const cx = W / 2;
    const top = (H - hh) / 2;
    const bot = top + hh;
    return svg(
      path(`M ${num(cx - rx)} ${num(top)} L ${num(cx - rx)} ${num(bot)} A ${num(rx)} ${num(ry)} 0 0 0 ${num(cx + rx)} ${num(bot)} L ${num(cx + rx)} ${num(top)} Z`) +
        ellipse(cx, top, rx, ry) +
        path(`M ${num(cx - rx)} ${num(bot)} A ${num(rx)} ${num(ry)} 0 0 1 ${num(cx + rx)} ${num(bot)}`, 'f-dash') +
        line(cx, top, cx + rx, top, 'f-dash') +
        // 半径のラベルは上の楕円より上に逃がす。線の上に載せると読めない
        label(cx + rx / 2, top - ry - 7, withUnit(f.r, f.unit)) +
        label(cx + rx + 10, (top + bot) / 2 + 4, withUnit(f.h, f.unit), 'f-label', 'start')
    );
  }

  /**
   * 三角柱。三角形の断面を左手前に置き、右奥へ伸ばす。
   * 奥行きを横に大きく取るのは、「底面の三角形」と「柱の長さ」が
   * 別ものだと見て分かるようにするため（文章だと3つの数が並んで混ざる）
   */
  function prism(f) {
    const bw = 76;
    const bh = 62;
    const ddx = 96; // 柱の長さの見かけ
    const ddy = 30;
    const x = 34;
    const y = H - 44 - bh + ddy;
    const apex = x + bw * 0.4;
    const tri = [[x, y + bh], [x + bw, y + bh], [apex, y]];
    const back = tri.map(([px, py]) => [px + ddx, py - ddy]);
    return svg(
      poly(back, 'f-face f-back') +
        // 奥の底辺は手前の面に隠れる
        line(back[0][0], back[0][1], back[1][0], back[1][1], 'f-dash') +
        tri.map((p, i) => line(p[0], p[1], back[i][0], back[i][1])).join('') +
        poly(tri) +
        (f.plain
          ? ''
          : (f.base
              ? line(apex, y, apex, y + bh, 'f-dash') +
                rightAngle(apex, y + bh, -1, -1, 7) +
                label(x + bw / 2, y + bh + 17, withUnit(f.base, f.unit)) +
                label(apex + 6, y + bh / 2 + 4, withUnit(f.height, f.unit), 'f-label', 'start')
              : label(x + bw / 2, y + bh + 17, `底面 ${f.area} ${f.unit || ''}²`, 'f-mini')) +
            // 長さは奥へ伸びる辺に沿えて置く
            label(x + bw + ddx / 2 + 6, y + bh - ddy / 2 + 20, withUnit(f.length, f.unit), 'f-label', 'middle'))
    );
  }

  /** 正四角錐。底面は斜投影で平行四辺形になる */
  function pyramid(f) {
    const bw = 96;
    const d = 40; // 奥行きの横ずれ
    const dh = 22; // 同・縦ずれ
    const by = H - 40;
    const apexY = 28;
    const cx = W / 2 - d / 2;
    const fl = [cx - bw / 2, by];
    const fr = [cx + bw / 2, by];
    const br = [cx + bw / 2 + d, by - dh];
    const bl = [cx - bw / 2 + d, by - dh];
    const center = [cx + d / 2, by - dh / 2];
    const apex = [center[0], apexY];
    return svg(
      poly([fl, fr, br, bl], 'f-face f-back') +
        // 奥の2辺は隠れる
        line(bl[0], bl[1], fl[0], fl[1], 'f-dash') +
        line(bl[0], bl[1], br[0], br[1], 'f-dash') +
        line(apex[0], apex[1], bl[0], bl[1], 'f-dash') +
        line(apex[0], apex[1], fl[0], fl[1]) +
        line(apex[0], apex[1], fr[0], fr[1]) +
        line(apex[0], apex[1], br[0], br[1]) +
        line(apex[0], apex[1], center[0], center[1], 'f-dash') +
        rightAngle(center[0], center[1], 1, -1, 7) +
        label(apex[0] + 8, (apexY + center[1]) / 2, withUnit(f.h, f.unit), 'f-label', 'start') +
        (f.s
          ? label(cx, by + 17, withUnit(f.s, f.unit))
          : label(cx, by + 17, `底面 ${f.area} ${f.unit || ''}²`, 'f-mini'))
    );
  }

  function cone(f) {
    const rx = 52;
    const ry = 17;
    const cx = W / 2;
    const by = H - 42;
    const apexY = 30;
    return svg(
      path(`M ${num(cx - rx)} ${num(by)} L ${num(cx)} ${num(apexY)} L ${num(cx + rx)} ${num(by)} A ${rx} ${ry} 0 0 0 ${num(cx - rx)} ${num(by)} Z`) +
        path(`M ${num(cx - rx)} ${num(by)} A ${rx} ${ry} 0 0 1 ${num(cx + rx)} ${num(by)}`, 'f-dash') +
        line(cx, apexY, cx, by, 'f-dash') +
        line(cx, by, cx + rx, by, 'f-dash') +
        rightAngle(cx, by, 1, -1, 7) +
        label(cx + rx / 2, by + 17, withUnit(f.r, f.unit)) +
        label(cx + 8, (apexY + by) / 2, withUnit(f.h, f.unit), 'f-label', 'start')
    );
  }

  const RENDERERS = {
    rect, triangle, isoTriangle, parallelogram, trapezoid, rhombus,
    straightLine, triangleAngles, parallelLines, polygon,
    circle, sector, points, bars,
    box, cube, cylinder, prism, pyramid, cone
  };

  /**
   * 図を描く。spec が無い、または知らない形なら空文字を返す
   * （図の無い問題も多いので、呼び出し側で分岐させない）
   */
  function render(spec) {
    if (!spec || !RENDERERS[spec.kind]) return '';
    try {
      return RENDERERS[spec.kind](spec);
    } catch (e) {
      // 図が描けなくても問題自体は解けるので、落とさずに黙って諦める
      console.warn('図を描けませんでした', spec, e);
      return '';
    }
  }

  return { render, kinds: Object.keys(RENDERERS) };
})();
