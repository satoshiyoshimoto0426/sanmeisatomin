'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { PREFECTURES } from '@/lib/constants';

function InputForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next'); // 'sheet' で鑑定者シートへ遷移
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [prefecture, setPrefecture] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const y = parseInt(year);
    const m = parseInt(month);
    const d = parseInt(day);

    if (!year || !month || !day) {
      setError('生年月日を入力してください。');
      return;
    }
    if (y < 1920 || y > 2030) {
      setError('年は1920〜2030の範囲で入力してください。');
      return;
    }
    if (m < 1 || m > 12) {
      setError('月は1〜12で入力してください。');
      return;
    }
    if (d < 1 || d > 31) {
      setError('日は1〜31で入力してください。');
      return;
    }

    const params = new URLSearchParams({
      year: y.toString(),
      month: m.toString(),
      day: d.toString(),
    });
    if (name) params.set('name', name);
    if (!timeUnknown && hour) params.set('hour', hour);
    if (!timeUnknown && minute) params.set('minute', minute);
    if (prefecture) params.set('prefecture', prefecture);

    const target = next === 'sheet' ? '/sheet' : '/result';
    router.push(`${target}?${params.toString()}`);
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-md w-full space-y-10">
        <div className="text-center space-y-3">
          <h1 className="text-2xl md:text-3xl tracking-wider" style={{ color: 'var(--color-ink)' }}>
            生年月日を入力
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-gray-500)' }}>
            あなたの命式を導くために必要な情報です
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 名前 */}
          <div className="space-y-2">
            <label className="block text-sm" style={{ color: 'var(--color-gray-700)' }}>
              お名前 <span className="text-xs" style={{ color: 'var(--color-gray-500)' }}>（任意）</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例：田中 太郎"
              className="w-full px-4 py-3 text-base border-b transition-colors focus:outline-none"
              style={{
                backgroundColor: 'transparent',
                borderColor: 'var(--color-gray-300)',
                color: 'var(--color-ink)',
              }}
            />
          </div>

          {/* 生年月日 */}
          <div className="space-y-2">
            <label className="block text-sm" style={{ color: 'var(--color-gray-700)' }}>
              生年月日 <span className="text-xs" style={{ color: 'var(--color-vermilion)' }}>*</span>
            </label>
            <div className="grid grid-cols-[5fr_3fr_3fr] gap-2">
              {/* 年: 4桁 */}
              <div
                className="flex items-end gap-1 border-b transition-colors"
                style={{ borderColor: 'var(--color-gray-300)' }}
              >
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={year}
                  onChange={(e) => setYear(e.target.value.replace(/\D/g, ''))}
                  placeholder="1990"
                  maxLength={4}
                  className="min-w-0 w-full pl-3 py-3 text-base focus:outline-none font-inter bg-transparent"
                  style={{ color: 'var(--color-ink)' }}
                />
                <span className="pb-3 pr-2 text-xs flex-shrink-0" style={{ color: 'var(--color-gray-500)' }}>年</span>
              </div>
              {/* 月: 2桁 */}
              <div
                className="flex items-end gap-1 border-b transition-colors"
                style={{ borderColor: 'var(--color-gray-300)' }}
              >
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={month}
                  onChange={(e) => setMonth(e.target.value.replace(/\D/g, ''))}
                  placeholder="1"
                  maxLength={2}
                  className="min-w-0 w-full pl-2 py-3 text-base focus:outline-none font-inter bg-transparent"
                  style={{ color: 'var(--color-ink)' }}
                />
                <span className="pb-3 pr-2 text-xs flex-shrink-0" style={{ color: 'var(--color-gray-500)' }}>月</span>
              </div>
              {/* 日: 2桁 */}
              <div
                className="flex items-end gap-1 border-b transition-colors"
                style={{ borderColor: 'var(--color-gray-300)' }}
              >
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={day}
                  onChange={(e) => setDay(e.target.value.replace(/\D/g, ''))}
                  placeholder="15"
                  maxLength={2}
                  className="min-w-0 w-full pl-2 py-3 text-base focus:outline-none font-inter bg-transparent"
                  style={{ color: 'var(--color-ink)' }}
                />
                <span className="pb-3 pr-2 text-xs flex-shrink-0" style={{ color: 'var(--color-gray-500)' }}>日</span>
              </div>
            </div>
          </div>

          {/* 出生時刻 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm" style={{ color: 'var(--color-gray-700)' }}>
                出生時刻 <span className="text-xs" style={{ color: 'var(--color-gray-500)' }}>（任意）</span>
              </label>
              <span
                className="text-[10px] tracking-wider px-2 py-0.5 rounded-sm"
                style={{
                  color: 'var(--color-gold)',
                  backgroundColor: 'rgba(184, 137, 61, 0.08)',
                  border: '1px solid rgba(184, 137, 61, 0.3)',
                }}
              >
                Coming Soon
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-gray-500)' }}>
              時柱の算出は今後のアップデートで対応予定です。現バージョンでは命式の算出には使用しません。
            </p>
            <div className="flex items-center gap-4">
              <div className="grid grid-cols-2 gap-3 flex-1">
                <input
                  type="number"
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                  placeholder="14"
                  min="0"
                  max="23"
                  disabled={timeUnknown}
                  className="w-full px-4 py-3 text-base border-b transition-colors focus:outline-none font-inter disabled:opacity-40"
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: 'var(--color-gray-300)',
                    color: 'var(--color-ink)',
                  }}
                />
                <input
                  type="number"
                  value={minute}
                  onChange={(e) => setMinute(e.target.value)}
                  placeholder="30"
                  min="0"
                  max="59"
                  disabled={timeUnknown}
                  className="w-full px-4 py-3 text-base border-b transition-colors focus:outline-none font-inter disabled:opacity-40"
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: 'var(--color-gray-300)',
                    color: 'var(--color-ink)',
                  }}
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: 'var(--color-gray-500)' }}>
                <input
                  type="checkbox"
                  checked={timeUnknown}
                  onChange={(e) => setTimeUnknown(e.target.checked)}
                  className="w-4 h-4"
                />
                不明
              </label>
            </div>
          </div>

          {/* 出生地 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm" style={{ color: 'var(--color-gray-700)' }}>
                出生地 <span className="text-xs" style={{ color: 'var(--color-gray-500)' }}>（任意）</span>
              </label>
              <span
                className="text-[10px] tracking-wider px-2 py-0.5 rounded-sm"
                style={{
                  color: 'var(--color-gold)',
                  backgroundColor: 'rgba(184, 137, 61, 0.08)',
                  border: '1px solid rgba(184, 137, 61, 0.3)',
                }}
              >
                Coming Soon
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-gray-500)' }}>
              真太陽時補正は今後のアップデートで対応予定です。
            </p>
            <select
              value={prefecture}
              onChange={(e) => setPrefecture(e.target.value)}
              className="w-full px-4 py-3 text-base border-b transition-colors focus:outline-none appearance-none"
              style={{
                backgroundColor: 'transparent',
                borderColor: 'var(--color-gray-300)',
                color: prefecture ? 'var(--color-ink)' : 'var(--color-gray-500)',
              }}
            >
              <option value="">選択してください</option>
              {PREFECTURES.map((pref) => (
                <option key={pref} value={pref}>{pref}</option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-sm" style={{ color: 'var(--color-vermilion)' }}>{error}</p>
          )}

          {/* 送信ボタン */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-4 text-base tracking-widest transition-all duration-300 hover:opacity-80"
              style={{
                color: 'var(--color-white)',
                backgroundColor: 'var(--color-ink)',
                borderRadius: '2px',
              }}
            >
              {next === 'sheet' ? '鑑定者シートを開く' : '命式を導く'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function InputPage() {
  return (
    <Suspense fallback={
      <main className="flex-1 flex items-center justify-center">
        <p style={{ color: 'var(--color-gray-500)' }}>読み込み中…</p>
      </main>
    }>
      <InputForm />
    </Suspense>
  );
}
