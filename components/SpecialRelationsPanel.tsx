/**
 * 特殊干支関係パネル — 干合・支合・三合・冲・刑・害・破
 * 全て前向きな関係性として翻訳表示。
 */
import type { SpecialRelations, SpecialRelation } from '@/lib/enriched-meishiki';

interface Props {
  relations: SpecialRelations;
}

interface Section {
  key: keyof SpecialRelations;
  label: string;
  description: string;
  accentColor: string;
}

const SECTIONS: Section[] = [
  { key: 'kango', label: '響き合う関係（干合）',
    description: '命式の中で深く響き合い、変容を生む組み合わせです。',
    accentColor: 'var(--color-gold)' },
  { key: 'shigo', label: '深い縁の関係（支合）',
    description: '静かに支え合い、安定を生む地支同士の縁です。',
    accentColor: 'var(--color-gold)' },
  { key: 'sanGo', label: '強い結束（三合）',
    description: '三つの地支が揃って力を発揮する、まとまりの強い組み合わせです。',
    accentColor: 'var(--color-gold)' },
  { key: 'chu', label: '刺激し合う関係（冲）',
    description: 'お互いを揺さぶり合い、成長を促す関係性です。',
    accentColor: 'var(--color-vermilion)' },
  { key: 'kei', label: '磨き合う関係（刑）',
    description: '時に厳しく、しかし鍛え合うことで深まる関係です。',
    accentColor: 'var(--color-vermilion)' },
  { key: 'gai', label: 'すれ違いの関係（害）',
    description: '微妙な違和感が、自分を見つめ直す機会を与えてくれます。',
    accentColor: 'var(--color-gray-700)' },
  { key: 'ha', label: '組み替えの関係（破）',
    description: '古いものが壊れ、新しい形に生まれ変わる動きを示します。',
    accentColor: 'var(--color-gray-700)' },
];

function RelationCard({ rel, accentColor }: { rel: SpecialRelation; accentColor: string }) {
  return (
    <li className="text-xs leading-relaxed py-2"
      style={{ borderBottom: '1px solid var(--color-gray-200)' }}>
      <p>
        <span style={{ color: accentColor, fontWeight: 500 }}>{rel.type}</span>
        <span className="ml-2 font-mono" style={{ color: 'var(--color-gray-700)' }}>
          {rel.elements.join(' × ')}
        </span>
      </p>
      <p className="mt-1" style={{ color: 'var(--color-gray-500)' }}>
        {rel.meaning}
      </p>
    </li>
  );
}

export default function SpecialRelationsPanel({ relations }: Props) {
  const hasAny = SECTIONS.some(s => relations[s.key].length > 0);

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
        命式内に顕著な特殊干支関係は見られません。
        穏やかでバランスの取れた組み合わせです。
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {SECTIONS.map(s => {
        const list = relations[s.key];
        if (list.length === 0) return null;
        return (
          <div
            key={s.key}
            className="p-4"
            style={{
              backgroundColor: 'var(--color-white)',
              border: '1px solid var(--color-gray-300)',
              borderRadius: '2px',
            }}
          >
            <p className="text-xs tracking-wider mb-1" style={{ color: s.accentColor }}>
              {s.label}
            </p>
            <p className="text-xs mb-3" style={{ color: 'var(--color-gray-500)' }}>
              {s.description}
            </p>
            <ul className="space-y-0">
              {list.map((rel, i) => (
                <RelationCard key={i} rel={rel} accentColor={s.accentColor} />
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
