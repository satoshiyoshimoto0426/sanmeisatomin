import Link from 'next/link';

export default function DisclaimerPage() {
  return (
    <main className="flex-1 px-6 py-12 md:py-16">
      <div className="max-w-2xl mx-auto" style={{ color: 'var(--color-ink)' }}>
        <div className="mb-10">
          <Link
            href="/"
            className="text-xs tracking-wider transition-opacity hover:opacity-60"
            style={{ color: 'var(--color-gray-500)' }}
          >
            ← トップへ戻る
          </Link>
        </div>

        <header className="text-center mb-12 pb-8" style={{ borderBottom: '1px solid var(--color-gray-300)' }}>
          <h1 className="text-2xl md:text-3xl tracking-wider mb-3">ご利用にあたって</h1>
          <p className="text-xs" style={{ color: 'var(--color-gray-500)' }}>免責事項・利用規約</p>
        </header>

        <article className="space-y-10 leading-loose text-sm" style={{ color: 'var(--color-ink-soft)' }}>
          <section>
            <h2 className="text-base tracking-wider mb-3 pb-2" style={{ color: 'var(--color-ink)', borderBottom: '1px solid var(--color-gray-300)' }}>
              本サービスの位置付け
            </h2>
            <p>
              Sanmei Compass は、算命学（高尾系）の体系に基づき、生年月日から命式を導出し、
              自己理解の参考となる解釈を提供するアプリケーションです。
            </p>
          </section>

          <section>
            <h2 className="text-base tracking-wider mb-3 pb-2" style={{ color: 'var(--color-ink)', borderBottom: '1px solid var(--color-gray-300)' }}>
              免責事項
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>本アプリの鑑定結果は、エンターテインメントおよび自己理解の参考としてご活用ください。</li>
              <li>本アプリは、医療、法律、金融、その他の専門的助言を提供するものではありません。</li>
              <li>本アプリの内容に基づく行動の結果について、運営者は一切の責任を負いません。</li>
              <li>重大な人生の決定にあたっては、必ず該当分野の専門家にご相談ください。</li>
              <li>体調や精神面の不調を感じる場合は、医療機関の受診を優先してください。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base tracking-wider mb-3 pb-2" style={{ color: 'var(--color-ink)', borderBottom: '1px solid var(--color-gray-300)' }}>
              算命学の流派について
            </h2>
            <p>
              本アプリは「<strong style={{ color: 'var(--color-ink)' }}>高尾系算命学</strong>」の体系に基づきます。
              算命学には複数の流派があり、流派により解釈や算出方法が異なる場合があります。
              他流派と異なる結果になることは誤りではなく、流派固有の見解の差です。
            </p>
          </section>

          <section>
            <h2 className="text-base tracking-wider mb-3 pb-2" style={{ color: 'var(--color-ink)', borderBottom: '1px solid var(--color-gray-300)' }}>
              AI 解釈について
            </h2>
            <p>
              本アプリの解釈文・アクションプランは AI（Anthropic 社の Claude）により生成されます。
              熟練の鑑定士による対面鑑定の代替ではありません。
              出力内容は確率的に揺らぎがあり、毎回同じ結果になるとは限りません。
            </p>
            <p className="mt-2">
              より深い対話と個別の状況の鑑定を希望される方は、信頼できる算命学鑑定士による
              直接のセッションをおすすめいたします。
            </p>
          </section>

          <section>
            <h2 className="text-base tracking-wider mb-3 pb-2" style={{ color: 'var(--color-ink)', borderBottom: '1px solid var(--color-gray-300)' }}>
              個人情報の取り扱い
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                生年月日・お名前等の入力情報は、お使いの端末内（ブラウザの localStorage）に保存され、
                外部サーバーには送信されません。
              </li>
              <li>
                AI 解釈・アクションプランの生成時のみ、命式情報（星名・干支等）が
                Anthropic 社の Claude API に送信されます。生年月日そのものは送信されません。
              </li>
              <li>
                Anthropic 社のプライバシーポリシーが適用されます。
              </li>
              <li>
                ブラウザ履歴の削除や別端末への移行で localStorage のデータは失われます。
                必要なデータは PDF 等で保存してください。
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base tracking-wider mb-3 pb-2" style={{ color: 'var(--color-ink)', borderBottom: '1px solid var(--color-gray-300)' }}>
              倫理的配慮
            </h2>
            <p>
              本アプリは、相談者を不安にさせる断定的な未来予測や、
              「○○しないと不幸になる」といった脅迫的な表現を行わないよう設計されています。
              算命学を「自己理解の鏡」「主体的な選択を助けるツール」として位置付け、
              鑑定結果が行動を諦める言い訳ではなく、一歩を踏み出すきっかけとなることを願っています。
            </p>
          </section>
        </article>

        <footer className="mt-16 pt-6 text-center text-xs" style={{ color: 'var(--color-gray-500)', borderTop: '1px solid var(--color-gray-300)' }}>
          <p>Sanmei Compass — 算命羅針盤</p>
          <p className="mt-1">© Sanmei Compass</p>
        </footer>
      </div>
    </main>
  );
}
