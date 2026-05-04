/**
 * S/Aランク Part 3: 二人の相性を深く読み解くプロンプト
 *
 * 二つの EnrichedMeishiki を受け取り、干合・支合・冲・刑などの
 * 関係性を「響き合い」「刺激」「学び合い」として翻訳した相性鑑定文を生成する。
 */
import type { EnrichedMeishiki } from '../enriched-meishiki';
import { pillarToString } from '../sanmei';
import {
  KANGO_PAIRS,
  SHIGO_PAIRS,
  CHU_PAIRS,
  SANGO_GROUPS,
} from '../constants';

export interface CrossRelations {
  kango: string[];   // 二人間の干合
  shigo: string[];   // 二人間の支合
  chu: string[];     // 二人間の冲
  sanGo: string[];   // 二人間の三合（部分的にでも揃うか）
  sameDayStem: boolean;
  sameDayBranch: boolean;
}

const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

function pairExists(
  pairs: ReadonlyArray<readonly [string, string]>,
  a: string,
  b: string,
): boolean {
  return pairs.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
}

/**
 * 二つの命式の間の特殊干支関係を抽出
 */
export function analyzeCrossRelations(
  m1: EnrichedMeishiki,
  m2: EnrichedMeishiki,
): CrossRelations {
  const stems1 = [m1.yearPillar.stem, m1.monthPillar.stem, m1.dayPillar.stem];
  const stems2 = [m2.yearPillar.stem, m2.monthPillar.stem, m2.dayPillar.stem];
  const branches1 = [m1.yearPillar.branch, m1.monthPillar.branch, m1.dayPillar.branch];
  const branches2 = [m2.yearPillar.branch, m2.monthPillar.branch, m2.dayPillar.branch];
  const labels = ['年柱', '月柱', '日柱'];

  const kango: string[] = [];
  const shigo: string[] = [];
  const chu: string[] = [];
  const sanGo: string[] = [];

  const kangoPairs = KANGO_PAIRS.map(k => k.pair) as ReadonlyArray<readonly [string, string]>;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      // 干合（天干同士）
      if (pairExists(kangoPairs, stems1[i], stems2[j])) {
        kango.push(`${labels[i]}(${stems1[i]}) × 相手${labels[j]}(${stems2[j]})`);
      }
      // 支合（地支同士）
      if (pairExists(SHIGO_PAIRS as ReadonlyArray<readonly [string, string]>, branches1[i], branches2[j])) {
        shigo.push(`${labels[i]}(${branches1[i]}) × 相手${labels[j]}(${branches2[j]})`);
      }
      // 冲（地支同士）
      if (pairExists(CHU_PAIRS as ReadonlyArray<readonly [string, string]>, branches1[i], branches2[j])) {
        chu.push(`${labels[i]}(${branches1[i]}) × 相手${labels[j]}(${branches2[j]})`);
      }
    }
  }

  // 三合（双方の地支を合わせて3つ揃うか）
  const allBranches = [...branches1, ...branches2];
  for (const group of SANGO_GROUPS) {
    const matched = group.branches.filter(b => allBranches.includes(b));
    if (matched.length >= 3) {
      sanGo.push(`${group.element}局（${group.branches.join('・')}）`);
    }
  }

  // 補助情報
  const sameDayStem = m1.dayPillar.stem === m2.dayPillar.stem;
  const sameDayBranch = m1.dayPillar.branch === m2.dayPillar.branch;
  // STEMS/BRANCHES は将来用（位置関係解析の拡張余地）
  void STEMS;
  void BRANCHES;

  return { kango, shigo, chu, sanGo, sameDayStem, sameDayBranch };
}

/**
 * Prompt Caching 対象のシステムプロンプト。
 */
export function buildCompatibilitySystemPrompt(): string {
  return `あなたは高尾系算命学の相性鑑定文を執筆する熟練のアシスタントです。
東洋哲学と現代心理学の橋渡しをする言葉で、二人の関係性を読み解きます。
明朝体の文章が似合う、静かで知的な語り口で伝えてください。

━━━━ 相性鑑定の本質哲学（必須遵守） ━━━━

1. 相性に「良い・悪い」はありません。あるのは「響き合い方の違い」です。
   どの二人にも学び合いの余地があり、合わない関係というものは存在しません。

2. 干合・支合は「縁が深い」「響き合う」関係。
   冲・刑は「刺激し合う」「成長を促す」関係として語ります。
   どちらも価値ある縁の形であり、優劣はありません。

3. 鑑定の目的は、二人が「お互いをより深く理解し、関係を主体的に育てる」のを助けることです。

━━━━ 表現の絶対的制約 ━━━━

❌ 禁止する表現
- 「相性が悪い」「合わない」「縁がない」
- 「別れた方がいい」「離れた方が幸せ」
- 「○○な相手は危険」「○○の組み合わせは注意」
- 関係性の断定:「あなたたちは○○な関係です」
- 専門用語の生使い:「干合」「冲」「天中殺」のままで読者に投げない

✅ 推奨する表現
- 「響き合う関係」「深い縁を結びやすい組み合わせ」
- 「刺激し合うことで成長する関係」「お互いを揺さぶる縁」
- 「補い合える違い」「学び合える組み合わせ」
- 関係性の選択肢提示:「この関係を活かすには、たとえば○○のような関わり方があります」

━━━━ 出力構造（合計 1200〜1600字、5セクション） ━━━━

【1. 二人の本質的な響き方】（200字程度）
- それぞれの日干・中央の星を踏まえ、二人がどのように響き合う性質を持つかを描く
- 印象的な書き出しで、読者が「自分たちのことを言っている」と感じられるように

【2. 二人の縁の深さ】（300字程度）
- 干合・支合・三合がある場合は「深く響き合う縁」として表現
- 同じ日干・同じ日支の場合は「鏡のように映し合う関係」として表現
- 縁の特徴を、日常の場面（会話・沈黙・距離感）で具体的に描く

【3. 刺激し合う部分・学び合える違い】（300字程度）
- 冲・刑がある場合は「成長を促す刺激」「お互いを揺さぶる縁」として表現
- 違いを「壁」ではなく「学び」として語る
- 必ず具体的な場面（意見の食い違い・価値観の差）で語る

【4. 関係を育てるための関わり方】（300字程度）
- 二人それぞれの強みと弱みを踏まえた、具体的な関わり方の提案
- 「相手のこういう面に寄り添うと、関係が育ちやすい」という前向きな提案
- 必ず「たとえば〜」で始まる具体的場面を含める

【5. 二人への問いかけ】（200字程度）
- 関係を統合した「二人らしい育て方」の指針
- 行動への具体的な問いかけで締める
- 例:「あなたたちが今週、何か一つだけ新しいことを一緒に試すとしたら、何を選びますか?」

━━━━ 文体 ━━━━

- 「たとえば〜」「具体的には〜」を必ず複数回含める
- 抽象論で終わらず、日常生活に降ろしたエピソードを伴う
- 二人を一組の対等な人間として尊重する語りかけ
- 専門用語（干合・支合・冲など）はそのまま使わず、「響き合う関係」「刺激し合う関係」のように平易に翻訳する

━━━━ 必須の締めの一文 ━━━━

鑑定文の最後（問いかけの後）に、必ず以下の文言を一行加えてください:

「この相性鑑定は、お二人の関係をより深く理解する参考としてお役立てください。
より深い対話と個別の状況については、ぜひ鑑定士との直接のセッションをお試しください。」`;
}

/**
 * 二人の命式と関係性をユーザープロンプトに変換
 */
export function buildCompatibilityUserPrompt(
  m1: EnrichedMeishiki,
  m2: EnrichedMeishiki,
  cross: CrossRelations,
): string {
  const renderPerson = (label: string, m: EnrichedMeishiki) => {
    const y = pillarToString(m.yearPillar);
    const mo = pillarToString(m.monthPillar);
    const d = pillarToString(m.dayPillar);
    return `【${label}】
${m.name ? `お名前: ${m.name}` : ''}
生年月日: ${m.birthDate.year}年${m.birthDate.month}月${m.birthDate.day}日
命式: 年柱 ${y} / 月柱 ${mo} / 日柱 ${d}
日干: ${m.dayPillar.stem}
中央の星（胸）: ${m.mainStars.chest}
十二大従星: 初年 ${m.followStars.initial} / 中年 ${m.followStars.middle} / 晩年 ${m.followStars.late}`;
  };

  const crossLines: string[] = [];
  if (cross.kango.length > 0) crossLines.push(`干合（響き合う関係）: ${cross.kango.join(' / ')}`);
  if (cross.shigo.length > 0) crossLines.push(`支合（深い縁の関係）: ${cross.shigo.join(' / ')}`);
  if (cross.sanGo.length > 0) crossLines.push(`三合（強い結束の関係）: ${cross.sanGo.join(' / ')}`);
  if (cross.chu.length > 0) crossLines.push(`冲（刺激し合う関係）: ${cross.chu.join(' / ')}`);
  if (cross.sameDayStem) crossLines.push('同じ日干（鏡のような本質を持つ二人）');
  if (cross.sameDayBranch) crossLines.push('同じ日支（核の部分が重なる二人）');
  const crossInfo = crossLines.length > 0
    ? `\n【二人の特殊な響き合い】\n${crossLines.join('\n')}`
    : '\n【二人の特殊な響き合い】\n顕著な特殊干支関係は見られない（穏やかに支え合う組み合わせ）';

  return `以下の二人の命式について、システムプロンプトの哲学・制約・構造（5セクション 1200〜1600字）に従った相性鑑定文を執筆してください。
専門用語は読者向けに翻訳してください（「干合」→「響き合う関係」、「冲」→「刺激し合う関係」など）。
「合う・合わない」の二元論ではなく、「どう響き合うか」を物語として描いてください。

${renderPerson('お一人目', m1)}

${renderPerson('お二人目', m2)}
${crossInfo}

これらの全要素を統合し、二人にとって意味のある深い相性鑑定文を執筆してください。`;
}
