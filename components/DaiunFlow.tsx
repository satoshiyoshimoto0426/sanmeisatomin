/**
 * 立運・大運の流れ表示コンポーネント
 *
 * 立運開始年齢、順行/逆行、節入りまでの日数を冒頭で説明し、
 * 9区分の大運を年齢帯・干支・従星・天中殺フラグで表示する。
 */
import type { DaiunInfo } from '@/lib/enriched-meishiki';

interface Props {
  daiun: DaiunInfo;
  currentAge: number;
}

export default function DaiunFlow({ daiun, currentAge }: Props) {
  const directionLabel = daiun.direction === 'forward' ? '順行' : '逆行';

  return (
    <div className="space-y-4">
      <div
        className="p-4 text-xs leading-relaxed"
        style={{
          backgroundColor: 'var(--color-white)',
          border: '1px solid var(--color-gray-300)',
          borderRadius: '2px',
          color: 'var(--color-gray-700)',
        }}
      >
        <p>
          立運（人生の運の流れが始まる年齢）は{' '}
          <strong style={{ color: 'var(--color-ink)' }}>{daiun.startAge}歳</strong>。
          節入りまでの日数（{daiun.setsuDistanceDays}日）を3で割って算出されています。
          以後、10年ごとに巡る「大運」を{directionLabel}で受け取ります。
        </p>
        <p className="mt-2" style={{ color: 'var(--color-gray-500)' }}>
          ※「大運天中殺」の時期は、内省と種まきに向く穏やかな期間です。
          焦らず自分を耕す時期として捉えてみてください。
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-gray-300)' }}>
              <th className="text-left py-2 pr-2 font-normal" style={{ color: 'var(--color-gray-500)' }}>期間</th>
              <th className="text-left py-2 pr-2 font-normal" style={{ color: 'var(--color-gray-500)' }}>干支</th>
              <th className="text-left py-2 pr-2 font-normal" style={{ color: 'var(--color-gray-500)' }}>従星</th>
              <th className="text-left py-2 font-normal" style={{ color: 'var(--color-gray-500)' }}>時期の質</th>
            </tr>
          </thead>
          <tbody>
            {daiun.pillars.map((p, i) => {
              const isCurrent = currentAge >= p.startAge && currentAge <= p.endAge;
              return (
                <tr
                  key={i}
                  style={{
                    borderBottom: '1px solid var(--color-gray-200)',
                    backgroundColor: isCurrent ? 'var(--color-cream, #faf7f0)' : 'transparent',
                  }}
                >
                  <td className="py-2 pr-2 font-mono">
                    {p.startAge}〜{p.endAge}歳
                    {isCurrent && (
                      <span
                        className="ml-2 text-[10px] px-1.5 py-0.5"
                        style={{
                          color: 'var(--color-vermilion)',
                          border: '1px solid var(--color-vermilion)',
                          borderRadius: '2px',
                        }}
                      >
                        現在
                      </span>
                    )}
                  </td>
                  <td className="py-2 pr-2 font-mono">{p.pillar}</td>
                  <td className="py-2 pr-2">{p.followStar}</td>
                  <td className="py-2">
                    {p.isTenchuusatsu ? (
                      <span style={{ color: 'var(--color-vermilion)' }}>
                        内省と種まきの時期
                      </span>
                    ) : (
                      <span style={{ color: 'var(--color-gray-500)' }}>—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
