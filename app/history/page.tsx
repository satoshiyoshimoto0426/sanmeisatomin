'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { MeishikiResult } from '@/lib/sanmei';

interface HistoryEntry {
  id: number;
  savedAt: string;
  result: MeishikiResult;
}

function toWareki(year: number): string {
  if (year >= 2019) return `令和${year - 2018}`;
  if (year >= 1989) return `平成${year - 1988}`;
  if (year >= 1926) return `昭和${year - 1925}`;
  if (year >= 1912) return `大正${year - 1911}`;
  return `明治${year - 1867}`;
}

export default function HistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('sanmei-history') || '[]');
      setEntries(stored);
    } catch {
      setEntries([]);
    }
    setLoaded(true);
  }, []);

  function clearHistory() {
    if (confirm('鑑定履歴をすべて削除しますか？')) {
      localStorage.removeItem('sanmei-history');
      setEntries([]);
    }
  }

  function removeEntry(id: number) {
    const next = entries.filter(e => e.id !== id);
    setEntries(next);
    localStorage.setItem('sanmei-history', JSON.stringify(next));
  }

  if (!loaded) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p style={{ color: 'var(--color-gray-500)' }}>読み込み中…</p>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col items-center px-4 md:px-6 py-12 md:py-20">
      <div className="max-w-2xl w-full space-y-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl tracking-wider" style={{ color: 'var(--color-ink)' }}>
              過去の鑑定
            </h1>
            <p className="text-xs" style={{ color: 'var(--color-gray-500)' }}>
              このデバイスに保存された命式の履歴
            </p>
          </div>
          <Link
            href="/"
            className="text-xs tracking-wider transition-opacity hover:opacity-60"
            style={{ color: 'var(--color-gray-500)' }}
          >
            ← ホーム
          </Link>
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-20 space-y-6">
            <p style={{ color: 'var(--color-gray-500)' }}>まだ鑑定の履歴がありません。</p>
            <Link
              href="/input"
              className="inline-block px-8 py-3 text-sm tracking-wider transition-all duration-300 hover:opacity-80"
              style={{
                color: 'var(--color-white)',
                backgroundColor: 'var(--color-ink)',
                borderRadius: '2px',
              }}
            >
              命式を導く
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {entries.map(entry => {
                const { result, savedAt, id } = entry;
                const { birthDate, yearPillar, monthPillar, dayPillar, name, mainStars } = result;
                const params = new URLSearchParams({
                  year: birthDate.year.toString(),
                  month: birthDate.month.toString(),
                  day: birthDate.day.toString(),
                  ...(name ? { name } : {}),
                });
                const savedDate = new Date(savedAt);

                return (
                  <div
                    key={id}
                    className="p-6 md:p-8 rounded-sm group relative"
                    style={{
                      backgroundColor: 'var(--color-white)',
                      border: '1px solid var(--color-gray-300)',
                    }}
                  >
                    <Link href={`/result?${params.toString()}`} className="block">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-3 flex-1">
                          {name && (
                            <p className="text-base md:text-lg" style={{ color: 'var(--color-ink)' }}>
                              {name}
                            </p>
                          )}
                          <div className="flex items-center gap-2 font-inter text-xs" style={{ color: 'var(--color-gray-500)' }}>
                            <span>{birthDate.year}年{birthDate.month}月{birthDate.day}日</span>
                            <span>（{toWareki(birthDate.year)}年）</span>
                          </div>
                          {/* 三柱 */}
                          <div className="flex gap-6">
                            {[
                              { label: '年', pillar: yearPillar },
                              { label: '月', pillar: monthPillar },
                              { label: '日', pillar: dayPillar },
                            ].map(({ label, pillar }) => (
                              <div key={label} className="text-center">
                                <p className="text-xs mb-1" style={{ color: 'var(--color-gray-500)' }}>{label}柱</p>
                                <p className="text-lg" style={{ color: 'var(--color-ink)' }}>
                                  {pillar.stem}{pillar.branch}
                                </p>
                              </div>
                            ))}
                            <div className="ml-auto text-right">
                              <p className="text-xs mb-1" style={{ color: 'var(--color-gray-500)' }}>日主</p>
                              <p className="text-base" style={{ color: 'var(--color-ink)' }}>
                                {mainStars.chest}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-xs font-inter" style={{ color: 'var(--color-gray-500)' }}>
                          {savedDate.getMonth() + 1}/{savedDate.getDate()}
                        </div>
                      </div>
                    </Link>
                    {/* 削除ボタン */}
                    <button
                      onClick={() => removeEntry(id)}
                      className="absolute top-3 right-10 text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
                      style={{ color: 'var(--color-gray-500)' }}
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="text-center pt-4">
              <button
                onClick={clearHistory}
                className="text-xs transition-opacity hover:opacity-60"
                style={{ color: 'var(--color-gray-500)' }}
              >
                履歴をすべて削除
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
