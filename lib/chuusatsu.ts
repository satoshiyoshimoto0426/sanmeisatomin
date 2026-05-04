/**
 * 宿命中殺（天中殺・空亡）の判定
 *
 * 日柱の干支がどの旬に属するかで天中殺2支が決まる。
 * その2支が命式内のどの位置にあるかで「初年中殺/配偶者中殺/晩年中殺/子孫中殺」を判定。
 */
import { JUN_TENCHUUSATSU, getJunFromKanshi, type JunName } from './constants';
import type { ChuusatsuInfo, ChuusatsuLocation, Position } from './enriched-meishiki';

interface PillarSet {
  yearPillar: string;
  monthPillar: string;
  dayPillar: string;
  timePillar?: string;
}

/**
 * 命式から宿命中殺を判定する
 */
export function detectChuusatsu(pillars: PillarSet): ChuusatsuInfo {
  const junmei: JunName = getJunFromKanshi(pillars.dayPillar);
  const tenchuusatsu = JUN_TENCHUUSATSU[junmei];

  const locations: ChuusatsuLocation[] = [];

  const checkBranch = (pillar: string | undefined, position: Position) => {
    if (!pillar) return;
    const branch = pillar.charAt(1);
    if (tenchuusatsu.includes(branch)) {
      locations.push({
        position,
        branch,
        meaning: getChuusatsuMeaning(position),
        description: getChuusatsuDescription(position),
      });
    }
  };

  checkBranch(pillars.yearPillar, 'year');
  checkBranch(pillars.monthPillar, 'month');
  checkBranch(pillars.dayPillar, 'day');
  checkBranch(pillars.timePillar, 'time');

  return { tenchuusatsu, junmei, locations };
}

function getChuusatsuMeaning(position: Position): string {
  return {
    year: '初年中殺',
    month: '配偶者中殺・家庭中殺',
    day: '晩年中殺',
    time: '子孫中殺',
  }[position];
}

function getChuusatsuDescription(position: Position): string {
  return {
    year: '初年期（0〜30歳頃）に独自の歩みをする傾向。家系や親世代と異なる道に進みやすい。',
    month: '中年期の家庭・社会との関わりに独自性が出る。配偶者や仕事の場に縁の取り方の特徴が現れる。',
    day: '晩年期に独自の境地を開く傾向。独立した精神性が育まれる。',
    time: '子孫や晩年の創造性に独自性が現れる。',
  }[position];
}

/**
 * 大運の地支が天中殺かを判定
 */
export function isDaiunTenchuusatsu(
  daiunBranch: string,
  tenchuusatsu: [string, string],
): boolean {
  return tenchuusatsu.includes(daiunBranch);
}
