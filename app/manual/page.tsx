'use client';

import Link from 'next/link';

export default function ManualPage() {
  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  return (
    <main className="flex-1 px-6 py-12 print:py-0 print:px-0">
      {/* ツールバー（印刷時は非表示） */}
      <div className="max-w-3xl mx-auto mb-8 flex items-center justify-between print:hidden">
        <Link
          href="/"
          className="text-xs tracking-wider transition-opacity hover:opacity-60"
          style={{ color: 'var(--color-gray-500)' }}
        >
          ← トップへ戻る
        </Link>
        <button
          onClick={handlePrint}
          className="px-5 py-2.5 text-xs tracking-widest transition-all duration-300 hover:opacity-80"
          style={{
            color: 'var(--color-white)',
            backgroundColor: 'var(--color-ink)',
            borderRadius: '2px',
          }}
        >
          PDFをダウンロード
        </button>
      </div>

      {/* 印刷ヒント */}
      <div
        className="max-w-3xl mx-auto mb-10 p-4 text-xs leading-relaxed print:hidden"
        style={{
          backgroundColor: 'var(--color-white)',
          border: '1px solid var(--color-gray-300)',
          color: 'var(--color-gray-700)',
          borderRadius: '2px',
        }}
      >
        <p className="mb-1" style={{ color: 'var(--color-ink)' }}>
          📄 PDF として保存する方法
        </p>
        <p>
          上の「PDFをダウンロード」ボタン（または <kbd className="font-inter">Ctrl/Cmd + P</kbd>）で印刷ダイアログを開き、
          「送信先 / プリンター」に <strong>「PDF として保存」</strong> を選択してください。
        </p>
      </div>

      {/* マニュアル本体 */}
      <article className="manual max-w-3xl mx-auto" style={{ color: 'var(--color-ink)' }}>
        <header className="text-center mb-12 pb-8" style={{ borderBottom: '1px solid var(--color-gray-300)' }}>
          <h1 className="text-3xl tracking-wider mb-3">Sanmei Compass</h1>
          <p className="text-sm" style={{ color: 'var(--color-gray-500)' }}>ユーザーマニュアル</p>
          <p className="text-xs mt-2 font-inter" style={{ color: 'var(--color-gray-500)' }}>
            算命学 命式自動算出 × AI 解釈アプリ
          </p>
        </header>

        <section className="mb-10">
          <h2>1. このアプリでできること</h2>
          <ul>
            <li><strong>生年月日から命式を自動算出</strong> — 年柱・月柱・日柱（三柱）と蔵干を導出</li>
            <li><strong>十大主星と十二大従星</strong> を自動配置</li>
            <li><strong>3×3 人体図</strong> で本人の核と周囲の関係性を一望</li>
            <li><strong>0〜90 歳のエネルギー曲線</strong> を初年・中年・晩年の三段階で可視化</li>
            <li><strong>Claude AI による具体的な解釈</strong> をストリーミング表示</li>
            <li><strong>過去の鑑定履歴</strong> を端末内に最大 20 件保存</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2>2. 画面構成と利用フロー</h2>
          <pre className="text-xs font-inter">{`┌──────────┐    入力    ┌──────────┐   保存    ┌──────────┐
│ /input   │ ─────────> │ /result  │ ────────> │ /history │
│ 生年月日 │            │ 鑑定結果 │           │ 過去鑑定 │
└──────────┘            └──────────┘           └──────────┘
                              ▲                      │
                              └──────────────────────┘
                                   選択して再表示`}</pre>
          <ol>
            <li>トップから「鑑定をはじめる」を押すと <code>/input</code> へ</li>
            <li>生年月日を入力すると <code>/result</code> で命式と AI 解釈が表示される</li>
            <li>鑑定は自動で履歴に保存され、<code>/history</code> からいつでも呼び出せる</li>
          </ol>
        </section>

        <section className="mb-10">
          <h2>3. 入力画面 — <code>/input</code></h2>
          <h3>入力項目</h3>
          <table>
            <thead>
              <tr><th>項目</th><th>必須</th><th>形式</th><th>用途</th></tr>
            </thead>
            <tbody>
              <tr><td>お名前</td><td>任意</td><td>自由テキスト</td><td>AI 解釈の語りかけに使用</td></tr>
              <tr><td>生年月日</td><td><strong>必須</strong></td><td>年4桁・月日2桁</td><td>命式の算出元</td></tr>
              <tr><td>出生時刻</td><td>任意</td><td>時(0-23)・分(0-59)</td><td>時柱の算出（将来機能）</td></tr>
              <tr><td>出生地</td><td>任意</td><td>都道府県選択</td><td>真太陽時補正（将来機能）</td></tr>
            </tbody>
          </table>
          <h3>バリデーション</h3>
          <ul>
            <li>年は <strong>1920〜2030</strong> の範囲</li>
            <li>月は <strong>1〜12</strong>、日は <strong>1〜31</strong></li>
            <li>不正な値はフォーム下部にメッセージ表示</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2>4. 鑑定結果画面 — <code>/result</code></h2>

          <h3>4.1 命式サマリー（三柱）</h3>
          <ul>
            <li><strong>年柱</strong> — 家系・親世代の影響</li>
            <li><strong>月柱</strong> — 社会・職業の場</li>
            <li><strong>日柱</strong> — 本人の核（日干が十大主星の起点）</li>
          </ul>

          <h3>4.2 十大主星 — 人体図（3×3 9マス）</h3>
          <pre className="text-xs font-inter">{`┌─────────┬──────────┬─────────┐
│ 初年従星 │  頭(月干) │ 中年従星 │
├─────────┼──────────┼─────────┤
│ 左肩(年干)│ 中央(本人)│ 右肩(月支)│  ← 中央は朱赤枠で強調
├─────────┼──────────┼─────────┤
│ 三柱表示 │  腹(年支) │ 晩年従星 │
└─────────┴──────────┴─────────┘`}</pre>
          <table>
            <thead>
              <tr><th>位置</th><th>由来</th><th>象意</th></tr>
            </thead>
            <tbody>
              <tr><td>頭（北）</td><td>月干 vs 日干</td><td>表に出る顔・社会的役割</td></tr>
              <tr><td>左肩（西）</td><td>年干 vs 日干</td><td>親・先祖からの影響</td></tr>
              <tr><td><strong>中央（本人）</strong></td><td>日支主蔵干 vs 日干</td><td><strong>本人の核となる本質</strong></td></tr>
              <tr><td>右肩（東）</td><td>月支主蔵干 vs 日干</td><td>配偶者・才能</td></tr>
              <tr><td>腹（南）</td><td>年支主蔵干 vs 日干</td><td>基盤・子孫・財産</td></tr>
            </tbody>
          </table>

          <h4>十大主星の分類</h4>
          <table>
            <thead>
              <tr><th>系統</th><th>星</th><th>キーワード</th></tr>
            </thead>
            <tbody>
              <tr><td>自我（守備）</td><td>貫索星 / 石門星</td><td>独立心・協調</td></tr>
              <tr><td>表現（伝達）</td><td>鳳閣星 / 調舒星</td><td>楽観・繊細</td></tr>
              <tr><td>財（魅力）</td><td>禄存星 / 司禄星</td><td>奉仕・蓄積</td></tr>
              <tr><td>行動（実行）</td><td>車騎星 / 牽牛星</td><td>スピード・名誉</td></tr>
              <tr><td>学習（思考）</td><td>龍高星 / 玉堂星</td><td>冒険・伝統知</td></tr>
            </tbody>
          </table>
          <p>各マスにカーソル（モバイルはタップ）で星の解説が浮き出して表示されます。</p>

          <h3>4.3 宿命のエネルギー曲線（十二大従星タイムライン）</h3>
          <table>
            <thead>
              <tr><th>段階</th><th>年齢</th><th>由来</th><th>説明</th></tr>
            </thead>
            <tbody>
              <tr><td><strong>初年</strong></td><td>0〜30 歳</td><td>年支</td><td>才能の種が宿る時期</td></tr>
              <tr><td><strong>中年</strong></td><td>30〜60 歳</td><td>月支</td><td>本質が試される時期</td></tr>
              <tr><td><strong>晩年</strong></td><td>60 歳〜</td><td>日支</td><td>宿命が結実する時期</td></tr>
            </tbody>
          </table>
          <h4>十二大従星のエネルギー早見表</h4>
          <table>
            <thead>
              <tr><th>星</th><th>E</th><th>星</th><th>E</th><th>星</th><th>E</th></tr>
            </thead>
            <tbody>
              <tr><td>天報星</td><td>1</td><td>天禄星</td><td>7</td><td>天極星</td><td>3</td></tr>
              <tr><td>天印星</td><td>2</td><td>天将星</td><td><strong>12</strong></td><td>天庫星</td><td>5</td></tr>
              <tr><td>天貴星</td><td>3</td><td>天堂星</td><td>6</td><td>天馳星</td><td>4</td></tr>
              <tr><td>天恍星</td><td>4</td><td>天胡星</td><td>5</td><td>—</td><td>—</td></tr>
              <tr><td>天南星</td><td>8</td><td>—</td><td>—</td><td>—</td><td>—</td></tr>
            </tbody>
          </table>

          <h3>4.4 AI 解釈（Claude によるストリーミング解説）</h3>
          <p>画面下部で <strong>Claude Opus 4.7</strong> が命式を読み解いた解説を 1,100〜1,400 字でストリーミング表示します。</p>
          <ol>
            <li>冒頭の人物像（2〜3 行）</li>
            <li>4 テーマの具体的解説（仕事・人間関係・お金・人生のリズム、各テーマで具体エピソード 2〜3 個）</li>
            <li>総括（命式から導かれる生き方の指針）</li>
          </ol>
        </section>

        <section className="mb-10">
          <h2>5. 履歴画面 — <code>/history</code></h2>
          <ul>
            <li><strong>保存先</strong>: ブラウザの localStorage（端末内、外部送信なし）</li>
            <li><strong>保存件数</strong>: 最新 <strong>20 件</strong>（古いものから自動削除）</li>
            <li><strong>重複処理</strong>: 同一の生年月日は最新で上書き</li>
            <li>クリックで当時の <code>/result</code> を再表示</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2>6. 算命学の計算ロジック</h2>
          <h3>6.1 年柱</h3>
          <p><code>(年 - 4) mod 10</code> → 天干、<code>(年 - 4) mod 12</code> → 地支</p>
          <h3>6.2 月柱（五虎遁）</h3>
          <pre className="text-xs font-inter">{`yearStemBase = (年干index % 5) * 2 + 2
月干 = (yearStemBase + 月支offset) mod 10`}</pre>
          <h3>6.3 日柱</h3>
          <p><code>1900-01-01 = 壬戌</code> を基準日とし、経過日数から循環。</p>
          <h3>6.4 十大主星</h3>
          <table>
            <thead>
              <tr><th>関係</th><th>同陰陽</th><th>異陰陽</th></tr>
            </thead>
            <tbody>
              <tr><td>比和</td><td>比肩→<strong>貫索星</strong></td><td>劫財→<strong>石門星</strong></td></tr>
              <tr><td>洩気（食傷）</td><td>食神→<strong>鳳閣星</strong></td><td>傷官→<strong>調舒星</strong></td></tr>
              <tr><td>財</td><td>偏財→<strong>禄存星</strong></td><td>正財→<strong>司禄星</strong></td></tr>
              <tr><td>官</td><td>偏官→<strong>車騎星</strong></td><td>正官→<strong>牽牛星</strong></td></tr>
              <tr><td>印</td><td>偏印→<strong>龍高星</strong></td><td>正印→<strong>玉堂星</strong></td></tr>
            </tbody>
          </table>
          <h3>6.5 十二大従星</h3>
          <p>各日干の長生位置から、<strong>陽干は順行・陰干は逆行</strong>で 12 ステップ進めて 12 運を求め、12 運→従星対応表で従星名に変換します。</p>
        </section>

        <section className="mb-10">
          <h2>7. よくある質問</h2>
          <p><strong>Q. 中央の星が一般の鑑定本と違う気がします</strong></p>
          <p>本アプリは「<strong>高尾系算命学</strong>」の体系に基づき、<strong>日支主蔵干 vs 日干</strong> で中央を算出します。算命学には複数の流派があり、流派によって解釈や算出方法が異なります。一部の簡易表では「日柱の干支そのまま」を中央としているものもあり、結果が異なって見えることがあります。</p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-gray-700)' }}>なお、本アプリの解釈ロジックは <strong>[鑑定者名]</strong> 氏の鑑定哲学に基づき設計されています。</p>

          <p><strong>Q. 立春をまたぐ生年（2/3 頃）は正しく算出されますか？</strong></p>
          <p>正しく算出されます。本アプリは<strong>節月暦</strong>に対応しており、立春前生まれは前年扱い、毎月の節入り（啓蟄・清明など）で月支が切り替わるよう実装されています（v2.0 以降）。</p>

          <p><strong>Q. 出生時刻と出生地は使われていますか？</strong></p>
          <p>入力は受け付けますが、現バージョンの命式算出には未使用です。時柱・真太陽時補正は将来実装。</p>

          <p><strong>Q. AI 解釈は毎回同じですか？</strong></p>
          <p>Claude はわずかにゆらぎがあり、再生成すると言い回しが変わります。趣旨は同じです。</p>
        </section>

        <section className="mb-10">
          <h2>8. 既知の制限事項</h2>
          <ul>
            <li>時柱・真太陽時補正は未実装（Coming Soon）</li>
            <li>大運・年運などの後天運は未実装</li>
            <li>履歴は端末内 localStorage のみ（クラウド同期なし）</li>
          </ul>
        </section>

        <footer className="mt-16 pt-6 text-center text-xs font-inter" style={{ color: 'var(--color-gray-500)', borderTop: '1px solid var(--color-gray-300)' }}>
          Sanmei Compass — Last updated: 2026-05-04
        </footer>
      </article>

      <style jsx global>{`
        .manual h2 {
          font-size: 1.25rem;
          letter-spacing: 0.05em;
          margin-top: 1.75rem;
          margin-bottom: 1rem;
          padding-bottom: 0.4rem;
          border-bottom: 1px solid var(--color-gray-300);
        }
        .manual h3 {
          font-size: 1rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.6rem;
          color: var(--color-ink);
        }
        .manual h4 {
          font-size: 0.875rem;
          font-weight: 600;
          margin-top: 0.9rem;
          margin-bottom: 0.4rem;
          color: var(--color-ink-soft);
        }
        .manual p {
          font-size: 0.875rem;
          line-height: 1.8;
          margin-bottom: 0.75rem;
        }
        .manual ul, .manual ol {
          font-size: 0.875rem;
          line-height: 1.8;
          padding-left: 1.4rem;
          margin-bottom: 0.75rem;
        }
        .manual ul { list-style: disc; }
        .manual ol { list-style: decimal; }
        .manual li { margin-bottom: 0.25rem; }
        .manual code {
          font-family: var(--font-inter, ui-monospace, monospace);
          font-size: 0.8125rem;
          padding: 0.1rem 0.35rem;
          background-color: var(--color-gray-100, #f3f3f0);
          border-radius: 2px;
        }
        .manual pre {
          padding: 0.85rem 1rem;
          background-color: var(--color-gray-100, #f3f3f0);
          border-radius: 2px;
          overflow-x: auto;
          margin-bottom: 0.85rem;
          line-height: 1.5;
          white-space: pre;
        }
        .manual table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.8125rem;
          margin-bottom: 1rem;
        }
        .manual th, .manual td {
          border: 1px solid var(--color-gray-300);
          padding: 0.5rem 0.7rem;
          text-align: left;
          vertical-align: top;
        }
        .manual th {
          background-color: var(--color-gray-100, #f3f3f0);
          font-weight: 600;
        }
        kbd {
          padding: 0.1rem 0.4rem;
          border: 1px solid var(--color-gray-300);
          border-radius: 3px;
          background: var(--color-white);
          font-size: 0.75rem;
        }

        @media print {
          @page {
            size: A4;
            margin: 18mm 16mm;
          }
          html, body {
            background: white !important;
          }
          .manual {
            max-width: 100% !important;
            color: #111 !important;
          }
          .manual h2 {
            page-break-after: avoid;
            break-after: avoid;
          }
          .manual h3, .manual h4 {
            page-break-after: avoid;
            break-after: avoid;
          }
          .manual table, .manual pre {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          a {
            color: inherit !important;
            text-decoration: none !important;
          }
        }
      `}</style>
    </main>
  );
}
