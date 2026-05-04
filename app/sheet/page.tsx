/**
 * S/Aランク Part 2（簡易版）: 鑑定者向け総合算出シート
 *
 * Supabase 等の永続化はせず、URLパラメータから命式を算出して
 * 印刷可能な一覧として表示する。鑑定者が手計算と照合する用途。
 */
import Link from 'next/link';
import { Suspense } from 'react';
import { calculateEnrichedMeishiki, pillarToString } from '@/lib/sanmei';
import type { EnrichedMeishiki } from '@/lib/enriched-meishiki';
import PrintButton from '@/components/PrintButton';

const POS_LABEL: Record<string, string> = {
  year: '年柱', month: '月柱', day: '日柱', time: '時柱',
};

function SheetContent({ enriched, currentAge }: { enriched: EnrichedMeishiki; currentAge: number }) {
  const m = enriched;
  return (
    <main className="flex-1 px-6 py-10 print:py-4" style={{ color: 'var(--color-ink)' }}>
      <div className="max-w-4xl mx-auto space-y-8">

        {/* ナビ（印刷時非表示） */}
        <div className="flex justify-between items-center print:hidden">
          <Link
            href="/"
            className="text-xs tracking-wider transition-opacity hover:opacity-60"
            style={{ color: 'var(--color-gray-500)' }}
          >
            ← トップへ戻る
          </Link>
          <PrintButton />
        </div>

        {/* ヘッダー */}
        <header className="text-center pb-4"
          style={{ borderBottom: '2px solid var(--color-ink)' }}>
          <p className="text-xs tracking-[0.3em] uppercase mb-2"
            style={{ color: 'var(--color-gray-500)' }}>
            鑑定者向け総合算出シート
          </p>
          <h1 className="text-xl tracking-wider">
            {m.name ? `${m.name} 様` : '無記名'} ／ {m.birthDate.year}年{m.birthDate.month}月{m.birthDate.day}日生
          </h1>
          <p className="text-xs mt-2" style={{ color: 'var(--color-gray-500)' }}>
            算出日: {new Date().toISOString().slice(0, 10)} ／ 現在年齢: {currentAge}歳
          </p>
        </header>

        {/* 命式三柱 */}
        <Section title="命式三柱">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-gray-300)' }}>
                <Th>柱</Th><Th>干支</Th><Th>天干</Th><Th>地支</Th>
              </tr>
            </thead>
            <tbody>
              <Row label="年柱" pillar={m.yearPillar} />
              <Row label="月柱" pillar={m.monthPillar} />
              <Row label="日柱（本命）" pillar={m.dayPillar} />
            </tbody>
          </table>
        </Section>

        {/* 十大主星 */}
        <Section title="十大主星（人体図）">
          <table className="w-full text-sm">
            <tbody>
              <KV label="頭（北・月干）" value={m.mainStars.head} />
              <KV label="左肩（西・年干）" value={m.mainStars.leftShoulder} />
              <KV label="胸（中央・本命）" value={m.mainStars.chest} />
              <KV label="右肩（東・月支）" value={m.mainStars.rightShoulder} />
              <KV label="腹（南・年支）" value={m.mainStars.abdomen} />
            </tbody>
          </table>
        </Section>

        {/* 十二大従星 */}
        <Section title="十二大従星（人生エネルギー）">
          <table className="w-full text-sm">
            <tbody>
              <KV label="初年（0〜30歳）" value={m.followStars.initial} />
              <KV label="中年（30〜60歳）" value={m.followStars.middle} />
              <KV label="晩年（60歳〜）" value={m.followStars.late} />
            </tbody>
          </table>
        </Section>

        {/* 立運・大運 */}
        <Section title="立運・大運の流れ">
          <p className="text-xs mb-3" style={{ color: 'var(--color-gray-700)' }}>
            立運 <strong>{m.daiun.startAge}歳</strong>
            （{m.daiun.direction === 'forward' ? '順行' : '逆行'} ／ 節入りまで{m.daiun.setsuDistanceDays}日）
          </p>
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-gray-300)' }}>
                <Th>期間</Th><Th>干支</Th><Th>従星</Th><Th>大運天中殺</Th>
              </tr>
            </thead>
            <tbody>
              {m.daiun.pillars.map((p, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--color-gray-200)' }}>
                  <Td>{p.startAge}〜{p.endAge}歳</Td>
                  <Td mono>{p.pillar}</Td>
                  <Td>{p.followStar}</Td>
                  <Td>{p.isTenchuusatsu ? <span style={{ color: 'var(--color-vermilion)' }}>◎</span> : '—'}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        {/* 宿命中殺 */}
        <Section title="宿命中殺">
          <p className="text-sm mb-2">
            旬: <strong>{m.chuusatsu.junmei}</strong> ／
            天中殺: <strong style={{ color: 'var(--color-vermilion)' }}>{m.chuusatsu.tenchuusatsu.join('・')}</strong>
          </p>
          {m.chuusatsu.locations.length > 0 ? (
            <ul className="text-xs space-y-1 pl-4 list-disc">
              {m.chuusatsu.locations.map((l, i) => (
                <li key={i}>
                  {l.meaning}（{l.branch}） — {l.description}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs" style={{ color: 'var(--color-gray-500)' }}>
              命式内に中殺なし
            </p>
          )}
        </Section>

        {/* 特殊干支関係 */}
        <Section title="特殊干支関係">
          <RelationList label="干合" rels={m.specialRelations.kango} />
          <RelationList label="支合" rels={m.specialRelations.shigo} />
          <RelationList label="三合" rels={m.specialRelations.sanGo} />
          <RelationList label="冲" rels={m.specialRelations.chu} />
          <RelationList label="刑" rels={m.specialRelations.kei} />
          <RelationList label="害" rels={m.specialRelations.gai} />
          <RelationList label="破" rels={m.specialRelations.ha} />
        </Section>

        {/* 律音・納音 */}
        <Section title="律音・納音">
          <div className="text-xs space-y-2">
            <p>
              <strong>律音:</strong>{' '}
              {m.rituonNatOn.rituon.length > 0
                ? m.rituonNatOn.rituon.map(r => `${r.pillar}(${r.positions.map(p => POS_LABEL[p]).join('-')})`).join(', ')
                : 'なし'}
            </p>
            <p>
              <strong>納音:</strong>{' '}
              {m.rituonNatOn.natOn.length > 0
                ? m.rituonNatOn.natOn.map(n => `${n.natOnGroup}(${n.pillars.join('・')})`).join(', ')
                : 'なし'}
            </p>
          </div>
        </Section>

        {/* 年運天中殺 */}
        <Section title="今後30年の年運天中殺">
          {m.unTenchuusatsu.nenunYears.length > 0 ? (
            <p className="text-xs leading-relaxed">
              {m.unTenchuusatsu.nenunYears
                .map(y => `${y.year}年(${y.pillar})`).join(' ／ ')}
            </p>
          ) : (
            <p className="text-xs" style={{ color: 'var(--color-gray-500)' }}>該当なし</p>
          )}
        </Section>

        <footer className="text-center text-[10px] pt-6 print:pt-4"
          style={{ color: 'var(--color-gray-500)', borderTop: '1px solid var(--color-gray-300)' }}>
          <p>Sanmei Compass — 高尾系算命学計算エンジン</p>
          <p className="mt-1">本シートは鑑定者の手計算照合用の補助資料です。</p>
        </footer>
      </div>
    </main>
  );
}

// ── サブコンポーネント ──────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 print:break-inside-avoid">
      <h2 className="text-xs tracking-[0.2em] uppercase pb-1"
        style={{ color: 'var(--color-gray-500)', borderBottom: '1px solid var(--color-gray-300)' }}>
        {title}
      </h2>
      <div>{children}</div>
    </section>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left py-1.5 pr-3 font-normal text-xs"
    style={{ color: 'var(--color-gray-500)' }}>{children}</th>;
}

function Td({ children, mono }: { children: React.ReactNode; mono?: boolean }) {
  return <td className={`py-1.5 pr-3 ${mono ? 'font-mono' : ''}`}>{children}</td>;
}

function Row({ label, pillar }: { label: string; pillar: { stem: string; branch: string } }) {
  return (
    <tr style={{ borderBottom: '1px solid var(--color-gray-200)' }}>
      <Td>{label}</Td>
      <Td mono><strong>{pillarToString(pillar)}</strong></Td>
      <Td mono>{pillar.stem}</Td>
      <Td mono>{pillar.branch}</Td>
    </tr>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <tr style={{ borderBottom: '1px solid var(--color-gray-200)' }}>
      <Td>{label}</Td>
      <Td><strong>{value}</strong></Td>
    </tr>
  );
}

function RelationList({ label, rels }: { label: string; rels: { type: string; meaning: string }[] }) {
  return (
    <div className="text-xs flex gap-3 py-1.5"
      style={{ borderBottom: '1px solid var(--color-gray-200)' }}>
      <span className="w-10 shrink-0" style={{ color: 'var(--color-gray-500)' }}>{label}</span>
      <span className="flex-1">
        {rels.length > 0
          ? rels.map(r => r.type).join(' / ')
          : <span style={{ color: 'var(--color-gray-500)' }}>なし</span>}
      </span>
    </div>
  );
}

// ── ページ本体 ────────────────────────────────────────────
interface SearchParams {
  year?: string;
  month?: string;
  day?: string;
  name?: string;
}

export default async function SheetPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const year = parseInt(params.year || '');
  const month = parseInt(params.month || '');
  const day = parseInt(params.day || '');
  const name = params.name;

  if (!year || !month || !day) {
    return (
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="text-center space-y-4">
          <p className="text-sm" style={{ color: 'var(--color-gray-700)' }}>
            生年月日が指定されていません。
          </p>
          <Link
            href="/input"
            className="inline-block px-6 py-2 text-sm tracking-wider transition-opacity hover:opacity-80"
            style={{
              color: 'var(--color-white)',
              backgroundColor: 'var(--color-ink)',
              borderRadius: '2px',
            }}
          >
            命式を入力する
          </Link>
        </div>
      </main>
    );
  }

  let enriched: EnrichedMeishiki;
  try {
    enriched = calculateEnrichedMeishiki({ name, year, month, day });
  } catch (e) {
    return (
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <p className="text-sm" style={{ color: 'var(--color-vermilion)' }}>
          算出エラー: {(e as Error).message}
        </p>
      </main>
    );
  }
  const currentAge = new Date().getFullYear() - year;

  return (
    <Suspense>
      <SheetContent enriched={enriched} currentAge={currentAge} />
    </Suspense>
  );
}
