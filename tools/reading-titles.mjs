/**
 * 長文の題（一覧に出す見出し）を付け直す。
 *
 *   node tools/reading-titles.mjs          … 何がどう変わるかと、答えの漏れの点検
 *   node tools/reading-titles.mjs --emit   … js/reading-data.js の title を書き換える
 *
 * **title だけを書き換える。id も本文も設問も触らない**（id は学習記録のキー）。
 *
 * ---
 *
 * ## なぜ付け直すか
 *
 * ### 1. 日本語と英語が混ざっていた
 *
 * r1〜r58 が英語の題、r59〜r134 が日本語の題という状態で、一覧に両方が並んでいた。
 * **日本語にそろえる。**題は「本文の一部」ではなく**一覧から選ぶための見出し**で、
 * 選ぶのは日本語話者の子だから。実際の TOEFL Junior の本文には題が付いていない。
 *
 * ### 2. 題が「題を問う設問」の答えを教えていた
 *
 * 32本が `What would be the best title for this story?` を出題している。
 * ところが画面はその上に題を出していたので、**読む前に答えが分かる。**
 *
 *   r33  表示「Draco and His Harsh Laws」  ← 正解「Draco and His Harsh Laws」（完全一致）
 *   r86  表示「ベーブ・ルースの生涯」        ← 正解「The Life of Babe Ruth」（直訳）
 *   r133 表示「イルカのコミュニケーション」  ← 正解「Communications in Dolphins」（直訳）
 *
 * 英語の題は字面で、日本語の題は訳で漏れていたので、**言語をそろえるだけでは直らない。**
 * この32本は**主題ではなく場面を指す見出し**にした。
 *
 *   r86  「ベーブ・ルースの生涯」    → 「野球殿堂に最初に選ばれた選手」
 *   r133 「イルカのコミュニケーション」→ 「海で最も賢い動物」
 *   r72  「Y2K問題とは何だったのか」 → 「西暦を2桁で書いていたころ」
 *
 * 本文を読めば何の話かは分かる。**先に主題を名指ししないことだけが目的。**
 *
 * ### 付け直すときに守ること
 *
 * - **正解の選択肢の訳にしない。**「〜の生涯」「〜のしくみ」のような、
 *   そのまま題になる形を避け、場面・登場人物・きっかけを指す
 * - ただの記号にしない。一覧から選べなくなる（「理科の長文3」では選べない）
 * - 本文の冒頭に書いてあることは出してよい。読めば分かるので隠す意味がない
 */
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, load } from './vocab-lib.mjs';

/**
 * 新しい題。**ここに無い id はそのまま**（r59〜r134 の大半は日本語のままでよい）。
 * ★ が付いているものは「題を問う設問」があり、答えを避けて付け直したもの。
 */
const TITLES = {
  // ---- r1〜r22 書き下ろし ----
  r1: '転校した日の朝',
  r2: '体育祭のお知らせ',
  r3: 'ミツバチがいなくなったら',
  r4: '海に流れ着くプラスチック',
  r5: '風車を作った少年',
  r6: 'タイの新年ソンクラーン',           // ★ 正解「A Festival with Two Faces」
  r7: '寝る前のスマホと睡眠',
  r8: 'ゾウが交わす低い音',
  r9: 'ホストファミリーからの手紙',
  r10: 'バスで拾った財布',
  r11: 'チョコレートがたどった道',
  r12: '始業時刻を遅らせるべきか',
  r13: '人はなぜ忘れるのか',
  r14: '翻訳機と外国語学習',
  r15: '安い服の本当の値段',
  r16: '地下でつながる森',
  r17: '国際フードデーの案内',
  r18: '図書館の新しい開館時間',
  r19: '水族館への遠足',
  r20: 'タコの身の守り方',
  r21: '姉妹校での1か月',
  r22: '都市が暑くなる理由',

  // ---- r23〜r58 Basic（A2）----
  r23: 'ショー・アンド・テルの連絡',
  r24: '動物園から逃げたサル',
  r25: '精神分析を生んだ人',             // ★ 正解「The Famous Ideas of Freud」
  r26: 'ハロウィーンの新しい決まり',
  r27: 'タレントショーの選考会',
  r28: '心臓発作はなぜ起きるか',
  r29: '南北戦争と新しい技術',           // ★ 正解「Photographs in the Civil War」
  r30: 'スプーキーデーの案内',
  r31: '吹雪のテントの中で',             // ★ 正解「Trying to Climb a Mountain」
  r32: '運動はどれくらい必要か',
  r33: '古代ギリシャ最初の立法者',       // ★ 正解「Draco and His Harsh Laws」
  r34: '欠席した友だちへの手紙',
  r35: '州のスペリング大会',
  r36: '女性飛行士アメリア・イアハート',
  r37: 'フレスコ画の描き方',
  r38: '毎年4月の恒例行事',              // ★ 正解「This Year's International Potluck Party」
  r39: '暑い日の商売',                   // ★ 正解「Lemonade Stand Robbery」
  r40: '火山ができるしくみ',
  r41: '新しいエネルギーを探して',       // ★ 正解「Using Wind Energy」
  r42: '授業中に起きた騒ぎ',             // ★ 正解「Billy and the Frog」
  r43: '突然あらわれる巨大な波',
  r44: '登校初日のできごと',             // ★ 正解「A Ripped Shirt and a New Soccer Team Member」
  r45: '早食い大会の優勝者',
  r46: '酸性雨がもたらすもの',
  r47: '週末の予定を知らせるメール',
  r48: '長子・末子・ひとりっ子',         // ★ 正解「Birth Order and Its Effect on Children」
  r49: 'ペンギンの意外な生態',
  r50: '49番目に加わった州',             // ★ 正解「Alaska: Wild and Cold」
  r51: '雪の中の決勝戦',
  r52: '征服王ウィリアムの最期',
  r53: '読書フェスティバルの日程',
  r54: 'コーチからの返事',
  r55: '表彰された先生',
  r56: '雨の音がうるさかった日',         // ★ 正解「A Rainy Day Hike」
  r57: '光年という距離',                 // ★ 正解「Stars in the Sky」
  r58: '紙の本と電子書籍',               // ★ 正解「Changes in the Reading Culture」

  // ---- r59〜r134 のうち、題を問う設問があるもの（答えの漏れを消す）----
  r60: '舞台を見にいった週末',           // ★ 正解「The Seventh Grade Goes to New York」
  r62: '魔女にかけられた呪い',           // ★ 正解「A Beast Finds True Love」
  r63: '家族で回った夏のヨーロッパ',     // ★ 正解「My Favorite European Country」
  r65: 'ルネサンスを生きた人',           // ★ 正解「The Many Talents of Da Vinci」
  r69: 'クリストフォリという楽器職人',   // ★ 正解「The Piano's Beginning」
  r72: '西暦を2桁で書いていたころ',      // ★ 正解「The Y2K Problem」
  r76: '20世紀に起きた変化',             // ★ 正解「The Globe's Temperature Increase」
  r79: 'いつも通りに始まった一日',       // ★ 正解「A Surprise for Jacob」
  r81: 'ジョーンズ先生の恒例行事',       // ★ 正解「The Big Pet Decision」
  r83: '砲撃の夜に書かれた詩',           // ★ 正解「Francis Scott Key's American Anthem」
  r85: 'ヘンリー・ハドソンが測った川',   // ★ 正解「A River of American Importance」
  r86: '野球殿堂に最初に選ばれた選手',   // ★ 正解「The Life of Babe Ruth」
  r92: 'プレートと断層のはなし',         // ★ 正解「Understanding Earthquakes」
  r93: 'タコスの日の昼休み',             // ★ 正解「The Food Fight」
  r96: '宇宙をめぐる二つの説',           // ★ 正解「The Possibility of Life on Other Worlds」
  r112: '望遠鏡を持ち帰った夜',          // ★ 正解「Two Students Encountering Two Aliens」
  r133: '海で最も賢い動物'               // ★ 正解「Communications in Dolphins」
};

const READING_DATA = load('js/reading-data.js', 'READING_DATA');
const isTitleQuestion = (q) => /best title|title for/i.test(q.q);

/** ラテン文字の内容語。字面で漏れているかを見るのに使う */
const words = (s) =>
  new Set(
    (s.toLowerCase().match(/[a-z]+/g) || []).filter(
      (w) => w.length > 2 && !['the', 'and', 'for', 'his', 'her', 'its', 'that', 'this', 'with'].includes(w)
    )
  );

const after = (r) => TITLES[r.id] || r.title;

// ---- 点検 ----
const problems = [];
for (const r of READING_DATA) {
  const tq = r.questions.find(isTitleQuestion);
  if (!tq) continue;
  const title = after(r);
  const right = tq.choices[tq.answer];
  const a = words(title);
  const b = words(right);
  const shared = [...a].filter((w) => b.has(w));
  // 日本語の題ならラテン文字はほぼ無い。残っていて正解と重なるなら字面で漏れている
  if (shared.length) problems.push(`${r.id}: 題「${title}」と正解「${right}」が ${shared.join(' ')} を共有`);
}

const changed = READING_DATA.filter((r) => TITLES[r.id] && TITLES[r.id] !== r.title);
const stillLatin = READING_DATA.filter((r) => !/[ぁ-んァ-ヶ一-龯]/.test(after(r)));

console.log(`長文 ${READING_DATA.length} 本`);
console.log(`  題を書き換える: ${changed.length}`);
console.log(`  題を問う設問がある: ${READING_DATA.filter((r) => r.questions.some(isTitleQuestion)).length} 本`);
console.log(`  書き換えたあと日本語になっていないもの: ${stillLatin.length}`);
if (stillLatin.length) console.log(`    ${stillLatin.map((r) => `${r.id} ${after(r)}`).join(' / ')}`);
console.log(`  字面で答えが漏れているもの: ${problems.length}`);
problems.forEach((p) => console.log(`    ❌ ${p}`));

const unknown = Object.keys(TITLES).filter((id) => !READING_DATA.some((r) => r.id === id));
if (unknown.length) throw new Error(`知らない id がある: ${unknown.join(' ')}`);

if (process.argv.includes('--emit')) {
  // **1本 = 複数行の形をそのまま使い、title: の行だけを置き換える。**
  // 読み直して書き出し直すと、手で直した本文や設問を落とす危険がある
  const file = path.join(ROOT, 'js/reading-data.js');
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  const q = (v) => `'${String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  let current = null;
  let done = 0;
  const out = lines.map((line) => {
    const m = line.match(/^\s*id: '(r\d+)',\s*$/);
    if (m) { current = m[1]; return line; }
    if (!current || !TITLES[current]) return line;
    const t = line.match(/^(\s*)title: .*,\s*$/);
    if (!t) return line;
    const replaced = `${t[1]}title: ${q(TITLES[current])},`;
    current = null;
    done += 1;
    return replaced;
  });
  if (done !== Object.keys(TITLES).length) {
    throw new Error(`書き換えた行が合わない: ${done} / ${Object.keys(TITLES).length}`);
  }
  fs.writeFileSync(file, out.join('\n'));
  console.log(`\njs/reading-data.js の title を ${done} 本ぶん書き換えました（id と本文は触っていません）`);
}
