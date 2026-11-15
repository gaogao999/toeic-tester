/**
 * 刷り上がりの点検。
 *
 *   node tools/audit-print.mjs
 *
 * **このアプリの紙は、画面を見るだけでは点検にならない。**
 * 画面で「3枚」と出ているのに A4 で刷ると4ページになる、という壊れ方をする。
 * ヘッドレス Chromium で今日のプリントを作り、実際に A4 の PDF にして、
 * **画面の枚数と刷り上がりのページ数が合っているか**を見る。
 *
 * 1行の高さを CSS で変えたら、js/app.js の ROWS_PER_PAGE と対で直すこと。
 * この道具は、その対応が崩れたことを教えるためにある
 * （目分量で置いていたときは、画面2枚が紙3ページに割れていた）。
 *
 * **花さんの記録には触らない。**毎回まっさらなブラウザで開く。
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
  for (const spec of ['playwright', '/opt/node22/lib/node_modules/playwright/index.js']) {
    try {
      const mod = await import(spec);
      return mod.chromium || mod.default?.chromium;
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
    const m = execFileSync('pdfinfo', [file], { encoding: 'utf8' }).match(/^Pages:\s+(\d+)/m);
    if (m) return Number(m[1]);
  } catch (e) {
    /* pdfinfo が無い環境のほうが多い */
  }
  const raw = fs.readFileSync(file, 'latin1');
  return [...raw.matchAll(/\/Type\s*\/Page[^s]/g)].length || null;
}

const PARTS = ['study', 'ja2en', 'en2ja', 'write', 'answer'];
const NAMES = { study: 'おぼえる', ja2en: '意味→英語', en2ja: '英語→意味', write: '書いて覚える', answer: '解答' };

/**
 * 点検する組み合わせ。**用紙ごとに1行の高さが違う**ので、1種類ずつ見る。
 * 語数は 1枚ちょうど・割り切れない数・数枚にまたがる数を混ぜる
 */
const PER_DAY = [10, 20, 30, 40];
const CASES = [
  ...PARTS.filter((p) => p !== 'answer').map((p) => ({ name: NAMES[p], parts: [p] })),
  // 解答はテストがあるときだけ出る
  { name: '意味→英語＋解答', parts: ['ja2en', 'answer'] },
  { name: 'ぜんぶ', parts: PARTS }
];

const chromium = await loadChromium();
const browser = await chromium.launch();
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'audit-print-'));
const problems = [];
const errors = [];
let checked = 0;

/**
 * **最悪の日**も見る。ふつうの日は短い語が混ざるので、1枚に入る行数が多めでも
 * 割れずに済んでしまう。長い語は2行に折り返して行が高くなるので、
 * ここで割れなければどの日も割れない。
 *   meaning … 意味がいちばん長い語ばかり（言い換えが並ぶ語）
 *   word    … 英語がいちばん長い語ばかり（threaten with extinction などの熟語）
 */
const WORST_NAMES = { meaning: '意味が長い語だけ', word: '英語が長い語だけ' };
const RUNS = [
  ...PER_DAY.map((n) => ({ perDay: n, worst: null })),
  { perDay: 40, worst: 'meaning' },
  { perDay: 40, worst: 'word' }
];

for (const run of RUNS) {
  const { perDay } = run;
  // まっさらなブラウザで開く。花さんの記録には触らない
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 1000 } });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(`JS エラー: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });
  await page.goto(URL);
  await page.evaluate(({ n, worst }) => {
    const sheets = [];
    if (worst) {
      // 長い順に n 語。答え合わせ前のプリントとして置く
      const longest = WORDS.slice().sort((a, b) => b[worst].length - a[worst].length).slice(0, n).map((w) => w.word);
      sheets.push({ id: 'worst', date: '2026-01-01', words: longest, results: null, recordedAt: null });
    }
    localStorage.setItem('hana-eiken:v1', JSON.stringify({ v: 1, words: {}, sheets, settings: { perDay: n } }));
  }, { n: perDay, worst: run.worst });
  await page.reload();
  await page.waitForTimeout(300);
  await page.click(run.worst ? '#do-print-view' : '#do-make');
  await page.waitForTimeout(300);

  for (const c of CASES) {
    for (const p of PARTS) await page.setChecked(`[data-part="${p}"]`, c.parts.includes(p));
    await page.waitForTimeout(150);

    const onScreen = await page.locator('.sheet').count();
    const file = path.join(tmp, `${perDay}${run.worst ? "-" + run.worst : ""}-${c.parts.join("-")}.pdf`);
    await page.pdf({ path: file, format: 'A4', printBackground: true });
    const printed = pdfPages(file);
    checked += 1;

    const label = `${c.name}・${perDay}語${run.worst ? `（${WORST_NAMES[run.worst]}）` : ''}`;
    if (printed === null) problems.push(`${label}: PDF のページ数を数えられませんでした`);
    else if (printed !== onScreen) {
      problems.push(`${label}: 画面 ${onScreen} 枚 → 刷ると ${printed} ページ（${printed > onScreen ? '1枚が割れている' : '枚数が足りない'}）`);
    }
    console.log(`  ${label.padEnd(20)} 画面 ${String(onScreen).padStart(2)} 枚 / 刷り ${String(printed).padStart(2)} ページ  ${printed === onScreen ? '✓' : '✗'}`);
  }
  await ctx.close();
}

fs.rmSync(tmp, { recursive: true, force: true });
await browser.close();

console.log(`\n${checked} とおりを点検`);
if (errors.length) {
  console.log(`\n画面のエラー ${errors.length} 件:`);
  [...new Set(errors)].forEach((e) => console.log(`  ✗ ${e}`));
}
if (problems.length) {
  console.log(`\n枚数が合わないもの ${problems.length} 件:`);
  problems.forEach((p) => console.log(`  ✗ ${p}`));
  console.log('\njs/app.js の ROWS_PER_PAGE を減らすか、css/style.css の行の高さを縮めてください。');
}
const bad = problems.length + errors.length;
console.log(bad ? `\n❌ ${bad} 件` : '\n✅ エラー 0 件');
process.exit(bad ? 1 : 0);
