import Anthropic from '@anthropic-ai/sdk';
import type { MeishikiResult } from '@/lib/sanmei';

export const runtime = 'nodejs';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const ACTION_PLAN_SYSTEM = `あなたは高尾系算命学に基づくキャリア・ライフコーチです。
相談者の命式から、3つの時間軸でアクションプランを提案します。

# 提案の制約

- 命式の特性を「活かす」方向のアクションのみ提案する
- 「これをやらないと不幸になる」のような強迫的表現は禁止
- 「試してみる価値があるかもしれない」レベルの優しい提案にする
- 具体的で、明日から始められる小さな行動にする
- 抽象的なアドバイス(「自分らしく生きましょう」など)は避ける
- 仕事・人間関係・お金・自己理解のいずれかの観点を含める

# 出力フォーマット(JSON のみ。前後の説明文は禁止)

{
  "thisWeek": ["今週試す小さな行動1", "今週試す小さな行動2", "今週試す小さな行動3"],
  "thisMonth": ["今月の目標1", "今月の目標2"],
  "nextThreeMonths": ["3ヶ月の重点テーマ1", "3ヶ月の重点テーマ2"]
}

# 例(表現の星が強い人の場合)

{
  "thisWeek": [
    "毎日1行、感じたことを日記に書いてみる",
    "SNSに自分の好きなものを1つ投稿してみる",
    "誰かに自分の気持ちを5分話してみる"
  ],
  "thisMonth": [
    "noteかブログで月1本、自分の考えを書いてみる",
    "表現に関わる場(ワークショップ、サークル)を1つ調べる"
  ],
  "nextThreeMonths": [
    "自分の表現を発信する習慣を作る",
    "表現を仕事や副業につなげる選択肢を3つ書き出す"
  ]
}`;

export interface ActionPlan {
  thisWeek: string[];
  thisMonth: string[];
  nextThreeMonths: string[];
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your-api-key-here') {
    return Response.json(
      { error: 'ANTHROPIC_API_KEY が設定されていません。' },
      { status: 500 }
    );
  }

  let meishiki: MeishikiResult;
  try {
    const body = await req.json();
    meishiki = body.meishiki;
  } catch {
    return Response.json({ error: '不正なリクエストです。' }, { status: 400 });
  }

  const userPrompt = `以下の命式から、相談者のためのアクションプランを生成してください。

【命式】
- 年柱: ${meishiki.yearPillar.stem}${meishiki.yearPillar.branch}
- 月柱: ${meishiki.monthPillar.stem}${meishiki.monthPillar.branch}
- 日柱: ${meishiki.dayPillar.stem}${meishiki.dayPillar.branch}

【十大主星(人体図)】
- 頭(月干): ${meishiki.mainStars.head}
- 左肩(年干): ${meishiki.mainStars.leftShoulder}
- 中央(本人・核): ${meishiki.mainStars.chest}
- 右肩(月支主蔵干): ${meishiki.mainStars.rightShoulder}
- 腹(年支主蔵干): ${meishiki.mainStars.abdomen}

【十二大従星】
- 初年: ${meishiki.followStars.initial}
- 中年: ${meishiki.followStars.middle}
- 晩年: ${meishiki.followStars.late}

JSON形式のみで返答してください。`;

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 1500,
      thinking: { type: 'adaptive' },
      system: ACTION_PLAN_SYSTEM,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const textBlock = response.content.find(b => b.type === 'text');
    const text = textBlock && textBlock.type === 'text' ? textBlock.text : '';

    // JSON 抽出（```json ... ``` フェンスがあれば除去）
    const cleaned = text
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim();

    let plan: ActionPlan;
    try {
      plan = JSON.parse(cleaned);
    } catch {
      // JSON 抽出に失敗したら本文から { ... } 部分を切り出す
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('JSON形式の応答が得られませんでした');
      plan = JSON.parse(match[0]);
    }

    return Response.json(plan);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return Response.json({ error: msg }, { status: 500 });
  }
}
