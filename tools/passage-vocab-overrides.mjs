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
  'programme', // program の英国綴り。重複になる
  'anti',      // 接頭辞。単独の語ではない
  'handed',    // 接尾辞（left-handed など）。単独の語ではない
  'gam', 'trad', 'plat'  // 辞書にはあるが現代の教材では使わない語
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
  gate: '門、ゲート',

  // ---- 総点検（audit-vocab.mjs）で見つかった誤り ----

  // 否定を含む語。「ほとんど」と「ほとんど〜ない」は逆の意味になる
  hardly: 'ほとんど〜ない',
  scarcely: 'ほとんど〜ない',
  rarely: 'めったに〜ない',
  seldom: 'めったに〜ない',
  barely: 'かろうじて〜する',

  // 程度を表す副詞。辞書の第一義が古い用法を指している
  quite: 'かなり、まったく',
  fairly: 'かなり、公平に',
  rather: 'むしろ、かなり',
  nearly: 'もう少しで、ほぼ',
  almost: 'ほとんど、もう少しで',

  // 数。数字だけだと日本語として読めない
  twelve: '十二', fourteen: '十四', fifteen: '十五', sixteen: '十六', nineteen: '十九',
  twenty: '二十', thirty: '三十', forty: '四十', fifty: '五十', sixty: '六十',
  seventy: '七十', hundred: '百', thousand: '千',

  // 固有名詞との衝突・壊れていた語
  man: '男、人',
  sister: '姉妹',
  loser: '敗者',
  whale: '鯨',
  python: 'ニシキヘビ',
  term: '学期、用語',
  pilot: 'パイロット、操縦士',

  // 意味が長すぎて選択肢に収まらなかったもの
  survive: '生き残る',
  deter: '思いとどまらせる',
  clarify: '明らかにする',
  miscalculate: '計算を誤る',
  undivided: '分かれていない',
  imbalance: '不均衡',
  glib: '口が達者な',
  allergic: 'アレルギーの',
  appreciate: '感謝する、よさが分かる',
  squeak: 'チューチュー鳴く',
  goggle: '目を丸くする',
  reunite: '再会させる',
  ruin: '台無しにする、廃墟',

  // 同じ意味の語が並ばないよう、区別できる訳に分ける。
  // 「意味→英単語」の形式では、訳が同じだと正解なのに不正解になるため
  huge: '巨大な', gigantic: 'とてつもなく大きい', enormous: '莫大な', colossal: '巨大な建造物のような',
  result: '結果', effect: '影響、効果', consequence: '結末', outcome: '成果',
  work: '働く、仕事', job: '職', task: '課題、任務',
  lot: 'たくさん', abundance: '豊富さ', plenty: '十分な量',
  big: '大きい', large: '広い、大型の', loud: '（音が）大きい',
  part: '部分', piece: '一片', portion: '一部、分け前',
  move: '動く', operate: '操作する、作動する',
  obvious: '明白な', evident: 'はっきりしている',
  put: '置く', set: '据える、設定する', lay: '横たえる',
  regular: '定期的な', usual: 'いつもの', ordinary: '普通の',
  entirely: '完全に', purely: '純粋に',
  unclear: 'はっきりしない', vague: '曖昧な', obscure: '分かりにくい',
  gather: '集める', assemble: '組み立てる、集合させる', collect: '収集する',
  herd: '（牛などの）群れ', flock: '（鳥などの）群れ', troop: '一団',
  subtract: '引く（引き算）', draw: '描く', pull: '引っ張る',
  fearful: '恐ろしい', horrible: 'ぞっとする', awful: 'ひどい',
  people: '人々', folk: '民衆',
  get: '手に入れる', receive: '受け取る',
  see: '見る、見える', seem: '〜のように見える',
  animal: '動物', beast: '獣',
  home: '家庭', house: '家',
  really: '本当に', actually: '実際は',
  happen: '起こる', arise: '生じる',
  place: '場所', site: '用地、現場',
  thing: '物', object: '物体',
  high: '高い', tall: '背が高い',
  usually: 'たいてい', generally: '一般に',
  use: '使う', spend: '費やす',
  means: '手段', method: '方法',
  sound: '音', noise: '騒音',
  small: '小さい', little: '小さい、ほとんど無い',
  movement: '動き', exercise: '運動、練習',
  example: '例', instance: '実例',
  away: '離れて', apart: 'ばらばらに',
  understand: '理解する', comprehend: '十分に理解する',
  allow: '許す', permit: '許可する',
  chance: '機会', accident: '事故',
  trip: '旅行', journey: '（長い）旅',
  fast: '速い', quick: 'すばやい'
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
  working: 'work',
  decided: 'decide',
  climbing: 'climb',
  wondering: 'wonder',
  laughing: 'laugh',
  camper: 'camp',
  dancer: 'dance'
};
