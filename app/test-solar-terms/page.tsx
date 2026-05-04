'use client';

import { getSetsugetsuYear, getSetsugetsuBranch } from '@/lib/solar-terms';
import { calculateMeishiki } from '@/lib/sanmei';

interface TestCase {
  label: string;
  date: Date;
  expectYear: number;
  expectBranch: string;
}

const TEST_CASES: TestCase[] = [
  // 立春境界（2024年立春: 02-04 17:27 JST）
  { label: '2024-02-03 12:00（立春前）', date: new Date(2024, 1, 3, 12, 0), expectYear: 2023, expectBranch: '丑' },
  { label: '2024-02-04 17:00（立春直前）', date: new Date(2024, 1, 4, 17, 0), expectYear: 2023, expectBranch: '丑' },
  { label: '2024-02-04 18:00（立春直後）', date: new Date(2024, 1, 4, 18, 0), expectYear: 2024, expectBranch: '寅' },
  { label: '2024-02-05 12:00（立春後）', date: new Date(2024, 1, 5, 12, 0), expectYear: 2024, expectBranch: '寅' },
  // 啓蟄境界（2024年啓蟄: 03-05 11:23 JST）
  { label: '2024-03-04 12:00（啓蟄前）', date: new Date(2024, 2, 4, 12, 0), expectYear: 2024, expectBranch: '寅' },
  { label: '2024-03-05 11:22（啓蟄直前）', date: new Date(2024, 2, 5, 11, 22), expectYear: 2024, expectBranch: '寅' },
  { label: '2024-03-05 11:24（啓蟄直後）', date: new Date(2024, 2, 5, 11, 24), expectYear: 2024, expectBranch: '卯' },
  { label: '2024-03-06 12:00（啓蟄後）', date: new Date(2024, 2, 6, 12, 0), expectYear: 2024, expectBranch: '卯' },
  // 大雪境界（2024年大雪: 12-07 00:16 JST）— 月支「子」へ
  { label: '2024-12-06 12:00（大雪前）', date: new Date(2024, 11, 6, 12, 0), expectYear: 2024, expectBranch: '亥' },
  { label: '2024-12-08 12:00（大雪後）', date: new Date(2024, 11, 8, 12, 0), expectYear: 2024, expectBranch: '子' },
  // 既存検証ケース
  { label: '1980-04-26（中央=石門星のはず）', date: new Date(1980, 3, 26, 12, 0), expectYear: 1980, expectBranch: '辰' },
];

export default function TestSolarTermsPage() {
  return (
    <main className="px-6 py-12 max-w-3xl mx-auto" style={{ color: 'var(--color-ink)' }}>
      <h1 className="text-xl mb-2">節気テスト — Solar Terms Verification</h1>
      <p className="text-xs mb-6" style={{ color: 'var(--color-gray-500)' }}>
        節月暦による年と月支の判定ロジックを検証します。
      </p>

      <table className="w-full text-xs border-collapse">
        <thead>
          <tr style={{ borderBottom: '1px solid var(--color-gray-300)' }}>
            <th className="text-left py-2 px-2">入力日時</th>
            <th className="text-left py-2 px-2">期待</th>
            <th className="text-left py-2 px-2">実際</th>
            <th className="text-left py-2 px-2">判定</th>
          </tr>
        </thead>
        <tbody>
          {TEST_CASES.map((tc, i) => {
            const actualYear = getSetsugetsuYear(tc.date);
            const actualBranch = getSetsugetsuBranch(tc.date);
            const ok = actualYear === tc.expectYear && actualBranch === tc.expectBranch;
            return (
              <tr key={i} style={{ borderBottom: '1px solid var(--color-gray-200)' }}>
                <td className="py-2 px-2 font-inter">{tc.label}</td>
                <td className="py-2 px-2 font-inter">{tc.expectYear} / {tc.expectBranch}</td>
                <td className="py-2 px-2 font-inter">{actualYear} / {actualBranch}</td>
                <td className="py-2 px-2" style={{ color: ok ? 'var(--color-gold)' : 'var(--color-vermilion)' }}>
                  {ok ? '✓ PASS' : '✗ FAIL'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2 className="text-lg mt-10 mb-2">命式算出の検証</h2>
      <p className="text-xs mb-4" style={{ color: 'var(--color-gray-500)' }}>
        節月暦適用後の命式（年柱・月柱・日柱・人体図）の確認。
      </p>
      {[
        { name: '1980-04-26（庚申/庚辰/丁巳, 中央=石門星のはず）', y: 1980, m: 4, d: 26 },
        { name: '2024-02-03（立春前→2023年扱い）', y: 2024, m: 2, d: 3 },
        { name: '2024-02-05（立春後→2024年扱い）', y: 2024, m: 2, d: 5 },
      ].map((c, i) => {
        const r = calculateMeishiki({ year: c.y, month: c.m, day: c.d });
        return (
          <div key={i} className="mb-4 p-3 text-xs font-inter" style={{ border: '1px solid var(--color-gray-300)' }}>
            <p className="mb-1" style={{ color: 'var(--color-ink)' }}>{c.name}</p>
            <p style={{ color: 'var(--color-gray-700)' }}>
              年柱: {r.yearPillar.stem}{r.yearPillar.branch} / 月柱: {r.monthPillar.stem}{r.monthPillar.branch} / 日柱: {r.dayPillar.stem}{r.dayPillar.branch}
            </p>
            <p style={{ color: 'var(--color-gray-700)' }}>
              人体図: 頭={r.mainStars.head}・左肩={r.mainStars.leftShoulder}・<strong>中央={r.mainStars.chest}</strong>・右肩={r.mainStars.rightShoulder}・腹={r.mainStars.abdomen}
            </p>
            <p style={{ color: 'var(--color-gray-700)' }}>
              従星: 初年={r.followStars.initial} / 中年={r.followStars.middle} / 晩年={r.followStars.late}
            </p>
          </div>
        );
      })}
    </main>
  );
}
