import Anthropic from '@anthropic-ai/sdk';
import { calculateEnrichedMeishiki } from '@/lib/sanmei';
import {
  buildCompatibilitySystemPrompt,
  buildCompatibilityUserPrompt,
  analyzeCrossRelations,
} from '@/lib/ai-prompts/compatibility-deep';

export const runtime = 'nodejs';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface PersonInput {
  name?: string;
  year: number;
  month: number;
  day: number;
  gender?: 'male' | 'female';
}

function isValidPerson(p: unknown): p is PersonInput {
  if (!p || typeof p !== 'object') return false;
  const o = p as Record<string, unknown>;
  return (
    typeof o.year === 'number' &&
    typeof o.month === 'number' &&
    typeof o.day === 'number'
  );
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your-api-key-here') {
    return Response.json(
      { error: 'ANTHROPIC_API_KEY が設定されていません。.env.local ファイルを確認してください。' },
      { status: 500 }
    );
  }

  let person1: PersonInput;
  let person2: PersonInput;
  try {
    const body = await req.json();
    if (!isValidPerson(body.person1) || !isValidPerson(body.person2)) {
      return Response.json({ error: '生年月日が不足しています。' }, { status: 400 });
    }
    person1 = body.person1;
    person2 = body.person2;
  } catch {
    return Response.json({ error: '不正なリクエストです。' }, { status: 400 });
  }

  let m1, m2;
  try {
    m1 = calculateEnrichedMeishiki({
      year: person1.year,
      month: person1.month,
      day: person1.day,
      name: person1.name,
      gender: person1.gender ?? 'male',
    });
    m2 = calculateEnrichedMeishiki({
      year: person2.year,
      month: person2.month,
      day: person2.day,
      name: person2.name,
      gender: person2.gender ?? 'male',
    });
  } catch (e) {
    return Response.json(
      { error: '命式の算出に失敗しました: ' + (e as Error).message },
      { status: 500 }
    );
  }

  const cross = analyzeCrossRelations(m1, m2);
  const systemPrompt = buildCompatibilitySystemPrompt();
  const userPrompt = buildCompatibilityUserPrompt(m1, m2, cross);

  try {
    const stream = client.messages.stream({
      model: 'claude-opus-4-7',
      max_tokens: 2200,
      thinking: { type: 'adaptive' },
      system: [
        {
          type: 'text',
          text: systemPrompt,
          cache_control: { type: 'ephemeral' },
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
          // 先に命式情報を流す（UIで表示用）
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                meta: {
                  person1: {
                    name: m1.name,
                    yearPillar: `${m1.yearPillar.stem}${m1.yearPillar.branch}`,
                    monthPillar: `${m1.monthPillar.stem}${m1.monthPillar.branch}`,
                    dayPillar: `${m1.dayPillar.stem}${m1.dayPillar.branch}`,
                  },
                  person2: {
                    name: m2.name,
                    yearPillar: `${m2.yearPillar.stem}${m2.yearPillar.branch}`,
                    monthPillar: `${m2.monthPillar.stem}${m2.monthPillar.branch}`,
                    dayPillar: `${m2.dayPillar.stem}${m2.dayPillar.branch}`,
                  },
                  cross,
                },
              })}\n\n`,
            ),
          );

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
