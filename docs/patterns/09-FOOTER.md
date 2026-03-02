# 09: フッター

## 概要
ページ下部の共通フッター。ロゴ、ナビゲーション、会社情報、コピーライトで構成。

## 適用場面
- 全ページ共通フッター

## Figmaでの特徴
- 背景色が本文と異なる（グレー系が多い）
- 複数カラムでロゴ・ナビ・情報を配置
- 最下部にコピーライト

---

## 現プロジェクト向け実装

```scss
@use "foundation" as *;

.p-footer {
  background-color: $bg-dark;
}

.p-footer__inner {
  max-width: rem(1200);
  margin-inline: auto;
  padding-block: rem(60) rem(40);
  padding-inline: $padding-pc;

  @include mq("md") {
    padding-block: rem(40) rem(20);
    padding-inline: $padding-sp;
  }
}

// PC: flex で左右配置、SP: 縦積み
.p-footer__container {
  display: flex;
  justify-content: space-between;
  gap: rem(40);

  @include mq("md") {
    flex-direction: column;
    gap: rem(30);
  }
}

.p-footer__left {
  // ロゴ + 会社情報
}

.p-footer__right {
  // ナビゲーション
}

.p-footer__logo {
  width: rem(200);
  margin-bottom: rem(30);

  @include mq("md") {
    width: rem(150);
  }
}

.p-footer__logo a {
  display: block;
}

// 会社情報
.p-footer__info {
  font-size: rem(13);
  line-height: 2.5;
  letter-spacing: 0.1em;
}

// ナビ: grid で複数列
.p-footer__nav {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: rem(15);

  @include mq("md") {
    grid-template-columns: repeat(2, 1fr);
  }
}

.p-footer__navItem a {
  font-size: rem(14);
  letter-spacing: 0.1em;
  text-decoration: none;
}

// PC限定ホバー
@media (any-hover: hover) {
  .p-footer__navItem a:hover {
    opacity: 0.7;
    transition: 0.3s opacity;
  }
}

// SNSリンク
.p-footer__sns {
  display: flex;
  gap: rem(15);
  margin-top: rem(20);
}

.p-footer__snsItem a {
  display: block;
  width: rem(30);
  height: rem(30);
}

// プライバシーポリシー
.p-footer__privacy {
  display: block;
  text-align: right;
  width: fit-content;
  margin-left: auto;
  font-size: rem(14);
  letter-spacing: 0.1em;
  text-decoration: none;
}

// コピーライト（別背景色）
.p-footer__copy {
  text-align: center;
  font-size: rem(12);
  padding-block: rem(20);
  background-color: darken($bg-dark, 5%);
  letter-spacing: 0.1em;
}
```

---

## 参考: 過去プロジェクトでの実装

### Project Alpha
- ロゴ → ボディ（背景色付き）→ コピーライト（別背景色）の3層構造
- PC: `flex` + `space-between` で左右配置、SP: `display: block` で縦積み
- ナビはSP時に `grid` 2列
- inner 幅を独自設定（1030px）
- `.footer__privacy` を `margin-left: auto` + `width: fit-content` で右寄せ

### Project Beta
- `flex` で左（ロゴ+情報）右（ナビ）の2カラム
- ナビは `grid` で3列、SPでは2列
- SPでは `flex-direction: column` で縦積み
- SNSリンクは `flex` + `gap` で横並び
- コピーライトは `darken()` で背景を少し暗くして視覚分離

---

## 実装時の注意
- **フッターの背景色は必ず inner の外側で設定**。inner は中のコンテンツ幅のみ制御
- コピーライトは背景色を変えて視覚的に分離するデザインが多い
- SPのナビは `grid` 2列が扱いやすい（`flex-wrap` より均等）
- SNSリンクのアイコンサイズは `rem()` で指定
- プライバシーポリシーリンクは `margin-left: auto` + `width: fit-content` で右寄せ
- ホバーは `@media (any-hover: hover)` で囲む
- 中央寄せは `margin-inline: auto`、左右余白は `padding-inline`
