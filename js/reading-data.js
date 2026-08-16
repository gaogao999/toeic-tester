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
  }
];

const READING_TOPICS = [...new Set(READING_DATA.map((r) => r.topic))];
