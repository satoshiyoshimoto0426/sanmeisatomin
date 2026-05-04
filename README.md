# Sanmei Compass — 算命羅針盤

算命学（高尾系）の命式を生年月日から自動算出し、Claude AI による解釈とともに可視化する Next.js アプリです。

## 機能

- **生年月日から命式を自動算出**（節月暦対応 — 立春・節入り切替）
- **十大主星 3×3 人体図** と **十二大従星タイムライン**
- **Claude AI による倫理的鑑定文**（ストリーミング表示）
- **古典引用・アクションプラン・PDF出力**
- **履歴保存**（端末内 localStorage）

## ローカル開発

```bash
npm install
cp .env.example .env.local
# .env.local に ANTHROPIC_API_KEY を記入
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開く。

## 環境変数

| キー | 必須 | 用途 |
|---|---|---|
| `ANTHROPIC_API_KEY` | ✅ | Claude API（AI解釈・アクションプラン） |

## デプロイ

Vercel での1-clickデプロイを推奨。
環境変数 `ANTHROPIC_API_KEY` を Vercel ダッシュボードに登録してください。

## ディレクトリ

```
sanmei-compass/
├ app/
│  ├ input|result|history|manual|disclaimer/  # 各画面
│  └ api/interpret|action-plan/               # Claude API ストリーム
├ components/  # MeishikiCard, BodyMap, EnergyTimeline, …
└ lib/
   ├ sanmei.ts       # 命式算出ロジック
   ├ solar-terms.ts  # 節気テーブル
   ├ classics.ts     # 古典引用データ
   └ constants.ts    # 干支・蔵干テーブル
```

## ライセンス・免責

本アプリは「高尾系算命学」の体系に基づきます。鑑定結果はエンターテインメント・自己理解の参考としてご活用ください。詳細は `/disclaimer`。
