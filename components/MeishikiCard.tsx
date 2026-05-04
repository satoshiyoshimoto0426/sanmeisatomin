import type { MeishikiResult } from '@/lib/sanmei';

interface MeishikiCardProps {
  result: MeishikiResult;
}

function toWareki(year: number): string {
  if (year >= 2019) return `令和${year - 2018}年`;
  if (year >= 1989) return `平成${year - 1988}年`;
  if (year >= 1926) return `昭和${year - 1925}年`;
  if (year >= 1912) return `大正${year - 1911}年`;
  return `明治${year - 1867}年`;
}

export default function MeishikiCard({ result }: MeishikiCardProps) {
  const { birthDate, yearPillar, monthPillar, dayPillar } = result;
  const wareki = toWareki(birthDate.year);

  return (
    <div className="space-y-8">
      {result.name && (
        <p className="text-xl md:text-2xl text-center" style={{ color: 'var(--color-ink)' }}>
          {result.name}
        </p>
      )}

      <div className="text-center space-y-1">
        <p className="font-inter text-sm" style={{ color: 'var(--color-gray-500)' }}>
          {birthDate.year}年{birthDate.month}月{birthDate.day}日
        </p>
        <p className="text-sm" style={{ color: 'var(--color-gray-500)' }}>
          {wareki}{birthDate.month}月{birthDate.day}日
        </p>
      </div>

      {/* 三柱 */}
      <div className="flex justify-center gap-8 md:gap-16 pt-4">
        {[
          { label: '年柱', pillar: yearPillar },
          { label: '月柱', pillar: monthPillar },
          { label: '日柱', pillar: dayPillar },
        ].map(({ label, pillar }) => (
          <div key={label} className="text-center space-y-3">
            <p className="text-xs" style={{ color: 'var(--color-gray-500)' }}>{label}</p>
            <div className="space-y-1">
              <p className="text-2xl md:text-3xl" style={{ color: 'var(--color-ink)' }}>
                {pillar.stem}
              </p>
              <p className="text-2xl md:text-3xl" style={{ color: 'var(--color-ink-soft)' }}>
                {pillar.branch}
              </p>
            </div>
            <p className="text-sm" style={{ color: 'var(--color-gray-500)' }}>
              {pillar.stem}{pillar.branch}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
