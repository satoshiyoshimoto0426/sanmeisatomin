'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { calculateMeishiki, calculateEnrichedMeishiki } from '@/lib/sanmei';
import { FOLLOW_STAR_ENERGY, FOLLOW_STARS_META } from '@/lib/constants';
import { selectClassicQuote } from '@/lib/classics';
import MeishikiCard from '@/components/MeishikiCard';
import BodyMap from '@/components/BodyMap';
import EnergyTimeline from '@/components/EnergyTimeline';
import InterpretationStream from '@/components/InterpretationStream';
import ActionPlan from '@/components/ActionPlan';
import PdfDownloadButton from '@/components/PdfDownloadButton';
import DaiunFlow from '@/components/DaiunFlow';
import ChuusatsuPanel from '@/components/ChuusatsuPanel';
import SpecialRelationsPanel from '@/components/SpecialRelationsPanel';
import RituonNatOnPanel from '@/components/RituonNatOnPanel';

// 命式を localStorage に保存する
function saveToHistory(result: ReturnType<typeof calculateMeishiki>) {
  try {
    const key = 'sanmei-history';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const entry = {
      id: Date.now(),
      savedAt: new Date().toISOString(),
      result,
    };
    // 同じ生年月日は上書き
    const filtered = existing.filter(
      (e: typeof entry) =>
        !(
          e.result.birthDate.year === result.birthDate.year &&
          e.result.birthDate.month === result.birthDate.month &&
          e.result.birthDate.day === result.birthDate.day
        )
    );
    localStorage.setItem(key, JSON.stringify([entry, ...filtered].slice(0, 20)));
  } catch {
    // localStorage 無効時は無視
  }
}

function ResultContent() {
  const searchParams = useSearchParams();

  const year = parseInt(searchParams.get('year') || '1990');
  const month = parseInt(searchParams.get('month') || '1');
  const day = parseInt(searchParams.get('day') || '1');
  const name = searchParams.get('name') || undefined;

  const result = calculateMeishiki({ name, year, month, day });
  // S/Aランク Part 1: 立運・宿命中殺・特殊干支関係・律音納音などの拡張データ
  const enriched = calculateEnrichedMeishiki({ name, year, month, day });
  const currentAge = new Date().getFullYear() - year;
  const sheetParams = new URLSearchParams({
    year: String(year), month: String(month), day: String(day),
  });
  if (name) sheetParams.set('name', name);

  // 履歴に保存
  useEffect(() => {
    saveToHistory(result);
  }, [result]);

  const quote = selectClassicQuote(result);
  const fileName = `sanmei-compass-${result.birthDate.year}${String(result.birthDate.month).padStart(2,'0')}${String(result.birthDate.day).padStart(2,'0')}${name ? `-${name}` : ''}`;

  return (
    <main className="flex-1 flex flex-col items-center px-4 md:px-6 py-12 md:py-20">
      <div id="result-content" className="max-w-2xl w-full space-y-16 md:space-y-24">

        {/* 右上に履歴リンク */}
        <div className="flex justify-end">
          <Link
            href="/history"
            className="text-xs tracking-wider transition-opacity hover:opacity-60"
            style={{ color: 'var(--color-gray-500)' }}
          >
            過去の鑑定 →
          </Link>
        </div>

        {/* セクション1: 命式サマリー */}
        <section className="space-y-2">
          <div className="text-center mb-8">
            <h2 className="text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--color-gray-500)' }}>
              命式 — Meishiki
            </h2>
          </div>
          <MeishikiCard result={result} />
        </section>

        <div className="w-16 h-px mx-auto" style={{ backgroundColor: 'var(--color-gray-300)' }} />

        {/* セクション2: 人体図 */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--color-gray-500)' }}>
              十大主星 — 人体図
            </h2>
            <p className="text-xs mt-2" style={{ color: 'var(--color-gray-500)' }}>
              各星にカーソルを合わせると説明が表示されます
            </p>
          </div>
          <BodyMap result={result} />
        </section>

        <div className="w-16 h-px mx-auto" style={{ backgroundColor: 'var(--color-gray-300)' }} />

        {/* セクション3: エネルギータイムライン */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--color-gray-500)' }}>
              宿命のエネルギー曲線
            </h2>
            <p className="text-xs mt-2" style={{ color: 'var(--color-gray-500)' }}>
              才能と宿命は、時間とともにどう開花するか
            </p>
          </div>

          {/* 人生3段階カード */}
          <div className="grid grid-cols-3 gap-3">
            {([
              {
                label: '初年',
                range: '0〜30歳',
                star: result.followStars.initial,
                accentColor: 'var(--color-gold)',
                phaseDesc: '才能の種が宿る時期',
              },
              {
                label: '中年',
                range: '30〜60歳',
                star: result.followStars.middle,
                accentColor: 'var(--color-ink)',
                phaseDesc: '本質が試される時期',
              },
              {
                label: '晩年',
                range: '60歳〜',
                star: result.followStars.late,
                accentColor: 'var(--color-vermilion)',
                phaseDesc: '宿命が結実する時期',
              },
            ] as const).map(({ label, range, star, accentColor, phaseDesc }) => {
              const meta = FOLLOW_STARS_META[star];
              const energy = meta?.energy ?? FOLLOW_STAR_ENERGY[star] ?? 5;
              const typeLabel = meta?.typeLabel ?? '';
              const shortDesc = meta?.shortDescription ?? '';
              return (
                <div
                  key={label}
                  className="p-4 rounded-sm text-center space-y-2 flex flex-col"
                  style={{
                    backgroundColor: 'var(--color-white)',
                    border: '1px solid var(--color-gray-300)',
                  }}
                >
                  <div>
                    <p className="text-xs font-inter font-medium" style={{ color: accentColor }}>{label}</p>
                    <p className="text-xs font-inter mt-0.5" style={{ color: 'var(--color-gray-500)' }}>{range}</p>
                  </div>
                  <p className="text-sm md:text-base font-medium" style={{ color: 'var(--color-ink)' }}>{star}</p>
                  {typeLabel && (
                    <p className="text-xs tracking-wider" style={{ color: accentColor }}>
                      {typeLabel}
                    </p>
                  )}
                  {shortDesc && (
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--color-gray-700)' }}>
                      {shortDesc}
                    </p>
                  )}
                  {/* エネルギーバー（小さく） */}
                  <div className="space-y-1 mt-auto pt-2">
                    <div
                      className="w-full rounded-full"
                      style={{ height: '2px', backgroundColor: 'var(--color-gray-200)' }}
                    >
                      <div
                        className="rounded-full transition-all duration-500"
                        style={{
                          height: '2px',
                          width: `${(energy / 12) * 100}%`,
                          backgroundColor: accentColor,
                          opacity: 0.6,
                        }}
                      />
                    </div>
                    <p className="text-[10px] font-inter" style={{ color: 'var(--color-gray-500)' }}>
                      活動度 {energy}/12
                    </p>
                  </div>
                  <p className="text-[10px] italic" style={{ color: 'var(--color-gray-500)' }}>{phaseDesc}</p>
                </div>
              );
            })}
          </div>

          <EnergyTimeline data={result.timeline} followStars={result.followStars} />
        </section>

        <div className="w-16 h-px mx-auto" style={{ backgroundColor: 'var(--color-gray-300)' }} />

        {/* セクション3.5: 立運・大運の流れ */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--color-gray-500)' }}>
              立運・大運の流れ
            </h2>
            <p className="text-xs mt-2" style={{ color: 'var(--color-gray-500)' }}>
              10年ごとに巡る、人生の運の質
            </p>
          </div>
          <DaiunFlow daiun={enriched.daiun} currentAge={currentAge} />
        </section>

        <div className="w-16 h-px mx-auto" style={{ backgroundColor: 'var(--color-gray-300)' }} />

        {/* セクション3.6: 宿命中殺 */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--color-gray-500)' }}>
              宿命中殺 — 独自の道を歩む傾向
            </h2>
            <p className="text-xs mt-2" style={{ color: 'var(--color-gray-500)' }}>
              中殺は欠陥ではなく、深まりの場
            </p>
          </div>
          <ChuusatsuPanel chuusatsu={enriched.chuusatsu} />
        </section>

        <div className="w-16 h-px mx-auto" style={{ backgroundColor: 'var(--color-gray-300)' }} />

        {/* セクション3.7: 特殊干支関係 */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--color-gray-500)' }}>
              命式の中の響き合い
            </h2>
            <p className="text-xs mt-2" style={{ color: 'var(--color-gray-500)' }}>
              干合・支合・三合・冲・刑・害・破
            </p>
          </div>
          <SpecialRelationsPanel relations={enriched.specialRelations} />
        </section>

        <div className="w-16 h-px mx-auto" style={{ backgroundColor: 'var(--color-gray-300)' }} />

        {/* セクション3.8: 律音・納音 */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--color-gray-500)' }}>
              律音・納音 — 重なる響き
            </h2>
          </div>
          <RituonNatOnPanel data={enriched.rituonNatOn} />
        </section>

        <div className="w-16 h-px mx-auto" style={{ backgroundColor: 'var(--color-gray-300)' }} />

        {/* セクション4: Claude AI 解釈（ストリーミング） */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--color-gray-500)' }}>
              命式から見える、あなたの強みと宿命
            </h2>
            <p className="text-xs mt-2" style={{ color: 'var(--color-gray-500)' }}>
              AI × 算命学知識ベースによる解釈
            </p>
            <p className="text-xs mt-3 italic" style={{ color: 'var(--color-gray-500)' }}>
              ※ 本アプリの解釈は高尾系算命学に基づきます。他流派とは異なる場合があります。
            </p>
          </div>
          <InterpretationStream meishiki={result} />
        </section>

        <div className="w-16 h-px mx-auto" style={{ backgroundColor: 'var(--color-gray-300)' }} />

        {/* セクション5: 古典引用 */}
        <section>
          <div
            className="p-6 md:p-8 rounded-sm"
            style={{
              backgroundColor: 'var(--color-white)',
              borderLeft: '3px solid var(--color-vermilion)',
              border: '1px solid var(--color-gray-300)',
            }}
          >
            <p className="text-[10px] tracking-[0.3em] uppercase mb-3" style={{ color: 'var(--color-gray-500)' }}>
              あなたの命式に響く先人の言葉
            </p>
            <p className="text-base md:text-lg leading-loose" style={{ color: 'var(--color-ink)' }}>
              {quote.text}
            </p>
            <p className="text-xs mt-4 font-inter" style={{ color: 'var(--color-gray-500)' }}>
              ― {quote.source}
            </p>
          </div>
        </section>

        <div className="w-16 h-px mx-auto" style={{ backgroundColor: 'var(--color-gray-300)' }} />

        {/* セクション6: アクションプラン */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--color-gray-500)' }}>
              明日からの一歩
            </h2>
            <p className="text-xs mt-2" style={{ color: 'var(--color-gray-500)' }}>
              命式の特性を活かす、具体的なアクション
            </p>
          </div>
          <ActionPlan meishiki={result} />
        </section>

        {/* フッター */}
        <div className="text-center pt-8 pb-12 flex flex-col items-center gap-4 print:hidden">
          <PdfDownloadButton targetId="result-content" fileName={fileName} />
          <Link
            href="/input"
            className="inline-block px-8 py-3 text-sm tracking-wider transition-all duration-300 hover:opacity-80"
            style={{
              color: 'var(--color-ink)',
              border: '1px solid var(--color-gray-300)',
              borderRadius: '2px',
            }}
          >
            もう一度導く
          </Link>
          <Link
            href={`/sheet?${sheetParams.toString()}`}
            className="text-xs transition-opacity hover:opacity-60"
            style={{ color: 'var(--color-gray-500)' }}
          >
            鑑定者向け総合算出シートを開く →
          </Link>
          <Link
            href="/history"
            className="text-xs transition-opacity hover:opacity-60"
            style={{ color: 'var(--color-gray-500)' }}
          >
            過去の鑑定を見る
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <main className="flex-1 flex items-center justify-center">
          <p style={{ color: 'var(--color-gray-500)' }}>命式を導いています…</p>
        </main>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
