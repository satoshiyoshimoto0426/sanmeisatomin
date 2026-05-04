'use client';

import { useState, useEffect, useRef } from 'react';
import type { MeishikiResult } from '@/lib/sanmei';

interface Props {
  meishiki: MeishikiResult;
}

type Status = 'meditating' | 'loading' | 'streaming' | 'done' | 'error' | 'no-key';

const MEDITATION_DURATION_MS = 2500;

export default function InterpretationStream({ meishiki }: Props) {
  const [text, setText] = useState('');
  const [status, setStatus] = useState<Status>('meditating');
  const [errorMsg, setErrorMsg] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let cancelled = false;
    let meditationTimer: ReturnType<typeof setTimeout> | null = null;

    setStatus('meditating');
    setText('');
    setErrorMsg('');

    async function fetchInterpretation() {
      if (cancelled) return;
      setStatus('loading');

      abortRef.current = new AbortController();

      try {
        const res = await fetch('/api/interpret', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ meishiki }),
          signal: abortRef.current.signal,
        });

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({ error: 'APIエラー' }));
          setErrorMsg(errBody.error || 'APIエラーが発生しました。');
          setStatus(errBody.error?.includes('ANTHROPIC_API_KEY') ? 'no-key' : 'error');
          return;
        }

        if (!res.body) {
          setErrorMsg('レスポンスが空です。');
          setStatus('error');
          return;
        }

        setStatus('streaming');
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (cancelled) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const payload = line.slice(6).trim();
            if (payload === '[DONE]') {
              setStatus('done');
              return;
            }
            try {
              const parsed = JSON.parse(payload);
              if (parsed.error) {
                setErrorMsg(parsed.error);
                setStatus('error');
                return;
              }
              if (parsed.text) {
                setText(prev => prev + parsed.text);
              }
            } catch {
              // ignore malformed SSE lines
            }
          }
        }

        if (!cancelled) setStatus('done');
      } catch (err) {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : String(err);
        if (msg === 'The user aborted a request.') return;
        setErrorMsg(msg);
        setStatus('error');
      }
    }

    // フェーズ1: 瞑想（2.5秒）→ ストリーミング開始
    meditationTimer = setTimeout(fetchInterpretation, MEDITATION_DURATION_MS);

    return () => {
      cancelled = true;
      if (meditationTimer) clearTimeout(meditationTimer);
      abortRef.current?.abort();
    };
  }, [meishiki, reloadKey]);

  const handleRegenerate = () => {
    setReloadKey(k => k + 1);
  };

  if (status === 'no-key') {
    return (
      <div
        className="p-6 md:p-10 rounded-sm text-sm leading-relaxed"
        style={{ backgroundColor: 'var(--color-white)', border: '1px solid var(--color-gray-300)' }}
      >
        <p className="font-inter font-medium mb-3" style={{ color: 'var(--color-vermilion)' }}>
          API キー未設定
        </p>
        <p style={{ color: 'var(--color-gray-700)' }}>
          <code className="px-1 py-0.5 rounded text-xs" style={{ backgroundColor: 'var(--color-gray-100)' }}>
            sanmei-compass/.env.local
          </code>{' '}
          に <code className="px-1 py-0.5 rounded text-xs" style={{ backgroundColor: 'var(--color-gray-100)' }}>ANTHROPIC_API_KEY</code> を設定してください。
        </p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div
        className="p-6 md:p-10 rounded-sm text-sm"
        style={{ backgroundColor: 'var(--color-white)', border: '1px solid var(--color-gray-300)', color: 'var(--color-gray-700)' }}
      >
        <p style={{ color: 'var(--color-vermilion)' }}>解釈の生成に失敗しました。</p>
        <p className="mt-2 font-inter text-xs" style={{ color: 'var(--color-gray-500)' }}>{errorMsg}</p>
        <button
          onClick={handleRegenerate}
          className="mt-4 text-xs underline"
          style={{ color: 'var(--color-vermilion)' }}
        >
          もう一度試す
        </button>
      </div>
    );
  }

  // フェーズ1: 瞑想表示
  if (status === 'meditating') {
    return (
      <div
        className="p-12 md:p-16 rounded-sm text-center"
        style={{ backgroundColor: 'var(--color-white)', border: '1px solid var(--color-gray-300)' }}
      >
        <div
          className="inline-block mb-4 text-3xl"
          style={{ color: 'var(--color-vermilion)', animation: 'meditate 2s ease-in-out infinite' }}
        >
          墨
        </div>
        <p className="text-sm italic" style={{ color: 'var(--color-gray-700)' }}>
          命式を読み解いています…
        </p>
        <p className="text-xs mt-2" style={{ color: 'var(--color-gray-500)' }}>
          天干地支の流れを辿っています
        </p>
        <style>{`
          @keyframes meditate {
            0%, 100% { opacity: 0.4; transform: scale(0.95); }
            50% { opacity: 1; transform: scale(1.05); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div>
      <div
        className="p-6 md:p-10 rounded-sm text-sm md:text-base leading-loose relative min-h-32"
        style={{
          backgroundColor: 'var(--color-white)',
          color: 'var(--color-ink-soft)',
          border: '1px solid var(--color-gray-300)',
        }}
      >
        {/* ローディング表示 */}
        {status === 'loading' && (
          <div className="flex items-center gap-3" style={{ color: 'var(--color-gray-500)' }}>
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: 'var(--color-gold)',
                    animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
            <span className="text-sm">解釈を紡いでいます…</span>
          </div>
        )}

        {/* ストリーミングテキスト */}
        {text && (
          <p className="whitespace-pre-line">{text}</p>
        )}

        {/* カーソル点滅（ストリーミング中） */}
        {status === 'streaming' && (
          <span
            className="inline-block w-0.5 h-4 ml-0.5 align-middle"
            style={{
              backgroundColor: 'var(--color-ink)',
              animation: 'blink 0.8s step-end infinite',
            }}
          />
        )}
      </div>

      {/* ステータス情報・完了後アクション */}
      {status === 'done' && (
        <>
          <p className="text-xs text-center mt-4 leading-relaxed print:hidden" style={{ color: 'var(--color-gray-500)' }}>
            ※ この解釈は Claude AI と算命学の知識ベースにより生成されました。
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 print:hidden">
            <button
              onClick={handleRegenerate}
              className="px-5 py-2 text-xs tracking-wider transition-opacity hover:opacity-70"
              style={{
                color: 'var(--color-ink)',
                border: '1px solid var(--color-gray-300)',
                borderRadius: '2px',
              }}
            >
              別の言い回しで再生成
            </button>
          </div>
        </>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
