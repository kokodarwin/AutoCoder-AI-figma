# レイアウトパターン集（重なり・並び替え）

`position: absolute` を使わずに複雑なレイアウトを実現するためのサンプルコード集。
実際のプロジェクト（Project Gamma Aboutページ）で使用したパターンをベースにしている。

---

## パターン1: ネガティブマージンによる要素の重なり

要素同士を重ねたい場合、`margin-top` にマイナス値を指定して上方向に引き上げる。

### ユースケース
- タイトルの上に画像がかぶるレイアウト
- セクションをまたいで要素が重なるデザイン

### HTML
```html
<section class="p-example">
    <div class="p-example_head">
        <h2 class="p-example_titleEn">SECTION TITLE</h2>
        <p class="p-example_titleJa">セクションタイトル</p>
    </div>
    <div class="p-example_imageMain">
        <img src="image.png" alt="">
    </div>
</section>
```

### SCSS
```scss
/* タイトルは通常配置 */
.p-example_head {
  margin-left: rem(223);
  position: relative;  /* z-indexを効かせるために必要 */
  z-index: 2;          /* 画像より前面に表示 */
}

/* 画像をネガティブマージンでタイトルに重ねる */
.p-example_imageMain {
  width: rem(1221);
  margin-top: rem(-97);  /* タイトル方向に引き上げ */

  @include mq() {
    width: rem(336);
    margin-top: rem(49);  /* SPでは重ねない場合は正の値に */
  }

  img {
    width: 100%;
  }
}
```

### ポイント
- 重なりの下になるテキスト側に `position: relative` + `z-index` を付けて前面に出す
- 画像側には `position` / `z-index` を付けない（自然に背面になる）
- SPで重なりが不要な場合は `margin-top` を正の値に切り替える

---

## パターン2: flex + orderによるSP並び替え

PCとSPで要素の表示順を変えたい場合、親に `display: flex` + `flex-direction: column` を設定し、子要素に `order` を指定する。

### ユースケース
- PCでは左上に画像、SPではタイトルの下に画像を移動
- PCとSPで画像とテキストの上下関係が逆になる

### HTML
```html
<section class="p-example">
    <div class="p-example_imageSub">
        <img src="sub.png" alt="">
    </div>
    <div class="p-example_head">
        <h2>TITLE</h2>
    </div>
    <div class="p-example_cont">
        <div class="p-example_imageMain">
            <img src="main.png" alt="">
        </div>
        <p class="p-example_text">テキスト</p>
    </div>
</section>
```

### SCSS
```scss
.p-example {
  /* PCではflexなし（通常フロー） */

  @include mq() {
    display: flex;
    flex-direction: column;
  }
}

/* HTML順: imageSub → head → cont */
/* SP表示順: head → imageSub → cont */

.p-example_imageSub {
  width: rem(300);
  margin-left: auto;           /* PCでは右寄せ */
  margin-top: rem(-66);     /* PCではネガティブマージン */

  @include mq() {
    order: 2;                   /* SPでは2番目 */
    width: rem(200);
    margin-left: auto;
    margin-top: rem(39);
  }

  img {
    width: 100%;
  }
}

.p-example_head {
  margin-top: rem(-59);

  @include mq() {
    order: 1;                   /* SPでは1番目（最上部） */
    margin-top: 0;
    text-align: center;
  }
}

.p-example_cont {
  display: flex;
  margin-top: rem(49);

  @include mq() {
    order: 3;                   /* SPでは3番目 */
    flex-direction: column;
    margin-top: rem(48);
  }
}
```

### ポイント
- PC側には `display: flex` を付けない（通常フローで上から順に配置）
- SP側のみ `flex-direction: column` + `order` で並び替え
- `order` は直接の子要素にしか効かない（孫要素には効かない）

---

## パターン3: ラッパーを使った部分グループの並び替え

`order` は直接の子要素にしか効かないため、**一部の要素をまとめて並び替えたい場合はラッパーで囲む**。

### ユースケース
- PC: タイトル → 大画像 → [テキスト + 小画像を横並び]
- SP: タイトル → [小画像 → テキスト を縦並び] → 大画像

### HTML
```html
<section class="p-example">
    <div class="p-example_head"><!-- タイトル --></div>
    <div class="p-example_imageMain"><!-- 大画像 --></div>
    <div class="p-example_body">  <!-- ラッパー -->
        <p class="p-example_text">テキスト</p>
        <div class="p-example_imageSub"><!-- 小画像 --></div>
    </div>
</section>
```

### SCSS
```scss
/* セクション: SPでflex column化 */
.p-example {
  @include mq() {
    display: flex;
    flex-direction: column;
  }
}

.p-example_head {
  @include mq() {
    order: 1;    /* SP: 1番目 */
  }
}

.p-example_imageMain {
  @include mq() {
    order: 3;    /* SP: 3番目（最下部へ移動） */
  }
}

/* ラッパー: PC横並び → SP縦並び */
.p-example_body {
  display: flex;
  align-items: flex-start;
  margin-top: rem(-55);

  @include mq() {
    order: 2;              /* SP: 2番目（中間） */
    flex-direction: column;
    margin-top: 0;
  }
}

/* ラッパー内の並び替え（SPのみ） */
.p-example_text {
  width: rem(450);
  margin-left: rem(217);

  @include mq() {
    order: 2;    /* body内: 2番目（テキストが下） */
    width: auto;
    margin-left: 0;
    padding-inline: rem(20);
  }
}

.p-example_imageSub {
  width: rem(350);
  margin-left: auto;

  @include mq() {
    order: 1;    /* body内: 1番目（画像が上） */
    width: 100%;
    margin-left: 0;
  }

  img {
    width: 100%;
  }
}
```

### 並び替えの結果

```
PC:  head → imageMain → body[text, imageSub]  （横並び）
SP:  head → body[imageSub, text] → imageMain  （全て縦並び）
```

### ポイント
- セクションレベルの `order` と、ラッパー内の `order` は独立して動作する
- ラッパー自体にも `order` を付けることを忘れない（デフォルト0だと意図しない位置になる）
- PC横並び → SP縦並びは `flex-direction: column` の切り替えで実現

---

## パターン4: margin-left: auto による右寄せ配置

`position: absolute` + `right` の代わりに、`margin-left: auto` でブロック要素を右寄せにする。

### SCSS
```scss
/* 画像を右寄せ（右端から222pxの位置） */
.p-example_image {
  width: rem(300);
  margin-left: auto;
  margin-right: rem(222);

  @include mq() {
    width: rem(200);
    margin-left: auto;
    margin-right: rem(20);
  }

  img {
    width: 100%;
  }
}
```

### ポイント
- `margin-left: auto` はブロック要素を右に押しやる
- `margin-right` で右端からの距離を指定
- flexコンテナ内でも同様に使える

---

## パターン5: flex横並びの中でネガティブマージン

横並びの要素群を、上のセクションに食い込ませる。

### HTML
```html
<div class="p-example_bottom">
    <div class="p-example_imageSub2"><!-- 左の画像 --></div>
    <div class="p-example_imageComposite"><!-- 右の画像 --></div>
</div>
```

### SCSS
```scss
.p-example_bottom {
  display: flex;
  align-items: flex-start;
  margin-top: rem(-56);      /* 上のコンテンツに食い込む */

  @include mq() {
    order: 4;
    flex-direction: column;       /* SPでは縦並びに */
    margin-top: rem(56);      /* SPでは食い込まない */
  }
}

.p-example_imageSub2 {
  width: rem(350);
  margin-left: rem(363);
  margin-top: rem(274);       /* flex内で個別にずらす */

  @include mq() {
    order: 2;
    width: rem(231);
    margin-left: rem(73);
    margin-top: rem(77);
  }

  img {
    width: 100%;
  }
}

.p-example_imageComposite {
  width: rem(631);
  margin-left: rem(96);

  @include mq() {
    order: 1;                     /* SPでは先に表示 */
    width: rem(356);
    margin-left: rem(20);
  }

  img {
    width: 100%;
  }
}
```

### ポイント
- `align-items: flex-start` で上揃えにし、個別の `margin-top` で高さをずらす
- 親の `margin-top` をネガティブにして上のセクションと重ねる
- flex内の子要素も `order` + `flex-direction: column` でSP並び替え可能

---

## 実装の考え方まとめ

| やりたいこと | 使うCSS | absoluteの代替 |
|------------|---------|---------------|
| 要素を上方向に重ねる | `margin-top: rem(-XX)` | top + negative値 |
| 要素を右寄せ | `margin-left: auto` + `margin-right` | right + 値 |
| テキストを画像の上に表示 | `position: relative` + `z-index` | z-indexのみ使用 |
| PC/SPで表示順を変える | `flex-direction: column` + `order` | - |
| 横並び要素をSPで縦に | `flex-direction: column`（SPのみ） | - |
| 一部要素をグループで並び替え | ラッパーdiv + 2階層のorder | - |
