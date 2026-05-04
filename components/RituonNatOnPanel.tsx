/**
 * 律音・納音パネル
 * 律音=同一干支の重なり（深い縁の象徴）、納音=同納音グループ（共鳴する響き）
 */
import type { RituonNatOn } from '@/lib/enriched-meishiki';

interface Props {
  data: RituonNatOn;
}

const POS_LABEL: Record<string, string> = {
  year: '年柱', month: '月柱', day: '日柱', time: '時柱',
};

export default function RituonNatOnPanel({ data }: Props) {
  const hasAny = data.rituon.length > 0 || data.natOn.length > 0;

  if (!hasAny) {
    return (
      <div
        className="p-5 text-xs leading-relaxed"
        style={{
          backgroundColor: 'var(--color-white)',
          border: '1px solid var(--color-gray-300)',
          borderRadius: '2px',
          color: 'var(--color-gray-500)',
        }}
      >
        命式内に律音・納音の重なりはありません。
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.rituon.length > 0 && (
        <div
          className="p-4"
          style={{
            backgroundColor: 'var(--color-white)',
            border: '1px solid var(--color-gray-300)',
            borderRadius: '2px',
          }}
        >
          <p className="text-xs tracking-wider mb-1" style={{ color: 'var(--color-gold)' }}>
            律音 — 同じ干支が重なる、深い縁の象徴
          </p>
          <p className="text-xs mb-3" style={{ color: 'var(--color-gray-500)' }}>
            同じ響きが命式に重なるとき、その柱が示す領域に深い印象が宿ります。
          </p>
          <ul className="space-y-1 text-xs">
            {data.rituon.map((r, i) => (
              <li key={i}>
                <span className="font-mono" style={{ color: 'var(--color-ink)' }}>{r.pillar}</span>
                <span className="ml-2" style={{ color: 'var(--color-gray-500)' }}>
                  {r.positions.map(p => POS_LABEL[p] ?? p).join(' / ')}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.natOn.length > 0 && (
        <div
          className="p-4"
          style={{
            backgroundColor: 'var(--color-white)',
            border: '1px solid var(--color-gray-300)',
            borderRadius: '2px',
          }}
        >
          <p className="text-xs tracking-wider mb-1" style={{ color: 'var(--color-gold)' }}>
            納音 — 同じ響きを持つ柱の重なり
          </p>
          <p className="text-xs mb-3" style={{ color: 'var(--color-gray-500)' }}>
            異なる干支でも、内に流れる音色が共鳴している組み合わせです。
          </p>
          <ul className="space-y-1 text-xs">
            {data.natOn.map((n, i) => (
              <li key={i}>
                <span style={{ color: 'var(--color-ink)' }}>{n.natOnGroup}</span>
                <span className="ml-2 font-mono" style={{ color: 'var(--color-gray-700)' }}>
                  {n.pillars.join(' × ')}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
