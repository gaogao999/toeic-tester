/**
 * 花さんのワークシートで出た語 — **文章の中で実際に出会った語**
 *
 * **このファイルは手で直さない。**作り直しは
 *   node tools/import-worksheet.mjs <used_words_hana.json>
 *
 * アプリはここの語を「新しい語」の先頭に回す。単語帳（js/data.js）に無い語は
 * ここの意味をそのまま使う。
 *
 * 取り込んだ日: 2026-11-15（42語）
 */
const WORKSHEET_WORDS = [
  { word: 'border', meaning: '国境・境目', from: ['A Doctor Who Dug Canals'] },
  { word: 'nerve', meaning: '神経', from: ['A Doctor Who Dug Canals'] },
  { word: 'crowded', meaning: '混み合った', from: ['A Doctor Who Dug Canals'] },
  { word: 'destroy', meaning: 'こわす', from: ['A Doctor Who Dug Canals'] },
  { word: 'severe', meaning: 'きびしい・ひどい', from: ['A Doctor Who Dug Canals'] },
  { word: 'crop', meaning: '作物', from: ['A Doctor Who Dug Canals'] },
  { word: 'repair', meaning: '直す', from: ['A Doctor Who Dug Canals'] },
  { word: 'material', meaning: '材料', from: ['A Doctor Who Dug Canals'] },
  { word: 'organization', meaning: '団体・組織', from: ['A Doctor Who Dug Canals'] },
  { word: 'leprosy', meaning: 'ハンセン病', from: ['A Doctor Who Dug Canals'] },
  { word: 'scarce', meaning: '足りない・とぼしい', from: ['A Doctor Who Dug Canals'] },
  { word: 'drought', meaning: '日照り（雨が長く降らないこと）', from: ['A Doctor Who Dug Canals'] },
  { word: 'irrigation', meaning: '田畑に水を引くこと', from: ['A Doctor Who Dug Canals'] },
  { word: 'canal', meaning: '用水路', from: ['A Doctor Who Dug Canals'] },
  { word: 'mourn', meaning: '（人の死を）深く悲しむ', from: ['A Doctor Who Dug Canals'] },
  { word: 'rapidly', meaning: '急速に', from: ['Buy Now, Pay Later'] },
  { word: 'affordable', meaning: '手の届く値段の', from: ['Buy Now, Pay Later'] },
  { word: 'interest', meaning: '利息', from: ['Buy Now, Pay Later'] },
  { word: 'convenience', meaning: '便利さ', from: ['Buy Now, Pay Later'] },
  { word: 'owe', meaning: '借りがある・支払う義務がある', from: ['Buy Now, Pay Later'] },
  { word: 'fee', meaning: '料金・手数料', from: ['Buy Now, Pay Later'] },
  { word: 'reduce', meaning: '減らす', from: ['Buy Now, Pay Later'] },
  { word: 'harmful', meaning: '害のある', from: ['Buy Now, Pay Later'] },
  { word: 'habit', meaning: '習慣', from: ['Buy Now, Pay Later'] },
  { word: 'installment', meaning: '分割払いの1回分', from: ['Buy Now, Pay Later'] },
  { word: 'vulnerable', meaning: '（悪い影響を）受けやすい', from: ['Buy Now, Pay Later'] },
  { word: 'effortless', meaning: '苦労のいらない', from: ['Buy Now, Pay Later'] },
  { word: 'sensible', meaning: 'かしこい・理にかなった', from: ['Buy Now, Pay Later'] },
  { word: 'talented', meaning: '才能のある', from: ['The Woman Who Checked the Numbers'] },
  { word: 'beyond', meaning: '〜をこえて', from: ['The Woman Who Checked the Numbers'] },
  { word: 'encourage', meaning: 'はげます・すすめる', from: ['The Woman Who Checked the Numbers'] },
  { word: 'research', meaning: '研究', from: ['The Woman Who Checked the Numbers'] },
  { word: 'complex', meaning: '複雑な', from: ['The Woman Who Checked the Numbers'] },
  { word: 'attend', meaning: '出席する', from: ['The Woman Who Checked the Numbers'] },
  { word: 'gradually', meaning: 'だんだんと', from: ['The Woman Who Checked the Numbers'] },
  { word: 'calculate', meaning: '計算する', from: ['The Woman Who Checked the Numbers'] },
  { word: 'confirm', meaning: '確かめる', from: ['The Woman Who Checked the Numbers'] },
  { word: 'decade', meaning: '10年間', from: ['The Woman Who Checked the Numbers'] },
  { word: 'segregate', meaning: '（人種などで）分ける', from: ['The Woman Who Checked the Numbers'] },
  { word: 'facility', meaning: '設備・施設', from: ['The Woman Who Checked the Numbers'] },
  { word: 'precise', meaning: 'とても正確な', from: ['The Woman Who Checked the Numbers'] },
  { word: 'persistence', meaning: 'あきらめずに続けること', from: ['The Woman Who Checked the Numbers'] }
];
