import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-24">
      <div className="max-w-lg w-full text-center space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl tracking-wider" style={{ color: 'var(--color-ink)' }}>
            Sanmei Compass
          </h1>
          <p className="text-lg md:text-xl" style={{ color: 'var(--color-ink-soft)' }}>
            算命羅針盤
          </p>
        </div>

        <p className="text-base md:text-lg leading-relaxed" style={{ color: 'var(--color-gray-500)' }}>
          あなたの宿命を、現代の言葉で。
        </p>

        <div className="pt-8">
          <Link
            href="/input"
            className="inline-block px-10 py-4 text-base tracking-widest transition-all duration-300 hover:opacity-80"
            style={{
              color: 'var(--color-white)',
              backgroundColor: 'var(--color-ink)',
              borderRadius: '2px',
            }}
          >
            命式を導く
          </Link>
        </div>

        <div className="pt-16 space-y-6">
          <div className="w-12 h-px mx-auto" style={{ backgroundColor: 'var(--color-gray-300)' }} />
          <div className="flex items-center justify-center gap-6 text-xs">
            <Link
              href="/compatibility"
              className="tracking-wider transition-opacity hover:opacity-60"
              style={{ color: 'var(--color-gray-500)' }}
            >
              相性鑑定
            </Link>
            <span style={{ color: 'var(--color-gray-300)' }}>·</span>
            <Link
              href="/input?next=sheet"
              className="tracking-wider transition-opacity hover:opacity-60"
              style={{ color: 'var(--color-gray-500)' }}
            >
              鑑定者シート
            </Link>
            <span style={{ color: 'var(--color-gray-300)' }}>·</span>
            <Link
              href="/history"
              className="tracking-wider transition-opacity hover:opacity-60"
              style={{ color: 'var(--color-gray-500)' }}
            >
              過去の鑑定
            </Link>
            <span style={{ color: 'var(--color-gray-300)' }}>·</span>
            <Link
              href="/manual"
              className="tracking-wider transition-opacity hover:opacity-60"
              style={{ color: 'var(--color-gray-500)' }}
            >
              使い方マニュアル
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
