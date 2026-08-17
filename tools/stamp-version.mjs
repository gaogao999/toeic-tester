/**
 * 画面に出すリビジョンを js/app.js に刻む。
 *
 * このアプリにはビルド工程が無いので、実行時に git を読むことはできない。
 * かわりにコミットの直前にこれを走らせ、そのときの短縮ハッシュと日付を
 * 定数として書き込む。
 *
 * スマートフォンで開いたときに「手元のものが最新か」を確かめるためのもの。
 *
 *   node tools/stamp-version.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILE = path.join(ROOT, 'js/app.js');

const git = (cmd) => execSync(cmd, { cwd: ROOT }).toString().trim();

// 直前のコミットを指す。これから作るコミットの中身は、まだハッシュが決まらない
const hash = git('git rev-parse --short HEAD');
const date = git('git log -1 --format=%cd --date=format:%Y-%m-%d');
const version = `${date} (${hash})`;

const src = fs.readFileSync(FILE, 'utf8');
const next = src.replace(/const APP_VERSION = '[^']*';/, `const APP_VERSION = '${version}';`);

if (next === src) {
  console.error('APP_VERSION が js/app.js に見つかりません。');
  process.exit(1);
}

fs.writeFileSync(FILE, next);
console.log(`リビジョンを刻みました: ${version}`);
