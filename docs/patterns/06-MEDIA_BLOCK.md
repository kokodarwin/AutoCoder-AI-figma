# 06: メディアブロック（画像+テキスト横並び）

## 概要
画像とテキストを横並びに配置するパターン。交互に左右反転するバリエーションが多い。

## 適用場面
- 会社紹介・サービス説明
- 「こだわり」「特長」セクション
- 番号付きの工程説明

## Figmaでの特徴
- 横幅いっぱいに画像とテキストが50:50で並ぶ
- 偶数番目は画像とテキストの位置が逆転
- 背景装飾（色面）が画像の背後にある場合がある

---

## 現プロジェクト向け実装

### 基本構造
```scss
@use "foundation" as *;

.p-about__media {
  display: flex;
  align-items: center;
  gap: rem(60);

  @include mq("md") {
    flex-direction: column;
    gap: rem(20);
  }
}

.p-about__mediaImage {
  width: 50%;

  @include mq("md") {
    width: 100%;
  }
}

.p-about__mediaImage img {
  width: 100%;
  height: auto;
  border-radius: rem(10);
}

.p-about__mediaBody {
  width: 50%;

  @include mq("md") {
    width: 100%;
  }
}

.p-about__mediaTitle {
  font-family: $noto-sans-jp;
  font-size: rem(28);
  font-weight: $bold;
  line-height: 1.5;
  margin-bottom: rem(20);

  @include mq("md") {
    font-size: rem(22);
  }
}

.p-about__mediaText {
  font-size: rem(16);
  line-height: 2;
  letter-spacing: 0.05em;
}
```

### 左右反転版
```scss
@use "foundation" as *;

// 反転: flex-direction: row-reverse
.p-about__media--reverse {
  flex-direction: row-reverse;

  @include mq("md") {
    flex-direction: column;
  }
}
```

### 番号付き版
```scss
@use "foundation" as *;

.p-about__mediaItems {
  counter-reset: number 0;
}

.p-about__mediaItem {
  margin-top: rem(100);

  @include mq("md") {
    margin-top: rem(60);
  }
}

.p-about__mediaItem:first-child {
  margin-top: 0;
}

.p-about__mediaNum {
  font-size: rem(80);
  font-family: $second-font-family;
  line-height: 1;
  color: $accent;
  margin-bottom: rem(20);
}

// CSS counter で自動番号にする場合
.p-about__mediaNum::before {
  counter-increment: number 1;
  content: "0" counter(number);
}
```

---

## 参考: 過去プロジェクトでの実装

### Project Alpha
- `flex` + `max-width: 50%` で左右分割
- 画像が画面端まで広がる場合は inner の外に配置
- `::after` で背景装飾（色面）を追加、`z-index` で重なり管理
- `counter-increment` + `content: "0" counter(number)` で自動番号
- 反転は modifier クラスで `flex-direction: row-reverse`

### Project Beta
- `p-media` + `--reverse` modifier で反転
- `gap: rem(60)` で画像とテキストの間隔
- SPでは `flex-direction: column` で縦積み
- 番号は `$second-font-family` で装飾フォント

---

## 実装時の注意
- **画像が画面端まで広がるデザインの場合、inner の外に画像を配置する**
- 反転は `flex-direction: row-reverse` が最もシンプル。**SPでは必ず `column` に戻す**
- 画像の `border-radius` が片側のみ（例: 左角丸）の場合、`overflow: hidden` を忘れない
- 番号付きの場合、`counter-reset` を親要素に設定
- 画像とテキストの間隔は `gap` で調整（Figma値を参照）
- 画像比率は `aspect-ratio` で固定するか、画像自体のサイズに任せるかデザイン次第
