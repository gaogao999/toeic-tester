/**
 * 文法教材から拾った語の手直し。
 *
 * tools/build-vocab-from-grammar.mjs が使う。長文からの取り込みと共通のものは
 * passage-vocab-overrides.mjs にあり、ここは**文法教材でだけ出た語**を書く。
 *
 * 中身を足すときの考え方:
 *   GRAMMAR_DROP     … 単語カードにしても覚えようがないもの（活用形の断片・熟語の一部）
 *   GRAMMAR_MEANINGS … 英和辞書が場違いな語義を先頭に置いているもの
 *   GRAMMAR_POS      … 語義の日本語からは品詞を当てられないもの
 *   KEEP_AS_IS       … -ing / -ed の形のまま覚える語（活用形に戻さない）
 *
 * **一覧を目で見てから書くこと。**辞書は語義を1つ選ぶだけなので、
 * `organization → 組織化`（正しくは組織）のように、間違ってはいないが
 * 覚える意味としては外れているものが必ず混ざる。
 */

/** -ing / -ed だが、活用形ではなく独立した語として覚えるもの */
export const KEEP_AS_IS = new Set([
  'wedding', 'meeting', 'building', 'feeling', 'ending', 'saving', 'setting',
  'training', 'writing', 'painting', 'reading', 'meaning', 'clothing', 'landing',
  'advanced', 'crowded', 'excited', 'interested', 'tired', 'married'
]);

/** 単語カードにしない語 */
export const GRAMMAR_DROP = new Set([
  // 辞書の見出しが別綴り・古い形のもの
  'cooky',      // cookie の異綴り
  'employe',    // employee の異綴り
  'thee', 'thou', 'ye',
  // 熟語の一部で、単独では覚えようがないもの
  'lingua',     // lingua franca
  // 熟語の中でしか使わず、意味を日本語だけで書くと何の語か分からなくなるもの
  'behalf', 'spite',
  // 語形を削りすぎて別の語に当たったもの
  'pi', 'sate', 'fed', 'bore',
  // すでにある語の活用形・派生でしかないもの
  'exploded', 'systematical',
  // 機能語に近く、単語カードにしても意味がないもの
  'regarding', 'whenever',
  // 話し言葉のくずれ
  'nother', 'gonna', 'wanna', 'ain'
]);

/** 英和辞書の語義が教材の使われ方と合わないもの */
export const GRAMMAR_MEANINGS = {
  novel: '小説',                 // 辞書は形容詞「新奇な」を先に出す
  matter: '問題、事柄',
  twice: '2回、2倍',
  content: '中身、内容',
  minute: '分',
  present: '現在の、出席して',
  subject: '教科、主題',
  major: '主要な',
  fair: '公平な',
  patch: '当て布、ワッペン',
  plow: '（雪などを）かき分ける',
  stall: '仕切り、屋台',
  suit: '合う、似合う',
  trail: '道、跡',
  volume: '量、音量',
  scale: '規模、目盛り',
  state: '州、状態',
  train: '訓練する',
  // ここから、一覧を見て直したもの
  organization: '組織、団体',
  surgery: '手術',
  digital: 'デジタルの',
  style: '様式、やり方',
  viewer: '視聴者',
  sign: '標識、しるし',
  graduate: '卒業する',
  belong: '属する',
  carpool: '相乗り',
  shipload: '船1隻分の積荷',
  boarding: '乗り込むこと',
  perish: '滅びる、死ぬ',
  holographic: 'ホログラムの',
  teens: '10代',
  truth: '真実',
  upstairs: '2階へ、階上へ',
  satisfaction: '満足',
  instruction: '指示、教えること',
  goodness: '善良さ',
  warmth: '暖かさ',
  ease: '気楽さ、容易さ',
  dumping: '投げ捨てること',
  magnitude: '大きさ、規模',
  current: '現在の、今の',
  fancy: '空想、思いつき',
  welcome: '歓迎する',
  network: 'ネットワーク、網状組織',
  topping: '（料理の）トッピング',
  discrimination: '差別',
  discriminate: '差別する',
  discriminating: '見分ける力のある',
  civil: '市民の、公民の',
  key: 'かぎ、手がかり',
  note: '覚え書き、メモ',
  outline: '概要、輪郭',
  selection: '選択',
  radiation: '放射線',
  appearance: '現れること、外見',
  belonging: '所属、（複数で）持ち物',
  // 辞書の語義がそのままでは長すぎる・崩れているもの
  controversial: '議論を呼ぶ',      // 辞書は「論争上の論争の余地のある」と崩れている
  colonist: '入植者',               // 辞書は「入仲者」と崩れている
  misplace: '置き忘れる',
  enable: '可能にする',
  popularize: '広める',
  boycott: 'ボイコットする',
  tempting: '心をそそる'
};

/** 語義の語尾からは当てられない品詞 */
export const GRAMMAR_POS = {
  twice: 'adv.', ashamed: 'adj.', brightly: 'adv.', eventually: 'adv.',
  frankly: 'adv.', gradually: 'adv.', hardly: 'adv.', largely: 'adv.',
  rarely: 'adv.', seldom: 'adv.', therefore: 'adv.',
  // 一覧を見て直したもの
  behavior: 'n.', network: 'n.', topping: 'n.', yesterday: 'adv.',
  drunk: 'adj.', curable: 'adj.', goodness: 'n.', warmth: 'n.',
  worrisome: 'adj.', magnitude: 'n.', ease: 'n.', dumping: 'n.',
  disobey: 'v.', satisfying: 'adj.', mobile: 'adj.', belong: 'v.',
  trustworthy: 'adj.', tempting: 'adj.', perish: 'v.', upstairs: 'adv.',
  welcome: 'v.', graduate: 'v.', teens: 'n.'
};
