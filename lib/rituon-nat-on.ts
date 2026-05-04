/**
 * 律音・納音の判定
 *
 * 律音: 命式内で同一干支が複数の柱に重なる（深い縁の象徴）
 * 納音: 60干支を30の納音グループに分類し、同一グループに属する柱の重なり
 */
import { NAT_ON_TABLE } from './constants';
import type { RituonMatch, NatOnMatch, Position } from './enriched-meishiki';

interface PillarSet {
  yearPillar: string;
  monthPillar: string;
  dayPillar: string;
  timePillar?: string;
}

function gatherPositions(pillars: PillarSet): Array<{ pos: Position; pillar: string }> {
  const list: Array<{ pos: Position; pillar: string }> = [
    { pos: 'year', pillar: pillars.yearPillar },
    { pos: 'month', pillar: pillars.monthPillar },
    { pos: 'day', pillar: pillars.dayPillar },
  ];
  if (pillars.timePillar) list.push({ pos: 'time', pillar: pillars.timePillar });
  return list;
}

/**
 * 律音（同一干支の重なり）を検出
 */
export function detectRituon(pillars: PillarSet): RituonMatch[] {
  const positions = gatherPositions(pillars);
  const grouped: Record<string, Position[]> = {};
  for (const { pos, pillar } of positions) {
    if (!grouped[pillar]) grouped[pillar] = [];
    grouped[pillar].push(pos);
  }
  const result: RituonMatch[] = [];
  for (const [pillar, posList] of Object.entries(grouped)) {
    if (posList.length >= 2) result.push({ pillar, positions: posList });
  }
  return result;
}

/**
 * 納音（同一納音グループの柱）を検出
 */
export function detectNatOn(pillars: PillarSet): NatOnMatch[] {
  const positions = gatherPositions(pillars);
  const grouped: Record<string, Array<{ pos: Position; pillar: string }>> = {};
  for (const item of positions) {
    const natOn = NAT_ON_TABLE[item.pillar];
    if (!natOn) continue;
    if (!grouped[natOn]) grouped[natOn] = [];
    grouped[natOn].push(item);
  }
  const result: NatOnMatch[] = [];
  for (const [natOn, group] of Object.entries(grouped)) {
    if (group.length >= 2) {
      result.push({
        natOnGroup: natOn,
        pillars: group.map(g => g.pillar),
        positions: group.map(g => g.pos),
      });
    }
  }
  return result;
}
