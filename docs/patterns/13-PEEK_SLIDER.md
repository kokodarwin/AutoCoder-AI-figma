# 13: ピークスライダー（片側ビューポート貼り付き Swiper）

## 概要
スライダーがインナー幅を超えて、片側（左または右）だけビューポート端まで広がるパターン。`overflow: visible` + `clip-path` の組み合わせで、スライド要素がインナー外にはみ出して見える「ピーク」効果を実現する。

## 適用場面
- 画像スライダーが画面端まで広がるデザイン
- テキスト＋スライダーの横並びレイアウトで、スライダー側だけ画面端に貼り付く
- 左右交互にスライダーが配置されるセクション

## Figmaでの特徴
- スライダー画像がインナー幅の外側（画面端）まで伸びている
- 反対側にテキストブロックが配置されている
- スライダーのナビゲーション（矢印＋ドット）がスライダー下部に配置
- PCでは横並び、SPでは縦積みになる

---

## 現プロジェクト向け実装

### 核心テクニック: clip-path によるピーク

スライダーの `overflow: visible` で要素をはみ出させ、`clip-path: inset()` で不要な方向だけ切り取る。

```scss
// 右方向にピーク（LTR: スライドが右に飛び出す）
.swiper {
  overflow: visible;
  clip-path: inset(0% -50vw 0% 0%);
  //                ↑ 右方向に50vw分見せる
}

// 左方向にピーク（RTL: スライドが左に飛び出す）
.swiper {
  overflow: visible;
  clip-path: inset(0% 0% 0% -50vw);
  //                      ↑ 左方向に50vw分見せる
}
```

### HTML構造

```html
<!-- 左にピーク（RTL） -->
<div class="p-section__slider" data-peek-slider>
  <div class="swiper" dir="rtl">
    <div class="swiper-wrapper">
      <div class="swiper-slide"><img src="slide1.png" alt=""></div>
      <div class="swiper-slide"><img src="slide2.png" alt=""></div>
    </div>
  </div>
  <div class="p-section__sliderNav">
    <button class="p-section__sliderPrev" type="button" data-peek-prev>
      <img src="slider_btn.svg" alt="前へ">
    </button>
    <div class="p-section__sliderPagination" data-peek-pagination></div>
    <button class="p-section__sliderNext" type="button" data-peek-next>
      <img src="slider_btn.svg" alt="次へ">
    </button>
  </div>
</div>

<!-- 右にピーク（LTR: dir属性なし） -->
<div class="p-section__slider" data-peek-slider>
  <div class="swiper">
    <div class="swiper-wrapper">
      <div class="swiper-slide"><img src="slide1.png" alt=""></div>
      <div class="swiper-slide"><img src="slide2.png" alt=""></div>
    </div>
  </div>
  <!-- ナビは同じ構造 -->
</div>
```

### SCSS: スライダー本体

```scss
@use "foundation" as *;

// 親コンテナ（テキスト + スライダー横並び）
.p-section__body {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  max-width: rem(1000);  // インナー幅
  margin-inline: auto;

  @include mq("md") {
    flex-direction: column;
  }
}

// スライダーラッパー
.p-section__slider {
  flex-shrink: 0;
  width: rem(550);  // Figma上のスライダー幅

  @include mq("md") {
    width: rem(300);
    margin-inline: auto;
    overflow: visible;
  }

  // 左ピーク（RTL）の場合
  .swiper {
    overflow: visible;
    clip-path: inset(0% 0% 0% -50vw);
  }

  // 右ピーク（LTR）の場合は:
  // clip-path: inset(0% -50vw 0% 0%);

  .swiper-slide {
    width: rem(550);

    @include mq("md") {
      width: 100%;
    }

    img {
      width: 100%;
      display: block;
    }
  }
}

// テキスト側
.p-section__info {
  width: rem(380);

  @include mq("md") {
    width: 100%;
    margin-top: rem(50);
  }
}
```

### SCSS: スライダーナビゲーション（共通モジュール）

```scss
@use "foundation" as *;

// ナビゲーション全体
.p-section__sliderNav {
  display: flex;
  align-items: center;
  justify-content: center;
  width: rem(206);
  margin-top: rem(34);
  margin-inline: auto;
  gap: rem(16);

  @include mq("md") {
    width: rem(206);
    margin-top: rem(31);
    gap: 0;
  }
}

// 前へ / 次へボタン
.p-section__sliderPrev,
.p-section__sliderNext {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  line-height: 0;

  img {
    width: rem(8);
    height: auto;
    filter: brightness(0);  // デフォルト: 黒矢印

    @include mq("md") {
      width: rem(8);
    }
  }
}

.p-section__sliderNext {
  transform: rotate(180deg);
}

// ページネーション（ドット）
.p-section__sliderPagination {
  position: static;
  width: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: rem(16);

  @include mq("md") {
    gap: rem(15);
  }

  .swiper-pagination-bullet {
    width: rem(4);
    height: rem(4);
    background: $color-black;
    border-radius: 50%;
    opacity: 1;
    transition: all 0.3s;

    @include mq("md") {
      width: rem(4);
      height: rem(4);
    }
  }

  .swiper-pagination-bullet-active {
    width: rem(10);
    height: rem(10);
    background: $color-accent;  // Figmaのアクセントカラーに合わせる

    @include mq("md") {
      width: rem(10);
      height: rem(10);
    }
  }
}

// ダーク背景バリアント（白矢印・白ドット）
// 親セクションが暗い背景の場合に使用
.p-section--dark {
  .p-section__sliderPrev img,
  .p-section__sliderNext img {
    filter: none;  // 白SVGをそのまま表示
  }

  .p-section__sliderPagination .swiper-pagination-bullet {
    background: $color-white;
  }
}
```

### JavaScript: Swiper初期化

```js
// data属性ベースの汎用ピークスライダー初期化
// [data-peek-slider] を持つ全コンテナに対して自動初期化
(function () {
  document.querySelectorAll("[data-peek-slider]").forEach(function (container) {
    var swiperEl = container.querySelector(".swiper");
    if (!swiperEl) return;

    // RTL判定（dir="rtl" の場合、prev/next の方向が逆になる）
    var isRtl = swiperEl.getAttribute("dir") === "rtl";
    var paginationEl = container.querySelector("[data-peek-pagination]");
    var prevBtn = container.querySelector("[data-peek-prev]");
    var nextBtn = container.querySelector("[data-peek-next]");

    var swiper = new Swiper(swiperEl, {
      loop: false,
      effect: "slide",
      speed: 1000,
      spaceBetween: 20,
      allowTouchMove: true,
      breakpoints: {
        751: {
          slidesPerView: "auto",
          spaceBetween: 50,
        },
      },
      pagination: paginationEl
        ? {
            el: paginationEl,
            clickable: true,
            renderBullet: function (index, className) {
              return '<span class="' + className + '"></span>';
            },
          }
        : false,
    });

    // RTLの場合、prev/nextの方向を反転
    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        isRtl ? swiper.slideNext() : swiper.slidePrev();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        isRtl ? swiper.slidePrev() : swiper.slideNext();
      });
    }
  });
})();
```

---

## 参考: 過去プロジェクトでの実装

### Project Gamma（元コード）
- `@use "global" as g` / `g.pcVw()` / `g.spVw()` / `@include g.mq()` 記法
- `data-peek-slider` / `data-peek-prev` / `data-peek-next` / `data-peek-pagination` のdata属性フック
- 左ピーク（RTL）: `.swiper` に `dir="rtl"` を付与 → `clip-path: inset(0% 0% 0% -50vw)`
- 右ピーク（LTR）: `dir` 属性なし → `clip-path: inset(0% -50vw 0% 0%)` + `margin-left: auto`
- ナビゲーションは `m-sliderNav` として共通モジュール化（`--dark` / `--sp-only` バリアント付き）
- JSは `[data-peek-slider]` をquerySelectorAllで取得し、RTL判定でprev/next方向を自動反転
- PC: `slidesPerView: "auto"` + `spaceBetween: 50`、SP: `spaceBetween: 20`
- 親セクションに `overflow: hidden` を付けてはみ出しの背景スクロールバーを防止

---

## 実装時の注意

- **`.swiper-wrapper` と同じ要素に `justify-content` / `flex-wrap` / `gap` を指定しない**。SwiperはwrapperのCSS `transform` でスライドを移動する。独自のflexレイアウト指定がtransform計算と競合し、スライドが動かなくなる。PC用レイアウトを指定した場合は、Swiper有効時（SP等）に `initial` でリセットすること
- **`overflow: hidden` は親セクションに付ける**。スライダー自身は `overflow: visible` でなければピーク効果が出ない
- **`clip-path` の方向を間違えない**: `inset(top right bottom left)` の順。負の値を入れた方向にはみ出しが見える
  - 右ピーク: `inset(0% -50vw 0% 0%)` — rightを `-50vw` にする
  - 左ピーク: `inset(0% 0% 0% -50vw)` — leftを `-50vw` にする
- **RTLの場合、Swiperの prev/next が逆転する**。JSで `dir="rtl"` を検知して `slideNext()` / `slidePrev()` を入れ替える
- **SPでは `overflow: visible` をスライダーラッパーにも付ける**（SPでもピークさせる場合）
- **`slidesPerView: "auto"` と `swiper-slide` の明示的な `width` をセットで使う**。`width` を指定しないとスライドが潰れる
- **ナビゲーションのページネーションは `position: static` にリセットする**。Swiperデフォルトは `position: absolute` なのでレイアウトが崩れる
- **ダーク背景の場合、矢印SVGの `filter` を切り替える**。白SVGなら `filter: none`、黒SVGに変換するなら `filter: brightness(0)`
- **スライダーとテキストの左右配置が逆の場合**: `flex-direction: row-reverse` ではなく、HTML上の順序を変え、スライダー側に `margin-left: auto`（右寄せ）を付ける方がシンプル
