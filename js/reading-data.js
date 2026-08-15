/**
 * 長文読解の問題データ — Ekamai International School (EIS) Grade 8 受験向け
 *
 * 本文は英語、選択肢も英語、解説は日本語。実際の入試と同じ形式にしている。
 * 設問は「主題」「細部」「文脈中の語義」「指示語」「推測」の5種類を組み合わせている。
 *
 * 各エントリの構造:
 *   id        : 一意なID（設問のIDは r1-1 のように連番で作られる）
 *   title     : 本文の見出し
 *   level     : 難易度 (1=基礎 / 2=標準 / 3=応用)
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
  }
];

const READING_TOPICS = [...new Set(READING_DATA.map((r) => r.topic))];
