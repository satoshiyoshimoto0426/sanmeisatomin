import {
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  STEM_ELEMENT,
  TEN_MAIN_STARS,
  TWELVE_FOLLOW_STARS,
  FOLLOW_STAR_ENERGY,
  ZOUKAN_PRIMARY,
} from './constants';
import { getSetsugetsuYear, getSetsugetsuBranch } from './solar-terms';

export interface BirthData {
  name?: string;
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  prefecture?: string;
}

export interface Pillar {
  stem: string;
  branch: string;
}

export interface MeishikiResult {
  name?: string;
  birthDate: { year: number; month: number; day: number };
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  /** 十大主星 — 高尾算命学 人体図配置 */
  mainStars: {
    head: string;          // 北/頭   = 月干 vs 日干
    leftShoulder: string;  // 西/左肩 = 年干 vs 日干
    chest: string;         // 中央/胸 = 日支主蔵干 vs 日干（本人の核）
    rightShoulder: string; // 東/右肩 = 月支主蔵干 vs 日干（配偶者・才能）
    abdomen: string;       // 南/腹   = 年支主蔵干 vs 日干（基盤・子孫）
  };
  /** 十二大従星（人生エネルギー） */
  followStars: {
    initial: string; // 初年運 = 年支による
    middle: string;  // 中年運 = 月支による
    late: string;    // 晩年運 = 日支による
  };
  timeline: Array<{ age: number; star: string; energy: number }>;
}

// ─────────────────────────────────────────────────────────
//  年柱（節月暦ベース）
// ─────────────────────────────────────────────────────────
//  立春を年の境界とする算命学の正統ロジックに従う。
//  例: 2024-02-03 生まれ → 2023年扱い（立春前）
//      2024-02-05 生まれ → 2024年扱い（立春後）
function getYearPillar(setsugetsuYear: number): Pillar {
  const stemIndex = ((setsugetsuYear - 4) % 10 + 10) % 10;
  const branchIndex = ((setsugetsuYear - 4) % 12 + 12) % 12;
  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: EARTHLY_BRANCHES[branchIndex],
  };
}

// ─────────────────────────────────────────────────────────
//  月柱（節月暦・五虎遁）
// ─────────────────────────────────────────────────────────
//  五虎遁:
//    甲己年 → 寅月=丙寅, 卯=丁卯, 辰=戊辰, …
//    乙庚年 → 寅月=戊寅, 卯=己卯, 辰=庚辰, …
//    丙辛年 → 寅月=庚寅, …
//    丁壬年 → 寅月=壬寅, …
//    戊癸年 → 寅月=甲寅, …
//
//  月支は節入り（立春・啓蟄・清明…）で切り替わる。
//  例: 2024-03-05 11:22 (啓蟄前) → 寅月
//      2024-03-05 11:24 (啓蟄後) → 卯月
function getMonthPillar(setsugetsuYear: number, monthBranch: string): Pillar {
  const yearStemIndex = ((setsugetsuYear - 4) % 10 + 10) % 10;
  // 五虎遁: 寅月の月干 = (年干 % 5) * 2 + 2 (mod 10)
  const yearStemBase = ((yearStemIndex % 5) * 2 + 2) % 10;

  const branchIndex = EARTHLY_BRANCHES.indexOf(monthBranch as typeof EARTHLY_BRANCHES[number]);
  if (branchIndex < 0) {
    // フォールバック（通常起こらない）
    return { stem: HEAVENLY_STEMS[yearStemBase], branch: '寅' };
  }

  // 寅月（branchIndex=2）が起点。そこから何ヶ月進んだかが月干オフセット。
  const offsetFromYin = ((branchIndex - 2) % 12 + 12) % 12;
  const stemIndex = (yearStemBase + offsetFromYin) % 10;

  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: monthBranch,
  };
}

// ─────────────────────────────────────────────────────────
//  日柱
// ─────────────────────────────────────────────────────────
//  基準: 1900-01-01 = 壬戌 (実用算命学万年暦に準拠)
//  → 1980-04-26 = 丁巳, 1990-05-15 = 庚午 等が正しく算出される
function getDayPillar(year: number, month: number, day: number): Pillar {
  const baseDate = new Date(1900, 0, 1);
  const targetDate = new Date(year, month - 1, day);
  const diffDays = Math.floor(
    (targetDate.getTime() - baseDate.getTime()) / 86400000
  );
  // 壬 = stem index 8, 戌 = branch index 10
  const stemIndex = ((diffDays + 8) % 10 + 10) % 10;
  const branchIndex = ((diffDays + 10) % 12 + 12) % 12;
  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: EARTHLY_BRANCHES[branchIndex],
  };
}

// ─────────────────────────────────────────────────────────
//  通変関係（日干と他の干との関係）
// ─────────────────────────────────────────────────────────
function getElementRelation(dayStem: string, otherStem: string): string {
  const elements = ['木', '火', '土', '金', '水'];
  const dayElement = STEM_ELEMENT[dayStem];
  const otherElement = STEM_ELEMENT[otherStem];
  const dayIdx = elements.indexOf(dayElement);
  const otherIdx = elements.indexOf(otherElement);
  const dayStemIdx = HEAVENLY_STEMS.indexOf(dayStem as typeof HEAVENLY_STEMS[number]);
  const otherStemIdx = HEAVENLY_STEMS.indexOf(otherStem as typeof HEAVENLY_STEMS[number]);
  const samePolarity = dayStemIdx % 2 === otherStemIdx % 2;

  // 比和（同行）
  if (dayIdx === otherIdx) return samePolarity ? '比肩' : '劫財';
  // 我生（食傷）— 木→火→土→金→水→木
  if (otherIdx === (dayIdx + 1) % 5) return samePolarity ? '食神' : '傷官';
  // 我克（財）— 木→土
  if (otherIdx === (dayIdx + 2) % 5) return samePolarity ? '偏財' : '正財';
  // 克我（官）— 木→金克木
  if (otherIdx === (dayIdx + 3) % 5) return samePolarity ? '偏官' : '正官';
  // 生我（印）
  return samePolarity ? '偏印' : '正印';
}

const RELATION_TO_MAIN_STAR: Record<string, string> = {
  比肩: '貫索星',
  劫財: '石門星',
  食神: '鳳閣星',
  傷官: '調舒星',
  偏財: '禄存星',
  正財: '司禄星',
  偏官: '車騎星',
  正官: '牽牛星',
  偏印: '龍高星',
  正印: '玉堂星',
};

function getMainStar(dayStem: string, otherStem: string): string {
  const relation = getElementRelation(dayStem, otherStem);
  return RELATION_TO_MAIN_STAR[relation] ?? TEN_MAIN_STARS[0];
}

/** 地支から主蔵干を経由して十大主星を導出 */
function getMainStarFromBranch(dayStem: string, branch: string): string {
  const zoukan = ZOUKAN_PRIMARY[branch];
  if (!zoukan) return TEN_MAIN_STARS[0];
  return getMainStar(dayStem, zoukan);
}

// ─────────────────────────────────────────────────────────
//  十二大従星（十二運星）
// ─────────────────────────────────────────────────────────
//  各日干の「長生」が始まる地支
const CHANGSHENG_START: Record<string, number> = {
  甲: 11, // 亥
  乙: 6,  // 午（陰干は陽干の沐浴位置から逆行）
  丙: 2,  // 寅
  丁: 9,  // 酉
  戊: 2,  // 寅（土寄火）
  己: 9,  // 酉
  庚: 5,  // 巳
  辛: 0,  // 子
  壬: 8,  // 申
  癸: 3,  // 卯
};

//  十二運ステップ → 十二大従星 index (TWELVE_FOLLOW_STARS)
//  0:長生→天貴, 1:沐浴→天恍, 2:冠帯→天南, 3:建禄→天禄, 4:帝旺→天将,
//  5:衰→天堂,   6:病→天胡,   7:死→天極,   8:墓→天庫,   9:絶→天馳,
//  10:胎→天報, 11:養→天印
const STEP_TO_FOLLOW_STAR_INDEX = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1];

function getFollowStar(dayStem: string, branchIndex: number): string {
  const cs = CHANGSHENG_START[dayStem];
  if (cs === undefined) return TWELVE_FOLLOW_STARS[0];
  const stemIdx = HEAVENLY_STEMS.indexOf(dayStem as typeof HEAVENLY_STEMS[number]);
  const isYang = stemIdx % 2 === 0; // 甲丙戊庚壬

  // 陽干: 順行（長生地支から十二支順に進む）
  // 陰干: 逆行
  const step = isYang
    ? ((branchIndex - cs) % 12 + 12) % 12
    : ((cs - branchIndex) % 12 + 12) % 12;

  const starIdx = STEP_TO_FOLLOW_STAR_INDEX[step];
  return TWELVE_FOLLOW_STARS[starIdx];
}

// ─────────────────────────────────────────────────────────
//  命式の総合算出
// ─────────────────────────────────────────────────────────
export function calculateMeishiki(birthData: BirthData): MeishikiResult {
  const { year, month, day, hour, minute } = birthData;

  // 節月暦における年・月支を算出（時刻が指定されていれば反映、なければ正午で判定）
  const refDate = new Date(
    year,
    month - 1,
    day,
    hour ?? 12,
    minute ?? 0,
    0,
  );
  const setsugetsuYear = getSetsugetsuYear(refDate);
  const monthBranch = getSetsugetsuBranch(refDate);

  const yearPillar = getYearPillar(setsugetsuYear);
  const monthPillar = getMonthPillar(setsugetsuYear, monthBranch);
  // 日柱は暦日ベース（節気の影響を受けない）
  const dayPillar = getDayPillar(year, month, day);

  const dayStem = dayPillar.stem;

  // 十大主星 — 高尾算命学・人体図配置
  const mainStars = {
    head: getMainStar(dayStem, monthPillar.stem),                    // 北/頭   = 月干
    leftShoulder: getMainStar(dayStem, yearPillar.stem),              // 西/左肩 = 年干
    chest: getMainStarFromBranch(dayStem, dayPillar.branch),          // 中央/胸 = 日支主蔵干
    rightShoulder: getMainStarFromBranch(dayStem, monthPillar.branch),// 東/右肩 = 月支主蔵干
    abdomen: getMainStarFromBranch(dayStem, yearPillar.branch),       // 南/腹   = 年支主蔵干
  };

  const yearBranchIndex = EARTHLY_BRANCHES.indexOf(yearPillar.branch as typeof EARTHLY_BRANCHES[number]);
  const monthBranchIndex = EARTHLY_BRANCHES.indexOf(monthPillar.branch as typeof EARTHLY_BRANCHES[number]);
  const dayBranchIndex = EARTHLY_BRANCHES.indexOf(dayPillar.branch as typeof EARTHLY_BRANCHES[number]);

  const followStars = {
    initial: getFollowStar(dayStem, yearBranchIndex),
    middle: getFollowStar(dayStem, monthBranchIndex),
    late: getFollowStar(dayStem, dayBranchIndex),
  };

  const timeline = generateTimeline(followStars);

  return {
    name: birthData.name,
    birthDate: { year, month, day },
    yearPillar,
    monthPillar,
    dayPillar,
    mainStars,
    followStars,
    timeline,
  };
}

function generateTimeline(followStars: { initial: string; middle: string; late: string }) {
  const timeline: Array<{ age: number; star: string; energy: number }> = [];

  const phases = [
    { star: followStars.initial, startAge: 0, endAge: 30 },
    { star: followStars.middle, startAge: 30, endAge: 60 },
    { star: followStars.late, startAge: 60, endAge: 90 },
  ];

  for (const phase of phases) {
    const energy = FOLLOW_STAR_ENERGY[phase.star] || 5;
    for (let age = phase.startAge; age <= phase.endAge; age += 10) {
      timeline.push({ age, star: phase.star, energy });
    }
  }

  // スムーズな遷移のため中間値を補間
  const smoothed: Array<{ age: number; star: string; energy: number }> = [];
  for (let i = 0; i < timeline.length; i++) {
    smoothed.push(timeline[i]);
    if (i < timeline.length - 1 && timeline[i].energy !== timeline[i + 1].energy) {
      const midAge = (timeline[i].age + timeline[i + 1].age) / 2;
      const midEnergy = (timeline[i].energy + timeline[i + 1].energy) / 2;
      smoothed.push({ age: midAge, star: '', energy: midEnergy });
    }
  }

  return smoothed.filter((item, index, arr) =>
    index === 0 || item.age !== arr[index - 1].age
  );
}
