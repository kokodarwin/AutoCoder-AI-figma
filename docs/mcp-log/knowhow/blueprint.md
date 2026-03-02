# ノウハウページ（SNS広告運用）実装計画

## ページ構造（メタデータ座標ベース）

```
Know-how page (1440 x 7122)
├── FV (0,0) 1440x581 → p-knowhowFv
├── title-section (100,681) 1240x579 → p-knowhowPage__header
├── article (100,1260) 1240x4562 → p-knowhowPage__article
├── share (100,5902) 860x125 → p-knowhowPage__share
├── contact (100,6167) 1240x448 → 既存p-contact流用
└── footer (0,6390) 1440x732 → 既存p-footer流用
```

## セクション間余白

| From → To | 計算 | 余白 |
|---|---|---|
| FV → title | 681 - 581 | 100px |
| title → article | 1260 - (681+579) | 0px（連続） |
| article → share | 5902 - (1260+4562) | 80px |
| share → contact | 6167 - (5902+125) | 140px |

## SCSSファイル

1. `_p-knowhowFv.scss` - FVセクション（conceptFvを参考）
2. `_p-knowhowPage.scss` - コンテンツエリア全体（タイトル、記事本文、シェア）

## パターン適用

- FV → パターン01（レイアウトコンテナ）+ conceptFvパターン
- 記事本文 → カスタム（ブログ記事レイアウト）
- STEPカード → パターン10（フロー・ステップ）参考
- お問い合わせ+フッター → 既存流用

## HTML構造

```
header.l-header (既存)
main
  section.p-knowhowFv（FV）
  div.p-knowhowPage（コンテンツラッパー）
    div.p-knowhowPage__inner（1240px centered）
      div.p-knowhowPage__header（タイトル+導入+目次）
      article.p-knowhowPage__article（記事本文）
      div.p-knowhowPage__share（シェア）
  div.p-contactFooterWrap（既存流用）
```

## 変数追加

- `$blue-heading-border: #c3cdda` （h2下ボーダー）

## フォント追加

- Jost: wght 300追加（STEP番号のLight用）
- Google Fonts URL更新: `family=Jost:wght@300;400`

## 記事内要素のスタイル仕様

### h2見出し
- border-bottom: 3px solid #c3cdda
- padding: 60px 10px 10px 10px
- font: NotoSansJP Bold 30px, #063852, leading 1.4

### h3見出し（左ボーダー型）
- margin-top: 30px
- border-left: 4px solid #1988c2（$blue）
- padding-left: 14px
- font: NotoSansJP Bold 24px, #063852, leading 1.4

### SNS広告種類ボックス
- margin-top: 16px, display: flex, gap: 10px
- アイコンボックス: 150x100px, bg: white, flex中央配置
- リスト: padding-left 20px, ドット10x10px + テキスト

### STEPカード
- margin-top: 30px
- border: 1px solid #3d9bcb, border-radius: 6px
- padding: 28px 30px, gap: 24px
- STEP: Jost 400, 40px, #1988c2, tracking 1.6px
- 番号: Jost 300, 70px, #1988c2, tracking 5.6px
- タイトル: NotoSansJP Bold 24px, #063852
- 本文: mt-16, NotoSansJP Regular 16px, #1a1a1a

### CTAボタン
- bg: #3d9bcb, padding: 16px 40px
- font: NotoSansJP Bold 15px, white
- メールアイコン: 22x22px

### シェアセクション
- bg: white, 860px, height 125px
- 「このページをシェアする」Bold 16px #063852
- SNSアイコン: 32x32px, gap 6px
