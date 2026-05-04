/**
 * 宿命中殺パネル
 *
 * 「中殺」を欠陥として語らず、「独自の道を歩む傾向」「精神的な深まりの場」として表現。
 */
import type { ChuusatsuInfo } from '@/lib/enriched-meishiki';

interface Props {
  chuusatsu: ChuusatsuInfo;
}

export default function ChuusatsuPanel({ chuusatsu }: Props) {
  const hasLocations = chuusatsu.locations.length > 0;

  return (
    <div
      className="p-5 space-y-3"
      style={{
        backgroundColor: 'var(--color-white)',
        border: '1px solid var(--color-gray-300)',
        borderRadius: '2px',
      }}
    >
      <div className="text-xs space-y-1" style={{ color: 'var(--color-gray-700)' }}>
        <p>
          あなたの旬は{' '}
          <strong style={{ color: 'var(--color-ink)' }}>{chuusatsu.junmei}</strong>、
          天中殺の支は{' '}
          <strong style={{ color: 'var(--color-vermilion)' }}>
            {chuusatsu.tenchuusatsu.join('・')}
          </strong>
          です。
        </p>
      </div>

      {hasLocations ? (
        <div className="space-y-2 pt-2"
          style={{ borderTop: '1px solid var(--color-gray-200)' }}>
          <p className="text-xs" style={{ color: 'var(--color-gray-500)' }}>
            命式に宿る中殺の場（独自の道を歩む傾向）
          </p>
          <ul className="space-y-2">
            {chuusatsu.locations.map((l, i) => (
              <li key={i} className="text-xs leading-relaxed">
                <strong style={{ color: 'var(--color-ink)' }}>
                  {l.meaning}
                </strong>
                <span className="ml-2" style={{ color: 'var(--color-gray-700)' }}>
                  ({l.branch})
                </span>
                <p className="mt-1" style={{ color: 'var(--color-gray-500)' }}>
                  {l.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-xs pt-2" style={{
          color: 'var(--color-gray-500)',
          borderTop: '1px solid var(--color-gray-200)',
        }}>
          命式内に中殺はありません。穏やかな基盤の上で人生を歩む組み合わせです。
        </p>
      )}
    </div>
  );
}
