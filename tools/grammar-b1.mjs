/**
 * Master TOEFL Junior Intermediate（CEFR B1）の Language Form and Meaning 設問。
 *
 * **教材の解答欄は OCR で復元できなかった。**多段組みの表が潰れていて、
 * `1(0)` `IDI` `2NC)` `(SAD)` のような文字列にしかならない。番号も順序も崩れている。
 * そこで正解は**こちらで文法的に判定して書いた**。1問ずつ根拠（j）を残してあるので、
 * 疑わしいものは根拠を見て直せる。
 *
 * 選択肢そのものは教材から機械で拾う（parse-grammar-lfm.mjs）。
 * ここが持つのは、機械では取れない次の3つだけ:
 *
 *   s … 空所を含む1文。**長文をそのまま出すと問題が重くなる**ので、
 *       空所の意味が決まる範囲だけを人が切り出した
 *   a … 正解の記号（A〜D）
 *   j … 日本語の解説。「なぜそれが正解か」を1文で
 *
 * キーは `p<ページ>-<そのページで何組目か>`。教材の設問番号ではなく**組の順番**を使う。
 * 設問番号は OCR で飛ぶことがあるが、選択肢の組の順番は崩れないため。
 *
 * o を書いたものは、OCR が選択肢に本文を巻き込んでいたもの。人が直した全文で上書きする。
 */
export const B1_ITEMS = [
  // ===== Diagnostic Test =====
  // p17 学校のお知らせ（パレード）
  { k: 'p17-1', s: 'To celebrate the coming of summer, the 6th grade class ___ a parade on Tuesday.', a: 'D', j: '来週の火曜という決まった予定なので未来。will be having で「〜することになっている」' },
  { k: 'p17-2', s: 'The entire parade was planned ___ the 6th grade students and their parents.', a: 'C', j: '受け身の文で「誰によって」を言うのは by' },
  { k: 'p17-3', s: 'The parade should be ___!', a: 'C', j: 'quite a(n) + 形容詞 + 名詞 の語順。わくわくさせる側なので exciting（excited は人が感じる側）' },
  { k: 'p17-4', s: 'The 6th graders will be throwing candy to ___.', a: 'D', j: 'to の後ろは名詞。everyone を who comes が後ろから説明する' },
  // p18 道順の説明
  { k: 'p18-1', s: '___ to Hyde Park from our school, you should first take a left.', a: 'C', j: '「〜するには」と目的を表す to 不定詞。文頭に置ける' },
  { k: 'p18-2', s: 'Keep walking straight ___ the road splits.', a: 'B', j: '「道が分かれるまで」ずっと歩き続ける。継続の終わりは until' },
  { k: 'p18-3', s: 'When you ___ there, the gym teachers will tell you what to do.', a: 'A', j: '時を表す when の中は、未来のことでも現在形で言う' },
  { k: 'p18-4', s: '___ a friend with you in case you get lost.', a: 'B', j: 'It is best to 〜（〜するのがいちばんよい）。it が to 以下の代わりを務める' },
  // p19 生徒の作文（SNS）
  { k: 'p19-1', s: 'Social networking sites are now ___ widely by schools and businesses.', a: 'C', j: '「今〜されている最中」なので進行形の受け身 be being + 過去分詞' },
  { k: 'p19-2', s: '___ sites are used because they can give a lot of information out to many people.', a: 'D', j: '前の文で挙げた SNS を指すので These。sites は複数なので Each・Any は合わない' },
  { k: 'p19-3', s: 'Most middle school students use social networking sites, ___ our school has decided to use them.', a: 'C', j: '前の文全体を受けて「だから〜」。which is why の形' },
  // p20 生徒の作文（続き）
  { k: 'p20-1', s: 'Schedule ___ is one of the reasons why our principal started using social networking.', a: 'C', j: '次の文で「授業が中止になるか伝えたい」と続くので、予定の変更（schedule changing）' },
  { k: 'p20-2', s: 'He wants to be able to tell students and parents if classes ___.', a: 'D', j: '授業は「中止にされる」側なので受け身。classes は複数なので are canceled' },
  { k: 'p20-3', s: 'They are a great way ___.', a: 'D', j: 'a way to 〜（〜するための方法）。way を後ろから説明する to 不定詞' },
  // p21 動物の本（有袋類）
  { k: 'p21-1', s: 'A marsupial is a mammal that carries its babies in a small pouch ___ its stomach.', a: 'B', j: 'おなかに接している袋なので on。in だと「おなかの中」になる' },
  { k: 'p21-2', s: 'This is because their babies are not born fully ___.', a: 'C', j: '「じゅうぶんに育ちきらないうちに生まれる」。develop は育つ' },
  { k: 'p21-3', s: "It can't stay warm ___, so it needs to live and grow inside its mother's pouch.", a: 'A', j: 'by itself で「自分だけの力で」。ほかの3つはこの意味にならない' },
  // p22 動物の本（続き）
  { k: 'p22-1', s: "Some joeys ___ leave their mother's pouch for short periods of time.", a: 'B', j: 'すべての joey がそうするわけではないので「〜することもある」の may' },
  { k: 'p22-2', s: "Some joeys may leave their mother's pouch for short periods of time, ___ its warmth.", a: 'C', j: 'only to 〜 で「結局〜するだけ」。出ていってもまた温かい袋に戻る' },
  { k: 'p22-3', s: 'The most famous marsupials are the kangaroo and the koala, ___.', a: 'D', j: 'both が native to Australia 全体にかかる。both native to 〜 の語順' },
  { k: 'p22-4', s: "In fact, 70% of the world's marsupials ___ in Australia and New Zealand.", a: 'A', j: '70% of + 複数名詞 が主語なので動詞も複数扱い' },
  { k: 'p22-5', s: 'There is only one marsupial in North America, ___ the possum.', a: 'D', j: '前の内容を受けて説明を足す関係代名詞。もの・ことを受けるので which' },

  // ===== Chapter 1 Sentence Formation / Unit 1 Subjects & Objects =====
  // p26 家庭教師の募集
  { k: 'p26-1', s: '___ need tutors to help them with their homework.', a: 'B', j: '主語は students、動詞は need。A は are が余分で動詞が二重になる' },
  { k: 'p26-2', s: '___ is help these students.', a: 'D', j: '主語になる名詞節。疑問文ではないので語順は what you can do' },
  { k: 'p26-3', s: '___ is not only a great way to help other students, but it is also good for making new friends.', a: 'A', j: '主語の位置に来るのは動名詞。Tutoring で「人に教えること」' },
  { k: 'p26-4', s: '___ should come to the information meeting on Friday, September 8th at 3:00 in the school library.', a: 'C', j: '興味を持つのは人の側なので is interested。Anyone は単数なので are は合わない' },
  // p28 校長からのお知らせ
  { k: 'p28-1', s: 'The school custodians do not want ___ all of your messes.', a: 'C', j: 'want の後ろは to 不定詞' },
  { k: 'p28-2', s: 'I think ___.', a: 'B', j: 'think の後ろは文がそのまま来る。behavior は「変えられる」側なので受け身' },
  { k: 'p28-3', s: 'I know you enjoy ___ your names, but it is difficult for the school custodians to erase them.', a: 'B', j: 'enjoy の後ろは動名詞。to 不定詞は取れない' },
  { k: 'p28-4', s: 'I know you are good at ___ responsibility for your actions, so please stop.', a: 'D', j: 'at は前置詞なので後ろは動名詞' },
  // p30 生徒から先生へのメール
  { k: 'p30-1', s: "I'm writing to you about next week's exam. I thought ___ you.", a: 'C', j: 'think it + 形容詞 + to 〜。it が to 以下の代わりに目的語の位置に立つ' },
  { k: 'p30-2', s: '___ a number of questions I have about what will be on the exam.', a: 'D', j: 'a number of + 複数名詞 は複数扱い。存在を言うので There are' },
  { k: 'p30-3', s: 'For example, ___ in 1864 that the Civil War started.', a: 'B', j: 'It is/was 〜 that … の強調構文。過去のことなので was' },
  { k: 'p30-4', s: "___ possible that I'll have more questions before the exam.", a: 'A', j: 'that 以下を受ける形式主語の it。There is possible とは言えない' },
  // p31-32 Unit Test（自由の女神）
  { k: 'p31-1', s: 'The Statue of Liberty was given to the United States by the French in 1886. ___ by Frederic Bartholdi.', a: 'D', j: '像は「設計された」側なので受け身。主語 It が要る' },
  { k: 'p31-2', s: 'Frederic Bartholdi started ___ it in the 1860s.', a: 'B', j: 'start は動名詞を取れる。to working on の形は無い' },
  { k: 'p31-3', s: 'Bartholdi enjoyed designing the statue. He wanted ___ a face that looked like his mother.', a: 'C', j: 'want の後ろは to 不定詞。作るのは彼自身なので受け身にしない' },
  { k: 'p31-4', s: 'He wanted to make a face that looked like ___!', a: 'D', j: '比べているのは「顔と顔」。母の顔 = his own mother’s（face を省く）' },
  { k: 'p32-1', s: 'During this time, ___ a strong friendship between France and the United States.', a: 'C', j: 'friendship は単数なので There was。it was だと何を指すか決まらない' },
  { k: 'p32-2', s: 'The French wanted to celebrate this friendship by ___ the American people a large gift.', a: 'C', j: 'by は前置詞なので後ろは動名詞' },
  { k: 'p32-3', s: 'So they gave ___ a large statue of Lady Liberty.', a: 'C', j: 'give + 人 + もの の語順。人は the American people を受ける them' },
  { k: 'p32-4', o: ['the thing seeing first', 'their first seen thing', 'they saw the first thing', 'the first thing they saw'], s: 'When people came by boat to the United States, ___ was the Statue of Liberty.', a: 'D', j: '主語は the first thing。それを they saw が後ろから説明する' },

  // ===== Chapter 1 / Unit 2 Complements =====
  // p34 図書館の案内
  { k: 'p34-1', s: 'What you need is ___ a book that you like.', a: 'C', j: '「〜すること」を be の後ろに置くので to 不定詞' },
  { k: 'p34-2', s: 'Your problem is ___ that are good for you.', a: 'C', j: 'be の後ろに文を置くときは that で始める名詞節にする' },
  { k: 'p34-3', s: 'To find one that is ___, you should go to the school library.', a: 'D', j: 'is の後ろは形容詞。enjoyable で「楽しめる」' },
  { k: 'p34-4', s: 'A book you love feels ___ to have.', a: 'B', j: 'feel は後ろに形容詞を取る。well は体調のときだけ' },
  // p36 家庭教師をさがす広告
  { k: 'p36-1', s: 'I really want to learn Chinese — some might call ___!', a: 'C', j: 'call + 人 + 呼び名 の語順' },
  { k: 'p36-2', s: 'I find Chinese very ___.', a: 'C', j: '興味を起こさせる側なので interesting。interested は人が感じる側' },
  { k: 'p36-3', s: 'Studying Chinese alone has caused me ___ a tutor.', a: 'C', j: 'cause + 人 + to 不定詞' },
  { k: 'p36-4', s: "I've heard many students ___ Chinese in the school cafeteria.", a: 'A', j: 'hear などの知覚動詞は to の付かない原形を取る' },
  // p37-38 Unit Test（エルヴィス・プレスリー）
  { k: 'p37-1', s: 'Elvis Presley was ___ who was born in 1935.', a: 'D', j: '冠詞 + 形容詞のまとまり + 名詞 の語順。singer が中心の名詞' },
  { k: 'p37-2', s: 'He is ___ his live performances, movies, and radio hits.', a: 'D', j: 'be well-known for 〜 で「〜で有名だ」。as なら肩書きが続く' },
  { k: 'p37-3', s: 'Producers decided to change the name when Elvis\'s song "Love Me Tender" became ___.', a: 'A', j: 'become の後ろは形容詞' },
  { k: 'p37-4', s: 'At this time, African-Americans were ___ against and not allowed on the radio.', a: 'C', j: '差別される側なので過去分詞。動詞を説明するので副詞 largely' },
  { k: 'p38-1', s: 'Elvis helped make ___.', a: 'C', j: 'make + O + 過去分詞。音楽は「聞かれる」側' },
  { k: 'p38-2', s: 'Singing African-American music made Elvis ___.', a: 'B', j: 'a + 副詞 + 形容詞 + 単数名詞 の語順。him ひとりなので figures は不可' },
  { k: 'p38-3', s: 'Singing their own music was ___.', a: 'C', j: '「〜すること」をまとめる名詞節。先行詞なしで使えるのは what' },
  { k: 'p38-4', s: 'They were forced to allow Elvis ___ their music.', a: 'B', j: 'allow + 人 + to 不定詞' },

  // ===== Chapter 1 / Unit 3 Subject-Verb Agreement =====
  // p40 生徒から先生へのメール（クラリネット）
  { k: 'p40-1', s: '___ me happy, and I was sad to miss the practice.', a: 'D', j: '動名詞が主語なので単数扱い。makes' },
  { k: 'p40-2', s: '___ that I had a dentist appointment.', a: 'B', j: '主語は The reason（単数）。動詞 is が要る' },
  { k: 'p40-3', s: "___ a long time to spend at the dentist's!", a: 'C', j: '時間のまとまりは1つと数えるので単数扱い' },
  { k: 'p40-4', s: '___ to come to practice next week.', a: 'D', j: 'What 〜 is + to 不定詞。主語をまとめる what と動詞 is が両方要る' },
  // p42 コンピュータ教室の案内
  { k: 'p42-1', s: '___ disappointed with their computer skills.', a: 'D', j: 'A few of + 複数名詞 は複数扱い。動詞 are が要る' },
  { k: 'p42-2', s: 'Not only the students but also the teachers ___ that the school should offer computer classes.', a: 'A', j: 'not only A but also B は **B のほう**に動詞を合わせる。teachers は複数' },
  { k: 'p42-3', s: '___ 7th and 8th graders are welcome to sign up.', a: 'C', j: '2つの学年をどちらも指すので Both' },
  { k: 'p42-4', s: 'Neither Monday ___ any money.', a: 'C', j: 'neither A nor B。動詞は**近いほう** classes に合わせて cost' },
  // p44 学食のお知らせ
  { k: 'p44-1', s: 'A number of new ___ available in the school cafeteria.', a: 'B', j: 'a number of + 複数名詞 は複数扱い（the number of なら単数）' },
  { k: 'p44-2', s: 'One-third of the menu ___ new.', a: 'A', j: '分数 of の後ろが単数名詞なら動詞も単数' },
  { k: 'p44-3', s: "The cafeteria's new menu, made by Mr. Rogers, ___ some meals suggested by students.", a: 'B', j: '主語は menu（単数）。間に挟まった made by 〜 に引きずられない' },
  { k: 'p44-4', s: 'The Miscoe cafeteria, which ___ open from 11:00 to 2:00, hopes to please students with this menu change.', a: 'A', j: 'which が指すのは cafeteria（単数）' },
  // p45-46 Unit Test（ロイヤルウェディング）
  { k: 'p45-1', s: 'Prince William of Wales and Catherine "Kate" Middleton ___.', a: 'D', j: 'A and B は複数扱い。結婚したばかりなので現在完了の受け身' },
  { k: 'p45-2', s: "The number of students wanting to go to St. Andrew's ___ since William decided to go there.", a: 'C', j: 'the number of 〜 は単数扱い。since があるので現在完了' },
  { k: 'p45-3', s: "Not only ___ the world, but it is also expected to influence women's fashion.", a: 'B', j: 'not only が文頭に出ると疑問文の語順にひっくり返る' },
  { k: 'p46-1', s: "Today, many fashion secrets ___, such as the style of Kate's dress.", a: 'D', j: 'secrets は複数で「明かされる」側。have been revealed' },
  { k: 'p46-2', s: "A number of ___ that women all over the world are sure to copy Kate Middleton's wedding dress.", a: 'C', j: 'a number of の後ろは複数名詞。プランナーは「言う」側なので受け身にしない' },
  { k: 'p46-3', s: "The people who ___ William and Kate are sure they'll be happy together.", a: 'C', j: 'who が指すのは people（複数）。今も続く経験なので現在完了' },
  { k: 'p46-4', s: 'The number of people at the wedding exceeded 1,500, ___ an extremely large number of guests.', a: 'C', j: '前の文全体を受けて説明を足すので which。数はひとまとまりなので is' },
  { k: 'p46-5', s: 'The guests who have been invited to the after-party ___ now getting ready to go.', a: 'B', j: '主語は guests（複数）。今まさに支度中なので進行形' },

  // ===== Chapter 1 Chapter Test（活版印刷）=====
  { k: 'p47-1', s: '___ for the fast printing of materials, but it also changed the future of Europe.', a: 'B', j: 'not only が文頭に出ると疑問文の語順になる。did + 原形' },
  { k: 'p47-2', s: '___ that before the printing press, all written works had to be copied by hand.', a: 'B', j: 'that 以下を受ける形式主語の it。It is important to 〜 の形' },
  { k: 'p47-3', s: '___ not possible for either the rich or the poor because they were too expensive.', a: 'A', j: '動名詞が主語なので単数扱いで was' },
  { k: 'p48-1', s: 'The printing press allowed books ___ cheaply and in great quantity.', a: 'C', j: '本は「作られる」側なので to 不定詞の受け身' },
  { k: 'p48-2', s: 'All the churches and all the families in Europe could have ___.', a: 'A', j: 'many + 複数名詞。many of を使うなら the が要る' },
  { k: 'p48-3', s: 'Having the bible in the home made people ___ differently about religion.', a: 'A', j: 'make + O + 原形。to は付けない' },
  { k: 'p48-4', s: 'Both the wealthy ___ the poor learned to read.', a: 'C', j: 'both A and B。or や nor とは組にならない' },
  { k: 'p48-5', s: 'Now, almost all of the adults in Europe ___ how to read.', a: 'A', j: '今のことで主語は複数なので know' },

  // ===== Chapter 2 Verb Forms / Unit 1 Basic Verb Forms & Simple Tenses =====
  // p52 農場見学のお礼メール
  { k: 'p52-1', s: 'I ___ to thank you for taking us to the farm last week.', a: 'D', j: '手紙を書いている今この時のことなので現在進行形' },
  { k: 'p52-2', s: 'I ___ the field trip very interesting.', a: 'A', j: '先週の遠足なので過去形' },
  { k: 'p52-3', s: 'I ___ more ways to spend time on farms because I loved it so much!', a: 'C', j: 'これからしようとしていることなので will' },
  { k: 'p52-4', s: 'If I can find a way to work on a farm this summer, I ___ my goal.', a: 'D', j: 'if 節は現在形でも、**主節は未来形**にする' },
  // p54 生徒の日記
  { k: 'p54-1', s: 'I usually ___ lunch with Lindsay, but today Lindsay was sick.', a: 'A', j: 'usually が付くいつもの習慣なので現在形' },
  { k: 'p54-2', s: 'She ___ all over the world!', a: 'B', j: '今までの経験をまとめて言うので現在完了' },
  { k: 'p54-3', s: 'She ___ by her mom when she lived there.', a: 'B', j: '母に「教えられた」側なので過去の受け身' },
  { k: 'p54-4', s: "When I ___ older, I will take Julianne's advice and try to travel!", a: 'A', j: '時を表す when の中は、未来のことでも現在形' },
  // p55-56 Unit Test（『アンクル・トムの小屋』）
  { k: 'p55-1', s: 'The book ___ in 1852.', a: 'C', j: '本は「出版される」側。1852年なので過去の受け身' },
  { k: 'p55-2', s: 'The novel, which ___ about a friendly slave named Tom, was the best-selling novel of the 19th century.', a: 'B', j: 'which が指すのは novel（単数）。本の内容は今も変わらないので現在形' },
  { k: 'p55-3', s: 'When Stowe wrote the book, she ___ to show Americans that slavery was evil.', a: 'B', j: '本を書いた当時のことなので過去形' },
  { k: 'p55-4', s: "She ___ a friendly family having to sell their family's slave to show that slaves were never safe.", a: 'A', j: '本の中でしたことなので過去形。副詞は動詞の前' },
  { k: 'p56-1', s: 'Stowe ___ Abraham Lincoln because of this important book.', a: 'A', j: '過去に一度あった出来事なので過去形' },
  { k: 'p56-2', s: "American students ___ Uncle Tom's Cabin.", a: 'B', j: '頻度の副詞は動詞の前。students は複数なので read' },
  { k: 'p56-3', s: 'By the time most Americans graduate from high school, they ___ the novel.', a: 'D', j: 'by the time 〜 は「〜するころまでに」。未来のある時点で終わっているので未来完了' },
  { k: 'p56-4', s: 'This is because American students ___ the importance of the book.', a: 'B', j: '助動詞の後ろは原形。文脈から「理解しなければならない」' },

  // ===== Chapter 2 / Unit 2 Continuous & Perfect Tenses =====
  // p58 チョウの庭への行き方
  { k: 'p58-1', s: 'Since we ___ insects, you should visit the butterfly garden in Pimbrooke.', a: 'C', j: '今その単元を勉強している最中なので現在進行形' },
  { k: 'p58-2', s: 'I ___ to tell you how to get there.', a: 'A', j: 'want のような「心の状態」を表す動詞は進行形にしない' },
  { k: 'p58-3', s: 'When I went, I ___ for the bus for 5 minutes.', a: 'D', j: '5分で終わった動作なので単純過去。長さが決まっているものは進行形にしない' },
  { k: 'p58-4', s: 'I ___ you to go to the butterfly garden this weekend or sometime next week.', a: 'D', j: 'これから先ずっと期待している状態なので未来進行形' },
  // p60 音楽の先生の交代のお知らせ
  { k: 'p60-1', s: 'I ___ the 7th grade students, and now it is time to tell your class.', a: 'B', j: 'already があり、もう済んでいることなので現在完了' },
  { k: 'p60-2', s: "Some of you ___ that she isn't here.", a: 'D', j: 'may have + 過去分詞 で「すでに〜したかもしれない」' },
  { k: 'p60-3', s: 'He ___ music for 10 years.', a: 'D', j: '10年前から今も続いているので現在完了進行形' },
  { k: 'p60-4', s: 'By Monday, he ___ interesting lessons for you.', a: 'D', j: 'by Monday は「月曜までに」。未来のある時点で終わっているので未来完了' },
  // p61-62 Unit Test（車の発明）
  { k: 'p61-1', s: 'Henry Ford ___ the inventor because of his work in the car business.', a: 'D', j: '昔からずっとそう思われてきて今もそうなので現在完了の受け身' },
  { k: 'p61-2', s: 'In this essay, I ___ people about the true inventors of the car.', a: 'D', j: 'これから書いていくことなので未来進行形' },
  { k: 'p61-3', s: "People ___ an invention is always made by a single person, but this isn't true for cars.", a: 'B', j: '今もそう思われているので現在形。頻度の副詞は動詞の前' },
  { k: 'p61-4', s: 'First, people ___ to know that many people worked to make moving things.', a: 'A', j: 'need は状態を表すので進行形にしない。今のことなので現在形' },
  { k: 'p62-1', s: 'Karl Benz ___ very hard with the help of others before he developed the first gas-powered engine.', a: 'D', j: 'エンジンを作る**より前から**続いていた動作なので過去完了進行形' },
  { k: 'p62-2', s: 'Today, cars ___ different than they did in the past because of new technology.', a: 'A', j: 'appear は状態を表すので進行形にしない。cars は複数' },
  { k: 'p62-3', s: 'In recent years, many new inventions ___.', a: 'C', j: 'in recent years は今につながる期間。発明は「作られる」側なので現在完了の受け身' },
  { k: 'p62-4', s: 'Ten years from now, even more new things ___ for cars.', a: 'D', j: '10年後という未来の時点までに済んでいるので未来完了の受け身' },

  // ===== Chapter 2 / Unit 3 Passive Voice =====
  // p64 バスケットコートのお知らせ
  { k: 'p64-1', s: 'The new courts ___ by Chase Architects.', a: 'C', j: 'コートは「設計される」側。すでに完成しているので過去の受け身' },
  { k: 'p64-2', s: 'The courts need ___ before they are open to the public.', a: 'D', j: 'コートは「掃除される」側なので to 不定詞の受け身' },
  { k: 'p64-3', s: 'These old courts ___ for many years.', a: 'C', j: '長年使われてきて今もそうなので現在完了の受け身。play on を1つの動詞として扱う' },
  { k: 'p64-4', s: 'When they close next month, they ___ for over 1,000 basketball games.', a: 'D', j: '来月という未来の時点までに済んでいるので未来完了の受け身' },
  // p66 落とし物のお知らせ
  { k: 'p66-1', s: 'I ___ to lend pencils to another student and handed him my pencil case.', a: 'D', j: '先週のことで「そうさせられた」側なので過去の受け身' },
  { k: 'p66-2', s: 'He gave it back to me, but I accidentally ___ the pencil case after that.', a: 'B', j: '置き忘れたのは自分なので受け身にしない。過去のことなので過去形' },
  { k: 'p66-3', s: 'My pencil case has my name, Angela, ___ it.', a: 'C', j: '「書かれている」側なので過去分詞。write on 〜 で「〜に書く」' },
  { k: 'p66-4', s: 'I hope the pencil case ___ one of the teachers.', a: 'D', j: 'do away with を1つの動詞として受け身にし、そのうえで行為者に by を付ける' },
  // p68 先生から生徒へのメール（ボランティア）
  { k: 'p68-1', s: 'I was ___ in the kitchen before I started doing it, too.', a: 'D', j: 'be worried about 〜 で「〜が心配だ」。about の後ろは動名詞' },
  { k: 'p68-2', s: 'They ___ helping you to feel comfortable.', a: 'A', j: 'be interested in 〜。前置詞は in で決まっている' },
  { k: 'p68-3', s: '___ to get used to something is to try it, so you should start working at Sanrin as soon as possible!', a: 'D', j: 'It is said that 〜 で「〜と言われている」' },
  { k: 'p68-4', s: 'If you are concerned ___ any other details, please send me an e-mail.', a: 'D', j: 'be concerned about 〜 で「〜が気になる」' },
  // p69-70 Unit Test（ヘレン・ケラー）
  { k: 'p69-1', s: '___ that Helen Keller is an amazing person.', a: 'C', j: 'It is said that 〜。say は「言われる」側なので受け身' },
  { k: 'p69-2', s: 'Helen Keller was a troubled child and had to ___ her family.', a: 'C', j: 'had to の後ろは原形。世話される側なので be cared for、行為者に by' },
  { k: 'p69-3', s: "She ___ stupid and there wasn't much hope that she could be helped.", a: 'C', j: 'be believed to be 〜 で「〜だと思われている」。当時のことなので過去' },
  { k: 'p69-4', s: 'Anne was finally able to ___ Helen using sign language.', a: 'A', j: 'be able to の後ろは原形。通じ合ったのはアンの側なので受け身にしない' },
  { k: 'p70-1', s: 'When Anne came to teach Helen, she was ___ getting through to the child, but was eventually able to succeed.', a: 'C', j: 'be concerned about 〜。心配する側なので concerned' },
  { k: 'p70-2', s: 'She was not ___ by Helen’s difficulties in the beginning.', a: 'B', j: 'いらだたされる側なので過去分詞。by が続くので受け身' },
  { k: 'p70-3', s: 'When Helen became famous, Anne ___ her accomplishments.', a: 'C', j: 'be satisfied で「満足させられる」。原因を続けるので by' },
  { k: 'p70-4', s: '___ from Helen Keller? Anything is possible.', a: 'D', j: '「学ばれるべきこと」なので受け身。What is to be learned の形' },

  // ===== Chapter 2 / Unit 4 Modal Auxiliary Verbs =====
  // p72 授業参観日のお知らせ
  { k: 'p72-1', s: 'Tomorrow is Teacher Conference Day, so there will be no school. You ___ remind your parents when you get home tonight.', a: 'B', j: '必ず伝えてほしいという強い指示なので must' },
  { k: 'p72-2', s: 'You ___ stay home all day.', a: 'D', j: "don't have to は「〜しなくてよい」。禁止ではない" },
  { k: 'p72-3', s: 'You ___ spend your day there if you have nothing to do.', a: 'D', j: 'could は「〜してもいいですよ」という控えめな提案' },
  { k: 'p72-4', s: 'I hope you ___ spend your day doing something rewarding.', a: 'A', j: '「〜できるといいですね」なので can。hope の後ろに must は置かない' },
  // p74 ハムスターの世話の手順
  { k: 'p74-1', s: '___ give you instructions on how to take care of the class hamster.', a: 'D', j: 'これから説明するという予定なので be going to' },
  { k: 'p74-2', s: 'First, you ___ feed Michael twice every day.', a: 'A', j: '毎日しなければならないことなので have to' },
  { k: 'p74-3', s: "He ___ be rather large last year, so don't give him too much food.", a: 'B', j: 'used to 〜 は「以前は〜だった」。last year のことなので' },
  { k: 'p74-4', s: 'You ___ clean his cage, too. This needs to be done once a week.', a: 'C', j: 'ought to は「〜すべきだ」。したほうがよいことを言う' },
  // p76 生徒から先生へのメール（医師体験）
  { k: 'p76-1', s: "I ___ sooner, but I've been so busy here in New Orleans.", a: 'D', j: 'should have + 過去分詞 で「〜すべきだったのに（しなかった）」' },
  { k: 'p76-2', s: "You ___ that I'd forgotten to write!", a: 'B', j: 'might have + 過去分詞 で「〜したかもしれない」' },
  { k: 'p76-3', s: "It is important that students ___ about these things if they're interested in becoming doctors.", a: 'A', j: 'It is important that 〜 の中は should が省かれて原形になる' },
  { k: 'p76-4', s: 'Our teachers insisted that we ___ our time studying when we get back to school.', a: 'B', j: 'insist が要求を表すとき、that の中は should が省かれて原形' },
  // p78 生徒会選挙の案内
  { k: 'p78-1', o: ['used to voting', 'would like to vote', 'would rather to vote', 'should have voted'], s: 'If you ___, then please ask your homeroom teacher for a voting card.', a: 'B', j: 'would like to + 原形 で「〜したい」。would rather に to は付かない' },
  { k: 'p78-2', s: 'You are ___ to vote by Friday, May 24th.', a: 'D', j: 'be supposed to 〜 で「〜することになっている」' },
  { k: 'p78-3', s: 'I ___ remind you that the person who is elected will have a lot of power in our school.', a: 'D', j: 'may as well + 原形 で「〜しておこう」' },
  { k: 'p78-4', s: 'As an active student at Stanley School, you ___ vote for someone.', a: 'C', j: 'should は「〜したほうがよい」。had better not だと逆の意味になる' },
  // p79-80 Unit Test（ラクロス）
  { k: 'p79-1', s: 'Many North Americans would rather ___ lacrosse than any other sport!', a: 'A', j: 'would rather の後ろは to の付かない原形' },
  { k: 'p79-2', s: 'Lacrosse ___ as a world-wide sport.', a: 'D', j: 'ラクロスは「認められる」側なので受け身。「〜されるべきだ」で should' },
  { k: 'p79-3', s: 'If you want to play lacrosse, you ___ a stick.', a: 'B', j: 'これから始める人の話なので will。need は状態を表すので could/might では弱い' },
  { k: 'p79-4', s: 'Lacrosse sticks ___ be made from wood, but wood is too heavy.', a: 'B', j: 'used to 〜 で「昔は〜だった（今は違う）」。but 以下がその理由' },
  { k: 'p80-1', s: 'Players ___ frustrated with such heavy sticks!', a: 'A', j: 'must have + 過去分詞 で「〜だったにちがいない」' },
  { k: 'p80-2', s: 'If you decide to try out for your local team, you ___ buy a pair of goggles to protect your eyes.', a: 'D', j: '次の文に required とあるので決まりごと。be supposed to' },
  { k: 'p80-3', s: 'Goggles are required for safety and you ___ protect your eyes!', a: 'A', j: 'had better は強い忠告。「目は守ったほうがいい」' },
  { k: 'p80-4', s: "It's a great game. You ___ try it!", a: 'D', j: 'may as well 〜 で「やってみたらいい」。may だけだと許可の意味になる' },

  // ===== Chapter 2 / Unit 5 Conditionals =====
  // p82 いじめについての校長のお知らせ
  { k: 'p82-1', s: "I ___ more, but I don't think the details are important.", a: 'C', j: '「言おうと思えば言えるが」という控えめな言い方。would + 原形' },
  { k: 'p82-2', s: "If I ___ a student meeting, I know that many of you would say you've seen bullying here at Hindley School.", a: 'D', j: 'if 節に were to を使うと「もし仮に〜したら」。主節が would なのと対になる' },
  { k: 'p82-3', s: "If I didn't think bullying was a problem, I ___ this notice.", a: 'C', j: '今の事実と違う話なので、if 節が過去形・主節は would + 原形' },
  { k: 'p82-4', s: 'I ___ more accepting students here at Hindley.', a: 'C', j: '「本来なら期待するところだ」という控えめな言い方' },
  // p84 アラスカからのメール
  { k: 'p84-1', s: 'Greetings from Alaska! I wish the class ___ here with me.', a: 'C', j: 'I wish の後ろは、今そうでないことを言うので過去形の could' },
  { k: 'p84-2', s: "It's time I ___ you about the things I've been learning.", a: 'A', j: "It's time + 主語 + 過去形 で「もう〜してもいいころだ」" },
  { k: 'p84-3', s: "It's as if I ___ in one of your classes!", a: 'B', j: 'as if の後ろは事実と違う話なので were。I でも was にしない' },
  { k: 'p84-4', s: '___ you telling me about this trip, I never would have come.', a: 'C', j: 'If it had not been for 〜 の if を省いて Had を前に出した形' },
  // p85-86 Unit Test（ツル）
  { k: 'p85-1', s: "If a crane ___ a paper crane, he wouldn't think it looked like him at all.", a: 'D', j: 'were to 〜 で「もし仮に〜したら」。主節の wouldn’t と対になる' },
  { k: 'p85-2', s: '___ the beauty of the crane, the Japanese would not have tried to copy it by folding paper.', a: 'C', j: 'If it had not been for 〜 の倒置形。「〜がなかったら」' },
  { k: 'p85-3', s: 'Had it not been for the beauty of the crane, the Japanese ___ to copy it by folding paper.', a: 'D', j: '過去の事実と違う話なので主節は would have + 過去分詞' },
  { k: 'p86-1', s: "It's ___ they were not afraid of anything.", a: 'D', j: 'as though 〜 で「まるで〜であるかのように」' },
  { k: 'p86-2', s: "If they ___ short legs and short necks, these dances wouldn't be so fun to watch.", a: 'C', j: 'ツルは脚や首を「与えられる」側なので受け身。事実と違う話なので had been given' },
  { k: 'p86-3', s: 'People in the world wish they ___ this problem.', a: 'B', j: 'wish の後ろは今そうでないことなので could + 原形' },
  { k: 'p86-4', s: '___ we started finding ways to save the crane population.', a: 'C', j: "It's time + 過去形 で「そろそろ〜するころだ」" },
  { k: 'p86-5', s: 'I would rather people ___ about cranes than about anything else!', a: 'B', j: 'would rather + 主語 + 過去形 で「〜してほしい」。今のことでも過去形' },

  // ===== Chapter 2 Chapter Test（ブルース）=====
  { k: 'p87-1', s: 'Blues is a form of music that ___ from the American South.', a: 'B', j: '生まれたのは過去のことなので過去形' },
  { k: 'p87-2', s: 'Slaves on Southern plantations ___ spiritual songs and work music.', a: 'C', j: 'would は「昔よく〜したものだ」という過去の習慣' },
  { k: 'p87-3', s: 'After the slaves ___, their descendants used ideas from their music to form the blues.', a: 'B', j: '奴隷は「解放される」側なので過去の受け身' },
  { k: 'p87-4', s: 'Blues was first ___ at the end of the 19th century.', a: 'B', j: '音楽は「演奏される」側。was + 過去分詞' },
  { k: 'p88-1', s: 'Blues music ___ exactly the same as the music sung by slaves.', a: 'B', j: '19世紀末という過去の話が続いているので過去形' },
  { k: 'p88-2', s: 'It ___ so difficult if more records had been kept.', a: 'B', j: '過去に記録が残っていれば「今」楽だった、という話。主節は現在の話なので might not be' },
  { k: 'p88-3', s: 'Blues music ___ many people to feel strongly.', a: 'A', j: '今も変わらない事実なので現在形' },
  { k: 'p88-4', s: 'Blues music has already influenced many and ___ more in the coming years.', a: 'D', j: 'in the coming years は未来のことなので will' },

  // ===== Chapter 3 Verbals / Unit 1 Infinitives =====
  // p92 イギリスに住む友人へのメール
  { k: 'p92-1', s: "I'm writing ___ you some questions for a school project.", a: 'C', j: '「〜するために」と目的を表す to 不定詞' },
  { k: 'p92-2', s: "We're all writing reports on England and our goal is ___ as much information as we can.", a: 'B', j: 'be の後ろで「〜すること」を表すので to 不定詞。調べるのは自分たちなので受け身にしない' },
  { k: 'p92-3', s: '___ would really help me with my project!', a: 'C', j: '主語の位置に置く to 不定詞。To + 動詞 + 目的語 の語順' },
  { k: 'p92-4', s: 'The project is ___ completed by next Monday.', a: 'A', j: 'be to + 過去分詞 で「〜されることになっている」' },
  // p94 学芸会の会場案内
  { k: 'p94-1', s: 'It seems ___ a mistake to have had the talent show in our auditorium last year.', a: 'D', j: 'seem より前のことなので to have + 過去分詞' },
  { k: 'p94-2', s: "It might be difficult ___ there, especially if you've never been there before.", a: 'B', j: 'difficult は for + 人 + to 不定詞 で「誰にとって」を表す' },
  { k: 'p94-3', s: 'It is important ___ past the railroad tracks.', a: 'C', j: 'to 不定詞を打ち消すときは not を to の前に置く' },
  { k: 'p94-4', s: 'The students in the talent show will be happy ___ by you.', a: 'D', j: '生徒は「見られる」側。by が続くので to 不定詞の受け身' },
  // p96 洗車の募金の広告
  { k: 'p96-1', s: "The Arlington Boys' Lacrosse Team wants ___ a car wash to raise money for the Greensby Tournament.", a: 'C', j: 'want の後ろは to 不定詞' },
  { k: 'p96-2', s: 'The Greensby Tournament in Florida gives the boys an opportunity ___ against teams from all over the country.', a: 'B', j: 'opportunity to 〜 で「〜する機会」。名詞を後ろから説明する' },
  { k: 'p96-3', s: 'The money from the car wash will enable ___ their travels.', a: 'D', j: 'enable + 人 + to 不定詞' },
  { k: 'p96-4', s: 'The boys are ___ to wash your car!', a: 'C', j: 'be eager to 〜 で「〜したがっている」。likely だと「〜しそうだ」で意味が変わる' },
  // p98 チャイム故障のお知らせ
  { k: 'p98-1', s: 'I decided to have it ___ this weekend, so it should be working on Monday.', a: 'B', j: 'have + O + 過去分詞 で「〜してもらう」。チャイムは直される側' },
  { k: 'p98-2', s: 'There are enough clocks in the classrooms and hallways ___ you the time.', a: 'B', j: 'enough … to 〜 で「〜するのにじゅうぶんな…」' },
  { k: 'p98-3', s: 'You all know ___ a clock.', a: 'C', j: '疑問詞 + to 不定詞 で「どう〜するか」。know の目的語になる' },
  // p99-100 Unit Test（共通語）
  { k: 'p99-1', s: 'A lingua franca is a language that is used by people ___ when they do not share a native language.', a: 'C', j: '「意思を伝えるために」と目的を表す to 不定詞' },
  { k: 'p99-2', s: '___ with others is obviously important, even if you need to speak in a language that is not your own.', a: 'B', j: '主語の位置に置く to 不定詞。To speak with others で「人と話すこと」' },
  { k: 'p99-3', s: 'Many people would like ___ English so that they can communicate with people from many different countries.', a: 'C', j: 'would like の後ろは to 不定詞' },
  { k: 'p100-1', s: 'Arabic was the language ___ when living in the Middle East.', a: 'C', j: '言語は「話される」側。名詞を後ろから説明する to 不定詞の受け身' },
  { k: 'p100-2', s: 'Today, if you ___ an international leader, you will have to speak English.', a: 'A', j: 'if 節の中は未来のことでも現在形。grow up to be 〜 で「成長して〜になる」' },
  { k: 'p100-3', s: 'Speaking English will allow you ___ with many world leaders.', a: 'B', j: 'allow + 人 + to 不定詞' },
  { k: 'p100-4', s: "___ English can benefit people in today's world.", a: 'D', j: '主語の位置に置く to 不定詞。動詞のままでは主語にならない' },
  { k: 'p100-5', s: '___ is very important.', a: 'C', j: '「聞いてもらい、分かってもらうこと」なので to 不定詞の受け身' },

  // ===== Chapter 3 / Unit 2 Gerunds =====
  // p102 ニューヨーク旅行の日記
  { k: 'p102-1', s: 'It was a great trip and I feel that ___ about it is important.', a: 'B', j: '主語の位置に来るので動名詞。about が続くので受け身にしない' },
  // OCR が「(B) saw」の左かっこを落としたため機械では拾えなかった。選択肢は紙面から書き写した
  { k: 'p102-2', o: ['see', 'saw', 'seeing', 'to seeing'], s: 'I loved ___ the Statue of Liberty.', a: 'C', j: 'love は動名詞も取れる。to seeing の形は無い' },
  { k: 'p102-3', s: 'My favorite thing is ___ a student on a school trip.', a: 'B', j: 'be の後ろで「〜であること」を表すので動名詞' },
  { k: 'p102-4', s: 'The best thing about ___ was that I got to see New York City.', a: 'C', j: 'about は前置詞なので後ろは動名詞。旅するのは自分なので受け身にしない' },
  // p104 水族館の遠足についてのメール
  { k: 'p104-1', s: "I never imagined ___ about a field trip, but I'm really interested in sea animals.", a: 'A', j: 'imagine の後ろは動名詞。わくわくさせられる側なので being excited' },
  { k: 'p104-2', s: "I have a question about ___ us what we're supposed to bring for the picnic lunch afterwards.", a: 'C', j: '動名詞の意味上の主語は所有格で表す。your telling で「あなたが言ったこと」' },
  { k: 'p104-3', s: "I'm sorry for ___ in class, but I didn't think of it until now.", a: 'B', j: '動名詞を打ち消す not は前に置く。前置詞 for の後ろなので動名詞' },
  { k: 'p104-4', s: "I hope you don't mind ___.", a: 'C', j: 'mind の後ろは動名詞。意味上の主語は所有格で my e-mailing' },
  // p106 携帯電話についての作文
  { k: 'p106-1', s: 'How often do you like ___ your cell phone at school?', a: 'B', j: 'like は動名詞も取れる。to using の形は無い' },
  { k: 'p106-2', s: "I enjoy ___ my cell phone just like every other student, but I think they're very distracting.", a: 'C', j: 'enjoy の後ろは動名詞。play on 〜 をひとまとまりで動名詞にする' },
  { k: 'p106-3', s: 'The teachers have decided ___ a program that will reward the students who never have their cell phones in class.', a: 'C', j: 'decide の後ろは to 不定詞。動名詞は取れない' },
  { k: 'p106-4', s: 'To the students who already shut off their phones, you should keep ___!', a: 'C', j: 'keep + 動名詞 で「〜し続ける」' },
  // p108 吹奏楽部のお知らせ
  { k: 'p108-1', s: 'Although the band is used ___, they have never made it to the state competition.', a: 'C', j: 'be used to の to は前置詞。後ろは動名詞' },
  { k: 'p108-2', s: 'They have spent a lot of time ___ for the big day.', a: 'C', j: 'spend + 時間 + 動名詞 で「〜して時間を過ごす」' },
  { k: 'p108-3', s: 'They cannot help ___ that this sort of support will help them win!', a: 'B', j: "can't help + 動名詞 で「〜せずにいられない」" },
  { k: 'p108-4', s: 'They look forward ___ you there.', a: 'C', j: 'look forward to の to は前置詞。後ろは動名詞' },
  // p109-110 Unit Test（お泊まり会）
  { k: 'p109-1', s: 'Megan and Lisa were looking forward ___ a big party.', a: 'C', j: 'look forward to + 動名詞。for とは組にならない' },
  { k: 'p109-2', s: 'Despite ___ about buying enough candy for the event, they were excited to show the girls how fun a sleepover party could be.', a: 'C', j: 'despite は前置詞なので後ろは動名詞' },
  { k: 'p109-3', s: 'The twins were ___ the girls to their house.', a: 'A', j: 'わくわくしているのは双子なので excited。後ろは to 不定詞' },
  { k: 'p109-4', s: 'Lisa started ___ that Megan looked unhappy.', a: 'B', j: 'start は動名詞も取れる。to noticing の形は無い' },
  { k: 'p110-1', s: 'After they had finished ___ stuff for the party, Megan and Lisa helped their mom bake a birthday cake.', a: 'D', j: 'finish の後ろは動名詞。to 不定詞は取れない' },
  { k: 'p110-2', s: 'Megan and Lisa both regretted ___ better.', a: 'B', j: 'regret + 動名詞 で「〜したことを悔やむ」。打ち消しの not は前' },
  { k: 'p110-3', s: "Megan, Lisa, and their friends couldn't remember ___ to a better party!", a: 'B', j: 'remember + 動名詞 で「〜したことを覚えている」。to 不定詞だと「これから〜するのを忘れずに」' },
  { k: 'p110-4', s: 'The girls spent all night ___ about things and were sad to go home in the morning.', a: 'C', j: 'spend + 時間 + 動名詞' },

  // ===== Chapter 3 / Unit 3 Participles =====
  // p112 合唱団のオーディション
  { k: 'p112-1', s: 'The Chamber Chorus is ___ in finding sopranos and altos.', a: 'B', j: '興味を持つ側なので interested。be interested in 〜' },
  { k: 'p112-2', s: 'There is a lot of room in the chorus for students ___ a spot.', a: 'C', j: 'students を後ろから説明する現在分詞。students は複数なので who wants は合わない' },
  { k: 'p112-3', s: "Singing with others is an ___ experience, so don't miss this opportunity to try it.", a: 'C', j: 'わくわくさせる側なので exciting。名詞 experience を前から説明する' },
  { k: 'p112-4', s: "If you've seen the Chamber Chorus ___ on stage, then you'll want to try out.", a: 'B', j: 'see + O + 現在分詞 で「〜しているのを見る」' },
  // p114 ソフトボール大会の日記
  { k: 'p114-1', s: "___ May now, we're preparing for the Founder's Softball Tournament.", a: 'B', j: '分詞構文に自前の主語 it を付けた形。It being 〜 で「今は〜なので」' },
  { k: 'p114-2', s: "___ yesterday, Chloe told me that she's really nervous about the tournament.", a: 'C', j: '接続詞を残した分詞構文。while + 現在分詞' },
  { k: 'p114-3', s: '___ in the tournament before, I know we have a shot at winning this year!', a: 'D', j: '主節より前のことなので having + 過去分詞' },
  { k: 'p114-4', s: '___ that Chloe is so good, I don’t think she should be so nervous.', a: 'D', j: 'considering that 〜 で「〜を考えると」。決まった言い方' },
  // p116 校庭閉鎖のお知らせ
  { k: 'p116-1', s: '___ the bad condition of the fields, the school decided to re-plant them with new grass.', a: 'C', j: '理由を表す分詞構文。「〜を見て」なので現在分詞' },
  { k: 'p116-2', s: 'We realize it will be difficult for the sports teams ___ this week, but Jetson School has opened their fields to us.', a: 'B', j: 'teams を後ろから説明する現在分詞。練習するのはチームの側' },
  { k: 'p116-3', s: "___, it won't be a problem to practice there after school.", a: 'C', j: '主節と主語が違うので、分詞構文に自前の主語を残す' },
  // p118 期末試験が不安な生徒からのメール
  { k: 'p118-1', s: '___ the mid-term exam, I am really nervous about the final.', a: 'D', j: '主節より前のことなので having + 過去分詞' },
  { k: 'p118-2', s: "___ a good test taker, I've always had problems with exams.", a: 'D', j: '「思われたことがない」ので受け身。主節より前なので having been + 過去分詞' },
  { k: 'p118-3', s: '___, I thought the best idea was to e-mail you.', a: 'B', j: 'frankly speaking で「率直に言うと」。決まった言い方' },
  { k: 'p118-4', s: 'Not ___ many middle school exams, I think I need some help.', a: 'D', j: '主節より前のことなので having + 過去分詞。打ち消しの not は前' },
  // p119-120 Unit Test（牛乳と骨の健康）
  { k: 'p119-1', s: "Many of today's middle school and high school students are not drinking enough milk, ___ adults to wonder about the health of their bones.", a: 'B', j: '結果を表す分詞構文。「その結果〜させている」' },
  { k: 'p119-2', s: '___ good to have healthy bones, it is important that all teens get enough calcium.', a: 'B', j: '分詞構文に自前の主語 it を残した形' },
  { k: 'p119-3', s: '___, experts believe that it is incredibly important that they get enough calcium.', a: 'C', j: '主節の主語 experts と違うので、分詞構文に自前の主語 teenagers を残す' },
  { k: 'p119-4', s: 'It is important that teenagers get enough calcium because their bones are still ___.', a: 'C', j: '骨は「育っている」最中なので現在分詞' },
  { k: 'p120-1', s: '___ milk as children, many seniors say they are happier now.', a: 'D', j: '子どものころという主節より前のことなので having + 過去分詞' },
  { k: 'p120-2', s: "___ seniors, experts found that those who didn't drink milk were more likely to suffer from bone disease.", a: 'D', j: '調べたのは主節より前なので having + 過去分詞' },
  { k: 'p120-3', s: '___ on their health, students will try to get calcium in any way they can.', a: 'C', j: '接続詞を残した分詞構文。「目を向けているなら」なので if + 過去分詞' },
  { k: 'p120-4', s: '___ to be healthy, these teenagers will be happy later in life.', a: 'B', j: '「決意している」状態なので being + 過去分詞' },

  // ===== Chapter 3 Chapter Test（ポカホンタス）=====
  { k: 'p121-1', s: 'The real story of Pocahontas needs ___ in all American history classes.', a: 'C', j: '物語は「教えられる」側なので to 不定詞の受け身' },
  { k: 'p121-2', s: 'The story of Pocahontas has been used in many books and movies, ___ the story from what actually occurred.', a: 'A', j: '結果を表す分詞構文。「その結果、話を変えてしまった」' },
  { k: 'p121-3', s: 'At that time, it was difficult ___ in their colony.', a: 'D', j: 'difficult は for + 人 + to 不定詞 で「誰にとって」を表す' },
  { k: 'p122-1', s: 'Pocahontas brought food and goods because the settlement seemed ___ trouble.', a: 'D', j: 'seem to be + 動名詞 で「〜しているように見える」' },
  { k: 'p122-2', s: 'Besides ___ supplies, Pocahontas is often believed to have had a romantic relationship with Captain John Smith.', a: 'B', j: 'besides は前置詞なので後ろは動名詞' },
  { k: 'p122-3', s: 'The people ___ movies simply thought this would be a good story.', a: 'B', j: 'people を後ろから説明する現在分詞。作る側なので受け身にしない' },
  { k: 'p122-4', s: 'They were not ___ with the truth.', a: 'B', j: 'be satisfied with 〜 で「〜に満足する」' },
  { k: 'p122-5', s: '___ friends with the colonists, Pocahontas was later captured by them.', a: 'D', j: '捕らえられるより前のことなので having + 過去分詞' },

  // ===== Actual Test =====
  // p126 は Directions の例題で、紙面に答えが刷ってある。設問として使わない
  // p127 家庭教師の募集
  { k: 'p127-1', s: 'To get better grades, many 7th graders ___ for tutors.', a: 'B', j: '今そうしている最中なので現在進行形。graders は複数' },
  { k: 'p127-2', s: 'They want tutors in all subjects and want ___ by 8th grade students.', a: 'C', j: '7年生は「教えてもらう」側なので to 不定詞の受け身' },
  { k: 'p127-3', s: 'If you are an 8th grade student who is interested in ___ a tutor, then visit Mrs. Devins in Room 22.', a: 'B', j: 'be interested in の in は前置詞なので後ろは動名詞' },
  { k: 'p127-4', o: ['8th grade tutor', '8th grade tutor every', 'every 8th grade tutor', 'every 8th grade tutors'], s: 'She will find a 7th grade student for ___.', a: 'C', j: 'every の後ろは単数名詞。every 8th grade tutor の語順' },
  // p128 遠足のもちもの
  { k: 'p128-1', s: '___ on the school picnic, you will need a few things.', a: 'B', j: '「〜するには」と目的を表す to 不定詞' },
  { k: 'p128-2', s: 'Remember that you will be sharing ___.', a: 'B', j: '「持ってきたもの」をまとめる名詞節。先行詞なしで使えるのは what' },
  { k: 'p128-3', s: "It's always best to bring some sunscreen in case the sun is too bright. You don't want to get ___.", a: 'D', j: '日焼け止めの話なので「日に焼ける」。get burned' },
  { k: 'p128-4', s: 'Also, you might bring a Frisbee or a ball ___ you can play games with your friends.', a: 'C', j: 'so that 〜 で「〜できるように」と目的を表す' },
  // p129-130 先生への謝罪メール
  { k: 'p129-1', s: "When you asked me ___, I didn't.", a: 'C', j: 'ask + 人 + to 不定詞' },
  { k: 'p129-2', s: 'I was ___.', a: 'B', j: 'そのときだけの態度を言うので be being + 形容詞' },
  { k: 'p130-1', s: 'I am sorry for making ___.', a: 'C', j: 'make it + 形容詞 + for 人 + to 不定詞。it が to 以下の代わりに立つ' },
  { k: 'p130-2', s: 'I hope you will accept my ___. It is from my heart.', a: 'C', j: '謝る手紙なので apology（おわび）' },
  // p131-132 橋についての作文
  { k: 'p131-1', s: 'A bridge is a ___ that is built across an area that is difficult for people to cross.', a: 'C', j: '橋は建造物なので structure。device は道具、masterpiece は傑作' },
  { k: 'p131-2', s: 'Suspension bridges are ___ of the most beautiful structures in the world.', a: 'A', j: 'one of the + 最上級 + 複数名詞 で「もっとも〜なものの一つ」' },
  { k: 'p131-3', s: 'They look very ___ from any other bridges.', a: 'B', j: 'look の後ろは形容詞。be different from 〜' },
  { k: 'p132-1', s: 'These columns support the bridge ___ cables.', a: 'B', j: '「ケーブルを使って」と手段を表す分詞構文' },
  { k: 'p132-2', s: 'It looks as though the cables ___ beautiful, but they are actually supporting the bridge.', a: 'C', j: 'be meant to be 〜 で「〜であるはずだ」。cables は複数なので are' },
  { k: 'p132-3', s: 'If ___ a bridge over it, a river must be crossed by a boat.', a: 'A', j: '接続詞を残した分詞構文。打ち消しの not は分詞の前' },
  // p133-134 フィルムカメラの記事
  { k: 'p133-1', s: 'Today when a photographer takes a picture, he or she can see what it looks like ___ afterward.', a: 'D', j: 'デジタルなのですぐ見られる。immediately' },
  { k: 'p133-2', s: 'Before the use of digital cameras, people used ___ that had no photo viewers.', a: 'C', j: '形容詞 + 名詞 の語順。cameras は複数なので a は付けない' },
  { k: 'p133-3', s: 'Photographers had to guess ___ or not their pictures were good without seeing the photos they took.', a: 'D', j: 'whether or not 〜 で「〜かどうか」' },
  { k: 'p133-4', s: '___, they had to carefully adjust their cameras to make sure they were getting a good picture.', a: 'A', j: '前の文の「見られなかった」の代わりにしたことなので Instead' },
  { k: 'p134-1', s: 'They considered the light, the subject, and the background ___ taking a shot.', a: 'B', j: '撮る前に考えるので before' },
  { k: 'p134-2', s: 'The photographers had to learn ___ these cameras.', a: 'C', j: '疑問詞 + to 不定詞。how to work 〜 で「〜の扱い方」' },
  { k: 'p134-3', s: 'Some of these older photographs are more beautiful than photographs ___ with new fancy cameras.', a: 'B', j: '写真は「撮られる」側なので過去分詞が後ろから説明する' },
  { k: 'p134-4', s: 'It is only recently that digital cameras ___ so popular.', a: 'C', j: '最近から今に続いていることなので現在完了' },
  // p135-136 アメリカの地名の記事
  { k: 'p135-1', s: 'When the English came they brought their own language and their own names, ___ to make America an English land.', a: 'C', j: '結果を表す分詞構文。language と names の2つなので both' },
  { k: 'p135-2', s: 'These English settlers and explorers named the places they found depending on ___ the new place reminded them of.', a: 'A', j: 'of の目的語をまとめる名詞節。先行詞なしで使えるのは what' },
  { k: 'p135-3', s: 'They named new places with thoughts of places they ___ before.', a: 'B', j: '名づけたときより前のことなので過去完了' },
  { k: 'p136-1', s: 'The places that held native names ___ new names.', a: 'D', j: '地名は「与えられる」側。places は複数なので were given' },
  { k: 'p136-2', s: '___ spreading the English language was not the only way the English were able to triumph.', a: 'B', j: 'It should be noted that 〜 で「〜という点に注意したい」' },
  { k: 'p136-3', s: 'It should be noted that spreading the English language ___ not the only way the English were able to triumph.', a: 'B', j: '主語は動名詞なので単数扱い。昔の話なので was' },
  { k: 'p136-4', s: 'It was not the only way ___ the English were able to triumph.', a: 'B', j: 'the way を後ろから説明する関係詞。ここでは that を使う' },
  { k: 'p136-5', s: 'They also had good weapons and ___ diseases which killed the natives.', a: 'A', j: '先住民が亡くなったのだから「命にかかわる」病気。deadly' },
  // p137-138 ピザの歴史
  { k: 'p137-1', s: 'A pizza is a flat bread covered with tomatoes, cheese, and a variety of ___.', a: 'C', j: 'a variety of の後ろは複数名詞。other toppings で「そのほかの具」' },
  { k: 'p137-2', s: 'Today, pizza is one of the most popular foods in America, but this ___ the case.', a: 'C', j: 'not always 〜 で「いつも〜とはかぎらない」。not は always の前' },
  { k: 'p137-3', s: 'People sold it on the street like they ___ do in Italy.', a: 'D', j: 'used to + 原形 で「昔は〜していた」' },
  { k: 'p137-4', o: ['so', 'far', 'that', 'only'], s: 'A few pizzerias opened in New York City in the early 20th century, but these were ___ popular with Italian immigrants.', a: 'D', j: '「イタリア系移民にだけ人気だった」なので only' },
  { k: 'p137-5', s: '___ World War II that pizza became truly popular.', a: 'B', j: 'It was not until 〜 that … で「〜になってはじめて…した」' },
  { k: 'p138-1', s: 'American men that had been ___ in Europe, particularly in Italy, had found out about pizza.', a: 'D', j: 'be stationed で「（軍務で）駐留する」。ヨーロッパにいた理由になる' },
  { k: 'p138-2', s: 'Pizza, ___ originally made in Italy, is now one of the most important foods in America.', a: 'B', j: 'コンマで補足する関係代名詞は which。pizza は単数なので was' },
  { k: 'p138-3', s: 'Americans feel lucky ___ eating pizza!', a: 'C', j: '食べ始めたのは feel より前のことなので to have + 過去分詞' }
  // ここまで
];
