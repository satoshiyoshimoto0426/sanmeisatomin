import Anthropic from '@anthropic-ai/sdk';
import type { MeishikiResult } from '@/lib/sanmei';
import { calculateEnrichedMeishiki } from '@/lib/sanmei';
import {
  buildDeepInterpretationSystemPrompt,
  buildDeepUserPrompt,
} from '@/lib/ai-prompts/deep-interpretation';

export const runtime = 'nodejs';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your-api-key-here') {
    return Response.json(
      { error: 'ANTHROPIC_API_KEY が設定されていません。.env.local ファイルを確認してください。' },
      { status: 500 }
    );
  }

  let meishiki: MeishikiResult;
  let gender: 'male' | 'female' = 'male';
  try {
    const body = await req.json();
    meishiki = body.meishiki;
    if (body.gender === 'male' || body.gender === 'female') {
      gender = body.gender;
    }
  } catch {
    return Response.json({ error: '不正なリクエストです。' }, { status: 400 });
  }

  // EnrichedMeishiki をサーバ側で計算（中殺・特殊干支関係・大運天中殺を含む）
  let enriched;
  try {
    enriched = calculateEnrichedMeishiki({
      year: meishiki.birthDate.year,
      month: meishiki.birthDate.month,
      day: meishiki.birthDate.day,
      name: meishiki.name,
      gender,
    });
  } catch (e) {
    return Response.json(
      { error: '命式の拡張計算に失敗しました: ' + (e as Error).message },
      { status: 500 }
    );
  }

  const systemPrompt = buildDeepInterpretationSystemPrompt();
  const userPrompt = buildDeepUserPrompt(enriched);

  try {
    const stream = client.messages.stream({
      model: 'claude-opus-4-7',
      max_tokens: 2500,
      thinking: { type: 'adaptive' },
      system: [
        {
          type: 'text',
          text: systemPrompt,
          cache_control: { type: 'ephemeral' }, // 哲学・制約・構造を Prompt Caching
        },
      ],
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
              );
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`)
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return Response.json({ error: msg }, { status: 500 });
  }
}
