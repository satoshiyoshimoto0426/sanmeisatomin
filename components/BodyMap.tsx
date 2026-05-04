'use client';

import { useState } from 'react';
import { STAR_DESCRIPTIONS } from '@/lib/constants';
import type { MeishikiResult } from '@/lib/sanmei';

interface BodyMapProps {
  result: MeishikiResult;
}

type CellKind = 'main' | 'follow' | 'pillar' | 'core';

interface Cell {
  star?: string;
  label: string;
  sub?: string;
  kind: CellKind;
}

function StarCell({ cell, flipUp }: { cell: Cell; flipUp?: boolean }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const { star, label, sub, kind } = cell;

  const isCore = kind === 'core';
  const isFollow = kind === 'follow';
  const isPillar = kind === 'pillar';

  const borderColor = isCore
    ? 'var(--color-vermilion)'
    : isFollow
    ? 'var(--color-gold)'
    : 'var(--color-gray-300)';

  const borderWidth = isCore ? '2px' : '1px';

  const showTip = star && STAR_DESCRIPTIONS[star];

  return (
    <div
      className="relative aspect-square flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:opacity-90"
      style={{
        backgroundColor: 'var(--color-white)',
        border: `${borderWidth} solid ${borderColor}`,
        borderRadius: '2px',
        zIndex: showTooltip ? 50 : 'auto',
      }}
      onMouseEnter={() => showTip && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onTouchStart={() => showTip && setShowTooltip(!showTooltip)}
    >
      <span
        className="text-[10px] tracking-wider mb-1"
        style={{ color: 'var(--color-gray-500)' }}
      >
        {label}
      </span>
      {star && (
        <span
          className="text-xs md:text-sm font-medium text-center px-1"
          style={{
            color: isCore ? 'var(--color-vermilion)' : 'var(--color-ink)',
          }}
        >
          {star}
        </span>
      )}
      {sub && !star && (
        <span
          className="text-xs md:text-sm font-inter text-center"
          style={{ color: 'var(--color-ink)' }}
        >
          {sub}
        </span>
      )}
      {isPillar && sub && star && (
        <span className="text-[10px] font-inter mt-0.5" style={{ color: 'var(--color-gray-500)' }}>
          {sub}
        </span>
      )}
      {showTooltip && showTip && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 w-56 p-3 text-xs leading-relaxed rounded shadow-lg pointer-events-none ${
            flipUp ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}
          style={{
            zIndex: 60,
            backgroundColor: 'var(--color-white)',
            color: 'var(--color-ink-soft)',
            border: '1px solid var(--color-gray-300)',
          }}
        >
          <p className="font-medium mb-1" style={{ color: 'var(--color-ink)' }}>{star}</p>
          {STAR_DESCRIPTIONS[star]}
        </div>
      )}
    </div>
  );
}

export default function BodyMap({ result }: BodyMapProps) {
  const { mainStars, followStars, yearPillar, monthPillar, dayPillar } = result;

  // 3×3 配置:
  //  [初年従星]    [頭/月干主星]      [中年従星]
  //  [左肩/年干]   [中央/日支主星★]    [右肩/月支主星]
  //  [日柱]        [腹/年支主星]      [晩年従星]
  const cells: Cell[] = [
    { star: followStars.initial, label: '初年（従星）', kind: 'follow' },
    { star: mainStars.head, label: '頭 — 北', kind: 'main' },
    { star: followStars.middle, label: '中年（従星）', kind: 'follow' },

    { star: mainStars.leftShoulder, label: '左肩 — 西', kind: 'main' },
    { star: mainStars.chest, label: '中央（本人）', kind: 'core' },
    { star: mainStars.rightShoulder, label: '右肩 — 東', kind: 'main' },

    {
      label: '命式（三柱）',
      sub: `${yearPillar.stem}${yearPillar.branch}・${monthPillar.stem}${monthPillar.branch}・${dayPillar.stem}${dayPillar.branch}`,
      kind: 'pillar',
    },
    { star: mainStars.abdomen, label: '腹 — 南', kind: 'main' },
    { star: followStars.late, label: '晩年（従星）', kind: 'follow' },
  ];

  return (
    <div className="py-4">
      <div className="grid grid-cols-3 gap-2 md:gap-3 max-w-md mx-auto">
        {cells.map((cell, i) => (
          <StarCell key={i} cell={cell} flipUp={i >= 6} />
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px]" style={{ color: 'var(--color-gray-500)' }}>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ border: '2px solid var(--color-vermilion)' }} />
          中央（本人の核）
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ border: '1px solid var(--color-gold)' }} />
          十二大従星
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ border: '1px solid var(--color-gray-300)' }} />
          十大主星
        </span>
      </div>
    </div>
  );
}
