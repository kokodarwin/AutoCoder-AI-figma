# 14: FAQアコーディオン

## 概要
`div` + jQuery `slideDown/slideUp` によるスムーズなアコーディオンFAQ。

## 適用場面
- よくある質問
- Q&Aセクション
- 折りたたみコンテンツ

## Figmaでの特徴
- Q. / A. のマーク付きレイアウト
- Q.は青系、A.は赤系が多い
- 右端に＋/×の開閉アイコン（十字が回転）
- 開閉時のアニメーション

---

## 現プロジェクト向け実装

### HTML
```html
<section class="p-faq">
    <p class="p-faq__enTitle">FAQ</p>
    <h2 class="p-faq__heading">よくある質問</h2>
    <div class="p-faq__list">
        <!-- 初期表示で開いておくアイテムに is-open を付与 -->
        <div class="p-faq__item is-open">
            <div class="p-faq__question js-faqToggle">
                <span class="p-faq__qMark">Q.</span>
                <span class="p-faq__qText">質問テキスト</span>
                <span class="p-faq__icon"></span>
            </div>
            <div class="p-faq__answer">
                <div class="p-faq__answerInner">
                    <span class="p-faq__aMark">A.</span>
                    <p class="p-faq__aText">回答テキスト</p>
                </div>
            </div>
        </div>
        <!-- 閉じた状態のアイテム -->
        <div class="p-faq__item">
            <div class="p-faq__question js-faqToggle">
                <span class="p-faq__qMark">Q.</span>
                <span class="p-faq__qText">質問テキスト</span>
                <span class="p-faq__icon"></span>
            </div>
            <div class="p-faq__answer">
                <div class="p-faq__answerInner">
                    <span class="p-faq__aMark">A.</span>
                    <p class="p-faq__aText">回答テキスト</p>
                </div>
            </div>
        </div>
    </div>
</section>
```

### SCSS
```scss
@use "foundation" as *;

// --- コンテナ ---
.p-faq {
  padding-block: rem(80);
  background-color: $blue-bg;
  text-align: center;

  @include mq("md") {
    padding-block: rem(50);
    padding-inline: $padding-sp;
  }
}

// --- リスト ---
.p-faq__list {
  width: rem(1100);
  max-width: 100%;
  margin-inline: auto;
  text-align: left;
}

.p-faq__item {
  background-color: $white;
  border-radius: rem(4);
}

.p-faq__item + .p-faq__item {
  margin-top: rem(22);

  @include mq("md") {
    margin-top: rem(16);
  }
}

// --- 質問行 ---
.p-faq__question {
  display: flex;
  align-items: center;
  gap: rem(16);
  padding-block: rem(30);
  padding-inline: rem(25);
  cursor: pointer;

  @include mq("md") {
    padding-block: rem(20);
    padding-inline: rem(16);
    gap: rem(12);
  }
}

.p-faq__qMark {
  flex-shrink: 0;
  font-family: sans-serif;
  font-size: rem(28);
  font-weight: 500;
  color: $blue;
  line-height: 1;

  @include mq("md") {
    font-size: rem(22);
  }
}

.p-faq__qText {
  flex: 1;
  min-width: 0;
  font-size: rem(18);
  font-weight: $regular;
  color: $text;
  line-height: 1.3;

  @include mq("md") {
    font-size: rem(15);
  }
}

// --- 開閉アイコン（十字 → 回転） ---
.p-faq__icon {
  flex-shrink: 0;
  position: relative;
  width: rem(18);
  height: rem(18);
  margin-left: auto;
}

.p-faq__icon::before,
.p-faq__icon::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  background-color: $blue;
}

.p-faq__icon::before {
  width: rem(18);
  height: rem(2);
  transform: translate(-50%, -50%);
}

.p-faq__icon::after {
  width: rem(2);
  height: rem(18);
  transform: translate(-50%, -50%);
  transition: 0.3s transform;
}

.p-faq__item.is-open .p-faq__icon::after {
  transform: translate(-50%, -50%) rotate(90deg);
}

// --- 回答行（jQueryのslideDown/slideUpで開閉） ---
.p-faq__answer {
  display: none;
  border-top: rem(1) solid $gray-border;
}

.p-faq__answerInner {
  display: flex;
  gap: rem(16);
  padding-top: rem(16);
  padding-bottom: rem(30);
  padding-inline: rem(25);

  @include mq("md") {
    padding-bottom: rem(20);
    padding-inline: rem(16);
    gap: rem(12);
  }
}

.p-faq__aMark {
  flex-shrink: 0;
  font-family: sans-serif;
  font-size: rem(28);
  font-weight: 500;
  color: $red; // Figma: #ff3d3d
  line-height: 1;

  @include mq("md") {
    font-size: rem(22);
  }
}

.p-faq__aText {
  flex: 1;
  min-width: 0;
  padding-top: rem(4);
  font-size: rem(16);
  font-weight: $regular;
  color: $text;
  line-height: 1.8;

  @include mq("md") {
    font-size: rem(14);
  }
}
```

### JS（jQuery）
```javascript
// FAQアコーディオン（ふんわり開閉）
// 初期状態: is-open のアイテムは回答を表示
$('.p-faq__item.is-open').find('.p-faq__answer').show();

$('.js-faqToggle').on('click', function() {
    var $item = $(this).closest('.p-faq__item');
    var $answer = $item.find('.p-faq__answer');

    if ($item.hasClass('is-open')) {
        $answer.slideUp(300);
        $item.removeClass('is-open');
    } else {
        $item.addClass('is-open');
        $answer.slideDown(300);
    }
});
```

### ポイント
- `div` ベース + jQuery `slideDown/slideUp` でスムーズなアニメーション
- `.p-faq__answer` は `display: none` → jQuery が `display: block` でスライドイン
- `.p-faq__answerInner` で flex レイアウトをラップ（slideDown は display:block を設定するため、flex を直接使えない）
- `::before`/`::after` の十字アイコンを `.is-open` 時に `rotate(90deg)` で回転
- Q. は青（`$blue`）、A. は赤（`$red`）が定番

### よくある失敗
- A.の色をQ.と同じ青にしてしまう（Figmaではほぼ必ず異なる色）
- `<details>/<summary>` を使うとCSS/JSアニメーションが効かない（ブラウザが display:none を即座に切り替えるため）
- jQuery slideDown の対象要素に直接 display:flex を指定してしまう（answerInner ラッパーが必要）
- 初期表示で is-open のアイテムの `.p-faq__answer` を `.show()` し忘れる
