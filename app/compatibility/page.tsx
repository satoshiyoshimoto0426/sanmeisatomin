'use client';

import { useState } from 'react';
import Link from 'next/link';

interface CrossMeta {
  kango: string[];
  shigo: string[];
  chu: string[];
  sanGo: string[];
  sameDayStem: boolean;
  sameDayBranch: boolean;
}

interface PersonMeta {
  name?: string;
  yearPillar: string;
  monthPillar: string;
  dayPillar: string;
}

interface MetaInfo {
  person1: PersonMeta;
  person2: PersonMeta;
  cross: CrossMeta;
}

interface PersonForm {
  name: string;
  year: string;
  month: string;
  day: string;
}

const emptyPerson = (): PersonForm => ({ name: '', year: '', month: '', day: '' });

export default function CompatibilityPage() {
  const [p1, setP1] = useState<PersonForm>(emptyPerson());
  const [p2, setP2] = useState<PersonForm>(emptyPerson());
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [meta, setMeta] = useState<MetaInfo | null>(null);

  const validate = (p: PersonForm, label: string): string | null => {
    const y = parseInt(p.year);
    const m = parseInt(p.month);
    const d = parseInt(p.day);
    if (!p.year || !p.month || !p.day) return `${label}の生年月日を入力してください。`;
    if (y < 1920 || y > 2030) return `${label}の年は1920〜2030の範囲で入力してください。`;
    if (m < 1 || m > 12) return `${label}の月は1〜12で入力してください。`;
    if (d < 1 || d > 31) return `${label}の日は1〜31で入力してください。`;
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setText('');
    setMeta(null);

    const e1 = validate(p1, 'お一人目');
    if (e1) { setError(e1); return; }
    const e2 = validate(p2, 'お二人目');
    if (e2) { setError(e2); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/compatibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          person1: {
            name: p1.name || undefined,
            year: parseInt(p1.year),
            month: parseInt(p1.month),
            day: parseInt(p1.day),
          },
          person2: {
            name: p2.name || undefined,
            year: parseInt(p2.year),
            month: parseInt(p2.month),
            day: parseInt(p2.day),
          },
        }),
      });

      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({ error: '通信に失敗しました。' }));
        throw new Error(j.error || '通信に失敗しました。');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const payload = line.slice(6);
          if (payload === '[DONE]') continue;
          try {
            const obj = JSON.parse(payload);
            if (obj.text) setText(prev => prev + obj.text);
            if (obj.meta) setMeta(obj.meta);
            if (obj.error) throw new Error(obj.error);
          } catch (err) {
            if (err instanceof Error && err.message) throw err;
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 px-6 py-12">
      <div className="max-w-2xl mx-auto" style={{ color: 'var(--color-ink)' }}>
        <div className="mb-8">
          <Link
            href="/"
            className="text-xs tracking-wider transition-opacity hover:opacity-60"
            style={{ color: 'var(--color-gray-500)' }}
          >
            ← トップへ戻る
          </Link>
        </div>

        <header className="text-center mb-12 pb-6"
          style={{ borderBottom: '1px solid var(--color-gray-300)' }}>
          <h1 className="text-2xl md:text-3xl tracking-wider mb-3">相性鑑定</h1>
          <p className="text-xs" style={{ color: 'var(--color-gray-500)' }}>
            お二人の命式から、響き合いの形を読み解きます
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-10">
          {([['お一人目', p1, setP1], ['お二人目', p2, setP2]] as const).map(([label, p, setP]) => (
            <section key={label} className="space-y-4">
              <h2 className="text-sm tracking-[0.2em]">{label}</h2>
              <input
                type="text"
                placeholder="お名前（任意）"
                value={p.name}
                onChange={e => setP({ ...p, name: e.target.value })}
                className="w-full px-3 py-2 text-sm"
                style={{
                  backgroundColor: 'var(--color-white)',
                  border: '1px solid var(--color-gray-300)',
                  borderRadius: '2px',
                }}
              />
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="number"
                  placeholder="年"
                  value={p.year}
                  onChange={e => setP({ ...p, year: e.target.value })}
                  className="px-3 py-2 text-sm"
                  style={{
                    backgroundColor: 'var(--color-white)',
                    border: '1px solid var(--color-gray-300)',
                    borderRadius: '2px',
                  }}
                />
                <input
                  type="number"
                  placeholder="月"
                  value={p.month}
                  onChange={e => setP({ ...p, month: e.target.value })}
                  className="px-3 py-2 text-sm"
                  style={{
                    backgroundColor: 'var(--color-white)',
                    border: '1px solid var(--color-gray-300)',
                    borderRadius: '2px',
                  }}
                />
                <input
                  type="number"
                  placeholder="日"
                  value={p.day}
                  onChange={e => setP({ ...p, day: e.target.value })}
                  className="px-3 py-2 text-sm"
                  style={{
                    backgroundColor: 'var(--color-white)',
                    border: '1px solid var(--color-gray-300)',
                    borderRadius: '2px',
                  }}
                />
              </div>
            </section>
          ))}

          {error && (
            <p className="text-sm" style={{ color: 'var(--color-vermilion)' }}>
              {error}
            </p>
          )}

          <div className="text-center pt-4">
            <button
              type="submit"
              disabled={loading}
              className="inline-block px-10 py-3 text-sm tracking-widest transition-all duration-300 hover:opacity-80 disabled:opacity-40"
              style={{
                color: 'var(--color-white)',
                backgroundColor: 'var(--color-ink)',
                borderRadius: '2px',
              }}
            >
              {loading ? '読み解いています...' : '相性を読み解く'}
            </button>
          </div>
        </form>

        {meta && (
          <section className="mt-16 pt-8 space-y-6"
            style={{ borderTop: '1px solid var(--color-gray-300)' }}>
            <h2 className="text-sm tracking-[0.2em] mb-3">お二人の命式</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {[meta.person1, meta.person2].map((person, i) => (
                <div
                  key={i}
                  className="p-4"
                  style={{
                    backgroundColor: 'var(--color-white)',
                    border: '1px solid var(--color-gray-300)',
                    borderRadius: '2px',
                  }}
                >
                  <p className="mb-2" style={{ color: 'var(--color-gray-500)' }}>
                    {i === 0 ? 'お一人目' : 'お二人目'}
                    {person.name ? ` ・ ${person.name}` : ''}
                  </p>
                  <p className="font-mono">
                    {person.yearPillar} / {person.monthPillar} / {person.dayPillar}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-xs space-y-1" style={{ color: 'var(--color-gray-500)' }}>
              {meta.cross.kango.length > 0 && <p>響き合う関係: {meta.cross.kango.join(', ')}</p>}
              {meta.cross.shigo.length > 0 && <p>深い縁の関係: {meta.cross.shigo.join(', ')}</p>}
              {meta.cross.sanGo.length > 0 && <p>強い結束: {meta.cross.sanGo.join(', ')}</p>}
              {meta.cross.chu.length > 0 && <p>刺激し合う関係: {meta.cross.chu.join(', ')}</p>}
              {meta.cross.sameDayStem && <p>同じ日干（鏡のような本質）</p>}
              {meta.cross.sameDayBranch && <p>同じ日支（核が重なる）</p>}
            </div>
          </section>
        )}

        {text && (
          <section className="mt-12 pt-8"
            style={{ borderTop: '1px solid var(--color-gray-300)' }}>
            <article className="text-sm md:text-base leading-loose whitespace-pre-wrap"
              style={{ color: 'var(--color-ink)' }}>
              {text}
            </article>
          </section>
        )}
      </div>
    </main>
  );
}
