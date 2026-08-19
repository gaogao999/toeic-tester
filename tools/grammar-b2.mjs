/**
 * Master TOEFL Junior Advanced（CEFR B2）の Language Form and Meaning 設問。
 *
 * 形式・キーの付け方・正解をこちらで判定した理由は tools/grammar-b1.mjs と同じ。
 * **教材の解答欄は OCR で潰れていて復元できない**ので、正解は文法的に判定して書いた。
 *
 * B2 は B1 と章立てが同じ（ページ番号まで一致する）。単元の対応は grammar-units.mjs。
 */
export const B2_ITEMS = [
  // ===== Diagnostic Test =====
  // p17 先生への「遠足に参加したい」メール
  { k: 'p17-1', s: 'My friend Marissa told me that you ___ her class to the tide pools this week.', a: 'D', j: '今週の決まった予定なので現在進行形。先生は連れて行く側なので受け身にしない' },
  { k: 'p17-2', s: "Normally I wouldn't ask special permission ___ on a field trip, but I am especially interested in tide pools.", a: 'C', j: 'permission to 〜 で「〜する許可」。名詞を後ろから説明する to 不定詞' },
  { k: 'p17-3', s: "If ___ can't go, do you think I could take their place?", a: 'D', j: '否定・条件の文では some ではなく any。of の後ろに your students が続く' },
  { k: 'p17-4', s: "I hope you don't mind my ___ and I thank you for your time.", a: 'A', j: 'お願いをしている手紙なので「こう尋ねること」。mind の後ろは動名詞' },
  // p18 スペリング大会のお知らせ
  { k: 'p18-1', s: 'Students at our school, ___ Ms. Trudeau, won the regional competition this weekend.', a: 'A', j: '生徒は「率いられる」側なので過去分詞。コンマで挟んだ補足なので動詞は置かない' },
  { k: 'p18-2', s: 'The spelling words were not easy and many of the words were spelled in ___ ways.', a: 'C', j: '難しかったという流れなので「理屈に合わない」つづり方。illogical' },
  { k: 'p18-3', s: 'Anyone who is a good speller ___ trouble with these words!', a: 'C', j: 'would have + 過去分詞 で「〜しただろう」。仮の話として言っている' },
  { k: 'p18-4', o: ['any as team', 'any other teams', 'all the other team', 'all the other teams'], s: 'The Maple School team spelled their words better than ___, qualifying themselves for the state competition.', a: 'D', j: 'than の後ろは「ほかのすべてのチーム」。the other + 複数名詞' },
  // p19-20 短編小説（引っ越してきた少女）
  { k: 'p19-1', s: 'When Chloe moved to a new town and ___ a new school, she was very excited.', a: 'D', j: 'moved と and で並ぶので過去形にそろえる' },
  { k: 'p19-2', s: 'She was sad to ___ her old friends, but was excited about the idea of finding new ones.', a: 'B', j: '引っ越すので古い友だちと「別れる」。leave' },
  { k: 'p19-3', s: 'She was sad to leave her old friends, but was excited about the idea of ___ new ones.', a: 'D', j: 'of は前置詞なので後ろは動名詞' },
  { k: 'p20-1', s: '"Hi, I\'m Timothy and this is my dog, Pat," said Timothy ___ he played with his dog on Chloe\'s quiet street.', a: 'A', j: 'as は「〜しながら」。同時に起きていることをつなぐ' },
  { k: 'p20-2', s: 'Chloe ___ a lot with her family and told Timothy about the places where she had been.', a: 'B', j: '話した時点より前のことなので過去完了' },
  { k: 'p20-3', s: 'Chloe told Timothy about the places where she had been, ___ Timothy taught Chloe all about dogs and the history of the town.', a: 'B', j: 'while は「一方で」。2人がしたことを対比している' },
  // p21-22 オレゴン・トレイル
  { k: 'p21-1', s: 'The Oregon Trail was a migration route that was used by Americans moving west ___ the 19th century.', a: 'D', j: '「19世紀のあいだ」なので during。期間の長さを言う for とは違う' },
  { k: 'p21-2', s: 'Using covered wagons ___ by oxen, travelers usually took four to six months to complete the journey.', a: 'B', j: '荷車は「引かれる」側なので過去分詞が後ろから説明する' },
  { k: 'p21-3', s: 'In the United States at this time, people ___ in crowded and dirty cities.', a: 'C', j: '当時ずっと続いていた状態なので過去進行形。enjoy の後ろは動名詞' },
  { k: 'p21-4', s: '___ hard to imagine taking such a dangerous journey in America today, as the Oregon Trail posed lots of risks.', a: 'B', j: '仮の話なので would。to imagine 以下を受ける形式主語の it' },
  { k: 'p22-1', s: '___ moving out west was what many families felt they had to do.', a: 'A', j: '「危険はあった。それでも」と逆につなぐので Nevertheless' },
  { k: 'p22-2', s: 'Moving out west was ___ they had to do.', a: 'D', j: '「〜すること」をまとめる名詞節。先行詞なしで使えるのは what' },
  { k: 'p22-3', s: 'Others ___ wagons.', a: 'D', j: 'run over を1つの動詞として受け身にし、そのうえで行為者に by を付ける' },
  { k: 'p22-4', s: 'Still, most people made it all the way to Oregon, ___ they could start a new life.', a: 'C', j: '場所（オレゴン）を受けて説明を足すので where' },

  // ===== Chapter 1 Sentence Formation / Unit 1 Subjects & Objects =====
  // p26 小学校の家庭教師の募集
  { k: 'p26-1', s: '___ well in school is not easy for everyone, and there are many students who could use your help!', a: 'B', j: '主語の位置に来るので動名詞。Doing well で「成績がよいこと」' },
  { k: 'p26-2', s: '___ is an inspiring older student to help them.', a: 'D', j: '主語になる名詞節。疑問文ではないので語順は what these students need' },
  { k: 'p26-3', s: '___ with passion for teaching have raised the test scores of many Cove School students.', a: 'B', j: '動詞が have なので主語は複数。文の主語なので動詞を含まない形にする' },
  { k: 'p26-4', s: '___ a fulfilling job should take this opportunity.', a: 'C', j: 'Anyone は単数扱いなので who wants。文の動詞は should take' },
  // p28 雨漏りのお知らせ
  { k: 'p28-1', o: ['leak', 'leaked', 'leaking', 'being leaked'], s: 'Unfortunately, the roof of our 200-year-old school has started ___.', a: 'C', j: 'start は動名詞を取れる。屋根が漏らす側なので受け身にしない' },
  { k: 'p28-2', s: 'The School Board has decided ___ a team of roofers to go about fixing our leak problems.', a: 'C', j: 'decide の後ろは to 不定詞。呼ぶのは教育委員会の側' },
  { k: 'p28-3', s: "We've told them ___ as soon as possible.", a: 'B', j: 'tell + 人 + 文。問題は「直される」側なので受け身' },
  { k: 'p28-4', s: 'This issue will take a long time to resolve, even if the roofers are skilled at ___ solutions.', a: 'D', j: 'be skilled at の at は前置詞なので後ろは動名詞' },
  // p30 ルーブル美術館の記事
  { k: 'p30-1', s: '___ not surprising that the Louvre receives more visitors than any other museum in the world.', a: 'B', j: 'that 以下を受ける形式主語の it。be 動詞が要る' },
  // OCR が「(B) It was」の左かっこを落としたため機械では拾えなかった。選択肢は紙面から書き写した
  { k: 'p30-2', o: ['It is', 'It was', 'There is', 'There was'], s: '___ King Philip II who first built the Louvre.', a: 'B', j: 'It was 〜 who … の強調構文。12世紀のことなので was' },
  { k: 'p30-3', s: '___ many famous works at the museum, but the most famous is the Mona Lisa.', a: 'D', j: 'works は複数なので There are。存在を言うので It is ではない' },
  { k: 'p30-4', s: "Today, the Louvre has made ___ the world's most treasured pieces of art.", a: 'C', j: 'make it + 形容詞 + to 不定詞。it が to 以下の代わりに立つ' },
  // p31-32 Unit Test（ボストン茶会事件）
  { k: 'p31-1', s: 'The Boston Tea Party occurred in 1773 after Britain imposed ___.', a: 'B', j: 'impose A on B で「B に A を課す」' },
  { k: 'p31-2', s: 'This tea tax stated that ___ would be taxed.', a: 'B', j: '主語は all tea。それを coming into the colonies が後ろから説明する' },
  { k: 'p31-3', s: 'Many colonists believed it was unfair ___ if they were not allowed to have representatives in the British government.', a: 'C', j: 'unfair は for + 人 + to 不定詞 で「誰にとって」を表す' },
  { k: 'p31-4', s: 'In November 1773, ___ came to a number of American cities.', a: 'B', j: 'full of 〜 で「〜でいっぱいの」。ships を後ろから説明する' },
  { k: 'p31-5', s: 'All cities protested and managed ___ the ships away, except for Boston.', a: 'C', j: 'manage to 〜 で「なんとか〜する」' },
  { k: 'p32-1', s: 'The governor of Massachusetts, Thomas Hutchinson, refused ___ to be returned to Britain.', a: 'B', j: 'refuse の後ろは to 不定詞。allow + O + to 不定詞 が続く' },
  { k: 'p32-2', s: 'The colonists reacted by boarding the ships in Boston harbor and dumping ___ from the East India Company into the water.', a: 'A', j: 'dumping の目的語なので名詞のまとまり。動詞は付けない' },
  { k: 'p32-3', s: 'This war freed the United States of America from British rule, enabling ___ the country that we know today.', a: 'A', j: 'enable + O + to 不定詞' },

  // ===== Chapter 1 / Unit 2 Complements =====
  // p34 静物画の描き方
  { k: 'p34-1', s: 'Place them in a way that is ___ to you.', a: 'D', j: '見る人にそう感じさせる側なので -ing。2つとも形をそろえる' },
  { k: 'p34-2', s: 'Only stop arranging when you are ___ with the way everything looks.', a: 'B', j: '満足させられる側なので pleased。be pleased with 〜' },
  { k: 'p34-3', s: 'At this point, your objects should leave you feeling ___ to paint them.', a: 'A', j: 'feel の後ろは形容詞。副詞 quite が形容詞 eager を強める' },
  { k: 'p34-4', s: 'After, what you should do is ___ your canvas, find some brushes, choose your colors, and go!', a: 'A', j: 'What you should do is + 原形。後ろの find・choose と形がそろう' },
  // p36 学芸会のスタッフ募集
  { k: 'p36-1', s: 'The performers are not the only ones who make ___', a: 'B', j: 'make + O + 名詞 で「O を〜にする」。語順は目的語が先' },
  { k: 'p36-2', s: 'Student volunteers allow parents, teachers, and students ___ the show.', a: 'C', j: 'allow + 人 + to 不定詞' },
  { k: 'p36-3', s: 'Also, last year, we made some students ___ the set.', a: 'A', j: 'make + O + 原形。to は付けない' },
  { k: 'p36-4', s: "We'll have volunteers ___ in the talent show's program.", a: 'B', j: 'have + O + 過去分詞。名前は「載せられる」側' },
  // p37-38 Unit Test（キング牧師）
  { k: 'p37-1', s: 'Martin Luther King, Jr. was ___ pastor, and civil rights leader who fought for the freedoms of African-Americans.', a: 'A', j: 'activist・pastor・leader が and で並ぶので、動詞を含まない名詞のまとまりにする' },
  { k: 'p37-2', s: 'Equality and peace around the world was ___', a: 'A', j: 'be の後ろに置く名詞節。疑問文ではないので語順は he really wanted' },
  { k: 'p37-3', s: 'King is ___ using nonviolent methods to promote change.', a: 'B', j: 'be famous for 〜 で「〜で有名だ」。for の後ろは動名詞' },
  { k: 'p37-4', s: 'African-American bus riders were required ___ for white passengers.', a: 'C', j: 'be required to 〜 で「〜するよう求められる」' },
  { k: 'p38-1', s: 'King successfully organized a bus boycott to make ___', a: 'A', j: 'make + O + 過去分詞。声は「聞かれる」側' },
  { k: 'p38-2', s: 'He gave his "I Have a Dream" speech, which is considered ___ in history.', a: 'D', j: 'one of the + 最上級 + 複数名詞' },
  { k: 'p38-3', s: 'King became ___ the Nobel Peace prize in 1964.', a: 'C', j: 'the youngest person を to 不定詞が後ろから説明する' },
  { k: 'p38-4', o: ['died youngly', 'died a young', 'dead a young man', 'died a young man'], s: 'Unfortunately, King ___. He was assassinated in Memphis, Tennessee in 1968.', a: 'D', j: 'die a young man で「若くして死ぬ」。die は動詞なので dead は使えない' },

  // ===== Chapter 1 / Unit 3 Subject-Verb Agreement =====
  // p40 レポートの延長をお願いするメール
  { k: 'p40-1', s: '___ to have the weekend to finish.', a: 'D', j: 'What 〜 is + to 不定詞。主語をまとめる what と動詞 is が両方要る' },
  { k: 'p40-2', s: '___ definitely enough time for me to complete it.', a: 'C', j: '時間のまとまりは1つと数えるので単数扱い' },
  { k: 'p40-3', s: "___ paper that I've written for you has been passed in on time, so I hope you'll allow me to take the extension.", a: 'B', j: 'each + 単数名詞 + 単数動詞。has been に合う' },
  { k: 'p40-4', s: "Anyway, ___ such an interesting country, and I'd really like to do a good job on the paper.", a: 'A', j: '国の名前は -s で終わっても単数扱い' },
  // p42 学食の使い方についてのお知らせ
  { k: 'p42-1', s: '___ complaining that students are not respecting the space.', a: 'D', j: 'several of + 複数名詞 は複数扱い。動詞 are が要る' },
  { k: 'p42-2', s: 'Neither the cafeteria workers nor the school principal ___ this behavior acceptable.', a: 'B', j: 'neither A nor B は**近いほう** principal に合わせる。単数なので finds' },
  { k: 'p42-3', s: 'The cafeteria workers and the principal ___ together to make some new rules for the cafeteria.', a: 'D', j: 'A and B は複数扱い。今その最中なので現在進行形' },
  { k: 'p42-4', s: 'Not only ___ followed for the good of our school, but students should also expect punishment if they disobey.', a: 'B', j: 'not only が文頭に出ると疑問文の語順になる' },
  // p44 水泳部の部員募集
  { k: 'p44-1', s: 'Our swim team that ___ twice a week is fun for those who are competitive and for those who are not.', a: 'B', j: 'that が指すのは team（単数）' },
  { k: 'p44-2', s: 'The number of ___ a lot less than it was last year because half of our team graduated.', a: 'C', j: 'the number of + 複数名詞 は単数扱い（a number of なら複数）' },
  { k: 'p44-3', s: 'So, all athletes with some swimming experience ___ a place on the team.', a: 'D', j: '選手は「保証される」側なので受け身。athletes は複数' },
  { k: 'p44-4', s: 'All of the swimmers on our team ___ friendly and excited to swim with new people.', a: 'B', j: 'all of + 複数名詞 は複数扱い' },
  // p45-46 Unit Test（東日本大震災の報道）
  { k: 'p45-1', s: 'A devastating 8.9 magnitude earthquake and a tsunami ___ the country of Japan.', a: 'D', j: 'A and B は複数扱い。今も影響が続いているので現在完了' },
  { k: 'p45-2', s: "Not only ___ horrific damage, but they've also caused problems with Japanese nuclear power plants.", a: 'D', j: 'not only が文頭に出ると疑問文の語順。主語は2つなので have' },
  { k: 'p45-3', s: 'The plant has reported that high levels of radiation have leaked from the plant, ___ incredibly dangerous.', a: 'D', j: 'コンマで補足する関係代名詞は which。levels は複数なので are' },
  { k: 'p46-1', s: 'Parts of the power plant ___ and many people have been concerned about poisonous radiation leaks.', a: 'D', j: 'parts of + 複数名詞 は複数扱い' },
  { k: 'p46-2', s: "The earthquake is a huge disaster for Japan, which ___ one of the world's top economic positions.", a: 'B', j: 'which が指すのは Japan（単数）' },
  { k: 'p46-3', s: 'The number of people who ___ or remained unaccounted for exceeds 10,000.', a: 'C', j: 'who が指すのは people（複数）。今に続く話なので現在完了' },
  { k: 'p46-4', s: 'The number of people who have died or remained unaccounted for ___ 10,000.', a: 'B', j: '主語は the number（単数）。people に引きずられない' },
  { k: 'p46-5', s: '___ such as New Zealand, Australia, China, South Korea, the United Kingdom, and the United States have sent aid to Japan.', a: 'A', j: '国名がいくつも並ぶので Few は合わない。動詞が have なので複数の主語' },

  // ===== Chapter 1 Chapter Test（アメリカの発明）=====
  { k: 'p47-1', s: '___ to instill a modern democratic government, but it is also the home of many inventions and innovations.', a: 'A', j: 'not only が文頭に出ると疑問文の語順。but also と対になる' },
  { k: 'p47-2', s: 'Sometimes ___ that someone had to have the idea first.', a: 'B', j: 'that 以下を受ける形式主語の it。It is important to 〜 の形' },
  { k: 'p47-3', s: 'Americans ___ some impressive innovations in transportation.', a: 'C', j: 'be known for 〜 で「〜で知られている」。as なら肩書きが続く' },
  { k: 'p47-4', s: 'This is because ___ a brand new and very powerful idea.', a: 'C', j: '動名詞が主語なので単数扱いで was' },
  { k: 'p48-1', s: 'Also, the first airplane, ___ of the past 100 years, was invented in America by Wilbur and Orville Wright.', a: 'D', j: 'one of the + 最上級 + 複数名詞' },
  { k: 'p48-2', s: '___ had been invented before but none were as impressive or practical as the model created by the Wright brothers.', a: 'D', j: '動詞が were なので複数名詞。空を飛ぶ側なので現在分詞 flying' },
  { k: 'p48-3', s: 'None were as impressive or practical as the model ___ by the Wright brothers.', a: 'B', j: '模型は「作られる」側なので過去分詞が後ろから説明する' },
  { k: 'p48-4', s: 'Always inventing ___ America is an inspiration.', a: 'C', j: 'things を後ろから説明する関係代名詞 that。things は複数なので change' },

  // ===== Chapter 2 Verb Forms / Unit 1 Basic Verb Forms & Simple Tenses =====
  // p52 動物園見学についてのメール
  { k: 'p52-1', s: "I ___ yesterday's class very interesting.", a: 'A', j: '昨日の授業のことなので過去形' },
  { k: 'p52-2', s: 'While I ___ the zoo was a special place, I never realized how lucky we are to have such a resource in our city.', a: 'C', j: '気づいたときより前から知っていたので過去完了' },
  { k: 'p52-3', s: 'While I had known the zoo was a special place, I never ___ how lucky we are to have such a resource in our city.', a: 'B', j: '授業を受けたときのことなので過去形。気づいたのは自分なので受け身にしない' },
  { k: 'p52-4', s: 'I can go, but I will have to bring my little brother because my parents ___ Italy.', a: 'D', j: 'have gone to 〜 で「〜に行ってしまって今いない」' },
  // p54 中国についての作文
  { k: 'p54-1', s: 'A large Chinese city such as Shanghai always ___ lots of people in the streets.', a: 'A', j: 'always が付くいつものことなので現在形。city は単数' },
  { k: 'p54-2', s: 'Every day, the city center ___ with people who are eating, shopping, and going to work.', a: 'B', j: '中心街は「満たされる」側。毎日のことなので現在形の受け身' },
  { k: 'p54-3', s: "Shanghai was an important city during the Qing Dynasty when the city ___ one of China's biggest seaports.", a: 'A', j: '清の時代のことなので過去形' },
  { k: 'p54-4', s: 'After studying China and its cities, I am sure that I ___ China in the future!', a: 'C', j: 'in the future とあるので未来形' },
  // p55-56 Unit Test（生物の適応）
  { k: 'p55-1', s: 'Mammals, like all other creatures, ___ to their environment or perish.', a: 'A', j: '助動詞の後ろは原形。either A or B で adapt と perish が並ぶ' },
  { k: 'p55-2', s: 'Adaptation ___ when an animal with traits suited to survival produces offspring.', a: 'A', j: 'いつでも当てはまる事実なので現在形' },
  { k: 'p55-3', s: 'Conversely, an organism with disadvantageous or harmful traits ___ fewer or no offspring.', a: 'C', j: 'これから先どうなるかの話なので will' },
  { k: 'p55-4', s: 'In his book On the Origin of Species, which ___ this theory, Darwin wrote about natural selection.', a: 'B', j: 'which が指すのは book（単数）。本の中身は今も変わらないので現在形' },
  { k: 'p56-1', s: 'Darwin wrote: "The preservation of favorable variations and the destruction of those which are injurious, I ___ Natural Selection."', a: 'A', j: 'ダーウィンが書いた当時のことなので過去形' },
  { k: 'p56-2', s: 'By "fittest," Darwin ___ the largest, smartest, or strongest members of a group.', a: 'A', j: '当時ダーウィンが何を指したかの話なので過去形' },
  { k: 'p56-3', s: 'Instead, he ___ the term to refer to those members of a species that produce the largest number of surviving offspring.', a: 'B', j: '前の文の did not mean と時をそろえて過去形' },
  { k: 'p56-4', s: 'If a species cannot leave offspring that can adapt to an environment, that species ___', a: 'D', j: 'if 節は現在形でも、**主節は未来形**にする' },

  // ===== Chapter 2 / Unit 2 Continuous & Perfect Tenses =====
  // p58 発表のしかた
  { k: 'p58-1', s: 'First, since you ___ your project to the entire class, you will need some visual aids.', a: 'C', j: 'これからする発表の話なので現在進行形。近い未来の予定を表す' },
  { k: 'p58-2', s: 'Second, try to remember what you ___ when you began the project.', a: 'D', j: '始めたときに考えていたことなので過去進行形' },
  { k: 'p58-3', s: 'Finally, everyone ___ to watch a presenter who is unprepared!', a: 'B', j: 'everyone は単数扱い。hate は状態を表すので進行形にしない' },
  { k: 'p58-4', s: "Presenting your project to the class, you ___ all the hard work you've done.", a: 'C', j: 'これから発表するときのことなので未来進行形' },
  // p60 通知表のお知らせ
  { k: 'p60-1', s: 'Your report cards ___ in your school mailboxes since Monday.', a: 'C', j: 'since Monday は月曜から今まで。継続なので現在完了' },
  { k: 'p60-2', s: 'I ___ to tell you earlier, but I forgot.', a: 'D', j: '「言うつもりだった（が言わなかった）」なので過去進行形' },
  { k: 'p60-3', s: 'Some of you ___ your mailboxes already, but I know there are others who have not.', a: 'C', j: 'may have + 過去分詞 で「もう〜したかもしれない」' },
  { k: 'p60-4', s: 'If you work hard, by the end of this semester you ___ very high grades.', a: 'D', j: 'by the end of 〜 は「〜までに」。未来のある時点で終わっているので未来完了' },
  // p61-62 Unit Test（ワニの見分け方）
  { k: 'p61-1', s: 'These two animals ___ as one.', a: 'C', j: 'これまでずっと一緒くたにされてきたので現在完了の受け身' },
  { k: 'p61-2', s: 'In this essay, I ___ people about the differences between these two large reptiles.', a: 'D', j: 'これから書いていくことなので未来進行形' },
  { k: 'p61-3', s: 'Hopefully, after reading this essay, readers ___ their opinions on these creatures!', a: 'D', j: '読んだあとのことなので未来形' },
  { k: 'p61-4', s: 'First, people ___ to recognize the different shapes of their snouts.', a: 'A', j: 'need は状態を表すので進行形にしない。今のことなので現在形' },
  { k: 'p62-1', s: 'In contrast, crocodiles ___ mammals and small fish with their narrow snout.', a: 'B', j: 'いつものことなので現在形。頻度の副詞は動詞の前' },
  { k: 'p62-2', s: 'Second, their body colors ___ different, too.', a: 'A', j: 'appear は状態を表すので進行形にしない' },
  { k: 'p62-3', s: "However, it's sad that millions of alligators ___ for their skins.", a: 'D', j: 'ワニは「殺される」側。今も続くことなので現在完了の受け身' },
  { k: 'p62-4', s: 'I ___ these animals for a long time and believe it is important for people to know about their differences.', a: 'D', j: '長いあいだ続けて今もしているので現在完了進行形' },

  // ===== Chapter 2 / Unit 3 Passive Voice =====
  // p64 プール休業のお知らせ
  { k: 'p64-1', s: 'It was open for the past month, but ___ the club while it gets remodeled.', a: 'B', j: 'プールは「閉められる」側なので受け身。行為者はクラブなので by' },
  { k: 'p64-2', s: 'The pool will be closed by the club while it ___.', a: 'C', j: 'while の中は未来のことでも現在形。get + 過去分詞 も受け身を表す' },
  { k: 'p64-3', s: 'We are sorry for the inconvenience, but the pool has needed ___ for a long time.', a: 'D', j: 'プールは「直される」側なので to 不定詞の受け身' },
  { k: 'p64-4', s: 'If you ___ the club, you can use the pool at Essex Country Club down the street for no charge.', a: 'A', j: 'belong は状態を表すので進行形にしない。受け身にもしない' },
  // p66 落とし物のお知らせ
  { k: 'p66-1', s: 'I ___ to take it off during gym class by my teacher.', a: 'D', j: '先生に「言われた」側なので過去の受け身' },
  { k: 'p66-2', s: 'I was asked to take it off during gym class and accidentally ___ it on the soccer field.', a: 'A', j: '置き忘れたのは自分なので受け身にしない。過去形' },
  { k: 'p66-3', s: 'Mine has a special patch ___ the sleeve with my name, Kevin, on it.', a: 'C', j: 'ワッペンは「縫い付けられている」側なので過去分詞。sew onto 〜' },
  { k: 'p66-4', s: 'I hope the sweatshirt ___ the cleaning staff.', a: 'D', j: 'do away with を1つの動詞として受け身にし、そのうえで行為者に by を付ける' },
  // p68 ホームステイについてのメール
  { k: 'p68-1', s: 'I was ___ with a new family before I did it, too!', a: 'D', j: 'be concerned about 〜 で「〜が気がかりだ」。about の後ろは動名詞' },
  { k: 'p68-2', s: 'Actually, they were surprised ___ my ability to speak German.', a: 'B', j: 'be surprised at 〜 で「〜に驚く」' },
  { k: 'p68-3', s: '___ to learn a new language is to immerse yourself in it.', a: 'D', j: 'It is said that 〜 で「〜と言われている」' },
  { k: 'p68-4', s: 'If you ___ meeting them, I can give you their contact information.', a: 'A', j: 'be interested in 〜。興味を持つ側なので interested' },
  // p69-70 Unit Test（マリー・アントワネット）
  { k: 'p69-1', s: '___ that Marie Antoinette is the most famous queen of France.', a: 'C', j: 'It is said that 〜。say は「言われる」側なので受け身' },
  { k: 'p69-2', s: 'In fact, she was born in Vienna, Austria, but ___ French royalty in order to unite France and Austria.', a: 'C', j: 'be married to 〜 で「〜と結婚する」。政略結婚なので had to' },
  { k: 'p69-3', s: 'Antoinette ___ beautiful and interested in fashion.', a: 'C', j: 'be considered to be 〜 で「〜だと思われている」。当時のことなので過去' },
  { k: 'p69-4', s: 'The common people started a revolution, but Antoinette was not ___ being in danger, even though she should have been.', a: 'D', j: 'be worried about 〜 で「〜を心配する」。心配する側なので worried' },
  { k: 'p70-1', s: "Although the French liked Antoinette at the beginning, they began to ___ being snobbish and too sympathetic to France's enemies.", a: 'A', j: 'accuse + 人 + of 〜 で「人を〜だと責める」' },
  { k: 'p70-2', s: 'The people involved in the revolution ___ the monarchy.', a: 'D', j: 'be satisfied with 〜 で「〜に満足する」' },
  { k: 'p70-3', s: 'After destroying the monarchy, they believed that Antoinette ___ so they executed her using a guillotine.', a: 'D', j: '殺される側なので受け身。「殺されなければならない」で had to be killed' },
  { k: 'p70-4', s: 'What ___ for the death of Marie Antoinette?', a: 'B', j: 'be to blame で「責めを負うべきだ」。形は能動だが意味は受け身' },

  // ===== Chapter 2 / Unit 4 Modal Auxiliary Verbs =====
  // p72 火災発生の校内放送
  { k: 'p72-1', s: 'Attention students. I hope you ___ hear me.', a: 'A', j: '「聞こえていますか」なので可能を表す can' },
  { k: 'p72-2', s: 'There is a fire in our school and the fire alarms have failed to go off. You ___ get out of the building as soon as possible.', a: 'B', j: '火事なので強い指示。must' },
  { k: 'p72-3', s: 'You ___ panic. Your teacher will lead you to the nearest exit.', a: 'D', j: "don't have to は「〜しなくてよい」。「あわてなくていい」" },
  { k: 'p72-4', s: 'This fire ___ spread quickly, so it is important to evacuate now.', a: 'C', j: 'could は「〜する可能性がある」。まだ起きていないことを言う' },
  // p74 スキー旅行中止のお知らせ
  { k: 'p74-1', s: 'Because of the recent rain and warm weather, students will not ___ enjoy their time in the snow.', a: 'D', j: 'will の後ろに can は置けない。be able to を使う' },
  { k: 'p74-2', s: 'Student Programming ___ come up with another activity.', a: 'A', j: '中止になった以上、別の催しを考える必要がある。has to' },
  { k: 'p74-3', s: 'If you have other ideas, you ___ submit your ideas to your class representative.', a: 'A', j: 'ought to は「〜するとよい」という勧め' },
  { k: 'p74-4', s: 'If you ___ get your money back than do another activity, please see Miss Stacy at the front office.', a: 'B', j: 'would rather A than B で「B より A したい」' },
  // p76 アフリカからのメール
  { k: 'p76-1', s: 'I ___ sooner, but I have been so busy here in Africa.', a: 'D', j: 'should have + 過去分詞 で「〜すべきだったのに（しなかった）」' },
  { k: 'p76-2', s: 'I know that you insisted I ___ you as soon as I got here, but this is the first time that I’ve had some free moments.', a: 'A', j: 'insist が要求を表すとき、後ろの文は should が省かれて原形' },
  { k: 'p76-3', s: 'By the way, you ___ that I just ignored your advice to bring extra water bottles.', a: 'C', j: 'might have + 過去分詞 で「〜と思ったかもしれない」' },
  { k: 'p76-4', s: "Anyway, it is essential that we ___ in touch as I'll be gone for an entire year.", a: 'B', j: 'It is essential that 〜 の中は should が省かれて原形' },
  // p78 スクールバスの案内
  { k: 'p78-1', s: 'If you ___ the bus home from school, then I recommend rechecking your school bus number.', a: 'B', j: 'would like to + 原形。would rather に to は付かない' },
  { k: 'p78-2', s: 'You ___ happy about this as the longest ride will only be 30 minutes.', a: 'A', j: 'may well 〜 で「〜するのももっともだ」' },
  { k: 'p78-3', s: 'I ___ remind you that the longest ride used to be 45 minutes.', a: 'D', j: 'may as well + 原形 で「ついでに〜しておこう」' },
  { k: 'p78-4', s: 'You had better ___ the schedule in the front lobby to make sure you get on the correct bus.', a: 'A', j: 'had better の後ろは to の付かない原形' },
  // p79-80 Unit Test（フランス旅行）
  { k: 'p79-1', s: 'Having visited many countries, I would rather ___ in France than anywhere else.', a: 'A', j: 'would rather の後ろは to の付かない原形' },
  { k: 'p79-2', s: 'If you travel in France, you ___ Le Mont Saint-Michel.', a: 'D', j: 'should は「ぜひ〜するとよい」という勧め' },
  { k: 'p79-3', s: 'It ___ connected to the mainland by a tidal bridge, but this no longer remains.', a: 'A', j: 'used to be 〜 で「昔は〜だった（今は違う）」。be used to とは別物' },
  { k: 'p80-1', s: 'If you visit Le Mont Saint-Michel, you ___ wear athletic shoes because there are a lot of stairs!', a: 'B', j: 'might want to 〜 で「〜したほうがいいかも」という控えめな勧め' },
  { k: 'p80-2', s: 'Avignon was where the pope lived during the 14th century. You ___ there if you are interested in the history of Catholicism.', a: 'C', j: 'ought to は「〜するとよい」という勧め' },
  { k: 'p80-3', s: 'If you visit Avignon, you ___ visit the rest of the Provencal region.', a: 'D', j: 'may as well + 原形 で「ついでに〜するとよい」' },
  { k: 'p80-4', s: 'It is a beautiful region in the South of France that ___ around the world for its beauty.', a: 'D', j: '地域は「知られる」側なので受け身' },
  { k: 'p80-5', s: 'France is a wonderful country. You ___ visit!', a: 'B', j: '「ぜひ行くべきだ」と強くすすめているので must' }
  // ここまで
];
