'use client';

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="px-4 py-2 text-xs tracking-wider transition-opacity hover:opacity-80"
      style={{
        color: 'var(--color-white)',
        backgroundColor: 'var(--color-ink)',
        borderRadius: '2px',
      }}
    >
      印刷 / PDF保存
    </button>
  );
}
