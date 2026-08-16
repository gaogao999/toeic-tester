/**
 * 長文読解の問題データ — Ekamai International School (EIS) Grade 8 受験向け
 *
 * 本文は英語、選択肢も英語、解説は日本語。実際の入試と同じ形式にしている。
 * 設問は「主題」「細部」「文脈中の語義」「指示語」「推測」の5種類を組み合わせている。
 *
 * 各エントリの構造:
 *   id        : 一意なID（設問のIDは r1-1 のように連番で作られる）
 *   title     : 本文の見出し
 *   level     : 難易度。単語データと同じ4段階で、CEFR と対応させている
 *                 1 = 英検5級・4級（A1 まで）
 *                 2 = 英検3級（A2）      … TOEFL Junior Basic 相当
 *                 3 = 英検準2級（B1）    … TOEFL Junior B1 相当
 *                 4 = 英検2級（B2）      … TOEFL Junior Advanced B2 相当
 *               レベルが上がるほど本文を長くしている（TOEFL Junior は 250〜400語）
 *   topic     : 題材の分野
 *   words     : 語数の目安
 *   passage   : 本文（段落は \n で区切る）
 *   glossary  : 語注 [{ w: 語, m: 意味 }]
 *   questions : 設問 [{ q: 設問文, choices: [4択], answer: 正解の番号(0始まり), explanation: 日本語の解説 }]
 */
const READING_DATA = [
  {
    id: 'r1',
    title: 'The First Day',
    level: 1,
    topic: '学校生活',
    words: 170,
    passage:
      'Mina moved to Bangkok in July. On her first day at the new school, she was so nervous that she could not eat breakfast. Her mother walked with her to the gate and said, "Just smile. That is enough for today."\n' +
      'The classroom was noisy. Students were talking in English, and Mina understood only some of the words. She sat down quietly and opened her notebook. A girl with short hair turned around and asked, "Are you new? I am Pim."\n' +
      'Mina wanted to answer, but her English disappeared. She only nodded. Pim laughed kindly and drew a small map of the school on Mina\'s notebook. She wrote "lunch 12:00" next to the cafeteria and added a smiling face.\n' +
      'At noon, Pim came back and took Mina to the cafeteria. They ate together and talked slowly. Mina made many mistakes, but Pim never corrected her in an unkind way.\n' +
      'That evening, Mina told her mother, "It was difficult. But I made one friend." Her mother smiled. "One friend on the first day is not a small thing," she said.',
    glossary: [
      { w: 'nervous', m: '緊張して' },
      { w: 'nod', m: 'うなずく' },
      { w: 'cafeteria', m: '食堂' }
    ],
    questions: [
      {
        q: 'Why could Mina not eat breakfast?',
        choices: [
          'She woke up too late.',
          'She was nervous about her first day.',
          'She did not like the food.',
          'Her mother forgot to make it.'
        ],
        answer: 1,
        explanation: '第1段落に「so nervous that she could not eat breakfast」とあります。緊張が理由です。'
      },
      {
        q: 'What did Mina do when Pim spoke to her?',
        choices: [
          'She only nodded.',
          'She answered in English.',
          'She asked for help.',
          'She left the classroom.'
        ],
        answer: 0,
        explanation: '第3段落に「She only nodded」とあります。答えたかったが英語が出てこなかったのです。'
      },
      {
        q: 'What did Pim draw in Mina\'s notebook?',
        choices: [
          'A picture of the classroom',
          'A list of English words',
          'A small map of the school',
          'Her own phone number'
        ],
        answer: 2,
        explanation: '第3段落に「drew a small map of the school」とあります。'
      },
      {
        q: 'What does Mina\'s mother mean at the end?',
        choices: [
          'Mina should make more friends tomorrow.',
          'Making one friend on the first day is a real achievement.',
          'Mina should not talk to strangers.',
          'One friend is not enough at a new school.'
        ],
        answer: 1,
        explanation: '「not a small thing」は「小さなことではない」＝立派なことだ、という意味。否定表現で強く肯定しています。'
      }
    ]
  },

  {
    id: 'r2',
    title: 'Sports Day Announcement',
    level: 1,
    topic: 'お知らせ',
    words: 150,
    passage:
      'To: All Grade 7 and Grade 8 students\n' +
      'From: The Sports Committee\n' +
      'Subject: Sports Day, Friday 14 November\n' +
      'Sports Day will take place on Friday, 14 November, on the main field. Events start at 8:30 a.m. and finish at 2:00 p.m. Students must arrive by 8:00 a.m. and go directly to their team area.\n' +
      'Please wear your PE uniform and running shoes. Do not wear your school uniform on this day. Bring a hat, sunscreen, and a water bottle. The weather in November is usually hot, and there is little shade near the field.\n' +
      'Lunch will be served in the cafeteria at 12:15. Students who bring their own lunch may eat under the trees behind the library.\n' +
      'If it rains, Sports Day will move to Monday, 17 November. We will send a message to parents by 7:00 a.m. on the day.\n' +
      'Students who cannot join for health reasons must give a note from a parent to Mr. Chai before Wednesday.',
    glossary: [
      { w: 'committee', m: '委員会' },
      { w: 'sunscreen', m: '日焼け止め' },
      { w: 'shade', m: '日陰' }
    ],
    questions: [
      {
        q: 'What time must students arrive?',
        choices: ['By 7:00 a.m.', 'By 8:00 a.m.', 'By 8:30 a.m.', 'By 12:15 p.m.'],
        answer: 1,
        explanation: '第2段落に「Students must arrive by 8:00 a.m.」とあります。8:30は競技の開始時刻なので混同しないこと。'
      },
      {
        q: 'What should students NOT wear on Sports Day?',
        choices: ['Running shoes', 'A hat', 'Their school uniform', 'Their PE uniform'],
        answer: 2,
        explanation: '「Do not wear your school uniform on this day」とあります。設問の NOT に注意。'
      },
      {
        q: 'What will happen if it rains?',
        choices: [
          'Sports Day will be canceled.',
          'Sports Day will move to Monday.',
          'Events will start indoors.',
          'Students will stay in the cafeteria.'
        ],
        answer: 1,
        explanation: '第4段落に「will move to Monday, 17 November」とあります。中止ではなく延期です。'
      },
      {
        q: 'Students who cannot join must',
        choices: [
          'call the school on Friday morning.',
          'speak to the Sports Committee.',
          'bring a note from a parent before Wednesday.',
          'send an email to their teacher.'
        ],
        answer: 2,
        explanation: '最終段落に「must give a note from a parent to Mr. Chai before Wednesday」とあります。'
      }
    ]
  },

  {
    id: 'r3',
    title: 'Why Bees Matter',
    level: 2,
    topic: '理科',
    words: 200,
    passage:
      'When people think of dangerous animals, they rarely think of losing bees. Yet scientists warn that a world without bees would be a serious problem for humans.\n' +
      'Bees carry pollen from one flower to another. Without this process, many plants cannot produce fruit or seeds. About one third of the food we eat depends on animals that move pollen, and bees do most of this work. Apples, coffee, tomatoes, and almonds would all become rare and expensive.\n' +
      'In recent years, bee numbers have fallen in many countries. Scientists believe there is no single cause. Farms use chemicals that harm bees. Cities grow, so wild flowers disappear. Diseases spread quickly when bees live close together in large numbers.\n' +
      'Some solutions are surprisingly simple. Farmers can leave wild areas at the edges of their fields. Cities can plant flowers along roads. Even a small garden on a balcony can help.\n' +
      'Not everyone agrees about which action matters most. However, almost all scientists agree on one point: protecting bees is cheaper than replacing them. In parts of China, farmers already move pollen by hand with small brushes. It works, but it is slow, and it costs far more than the work bees do for free.',
    glossary: [
      { w: 'pollen', m: '花粉' },
      { w: 'chemical', m: '化学薬品' },
      { w: 'replace', m: '代わりをする' }
    ],
    questions: [
      {
        q: 'What is the main idea of this passage?',
        choices: [
          'Bees are dangerous animals that people should avoid.',
          'Bees are important to our food supply and need protection.',
          'Farmers in China have solved the problem of bees.',
          'Cities should stop growing to save wild flowers.'
        ],
        answer: 1,
        explanation: '全体を通して「ハチは食料生産に不可欠で、守る必要がある」と述べています。個別の例は主題ではありません。'
      },
      {
        q: 'According to the passage, how much of our food depends on animals that move pollen?',
        choices: ['About one tenth', 'About one third', 'About one half', 'Almost all of it'],
        answer: 1,
        explanation: '第2段落に「About one third of the food we eat」とあります。'
      },
      {
        q: 'Why have bee numbers fallen?',
        choices: [
          'There is one clear cause.',
          'Bees have moved to other countries.',
          'Several causes act together.',
          'Farmers stopped keeping bees.'
        ],
        answer: 2,
        explanation: '第3段落に「no single cause」とあり、薬品・都市化・病気と複数の原因を挙げています。'
      },
      {
        q: 'The word "rare" in paragraph 2 is closest in meaning to',
        choices: ['common', 'hard to find', 'delicious', 'healthy'],
        answer: 1,
        explanation: 'rare は「まれな、見つけにくい」。expensive と並んでいることからも、手に入りにくくなる意味だと分かります。'
      },
      {
        q: 'What can be inferred about moving pollen by hand?',
        choices: [
          'It is a better method than using bees.',
          'It is not a practical replacement on a large scale.',
          'It is used in every country now.',
          'It costs nothing for farmers.'
        ],
        answer: 1,
        explanation: '最終文の「slow」「costs far more」から、大規模には現実的でないと推測できます。'
      }
    ]
  },

  {
    id: 'r4',
    title: 'The Ocean and Our Plastic',
    level: 2,
    topic: '環境',
    words: 210,
    passage:
      'Every year, millions of tons of plastic enter the ocean. Some of it comes from ships, but most of it comes from land. Rivers carry bottles, bags, and packaging from cities to the sea.\n' +
      'Large pieces of plastic are easy to see, and they are dangerous. Sea turtles eat plastic bags because the bags look like jellyfish. Birds feed small pieces to their young. However, many scientists are more worried about the plastic we cannot see.\n' +
      'Sunlight and waves break plastic into tiny pieces called microplastics. These pieces are smaller than a grain of rice. Fish eat them, and the plastic stays inside their bodies. Researchers have found microplastics in fish sold in markets, in salt, and even in drinking water.\n' +
      'Cleaning the ocean is extremely difficult. Microplastics are spread through the water like dust in the air, so no machine can collect them all. For this reason, most experts argue that the answer is to stop plastic from entering the ocean in the first place.\n' +
      'Some countries have banned plastic bags in shops. Others charge a small fee for each bag. Both methods reduce the amount of plastic used, but the effect depends on whether people change their daily habits.',
    glossary: [
      { w: 'packaging', m: '包装' },
      { w: 'grain', m: '粒' },
      { w: 'ban', m: '禁止する' }
    ],
    questions: [
      {
        q: 'Where does most ocean plastic come from?',
        choices: ['Ships', 'Land', 'Fishing nets', 'The air'],
        answer: 1,
        explanation: '第1段落に「most of it comes from land」とあります。ships は「some」なので誤りです。'
      },
      {
        q: 'Why do sea turtles eat plastic bags?',
        choices: [
          'The bags smell like food.',
          'The bags look like jellyfish.',
          'The bags are easy to catch.',
          'They cannot find other food.'
        ],
        answer: 1,
        explanation: '第2段落に「the bags look like jellyfish」とあります。'
      },
      {
        q: 'What are microplastics?',
        choices: [
          'Plastic made in factories for medicine',
          'Bags that break down safely in water',
          'Tiny pieces made when plastic breaks apart',
          'A new material that replaces plastic'
        ],
        answer: 2,
        explanation: '第3段落に「Sunlight and waves break plastic into tiny pieces called microplastics」とあります。'
      },
      {
        q: 'Why is cleaning the ocean so difficult?',
        choices: [
          'The ocean is too cold for machines.',
          'Microplastics are spread widely and are very small.',
          'Governments do not allow cleaning ships.',
          'Fish eat the machines.'
        ],
        answer: 1,
        explanation: '第4段落に「spread through the water like dust in the air, so no machine can collect them all」とあります。'
      },
      {
        q: 'What does the writer suggest is the best approach?',
        choices: [
          'Building better cleaning machines',
          'Preventing plastic from reaching the ocean',
          'Moving fish to safer waters',
          'Stopping people from eating fish'
        ],
        answer: 1,
        explanation: '第4段落の「stop plastic from entering the ocean in the first place」が筆者の主張です。'
      }
    ]
  },

  {
    id: 'r5',
    title: 'The Boy Who Built a Windmill',
    level: 2,
    topic: '伝記',
    words: 200,
    passage:
      'William Kamkwamba was fourteen when his family could no longer pay for school. It was 2002, and a terrible drought had destroyed the harvest in his village in Malawi. His family ate one meal a day.\n' +
      'William did not stop learning. He walked to a small library near his village and borrowed books. One of them, an old science textbook, showed a picture of a windmill. The English in the book was difficult, and William could read only part of it. But he understood the diagrams.\n' +
      'He decided to build a windmill that would produce electricity. He collected a broken bicycle, plastic pipes, and pieces of metal from a junkyard. People in the village laughed at him. Some said he had gone crazy.\n' +
      'After months of work, the windmill turned, and a single light bulb in his house began to glow. Neighbors came to see it. Later he built a larger one that pumped water for the fields.\n' +
      'Years afterwards, William studied at a university in the United States. When people asked how he had learned so much alone, he often gave the same answer: he had looked at the pictures until they made sense.',
    glossary: [
      { w: 'drought', m: '干ばつ' },
      { w: 'junkyard', m: '廃品置き場' },
      { w: 'glow', m: '光る' }
    ],
    questions: [
      {
        q: 'Why did William leave school?',
        choices: [
          'He was not interested in studying.',
          'His family could not pay the fees.',
          'The school was closed by the government.',
          'He moved to another country.'
        ],
        answer: 1,
        explanation: '第1段落に「his family could no longer pay for school」とあります。干ばつで収穫が失われたためです。'
      },
      {
        q: 'How did William learn about windmills?',
        choices: [
          'A teacher explained them to him.',
          'He saw one in another village.',
          'He found a picture in a library book.',
          'His father had built one before.'
        ],
        answer: 2,
        explanation: '第2段落に、図書館で借りた理科の本に風車の写真があったと書かれています。'
      },
      {
        q: 'What does "them" refer to in the last sentence?',
        choices: ['The neighbors', 'The pictures', 'The fields', 'The universities'],
        answer: 1,
        explanation: '直前の「he had looked at the pictures」を受けています。指示語は直前の名詞を探すのが基本です。'
      },
      {
        q: 'How did the villagers react at first?',
        choices: [
          'They helped him find materials.',
          'They laughed at him.',
          'They asked him to build one for them.',
          'They reported him to the police.'
        ],
        answer: 1,
        explanation: '第3段落に「People in the village laughed at him」とあります。'
      },
      {
        q: 'What can be inferred about William?',
        choices: [
          'He gave up easily when others doubted him.',
          'He continued learning without a school.',
          'He was already good at English.',
          'He built the windmill in a few days.'
        ],
        answer: 1,
        explanation: '学校をやめても図書館で学び続けた点が全体を通じて描かれています。英語は難しかったと明記されているので誤り。'
      }
    ]
  },

  {
    id: 'r6',
    title: 'Water for the New Year',
    level: 3,
    topic: '文化',
    words: 220,
    passage:
      'Every April, Thailand celebrates Songkran, the traditional New Year. Visitors often describe it as a giant water fight, and in the streets of Bangkok that description is not wrong. Yet the festival began as something much quieter.\n' +
      'Originally, people poured a small amount of scented water over Buddha images and over the hands of their grandparents. The water was a sign of respect, and the act was meant to wash away the troubles of the past year. Families returned to their home towns, cleaned their houses, and prepared food for monks.\n' +
      'Over time, the gentle pouring grew into something larger. Young people began to throw water at each other in the street. Today, tourists arrive with plastic water guns, and some streets are closed to traffic for three days.\n' +
      'Not everyone welcomes the change. Older people sometimes complain that the meaning has been lost, and every year the government reminds citizens to save water and to avoid throwing it at motorcycles, which causes accidents.\n' +
      'Still, most Thai families keep both sides of the festival. In the morning they visit their grandparents and pour water quietly over their hands. In the afternoon, the same families go outside and get completely wet. For them, there is no contradiction.',
    glossary: [
      { w: 'scented', m: '香りをつけた' },
      { w: 'monk', m: '僧侶' },
      { w: 'contradiction', m: '矛盾' }
    ],
    questions: [
      {
        q: 'What is the best title for this passage?',
        choices: [
          'How to Stay Safe During Songkran',
          'A Festival with Two Faces',
          'Why Tourists Should Avoid Bangkok in April',
          'The History of Buddhism in Thailand'
        ],
        answer: 1,
        explanation: '静かな伝統行事と街の水かけ、その両面を持つことが全体の主題です。安全や仏教史は一部にすぎません。'
      },
      {
        q: 'What was the original meaning of pouring water?',
        choices: [
          'To cool people down in hot weather',
          'To show respect and wash away past troubles',
          'To welcome tourists to the country',
          'To clean the streets before the new year'
        ],
        answer: 1,
        explanation: '第2段落に「a sign of respect」「wash away the troubles of the past year」とあります。'
      },
      {
        q: 'Why does the government give warnings every year?',
        choices: [
          'Because the festival is too quiet',
          'Because throwing water at motorcycles causes accidents',
          'Because tourists do not join the festival',
          'Because families do not visit their grandparents'
        ],
        answer: 1,
        explanation: '第4段落に、節水と、バイクに水をかけないよう注意を促すとあります。'
      },
      {
        q: 'What does the writer mean by "there is no contradiction"?',
        choices: [
          'Thai families cannot decide which tradition to follow.',
          'The two ways of celebrating do not conflict for them.',
          'The old tradition has completely disappeared.',
          'Tourists and local people never celebrate together.'
        ],
        answer: 1,
        explanation: '午前は静かに敬意を示し、午後はずぶ濡れになる。両立していて矛盾ではない、という意味です。'
      },
      {
        q: 'The word "gentle" in paragraph 3 is closest in meaning to',
        choices: ['noisy', 'quiet and soft', 'expensive', 'religious'],
        answer: 1,
        explanation: 'gentle は「穏やかな」。第2段落の静かな儀式を指し、第3段落の激しい水かけと対比されています。'
      }
    ]
  },

  {
    id: 'r7',
    title: 'Screens and Sleep',
    level: 3,
    topic: '科学・生活',
    words: 215,
    passage:
      'Teenagers are often told to put their phones away before bed. Many ignore the advice, and some argue that a screen helps them relax. Research, however, suggests the opposite.\n' +
      'The human body decides when to sleep partly by measuring light. In the evening, as the light fades, the brain produces a chemical called melatonin, which makes us feel sleepy. Screens produce blue light, and blue light delays this process. In one study, students who read on a bright tablet for two hours before bed took an average of ten minutes longer to fall asleep than students who read a paper book.\n' +
      'Ten minutes may not sound serious. The larger problem is what happens next. Sleeping later does not mean waking later, because school starts at the same time. Over a week, small losses add up, and researchers have linked this pattern to lower concentration in class.\n' +
      'Light is not the only factor. Messages and videos are designed to hold attention, so a student who plans to check a phone for five minutes may stay awake for an hour.\n' +
      'Few experts recommend giving up devices completely. Most suggest a simpler rule: choose a time in the evening after which the phone stays in another room.',
    glossary: [
      { w: 'melatonin', m: 'メラトニン（眠気を促す物質）' },
      { w: 'delay', m: '遅らせる' },
      { w: 'concentration', m: '集中力' }
    ],
    questions: [
      {
        q: 'According to the passage, what does blue light do?',
        choices: [
          'It helps the body produce melatonin.',
          'It delays the process that makes us sleepy.',
          'It improves concentration in class.',
          'It has no effect on the human body.'
        ],
        answer: 1,
        explanation: '第2段落に「blue light delays this process」とあります。process はメラトニンが作られる働きを指します。'
      },
      {
        q: 'In the study, how much longer did tablet readers take to fall asleep?',
        choices: ['Two hours', 'One hour', 'Ten minutes', 'Five minutes'],
        answer: 2,
        explanation: '「an average of ten minutes longer」とあります。two hours は読書時間、five minutes は別の話です。'
      },
      {
        q: 'Why does the writer say the ten minutes is not the main problem?',
        choices: [
          'Because students can sleep later in the morning',
          'Because the losses build up over a week while wake-up time stays the same',
          'Because ten minutes is too short to measure',
          'Because paper books cause the same problem'
        ],
        answer: 1,
        explanation: '第3段落の「Sleeping later does not mean waking later」「small losses add up」が根拠です。'
      },
      {
        q: 'What is the writer\'s attitude toward devices?',
        choices: [
          'Students should stop using them completely.',
          'Devices have no connection with sleep.',
          'Students should set a limit rather than give them up.',
          'Only paper books should be allowed at night.'
        ],
        answer: 2,
        explanation: '最終段落に「Few experts recommend giving up devices completely」「a simpler rule」とあります。'
      },
      {
        q: 'Besides light, what other factor is mentioned?',
        choices: [
          'The temperature of the room',
          'The design of messages and videos that holds attention',
          'The size of the screen',
          'The price of the device'
        ],
        answer: 1,
        explanation: '第4段落に「Messages and videos are designed to hold attention」とあります。'
      }
    ]
  },

  {
    id: 'r8',
    title: 'The Sounds We Cannot Hear',
    level: 3,
    topic: '理科',
    words: 205,
    passage:
      'For a long time, people who studied elephants noticed something strange. A group of elephants would suddenly stop eating and turn in the same direction at the same moment, although the observers had heard nothing at all.\n' +
      'In the 1980s, a researcher named Katy Payne offered an explanation. She had felt a faint movement in the air near the animals, similar to the feeling near a large organ in a church. She recorded the elephants and then played the recording at a faster speed. Sounds appeared that no human ear could catch.\n' +
      'Elephants communicate partly with very low sounds, below the range of human hearing. These low sounds travel much farther than high ones, especially across open ground. A call can reach another group several kilometers away.\n' +
      'This discovery changed how scientists protect elephants. Noise from roads and machines can cover these calls, so a herd may fail to hear a warning. Researchers now argue that protecting an elephant population means protecting quiet space as well as land.\n' +
      'It also raised a wider question. If animals we have studied for a century were speaking in a way we could not hear, what else are we missing?',
    glossary: [
      { w: 'faint', m: 'かすかな' },
      { w: 'herd', m: '（動物の）群れ' },
      { w: 'range', m: '範囲' }
    ],
    questions: [
      {
        q: 'What puzzled observers about elephant groups?',
        choices: [
          'They ate at unusual times.',
          'They reacted together although no sound was heard.',
          'They walked in a straight line.',
          'They avoided open ground.'
        ],
        answer: 1,
        explanation: '第1段落に、観察者には何も聞こえないのに一斉に同じ方向を向いた、とあります。'
      },
      {
        q: 'How did Katy Payne find the sounds?',
        choices: [
          'She used a special microphone underwater.',
          'She played her recording at a faster speed.',
          'She asked local people what they heard.',
          'She measured the elephants\' movements.'
        ],
        answer: 1,
        explanation: '第2段落に「played the recording at a faster speed」とあります。速く再生すると音が高くなり聞こえるようになります。'
      },
      {
        q: 'Why do low sounds suit elephants?',
        choices: [
          'They are easier for humans to record.',
          'They travel farther than high sounds.',
          'They are louder than high sounds.',
          'They can pass through water.'
        ],
        answer: 1,
        explanation: '第3段落に「travel much farther than high ones」とあります。'
      },
      {
        q: 'What practical change did the discovery bring?',
        choices: [
          'Scientists now keep elephants in smaller groups.',
          'Protection now includes keeping areas quiet.',
          'Roads near elephants were all removed.',
          'Elephants are now trained to use high sounds.'
        ],
        answer: 1,
        explanation: '第4段落の「protecting quiet space as well as land」が該当します。道路の完全撤去とは書かれていません。'
      },
      {
        q: 'The final question suggests that',
        choices: [
          'elephants are the only animals worth studying.',
          'science has already explained animal communication.',
          'there may be much about animals we still do not notice.',
          'humans should learn to make low sounds.'
        ],
        answer: 2,
        explanation: '「what else are we missing?」は、まだ気づいていないことが他にもあるのでは、という問いかけです。'
      }
    ]
  },

  // ============================================================
  // レベル2（英検3級 / CEFR A2）
  // ============================================================
  {
    id: 'r9',
    title: 'A Message from Your Host Family',
    level: 2,
    topic: '手紙・メール',
    words: 210,
    passage:
      'Dear Yuto,\n' +
      'We are all happy that you will stay with us next month. I am writing early so that you can prepare.\n' +
      'We live about twenty minutes from the school by bus. The bus stop is in front of the post office, and the number 8 bus comes every ten minutes in the morning. If it rains hard, my husband can drive you, but please tell us the night before. He leaves at seven.\n' +
      'We have two children. Emma is fourteen and practises the violin every evening after dinner. Tom is nine and asks a lot of questions. He is already learning how to say your name correctly.\n' +
      'Dinner is at seven o\'clock. If there is food you cannot eat, please write to me now, not after you arrive. It is much easier for me to plan the shopping.\n' +
      'One more thing. Our dog, Coco, is friendly, but she jumps on people she does not know. If you would rather not meet her at once, that is completely fine. Just say so and we will keep her in the garden for the first few days.\n' +
      'Finally, please bring a warm jacket. Many visitors think that Australia is hot all year, but the mornings in August are cold enough for gloves.\n' +
      'See you soon,\n' +
      'Sarah',
    glossary: [
      { w: 'prepare', m: '準備する' },
      { w: 'would rather not', m: 'できれば〜したくない' },
      { w: 'at once', m: 'すぐに' }
    ],
    questions: [
      {
        q: 'How does Yuto usually go to school?',
        choices: [
          'By the number 8 bus.',
          'On foot with Emma.',
          'By car with Sarah\'s husband.',
          'By bicycle from the post office.'
        ],
        answer: 0,
        explanation: '第2段落に「the number 8 bus comes every ten minutes in the morning」とあります。車で送るのは「雨が激しいとき」だけの例外です。'
      },
      {
        q: 'What does Sarah ask Yuto to do before he arrives?',
        choices: [
          'Learn how to say Tom\'s name.',
          'Tell her about food he cannot eat.',
          'Buy a present for Emma.',
          'Send her his bus timetable.'
        ],
        answer: 1,
        explanation: '第4段落に「please write to me now, not after you arrive」とあります。買い物の計画を立てやすくするためです。'
      },
      {
        q: 'What will happen if Yuto does not want to meet the dog immediately?',
        choices: [
          'Coco will be given to another family.',
          'Yuto will stay in a different room.',
          'Coco will stay in the garden for a few days.',
          'The family will not keep a dog.'
        ],
        answer: 2,
        explanation: '第5段落に「we will keep her in the garden for the first few days」とあります。犬を手放すとは書かれていません。'
      },
      {
        q: 'Why does Sarah tell Yuto to bring a warm jacket?',
        choices: [
          'The school requires a jacket as a uniform.',
          'The bus in the morning is air-conditioned.',
          'He will need it for the violin concert.',
          'August mornings there are colder than visitors expect.'
        ],
        answer: 3,
        explanation: '最終段落に「Many visitors think that Australia is hot all year, but the mornings in August are cold」とあります。思い込みを正しています。'
      },
      {
        q: 'What is the main purpose of this message?',
        choices: [
          'To give practical information before the visit.',
          'To ask Yuto to change the date of his stay.',
          'To describe the history of the family.',
          'To invite Yuto to a violin concert.'
        ],
        answer: 0,
        explanation: '交通・食事・犬・服装と、滞在前に知っておくべき実用的な情報が並んでいます。全体の目的はその案内です。'
      }
    ]
  },
  {
    id: 'r10',
    title: 'The Wallet on the Bus',
    level: 2,
    topic: '日常生活',
    words: 215,
    passage:
      'Last Saturday, Ken found a brown wallet under the seat in front of him on the bus. He picked it up and looked inside. There was some money, a student card, and a small photo of an old woman holding a dog.\n' +
      'Ken did not know what to do. The bus was almost empty and the driver looked busy. Then he read the name on the student card: Nina Suzuki, Grade 9, Riverside School. That was the school his sister went to.\n' +
      'When he got home, Ken showed the wallet to his sister. She looked at the card and said, "I know her. She sits behind me in music class." She sent Nina a message with a photo of the wallet.\n' +
      'Nina called ten minutes later. She sounded out of breath. "I have looked for it everywhere since yesterday," she said. "My grandmother gave me that photo before she moved away. The money does not matter, but the photo does."\n' +
      'The next morning, Ken waited at the school gate and gave the wallet back. Nina opened it, checked the photo first, and then tried to give him the money inside. Ken shook his head.\n' +
      '"Just tell your grandmother that the photo came home," he said.',
    glossary: [
      { w: 'wallet', m: '財布' },
      { w: 'out of breath', m: '息を切らして' },
      { w: 'matter', m: '重要である' }
    ],
    questions: [
      {
        q: 'How did Ken learn who owned the wallet?',
        choices: [
          'The bus driver told him.',
          'He read the student card inside it.',
          'His sister saw Nina on the bus.',
          'There was a phone number on the photo.'
        ],
        answer: 1,
        explanation: '第2段落に「he read the name on the student card」とあります。カードから名前と学校が分かりました。'
      },
      {
        q: 'In the fourth paragraph, the word "matter" is closest in meaning to',
        choices: [
          'be missing',
          'be expensive',
          'be important',
          'be returned'
        ],
        answer: 2,
        explanation: '「お金は matter しないが写真は matter する」という対比です。祖母がくれた写真を大切にしているので「重要である」の意味です。'
      },
      {
        q: 'What did Nina do first when she got the wallet back?',
        choices: [
          'She counted the money.',
          'She thanked Ken\'s sister.',
          'She called her grandmother.',
          'She checked that the photo was inside.'
        ],
        answer: 3,
        explanation: '第5段落に「checked the photo first」とあります。お金より先に写真を確かめました。'
      },
      {
        q: 'Why did Ken refuse the money?',
        choices: [
          'Returning the photo was enough for him.',
          'He thought the amount was too small.',
          'His sister told him not to take it.',
          'He had already been paid by the school.'
        ],
        answer: 0,
        explanation: '直接の理由は書かれていませんが、最後の一言「Just tell your grandmother that the photo came home」から、写真が戻ったことで十分だと考えたと読み取れます。'
      },
      {
        q: 'What is the main point of this story?',
        choices: [
          'Buses are dangerous places to leave belongings.',
          'Something can be worth much more than its price.',
          'Students should always carry a student card.',
          'It is difficult to make friends at a new school.'
        ],
        answer: 1,
        explanation: '財布の中で最も価値があったのはお金ではなく写真でした。値段と価値は別だという点が話の中心です。'
      }
    ]
  },

  // ============================================================
  // レベル3（英検準2級 / CEFR B1）
  // ============================================================
  {
    id: 'r11',
    title: 'The Long Journey of Chocolate',
    level: 3,
    topic: '歴史',
    words: 250,
    passage:
      'Today chocolate is a cheap treat that almost anyone can buy. For most of its history, however, it was neither cheap nor sweet.\n' +
      'The cacao tree grows in Central and South America, and people there were using its beans more than three thousand years ago. They did not make bars. They ground the beans and mixed them with water, chilli and spices to produce a bitter drink. Among the Aztecs this drink was so valuable that the beans themselves were used as money. A worker could be paid in beans, and a handful of them could buy a meal.\n' +
      'When Spanish ships carried cacao to Europe in the sixteenth century, Europeans found the bitter drink strange. They added sugar and honey, and it slowly became popular among the rich. Even then it remained a drink. Producing solid chocolate was difficult, because the fat in the bean, called cocoa butter, separated from the powder and rose to the surface.\n' +
      'The change came in the nineteenth century. New machines could press the beans and control how much of that fat remained. In 1847 a British company sold a bar that people could eat rather than drink, and milk chocolate followed a few decades later in Switzerland. Prices fell as production grew, and within a century chocolate had moved from the tables of kings to the pockets of schoolchildren.\n' +
      'So the bar in a lunch box is a recent invention, even though the plant behind it has been used for thousands of years. What changed was not the bean. It was the technology built around it.',
    glossary: [
      { w: 'bitter', m: '苦い' },
      { w: 'valuable', m: '価値のある' },
      { w: 'separate', m: '分離する' }
    ],
    questions: [
      {
        q: 'How did the Aztecs use cacao beans besides making a drink?',
        choices: [
          'They planted them as decoration.',
          'They burned them for heat.',
          'They used them as money.',
          'They gave them to children as toys.'
        ],
        answer: 2,
        explanation: '第2段落に「the beans themselves were used as money」とあります。給料として支払われることもありました。'
      },
      {
        q: 'Why was solid chocolate difficult to produce at first?',
        choices: [
          'Cacao trees could not be grown in Europe.',
          'Sugar was too expensive to add.',
          'The beans could not be transported by ship.',
          'The cocoa butter separated from the powder.'
        ],
        answer: 3,
        explanation: '第3段落に「the fat in the bean ... separated from the powder and rose to the surface」とあります。これが固形化を妨げていました。'
      },
      {
        q: 'Why did Europeans add sugar and honey to the drink?',
        choices: [
          'They did not like the bitter taste.',
          'Sugar made the drink last longer.',
          'The Aztecs had recommended it.',
          'They wanted to sell it as medicine.'
        ],
        answer: 0,
        explanation: '「found the bitter drink strange」の直後に砂糖と蜂蜜を加えたとあります。苦さが受け入れられなかったためだと読み取れます。'
      },
      {
        q: 'In the last paragraph, "the technology built around it" refers to',
        choices: [
          'the ships that carried cacao to Europe',
          'the machines that pressed beans and controlled the fat',
          'the farms where cacao trees were planted',
          'the shops that sold chocolate to children'
        ],
        answer: 1,
        explanation: '第4段落で述べられた19世紀の機械のことです。豆そのものは変わらず、加工技術が変わったという結びになっています。'
      },
      {
        q: 'What is the main idea of the passage?',
        choices: [
          'The Aztecs invented the chocolate bar.',
          'Chocolate was healthier before sugar was added.',
          'Chocolate as we know it is a recent product of technology.',
          'Switzerland produces the best chocolate in the world.'
        ],
        answer: 2,
        explanation: '3000年の歴史を持つ植物に対し、食べる板チョコは19世紀の発明だという流れです。変わったのは技術だと最後に明言しています。'
      }
    ]
  },
  {
    id: 'r12',
    title: 'Should School Start Later?',
    level: 3,
    topic: '社会',
    words: 255,
    passage:
      'Every morning, millions of teenagers pull themselves out of bed before seven o\'clock. Many of them arrive at school half asleep. In recent years some schools have tried a simple experiment: start the day one hour later.\n' +
      'The argument for a later start is not that teenagers are lazy. Researchers have found that during the teenage years the body clock shifts. Teenagers naturally become sleepy later at night and wake later in the morning, and this happens whatever time they go to bed. Asking a fifteen-year-old to concentrate at half past seven, some scientists say, is like asking an adult to work at half past five.\n' +
      'Schools that moved their start time have reported encouraging results. Students were absent less often, and in several studies test scores rose slightly. Teachers said that first-period lessons felt different because fewer students were staring at their desks.\n' +
      'The change is far from simple, however. School buses often serve primary and secondary schools with the same drivers, so moving one start time forces the other to move as well. After-school clubs and part-time jobs finish later, which some families dislike. Parents who leave for work early may have to leave younger children at home alone.\n' +
      'Because of these problems, most schools have kept their old timetable. Still, the research is difficult to ignore. The question is no longer whether teenagers need more sleep in the morning. It is whether schools, buses and working hours can be rebuilt around that fact.',
    glossary: [
      { w: 'shift', m: 'ずれる' },
      { w: 'encouraging', m: '期待の持てる' },
      { w: 'timetable', m: '時間割' }
    ],
    questions: [
      {
        q: 'What happens to the body clock during the teenage years?',
        choices: [
          'Teenagers need fewer hours of sleep than adults.',
          'Teenagers sleep more deeply in the afternoon.',
          'Teenagers stop needing a regular bedtime.',
          'Teenagers become sleepy later and wake later.'
        ],
        answer: 3,
        explanation: '第2段落に「become sleepy later at night and wake later in the morning」とあります。就寝時刻に関係なく起こると書かれています。'
      },
      {
        q: 'What results did schools with a later start report?',
        choices: [
          'Fewer absences and slightly higher test scores.',
          'Shorter lessons and longer holidays.',
          'More students joining after-school clubs.',
          'Lower costs for school buses.'
        ],
        answer: 0,
        explanation: '第3段落に「Students were absent less often, and ... test scores rose slightly」とあります。'
      },
      {
        q: 'Which problem with a later start does the passage mention?',
        choices: [
          'Teachers refuse to work in the afternoon.',
          'The same buses and drivers serve two kinds of school.',
          'Students cannot eat breakfast at home.',
          'Examinations must be held in the morning.'
        ],
        answer: 1,
        explanation: '第4段落に、同じバスと運転手が小学校と中等学校を担当しているため一方をずらすと他方も動くとあります。'
      },
      {
        q: 'In the third paragraph, "encouraging" is closest in meaning to',
        choices: [
          'difficult to believe',
          'expensive to obtain',
          'giving reason for hope',
          'agreed by everyone'
        ],
        answer: 2,
        explanation: '直後に欠席が減り点数が上がったという良い結果が並びます。「期待の持てる」という意味です。'
      },
      {
        q: 'What does the writer suggest at the end of the passage?',
        choices: [
          'More research on teenage sleep is still needed.',
          'Teenagers should simply go to bed earlier.',
          'Schools that changed their times have made a mistake.',
          'The remaining difficulty is organisational rather than scientific.'
        ],
        answer: 3,
        explanation: '「もはや睡眠が必要かどうかが問題ではなく、学校やバスや勤務時間をそれに合わせて組み直せるかどうかだ」と結んでいます。科学ではなく仕組みの問題だという指摘です。'
      }
    ]
  },

  // ============================================================
  // レベル4（英検2級 / CEFR B2）
  // ============================================================
  {
    id: 'r13',
    title: 'Why We Forget',
    level: 4,
    topic: '科学',
    words: 290,
    passage:
      'Forgetting feels like a failure. We lose a name, a date, a face, and we blame our memory for letting us down. Yet a growing number of researchers argue that forgetting is not a fault in the system. It is part of the design.\n' +
      'Consider what perfect memory would actually mean. A small number of people can recall almost every day of their lives in detail, and interviews with them reveal a surprising cost. Old arguments remain as sharp as they were on the day they happened. Small embarrassments never fade. Deciding what deserves attention becomes harder, precisely because everything is equally available.\n' +
      'The brain appears to avoid this by weakening connections that are rarely used. Information that is retrieved often is strengthened, while information that is ignored gradually becomes harder to reach. This explains a finding that surprises many students: reviewing a subject once a week for five weeks produces better results than reading it five times in a single evening. The brain does not measure how long you looked at something. It measures how often you needed it.\n' +
      'There is a further advantage. Losing the details while keeping the general pattern is what allows knowledge to travel to new situations. A student who has memorised the exact wording of one mathematics problem has learned very little. A student who has forgotten the wording but kept the method can solve problems never seen before. The forgetting is not a side effect of the learning; in a sense it is the learning.\n' +
      'None of this means that every memory failure is welcome. Forgetting a medical appointment is simply inconvenient. But the next time a name refuses to come, it may help to remember that a brain which kept everything would not be a better brain. It would only be a more crowded one.',
    glossary: [
      { w: 'retrieve', m: '思い出す、取り出す' },
      { w: 'fade', m: '薄れる' },
      { w: 'crowded', m: '詰め込まれた' }
    ],
    questions: [
      {
        q: 'What do interviews with people who remember almost everything reveal?',
        choices: [
          'Painful memories stay sharp and choosing what matters becomes harder.',
          'They perform better than others in examinations.',
          'They gradually lose the ability to learn new skills.',
          'They remember facts but forget faces.'
        ],
        answer: 0,
        explanation: '第2段落に、古い口論が当日のまま鋭く残り、恥ずかしい出来事も薄れず、何に注意を向けるかの判断が難しくなるとあります。'
      },
      {
        q: 'Why is weekly review more effective than five readings in one evening?',
        choices: [
          'Students concentrate better in the morning than at night.',
          'The brain strengthens what is needed often, not what is looked at long.',
          'Reading the same page repeatedly damages the memory.',
          'A week is long enough to forget the subject completely.'
        ],
        answer: 1,
        explanation: '第3段落の結論そのものです。「how long you looked at something」ではなく「how often you needed it」を測っていると述べられています。'
      },
      {
        q: 'In the third paragraph, "retrieved" is closest in meaning to',
        choices: [
          'written down carefully',
          'explained to others',
          'brought back to mind',
          'checked for mistakes'
        ],
        answer: 2,
        explanation: '使われずに届きにくくなる情報と対比されています。「思い出す・引き出す」という意味です。'
      },
      {
        q: 'What point does the writer make with the mathematics example?',
        choices: [
          'Mathematics is harder to remember than other subjects.',
          'Students should memorise several problems word for word.',
          'Teachers should change the wording of every problem.',
          'Keeping the method matters more than keeping the wording.'
        ],
        answer: 3,
        explanation: '文言を覚えた生徒はほとんど学んでおらず、文言を忘れて方法を保った生徒は初見の問題を解けるという対比です。'
      },
      {
        q: 'Which statement best expresses the main argument of the passage?',
        choices: [
          'Forgetting is not a defect but a useful feature of memory.',
          'Memory can be improved by training every day.',
          'People who forget names are usually not paying attention.',
          'Perfect memory would make learning much easier.'
        ],
        answer: 0,
        explanation: '冒頭で「忘れることは設計の一部だ」と述べ、最後に「すべてを保つ脳は優れた脳ではなく、混雑した脳にすぎない」と結んでいます。'
      }
    ]
  },
  {
    id: 'r14',
    title: 'Translation Machines and the Future of Language Learning',
    level: 4,
    topic: '技術',
    words: 295,
    passage:
      'Machine translation has improved so quickly that a reasonable question has appeared: why learn a foreign language at all? A phone can now translate a menu, a street sign or a spoken conversation with an accuracy that would have seemed impossible twenty years ago. If the machine can do the work, the argument goes, human effort is better spent elsewhere.\n' +
      'The argument is weaker than it first appears. Translation replaces words, but using a language involves a great deal more than words. Deciding how direct to be, judging when a joke will be welcome, sensing how much silence a listener will tolerate, knowing which question would be rude to ask first — these are judgements no translation tool makes on your behalf. A perfectly translated sentence delivered at the wrong moment can still damage a relationship.\n' +
      'There is also a difference between understanding and participating. A tourist who reads a translated menu has understood it. A student who spends a year abroad is doing something else entirely: taking part in a lesson, disagreeing with someone, being misunderstood and then repairing the misunderstanding. Machines can carry meaning across a gap. They cannot close the gap.\n' +
      'That said, it would be dishonest to pretend that nothing has changed. The purely practical case for language learning — ordering food, booking a room, asking for directions — has genuinely weakened, and teachers who still build their courses around those situations are defending ground that has already been lost. What remains are the reasons that were always harder to put on a poster: access to how another culture organises its thinking, the trust that comes from making the effort, and the well-documented effects on the brain of holding two systems at once.\n' +
      'Language learning has not become unnecessary. Its justification has simply moved from convenience to something that is less easily replaced.',
    glossary: [
      { w: 'tolerate', m: '受け入れる、我慢する' },
      { w: 'on your behalf', m: 'あなたに代わって' },
      { w: 'justification', m: '正当な理由' }
    ],
    questions: [
      {
        q: 'Which judgement does the writer say a translation tool does NOT make for you?',
        choices: [
          'Which word in a menu means fish.',
          'How direct it is appropriate to be.',
          'How a street sign should be read.',
          'What a spoken sentence means.'
        ],
        answer: 1,
        explanation: '第2段落に「Deciding how direct to be」以下が並び、これらは翻訳ツールが代わりに判断してくれないと述べられています。他の3つは機械ができることです。'
      },
      {
        q: 'What does the writer mean by "They cannot close the gap"?',
        choices: [
          'Machines still make too many translation mistakes.',
          'Machines cannot work without an internet connection.',
          'Machines convey meaning but cannot make you a participant.',
          'Machines are too expensive for most students.'
        ],
        answer: 2,
        explanation: '直前の「understanding」と「participating」の対比を受けた一文です。意味は運べても、その場に加わることまではさせてくれないという意味です。'
      },
      {
        q: 'Which reason for learning a language does the writer admit has weakened?',
        choices: [
          'The cultural one, such as understanding how others think.',
          'The social one, such as building trust with people.',
          'The scientific one, such as the effect on the brain.',
          'The practical one, such as ordering food or asking directions.'
        ],
        answer: 3,
        explanation: '第4段落に「The purely practical case ... has genuinely weakened」とあります。残る理由として文化・信頼・脳への効果が挙げられています。'
      },
      {
        q: 'What does the writer imply about teachers who focus on ordering food and booking rooms?',
        choices: [
          'They are defending a purpose that machines have already taken over.',
          'They are preparing students for the most common situations.',
          'They should also teach students how to use translation apps.',
          'They produce better results than teachers of culture.'
        ],
        answer: 0,
        explanation: '「defending ground that has already been lost」という表現から、すでに機械に明け渡された領分を守っているという含みが読み取れます。'
      },
      {
        q: 'Which statement best expresses the writer\'s position?',
        choices: [
          'Machine translation will soon replace language teachers completely.',
          'Language learning is still worthwhile, but for different reasons than before.',
          'Machine translation is far less accurate than people believe.',
          'Students should stop using translation tools while studying.'
        ],
        answer: 1,
        explanation: '最終段落の「不要になったのではなく、正当化の理由が便利さから別のものへ移った」がそのまま主張です。'
      }
    ]
  },
  {
    id: 'r15',
    title: 'The Real Price of Cheap Clothes',
    level: 4,
    topic: '環境・経済',
    words: 290,
    passage:
      'A T-shirt that costs less than a sandwich is a recent phenomenon. Forty years ago clothing took a noticeable share of a household budget, and a winter coat was expected to last for years. Today the average garment is worn far fewer times before it is thrown away, and in several countries the number of items bought per person has roughly doubled.\n' +
      'The industry that produces this abundance is usually called fast fashion, and its logic is straightforward. Design cycles that once took six months now take a few weeks. Small quantities of many designs are sent to shops, and whatever sells is repeated at once. Because each design exists only briefly, shoppers learn to buy immediately rather than wait for a sale, and the sense that clothes are temporary becomes part of the product itself.\n' +
      'The costs appear elsewhere. Textile production consumes enormous quantities of water and releases dyes into rivers. Synthetic fabrics shed microscopic fibres every time they are washed, and these fibres are now found in rivers, in soil and in the bodies of fish. Most discarded clothing is neither recycled nor resold. It is burned or buried, sometimes thousands of kilometres from the country where it was bought.\n' +
      'Solutions are debated far more easily than they are applied. Recycling textiles is technically difficult because most garments mix several materials, and separating them costs more than the recovered fibre is worth. Second-hand markets absorb only a fraction of what is produced. Some governments have begun to require companies to take responsibility for their products after they are discarded, which shifts part of the cost back to the seller.\n' +
      'Perhaps the most useful question is not which brand does least harm. It is why a garment became something we expect to replace rather than repair.',
    glossary: [
      { w: 'garment', m: '衣類' },
      { w: 'abundance', m: 'ありあまるほどの量' },
      { w: 'discard', m: '捨てる' }
    ],
    questions: [
      {
        q: 'How have design cycles in the clothing industry changed?',
        choices: [
          'They have grown from a few weeks to six months.',
          'They now follow the four seasons exactly.',
          'They have fallen from about six months to a few weeks.',
          'They are decided by second-hand shops.'
        ],
        answer: 2,
        explanation: '第2段落に「Design cycles that once took six months now take a few weeks」とあります。'
      },
      {
        q: 'According to the passage, why do shoppers buy immediately?',
        choices: [
          'Prices rise steadily throughout the season.',
          'Shops refuse to hold items for customers.',
          'Clothes are sold only in small quantities.',
          'Each design is available only for a short time.'
        ],
        answer: 3,
        explanation: '「Because each design exists only briefly, shoppers learn to buy immediately rather than wait for a sale」とあります。'
      },
      {
        q: 'Why is recycling textiles technically difficult?',
        choices: [
          'Most garments mix several materials that are costly to separate.',
          'Recycling machines are not yet invented.',
          'Governments do not allow textiles to be reused.',
          'Second-hand markets buy all the clothing first.'
        ],
        answer: 0,
        explanation: '第4段落に、混紡のため分離費用が回収した繊維の価値を上回るとあります。技術と採算の両方の問題です。'
      },
      {
        q: 'In the second paragraph, "abundance" is closest in meaning to',
        choices: [
          'a careful selection',
          'a very large quantity',
          'a rising price',
          'a lasting quality'
        ],
        answer: 1,
        explanation: '一人あたりの購入枚数が倍増したという直前の内容を受けています。「あり余るほどの量」です。'
      },
      {
        q: 'What does the final question suggest about the writer\'s view?',
        choices: [
          'Consumers should compare brands more carefully before buying.',
          'Governments alone can solve the problem through regulation.',
          'The deeper problem is our expectation that clothes are disposable.',
          'Repairing clothes is cheaper than buying new ones.'
        ],
        answer: 2,
        explanation: '「どのブランドが害が少ないか」ではなく「なぜ修理せず買い替えるものになったのか」を問うています。個々の選択より前提そのものに目を向けています。'
      }
    ]
  },
  {
    id: 'r16',
    title: 'The Forest Beneath the Forest',
    level: 4,
    topic: '生物',
    words: 295,
    passage:
      'For most of the twentieth century, a forest was understood as a collection of individuals in competition. Each tree reached upward for light and downward for water and nutrients, and the strongest survived. Research over the past thirty years has complicated that picture considerably.\n' +
      'Beneath the soil, the roots of most forest trees are wrapped in fungi. The relationship is an exchange. The fungus receives sugars that the tree produces above ground using sunlight, and in return it delivers water and minerals that its extremely fine threads can reach but roots cannot. What surprised researchers was that these threads do not connect one fungus to one tree. They link many trees together, and sometimes trees of different species.\n' +
      'Experiments using carbon that had been labelled so that it could be traced showed that sugars can travel from one tree to another through this network. Large, old trees have been observed transferring resources to shaded seedlings, including seedlings that are not their own offspring. Chemical signals warning of insect attack also appear to move between connected plants, and neighbours that receive such a signal raise their chemical defences before the insects arrive.\n' +
      'How these findings should be interpreted is still argued about. Some researchers describe cooperation, and the phrase "the wood wide web" has spread far beyond the laboratory. Others point out that the fungi have interests of their own and may simply be managing their own supply of sugar, and that a signal is not the same thing as an intention. Several widely reported claims rest on a small number of studies. The disagreement is genuine and has not been settled.\n' +
      'What is no longer seriously disputed is the connection itself. A forest is not only a set of trees standing near one another. Underground, it is also a single system.',
    glossary: [
      { w: 'fungus / fungi', m: '菌類' },
      { w: 'seedling', m: '苗木' },
      { w: 'dispute', m: '異議を唱える' }
    ],
    questions: [
      {
        q: 'What does the fungus receive from the tree?',
        choices: [
          'Water drawn up from deep in the soil.',
          'Minerals collected by its fine threads.',
          'Protection from insect attack.',
          'Sugars produced above ground using sunlight.'
        ],
        answer: 3,
        explanation: '第2段落の交換関係です。菌類は糖を受け取り、代わりに水とミネラルを届けます。選択肢の残り3つは向きが逆です。'
      },
      {
        q: 'What did the experiments using labelled carbon show?',
        choices: [
          'Sugars can move from one tree to another.',
          'Fungi grow faster in warm soil.',
          'Old trees produce more sugar than young ones.',
          'Insects avoid trees connected by fungi.'
        ],
        answer: 0,
        explanation: '第3段落に「sugars can travel from one tree to another through this network」とあります。'
      },
      {
        q: 'What do some researchers say against the idea of cooperation?',
        choices: [
          'The threads are too thin to carry sugar.',
          'The fungi may simply be managing their own supply.',
          'Trees of different species are never connected.',
          'The labelled carbon experiments were never repeated.'
        ],
        answer: 1,
        explanation: '第4段落に、菌類には自身の利害があり自分の糖の供給を管理しているだけかもしれない、信号は意図と同じではない、とあります。'
      },
      {
        q: 'In the first paragraph, "complicated that picture" means that the research has',
        choices: [
          'proved that the earlier view was completely correct',
          'made the forest more difficult to photograph',
          'made the earlier simple view no longer adequate',
          'reduced the number of questions to answer'
        ],
        answer: 2,
        explanation: '「競争する個体の集まり」という単純な見方に対し、その後の段落で地下のつながりが示されます。従来の見方では足りなくなったという意味です。'
      },
      {
        q: 'Which statement best expresses the conclusion of the passage?',
        choices: [
          'Trees cooperate deliberately to help their neighbours.',
          'The idea of the wood wide web has been shown to be false.',
          'Competition between trees does not exist in real forests.',
          'The connection between trees is established, but its meaning is still debated.'
        ],
        answer: 3,
        explanation: '最終段落で「解釈は決着していないが、つながりの存在はもはや真剣には疑われていない」と分けて述べています。断定しすぎない選択肢が正解です。'
      }
    ]
  },

  // ---- r17〜r22: TOEFL Junior 教材3冊（Basic A2 / Intermediate B1 / Advanced B2）の
  //      形式・語彙レベル・本文長に合わせて書き下ろした。教材本文の転載はしていない。
  //      Basic はメール・お知らせ、Intermediate は記事調、Advanced は引用入りの長めの記事。

  {
    id: 'r17',
    title: 'International Food Day',
    level: 2,
    topic: '手紙・メール',
    words: 180,
    passage:
      'Dear Class,\n' +
      'I am writing to tell you about our International Food Day on Friday, 22 May. On that day, every student will bring one small dish from a country he or she likes. We will share the food at lunch time in our classroom.\n' +
      'Please write the name of your dish on the sign-up sheet by Monday. Two students cannot bring the same dish, so check the list before you choose. If you cannot cook, do not worry. Fruit or bread from a shop is fine, too.\n' +
      'Please remember two important rules. First, do not bring any food with nuts, because some students are allergic to them. Second, write the name of the country and the main ingredients on a small card and put the card next to your dish.\n' +
      'We will also vote for the most interesting dish, and the winner will get a small prize. Last year the winner was a cold soup from Spain, and many students tried it for the first time.\n' +
      'If you have any questions, please ask me after class.\n' +
      'Ms. Porter',
    glossary: [
      { w: 'sign-up sheet', m: '参加申し込み用紙' },
      { w: 'allergic', m: 'アレルギーがある' },
      { w: 'ingredient', m: '材料' }
    ],
    questions: [
      {
        q: 'Why did Ms. Porter write this e-mail?',
        choices: [
          'To ask students to cook lunch every Friday.',
          'To give information about International Food Day.',
          'To tell the class about a cooking test.',
          'To invite parents to the school.'
        ],
        answer: 1,
        explanation: '冒頭に「I am writing to tell you about our International Food Day」とあります。メール全体が行事の案内です。'
      },
      {
        q: 'What must students do by Monday?',
        choices: [
          'Bring a small dish to school.',
          'Cook something at home.',
          'Vote for the most interesting dish.',
          'Write their dish on the sign-up sheet.'
        ],
        answer: 3,
        explanation: '第3段落に「Please write the name of your dish on the sign-up sheet by Monday」とあります。料理を持ってくるのは金曜日です。'
      },
      {
        q: 'In the fourth paragraph, the word "them" refers to',
        choices: ['nuts', 'students', 'rules', 'cards'],
        answer: 0,
        explanation: '「some students are allergic to them」の them は、直前の「food with nuts」の nuts を指します。ナッツにアレルギーのある生徒がいる、という意味です。'
      },
      {
        q: 'Why should students check the list before choosing a dish?',
        choices: [
          'Because the teacher chooses the dishes.',
          'Because some dishes are too difficult to cook.',
          'Because two students cannot bring the same dish.',
          'Because shop food is not allowed.'
        ],
        answer: 2,
        explanation: '「Two students cannot bring the same dish, so check the list」とあります。同じ料理が重ならないように確認するためです。'
      }
    ]
  },

  {
    id: 'r18',
    title: 'New Library Hours',
    level: 2,
    topic: 'お知らせ',
    words: 185,
    passage:
      'To: All students\n' +
      'From: The School Library\n' +
      'Subject: New opening hours and study rooms\n' +
      'From Monday, 3 October, the library will open earlier and close later. The new hours are 7:30 a.m. to 5:30 p.m. on school days. On Saturdays the library will open from 9:00 a.m. to noon. It will stay closed on Sundays.\n' +
      'We are also opening two new study rooms on the second floor. Each room has a large table and six chairs. Groups of three or more students can book a room for one hour at the front desk. Please book at least one day early, because the rooms are very popular before tests.\n' +
      'Please remember that food and drinks are not allowed anywhere in the library. Water in a closed bottle is the only exception. Students who leave rubbish will lose their booking rights for one month.\n' +
      'Finally, we still need volunteers for the Book Week display in November. Volunteers meet every Tuesday at lunch time in Room 12. You do not need any experience, and helpers receive a service point for each meeting.\n' +
      'Mr. Navin, Head Librarian',
    glossary: [
      { w: 'book', m: '（部屋を）予約する' },
      { w: 'exception', m: '例外' },
      { w: 'display', m: '展示' }
    ],
    questions: [
      {
        q: 'When is the library open on Saturdays?',
        choices: [
          'From 7:30 a.m. to 5:30 p.m.',
          'It is closed on Saturdays.',
          'From 9:00 a.m. to noon.',
          'From noon to 5:30 p.m.'
        ],
        answer: 2,
        explanation: '第1段落に「On Saturdays the library will open from 9:00 a.m. to noon」とあります。7:30〜5:30 は平日の時間なので混同しないこと。'
      },
      {
        q: 'What is true about the new study rooms?',
        choices: [
          'Groups of three or more can book them at the front desk.',
          'One student can use a room alone.',
          'They can be booked for a whole day.',
          'They are on the first floor.'
        ],
        answer: 0,
        explanation: '第2段落に「Groups of three or more students can book a room for one hour at the front desk」とあります。部屋は2階、予約は1時間単位です。'
      },
      {
        q: 'The notice says water in a closed bottle is "the only exception." This means that water is',
        choices: [
          'not allowed anywhere in the library',
          'sold at the front desk',
          'free for volunteers',
          'the one thing students may bring in'
        ],
        answer: 3,
        explanation: '直前に「food and drinks are not allowed」とあり、exception（例外）はそのルールから外れるもの、つまり唯一持ち込んでよいものという意味です。'
      },
      {
        q: 'What can we guess about the Book Week volunteers?',
        choices: [
          'They must work every day in November.',
          'Any student can join, even without experience.',
          'They must be good at making displays.',
          'They meet on Saturday mornings.'
        ],
        answer: 1,
        explanation: '最終段落に「You do not need any experience」とあるので、経験がなくても誰でも参加できると分かります。集まりは火曜日の昼です。'
      }
    ]
  },

  {
    id: 'r19',
    title: 'A Day at the Aquarium',
    level: 3,
    topic: '学校生活',
    words: 255,
    passage:
      'Last Thursday, the whole eighth grade spent the day at the Blue Reef Aquarium on the other side of the city. It was the first class trip of the year, and for many of us it was the first visit to an aquarium since primary school.\n' +
      'The morning began with a guided tour behind the scenes. Our guide, Ms. Lena, showed us the kitchen where the food for the animals is prepared. To our surprise, the sea turtles eat fresh vegetables every day, and preparing all the meals takes the staff more than three hours each morning. We also saw the quarantine tanks, where new animals stay for several weeks before they join the main tanks. Ms. Lena explained that this waiting time protects the other animals from disease.\n' +
      'After lunch we watched the feeding of the sharks. A diver entered the huge tank and fed them by hand while another member of staff spoke to the audience. Many of us expected the sharks to be aggressive, but they moved slowly and calmly the whole time. "People fear sharks because of films," the speaker said, "but in fact sharks have much more reason to fear people."\n' +
      'On the bus home, our teacher asked everyone to name one thing they had learned. The answers were so different that it took the whole journey to hear them all. The class agreed that one day was not enough, and Ms. Lena told us the aquarium is looking for weekend volunteers. Several students have already taken application forms.',
    glossary: [
      { w: 'quarantine', m: '検疫、隔離' },
      { w: 'aggressive', m: '攻撃的な' },
      { w: 'application form', m: '申込書' }
    ],
    questions: [
      {
        q: 'What is this article mainly about?',
        choices: [
          'How to become a volunteer at an aquarium.',
          'The dangers of keeping sharks in tanks.',
          'The daily work of an aquarium guide.',
          'A class trip to an aquarium and what students learned.'
        ],
        answer: 3,
        explanation: '記事全体が8年生の見学の一日（舞台裏ツアー→サメの餌やり→帰りのバス）を報告しています。ボランティアは最後に触れられるだけです。'
      },
      {
        q: 'Why do new animals stay in the quarantine tanks?',
        choices: [
          'Because the main tanks are too crowded.',
          'To protect the other animals from disease.',
          'Because they need special food.',
          'To let visitors see them more easily.'
        ],
        answer: 1,
        explanation: '第2段落の最後に「this waiting time protects the other animals from disease」とあります。'
      },
      {
        q: 'In the third paragraph, the word "aggressive" is closest in meaning to',
        choices: ['ready to attack', 'very hungry', 'fast and playful', 'shy and quiet'],
        answer: 0,
        explanation: '「攻撃的だと思っていたが、実際はゆっくり穏やかに動いた」という対比から、aggressive は「攻撃してきそうな」という意味だと分かります。'
      },
      {
        q: 'In the third paragraph, the word "them" in "fed them by hand" refers to',
        choices: ['the students', 'the staff', 'the sharks', 'the vegetables'],
        answer: 2,
        explanation: '「A diver entered the huge tank and fed them by hand」の them は、直前の文の the sharks を指します。ダイバーがサメに手で餌をやったのです。'
      },
      {
        q: 'What can we guess from the last paragraph?',
        choices: [
          'The teacher thought the trip was too long.',
          'Some students want to go back to the aquarium.',
          'The aquarium will close on weekends.',
          'Most students learned the same thing.'
        ],
        answer: 1,
        explanation: '「一日では足りない」という感想に続けて、数人がすでにボランティアの申込書をもらったとあるので、また行きたい生徒がいると推測できます。'
      }
    ]
  },

  {
    id: 'r20',
    title: 'The Ocean\'s Quick-Change Artist',
    level: 3,
    topic: '理科',
    words: 260,
    passage:
      'The octopus has no shell, no sharp teeth for fighting, and a soft body that many sea animals would be happy to eat. Yet octopuses have survived in the oceans for millions of years. Their secret is one of the most surprising skills in the animal world: they can change the colour and even the texture of their skin in less than a second.\n' +
      'The skin of an octopus contains thousands of tiny bags of colour. Each bag is surrounded by small muscles. When the muscles pull, the bag opens wide and its colour shows; when they relax, the colour almost disappears. By controlling millions of these muscles at once, the octopus can produce spots, stripes, or waves of colour that move across its body. Under the colour bags, other special cells reflect light, which helps the animal match the blue and green of the sea.\n' +
      'Colour is only half of the trick. An octopus can also raise small bumps on its skin to copy the rough surface of a rock or a piece of coral. Sitting still on the sea floor, a hiding octopus is almost impossible to see, even from very close.\n' +
      'Strangely, scientists believe that octopuses cannot see colours with their eyes. How can an animal copy colours it cannot see? Some researchers think the skin itself can sense light, working like millions of very simple eyes. The idea has not been fully proved, but tests have shown that skin taken from an octopus reacts to light even when it is no longer connected to the brain.',
    glossary: [
      { w: 'texture', m: '手ざわり、表面の質感' },
      { w: 'muscle', m: '筋肉' },
      { w: 'reflect', m: '反射する' }
    ],
    questions: [
      {
        q: 'What is the main topic of this passage?',
        choices: [
          'How octopuses hide by changing their skin.',
          'Why octopuses have no shell.',
          'What octopuses like to eat.',
          'How octopuses fight against sharks.'
        ],
        answer: 0,
        explanation: '第1段落の最後で「皮膚の色と質感を1秒以内に変えられる」と主題を示し、以降の段落でその仕組みを説明しています。'
      },
      {
        q: 'What happens when the small muscles pull the bag of colour?',
        choices: [
          'The bag moves to another part of the body.',
          'The colour almost disappears.',
          'The bag opens and its colour shows.',
          'The skin becomes rough like a rock.'
        ],
        answer: 2,
        explanation: '第2段落に「When the muscles pull, the bag opens wide and its colour shows」とあります。色が消えるのは筋肉がゆるんだときです。'
      },
      {
        q: 'In the third paragraph, "the trick" refers to the octopus\'s ability to',
        choices: [
          'swim faster than its enemies',
          'make itself hard to see',
          'live for millions of years',
          'find food on the sea floor'
        ],
        answer: 1,
        explanation: '「Colour is only half of the trick」の trick は、身を隠す技のこと。色に加えて皮膚の凹凸でも岩やサンゴに似せる、と続きます。'
      },
      {
        q: 'In the second paragraph, the word "they" in "when they relax" refers to',
        choices: ['the colours', 'the bags', 'the octopuses', 'the muscles'],
        answer: 3,
        explanation: '「When the muscles pull ... when they relax」と対になっているので、they は the muscles を指します。'
      },
      {
        q: 'What evidence supports the idea that octopus skin can sense light?',
        choices: [
          'Octopuses always change colour at night.',
          'Octopus eyes are larger than human eyes.',
          'Skin removed from an octopus still reacts to light.',
          'Octopuses cannot copy the colour of coral.'
        ],
        answer: 2,
        explanation: '最終段落に「skin taken from an octopus reacts to light even when it is no longer connected to the brain」とあります。脳とつながっていなくても反応することが根拠です。'
      }
    ]
  },

  {
    id: 'r21',
    title: 'A Month at Westbrook College',
    level: 4,
    topic: '文化',
    words: 305,
    passage:
      'For the past month, fifteen students from our school have been attending Westbrook College, our sister school near Melbourne, Australia. The exchange, now in its third year, gives Grade 8 and 9 students the chance to live with an Australian host family and attend regular classes taught entirely in English.\n' +
      'The days at Westbrook were long, but few students complained. Classes ran from 8:40 to 3:20, followed by sport or music, and in the evenings there was homework in English as well — more than one student fell asleep at the kitchen table during the first week. At first, several students found it difficult to follow discussions in class. "For the first week I understood about half of what my teachers said," admits Natcha, a Grade 8 student. "I was too shy to ask anyone to repeat things. My host sister taught me to say, could you say that again, more slowly? After that, everything changed."\n' +
      'Ms. Suda, the teacher who accompanied the group, believes that living with a family, rather than in a hotel, is what makes the programme work. "In a hotel, our students would speak Thai to each other every evening," she explains. "In a host family, they must use English from breakfast to bedtime. Real progress happens at the dinner table, not in the classroom."\n' +
      'The Australian families seem to have gained something as well. Several hosts attended the farewell assembly, where they said goodbye in the Thai phrases they had learned from their guests, and some are already planning holidays in Thailand next year. The two schools will now begin preparing the return visit, when Westbrook students will spend a month in Bangkok. Application forms for next year\'s exchange will be available from the school office in January, and, if this year is any guide, they will disappear quickly.',
    glossary: [
      { w: 'exchange', m: '交換留学' },
      { w: 'accompany', m: '同行する' },
      { w: 'farewell', m: '送別の' }
    ],
    questions: [
      {
        q: 'What is this article mainly about?',
        choices: [
          'The history of a school in Melbourne.',
          'A one-month student exchange programme in Australia.',
          'How to apply for a host family.',
          'The differences between Thai and Australian classes.'
        ],
        answer: 1,
        explanation: '第1段落で交換留学の概要を示し、以降で学校生活・ホストファミリー・今後の予定を報告しています。応募方法は最後に一言あるだけです。'
      },
      {
        q: 'What problem did Natcha have at first?',
        choices: [
          'She understood only about half of what her teachers said.',
          'Her host family spoke too quickly at dinner.',
          'She could not find her classrooms.',
          'She did not like sport after class.'
        ],
        answer: 0,
        explanation: '第2段落の本人の言葉に「For the first week I understood about half of what my teachers said」とあります。'
      },
      {
        q: 'In the third paragraph, the word "accompanied" is closest in meaning to',
        choices: ['taught', 'chose', 'photographed', 'went with'],
        answer: 3,
        explanation: 'accompany は「〜に同行する」。引率としてグループと一緒にオーストラリアへ行った先生、という文脈です。'
      },
      {
        q: 'Why does Ms. Suda think host families are better than hotels?',
        choices: [
          'Host families cook better food than hotels.',
          'Hotels near Westbrook are too expensive.',
          'Students must use English all day with a host family.',
          'Students can study alone in a quiet room.'
        ],
        answer: 2,
        explanation: '第3段落に「In a host family, they must use English from breakfast to bedtime」とあります。ホテルだと生徒同士でタイ語を話してしまうからです。'
      },
      {
        q: 'The writer says the application forms "will disappear quickly." This suggests that',
        choices: [
          'the exchange programme is very popular',
          'the school prints very few forms',
          'the office often loses documents',
          'the deadline is earlier than last year'
        ],
        answer: 0,
        explanation: '「if this year is any guide（今年の様子から判断すると）」に続く表現です。申込書がすぐなくなる＝希望者が多い、と推測できます。'
      }
    ]
  },

  {
    id: 'r22',
    title: 'Islands of Heat',
    level: 4,
    topic: '環境',
    words: 305,
    passage:
      'On a summer night, the centre of a large city can be five to seven degrees warmer than the countryside around it. Scientists call this difference the urban heat island effect, and it is one of the clearest examples of how humans change their own environment without intending to.\n' +
      'The causes are well understood. Dark surfaces such as roads and roofs absorb sunlight during the day and release the heat slowly through the night. Tall buildings block the wind that would otherwise carry warm air away, and the narrow spaces between them trap heat like the walls of an oven. Cars, air conditioners, and factories add waste heat of their own. Meanwhile, the trees and wet ground that cool the countryside by evaporation have largely been replaced by concrete, which stores heat instead.\n' +
      'The effect is more than a matter of comfort. During heat waves, the extra degrees can be dangerous, especially for elderly people living in flats that never cool down at night. Higher temperatures also increase the demand for air conditioning, which requires electricity, whose production releases still more heat and greenhouse gases — a circle that feeds itself.\n' +
      'Cities are experimenting with answers. Some now require new roofs to be painted white or covered with plants, so that they reflect sunlight instead of storing it. Seoul removed an old motorway to uncover a river that now cools the city centre. Studies suggest that street trees are among the cheapest solutions: a mature tree cools the air around it as effectively as several air conditioners, at the price of some water.\n' +
      'None of these measures can remove the heat island completely. But together they can reduce it, and they make the city a more pleasant place to live — proof that the same planning that created the problem can also soften it.',
    glossary: [
      { w: 'urban', m: '都市の' },
      { w: 'evaporation', m: '蒸発' },
      { w: 'measure', m: '対策' }
    ],
    questions: [
      {
        q: 'What is this passage mainly about?',
        choices: [
          'Why elderly people should leave large cities.',
          'How air conditioners are designed.',
          'Why cities are warmer than the countryside and what can be done.',
          'How Seoul rebuilt its old motorway.'
        ],
        answer: 2,
        explanation: '第1〜2段落で原因、第3段落で影響、第4〜5段落で対策と、ヒートアイランド現象の全体を説明しています。ソウルの例は対策の一つにすぎません。'
      },
      {
        q: 'According to the passage, what do tall buildings do?',
        choices: [
          'They store cool air during the night.',
          'They reflect sunlight back into the sky.',
          'They produce waste heat like factories.',
          'They block the wind that would carry warm air away.'
        ],
        answer: 3,
        explanation: '第2段落に「Tall buildings block the wind that would otherwise carry warm air away」とあります。'
      },
      {
        q: 'The writer calls the demand for air conditioning "a circle that feeds itself" because',
        choices: [
          'air conditioners use water as well as electricity',
          'cooling buildings creates more heat, which increases the need for cooling',
          'electricity prices rise and fall with the seasons',
          'most people turn on air conditioners at the same time'
        ],
        answer: 1,
        explanation: '冷房→電力→発電でさらに熱と温室効果ガスが出る→さらに暑くなり冷房が必要になる、という悪循環を指しています。'
      },
      {
        q: 'According to studies, which solution is among the cheapest?',
        choices: [
          'Planting street trees.',
          'Painting roads with special coatings.',
          'Removing motorways to uncover rivers.',
          'Building taller apartment blocks.'
        ],
        answer: 0,
        explanation: '第4段落に「street trees are among the cheapest solutions」とあり、成木1本が複数のエアコン並みに空気を冷やすと説明されています。'
      },
      {
        q: 'Which statement best expresses the conclusion of the passage?',
        choices: [
          'The heat island effect can now be completely removed.',
          'Cities will always be unpleasant places in summer.',
          'Only rich cities can afford to fight the heat island effect.',
          'Good planning can reduce the problem that planning created.'
        ],
        answer: 3,
        explanation: '最終段落に「the same planning that created the problem can also soften it」とあります。完全には消せないが、組み合わせれば減らせる、という結論です。'
      }
    ]
  },
  {
    id: 'r23',
    title: 'Show & Tell Tomorrow',
    level: 2,
    topic: '手紙・メール',
    words: 192,
    passage:
      'Dear Class, I\'m writing to remind you that tomorrow morning we\'ll be having "Show & Tell." You\'ll need to bring a special object from home that you\'ll show to the class. You can bring a toy, game, book, or something else that has special meaning to you. For example, a student once brought an old movie ticket to "Show & Tell." She explained that it was special to her because she went to the movie with her favorite cousin, who she doesn\'t see very often. The class liked this very much. A boy last year brought a baseball that he caught at a game. The class liked that, too. I\'d also like to remind you that you cannot bring pets to "Show & Tell." I understand that your pets are special to you, but they are too distracting to have in class. If you want to tell the class about your pet, then bring something that reminds you of the pet. For instance, you could bring your dog\'s favorite toy or a can of your cat\'s food. I will see you tomorrow. Don\'t forget your object for "Show & Tell"! Mrs. Crandell',
    glossary: [
      { w: 'remind', m: '思い出させる' },
      { w: 'distracting', m: '気が散る' },
      { w: 'for instance', m: '例えば' }
    ],
    questions: [
      {
        q: 'What is the e-mail mostly about?',
        choices: [
          'Show & Tell" objects from last year',
          'Mrs. Crandell\'s "Show & Tell" object',
          'Bringing something for "Show & Tell"',
          'Pets coming to school for "Show & Tell"'
        ],
        answer: 2,
        explanation: 'メール全体が「明日の Show & Tell に特別な物を持ってくること」の連絡です。昨年の例やペットの話はその補足にすぎません。'
      },
      {
        q: 'Why does Mrs. Crandell say that students should not bring pets?',
        choices: [
          'They are distracting.',
          'They are noisy and dirty.',
          'Students like them too much.',
          'Not everyone has a pet to bring.'
        ],
        answer: 0,
        explanation: '本文に「they are too distracting to have in class（授業中は気が散りすぎる）」と理由がはっきり書かれています。'
      },
      {
        q: 'In the passage, the word they refers to',
        choices: [
          'you',
          'pets',
          'dogs',
          'classes'
        ],
        answer: 1,
        explanation: '直前の文の主語は your pets です。「ペットが特別なのは分かるが、気が散る」という流れなので they はペットを指します。'
      },
      {
        q: 'What does Mrs. Crandell suggest about someone bringing an old movie ticket?',
        choices: [
          'It was an accident.',
          'It was a good idea.',
          'It was a very long time ago.',
          'It wasn\'t interesting to the class.'
        ],
        answer: 1,
        explanation: '映画チケットを持ってきた生徒について「The class liked this very much」とあり、先生は良い例として紹介しています。'
      }
    ]
  },
  {
    id: 'r24',
    title: 'Monkeys on the Loose',
    level: 2,
    topic: '学校生活',
    words: 213,
    passage:
      'On Wednesday, February 28, two monkeys escaped from their cage at Flintstone Zoo. The eighth-graders here at Turnbull Middle School saw the event. They were at Flintstone Zoo that day on a field trip. The monkeys got away because one of their feeders forgot to lock the door when he left the monkey cage. About an hour after feeding, the monkeys discovered the unlocked door and escaped I was at the monkey cage when it happened," said Rachel Slater. "It was crazy! The monkeys looked like experts!" Rachel described what it looked like as they opened the door to their cage. "At first, I didn\'t think it was a big deal," she said. "I thought they were playing and that the zookeepers knew about it."' + '\n' +
      'It turned out it was a big deal. The zookeepers panicked when they saw that the monkeys were missing. They made everyone leave the zoo so that they could find the monkeys. It took them over two hours to catch them. By the time they were caught, the monkeys had stolen hot dogs from children and played with the zebras. "I was sad that we had to leave the zoo early," said Sarah Johnson, "but it was super exciting to see the monkeys running around like crazy kids!"',
    glossary: [
      { w: 'escape', m: '逃げ出す' },
      { w: 'field trip', m: '校外学習' },
      { w: 'panic', m: 'あわてる' }
    ],
    questions: [
      {
        q: 'What would be the most suitable headline for the article?',
        choices: [
          'It Was a Big Deal',
          'Zookeepers Are Worried',
          'Monkeys Act like Crazy Children',
          'Monkeys Escape at Flintstone Zoo'
        ],
        answer: 3,
        explanation: '記事全体の話題は「動物園でサルが逃げた事件」です。見出しは記事全体を表すものを選びます。'
      },
      {
        q: 'Why were the monkeys able to escape?',
        choices: [
          'Rachel Slater helped them get out.',
          'The monkeys are good with locks.',
          'The zookeepers forgot to lock the cage.',
          'One of the bars on the cage was broken.'
        ],
        answer: 2,
        explanation: '本文に「one of their feeders forgot to lock the door（飼育係が鍵をかけ忘れた）」とあります。'
      },
      {
        q: 'In the passage, the word experts is closest in meaning to',
        choices: [
          'animals',
          'workers',
          'humans',
          'professionals'
        ],
        answer: 3,
        explanation: '「The monkeys looked like experts!」は、まるで慣れた専門家（プロ）のように上手に脱走した、という意味です。'
      },
      {
        q: 'What does the author imply about the monkeys?',
        choices: [
          'They are evil.',
          'They smile a lot.',
          'They are playful.',
          'They hurt people.'
        ],
        answer: 2,
        explanation: 'ホットドッグを盗んだりシマウマと遊んだり「crazy kids のように走り回った」とあり、遊び好きな様子が読み取れます。'
      },
      {
        q: 'In the passage, the word They refers to',
        choices: [
          'everyone',
          'the children',
          'the monkeys',
          'the zookeepers'
        ],
        answer: 3,
        explanation: '「They made everyone leave the zoo so that they could find the monkeys」— サルを探すために客を帰らせたのは飼育員たちです。'
      },
      {
        q: 'Which of the following is NOT true?',
        choices: [
          'A monkey stole Sarah\'s hot dog.',
          'The monkeys looked like experts.',
          'The monkeys played with the zebras.',
          'Rachel Slater saw the monkeys escape.'
        ],
        answer: 0,
        explanation: '盗まれたのは「hot dogs from children」で、Sarah は見ていただけです。彼女のホットドッグが盗まれたとは書かれていません。'
      }
    ]
  },
  {
    id: 'r25',
    title: 'The Ideas of Sigmund Freud',
    level: 2,
    topic: '伝記',
    words: 233,
    passage:
      'Sigmund Freud was a well-known psychologist who was born in Austria in 1856. He is famous because he came up with psychoanalysis. Psychoanalysis is a certain way of helping a patient with a troubled mind. Freud believed that people have many thoughts and ideas deep inside, but they are taught to ignore them over time.' + '\n' +
      'Psychoanalysts help people by searching for their secret ideas. They will ask the patient many questions about their dreams, desires, and childhood. Then they will try to find out what all of this means.' + '\n' +
      'Freud believed that a person\'s personality was not caused by genetics, but was formed by things that happened to the person as a child. For example, if a grown woman is very shy, Freud would say that something happened when she was a child that made her that way. He believed that the way parents and siblings treated a child affected them as adults. According to Freud, each person\'s mind has three parts: the id, ego, and superego. The id the part of the mind that only wants pleasure and cannot think about bad consequences. The superego is a person\'s sense of doing what they are supposed to do. The ego is the part of the mind that balances the id and the superego. Freud believed that if these parts of the mind were explored, a person could be cured of their psychological sickness.',
    glossary: [
      { w: 'psychologist', m: '心理学者' },
      { w: 'patient', m: '患者' },
      { w: 'consequence', m: '結果' }
    ],
    questions: [
      {
        q: 'What would be the most suitable title for the passage?',
        choices: [
          'Id, Ego, and Superego',
          'Psychoanalysis in Austria',
          'The Famous Ideas of Freud',
          'Freud\'s Psychology of Shy People'
        ],
        answer: 2,
        explanation: 'フロイトの精神分析・性格論・心の三要素という「有名な考え」を紹介する文章なので、タイトルは C が最適です。'
      },
      {
        q: 'What can psychoanalysis do?',
        choices: [
          'Help a patient',
          'Scare doctors',
          'Make a decision',
          'Change psychology'
        ],
        answer: 0,
        explanation: '第1段落に「a certain way of helping a patient with a troubled mind（悩む患者を助ける方法）」とあります。'
      },
      {
        q: 'What did Freud believe about people\'s personalities?',
        choices: [
          'They aren\'t very useful.',
          'They are based on individuals\' genetics.',
          'They are sometimes different by country.',
          'They are the result of childhood experiences.'
        ],
        answer: 3,
        explanation: '第3段落に「性格は遺伝ではなく、子どものころに起きた出来事で形づくられる」と明記されています。'
      },
      {
        q: 'In the passage, the word grown is closest in meaning to',
        choices: [
          'large',
          'mature',
          'special',
          'attractive'
        ],
        answer: 1,
        explanation: 'grown woman は「大人になった女性」の意味なので、mature（成熟した）が最も近い語です。'
      },
      {
        q: 'All of the following are true about Freud EXCEPT',
        choices: [
          'he had a very powerful id',
          'he had ideas about personality',
          'he was born in 1856 in Austria',
          'he came up with the id, ego, and superego'
        ],
        answer: 0,
        explanation: '生まれた年、性格論、id・ego・superego は本文にありますが、フロイト自身の id が強かったという記述はありません。'
      },
      {
        q: 'In the passage, the word He refers to',
        choices: [
          'Freud',
          'a parent',
          'the doctor',
          'the woman'
        ],
        answer: 0,
        explanation: '「He believed that the way parents and siblings treated a child...」の He は、直前から話題の中心であるフロイトです。'
      },
      {
        q: 'What does the superego do for a person?',
        choices: [
          'Make their personality',
          'Balance their id and ego',
          'Try to find them pleasure',
          'Tell them what is right and wrong'
        ],
        answer: 3,
        explanation: 'superego は「a person\'s sense of doing what they are supposed to do（すべきことをする感覚）」、つまり善悪を教える部分です。'
      },
      {
        q: 'What was probably true about Freud?',
        choices: [
          'He wrote many books.',
          'He enjoyed doing surgery.',
          'He liked to spend time with doctors.',
          'He believed parents influence a child.'
        ],
        answer: 3,
        explanation: '「親やきょうだいの接し方が大人になってから影響する」と考えた、とあるので、D が本文から推測できます。'
      }
    ]
  },
  {
    id: 'r26',
    title: 'New Rules for Halloween Night',
    level: 2,
    topic: 'お知らせ',
    words: 149,
    passage:
      'Hello, everyone. Halloween is a very fun night, but in the last few years there have been a lot of problems in Sillsburg. This year, the town has decided to set some new rules. First of all, no children under the age of twelve are allowed to be out trick-or-treating without an adult. Also, after 11:30 P.M., no one should be on the streets. The police will be taking anyone found outside back to their houses or to the police station. We do not want any trouble this year and the police have promised to watch everything closely. We thank you for reading this notice. We want this year to be a great Halloween and we hope that everyone respects the new rules we have made. We are also sorry for any planning problems this might cause parents, but that\'s why we posted this notice so far in advance.',
    glossary: [
      { w: 'allow', m: '許可する' },
      { w: 'in advance', m: '前もって' },
      { w: 'respect', m: '（規則を）守る' }
    ],
    questions: [
      {
        q: 'What is the notice mainly about?',
        choices: [
          'Trick-or-treating',
          'New problems on Halloween',
          'New rules for Halloween night',
          'Police responsibilities on Halloween'
        ],
        answer: 2,
        explanation: '「the town has decided to set some new rules」とあり、以降は新しい規則の説明が続きます。'
      },
      {
        q: 'What is the youngest a child can be to trick-or-treat alone?',
        choices: [
          'Twelve',
          'Sixteen',
          'Fourteen',
          'Eighteen'
        ],
        answer: 0,
        explanation: '「no children under the age of twelve are allowed... without an adult」— 12歳未満は大人なしでは外出禁止なので、1人で回れる最年少は12歳です。'
      },
      {
        q: 'Why did the town post the notice in advance?',
        choices: [
          'They wanted to tell children where to trick-or-treat.',
          'They wanted to make sure everyone has a costume.',
          'They must explain the rules to the town\'s teenagers.',
          'They wanted to avoid planning problems for parents.'
        ],
        answer: 3,
        explanation: '最後に「that\'s why we posted this notice so far in advance（親の予定に支障が出ないよう早めに掲示した）」とあります。'
      }
    ]
  },
  {
    id: 'r27',
    title: 'Talent Show Try-Outs',
    level: 2,
    topic: '手紙・メール',
    words: 167,
    passage:
      'Dear Class, I\'m writing to you because the try-outs for the school talent show are tomorrow. I forgot to mention it in class today. If you want to sing, dance, act, play an instrument, or do anything else in the talent show, then you should go to the try-outs tomorrow after school. The try- outs will start at 3:00 P.M. at the school theater.' + '\n' +
      'The directors don\'t know how long it will take to see everyone, but they\'re sure everything will be finished before 7:00 P.M. Once you\'ve done your performance, you\'re free to go home. The directors will post the list of who will be in the talent show sometime next week. Lastly, don\'t worry about a ride home. There will be a late bus staying until the try-outs are finished. It will go to all the stops in town, so you will be able to get home. If you have any questions, write back. You can also ask me questions in class tomorrow. Mrs. Harrington',
    glossary: [
      { w: 'try-out', m: 'オーディション' },
      { w: 'instrument', m: '楽器' },
      { w: 'performance', m: '演技・演奏' }
    ],
    questions: [
      {
        q: 'What is the e-mail mainly about?',
        choices: [
          'The time of the try-outs',
          'Tomorrow\'s talent show try-outs',
          'The late bus home from the try-outs',
          'E-mailing questions to Mrs. Harrington'
        ],
        answer: 1,
        explanation: '冒頭に「the try-outs for the school talent show are tomorrow」とあり、メール全体が明日のオーディションの案内です。'
      },
      {
        q: 'What can students do when they\'ve finished their performance?',
        choices: [
          'Go home',
          'Go to sleep',
          'Try out again',
          'Do their homework'
        ],
        answer: 0,
        explanation: '「Once you\'ve done your performance, you\'re free to go home」と明記されています。'
      },
      {
        q: 'Why does Mrs. Harrington send the students this e-mail?',
        choices: [
          'She won\'t be in class the next day.',
          'She forgot to give them information in class.',
          'She didn\'t tell them about taking the late bus.',
          'She doesn\'t want them to try out for the show.'
        ],
        answer: 1,
        explanation: '「I forgot to mention it in class today（今日授業で言い忘れた）」がメールを送った理由です。'
      }
    ]
  },
  {
    id: 'r28',
    title: 'Understanding Heart Attacks',
    level: 2,
    topic: '理科',
    words: 186,
    passage:
      'The human heart is responsible for pumping blood through your body. It would be impossible to live without it. That\'s why heart attacks are so dangerous. Every time a healthy heart beats, it is sending blood throughout the body. The average human heart beats about seventy-two times per minute. Electricity causes the four parts of the heart to work together to create heartbeats.' + '\n' +
      'A heart attack happens when the blood supply cannot get in or out of the heart. Usually, this happens when fat and white blood cells get clogged in an artery. An artery is a pathway to the heart. When blood flow to the heart is stopped, heart cells begin to die. People feel chest pain and sweat when they\'re having a heart attack. Often they have trouble breathing or begin vomiting. Heart attacks are the leading cause of death all over the world, but there are certain things we can do to prevent them from happening to us. First of all, eating healthy and exercising can stop heart disease. Also, we should not smoke. Smoking increases the chance of having a heart attack.',
    glossary: [
      { w: 'pump', m: '送り出す' },
      { w: 'artery', m: '動脈' },
      { w: 'prevent', m: '防ぐ' }
    ],
    questions: [
      {
        q: 'What is the passage mainly about?',
        choices: [
          'The heart\'s arteries',
          'Human heart attacks',
          'Heart attack deaths',
          'The healthy human heart'
        ],
        answer: 1,
        explanation: '心臓の働きから始まり、心臓発作の仕組み・症状・予防と続くので、主題は「心臓発作」です。'
      },
      {
        q: 'Why does a heart attack occur?',
        choices: [
          'Heart cells begin to die.',
          'The heart stops pumping.',
          'A pathway to the heart gets blocked.',
          'The arteries don\'t have enough white blood cells.'
        ],
        answer: 2,
        explanation: '「fat and white blood cells get clogged in an artery（動脈＝心臓への通り道が詰まる）」ことが原因と説明されています。'
      },
      {
        q: 'According to the passage, how can people prevent heart attacks?',
        choices: [
          'They should take more vitamins.',
          'They should exercise twice a day.',
          'They should go to the doctor\'s more often.',
          'They should eat healthy and stop smoking.'
        ],
        answer: 3,
        explanation: '最終段落に「eating healthy and exercising can stop heart disease」「we should not smoke」とあります。'
      }
    ]
  },
  {
    id: 'r29',
    title: 'Photography in the Civil War',
    level: 2,
    topic: '歴史',
    words: 180,
    passage:
      'The Civil War happened just as the art of photography was growing. Many people believe that photography had a big effect on the war. People were able to see images of their president, Abraham Lincoln. They were also able to have photographs of their sons, fathers, brothers, and husbands who fought or died in the war.' + '\n' +
      'Not only that, but many photographs of battlefields were shown in galleries in New York and Washington D.C. These photographs made people understand just how terrible the war was. The pictures show piles of dead bodies in empty fields. Army generals also used photographers as part of their staff. They sent photographers to take pictures of enemy areas and bases. They took pictures of roads, railroads, and bridges so that they could have information about what everything looked like. They wanted to have information so that they could win the war. The war ended in 1865, but we still have the pictures. The photos from the battles of Antietam and Gettysburg are particularly sad. Even today, they make us remember the horrors of war.',
    glossary: [
      { w: 'battlefield', m: '戦場' },
      { w: 'general', m: '将軍' },
      { w: 'horror', m: '恐ろしさ' }
    ],
    questions: [
      {
        q: 'What would be the best title for the passage?',
        choices: [
          'Fighting Photographers',
          'Photographs in the Civil War',
          'Pictures of Abraham Lincoln',
          'Army Generals Taking Pictures'
        ],
        answer: 1,
        explanation: '南北戦争と写真の関わり全体を扱った文章なので、B が最も広くカバーするタイトルです。'
      },
      {
        q: 'What could people do for the first time because of photography?',
        choices: [
          'They could fight better in battle with better guns.',
          'They could have pictures of their family and president.',
          'They could get to know Abraham Lincoln and his children.',
          'They could see dead bodies in fields outside of their homes.'
        ],
        answer: 1,
        explanation: '第1段落に、大統領の写真を見たり、戦地の家族の写真を持てたりするようになった、とあります。'
      },
      {
        q: 'Why were photographers hired by army generals?',
        choices: [
          'To work as spies',
          'To take pictures to get information',
          'To help design and build new bridges',
          'To print pictures of the war in newspapers'
        ],
        answer: 1,
        explanation: '「They sent photographers to take pictures of enemy areas and bases... so that they could have information」— 情報収集のためです。'
      }
    ]
  },
  {
    id: 'r30',
    title: 'Spooky Day at Sully School',
    level: 2,
    topic: 'お知らせ',
    words: 94,
    passage:
      'SPOOKY DAY AT SULLY SCHOOL' + '\n' +
      'Hello, Sully School students. On Wednesday, October 20, we\'ll be having a school-wide Spooky Day to celebrate Halloween. Get excited. Everyone should wear their Halloween costumes. Below is the schedule for Spooky Day.' + '\n' +
      '1:00 - 2:00 P.M. — Scary Snacks, with Mrs. Lamps, in the School Cafeteria.' + '\n' +
      '2:00 - 3:00 P.M. — Pumpkin Carving, with Mr. Dodge and Ms. Grange, in Room 307.' + '\n' +
      '3:00 - 3:30 P.M. — Costume Contest, with Mrs. Godding, in the School Theater.' + '\n' +
      'All day — Bobbing for Apples, The Haunted House, and Face Painting.',
    glossary: [
      { w: 'carve', m: '彫る' },
      { w: 'costume', m: '仮装衣装' },
      { w: 'contest', m: 'コンテスト' }
    ],
    questions: [
      {
        q: 'What is the announcement mainly about?',
        choices: [
          'Thanksgiving at Sully School',
          'Sully School\'s Spooky Day',
          'Wearing Halloween costumes to school',
          'A scary thing that happened at Sully School'
        ],
        answer: 1,
        explanation: 'お知らせ全体が10月20日の Spooky Day の案内と予定表です。仮装の話はその一部にすぎません。'
      },
      {
        q: 'Which of the following is NOT true?',
        choices: [
          'Students should wear costumes.',
          'Spooky Day happens every year.',
          'Bobbing for Apples happens all day.',
          'Mrs. Godding is leading the Costume Contest.'
        ],
        answer: 1,
        explanation: '毎年行われるという記述は本文にありません。仮装・終日のリンゴすくい・Godding 先生の担当はすべて予定表にあります。'
      },
      {
        q: 'Which of the following is NOT mentioned?',
        choices: [
          'Wearing special clothes',
          'The date of Spooky Day',
          'The location of the Haunted House',
          'Activities taking place in different places'
        ],
        answer: 2,
        explanation: '予定表で場所が書かれていないのは終日イベント（Haunted House など）だけです。ここが「書かれていないこと」です。'
      }
    ]
  },
  {
    id: 'r31',
    title: 'Climbing Mount Whitmore',
    level: 2,
    topic: '日常生活',
    words: 363,
    passage:
      'The mountain was high and it was cold. Snow and ice covered everything and it was dangerous. I huddled in my tent as the storm tried to knock me back to the bottom. You will never make it to the top," everyone said. "No woman has ever climbed this mountain and only a few people have done it by themselves." I was very confident that I would be the first woman to climb up to the top of Whitmore. I had prepared for months and spoken with everyone I could find that had done it before. I had bought all of the best equipment and trained for months before the climb. When I woke up the next morning, the wind had gotten quieter. I climbed out of my tent and looked out at the mountain. Everything was white and still. It was cold but my gloves and coat were very warm.' + '\n' +
      'I will make it to the top today," I thought to myself.' + '\n' +
      'I started up the slope. My feet crunched the snow with every step I took. It was a beautiful day. The sun looked huge and I felt like I was on top of the world. I was climbing quickly. Soon I was going to reach the top. All of a sudden, I slipped. I started to slide down the mountain. I was going slowly at first but eventually I started to slide very fast. I went past my camp from the night before and I started to spin. After what felt like forever, I came to a stop. I slowly started to move, thinking that I must be hurt, but I was fine. It was a miracle. I got up and looked at the mountain. I had slid all the way to the bottom. I couldn\'t believe it. I was alive so I was very happy. I started back up the mountain.' + '\n' +
      'Three days later, I made it to the top. It was a beautiful day and I had a perfect view of everything around me. I thanked God for getting me to the top safely and then I went back down. It was the last mountain I ever climbed.',
    glossary: [
      { w: 'equipment', m: '装備' },
      { w: 'slip', m: '滑る' },
      { w: 'miracle', m: '奇跡' }
    ],
    questions: [
      {
        q: 'What would be the best title for the story?',
        choices: [
          'God Helping Me Climb',
          'High and Cold Mountains',
          'Trying to Climb a Mountain',
          'Woman Mountain Climbers'
        ],
        answer: 2,
        explanation: '女性がひとりで山頂を目指す挑戦の物語なので、C「山に登ろうとすること」が全体を表します。'
      },
      {
        q: 'The author mentions all of the following EXCEPT',
        choices: [
          'saying a prayer for her mother',
          'buying all the best equipment',
          'making herself ready for climbing',
          'sliding down the mountain to the bottom'
        ],
        answer: 0,
        explanation: '最後に「thanked God（神に感謝した）」とはありますが、母のために祈ったという記述はありません。装備の購入・準備・滑落はすべてあります。'
      },
      {
        q: 'Which of the following is NOT mentioned?',
        choices: [
          'Making it to the mountain top',
          'Being too tired to climb up again',
          'Feet crunching the snow while climbing',
          'Having gloves and coat for staying warm'
        ],
        answer: 1,
        explanation: '滑落後すぐ「I started back up the mountain（また登り始めた）」ので、疲れて登れなかったという記述はありません。'
      }
    ]
  },
  {
    id: 'r32',
    title: 'Why You Should Exercise',
    level: 2,
    topic: '科学・生活',
    words: 213,
    passage:
      'Everyone knows that exercising is good for you, but why? And how often and for how long should you exercise? Physical exercise is any activity that makes your body work. Taking a long walk, going on a bike ride, or taking an aerobics class can make your body work. Exercising makes muscles stronger, makes people better at many sports, and is good for the heart. Regular exercise prevents diseases such as obesity and diabetes. It\'s also good for your bones.' + '\n' +
      'Doctors say that the average person should exercise for thirty minutes every day, and this daily exercise should be cardiovascular. That means that while exercising, your heart rate should go up. Lifting weights, for example, is not considered cardiovascular. Although lifting weights is very good for your muscle strength, it does not keep your heart rate up for long enough.' + '\n' +
      'If your life is busy, you can do simple things like taking the stairs rather than the elevator. Walk to the places you need to go as often as you can. Exercise can be tiring and is not always the most fun thing to be doing. However, it\'s certainly the best way to keep your body healthy. You only have one body, so take good care of it by giving it proper exercise.',
    glossary: [
      { w: 'muscle', m: '筋肉' },
      { w: 'obesity', m: '肥満' },
      { w: 'heart rate', m: '心拍数' }
    ],
    questions: [
      {
        q: 'What is the passage mainly about?',
        choices: [
          'Exercising to prevent disease',
          'How and why people should exercise',
          'The act of making your body do work',
          'Doing cardiovascular exercise every day'
        ],
        answer: 1,
        explanation: '冒頭の「なぜ運動は体に良いのか？どのくらいすべきか？」という問いに答えていく文章なので B です。'
      },
      {
        q: 'All of the following are true EXCEPT',
        choices: [
          'cardiovascular exercise is important',
          'lifting weights makes strong muscles',
          'exercise prevents obesity and diabetes',
          'your heart rate should go down during exercise'
        ],
        answer: 3,
        explanation: 'cardiovascular とは「心拍数が上がる」運動のことです。下がるべきだという記述は本文と逆です。'
      },
      {
        q: 'Which of the following is NOT true?',
        choices: [
          'Lifting weights is cardiovascular.',
          'Exercising is making your body work.',
          'You should walk as often as you can.',
          'People should exercise for thirty minutes a day.'
        ],
        answer: 0,
        explanation: '「Lifting weights... is not considered cardiovascular」と明記されています。A が本文と食い違います。'
      }
    ]
  },
  {
    id: 'r33',
    title: 'Draco and His Harsh Laws',
    level: 2,
    topic: '歴史',
    words: 202,
    passage:
      'Ancient Greece was a very advanced society, but someone had to make the laws. The first lawmaker in Ancient Greece was named Draco. He changed the old system, which was based on what people said and who was in their families, to a written law. Not much is known about Draco\'s life since he lived during the seventh century BC. He is mainly remembered for his laws.' + '\n' +
      'What made Draco so famous is that his laws were harsh. The word "draconian" comes from Draco. It means overly harsh or strict. Draco wrote the laws and posted them on wooden tablets in the center of town so that everyone could see. Draco made very strict rules, which made regular people into slaves. For example, if someone owed someone money, and they didn\'t come from a good family, they would have to become slaves to whoever they owed money to.' + '\n' +
      'Draco believed that all crimes should have harsh punishments. Whether it was a murder, small theft, or not clearing debts, Draco believed that people needed severe punishments. He thought that it would make them understand that committing crimes was not acceptable. Later, all of Draco\'s laws were taken away by Solon, another Athenian lawmaker.',
    glossary: [
      { w: 'harsh', m: '厳しい' },
      { w: 'debt', m: '借金' },
      { w: 'punishment', m: '罰' }
    ],
    questions: [
      {
        q: 'What would be a good title for the passage?',
        choices: [
          'Draco with His Slaves',
          'Laws in Ancient Athens',
          'Draco and His Harsh Laws',
          'Draco\'s Life in the Seventh Century BC'
        ],
        answer: 2,
        explanation: 'ドラコンという人物と、その厳しい法律（draconian の語源）が主題なので C が最適です。'
      },
      {
        q: 'Which of the following is NOT mentioned in the passage?',
        choices: [
          'The time when Draco lived',
          'Draco\'s family and children',
          'Regular people being made into slaves',
          'Solon\'s decision to take away Draco\'s laws'
        ],
        answer: 1,
        explanation: '紀元前7世紀に生きたこと、庶民が奴隷にされたこと、ソロンが法を廃止したことは本文にありますが、家族や子どもの話はありません。'
      },
      {
        q: 'All of the following are true EXCEPT',
        choices: [
          'laws were written on wooden tablets',
          'many people supported Draco in Greece',
          'murder and theft were similar crimes to Draco',
          'the word "draconian" comes from Draco\'s name'
        ],
        answer: 1,
        explanation: '木の板に法を書いたこと、罪の軽重を問わず厳罰にしたこと、draconian の語源は本文にありますが、多くの人が支持したという記述はありません。'
      }
    ]
  },
  {
    id: 'r34',
    title: 'Where Have You Been, Polly?',
    level: 2,
    topic: '手紙・メール',
    words: 161,
    passage:
      'Dear Polly, I\'m writing because I\'m wondering why you\'ve missed the last two days of school. You\'re never absent, so it was very surprising to me when you weren\'t in class. I called your house, but no one answered. I wanted to write you to check in to make sure everything is okay. Are you sick? Did your family go on vacation? If they did, that would explain why no one answered the phone.' + '\n' +
      'Mrs. Egan assigned us a new project. It\'s a project on animals. Everyone has a partner and we have to choose a unique animal and do a presentation on it for the class. I told Mrs. Egan I\'d work with you even though you weren\'t there. I hope that\'s okay with you. You should start thinking about what animal you want to study. I really hope everything is okay with you. E-mail me or call me when you get this. I hope I see you tomorrow.' + '\n' +
      'Gloria',
    glossary: [
      { w: 'absent', m: '欠席の' },
      { w: 'assign', m: '（宿題を）課す' },
      { w: 'unique', m: '珍しい' }
    ],
    questions: [
      {
        q: 'What is the e-mail mainly about?',
        choices: [
          'Polly\'s family vacation',
          'What happened in school today',
          'Mrs. Egan\'s love for projects on animals',
          'Gloria wondering why Polly missed school'
        ],
        answer: 3,
        explanation: '冒頭に「I\'m wondering why you\'ve missed the last two days of school」とあり、欠席を心配するメールです。'
      },
      {
        q: 'In the passage, the word absent is closest in meaning to',
        choices: [
          'sad',
          'at home',
          'not there',
          'embarrassed'
        ],
        answer: 2,
        explanation: 'absent は「欠席して＝そこにいない」という意味なので not there が最も近い表現です。'
      },
      {
        q: 'In the passage, the word assigned is closest in meaning to',
        choices: [
          'left',
          'gave',
          'took',
          'checked'
        ],
        answer: 1,
        explanation: 'assign は宿題や課題を「出す・与える」という意味なので gave が最も近い語です。'
      }
    ]
  },
  {
    id: 'r35',
    title: 'Spelling Bee Report',
    level: 2,
    topic: '学校生活',
    words: 166,
    passage:
      'Last Saturday, March 25, two students at Manchester Middle School attended the state spelling bee. These students were seventh-grader Michael Angel and eighth-grader Susan Granson. After winning the Manchester Middle School competition, they both participated in the state spelling bee, which was held in Tallahassee. Principal Dailey was able to go. Although the students did not win, they did an excellent job. Michael was 14th and Susan was 18th, which is very good considering that there were fifty students in the spelling bee. It was amazing how good the winners were at spelling," said Michael, "Maybe if I study, I can be that good next year." Michael has another chance since he is only a seventh-grader. The state spelling bee was won by Tracy Lockwood, who goes to Helman Middle School in West Palm Beach. She will now go to the national spelling bee in Columbus, Ohio. If she wins that, then she\'ll get to meet the president and go on a two-week trip to Hawaii.',
    glossary: [
      { w: 'spelling bee', m: 'スペリング大会' },
      { w: 'participate', m: '参加する' },
      { w: 'considering', m: '〜を考えると' }
    ],
    questions: [
      {
        q: 'What would be the best headline for the article?',
        choices: [
          'Michael and Susan, Our Students',
          'Manchester Students Lose Spelling Bee',
          'Tracy Lockwood from West Palm Beach',
          'Manchester Students Go to State Spelling Bee'
        ],
        answer: 3,
        explanation: '学校新聞の記事で、主役は州大会に出場した Manchester の2人の生徒です。優勝者の話は補足です。'
      },
      {
        q: 'In the passage, the word attended is closest in meaning to',
        choices: [
          'won',
          'liked',
          'forgave',
          'went to'
        ],
        answer: 3,
        explanation: 'attended は大会に「出席した＝行った」という意味なので went to が最も近い表現です。'
      },
      {
        q: 'In the passage, the word national is closest in meaning to',
        choices: [
          'large',
          'official',
          'in the state',
          'countrywide'
        ],
        answer: 3,
        explanation: 'national は「全国の」という意味なので countrywide（国じゅうの）が最も近い語です。'
      }
    ]
  },
  {
    id: 'r36',
    title: 'Amelia Earhart',
    level: 2,
    topic: '伝記',
    words: 149,
    passage:
      'Amelia Earhart is probably the best-known female pilot in the world. During her life, she did amazing things. Earhart was one of the first woman pilots in history. She set many flight records. One of the most famous was her solo flight across the Atlantic Ocean. She was the first woman to fly across the ocean alone.' + '\n' +
      'Amelia Earhart was more than just a great pilot. She was a best-selling author too. She wrote many books about her flying experiences. Earhart also enjoyed helping other women succeed. She helped start the all-women pilot group called the Ninety-Nines, and she fought for women\'s rights.' + '\n' +
      'Sadly, Earhart\'s disappearance is a big reason why she is remembered today. When she tried to fly around the world, she went missing with her flight partner, Fred Noonan. On July 2, 1937, Amelia Earhart vanished somewhere over the Pacific Ocean, never to be seen again.',
    glossary: [
      { w: 'solo', m: '単独の' },
      { w: 'author', m: '作家' },
      { w: 'vanish', m: '消える' }
    ],
    questions: [
      {
        q: 'What is the passage mainly about?',
        choices: [
          'Earhart\'s piloting skills',
          'Earhart\'s disappearance',
          'Earhart\'s accomplishments',
          'Earhart\'s flight across the Atlantic'
        ],
        answer: 2,
        explanation: '飛行記録・ベストセラー作家・女性支援・失踪と、アーハートの功績全体を紹介する文章なので C です。'
      },
      {
        q: 'In the passage, the word solo is closest in meaning to',
        choices: [
          'one',
          'group',
          'alone',
          'paired'
        ],
        answer: 2,
        explanation: 'solo flight は「単独飛行」。直後に「the first woman to fly across the ocean alone」と言い換えられています。'
      },
      {
        q: 'In the passage, the word vanished is closest in meaning to',
        choices: [
          'landed',
          'got found',
          'showed up',
          'went missing'
        ],
        answer: 3,
        explanation: 'vanished は「消えた」。直後の「never to be seen again」からも went missing（行方不明になった）が正解と分かります。'
      }
    ]
  },
  {
    id: 'r37',
    title: 'The Art of the Fresco',
    level: 2,
    topic: '文化',
    words: 189,
    passage:
      'A fresco is a painting that is done on wet plaster. The word "fresco" comes from an Italian word that means fresh. This is because frescoes are painted when the plaster is still wet. Once it dries, the artist can no longer add to the fresco. Usually, the plaster takes about ten hours to dry, giving an artist only 7-9 hours of painting time. - Frescoes are not usually created today, but rather they are an art form of the past. The artist Michelangelo is famous for his frescoes. The ceiling of the Sistine Chapel in the Vatican in Rome is a fresco painted by Michelangelo. It is magnificent and impressive: Artists became good at painting plaster walls to show exactly what they wanted. Sometimes they would dig into the plaster to create depth. This would make their fresco look better and even more realistic.' + '\n' +
      'The most famous frescoes were created around the time Michelangelo lived, during the Renaissance. The Renaissance focused on beautiful art in a way that it hadn\'t been focused on before. Since Italy was the center of this movement, many frescoes were painted in Italy.',
    glossary: [
      { w: 'plaster', m: '漆喰（しっくい）' },
      { w: 'ceiling', m: '天井' },
      { w: 'realistic', m: '本物のような' }
    ],
    questions: [
      {
        q: 'What is the passage mostly about?',
        choices: [
          'Fresco and plaster',
          'The art of the fresco',
          'Michelangelo\'s frescoes',
          'The Italian Renaissance'
        ],
        answer: 1,
        explanation: 'フレスコ画とは何か、描き方、有名な作品、栄えた時代と、フレスコ画そのものを説明する文章なので B です。'
      },
      {
        q: 'In the passage, the word form is closest in meaning to',
        choices: [
          'artist',
          'type',
          'brush',
          'page'
        ],
        answer: 1,
        explanation: '「they are an art form of the past」の form は芸術の「形式・種類」という意味なので type が最も近い語です。'
      },
      {
        q: 'In the passage, the word movement is closest in meaning to',
        choices: [
          'art',
          'history',
          'city',
          'change'
        ],
        answer: 3,
        explanation: 'ルネサンスという美術の movement は「（文化の）運動＝流れの変化」を指すので change が最も近い語です。'
      }
    ]
  },
  {
    id: 'r38',
    title: 'International Potluck Party',
    level: 2,
    topic: 'お知らせ',
    words: 143,
    passage:
      'Next week on Thursday, we\'ll be having our annual International Potluck Party. The International Potluck Party happens every April to celebrate cultural differences in this school. Here at Biloxi High, there are students from Asia, Africa, Europe, South America, the Caribbean, and many other places around the world. The international students at Biloxi High come from sixteen different countries. We are lucky to have them at our school. The school is going to provide many different foods. They will be eaten by everyone. Many of our international students have planned to cook special things for the party. You can also bring an international dish, or you can bring an American dish that you like. It\'s a good idea to get together and work with friends to make your dish. There will be many people at the Potluck Party. Everyone will need to eat!',
    glossary: [
      { w: 'annual', m: '毎年恒例の' },
      { w: 'potluck', m: '料理持ち寄りの会' },
      { w: 'provide', m: '提供する' }
    ],
    questions: [
      {
        q: 'What would be the best title for the announcement?',
        choices: [
          'Bringing Food to Parties',
          'Tuesday\'s Potluck Party',
          'International Students at Our School',
          'This Year\'s International Potluck Party'
        ],
        answer: 3,
        explanation: '来週木曜の International Potluck Party の案内が全体の内容です。曜日は火曜ではなく木曜なので B は誤りです。'
      },
      {
        q: 'In the passage, the word them refers to',
        choices: [
          'potluck parties',
          'different countries',
          'Biloxi students',
          'international students'
        ],
        answer: 3,
        explanation: '直前の文の「The international students at Biloxi High come from sixteen different countries」を受けて、「彼らがいて幸運だ」と言っています。'
      },
      {
        q: 'In the passage, the word They refers to',
        choices: [
          'foods',
          'the schools',
          'everyone',
          'international students'
        ],
        answer: 0,
        explanation: '直前に「The school is going to provide many different foods」とあり、「They will be eaten by everyone」の They はその食べ物を指します。'
      }
    ]
  },
  {
    id: 'r39',
    title: 'The Lemonade Stand Robbery',
    level: 2,
    topic: '日常生活',
    words: 304,
    passage:
      'It was a hot, sunny summer day, a perfect day for my brother and me to sell lemonade. We should set up on the corner because more people will see us there," my older brother said.' + '\n' +
      'Good idea, but Mom and Dad won\'t like us being so far away from the house," I said. "It will be fine," my brother laughed. "They won\'t even know that we\'re gone." We went down the street and started selling our lemonade on the corner. The day was going great, and we were making a lot of money. We got excited thinking about what we were going to buy with the money we were making. Then something happened, just as we were about to go home for the day. Give me all your money, little girl!" said a scary voice. I looked up and saw two men standing over me with knives in their hands. I was very scared so I just handed them the money. My brother saw them and started to yell, but they just turned and ran away.' + '\n' +
      'My brother and I were both very upset. We ran home and told our parents, and they called the police. We waited for them to come and, when they did, they asked us a lot of questions. It all happened so fast that neither of us knew what the robbers looked like. I am sorry, kids. I don\'t think we have much chance of finding your money. The men are probably a long way away by now. Next time, I want you to be more careful. I think it would be better for you to keep your lemonade stand in front of the house, okay?" said one of the policemen.' + '\n' +
      'When the police left, they promised that, if they found anyone, they would call us right away.',
    glossary: [
      { w: 'robber', m: '強盗' },
      { w: 'upset', m: '動揺して' },
      { w: 'promise', m: '約束する' }
    ],
    questions: [
      {
        q: 'What would be the best title for the story?',
        choices: [
          'A Sunny Summer Day',
          'Scary Robbers with Knives',
          'Lemonade Stand Robbery',
          'The Police Who Couldn\'t Help'
        ],
        answer: 2,
        explanation: 'レモネード販売中に強盗にお金を取られる出来事が物語の中心なので C が最適です。'
      },
      {
        q: 'In the passage, the word We in "We ran home and told our parents" refers to',
        choices: [
          'the sisters',
          'the parents',
          'the policemen',
          'the brother and sister'
        ],
        answer: 3,
        explanation: '家に走って帰り両親に伝えたのは、語り手（妹）とその兄です。冒頭に「my brother and me」とあります。'
      },
      {
        q: 'In the passage, the word they refers to',
        choices: [
          'the police',
          'the robbers',
          'the parents',
          'the brother and sister'
        ],
        answer: 0,
        explanation: '「they promised that, if they found anyone, they would call us」— 犯人を見つけたら連絡すると約束したのは警察です。'
      }
    ]
  },
  {
    id: 'r40',
    title: 'How Volcanoes Form',
    level: 2,
    topic: '理科',
    words: 177,
    passage:
      'A volcano is an opening in the Earth\'s crust that allows for substances below the earth to come up and escape. The Earth\'s crust sits on tectonic plates. These plates are like puzzle pieces. In the places where they are coming apart or moving toward each other, volcanoes are likely to form. In the Mid-Atlantic Ridge, where the plates are moving away from each other, new crust needs to be formed to fill the gap. The creation of this crust creates pressure reduction and melts the mantle, resulting in volcanoes. Most people don\'t know that most of this volcanic activity actually takes place in our oceans. The rest of it has resulted in the ridge rising above sea level on islands such as Iceland. Some volcanoes are created where the plates come together. This is true in the Pacific Ring of Fire. The Pacific Ring of Fire is a horseshoe shape that borders the shore of the Pacific Ocean. Along this ring, in countries such as Mexico, the Philippines, Japan, and New Zealand, many volcanoes have formed.',
    glossary: [
      { w: 'crust', m: '地殻' },
      { w: 'plate', m: 'プレート' },
      { w: 'mantle', m: 'マントル' }
    ],
    questions: [
      {
        q: 'What is the passage mostly about?',
        choices: [
          'Volcanoes in Iceland',
          'Mid-Atlantic volcanoes',
          'Where volcanoes come from',
          'Active, dormant, and extinct volcanoes'
        ],
        answer: 2,
        explanation: 'プレートが離れる場所・ぶつかる場所で火山ができる、という「火山のでき方」を説明する文章です。'
      },
      {
        q: 'In the passage, the word they in "In the places where they are coming apart" refers to',
        choices: [
          'plates',
          'volcanoes',
          'substances',
          'puzzle pieces'
        ],
        answer: 0,
        explanation: '直前の文の主語 These plates（プレート）を受けています。「プレートが離れたり近づいたりする場所で火山ができる」という文脈です。'
      },
      {
        q: 'In the passage, the word it in "The rest of it has resulted in the ridge rising" refers to',
        choices: [
          'mantle melting',
          'creation of crust',
          'volcanic activity',
          'pressure reduction'
        ],
        answer: 2,
        explanation: '前の文の「most of this volcanic activity... takes place in our oceans」を受けて、「その残り（陸に出た火山活動）がアイスランドなどの島になった」という意味です。'
      }
    ]
  },
  {
    id: 'r41',
    title: 'Catching the Wind',
    level: 2,
    topic: '環境',
    words: 210,
    passage:
      'Since pollution and CO2 emissions have become a problem in our world, scientists have turned to new forms of catching energy. They have used water power from rivers and tides, light and heat from the sun, as well as wind power from the wind. The wind is blowing around us all the time. There\'s a lot of energy there, and scientists have figured out how to use it.' + '\n' +
      'Wind turbines take wind energy and make it into electricity that humans can use. A wind turbine usually has three or four arms that are designed to catch the wind. When they do, these four arms turn in a circle. The turbine is connected to a generator, which works to change the wind energy into electricity. Wind turbines have been built all over the world. A wind farm is a place where many wind turbines are built. The biggest wind farm in the world is in Roscoe, Texas. It has 627 wind turbines. Wind farms are often built off the coast because areas over the ocean have strong winds. The Thanet Wind Farm in the United Kingdom is the biggest offshore wind farm. Many believe that wind turbines and wind farms will be important for the future, as we need cleaner energy.',
    glossary: [
      { w: 'turbine', m: 'タービン' },
      { w: 'generator', m: '発電機' },
      { w: 'offshore', m: '沖合の' }
    ],
    questions: [
      {
        q: 'What would be the best title for the passage?',
        choices: [
          'Using Wind Energy',
          'The Biggest Wind Farms',
          'Building a Wind Turbine',
          'Wind Farms in the World'
        ],
        answer: 0,
        explanation: '風力エネルギーを電気に変える仕組みと風力発電所の紹介が中心なので、A「風のエネルギーを使う」が全体を表します。'
      },
      {
        q: 'In the passage, the word They refers to',
        choices: [
          'energies',
          'scientists',
          'problems',
          'CO2 emissions'
        ],
        answer: 1,
        explanation: '「They have used water power...」の They は、前の文の scientists（新しいエネルギーに目を向けた科学者たち）です。'
      },
      {
        q: 'In the passage, the word It refers to',
        choices: [
          'the world',
          'the wind farm',
          'a wind turbine',
          'Roscoe, Texas'
        ],
        answer: 1,
        explanation: '「It has 627 wind turbines」の It は、直前の「The biggest wind farm in the world is in Roscoe, Texas」の風力発電所を指します。'
      }
    ]
  },
  {
    id: 'r42',
    title: 'Billy and the Frog',
    level: 2,
    topic: '学校生活',
    words: 236,
    passage:
      'Class had just started. My friend Billy was sitting right in front of me. We had been best friends since we were four years old. Billy was very funny and everyone liked him. Our classmates were amused when he joked around.' + '\n' +
      'It was a very nice day outside and we had been playing together behind the school during lunch time. There was a small pond and a soccer field. Billy loved to play in the pond. His mom always got mad at him when he came home covered in mud, but he would not stop playing in the pond.' + '\n' +
      'Math class was extra boring. The sun felt so good coming through the window. I didn\'t want to be inside on a day like that. Billy and I wanted to skip school but we both knew we would get into a lot of trouble for that. All of a sudden, I heard a strange sound. Ribbbbit.....Riibbbbiiit."' + '\n' +
      'It was coming from in front of me. Then a girl screamed. It was a frog hopping up onto the teacher\'s desk. The whole class started to laugh and the teacher started to yell. I looked at Billy and he was smiling. He had snuck the frog into class and let it go. The teacher got the frog and put it back outside, but we were all still laughing. It was nice outside but being inside wasn\'t so bad after all.',
    glossary: [
      { w: 'amused', m: 'おもしろがって' },
      { w: 'sneak', m: 'こっそり持ち込む' },
      { w: 'yell', m: 'どなる' }
    ],
    questions: [
      {
        q: 'What would be the best title for the story?',
        choices: [
          'Billy and the Frog',
          'A Long Day at School',
          'The Days That Come and Go',
          'The Laugh That Ended Class'
        ],
        answer: 0,
        explanation: '物語の山場は Billy が教室にカエルを持ち込んだ事件なので、A が最適なタイトルです。'
      },
      {
        q: 'In the passage, the word amused is closest in meaning to',
        choices: [
          'angry',
          'pleased',
          'doubtful',
          'interested'
        ],
        answer: 1,
        explanation: 'amused は「おもしろがって楽しんだ」という意味なので pleased（喜んだ）が最も近い語です。'
      },
      {
        q: 'In the passage, the word skip is closest in meaning to',
        choices: [
          'need',
          'jump',
          'miss',
          'enjoy'
        ],
        answer: 2,
        explanation: 'skip school は「学校をサボる＝授業を欠席する」という意味なので miss が最も近い語です。'
      },
      {
        q: 'What happens to Billy when he plays in the pond?',
        choices: [
          'He gets dirty.',
          'He skips school.',
          'His mom laughs.',
          'He finds lots of frogs.'
        ],
        answer: 0,
        explanation: '「his mom always got mad at him when he came home covered in mud（泥だらけで帰る）」とあります。'
      },
      {
        q: 'In the passage, the word It refers to',
        choices: [
          'Billy',
          'a girl',
          'the pond',
          'the sound'
        ],
        answer: 3,
        explanation: '「It was coming from in front of me」の It は、直前の文の a strange sound（Ribbit という音）を指します。'
      },
      {
        q: 'Which of the following is NOT true in the story?',
        choices: [
          'It was a beautiful day.',
          'Billy got into a lot of trouble.',
          'There was a noisy frog in class.',
          'At least one girl was scared in class.'
        ],
        answer: 1,
        explanation: '美しい日だったこと、カエルが鳴いたこと、女の子が悲鳴を上げたことは本文にありますが、Billy が罰を受けたという記述はありません。'
      }
    ]
  },
  {
    id: 'r43',
    title: 'Freak Waves',
    level: 2,
    topic: '科学',
    words: 248,
    passage:
      'Freak waves are giant walls of water that happen in deep, stormy oceans. Sometimes they can reach up to 100 feet high, which is as high as a ten-story building. The waves are very dangerous and have been known to sink very large ships.' + '\n' +
      'For years, scientists thought that freak waves were only in stories. Sailors would tell stories of these huge, 100-foot killer waves, but many people did not believe them. That all changed one day when an oil rig was hit by a wave of an impossible size. It happened in the ocean near Norway. The Draupner oil rig was hit by a wave that was nearly 100 feet tall. The oil rig was measuring the height of all the waves when suddenly a huge wave rose up from the ocean and smashed it. That was one of the first pieces of evidence that the sailors might have been right. Freak waves only happen in very deep water so people have not had many chances to see them.' + '\n' +
      'Normal waves are predicted using a mathematical equation called the linear effect. This math equation says that a wave that big is possible once every ten thousand years. But these waves happen a lot more than that. In the waters off of South Africa, these waves happen a lot. Since 1990, twenty ships have been hit by waves that seemed too big to be real. These massive waves do exist and have proved a lot of scientists wrong.',
    glossary: [
      { w: 'freak', m: '異常な' },
      { w: 'oil rig', m: '石油掘削装置' },
      { w: 'evidence', m: '証拠' }
    ],
    questions: [
      {
        q: 'What is the main idea of the passage?',
        choices: [
          'Freak waves',
          'Ocean Tsunamis',
          'Giant oil rigs and ships',
          'The history of waves in the ocean'
        ],
        answer: 0,
        explanation: '巨大波（freak wave）とは何か、実在の証拠、発生頻度と、freak wave そのものが文章全体の主題です。'
      },
      {
        q: 'In the passage, the word freak is closest in meaning to',
        choices: [
          'usual',
          'angry',
          'lucky',
          'unusual'
        ],
        answer: 3,
        explanation: 'freak wave は10,000年に1度しか起きないはずの「異常な」波のことなので unusual が最も近い語です。'
      },
      {
        q: 'In the passage, the word suddenly is closest in meaning to',
        choices: [
          'slowly',
          'quickly',
          'variously',
          'differently'
        ],
        answer: 1,
        explanation: 'suddenly は「突然に」という意味なので、選択肢の中では quickly（急に）が最も近い語です。'
      },
      {
        q: 'What country was the Draupner oil rig in?',
        choices: [
          'It was in Korea.',
          'It was in England.',
          'It was in Norway.',
          'It was in America.'
        ],
        answer: 2,
        explanation: '「It happened in the ocean near Norway. The Draupner oil rig was hit...」とノルウェー沖と明記されています。'
      },
      {
        q: 'In the passage, the word it refers to',
        choices: [
          'a sailor',
          'the oil rig',
          'an evidence',
          'a huge wave'
        ],
        answer: 1,
        explanation: '「a huge wave rose up from the ocean and smashed it」— 波が壊した対象は、波の高さを測っていた oil rig です。'
      },
      {
        q: 'Which of the following does NOT happen because of a freak wave?',
        choices: [
          'Ships are hit and then sink.',
          'Scientists are proved wrong.',
          'Houses along the coast are destroyed.',
          'Oil rigs and other floating machines are destroyed.'
        ],
        answer: 2,
        explanation: '船の沈没・科学者の誤りの証明・石油掘削装置の破壊は本文にありますが、沿岸の家の被害は書かれていません。'
      }
    ]
  },
  {
    id: 'r44',
    title: 'First Day, Torn Shirt',
    level: 2,
    topic: '日常生活',
    words: 359,
    passage:
      'Today is your first day of school and I want you to look handsome," my mom said as she forced a collared shirt over my head.' + '\n' +
      'I don\'t want to wear the blue one. I like the red one. It is more comfortable," I said as I tried to grab my favorite shirt.' + '\n' +
      '"The red one is old and has stains. It is the first day of school, so you have to wear a new shirt."' + '\n' +
      'I hated the way the shirt looked, but she would not be defeated. I didn\'t like the first day of school because everyone expected you to be dressed up. All I wanted to do was wear my normal clothes.' + '\n' +
      'Here is your lunch box. I packed you all healthy foods — a sandwich, juice, and two apples. You can share one of the apples if you want, but I don\'t want you to eat sweets. Don\'t try and trade with the other kids. I have already told your teachers to watch out, so don\'t even try," she said.' + '\n' +
      'Defeated again," I thought to myself. I hated never having sweet things in my lunch box, but my mom never packed them.' + '\n' +
      'When I got to school, my best friend was waiting for me outside the playground. There was a soccer game being started and we hurried to join. We only got to play ten minutes before the bell rang but it was awesome. I scored three goals. Then I looked down at my shirt. It was torn apart. I had ripped part of it and it was covered in dirt.' + '\n' +
      'My mom is going to kill me!" I said to my friend. "She told me I had to look neat for my first day of class."' + '\n' +
      'It\'s okay. The soccer coach was watching you play and he is definitely going to ask you to try out for the team now. Just tell your mom you had to," my friend said, smiling.' + '\n' +
      'He was right. My mom was mad when she picked me up but she was excited that I got picked for the team. I think that it was a pretty good first day.',
    glossary: [
      { w: 'stain', m: 'しみ' },
      { w: 'rip', m: '破る' },
      { w: 'try out', m: '入団テストを受ける' }
    ],
    questions: [
      {
        q: 'What is the best title for the story?',
        choices: [
          'The First Day in My Class',
          'Mom Never Packs Me Candy',
          'I Always Ruin My Nice Clothes',
          'A Ripped Shirt and a New Soccer Team Member'
        ],
        answer: 3,
        explanation: '新しいシャツが破れたことと、サッカーチームに誘われたことの両方が結末につながるので D が物語全体を表します。'
      },
      {
        q: 'What is suggested about the boy\'s mom?',
        choices: [
          'She doesn\'t wear nice shirts.',
          'She is older than the boy\'s teacher.',
          'She enjoys eating candy and sweets,',
          'She is concerned about the boy\'s health.'
        ],
        answer: 3,
        explanation: '健康的な食べ物だけを持たせ、甘い物を禁じ、交換まで防ごうとしていることから、息子の健康を気づかっていると分かります。'
      },
      {
        q: 'What does the author imply about the boy?',
        choices: [
          'He does not enjoy playing soccer.',
          'He doesn\'t have very many friends.',
          'He usually gets food on his nice clothes.',
          'He doesn\'t care about wearing nice clothes.'
        ],
        answer: 3,
        explanation: '「All I wanted to do was wear my normal clothes（普段着でいたかった）」から、おしゃれな服に興味がないと読み取れます。'
      }
    ]
  },
  {
    id: 'r45',
    title: 'Hot Dog Champion',
    level: 2,
    topic: '学校生活',
    words: 228,
    passage:
      'On Saturday, April 20, Billy Brady won the Lynch Park Hot Dog Eating Contest. The contest was held in the field near the swings. Sadie\'s Hot Dog Shack donated all of the hot dogs. All the people in the contest and all the people who watched paid five dollars. This money went to local hospitals for children. The winner of the contest got free hot dogs at Sadie\'s for one year.' + '\n' +
      'Billy Brady is an eighth-grader here at Fratsburg Middle School, who is in Mr. Dunn\'s homeroom. Billy is on the basketball team and he loves to eat. That\'s why Billy did the hot dog eating contest on Saturday. "I didn\'t know if I would win," said Billy, "But I love hot dogs and I can eat a lot. My friends thought I had a chance, so I wanted to try." Billy was able to eat fifty hot dogs in ten minutes. For every minute, he ate five hot dogs. That means he ate one hot dog in a little more than ten seconds. After the contest, Billy said, I\'m so happy I won, but I feel sick." When asked about going to Sadie\'s for a hot dog he said, "I know the hot dogs are free for me, but I\'m going to need to wait. After the contest, I don\'t want to eat any more hot dogs!"',
    glossary: [
      { w: 'donate', m: '寄付する' },
      { w: 'local', m: '地元の' },
      { w: 'encouragement', m: '励まし' }
    ],
    questions: [
      {
        q: 'What would be the most suitable headline for the article?',
        choices: [
          'Billy Brady at Sadie\'s Hot Dog Shack',
          'Eating Hot Dogs at Lynch Park with Billy',
          'Billy Brady Wins Hot Dog Eating Contest',
          'Billy Brady Feels Very Sick after Eating Hot Dogs'
        ],
        answer: 2,
        explanation: '記事の中心は Billy Brady が大食い大会で優勝したことなので、C が見出しに最適です。'
      },
      {
        q: 'What can be inferred about Billy Brady before the contest?',
        choices: [
          'He didn\'t like hot dogs very much.',
          'He often ate hot dogs with his family.',
          'He had never been to Sadie\'s Hot Dog Shack.',
          'He entered the contest after encouragement from his friends.'
        ],
        answer: 3,
        explanation: '「My friends thought I had a chance, so I wanted to try（友達が見込みがあると言うから挑戦した）」から D が推測できます。'
      },
      {
        q: 'What does Billy suggest about hot dogs after the contest?',
        choices: [
          'He can make them.',
          'He is tired of them.',
          'He wants to eat more.',
          'Sadie\'s hot dogs are the best.'
        ],
        answer: 1,
        explanation: '「I don\'t want to eat any more hot dogs!（もうホットドッグは食べたくない）」から、しばらくうんざりしていると分かります。'
      }
    ]
  },
  {
    id: 'r46',
    title: 'The Harm of Acid Rain',
    level: 2,
    topic: '環境',
    words: 200,
    passage:
      'Acid rain can harm buildings, plants, and even people. Acid rain is rain that contains acidic chemicals. It is caused by chemicals put into the environment by humans. These chemicals mixing with water cause the acid rain that we have on Earth today. Acidic" means that the rain\'s pH level is acidic rather than neutral or basic. A pH scale runs from 0 to 14; the lower the number, the higher the acidity. Water is right in the middle with a pH of 7. Bleach and other cleaning fluids are usually basic. These are dangerous too because they dissolve protein. Acids tend to taste sour and can hurt people by burning them. These acids can also erode concrete or metal.' + '\n' +
      'Obviously, rain, snow, and ice can damage buildings and forests, but acidic rain, snow, and ice make this damage happen much faster. The famous Statue of Liberty in New York City had to be fixed because of acid rain. Some cities cover up their statues during the winter when snow and ice stays on the ground for a long time. Acid rain can also harm animals. Fish eggs in ponds and lakes cannot hatch if the pH is below 5.',
    glossary: [
      { w: 'acid', m: '酸' },
      { w: 'dissolve', m: '溶かす' },
      { w: 'erode', m: '侵食する' }
    ],
    questions: [
      {
        q: 'What is the passage mostly about?',
        choices: [
          'Acid rain being harmful',
          'Acid in rain, snow, and ice',
          'The pH scale and acid rain',
          'Hydrogen ions in substances'
        ],
        answer: 0,
        explanation: '冒頭の「Acid rain can harm buildings, plants, and even people」が主題文で、以降は酸性雨の害の説明が続きます。'
      },
      {
        q: 'What does the author imply when he say "These are dangerous too...\'?',
        choices: [
          'Bleach is not dangerous to humans.',
          'Water can be dangerous if it\'s neutral.',
          'Both acidic and basic things are harmful.',
          'Basic things are more dangerous than acidic things.'
        ],
        answer: 2,
        explanation: '酸の危険を述べた流れで「These（漂白剤などの塩基性のもの）are dangerous too」と言っているので、酸もアルカリも有害だという意味です。'
      },
      {
        q: 'What does the author imply about rain?',
        choices: [
          'It should have a pH of 7.',
          'It smells like lemon juice and vinegar.',
          'It doesn\'t affect fish in ponds and lakes.',
          'It is more dangerous to buildings than statues.'
        ],
        answer: 0,
        explanation: '「Water is right in the middle with a pH of 7」とあり、酸性雨は本来の雨（中性）から外れたものなので、雨は pH 7 であるべきだと読み取れます。'
      }
    ]
  },
  {
    id: 'r47',
    title: 'Come with Us on Saturday',
    level: 2,
    topic: '手紙・メール',
    words: 156,
    passage:
      'Hello Jamie, It was great to see you last night. I thought that I would send you an e-mail with our weekend plans in case you wanted to come with us. Jenna and I are going to visit the Modern Art Museum at 3 P.M. There is going to be a special show for Dutch artists. They are going to be showing some really rare paintings. The museum has been gathering paintings for a year just for this event. I don\'t think we will ever be able to see this special of an art show. It\'s a once-in-a-lifetime chance. After the art show, we are going out to dinner. My cousin has just opened a new restaurant and we want to see how good it is. Jenna has not seen you for a long time and said that she misses you.' + '\n' +
      'Let me know if you want to come with us as soon as possible. Lisa',
    glossary: [
      { w: 'rare', m: 'めったにない' },
      { w: 'gather', m: '集める' },
      { w: 'once-in-a-lifetime', m: '一生に一度の' }
    ],
    questions: [
      {
        q: 'Why is Lisa writing the e-mail?',
        choices: [
          'To ask about a museum',
          'To try and find out if Jamie knows Jenna',
          'To invite Jamie to a museum and dinner',
          'To help Jamie find a good place to take her date'
        ],
        answer: 2,
        explanation: '「in case you wanted to come with us（一緒に来たいかもしれないから）」とあり、美術館と夕食に誘うメールです。'
      },
      {
        q: 'Why does Lisa mention her cousin\'s opening a new restaurant?',
        choices: [
          'To say she wants to buy it',
          'To explain why she wants to go there',
          'To show that she knows a good restaurant',
          'To inform Jamie that the restaurant is good'
        ],
        answer: 1,
        explanation: 'いとこの店の話は「we want to see how good it is（どんな店か見てみたい）」と、そこへ行く理由の説明として出てきます。'
      },
      {
        q: 'Why does Lisa write "It\'s a once-in-a-lifetime chance"?',
        choices: [
          'To explain why it\'s expensive',
          'To strongly encourage Jamie to come',
          'To show it happens once a year',
          'To prove that she loves museums'
        ],
        answer: 1,
        explanation: '「一生に一度のチャンス」と強調するのは、Jamie にぜひ来てほしいからです。'
      }
    ]
  },
  {
    id: 'r48',
    title: 'Birth Order and Personality',
    level: 2,
    topic: '科学・生活',
    words: 188,
    passage:
      'One interesting area of study is that of birth order. This study is based on the idea that the order in which we are born affects who we are. The way that we see the world, ourselves, and our families is impacted by birth order. For example, someone who is the oldest child in their family was raised differently than someone who is the youngest or the middle child. An oldest child who was the only child in the family for a time is often well put together and neat. They are given a lot of work in caring for and teaching their younger brothers and sisters, which can make them smart and hard-working. First-borns often also feel the need to have control and power.' + '\n' +
      'Middle children, because they have at least one sibling older and younger than them, often feel overlooked. Sometimes, middle children will do things in order to get attention and they may become very independent.' + '\n' +
      'The youngest child is usually very friendly and outgoing. They have always had older brothers or sisters looking out for them, so they usually depend more on other people.',
    glossary: [
      { w: 'sibling', m: 'きょうだい' },
      { w: 'overlooked', m: '見過ごされる' },
      { w: 'independent', m: '自立した' }
    ],
    questions: [
      {
        q: 'What would be the best title for the passage?',
        choices: [
          'Why Oldest Children Are Smart',
          'Why Birth Order Studies Are False',
          'Birth Order and Its Effect on Children',
          'How Parents Should Raise Their Children'
        ],
        answer: 2,
        explanation: '第一子・中間子・末っ子それぞれの性格への影響を説明する文章なので、C が全体を表すタイトルです。'
      },
      {
        q: 'Why does the author mention that middle children have at least one sibling older and younger than them?',
        choices: [
          'To explain why they often feel neglected',
          'To prove that birth order affects everyone',
          'To show that they are the center of everything',
          'To contrast middle children with youngest children'
        ],
        answer: 0,
        explanation: '上と下にきょうだいがいる、という事実は「often feel overlooked（見過ごされがち）」の理由として挙げられています。'
      },
      {
        q: 'Why is it mentioned that the youngest child "has always had older brothers or sisters looking out for them"?',
        choices: [
          'To offer an example of caring',
          'To explain why the youngest child is so smart',
          'To show that the youngest child is given what they want',
          'To show why the youngest child may be relatively dependent'
        ],
        answer: 3,
        explanation: '年上のきょうだいにいつも面倒を見てもらってきたことが、「they usually depend more on other people（人に頼りがち）」の理由です。'
      }
    ]
  },
  {
    id: 'r49',
    title: 'Penguin Facts You Never Knew',
    level: 2,
    topic: '生物',
    words: 205,
    passage:
      'Penguins are black and white birds that live about half the time on land and half the time in the water. Penguins are very popular in movies and on television and can be seen in movies such as The Adventure of Scamper the Penguin, Happy Feet, and March of the Penguins. However, many people do not know certain basic facts about these interesting birds. Often it is thought that, because penguins usually live in the cold, they must live in the Far North. Instead, the opposite is true. All penguins are native to the southern hemisphere. Some, like the Galapagos penguins, even live in a fairly warm part of the world. Because penguins do not live in places such as the North Pole, they would never be around animals like polar bears and walruses.' + '\n' +
      'Another little-known fact is that, very rarely, a brown penguin is born. Brown penguins are called Isabelline penguins. Sadly, Isabelline penguins often do not live as long as black and white penguins. This is because they can be seen easier by large sea animals such as the fur seals that eat penguins. Within their family groups, brown penguins are sometimes not treated as well as normal black and white colored penguins.',
    glossary: [
      { w: 'hemisphere', m: '半球' },
      { w: 'native', m: '原産の' },
      { w: 'treat', m: '扱う' }
    ],
    questions: [
      {
        q: 'What is the passage mainly about?',
        choices: [
          'Penguin movies',
          'Brown penguins',
          'Galapagos penguins',
          'Little known facts about penguins'
        ],
        answer: 3,
        explanation: '「many people do not know certain basic facts」と前置きし、南半球の話と茶色いペンギンの話が続くので D が主題です。'
      },
      {
        q: 'The author talks about "The Adventure of Scamper the Penguin, Happy Feet, and March of the Penguins" to',
        choices: [
          'discuss bird movies',
          'show that penguins are very well-known',
          'give examples of terrible penguin movies',
          'prove that there are only a few movies about penguins'
        ],
        answer: 1,
        explanation: '映画のタイトルを並べているのは、ペンギンがテレビや映画でとても人気がある（＝よく知られている）ことを示すためです。'
      },
      {
        q: 'Why does the author say, "Some, like the Galapagos penguins, even live in a fairly warm part of the world"?',
        choices: [
          'To discuss strange penguins',
          'To prove penguins hate the cold',
          'To explain that penguin feathers are amazing',
          'To dismiss the idea that penguins only live in the cold'
        ],
        answer: 3,
        explanation: '「ペンギンは寒い北の地方に住む」という思い込みを打ち消すために、温暖な地域に住むガラパゴスペンギンを例に挙げています。'
      }
    ]
  },
  {
    id: 'r50',
    title: 'Alaska: Wild and Cold',
    level: 2,
    topic: '社会',
    words: 202,
    passage:
      'Alaska is the biggest state in the United States of America and was the 49th state to be added to the country. Alaska is found in the north-western region of North America and, due to its location and the waters around it, has a very cold climate. The lowest temperature recorded in Alaska was -62 degrees Celsius. Most areas of Alaska have large amounts of rain and snow throughout the year. However, there\'s an area in western Alaska that only receives ten inches of rain a year. According to science, this small amount of rain makes this area a desert, even though it is very cold. As well as being cold, Alaska is also known for being a wild and untamed place. There are many different types of wild animals that live in Alaska. Everything from foxes, bears, and caribou to seals, weasels, and whales can be found in this state. Many of the animals in Alaska can be dangerous if people are not careful around them. Black bears, especially, are a risk to humans because they are often found in areas where humans live. These bears come close to such locations because they want food and because they are curious creatures.',
    glossary: [
      { w: 'climate', m: '気候' },
      { w: 'desert', m: '砂漠' },
      { w: 'untamed', m: '手つかずの' }
    ],
    questions: [
      {
        q: 'What is the best title for the passage?',
        choices: [
          'My Favorite State',
          'Animals of Alaska',
          'Alaska: Wild and Cold',
          'Alaska: The Largest State'
        ],
        answer: 2,
        explanation: '前半は寒さ、後半は野生動物の話で、「cold」と「wild and untamed」の両方を含む C が最適なタイトルです。'
      },
      {
        q: 'Why does the author say, "The lowest temperature recorded in Alaska was -62 degrees Celsius"?',
        choices: [
          'To give an example of how cold Alaska gets',
          'To inform readers how cold North America is',
          'To argue that warm weather is better than cold weather',
          'To explain what kind of weather the animals live in'
        ],
        answer: 0,
        explanation: '-62度という記録は、アラスカがどれほど寒くなるかを示す具体例として挙げられています。'
      },
      {
        q: 'The author uses "foxes, bears, and caribou" as examples of',
        choices: [
          'water animals',
          'endangered animals',
          'wild animals of Alaska',
          'animals that are untamed'
        ],
        answer: 2,
        explanation: '「There are many different types of wild animals that live in Alaska. Everything from foxes, bears, and caribou...」と、アラスカの野生動物の例です。'
      }
    ]
  },
  {
    id: 'r51',
    title: 'The Championship in the Snow',
    level: 2,
    topic: '学校生活',
    words: 254,
    passage:
      'Last Wednesday, our soccer team had a problem. It was cold. In fact, it was snowing. It was also the day that the team had to play in the championship game. The ball was as hard as a rock. It hurt to kick, trap, or catch. The field was solid white and the ball was easy to lose. Plus, it was too cold for shorts. All the players had to wear long pants that made it difficult to run. Somehow both teams managed to play for the whole game. The game itself was very close. Neither team was better. Both teams played well. They passed the ball, made tackles, and ran until they were dead tired, but nobody could score a goal. The game ended with the score still being zero to zero. Then overtime came and went without a goal. It was snowing harder and harder. We could barely see the field. The players were still trying as hard as they could, but then the whistle blew. Overtime was over. It was time for penalty kicks.' + '\n' +
      'Both teams made their first four penalty shots. Somehow the other team\'s goalie saved our fifth try. Then their best player stepped up to take their last kick. He ran up to the ball, gave it a very soft kick, and slipped. The ball rolled slowly forward. We all started to cheer but then we saw that our goalie had already dived to save it. The ball rolled slowly over the goal line and our team lost.',
    glossary: [
      { w: 'championship', m: '決勝戦' },
      { w: 'overtime', m: '延長戦' },
      { w: 'penalty kick', m: 'PK' }
    ],
    questions: [
      {
        q: 'Why did the author write the article?',
        choices: [
          'To talk about the soccer game',
          'To explain why the best team lost',
          'To help himself feel better about being cold',
          'To explain why soccer games are better in snow'
        ],
        answer: 0,
        explanation: '学校新聞の記事として、雪の中の決勝戦の様子を伝えるために書かれています。'
      },
      {
        q: 'Why does the author talk about the field being white?',
        choices: [
          'To show how nice it was',
          'To show how cold it is getting',
          'To show how fun it was to play soccer',
          'To show that it was difficult to play soccer'
        ],
        answer: 3,
        explanation: '「The field was solid white and the ball was easy to lose（ボールを見失いやすい）」と、プレーの困難さを示すための描写です。'
      },
      {
        q: 'What does the author imply about the two teams?',
        choices: [
          'They were both bad.',
          'The home team was better.',
          'They were both good teams.',
          'Neither of them should have won.'
        ],
        answer: 2,
        explanation: '「Neither team was better. Both teams played well.」とあり、両チームとも良いチームだったと分かります。'
      },
      {
        q: 'Why does the author mention penalty kicks?',
        choices: [
          'To tell about how they won',
          'To show how much the team likes them',
          'To give a reason for the game continuing',
          'To explain when and how the game ended'
        ],
        answer: 3,
        explanation: '延長でも決着がつかず、PK戦の最後のキックで勝敗が決まりました。PK の話は試合がどう終わったかを説明するためのものです。'
      }
    ]
  },
  {
    id: 'r52',
    title: 'The Strange Death of William the Conqueror',
    level: 2,
    topic: '歴史',
    words: 225,
    passage:
      'William the Conqueror was a great warrior and king of England, known for his victories in battle. However, one of the most interesting things about him is not his life, but his death. William is known to have been a very heavy man with a large belly. During one of his sieges in the year 1087, he fell off his horse and was very badly hurt when his stomach hit his saddle.' + '\n' +
      'As a result of these injuries, William died and was to be buried in a stone tomb. All of the family and friends of the king were taking care of his property, and were not able to plan his funeral. A knight took care of the king\'s body and made sure that it was taken to the church where it was to be buried.' + '\n' +
      'However, at the same time as the funeral, there was a fire within the town. Everyone left immediately to put the fire out and save the town. As all of this was going on, William\'s body sat in the hot sun for a long time. The heat made his body get even bigger. Later, when they tried to put him into the tomb, his body would not fit. The people who were burying him pushed him into the tomb so tightly that his stomach burst, spraying everyone with fluid.',
    glossary: [
      { w: 'warrior', m: '戦士' },
      { w: 'siege', m: '包囲戦' },
      { w: 'burst', m: '破裂する' }
    ],
    questions: [
      {
        q: 'What is the main topic of the passage?',
        choices: [
          'Burials in the 1000s',
          'Life of English royalty',
          'William the Conqueror as a king',
          'The death of William the Conqueror'
        ],
        answer: 3,
        explanation: '冒頭に「one of the most interesting things about him is not his life, but his death」とあり、以降は死と埋葬の話が続きます。'
      },
      {
        q: 'What can be inferred about the tomb?',
        choices: [
          'It was much larger than William.',
          'It was in England instead of France.',
          'It was built to hold more than one person.',
          'It was not designed for William\'s swollen body.'
        ],
        answer: 3,
        explanation: '熱で膨らんだ体が「his body would not fit（棺に入らなかった）」ことから、棺は膨張した体を想定して作られていなかったと分かります。'
      },
      {
        q: 'Why does the author mention that William the Conqueror\'s body got bigger?',
        choices: [
          'To argue that he should have lost weight',
          'To inform us exactly what he looked like',
          'To give the reason that he fell off his horse',
          'To explain why he would not fit into the tomb later'
        ],
        answer: 3,
        explanation: '体が大きくなった話は、後で棺に入らなかった理由を説明するために書かれています。'
      },
      {
        q: 'Why does the author talk about William the Conqueror\'s falling off his horse?',
        choices: [
          'To explain how heavy he was',
          'To inform readers of the cause of his death',
          'To discuss royal transportation at that time',
          'To give an example of how he was poor at horse riding'
        ],
        answer: 1,
        explanation: '落馬の話は「As a result of these injuries, William died（このけがが原因で死んだ）」と、死因を伝えるためのものです。'
      }
    ]
  },
  {
    id: 'r53',
    title: 'Reading Festival Schedule',
    level: 2,
    topic: 'お知らせ',
    words: 122,
    passage:
      'Reading Festival' + '\n' +
      'On Friday, March 6, Sullivan School will have a Reading Festival. Grade 6, 7, and 8 students will all participate in special activities.' + '\n' +
      '10:00 - 11:00 A.M. — Grade 6: Book Sharing / Grade 7: Snacks with a Writer / Grade 8: Speed Reading.' + '\n' +
      '11:15 A.M. - 12:15 P.M. — Grade 6: Snacks with a Writer / Grade 7: Speed Reading / Grade 8: Radio Bookblast.' + '\n' +
      '12:30 - 1:30 P.M. — Grade 6: Speed Reading / Grade 7: Book Sharing / Grade 8: Snacks with a Writer.' + '\n' +
      '1:30 P.M. — SPECIAL LUNCH FOR ALL.' + '\n' +
      'The special lunch will be held in the cafeteria. Activity leaders will travel from homeroom to homeroom. All activities will happen in students\' regular homeroom classrooms.',
    glossary: [
      { w: 'participate', m: '参加する' },
      { w: 'homeroom', m: 'ホームルーム教室' },
      { w: 'activity', m: '活動' }
    ],
    questions: [
      {
        q: 'At what time will the sixth-graders do the speed reading activity?',
        choices: [
          '10:00 A.M.',
          '11:15 A.M.',
          '12:30 P.M.',
          '1:30 P.M.'
        ],
        answer: 2,
        explanation: '予定表で Grade 6 の Speed Reading は 12:30 - 1:30 P.M. の枠にあります。'
      },
      {
        q: 'Where will the special lunch take place?',
        choices: [
          'In the school theater',
          'In the school cafeteria',
          'In the homeroom classrooms',
          'At the Snacks with a Writer event'
        ],
        answer: 1,
        explanation: '「The special lunch will be held in the cafeteria」と明記されています。'
      },
      {
        q: 'Who will get to do the Radio Bookblast activity?',
        choices: [
          'Sixth-graders',
          'Eighth-graders',
          'Seventh-graders',
          'All of the above'
        ],
        answer: 1,
        explanation: '予定表で Radio Bookblast があるのは Grade 8 の 11:15 の枠だけです。'
      },
      {
        q: 'Where will the activities happen?',
        choices: [
          'In the school theater',
          'In the school cafeteria',
          'In the homeroom classrooms',
          'At the Snacks with a Writer event'
        ],
        answer: 2,
        explanation: '最後に「All activities will happen in students\' regular homeroom classrooms」とあります。昼食（食堂）と混同しないよう注意。'
      }
    ]
  },
  {
    id: 'r54',
    title: 'A Letter from Coach McMahon',
    level: 2,
    topic: '手紙・メール',
    words: 199,
    passage:
      'Dear Anthony, I watched the video you sent me last week. You look like a great soccer player and I would love to have you on my team. However, there are some questions I have for you. It is important that we know enough about you before you get here so that we can find the perfect place for you. First of all, how long have you been playing soccer? Second, what is your favorite position?' + '\n' +
      'Also, I am going to need a copy of your middle school grades. Academics are very important at Gremling Soccer Academy. We are only interested in athletes who are serious about school. We believe that if you work hard in school, then you will work hard on the soccer field too. I\'d like you to know that we assist all of our players when applying to high school. We also know a lot of soccer coaches all over the country. Thanks again for sending me your video. I look forward to meeting you. I hope you enjoy the rest of your soccer season, and I will let you know when I get the rest of the information Is I need.' + '\n' +
      'Sincerely, Coach McMahon',
    glossary: [
      { w: 'academics', m: '学業' },
      { w: 'assist', m: '手助けする' },
      { w: 'apply', m: '出願する' }
    ],
    questions: [
      {
        q: 'Why did Coach McMahon write the e-mail?',
        choices: [
          'To help a player get into a good high school',
          'To find the best students for his soccer school',
          'To tell a player he is interested in having him on the team',
          'To ask for a video of the player competing around the country'
        ],
        answer: 2,
        explanation: '「I would love to have you on my team（ぜひチームに迎えたい）」と伝えたうえで、必要な情報を尋ねるメールです。'
      },
      {
        q: 'In the passage, the word athletes is closest in meaning to',
        choices: [
          'good students',
          'favorite teams',
          'sports players',
          'musical instrument players'
        ],
        answer: 2,
        explanation: 'athletes は「運動選手」という意味なので sports players が最も近い表現です。'
      },
      {
        q: 'In the passage, the word assist is closest in meaning to',
        choices: [
          'give',
          'help',
          'test',
          'teach'
        ],
        answer: 1,
        explanation: 'assist は「助ける」という意味なので help が最も近い語です。'
      },
      {
        q: 'What does Coach McMahon say he does for his soccer players?',
        choices: [
          'He helps them get into good high schools.',
          'He assists them with their soccer techniques.',
          'He makes them videos to show their friends and family.',
          'He finds them good jobs when they are done with camp.'
        ],
        answer: 0,
        explanation: '「we assist all of our players when applying to high school（高校出願を手伝う）」とあります。'
      }
    ]
  },
  {
    id: 'r55',
    title: 'Teacher of the Year',
    level: 2,
    topic: '学校生活',
    words: 173,
    passage:
      'Last week, one teacher from Newark Middle School, Miss Helen DeBow, was given a Teacher of the Year award. The awards are given out by the State Department of Education to excellent teachers. Teachers win because of their students who write in to the contest. The award was given to Ms. DeBow on Saturday, June 6, in Wilmington, Delaware. Ms. DeBow is a history teacher at Newark Middle School. She teaches history to seventh- graders and loves teaching about the history of the United States. "I like teaching American history best because it helps students understand their own lives." Ms. DeBow enjoys teaching other histories too. "Studying ancient history is also very interesting. I always have my students study Mesopotamia," she said.' + '\n' +
      'It was Carla Ross and Michael Hubbard who wrote to the department for Ms. Debow. She\'s a wonderful teacher and I really wanted her to win this award," said Carla. Michael agreed and added, "Ms. DeBow is one of the best teachers at this school. I\'m happy that they chose her:"',
    glossary: [
      { w: 'award', m: '賞' },
      { w: 'department', m: '（行政の）局・省' },
      { w: 'ancient', m: '古代の' }
    ],
    questions: [
      {
        q: 'What would be the most suitable headline for the article?',
        choices: [
          'Ms. DeBow Likes Teaching History',
          'Studying the USA and Mesopotamia',
          'Newark History Teacher Wins Award',
          'Carla and Michael at Newark Middle School'
        ],
        answer: 2,
        explanation: '記事の中心は DeBow 先生が Teacher of the Year 賞を受賞したことなので、C が見出しに最適です。'
      },
      {
        q: 'What is suggested about Ms. DeBow?',
        choices: [
          'She always wins this award:',
          'She is a very good teacher.',
          'She has lived in Mesopotamia.',
          'She used to work at another school.'
        ],
        answer: 1,
        explanation: 'excellent teachers に贈られる賞を受賞し、生徒たちも絶賛していることから、とても良い先生だと分かります。'
      },
      {
        q: 'Based on the article, who decided to give Ms. DeBow the award?',
        choices: [
          'Newark Middle School',
          'Carla Ross and Michael Hubbard',
          'Students in Ms. Debow\'s classes',
          'The State Department of Education'
        ],
        answer: 3,
        explanation: '「The awards are given out by the State Department of Education」— 賞を出す（＝決める）のは州教育局です。生徒2人は推薦の手紙を書いただけです。'
      },
      {
        q: 'In the passage, the word award is closest in meaning to',
        choices: [
          'prize',
          'school',
          'money',
          'excellence'
        ],
        answer: 0,
        explanation: 'award は「賞」という意味なので prize が最も近い語です。'
      },
      {
        q: 'In the passage, the word ancient is closest in meaning to',
        choices: [
          'Asian',
          'modern',
          'very old',
          'Egyptian'
        ],
        answer: 2,
        explanation: 'ancient history は「古代史」。ancient は very old（とても古い）が最も近い表現です。'
      },
      {
        q: 'What is Ms. DeBow\'s favorite subject to teach?',
        choices: [
          'Ancient history',
          'American history',
          'Delaware\'s history',
          'Mesopotamian history'
        ],
        answer: 1,
        explanation: '「I like teaching American history best（アメリカ史を教えるのが一番好き）」と本人が言っています。'
      }
    ]
  },
  {
    id: 'r56',
    title: 'A Rainy Day Hike',
    level: 2,
    topic: '日常生活',
    words: 295,
    passage:
      'Rain pounded down on the roof. I was trying to read but the sound was too loud. I couldn\'t help myself from being a little grumpy. I wanted to be outside playing, but the rain was keeping me inside.' + '\n' +
      'My mom had gone to the grocery store, and my dad was spending Saturday at the office. I had planned to spend the day hiking, but Mother Nature decided that today was the perfect day for rain.' + '\n' +
      'It meant that I would have to entertain myself. I spent most of the morning playing with my stuffed animals and reading. I was sitting next to the window staring out when I got a strange idea: why not just go outside anyway? I put on my boots and a big raincoat and stepped out into the wet world. It was raining hard but it wasn\'t cold. All I could hear were raindrops and the wind. I decided to go on my hike anyway.' + '\n' +
      'My feet didn\'t make any sound on the wet ground and the forest seemed different. I went to my favorite place and sat down. In the summer, my best friend Ellen and I would come here and sit for hours. It was our special place. All of a sudden, I thought I heard someone shouting my name. I turned and saw Ellen walking up behind me. Oh my Gosh! It\'s really you, Martha!" she said. "I can\'t believe that you are out here right now. I thought I would be the only person crazy enough to go for a walk in the rain." I was very happy to have some company. We decided that hiking in the rain was just as fun as hiking in the sunshine. We planned on hiking in the rain again.',
    glossary: [
      { w: 'grumpy', m: '不機嫌な' },
      { w: 'entertain', m: '楽しませる' },
      { w: 'company', m: '一緒にいる相手' }
    ],
    questions: [
      {
        q: 'What is the best title for the story?',
        choices: [
          'Rainy Day Work',
          'A Rainy Day Hike',
          'A Rainy Day Indoors',
          'Rainy Day Homework'
        ],
        answer: 1,
        explanation: '雨の日にあえて外に出てハイキングをした話なので、B が物語全体を表すタイトルです。'
      },
      {
        q: 'What was keeping Martha inside?',
        choices: [
          'The heat',
          'Her parents',
          'Bad weather',
          'Lots of homework'
        ],
        answer: 2,
        explanation: '「the rain was keeping me inside（雨のせいで家にいた）」— 悪天候が理由です。'
      },
      {
        q: 'What does Martha mean when she says "It meant that I would have to entertain myself\'?',
        choices: [
          'She was tired.',
          'She was feeling sick.',
          'She had to find something to do.',
          'She was bored with doing homework.'
        ],
        answer: 2,
        explanation: '親は出かけ、予定も流れたので、「自分で自分を楽しませなければならない＝何かやることを見つけなければならない」という意味です。'
      },
      {
        q: 'In the passage, the word company is closest in meaning to',
        choices: [
          'time',
          'space',
          'friend',
          'business'
        ],
        answer: 2,
        explanation: '「I was very happy to have some company」の company は、一緒に過ごす「仲間・友達」のことです。'
      },
      {
        q: 'What did Martha think about being outside?',
        choices: [
          'It was too hot.',
          'It was too cold.',
          'It was very nice.',
          'It was too wet to walk.'
        ],
        answer: 2,
        explanation: '「It was raining hard but it wasn\'t cold」「hiking in the rain was just as fun...」と、外は快適で楽しかったと述べています。'
      },
      {
        q: 'What will Martha and Ellen probably do next time it rains?',
        choices: [
          'Stay inside',
          'Do homework',
          'Go for another hike',
          'Go to their friend\'s house'
        ],
        answer: 2,
        explanation: '最後に「We planned on hiking in the rain again（また雨の日にハイキングしようと決めた）」とあります。'
      }
    ]
  },
  {
    id: 'r57',
    title: 'Wondering at the Stars',
    level: 2,
    topic: '科学',
    words: 237,
    passage:
      'The stars are beautiful in the night sky. They are far away, farther away than most people can imagine. Even though they are light years away, they can still light up the sky. For thousands of years, people have been interested in stars. They have been used as fortune- tellers, calendars, and maps. Travelers often used the stars to help them find their way. Before there was electricity, the stars and moon were the brightest things in the night sky. People spent hours staring up and wondering what the little, twinkling lights were. Back then, the stars were easier to see because there weren\'t any other lights at night. Not many ancient people realized that the sun was a star. The sun and moon were thought of as father and mother of Earth in some ancient cultures. The stars were thought of as lesser gods or the souls of people who had died.' + '\n' +
      'Greek philosophers 2,300 years ago started to try and unravel the mystery. A man named Anaxagoras thought that the sun was a giant ball of metal burning in the center of our universe. He was thrown in jail and sentenced to death because this idea conflicted with people\'s religious beliefs.' + '\n' +
      'Even so, people did not stop trying to understand the sun. Scientists still study it today. Large telescopes take pictures of the sun almost every day as we try and learn more about it.',
    glossary: [
      { w: 'fortune-teller', m: '占い' },
      { w: 'philosopher', m: '哲学者' },
      { w: 'conflict', m: '対立する' }
    ],
    questions: [
      {
        q: 'What would be the best title for the passage?',
        choices: [
          'The Sun',
          'Stars in the Sky',
          'The Exploration of Space',
          'A History of Greek Thought'
        ],
        answer: 1,
        explanation: '星と人間の関わり（道しるべ・信仰・太陽の研究）を広く扱う文章なので、B が全体を表すタイトルです。'
      },
      {
        q: 'Why were stars useful to people?',
        choices: [
          'They kept people safe.',
          'They were beautiful.',
          'They showed people the way.',
          'They burned up dangerous gases.'
        ],
        answer: 2,
        explanation: '「Travelers often used the stars to help them find their way（旅人は星で道を知った）」とあります。'
      },
      {
        q: 'Which of the following is NOT mentioned?',
        choices: [
          'Stars as fortune-tellers and maps',
          'Anaxagoras going to jail for his ideas',
          'The sun and moon as father and mother',
          'Telescopes taking pictures of the planets'
        ],
        answer: 3,
        explanation: '望遠鏡が撮っているのは the sun（太陽）です。惑星の写真とは書かれていません。他の3つは本文にあります。'
      },
      {
        q: 'In the passage, the word realized is closest in meaning to',
        choices: [
          'found',
          'destroyed',
          'unearthed',
          'understood'
        ],
        answer: 3,
        explanation: 'realized は「気づいた・理解した」という意味なので understood が最も近い語です。'
      },
      {
        q: 'In the passage, the word unravel is closest in meaning to',
        choices: [
          'dream',
          'solve',
          'imagine',
          'look for'
        ],
        answer: 1,
        explanation: 'unravel the mystery は「謎を解き明かす」という意味なので solve が最も近い語です。'
      },
      {
        q: 'Why was Anaxagoras thrown in jail?',
        choices: [
          'He did not believe in God.',
          'He was not a good philosopher.',
          'His ideas were not the same as other people\'s.',
          'He found out that the sun was the same as all the other stars.'
        ],
        answer: 2,
        explanation: '「this idea conflicted with people\'s religious beliefs（考えが人々の宗教的信念と対立した）」ため投獄されました。'
      }
    ]
  },
  {
    id: 'r58',
    title: 'Reading in the Digital Age',
    level: 2,
    topic: '技術',
    words: 227,
    passage:
      'Books and reading are a very important part of education. If you go into someone\'s house in the modern world, they will usually have some sort of bookshelf full of books that they like to read. Some very educated or book-loving people have large rooms full of books. Nowadays, you can have many books without needing a room to store them. The Internet is making it more efficient for people to read. Web sites now make it easy for people to buy books. Thousands of books are available online. You can buy used books or new books. Now you can even buy electronic books. The Kindle, released by the web site Amazon, allows people to download books online and read them on the device. People can download hundreds of books at a time and put them on this small, hand-held e-book reader. The personal libraries of the past still look good and many people still like to have paper books, but e-book readers like the Kindle are changing things fast. Now people can carry huge libraries with them anywhere. People can read books for a lot cheaper as well. Books bought electronically are inexpensive because they do not have to be printed. They are stored in files and sold straight to the device. The Kindle and other reading devices are going to change book-buying and reading forever.',
    glossary: [
      { w: 'efficient', m: '効率的な' },
      { w: 'device', m: '機器' },
      { w: 'store', m: '保存する' }
    ],
    questions: [
      {
        q: 'What would be the best title for the passage?',
        choices: [
          'A New Age of Writing',
          'Libraries Lost and Forgotten',
          'Changes in the Reading Culture',
          'Electronics Replacing Written Literature'
        ],
        answer: 2,
        explanation: '紙の本から電子書籍へと「読書のかたち」が変わっていく話なので、C が全体を表すタイトルです。'
      },
      {
        q: 'The author mentions all of the following EXCEPT •',
        choices: [
          'carrying huge libraries everywhere',
          'the Internet making it easier for people to read',
          'books and reading as an important part of education',
          'where to buy inexpensive books in North America'
        ],
        answer: 3,
        explanation: '図書館を持ち歩けること、ネットが読書を楽にしたこと、教育における読書の大切さは本文にありますが、北米の安い書店の話はありません。'
      },
      {
        q: 'Why does the author mention "the Kindle"?',
        choices: [
          'To imply that soon libraries will not exist',
          'To suggest that every book is now electronic',
          'To show that there are few regular books now',
          'To give an example of an electronic reading device'
        ],
        answer: 3,
        explanation: 'Kindle は「電子書籍リーダー」の具体例として紹介されています。'
      },
      {
        q: 'In the passage, the word efficient is closest in meaning to',
        choices: [
          'hard',
          'safe',
          'happy',
          'handy'
        ],
        answer: 3,
        explanation: 'ネットのおかげで本を読む（買う）のが efficient になった、という文脈なので handy（便利な）が最も近い語です。'
      },
      {
        q: 'In the passage, the word inexpensive is closest in meaning to',
        choices: [
          'cheap',
          'difficult',
          'high-priced',
          'in high demand'
        ],
        answer: 0,
        explanation: 'inexpensive は「高くない＝安い」という意味なので cheap が正解です。'
      },
      {
        q: 'What do the Kindle and other e-book readers allow people to do?',
        choices: [
          'Read faster',
          'Read books with friends',
          'Travel with more books',
          'Buy more books in stores'
        ],
        answer: 2,
        explanation: '「Now people can carry huge libraries with them anywhere（大量の本をどこへでも持ち歩ける）」とあります。'
      },
      {
        q: 'In the passage, the word They refers to',
        choices: [
          'books',
          'people',
          'libraries',
          'readers'
        ],
        answer: 0,
        explanation: '「They are stored in files and sold straight to the device」の They は、前の文の Books（電子で買われた本）です。'
      },
      {
        q: 'What are the Kindle and other reading devices going to do to reading?',
        choices: [
          'Destroy it',
          'Make it difficult',
          'Make it different',
          'Make people stop reading'
        ],
        answer: 2,
        explanation: '最後の文に「going to change book-buying and reading forever（読書を永遠に変える）」とあります。'
      }
    ]
  }
];

const READING_TOPICS = [...new Set(READING_DATA.map((r) => r.topic))];
