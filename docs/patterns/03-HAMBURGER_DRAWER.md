# 03: ハンバーガー・ドロワーメニュー

## 概要
SPメニューの開閉UI。ハンバーガーアイコン + フルスクリーンドロワーの組み合わせ。

## 適用場面
- SP時のナビゲーション
- PC時にも全画面メニューを持つデザイン

## Figmaでの特徴
- 右上のハンバーガーアイコン
- 開いた状態のメニュー画面が別フレームとして存在

---

## 現プロジェクト向け実装

### ハンバーガー
```scss
@use "foundation" as *;

.p-hamburgerOuter {
  width: rem(60);
  height: rem(60);
  background-color: $theme;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.5s all;

  @include mq("md") {
    width: rem(48);
    height: rem(48);
  }
}

.p-hamburger {
  display: block;
  width: rem(24);
  height: rem(16);
  position: relative;
  cursor: pointer;
  z-index: map-get($layer, "hamburger");
}

.p-hamburger span {
  display: inline-block;
  transition: ease 0.5s all;
  position: absolute;
  height: 2px;
  background-color: $white;
  width: 100%;
  left: 0;
  right: 0;
  top: calc((100% - 2px) / 2);
}

.p-hamburger span:nth-child(1) {
  transform: translateY(-7px);
}

.p-hamburger span:nth-child(2) {
  opacity: 1;
}

.p-hamburger span:nth-child(3) {
  transform: translateY(7px);
}

// OPEN時
.js-open .p-hamburger span:nth-child(1) {
  transform: rotate(45deg);
}

.js-open .p-hamburger span:nth-child(2) {
  opacity: 0;
}

.js-open .p-hamburger span:nth-child(3) {
  transform: rotate(-45deg);
  width: 100%;
}

// PC限定ホバー
@media (any-hover: hover) {
  .p-hamburgerOuter:hover {
    opacity: 0.8;
    transition: 0.5s all;
  }
}
```

### ドロワー
```scss
.p-drawer {
  background-color: $theme;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: map-get($layer, "drawer");
  overscroll-behavior: none;
}

.p-drawer__wrap {
  height: 100%;
  overflow-y: scroll;
  padding-block: rem(60);
}

.p-drawer__inner {
  max-width: rem(455);
  width: 100%;
  margin-inline: auto;

  @include mq("md") {
    padding-inline: $padding-sp;
  }
}

.p-drawer__logo {
  width: rem(95);
  margin-inline: auto;
}

.p-drawer__logo a {
  display: block;
}

.p-drawer__nav {
  display: flex;
  justify-content: space-between;
  margin-top: rem(60);
  color: $white;
}

.p-drawer__item {
  display: block;
  position: relative;
}

.p-drawer__item + .p-drawer__item {
  margin-top: rem(20);
}

// アニメーション
.js-drawer {
  transition: 0.5s all ease-in-out;
  opacity: 0;
  visibility: hidden;
  clip-path: inset(0% 0% 40% 0%);
}

.js-drawer.is-open {
  visibility: visible;
  opacity: 1;
  clip-path: inset(0% 0% 0% 0%);
}
```

---

## 参考: 過去プロジェクトでの実装

### Project Alpha
- ハンバーガーが `position: fixed` + `skewX(60deg)` の斜め線デザイン
- ドロワーが画像50% + メニュー50%の2カラム構成
- SP時は `backdrop-filter: blur()` でぼかし背景

### Project Beta
- テーマカラー背景の正方形コンテナ（100px PC / 48px SP）
- 3本線の幅が異なるデザイン（段階的に短くなる）
- `clip-path` でドロワーのアニメーション

---

## 実装時の注意
- **z-index は `$layer` マップで管理**（ハードコードしない）
- ドロワーは `overflow-y: scroll` を忘れるとメニュー項目が多い場合にスクロール不可
- `visibility: hidden` + `opacity: 0` の組み合わせで非表示時のクリック防止
- JSクラス名（`.js-*` / `.is-*`）は状態管理に限定
- `overscroll-behavior: none;` で背景のスクロールを防止
