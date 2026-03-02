# ノウハウページ（SNS広告運用）デザインコンテキスト

## ページ構成

1. FV（ファーストビュー）- node: 2089:4235
2. 記事本文 - node: 2089:4254
3. シェアボタン - node: 2089:4486
4. お問い合わせ + フッター（コンセプトページから流用）

---

## 1. FV セクション (2089:4235)

### 全体
- サイズ: 1440 x 581px
- 背景: 複合背景（pngグループ node: 2089:4553）
  - ベース: bg-color `#00679d`, opacity 0.3
  - グラデーション: `89.97deg, rgb(28, 112, 156) 24.276%, rgba(0, 35, 53, 0) 93.082%`
  - 右側写真: AdobeStock画像, opacity 0.9
  - ネットワークパターン: mix-blend-mode: lighten, opacity 0.4, rotate -20.54deg

### タイトル「KNOW-HOW」
- font: Noto Sans JP Bold
- font-size: 120px
- color: #001723
- text-align: center
- leading: 0.8
- 位置: 水平中央, top: 242px

### サブタイトル「SNS広告運用」
- font: Noto Sans JP Bold
- font-size: 20px
- color: #ffffff
- text-align: center
- leading: 1.6
- 位置: 水平中央, top: 356px

### パンくずリスト
- 位置: left: 51px, top: 531px
- gap: 12px
- font: Noto Sans JP Regular
- font-size: 16px
- color: #ffffff
- leading: 1.6
- 矢印アイコン: 12x24px (weui:arrow-outlined)

### ヘッダー（既存を流用）
- 100px高, padding: 25px 50px

---

## 2. 記事本文セクション (2089:4254)

### 全体レイアウト
- flex-direction: column
- 幅: 記事コンテンツ部分

### h2見出し
- border-bottom: 3px solid #c3cdda
- padding: 60px 10px 10px 10px
- font: Noto Sans JP Bold
- font-size: 30px
- color: #063852
- leading: 1.4

### h3見出し（左ボーダータイプ）
- margin-top: 30px（pt: 30px）
- border-left: 4px solid #1988c2
- padding-left: 14px
- font: Noto Sans JP Bold
- font-size: 24px
- color: #063852
- leading: 1.4

### SNS広告種類ボックス（icon + list）
- margin-top: 16px（pt: 16px）
- gap: 10px
- アイコンボックス: 150x100px, bg: #ffffff
  - アイコン: 54x54px（各SNSアイコン）
  - padding: 横48px, 縦23-31px
- リスト:
  - padding-left: 20px
  - 箇条書きドット: 10x10px, 丸（#1988c2系の丸）
  - font: Noto Sans JP Regular, 16px, #1a1a1a, leading 1.8
  - gap: 10px

### 本文テキスト
- margin-top: 16px (pt: 16px)
- font: Noto Sans JP Regular
- font-size: 16px
- color: #1a1a1a
- leading: 1.8

### 箇条書きリスト
- padding-left: 20px
- margin-top: 16px (pt: 16px)
- ドット: 10x10px丸
- gap: 10px between dot and text
- font: Noto Sans JP Regular, 16px, #1a1a1a, leading 1.8

### 画像
- 幅: 860px (記事幅全体)
- margin-top: 30px (pt: 30px)
- アスペクト比: 3955:2280

### STEPカード（7ステップ）
- margin-top: 30px (pt: 30px)
- border: 1px solid #3d9bcb
- border-radius: 6px
- padding: 28px 30px
- gap: 24px (STEP番号とテキスト間)
- STEP番号:
  - "STEP": font Futura PT Book, 40px, #1988c2, tracking 1.6px, leading none
  - 番号: font Futura PT Light, 70px, #1988c2, tracking 5.6px, leading 0.9
- タイトル: Noto Sans JP Bold, 24px, #063852, leading 1.4
- 本文: margin-top 16px, Noto Sans JP Regular, 16px, #1a1a1a, leading 1.8

### CTAボタン「まずは相談してみる」
- bg: #3d9bcb
- padding: 16px 40px
- gap: 10px
- メールアイコン: 22x22px
- font: Noto Sans JP Bold, 15px, #ffffff
- text-shadow: 0px 0px 30px rgba(0,0,0,0.3)
- leading: 1.8

---

## 3. シェアセクション (2089:4486)

### 全体
- bg: #ffffff
- 幅: 860px, 高さ: 125px

### タイトル「このページをシェアする」
- font: Noto Sans JP Bold
- font-size: 16px
- color: #063852
- 横線装飾: 20px幅, 左側

### SNSアイコン
- gap: 6px
- サイズ: 各32x32px
- 順序: X, LINE, Instagram, Facebook

---

## 4. お問い合わせ + フッター
コンセプトページ（concept.html）の `.p-contactFooterWrap` をそのまま流用

---

## 必要な画像アセット

### FV背景
- pngグループ (2089:4553) → REST APIで1枚画像としてダウンロード
- パンくず矢印 → SVGダウンロード

### 記事内アイコン
- Google icon (2089:4262) → Clip path group
- YouTube icon (2089:4282) → youtube
- LINE icon (2089:4297) → icons8-line-480
- TikTok icon (2089:4310) → TikTok_Icon_Black_Square
- X icon (2089:4322) → item（X背景付き）
- 箇条書きドット (2089:4272) → Ellipse6
- メールアイコン (2089:4473) → material-symbols-light:mail-outline

### 記事内写真
- AdobeStock_480321890 (2089:4363) → 記事中の写真

### シェアアイコン
- X icon (2089:4489) → Vector
- LINE icon (2089:4490) → icons8-line-480
- Instagram icon (2089:4491) → icons8-instagram-480
- Facebook icon (2089:4492) → icons8-facebook-480

---

## フォント

- Noto Sans JP: Regular(400), Bold(700) → 既存
- Futura PT: Book, Light → STEPカードで使用（※追加必要）
- Jost: 既存（FVのby:stepロゴ用）

---

## 変数追加候補

- `$blue-step-border: #3d9bcb` → 既存の `$blue-button` と同じ値
- `$blue-heading-border: #c3cdda` → h2下ボーダー用（新規）
- `$blue-h3-border: #1988c2` → 既存の `$blue` と同じ値
