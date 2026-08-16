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
  },
  {
    id: 'r59',
    title: '保護者面談の日のお知らせ',
    level: 3,
    topic: 'お知らせ',
    words: 173,
    passage:
      'Parent-Teacher Conference' + '\n' +
      'On Thursday, September 22, we are going to have a day where parents can come and meet their children\'s teachers. There will be several meetings and events throughout the day. I hope you can make it to some or all of them. Thank you very much. — Principal Edward Shinner' + '\n' +
      '10:00 - 11:00 A.M. — English, Parent Meetings, with Mrs. Crowe.' + '\n' +
      '11:00 A.M. - 12:00 P.M. — Math, Parent Meetings, with Mr. Simpson.' + '\n' +
      '12:00 - 1:00 P.M. — Science, Parent Meetings, with Mr. Flanders.' + '\n' +
      '1:00 - 2:00 P.M. — Lunch and Speech, Presentation, with Ms. Fox.' + '\n' +
      '2:00 - 3:00 P.M. — Athletics, Presentation and Demonstration, with Coach Kay.' + '\n' +
      '3:00 - 4:00 P.M. — After-School Programs, Parent Activities, with Mr. Magoo.' + '\n' +
      'Notes: All parents must send notes to school with their children saying if they are going to come. We need to know how many meetings to schedule and how much food to make. We would like all parents to participate in the final activity, so make sure to wear comfortable clothing.',
    glossary: [
      { w: 'conference', m: '面談・会議' },
      { w: 'participate', m: '参加する' },
      { w: 'comfortable', m: '快適な、楽な' }
    ],
    questions: [
      {
        q: 'Who will lead the English meetings?',
        choices: [
          'Mr. Magoo',
          'Mrs. Crowe',
          'Mr. Flanders',
          'Mr. Simpson'
        ],
        answer: 1,
        explanation: '予定表の最初の行に「10:00-11:00 A.M. — English, Parent Meetings, with Mrs. Crowe」とある。英語の面談を担当するのは Mrs. Crowe。'
      },
      {
        q: 'Which of the following is NOT mentioned in the announcement?',
        choices: [
          'English Activity',
          'Athletics Activity',
          'Parent Meetings',
          'After-School Science Fair'
        ],
        answer: 3,
        explanation: '案内に出てくるのは English や Athletics の活動、Parent Meetings、After-School Programs で、「After-School Science Fair（放課後サイエンスフェア）」はどこにも書かれていない。'
      },
      {
        q: 'Who is leading the last event of the day?',
        choices: [
          'Ms. Fox',
          'Coach Kay',
          'Mr. Magoo',
          'Edward Shinner'
        ],
        answer: 2,
        explanation: '一日の最後の予定は「3:00-4:00 P.M. — After-School Programs」で、担当は Mr. Magoo と書かれている。'
      },
      {
        q: 'What do the parents need to have for the final activity?',
        choices: [
          'A note from home',
          'A pair of sneakers',
          'Comfortable clothes to wear',
          'A bottle of water and a packed lunch'
        ],
        answer: 2,
        explanation: 'Notes の最後に「make sure to wear comfortable clothing（動きやすい服装で来てください）」とある。最終アクティビティに必要なのは楽な服装。'
      }
    ]
  },
  {
    id: 'r60',
    title: '7年生のブロードウェイ観劇旅行',
    level: 3,
    topic: '学校生活',
    words: 249,
    passage:
      'Last weekend, the seventh grade went to New York City and watched The Phantom of the Opera on Broadway. It was our school\'s first ever trip to Broadway and was a really fun time.' + '\n' +
      'The music was very well done. The actors were talented singers and very good dancers. The set itself was artistic and amazing. Being at a Broadway musical was a very unique experience. We had really good seats in the theater, so we could see everything perfectly. Plus, our seats were really comfortable.' + '\n' +
      'After the musical was over, we went to eat pizza. New York pizza is very famous and it was delicious. The restaurant was really busy. We had to wait a long time to sit down and eat. While we were waiting, we went outside to Central Park. There was a group of acrobats putting on a show for everyone to watch. They jumped and flipped so high and fast. It was almost as impressive as watching The Phantom of the Opera. After we had pizza, we went to our hotel and had an awesome night together as a class. We played games in the hotel\'s recreation room. It was so much fun going to New York, and we are sad that our trip had to end. Next year, the sixth-graders will be going to New York to see a Broadway show. We hope they get to see The Phantom of the Opera, but we are sure any show they watch will be great.',
    glossary: [
      { w: 'talented', m: '才能のある' },
      { w: 'impressive', m: '印象的な、見事な' },
      { w: 'acrobat', m: '曲芸師' }
    ],
    questions: [
      {
        q: 'What would be the best title for the article?',
        choices: [
          'The Seventh Grade Goes to New York',
          'The Sixth Grade Goes to New York',
          'Eating New York Pizza in Central Park',
          'The Sixth and Seventh Grades Go to New York'
        ],
        answer: 0,
        explanation: '第1段落に「the seventh grade went to New York City（7年生がニューヨークへ行った）」とあり、記事全体が7年生の旅行の報告。6年生が行くのは来年の話。'
      },
      {
        q: 'What is suggested about The Phantom of the Opera?',
        choices: [
          'It was sad and scary.',
          'It was the trip\'s main event.',
          'It was hard to watch from their seats.',
          'It was in the New York Opera House.'
        ],
        answer: 1,
        explanation: '旅行の中心はミュージカル鑑賞で、曲芸師のショーですら「almost as impressive as watching The Phantom of the Opera（オペラ座の怪人にほぼ匹敵する）」と比較されている。つまり劇が旅行のメインイベント。'
      },
      {
        q: 'In the passage, the word talented is closest in meaning to',
        choices: [
          'quiet',
          'illegal',
          'gifted',
          'doubtful'
        ],
        answer: 2,
        explanation: 'talented は「才能のある」。直後に「very good dancers」と続き、歌も踊りも上手だという文脈なので gifted（才能に恵まれた）が最も近い。'
      },
      {
        q: 'In the passage, the word impressive is closest in meaning to',
        choices: [
          'funny',
          'boring',
          'exciting',
          'uninteresting'
        ],
        answer: 2,
        explanation: 'impressive は「見事な、心を動かす」。高く速く飛ぶ曲芸に感心している場面なので exciting が最も近い。'
      },
      {
        q: 'In the passage, the word they refers to',
        choices: [
          'the trips',
          'everyone',
          'Broadway shows',
          'the sixth-graders'
        ],
        answer: 3,
        explanation: '最後の段落の「We hope they get to see The Phantom of the Opera」の they は、直前の文の「the sixth-graders（来年行く6年生）」を指す。'
      },
      {
        q: 'According to the article, what will the sixth-grade students do next year?',
        choices: [
          'They will go to a show in New York',
          'They will go to see The Phantom of the Opera.',
          'They will go to the New York Opera House.',
          'They will go to New York and watch acrobats.'
        ],
        answer: 0,
        explanation: '最終段落に「Next year, the sixth-graders will be going to New York to see a Broadway show」とある。決まっているのは「ニューヨークでショーを見る」ことで、演目までは決まっていない。'
      }
    ]
  },
  {
    id: 'r61',
    title: '北極海のイッカク',
    level: 3,
    topic: '生物',
    words: 237,
    passage:
      'Narwhals are a kind of whale that not many people have ever seen. That\'s because they live in the coldest waters on Earth, the Arctic Ocean. This sea water is so cold that much of it has turned into ice. Narwhals eat fish that live on the ocean floor and can dive 1,500 meters to find their prey. It\'s very cold down there, but the narwhal\'s body is built to withstand extremely cold temperatures.' + '\n' +
      'Narwhals are smaller than other whales but they are still large. They can weigh up to 1,600 kilograms and are 4 to 5 meters long. They are usually white and black colored. As they get older, their skin gets lighter. Narwhals have something very special. Each narwhal has a tusk that grows straight out into a spear. These tusks can be over 2 meters long. These long, sharp tusks make the narwhal look much longer than it is.' + '\n' +
      'Narwhals have been used as food by people for a long time. For native people in the Far North called Inuits, they are a good source of fat during the cold winters. Inuit people used to hunt them with spears from small boats. Now, they have a different way of hunting them. Many use modern motorboats to chase them and rifles to kill them. When a narwhal is caught, the entire whale including its tusk is used. The narwhal\'s tusk is a very valuable possession.',
    glossary: [
      { w: 'tusk', m: '牙' },
      { w: 'prey', m: '獲物' },
      { w: 'withstand', m: '耐える' }
    ],
    questions: [
      {
        q: 'What is the main topic of the passage?',
        choices: [
          'Life in the Arctic Ocean',
          'Ancient Inuits\' hunting habits',
          'Value of narwhal whales\' tusks',
          'The narwhal whale in the Arctic Ocean'
        ],
        answer: 3,
        explanation: '生息地・体の特徴・牙・人との関わりと、イッカクという鯨そのものを幅広く説明した文章。北極海の生活全般やイヌイットの狩りは話題の一部にすぎない。'
      },
      {
        q: 'According to the passage, what do narwhal whales eat?',
        choices: [
          'Plants that grow near the ice',
          'Animals living on polar ice caps',
          'Organisms that are good at diving',
          'Animals that live on the bottom of the sea'
        ],
        answer: 3,
        explanation: '第1段落に「Narwhals eat fish that live on the ocean floor（海底にすむ魚を食べる）」とある。海の底にすむ動物を食べるが正解。'
      },
      {
        q: 'In the passage, the word it refers to',
        choices: [
          'the cold',
          'the polar area',
          'the sea water',
          'the narwhal'
        ],
        answer: 2,
        explanation: '「This sea water is so cold that much of it has turned into ice」の it は直前の the sea water（海水）を指す。海水が凍って氷になる、という文。'
      },
      {
        q: 'In the passage, the word native is closest in meaning to',
        choices: [
          'local',
          'expert',
          'foreign',
          'ancient'
        ],
        answer: 0,
        explanation: 'native people は「その土地に元から住む人々」。Far North に住むイヌイットを指しているので local（土地の）が最も近い。'
      },
      {
        q: 'What do narwhals NOT look like?',
        choices: [
          'Whales with long spears',
          'Animals with white and black skin',
          'Dolphins with long sword-like tails',
          'Sea mammals with very heavy bodies'
        ],
        answer: 2,
        explanation: 'イッカクは槍のような長い牙を持ち、白黒の体色で、体重1,600kgにもなると書かれている。「剣のような長い尾を持つイルカ」という記述はない。牙であって尾ではない。'
      },
      {
        q: 'Why are "Inuits" mentioned in the passage?',
        choices: [
          'To show who use narwhals as food',
          'To explain how they like to use the narwhal tusks',
          'To give an example of people who worship the narwhal',
          'To prove they were the first people to write about narwhals'
        ],
        answer: 0,
        explanation: '第3段落の冒頭で「Narwhals have been used as food by people for a long time. For native people ... called Inuits, they are a good source of fat」とあり、イッカクを食料にする人々の例としてイヌイットが挙げられている。'
      },
      {
        q: 'In the passage, the word chase is closest in meaning to',
        choices: [
          'call',
          'cheat',
          'follow',
          'protect'
        ],
        answer: 2,
        explanation: 'chase は「追いかける」。モーターボートでイッカクを追う場面なので follow が最も近い。'
      },
      {
        q: 'What can be inferred about the narwhal\'s tusk?',
        choices: [
          'It is very heavy.',
          'It has special powers.',
          'It is worth a lot of money.',
          'People do not like to keep them.'
        ],
        answer: 2,
        explanation: '最後の文に「The narwhal\'s tusk is a very valuable possession（牙はとても価値のある持ち物）」とある。ここから牙が高値で取引される、つまりお金になると推測できる。'
      }
    ]
  },
  {
    id: 'r62',
    title: '野獣にされた王子',
    level: 3,
    topic: '文化',
    words: 288,
    passage:
      'Once upon a time, there was a young prince. He was very handsome but also very unkind. He was so mean that a witch turned him into a beast. She said, "You will look like a terrible beast as punishment for your unkindness. If you can\'t find true love by your 30th birthday, you will stay a beast forever!"' + '\n' +
      'Many years went by. One cold winter night, the prince heard someone come into his castle. He rushed down the stairs to find a beautiful girl in the hallway. He decided to keep her prisoner. She begged the beast to let her return home. Feeling bad for the girl, he allowed her to walk around the castle, but he did not allow her to go home. Soon, the beast found himself doing kind things for the girl. He was in love with her. But the girl did not love him back. She thought he was cruel for keeping her prisoner. She missed her family and friends. He knew it, but he did not want to let her go. Only a month before his 30th birthday, the beast set her free. He could not see the girl sad any longer. The girl returned home, but she began to miss the beast. She decided to visit him for his birthday.' + '\n' +
      'When she arrived, she was shocked to see the beast becoming more animal-like. Knowing nothing of the curse, she did not know what was happening to him. She ran to him and told him, "I missed you! I love you! What is happening?" She held the beast in her arms and gave him a kiss. At that very moment, the curse was lifted. The beast turned back into a good-looking prince!',
    glossary: [
      { w: 'witch', m: '魔女' },
      { w: 'curse', m: '呪い' },
      { w: 'prisoner', m: '囚人、とらわれた人' }
    ],
    questions: [
      {
        q: 'What is the best title for the story?',
        choices: [
          'A Beast Finds True Love',
          'The Prince Meets the Witch',
          'The Beast Holds a Big Birthday Party',
          'The Girl Marries the Handsome Prince'
        ],
        answer: 0,
        explanation: '呪いで野獣にされた王子が真実の愛を見つけて元に戻る物語。全体をまとめる題名は「野獣、真実の愛を見つける」がふさわしい。'
      },
      {
        q: 'When will the prince\'s curse end?',
        choices: [
          'When he finds true love',
          'When he learns to be kind',
          'When he turns 29 years old',
          'When he turns 30 years old'
        ],
        answer: 0,
        explanation: '魔女のせりふに「If you can\'t find true love by your 30th birthday, you will stay a beast forever!」とある。呪いが解ける条件は真実の愛を見つけること。'
      },
      {
        q: 'Why was the prince turned into a beast?',
        choices: [
          'He scared the girl.',
          'He put the girl in jail.',
          'He had a greedy nature.',
          'He was unfriendly and mean.'
        ],
        answer: 3,
        explanation: '第1段落に「He was so mean that a witch turned him into a beast（あまりに意地悪だったので魔女が野獣に変えた）」とある。理由は不親切で意地悪だったこと。'
      }
    ]
  },
  {
    id: 'r63',
    title: 'ヨーロッパで一番好きな国',
    level: 3,
    topic: '文化',
    words: 196,
    passage:
      'This summer I traveled around Europe with my family. I liked most of the countries we visited, but I think France is the best country in Europe because of the language, the tourist sites, and the food.' + '\n' +
      'The French language is not hard to learn because it is like English. It was easy for me to learn important phrases. French is a popular language worldwide. I can use the French I learned in forty-five different countries. Also, it sounds beautiful! France has some of the best and most popular tourist sites in the world. Some examples are Notre Dame, the Louvre Museum, and the Eiffel Tower. The Louvre is the home of the Mona Lisa, and the Eiffel Tower is the most visited monument in the world. Also, the food is wonderful! There are lots of tasty pastries and cheeses. All of the food is fresh and delicious. The very best part of eating in France was the desserts. Chocolate mousse and pain au chocolat are the best.' + '\n' +
      'If you get a chance to see one country in Europe, I think you should go to France so that you can experience all of these wonderful things!',
    glossary: [
      { w: 'monument', m: '記念建造物' },
      { w: 'phrase', m: '言い回し、フレーズ' },
      { w: 'dessert', m: 'デザート' }
    ],
    questions: [
      {
        q: 'What would be the best title for this essay?',
        choices: [
          'My Visit to Paris',
          'The Foods of France',
          'Learning to Speak French',
          'My Favorite European Country'
        ],
        answer: 3,
        explanation: '筆者は「France is the best country in Europe」と述べ、言語・観光地・食べ物の3つの理由を挙げている。エッセイ全体の題名は「私のお気に入りのヨーロッパの国」が最適。パリや食べ物だけの話ではない。'
      },
      {
        q: 'What does the author like best about French food?',
        choices: [
          'Desserts',
          'Big dinners',
          'Pastries and cheeses',
          'Desserts and pastries'
        ],
        answer: 0,
        explanation: '食べ物の段落に「The very best part of eating in France was the desserts（フランスの食事で一番よかったのはデザート）」とある。'
      },
      {
        q: 'Why does the author like the French language?',
        choices: [
          'It is easy to learn.',
          'It is pleasing to the ear.',
          'It is useful in many countries.',
          'All of the above'
        ],
        answer: 3,
        explanation: 'フランス語について「not hard to learn」「I can use the French I learned in forty-five different countries」「it sounds beautiful!」と3つとも述べているので、「上のすべて」が正解。'
      }
    ]
  },
  {
    id: 'r64',
    title: 'イヌはこうして家畜になった',
    level: 3,
    topic: '生物',
    words: 209,
    passage:
      'Many people have dogs for pets, but did you know that the dog was the first animal to be domesticated? That means it was the first animal to be kept and cared for by humans. Dogs have been kept as workers, hunters, and friends for much of human history. Dogs were originally gray wolves, but domestication gradually changed this. Humans have selectively bred dogs for traits that they believed were good. That\'s how many varieties of dogs came to exist today.' + '\n' +
      'Dogs come in many shapes and sizes. Dogs also have different kinds of coats. Some of them have long hair, while others have short. This hair can come in many different colors and patterns. Dogs also have different skills. Some varieties are good at hunting wild animals, while others are good at herding cattle or protecting people. Because dogs are closely related to wolves, it might seem like they would be violent. Although some dogs are violent, 15,000 years of domestication has made most dogs friendly to humans. Today\'s dogs are much easier to train than wild wolves. They respond well to human training: learning to sit, roll over, and even participate in dog shows. Training dogs is a practice that has been improved for many, many years.',
    glossary: [
      { w: 'domesticate', m: '家畜化する' },
      { w: 'breed', m: '繁殖させる、品種' },
      { w: 'trait', m: '特徴、形質' }
    ],
    questions: [
      {
        q: 'What is the passage mostly about?',
        choices: [
          'Training dogs',
          'Dogs\' shapes and sizes',
          'The domestication of dogs',
          'Similarities between dogs and wolves'
        ],
        answer: 2,
        explanation: 'イヌが最初に家畜化された動物であること、家畜化で狼から変化し多くの品種が生まれたことを説明する文章。主題はイヌの家畜化。'
      },
      {
        q: 'What is a major difference between a dog and a wolf?',
        choices: [
          'Wolves are bigger.',
          'Dogs are usually brown.',
          'Dogs are more easily trained.',
          'Wolves need to eat more food.'
        ],
        answer: 2,
        explanation: '後半に「Today\'s dogs are much easier to train than wild wolves（今のイヌは野生の狼よりずっと訓練しやすい）」とある。訓練のしやすさが大きな違い。'
      },
      {
        q: 'Why do so many different varieties of dogs exist?',
        choices: [
          'Dogs began working as hunters.',
          'Wolves naturally evolved into dogs.',
          'Many types of wolves started breeding.',
          'Humans developed their particular qualities.'
        ],
        answer: 3,
        explanation: '「Humans have selectively bred dogs for traits that they believed were good. That\'s how many varieties of dogs came to exist」とある。人間が良いと思う特徴を選んで繁殖させたから品種が増えた。'
      }
    ]
  },
  {
    id: 'r65',
    title: '万能の人レオナルド・ダ・ヴィンチ',
    level: 3,
    topic: '伝記',
    words: 241,
    passage:
      'Leonardo Da Vinci is one of the most famous historical figures of all time. He was born in 1452 in Florence, Italy. He is often described as the perfect "Renaissance Man," which means he was curious about a wide variety of things. It is not easy to put Da Vinci into a category. He was a painter, sculptor, astronomer, inventor, mathematician, writer, and more. Da Vinci, however, is perhaps most famous as a painter. He painted the Mona Lisa, which one of the most renowned paintings in the world. He also painted The Last Supper, which shows the last dinner of Jesus.' + '\n' +
      'As a scientist and inventor, Da Vinci designed and invented things that were not possible to create during the time that he lived. He made plans for helicopters, tanks, calculators, and solar-powered machines. He kept extensive notebooks in which he wrote in code. Historians have to hold the notebooks up to a mirror to be able to read them. Da Vinci also made many discoveries, but he was not interested in becoming famous for them. He didn\'t publish any of his ideas.' + '\n' +
      'Not much is known about Da Vinci\'s personal life or childhood. Da Vinci was careful to keep it secret. He never married and did not have any children, but had many friendships with various people. Today, Da Vinci is a legendary figure. He proves that one person can be talented at many things at the same time.',
    glossary: [
      { w: 'renowned', m: '名高い' },
      { w: 'extensive', m: '広範囲の、膨大な' },
      { w: 'figure', m: '人物' }
    ],
    questions: [
      {
        q: 'What would be the most suitable title for the passage?',
        choices: [
          'The Many Talents of Da Vinci',
          'Da Vinci as a Writer and Painter',
          'The Scientific Discoveries of Da Vinci',
          'Da Vinci\'s Personal Life and Childhood'
        ],
        answer: 0,
        explanation: '画家・彫刻家・発明家・数学者など多方面の才能を紹介し、最後も「one person can be talented at many things」と締めている。題名は「ダ・ヴィンチの多才ぶり」が最適。'
      },
      {
        q: 'According to the passage, what did Leonardo Da Vinci make plans for?',
        choices: [
          'Many scientific discoveries',
          'Books that he never published',
          'Helicopters and other machines',
          'Mirrors to use with his notebooks'
        ],
        answer: 2,
        explanation: '第2段落に「He made plans for helicopters, tanks, calculators, and solar-powered machines」とある。ヘリコプターなどの機械の設計図を作った。'
      },
      {
        q: 'Which of the following is true about Leonardo Da Vinci?',
        choices: [
          'He painted The Last Lunch.',
          'He married and had a family.',
          'He published many of his findings.',
          'He is most well-known as a painter.'
        ],
        answer: 3,
        explanation: '第1段落に「Da Vinci, however, is perhaps most famous as a painter（画家として最も有名）」とある。描いたのは The Last Supper（最後の晩餐）で、結婚せず、発見も発表しなかったので他の選択肢は本文と合わない。'
      }
    ]
  },
  {
    id: 'r66',
    title: '理科の課題、いつやる？',
    level: 3,
    topic: '手紙・メール',
    words: 148,
    passage:
      'Hey Sheri, We need to talk about our science project. It is due in two weeks but we have not even set a time to start it yet. I have Monday, Wednesday, and Thursday evenings available because I have piano lessons on Tuesdays and soccer practice on Fridays. You said Mondays and Wednesdays are OK for you, so let\'s work those days after school. After school on Monday, we can work in my room on our fireball project. We can work until almost 7:00 P.M. My family has dinner then. You should ask your mom to pick you up by 6:50. I bought all the materials we need. I need you to pay for your half on Monday. E-mail me back and tell me if this plan is OK with you. I think our classmates will be shocked to see us hold fire in our hands!' + '\n' +
      'Bye, Kim',
    glossary: [
      { w: 'due', m: '締め切りの' },
      { w: 'material', m: '材料' },
      { w: 'available', m: '都合がつく' }
    ],
    questions: [
      {
        q: 'What is this e-mail mainly about?',
        choices: [
          'Paying back Kim\'s money',
          'Choosing a science fair project',
          'Where to work on the science project',
          'Scheduling a time to work on the science project'
        ],
        answer: 3,
        explanation: 'メールの中心は「It is due in two weeks but we have not even set a time to start it yet」で、その後も曜日と時間の調整が続く。主題は理科の課題をやる日時を決めること。'
      },
      {
        q: 'Which of the following is NOT mentioned?',
        choices: [
          'Sheri plays soccer on Friday.',
          'Kim\'s family eats dinner at 7:00 P.M.',
          'The science project is due in two weeks.',
          'The girls haven\'t started the science project.'
        ],
        answer: 0,
        explanation: '金曜にサッカーの練習があるのは書き手の Kim 自身（I have piano lessons on Tuesdays and soccer practice on Fridays）。Sheri がサッカーをするとは書かれていない。'
      },
      {
        q: 'Kim mentions all of the following EXCEPT',
        choices: [
          'the girls working in Kim\'s room',
          'Sheri paying Kim for the supplies',
          'Kim\'s piano lessons and soccer practice',
          'the teacher\'s opinion on the girls\' project'
        ],
        answer: 3,
        explanation: 'Kim は自分の部屋で作業すること・材料代の半分の支払い・自分の習い事の予定には触れているが、先生が課題をどう思っているかは書いていない。'
      }
    ]
  },
  {
    id: 'r67',
    title: '月曜日の試験時間割',
    level: 3,
    topic: 'お知らせ',
    words: 146,
    passage:
      'This is Monday\'s exam schedule for students in grades 7-8. All grade 7 students will take their tests in the gym. All grade 8 students will take their tests in the cafeteria. Please make sure you go to the right place on time. Doors will be locked ten minutes after the times written below. Each exam is one hour long. All students will get a lunch break from 11:30 A.M. to 1:00 P.M. and a fifteen-minute rest between exams.' + '\n' +
      'Gymnasium (Grade 7) — Math: 9:00 A.M. / Science: 10:15 A.M. / English: 1:15 P.M. / History: 2:30 P.M.' + '\n' +
      'Cafeteria (Grade 8) — Math: 10:00 A.M. / Science: 1:15 P.M. / English: 2:30 P.M. / History: Tuesday Exam.' + '\n' +
      'Note: If a student cannot make it to an exam for emergency reasons, please bring a letter to the school office. All missed exams will be taken on Wednesday.',
    glossary: [
      { w: 'grade', m: '学年' },
      { w: 'emergency', m: '緊急事態' },
      { w: 'locked', m: '施錠された' }
    ],
    questions: [
      {
        q: 'What is this announcement mainly about?',
        choices: [
          'Monday\'s exam schedule for all students',
          'Monday\'s exam schedule for the eighth-grade students',
          'Monday\'s exam schedule for the seventh-grade students',
          'Monday\'s exam schedule for the seventh-and eighth-grade students'
        ],
        answer: 3,
        explanation: '冒頭に「This is Monday\'s exam schedule for students in grades 7-8」とあり、7年生と8年生の両方の試験時間割を知らせるお知らせ。'
      },
      {
        q: 'The seventh-grade students have an exam at all times EXCEPT',
        choices: [
          '9:00 A.M.',
          '2:30 P.M.',
          '1:15 P.M.',
          '10:00 A.M.'
        ],
        answer: 3,
        explanation: '7年生（Gymnasium）の試験は 9:00・10:15・1:15・2:30 に始まる。10:00 A.M. は8年生（Cafeteria）の数学の時間で、7年生の試験はない。'
      },
      {
        q: 'Which of the following is NOT true?',
        choices: [
          'Each exam is one hour long.',
          'The seventh-grade students take exams in the gym.',
          'Students get a fifteen-minute break between exams.',
          'The eighth-grade students have four exams on Monday.'
        ],
        answer: 3,
        explanation: '8年生の History は「Tuesday Exam」と書かれているので、月曜日の試験は3教科だけ。「8年生は月曜に4つ試験がある」は本文と合わない。'
      }
    ]
  },
  {
    id: 'r68',
    title: 'アメリカのサマーキャンプ',
    level: 3,
    topic: '文化',
    words: 220,
    passage:
      'Many American children spend part of their summer at summer camps. Some of these camps are day camps, but many are places where children stay overnight for one week or more. At some camps, the campers sleep in tents. At others, the campers sleep in cabins. Some camps are all boys or all girls, while some are co-ed. Some summer camps have themes. Children can attend a week of horseback riding, drama, or sports camp. The most common summer camps, however, are general camps on a lake.' + '\n' +
      'Americans believe that sending their children to summer camp will help them gain independence and make friends. At camp, they learn to swim, sail, canoe, and snorkel in the water. They also learn many sports and learn about surviving in nature. Some camps create organized events such as a color war. During a color war, the camp is divided into different colors. These different colored teams compete against each other in various events. It\'s usually very exciting for the campers and the staff.' + '\n' +
      'Children that have gone to camp repeatedly say that it was one of the best experiences of their lives. Even though some campers get homesick, they usually go to camp for more than one summer. Many return year after year and keep their camp friends for a very long time.',
    glossary: [
      { w: 'independence', m: '自立' },
      { w: 'co-ed', m: '男女共学の' },
      { w: 'homesick', m: 'ホームシックの' }
    ],
    questions: [
      {
        q: 'What is the passage mostly about?',
        choices: [
          'Sleeping in tents and cabins',
          'Making friends at American camps',
          'Overcoming homesickness at camp',
          'Summer camps in America'
        ],
        answer: 3,
        explanation: 'キャンプの種類・活動・子どもへの効果と、アメリカのサマーキャンプ全般を紹介する文章。テントや友だち作りはその一部。'
      },
      {
        q: 'According to the passage, which of the following is NOT true of American summer camps?',
        choices: [
          'They never have horseback riding.',
          'They have many different activities.',
          'They are good experiences for children.',
          'They can be attended for a week or more.'
        ],
        answer: 0,
        explanation: '第1段落に「Children can attend a week of horseback riding, drama, or sports camp」とあり、乗馬キャンプは実際にある。「乗馬は絶対にない」が本文と合わない選択肢。'
      },
      {
        q: 'The author mentions all of the following EXCEPT',
        choices: [
          'camps organizing color wars',
          'children learning water activities',
          'staff members teaching about hiking',
          'campers staying in tents and cabins'
        ],
        answer: 2,
        explanation: '色別対抗戦（color war）・水辺の活動（swim, sail, canoe, snorkel）・テントや小屋での宿泊は本文にあるが、スタッフがハイキングを教えるという記述はない。'
      }
    ]
  },
  {
    id: 'r69',
    title: 'ピアノの誕生',
    level: 3,
    topic: '文化',
    words: 243,
    passage:
      'The piano is one of the most popular instruments in the world. The modern piano was invented by Bartolomeo Cristofori. Cristofori worked as the keeper of instruments for Ferdinando de\'Medici, the Prince of Tuscany. It is unclear when he created the first piano, but the oldest Cristofori pianos that exist today are from the 1720s. Cristofori knew a lot about the clavichord and the harpsichord before he made the piano. The clavichord and the harpsichord were good instruments but were flawed. The clavichord was not loud enough to be used with an orchestra, while the harpsichord could not play very expressive notes. Cristofori invented the piano to have an instrument that was both loud and expressive. Cristofori\'s piano became famous because of a respected writer named Scipione Maffei. Maffei wrote an article about the piano with a diagram of it. Most people that would become piano builders found out about the piano from this article. Interestingly, Johann Sebastian Bach did not like the piano when he first heard it. He thought the high notes were not loud enough. Eventually, he came to like it. Wolfgang Mozart was one of the first musicians to use the piano. He composed much of his music on it. Still, the pianos in Mozart\'s time were different than they are now. Today, the piano is one of the most well-known instruments in the world. It is used in orchestras, musicals, and in many other popular forms of music.',
    glossary: [
      { w: 'instrument', m: '楽器' },
      { w: 'expressive', m: '表現力豊かな' },
      { w: 'flawed', m: '欠点のある' }
    ],
    questions: [
      {
        q: 'What is the best title for this passage?',
        choices: [
          'Mozart on the Piano',
          'The Piano\'s Beginning',
          'Cristofori\'s First Piano',
          'Pianos in the World Today'
        ],
        answer: 1,
        explanation: 'クリストフォリによる発明から普及までを語る文章なので、題名は「ピアノの始まり」が最適。モーツァルトや現代のピアノは話の一部にすぎない。'
      },
      {
        q: 'The author mentions all of the following EXCEPT',
        choices: [
          'the piano\'s loud and expressive sound',
          'Bach\'s opinion of the first piano he heard',
          'Cristofori\'s knowledge of the harpsichord',
          'Scipione Maffei\'s friendship with Cristofori'
        ],
        answer: 3,
        explanation: '音量と表現力・バッハの感想・クラヴィコードとハープシコードの知識は本文にあるが、マッフェイとクリストフォリが友人だったという記述はない。マッフェイは記事を書いた人物として登場するだけ。'
      },
      {
        q: 'According to the passage, which of the following is NOT true of Cristofori?',
        choices: [
          'He was Greek.',
          'He invented the piano.',
          'He worked for the Prince of Tuscany.',
          'He was known as the keeper of instruments.'
        ],
        answer: 0,
        explanation: 'クリストフォリは「the keeper of instruments for Ferdinando de\'Medici, the Prince of Tuscany」としてイタリアで働いた人物。ギリシャ人だったという記述はない。'
      }
    ]
  },
  {
    id: 'r70',
    title: '8年生に新しい統一テスト',
    level: 3,
    topic: '学校生活',
    words: 183,
    passage:
      'Students across the country were disappointed and angry to learn that all eighth-grade students must now take a standardized test. A government official said the test will be used to see if children are ready for the challenges of high school, such as the bigger workloads and more difficult class topics. He also mentioned that any student who fails the test cannot move onto the next grade.' + '\n' +
      'Mr. Richards, the Briscoe Middle School principal, was quoted saying, "There will be a big problem if too many students fail." When asked why, Mr. Richards explained that there will not be enough class space for new eighth-grade students if too many old eighth-graders are held back. Briscoe Middle School does not have the space for extra students. The test will be given to all eighth-graders this coming May. It will be a three-hour test that focuses on math, science, history, reading, and writing. Teachers and students are concerned that the test was written for too many students at too many different schools. With each school having a different curriculum, some schools may have an advantage.',
    glossary: [
      { w: 'standardized test', m: '統一テスト' },
      { w: 'workload', m: '作業量、学習量' },
      { w: 'curriculum', m: '教育課程' }
    ],
    questions: [
      {
        q: 'What would be the best headline for this article?',
        choices: [
          'Students Fail New Test',
          'Official Explains New Test',
          'New Test Unwelcome in Schools',
          'Test to Judge Middle School Readiness'
        ],
        answer: 2,
        explanation: '冒頭の「Students ... were disappointed and angry」から、記事全体が新テストへの不満と心配を伝えている。見出しは「新テスト、学校で不評」が最適。'
      },
      {
        q: 'In the passage, the word disappointed is closest in meaning to',
        choices: [
          'delighted',
          'satisfied',
          'saddened',
          'overjoyed'
        ],
        answer: 2,
        explanation: 'disappointed は「がっかりした」。saddened（悲しんだ）が最も近い。delighted や overjoyed は逆の意味。'
      },
      {
        q: 'The phrase held back in the passage is closest in meaning to',
        choices: [
          'passed',
          'hugged',
          'stopped',
          'kicked out'
        ],
        answer: 2,
        explanation: 'held back は「進級させられず留め置かれる」こと。落第して止められるという意味なので stopped が最も近い。'
      }
    ]
  },
  {
    id: 'r71',
    title: 'クリスマスの朝のサプライズ',
    level: 3,
    topic: '日常生活',
    words: 173,
    passage:
      'Every year, on the 1st of November, my mother asks me what I want for Christmas. This year I told her, "I want the new Rendla video game." Rendla, The Adventure Through Time was the game of the year. Everyone wanted it. I waited patiently for Christmas to arrive. Bright and early Christmas morning I went straight to the tree to open all my presents. I opened everything but my video game was not there. I was really sad. It was the only thing I really wanted.' + '\n' +
      'I tried to put on a brave face and thank my family for all my other great presents, but they knew I was disappointed. I thought I was going to cry. I ran up to my room so no one would see the tears in my eyes.' + '\n' +
      'To my surprise, there was a gift sitting on my bed. I tore the wrapping paper off the tiny box. It was Rendla! I ran back downstairs and hugged my mom. I was the happiest boy in the world.',
    glossary: [
      { w: 'patiently', m: '辛抱強く' },
      { w: 'disappointed', m: 'がっかりした' },
      { w: 'wrapping paper', m: '包装紙' }
    ],
    questions: [
      {
        q: 'What is the main idea of this story?',
        choices: [
          'A boy wanting to get a video game',
          'A popular video game sold in stores',
          'A boy receiving a game he didn\'t want',
          'A Christmas dinner with a large family'
        ],
        answer: 0,
        explanation: 'ほしかったビデオゲームがツリーの下になくて落ち込み、最後に部屋で見つけて大喜びする話。主題は「ゲームをほしがる男の子」。'
      },
      {
        q: 'In the passage, the phrase put on a brave face is closest in meaning to',
        choices: [
          'look sad',
          'pretend to be satisfied',
          'tell lies',
          'be frustrated with parents'
        ],
        answer: 1,
        explanation: 'put on a brave face は「平気なふりをする」。プレゼントに感謝しつつ本当はがっかりしている場面なので、「満足しているふりをする」が最も近い。'
      },
      {
        q: 'In the passage, the word tore is closest in meaning to',
        choices: [
          'joined',
          'applied',
          'ripped',
          'wrapped'
        ],
        answer: 2,
        explanation: 'tore は tear（破る）の過去形。包装紙をビリビリ破る場面なので ripped が正解。'
      }
    ]
  },
  {
    id: 'r72',
    title: 'Y2K問題とは何だったのか',
    level: 3,
    topic: '技術',
    words: 190,
    passage:
      'When computer programmers started making software systems, they programmed the years to be in two digits. For example, instead of using the year 1995, they shortened it to This didn\'t seem like a problem until the year 2000 began to come near. The year 1999, shortened to \'99, would become \'00 instead of 2000. Programmers worried that all computer systems would get confused and recognize \'00 as 1900. People were concerned that computer systems everywhere would crash. Bank information would be lost, the electricity would go out, and the world would lose much of its information. This problem was called "Y2K," short for "Year 2000." Some people gathered canned food and bottles of water in fear that many systems would stop working when 2000 came. In reality, only small errors occurred. Computer programmers worked hard before the year 2000 to make sure the problems were fixed. Still, at a horse racetrack in Delaware in the U.S.A., 150 gambling machines stopped working. In Japan, an alarm went off at a nuclear power plant. Many web sites around the world showed errors. Instead of showing the date as 2000, they showed 19100.',
    glossary: [
      { w: 'digit', m: '桁、数字' },
      { w: 'crash', m: '（システムが）停止する' },
      { w: 'occur', m: '起こる' }
    ],
    questions: [
      {
        q: 'What is the best title for this passage?',
        choices: [
          'The Y2K Problem',
          'Collecting Food in 1999',
          'Two-Digit and Four-Digit Dates',
          'Computer Programmers, Our Heroes'
        ],
        answer: 0,
        explanation: '年号2桁問題の仕組み・人々の不安・実際に起きた小さな誤作動と、Y2K問題の全体を説明する文章。題名は「Y2K問題」が最適。'
      },
      {
        q: 'In the passage, the word crash is closest in meaning to',
        choices: [
          'hit',
          'close off',
          'restart',
          'break down'
        ],
        answer: 3,
        explanation: 'crash はコンピュータシステムが「動かなくなる」こと。break down（故障して止まる）が最も近い。'
      },
      {
        q: 'In the passage, the word gathered is closest in meaning to',
        choices: [
          'took',
          'found',
          'collected',
          'harvested'
        ],
        answer: 2,
        explanation: 'gathered は「集めた」。缶詰や水を蓄える場面なので collected が最も近い。'
      }
    ]
  },
  {
    id: 'r73',
    title: 'ミッキーマウスの歩み',
    level: 3,
    topic: '文化',
    words: 214,
    passage:
      'Mickey Mouse is one of the most popular cartoon characters in the world. Mickey was invented in 1928 by Walt Disney. His first public cartoon was called Steamboat Willie, which was seen by many audiences. Originally, Walt Disney himself did Mickey Mouse\'s vocal expressions such as whistling, laughing, or crying. Mickey did not actually speak until 1929. Interestingly enough, Mickey\'s first words were "Hot dogs! Hot dogs!" When Walt Disney began producing Mickey cartoons, there were hardly any animations in theaters. One of the reasons why Disney was much more successful than other animators was because of his use of sound. Most animation companies were creating silent animations. Walt Disney created a sound track to match the scenes in the cartoons, and this became very popular. Audiences began to see how much could be conveyed by a sound track. Throughout his existence, Mickey has undergone a few changes. For example, he didn\'t always have white gloves. His black hands were difficult to see against his black body, so animators dressed Mickey in white gloves. In 1940, Mickey was given pupils in his eyes. Later, he would lose his trademark red pants and start wearing different clothes. Today, Mickey Mouse is an icon for the Walt Disney Company and is known all over the world.',
    glossary: [
      { w: 'audience', m: '観客' },
      { w: 'convey', m: '伝える' },
      { w: 'trademark', m: 'トレードマーク' }
    ],
    questions: [
      {
        q: 'What is the passage mostly about?',
        choices: [
          'Walt Disney\'s animations',
          'Mickey Mouse\'s first words',
          'Mickey Mouse\'s life and history',
          'The trademark of Mickey Mouse'
        ],
        answer: 2,
        explanation: '誕生から声・音の工夫、手袋や目の変化、現在の地位まで、ミッキーマウスの歴史全体をたどる文章。最初の言葉やトレードマークは話の一部。'
      },
      {
        q: 'In the passage, the word conveyed is closest in meaning to',
        choices: [
          'loved',
          'carried',
          'touched',
          'mimicked'
        ],
        answer: 1,
        explanation: 'conveyed は「伝えられた」。サウンドトラックでどれだけ多くのことが伝えられるかという文脈なので carried が最も近い。'
      },
      {
        q: 'In the passage, the word undergone is closest in meaning to',
        choices: [
          'achieved',
          'understood',
          'gone between',
          'gone through'
        ],
        answer: 3,
        explanation: 'undergone は undergo（経験する）の過去分詞。「いくつかの変化を経てきた」という文脈なので gone through が正解。'
      }
    ]
  },
  {
    id: 'r74',
    title: '新入生からの自己紹介の手紙',
    level: 3,
    topic: '手紙・メール',
    words: 124,
    passage:
      'Dear Mr. Williams, My name is Allen Clark and I will be a new student at your school next semester. I am going to be in your history class. I thought it would be a good idea to introduce myself. My family and I have just moved from Nebraska. My dad got a job in Burlington and he thinks it will be a good chance for us to try something new. Also, do you know what books the students read last year? I want to read them before I come to school in the fall. It would be great if you could send me a list. Thank you for your time. I look forward to taking your class in the fall. Sincerely, Allen Clark',
    glossary: [
      { w: 'semester', m: '学期' },
      { w: 'introduce', m: '紹介する' },
      { w: 'look forward to', m: '楽しみにする' }
    ],
    questions: [
      {
        q: 'What is this letter mainly about?',
        choices: [
          'A student who likes history',
          'A student introducing himself',
          'A student moving to a new city',
          'A student asking for a list of books'
        ],
        answer: 1,
        explanation: '「I thought it would be a good idea to introduce myself」とあるとおり、手紙の中心は新入生の自己紹介。本のリストのお願いは付け足しの用件。'
      },
      {
        q: 'In the passage, the word he refers to',
        choices: [
          'Nebraska',
          'Allen\'s father',
          'Allen Clark',
          'Mr. Williams'
        ],
        answer: 1,
        explanation: '「My dad got a job in Burlington and he thinks it will be a good chance」の he は直前の My dad、つまりアレンの父親を指す。'
      },
      {
        q: 'In the passage, the word them refers to',
        choices: [
          'the lists',
          'the schools',
          'the books',
          'the teachers'
        ],
        answer: 2,
        explanation: '「do you know what books the students read last year? I want to read them」の them は直前の the books（去年みんなが読んだ本）を指す。'
      }
    ]
  },
  {
    id: 'r75',
    title: 'ハワイで環境保護を手伝った2週間',
    level: 3,
    topic: '学校生活',
    words: 204,
    passage:
      'Eleven students at Middlebury Junior High School returned this week from their trip to Hawaii. The students spent two weeks helping an environmental agency with their work. This agency, Environmental Ocean Life, works to preserve and protect the plants and animals that live in Hawaii\'s waters. Every year, they test the water and check on the plants and animals to make sure they are doing well in their environments. The Middlebury students joined them for two weeks to help them with their water tests.' + '\n' +
      'The students reported that they had no idea how many different things could be tested. We learned a lot," said Justin Lim, a seventh-grade student. "We learned how to measure salinity, which is how much salt is in the water. Some plants and animals need certain levels of salinity to stay alive."' + '\n' +
      'The agency thanked the students for their help by giving them the gift of a surfing lesson. "I never thought I\'d be surfing in Hawaii," said Nancy Jones, another seventh-grade student. She was very grateful to Environmental Ocean Life. "Not only did they teach me and my classmates so much about the Pacific Ocean around Hawaii, but they also gave us a surfing lesson. They are so cool!"',
    glossary: [
      { w: 'preserve', m: '保護する' },
      { w: 'salinity', m: '塩分濃度' },
      { w: 'grateful', m: '感謝している' }
    ],
    questions: [
      {
        q: 'What would be the most suitable headline for the article?',
        choices: [
          'The Pacific Ocean\'s Effect on Students',
          'Middle School Students Helping in Hawaii',
          'Middlebury Junior High School Students Touring Hawaii',
          'Environmental Ocean Life Donating Surfing Lessons'
        ],
        answer: 1,
        explanation: '記事の中心は、中学生11人がハワイで環境団体の水質調査を2週間手伝ったこと。見出しは「中学生、ハワイで活動を手伝う」が最適。観光旅行ではない。'
      },
      {
        q: 'In the passage, the word they refers to',
        choices: [
          'Hawaii\'s waters',
          'Hawaiian people',
          'the environments',
          'the plants and animals'
        ],
        answer: 3,
        explanation: '「check on the plants and animals to make sure they are doing well」の they は直前の the plants and animals を指す。動植物が元気かどうかを確かめる、という文。'
      },
      {
        q: 'In the passage, the word she refers to',
        choices: [
          'a student',
          'the agency',
          'an animal',
          'Nancy Jones'
        ],
        answer: 3,
        explanation: '「She was very grateful to Environmental Ocean Life」の She は直前で発言した Nancy Jones を指す。'
      }
    ]
  },
  {
    id: 'r76',
    title: '地球温暖化のしくみと影響',
    level: 3,
    topic: '環境',
    words: 150,
    passage:
      'Global Warming is the idea that the world\'s temperature began to increase in the twentieth century and is continuing to increase. During the twentieth century, the global surface temperature went up by approximately 0.6 degrees Celsius. This may not seem like a lot, but this type of temperature rise is very unusual, considering Earth\'s history. Scientists believe that today\'s global warming is not caused by nature. Instead, it is humans who are causing it. Human activity is causing Earth\'s atmosphere to change. Carbon emissions from factories, livestock industry, airplanes, and automobiles are all threats to the ozone layer of the atmosphere.' + '\n' +
      'It may seem like fun to have a world without winter, but global warming may result in the melting of the polar ice caps and rising sea levels. This would destroy coastal towns and cities and wipe out a lot of animal species. This is not something anybody wants.',
    glossary: [
      { w: 'emission', m: '排出' },
      { w: 'atmosphere', m: '大気' },
      { w: 'wipe out', m: '絶滅させる' }
    ],
    questions: [
      {
        q: 'What would be the best title for the passage?',
        choices: [
          'Melting Polar Ice Caps',
          'Mere 0.6 Degrees Celsius',
          'Earth\'s Changing Atmosphere',
          'The Globe\'s Temperature Increase'
        ],
        answer: 3,
        explanation: '気温上昇という現象の定義から原因・影響までを説明する文章。題名は「地球の気温上昇」が最適。氷や大気の話は説明の一部。'
      },
      {
        q: 'In the passage, the word This refers to',
        choices: [
          'Earth\'s history',
          'Global Warming',
          '0.6 degrees Celsius',
          'the twentieth century'
        ],
        answer: 2,
        explanation: '「This may not seem like a lot」の This は直前の文の「0.6 degrees Celsius の上昇」を指す。大したことがないように見えるのはこの数字。'
      },
      {
        q: 'In the passage, the word it refers to',
        choices: [
          'today',
          'the problem',
          'human activity',
          'global warming'
        ],
        answer: 3,
        explanation: '「Instead, it is humans who are causing it」の文末の it は、前の文から話題になっている global warming（今の温暖化）を指す。'
      }
    ]
  },
  {
    id: 'r77',
    title: '南北戦争が始まった場所',
    level: 3,
    topic: '歴史',
    words: 213,
    passage:
      'The Battle of Fort Sumter was the first battle in the American Civil War. Fort Sumter was an army fort off the coast of Charleston, South Carolina. After South Carolina and other six Southern states seceded from the Union, they prevented the Northern soldiers at the fort from getting supplies.' + '\n' +
      'Abraham Lincoln told the governor of South Carolina that he would be sending supplies to Fort Sumter. The governor responded by saying that the Northern soldiers needed to leave the fort immediately, but Lincoln refused to give up. On April 12, 1861, the Southern soldiers began to shoot cannons at the fort, forcing the Northern army to withdraw. No one on either side was killed, but this was the first battle of the Civil War. After the attack on Fort Sumter, Americans from both the North and South wanted further military action. For the rest of the war, the South would control Fort Sumter and the Charleston Harbor. This gave them an advantage. Although the Battle of Fort Sumter was a small battle, it was the first in one of the biggest wars in America\'s history. Neither the North nor South expected the war to last as long as it did. It raged on for four years. It all started at Fort Sumter.',
    glossary: [
      { w: 'secede', m: '脱退する' },
      { w: 'withdraw', m: '撤退する' },
      { w: 'rage on', m: '（戦争が）荒れ狂う、続く' }
    ],
    questions: [
      {
        q: 'What is this passage mainly about?',
        choices: [
          'The main battles of the Civil War',
          'The South\'s control of the Charleston Harbor',
          'Abraham Lincoln\'s decision not to give up',
          'The significance of the Battle of Fort Sumter'
        ],
        answer: 3,
        explanation: '小さな戦闘だったが「it was the first in one of the biggest wars in America\'s history」と締めくくられており、サムター要塞の戦いの歴史的な意味が主題。'
      },
      {
        q: 'In the passage, the word they refers to',
        choices: [
          'the Union and its soldiers',
          'the country and its people',
          'American soldiers and supplies from Lincoln',
          'South Carolina and other six Southern states'
        ],
        answer: 3,
        explanation: '「After South Carolina and other six Southern states seceded ..., they prevented ...」の they は直前の「サウスカロライナと他の南部6州」を指す。'
      },
      {
        q: 'In the passage, the word he refers to',
        choices: [
          'a soldier',
          'South Carolina',
          'Abraham Lincoln',
          'South Carolina\'s governor'
        ],
        answer: 2,
        explanation: '「Abraham Lincoln told the governor ... that he would be sending supplies」の he は文の主語リンカーンを指す。物資を送ると言ったのはリンカーン。'
      }
    ]
  },
  {
    id: 'r78',
    title: '竜巻はどこで生まれるか',
    level: 3,
    topic: '理科',
    words: 203,
    passage:
      'Tornadoes are giant rotating columns of air. They form in thunderstorms when there is a great difference in the temperature and humidity of the lower and upper atmosphere. They can be very dangerous and very destructive.' + '\n' +
      'There are different varieties of tornadoes. They can be very big or small. Some tornadoes are only a few feet across and others can travel across an entire state. Tornadoes stretch from the ground high into the sky. Usually, people rate them from FO to F5, F5 being the most dangerous with wind speeds of around 261-318 miles per hour. They are a very violent force of nature and can lay whole towns completely flat.' + '\n' +
      'Tornadoes can happen all over the world but a lot of them happen in the central United States in a region called Tornado Alley. Tornado Alley is made up of the low, flat states of the central United States between the Rocky Mountains and the Appalachian Mountains. Even though Tornado Alley is the most common place for tornadoes, the deadliest recorded tornado was in Bangladesh in 1989 and killed around 1,300 people. Recently, massive tornadoes destroyed large parts of Alabama in the United States, a state that does not usually have tornadoes.',
    glossary: [
      { w: 'rotate', m: '回転する' },
      { w: 'humidity', m: '湿度' },
      { w: 'destructive', m: '破壊的な' }
    ],
    questions: [
      {
        q: 'What is this passage mainly about?',
        choices: [
          'The worst recorded tornadoes',
          'How and where tornadoes happen',
          'Bad tornadoes in the United States',
          'The most destructive storms of nature'
        ],
        answer: 1,
        explanation: '竜巻のでき方（雷雨の中で発生）と起こる場所（Tornado Alley など）を説明する文章なので、「竜巻はどのように・どこで起こるか」が主題。'
      },
      {
        q: 'Where do most tornadoes happen?',
        choices: [
          'In Bangladesh',
          'Everywhere in the world',
          'In the central United States',
          'In the western United States'
        ],
        answer: 2,
        explanation: '第3段落に「a lot of them happen in the central United States in a region called Tornado Alley」とある。最も多いのはアメリカ中部。'
      },
      {
        q: 'What is NOT true about tornadoes?',
        choices: [
          'Most are very large.',
          'They come in many sizes.',
          'They can be very destructive.',
          'They can happen all over the world.'
        ],
        answer: 0,
        explanation: '「Some tornadoes are only a few feet across（数フィートしかないものもある）」とあり大きさは様々。「ほとんどが巨大」は本文と合わない。'
      },
      {
        q: 'In the passage, the word varieties is closest in meaning to',
        choices: [
          'sizes',
          'types',
          'regions',
          'powers'
        ],
        answer: 1,
        explanation: 'varieties は「種類」。「different varieties of tornadoes（いろいろな種類の竜巻）」という文脈なので types が正解。'
      },
      {
        q: 'In the passage, the word entire is closest in meaning to',
        choices: [
          'half',
          'part',
          'whole',
          'massive'
        ],
        answer: 2,
        explanation: 'entire は「全体の」。「travel across an entire state（州全体を横断する）」という文脈なので whole が最も近い。'
      },
      {
        q: 'In the passage, the word them refers to',
        choices: [
          'the people',
          'the tornadoes',
          'Tornado Alleys',
          'states of the USA'
        ],
        answer: 1,
        explanation: '「Usually, people rate them from F0 to F5」の them は前の文から話題の the tornadoes を指す。竜巻を F0〜F5 で格付けする、という文。'
      }
    ]
  },
  {
    id: 'r79',
    title: '階段から落ちた日の贈り物',
    level: 3,
    topic: '日常生活',
    words: 341,
    passage:
      'The day started like any other day. I woke up at six-thirty and went into the bathroom to take a shower and get ready for school. "Are you up yet, Jacob?" I heard my mom yell from downstairs.' + '\n' +
      '"Yes, I am. Is breakfast ready?" I yelled back.' + '\n' +
      '"Come down when you are ready," she said and then she laughed. I wondered what was funny but didn\'t think about it very much. I finished brushing my teeth and packed my bag for school. I had a presentation in history, so I had some extra things to bring. I started walking down the stairs to the kitchen when I heard a strange whining noise. Then I decided to jump down the last five stairs but I didn\'t hop quite far enough. My foot got caught and I fell face-first with a loud bang. "Jacob! What happened?" My mom said as she found me motionless on the floor. Blood was pouring from my nose and my arm was aching. I couldn\'t move it, so my mom helped me up and took me out to the car.' + '\n' +
      'Two hours later I left the hospital. My nose was fine but there was a cast on my arm. The pain had gone away, but I was very upset that I would have to miss presenting my history project. I had worked for weeks on it and was really looking forward to it. "It\'s okay, honey." My mom said, knowing what was on my mind. "I am sure Mr. Anderson will let you present your project next week. Besides, I think I have something at home that will make you feel better."' + '\n' +
      'Then I remembered the noise that I had heard just before jumping down the stairs. When I got home, there was a new puppy waiting for me in the kitchen, along with my cold breakfast. I was really hungry, so I ate my breakfast. My mom let me share some of it with my new friend. It turned out to be a good day after all.',
    glossary: [
      { w: 'whining', m: 'クンクン鳴く声' },
      { w: 'motionless', m: '動かない' },
      { w: 'cast', m: 'ギプス' }
    ],
    questions: [
      {
        q: 'What would be the best title for this story?',
        choices: [
          'A Surprise for Jacob',
          'Jacob\'s Kind Mother',
          'Broken Arms and Legs',
          'Jacob\'s Missing Project'
        ],
        answer: 0,
        explanation: '腕を折った散々な一日の最後に子犬のサプライズが待っていた話。題名は「ジェイコブへのサプライズ」が最適。'
      },
      {
        q: 'What did Jacob NOT do in the morning before falling?',
        choices: [
          'Take a shower',
          'Brush his teeth',
          'Pack his bag for school',
          'Eat the breakfast his mom made'
        ],
        answer: 3,
        explanation: '落ちる前にしたのはシャワー・歯みがき・かばんの準備。朝食は病院から帰った後に食べたので、「落ちる前に朝食を食べた」が該当しない行動。'
      },
      {
        q: 'What body part did Jacob hurt in his fall?',
        choices: [
          'His arm',
          'His legs',
          'His back and arm',
          'His nose and teeth'
        ],
        answer: 0,
        explanation: '病院を出たとき「there was a cast on my arm（腕にギプス）」とあり、「My nose was fine」なので鼻は無事。けがをしたのは腕。'
      },
      {
        q: 'In the passage, the word whining is closest in meaning to',
        choices: [
          'loud',
          'angry',
          'crying',
          'yelling'
        ],
        answer: 2,
        explanation: 'whining は子犬の「クンクンという鳴き声」。crying が最も近い。最後に子犬が登場することからも鳴き声だと分かる。'
      },
      {
        q: 'In the passage, the word motionless is closest in meaning to',
        choices: [
          'still',
          'awake',
          'shocked',
          'terrified'
        ],
        answer: 0,
        explanation: 'motionless は「動かない」。床に倒れて動けない場面なので still（じっとした）が正解。'
      },
      {
        q: 'In the passage, the word it refers to',
        choices: [
          'day',
          'puppy',
          'breakfast',
          'new friend'
        ],
        answer: 2,
        explanation: '「I ate my breakfast. My mom let me share some of it with my new friend」の it は直前の my breakfast を指す。朝食を子犬に分けてあげた、という文。'
      }
    ]
  },
  {
    id: 'r80',
    title: 'サファリからの手紙',
    level: 3,
    topic: '手紙・メール',
    words: 248,
    passage:
      'Dear Class, I am writing to tell you about the African safari that I\'m on. I promised I\'d send you an update as soon as I had the time. You should know that I was touched by how interested you were in my trip. After spending some time here, I think you should come on a safari if you have the chance. There are many volunteer projects in Africa that need helpers. I encourage you to get involved.' + '\n' +
      'I know you were most interested in African animals. On the safari, I\'ve been able to see lions, giraffes, zebras, gazelles, as well as many other animals. My favorite was the giraffes. Did you know that they have blue-black tongues? I didn\'t! They\'re incredibly long - about eighteen inches! Giraffes use these long tongues to eat leaves from acacia trees with sharp thorns. As for the lions, it was incredible to see them in the wild. The male\'s mane was quite impressive.' + '\n' +
      'Anyway, I hope you\'re behaving yourself for your substitute teacher, Mr. Wilson. The school was kind enough to give me these two weeks off to participate in this project. So I hope you are showing that you can behave and study hard without me. I\'ll be back to school on Monday the 11th, so I\'ve sent this letter express mail. I hope it reaches you before I get back. When I return, I\'ll show you all of the photos that I\'ve taken. I\'ll see you soon. Mrs. Lee',
    glossary: [
      { w: 'safari', m: 'サファリ（野生動物を見る旅）' },
      { w: 'thorn', m: 'とげ' },
      { w: 'substitute teacher', m: '代理の先生' }
    ],
    questions: [
      {
        q: 'What is the letter mostly about?',
        choices: [
          'Students volunteering in Africa',
          'Sending letters via express mail',
          'The safari experience of a teacher',
          'Surprising information about giraffes'
        ],
        answer: 2,
        explanation: '先生がアフリカのサファリでの体験（見た動物・キリンの舌・ボランティア）をクラスに報告する手紙。主題は先生のサファリ体験。'
      },
      {
        q: 'What is suggested about the giraffe\'s tongues?',
        choices: [
          'They are longer in the male giraffes.',
          'If they\'re not blue-black, they\'re brown.',
          'They are blue-black because of what they eat.',
          'They are good for eating leaves on thorny trees.'
        ],
        answer: 3,
        explanation: '「Giraffes use these long tongues to eat leaves from acacia trees with sharp thorns」とある。長い舌はとげのある木から葉を食べるのに役立つ。'
      },
      {
        q: 'What does Mrs. Lee imply about the student\'s behavior?',
        choices: [
          'Mr. Wilson doesn\'t tolerate bad behavior.',
          'She is worried that the students will behave badly.',
          'The students won\'t be able to volunteer if they behave badly.',
          'The students will be rewarded by Mr. Wilson if they behave well.'
        ],
        answer: 1,
        explanation: '「I hope you\'re behaving yourself」「I hope you are showing that you can behave and study hard without me」と繰り返しており、先生は生徒たちが行儀よくできるか心配していると読み取れる。'
      }
    ]
  },
  {
    id: 'r81',
    title: 'クラスのペットを決める投票',
    level: 3,
    topic: '学校生活',
    words: 220,
    passage:
      'Mrs. Jones had a tradition. At the end of the first day of school, Mrs. Jones always asked the children to vote on which animal would live in their class for the year. Then she would go to the local pet store and buy a class pet. The children loved the class pets. At the end of the day, if the students did all their work, the class got to play with it. It was exciting for the students to watch Perry the bird fly around or to see Timmy the turtle dive in the classroom sink.' + '\n' +
      'Now, it was my class\'s turn to choose. Mrs. Jones asked each student what pet they\'d like. After everyone chose, the most popular choices were a rabbit, a lizard, or a dog. Mrs. Jones had to say, "Students, we cannot have a dog. We cannot walk him at night." The vote was between a lizard and a rabbit. The boys cried, "Rabbits are boring!" while the girls shouted "Lizards are ugly!" Mrs. Jones hushed the class. "It\'s time to vote. Let the best pet win." She asked the class to raise their hands to vote. "Who wants a rabbit?" Ten hands rose. Next she asked, "Who wants a lizard?" Eleven students lifted their hands. "I guess we have a winner," announced Mrs. Jones.',
    glossary: [
      { w: 'tradition', m: '伝統、恒例行事' },
      { w: 'vote', m: '投票する' },
      { w: 'hush', m: '静かにさせる' }
    ],
    questions: [
      {
        q: 'What would be the best title for this story?',
        choices: [
          'The Big Pet Decision',
          'A New Year at School',
          'Buck the Class Bunny',
          'Timmy the Turtle Returns'
        ],
        answer: 0,
        explanation: 'クラスで飼うペットを投票で決める話なので、題名は「ペットの大決定」が最適。バニーやカメの話は出てくるが中心ではない。'
      },
      {
        q: 'What can be inferred about the students in the class?',
        choices: [
          'The class is all boys.',
          'There are more girls.',
          'There are more boys.',
          'There are the same number of boys and girls.'
        ],
        answer: 2,
        explanation: '男子は「Rabbits are boring!（ウサギ派はいや）」つまりトカゲ派、女子は「Lizards are ugly!」つまりウサギ派。ウサギ10票・トカゲ11票でトカゲが勝ったので、男子の方が多いと推測できる。'
      },
      {
        q: 'What is likely true about this year\'s class pet?',
        choices: [
          'It is a dog.',
          'It is a rabbit.',
          'It is a turtle.',
          'It is a lizard.'
        ],
        answer: 3,
        explanation: '投票の結果はウサギ10票・トカゲ11票で「I guess we have a winner」。今年のペットはトカゲだと分かる。'
      }
    ]
  },
  {
    id: 'r82',
    title: 'ドラキュラのモデルになった男',
    level: 3,
    topic: '歴史',
    words: 203,
    passage:
      'Dracula, the legendary vampire, was inspired by a real man, Vlad III Dracula. Over six hundred years ago, Dracula ruled Romania. He became famous throughout Europe for his cruelty.' + '\n' +
      'The first thing he did when he became ruler of Romania was to destroy his enemies, the nobles called Boyars. Dracula killed the older Boyars and made the younger and fitter Boyars build him a castle. He forced them to work until they died. Dracula was equally cruel to people who broke the law. Lawbreakers would be killed or tortured in the worst ways. Those who angered Dracula were thrown onto wood spikes. He left their bodies on the spikes outside his castle to warn people to behave. Many people believed he liked killing and hurting people. They also believed he drank the blood of his victims. The rumors of Dracula drinking blood and killing so many people gave Bram Stoker, an Irish novelist, an idea for a story about an evil, blood-drinking monster.' + '\n' +
      'He wrote and published a book with the title of Dracula in 1897. After the book, many more vampire stories in which Dracula appears were written. In modern vampire fiction, one can always find aspects of Bram Stoker\'s original story.',
    glossary: [
      { w: 'cruelty', m: '残酷さ' },
      { w: 'torture', m: '拷問する' },
      { w: 'rumor', m: 'うわさ' }
    ],
    questions: [
      {
        q: 'Which title best summarizes the main idea of the passage?',
        choices: [
          'The Origins of Dracula',
          'The History of the Boyars',
          'The Novel Dracula by Bram Stoker',
          'The Life of Vlad III Dracula, the Vampire'
        ],
        answer: 0,
        explanation: '実在のヴラド3世から小説、そして現代の吸血鬼小説へとつながる「ドラキュラの起源」を語る文章。ヴラド3世の生涯やボヤールの歴史だけの話ではない。'
      },
      {
        q: 'What can you infer about Vlad III Dracula from the passage?',
        choices: [
          'He was feared.',
          'He was a great leader.',
          'He was nice to his family.',
          'He was loved by his people.'
        ],
        answer: 0,
        explanation: '法を破った者を処刑し、死体を城の外にさらして「人々に行いを慎むよう警告した」とある。ここから、ヴラド3世は恐れられていたと推測できる。'
      },
      {
        q: 'What does the author imply about vampire fiction today?',
        choices: [
          'It is related to Bram Stoker.',
          'It is based on the life of Vlad III Dracula.',
          'It is very popular among modern writers.',
          'It is often influenced by Bram Stoker\'s Dracula.'
        ],
        answer: 3,
        explanation: '最後に「In modern vampire fiction, one can always find aspects of Bram Stoker\'s original story」とある。今日の吸血鬼小説はストーカーの『ドラキュラ』の影響を受けている。'
      }
    ]
  },
  {
    id: 'r83',
    title: 'アメリカ国歌の意外な生まれ',
    level: 3,
    topic: '歴史',
    words: 231,
    passage:
      'The Star-Spangled Banner is the United States of America\'s national anthem. The lyrics to this song were written by Francis Scott Key, American lawyer and poet. When Key wrote the lyrics, he did not expect them to become a song. Instead, the lyrics were a part of a poem he wrote called Defence of Fort McHenry. The poem was about the War of 1812. Key saw British ships bombing Fort McHenry and was inspired to write the poem. Oddly enough, the words written by Francis Scott Key were paired with a popular British drinking song. At the time, this drinking song was widely known in America. Although Key\'s original poem was written in 1814, The Star-Spangled Banner did not become America\'s official anthem until 1931. Before that, it was recognized as an important song in the navy in 1889. It had been part of American patriotic music for a long time. Today, The Star-Spangled Banner is sung on many occasions. It technically has four verses, but only the first one is commonly sung. The song is known as being especially difficult to sing. It has a wide range from very low to very high notes. Now, the national anthem is played at all national sports games. This began in 1916 on President Woodrow Wilson\'s orders. It is amusing that The Star-Spangled Banner was not the official national anthem at that time.',
    glossary: [
      { w: 'anthem', m: '国歌、賛歌' },
      { w: 'lyrics', m: '歌詞' },
      { w: 'patriotic', m: '愛国的な' }
    ],
    questions: [
      {
        q: 'What is the best title for the passage?',
        choices: [
          'National Anthems in America',
          'Defence of Fort McHenry in 1814',
          'Francis Scott Key\'s American Anthem',
          'How the National Anthem Became Official'
        ],
        answer: 2,
        explanation: 'フランシス・スコット・キーの詩がどうやって国歌になったかを語る文章。題名は「フランシス・スコット・キーのアメリカ国歌」が最適。'
      },
      {
        q: 'What does the author imply about the lyrics being paired with a drinking song?',
        choices: [
          'It was written at a bar.',
          'It is a strange combination.',
          'It is appropriate in America.',
          'It wasn\'t written by young people.'
        ],
        answer: 1,
        explanation: '「Oddly enough（奇妙なことに）」と前置きして酒場の歌と組み合わされたことを紹介している。筆者はこれを不思議な組み合わせだと思っている。'
      },
      {
        q: 'What is suggested about The Star-Spangled Banner before 1931 when it became official?',
        choices: [
          'It was already very popular.',
          'It was only a drinking song.',
          'It wasn\'t known by many Americans.',
          'It was competing with many other songs for the title.'
        ],
        answer: 0,
        explanation: '1931年に公式となる前から「recognized as an important song in the navy in 1889」「part of American patriotic music for a long time」とあり、すでに広く親しまれていたことが分かる。'
      }
    ]
  },
  {
    id: 'r84',
    title: 'スーザンへの補習の提案',
    level: 3,
    topic: '手紙・メール',
    words: 142,
    passage:
      'Dear Susan, Mr. Andrews and I have come up with a plan to help you in your biology class. I know that you were very sick at the beginning of the semester. We want to help you catch up to the other students. It would be sad if you failed the upcoming exam. Mr. Andrews has agreed to give you extra help every Monday and Wednesday morning from 7:30 until 8:20. This tutoring will last for four weeks, ending at the time of the exams. With this extra help, Mr. Andrews and I hope that you\'ll be prepared for your biology exam. Please let me know by the end of the week if this plan works for you. If you are going to have trouble getting to school early, then please let us know. I\'m sure we can arrange something.' + '\n' +
      'Principal Stockton',
    glossary: [
      { w: 'catch up', m: '追いつく' },
      { w: 'tutoring', m: '個別指導' },
      { w: 'arrange', m: '手配する' }
    ],
    questions: [
      {
        q: 'What is the letter mainly about?',
        choices: [
          'Susan being sick',
          'An extra help plan for Susan',
          'The upcoming biology exam',
          'Principal Stockton\'s schedule'
        ],
        answer: 1,
        explanation: '「Mr. Andrews and I have come up with a plan to help you」とあり、手紙の中心は病気で遅れたスーザンのための補習プラン。'
      },
      {
        q: 'Why does Principal Stockton talk about failing the upcoming exam?',
        choices: [
          'To explain that exams are usually failed',
          'To prove that Susan is already prepared',
          'To suggest that Susan do her homework',
          'To show why extra help is being provided'
        ],
        answer: 3,
        explanation: '「It would be sad if you failed the upcoming exam」は、なぜ特別な補習を用意するのかという理由を示すために書かれている。'
      },
      {
        q: 'Why is Susan\'s having trouble getting to school early mentioned?',
        choices: [
          'To prove that Susan is a reliable student',
          'To explain that the school can change the plan if necessary',
          'To give an example of a reason that Mr. Andrews won\'t come',
          'To inform Susan that there won\'t be afternoon tutoring sessions'
        ],
        answer: 1,
        explanation: '「If you are going to have trouble getting to school early, then please let us know. I\'m sure we can arrange something」とある。都合が悪ければ計画を調整できると伝えるための一文。'
      }
    ]
  },
  {
    id: 'r85',
    title: 'アメリカを支えたハドソン川',
    level: 3,
    topic: '社会',
    words: 229,
    passage:
      'The Hudson River is one of the most significant rivers in America, though it is not the largest. It was named after Henry Hudson, an English explorer who charted the river for the Dutch East India Company. The Hudson goes for 315 miles, starting in the Adirondack Mountains in New York State. It enters the ocean around New York City. Washington Irving, an American writer, was one of the first to write about the Hudson River. He lived in the Hudson River Valley and wrote about the unique characteristics of this area. He developed the first kind of American folklore and told a story of a man named Rip Van Winkle. Rip Van Winkle fell asleep one day while climbing the mountains around the Hudson River. He did not wake up for twenty years. When he finally woke up, America had become a free country.' + '\n' +
      'The river has not only been written about by famous writers, but has had practical purposes as well. It was an important means of transportation as America developed. The Erie Canal was built to connect the river to Lake Erie, one of the nation\'s great lakes. This canal allowed the many cities on the Great Lakes to get goods from Europe. The Hudson River Valley area was also good for building railroads. All in all, the Hudson River is an important river in America.',
    glossary: [
      { w: 'significant', m: '重要な' },
      { w: 'folklore', m: '民間伝承' },
      { w: 'canal', m: '運河' }
    ],
    questions: [
      {
        q: 'What would be the best title for this passage?',
        choices: [
          'Washington Irving\'s River',
          'The Biggest River in America',
          'A River of American Importance',
          'Why Americans Built the Erie Canal'
        ],
        answer: 2,
        explanation: '文学と交通の両面から川の重要性を語り、「the Hudson River is an important river in America」と締めている。題名は「アメリカにとって大切な川」が最適。冒頭で「最大の川ではない」と明言している。'
      },
      {
        q: 'Why does the author mention "Washington Irving" in paragraph 2?',
        choices: [
          'To give an example of an American writer',
          'To prove that many writers live in New York',
          'To explain why Rip Van Winkle did not wake up',
          'To show that writers wrote about the Hudson River'
        ],
        answer: 3,
        explanation: 'アーヴィングは「one of the first to write about the Hudson River」として登場する。作家たちがこの川を題材にしたことを示す例。'
      },
      {
        q: 'Why does the author talk about "the Erie Canal" in paragraph 3?',
        choices: [
          'To point out the need to build a railroad',
          'To explain why writers liked the Hudson',
          'To prove that Americans were good builders',
          'To show how transportation was used on the river'
        ],
        answer: 3,
        explanation: 'エリー運河は「an important means of transportation」の説明の中で、五大湖の都市がヨーロッパの品物を手に入れられるようになった例として挙げられている。川が輸送に使われたことを示すため。'
      }
    ]
  },
  {
    id: 'r86',
    title: 'ベーブ・ルースの生涯',
    level: 3,
    topic: '伝記',
    words: 210,
    passage:
      'Babe Ruth is one of the greatest and the most popular American baseball players that ever lived. He was one of the first five players elected to the Baseball Hall of Fame. Though over sixty years have passed since his death, almost every kid in the U.S. today grows up knowing his name. He was born in 1895 as George Herman Ruth, Jr. in Maryland and grew up without a mother. At the age of seven, his father sent him to St. Mary\'s, a Catholic school where Babe Ruth lived for the next twelve years of his life. There he learned to play baseball but was isolated from his family. He started playing in the majors as a pitcher when he was only nineteen years old. He was very successful and before long he was traded to the Boston Red Sox. There he won a World Series in 1915 but fame as a hitter was still a long way off. In 1919, Babe Ruth was sold to the New York Yankees for 125,000 dollars cash and three 25,000 dollar notes. He then started to become the legend that everyone knows about today. By the end of his career, Babe Ruth had hit 714 home runs and had scored 2,213 runs.',
    glossary: [
      { w: 'elect', m: '選出する' },
      { w: 'isolated', m: '孤立した' },
      { w: 'legend', m: '伝説' }
    ],
    questions: [
      {
        q: 'What is the best title for the passage?',
        choices: [
          '714 Home Runs',
          'The Career of Babe Ruth',
          'The Life of Babe Ruth',
          'All-Time Best Baseball Players'
        ],
        answer: 2,
        explanation: '誕生から少年時代、選手としての活躍、通算成績までを語る文章なので、題名は「ベーブ・ルースの生涯」が最適。ホームラン記録や経歴は生涯の一部。'
      },
      {
        q: 'Why does the author talk about "St. Mary\'s"?',
        choices: [
          'To explain why Ruth wasn\'t very nice',
          'To give some background information about Ruth',
          'To show why Ruth joined the New York Yankees',
          'To provide an example of a place to learn baseball'
        ],
        answer: 1,
        explanation: 'セント・メアリーズは7歳で送られて12年間暮らし、野球を覚えた場所として登場する。ルースの生い立ちを説明するための背景情報。'
      },
      {
        q: 'Why does the author mention that almost all American kids today grow up knowing Babe Ruth\'s name?',
        choices: [
          'To show how admired he is in the U.S.',
          'To explain the American kids\' wishes',
          'To prove that he was the greatest pitcher',
          'To give an example of how Americans love baseball'
        ],
        answer: 0,
        explanation: '死後60年以上たっても「almost every kid in the U.S. today grows up knowing his name」という事実は、彼がアメリカでどれほど敬愛されているかを示すために書かれている。'
      }
    ]
  },
  {
    id: 'r87',
    title: '世界一「高い」山はどっち？',
    level: 3,
    topic: '理科',
    words: 192,
    passage:
      'The highest mountain in the world is thought to be Mount Everest, but, in fact, the Mauna Kea stands taller than all other mountains in the world. Although Mount Everest is over 29,000 feet above sea level, the Mauna Kea volcano is over 33,000 feet tall. Most people do not know Mauna Kea is taller because the base of the volcano begins under the sea. In contrast, Mount Everest\'s base is completely above the ocean. There has been confusion about why Mount Everest holds the crown as the highest mountain in the world when Mauna Kea is roughly 4,000 feet taller. This is because of the difference between mountain height and tallness. Height is how far a mountain reaches into the sky. While the tallness of a mountain is measured from the base to the peak, the height is measured from sea level to the peak. Because Mount Everest is 29,000 feet above the sea, it is higher than Mauna Kea. However, Mauna Kea is taller because a large part of the mountain is under water. If both mountains started at sea level, Mauna Kea would be the loftier of the two.',
    glossary: [
      { w: 'peak', m: '山頂' },
      { w: 'roughly', m: 'およそ' },
      { w: 'lofty', m: 'そびえ立つ' }
    ],
    questions: [
      {
        q: 'What title best expresses the main idea of the passage?',
        choices: [
          'Mount Everest',
          'The Tallest Mountain in the World',
          'The Mauna Kea Volcano\'s Base',
          'The Highest Mountain in the World'
        ],
        answer: 1,
        explanation: 'エベレストではなくマウナケアこそ世界一「背の高い」山だと説明する文章。主張の中心はマウナケアなので「世界で最も背の高い山」が最適。'
      },
      {
        q: 'Why does the author talk about Mauna Kea\'s base?',
        choices: [
          'To explain why Mauna Kea is taller than Mount Everest',
          'To prove why Mauna Kea is higher than Mount Everest',
          'To exemplify why Mount Everest is taller than Mauna Kea',
          'To show why Mount Everest is the same height as Mauna Kea'
        ],
        answer: 0,
        explanation: 'マウナケアの土台が海の下から始まることは、「マウナケアの方が背が高い」理由の説明として書かれている。'
      },
      {
        q: 'Why are "mountain height and tallness" mentioned in the passage?',
        choices: [
          'To note Mount Everest and Mauna Kea are the same heights',
          'To clarify how they are irrelevant to mountains',
          'To explain how they are the same when they are used',
          'To point out why Mount Everest is the highest and Mauna Kea is the tallest'
        ],
        answer: 3,
        explanation: 'height（海面から頂上まで）と tallness（土台から頂上まで）の違いは、エベレストが「最も高い」でマウナケアが「最も背が高い」理由を示すために持ち出されている。'
      }
    ]
  },
  {
    id: 'r88',
    title: '感謝の夕食会へのご招待',
    level: 3,
    topic: '手紙・メール',
    words: 186,
    passage:
      'Dear Mrs. Andrews, As you know, the Boy Scouts will be having a dinner in your honor this month. We want to thank you for all the help that you have given us in the last few years. We would be very honored if you could join us. I\'m writing to you to give you details about the dinner. It will occur on Wednesday, October 28 and start at 7 P.M. at the Green Mountain Restaurant. There will be a buffet with all kinds of food. There will also be speeches from people who are involved in the Boy Scouts. It is going to be an amazing evening. The boys have prepared a special gift for you. I won\'t tell you what it is going to be because they asked me to make sure that it is a surprise. There will also be a surprise guest speaker at the dinner.' + '\n' +
      'The boys have been working for months planning this dinner. It was their idea. They are very excited for it.' + '\n' +
      'You are an amazing person, and we are happy to tell the world. Thanks.' + '\n' +
      'Donald Doolittle',
    glossary: [
      { w: 'in one\'s honor', m: '〜に敬意を表して' },
      { w: 'buffet', m: 'ビュッフェ' },
      { w: 'gratitude', m: '感謝' }
    ],
    questions: [
      {
        q: 'Why did Donald Doolittle write this e-mail?',
        choices: [
          'To ask for help from Mrs. Andrews',
          'To find out if Mrs. Andrews likes buffets',
          'To inform Mrs. Andrews about the dinner',
          'To prove that the Boy Scouts need support'
        ],
        answer: 2,
        explanation: '「I\'m writing to you to give you details about the dinner」と明言されているとおり、目的は夕食会の詳細を知らせること。'
      },
      {
        q: 'What is suggested about Mrs. Andrews?',
        choices: [
          'She used to be a member of the Boy Scouts.',
          'She is having a dinner party with her friends.',
          'She is an important supporter of the Boy Scouts.',
          'She does not know the boys from the Boy Scouts.'
        ],
        answer: 2,
        explanation: '夕食会は「in your honor（あなたに敬意を表して）」開かれ、「thank you for all the help that you have given us in the last few years」とある。長年ボーイスカウトを支えてきた大切な人物だと分かる。'
      },
      {
        q: 'Why does Donald Doolittle mention "a surprise guest speaker"?',
        choices: [
          'To tell Mrs. Andrews that she will have to speak',
          'To explain that he doesn\'t know about the dinner',
          'To show how special and how much fun the dinner will be',
          'To give an example of why he doesn\'t want to go to the dinner'
        ],
        answer: 2,
        explanation: 'サプライズのゲストスピーカーは、特別な贈り物やビュッフェと並べて「It is going to be an amazing evening」を裏付ける材料。夕食会がどれほど特別で楽しいかを示すため。'
      },
      {
        q: 'Why does Donald Doolittle mention that the party was the boys\' idea?',
        choices: [
          'To show the boys\' gratitude to Mrs. Andrews',
          'To prove how kind they are to senior citizens',
          'To give an example of their hard work in school',
          'To explain how long it will take for them to have the dinner'
        ],
        answer: 0,
        explanation: '「It was their idea. They are very excited for it」は、少年たち自身が感謝を伝えたがっていることを示すために書かれている。'
      }
    ]
  },
  {
    id: 'r89',
    title: '巨大ザメ・メガロドンは今も海に？',
    level: 3,
    topic: '生物',
    words: 250,
    passage:
      'The great white shark is one of the most famous predators in the world. It is also one of the biggest and scariest sharks in the ocean. Movies like Jaws have made it even more popular. Believe it or not, before the great white, there was an even bigger shark in the ocean. The megalodon is an extinct kind of shark that lived over a million years ago. Its name means big tooth and it did have giant teeth. It is thought to have been somewhere between 45 and 65 feet long. Great white sharks have been known to be up to 20 feet long. This means that the megalodon was two or three times bigger than the modern-day great white. For centuries, people have been finding the megalodon\'s teeth in rocks from the ocean or in rocks from areas that used to be covered by oceans. They had no idea what animal the teeth came from. Early scientists thought that they were from ancient dragons or giant snakes. It wasn\'t until the nineteenth century that a scientist discovered that the teeth were from the mouth of a shark.' + '\n' +
      'Most people think that the megalodon no longer swims in the sea but some people do not agree. Nearly 90 percent of the ocean remains unexplored, so these people say that there is a good chance that these giant sharks are still out there. Anything is possible but a shark as big as a megalodon would have a hard time hiding.',
    glossary: [
      { w: 'predator', m: '捕食者' },
      { w: 'extinct', m: '絶滅した' },
      { w: 'unexplored', m: '未踏査の' }
    ],
    questions: [
      {
        q: 'Why does the author write the passage?',
        choices: [
          'To give an example of a shark movie',
          'To talk about the biggest shark of all time',
          'To inform readers about the great white shark',
          'To imply that people don\'t know about the great white shark'
        ],
        answer: 1,
        explanation: '話題の中心はホホジロザメの2〜3倍もあった史上最大のサメ、メガロドン。ホホジロザメは大きさを比べる引き立て役として登場する。'
      },
      {
        q: 'Based on the passage, what is probably true about a great white\'s teeth?',
        choices: [
          'They are sharper than any other animal\'s.',
          'They are bigger than the megalodon\'s teeth.',
          'They are smaller than the megalodon\'s teeth.',
          'There are more of them than in the megalodon\'s mouth.'
        ],
        answer: 2,
        explanation: 'メガロドンは「big tooth（大きな歯）」の意味で巨大な歯を持ち、体もホホジロザメの2〜3倍。ここからホホジロザメの歯はメガロドンの歯より小さいと推測できる。'
      },
      {
        q: 'Why does the author mention "early scientists"?',
        choices: [
          'To ask why people are interested in sharks and megalodons',
          'To show that they believed in ancient dragons and giant snakes',
          'To prove that the great white was the biggest animal in the sea',
          'To show that people in the past did not know about megalodons'
        ],
        answer: 3,
        explanation: '初期の科学者は歯の化石を「ancient dragons or giant snakes のもの」と考えた。昔の人々がメガロドンを知らなかったことを示す例。'
      },
      {
        q: 'Why does the author mention that "nearly 90 percent of the ocean remains unexplored"?',
        choices: [
          'To show why no one has found a big megalodon yet',
          'To imply that humans need to explore the depths of the ocean soon',
          'To explain why some people claim megalodons possibly exist',
          'To convince readers that the ocean is large enough for many sharks'
        ],
        answer: 2,
        explanation: '「Nearly 90 percent of the ocean remains unexplored, so these people say that there is a good chance that these giant sharks are still out there」——生存説の根拠として海の未踏査ぶりが挙げられている。'
      }
    ]
  },
  {
    id: 'r90',
    title: '地球温暖化デーのお知らせ',
    level: 3,
    topic: 'お知らせ',
    words: 154,
    passage:
      'Friday, August 19 is our third annual Global Warming Day. We are happy to say that this year\'s event will be bigger than last year\'s. It is very important to get together and learn about something that is going to change all of our lives. We hope you all can come and enjoy this wonderful day with us.' + '\n' +
      '10:00 - 11:30 A.M. — Greenhouses in America, a lecture by Dr. Aaron.' + '\n' +
      '11:30 A.M. - 12:30 P.M. — Healthy Lunch, lunch and a health talk.' + '\n' +
      '12:30 - 2:00 P.M. — Free Energy, a demonstration by Mr. Witherspoon.' + '\n' +
      '2:00 - 4:00 P.M. — Melting Icebergs, a student activity with Mrs. Neimeyer.' + '\n' +
      '4:00 - 6:00 P.M. — Our Gentle Planet, a movie presented by Dr. Lynch.' + '\n' +
      'Note: If you want to participate in the Melting Icebergs activity, bring a bathing suit. If you have any food allergies, make sure to report them to the cafeteria before Friday.',
    glossary: [
      { w: 'annual', m: '毎年恒例の' },
      { w: 'demonstration', m: '実演' },
      { w: 'allergy', m: 'アレルギー' }
    ],
    questions: [
      {
        q: 'How many times has there been a Global Warming Day?',
        choices: [
          'It has happened twice.',
          'This will be the first time ever.',
          'Last year was the first time ever.',
          'This will be the last Global Warming Day.'
        ],
        answer: 0,
        explanation: '冒頭に「our third annual Global Warming Day（3回目の恒例行事）」とある。今年が3回目ということは、これまでに2回開かれている。'
      },
      {
        q: 'Who will lead the lecture activity?',
        choices: [
          'Dr. Lynch',
          'Dr. Aaron',
          'Mrs. Neimeyer',
          'Mr. Witherspoon'
        ],
        answer: 1,
        explanation: '予定表で Lecture（講義）とあるのは「Greenhouses in America」で、担当は Dr. Aaron。'
      },
      {
        q: 'When does the demonstration activity finish?',
        choices: [
          'At lunch',
          '2:00 P.M.',
          '12:30 P.M.',
          'Before lunch'
        ],
        answer: 1,
        explanation: 'Demonstration（実演）は「Free Energy」で 12:30-2:00 P.M. の枠。終わるのは 2:00 P.M.。'
      },
      {
        q: 'Who will need to bring a bathing suit?',
        choices: [
          'Students doing the Melting Icebergs activity',
          'Students going swimming during the day',
          'The boys and girls on the swimming team',
          'All students attending the Global Warming Day'
        ],
        answer: 0,
        explanation: 'Note に「If you want to participate in the Melting Icebergs activity, bring a bathing suit」とある。水着が必要なのは Melting Icebergs に参加する生徒。'
      }
    ]
  },
  {
    id: 'r91',
    title: 'サマープログラム合格のお知らせ',
    level: 3,
    topic: '手紙・メール',
    words: 172,
    passage:
      'Dear Cathy, Thank you for your application. I wanted to write this letter to you myself. I am excited to say that you have been accepted into our summer program. This year, we had more students apply than ever before. I was very impressed when I read your essay. You seem like the perfect girl for our program.' + '\n' +
      'This summer, our program is going to be focusing on young writers. In your application, you said that you are very interested in writing poetry. When you join us on July 15, you should bring some of your writing so that we can work on editing it. If you\'d like, you can send a sample to me now. I would be very happy to read it and give you some comments. That way, you can get an early start on the program. I hope you have been enjoying your first week of vacation. I look forward to meeting you in person and reading more of your work. Have a wonderful week. Sincerely, Erica Lee',
    glossary: [
      { w: 'application', m: '応募、申込書' },
      { w: 'accept', m: '受け入れる' },
      { w: 'edit', m: '編集する、直す' }
    ],
    questions: [
      {
        q: 'Why did Erica Lee write this e-mail?',
        choices: [
          'To help the student with her application',
          'To inform the student about another program',
          'To ask for some more information from the student',
          'To tell the student she can join the program'
        ],
        answer: 3,
        explanation: '「I am excited to say that you have been accepted into our summer program」が用件の中心。プログラムへの合格を伝えるメール。'
      },
      {
        q: 'In the passage, the phrase accepted into is closest in meaning to',
        choices: [
          'given to',
          'chosen for',
          'replaced by',
          'conceived of'
        ],
        answer: 1,
        explanation: 'accepted into は「〜に受け入れられた」。プログラムに選ばれたという意味なので chosen for が最も近い。'
      },
      {
        q: 'In the passage, the word sample is closest in meaning to',
        choices: [
          'a lot',
          'everything',
          'application',
          'small part'
        ],
        answer: 3,
        explanation: 'sample は書いたものの「見本、一部」。詩の一部を送ってほしいという文脈なので small part が最も近い。'
      },
      {
        q: 'According to the e-mail, what did Cathy apply for?',
        choices: [
          'A teaching program',
          'A young writers program',
          'A religious summer school',
          'A summer sports academy'
        ],
        answer: 1,
        explanation: '「our program is going to be focusing on young writers」「you are very interested in writing poetry」とある。キャシーが応募したのは若い書き手のためのプログラム。'
      }
    ]
  },
  {
    id: 'r92',
    title: '地震のしくみを知ろう',
    level: 3,
    topic: '理科',
    words: 235,
    passage:
      'Everyone in the world knows about earthquakes. Many people have even experienced an earthquake, but not many people understand what an earthquake actually is. This week, I have heard a lot of students talking about earthquakes, so I decided to write about them for my weekly column in the school newspaper.' + '\n' +
      'Earthquakes can start miles below Earth\'s surface. All of the water and land on Earth rests on top of giant plates that fit together like puzzle pieces. These are called tectonic plates. These tectonic plates are always moving and are always pressing against each other. An earthquake usually occurs where two of the plates meet. The edges of the plates are rough, and sometimes they get caught while the rest of the plate continues to move. When this happens, the plates release a lot of energy created by gathered strain that causes an earthquake.' + '\n' +
      'Earthquakes happen almost every day all over the world, but most of them cannot be felt because they are so small. However, some can be devastating, especially when they occur in the place where tectonic plates come together. They can create mountains and tsunamis or even make land disappear. Recently, Japan and New Zealand have experienced large earthquakes. Experts say more will happen in the future. It is important to learn as much about earthquakes as possible because they are very powerful and can change human life a great deal.',
    glossary: [
      { w: 'tectonic plate', m: '構造プレート' },
      { w: 'devastating', m: '壊滅的な' },
      { w: 'strain', m: 'ひずみ' }
    ],
    questions: [
      {
        q: 'What would be the best title for the article?',
        choices: [
          'Natural Disasters',
          'Understanding Earthquakes',
          'Finding Earthquakes Underground',
          'The Ocean and the Power of Tsunamis'
        ],
        answer: 1,
        explanation: '「not many people understand what an earthquake actually is」と述べ、プレートの仕組みから影響までを説明する記事。題名は「地震を理解する」が最適。'
      },
      {
        q: 'What is suggested about the students at the author\'s school?',
        choices: [
          'They are afraid of earthquakes.',
          'They are interested in earthquakes.',
          'They have experienced many disasters.',
          'They do not care enough about earthquakes.'
        ],
        answer: 1,
        explanation: '「I have heard a lot of students talking about earthquakes, so I decided to write about them」とある。生徒たちが地震の話をしている＝関心を持っていると読み取れる。'
      },
      {
        q: 'Based on the article, what is probably true about earthquakes?',
        choices: [
          'They are getting bigger as time goes on.',
          'They are happening more now than before.',
          'They happen more than some people realize.',
          'They are happening less than they did one hundred years ago.'
        ],
        answer: 2,
        explanation: '「Earthquakes happen almost every day all over the world, but most of them cannot be felt」とある。感じられないほど小さな地震が毎日起きている＝人々が思うより多く起きている。'
      },
      {
        q: 'In the passage, the word pressing is closest in meaning to',
        choices: [
          'moving',
          'pulling',
          'crossing',
          'pushing'
        ],
        answer: 3,
        explanation: 'pressing は「押し付けている」。プレート同士が押し合う場面なので pushing が正解。'
      },
      {
        q: 'In the passage, the word release is closest in meaning to',
        choices: [
          'bind',
          'let go',
          'tackle',
          'control'
        ],
        answer: 1,
        explanation: 'release は「解放する」。ためたエネルギーを放出する文脈なので let go が最も近い。'
      },
      {
        q: 'Why does the author mention earthquakes creating mountains and tsunamis?',
        choices: [
          'To explain how our Earth was created',
          'To suggest that earthquakes happen often',
          'To illustrate how powerful earthquakes can be',
          'To advise people not to live in the mountains or by the sea'
        ],
        answer: 2,
        explanation: '山や津波を作り土地を消すという例は、直前の「some can be devastating」を具体的に示すもの。地震の力の大きさを描くために挙げられている。'
      }
    ]
  },
  {
    id: 'r93',
    title: 'カフェテリアの大騒動',
    level: 3,
    topic: '学校生活',
    words: 270,
    passage:
      'The cafeteria was packed. The noise was deafening because every single seat was taken and everyone was talking. Taco day was always full of people but I had never seen it like this before.' + '\n' +
      'I sat with my friends at our usual tables after waiting for a while. I was having a great conversation with them when I heard Alex from behind me. "Hey Tom! Check this out!" I turned and got a face full of sour cream. I was so angry that without thinking I picked up a taco from my plate and threw it back as hard as I could. Alex had been expecting it. He ducked, and the taco flew through the air, hitting Regina. It all happened so fast that no one saw it happen. Regina looked around angrily. When she saw Alex laughing, she threw her taco at him. Everyone started throwing tacos at each other and soon the whole cafeteria was in chaos. I crawled under a table but I still got covered in tacos.' + '\n' +
      'It was over fast, but everything and everyone was covered in beef, cheese, lettuce, and sour cream. It was one of the biggest messes I had ever seen! I felt bad for being one of the people who caused it. I stayed with a few of my friends and we helped clean up the mess. It was good that we helped, because the people who didn\'t got into a lot of trouble. It was a lucky day for me but I still felt bad for my part in the chaos. I knew that I would never throw food again.',
    glossary: [
      { w: 'deafening', m: '耳をつんざくような' },
      { w: 'chaos', m: '大混乱' },
      { w: 'crawl', m: 'はう' }
    ],
    questions: [
      {
        q: 'What would be the best title for this story?',
        choices: [
          'Taco Day',
          'The Food Fight',
          'Trouble with Regina',
          'The Mess at Breakfast'
        ],
        answer: 1,
        explanation: 'タコスの投げ合いでカフェテリア中が大混乱になる話。題名は「食べ物の投げ合い（フードファイト）」が最適。タコスの日はきっかけにすぎない。'
      },
      {
        q: 'Why does the author throw his food?',
        choices: [
          'To do something funny',
          'To hit his friend who hit him first',
          'To show that he didn\'t like his food',
          'To prove he was happy with the meal'
        ],
        answer: 1,
        explanation: '「I turned and got a face full of sour cream. I was so angry that ... I picked up a taco ... and threw it back」とある。先にぶつけてきた友だちに投げ返したのが理由。'
      },
      {
        q: 'What does the author mean by saying "the whole cafeteria was in chaos" in line 11?',
        choices: [
          'The cafeteria was dirty.',
          'The cafeteria was out of control.',
          'The cafeteria was full of students.',
          'The cafeteria didn\'t have teachers.'
        ],
        answer: 1,
        explanation: 'chaos は「大混乱」。みんながタコスを投げ合い、机の下に隠れても浴びるほどの状態なので、「収拾がつかなくなった」が正解。'
      },
      {
        q: 'Which word best describes the cafeteria after the fight?',
        choices: [
          'cozy',
          'disgusting',
          'impressive',
          'distinguished'
        ],
        answer: 1,
        explanation: 'けんかの後は「everything and everyone was covered in beef, cheese, lettuce, and sour cream」「one of the biggest messes」とある。この様子を表すのは disgusting（うんざりするほど汚い）。'
      },
      {
        q: 'What does the author decide after the food fight?',
        choices: [
          'It was a good idea not to tell.',
          'He will help clean the cafeteria often.',
          'He won\'t get involved in cafeteria food fights.',
          'He might want to start another food fight.'
        ],
        answer: 2,
        explanation: '最後に「I knew that I would never throw food again」とある。もう食べ物の投げ合いには関わらないと決めた。'
      },
      {
        q: 'In the passage, the word packed is closest in meaning to',
        choices: [
          'closed',
          'heated',
          'crowded',
          'spacious'
        ],
        answer: 2,
        explanation: 'packed は「ぎっしり詰まった」。全席が埋まっていた場面なので crowded が正解。'
      }
    ]
  },
  {
    id: 'r94',
    title: '空を飛ぶ夢の歴史',
    level: 3,
    topic: '技術',
    words: 240,
    passage:
      'Most people are very familiar with airplanes. In the industrialized world, a lot of people have ridden in planes. High up in the air, they can travel huge distances in a short amount of time. A plane ride from Detroit, United States to Incheon, South Korea can take fourteen hours. It is amazing that it takes only fourteen hours to travel halfway around the world. People have been trying to fly for thousands of years. Ancient Greek, Egyptian, and Mayan legends involve great men or gods who could fly. Some even came from faraway worlds. Leonardo Da Vinci is famous for many inventions involving flight. He studied birds and designed machines that he hoped would fly. Unfortunately, he was never successful, but his attempts show how dedicated people were to finding ways to fly. There were many other people trying to build airplanes since Da Vinci. One of these people was Clement Ader, a French engineer who made important contributions to the science of flight. Ader created a bat-like flying structure that supposedly flew for 50 meters. Finally, the Wright Brothers came forward. The brothers are credited with making the world\'s first airplane in 1903. They spent the rest of their lives modifying their airplanes to fly further and faster. The modern airplane is a lot different from what the Wrights probably imagined. A scramjet is an experimental aircraft that can travel up to 12,000 kilometers an hour. That\'s fast!',
    glossary: [
      { w: 'dedicated', m: '熱心な、打ち込んだ' },
      { w: 'contribution', m: '貢献' },
      { w: 'modify', m: '改良する' }
    ],
    questions: [
      {
        q: 'Which title best summarizes the main idea of the passage?',
        choices: [
          'Flight Competition',
          'The Wright Brothers',
          'The Search for Flight',
          'The First Flying Gliders'
        ],
        answer: 2,
        explanation: '古代の伝説からダ・ヴィンチ、アデール、ライト兄弟、現代のスクラムジェットまで、人類が飛行を追い求めた歴史をたどる文章。題名は「飛行の探求」が最適。'
      },
      {
        q: 'According to the passage, what is made possible because of flight?',
        choices: [
          'Remembering Leonardo Da Vinci',
          'Flying from South Korea to Mexico',
          'New and advanced military hints',
          'Traveling over long distances at swift speeds'
        ],
        answer: 3,
        explanation: '冒頭に「they can travel huge distances in a short amount of time」とあり、デトロイト〜仁川14時間の例が続く。飛行が可能にしたのは長距離の高速移動。'
      },
      {
        q: 'What inspired Leonardo Da Vinci\'s inventions for flying?',
        choices: [
          'People\'s bodies',
          'The flight of birds',
          'The science of flight',
          'His own ability to fly'
        ],
        answer: 1,
        explanation: '「He studied birds and designed machines that he hoped would fly」とある。ダ・ヴィンチの発明のヒントは鳥の飛び方。'
      },
      {
        q: 'In the passage, the phrase credited with is closest in meaning to',
        choices: [
          'declared as',
          'accepted as',
          'renowned for',
          'concerned with'
        ],
        answer: 2,
        explanation: 'credited with は「〜の功績があると認められている」。世界初の飛行機を作ったと称えられている文脈なので renowned for が最も近い。'
      },
      {
        q: 'In the passage, the word modifying is closest in meaning to',
        choices: [
          'improving',
          'discovering',
          'assembling',
          'undermining'
        ],
        answer: 0,
        explanation: 'modifying は「改良すること」。より遠くへ速く飛べるよう手を加え続けた文脈なので improving が正解。'
      },
      {
        q: 'Which of the following is NOT true about the Wright Brothers?',
        choices: [
          'They fought many times with Clement Ader.',
          'They worked for most of their lives on airplanes.',
          'They are usually credited as the fathers of airplanes.',
          'They probably couldn\'t imagine today\'s airplanes.'
        ],
        answer: 0,
        explanation: 'ライト兄弟は生涯をかけて飛行機を改良し、初の飛行機の生みの親とされる。アデールと何度も争ったという記述はない。'
      }
    ]
  },
  {
    id: 'r95',
    title: 'アマゾンの巨大ヘビを探して',
    level: 3,
    topic: '生物',
    words: 246,
    passage:
      'The green anaconda is the world\'s heaviest snake. It is also one of the world\'s longest snakes. When the first Europeans came to South America, they reported finding snakes that were 100 feet long. Snakes of this size have not been found since, but native people say that they have found snakes up to 50 feet long. Most scientists think that the largest green anacondas are about 25 feet long.' + '\n' +
      'The snakes spend most of their time in rivers. They are very heavy, so it is much easier for them to move around and hunt in the water. They are very good at staying camouflaged. They are green and yellow, perfect colors for the murky waters of the Amazon River. When anything gets close enough to the water, the green anaconda strikes and eats. They like fish, birds, small alligators, and anything else that might get close. The Amazon Basin is one of the least explored places on Earth. People still live deep in the jungle with almost no contact with the outside world. To find the biggest anacondas, this is where scientists need to go. However, there are no roads and the place can be very dangerous. The jungles are full of dangerous animals such as poisonous tree frogs. Native people can become violent on account of misunderstandings. Also, the snakes themselves are very good at hiding in the wet swamps of the Amazon. These things make it quite difficult for scientists to study them.',
    glossary: [
      { w: 'camouflage', m: 'カモフラージュする' },
      { w: 'murky', m: '濁った' },
      { w: 'on account of', m: '〜が原因で' }
    ],
    questions: [
      {
        q: 'What is the main topic of the passage?',
        choices: [
          'The green anaconda\'s river life',
          'The weight of anaconda snakes',
          'Finding and studying large green anacondas',
          'Scientists searching the Amazon River Basin'
        ],
        answer: 2,
        explanation: 'オオアナコンダの大きさをめぐる説と、最大級の個体を探して研究することの難しさが話の中心。「大きなオオアナコンダを見つけて研究すること」が主題。'
      },
      {
        q: 'Why does the author mention that most scientists think that the largest green anacondas are about 25 feet long?',
        choices: [
          'To prove that the Europeans were wrong',
          'To give an example of scientists not knowing the truth for sure',
          'To explain that 25 feet is the longest any snake can be',
          'To show the scientific opinion against the natives\' opinion'
        ],
        answer: 3,
        explanation: 'ヨーロッパ人は100フィート、先住民は50フィートと言うのに対し、科学者は25フィートと考える——という対比を示すための一文。先住民の主張と対立する科学側の見解を示している。'
      },
      {
        q: 'In the passage, the word camouflaged is closest in meaning to',
        choices: [
          'safe',
          'secret',
          'hidden',
          'dangerous'
        ],
        answer: 2,
        explanation: 'camouflaged は「カモフラージュされた」。緑と黄色の体が濁った川の色にまぎれるという文脈なので hidden（隠れた）が最も近い。'
      },
      {
        q: 'In the passage, the word poisonous is closest in meaning to',
        choices: [
          'long',
          'heavy',
          'hungry',
          'harmful'
        ],
        answer: 3,
        explanation: 'poisonous は「毒のある」。危険な動物の例として毒ガエルが挙がっている文脈なので harmful が最も近い。'
      },
      {
        q: 'According to the passage, all of the following can be threats in the Amazon River Basin EXCEPT',
        choices: [
          'local disease',
          'lack of roads',
          'native people',
          'dangerous animals'
        ],
        answer: 0,
        explanation: '危険として挙がっているのは道路がないこと・危険な動物・誤解から暴力的になりうる先住民。「地域の病気」は本文にない。'
      },
      {
        q: 'Which of the following is true about the Amazon River Basin?',
        choices: [
          'It often rains and floods.',
          'It is highly unexplored.',
          'It is home to yellow anacondas.',
          'It is relatively more developed.'
        ],
        answer: 1,
        explanation: '「The Amazon Basin is one of the least explored places on Earth（地球上で最も探査が進んでいない場所のひとつ）」とある。highly unexplored が本文と一致する。'
      },
      {
        q: 'In the passage, the word they refers to',
        choices: [
          'snakes',
          'scientists',
          'Europeans',
          'native people'
        ],
        answer: 3,
        explanation: '「native people say that they have found snakes up to 50 feet long」の they は文の主語 native people を指す。'
      },
      {
        q: 'According to the passage, why do green anacondas live in rivers?',
        choices: [
          'They can\'t move very quickly in rivers.',
          'They are better swimmers than crocodiles.',
          'The river is ideal because they are so heavy.',
          'Rivers are a good place for them to find food.'
        ],
        answer: 2,
        explanation: '「They are very heavy, so it is much easier for them to move around and hunt in the water」とある。体が重いので水中の方が動きやすいから川にすむ。'
      }
    ]
  },
  {
    id: 'r96',
    title: '宇宙に生命はいるのか',
    level: 3,
    topic: '科学',
    words: 256,
    passage:
      'The idea of life in outer space has been talked about for a long time. Some scientists say that life development on Earth was far too unlikely for it to have happened anywhere else. Things had to be perfect for us to make it on this planet. Other scientists say that space is too big. Stars and other planets are far too numerous for there to be no other life in the universe. For many years, there have been reports of visitors from other planets. People all around the world have claimed to see alien spaceships or even aliens themselves. There have been glimpses of these so-called UFOs (unidentified flying objects) flying through the air and they have even been captured on video. Some Americans believe that the U.S. Army found an alien spaceship crashed in the desert and then lied to the press about it. Although these sightings may be true, scientists have not found significant evidence that aliens exist. If you go out into the countryside on a clear night and look up, you can see thousands of stars. Those stars make up a tiny part of our universe. There are more stars, planets, and galaxies than we can count. Even the smartest scientists can\'t even come close to defining how big space is. The number of possible stars and planets out there is bigger than our ability to count. If we are really on the only planet that can sustain life, then we are very special in a universe full of amazing things.',
    glossary: [
      { w: 'numerous', m: '非常に多くの' },
      { w: 'glimpse', m: 'ちらりと見えること' },
      { w: 'sustain', m: '維持する' }
    ],
    questions: [
      {
        q: 'What would be the best title for this passage?',
        choices: [
          'Visitors from Faraway Planets',
          'The Possibility of Life on Other Worlds',
          'The Life and Times of an Alien Life',
          'The Mysterious Crash Landing in America'
        ],
        answer: 1,
        explanation: '地球外生命の可能性をめぐる科学者の意見・UFOの目撃談・宇宙の広さを語る文章。題名は「ほかの世界に生命がいる可能性」が最適。'
      },
      {
        q: 'Why does the author mention "reports of visitors from other planets"?',
        choices: [
          'To give an example of people who do not believe in science',
          'To explain why scientists are not interested in studying aliens',
          'To raise the issue of whether or not we are alone in the universe',
          'To inform people that a spaceship crashed in the American desert'
        ],
        answer: 2,
        explanation: '他の惑星からの訪問者の報告は、「宇宙に私たちしかいないのか」という問いを持ち出すために紹介されている。'
      },
      {
        q: 'What can be inferred about finding aliens?',
        choices: [
          'It\'s not possible yet.',
          'It\'s already been done.',
          'Aliens can be found in the USA.',
          'Scientists already know the truth.'
        ],
        answer: 0,
        explanation: '「scientists have not found significant evidence that aliens exist（宇宙人が存在する確かな証拠は見つかっていない）」とある。宇宙人を見つけることはまだできていないと推測できる。'
      },
      {
        q: 'In the passage, the word numerous is closest in meaning to',
        choices: [
          'rare',
          'large',
          'plentiful',
          'interesting'
        ],
        answer: 2,
        explanation: 'numerous は「数え切れないほど多い」。星や惑星が多すぎるという文脈なので plentiful が最も近い。'
      },
      {
        q: 'What have some people claimed about aliens?',
        choices: [
          'Aliens often appear in dreams.',
          'They have encountered aliens.',
          'Aliens are extremely dangerous.',
          'Aliens are always kidnapping people.'
        ],
        answer: 1,
        explanation: '「People all around the world have claimed to see alien spaceships or even aliens themselves」とある。宇宙人に遭遇したと主張する人々がいる。'
      },
      {
        q: 'In the passage, the word they refers to',
        choices: [
          'UFOs',
          'people',
          'videos',
          'glimpses'
        ],
        answer: 0,
        explanation: '「There have been glimpses of these so-called UFOs ... flying through the air and they have even been captured on video」の they は UFOs を指す。'
      },
      {
        q: 'In the passage, the word defining is closest in meaning to',
        choices: [
          'wanting',
          'describing',
          'questioning',
          'guaranteeing'
        ],
        answer: 1,
        explanation: 'defining は「定義する、言い表す」。宇宙の大きさを言い表せないという文脈なので describing が最も近い。'
      },
      {
        q: 'According to the passage, what is NOT true about the night sky?',
        choices: [
          'It proves that aliens are real.',
          'We can see stars there.',
          'It has an uncountable amount of stars.',
          'The stars there are only a fraction of the universe.'
        ],
        answer: 0,
        explanation: '夜空については、数千の星が見える・それは宇宙のごく一部・数え切れないほど星があると書かれているが、「宇宙人が実在する証明になる」とは書かれていない。'
      }
    ]
  },
  {
    id: 'r97',
    title: '映画クラブのポスター係',
    level: 4,
    topic: '手紙・メール',
    words: 169,
    passage:
      'Dear Mrs. Simpson, I\'m sorry I could not attend the film club meeting today. I had an appointment that my mother wouldn\'t allow me to miss. I really wanted to go and am sure that I\'ll be able to make the next one.' + '\n' +
      'Anyway, I\'m wondering which students decided to work on the posters for our next event. As I remember from our last meeting, Janet was interested in making them. There were a number of others interested, too. Nothing was decided, though, and I\'m wondering what decision was reached.' + '\n' +
      'I\'m asking because I\'m really interested in helping to create the posters. I would be happy to help other students or to work on my own. If there are already too many students working on posters, I\'d be happy to do something else for the club. I really like being a member and would be satisfied if I could do anything to help. Thanks for your time, Mrs. Simpson. Sorry again that I couldn\'t attend the meeting. Sincerely, Becky',
    glossary: [
      { w: 'attend', m: '出席する' },
      { w: 'appointment', m: '予約・約束' },
      { w: 'satisfied', m: '満足した' }
    ],
    questions: [
      {
        q: 'Why did Becky write this e-mail?',
        choices: [
          'To find out if she can work on the posters',
          'To tell Mrs. Simpson that she had an appointment',
          'To ask Mrs. Simpson about the club\'s next event',
          'To explain that she\'ll be missing all the meetings'
        ],
        answer: 0,
        explanation: '第3段落の I\'m asking because I\'m really interested in helping to create the posters（ポスター作りを手伝いたくて尋ねている）が目的。欠席の報告や謝罪は前置きにすぎない。'
      },
      {
        q: 'In the passage, the word allow is closest in meaning to',
        choices: [
          'loan',
          'give',
          'permit',
          'prevent'
        ],
        answer: 2,
        explanation: 'allow は「許す」。母が欠席を許さなかった用事、という文脈なので permit（許可する）が最も近い。prevent（妨げる）は逆の意味。'
      },
      {
        q: 'In the passage, the word others refers to',
        choices: [
          'events',
          'students',
          'projects',
          'meetings'
        ],
        answer: 1,
        explanation: '直前の文に Janet was interested in making them（ジャネットが作りたがっていた）とあり、others はそれに続く「他にも興味を持った人たち」つまり生徒（students）を指す。'
      },
      {
        q: 'What would Becky likely do for the club?',
        choices: [
          'Make it a bigger club with more events',
          'Make sure Janet makes the posters for it',
          'Take over the poster-making project for it',
          'Help it by making posters or in another way'
        ],
        answer: 3,
        explanation: '最終段落で「他の生徒を手伝っても一人でやってもよいし、係が埋まっていれば別の仕事でもよい」と述べている。ポスター作りか別の形かでクラブを手伝う、が本文どおり。'
      }
    ]
  },
  {
    id: 'r98',
    title: 'フランスでの海外生活プログラム',
    level: 4,
    topic: '学校生活',
    words: 318,
    passage:
      'Twenty-five students from Walling School are currently living in France. They are there for three months as part of a living-abroad project. The 16- and 17-year-old students are living with French families and attending a French school. Most of the students have taken French language classes for 3 or 4 years and are finally getting an opportunity to use their French.' + '\n' +
      'Not only are students learning a new language, but they\'re learning about a new culture, too. Students have been particularly surprised about the French attitude towards food. "They won\'t leave anything on their plate," says Vanessa Athol. "They aren\'t wasteful at all." Vanessa has vowed to be more careful with waste when she returns to the United States.' + '\n' +
      'The group\'s chaperone, Mrs. Smith, has been pleased with the students\' acquisition of language. "Even the most timid are trying their best to speak. The students are learning a lot. I\'m very impressed," she said. Mrs. Smith added that she thinks living with a French family makes a difference because students are forced to speak French when they are at home. When students live in a hotel or group house with other American students, they miss out on the opportunity to learn about French culture and to speak French. We\'re all very grateful to the French families who are hosting us."' + '\n' +
      'The French families are happy to have the students, as they are getting to learn about American culture. Both groups will be celebrating the exchange at a large potluck dinner at the end of the stay. There will be a slide show of memories and the students will speak about their experiences. Currently, the American students are periodically posting pictures and student essays on the Walling School website. "Living in France is an experience I\'ll never forget," writes student Tina Davis. "I know I\'ll want to eat these croissants and this Camembert for the rest of my life!"',
    glossary: [
      { w: 'chaperone', m: '引率者' },
      { w: 'acquisition', m: '習得' },
      { w: 'potluck', m: '持ち寄り料理の' }
    ],
    questions: [
      {
        q: 'What would be the most suitable headline for this article?',
        choices: [
          'French Families Love America',
          'Student Tina Davis Lives in France',
          'Walling School Website Posts Student Essays',
          'Walling School Students Stay Abroad in France'
        ],
        answer: 3,
        explanation: '記事全体は Walling School の25人がフランスで3か月暮らすプログラムの報告。生徒の海外滞在を伝える見出しが最も適切。他の選択肢は記事の一部分にすぎない。'
      },
      {
        q: 'What is suggested about the culture in France?',
        choices: [
          'It scares the students.',
          'It requires fluency in French.',
          'It can be learned from a book.',
          'It\'s different from the culture in America.'
        ],
        answer: 3,
        explanation: '第2段落で生徒たちが「フランスの食に対する姿勢に驚いた」とある。驚くのは自国の文化と違うからで、アメリカと文化が異なることが示唆されている。'
      },
      {
        q: 'Based on the article, what does Mrs. Smith probably think about the French language?',
        choices: [
          'It\'s more beautiful than Spanish.',
          'It is very important for international communication.',
          'It\'s best to learn it from a French family in France.',
          'It is something each and every American student needs to know.'
        ],
        answer: 2,
        explanation: '第3段落でスミス先生は「フランス人家庭で暮らすと家でもフランス語を話さざるを得ないので違いが出る」と述べている。フランスの家庭から学ぶのが一番、が先生の考え。'
      },
      {
        q: 'In the passage, the word vowed is closest in meaning to',
        choices: [
          'saved',
          'received',
          'changed',
          'promised'
        ],
        answer: 3,
        explanation: 'vow は「誓う」。ヴァネッサが帰国後は無駄遣いに気をつけると誓った、という文脈なので promised（約束した）が最も近い。'
      },
      {
        q: 'In the passage, the word acquisition is closest in meaning to',
        choices: [
          'gaining',
          'speaking',
          'purchase',
          'responsibility'
        ],
        answer: 0,
        explanation: 'acquisition は「習得」。言語の習得に satisfied という文脈なので gaining（得ること）が最も近い。purchase（購入）は買い物の意味なので不適。'
      },
      {
        q: 'According to the article, how will the students conclude their stay?',
        choices: [
          'They will take a French exam.',
          'They will have a party together.',
          'They will visit Paris and have great fun.',
          'They will stay in a hostel or group house.'
        ],
        answer: 1,
        explanation: '最終段落に「滞在の最後に大きな持ち寄りディナーで交流を祝う」とある。一緒にパーティーをする、が本文どおり。'
      }
    ]
  },
  {
    id: 'r99',
    title: 'パンデミックの歴史',
    level: 4,
    topic: '科学',
    words: 326,
    passage:
      'A pandemic is an infectious disease that spreads across a large region, continent, or throughout the world. A pandemic is not simply a disease that exists around the world. It must also be contagious, spreading from person to person. There are pandemics in the world today such as SARS and H1N1 (popularly known as swine flu), but there have been many throughout history that have had major effects on various populations. Pandemics have the capability of killing huge portions of a place\'s people. In 1347, the Black Death, a plague in Europe, spread and killed 75 million people, a whopping one-third of Europe\'s population.' + '\n' +
      'When European explorers began encountering other places in the world, they tended to spread diseases to local population. One notable example is the complete destruction of the Guanches on the Canary Islands. The majority of tribe members were killed by disease brought by Spanish invaders in the 15th century. In fact, many countries and cultures faced destructive pandemics after international exploration became possible. It is believed that Columbus and his crew brought a strain of syphilis back with them to Europe from the New World. In Europe, the virus was able to mutate because of the location\'s different conditions. Additionally, Europeans that were sent to work in Asia were killed by disease. Intercultural mixing, an exposure to new viruses, and the transportation of diseases led to many pandemics across the world. Today, one of the biggest pandemics in the world is HIV/AIDS. The introduction of AIDS in 1969 has led to the infection of many people. The first case in the U.S. was reported in 1981 in Los Angeles. Since then, AIDS has claimed many lives. In particular, Africa has suffered from the virus. These days, up to 25% of the South and East African populations may be infected, which makes AIDS an undying and pervasive pandemic. Many efforts are being made to help prevent the spread of AIDS through proper education.',
    glossary: [
      { w: 'contagious', m: '伝染性の' },
      { w: 'mutate', m: '変異する' },
      { w: 'pervasive', m: '蔓延する' }
    ],
    questions: [
      {
        q: 'Which title best summarizes the main idea of the passage?',
        choices: [
          'The Spread of HIV/AIDS',
          'Europeans Creating Pandemics',
          'Infection and the Death of Africans',
          'The Problem of Pandemics in Our World'
        ],
        answer: 3,
        explanation: '本文はパンデミックの定義から始まり、黒死病・大航海時代の疫病・エイズまで、世界におけるパンデミックの問題全体を扱っている。個別の話題は例にすぎない。'
      },
      {
        q: 'In the passage, the word contagious is closest in meaning to',
        choices: [
          'glowing',
          'catchable',
          'expressible',
          'dangerous'
        ],
        answer: 1,
        explanation: 'contagious は「伝染性の」。spreading from person to person（人から人へ広がる）と直後に説明されているので catchable（うつりやすい）が最も近い。'
      },
      {
        q: 'In the passage, the word them refers to',
        choices: [
          'strains of syphilis',
          'Columbus and his crew',
          'destructive pandemics',
          'Europe and the New World'
        ],
        answer: 1,
        explanation: 'them は Columbus and his crew brought a strain of syphilis back with them の中の語で、持ち帰った主体であるコロンブスと乗組員を指す。'
      },
      {
        q: 'In the passage, the words undying and pervasive are closest in meaning to',
        choices: [
          'critical and illegal',
          'legitimate and affirming',
          'unstoppable and affecting few',
          'unstoppable and affecting all'
        ],
        answer: 3,
        explanation: 'undying and pervasive は「終わらず蔓延する」。直前の「南・東アフリカの人口の25%が感染しているかもしれない」から、止められず広く影響する、の意味。'
      },
      {
        q: 'Based on the passage, what was probably true about syphilis?',
        choices: [
          'It was easy to cure in its early stages.',
          'It hadn\'t been a European problem before Columbus.',
          'It killed many native populations, including many in Africa.',
          'It was a large-scale pandemic that spread around the world.'
        ],
        answer: 1,
        explanation: '第2段落に「コロンブス一行が梅毒をヨーロッパへ持ち帰ったと考えられている」とある。つまりそれ以前のヨーロッパには梅毒の問題はなかったと推測できる。'
      },
      {
        q: 'The author mentions all of the following EXCEPT',
        choices: [
          'the Black Death in medieval Europe',
          'the problem of AIDS in Africa',
          'the nature of Asian diseases',
          'the Guanche population in the Canary Islands'
        ],
        answer: 2,
        explanation: '黒死病・アフリカのエイズ・グアンチェ族は本文で言及されているが、「アジアの病気の性質」は述べられていない（ヨーロッパ人がアジアで病死したとあるだけ）。'
      },
      {
        q: 'What have people done to try to prevent AIDS in Africa?',
        choices: [
          'Set up hospitals',
          'Educated the people',
          'Brought Africans to other places',
          'Complained to 25% of the population'
        ],
        answer: 1,
        explanation: '最終文に「適切な教育を通じてエイズの拡大を防ぐ努力がなされている」とある。人々を教育した、が本文どおり。'
      },
      {
        q: 'Why did the Guanches in the Canary Islands disappear?',
        choices: [
          'The tribe caught a bad strain of syphilis.',
          'The tribe was uneducated about pandemics.',
          'Europeans deliberately infected the people.',
          'The Spanish brought disease when they landed on the island.'
        ],
        answer: 3,
        explanation: '第2段落に「グアンチェ族の大半は15世紀にスペインの侵略者が持ち込んだ病気で殺された」とある。スペイン人が上陸時に病気を持ち込んだから。'
      }
    ]
  },
  {
    id: 'r100',
    title: '初出場のフットボールの試合',
    level: 4,
    topic: '手紙・メール',
    words: 277,
    passage:
      'Dear Mike, Today we had an amazing football game. It was wet and cold but our quarterback had a great game anyway. He played spectacularly but the other team also played well. In the fourth quarter the score was tied up and my coach called me in to play defense. I hadn\'t played all game so I was pretty nervous. Then, on the very first play, the other team ran the ball right at me. I made a decent tackle and stopped the running back short of the first down. The ball was back in our possession.' + '\n' +
      'Everyone was really impressed and said it was an excellent tackle. I was happy with my performance. But as soon as our offense was on the field, we lost the ball and had to go right back out. This time the other team\'s quarterback took the ball and passed it right over the middle. I dove to my left and caught the ball on my fingertips. It was an interception! I was so excited that I forgot to give the ball back to the referee and my coach had to take it from me on the sideline. He said I could keep it after the game. After that we scored and won the game. The coach said I was the most valuable player of the game and said that I would be starting next week. I thought I would write you a quick e-mail letting you know how the game went. After all, you\'re the one who inspired me to start playing football! I hope you are having a good day and I\'ll talk to you soon. Yours truly, Andrew',
    glossary: [
      { w: 'possession', m: '保有・ボール保持' },
      { w: 'interception', m: 'パスの奪取' },
      { w: 'inspire', m: '刺激を与える' }
    ],
    questions: [
      {
        q: 'Which of the following is true about Andrew?',
        choices: [
          'He scored all the points in the game.',
          'He played really well in the first quarter.',
          'He is friends with the referee of the football game.',
          'He was content with his performance as a defenseman.'
        ],
        answer: 3,
        explanation: '第2段落冒頭に I was happy with my performance（自分のプレーに満足した）とあり、守備での活躍が描かれている。content は happy の言い換え。'
      },
      {
        q: 'According to the e-mail, what did Andrew get after the game?',
        choices: [
          'The ball from the game',
          'An e-mail from his friend',
          'Team uniforms from the coach',
          'A gold star for his MVP performance'
        ],
        answer: 0,
        explanation: 'インターセプトしたボールについてコーチが He said I could keep it after the game（試合後に持っていていいと言った）と述べている。試合球をもらった、が本文どおり。'
      }
    ]
  },
  {
    id: 'r101',
    title: 'エバーグレーズを脅かすビルマニシキヘビ',
    level: 4,
    topic: '環境',
    words: 205,
    passage:
      'Alligators have always been the most dangerous predators of the Florida Everglades but their long-held position is now being challenged by a growing population of Burmese pythons.' + '\n' +
      'The Burmese python, a giant snake measuring up to 20 feet long and weighing up to 200 pounds, is very popular among exotic pet owners. However, as the deadly snakes grow, they become more difficult to cage and handle. To avoid dealing with the snakes, the owners irresponsibly release them into the wild. Since the Everglades is quite similar to the python\'s native environment of Southeast Asia, they survive and prosper without difficulty. The issue with the Burmese pythons is their choice of meals. They eat alligators and endangered birds, which creates a strain on an already fragile ecosystem. Recently a 13-foot-long Burmese python was found with a 5-foot alligator bursting from its stomach. The python died trying to eat the alligator but a larger one would have easily won the struggle. With over 30,000 Burmese pythons now living in the Everglades, a solution to stop this invasive species is necessary. If the pythons are left unchecked, there is a strong possibility they will wipe out a variety of species necessary for the functioning of the Everglades ecosystem.',
    glossary: [
      { w: 'predator', m: '捕食者' },
      { w: 'invasive species', m: '侵略的外来種' },
      { w: 'fragile', m: '壊れやすい' }
    ],
    questions: [
      {
        q: 'Based on the article, why are the Burmese pythons found in the Everglades?',
        choices: [
          'Their old environment changed.',
          'They were no longer being hunted by people.',
          'They migrated to the Everglades from another place.',
          'They were thrown away by their frustrated owners.'
        ],
        answer: 3,
        explanation: '第2段落に「ヘビが大きくなると扱いにくくなり、飼い主が無責任にも野生に放してしまう」とある。持て余した飼い主に捨てられたから、が本文どおり。'
      },
      {
        q: 'What in particular creates a strain on Everglades ecosystem?',
        choices: [
          'The Burmese python\'s ability to swim',
          'The diet of Burmese pythons',
          'Alligators eating Burmese pythons',
          'The number of Burmese pythons living in the Everglades'
        ],
        answer: 1,
        explanation: 'The issue with the Burmese pythons is their choice of meals（問題は食べるもの）に続けて、ワニや絶滅危惧種の鳥を食べて生態系に負担をかけるとある。食性（diet）が原因。'
      }
    ]
  },
  {
    id: 'r102',
    title: 'エイブラハム・リンカーン',
    level: 4,
    topic: '伝記',
    words: 234,
    passage:
      'Abraham Lincoln is one of the most famous presidents ever elected in the United States. He is also one of only two American presidents to ever be assassinated. He was born in 1809 in Kentucky on the western frontier. He worked hard and was considered a very strong man. He was self-educated and eventually became a lawyer in the country region of Kentucky.' + '\n' +
      'After that, he started his career in politics. He was elected to the Illinois Legislature. Lincoln was very outspoken against slavery. In 1860 his anti-slavery campaign won him the Republican nomination for president. He won the election but the American Civil War began shortly after. During the war, Lincoln declared the "Emancipation Proclamation," a speech which introduced the law he is most famous for. This law stated that slavery in America was to be abolished; all slaves were to be freed.' + '\n' +
      'After the North was victorious over the southern states, Lincoln was very happy to finally get to govern his country in relative peace. However, Lincoln\'s presidency and life would not last much longer. On April 14th, 1865, while attending a play in Washington, D.C., Abraham Lincoln was shot in the back of the head by John Wilkes Booth. Booth, believing the Civil War was still being fought, assassinated the president to further the cause of the Confederate Army. He was tracked down and killed ten days later by Unionist soldiers.',
    glossary: [
      { w: 'assassinate', m: '暗殺する' },
      { w: 'abolish', m: '廃止する' },
      { w: 'victorious', m: '勝利した' }
    ],
    questions: [
      {
        q: 'Based on the passage, which of the following is true about Abraham Lincoln?',
        choices: [
          'He started his career in Illinois as a lawyer.',
          'He and John Wilkes Booth knew each other.',
          'He was a Democrat but soon became independent.',
          'He was killed at a theater by John Wilkes Booth.'
        ],
        answer: 3,
        explanation: '最終段落に「ワシントンD.C.で観劇中にジョン・ウィルクス・ブースに頭を撃たれた」とある。劇場でブースに殺された、が本文どおり。他の選択肢は本文にない。'
      },
      {
        q: 'What did Abraham Lincoln do before he went into politics?',
        choices: [
          'He worked on the western frontier.',
          'He worked as a lawyer in Kentucky.',
          'He was a soldier in the countryside.',
          'He worked to fight slavery in Washington, D.C.'
        ],
        answer: 1,
        explanation: '第1段落末尾に「独学でケンタッキーの田舎の弁護士になった」とあり、その直後に After that, he started his career in politics と続く。政界入りの前は弁護士。'
      }
    ]
  },
  {
    id: 'r103',
    title: 'アーツ・アンド・クラフツ運動',
    level: 4,
    topic: '文化',
    words: 276,
    passage:
      'The Arts and Crafts Movement in America came as a response to industrialization in the late 19th and early 20th century. Before the Arts and Crafts Movement, the world was excited about the possibilities offered by machines. Machines were advanced. They could make good-quality products quickly, cheaply, and efficiently. However, when humans seemed too reliant on machines, people became worried and wanted to return to an earlier time. This idea started the Arts and Crafts Movement. Instead of emphasizing very ornate and decorated pieces, the Arts and Crafts Movement was concerned with being true to materials, honest craftsmanship, and simple folk traditions. This movement mainly affected architecture and home furnishings. Simplicity became important - both on the exterior and in the interior of a home. Good, solid craftsmanship was praised. Factories began to produce goods and furniture that were given finishing touches by skilled workers.' + '\n' +
      'The Arts and Crafts Movement in America was different from the movement in Britain. The British saw the movement as purely anti-industrial while Americans saw the movement as a way to promote the perfect middle-class home. These Americans believed that a simple home would help the American people to think logically and clearly. The simplicity of the American home would prevent people\'s minds from being complicated by complex decoration.' + '\n' +
      'The remains of the Arts and Crafts Movement can still be seen today. Some say that the Arts and Crafts Movement was a prelude to modernism, which uses simple forms without a lot of decoration. Indeed, much of the architecture and interior design in America today is built on ideas of simplicity in structure, which came from the Arts and Crafts Movement.',
    glossary: [
      { w: 'ornate', m: '装飾過多の' },
      { w: 'craftsmanship', m: '職人の技' },
      { w: 'prelude', m: '前ぶれ・序章' }
    ],
    questions: [
      {
        q: 'Which of the following is true of the Arts and Crafts Movement?',
        choices: [
          'It emphasized ornate and decorative pieces.',
          'It mainly affected the middle class in Britain.',
          'It appeared as resistance to industrialization and machinery.',
          'It was publicized by many newspapers and in famous museums.'
        ],
        answer: 2,
        explanation: '冒頭に came as a response to industrialization（工業化への反動として起こった）とある。機械への依存を心配した人々が始めた運動なので、工業化・機械への抵抗が正しい。'
      },
      {
        q: 'What did the Americans believe about the Arts and Crafts Movement?',
        choices: [
          'The British were responsible for starting it.',
          'Simple homes no longer existed in America.',
          'Complex decoration was ugly and distasteful for homes.',
          'The artistic movement could help simplify the lives of the people.'
        ],
        answer: 3,
        explanation: '第2段落に「アメリカ人は簡素な家がアメリカ人の思考を論理的で明晰にすると信じた」とある。運動が人々の生活を簡素にしてくれる、という考えが本文どおり。'
      }
    ]
  },
  {
    id: 'r104',
    title: '試験週間の食堂の営業時間',
    level: 4,
    topic: 'お知らせ',
    words: 153,
    passage:
      'This week our cafeteria is going to have a different schedule. As all of you know, exam week is a very stressful time. We recognize this and want students to have more flexibility in planning their meal times. This semester we\'ll be keeping the cafeteria open longer so that students can find time to eat. We wish you luck during finals and hope that you can enjoy the food (there won\'t be any changes to the menu).' + '\n' +
      'Below are the exam week hours for the cafeteria.' + '\n' +
      'Breakfast — Open 7:00 A.M. / Closed 10:30 A.M.' + '\n' +
      'Lunch — Open 11:30 A.M. / Closed 2:00 P.M.' + '\n' +
      'Dinner — Open 5:00 P.M. / Closed 7:30 P.M.' + '\n' +
      'After-hours* — Open 8:00 P.M. / Closed 10:00 P.M.' + '\n' +
      '*After-hours snacks will not include hot meals, but there will be cold cuts for sandwiches and a salad bar open for any students studying late or kept on campus for athletics.',
    glossary: [
      { w: 'flexibility', m: '柔軟性' },
      { w: 'cold cuts', m: '薄切りの冷製肉' },
      { w: 'athletics', m: '運動部活動' }
    ],
    questions: [
      {
        q: 'The students are allowed to eat at all of the following times EXCEPT',
        choices: [
          '3:00 P.M.',
          '12:00 P.M.',
          '7:00 A.M.',
          '9:30 P.M.'
        ],
        answer: 0,
        explanation: '営業時間表では昼食は2:00 P.M.まで、夕食は5:00 P.M.から。3:00 P.M.はどの時間帯にも入っておらず食事できない。他の時刻はすべて営業時間内。'
      },
      {
        q: 'Which of the following is NOT true?',
        choices: [
          'Students are in an exam period.',
          'The cafeteria hours have been rescheduled.',
          'The cafeteria will have more options during after-hours.',
          'The cafeteria will not be changing the menu composition.'
        ],
        answer: 2,
        explanation: '注意書きに「夜食に温かい料理はないが、サンドイッチ用のコールドカットとサラダバーがある」とある。選択肢が増えるわけではないので「夜食は選択肢が多い」が誤り。'
      }
    ]
  },
  {
    id: 'r105',
    title: 'フロリダ旅行からの手紙',
    level: 4,
    topic: '手紙・メール',
    words: 302,
    passage:
      'Dear Mom & Dad, I just wanted to tell you guys how much fun I have been having on vacation in Florida. It has been really awesome staying with Jimmy\'s family and we have been doing so many amazing things. Last night we went out to eat at a seafood restaurant and ate fried shrimp and flounder. The food was really fresh and tasted great. Then we went to a video arcade and got to play all the video games that we wanted. It was really fun and Jimmy and I met some really nice kids there.' + '\n' +
      'Tomorrow we are going scuba-diving. We have been taking lessons in the pool every afternoon. The hotel has its own instructors to help us learn how to use the equipment. We also have been going to the beach every morning to look for shells. I\'ve found some beautiful ones that I\'ll take home to show you. Jimmy\'s mom gets up while it\'s still dark and brings us with her to see the sunrise. The sunrise looks so beautiful over the water. I wish you could see it.' + '\n' +
      'So far though, my favorite thing we have done was to go on a boat cruise. We went out on a big boat and got to see all sorts of fish in the water. We saw a family of dolphins too, which was really cool because they were jumping out of the water and getting really high. Then we saw some really beautiful little islands. The captain even let me and Jimmy steer the boat for a little bit.' + '\n' +
      'I am excited to see you guys again. I have so many stories for you. Florida is great, but I miss home and I miss you. I hope all is well and I will see you soon. Love, Adam.',
    glossary: [
      { w: 'flounder', m: 'カレイ・ヒラメ' },
      { w: 'instructor', m: '指導員' },
      { w: 'steer', m: '（船などを）操縦する' }
    ],
    questions: [
      {
        q: 'Adam mentions finishing all of the following activities EXCEPT',
        choices: [
          'scuba-diving',
          'going on a boat cruise',
          'looking for shells',
          'playing games at an arcade'
        ],
        answer: 0,
        explanation: 'スキューバダイビングは Tomorrow we are going scuba-diving（明日行く予定）で、まだ終えていない。貝殻探し・アーケード・クルーズはすでにした活動。'
      },
      {
        q: 'Adam and Jimmy did all of the following EXCEPT',
        choices: [
          'driving a boat',
          'eating fried shrimp and flounder',
          'meeting some friends in an arcade',
          'taking scuba-diving lessons on the beach'
        ],
        answer: 3,
        explanation: 'レッスンは We have been taking lessons in the pool（プールで受けている）とあり、浜辺でではない。船の操縦・エビとカレイの食事・アーケードでの友達作りは本文にある。'
      }
    ]
  },
  {
    id: 'r106',
    title: 'ベンジャミン・フランクリン',
    level: 4,
    topic: '伝記',
    words: 207,
    passage:
      'Benjamin Franklin is one of the most famous Americans to have ever lived. He is recognized by many historians for his contributions to American independence. Franklin was born in 1706 in Boston, Massachusetts, but lived most of his life in Philadelphia. He attended school, but by the age of ten, he had already dropped out to work with his father. He continued his education on his own and was well-known for reading many books. Benjamin Franklin was one of the most respected politicians of his day. He was part of the committee that drafted the Declaration of Independence and was also the United States\' first ambassador to France.' + '\n' +
      'Outside of politics, he was a renowned inventor and scientist. He was a leading figure of the American Enlightenment. His work with electricity, as well as many other inventions, made him a very wealthy and celebrated person. He invented things like the lightning rod but he never requested a patent. He felt that his inventions should be used by everyone around him and believed that all other inventors should feel the same way about their creations. He was already very wealthy from his books, so to him, scientific research was just out of curiosity rather than for financial success.',
    glossary: [
      { w: 'ambassador', m: '大使' },
      { w: 'renowned', m: '名高い' },
      { w: 'patent', m: '特許' }
    ],
    questions: [
      {
        q: 'Which of the following is NOT true about Benjamin Franklin?',
        choices: [
          'He worked in France.',
          'He was a famous inventor.',
          'He received many patents.',
          'He invented the lightning rod.'
        ],
        answer: 2,
        explanation: '第2段落に He invented things like the lightning rod but he never requested a patent（避雷針を発明したが特許は申請しなかった）とある。「多くの特許を受けた」が事実と異なる。'
      },
      {
        q: 'All of the following were jobs of Benjamin Franklin EXCEPT',
        choices: [
          'an author',
          'a scientist',
          'a banker',
          'a politician'
        ],
        answer: 2,
        explanation: '著述家（books で富を得た）・科学者・政治家はいずれも本文にあるが、銀行家（banker）だったという記述はない。'
      }
    ]
  },
  {
    id: 'r107',
    title: '新石器革命',
    level: 4,
    topic: '歴史',
    words: 209,
    passage:
      'The Neolithic Revolution is the term for the first Agricultural Revolution. Around the year 8000 B.C., humans began to make permanent settlements. This was a gigantic change in the way humans lived and would have large ramifications for human society. Before the Neolithic Revolution, people lived in hunter-gatherer societies that were nomadic. This means that they did not have a fixed home but constantly searched for animals to hunt and plants to eat.' + '\n' +
      'The Neolithic Revolution happened when people began domesticating plants and animals. In order to eat fruits and vegetables, they planted seeds, watered plants, and harvested the crop. Not only were they able to grow their food, but they also found ways to store it. To have meat, milk, and eggs, they tamed animals such as pigs, chickens, and cows. They kept animals and planted gardens close to their homes so they would not have to move around. The Neolithic Revolution also brought about changes in how people acted. With a stable population that existed in one place, these settlements needed new forms of leadership and government. People could also occupy different positions in society as not everyone was needed to farm and raise animals. These settled societies allowed the development of new culture, arts, and architecture.',
    glossary: [
      { w: 'settlement', m: '定住地' },
      { w: 'nomadic', m: '遊牧の' },
      { w: 'domesticate', m: '家畜化する' }
    ],
    questions: [
      {
        q: 'According to the passage, which of the following is NOT true of the Neolithic Revolution?',
        choices: [
          'This revolution changed the ruling system of society.',
          'People at that time were satisfied with changes the revolution brought.',
          'After the revolution, some people got engaged in jobs other than farming.',
          'Before the revolution, people used to move around to hunt animals to survive.'
        ],
        answer: 1,
        explanation: '統治の変化・農業以外の職業・狩猟のための移動生活はすべて本文にあるが、「当時の人々が変化に満足していた」という記述はどこにもない。'
      },
      {
        q: 'The author mentions all of the following EXCEPT',
        choices: [
          'people tamed pigs, chickens, and cows',
          'people began planting and harvesting crops',
          'people knew how to keep their food for later',
          'the animals became close companions to the people'
        ],
        answer: 3,
        explanation: '豚・鶏・牛の家畜化、作物の栽培と収穫、食料の保存はすべて第2段落にあるが、「動物が人間の親しい仲間になった」という記述はない（食料のために飼っただけ）。'
      }
    ]
  },
  {
    id: 'r108',
    title: '試験でのカンニング問題',
    level: 4,
    topic: '学校生活',
    words: 188,
    passage:
      'A major issue recently has been people cheating on their school exams. In the last week alone, four students have been caught with answer sheets prepared before the test. It is very sad to see students acting so dishonestly and even sadder to see them fail their exams because of cheating. Moreover, the cheat sheets that have been taken are very well made. Clearly, students have put in a great deal of effort to create them. If students had just focused on studying instead of trying to cheat, they probably would have done well on their own. The faculty is holding meetings this week to find out what they can do to fix this problem. They have already decided to fail any student who is caught cheating and are considering additional actions. Realistically, the students need to help themselves. Students at this school need to realize how dishonest and unfair it is to cheat. Everyone needs to follow the rules for the rest of exams. That means that students shouldn\'t have cheat sheets, shouldn\'t look at the papers of others, and shouldn\'t use any other methods of cheating.',
    glossary: [
      { w: 'cheat', m: 'カンニングをする' },
      { w: 'faculty', m: '教員団' },
      { w: 'dishonest', m: '不正直な' }
    ],
    questions: [
      {
        q: 'What is suggested about the cheat sheets?',
        choices: [
          'They weren\'t made by the students.',
          'The faculty is interested in making more.',
          'The teachers took them and examined them.',
          'They are the only form of cheating at the school.'
        ],
        answer: 2,
        explanation: 'the cheat sheets that have been taken are very well made（没収されたカンニングペーパーはよくできている）と評しているので、教師が取り上げて中身を確かめたことがわかる。'
      },
      {
        q: 'What does the author imply about the students using cheat sheets?',
        choices: [
          'They are not prepared enough for their exams.',
          'They should have to leave school after the exams:',
          'They are shamelessly hurting the school\'s reputation.',
          'They spent their time and effort doing the wrong thing.'
        ],
        answer: 3,
        explanation: '「カンニングの準備ではなく勉強に力を注いでいれば、自力でも良い点が取れただろう」とある。時間と労力を間違ったことに使った、というのが筆者の言いたいこと。'
      }
    ]
  },
  {
    id: 'r109',
    title: '大雪による臨時休校のお知らせ',
    level: 4,
    topic: 'お知らせ',
    words: 157,
    passage:
      'Classes will be canceled again tomorrow because of another snowstorm that is quickly approaching from the north. We will have to make up for the missed days in the spring so students will not miss any important lessons. Weather reports show that some places on the east coast have already gotten nearly a meter of snow and are experiencing high winds. All students are advised to go straight home after school. Students, teachers, and parents should stay off the roads tonight because the storm will be arriving in the late evening and lasting until tomorrow afternoon. During the last snowstorm, there were a number of car accidents caused by snowy and icy roads, so please be careful. Hopefully school will resume on Thursday, but this will depend on the severity of the storm. Listen to your radio or watch the news on Wednesday night and Thursday morning so you know whether or not to come to school.',
    glossary: [
      { w: 'make up for', m: '埋め合わせる' },
      { w: 'severity', m: '深刻さ' },
      { w: 'resume', m: '再開する' }
    ],
    questions: [
      {
        q: 'What can be inferred from the notice about the location of the school?',
        choices: [
          'Snowstorms are fairly common in the region.',
          'The location usually gets rain instead of snow.',
          'There have never been big snowstorms in the area.',
          'Classes do not get canceled often because of weather.'
        ],
        answer: 0,
        explanation: '「また休校（canceled again）」「前回の吹雪では事故が多発」とあり、休校も吹雪も繰り返し起きている。この地域では吹雪がよくあることだと推測できる。'
      },
      {
        q: 'Based on the notice, what is probably true about the snowstorm?',
        choices: [
          'It won\'t be very strong.',
          'It will cause some car accidents.',
          'It\'s going to occur on a Saturday.',
          'It will be the worst storm of the winter.'
        ],
        answer: 1,
        explanation: '前回の吹雪で snowy and icy roads による車の事故が多発したとある。今回も夜通し続く吹雪なので、事故がいくつか起こるだろうと推測するのが自然。'
      }
    ]
  },
  {
    id: 'r110',
    title: '火星の素顔',
    level: 4,
    topic: '科学',
    words: 295,
    passage:
      'Mars is the fourth planet from the Sun and the seventh largest planet in our Solar System. It is sometimes called "the Red Planet" because the iron oxide on the surface makes it look red. In many ways, Mars is very similar to Earth. It has volcanoes, valleys, and deserts just like Earth. Because of these similarities, many scientists believe that the surface environment of Mars may not always have been so hostile to life. Some of them think that water exists on Mars, which would make it possible for life to exist there.' + '\n' +
      'Mars\' surface area is about the same as the land surface area of Earth. There are plains made from lava flows, and the highest known mountain and largest known canyon in the Solar System are on Mars. The mountain, Olympus Mons, is almost 3 times as tall as Mount Everest. The canyon, called Valles Marineris, is 4,000 kilometers long, 200 kilometers wide and up to 7 kilometers deep. Mars has a lot of impact craters, which are the result of large objects hitting the planet\'s surface. Therefore, scientists argue that very large objects hit Mars about 4 billion years ago. This theory would explain why Mars\' surface looks the way it does. Mars is located very close to the asteroid belt, which lies between the orbits of Mars and Jupiter, so it is more likely to be hit by asteroids. However, Mars still has fewer craters than the Moon. This is because Mars has a more substantial atmosphere than the Moon. Scientists know about Mars\' surface because they have been able to send spaceships with high-resolution cameras to Mars, as well as robots to collect rock samples. Still, there is much more to find out. Scientists hope to visit Mars someday.',
    glossary: [
      { w: 'hostile', m: '生存に適さない・敵対的な' },
      { w: 'crater', m: 'クレーター' },
      { w: 'substantial', m: 'しっかりした・かなりの' }
    ],
    questions: [
      {
        q: 'What does the author imply about Mars?',
        choices: [
          'Mars is covered with a vast ocean.',
          'Scientists will go to Mars very soon.',
          'Early Mars may have been friendlier to life.',
          'Water on Earth is much less abundant than it is on Mars.'
        ],
        answer: 2,
        explanation: '第1段落に「火星の表面環境は昔から生命に過酷だったわけではないかもしれないと多くの科学者が考えている」とある。昔の火星は生命により友好的だったかもしれない、が本文の含意。'
      },
      {
        q: 'Which of the following can be inferred from the passage?',
        choices: [
          'Photographs of Mars have been taken.',
          'Almost all asteroids are round and bowl-shaped.',
          'Impact craters caused significant climate changes to Mars.',
          'There are lakes and oceans not only on Mars but on the Moon.'
        ],
        answer: 0,
        explanation: '最終部に「高解像度カメラを積んだ宇宙船を送って表面を知った」とある。つまり火星の写真が撮影されてきたことが推測できる。'
      }
    ]
  },
  {
    id: 'r111',
    title: 'ピルグリムとアメリカの始まり',
    level: 4,
    topic: '歴史',
    words: 286,
    passage:
      'The United States of America is a very unique country. Most American citizens have ancestors that were immigrants or are immigrants themselves. In the past, many people moved to America for religious freedom and new opportunities. This did not happen automatically. Instead, a series of events led to the settlement and development of the United States. One of the most important and famous events was the settlement of Plymouth, Massachusetts by a group known as the Pilgrims.' + '\n' +
      'The Pilgrims are early Protestant Christian settlers from England. They moved to America in 1620 from England to escape religious persecution. Their king wanted them to worship at the Church of England, an Anglican church. However, they did not believe in this form of Christianity and wanted to "purify" Christian religious practices. They believed in a personal relationship with God and valued simplicity. They were frustrated with their country\'s views about religion and decided to leave.' + '\n' +
      'The Pilgrims took a ship called the Mayflower to "the New World." They landed at Plymouth and set up a settlement. Life there was very hard - the winters were long and cold, they did not know how and what to eat, and their settlement was unstable. The natives helped them to persevere. The Pilgrims were able to survive and start a new society where they could worship how they wanted. Later, many others would join them in the New World looking for religious freedom.' + '\n' +
      'The Pilgrims are important and instructive because they were the first familial settlement in North America. They were the first to try to start a new life and new society in the New World. Americans observe the holiday called Thanksgiving in order to honor their struggle and survival.',
    glossary: [
      { w: 'persecution', m: '迫害' },
      { w: 'persevere', m: '耐え抜く' },
      { w: 'familial', m: '家族による' }
    ],
    questions: [
      {
        q: 'Based on the passage, what is probably true about the people in the United States of America?',
        choices: [
          'They are all very religious.',
          'All the people came from England',
          'Many of them don\'t celebrate Thanksgiving.',
          'Most people are not ethnically Native American.'
        ],
        answer: 3,
        explanation: '冒頭に「アメリカ市民の多くは移民の子孫か移民自身」とある。つまり大半の人は先住民の血筋ではないと推測できる。全員が信心深い・全員英国出身は言いすぎ。'
      },
      {
        q: 'Based on the passage, what is suggested about Thanksgiving?',
        choices: [
          'It celebrates the Pilgrims\' hard work.',
          'It is only celebrated by immigrant families.',
          'It is a religious holiday from the Anglican Church.',
          'It reminds people to be more resourceful than the Pilgrims.'
        ],
        answer: 0,
        explanation: '最終段落に「感謝祭は彼らの苦闘と生存をたたえるために祝われる」とある。ピルグリムの苦労をたたえる祝日、が本文どおり。'
      }
    ]
  },
  {
    id: 'r112',
    title: '望遠鏡の宿題と宇宙人',
    level: 4,
    topic: '日常生活',
    words: 368,
    passage:
      '"Take this telescope home and look at the night sky from your backyard. I want you to write down everything interesting you see and next week we will talk about it in class," Mr. Anderson said at the end of our astronomy class.' + '\n' +
      'I asked my best friend Courtney if she wanted to come over to my house on Saturday to watch the stars with me. She agreed and we decided we would camp out all night.' + '\n' +
      '"Tonight is going to be very clear," my mom said as she helped us set the tent up. We sat watching the sky for several hours. "Adam, what is that?" Courtney asked, sounding very confused. I looked into the telescope and saw that a large, circular airplane was getting closer and closer to us. It had thousands of rotating lights and I could see two small, green men leaning over the controls.' + '\n' +
      '"It is coming right for us!" I shouted.' + '\n' +
      'The flying saucer landed and the two spacemen got out with smiles on their long, flat faces. They shook our hands as we stood unable to speak. "We are from the planet Kepron 12 and we have been sent to teach you about the universe," said the smaller of the two aliens with a very odd-sounding accent. Courtney and I spent the rest of the night learning about the universe from our new friends until they had to leave.' + '\n' +
      '"Good luck in your astronomy class next week," the taller alien said. "I hope that we can meet again and maybe you can visit our home."' + '\n' +
      'We both said we would like to and waved to them as they flew away. The next couple of days went by slowly because we were excited to give our report. On Thursday, our chance finally came.' + '\n' +
      'Mr. Anderson, however, laughed and said, "You guys have great imaginations! But your assignment was supposed to be on things that you actually saw." He would not listen to us and told us to repeat the task next weekend.' + '\n' +
      'We didn\'t mind though. Courtney and I both knew that sometime in the future our friends would be back. One day, we will prove to everyone that we were right.',
    glossary: [
      { w: 'telescope', m: '望遠鏡' },
      { w: 'flying saucer', m: '空飛ぶ円盤' },
      { w: 'assignment', m: '課題' }
    ],
    questions: [
      {
        q: 'What is the best title for the story?',
        choices: [
          'The Truth About Kepron 12',
          'A Difficult Astronomy Assignment',
          'Two Students Encountering Two Aliens',
          'Teachers Who Don\'t Believe Their Students'
        ],
        answer: 2,
        explanation: '物語の中心は、星を観察していた二人が二人の宇宙人に出会い、一晩宇宙について教わる出来事。「二人の生徒が二人の宇宙人に出会う」が全体をよく表す。'
      },
      {
        q: 'Why does Adam invite Courtney to his house on Saturday?',
        choices: [
          'To meet his mom',
          'To do schoolwork',
          'To meet his friends',
          'To camp out and eat pizza'
        ],
        answer: 1,
        explanation: 'アンダーソン先生が出した「夜空を観察して記録する」宿題のため。my best friend Courtney に声をかけて一緒に観察することにした。'
      },
      {
        q: 'What is suggested about Mr. Anderson\'s opinion of the report?',
        choices: [
          'It is creatively made up but not acceptable as homework.',
          'It is similar to an assignment that he completed in high school.',
          'It isn\'t unusual for students to present reports like this.',
          'It might be true, but the students didn\'t use a telescope.'
        ],
        answer: 0,
        explanation: '先生は You guys have great imaginations!（想像力は見事だ）と笑いつつ、実際に見たものについてやり直せと言った。よくできた作り話だが宿題としては認めない、という評価。'
      },
      {
        q: 'According to the story, all of the following are true EXCEPT',
        choices: [
          'The shorter alien spoke with a strange accent.',
          'Adam and Courtney visited Kepron 12.',
          'Adam and Courtney learned about the cosmos from the aliens.',
          'Mr. Anderson told Adam and Courtney to redo their work.'
        ],
        answer: 1,
        explanation: '背の高い方の宇宙人は「また会えて、君たちがうちの星に来られたら」と言っただけで、二人が Kepron 12 を訪れた事実はない。他の選択肢はすべて本文にある。'
      }
    ]
  },
  {
    id: 'r113',
    title: 'ミツバチはどうやって蜜を作るか',
    level: 4,
    topic: '生物',
    words: 365,
    passage:
      'Everyone knows that honeybees make honey, but how do they actually do it? Honeybees live in colonies, which means that they live with lots of other bees. Beehives, nests made of wax, are the places where they live and store their honey.' + '\n' +
      'Honeybees drink nectar from flowers or other sweet deposits from plants or trees. The honey made by these bees is used to supply the colony with food during the cold winter when there are no flowers to drink from. Thus, these bees not only consume the nectar for nourishment but also bring it home. They have a special organ called a honey stomach which used to carry the food to their colony.' + '\n' +
      'When honeybees come back home, they regurgitate what they have put in their honey stomachs. Other honeybees in the hive come along and help them. They repeatedly eat and regurgitate many times until the product becomes somewhat digested. Next, the bees move the syrupy product into open honeycomb cells. Then they beat their wings to fan it to prevent fermentation. The fanning makes the water evaporate so that the product gets thick enough. Now it cannot easily be attacked by bacteria. Finally, it can be called honey. After this process, honeybees seal up the honeycomb cells with wax until they are hungry. The most impressive part of this process is how seamlessly a bee colony works together. In a colony, there are female worker bees, male drones, and one queen bee. Although there are both male and females in the hive, the majority of the work is done by females. The female worker bees are in charge of taking care of the hive and creating honey. When they are young, they take care of feeding the young bee larvae. When they are older, they go out and bring nectar back to the hive, where they begin making honey. The male drones are responsible for fertilizing the eggs, but require little energy as they spend their time waiting around the hive. The single queen bee is responsible for the colony\'s survival. She is the only female that can lay eggs. The wonderful substance called honey would not exist without the bees\' teamwork.',
    glossary: [
      { w: 'nectar', m: '花の蜜' },
      { w: 'regurgitate', m: '吐き戻す' },
      { w: 'fermentation', m: '発酵' }
    ],
    questions: [
      {
        q: 'What is the main topic of the passage?',
        choices: [
          'The role of the female honeybee',
          'Preventing fermentation in honey',
          'Why honeybees build huge wax nests',
          'How a honeybee colony works to make honey'
        ],
        answer: 3,
        explanation: '本文は蜜の作り方の工程と、働きバチ・雄バチ・女王バチの分業を描き、最後を「ハチのチームワークなしに蜜はない」と結ぶ。コロニーが協力して蜜を作る仕組みが主題。'
      },
      {
        q: 'What can be inferred from the passage about honey?',
        choices: [
          'It\'s not always the same color.',
          'It is only liked by a minority of people.',
          'Watery honey can go bad easily.',
          'It is created and cared for by the queen bee.'
        ],
        answer: 2,
        explanation: '「羽であおいで水分を蒸発させ、十分濃くなると細菌に襲われにくくなる」とある。裏を返せば、水っぽい蜜は傷みやすいと推測できる。'
      },
      {
        q: 'What do honeybees do to prevent fermentation?',
        choices: [
          'Blow air on the honey by waving their wings',
          'Overproduce honey using their legs',
          'Feed the larvae the unfermented honey',
          'Bring the honey to the honeycomb cells'
        ],
        answer: 0,
        explanation: 'they beat their wings to fan it to prevent fermentation（発酵を防ぐために羽ばたいて風を送る）とある。羽で風を送る、が本文どおり。'
      },
      {
        q: 'According to the passage, which of the following is NOT true of honeybees?',
        choices: [
          'They work together in their colony.',
          'They produce honey through a complex process.',
          'The queen bee is responsible for making honey.',
          'The worker bees work both inside and outside of their hive.'
        ],
        answer: 2,
        explanation: '蜜作りを担うのは雌の働きバチで、女王バチの仕事は産卵（コロニーの存続）。「女王バチが蜜作りに責任を持つ」が本文と食い違う。'
      }
    ]
  },
  {
    id: 'r114',
    title: 'ボクシング大会のための欠席願い',
    level: 4,
    topic: '手紙・メール',
    words: 188,
    passage:
      'Dear Mr. Andrews, I am very sorry but I will not be able to attend class on next Wednesday and Friday. As you know, I am on the school boxing team and I have been chosen by Coach McMahon to represent our school at the state boxing finals. I was wondering if you could give me my assignments in advance for the week. I\'ve been enjoying what we\'ve been working on a lot and really do not want to get behind. The tournament will be in Andover beginning on the 27th. I will also be staying in a hotel and training for two days before the competition. Hopefully I\'ll have some extra time to work. Anyway, I am very excited to represent our school. The coach thinks that I have the potential to take first place in my weight class, and I hope it\'s possible! Just as importantly, I hope you\'ll be willing to give me the work in advance so I can do well at the competition AND in school.' + '\n' +
      'Thanks for everything, Mr. Andrews. I apologize again for having to miss those classes. Sincerely, James Howe',
    glossary: [
      { w: 'represent', m: '代表する' },
      { w: 'in advance', m: '前もって' },
      { w: 'potential', m: '潜在能力' }
    ],
    questions: [
      {
        q: 'In the passage, the word represent is closest in meaning to',
        choices: [
          'show',
          'enable',
          'run for',
          'act for'
        ],
        answer: 3,
        explanation: 'represent our school は「学校を代表する」。学校の代わりとして行動する、という意味なので act for（〜の代理を務める）が最も近い。'
      },
      {
        q: 'In the passage, the word potential is closest in meaning to',
        choices: [
          'choice',
          'power',
          'inspiration',
          'responsibility'
        ],
        answer: 1,
        explanation: 'potential は「潜在能力」。コーチが「優勝できる力があると思っている」という文脈なので power（力）が最も近い。'
      }
    ]
  },
  {
    id: 'r115',
    title: 'バレンタインデーのダンスパーティー',
    level: 4,
    topic: 'お知らせ',
    words: 197,
    passage:
      'On Friday, February 15th, the Craftsbury Academy Student Council invites you to attend the annual Valentine\'s Day Dance and Fundraiser in the school gymnasium. Who: Grades 6, 7, and 8 students (students are encouraged to bring guests from other schools) Where: Craftsbury Common Gymnasium When: Friday, February 15th, 7 P.M. until 11:30 P.M. Ticket Price: $5 or more!!' + '\n' +
      'Although the dance will cost 5 dollars per person, any extra money would be appreciated because the money will be going to the 8th grade\'s trip to Washington, D.C. Tickets can be bought from homeroom representatives. The theme for the dance is Valentine\'s Day, so please feel free to bring a date. There will be plenty of slow dances for you two to get close! There will also be a pie-eating contest for those not afraid to get a little dirty. Don\'t forget to bring your appetite and a 2-dollar entrance fee. DJ Whibley will be playing the best tracks all night long. If you would like to request your favorite songs, you can add them to the song list that\'s on the door of the Student Council\'s office.' + '\n' +
      'It\'s going to be an awesome night. Don\'t miss it!',
    glossary: [
      { w: 'fundraiser', m: '資金集めの催し' },
      { w: 'appreciated', m: 'ありがたく思われる' },
      { w: 'appetite', m: '食欲' }
    ],
    questions: [
      {
        q: 'In the passage, the word appreciated is closest in meaning to',
        choices: [
          'unused',
          'insufficient',
          'calculated',
          'well received'
        ],
        answer: 3,
        explanation: 'appreciated は「ありがたく思われる」。上乗せの寄付は8年生の修学旅行資金になるので歓迎される、という文脈。well received（喜んで受け取られる）が最も近い。'
      },
      {
        q: 'In the passage, the word appetite is closest in meaning to',
        choices: [
          'money',
          'hunger',
          'girlfriend',
          'foodstuff'
        ],
        answer: 1,
        explanation: 'appetite は「食欲」。パイ早食いコンテストに「食欲を忘れずに持ってきて」という文脈なので hunger（空腹・食欲）が最も近い。'
      }
    ]
  },
  {
    id: 'r116',
    title: '独立後のラテンアメリカ',
    level: 4,
    topic: '歴史',
    words: 223,
    passage:
      'By 1825, most Latin American countries gained independence from Spain and Portugal. At this time, world power was held by Western countries such as Great Britain, France, and the United States. These countries, particularly the United States, invested a large amount of money in Latin America. Because of this, Latin America became dependent on the United States politically and economically.' + '\n' +
      'In addition to foreign intervention, Latin America suffered from inner conflicts. Many countries were formed, but these newly formed countries split up because of struggle over control of the state. Latin American national resources were exported to other countries. This allowed for a group of very rich people to develop, but this group did not care about creating democracies in their countries.' + '\n' +
      'The political and economic troubles resulted in caudillos. Caudillo is a Spanish word that refers to a leader whose power is connected to his military skill. They took over the unstable and corrupt democracies in place. Most politicians were conservative and believed that the old system — of a very rich group who ruled all - was the best system. During this time, Latin America was in a position to supply the world with many raw materials, and politicians and officials were mainly interested in making sure their countries had a place in the world economy, rather than solving domestic disunion.',
    glossary: [
      { w: 'intervention', m: '介入' },
      { w: 'caudillo', m: 'カウディーリョ（軍事指導者）' },
      { w: 'disunion', m: '分裂' }
    ],
    questions: [
      {
        q: 'In the passage, the word conflicts is closest in meaning to',
        choices: [
          'truths',
          'powers',
          'experiences',
          'disagreements'
        ],
        answer: 3,
        explanation: 'conflicts は「争い・対立」。inner conflicts（国内の争い）として、国の支配をめぐる struggle が続く文脈なので disagreements（不和・対立）が最も近い。'
      },
      {
        q: 'In the passage, the word unstable is closest in meaning to',
        choices: [
          'weak',
          'strong',
          'large',
          'shaky'
        ],
        answer: 3,
        explanation: 'unstable は「不安定な」。カウディーリョが乗っ取った democracies を形容する語で、shaky（ぐらついた）が最も近い。weak は意味が広すぎる。'
      }
    ]
  },
  {
    id: 'r117',
    title: '花はどうして生まれたか',
    level: 4,
    topic: '生物',
    words: 299,
    passage:
      'Plants on Earth have not always been the way they are today. In fact, the beautiful flowers and fruit-bearing plants that are a part of our world did not evolve until long after the initial development of plants. The first plants on Earth were aquatic and the simple adaptation of spores allowed them to move onto land. These spore-bearing plants could simply produce › spores, which are genetic copies, to scatter around them. Eventually, plants grew casings and coverings to protect the spores from environmental damage. These protections were seeds. For a long time, it was a great mystery as to how flowering plants developed from these seed-bearing plants. Today, scientists are able to explain it on the molecular level, which is difficult for most people to understand. It is obvious, however, that the development of flowering plants was directly related to the need to have animals and insects involved in the process of reproduction. Animals and insects that are attracted to the scents and colors of flowers serve as pollinators and aid in the reproduction process. One theory is that flowers evolved in an isolated setting, such as on an island. In a very specific setting, a plant could develop a symbiotic relationship with an animal or an insect. This sort of relationship can lead to an evolutionary development and change. For example, a huge water lily in the Amazon traps diving beetles by closing while the beetles are sucking its nectar. This is done to make sure that the beetles are covered with pollen. After one night, the water lily releases the insects and turns from white to pink. This pink color is not attractive to the beetles. As the beetles go off to look for other white water lilies, they fertilize the flowers on their way.',
    glossary: [
      { w: 'spore', m: '胞子' },
      { w: 'pollinator', m: '花粉を運ぶ生き物' },
      { w: 'symbiotic', m: '共生の' }
    ],
    questions: [
      {
        q: 'In the passage, the word initial is closest in meaning to',
        choices: [
          'basic',
          'earliest',
          'scientific',
          'interesting'
        ],
        answer: 1,
        explanation: 'initial は「最初の」。the initial development of plants（植物の最初の発達）という文脈なので earliest（最も早い）が最も近い。'
      },
      {
        q: 'In the passage, the word isolated is closest in meaning to',
        choices: [
          'condensed',
          'evolutionary',
          'set apart',
          'experimented on'
        ],
        answer: 2,
        explanation: 'isolated は「孤立した」。such as on an island（島のような）と例が続くので set apart（切り離された）が最も近い。'
      }
    ]
  },
  {
    id: 'r118',
    title: 'ハリー・ポッターの映画を見て',
    level: 4,
    topic: '手紙・メール',
    words: 185,
    passage:
      'Dear Jackie, Last weekend I went to the movies and saw the new Harry Potter movie. I was afraid I wouldn\'t like it, but it was great! The scenes were vivid and I really liked all the actors that were playing my favorite characters. They did a great job behaving just like the characters in the book.' + '\n' +
      'It was really fun to compare how I imagined the book with the way the director did on film. He did a great job and it was nice seeing it all happening on the big screen. His version of the three-headed dog was exactly what I imagined in my head while I was reading! After the movie, my friends and I all went out to eat. They bought me dinner because I paid for their movie tickets. Anyway, I\'m so happy that there are going to be more Harry Potter movies in the future. I can\'t wait to go and see them. Maybe we can go together if you\'re ever back in New York. Have you seen the movie yet? If so, what did you think? Sincerely, Jane',
    glossary: [
      { w: 'vivid', m: '鮮やかな' },
      { w: 'character', m: '登場人物' },
      { w: 'version', m: '解釈・版' }
    ],
    questions: [
      {
        q: 'In the passage, the word They refers to',
        choices: [
          'movie actors',
          'film directors',
          'movie scenes',
          'book characters'
        ],
        answer: 0,
        explanation: 'They did a great job behaving just like the characters in the book（本の登場人物そっくりに演じた）の主語なので、直前の「お気に入りの登場人物を演じた俳優たち」を指す。'
      },
      {
        q: 'In the passage, the word He refers to',
        choices: [
          'a movie star',
          'his imagination',
          'the film director',
          'a movie character'
        ],
        answer: 2,
        explanation: 'He did a great job の He は、前文の「本の想像と the way the director did on film を比べるのが楽しかった」の director（映画監督）を指す。'
      }
    ]
  },
  {
    id: 'r119',
    title: '自由時間にビリヤード台を',
    level: 4,
    topic: '学校生活',
    words: 351,
    passage:
      'During my last couple of years as a student here at Union High, I have noticed that there is nothing to do during our occasional free periods. Hanging around in the hallways or in the library with friends isn\'t productive or relaxing. The student body council noticed this as well and brought it to the attention of Mr. Swanson and the rest of the faculty. A meeting to discuss the issue occurred last Friday, February 10th, in the all-school meeting room. The faculty not only agreed that there wasn\'t much to do during these free periods, but also seemed determined to find a solution. The student body council and the faculty talked about different ideas for a long time. The faculty had noticed that some students don\'t like using their free periods for studying. Instead, they spend their time disrupting the students who want to study by being noisy in the library. By the end of the meeting, the faculty had decided to put a pool table and a ping pong table in our student lobby at the start of next semester.' + '\n' +
      'I know some people will be concerned about getting their work done with these potential distractions, but I believe this will help us all in enjoying our time at school. I agree that it\'s important to complete our work but it is just as important to enjoy ourselves and to relax with our friends. School is already such a stressful place. It makes many students feel worried and anxious. We want our school to be a friendly place so that students want to come every day. Students should remember that this change will make the library a lot quieter. Because of this, the students who want to study will be able to do so in peace. To all the students at Union High, I sincerely hope that you enjoy the new additions to our lobby. Hopefully they will make our free periods a lot more relaxing. If you happen to have one of the same free periods as I do, then please challenge me to a game of pool!',
    glossary: [
      { w: 'free period', m: '空き時間' },
      { w: 'disrupt', m: '邪魔をする' },
      { w: 'distraction', m: '気を散らすもの' }
    ],
    questions: [
      {
        q: 'In the passage, the word they refers to',
        choices: [
          'some students',
          'students studying in the library',
          'faculty members',
          'student body council members'
        ],
        answer: 0,
        explanation: 'they spend their time disrupting the students who want to study の they は、直前の文の some students don\'t like using their free periods for studying（空き時間に勉強したがらない一部の生徒）を指す。'
      },
      {
        q: 'In the passage, the word they refers to',
        choices: [
          'free periods',
          'new additions',
          'our friends',
          'all the students'
        ],
        answer: 1,
        explanation: 'Hopefully they will make our free periods a lot more relaxing の they は、直前の文の the new additions to our lobby（ロビーへの新しい設備＝ビリヤード台と卓球台）を指す。'
      }
    ]
  },
  {
    id: 'r120',
    title: 'サハラ砂漠の生き物',
    level: 4,
    topic: '環境',
    words: 246,
    passage:
      'The Sahara Desert is the world\'s largest hot desert. The Sahara is in North Africa and is as large as the United States. Many people think that an area like this has no animals or plant life, but they are incorrect. In fact, the Sahara Desert has many different "ecoregions." Each ecoregion has different plants and animals living there. The biggest ecoregion is called the "Sahara Desert ecoregion." In this area, the climate is extremely dry and extremely hot. The landscape is sandy and dusty with many high dunes.' + '\n' +
      'Because the Sahara Desert ecoregion is so hot and dry, there are very few plants and animals. Scientists estimate that there are only 500 species of plants. This is not very much when thinking of how enormous the region is. These plants include acacia trees, palms, spiny shrubs, and grasses. The Sahara is also home to 70 species of mammals. Twenty of these are large mammals. There are about 90 species of birds and around 100 reptiles. The biggest threat to plants and animals in this environment is drying up. Because of this, plants have the ability to recover their health after their leaves have dried out completely. Animals can lose 30-60% of their body mass and still survive. Most animals do not get their water from drinking like in other ecosystems. Instead, they have adapted to get their water through metabolic processes. This is why they can survive in a place like the Sahara Desert ecosystem.',
    glossary: [
      { w: 'ecoregion', m: '生態区' },
      { w: 'dune', m: '砂丘' },
      { w: 'metabolic', m: '代謝の' }
    ],
    questions: [
      {
        q: 'In the passage, the word they refers to',
        choices: [
          'animals',
          'people',
          'areas',
          'plant lives'
        ],
        answer: 1,
        explanation: 'Many people think that an area like this has no animals or plant life, but they are incorrect の they は、文の主語である Many people（多くの人々）を指す。'
      },
      {
        q: 'In the passage, the word these refers to',
        choices: [
          'dry homes',
          'desert species',
          'large mammals',
          'seventy kinds of mammals'
        ],
        answer: 3,
        explanation: 'The Sahara is also home to 70 species of mammals. Twenty of these are large mammals の these は、直前の「70種の哺乳類」を指す。そのうち20種が大型、という意味。'
      }
    ]
  },
  {
    id: 'r121',
    title: 'ピラミッドの謎',
    level: 4,
    topic: '歴史',
    words: 328,
    passage:
      'Pyramids are structures that were built by many ancient civilizations. Pyramids have been found in China, France, Mexico, Greece, India, and Egypt.' + '\n' +
      'The purposes of these ancient pyramids are not all the same. Some were built for rituals, some for ceremony, and others as tombs for the nobility. The most famous and notable pyramids are the Great Pyramids in Giza, Egypt. They are three pyramids which were built by three pharaohs around 5,000 years ago. The oldest one is considered one of the Seven Wonders of the World.' + '\n' +
      'The structures of these pyramids required serious engineering and careful architectural planning, along with many skilled laborers. Not only are the pyramids massive in size, but they were also built in relation to the night sky. One of the narrow tunnels from the King\'s burial chamber in the oldest pyramid points directly to a constellation associated with Osiris, the Egyptian god of resurrection. Also, a tunnel from the Queen\'s burial chamber points to a star associated with Isis, the wife of Osiris. This is an impressive architectural feat. The pyramids were built from colossal blocks made from huge stones chiseled with copper from stone quarries. These blocks were then moved into position, although there is archeological disagreement about what methods ancient builders used to do this. It is difficult for archeologists to figure out how Ancient Egyptians could move these heavy stones. Without modern technology, it is hard to imagine how it was possible. Even so, we can get hints from artifacts left behind by Ancient Egyptians. Ancient drawings have revealed that the sheer number of workers could have made this possible. These pictures show that many men pulling a stone could have moved it. The writings of Herodotus also provide information about how the pyramids were built, citing a system of stairs and cranes. Scientists continue to study the pyramids in hopes of eliminating some of the mystery. Still, there are many questions about the pyramids that go unanswered.',
    glossary: [
      { w: 'ritual', m: '儀式' },
      { w: 'constellation', m: '星座' },
      { w: 'colossal', m: '巨大な' }
    ],
    questions: [
      {
        q: 'In the passage, the word Some refers to',
        choices: [
          'the rituals',
          'the purposes',
          'the pyramids',
          'the civilizations'
        ],
        answer: 2,
        explanation: 'The purposes of these ancient pyramids are not all the same. Some were built for rituals の Some は「ピラミッドのあるものは」の意味。目的ではなくピラミッド自体を指す。'
      },
      {
        q: 'In the passage, the word it refers to',
        choices: [
          'a man',
          'a stone',
          'a worker',
          'a drawing'
        ],
        answer: 1,
        explanation: 'many men pulling a stone could have moved it の it は、同じ文の a stone（引いていた石）を指す。大勢で引けば石を動かせた、という意味。'
      }
    ]
  },
  {
    id: 'r122',
    title: 'アル・カポネの実像',
    level: 4,
    topic: '伝記',
    words: 265,
    passage:
      'Al "Scarface" Capone will forever be famous for his place in American movies, but who was the real man behind the Hollywood creation? Alphonse Gabriel Capone was born in Brooklyn, New York in 1899. Capone was a promising student but had trouble following the rules. At the age of fourteen he was expelled for causing violence at school. After that, he never went back. As a young man he joined local gangs and used his wit and courage to work himself up. It didn\'t take long before he became a major force in the world of organized crime.' + '\n' +
      'When alcohol was made illegal in the U.S., Capone started to make a lot of money. He moved to Chicago, where he brought alcohol down from Canada to sell for a very large profit in the United States. He made lots of money and he also made lots of enemies. He was attacked so many times that he had a bulletproof car built for himself. When he was arrested years later, the car was taken and used by President Roosevelt as his limousine. In 1931, Capone was indicted for violation of income tax laws. He had made and spent a lot of money but failed to ever pay any government taxes. He was convicted and was sentenced to 1l years in jail, some of which were served in the famous Alcatraz prison. It was to be the end of his crime days. When he was finally released from prison, he was too sick to continue his life of crime. He died in 1947 while living in Florida.',
    glossary: [
      { w: 'expel', m: '退学させる' },
      { w: 'indict', m: '起訴する' },
      { w: 'conviction', m: '有罪判決' }
    ],
    questions: [
      {
        q: 'Why is Capone\'s causing violence at school mentioned in paragraph 1?',
        choices: [
          'To define the school rules in his time',
          'To explain why he owned a bulletproof car',
          'To show how famous a character he was in American movies',
          'To give an example of how he had trouble following the rules'
        ],
        answer: 3,
        explanation: '直前に Capone was a promising student but had trouble following the rules（有望だが規則を守れなかった）とあり、退学の一件はその具体例として挙げられている。'
      },
      {
        q: 'Why does the author talk about Capone\'s bringing alcohol from Canada in paragraph 2?',
        choices: [
          'To justify Capone\'s life of crime',
          'To explain how he became rich',
          'To show why Capone was indicted',
          'To prove that Capone did not pay taxes'
        ],
        answer: 1,
        explanation: '第2段落は「禁酒法で大金を稼ぎ始めた」ことの説明としてカナダからの酒の密輸を挙げている。どうやって金持ちになったかを説明するため。'
      }
    ]
  },
  {
    id: 'r123',
    title: '集団の中の人間心理',
    level: 4,
    topic: '社会',
    words: 237,
    passage:
      'Studies about social groups are a very interesting aspect of psychology because they show how differently people act when they are influenced by the thoughts and emotions of others. Studies have found that different people respond differently to group situations. When placed in a group, some people tend to dominate; they are natural leaders. However, the majority of people take a passive role.' + '\n' +
      'When in a group, most people rarely work as hard as they do alone. This phenomenon is known as "social loafing." There are several explanations for why it occurs, but mainly it\'s because the responsibility and the reward are divided in more ways. People are more willing to let others do the work for them and rely on other people. When people are alone, they have to take care of themselves. This gives them incentive to work harder. Also, when people are in groups they tend to adopt the opinions of the people that they are with. Time and again studies have shown that people forget themselves and act on the will of the group rather than sticking to their own principles. This is called the "conformity pressure," and very few people can honestly say that they do not fall prey to this. If someone is in a group of people who love the theatre, they will not tell them how much they hate it for fear of being left out of the group.',
    glossary: [
      { w: 'dominate', m: '支配する' },
      { w: 'social loafing', m: '社会的手抜き' },
      { w: 'conformity', m: '同調' }
    ],
    questions: [
      {
        q: 'Why does the author mention the responsibility and the reward being divided in more ways?',
        choices: [
          'To clarify group work\'s effectiveness',
          'To explain the cause of social loafing',
          'To discuss the benefits and drawbacks of groups',
          'To show how group work negatively affects people'
        ],
        answer: 1,
        explanation: '「責任と報酬がより多くに分割される」は、直前の social loafing（集団だと手を抜く現象）が起こる主な理由として挙げられている。原因の説明。'
      },
      {
        q: 'Why is someone in a group that loves the theatre mentioned in the passage?',
        choices: [
          'To indicate people stick to their principles',
          'To describe the result of conformity pressure',
          'To explain to whom conformity pressure occurs',
          'To give an example of how conformity pressure works'
        ],
        answer: 3,
        explanation: '演劇好きの集団の例は、直前で説明した conformity pressure（同調圧力）が実際にどう働くかを示す具体例。仲間外れを恐れて本音を言わない、という働き方を示す。'
      }
    ]
  },
  {
    id: 'r124',
    title: '鳥の声の使い分け',
    level: 4,
    topic: '生物',
    words: 226,
    passage:
      'Bird vocalization is the term used to describe the sounds that birds make. There are many different types of bird vocalization, but they are mainly divided into two general categories: songs and calls. They are distinguished from one another by length, inflection, and context.' + '\n' +
      'Birds make these sounds for a variety of reasons. Songs which are relatively long and more continuous usually indicate mating, while short and simple calls are often used for alerting the flock of danger and keeping the flock together. Commonly, the male bird is the one that delivers songs in order to attract the female. It is very likely that the quality of songs is connected to a bird\'s genetic health. Calls are used as alarms to warn of predators or bad weather. These alarms can be understood not only by birds of the same species, but also other birds and animals. Sometimes calls are used for finding individual birds, evident from adult birds that use calls to find their chicks. There are many other bird sounds that have unclear purposes. For example, "duetting" is the term for when two birds call at the same time using the same sounds. Some species of birds can sing so in sync that it is impossible to distinguish the two birds. Scientists present numerous theories, but the reason why certain birds do duetting remains unclear.',
    glossary: [
      { w: 'vocalization', m: '発声' },
      { w: 'inflection', m: '抑揚' },
      { w: 'duetting', m: 'デュエット（同時鳴き）' }
    ],
    questions: [
      {
        q: 'The author mentions songs and calls in paragraph 2 in order to',
        choices: [
          'introduce the idea of long songs and short calls',
          'give an example of the different types of bird calls',
          'demonstrate how beautiful bird songs are to the human ear',
          'show that those two types of sounds have different purposes'
        ],
        answer: 3,
        explanation: '第2段落は「長い歌は求愛、短い鳴き声は警戒や群れの維持」と対比している。二種類の声が異なる目的を持つことを示すための言及。'
      },
      {
        q: 'Why does the author mention the male bird in paragraph 2?',
        choices: [
          'To show that males are better at singing',
          'To give an example of what animals can do to mate',
          'To give details about how bird songs aid reproduction',
          'To show that mating songs are more important than alarm calls'
        ],
        answer: 2,
        explanation: '「ふつう雄が歌って雌を引きつける」「歌の質は遺伝的な健康と結びついている」とあり、歌が繁殖にどう役立つかの詳細を述べるために雄鳥に触れている。'
      }
    ]
  },
  {
    id: 'r125',
    title: '減りゆく両生類',
    level: 4,
    topic: '環境',
    words: 248,
    passage:
      'Amphibians are an animal group that includes frogs, toads, salamanders, and newts. These animals live in and out of the water. The number of amphibians on our planet is declining rapidly in both local mass extinctions and population crashes. This is a cause for concern as many scientists believe that humans are responsible.' + '\n' +
      'Since the 1980s, scientists have noticed a decline in amphibian populations. Although many animals are affected by humans, amphibians have been hit particularly hard. Some scientists believe this is because of their two-stage life cycle. Unlike most animals, amphibians live their lives in two distinct stages. The first is aquatic and the second is terrestrial. This means that amphibians are sensitive to environmental changes in the water and on land. They also have permeable skin, which means that toxins and chemicals can easily get into their bodies.' + '\n' +
      'At first, some scientists did not believe that human pollution was the cause for changes in amphibian populations. These scientists believed that every species on Earth goes through natural cycles and changes and that there was not enough long-term data to prove that humans were the problem. In recent years, this has changed. Almost all biologists are concerned about the decline in amphibian populations. They are worried not only because many amphibians may go extinct, but also because these extinctions will affect other plants and animals in ecosystems. They believe that the decline in amphibian populations is a warning to humans to stop polluting and clean up Earth.',
    glossary: [
      { w: 'amphibian', m: '両生類' },
      { w: 'terrestrial', m: '陸生の' },
      { w: 'permeable', m: '透過性の' }
    ],
    questions: [
      {
        q: 'Why does the author mention the two-stage life cycle in paragraph 2?',
        choices: [
          'To show that amphibians are complicated animals',
          'To draw a conclusion about how different animals live',
          'To question scientists\' ability to study amphibians',
          'To explain why amphibians are more at risk than other animals'
        ],
        answer: 3,
        explanation: '二段階の生活環は「水中と陸上の両方の環境変化に敏感」という説明につながる。両生類が他の動物より危険にさらされやすい理由を説明するための言及。'
      },
      {
        q: 'The author discusses amphibian extinctions affecting other plants and animals in paragraph 3 in order to',
        choices: [
          'tell readers to worry about amphibians',
          'illustrate that the extinction of any kind of animal is bad',
          'show that amphibian extinctions are not the only concern',
          'provide an example of other plants and animals going extinct'
        ],
        answer: 2,
        explanation: '「絶滅だけでなく、それが生態系の他の動植物に影響することも心配している」とある。両生類の絶滅そのものだけが問題ではないと示すための言及。'
      }
    ]
  },
  {
    id: 'r126',
    title: 'マサダ砦の物語',
    level: 4,
    topic: '歴史',
    words: 298,
    passage:
      'Mount Masada is an important location in Hebrew history, as it was the last stronghold of Jewish resistance in the Roman Empire. According to legend, the Roman Empire laid siege to Masada in 72 A.D. where the palace fortress of the Jewish people was located. The Romans assumed that their enemies would surrender quickly, but the people of Masada held out for 2 years. Rather than be taken by the Romans, the rebels remained true to their faith and people. They committed suicide in order to evade the troops. In reference to the battle of Masada, historians only have one historical record to go by, the work of Josephus, who wrote in the first century A.D. According to Josephus, there were approximately 1,000 people living in the fortress during the siege. The Romans, however, could only find 7 alive, 2 women and 5 children, when they finally entered the fortress by breaking down the gate. In 1842, the legendary location was found, but it wasn\'t until 1963 that Israeli archeologist Yigael Yadin began excavating the site. Yadin and his team found the remains of many building sites which were originally storehouses, homes, and Jewish chapels called synagogues.' + '\n' +
      'Today, visitors can climb Masada on the treacherous "Snake Path" or ride a cable car to the top. Masada is located on the edge of the desert fronting the Dead Sea, which is very dry and almost completely isolated. Because of this, it stayed undiscovered for almost two thousand years. Visitors are usually very surprised that ancient people were able to build the city atop this lofty mountain and survive for two years without descending for food or water. Masada has a tragic history, but is an incredible and interesting place, one that is worth visiting if you\'re ever in Israel.',
    glossary: [
      { w: 'stronghold', m: 'とりで' },
      { w: 'siege', m: '包囲' },
      { w: 'excavate', m: '発掘する' }
    ],
    questions: [
      {
        q: 'What is the purpose of the passage?',
        choices: [
          'To explain how the Jewish people of Masada perished',
          'To persuade readers to visit Mount Masada in the Israeli desert',
          'To introduce a legendary place called Masada in ancient history',
          'To point out the importance of Yigael Yadin, a Masada\'s archeologist'
        ],
        answer: 2,
        explanation: '本文はマサダの伝説・発掘・現在の観光までを紹介する読み物。古代史の伝説的な場所マサダを紹介すること、が全体の目的。'
      },
      {
        q: 'In the passage, the word They refers to',
        choices: [
          'the rebels',
          'the locations',
          'the Romans',
          'the archeologists'
        ],
        answer: 0,
        explanation: 'They committed suicide in order to evade the troops の They は、直前の文の the rebels（ローマに降伏しなかった反乱者たち）を指す。'
      },
      {
        q: 'In the passage, the word excavating is closest in meaning to',
        choices: [
          'studying',
          'digging',
          'pointing',
          'protecting'
        ],
        answer: 1,
        explanation: 'excavate は「発掘する」。考古学者が遺跡を掘り起こす文脈なので digging（掘ること）が最も近い。'
      },
      {
        q: 'Why does the author mention the desert fronting the Dead Sea?',
        choices: [
          'To prove that Masada is worth visiting',
          'To explain why Masada stayed hidden for a long time',
          'To emphasize how difficult it is to access Masada',
          'To illustrate the beautiful scenery visitors can enjoy at Masada'
        ],
        answer: 1,
        explanation: '「死海に面した砂漠の端にあり、ほぼ完全に孤立している。そのため二千年近く発見されなかった」とある。長く隠れたままだった理由の説明。'
      }
    ]
  },
  {
    id: 'r127',
    title: 'コンタクトレンズの歩み',
    level: 4,
    topic: '技術',
    words: 310,
    passage:
      'Millions of people use contact lenses worldwide. They were made to replace glasses and are very useful because sometimes glasses are inconvenient. In sports, for instance, many athletes wear contact lenses instead of using obnoxious sports goggles because they are much safer. Contact lenses can also be used to correct some conditions that glasses are not capable of fixing. People also use them if they want to change the color of their eyes. One can wear contact lenses every day, or they can be used only once, for example, to have red eyes with a vampire costume. The idea of wearing contact lenses for better vision was first thought of by Leonardo da Vinci in the 1500s. He made sketches but there is no evidence that his design was ever realized. Throughout the 1800s many scientists played with the idea of contact lenses but no one perfected the use of them. The first models were very uncomfortable so they could not be worn for long periods of time. They were not flexible and did not let oxygen get to the eyes so in some cases they caused more problems than they fixed. The earlier versions were also very fragile and expensive, which made them not usable for many people. It wasn\'t until the late 1900s that contact lenses started to be effective and affordable enough for everyone to use. They became more and more popular as people became aware that there was an alternative to wearing glasses. In recent years, people have been developing even more advanced contact lenses. Now they can not only fix poor vision, but can improve good vision. Although contact lenses have become extremely popular over the last few decades, laser technology now allows people to improve their eyesight through a relatively quick, inexpensive, and painless procedure. One day, this technology may phase out contact lenses.',
    glossary: [
      { w: 'obnoxious', m: '不快な・邪魔な' },
      { w: 'fragile', m: '壊れやすい' },
      { w: 'phase out', m: '段階的になくす' }
    ],
    questions: [
      {
        q: 'The author\'s main purpose is to',
        choices: [
          'give a brief history of contact lenses',
          'persuade readers of the convenience of contact lenses',
          'explain how contact lenses improve people\'s vision',
          'prove the risk of wearing contact lenses for better looks'
        ],
        answer: 0,
        explanation: '本文はダ・ヴィンチの構想から現代のレーザー手術まで、コンタクトレンズの歴史を順に述べている。簡単な歴史を伝えること、が主目的。'
      },
      {
        q: 'In the passage, the word alternative is closest in meaning to',
        choices: [
          'option',
          'upgrade',
          'solution',
          'purchase'
        ],
        answer: 0,
        explanation: 'alternative は「代わりの選択肢」。眼鏡の代わりがあると人々が知った、という文脈なので option（選択肢）が最も近い。'
      },
      {
        q: 'In the passage, the word They refers to',
        choices: [
          'the eyes',
          'the scientists',
          'the drawings',
          'the first models'
        ],
        answer: 3,
        explanation: 'They were not flexible and did not let oxygen get to the eyes の They は、直前の文の The first models（初期のコンタクトレンズ）を指す。'
      },
      {
        q: 'Why does the author mention athletes in the passage?',
        choices: [
          'To explain that some sports do not allow glasses',
          'To show that athletes are concerned for their health',
          'To illustrate the development of today\'s contact lenses',
          'To give an example of the usefulness of contact lenses'
        ],
        answer: 3,
        explanation: 'スポーツ選手の例は「眼鏡では不便な場面がある」ことの実例。コンタクトレンズの有用性を示すために挙げられている。'
      }
    ]
  },
  {
    id: 'r128',
    title: 'モリーの放課後スケジュール',
    level: 4,
    topic: '日常生活',
    words: 88,
    passage:
      'Molly was having trouble finding time to do her schoolwork because of all her activities, so she decided to make a schedule showing when she has free time. Writing everything down showed her that she has more time than she thought.' + '\n' +
      'Molly\'s After-School Activities' + '\n' +
      'Monday — 3:00-4:30 P.M.: Soccer Practice / 6:30-7:00 P.M.: Clarinet Lesson.' + '\n' +
      'Tuesday — 3:00-4:30 P.M.: Volunteering at Shelter (every other week) / 5:00-6:00 P.M.: Math Tutoring.' + '\n' +
      'Wednesday — 3:00-4:30 P.M.: Soccer Practice.' + '\n' +
      'Thursday — 5:00-6:00 P.M.: Math Tutoring.' + '\n' +
      'Friday — 3:00-4:30 P.M.: Soccer Practice.',
    glossary: [
      { w: 'schedule', m: '予定表' },
      { w: 'tutoring', m: '個別指導' },
      { w: 'every other week', m: '隔週で' }
    ],
    questions: [
      {
        q: 'What activities does Molly do more than once a week?',
        choices: [
          'Having a math tutoring session and volunteering',
          'Volunteering and having a clarinet lesson',
          'Having a math tutoring session and going to soccer practice',
          'Having a clarinet lesson and going to soccer practice'
        ],
        answer: 2,
        explanation: '表からサッカー練習は月・水・金の週3回、数学の個別指導は火・木の週2回。週に2回以上あるのはこの二つ。クラリネットは週1回、ボランティアは隔週。'
      },
      {
        q: 'What would Molly probably be doing on Tuesday at 4:45 P.M.?',
        choices: [
          'Going to math tutoring',
          'Volunteering at the shelter',
          'Staying home for the night',
          'Preparing for soccer practice'
        ],
        answer: 0,
        explanation: '火曜のボランティアは4:30に終わり、数学の個別指導が5:00に始まる。4:45はその間なので、個別指導へ向かっているところだと考えられる。'
      },
      {
        q: 'At what time is Molly\'s musical activity?',
        choices: [
          '3:00 P.M. on Friday',
          '4:30 P.M. on Tuesday',
          '6:30 P.M. on Monday',
          '5:00 P.M. on Wednesday'
        ],
        answer: 2,
        explanation: '音楽の活動はクラリネットのレッスンで、表では月曜の6:30〜7:00。'
      },
      {
        q: 'What will happen every other week?',
        choices: [
          'Molly will go to soccer practice on Friday.',
          'Molly won\'t need math tutoring on Tuesday.',
          'Molly might miss her clarinet lesson on Monday.',
          'Molly will volunteer at the shelter on Tuesday.'
        ],
        answer: 3,
        explanation: '表の脚注に *signifies every other week（＊は隔週の意味）とあり、＊が付いているのは火曜のボランティア。隔週で起こるのは火曜に保護施設でボランティアをすること。'
      }
    ]
  },
  {
    id: 'r129',
    title: '作文コンテストの添削のお願い',
    level: 4,
    topic: '手紙・メール',
    words: 228,
    passage:
      'Dear Mr. Stevens, I\'m proud to tell you that I\'ve finally finished my essay for the city contest. I feel really satisfied with it. I was just about to submit it when I saw that I\'m required to turn in a copy that\'s been graded by an English teacher.' + '\n' +
      'Since you recommended the contest to me, I was hoping that you\'d be willing to take a look at the essay. The essay wasn\'t written specifically for your class, but I know you\'ll give me useful feedback. It\'s not very long and I\'d really appreciate it. If you don\'t think you have time to do it, do you have any recommendations for a teacher that might? The contest rules aren\'t specific. They simply say that the essay has to be graded by an English teacher teaching in the Waring school system. I just moved to Waring at the start of this year, so I don\'t know any teachers besides you. I think my old teachers would be happy to grade it, but they don\'t work in Waring. Plus, I\'m not in contact with them anymore.' + '\n' +
      'I\'d be happy to e-mail you my essay or print out a copy and give it to you at school. I understand that you\'re busy, but hope that you can help me out. I\'d really like to enter this contest. Thank you.' + '\n' +
      'Sincerely, Jessica',
    glossary: [
      { w: 'submit', m: '提出する' },
      { w: 'grade', m: '採点する' },
      { w: 'feedback', m: '講評' }
    ],
    questions: [
      {
        q: 'Why did Jessica write this e-mail?',
        choices: [
          'To be friendly with her teacher',
          'To win a very important contest',
          'To get her essay graded by a teacher',
          'To remind the teacher that she\'s a new student'
        ],
        answer: 2,
        explanation: '「提出には英語教師の採点済みの写しが必要だとわかった」ので先生に見てほしい、というのが用件。作文を先生に採点してもらうため、が目的。'
      },
      {
        q: 'In the passage, the word specific is closest in meaning to',
        choices: [
          'good',
          'exact',
          'correct',
          'helpful'
        ],
        answer: 1,
        explanation: 'specific は「具体的な・明確な」。コンテストの規定が細かく決まっていない、という文脈なので exact（正確な・厳密な）が最も近い。'
      },
      {
        q: 'In the passage, the word them refers to',
        choices: [
          'old teachers',
          'all teachers',
          'contest judges',
          'Mr. Stevens and Jessica'
        ],
        answer: 0,
        explanation: 'I think my old teachers would be happy to grade it, but they don\'t work in Waring... I\'m not in contact with them anymore の them は、前の学校の先生たち（old teachers）を指す。'
      },
      {
        q: 'According to the e-mail, which of the following is NOT true of Jessica?',
        choices: [
          'She changed school early this year.',
          'Her essay was written while she was in Waring.',
          'She has asked other teachers to grade her essay.',
          'Mr. Stevens encouraged her to join a city writing contest.'
        ],
        answer: 2,
        explanation: 'ジェシカは「あなた以外の先生を知らない」と書いており、他の先生に採点を頼んだ事実はない。転校・ウォリングで書いた作文・先生の勧めはすべて本文にある。'
      }
    ]
  },
  {
    id: 'r130',
    title: '州大会三連覇とエースの旅立ち',
    level: 4,
    topic: '学校生活',
    words: 292,
    passage:
      'Last week, the girls\' Bromson Hill soccer team won the state championship, confirming that the team is the best in the league. This is the third year that Bromson Hill has won, exciting both the team and the fans. This year, the team was challenged in a close game against Freeport. The final score was 3-2. All three goals were scored by senior Alison Levin, who was elected MVP of the league after the championship. Indeed, Levin\'s four years at Bromson Hill have shown that she is a star.' + '\n' +
      'Levin is humble about her skill, making sure that everyone knew it was the team, not her, who led Bromson Hill to victory. "We couldn\'t have done it without each other," she said. "There are 11 players on the field and each one is important." As for the MVP award, Levin simply felt ecstatic. "My eyes teared up when they called my name," she said. Once she was on the stage to collect her award, she announced to the audience, "I\'d like to thank my team and my coach for this honor. It\'s been a great year!" Bromson Hill\'s coach Jessica Wallis along with Levin\'s teammates feel a bit differently about Alison, whom they call "Al." "Al is number one in the league. She\'ll be shy about it, but we owe this win to her. She\'s been an inspiration to all of us on the team. It will be sad to see her go next year," said Brittany Clark, a defender that plays for Bromson Hill. Although Alison will miss the Bromson Hill team, she\'s excited about the prospect of playing in college. Alison will be playing for the University of Virgil women\'s team, which is one of the best in the country.',
    glossary: [
      { w: 'humble', m: '謙虚な' },
      { w: 'ecstatic', m: '有頂天の' },
      { w: 'prospect', m: '見込み・期待' }
    ],
    questions: [
      {
        q: 'What would be the most suitable headline for the article?',
        choices: [
          'Bromson Hill Star Leads Team to Win',
          'Coach Jessica Wallis Is Proud of Victory',
          'Bromson Hill Is the Best in the League',
          'University of Virgil Accepts Bromson Hill Student'
        ],
        answer: 0,
        explanation: '記事は3得点すべてを挙げて MVP になったアリソン・レヴィンを中心に優勝を伝えている。「ブロムソン・ヒルのスターがチームを勝利に導く」が最も内容に合う見出し。'
      },
      {
        q: 'What is suggested about Alison Levin in the article?',
        choices: [
          'She isn\'t a prideful person.',
          'She respects her coach, Jessica.',
          'She didn\'t deserve the MVP award.',
          'She believes that the victory was hers.'
        ],
        answer: 0,
        explanation: 'Levin is humble about her skill（自分の実力に謙虚）で、勝利はチームのものだと強調している。うぬぼれた人ではない、が本文から言えること。'
      },
      {
        q: 'Based on her comments, what is Brittany Clark probably worried about?',
        choices: [
          'Alison doing poorly in college',
          'The coach getting angry at the team',
          'The team losing strength next year',
          'Getting extremely depressed without Alison'
        ],
        answer: 2,
        explanation: 'クラークは「来年彼女がいなくなるのは寂しい」と述べている。エースが抜けた来年、チームの力が落ちることを心配していると考えられる。'
      },
      {
        q: 'In the passage, the word ecstatic is closest in meaning to',
        choices: [
          'joyful',
          'grateful',
          'doubtful',
          'dissatisfied'
        ],
        answer: 0,
        explanation: 'ecstatic は「有頂天の」。MVP に名前を呼ばれて目が潤んだ、という喜びの文脈なので joyful（喜びに満ちた）が最も近い。'
      },
      {
        q: 'In the passage, the word prospect is closest in meaning to',
        choices: [
          'fear',
          'success',
          'surprise',
          'expectation'
        ],
        answer: 3,
        explanation: 'prospect は「見込み・これからの期待」。大学でプレーすることへの excited という文脈なので expectation（期待）が最も近い。'
      },
      {
        q: 'Why does the author mention that Alison Levin\'s eyes teared up at the league awards ceremony?',
        choices: [
          'To show that she felt a lot of emotion',
          'To explain her anger that her team wasn\'t recognized',
          'To describe the pain in her leg at the last soccer game',
          'To prove that she was unhappy about winning the award'
        ],
        answer: 0,
        explanation: '目が潤んだ描写は、受賞の瞬間に彼女が強い感情を抱いたことを示すためのもの。怒りや痛み、不満の描写ではない。'
      }
    ]
  },
  {
    id: 'r131',
    title: 'ダンスチームの一年',
    level: 4,
    topic: '学校生活',
    words: 404,
    passage:
      'Sandy and I could not believe how lucky we were to get picked for the dance team. We both tried out but never expected to make it.' + '\n' +
      'Sandy was so excited that when she saw the roster she dragged me across the whole school and made me late for math class just to show it to me. "I\'m so happy, I\'m so happy!" she kept saying over and over and I was too. Being on the dance team was a lot of hard work. We had tough practices every day after school for three hours. We would start with stretches and then go into our routines. "Let\'s go! Move it!" our coach would yell.' + '\n' +
      'He was a good coach, but he was strict. He made all of us work very hard. Over time, Sandy and I improved. Our coach noticed.' + '\n' +
      '"You girls have done a great job so far this year. I want to send you to New York City to represent our school in the state championships. I think you will be a great team, but I need you to keep working hard," he said smiling.' + '\n' +
      'We both started shouting in exultation and the other girls congratulated us. It was a big moment.' + '\n' +
      'Through the next weeks we trained harder than ever before and pretty soon it was the weekend of the championships.' + '\n' +
      '"Are you ready?" Our coach asked us on the trip to the city. "I am feeling great!" I said, but Sandy did not say anything. We both waited for a moment and then she said, "I am very nervous. What if we make a mistake?"' + '\n' +
      'Our coach laughed and said, "Of course you will make a mistake but just try hard, do the best you can, and I will be happy. Mistakes happen but you need to keep going. That\'s what is important."' + '\n' +
      'The tournament was great but there were a lot of really good dancers so we didn\'t win. Our parents were still excited though, and our coach was happy. After the competition we got to have dinner in the big city and our coach gave us medals, even though we didn\'t win anything.' + '\n' +
      '"What are these for?" I asked.' + '\n' +
      '"For being great dancers and for all of the hard work that you girls have done," he said beaming, "and for making me the happiest coach in the State of New York. I cannot wait for next year\'s competition."',
    glossary: [
      { w: 'roster', m: 'メンバー表' },
      { w: 'routine', m: '（ダンスの）一連の振り付け' },
      { w: 'exultation', m: '大喜び' }
    ],
    questions: [
      {
        q: 'What is the story mainly about?',
        choices: [
          'The New York City dance championship',
          'The hardship of being dance team members',
          'The two girl students\' dance team experience',
          'The two girl students being chosen as best dancers of the year'
        ],
        answer: 2,
        explanation: '物語は二人がチームに選ばれてから、猛練習・州大会出場・敗退とメダルまでを描く。二人の少女のダンスチームでの経験、が全体の主題。'
      },
      {
        q: 'Why does Sandy drag the author across the whole school?',
        choices: [
          'To meet the team coach',
          'To get to the daily dance practice',
          'To show that they both made the team',
          'To try out for the dance team together'
        ],
        answer: 2,
        explanation: 'サンディは the roster（メンバー表）を見せるために作者を引っ張っていった。二人ともチームに入れたことを見せるため。'
      },
      {
        q: 'In the passage, what does the author mean by go into our routines?',
        choices: [
          'Do hard exercises',
          'Practice for the championship',
          'Start practicing their dances',
          'Finish stretching their bodies'
        ],
        answer: 2,
        explanation: 'go into our routines は「ストレッチのあと振り付けの練習に入る」という流れの中の表現。自分たちのダンスの練習を始める、という意味。'
      },
      {
        q: 'Which word best describes the girls\' reaction to being sent to New York City?',
        choices: [
          'Excited',
          'Nervous',
          'Interested',
          'Disappointed'
        ],
        answer: 0,
        explanation: 'ニューヨーク行きを告げられた二人は shouting in exultation（大喜びで叫んだ）。Excited（興奮した・喜んだ）が最もよく合う。'
      },
      {
        q: 'Based on his comments, what does the coach think about the competition?',
        choices: [
          'If the girls work hard, they will win.',
          'Their losing the competition would be a big disappointment.',
          'It\'s most important to try their best.',
          'The girls will win if they don\'t make any mistakes.'
        ],
        answer: 2,
        explanation: 'コーチは「ミスはするものだ。一生懸命やって全力を尽くせば私は満足だ」と言っている。全力を尽くすことが一番大事、というのがコーチの考え。'
      },
      {
        q: 'What will probably happen to Sandy and the author next year?',
        choices: [
          'They will win easily.',
          'They will stop dancing.',
          'They will compete again.',
          'They will help the coach.'
        ],
        answer: 2,
        explanation: 'コーチは最後に「来年の大会が待ちきれない」と言っており、二人も続ける様子。来年また出場するだろうと推測できる。'
      }
    ]
  },
  {
    id: 'r132',
    title: 'ビッグベンド国立公園',
    level: 4,
    topic: '環境',
    words: 227,
    passage:
      'Big Bend National Park in the southwest of Texas is one of the most majestic desert areas in the United States. It is part of the Chihuahua, which is one of the largest deserts in North America and stretches over both America and Mexico.' + '\n' +
      'Big Bend Park is home to mountains, rivers, basins, valleys, as well as many plants and animals. It is not as popular of a national park as some others. This may be because it takes an extremely long time to get there. Big Bend National Park is hundreds of miles from the nearest legitimate town or airport. When people go there, they need to make sure that their cars have plenty of gas. There is a large risk of running out. When visitors get to the park, they are usually happy that they drove all the way. The park is 1,252 square miles of desert beauty. There are beautiful cactus blooms as well as glorious sunsets. The hiking trails are magnificent. Visitors can stay in a lodge that is run by the park or camp with their own equipment. However, visitors should be careful. Even though the park is incredibly hot during the day, the lack of moisture in the air makes the heat dissipate at night. The nights at Big Bend are surprisingly cold. It\'s important to bring a warm sleeping bag.',
    glossary: [
      { w: 'majestic', m: '雄大な' },
      { w: 'basin', m: '盆地' },
      { w: 'dissipate', m: '消散する' }
    ],
    questions: [
      {
        q: 'Which title best summarizes the main idea of the passage?',
        choices: [
          'A Place of Desert Flowers',
          'Cactus Blooms at Big Bend',
          'A National Park to Be Visited',
          'A Desert That Is Cold at Night'
        ],
        answer: 2,
        explanation: '本文は公園の魅力（山や川、サボテンの花、夕日、ハイキング）と行き方の注意を紹介する読み物。「訪れるべき国立公園」が全体をよく表す題。夜の寒さや花は一部の話題。'
      },
      {
        q: 'In the passage, the word lodge is closest in meaning to',
        choices: [
          'bed',
          'inn',
          'cavern',
          'restaurant'
        ],
        answer: 1,
        explanation: 'lodge は「ロッジ・宿泊小屋」。公園が運営する宿に泊まれる、という文脈なので inn（宿屋）が最も近い。'
      },
      {
        q: 'In the passage, the word dissipate is closest in meaning to',
        choices: [
          'destroy',
          'disturb',
          'discover',
          'disappear'
        ],
        answer: 3,
        explanation: 'dissipate は「消散する」。空気が乾いているため熱が夜に消えていく、という文脈なので disappear（消える）が最も近い。'
      },
      {
        q: 'Why does Big Bend get cold at night?',
        choices: [
          'Precipitation usually comes at night.',
          'It is too arid to hold the heat in the air.',
          'The air is too clear and breathable for warmth.',
          'Deserts like Big Bend experience harsh winters.'
        ],
        answer: 1,
        explanation: '「空気中の水分が少ないため熱が夜に消散する」とある。乾燥しすぎて空気が熱を保てないから、が本文どおり。'
      },
      {
        q: 'Which of the following is NOT mentioned about staying overnight at Big Bend?',
        choices: [
          'It\'s better to stay in the lodge.',
          'There are generally two different ways to sleep.',
          'Visitors can bring their own camping equipment.',
          'It\'s too cold outside without a warm sleeping bag.'
        ],
        answer: 0,
        explanation: '「ロッジに泊まるか自前の装備でキャンプするか」と二つの方法を並べているだけで、ロッジの方がよいとは述べていない。'
      },
      {
        q: 'Why don\'t people visit Big Bend more often?',
        choices: [
          'It is too cold for most visitors.',
          'A lot of people don\'t want to visit Texas.',
          'Most cars aren\'t strong enough to get there.',
          'It is very far away from a town or an airport.'
        ],
        answer: 3,
        explanation: '「最寄りのまともな町や空港から何百マイルも離れていて、行くのに非常に時間がかかる」ことが人気が出ない理由として挙げられている。'
      }
    ]
  },
  {
    id: 'r133',
    title: 'イルカのコミュニケーション',
    level: 4,
    topic: '生物',
    words: 259,
    passage:
      'Dolphins are one of the most intelligent species on the planet, which makes them a very interesting animal to scientists. In their natural habitats, dolphins use various vocalization techniques. They whistle and squeak to recognize members of their pod, identify and protect their young, and call out warnings of danger. They also make clicking sounds used for echolocation to find food and obstacles in dark and murky waters. Amazingly, the whistling sound that the bottlenose dolphin makes has been found to have a similar pattern to human language. They always make conversational sounds when they greet each other. If you listen to dolphins\' squeaks and squeals, it will sound like they are having a conversation.' + '\n' +
      'Dolphins usually use both sound and body language to communicate with each other. It is through gesture and body language, however, that most of their communication with humans comes. Dolphins can be trained to perform complicated tricks. This suggests they have a high level of intelligence and communication capacity. If they work for a long time with a trainer, they are able to recognize and understand human commands. A lot of dolphin communication has been studied using dolphins in captive environments. These studies have been criticized because some marine biologists believe that dolphins living in aquariums or research centers cannot be considered "normal." Even so, most believe that studying dolphin communication in captivity is useful for beginning to understand the complexity of dolphin communication. After all, dolphins are one of the most intelligent animals. Their ability to communicate is impressive and worthy of study.',
    glossary: [
      { w: 'echolocation', m: '反響定位' },
      { w: 'captive', m: '飼育下の' },
      { w: 'capacity', m: '能力' }
    ],
    questions: [
      {
        q: 'What would be the most suitable title for the passage?',
        choices: [
          'Intelligent Mammals in Captivity',
          'Complex Patterns in Dolphin Life',
          'Dolphins\' Social Tendencies with Humans',
          'Communications in Dolphins'
        ],
        answer: 3,
        explanation: '本文は鳴き声・身振り・人間との意思疎通・飼育下での研究と、一貫してイルカのコミュニケーションを扱っている。「イルカのコミュニケーション」が最も適切な題。'
      },
      {
        q: 'What are the common ways for a dolphin to communicate?',
        choices: [
          'Swimming speeds',
          'Human voice imitation',
          'Squeaking and squealing sounds',
          'Vocalizations and body language'
        ],
        answer: 3,
        explanation: 'Dolphins usually use both sound and body language to communicate（音と身振りの両方を使う）とある。発声と身振り、が本文どおり。'
      },
      {
        q: 'According to paragraph 4, what do some marine biologists think about captive dolphins?',
        choices: [
          'They can\'t be considered accurate subjects for biological studies.',
          'They can communicate exactly the same as humans do.',
          'They easily demonstrate how dolphins act in the wild.',
          'Their relationships are too personal with marine biologists.'
        ],
        answer: 0,
        explanation: '「水族館や研究センターのイルカは『普通』とはみなせない」という批判が紹介されている。生物学の研究対象として正確とは言えない、という考え。'
      },
      {
        q: 'In the passage, the word vocalization is closest in meaning to',
        choices: [
          'closing eyes',
          'creating words',
          'making gestures',
          'producing sounds'
        ],
        answer: 3,
        explanation: 'vocalization は「発声」。ホイッスルやクリック音などの音を出す技術の話なので producing sounds（音を出すこと）が最も近い。'
      },
      {
        q: 'All of the following are true about dolphin communication EXCEPT',
        choices: [
          'dolphins\' clicking sounds are sometimes used to greet humans',
          'dolphins\' squeals and squeaks sound conversational to the human ear',
          'communication using sounds and gestures occurs between dolphins',
          'body language and gestures are used for communication with humans'
        ],
        answer: 0,
        explanation: 'クリック音は「暗く濁った水中で食べ物や障害物を見つける反響定位」に使うとあり、人間へのあいさつに使うという記述はない。他の選択肢はすべて本文にある。'
      },
      {
        q: 'In the passage, the word most refers to',
        choices: [
          'a few bottlenose dolphins',
          'a lot of bottlenose dolphins',
          'the minority of marine biologists',
          'the majority of marine biologists'
        ],
        answer: 3,
        explanation: 'Even so, most believe that... の most は、直前の文で批判をしている some marine biologists と対比された「海洋生物学者の大多数」を指す。'
      },
      {
        q: 'In the passage, the word capacity is closest in meaning to',
        choices: [
          'ability',
          'probability',
          'simplicity',
          'productivity'
        ],
        answer: 0,
        explanation: 'capacity は「能力」。高い知能とコミュニケーション能力を示唆する、という文脈なので ability（能力）が最も近い。'
      },
      {
        q: 'Why do dolphins use their communication skills with each other?',
        choices: [
          'To prove that they are happy and useful in captivity',
          'To make beautiful music and to find food',
          'To recognize, protect and communicate with each other',
          'To trick humans into thinking they are intelligent'
        ],
        answer: 2,
        explanation: '第1段落に「仲間を識別し、子を守り、危険を知らせるために鳴く」とある。互いを認識し、守り、意思疎通するため、が本文どおり。'
      }
    ]
  },
  {
    id: 'r134',
    title: 'サカガウィアと探検隊',
    level: 4,
    topic: '伝記',
    words: 364,
    passage:
      'Sacagawea was a Shoshone woman who accompanied the first United States expedition to the Pacific Coast. She acted as an interpreter and guide for William Clark and Meriwether Lewis, who were sent to explore the Western United States by President Thomas Jefferson. It is believed that Sacagawea was born in a Shoshone village located near today\'s Idaho in 1788. She was kidnapped at age 12 by a tribe called the Hidatsa who lived near today\'s North Dakota. When she was 13 years old, she was married to a Canadian trader named Toussaint Charbonneau who was living in the village.' + '\n' +
      'During the winter of 1804, Lewis and Clark arrived near the Hidatsa village and built a fort. There, they tried to find people who could help them on their journey. Lewis and Clark decided to hire Charbonneau, knowing that his wife Sacagawea spoke Shoshone. They knew that she could help them when they met the Shoshone later on in their trip. At this time, Sacagawea was pregnant with her first child. She gave birth to a little boy just before embarking on the journey. He would participate in all of the travels and later be adopted by William Clark.' + '\n' +
      'Sacagawea was able to reunite with her people during the expedition. When the group reached the Shoshone village, she found that the chief was her long-lost brother. Clark\'s journal entry tells of their powerful reunion. Indeed, Clark\'s journal hints many times that Sacagawea had a profound effect on the expedition. Clearly, her presence as native guide and as the trip\'s only woman was very important to both Lewis and Clark. It is known that she overcame a lot of obstacles and served as a loyal and keen interpreter for Lewis and Clark. In fact, not much is known about Sacagawea except her role in the expedition. There is little hard evidence to support various beliefs about how she lived after the journey and how and when she died. Sacagawea, however, was used as an icon of American feminism in the early 20th century to arouse the sense of self-worth of women. Because of her ability and accomplishments, she is still admired in the United States today.',
    glossary: [
      { w: 'expedition', m: '探検隊' },
      { w: 'interpreter', m: '通訳' },
      { w: 'profound', m: '深い・重大な' }
    ],
    questions: [
      {
        q: 'Which title best expresses the main idea of the passage?',
        choices: [
          'Sacagawea\'s Devotion to the Shoshone Tribe',
          'Early American Feminism in the Sacagawea Legend',
          'The Life of Sacagawea Shown in William Clark\'s Journal',
          'Sacagawea and Her Role in the Lewis and Clark Expedition'
        ],
        answer: 3,
        explanation: '本文はルイスとクラークの探検におけるサカガウィアの通訳・案内役としての働きを中心に描く。「サカガウィアとルイス・クラーク探検隊における役割」が主題に合う。'
      },
      {
        q: 'In the passage, the word interpreter is closest in meaning to',
        choices: [
          'doctor',
          'mother',
          'writer',
          'translator'
        ],
        answer: 3,
        explanation: 'interpreter は「通訳」。ショショーニ語を話せることが雇われた理由なので translator（翻訳者・通訳）が最も近い。'
      },
      {
        q: 'Why did Lewis and Clark want a Shoshone-speaking guide?',
        choices: [
          'They were interested in making a profit from trading.',
          'They needed someone who had a relationship with the chief.',
          'They knew they would meet the Shoshone during their travels.',
          'They wanted to learn the language so the Shoshone would cooperate.'
        ],
        answer: 2,
        explanation: 'They knew that she could help them when they met the Shoshone later on in their trip（旅の途中でショショーニ族に会うとわかっていた）とある。'
      },
      {
        q: 'The author mentions all of the following EXCEPT',
        choices: [
          'Sacagawea becoming a mother',
          'the marriage of Charbonneau and Sacagawea',
          'Sacagawea reuniting with the Shoshone people',
          'Thomas Jefferson\'s specific goals for the journey'
        ],
        answer: 3,
        explanation: '出産・シャルボノーとの結婚・ショショーニ族との再会はすべて本文にあるが、ジェファーソン大統領の具体的な目的は「西部を探検させた」以上に述べられていない。'
      },
      {
        q: 'What does the author say about Sacagawea\'s death?',
        choices: [
          'It made her a heroine.',
          'It doesn\'t have a clear story.',
          'It was written about by Clark.',
          'It occurred while she was running away.'
        ],
        answer: 1,
        explanation: '「旅の後どう生き、いつどのように死んだかについては、確かな証拠がほとんどない」とある。死ははっきりした記録がない、が本文どおり。'
      },
      {
        q: 'In the passage, the word He refers to',
        choices: [
          'Shoshone chief',
          'Sacagawea\'s son',
          'Sacagawea\'s brother',
          'Sacagawea\'s husband'
        ],
        answer: 1,
        explanation: 'She gave birth to a little boy just before embarking on the journey. He would participate in all of the travels の He は、直前で生まれた男の子（サカガウィアの息子）を指す。'
      },
      {
        q: 'Why does the author mention Sacagawea\'s role in 20th-century feminism?',
        choices: [
          'To discuss Sacagawea\'s unique female abilities',
          'To show that Sacagawea inspired American women',
          'To explain why Sacagawea is on many American coins',
          'To remind readers that Sacagawea is only a legend'
        ],
        answer: 1,
        explanation: '「20世紀初頭、女性の自尊心を呼び起こすためのアメリカのフェミニズムの象徴として使われた」とある。サカガウィアがアメリカの女性を勇気づけたことを示すため。'
      },
      {
        q: 'Based on the passage, what is probably true about Lewis and Clark?',
        choices: [
          'They learned the Shoshone language.',
          'They never met with Thomas Jefferson.',
          'They were grateful for Sacagawea\'s help.',
          'They didn\'t make it across the United States.'
        ],
        answer: 2,
        explanation: 'クラークの日記が「サカガウィアが探検に重大な影響を与えたと何度もほのめかしている」ことや息子を養子にしたことから、二人が彼女の助けに感謝していたと推測できる。'
      }
    ]
  }
];

const READING_TOPICS = [...new Set(READING_DATA.map((r) => r.topic))];
