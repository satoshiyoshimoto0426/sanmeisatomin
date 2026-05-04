/**
 * 立運（大運の開始年齢）の精密計算
 *
 * 算命学の規則:
 *   - 陽男陰女（年干が陽干の男性 / 陰干の女性）→ 順行、次の節入りまでの日数
 *   - 陰男陽女                                  → 逆行、前の節入りからの日数
 *   - 立運 = 日数 ÷ 3（端数四捨五入）
 *   - 大運の干支は月柱から順行/逆行で10年ずつ進む
 */
import { SIXTY_KANSHI, HEAVENLY_STEMS } from './constants';
import { getSolarTermsForYear } from './solar-terms';
import type { DaiunInfo, DaiunPillar } from './enriched-meishiki';

interface CalcArgs {
  yearStem: string;
  monthPillar: string; // 例: '庚辰'
  dayStem: string;
  gender: 'male' | 'female';
  birthDate: Date;
}

/**
 * 立運と9区分の大運を算出する
 */
export function calculatePreciseRyuun(args: CalcArgs): DaiunInfo {
  // 1. 大運の方向を決定
  const yangStems = ['甲', '丙', '戊', '庚', '壬'];
  const isYearStemYang = yangStems.includes(args.yearStem);

  const direction: 'forward' | 'backward' = (
    (isYearStemYang && args.gender === 'male') ||
    (!isYearStemYang && args.gender === 'female')
  ) ? 'forward' : 'backward';

  // 2. 節入りまでの日数
  const setsuDistanceDays = direction === 'forward'
    ? daysToNextSetsu(args.birthDate)
    : daysToPreviousSetsu(args.birthDate);

  // 3. 立運 = 日数 ÷ 3（四捨五入）。0歳にならないよう最低1。
  const startAge = Math.max(1, Math.round(setsuDistanceDays / 3));

  // 4. 大運の9区分（月柱から順行/逆行）
  const monthIdx = SIXTY_KANSHI.indexOf(args.monthPillar);
  const pillars: DaiunPillar[] = [];

  for (let i = 0; i < 9; i++) {
    const offset = direction === 'forward' ? (i + 1) : -(i + 1);
    const idx = ((monthIdx + offset) % 60 + 60) % 60;
    const pillar = SIXTY_KANSHI[idx];
    pillars.push({
      startAge: startAge + i * 10,
      endAge: startAge + (i + 1) * 10 - 1,
      pillar,
      stem: pillar.charAt(0),
      branch: pillar.charAt(1),
      followStar: getDaiunFollowStar(args.dayStem, pillar.charAt(1)),
      isTenchuusatsu: false, // 中殺判定後に上書き
    });
  }

  return { startAge, direction, setsuDistanceDays, pillars };
}

/**
 * 大運の地支から十二大従星を導く（日干基準）
 */
function getDaiunFollowStar(dayStem: string, branch: string): string {
  const TWELVE_FOLLOW_STARS = [
    '天報星', '天印星', '天貴星', '天恍星', '天南星', '天禄星',
    '天将星', '天堂星', '天胡星', '天極星', '天庫星', '天馳星',
  ];
  const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const CHANGSHENG_START: Record<string, number> = {
    甲: 11, 乙: 6, 丙: 2, 丁: 9, 戊: 2, 己: 9, 庚: 5, 辛: 0, 壬: 8, 癸: 3,
  };
  const STEP_TO_FOLLOW_STAR_INDEX = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1];

  const cs = CHANGSHENG_START[dayStem];
  const branchIndex = BRANCHES.indexOf(branch);
  if (cs === undefined || branchIndex < 0) return TWELVE_FOLLOW_STARS[0];

  const stemIdx = HEAVENLY_STEMS.indexOf(dayStem as typeof HEAVENLY_STEMS[number]);
  const isYang = stemIdx % 2 === 0;
  const step = isYang
    ? ((branchIndex - cs) % 12 + 12) % 12
    : ((cs - branchIndex) % 12 + 12) % 12;
  return TWELVE_FOLLOW_STARS[STEP_TO_FOLLOW_STAR_INDEX[step]];
}

/**
 * 入力日から、次の節入り日時までの日数（端数四捨五入）
 */
function daysToNextSetsu(date: Date): number {
  const year = date.getFullYear();
  const terms = getSolarTermsForYear(year);

  for (const term of terms) {
    if (term.dateTime > date) {
      return Math.round((term.dateTime.getTime() - date.getTime()) / 86400000);
    }
  }
  // 翌年の最初の節気（立春）
  const next = getSolarTermsForYear(year + 1);
  if (next.length > 0) {
    return Math.round((next[0].dateTime.getTime() - date.getTime()) / 86400000);
  }
  return 15;
}

/**
 * 入力日から、直前の節入り日時までの日数
 */
function daysToPreviousSetsu(date: Date): number {
  const year = date.getFullYear();
  const terms = getSolarTermsForYear(year);

  let lastTerm = null;
  for (const term of terms) {
    if (term.dateTime < date) {
      lastTerm = term;
    } else {
      break;
    }
  }

  if (lastTerm) {
    return Math.round((date.getTime() - lastTerm.dateTime.getTime()) / 86400000);
  }
  // 立春前の場合は前年の最後の節気
  const prev = getSolarTermsForYear(year - 1);
  if (prev.length > 0) {
    const last = prev[prev.length - 1];
    return Math.round((date.getTime() - last.dateTime.getTime()) / 86400000);
  }
  return 15;
}
