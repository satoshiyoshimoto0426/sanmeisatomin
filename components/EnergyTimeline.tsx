'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  ReferenceLine,
} from 'recharts';

interface TimelineProps {
  data: Array<{ age: number; star: string; energy: number }>;
  followStars?: { initial: string; middle: string; late: string };
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { age: number; star: string; energy: number } }> }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        className="px-4 py-3 rounded shadow-lg text-sm"
        style={{
          backgroundColor: 'var(--color-white)',
          border: '1px solid var(--color-gray-300)',
          color: 'var(--color-ink)',
        }}
      >
        <p className="font-inter font-medium">{data.age}歳</p>
        {data.star && <p className="mt-1">{data.star}</p>}
        <p className="font-inter text-xs mt-1" style={{ color: 'var(--color-gray-500)' }}>
          エネルギー: <span style={{ color: 'var(--color-vermilion)' }}>{data.energy}</span> / 12
        </p>
      </div>
    );
  }
  return null;
}

export default function EnergyTimeline({ data, followStars }: TimelineProps) {
  return (
    <div className="space-y-3">
      <div className="w-full h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c14a3d" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#c14a3d" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="phaseGrad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#b8893d" stopOpacity={0.06} />
                <stop offset="100%" stopColor="#b8893d" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="phaseGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1a2b4a" stopOpacity={0.04} />
                <stop offset="100%" stopColor="#1a2b4a" stopOpacity={0.01} />
              </linearGradient>
              <linearGradient id="phaseGrad3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c14a3d" stopOpacity={0.06} />
                <stop offset="100%" stopColor="#c14a3d" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            {/* フェーズ帯背景 */}
            <ReferenceArea x1={0} x2={30} fill="url(#phaseGrad1)" strokeOpacity={0} />
            <ReferenceArea x1={30} x2={60} fill="url(#phaseGrad2)" strokeOpacity={0} />
            <ReferenceArea x1={60} x2={90} fill="url(#phaseGrad3)" strokeOpacity={0} />

            {/* フェーズ境界線 */}
            <ReferenceLine
              x={30}
              stroke="var(--color-gray-300)"
              strokeDasharray="4 3"
              strokeWidth={1.5}
            />
            <ReferenceLine
              x={60}
              stroke="var(--color-gray-300)"
              strokeDasharray="4 3"
              strokeWidth={1.5}
            />

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-gray-300)"
              strokeOpacity={0.4}
            />
            <XAxis
              dataKey="age"
              tickFormatter={(v) => `${v}歳`}
              stroke="var(--color-gray-500)"
              fontSize={11}
              fontFamily="Inter, sans-serif"
              ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90]}
            />
            <YAxis
              domain={[0, 14]}
              ticks={[0, 6, 12]}
              tickFormatter={(v) => v === 0 ? '内省' : v === 12 ? '活動' : ''}
              stroke="var(--color-gray-500)"
              fontSize={11}
              fontFamily="Inter, sans-serif"
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="energy"
              stroke="#c14a3d"
              strokeWidth={2.5}
              fill="url(#energyGradient)"
              dot={{
                fill: 'var(--color-white)',
                stroke: '#c14a3d',
                strokeWidth: 2,
                r: 4,
              }}
              activeDot={{
                fill: '#c14a3d',
                stroke: 'var(--color-white)',
                strokeWidth: 2,
                r: 6,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* フェーズラベル */}
      {followStars && (
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-inter" style={{ color: 'var(--color-gray-500)' }}>
          <div style={{ color: 'var(--color-gold)' }}>初年 ▲ {followStars.initial}</div>
          <div style={{ color: 'var(--color-ink-soft)' }}>中年 ▲ {followStars.middle}</div>
          <div style={{ color: 'var(--color-vermilion)' }}>晩年 ▲ {followStars.late}</div>
        </div>
      )}

      {/* 注記: エネルギーは優劣ではない */}
      <p className="text-xs italic leading-relaxed mt-3" style={{ color: 'var(--color-gray-500)' }}>
        ※ 縦軸の高低は活動エネルギーの<strong>質の違い</strong>を示すもので、星に優劣はありません。
        高い時期は外向きに活発、低い時期は内向きに深化する時期です。
      </p>
    </div>
  );
}
