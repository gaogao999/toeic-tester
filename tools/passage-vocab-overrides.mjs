/**
 * 本文から自動生成した単語の手直し。
 *
 * 英和辞書（EJDict）は『』で主要語義を示しているのでそれを優先しているが、
 * それでも外すものがある。おもに3種類。
 *
 *   ① 固有名詞との衝突   tell→テル  job→ヨブ  nice→ニース
 *   ② 古い/場違いな語義   coach→大型四輪馬車  well→井戸  lot→くじ
 *   ③ 教材の文脈と合わない join→つなぐ（教材では「参加する」）
 *
 * ①は前回の生成でも起きた。辞書の見出しが人名・地名と重なると起こる。
 *
 * DROP に入れた語は収録しない（間投詞や略語の断片）。
 */

export const DROP = new Set([
  'ow', 'mil', 'gon', 'wan', 'nah', 'yeah', 'hmm', 'huh', 'oops',
  'whin',      // 語形の取り違えで拾ってしまう植物名
  'programme'  // program の英国綴り。重複になる
]);

export const MEANINGS = {
  // ① 固有名詞との衝突
  tell: '伝える、話す',
  job: '仕事',
  nice: 'すてきな、親切な',

  // ② 古い・場違いな語義
  lot: 'たくさん',
  well: 'うまく、よく',
  coach: 'コーチ、監督',
  back: '背中、後ろ',
  miss: '逃す、寂しく思う',
  water: '水',
  class: 'クラス、授業',
  way: '方法、道',
  game: '試合、ゲーム',
  hard: '難しい、熱心に',
  today: 'きょう',
  day: '日',
  guy: '男、やつ',
  ridge: '尾根',
  plate: '板、プレート',
  glass: 'ガラス、コップ',
  paint: '塗る、ペンキ',
  score: '得点',
  form: '形、用紙',
  end: '終わり、端',
  state: '州、状態',
  spring: '春、ばね',
  fall: '秋、落ちる',
  match: '試合、合う',
  fair: '公平な、品評会',
  major: '主要な',
  minor: '小さいほうの',
  content: '中身',
  present: '現在の、贈り物',
  subject: '教科、主題',
  order: '順序、注文',
  practice: '練習、練習する',
  degree: '程度、度',
  bill: '請求書、法案',
  train: '電車、訓練する',
  bat: 'バット、コウモリ',
  rock: '岩、ロック',
  race: '競走、人種',
  ring: '指輪、鳴る',
  bank: '銀行、土手',

  // 理科の文脈で使われる語。辞書の主要語義が日常語のほうを指してしまう
  cell: '細胞',
  energy: 'エネルギー',
  power: '力、電力',
  mass: '質量、かたまり',
  field: '分野、野原',
  wave: '波、手を振る',
  matter: '物質、重要である',
  current: '流れ、現在の',
  charge: '料金、充電する',
  organ: '器官、オルガン',
  shell: '殻',
  root: '根',
  trunk: '幹',
  pole: '極、棒',
  ray: '光線',

  // ③ 教材の文脈に合わせる
  student: '学生、生徒',
  join: '参加する',
  international: '国際的な',
  classroom: '教室',
  start: '始まる、始める',
  great: '偉大な、すばらしい',
  look: '見る',
  live: '住む、生きる',
  plant: '植物、植える',
  study: '勉強する、研究',
  camp: 'キャンプ、野営地',
  group: 'グループ、集団',
  team: 'チーム',
  record: '記録、記録する',
  share: '分け合う、分け前',
  massive: '大きくて重い',
  personal: '個人の',
  attack: '襲う、攻撃',
  win: '勝つ',
  force: '力、強制する',
  scene: '場面、現場',
  report: '報告、報告する',
  feeling: '気持ち、感覚',

  // 1回しか出ない語を入れて増えたぶんの手直し
  meaning: '意味',
  border: '国境、境界',
  cast: '配役、投げる',
  plague: '疫病',
  representative: '代表者',
  sideline: 'サイドライン',
  clog: 'ふさぐ、詰まらせる',
  odd: '奇妙な',
  gate: '門、ゲート'
};

/**
 * 品詞の手直し。日本語の語尾からの推測は「く」で終わる語を取り違える
 * （「うまく」は副詞だが、「歩く」と同じ語尾なので動詞と判定される）。
 */
export const POS = {
  well: 'adv.', hard: 'adv.', back: 'n.', today: 'n.', fast: 'adv.', early: 'adv.',
  late: 'adj.', high: 'adj.', low: 'adj.', long: 'adj.', deep: 'adj.', near: 'adj.',
  right: 'adj.', straight: 'adj.', quick: 'adj.', slow: 'adj.', loud: 'adj.',
  // 「呪い」「勢い」のように名詞でも「い」で終わるもの
  curse: 'n.', smile: 'n.', wish: 'n.', doubt: 'n.', battle: 'n.', prize: 'n.',
  meaning: 'n.', overnight: 'adv.', representative: 'n.', expensive: 'adj.',
  glorious: 'adj.', following: 'adj.', determined: 'adj.'
};

/** 語形を原形に寄せる（-ing 形が見出し語になってしまうもの） */
export const REWRITE = {
  learned: 'learn',
  climbing: 'climb',
  wondering: 'wonder',
  laughing: 'laugh',
  camper: 'camp',
  dancer: 'dance'
};
