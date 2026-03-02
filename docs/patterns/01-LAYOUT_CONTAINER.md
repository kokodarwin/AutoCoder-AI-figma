# 01: レイアウトコンテナ

## 概要
ページ幅の制御（inner）とセクション間の余白（section spacing）を担うレイアウトパターン。
全セクションの基盤となる。

## 適用場面
- 全ページ共通のコンテンツ幅制御
- セクション間の余白設定

## Figmaでの特徴
- Frame の maxWidth が一定値（例: 1200px, 1290px）
- セクション間に大きな padding がある

---

## 現プロジェクト向け実装

### inner コンテナ
```scss
@use "foundation" as *;

.l-inner {
  width: rem(1200);
  max-width: 100%;
  padding-inline: $padding-pc;
  margin-inline: auto;

  @include mq("md") {
    padding-inline: $padding-sp;
  }
}

// 幅バリエーション
.l-inner--sm {
  width: rem(1000);
}
```

### セクション余白
```scss
// セクションごとにFigma値を直接設定
.p-about {
  padding-block: rem(100);

  @include mq("md") {
    padding-block: rem(50);
  }
}
```

---

## 参考: 過去プロジェクトでの実装

### Project Alpha（BEM・入れ子）
- `max-width: rem(1290)` + `padding: 0 $padding-pc` + `margin: 0 auto`
- SPで `max-width: rem(600)` を追加設定

### Project Beta（FLOCSS）
- `width: rem(1250)` + `max-width: 100%` でコンテナ制御
- `l-sec01`〜`l-sec11` のようにセクションごとの余白を番号付きクラスで管理

---

## 実装時の注意
- **inner は必ずセクションごとに HTML に配置**。セクション背景色がある場合、inner の外側に背景を設定
- 中央寄せは `margin-inline: auto;`（`margin: 0 auto` は使わない）
- 左右余白は `padding-inline`（`padding: 0 25px` は使わない）
- padding 値はデザインカンプから正確に取得する（`rem()` で指定）
