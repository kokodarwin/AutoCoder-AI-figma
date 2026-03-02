# 05: カードグリッド

## 概要
コンテンツを均等列のグリッドで並べるパターン。サービス紹介、ニュース一覧、実績紹介などで使用。

## 適用場面
- サービス一覧（3列）
- ニュース/ブログ一覧（2列/3列）
- 実績/ポートフォリオ（2列/3列/4列）

## Figmaでの特徴
- 同一サイズのフレームが横に並ぶ
- autoLayout で `layoutMode: HORIZONTAL` + `layoutWrap: WRAP`
- 各フレーム内に画像 + テキストの縦構成

---

## 現プロジェクト向け実装

### gridで3列カード
```scss
@use "foundation" as *;

.p-service__cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: rem(40);

  @include mq("md") {
    grid-template-columns: 1fr;
    gap: rem(30);
  }
}

.p-service__card {
  display: block;
  border-radius: rem(10);
  overflow: hidden;
  background-color: $white;
  box-shadow: 0 rem(2) rem(12) rgba(0, 0, 0, 0.06);
}

.p-service__cardImage {
  width: 100%;
  aspect-ratio: 450 / 252;
  overflow: hidden;
}

.p-service__cardImage img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.p-service__cardBody {
  padding: rem(24) rem(20);
}

.p-service__cardTitle {
  font-family: $noto-sans-jp;
  font-size: rem(18);
  font-weight: $bold;
  line-height: 1.6;
  margin-bottom: rem(10);
}

.p-service__cardText {
  font-size: rem(14);
  line-height: 1.8;
}
```

### flexで2列カード（固定幅）
```scss
@use "foundation" as *;

.p-knowhow__cards {
  display: flex;
  gap: rem(40);

  @include mq("md") {
    flex-direction: column;
    gap: rem(40);
  }
}

.p-knowhow__card {
  width: rem(650);
  max-width: 100%;
  background-color: $white;
  display: flex;
  flex-direction: column;
  flex-shrink: 1;
  min-width: 0;

  @include mq("md") {
    width: 100%;
  }
}

.p-knowhow__cardImage {
  width: 100%;
  height: rem(366);
  overflow: hidden;
  margin-bottom: rem(30);

  @include mq("md") {
    height: rem(240);
  }
}

.p-knowhow__cardImage img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.p-knowhow__cardBody {
  padding-inline: rem(48);
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  @include mq("md") {
    padding-inline: rem(20);
  }
}

// ボタンをカード下部に固定
.p-knowhow__cardButton {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: rem(10);
  margin-top: auto;
  margin-left: auto;
  border-bottom: rem(1) solid $dark;
  text-decoration: none;
}
```

---

## 参考: 過去プロジェクトでの実装

### Project Alpha
- `display: grid` + `repeat(3, 1fr)` でグリッド配置
- カードに `border: 2px solid $gray3` + `border-radius` + `overflow: hidden`
- 画像に `aspect-ratio: 450/252` で比率固定
- SPでは `grid-template-columns: 1fr` の1列

### Project Beta
- 列数ごとにクラスを用意（`c-column2` / `c-column3` / `c-column4`）
- カードの中身は別コンポーネントとして独立
- `--sp2` modifier でSP時に2列維持するバリエーション

---

## 実装時の注意
- **`display: grid` + `repeat(N, 1fr)` が最も安定**。カード数が固定なら `flex` も可
- `gap` の値は Figma のフレーム間余白から取得
- カード画像は `aspect-ratio` で比率固定、または `height` 固定 + `object-fit: cover`
- SP時の列数はデザイン次第（1列 or 2列）
- カード全体を `<a>` タグで囲む場合は `display: block` を指定
- `overflow: hidden` + `border-radius` でカードの角丸を画像にも適用
- ボタンをカード下部に揃えるには `flex-grow: 1` + `margin-top: auto`
