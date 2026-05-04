/**
 * 特殊干支関係の抽出
 *
 * 干合（天干同士）/ 支合・三合・冲・刑・害・破（地支同士）を命式から検出する。
 */
import {
  KANGO_PAIRS, SHIGO_PAIRS, SANGO_GROUPS, CHU_PAIRS,
  KEI_GROUPS, GAI_PAIRS, HA_PAIRS,
} from './constants';
import type { SpecialRelation, SpecialRelations, Position } from './enriched-meishiki';

interface PillarSet {
  yearPillar: string;
  monthPillar: string;
  dayPillar: string;
  timePillar?: string;
}

interface PosPillar {
  pos: Position;
  pillar: string;
}

const POSITION_LABEL: Record<Position, string> = {
  year: '年柱', month: '月柱', day: '日柱', time: '時柱',
};

/**
 * 命式から全ての特殊干支関係を抽出する
 */
export function extractSpecialRelations(pillars: PillarSet): SpecialRelations {
  const positions: PosPillar[] = [
    { pos: 'year', pillar: pillars.yearPillar },
    { pos: 'month', pillar: pillars.monthPillar },
    { pos: 'day', pillar: pillars.dayPillar },
  ];
  if (pillars.timePillar) {
    positions.push({ pos: 'time', pillar: pillars.timePillar });
  }

  return {
    kango: detectKango(positions),
    shigo: detectShigo(positions),
    sanGo: detectSanGo(positions),
    chu: detectChu(positions),
    kei: detectKei(positions),
    gai: detectGai(positions),
    ha: detectHa(positions),
  };
}

// 干合 ----------------------------------------------------------------
function detectKango(positions: PosPillar[]): SpecialRelation[] {
  const result: SpecialRelation[] = [];
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const s1 = positions[i].pillar.charAt(0);
      const s2 = positions[j].pillar.charAt(0);
      for (const { pair, transform } of KANGO_PAIRS) {
        if (
          (pair[0] === s1 && pair[1] === s2) ||
          (pair[1] === s1 && pair[0] === s2)
        ) {
          result.push({
            type: `干合(${pair[0]}${pair[1]})化${transform}`,
            positions: [positions[i].pos, positions[j].pos],
            elements: [s1, s2],
            meaning: `${POSITION_LABEL[positions[i].pos]}と${POSITION_LABEL[positions[j].pos]}の天干が干合し、${transform}の性質が強まる`,
          });
        }
      }
    }
  }
  return result;
}

// 支合（六合） --------------------------------------------------------
function detectShigo(positions: PosPillar[]): SpecialRelation[] {
  const result: SpecialRelation[] = [];
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const b1 = positions[i].pillar.charAt(1);
      const b2 = positions[j].pillar.charAt(1);
      for (const pair of SHIGO_PAIRS) {
        if (
          (pair[0] === b1 && pair[1] === b2) ||
          (pair[1] === b1 && pair[0] === b2)
        ) {
          result.push({
            type: `支合(${pair[0]}${pair[1]})`,
            positions: [positions[i].pos, positions[j].pos],
            elements: [b1, b2],
            meaning: `${POSITION_LABEL[positions[i].pos]}と${POSITION_LABEL[positions[j].pos]}の地支が支合し、深い縁を形成`,
          });
        }
      }
    }
  }
  return result;
}

// 三合 ----------------------------------------------------------------
function detectSanGo(positions: PosPillar[]): SpecialRelation[] {
  const result: SpecialRelation[] = [];
  const branches = positions.map(p => ({ pos: p.pos, branch: p.pillar.charAt(1) }));

  for (const { branches: triBranches, element } of SANGO_GROUPS) {
    const matched = triBranches.filter(b => branches.some(p => p.branch === b));
    if (matched.length === 3) {
      const matchedPositions = triBranches.map(
        b => branches.find(p => p.branch === b)!.pos,
      );
      result.push({
        type: `三合${element}局(${triBranches.join('')})`,
        positions: matchedPositions,
        elements: [...triBranches],
        meaning: `三合により${element}の性質が強く形成される`,
      });
    }
  }
  return result;
}

// 冲 ------------------------------------------------------------------
function detectChu(positions: PosPillar[]): SpecialRelation[] {
  return detectBranchPair(positions, CHU_PAIRS, '冲', '対立し刺激し合う関係');
}

// 刑 ------------------------------------------------------------------
function detectKei(positions: PosPillar[]): SpecialRelation[] {
  const result: SpecialRelation[] = [];
  const branches = positions.map(p => ({ pos: p.pos, branch: p.pillar.charAt(1) }));

  // 三刑
  for (const { branches: triBranches } of KEI_GROUPS.sankei) {
    const matched = triBranches.filter(b => branches.some(p => p.branch === b));
    if (matched.length === 3) {
      const matchedPositions = triBranches.map(
        b => branches.find(p => p.branch === b)!.pos,
      );
      result.push({
        type: `三刑(${triBranches.join('')})`,
        positions: matchedPositions,
        elements: [...triBranches],
        meaning: '三刑により、関係性に試練的な要素が加わる',
      });
    }
  }

  // 相刑
  for (const pair of KEI_GROUPS.sokei) {
    for (let i = 0; i < branches.length; i++) {
      for (let j = i + 1; j < branches.length; j++) {
        if (
          (pair[0] === branches[i].branch && pair[1] === branches[j].branch) ||
          (pair[1] === branches[i].branch && pair[0] === branches[j].branch)
        ) {
          result.push({
            type: `相刑(${pair[0]}${pair[1]})`,
            positions: [branches[i].pos, branches[j].pos],
            elements: [branches[i].branch, branches[j].branch],
            meaning: '相刑関係',
          });
        }
      }
    }
  }

  // 自刑
  for (const branch of KEI_GROUPS.jikei) {
    const occurrences = branches.filter(b => b.branch === branch);
    if (occurrences.length >= 2) {
      result.push({
        type: `自刑(${branch}${branch})`,
        positions: occurrences.map(o => o.pos),
        elements: [branch, branch],
        meaning: '自刑関係',
      });
    }
  }

  return result;
}

// 害 ------------------------------------------------------------------
function detectGai(positions: PosPillar[]): SpecialRelation[] {
  return detectBranchPair(positions, GAI_PAIRS, '害', '害する関係');
}

// 破 ------------------------------------------------------------------
function detectHa(positions: PosPillar[]): SpecialRelation[] {
  return detectBranchPair(positions, HA_PAIRS, '破', '破の関係');
}

// 共通: 地支ペア検出 -------------------------------------------------
function detectBranchPair(
  positions: PosPillar[],
  pairs: Array<[string, string]>,
  label: string,
  baseMeaning: string,
): SpecialRelation[] {
  const result: SpecialRelation[] = [];
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const b1 = positions[i].pillar.charAt(1);
      const b2 = positions[j].pillar.charAt(1);
      for (const pair of pairs) {
        if (
          (pair[0] === b1 && pair[1] === b2) ||
          (pair[1] === b1 && pair[0] === b2)
        ) {
          result.push({
            type: `${label}(${pair[0]}${pair[1]})`,
            positions: [positions[i].pos, positions[j].pos],
            elements: [b1, b2],
            meaning: `${POSITION_LABEL[positions[i].pos]}と${POSITION_LABEL[positions[j].pos]}に${baseMeaning}`,
          });
        }
      }
    }
  }
  return result;
}
