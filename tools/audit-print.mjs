/**
 * 刷り上がりの点検。
 *
 *   node tools/audit-print.mjs
 *
 * **このアプリの中身は紙なので、紙を見ないと点検にならない。**
 * 画面で「全3枚」と出ているのに A4 で刷ると4ページになる、という壊れ方をする。
 * ヘッドレス Chromium で実際に A4 の PDF を作り、**画面の枚数と
 * 刷り上がりのページ数が合っているか**を見る。
 *
 * 1行の高さを CSS で変えたら、js/app.js の ROWS_PER_PAGE と対で直すこと。
 * この道具は、その対応が崩れたことを教えるためにある
 * （目分量で置いていたときは、画面2枚が紙3ページに割れていた）。
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const URL = `file://${path.join(ROOT, 'index.html')}`;

/** Playwright の在りか。入れ方が環境で違うので、順に探す */
async function loadChromium() {
  const candidates = ['playwright', '/opt/node22/lib/node_modules/playwright/index.js'];
  for (const spec of candidates) {
    try {
      const mod = await import(spec);
      return (mod.chromium || mod.default?.chromium);
    } catch (e) {
      /* 次を試す */
    }
  }
  console.error('Playwright が見つかりません。`npm i -D playwright` を入れてから走らせてください。');
  process.exit(1);
}

/** PDF のページ数。pdfinfo があれば使い、無ければ PDF の中を数える */
function pdfPages(file) {
  try {
    const out = execFileSync('pdfinfo', [file], { encoding: 'utf8' });
    const m = out.match(/^Pages:\s+(\d+)/m);
    if (m) return Number(m[1]);
  } catch (e) {
    /* pdfinfo が無い環境のほうが多いので、下のやり方に落とす */
  }
  const raw = fs.readFileSync(file, 'latin1');
  const counts = [...raw.matchAll(/\/Type\s*\/Page[^s]/g)].length;
  return counts || null;
}

/** 点検する組み合わせ。**用紙ごとに1行の高さが違う**ので、全部見る */
const CASES = [
  { name: '一覧', sheet: 'list' },
  { name: '一覧（例文つき）', sheet: 'list', example: true },
  { name: '意味→英語', sheet: 'ja2en' },
  { name: '意味→英語（解答なし）', sheet: 'ja2en', answer: false },
  { name: '英語→意味', sheet: 'en2ja' },
  { name: '書いて覚える', sheet: 'write' }
];

// 語数は、ちょうど割り切れない数も混ぜる（端数の1枚で割れることがある）
const COUNTS = ['40', '100'];

const chromium = await loadChromium();
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1280, height: 1000 } })).newPage();

const errors = [];
page.on('pageerror', (e) => errors.push(`JS エラー: ${e.message}`));
page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });

await page.goto(URL);
await page.waitForTimeout(300);

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'audit-print-'));
const problems = [];
let checked = 0;

for (const c of CASES) {
  for (const count of COUNTS) {
    await page.selectOption('#f-sheet', c.sheet);
    await page.selectOption('#f-count', count);
    // **効かない項目は画面から消えている**ので、その用紙のときだけ触る。
    // 隠れたものを押そうとすると、ここで止まる（一度これで落ちた）
    if (c.sheet === 'list') await page.setChecked('#f-example', !!c.example);
    if (c.sheet === 'ja2en' || c.sheet === 'en2ja') {
      await page.setChecked('#f-answer', c.answer !== false);
    }
    await page.waitForTimeout(200);

    const onScreen = await page.locator('.sheet').count();
    const file = path.join(tmp, `${c.sheet}-${count}.pdf`);
    await page.pdf({ path: file, format: 'A4', printBackground: true });
    const printed = pdfPages(file);
    checked += 1;

    const label = `${c.name}・${count}語`;
    if (printed === null) {
      problems.push(`${label}: PDF のページ数を数えられませんでした`);
    } else if (printed !== onScreen) {
      problems.push(`${label}: 画面 ${onScreen} 枚 → 刷ると ${printed} ページ（${printed > onScreen ? '1枚が割れている' : '枚数が足りない'}）`);
    }
    console.log(`  ${label.padEnd(24)} 画面 ${String(onScreen).padStart(2)} 枚 / 刷り ${String(printed).padStart(2)} ページ  ${printed === onScreen ? '✓' : '✗'}`);
  }
}

fs.rmSync(tmp, { recursive: true, force: true });
await browser.close();

console.log(`\n${checked} とおりを点検`);
if (errors.length) {
  console.log(`\n画面のエラー ${errors.length} 件:`);
  errors.forEach((e) => console.log(`  ✗ ${e}`));
}
if (problems.length) {
  console.log(`\n枚数が合わないもの ${problems.length} 件:`);
  problems.forEach((p) => console.log(`  ✗ ${p}`));
  console.log('\njs/app.js の ROWS_PER_PAGE を減らすか、css/style.css の行の高さを縮めてください。');
}
const bad = problems.length + errors.length;
console.log(bad ? `\n❌ ${bad} 件` : '\n✅ エラー 0 件');
process.exit(bad ? 1 : 0);
