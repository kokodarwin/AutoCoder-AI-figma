# 07: CTA・コンタクトセクション

## 概要
問い合わせや資料請求への行動喚起（CTA）セクション。背景色/画像 + 中央テキスト + ボタンの構成。

## 適用場面
- お問い合わせ誘導エリア
- 資料請求・見積もり依頼
- ページ下部の共通CTA

## Figmaでの特徴
- セクション全体に背景色や画像がある
- 中央にテキスト + ボタンが配置
- 他セクションより目立つデザイン

---

## 現プロジェクト向け実装

### 背景画像 + オーバーレイ型
```scss
@use "foundation" as *;

.p-contact {
  background: url(../img/contact/bg.jpg) center / cover no-repeat;
  position: relative;
}

.p-contact::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba($black, 0.6);
}

.p-contact__inner {
  position: relative;
  z-index: 1;
  text-align: center;
  padding-block: rem(80);
  padding-inline: $padding-pc;
  max-width: rem(1200);
  margin-inline: auto;
  color: $white;

  @include mq("md") {
    padding-block: rem(40);
    padding-inline: $padding-sp;
  }
}

.p-contact__heading {
  font-family: $noto-sans-jp;
  font-size: rem(30);
  font-weight: $bold;
  line-height: 1.5;
  margin-bottom: rem(20);

  @include mq("md") {
    font-size: rem(22);
  }
}

.p-contact__text {
  font-size: rem(16);
  line-height: 2;
  margin-bottom: rem(40);

  @include mq("md") {
    margin-bottom: rem(30);
  }
}

.p-contact__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: rem(300);
  padding-block: rem(20);
  padding-inline: rem(40);
  background-color: $accent;
  border-radius: rem(10);
  color: $white;
  font-size: rem(18);
  font-weight: $bold;
  text-decoration: none;
  transition: 0.3s opacity;

  @include mq("md") {
    min-width: auto;
    width: 100%;
    max-width: rem(340);
  }
}

// PC限定ホバー
@media (any-hover: hover) {
  .p-contact__button:hover {
    opacity: 0.8;
  }
}
```

### 背景色型（カード）
```scss
@use "foundation" as *;

.p-contact {
  padding-block: rem(100);

  @include mq("md") {
    padding-block: rem(60);
  }
}

.p-contact__inner {
  max-width: rem(1030);
  padding-inline: $padding-pc;
  margin-inline: auto;

  @include mq("md") {
    padding-inline: $padding-sp;
  }
}

.p-contact__container {
  background-color: $bg-light;
  border-radius: rem(18);
  padding-block: rem(100);
  padding-inline: rem(15);
  text-align: center;

  @include mq("md") {
    padding-block: rem(40);
  }
}

.p-contact__button {
  display: block;
  min-width: rem(465);
  width: fit-content;
  margin-inline: auto;
  margin-top: rem(35);
  padding-block: rem(30);
  padding-inline: rem(15);
  text-align: center;
  font-size: rem(22);
  font-weight: $bold;
  letter-spacing: 0.18em;
  line-height: 1;
  border-radius: rem(18);
  border: 1px solid $gray;
  background-color: $white;
  text-decoration: none;
  transition: 0.4s background ease-in-out;

  @include mq("md") {
    font-size: rem(18);
    min-width: 100%;
    padding-block: rem(20);
    border-radius: rem(10);
  }
}

// PC限定ホバー
@media (any-hover: hover) {
  .p-contact__button:hover {
    background-color: $gray;
  }
}
```

---

## 参考: 過去プロジェクトでの実装

### Project Alpha
- 背景色（`$gray5`）+ `border-radius` でカード型CTA
- inner 幅を独自設定（1030px）
- ボタンは `min-width` + `width: fit-content` で中央配置
- 電話番号リンクをCTA内に配置

### Project Beta
- 背景画像 + `::before` で暗いオーバーレイ
- コンテンツは `position: relative; z-index: 1` でオーバーレイの上に配置
- テキストは白、ボタンは別コンポーネント（`.c-btn`）を使用

---

## 実装時の注意
- **背景画像 + オーバーレイの場合**: `::before` でオーバーレイ、コンテンツに `position: relative; z-index: 1`
- **カード型CTAの場合**: `border-radius` + `overflow: hidden`、inner を独自幅にすることが多い
- ボタンの `min-width` をSPでは `100%` にして画面幅に合わせる
- 電話番号リンクは `<a href="tel:XXX">` で、SPのみクリック可能にする場合は `pointer-events: none`（PC）
- ホバーは `@media (any-hover: hover)` で囲む
