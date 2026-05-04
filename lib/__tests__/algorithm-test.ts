/**
 * 算命学計算エンジン S/Aランク機能の検証用テストケース
 *
 * このファイルは UI から呼び出され、`/test-algorithm` ページで結果を画面表示する。
 * パートナー（鑑定者）が手計算と照合するための簡易検証ハーネス。
 */
import { calculateEnrichedMeishiki, pillarToString } from '../sanmei';

export interface TestCase {
  name: string;
  input: { year: number; month: number; day: number; hour?: number; minute?: number; gender: 'male' | 'female' };
  /** 検証期待値（手計算と照合）。判明している部分のみ記述。 */
  expected?: {
    yearPillar?: string;
    monthPillar?: string;
    dayPillar?: string;
    tenchuusatsu?: [string, string];
    junmei?: string;
  };
  /** 鑑定者向けメモ */
  note?: string;
}

export const TEST_CASES: TestCase[] = [
  {
    name: 'テストケース1: 1980-04-26 男性',
    input: { year: 1980, month: 4, day: 26, gender: 'male' },
    expected: {
      yearPillar: '庚申',
      dayPillar: '丁巳',
    },
    note: '中央=石門星（既存検証済み）。日柱「丁巳」→甲寅旬→天中殺=子丑',
  },
  {
    name: 'テストケース2: 立春前 2024-02-03 女性',
    input: { year: 2024, month: 2, day: 3, gender: 'female' },
    expected: {
      yearPillar: '癸卯', // 立春前なので2023年扱い
    },
    note: '立春切替の確認',
  },
  {
    name: 'テストケース3: 立春後 2024-02-05 女性',
    input: { year: 2024, month: 2, day: 5, gender: 'female' },
    expected: {
      yearPillar: '甲辰', // 立春後で2024年
    },
    note: '立春切替の確認',
  },
  {
    name: 'テストケース4: 1990-05-15 男性',
    input: { year: 1990, month: 5, day: 15, gender: 'male' },
    expected: {
      dayPillar: '庚午',
    },
    note: '日柱算出の検証点',
  },
  {
    name: 'テストケース5: 2000-01-01 男性',
    input: { year: 2000, month: 1, day: 1, gender: 'male' },
    note: '世紀境界（立春前なので1999年扱い）',
  },
  {
    name: 'テストケース6: 1965-08-15 女性',
    input: { year: 1965, month: 8, day: 15, gender: 'female' },
    note: '中年世代の典型例',
  },
];

export interface TestResult {
  name: string;
  input: TestCase['input'];
  note?: string;
  success: boolean;
  result?: {
    yearPillar: string;
    monthPillar: string;
    dayPillar: string;
    mainStars: Record<string, string>;
    followStars: Record<string, string>;
    daiun: {
      startAge: number;
      direction: string;
      setsuDistanceDays: number;
      pillars: Array<{ startAge: number; endAge: number; pillar: string; followStar: string; isTenchuusatsu: boolean }>;
    };
    chuusatsu: {
      tenchuusatsu: [string, string];
      junmei: string;
      locations: Array<{ position: string; branch: string; meaning: string }>;
    };
    specialRelations: {
      kango: string[];
      shigo: string[];
      sanGo: string[];
      chu: string[];
      kei: string[];
      gai: string[];
      ha: string[];
    };
    rituon: Array<{ pillar: string; positions: string[] }>;
    natOn: Array<{ natOnGroup: string; pillars: string[] }>;
    nenunTenchuusatsu: Array<{ year: number; pillar: string }>;
  };
  expectedMatches?: Array<{ field: string; expected: string; actual: string; match: boolean }>;
  error?: string;
}

/**
 * 全テストケースを実行
 */
export function runTests(): TestResult[] {
  return TEST_CASES.map(tc => {
    try {
      const m = calculateEnrichedMeishiki(tc.input);
      const yearStr = pillarToString(m.yearPillar);
      const monthStr = pillarToString(m.monthPillar);
      const dayStr = pillarToString(m.dayPillar);

      const expectedMatches: TestResult['expectedMatches'] = [];
      if (tc.expected) {
        if (tc.expected.yearPillar) {
          expectedMatches.push({
            field: 'yearPillar',
            expected: tc.expected.yearPillar,
            actual: yearStr,
            match: tc.expected.yearPillar === yearStr,
          });
        }
        if (tc.expected.monthPillar) {
          expectedMatches.push({
            field: 'monthPillar',
            expected: tc.expected.monthPillar,
            actual: monthStr,
            match: tc.expected.monthPillar === monthStr,
          });
        }
        if (tc.expected.dayPillar) {
          expectedMatches.push({
            field: 'dayPillar',
            expected: tc.expected.dayPillar,
            actual: dayStr,
            match: tc.expected.dayPillar === dayStr,
          });
        }
        if (tc.expected.tenchuusatsu) {
          const exp = [...tc.expected.tenchuusatsu].sort().join('・');
          const act = [...m.chuusatsu.tenchuusatsu].sort().join('・');
          expectedMatches.push({
            field: 'tenchuusatsu',
            expected: exp,
            actual: act,
            match: exp === act,
          });
        }
        if (tc.expected.junmei) {
          expectedMatches.push({
            field: 'junmei',
            expected: tc.expected.junmei,
            actual: m.chuusatsu.junmei,
            match: tc.expected.junmei === m.chuusatsu.junmei,
          });
        }
      }

      return {
        name: tc.name,
        input: tc.input,
        note: tc.note,
        success: true,
        expectedMatches: expectedMatches.length > 0 ? expectedMatches : undefined,
        result: {
          yearPillar: yearStr,
          monthPillar: monthStr,
          dayPillar: dayStr,
          mainStars: m.mainStars,
          followStars: m.followStars,
          daiun: {
            startAge: m.daiun.startAge,
            direction: m.daiun.direction,
            setsuDistanceDays: m.daiun.setsuDistanceDays,
            pillars: m.daiun.pillars.map(p => ({
              startAge: p.startAge,
              endAge: p.endAge,
              pillar: p.pillar,
              followStar: p.followStar,
              isTenchuusatsu: p.isTenchuusatsu,
            })),
          },
          chuusatsu: {
            tenchuusatsu: m.chuusatsu.tenchuusatsu,
            junmei: m.chuusatsu.junmei,
            locations: m.chuusatsu.locations.map(l => ({
              position: l.position,
              branch: l.branch,
              meaning: l.meaning,
            })),
          },
          specialRelations: {
            kango: m.specialRelations.kango.map(r => r.type),
            shigo: m.specialRelations.shigo.map(r => r.type),
            sanGo: m.specialRelations.sanGo.map(r => r.type),
            chu: m.specialRelations.chu.map(r => r.type),
            kei: m.specialRelations.kei.map(r => r.type),
            gai: m.specialRelations.gai.map(r => r.type),
            ha: m.specialRelations.ha.map(r => r.type),
          },
          rituon: m.rituonNatOn.rituon.map(r => ({ pillar: r.pillar, positions: r.positions })),
          natOn: m.rituonNatOn.natOn.map(n => ({ natOnGroup: n.natOnGroup, pillars: n.pillars })),
          nenunTenchuusatsu: m.unTenchuusatsu.nenunYears,
        },
      };
    } catch (e) {
      return {
        name: tc.name,
        input: tc.input,
        note: tc.note,
        success: false,
        error: (e as Error).message,
      };
    }
  });
}
