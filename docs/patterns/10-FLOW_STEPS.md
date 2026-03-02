# 10: フロー・ステップ

## 概要
手順や流れを番号付きで表示するパターン。矢印や線で順序を視覚化。

## 適用場面
- サービスの流れ（お問い合わせ〜完了）
- 施工の手順
- 利用方法の説明

## Figmaでの特徴
- 番号 + タイトル + 説明のカードが横 or 縦に並ぶ
- カード間に矢印や連結線がある
- 背景色や番号の装飾が目立つ

---

## 現プロジェクト向け実装

### 横並びフロー
```scss
@use "foundation" as *;

.p-flow__items {
  display: flex;
  gap: rem(20);

  @include mq("md") {
    flex-direction: column;
    gap: rem(30);
  }
}

.p-flow__item {
  flex: 1;
  position: relative;
  background-color: $white;
  padding: rem(30);
  border-radius: rem(10);
  text-align: center;
}

// ステップ番号（丸背景）
.p-flow__num {
  display: inline-block;
  width: rem(50);
  height: rem(50);
  line-height: rem(50);
  border-radius: 50%;
  background-color: $theme;
  color: $white;
  font-size: rem(20);
  font-weight: $bold;
  margin-bottom: rem(15);
}

.p-flow__heading {
  font-size: rem(18);
  font-weight: $bold;
  line-height: 1.5;
  margin-bottom: rem(10);

  @include mq("md") {
    font-size: rem(16);
  }
}

.p-flow__text {
  font-size: rem(14);
  line-height: 1.8;
}

// 矢印（アイテム間）: PC は右向き、SP は下向き
.p-flow__item:not(:last-child)::after {
  content: "";
  position: absolute;
  top: 50%;
  right: rem(-15);
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: rem(10) solid $theme;
  border-top: rem(8) solid transparent;
  border-bottom: rem(8) solid transparent;

  @include mq("md") {
    top: auto;
    bottom: rem(-20);
    right: 50%;
    transform: translateX(50%);
    border-left: rem(8) solid transparent;
    border-right: rem(8) solid transparent;
    border-top: rem(10) solid $theme;
    border-bottom: none;
  }
}
```

### 縦並びフロー（番号自動採番）
```scss
@use "foundation" as *;

.p-flow__items {
  counter-reset: flowNumber 0;
}

.p-flow__item {
  display: flex;
  align-items: flex-start;
  gap: rem(30);
  position: relative;
  padding-bottom: rem(40);

  @include mq("md") {
    gap: rem(20);
    padding-bottom: rem(30);
  }
}

.p-flow__item + .p-flow__item {
  margin-top: rem(20);
}

// 番号（CSS counter で自動採番）
.p-flow__num::before {
  counter-increment: flowNumber 1;
  content: "0" counter(flowNumber);
}

.p-flow__num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: rem(60);
  height: rem(60);
  border-radius: 50%;
  background-color: $theme;
  color: $white;
  font-size: rem(24);
  font-weight: $bold;
  flex-shrink: 0;
}

// 連結線（最後のアイテム以外）
.p-flow__item:not(:last-child)::after {
  content: "";
  position: absolute;
  top: rem(70);
  left: rem(30);
  width: rem(2);
  height: calc(100% - rem(70));
  background-color: $theme;
}

.p-flow__body {
  flex: 1;
}

.p-flow__heading {
  font-size: rem(18);
  font-weight: $bold;
  margin-bottom: rem(10);
}

.p-flow__text {
  font-size: rem(14);
  line-height: 1.8;
}
```

---

## 参考: 過去プロジェクトでの実装

### Project Alpha
- 専用の flow コンポーネントはないが、`pa-make` セクションで類似パターン
- CSS `counter-increment` + `content: "0" counter(number)` で自動番号
- 各ステップは画像+テキストの横並び（メディアブロックパターンの応用）
- `font-size: rem(122)` の巨大番号を装飾として使用

### Project Beta
- `flex` で横並び、`flex: 1` で均等幅
- 各ステップに `::after` + `border` で三角矢印
- SPでは `flex-direction: column` + 矢印を下向きに変更
- `border-radius: 50%` の丸背景で番号を装飾
- `:not(:last-child)::after` で最後のステップの矢印を除外

---

## 実装時の注意
- **矢印の位置は `gap` の中央**に来るよう調整。`right: -(gap/2)` 程度
- 番号は HTML テキストか CSS `counter` か、デザイン次第で選択
- 番号の背景（丸）は `border-radius: 50%` + `width` = `height` で正円
- ステップ数が多い場合、PCでも2行にする判断が必要
- 最後のステップには矢印を出さない（`:not(:last-child)::after`）
- SPでの矢印向き変更: PC右向き → SP下向き（`border` プロパティを変更）
- 連結線は `::after` + `position: absolute` で配置
