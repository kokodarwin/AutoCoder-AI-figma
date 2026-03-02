# 04: セクションタイトル

## 概要
各セクションの見出し。英語サブタイトル + 日本語メインタイトルの構成が多い。
装飾（下線、アイコン、背景）がデザインごとに異なる。

## 適用場面
- 全セクション共通の見出し部分
- 英語（小）+ 日本語（大）の2段構成

## Figmaでの特徴
- セクション上部の中央寄せテキスト
- 小さい英語テキスト + 大きい日本語テキストの組み合わせ
- 装飾線や装飾アイコンが付随

---

## 現プロジェクト向け実装

### 中央揃え版
```scss
@use "foundation" as *;

.p-about__heading {
  text-align: center;
  margin-bottom: rem(50);
}

.p-about__title {
  display: block;
  font-family: $noto-sans-jp;
  font-size: rem(22);
  font-weight: $bold;
  line-height: 1.6;
  color: $accent;
  margin-bottom: rem(5);
}

.p-about__lead {
  font-family: $noto-sans-jp;
  font-size: rem(38);
  font-weight: $bold;
  line-height: 1.4;
  color: $dark;

  @include mq("md") {
    font-size: rem(26);
  }
}
```

### 左寄せ版
```scss
@use "foundation" as *;

.p-knowhow__heading {
  margin-bottom: rem(50);
}

.p-knowhow__title {
  display: block;
  font-family: $noto-sans-jp;
  font-size: rem(22);
  font-weight: $bold;
  line-height: 1.6;
  color: $accent;
  margin-bottom: rem(5);
}

.p-knowhow__lead {
  font-family: $noto-sans-jp;
  font-size: rem(38);
  font-weight: $bold;
  line-height: 1.4;
  color: $dark;

  @include mq("md") {
    font-size: rem(26);
  }
}
```

### 装飾付き版（擬似要素）
```scss
@use "foundation" as *;

.p-service__heading {
  text-align: center;
  margin-bottom: rem(50);
}

.p-service__title {
  display: block;
  font-family: $noto-sans-jp;
  font-size: rem(22);
  font-weight: $bold;
  line-height: 1.6;
  color: $accent;
  position: relative;
  width: fit-content;
  margin-inline: auto;
  margin-bottom: rem(5);
}

// 装飾はデザインに応じて ::before / ::after で追加
.p-service__title::before {
  content: "";
  position: absolute;
  width: rem(95);
  height: rem(62);
  left: rem(-115);
  top: rem(-20);
  background: url(../img/common/slash.svg) center center / contain no-repeat;

  @include mq("md") {
    width: rem(60);
    height: rem(40);
    left: rem(-70);
  }
}
```

---

## 参考: 過去プロジェクトでの実装

### Project Alpha
- `.section-ttl` に `::before` / `::after` で装飾線・画像ボーダーを追加
- `letter-spacing: 0.18em` でゆったりとした字間
- `.section-arrow` で矢印装飾を別クラスで管理
- `counter()` + `skewX()` で斜め装飾

### Project Beta
- コンポーネント（`c-headline01`）として汎用ヘッドラインを定義
- `$second-font-family` で英語テキストにデザインフォント
- `::before` でSVG装飾（slash.svg）を配置
- `p-sectionTtl` で背景画像付きの特化版を別途定義

---

## 実装時の注意
- **装飾は `::before` / `::after` で実装**。余計な HTML 要素を増やさない
- 英語テキストの `font-family` は Figma から正確に取得する
- `letter-spacing` は em 単位で指定（CODING_RULES 準拠）
- タイトル下の余白は `margin-bottom` でセクションごとにFigmaから取得
- 中央揃え: `text-align: center` を heading ラッパーに設定
- 左寄せ: `text-align` なし（デフォルト）
