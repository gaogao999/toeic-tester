/**
 * 単語データを作るときの共通部品。
 *
 * もとは tools/build-vocab-from-passages.mjs の中にあったもの。
 * 教材が増えて取り込み口が複数になったので、**同じ判断が2か所に分かれないよう**
 * ここに出した。機能語の一覧・見出し語の当て方・語義の選び方は、
 * どの取り込み口から入った語でも同じでなければならない。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** js/*.js からデータをそのまま読む。ビルド工程が無いのでこの形でよい */
export const load = (file, name) =>
  new Function(fs.readFileSync(path.join(ROOT, file), 'utf8') + `;return ${name};`)();

/**
 * 機能語。これらは「覚える単語」として出しても意味がないので収録しない。
 * 中学生なら既に知っているか、文法として学ぶもの。
 */
export const FUNCTION_WORDS = new Set(
  (
    'a an the and or but if because so that than then as of to in on at for with by from into onto ' +
    'up down out off over under about through during before after above below between among against ' +
    'is are was were be been being am do does did done have has had having will would shall should ' +
    'can could may might must need ought used ' +
    'i me my mine myself you your yours yourself he him his himself she her hers herself it its itself ' +
    'we us our ours ourselves they them their theirs themselves ' +
    'this that these those who whom whose which what where when why how ' +
    'not no nor none never very too also just only even still yet already ' +
    'there here all both each every few many much more most other another some any such own same ' +
    'one two three four five six seven eight nine ten first second third next last ' +
    'yes ok okay please thank thanks ' +
    'however until whether although though while since unless upon within without across along around ' +
    'toward towards behind beside besides beyond despite except inside outside per plus versus via ' +
    'anyone anything anybody everyone everything everybody someone something somebody nothing nobody ' +
    'cannot going ' +
    's t re ve ll d m'
  ).split(' ')
);

/** 不規則変化。辞書には said も載っているが「sayの過去」としか書かれていないので原形へ寄せる */
export const IRREGULAR = {
  said:'say', went:'go', gone:'go', got:'get', gotten:'get', saw:'see', seen:'see', came:'come',
  built:'build', children:'child', feet:'foot', teeth:'tooth', men:'man', women:'woman', mice:'mouse',
  took:'take', taken:'take', made:'make', knew:'know', known:'know', found:'find', thought:'think',
  told:'tell', became:'become', began:'begin', begun:'begin', brought:'bring', bought:'buy',
  caught:'catch', chose:'choose', chosen:'choose', drove:'drive', driven:'drive', ate:'eat', eaten:'eat',
  fell:'fall', fallen:'fall', felt:'feel', flew:'fly', flown:'fly', forgot:'forget', gave:'give',
  given:'give', grew:'grow', grown:'grow', heard:'hear', held:'hold', kept:'keep', led:'lead',
  left:'leave', lost:'lose', met:'meet', paid:'pay', ran:'run', rose:'rise', risen:'rise', sat:'sit',
  sent:'send', shown:'show', sang:'sing', sung:'sing', spoke:'speak', spoken:'speak', spent:'spend',
  stood:'stand', swam:'swim', taught:'teach', threw:'throw', thrown:'throw', understood:'understand',
  wore:'wear', worn:'wear', won:'win', wrote:'write', written:'write', rode:'ride', ridden:'ride',
  hid:'hide', hidden:'hide', bit:'bite', dug:'dig', hung:'hang', shot:'shoot', slept:'sleep',
  lives:'life', leaves:'leaf', wolves:'wolf', knives:'knife', better:'good', best:'good',
  worse:'bad', worst:'bad', sold:'sell', stole:'steal', swum:'swim'
};

/** 屈折を原形に近づける。辞書に当たるかどうかで採否を決めるので、候補を返す */
export function candidates(token) {
  if (IRREGULAR[token]) return [IRREGULAR[token]];
  const out = [token];
  const add = (w) => w && w.length > 1 && out.push(w);
  if (token.endsWith('ies')) add(token.slice(0, -3) + 'y');
  if (token.endsWith('ied')) add(token.slice(0, -3) + 'y');
  if (token.endsWith('es')) { add(token.slice(0, -2)); add(token.slice(0, -1)); }
  if (token.endsWith('s')) add(token.slice(0, -1));
  if (token.endsWith('ed')) { add(token.slice(0, -2)); add(token.slice(0, -1)); }
  if (token.endsWith('ing')) { add(token.slice(0, -3)); add(token.slice(0, -3) + 'e'); }
  if (token.endsWith('er')) { add(token.slice(0, -2)); add(token.slice(0, -1)); }
  if (token.endsWith('est')) { add(token.slice(0, -3)); add(token.slice(0, -2)); }
  if (token.endsWith('ly')) add(token.slice(0, -2));
  // running → run のような重ね字
  const dbl = token.replace(/([bdgklmnprt])\1(ed|ing|er|est)$/, '$1');
  if (dbl !== token) add(dbl);
  return [...new Set(out)];
}

/** EJDict（英和辞書）を読む。意味の出どころ */
export function loadDictionary() {
  const dir = path.join(ROOT, 'data/raw/vocab-sources');
  const dict = new Map();
  for (const letter of 'abcdefghijklmnopqrstuvwxyz'.split('')) {
    const file = path.join(dir, `ejdict-${letter}.txt`);
    if (!fs.existsSync(file)) continue;
    for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
      const [head, sense] = line.split('\t');
      if (!head || !sense) continue;
      for (const w of head.split(',')) {
        const k = w.trim().toLowerCase();
        if (k && !dict.has(k)) dict.set(k, sense.trim());
      }
    }
  }
  return dict;
}

export function loadPhonetics() {
  const file = path.join(ROOT, 'data/raw/vocab-sources/ipa.txt');
  const map = new Map();
  if (!fs.existsSync(file)) return map;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const [w, ipa] = line.split('\t');
    if (!w || !ipa) continue;
    const k = w.toLowerCase();
    if (!map.has(k)) map.set(k, ipa.split(',')[0].trim());
  }
  return map;
}


/**
 * EJDict の語義から、覚える価値のある意味を1つ選ぶ。
 *
 * この辞書は語義を ` / ` で並べ、важな意味を『』で囲っている。
 * 単純に先頭を取ると `school → 教習所`、`dolphin → シイラ` のような
 * 場違いな語義を拾ってしまうので、『』のあるものを優先する。
 */
export function pickSense(raw) {
  const senses = raw.split(' / ').map((s) => s.trim()).filter(Boolean);

  const clean = (s) => {
    let t = s
      .replace(/\{[^}]*\}/g, '')
      .replace(/《[^》]*》/g, '')
      .replace(/〈[^〉]*〉/g, '')
      .replace(/〔[^〕]*〕/g, '');
    // 『』は残したまま括弧の補足だけ落とす
    for (let i = 0; i < 3; i++) t = t.replace(/\([^()]*\)/g, '');
    return t.replace(/[[\]（）()]/g, '').replace(/\s+/g, ' ').trim();
  };

  const usable = (t) => {
    if (!t) return false;
    // ラテン文字が残るものは略語の展開や「〜の過去形」なので採らない。
    // クイズの答えが問題文に漏れるのも防げる
    if (/[A-Za-z]{2,}/.test(t)) return false;
    if (/の(過去|複数|比較級|最上級|現在分詞|過去分詞)/.test(t)) return false;
    return true;
  };

  // ① 『』つきの語義を探す
  for (const s of senses) {
    const c = clean(s);
    const m = c.match(/『([^』]+)』/);
    if (m && usable(m[1])) return trim2(m[1]);
  }
  // ② 無ければ、使える最初の語義
  for (const s of senses) {
    const c = clean(s).replace(/[『』]/g, '');
    if (usable(c)) return trim2(c);
  }
  return '';
}

/** 語義は最大2つまで。長いと4択の選択肢に収まらない */
export function trim2(s) {
  const parts = s.split(/[,、;・]/).map((x) => x.trim()).filter(Boolean);
  return parts.slice(0, 2).join('、');
}

/**
 * 品詞を当てる。英和辞書は品詞を持たないので、日本語の語尾から判断する。
 *
 * 日本語の動詞は必ずウ段（る・う・く・ぐ・す・つ・ぬ・ぶ・む）で終わり、
 * 形容詞は「い」か「な」で終わる。名詞がウ段で終わることはほとんどない。
 * この規則で大半は取れる。取り切れないものは overrides で直す。
 */
export function posOf(word, sense) {
  if (word.includes(' ')) return 'phr.';
  const s = sense.split('、')[0]; // 最初の語義で判断する

  // 「…を」「…に」で始まるものは他動詞
  if (/^[…～]/.test(s)) return 'v.';
  // サ変・受身・可能はまず動詞
  if (/(する|される|できる)$/.test(s)) return 'v.';
  // 「費用のかかる」「栄光ある」は連体形なので形容詞
  if (/(のある|のかかる|のない|ある)$/.test(s) && s.length >= 3) return 'adj.';
  // ウ段で終わるものは動詞。ただし「〜的」などは除く
  if (/[るうくぐすつぬぶむ]$/.test(s) && !/(名|物|者|所|人|事|数|量)$/.test(s)) return 'v.';
  // 「〜な」「〜的」「〜の」は形容詞（male→男性の, human→人間の）
  if (/(な|的|の)$/.test(s)) return 'adj.';
  // 「死んだ」「飢えた」のように過去形で状態を表すものも形容詞
  if (/[たさだ]$/.test(s) && s.length >= 3) return 'adj.';
  if (/い$/.test(s) && s.length >= 2 && !/(合い|扱い|使い|願い|行い|勢い)$/.test(s)) return 'adj.';
  // 「繰り返して」「静かに」など。長さでは切らない
  if (/て$/.test(s) && s.length >= 3) return 'adv.';
  if (/[くに]$/.test(s) && s.length <= 5) return 'adv.';
  return 'n.';
}
