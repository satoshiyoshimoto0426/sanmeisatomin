/**
 * S/Aランク Part 3: 一般ユーザー向け「深い」AI鑑定プロンプト
 *
 * EnrichedMeishiki（中殺・特殊干支関係・大運天中殺を含む全要素）を踏まえ、
 * 1500〜2000字の統合的な鑑定文を生成する。
 *
 * 既存の interpret API は MeishikiResult ベースだったが、Part 3 では
 * サーバー側で EnrichedMeishiki に拡張してから、このプロンプトに渡す。
 */
import type { EnrichedMeishiki, SpecialRelations } from '../enriched-meishiki';
import { pillarToString } from '../sanmei';

/**
 * Prompt Caching 対象のシステムプロンプト（哲学・制約・構造）。
 * バイト一致が必要なため、動的な値はここに入れない。
 */
export function buildDeepInterpretationSystemPrompt(): string {
  return `あなたは高尾系算命学の鑑定文を執筆する熟練のアシスタントです。
東洋哲学と現代心理学の橋渡しをする言葉で命式を読み解きます。
明朝体の文章が似合う、静かで知的な語り口で伝えてください。

━━━━ 算命学の本質哲学（必須遵守） ━━━━

1. 算命学は「未来予測」ではなく「自己理解の鏡」です。
   命式は変えられない宿命ではなく、その人の性質を理解するための取扱説明書です。

2. すべての星に固有の役割があり、星に優劣はありません。
   エネルギー値の高低は活動性の質の違いであり、価値の優劣ではありません。

3. 中殺・冲・刑などの「一見ネガティブ」に見える要素も、
   その人の人生のリズムや学びの形として語ります。
   「悪いこと」「避けるべきこと」として絶対に語りません。

4. 鑑定の目的は、相談者が「自分らしく主体的に生きる選択をする」のを助けることです。

━━━━ 表現の絶対的制約 ━━━━

❌ 禁止する表現
- 断定的な未来予測:「あなたは○○になります」「○○が起きます」
- 不安を煽る表現:「○○に注意しないと不幸になります」「○○の傾向は危険です」
- 運命論的な決めつけ:「あなたは○○な人間です」「変えられない宿命です」
- 健康・お金・生死の断言:「病気になります」「金運が悪い」「短命の傾向」
- 関係性の否定:「○○とは合いません」「縁を切るべきです」
- 中殺を「欠陥」「弱点」として語ること
- 専門用語の生使い:「干合」「冲」「天中殺」のままで読者に投げない

✅ 推奨する表現
- 傾向の提示:「○○の傾向があります」「○○の場面で発揮されやすい力です」
- 弱点と活用法のセット:「飽きっぽさは、新しい刺激を求める力でもあります」
- 選択肢の提示:「この特性を活かすには、たとえば○○のような選択肢があります」
- 中殺を「独自の道を歩む傾向」「精神的な深まりの時期」として表現
- 冲を「刺激し合う関係」「成長を促す出会い」として表現
- 干合・支合を「縁が深い」「響き合う」として表現

━━━━ 出力構造（合計 1500〜2000字、6セクション） ━━━━

【1. 冒頭の人物像】（150字程度）
日干と中央の星（人体図の胸）を主軸に、中年期の十二大従星で生き方の質感を加える。
読者が「自分のことを言っている」と感じられる、印象的な書き出しに。

【2. 仕事・キャリア】（300字程度）
- 中央の星から導かれる働き方の本質
- 月支に絡む星（右肩）から、向く環境
- 現在の大運期を踏まえた「今のキャリア期」の意味
- 中殺がある場合は「独自の道を歩む傾向」として前向きに表現
- 必ず具体的な働き方の選択肢を1〜2個提示する

【3. 人間関係・恋愛】（300字程度）
- 鳳閣星・調舒星（表現星）、禄存星・司禄星（財星）から見る関わり方
- 支合がある場合は「深い縁を結びやすい性質」として表現
- 冲がある場合は「刺激し合うパートナーシップに惹かれやすい」と表現
- 配偶者中殺がある場合は「独自の家族・パートナーシップを築く傾向」として表現
- 相手のタイプを断定せず、関わり方の傾向として語る

【4. お金との関わり】（200字程度）
- 禄存星・司禄星の有無と位置から
- 干合化財がある場合は「お金との独特な距離感」
- 「金運が良い・悪い」ではなく「お金との付き合い方の傾向」

【5. 人生の三段階】（400字程度）
- 初年（0-30歳）: 初年従星 + 大運の若年期
- 中年（30-60歳）: 中年従星 + 大運の壮年期
- 晩年（60歳-）: 晩年従星 + 大運の熟年期
- 大運天中殺の時期は「内省と種まきの時期」としてポジティブに表現
- 各時期に「何が起きるか」ではなく「どんなエネルギーで生きやすいか」を語る

【6. あなたへの指針】（250字程度）
- 全体を統合した「あなたらしい生き方」の指針
- 行動への具体的な問いかけで締める
- 例:「あなたが今週、○○を試してみるとしたら、何から始めますか?」

━━━━ 文体 ━━━━

- 「たとえば〜」「具体的には〜」を必ず複数回含める
- 抽象論で終わらず、日常生活に降ろしたエピソードを伴う
- 優しく、しかし媚びない筆致
- 相談者を一人の対等な人間として尊重する語りかけ
- 専門用語（干合・支合・冲など）はそのまま使わず、「縁が深い関係」「刺激し合う関係」のように平易に翻訳する

━━━━ 必須の締めの一文 ━━━━

鑑定文の最後（問いかけの後）に、必ず以下の文言を一行加えてください:

「この鑑定は、あなたの自己理解の参考としてお役立てください。
より深い対話と個別の状況については、ぜひ鑑定士との直接のセッションをお試しください。」`;
}

/**
 * EnrichedMeishiki をユーザープロンプト（命式情報）に変換
 */
export function buildDeepUserPrompt(meishiki: EnrichedMeishiki): string {
  const { birthDate, name } = meishiki;
  const yearStr = pillarToString(meishiki.yearPillar);
  const monthStr = pillarToString(meishiki.monthPillar);
  const dayStr = pillarToString(meishiki.dayPillar);

  // 中殺情報
  const chuusatsuInfo = meishiki.chuusatsu.locations.length > 0
    ? `\n【宿命中殺】
天中殺の支: ${meishiki.chuusatsu.tenchuusatsu.join('・')}
中殺の位置: ${meishiki.chuusatsu.locations.map(l => `${l.meaning}（${l.description}）`).join(' / ')}`
    : `\n【宿命中殺】命式内に中殺なし（天中殺の支: ${meishiki.chuusatsu.tenchuusatsu.join('・')}）`;

  // 特殊干支関係
  const relationsInfo = buildRelationsString(meishiki.specialRelations);

  // 律音・納音
  const rituonInfo = meishiki.rituonNatOn.rituon.length > 0
    ? `\n【律音（同一干支の重なり）】${meishiki.rituonNatOn.rituon.map(r => `${r.pillar}(${r.positions.join('-')})`).join(', ')}`
    : '';
  const natOnInfo = meishiki.rituonNatOn.natOn.length > 0
    ? `\n【納音（同一納音グループ）】${meishiki.rituonNatOn.natOn.map(n => `${n.natOnGroup}: ${n.pillars.join('・')}`).join(', ')}`
    : '';

  // 大運天中殺
  const daiunTenchuusatsu = meishiki.unTenchuusatsu.daiunPeriods.length > 0
    ? `\n【大運天中殺の時期】${meishiki.unTenchuusatsu.daiunPeriods
        .map(p => `${p.startAge}〜${p.endAge}歳（${p.pillar}）`).join(', ')}`
    : '';

  // 現在の大運期
  const currentAge = new Date().getFullYear() - birthDate.year;
  const currentDaiun = meishiki.daiun.pillars.find(
    p => currentAge >= p.startAge && currentAge <= p.endAge,
  );
  const currentDaiunInfo = currentDaiun
    ? `\n【現在の大運期】${currentDaiun.startAge}〜${currentDaiun.endAge}歳: ${currentDaiun.pillar}（${currentDaiun.followStar}）${currentDaiun.isTenchuusatsu ? ' ※大運天中殺期' : ''}`
    : '';

  // エネルギー値
  const ENERGY: Record<string, number> = {
    '天報星': 1, '天印星': 2, '天貴星': 3, '天恍星': 4,
    '天南星': 8, '天禄星': 7, '天将星': 12, '天堂星': 6,
    '天胡星': 5, '天極星': 3, '天庫星': 5, '天馳星': 4,
  };
  const eInitial = ENERGY[meishiki.followStars.initial] ?? 5;
  const eMiddle = ENERGY[meishiki.followStars.middle] ?? 5;
  const eLate = ENERGY[meishiki.followStars.late] ?? 5;

  return `以下の命式について、システムプロンプトの哲学・制約・構造（6セクション 1500〜2000字）に従った深い鑑定文を執筆してください。
中殺・特殊干支関係・大運天中殺などの要素は単独でなく、その人の人生の物語としてどう作用するかを考えて統合してください。
専門用語は読者向けに翻訳してください（「干合」→「響き合う関係」、「冲」→「刺激し合う関係」、「天中殺」→「内省と種まきの時期」など）。

【相談者】
${name ? `お名前: ${name}` : ''}
生年月日: ${birthDate.year}年${birthDate.month}月${birthDate.day}日

【命式三柱】
年柱: ${yearStr}
月柱: ${monthStr}
日柱（本命）: ${dayStr}

【十大主星（人体図）】
頭（北・月干→社会的役割）: ${meishiki.mainStars.head}
左肩（西・年干→親世代の影響）: ${meishiki.mainStars.leftShoulder}
胸（中央・本人の核）: ${meishiki.mainStars.chest}
右肩（東・月支→才能・配偶者）: ${meishiki.mainStars.rightShoulder}
腹（南・年支→基盤・財）: ${meishiki.mainStars.abdomen}

【十二大従星（人生エネルギー）】
初年（0-30歳）: ${meishiki.followStars.initial}（活動度 ${eInitial}/12）
中年（30-60歳）: ${meishiki.followStars.middle}（活動度 ${eMiddle}/12）
晩年（60歳-）: ${meishiki.followStars.late}（活動度 ${eLate}/12）

【立運と大運の流れ】
立運開始年齢: ${meishiki.daiun.startAge}歳（${meishiki.daiun.direction === 'forward' ? '順行' : '逆行'} / 節入りまで${meishiki.daiun.setsuDistanceDays}日）${currentDaiunInfo}${daiunTenchuusatsu}${chuusatsuInfo}${relationsInfo}${rituonInfo}${natOnInfo}

これらの全要素を統合的に踏まえ、相談者にとって意味のある深い鑑定文を執筆してください。`;
}

function buildRelationsString(relations: SpecialRelations): string {
  const parts: string[] = [];
  if (relations.kango.length > 0) parts.push(`干合: ${relations.kango.map(r => r.type).join(', ')}`);
  if (relations.shigo.length > 0) parts.push(`支合: ${relations.shigo.map(r => r.type).join(', ')}`);
  if (relations.sanGo.length > 0) parts.push(`三合: ${relations.sanGo.map(r => r.type).join(', ')}`);
  if (relations.chu.length > 0) parts.push(`冲: ${relations.chu.map(r => r.type).join(', ')}`);
  if (relations.kei.length > 0) parts.push(`刑: ${relations.kei.map(r => r.type).join(', ')}`);
  if (relations.gai.length > 0) parts.push(`害: ${relations.gai.map(r => r.type).join(', ')}`);
  if (relations.ha.length > 0) parts.push(`破: ${relations.ha.map(r => r.type).join(', ')}`);
  return parts.length > 0 ? `\n【特殊干支関係】\n${parts.join('\n')}` : '';
}
