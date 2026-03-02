# 02: ヘッダー・ナビゲーション

## 概要
サイト上部のヘッダー。ロゴ + PCナビゲーション + ハンバーガーボタンの構成。

## 適用場面
- 全ページ共通ヘッダー
- PC: ロゴ + ナビリンク表示
- SP: ロゴ + ハンバーガーボタン

## Figmaでの特徴
- 最上部の固定/非固定フレーム
- ロゴ画像 + テキストリンクの横並び

---

## 現プロジェクト向け実装

```scss
@use "foundation" as *;

.p-header {
  width: 100%;
  position: relative;
}

.p-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: rem(30);
  padding-inline: $padding-pc;
  max-width: rem(1200);
  margin-inline: auto;

  @include mq("md") {
    padding-block: rem(15);
    padding-inline: $padding-sp;
  }
}

.p-header__logo {
  width: rem(200);

  @include mq("md") {
    width: rem(150);
  }
}

.p-header__logo a {
  display: block;
}

.p-header__nav {
  display: flex;
  align-items: center;
  gap: rem(40);

  @include mq("md") {
    display: none;
  }
}

.p-header__navItem a {
  font-size: rem(16);
  letter-spacing: 0.1em;
  position: relative;
}

// PC限定ホバー
@media (any-hover: hover) {
  .p-header__navItem a:hover {
    opacity: 0.7;
    transition: 0.3s opacity;
  }
}

.p-header__hamburger {
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
  z-index: map-get($layer, "hamburger");
}
```

---

## 参考: 過去プロジェクトでの実装

### Project Alpha
- ロゴを `position: absolute` + `transform: translate(-50%, -50%)` で中央配置
- ナビが `writing-mode: vertical-rl` の縦書き
- ホバーは `clip-path` アニメーション

### Project Beta
- `display: flex` + `justify-content: space-between` でロゴとナビを左右配置
- ナビ項目に装飾スラッシュ（`::before` SVG背景）
- ホバーは `@media screen and (min-width:769px)` で制御

---

## 実装時の注意
- ロゴの配置方法はデザインに依存（中央 or 左寄せ）
- **SP時は必ずナビを非表示にし、ハンバーガー経由のドロワーで代替**
- 固定ヘッダーの場合は `z-index` と body の `padding-top` 調整が必要
- ホバーは `@media (any-hover: hover)` で囲む
