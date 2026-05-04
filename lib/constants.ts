export const TEN_MAIN_STARS = [
  '貫索星', '石門星', '鳳閣星', '調舒星', '禄存星',
  '司禄星', '車騎星', '牽牛星', '龍高星', '玉堂星'
] as const;

export const TWELVE_FOLLOW_STARS = [
  '天報星', '天印星', '天貴星', '天恍星', '天南星', '天禄星',
  '天将星', '天堂星', '天胡星', '天極星', '天庫星', '天馳星'
] as const;

export const FOLLOW_STAR_ENERGY: Record<string, number> = {
  '天報星': 1, '天印星': 2, '天貴星': 3, '天恍星': 4,
  '天南星': 8, '天禄星': 7, '天将星': 12, '天堂星': 6,
  '天胡星': 5, '天極星': 3, '天庫星': 5, '天馳星': 4
};

// 十二大従星のタイプ分類（「優劣」ではなく「質の違い」を表現）
export type FollowStarType = 'inception' | 'inward' | 'stable' | 'expansive' | 'flowing';

export interface FollowStarMeta {
  name: string;
  energy: number;
  type: FollowStarType;
  typeLabel: string;
  shortDescription: string;
}

export const FOLLOW_STARS_META: Record<string, FollowStarMeta> = {
  '天報星': { name: '天報星', energy: 1, type: 'inception',
    typeLabel: '芽生えの型', shortDescription: '可能性が萌芽する繊細な力' },
  '天印星': { name: '天印星', energy: 2, type: 'inward',
    typeLabel: '内省の型', shortDescription: '純粋な感性で世界を受け取る力' },
  '天貴星': { name: '天貴星', energy: 3, type: 'inward',
    typeLabel: '気品の型', shortDescription: '気品と知性を内に湛える力' },
  '天恍星': { name: '天恍星', energy: 4, type: 'flowing',
    typeLabel: '感性の型', shortDescription: '感性が外へと流れ出す力' },
  '天南星': { name: '天南星', energy: 8, type: 'expansive',
    typeLabel: '行動の型', shortDescription: '行動力で世界を切り開く力' },
  '天禄星': { name: '天禄星', energy: 7, type: 'stable',
    typeLabel: '実りの型', shortDescription: '着実に実りを積み重ねる力' },
  '天将星': { name: '天将星', energy: 12, type: 'expansive',
    typeLabel: '統率の型', shortDescription: '大きな器で人や場をまとめる力' },
  '天堂星': { name: '天堂星', energy: 6, type: 'stable',
    typeLabel: '熟成の型', shortDescription: '経験を熟成させる円熟の力' },
  '天胡星': { name: '天胡星', energy: 5, type: 'inward',
    typeLabel: '感受の型', shortDescription: '繊細な感受性で物事を捉える力' },
  '天極星': { name: '天極星', energy: 3, type: 'inward',
    typeLabel: '透徹の型', shortDescription: '物事の本質を見抜く透徹の力' },
  '天庫星': { name: '天庫星', energy: 5, type: 'stable',
    typeLabel: '貯蔵の型', shortDescription: '知や経験を蓄え深める力' },
  '天馳星': { name: '天馳星', energy: 4, type: 'flowing',
    typeLabel: '駆動の型', shortDescription: '軽やかに動き続ける力' },
};

export const STAR_DESCRIPTIONS: Record<string, string> = {
  '貫索星': '自我を守る星。独立心が強く、マイペースに物事を進める力。',
  '石門星': '人と和する星。協調性に富み、人脈を広げる力。',
  '鳳閣星': '表現する星。明るく楽観的で、食と芸術を愛する。',
  '調舒星': '感性の星。繊細で芸術的、孤独を力に変える。',
  '禄存星': '魅力の星。人を惹きつけ、奉仕精神で信頼を得る。',
  '司禄星': '蓄積の星。堅実で家庭的、コツコツと積み上げる力。',
  '車騎星': '行動の星。スピードと勢いで道を切り開く。',
  '牽牛星': '名誉の星。責任感が強く、組織を率いるリーダーシップ。',
  '龍高星': '冒険の星。好奇心旺盛で、未知の世界を求める改革者。',
  '玉堂星': '学びの星。知識欲が深く、伝統を重んじる知性派。',
};

export const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;
export const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;

export const STEM_ELEMENT: Record<string, string> = {
  '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
  '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水'
};

// 各地支の主蔵干（本気）— 算命学・四柱推命標準
export const ZOUKAN_PRIMARY: Record<string, string> = {
  '子': '癸', '丑': '己', '寅': '甲', '卯': '乙',
  '辰': '戊', '巳': '丙', '午': '丁', '未': '己',
  '申': '庚', '酉': '辛', '戌': '戊', '亥': '壬',
};

// 副蔵干（中気・余気） — 詳細解釈用
export const ZOUKAN_ALL: Record<string, string[]> = {
  '子': ['癸'],
  '丑': ['己', '癸', '辛'],
  '寅': ['甲', '丙', '戊'],
  '卯': ['乙'],
  '辰': ['戊', '乙', '癸'],
  '巳': ['丙', '庚', '戊'],
  '午': ['丁', '己'],
  '未': ['己', '丁', '乙'],
  '申': ['庚', '壬', '戊'],
  '酉': ['辛'],
  '戌': ['戊', '辛', '丁'],
  '亥': ['壬', '甲'],
};

// 十大主星の導出テーブル: 日干と他干の五行関係から星を決定
// 比和=貫索/石門, 洩気=鳳閣/調舒, 財=禄存/司禄, 官=車騎/牽牛, 印=龍高/玉堂
// 陽同士/陰同士=兄(偏), 陽陰/陰陽=弟(正)
export const RELATION_TO_STAR: Record<string, string> = {
  '比肩': '貫索星',
  '劫財': '石門星',
  '食神': '鳳閣星',
  '傷官': '調舒星',
  '偏財': '禄存星',
  '正財': '司禄星',
  '偏官': '車騎星',
  '正官': '牽牛星',
  '偏印': '龍高星',
  '正印': '玉堂星',
};

export const PREFECTURES = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
];
