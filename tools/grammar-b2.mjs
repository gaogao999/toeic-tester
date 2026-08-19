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
  { k: 'p80-5', s: 'France is a wonderful country. You ___ visit!', a: 'B', j: '「ぜひ行くべきだ」と強くすすめているので must' },

  // ===== Chapter 2 / Unit 5 Conditionals =====
  // p82 友だちへの置き手紙
  { k: 'p82-1', s: "I ___ more, but I don't have enough time before class.", a: 'C', j: '「もっと探したいけれど（時間がない）」という控えめな言い方' },
  { k: 'p82-2', s: "Well, if I ___ class, I'd be in big trouble with my teacher!", a: 'D', j: 'were to 〜 で「もし仮に〜したら」。主節の I’d と対になる' },
  { k: 'p82-3', s: 'Anyway, if I had found you, ___ this note!', a: 'D', j: '過去の事実と違う話なので、主節は would have been + -ing' },
  { k: 'p82-4', s: 'I ___ you in math class, but I forgot!', a: 'D', j: 'would have + 過去分詞 で「〜したはずだったのに（しなかった）」' },
  // p84 シカゴからの手紙
  { k: 'p84-1', s: 'Greetings from Chicago! I wish you ___ here with me.', a: 'C', j: 'wish の後ろは今そうでないことなので過去形の could' },
  { k: 'p84-2', s: "The past month here has been great, but it's time I ___ you to tell you about how things are going!", a: 'A', j: "It's time + 主語 + 過去形 で「もう〜してもいいころだ」" },
  { k: 'p84-3', s: 'It feels I fit right in ___ I had lived here forever.', a: 'D', j: 'as though 〜 で「まるで〜であるかのように」' },
  { k: 'p84-4', s: "___ the time you took me to the Yankees game, I wouldn't have been interested in baseball.", a: 'C', j: 'If it had not been for 〜 の if を省いて Had を前に出した形' },
  // p85-86 Unit Test（模様が消える乳牛）
  { k: 'p85-1', s: 'If the loss of cow spots ___ less milk, people would know about this strange phenomenon.', a: 'D', j: 'were to 〜 で「もし仮に〜だとしたら」。主節の would と対になる' },
  { k: 'p85-2', s: '___ of a new study released by the Wisconsin School of Agriculture, people would not be aware of this occurrence.', a: 'B', j: 'If it were not for 〜 の if を省いて Were を前に出した形' },
  { k: 'p85-3', s: 'Were it not for the results of a new study, people ___ aware of this occurrence.', a: 'C', j: '今の事実と違う話なので主節は would + 原形' },
  { k: 'p85-4', s: "Scientists aren't sure why this is happening, but it is ___ the cows have lost the ability to produce spotted offspring.", a: 'B', j: 'it is because 〜 で理由を言う' },
  { k: 'p86-1', s: 'Farmers and scientists wish they ___ the problem.', a: 'B', j: 'wish の後ろは今そうでないことなので過去形の could' },
  { k: 'p86-2', s: 'After all, if people ___ their skin colors, it would be disturbing.', a: 'B', j: '今の事実と違う話なので if 節は過去形、主節は would' },
  { k: 'p86-3', s: '___ people knew about this issue.', a: 'B', j: 'If only + 過去形 で「〜であればいいのに」' },
  { k: 'p86-4', s: 'I would rather scientists ___ a solution.', a: 'B', j: 'would rather + 主語 + 過去形 で「〜してほしい」。今のことでも過去形' },

  // ===== Chapter 2 Chapter Test（ショートメッセージの歴史）=====
  { k: 'p87-1', s: 'If you had been a teenager in the 60s, you ___ The Beatles.', a: 'C', j: '過去の事実と違う話なので、主節は would have + 過去分詞' },
  { k: 'p87-2', s: 'Neil Papworth did not think that the first text message he ___ in 1992 would cause such a transformation in communication.', a: 'C', j: 'think より前に送っているので過去完了' },
  { k: 'p87-3', s: "After text messaging ___ in Papworth's company, it could have failed.", a: 'D', j: 'サービスは「作られる」側なので過去の受け身' },
  { k: 'p87-4', o: ['been for had it not', 'had it not been for', "if it haven't been for", 'it had not been for'], s: 'In fact, ___ mobile phone companies deciding to create phone billing plans that included text messaging, the service might not have been so popular today.', a: 'B', j: 'If it had not been for 〜 の if を省いて Had を前に出した形' },
  { k: 'p87-5', s: 'Had it not been for mobile phone companies creating billing plans that included text messaging, the service ___ so popular today.', a: 'D', j: '過去の事実と違う話なので might not have been' },
  { k: 'p88-1', s: 'Next year, text messaging ___ for 20 years.', a: 'D', j: '来年という未来の時点までの積み重ねなので未来完了' },
  { k: 'p88-2', s: 'The amount of growth in this short time ___ mobile phone companies to carefully think about gaining money from text messaging.', a: 'B', j: '今に続く結果なので現在完了。主語は amount（単数）' },
  { k: 'p88-3', s: 'Next time you send a text message, imagine a world without them. It ___ so long ago!', a: 'B', j: '「そんなに昔のことではなかった」と過去をふり返るので過去形' },

  // ===== Chapter 3 Verbals / Unit 1 Infinitives =====
  // p92 宿題をたずねるメール
  { k: 'p92-1', s: "I'm writing ___ out about the English homework for tomorrow.", a: 'B', j: '「〜するために」と目的を表す to 不定詞' },
  { k: 'p92-2', s: 'Was the homework ___ our essays, or did the teacher assign something new?', a: 'C', j: 'be + to 不定詞 で「〜することになっている」。書くのは自分たちなので受け身にしない' },
  { k: 'p92-3', s: 'Mrs. Morse reminded us last week about ___ our homework.', a: 'C', j: 'the need to 〜 で「〜する必要」。名詞を後ろから説明する to 不定詞' },
  { k: 'p92-4', s: '___ seemed like a good way to find out about the assignment.', a: 'B', j: '主語の位置に置く to 不定詞。To write to you で「あなたに書くこと」' },
  // p94 野球部の留守番電話
  { k: 'p94-1', s: "The school is being used ___ an important meeting and the principal doesn't want us to be loud on the field.", a: 'B', j: '「〜するために」と目的を表す to 不定詞。開くのは学校の側' },
  { k: 'p94-2', s: 'I know you really wanted ___ in the practice tonight.', a: 'D', j: '君は「入れてもらう」側なので to 不定詞の受け身' },
  { k: 'p94-3', s: 'I am sorry ___ you.', a: 'D', j: 'sorry より前のことなので to have + 過去分詞' },
  { k: 'p94-4', s: 'Our hope is ___ this weekend, so we really need to practice!', a: 'A', j: 'to 不定詞の意味上の主語は for + 名詞 で表す' },
  // p96 ユースオーケストラのオーディション
  { k: 'p96-1', s: 'We aim ___ the best musicians in the Midwest.', a: 'C', j: 'aim to 〜 で「〜することを目指す」' },
  { k: 'p96-2', s: "We'd like to enable ___ with a dedicated and talented group of young musicians.", a: 'D', j: 'enable + 人 + to 不定詞' },
  { k: 'p96-3', s: 'Our current students tell us ___ our hope of finding new members.', a: 'C', j: 'tell + 人 + to 不定詞。打ち消しの not は to の前' },
  { k: 'p96-4', s: 'We hope to find new members who take the opportunity ___ music very seriously.', a: 'B', j: 'opportunity to 〜 で「〜する機会」' },
  // p98 大雪による休校の放送
  { k: 'p98-1', s: 'After studying the weather reports and seeing snow, we have made the decision ___ school tomorrow.', a: 'B', j: 'the decision to 〜 で「〜するという決定」' },
  { k: 'p98-2', s: 'The teachers and I hope to have the roads ___ by tomorrow night so that school can open on Thursday.', a: 'B', j: 'have + O + 過去分詞。道路は「除雪される」側' },
  { k: 'p98-3', s: "There aren't enough snow plows ___ the snow tonight.", a: 'B', j: 'enough … to 〜 で「〜するのにじゅうぶんな…」' },
  { k: 'p98-4', s: 'Be careful tomorrow. Please persuade ___ from driving.', a: 'A', j: 'persuade + 人 + to 不定詞' },
  // p99-100 Unit Test（言語と帰属意識）
  { k: 'p99-1', s: 'The language that people use helps ___ their sense of identity, especially if their nation is associated with that language.', a: 'D', j: 'help の後ろは to の付かない原形も取れる' },
  { k: 'p99-2', s: '___ a different language from someone else may seem trivial, but sharing a language can unite groups of people.', a: 'B', j: '主語の位置に置く to 不定詞' },
  { k: 'p99-3', s: 'A study ___ how people felt about meeting someone speaking their language when they were traveling abroad.', a: 'D', j: '研究は「行われる」側なので受け身。目的を表す to 不定詞が続く' },
  { k: 'p100-1', o: ['to be with their happy language', 'to be happy with their language', 'happy to be with their language', 'happy with their language to be'], s: 'Without a doubt, these people were ___.', a: 'C', j: 'be 動詞の後ろは形容詞 happy。その後ろに理由を表す to 不定詞が続く' },
  { k: 'p100-2', s: 'Social linguists would like ___ how much the sounds of a language have to do with the cultural similarity of those that speak it.', a: 'D', j: 'would like の後ろは to 不定詞' },
  { k: 'p100-3', s: 'These linguists need ___ them further in order to find answers.', a: 'D', j: 'need の後ろは to 不定詞。動詞を説明するので副詞 systematically' },
  { k: 'p100-4', s: 'If you ___ a linguist, you will have a chance to focus on these questions.', a: 'A', j: 'if 節の中は未来のことでも現在形。grow up to be 〜 で「成長して〜になる」' },
  { k: 'p100-5', s: 'If you grow up to be a linguist, you will have a chance ___ on these questions.', a: 'C', j: 'a chance to 〜 で「〜する機会」' },

  // ===== Chapter 3 / Unit 2 Gerunds =====
  // p102 送迎をお願いする留守番電話
  { k: 'p102-1', s: 'My mom is sick with a really bad flu and feels that ___ is a bad idea.', a: 'C', j: '主語の位置に来るので動名詞' },
  { k: 'p102-2', s: 'I love ___ to school because it gives me good exercise.', a: 'C', j: 'love は動名詞も取れる。習慣として言うので進行形にはしない' },
  { k: 'p102-3', s: 'I am worried about ___ cold, so I thought I would see if you could help me out.', a: 'D', j: 'about は前置詞なので後ろは動名詞' },
  { k: 'p102-4', o: ['carpool', 'carpooling', 'to carpooling', 'being carpools'], s: 'I think an efficient way to get to school is ___.', a: 'B', j: 'be の後ろで「〜すること」を表すので動名詞' },
  // p104 レポートの延長をお願いするメール
  { k: 'p104-1', s: 'To be honest, I never imagined ___ in writing a paper, but this subject is fascinating.', a: 'A', j: 'imagine の後ろは動名詞。興味を持たされる側なので being interested' },
  { k: 'p104-2', s: 'Now I understand ___ of the time you got excited about writing your paper on World War II.', a: 'C', j: '動名詞の意味上の主語は所有格。your telling で「あなたが話してくれたこと」' },
  { k: 'p104-3', o: ['having finished not', 'not having finished', 'not to have finished', 'to not have finished'], s: "I'm sorry for ___, but do you think you could give me an extension?", a: 'B', j: '前置詞 for の後ろは動名詞。打ち消しの not は前に置く' },
  { k: 'p104-4', o: ['to ask', 'my ask', 'my asking', 'for me asking'], s: "I hope you don't mind ___. I'd just like an extra day!", a: 'C', j: 'mind の後ろは動名詞。意味上の主語は所有格で my asking' },
  // p106 数学の本の紹介
  { k: 'p106-1', s: 'He likes ___ math every day because it helps him stay organized.', a: 'B', j: 'like は動名詞も取れる。to using の形は無い' },
  { k: 'p106-2', s: "When asked, most people said they don't mind ___ basic math when buying things in stores or paying bills.", a: 'C', j: 'mind の後ろは動名詞' },
  { k: 'p106-3', s: 'Allen has been studying math his whole life, but he decided ___ his opinions with others by writing them all down.', a: 'C', j: 'decide の後ろは to 不定詞' },
  // OCR が「(D) thinking」の左かっこを落としたため機械では拾えなかった。選択肢は紙面から書き写した
  { k: 'p106-4', o: ['think', 'thought', 'to think', 'thinking'], s: "Now I regret ___ math was boring because Timothy Allen's book taught me so much.", a: 'D', j: 'regret + 動名詞 で「〜したことを悔やむ」' },
  // p108 相乗り制度のお知らせ
  { k: 'p108-1', s: 'Although we are used ___ so much traffic in the parking lot, it does not mean that the traffic is okay.', a: 'C', j: 'be used to の to は前置詞。後ろは動名詞' },
  { k: 'p108-2', s: 'So, we have spent a lot of time ___ this problem.', a: 'C', j: 'spend + 時間 + 動名詞 で「〜して時間を使う」' },
  { k: 'p108-3', s: 'We cannot help ___ that carpooling will solve the problem.', a: 'B', j: "can't help + 動名詞 で「〜せずにいられない」" },
  { k: 'p108-4', s: '___ the website, visit HaywoodSchoolCP.com.', a: 'B', j: '「〜するには」と目的を表す to 不定詞' },
  // p109-110 Unit Test（三つの頭を持つ赤ん坊の話）
  { k: 'p109-1', s: 'Once upon a time, there was a poor woman who was looking forward ___ a beautiful baby.', a: 'C', j: 'look forward to の to は前置詞。後ろは動名詞' },
  { k: 'p109-2', s: 'Despite ___ about caring for the baby, the woman was excited to bring a new life into the world.', a: 'C', j: 'despite は前置詞なので後ろは動名詞' },
  { k: 'p109-3', s: 'The woman was ___ a new life into the world.', a: 'A', j: 'わくわくしているのは女性なので excited。後ろは to 不定詞' },
  { k: 'p109-4', s: 'As the baby grew older, she began ___ that each head had a different personality and different skills.', a: 'B', j: 'begin の後ろは to 不定詞も動名詞も取れるが、to noticing の形は無い' },
  { k: 'p109-5', s: 'One day, after she had finished ___ the baby, she took a nap and dreamed a very strange dream.', a: 'D', j: 'finish の後ろは動名詞' },
  { k: 'p110-1', s: 'She told the man that she regretted ___ the baby better, but the man said not to worry.', a: 'D', j: 'regret + 動名詞。打ち消しの not は動名詞の前' },
  { k: 'p110-2', s: 'When the woman woke up, she remembered ___ of similar things when she was a young girl.', a: 'B', j: 'remember + 動名詞 で「〜したことを覚えている」' },
  { k: 'p110-3', s: 'After the baby became a child, he liked ___ with all of his heads.', a: 'B', j: 'like は動名詞も取れる。話すのは本人なので受け身にしない' },

  // ===== Chapter 3 / Unit 3 Participles =====
  // p112 ミュージカルのオーディション
  { k: 'p112-1', s: 'If you plan to try out, you should become ___ with the songs before the audition.', a: 'A', j: 'become の後ろは形容詞。become acquainted with 〜 で「〜になじむ」' },
  { k: 'p112-2', s: 'There are many roles for actors ___ a part.', a: 'B', j: 'actors を後ろから説明する現在分詞。actors は複数なので who wants は合わない' },
  { k: 'p112-3', s: 'The musical is always ___ and fun to watch.', a: 'C', j: '楽しませる側なので -ing。fun と並ぶので形容詞にそろえる' },
  { k: 'p112-4', o: ['worries', 'worried', 'worrying', 'to worry'], s: 'I know the audition can make you ___.', a: 'B', j: 'make + O + 過去分詞。不安にさせられる側なので worried' },
  // p114 交換留学生の日記
  { k: 'p114-1', s: "___ April now, I'm happy to see spring here in Ohio.", a: 'B', j: '分詞構文に自前の主語 it を付けた形' },
  { k: 'p114-2', s: 'She says every dinner is better with bread ___ on the table.', a: 'D', j: 'with + 名詞 + 現在分詞 で「〜が…している状態で」' },
  { k: 'p114-3', s: '___ to school yesterday, Mathilde told me that she used to take the city bus every morning.', a: 'C', j: '接続詞を残した分詞構文。while + 現在分詞' },
  { k: 'p114-4', s: '___ I live in a small town, there is no way I could take a bus like that!', a: 'D', j: 'considering 〜 で「〜を考えると」。決まった言い方' },
  // p116 ダンス教室からの留守番電話
  { k: 'p116-1', s: "___ you with your bag before, I'm sure that it's yours.", a: 'D', j: '主節より前に見ているので having + 過去分詞' },
  { k: 'p116-2', s: "I know you'll want your ballet slippers ___ this week!", a: 'D', j: '接続詞を残した分詞構文。when + 現在分詞' },
  { k: 'p116-3', s: "___ I know you'll be looking for that bag so you can practice!", a: 'C', j: '主節の主語 I と違うので、分詞構文に自前の主語 you を残す' },
  { k: 'p116-4', s: '___ late, the other dancers found it.', a: 'B', j: '主節の主語（ほかの生徒）と同じなので、主語を省いた現在分詞' },
  // p118 『カンタベリー物語』についてのメール
  { k: 'p118-1', s: '___ to your lecture about writing good essays, I think that I need to write a perfect one!', a: 'D', j: '主節より前に聞いているので having + 過去分詞' },
  { k: 'p118-2', s: '___ in old English, the tales must have undergone some translation.', a: 'B', j: '物語は「書かれた」側なので過去分詞' },
  { k: 'p118-3', s: '___ any others, our translation is not trustworthy as it only has one editor.', a: 'C', j: '主節より前のことなので having + 過去分詞。打ち消しの not は前' },
  { k: 'p118-4', o: ['Frankly spoken', 'Frankly speaking', 'Having frankly spoken', 'With speaking frankly'], s: '___, I’m not sure how true our translation is to the original version.', a: 'B', j: 'frankly speaking で「率直に言うと」。決まった言い方' },
  // p119-120 Unit Test（学校外のスポーツ）
  { k: 'p119-1', s: "Many of today's middle and high school students are playing sports outside of school, ___ adults to wonder if this is a positive or negative addition to young people's lives.", a: 'B', j: '結果を表す分詞構文。「その結果〜させている」' },
  { k: 'p119-2', s: '___ good to be physically healthy, it is tempting to say that playing sports is good for students.', a: 'D', j: '分詞構文に自前の主語 it を残した形' },
  { k: 'p119-3', s: '___ people think that they need to develop skills outside of the classroom.', a: 'D', j: '主節の主語 people と違うので、分詞構文に自前の主語 students を残す' },
  { k: 'p120-1', s: '___ sports, students might not have time for homework.', a: 'C', j: '理由を表す分詞構文。する側なので現在分詞' },
  { k: 'p120-2', s: '___ on sports, students will neglect their other responsibilities.', a: 'B', j: '接続詞を残した分詞構文。「目を向けているなら」なので if + 過去分詞' },
  { k: 'p120-3', s: '___ students, teachers can see that those who play sports are less likely to do their homework.', a: 'C', j: '主節の主語 teachers が見る側なので現在分詞' },
  { k: 'p120-4', s: 'However, ___ employers, experts have reported that corporations are more satisfied with employees who have played sports before.', a: 'D', j: '報告より前に調べているので having + 過去分詞' },
  { k: 'p120-5', s: '___ in competition, sportsmanship, and teamwork, these employees are good to have in the office.', a: 'C', j: '経験を積まされた側なので being + 過去分詞' },

  // ===== Chapter 3 Chapter Test（ゴールドラッシュ）=====
  { k: 'p121-1', s: 'The California Gold Rush occurred in 1849, ___ loads of people west in search of wealth through gold.', a: 'C', j: '結果を表す分詞構文。「その結果、人々を連れてきた」' },
  { k: 'p121-2', s: 'This important event needs ___ in all American history books.', a: 'C', j: '出来事は「教えられる」側なので to 不定詞の受け身' },
  { k: 'p121-3', s: 'At that time, it was difficult ___ wealth.', a: 'D', j: 'difficult は for + 人 + to 不定詞 で「誰にとって」を表す' },
  { k: 'p121-4', s: 'Free gold in California seemed ___ a lot of potential.', a: 'B', j: 'seem to 〜 で「〜のように見える」。持つ側なので受け身にしない' },
  { k: 'p122-1', s: 'Besides ___ to get rich, many came to set up businesses and new lives in California.', a: 'B', j: 'besides は前置詞なので後ろは動名詞' },
  { k: 'p122-2', s: 'Unfortunately, most of the people ___ in the east who traveled west were not satisfied.', a: 'C', j: 'people を後ろから説明する現在分詞。住む側なので -ing' },
  { k: 'p122-3', o: ['satisfied', 'satisfying', 'to satisfy', 'have satisfied'], s: 'Most of the people living in the east who traveled west were not ___.', a: 'A', j: 'be satisfied で「満足させられる」。人が感じる側なので過去分詞' },
  { k: 'p122-4', s: '___ their money for the journey, they were often penniless upon arrival.', a: 'D', j: '到着より前に使っているので having + 過去分詞' },

  // ===== Actual Test =====
  // p126 は Directions の例題で、紙面に答えが刷ってある。設問として使わない
  // p127 くじ引きのお知らせ
  { k: 'p127-1', s: "To raise money for this year's Soccer Championship in Florida, the Ridgewood School soccer team ___ raffle tickets every Monday, Wednesday, and Friday morning of the next month.", a: 'D', j: '来月ずっと続く予定なので未来進行形' },
  { k: 'p127-2', s: 'The tickets will be sold by the players ___ in their homeroom classes.', a: 'D', j: 'players は複数なので themselves。「選手たち自身が」と強める' },
  { k: 'p127-3', o: ['success', 'profession', 'contribution', 'application'], s: 'The team would greatly appreciate your ___.', a: 'C', j: '募金を集める話なので「協力・寄付」。contribution' },
  { k: 'p127-4', s: 'The members will be sending thank you notes to ___ a ticket.', a: 'D', j: 'to の後ろは名詞。everyone を who buys が後ろから説明する' },
  // p128 年表の作り方
  { k: 'p128-1', o: ['To finish your history timelines', 'Your history timelines are finished', 'Your history timelines have been finished', 'Having been finished your history timelines'], s: "___, you will need to list the key dates we've studied this semester.", a: 'A', j: '「〜するには」と目的を表す to 不定詞' },
  { k: 'p128-2', s: 'First, review the key dates from modern European and early American history that ___ in class.', a: 'C', j: '出来事は授業で「取り上げられた」側なので過去の受け身' },
  { k: 'p128-3', s: '___ the key dates by the country that they took place in — this will make it easier for you to complete the timeline for each country.', a: 'B', j: '国ごとにまとめる作業なので group（分類する）' },
  { k: 'p128-4', o: ['your answers correct', 'that you correct answers', 'that your answers are correct', 'what your answers are correct'], s: 'Finally, use your textbooks to check ___.', a: 'C', j: 'check の目的語に文を置くので that で始める名詞節' },
  // p129-130 音楽教室の手伝いを申し出るメール
  { k: 'p129-1', s: 'You said in class last week that you were looking ___ students to help you with a preschool music class.', a: 'B', j: 'look for 〜 で「〜をさがす」' },
  { k: 'p129-2', s: 'Well, I thought about it and I have ___ relevant experience, such as babysitting for my sister and working at my cousin’s summer camp.', a: 'D', j: 'experience は数えられない名詞。many や various は付けられない' },
  { k: 'p130-1', s: 'I know these experiences are just with family, but I hope they are ___ for the position.', a: 'B', j: 'enough to 〜 で「〜するのにじゅうぶん」' },
  { k: 'p130-2', s: 'I am looking to have a work experience with children that ___ my perspective.', a: 'A', j: 'that が指すのは experience（単数）。広げる側なので受け身にしない' },
  // p131-132 携帯電話の記事
  { k: 'p131-1', s: 'Today, cell phones come in many different sizes and shapes, and very ___ they have impressive features such as cameras, reminders, and Internet capability.', a: 'B', j: 'very often で「とてもよく」。頻度を表す' },
  { k: 'p131-2', s: 'Cell phones today, however, are ___ what they were in the past.', a: 'C', j: 'be different from 〜 で「〜と違う」' },
  { k: 'p131-3', s: 'The first cell phones were big, bulky car phones with no special features ___ into them.', a: 'D', j: '機能は「組み込まれる」側なので過去分詞。program into 〜' },
  { k: 'p132-1', o: ['Not using in the car', 'If not used in the car', 'If they did not use cars', 'If not to use in the car'], s: '___ while driving, these cell phones were useless.', a: 'B', j: '接続詞を残した分詞構文。携帯は「使われる」側なので過去分詞' },
  { k: 'p132-2', s: 'Cell phones soon became as they are today ___ our technologically advanced society.', a: 'D', j: 'because of + 名詞 で理由を表す。because だけなら後ろは文' },
  { k: 'p132-3', s: '___ a cell phone can also be a lifesaver in an emergency.', a: 'A', j: '主語の位置に来るので動名詞' },
  // p133-134 ホログラムの記事
  { k: 'p133-1', s: 'Holography is a technique where an image is recorded and then ___ with a laser beam.', a: 'B', j: 'is recorded and (is) reconstructed。and の前後で形をそろえる' },
  { k: 'p133-2', o: ['three-dimensionally appeared', 'appear to be three-dimensional', 'appear to be three-dimensionally', 'being appeared three-dimensional'], s: 'These recorded images, called holograms, ___.', a: 'B', j: 'appear to be の後ろは形容詞。images は複数なので appear' },
  { k: 'p133-3', s: 'This technology ___ since 1947, when it was invented by Dennis Gabor.', a: 'B', j: 'since 1947 は今まで続く期間なので現在完了' },
  { k: 'p133-4', s: 'Only with the appearance of lasers ___ for its practical use in various fields.', a: 'D', j: 'only で始まる語句が文頭に出ると疑問文の語順にひっくり返る' },
  { k: 'p134-1', s: 'This hologram, named Yuki, is projected on a ___ and appears to be singing.', a: 'A', j: '歌っているので舞台の上。stage' },
  { k: 'p134-2', s: "Yuki's holographic mouth moves no ___ the music.", a: 'C', j: 'no later than 〜 で「〜より遅れずに」。比較なので than が要る' },
  { k: 'p134-3', s: 'Although it is very obvious that Yuki is not human, she is still a ___ performer.', a: 'B', j: '人を引きつける側なので -ing。名詞 performer を前から説明する' },
  { k: 'p134-4', s: "___ Yuki gains more popularity outside of Japan, she's sure to do international concerts.", a: 'A', j: 'once 〜 で「いったん〜すれば」' },
  // p135-136 ロゼッタ・ストーン
  { k: 'p135-1', s: 'The writing on this stone made ___ the meaning of hieroglyphics.', a: 'D', j: 'make it + 形容詞 + to 不定詞。it が to 以下の代わりに立つ' },
  { k: 'p135-2', s: 'King Ptolemy V of Egypt ___ the Rosetta Stone as a way of recording an important speech that he gave in 196 BC.', a: 'B', j: '紀元前196年のことなので過去形' },
  { k: 'p135-3', s: 'The stone ___ the decree written in three different languages.', a: 'A', j: '今も変わらない事実なので現在形。contain は状態を表すので進行形にしない' },
  { k: 'p135-4', s: 'The stone contains the decree written in three different languages, ___ archeologists to finally understand the Egyptian system of writing.', a: 'A', j: '結果を表す分詞構文。「その結果〜できるようにした」' },
  { k: 'p136-1', s: 'They needed to have some sort of translator as a key, ___ is why the Rosetta Stone is so important.', a: 'B', j: '前の文全体を受けて説明を足すので which' },
  { k: 'p136-2', s: 'It took a long time ___ hieroglyphics, even with the Rosetta Stone.', a: 'C', j: 'It takes + 時間 + for 人 + to 不定詞' },
  { k: 'p136-3', o: ['the language worked', 'how the language worked', 'how worked the language', 'how did the language work'], s: 'It took them until 1822 to officially announce that they understood ___.', a: 'B', j: '疑問詞が文の中に入ると、疑問文ではなくふつうの語順になる' },
  { k: 'p136-4', s: 'Today, Egyptian hieroglyphics can be read with ease, ___ the Rosetta Stone.', a: 'A', j: 'thanks to 〜 で「〜のおかげで」' },
  // p137-138 コロッセウム
  { k: 'p137-1', s: 'The Colosseum is ___ in the center of the city of Rome.', a: 'B', j: '冠詞 + 形容詞 + 名詞 の語順' },
  { k: 'p137-2', s: 'It is the largest amphitheater ___ during the Roman Empire.', a: 'A', j: '闘技場は「建てられた」側なので過去分詞が後ろから説明する' },
  { k: 'p137-3', s: 'The Colosseum was built ___ it could fit more than 50,000 spectators.', a: 'A', j: 'so that 〜 で「〜できるように」と目的を表す' },
  { k: 'p137-4', o: ['attacks', 'contests', 'defenses', 'attempts'], s: 'The Colosseum was used for many different types of spectacles, but was most often used for gladiator ___.', a: 'B', j: '剣闘士どうしの「試合」なので contest' },
  { k: 'p138-1', s: 'The reason why ___ the "Colosseum" is because of a "colossal" statue of Nero that was built nearby.', a: 'D', j: 'why の後ろは文。建物は「名づけられる」側なので受け身' },
  { k: 'p138-2', s: 'It is ___ possible that the Colosseum was called many different things in the past before it got its current name.', a: 'D', j: 'quite は形容詞 possible を強める副詞' },
  { k: 'p138-3', s: 'Tourists notice that ___ the stage from any location in the amphitheater.', a: 'C', j: 'notice that の後ろは主語と動詞のある文' },
  { k: 'p138-4', s: 'Tourists notice that one can see the stage from any location, proving that the Colosseum is one of ___ ever achieved by the Ancient Romans.', a: 'D', j: 'one of the + 最上級 + 複数名詞' }
  // ここまで
];
