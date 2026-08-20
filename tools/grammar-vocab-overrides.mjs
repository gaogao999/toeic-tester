/**
 * 文法教材から拾った語の手直し。
 *
 * tools/build-vocab-from-grammar.mjs が使う。長文からの取り込みと共通のものは
 * passage-vocab-overrides.mjs にあり、ここは**文法教材でだけ出た語**を書く。
 *
 * 中身を足すときの考え方:
 *   GRAMMAR_DROP     … 単語カードにしても覚えようがないもの（活用形の断片・熟語の一部）
 *   GRAMMAR_REWRITE  … 拾えた語形より、別の語形で覚えるほうが良いもの
 *   GRAMMAR_MEANINGS … 英和辞書が場違いな語義を先頭に置いているもの
 *   GRAMMAR_POS      … 語義の日本語からは品詞を当てられないもの
 *   KEEP_AS_IS       … -ing / -ed の形のまま覚える語（活用形に戻さない）
 *
 * **一覧を目で見てから書くこと。**辞書は語義を1つ選ぶだけなので、
 * `organization → 組織化`（正しくは組織）のように、間違ってはいないが
 * 覚える意味としては外れているものが必ず混ざる。
 */

/**
 * **英語について語るための語**。教材が英語そのものではなく英文法を説明するために使う。
 * 入試で問われるのは英語であって英文法用語ではないので、単語カードにしない。
 *
 * 教材の本文から語を拾うと、`verb`(322回) `noun`(181) `gerund`(82) `participle`(121) が
 * 頻度の上位を独占する。**回数が多い＝重要語、ではない**ことがはっきり出る例。
 */
export const METALANGUAGE = new Set([
  'verb', 'noun', 'adjective', 'adverb', 'adverbial', 'pronoun', 'preposition',
  'prepositional', 'conjunction', 'clause', 'phrase', 'infinitive', 'gerund',
  'participle', 'participial', 'modifier', 'complement', 'tense', 'plural',
  'singular', 'possessive', 'comparative', 'superlative', 'countable',
  'uncountable', 'auxiliary', 'modal', 'conditional', 'subordinate',
  'coordinating', 'antecedent', 'grammatical', 'grammar', 'agreement',
  'preparatory', 'indefinite', 'definite', 'verbal', 'transitive', 'intransitive',
  'predicate', 'syntax', 'apostrophe', 'quantifier',
  'interrogative', 'demonstrative', 'reflexive', 'inversion', 'usage',
  'subjective', 'generalization', 'comma', 'consonant', 'vowel', 'prefix',
  'unreal', 'habitual', 'continuation', 'successive', 'demotic',
  'coordinate',   // 等位接続詞（coordinate conjunction）の説明にしか出ない

  // 教材の体裁・奥付
  'chapter', 'unit', 'section', 'page', 'index', 'edition', 'license',
  'publishing', 'publication', 'reproduce', 'retrieval', 'transmit',
  'photocopy', 'diagnostic', 'comprehension', 'proficiency', 'tester',
  'exposition', 'paraphrase'
]);

/** -ing / -ed だが、活用形ではなく独立した語として覚えるもの */
export const KEEP_AS_IS = new Set([
  'wedding', 'meeting', 'building', 'feeling', 'ending', 'saving', 'setting',
  'training', 'writing', 'painting', 'reading', 'meaning', 'clothing', 'landing',
  'advanced', 'crowded', 'excited', 'interested', 'tired', 'married',
  // be 動詞と組で覚える形。原形をあとから収録しても、こちらは残す
  'relieved', 'devoted', 'stuck', 'exhausted', 'confusing', 'entertaining'
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
  'nother', 'gonna', 'wanna', 'ain',
  // ここから、本文から拾うようにして出てきたもの
  'nuts', 'bananas',        // 俗語（「頭がおかしい」）。覚える語ではない
  'tun',                    // turn の読み違いか、まず使わない語
  'bowls', 'coaster',       // 複数形／熟語の一部（roller coaster）
  'master',                 // 教材の題名（Master TOEFL Junior）から紛れ込む
  'albino', 'beaten', 'admitted', 'whatever', 'anytime',
  // 短縮形がアポストロフィで割れて残ったもの（don't → don。辞書には「ドン川」がある）
  'don',
  // 地の文から拾うようにして出てきたもの
  'pop',        // popcorn / pop music の一部。単独では「ポンという音」になってしまう
  'grasping',   // grasp の派生。辞書の語義が「欲深い」で教材の使われ方と合わない
  // 登場人物の名前。**一度これで beaver を収録してしまい、あとで消した**
  'beaver'      // Mrs. Beaver（Narnia の登場人物）としてしか出てこない
]);

/**
 * **拾えた語形より、別の語形で覚えるほうが良いもの。**
 *
 * 教材にたまたま出た形がそのまま見出しになると、`angles`（複数形）や
 * `calculating`（動名詞）のような、覚える単位として不自然なカードができる。
 * さらに辞書がその語形に別の語義を持っていると、`angles → アングル族`のように
 * 意味まで外れる。gate() が GRAMMAR_DROP のあとにこれを通す。
 */
export const GRAMMAR_REWRITE = {
  angles: 'angle',            // 「four equal angles」。辞書の angles は民族名
  calculating: 'calculate',   // 「good at calculating」
  removed: 'remove',          // 「must be removed from Antarctica」
  inspiring: 'inspire',       // 「an inspiring older student」
  appointed: 'appoint'
};

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
  tempting: '心をそそる',

  // ここから、教材の本文から拾うようにして出てきたもの。
  // **英和辞書は古い語義や専門語義を先頭に置く**ので、いまの使われ方に直す
  kite: '凧',                       // 辞書は鳥の「トビ」
  vaccine: 'ワクチン',              // 辞書は「牛痘種、痘苗」
  racism: '人種差別',               // 辞書は「民族主義」
  diet: '食事',                     // 辞書は「議会」（日本の国会の語義）
  community: '地域社会',            // 辞書は「共同会社」
  generation: '世代',
  medicine: '薬',
  gymnast: '体操選手',              // 辞書は「体操教師」
  lifeguard: '監視員',
  mall: 'ショッピングモール',       // 辞書は「木陰の散歩道」
  hamburger: 'ハンバーガー',        // 辞書は「牛のひき肉」
  fantastic: 'すばらしい',          // 辞書は「異様な」
  fitness: '体力、健康',
  confidence: '自信',
  restroom: 'トイレ',
  toilet: 'トイレ',
  bakery: 'パン屋',
  balloon: '風船',
  pony: 'ポニー',
  porch: '玄関',
  cabinet: '戸棚',
  elementary: '小学校の、初歩の',
  password: 'パスワード',
  address: '住所',
  glue: 'のり、接着剤',
  jog: 'ジョギングをする',
  logging: '伐採',
  stamp: '切手',
  scout: '偵察する',
  chip: 'かけら、チップ',
  mural: '壁画',
  lace: 'レース、ひも',
  sole: '唯一の',
  link: 'つながり',
  sight: '光景、視力',
  boost: '後押しする',
  cart: '荷車、カート',
  pace: '速さ、ペース',
  trash: 'ごみ',
  rubbish: 'ごみ',
  yoga: 'ヨガ',
  subscribe: '定期購読する',
  tease: 'からかう',
  optimistic: '楽観的な',
  enhance: '高める',
  awake: '目が覚めて',
  shop: '店',
  favor: '親切な行い',
  temple: '寺',
  tip: '先端、こつ',
  backpack: 'リュックサック',
  grill: '焼き網、グリル',
  board: '板、委員会',

  // **英和辞書が「〜の短縮形」「〜の略」としか書いていない語。**
  // 語義にラテン文字が残るものは「答えが問題文に漏れる」ので採らない規則にしてあり、
  // その規則に基本語がまとめて引っかかっていた（bike / math / mom が単語帳に無かった）
  bike: '自転車',
  math: '数学',
  mom: 'お母さん',
  cab: 'タクシー',
  teen: '10代の若者',
  donut: 'ドーナツ',
  motel: 'モーテル',
  sports: 'スポーツ',
  cat: 'ネコ',
  pen: 'ペン',
  salt: '塩',
  aid: '援助、助け',
  spicy: '香辛料のきいた、辛い',
  scientist: '科学者',
  hallway: '廊下',
  hairdresser: '美容師',
  firefighter: '消防士',
  speciality: '得意料理、専門',
  geese: 'ガチョウ（複数形）',
  oxen: '雄牛（複数形）',
  possum: 'フクロネズミ',
  acquaint: '知らせる、慣れさせる',

  // 地の文から拾うようにして出てきたぶんの手直し
  appropriate: '適切な',
  direct: '直接の',
  indirect: '間接的な',
  mate: '仲間',
  capital: '首都、資本',
  drill: '訓練、ドリル',
  frequency: '頻度',
  gender: '性別',
  option: '選択肢',
  prediction: '予測',
  readiness: '用意ができていること',
  secure: '安全な',
  total: '合計の',
  scoop: 'すくう',
  deaf: '耳が聞こえない',
  studio: 'スタジオ、仕事場',
  smell: 'においがする、かぐ',
  perception: '知覚、認識',
  arrangement: '手配、配置',
  correspondence: '文通、やりとり',
  identification: '身元確認',
  placement: '配置',
  bunny: 'ウサギ',
  boldness: '大胆さ',
  domestically: '国内で、家庭で',

  // ---- 語彙練習リスト由来を消したあと、教材から入れ直したぶん ----
  // **拾った例文と突き合わせて直している。**辞書は語義を1つ選ぶだけなので、
  // 教材での使われ方とずれたものが必ず混ざる（下の「→」がその例文）
  // **既存の語と語義が丸かぶりにならないようにする。**同じ日本語のカードが2枚あると
  // 4択で「どちらも正解」になる（gain / claim / mean / eliminate / criticize が相手）
  obtain: '手に入れる',
  intend: '〜するつもりだ',
  remove: '取り除く、撤去する',
  blame: '責める',
  noticeable: '人目につく',
  delay: '遅らせる',

  progress: '進歩、上達',
  confusing: '紛らわしい、ややこしい',
  load: '積み荷、荷物',
  relate: '関連づける',
  accept: '受け入れる',              // → She can't accept the fact that she failed
  cross: '横切る、渡る',             // → They help us cross the street safely
  consist: '成り立つ',
  firm: '固い、揺るがない',          // → His decision to quit his job is still firm
  frequently: 'しばしば、頻繁に',
  found: '設立する、創設する',       // → The organization was founded by Mr. Guggenheim
  ruin: '台無しにする',
  marathon: 'マラソン',
  celebration: '祝賀、お祝い',
  angle: '角、角度',
  calculate: '計算する',
  remove: '取り除く',
  inspire: '奮い立たせる',
  appoint: '任命する、指定する',
  eager: '熱心な、〜したがる',
  business: '商売、企業',            // → used widely by schools and businesses
  court: '裁判所、コート',
  relieved: 'ほっとした',
  benefit: '利益、恩恵',
  pack: '包み、パック',              // → Each pack contains twenty pieces
  conclude: '結論を出す、終える',
  demand: '要求する',
  grant: '認める、与える',           // → We all take it for granted that…
  noticeable: '目立つ',
  prefer: '〜のほうを好む',
  stuck: '動けなくなった',           // → I wouldn't have gotten stuck here
  spiritual: '精神的な、霊的な',
  qualify: '資格を得る',             // → qualifying themselves for the state competition
  access: 'アクセスする、利用する',  // → To access the website, visit…
  contribute: '寄与する、一因となる',
  direction: '方向、指示',           // → Had the tour guide given better directions
  feature: '特徴、機能',             // → they have impressive features such as cameras
  loss: '損失、失うこと',
  beam: '光線、ビーム',              // → reconstructed with a laser beam
  charity: '慈善、慈善団体',
  carnival: 'カーニバル、祭り',
  perspective: '見方、視野',         // → a work experience that expands my perspective
  panic: 'うろたえる、あわてる',     // → You don't have to panic
  positive: '前向きな、積極的な',
  negative: '否定的な、消極的な',
  sensible: '分別のある、賢明な',
  neglect: '怠る、おろそかにする',   // → students will neglect their other responsibilities
  demolish: '取り壊す、破壊する',
  professional: 'プロの、専門的な',
  informal: 'くだけた、非公式の',
  formal: '正式な、堅苦しい',
  favorable: '好都合な、有利な'      // → the preservation of favorable variations
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
  welcome: 'v.', graduate: 'v.', teens: 'n.',
  // ここから、教材の本文から拾うようにして出てきたもの
  noisily: 'adv.', respectfully: 'adv.', otherwise: 'adv.', outdoors: 'adv.',
  chair: 'n.', sofa: 'n.', shame: 'n.', backpack: 'n.', mural: 'n.',
  trash: 'n.', sole: 'adj.', ill: 'adj.', choosy: 'adj.', afford: 'v.',
  dying: 'adj.', embarrassing: 'adj.', outstanding: 'adj.', nutritious: 'adj.',
  boost: 'v.', awake: 'adj.', accustomed: 'adj.', diet: 'n.',
  // 地の文から拾うようにして出てきたぶん
  appropriate: 'adj.', capital: 'n.', boldness: 'n.', domestically: 'adv.',
  scoop: 'v.', seldom: 'adv.',
  // 教材から入れ直したぶん。辞書の語義だけでは名詞に見えるものが多い
  frequently: 'adv.', afterward: 'adv.', nevertheless: 'adv.',
  eager: 'adj.', relieved: 'adj.', devoted: 'adj.', stuck: 'adj.',
  noticeable: 'adj.', sensible: 'adj.', positive: 'adj.', negative: 'adj.',
  prefer: 'v.', cross: 'v.', grant: 'v.', panic: 'v.', access: 'v.',
  qualify: 'v.', found: 'v.', feature: 'n.', perspective: 'n.', benefit: 'n.'
};
