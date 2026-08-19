/**
 * B1 / B2 教材のページ → 単元の対応。
 *
 * 2冊は章立てがまったく同じ（章・単元の始まるページまで一致する）ので、
 * 表は1つで足りる。
 *
 * 単元名は **A2 の取り込み（import-grammar.mjs）と同じ日本語**にしてある。
 * レベルが違っても同じ単元は同じ名前で数えたいため。
 */
/**
 * 区切りは**設問の終わりに合わせる**こと。単元の解説は次のページから始まるが、
 * その手前の Unit Test は前の単元の設問で、しかも**次のページにはみ出す**
 * （p45 の Unit Test は p46 まで続く）。解説の始まりで切ると、はみ出したぶんが
 * 隣の単元に混ざる。
 *
 * 章のまとめ（Chapter Test）と Diagnostic / Actual Test は複数の単元が混ざるので
 * 「総合」にする。**単元を1つ選んで付けると、記録の弱点表示が嘘になる。**
 */
export const UNITS = [
  { unit: '総合', from: 15, to: 22 },              // Diagnostic Test
  // Chapter 1 Sentence Formation
  { unit: '文の要素', from: 23, to: 38 },          // Subjects & Objects / Complements
  { unit: '主語と動詞の一致', from: 39, to: 46 },
  { unit: '総合', from: 47, to: 49 },              // Chapter Test
  // Chapter 2 Verb Forms
  { unit: '時制', from: 50, to: 62 },              // Basic Verb Forms / Continuous & Perfect
  { unit: '受動態', from: 63, to: 70 },
  { unit: '助動詞', from: 71, to: 80 },
  { unit: '仮定法', from: 81, to: 86 },            // Conditionals
  { unit: '総合', from: 87, to: 89 },              // Chapter Test
  // Chapter 3 Verbals
  { unit: '不定詞', from: 90, to: 100 },
  { unit: '動名詞', from: 101, to: 110 },
  { unit: '分詞', from: 111, to: 120 },
  { unit: '総合', from: 121, to: 123 },            // Chapter Test
  { unit: '総合', from: 124, to: 139 }             // Actual Test
];

export const unitFor = (page) =>
  (UNITS.find((u) => page >= u.from && page <= u.to) || { unit: 'その他' }).unit;
