import Link from 'next/link';
import { runTests } from '@/lib/__tests__/algorithm-test';

export default function TestAlgorithmPage() {
  const results = runTests();

  return (
    <main className="flex-1 px-6 py-12">
      <div className="max-w-5xl mx-auto" style={{ color: 'var(--color-ink)' }}>
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
          <h1 className="text-2xl md:text-3xl tracking-wider mb-3">算命学計算エンジン 検証</h1>
          <p className="text-xs" style={{ color: 'var(--color-gray-500)' }}>
            S/Aランク機能（立運・宿命中殺・特殊干支関係・律音納音）の動作検証
          </p>
        </header>

        <div className="space-y-8">
          {results.map((r, idx) => (
            <article
              key={idx}
              className="p-5 rounded-sm"
              style={{
                backgroundColor: 'var(--color-white)',
                border: '1px solid var(--color-gray-300)',
              }}
            >
              <header className="mb-4 pb-3"
                style={{ borderBottom: '1px solid var(--color-gray-200)' }}>
                <h2 className="text-base tracking-wider mb-1">{r.name}</h2>
                <p className="text-[11px]" style={{ color: 'var(--color-gray-500)' }}>
                  入力: {r.input.year}年{r.input.month}月{r.input.day}日 / {r.input.gender === 'male' ? '男性' : '女性'}
                </p>
                {r.note && (
                  <p className="text-[11px] mt-1 italic" style={{ color: 'var(--color-gray-500)' }}>
                    {r.note}
                  </p>
                )}
              </header>

              {!r.success && (
                <p className="text-sm" style={{ color: 'var(--color-vermilion)' }}>
                  エラー: {r.error}
                </p>
              )}

              {r.success && r.result && (
                <div className="space-y-5 text-sm">
                  {/* 期待値の照合 */}
                  {r.expectedMatches && r.expectedMatches.length > 0 && (
                    <section>
                      <h3 className="text-xs tracking-[0.2em] mb-2 uppercase"
                        style={{ color: 'var(--color-gray-500)' }}>
                        期待値の照合
                      </h3>
                      <table className="w-full text-xs">
                        <tbody>
                          {r.expectedMatches.map((m, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid var(--color-gray-200)' }}>
                              <td className="py-1.5 pr-3 font-medium">{m.field}</td>
                              <td className="py-1.5 pr-3">期待: {m.expected}</td>
                              <td className="py-1.5 pr-3">実際: {m.actual}</td>
                              <td className="py-1.5">
                                <span style={{ color: m.match ? 'var(--color-gold)' : 'var(--color-vermilion)' }}>
                                  {m.match ? '◯ 一致' : '✕ 不一致'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </section>
                  )}

                  {/* 命式三柱 */}
                  <section>
                    <h3 className="text-xs tracking-[0.2em] mb-2 uppercase"
                      style={{ color: 'var(--color-gray-500)' }}>
                      命式三柱
                    </h3>
                    <p className="font-mono">
                      年柱 <strong>{r.result.yearPillar}</strong> /
                      月柱 <strong>{r.result.monthPillar}</strong> /
                      日柱 <strong>{r.result.dayPillar}</strong>
                    </p>
                  </section>

                  {/* 宿命中殺 */}
                  <section>
                    <h3 className="text-xs tracking-[0.2em] mb-2 uppercase"
                      style={{ color: 'var(--color-gray-500)' }}>
                      宿命中殺
                    </h3>
                    <p>
                      旬: <strong>{r.result.chuusatsu.junmei}</strong> /
                      天中殺: <strong style={{ color: 'var(--color-vermilion)' }}>
                        {r.result.chuusatsu.tenchuusatsu.join('・')}
                      </strong>
                    </p>
                    {r.result.chuusatsu.locations.length > 0 ? (
                      <ul className="mt-2 space-y-1 text-xs pl-4 list-disc">
                        {r.result.chuusatsu.locations.map((l, i) => (
                          <li key={i}>
                            {l.position}（{l.branch}） — {l.meaning}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs mt-1" style={{ color: 'var(--color-gray-500)' }}>
                        命式内に宿命中殺なし
                      </p>
                    )}
                  </section>

                  {/* 立運・大運 */}
                  <section>
                    <h3 className="text-xs tracking-[0.2em] mb-2 uppercase"
                      style={{ color: 'var(--color-gray-500)' }}>
                      立運・大運の流れ
                    </h3>
                    <p className="text-xs mb-2">
                      立運 <strong>{r.result.daiun.startAge}歳</strong>
                      （{r.result.daiun.direction === 'forward' ? '順行' : '逆行'} /
                      節入りまで{r.result.daiun.setsuDistanceDays}日）
                    </p>
                    <table className="w-full text-xs">
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--color-gray-300)' }}>
                          <th className="text-left py-1 pr-2">期間</th>
                          <th className="text-left py-1 pr-2">干支</th>
                          <th className="text-left py-1 pr-2">従星</th>
                          <th className="text-left py-1">天中殺</th>
                        </tr>
                      </thead>
                      <tbody>
                        {r.result.daiun.pillars.map((p, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid var(--color-gray-200)' }}>
                            <td className="py-1 pr-2">{p.startAge}〜{p.endAge}歳</td>
                            <td className="py-1 pr-2 font-mono">{p.pillar}</td>
                            <td className="py-1 pr-2">{p.followStar}</td>
                            <td className="py-1">
                              {p.isTenchuusatsu && (
                                <span style={{ color: 'var(--color-vermilion)' }}>◎</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </section>

                  {/* 特殊干支関係 */}
                  <section>
                    <h3 className="text-xs tracking-[0.2em] mb-2 uppercase"
                      style={{ color: 'var(--color-gray-500)' }}>
                      特殊干支関係
                    </h3>
                    <ul className="text-xs space-y-1">
                      <li><strong>干合:</strong> {r.result.specialRelations.kango.join(', ') || 'なし'}</li>
                      <li><strong>支合:</strong> {r.result.specialRelations.shigo.join(', ') || 'なし'}</li>
                      <li><strong>三合:</strong> {r.result.specialRelations.sanGo.join(', ') || 'なし'}</li>
                      <li><strong>冲:</strong> {r.result.specialRelations.chu.join(', ') || 'なし'}</li>
                      <li><strong>刑:</strong> {r.result.specialRelations.kei.join(', ') || 'なし'}</li>
                      <li><strong>害:</strong> {r.result.specialRelations.gai.join(', ') || 'なし'}</li>
                      <li><strong>破:</strong> {r.result.specialRelations.ha.join(', ') || 'なし'}</li>
                    </ul>
                  </section>

                  {/* 律音・納音 */}
                  <section>
                    <h3 className="text-xs tracking-[0.2em] mb-2 uppercase"
                      style={{ color: 'var(--color-gray-500)' }}>
                      律音・納音
                    </h3>
                    <p className="text-xs">
                      <strong>律音:</strong>{' '}
                      {r.result.rituon.length > 0
                        ? r.result.rituon.map(x => `${x.pillar}(${x.positions.join('-')})`).join(', ')
                        : 'なし'}
                    </p>
                    <p className="text-xs mt-1">
                      <strong>納音:</strong>{' '}
                      {r.result.natOn.length > 0
                        ? r.result.natOn.map(x => `${x.natOnGroup}(${x.pillars.join('・')})`).join(', ')
                        : 'なし'}
                    </p>
                  </section>

                  {/* 直近の年運天中殺 */}
                  {r.result.nenunTenchuusatsu.length > 0 && (
                    <section>
                      <h3 className="text-xs tracking-[0.2em] mb-2 uppercase"
                        style={{ color: 'var(--color-gray-500)' }}>
                        直近30年の年運天中殺
                      </h3>
                      <p className="text-xs">
                        {r.result.nenunTenchuusatsu.slice(0, 8)
                          .map(y => `${y.year}年(${y.pillar})`).join(', ')}
                      </p>
                    </section>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>

        <footer className="mt-16 pt-6 text-center text-xs"
          style={{ color: 'var(--color-gray-500)', borderTop: '1px solid var(--color-gray-300)' }}>
          <p>このページはS/Aランク機能の動作検証用です。鑑定者の手計算と照合してください。</p>
        </footer>
      </div>
    </main>
  );
}
