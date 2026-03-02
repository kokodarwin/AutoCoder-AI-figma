# 08: ボタン

## 概要
リンクボタンのコンポーネント。ボーダー型、塗り型、アイコン付きなどのバリエーション。

## 適用場面
- 「もっと見る」「詳しく見る」リンク
- フォーム送信ボタン
- CTAボタン

## Figmaでの特徴
- ボーダーで囲まれた矩形テキスト
- ホバー時に色が変わる
- 矢印アイコンが付くことが多い

---

## 現プロジェクト向け実装

### ボーダー型（中央配置）
```scss
@use "foundation" as *;

.p-about__button {
  display: block;
  min-width: rem(280);
  width: fit-content;
  margin-inline: auto;
  padding-block: rem(20);
  padding-inline: rem(30);
  text-align: center;
  font-size: rem(15);
  font-weight: $bold;
  letter-spacing: 0.18em;
  line-height: 1;
  border-radius: rem(15);
  border: 1px solid $gray;
  background-color: $white;
  text-decoration: none;
  transition: 0.4s background ease-in-out;

  @include mq("md") {
    width: 100%;
  }
}

// PC限定ホバー
@media (any-hover: hover) {
  .p-about__button:hover {
    background-color: $gray;
  }
}
```

### 塗り型（CTA用）
```scss
@use "foundation" as *;

.p-price__button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: rem(338);
  max-width: 100%;
  padding-block: rem(16);
  background-color: $accent;
  border-radius: rem(10);
  color: $white;
  font-size: rem(16);
  font-weight: $bold;
  letter-spacing: 0.08em;
  text-decoration: none;
  margin-top: auto;
  transition: 0.3s opacity;
}

// PC限定ホバー
@media (any-hover: hover) {
  .p-price__button:hover {
    opacity: 0.8;
  }
}
```

### アイコン付き型（矢印右寄せ）
```scss
@use "foundation" as *;

.p-knowhow__cardButton {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: rem(10);
  margin-top: auto;
  margin-left: auto;
  border-bottom: rem(1) solid $dark;
  text-decoration: none;
  transition: 0.3s opacity;
}

.p-knowhow__cardButtonText {
  font-family: $noto-sans-jp;
  font-size: rem(16);
  font-weight: $bold;
  line-height: normal;
  letter-spacing: 0.08em;
  color: $dark;
}

// 矢印アイコン（Figmaからダウンロード）
.p-knowhow__cardButtonArrow {
  width: rem(12);
  height: rem(24);
}

// PC限定ホバー
@media (any-hover: hover) {
  .p-knowhow__cardButton:hover {
    opacity: 0.7;
  }
}
```

### background で矢印配置型
```scss
@use "foundation" as *;

.p-service__button {
  display: inline-block;
  max-width: rem(340);
  width: 100%;
  border: 1px solid $theme;
  font-size: rem(18);
  font-weight: $bold;
  letter-spacing: 0.08em;
  padding-block: rem(22);
  padding-inline: rem(10);
  text-align: center;
  text-decoration: none;
  background: url(../img/common/arrowRight.svg) right rem(50) center / rem(24) no-repeat;
  transition: 0.5s all;

  @include mq("md") {
    padding-block: rem(17);
  }
}

// PC限定ホバー
@media (any-hover: hover) {
  .p-service__button:hover {
    color: $white;
    background: url(../img/common/arrowRightWhite.svg) right rem(50) center / rem(24) no-repeat;
    background-color: $theme;
  }
}
```

---

## 参考: 過去プロジェクトでの実装

### Project Alpha
- `min-width` + `width: fit-content` で最小幅を保証しつつテキスト幅に合わせる
- SPでは `width: 100%` でフル幅
- ホバーは `background` 色変更、`transition: 0.4s`
- 矢印アイコンなし、テキストのみ

### Project Beta
- `border: 1px solid $theme` でテーマカラーのボーダー
- `background` プロパティで矢印SVGを右寄せ配置
- ホバーは全体塗り + アイコン差し替え（白矢印）
- `max-width` + `width: 100%` で幅制御
- `c-btn02` でメールアイコン付きバリエーション

---

## 実装時の注意
- **`width: fit-content` + `min-width` はPC向け。SPでは `width: 100%`** にするのが安全
- ホバーは **`@media (any-hover: hover)` で囲む**（タッチデバイスの `:hover` 問題を回避）
- 矢印アイコンは `background` で配置するか、`<img>` / `::after` で配置するかはデザイン次第
- `<a>` タグのボタンには `display: block` または `display: inline-block` を指定
- `transition` は `0.3s〜0.5s` が自然
- `letter-spacing` は em 単位（CODING_RULES 準拠）
- 中央配置は `margin-inline: auto`（`margin: 0 auto` は使わない）
