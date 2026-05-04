import type { MeishikiResult } from './sanmei';

export interface ClassicQuote {
  text: string;
  source: string;
  applicableStars: string[]; // どの十大主星に対して引用するか
  theme: 'self' | 'relation' | 'work' | 'life';
}

export const CLASSIC_QUOTES: ClassicQuote[] = [
  // 貫索星・石門星(自我・協調)
  {
    text: '己を知る者は明なり、人に勝つ者は力あり、自ら勝つ者は強し。',
    source: '老子・第三十三章',
    applicableStars: ['貫索星'],
    theme: 'self',
  },
  {
    text: '上善は水の若し。水は善く万物を利して争わず。',
    source: '老子・第八章',
    applicableStars: ['石門星', '禄存星'],
    theme: 'relation',
  },
  {
    text: '徳孤ならず、必ず鄰あり。',
    source: '論語・里仁',
    applicableStars: ['石門星'],
    theme: 'relation',
  },
  // 鳳閣星・調舒星(表現・感性)
  {
    text: '巧言令色、鮮し仁。',
    source: '論語・学而',
    applicableStars: ['鳳閣星'],
    theme: 'self',
  },
  {
    text: '芸は身を助く。',
    source: '日本古諺',
    applicableStars: ['鳳閣星', '調舒星'],
    theme: 'work',
  },
  {
    text: '哀しみを知る者のみ、真に喜びを知る。',
    source: '芭蕉・笈の小文(意訳)',
    applicableStars: ['調舒星'],
    theme: 'self',
  },
  // 禄存星・司禄星(財・蓄積)
  {
    text: '事を謀るは人にあり、事を成すは天にあり。',
    source: '三国志',
    applicableStars: ['司禄星', '禄存星'],
    theme: 'work',
  },
  {
    text: '積善の家には必ず余慶あり。',
    source: '易経・坤為地',
    applicableStars: ['司禄星'],
    theme: 'life',
  },
  // 車騎星・牽牛星(行動・名誉)
  {
    text: '天行健なり、君子もって自ら強めて息まず。',
    source: '易経・乾為天',
    applicableStars: ['車騎星', '牽牛星', '天将星'],
    theme: 'work',
  },
  {
    text: '至誠にして動かざる者は未だ之あらざるなり。',
    source: '孟子・離婁上',
    applicableStars: ['牽牛星'],
    theme: 'relation',
  },
  {
    text: '勇者は懼れず。',
    source: '論語・子罕',
    applicableStars: ['車騎星'],
    theme: 'self',
  },
  // 龍高星・玉堂星(学問・改革)
  {
    text: '知者は惑わず、仁者は憂えず、勇者は懼れず。',
    source: '論語・子罕',
    applicableStars: ['玉堂星', '龍高星'],
    theme: 'self',
  },
  {
    text: '故きを温ねて新しきを知れば、以て師と為すべし。',
    source: '論語・為政',
    applicableStars: ['玉堂星'],
    theme: 'work',
  },
  {
    text: '千里の行も足下より始まる。',
    source: '老子・第六十四章',
    applicableStars: ['龍高星'],
    theme: 'life',
  },
  {
    text: '吾れ十有五にして学に志す。',
    source: '論語・為政',
    applicableStars: ['玉堂星', '龍高星'],
    theme: 'life',
  },
  // 一般(中央星不明時のフォールバック)
  {
    text: '人生は近くで見ると悲劇だが、遠くから見ると喜劇である。',
    source: 'チャップリン(東西を超えた知恵)',
    applicableStars: [],
    theme: 'life',
  },
  {
    text: '行く川のながれは絶えずして、しかも本の水にあらず。',
    source: '方丈記',
    applicableStars: [],
    theme: 'life',
  },
];

/**
 * 命式から最も適した古典の言葉を1つ選ぶ
 */
export function selectClassicQuote(meishiki: MeishikiResult): ClassicQuote {
  // 中央(本人の核)の星に対応する引用を最優先で選択
  const mainStar = meishiki.mainStars.chest;
  const matched = CLASSIC_QUOTES.filter(q => q.applicableStars.includes(mainStar));

  if (matched.length > 0) {
    // 同一星に複数該当する場合、生年月日のシードで決定論的に選ぶ
    const seed =
      meishiki.birthDate.year * 10000 +
      meishiki.birthDate.month * 100 +
      meishiki.birthDate.day;
    return matched[seed % matched.length];
  }

  // フォールバック: 一般引用
  const general = CLASSIC_QUOTES.filter(q => q.applicableStars.length === 0);
  if (general.length > 0) {
    const seed =
      meishiki.birthDate.year * 10000 +
      meishiki.birthDate.month * 100 +
      meishiki.birthDate.day;
    return general[seed % general.length];
  }

  return CLASSIC_QUOTES[0];
}
