/**
 * Master TOEFL Junior Basic（CEFR A2）の Check-up 設問に付ける日本語の解説。
 *
 * **教材の Check-up には解説が無い**（答えしか載っていない）。
 * 解説の無い問題は「なぜ間違えたか」が分からないまま次へ進んでしまうので、
 * B1・B2 と同じように1問ずつ書いた。
 *
 * キーは**問題文そのもの**。取り込みのたびに番号が変わりうるので番号では持たない。
 * 問題文が変わったキーは emit が「解説の付かない設問」として報告する。
 *
 * FIXES は OCR の読み違いを直す表。意味が変わる直しなので、
 * 機械的な置換（emit-grammar.mjs の OCR_FIX）とは分けてある。
 */

/** OCR の読み違い。左が取り込んだままの問題文、右が直したもの */
export const A2_FIXES = {
  'They help us ___ the street sately.': 'They help us ___ the street safely.',
  'He was cleaning his room ___ himself': 'He was cleaning his room ___ himself.',
  'The lessons are always ___': 'The lessons are always ___.',
  'Paul ___ there for ten years when his father died': 'Paul ___ there for ten years when his father died.'
};

/** 問題文 → 日本語の解説 */
export const A2_NOTES = {
  // --- 文の要素
  '___ makes me smile.': '主語の位置に来るのは動名詞。動詞のままでは主語にならない',
  'Her ___ depends on the doctor.': 'Her の後ろは名詞。survive は動詞なので入らない',
  'The ___ of the soldiers was honored with medals.': 'the … of 〜 の形なので名詞。brave は形容詞',
  'Dave ___ the window.': '文の動詞なので過去形。broken は過去分詞で、単独では動詞にならない',
  'Santa Claus ___ in the North Pole.': '文には動詞が要る。living だけでは文にならない',
  "Sarah couldn't ___ to the party last night.": '助動詞の後ろは原形',
  'They got the ___ at school.': 'the の後ろは名詞。knowledgeable は形容詞',
  'John enjoys ___ to class.': 'enjoy の後ろは動名詞。to 不定詞は取れない',
  "I don't know ___.": '文の中に入った疑問詞は、ふつうの語順（主語 + 動詞）になる',
  'They elected him ___.': 'elect + 人 + 役職。役職は名詞で表す',
  '___ important to come to school every day.': 'to 以下を受ける形式主語の it。There is では受けられない',
  '___ problems between me and my brother.': '「〜がある」は There is/are。problems は複数なので were',
  'They found ___ that he was absent for three weeks.': 'find it + 形容詞 + that 〜。it が that 以下の代わりに立つ',
  // --- 主語と動詞の一致
  '___ were running to catch the bus.': '動詞が were なので、主語は複数でなければならない',
  'Making spaghetti and pies ___ my speciality.': '動名詞が主語なので単数扱い',
  'Whether you like it or not ___ matter.': 'whether で始まるまとまりが主語なので単数扱い',
  'Everyone working at the school ___ the cafeteria food.': '主語は Everyone（単数）。間の working at the school に引きずられない',
  'The characters in that book ___ interesting.': '主語は characters（複数）。in that book に引きずられない',
  'There ___ a terrible earthquake in Japan this year.': 'There の後ろの動詞は、続く名詞に合わせる。earthquake は単数',
  'Either you or he ___ wrong.': 'either A or B は**近いほう**（he）に合わせる',
  "The soccer players and the coach ___ ready for today's game.": 'and で結んだ主語は複数扱い',
  'Not only he but also I ___ to blame.': 'not only A but also B は **B のほう**（I）に合わせる',
  'One of the girls in my class ___ moving to Michigan.': '主語は One（単数）。of the girls に引きずられない',
  'All of my brothers ___ on the soccer team.': 'all of + 複数名詞 は複数扱い',
  'The number of my classmates ___ 30.': 'the number of 〜 は「〜の数」で単数扱い（a number of なら複数）',
  // --- 時制
  'My brother ___ to our house right now.': 'right now は「今まさに」。現在進行形',
  'The doctor ___ a surgery at 8 a.m. tomorrow.': 'tomorrow なので未来のこと',
  'James ___ studying English at that time.': 'at that time は過去のある時点',
  'My neighbor ___ her dog every morning since I was young.': 'since 〜 は今まで続く期間なので現在完了',
  'By next September, my cousin ___ her baby.': 'by + 未来の時 は「〜までに」。未来完了',
  'Paul ___ there for ten years when his father died.': '父が亡くなった時点より前から続いていたので過去完了',
  // --- 受動態
  'Nathan ___ Mount Everest.': '登ったのは Nathan の側なので受け身にしない',
  'The organization ___ by Mr. Guggenheim.': '団体は「設立される」側。found（設立する）の過去分詞は founded',
  'The homeless ___ by the government.': '助けられる側なので、助動詞 + be + 過去分詞',
  'My mother ___ cookies for me.': '作ったのは母の側なので受け身にしない',
  'Minors ___ to watch that movie.': '許可されない側なので受け身。don’t allowed という形は無い',
  'James ___ a genius by them.': '呼ばれる側なので受け身',
  // --- 助動詞
  'Students ___ listen to the teacher.': '「〜すべきだ」は should。could は「〜できた」',
  'If you want, you ___ come over to my house to play.': '「来てもいいよ」という許可の can',
  "Lucas ___ be late for school because he has a dentist appointment.": '歯医者の予約があるので「遅れてもよい」。許可の can',
  'I ___ taken your advice.': 'should have + 過去分詞 で「〜すべきだったのに（しなかった）」',
  'Steve ___ study German before he came to our school.': 'used to + 原形 で「昔は〜していた」',
  'I ___ stay at home than go out.': 'would rather A than B で「B より A したい」',
  // --- 不定詞
  'He learned ___ when he lived in Australia.': 'learn の後ろは to 不定詞',
  "My sister's dream is ___.": 'be の後ろに「〜すること」を置くので to 不定詞',
  'Leave me alone! I want ___ alone.': '「ほうっておかれたい」ので to 不定詞の受け身',
  'She went upstairs ___ a rest.': '「〜するために」と目的を表す to 不定詞',
  'Max has a driveway ___ his car in.': 'driveway を後ろから説明する to 不定詞。止めるのは Max なので受け身にしない',
  'His ___ to quit his job is still firm.': 'His の後ろは名詞。decide は動詞',
  'The news reporter wants ___.': 'want の後ろは to 不定詞。語順は to + 動詞 + 続き',
  'I asked ___ me home from school.': 'ask + 人 + to 不定詞',
  'They help us ___ the street safely.': 'help + 人 + 原形。to は付けなくてよい',
  'We heard Mr. Manson ___ to Mrs. Graff.': 'hear + O + 現在分詞 で「〜しているのが聞こえる」',
  'She had us ___ a short English essay twice a week.': 'have + O + 原形 で「〜させる」',
  // --- 動名詞
  'Selling flowers ___ how that store makes money.': '動名詞が主語なので単数扱い',
  'He objected ___ the work by himself.': 'object to の to は前置詞。後ろは動名詞',
  'The purpose of life is not ___ money.': 'be の後ろで「〜すること」を表すので動名詞',
  'Soon, we will begin ___ our holiday banner.': 'begin は動名詞も取れる。make のままでは入らない',
  'Eleanor suggests ___ there before noon.': 'suggest の後ろは動名詞。to 不定詞は取れない',
  'At the next service station, he stopped ___ a magazine.': 'stop to 〜 は「〜するために立ち止まる」。stop + 動名詞 なら「〜するのをやめる」',
  // --- 分詞
  'This is a novel ___ by Aiden.': '小説は「書かれる」側なので過去分詞',
  'Who is ___?': '1語だけの分詞は名詞の**前**に置く',
  'Jason was ___ so he turned on the TV.': '退屈させられた側なので過去分詞。boring は退屈させる側',
  '___ brightly, she waved her hand.': '主語 she がしていることなので現在分詞',
  '___ brothers and sisters, Jake feels lonely.': '分詞構文を打ち消す not は、分詞の前に置く',
  '___ by his rudeness, Jane didn’t want to talk to him.': '怒らされた側なので過去分詞',
  "___ by his rudeness, Jane didn't want to talk to him.": '怒らされた側なので過去分詞',
  // --- 名詞と冠詞
  'There are a few ___.': 'a few の後ろは数えられる名詞の複数形',
  // --- 代名詞と数量詞
  'He was cleaning his room ___ himself.': 'by oneself で「自分ひとりで」',
  "Ricky's smile is more handsome than ___ of his father.": '比べているのは smile（単数）なので that',
  '___ necklaces were given to me by Steve.': 'necklaces は複数なので These',
  'Heaven helps ___ who help themselves.': 'those who 〜 で「〜する人々」。複数の人を受ける',
  'Alison wrote another ___ to John.': 'another の後ろは単数名詞',
  "Mark doesn't have ___ idea how to get there.": '否定文では some ではなく any',
  '___ of them have different stories.': '動詞が have なので主語は複数。One なら has になる',
  'The soccer players made ___ coach happy.': 'players（人の複数）を受けるので their',
  'Jenna did ___ homework on the bus.': 'Jenna は女性なので her',
  'We enjoyed ___ at the party.': '主語が We なので ourselves。enjoy oneself で「楽しむ」',
  // --- 形容詞と副詞
  'This is her ___ performance in this show.': '名詞 performance を説明するので形容詞',
  'The girl has a ___ argument.': '名詞 argument を説明するので形容詞',
  'I am ___ going to go skydiving someday.': '動詞のまとまりを説明するので副詞',
  'The lessons are always ___.': '興味を起こさせる側なので -ing。interested は人が感じる側',
  "Hannah found her parents' wedding photos ___.": 'very は形容詞の前に置く',
  "My father ___ cookies from Bet's Bakery.": '頻度を表す副詞は動詞の前に置く',
  // --- 比較
  'The less junk food we eat, ___ we will be.': 'the + 比較級, the + 比較級 で「〜すればするほど…」',
  'He is taller than ___ student in his class.': 'than any other + 単数名詞 で「ほかのどの〜よりも」',
  'He wanted the ambulance to come ___.': 'as … as possible で「できるだけ〜」',
  // --- 前置詞
  'I knew the vocabulary words from ___.': 'from は前置詞なので後ろは名詞。from memory で「暗記して」',
  'Would you describe him to ___, please?': '前置詞 to の後ろは目的格',
  'I am used to ___ up early in the morning.': 'be used to の to は前置詞。後ろは動名詞',
  // --- 名詞節
  "___ don't understand Korean is obvious.": '文を主語にするときは That で始めてひとまとまりにする',
  'I was ___ I cheated on the exam.': 'be ashamed that 〜 で「〜を恥じている」。語順は形容詞 + that',
  "Forrest doesn't know if ___ to your birthday party.": 'if の後ろは主語 + 動詞。主語を落とさない'
};
