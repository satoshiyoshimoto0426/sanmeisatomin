import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sanmei Compass — 算命羅針盤",
  description: "あなたの宿命を、現代の言葉で。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <footer
          className="text-xs text-center py-6 px-4 print:hidden"
          style={{ color: 'var(--color-gray-500)', borderTop: '1px solid var(--color-gray-300)' }}
        >
          <p className="leading-relaxed">
            本アプリは高尾系算命学の体系に基づきます。流派により解釈が異なる場合があります。
          </p>
          <p className="leading-relaxed mt-1">
            鑑定結果はエンターテインメント・自己理解の参考としてご活用ください。
          </p>
          <div className="mt-3 flex items-center justify-center gap-4">
            <Link href="/manual" className="hover:opacity-60 transition-opacity">使い方</Link>
            <span style={{ color: 'var(--color-gray-300)' }}>·</span>
            <Link href="/disclaimer" className="hover:opacity-60 transition-opacity">免責・ご利用にあたって</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
