'use client';

import { useState } from 'react';
import type { MeishikiResult } from '@/lib/sanmei';

interface Plan {
  thisWeek: string[];
  thisMonth: string[];
  nextThreeMonths: string[];
}

interface Props {
  meishiki: MeishikiResult;
}

type Status = 'idle' | 'loading' | 'done' | 'error';

export default function ActionPlan({ meishiki }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [plan, setPlan] = useState<Plan | null>(null);
  const [error, setError] = useState('');

  async function handleGenerate() {
    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/action-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meishiki }),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({ error: 'APIエラー' }));
        throw new Error(errBody.error || 'APIエラーが発生しました。');
      }
      const data: Plan = await res.json();
      setPlan(data);
      setStatus('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus('error');
    }
  }

  if (status === 'idle') {
    return (
      <div className="text-center print:hidden">
        <button
          onClick={handleGenerate}
          className="px-8 py-3 text-sm tracking-wider transition-all duration-300 hover:opacity-80"
          style={{
            color: 'var(--color-white)',
            backgroundColor: 'var(--color-vermilion)',
            borderRadius: '2px',
          }}
        >
          アクションプランを生成
        </button>
        <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--color-gray-500)' }}>
          命式の特性を活かすための、明日から試せる小さな行動を提案します。
        </p>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="p-8 text-center" style={{ backgroundColor: 'var(--color-white)', border: '1px solid var(--color-gray-300)' }}>
        <p className="text-sm italic" style={{ color: 'var(--color-gray-700)' }}>
          あなたの命式から、行動の種を編んでいます…
        </p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="p-6 text-center" style={{ backgroundColor: 'var(--color-white)', border: '1px solid var(--color-gray-300)' }}>
        <p className="text-sm" style={{ color: 'var(--color-vermilion)' }}>生成に失敗しました</p>
        <p className="text-xs mt-2 font-inter" style={{ color: 'var(--color-gray-500)' }}>{error}</p>
        <button
          onClick={handleGenerate}
          className="mt-4 text-xs underline"
          style={{ color: 'var(--color-vermilion)' }}
        >
          もう一度試す
        </button>
      </div>
    );
  }

  // done
  if (!plan) return null;

  const sections = [
    { title: '今週試す小さな一歩', items: plan.thisWeek, accent: 'var(--color-gold)' },
    { title: '今月の目標', items: plan.thisMonth, accent: 'var(--color-ink)' },
    { title: '3ヶ月の重点テーマ', items: plan.nextThreeMonths, accent: 'var(--color-vermilion)' },
  ];

  return (
    <div
      className="p-6 md:p-8 rounded-sm space-y-6"
      style={{
        backgroundColor: 'var(--color-white)',
        border: '1px solid var(--color-gray-300)',
      }}
    >
      <div className="text-center pb-2" style={{ borderBottom: '1px solid var(--color-gray-300)' }}>
        <h3 className="text-sm tracking-wider" style={{ color: 'var(--color-ink)' }}>
          あなたの命式から導かれるアクション
        </h3>
        <p className="text-xs mt-1 italic" style={{ color: 'var(--color-gray-500)' }}>
          あくまで参考です。試したいものから自由に選んでください。
        </p>
      </div>

      {sections.map(({ title, items, accent }) => (
        <section key={title} className="space-y-2">
          <h4 className="text-xs tracking-wider" style={{ color: accent }}>
            {title}
          </h4>
          <ul className="space-y-2">
            {items.map((item, i) => (
              <li
                key={i}
                className="text-sm leading-relaxed pl-4 relative"
                style={{ color: 'var(--color-ink-soft)' }}
              >
                <span
                  className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: accent, opacity: 0.5 }}
                />
                {item}
              </li>
            ))}
          </ul>
        </section>
      ))}

      <div className="pt-2 text-center print:hidden">
        <button
          onClick={handleGenerate}
          className="text-xs underline transition-opacity hover:opacity-70"
          style={{ color: 'var(--color-gray-500)' }}
        >
          別の提案を生成
        </button>
      </div>
    </div>
  );
}
