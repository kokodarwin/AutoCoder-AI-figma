# 〇〇プロジェクト - コーディングルール

## 📋 基本ルール

### ⚠️ 【超重要】SCSSファイルのインポート記述（必読・厳守）

**新規SCSSファイルを作成する際の絶対ルール：**

- **SCSSファイルの先頭には以下の1行のみを記述する**
  ```scss
  @use "foundation" as *;
  ```

- **❌ 絶対にNG：以下のような複数行のインポートは不要**
  ```scss
  // ❌ これは書かない！
  @use "../../foundation/functions" as *;
  @use "../../foundation/variables" as *;
  @use "../../foundation/mixin" as *;
  ```

- **`style.scss`への追記も不要**
  - `style.scss`は既に`@use "./object/project/**";`でワイルドカードインポート済み
  - 新規ファイルを作成すれば自動的に読み込まれる
  - **絶対に手動で追記しないこと**

**理由：**
- プロジェクトの設定により、`foundation`だけで全ての基礎モジュール（functions、variables、mixin）が読み込まれる
- 複数行書くと重複エラーが発生する
- ワイルドカードが機能しているため、`style.scss`への追記は不要

---

### 1. ネーミング規則
- **FLOCSS記法を基本とする**
  ```scss
  // ブロック
  .p-about { } // OK
  
  // エレメント（__の後もキャメルケース）
  .p-about__itemText { } // OK
  .pAbout__item-text { } // NG（ハイフンは使わない）
  
  // モディファイア（--の後もキャメルケース）  
  .p-about__itemText--isActive { } // OK
  .pAbout__itemText--is-active { } // NG（ハイフンは使わない）
  ```

### 2. SCSS記法
- **入れ子構造を使用しない**
- **メディアクエリは積極的に入れ子で記述**
- **メディアクエリは対象クラス内で個別に`@include mq("md")`等を記述し、ファイル末尾にまとめない**
  ```scss
  .p-pageTop {
    position: fixed;
    right: rem(30);
    bottom: rem(30);
    z-index: 50;
    cursor: pointer;

    @include mq("md") {
      right: rem(25);
      bottom: rem(20);
    }
  }

  .p-pageTop__wrap {
    position: relative;
  }

  .p-pageTop__wrap img {
    width: rem(50);
  }
  ```

### 3. 単位指定
- **rem()関数を必ず使用**
- **デザインカンプのpx値をrem()に入れる**
  ```scss
  font-size: rem(16); // デザインカンプで16pxの場合
  margin: rem(20) rem(0) rem(10) rem(0); // デザインカンプで20px 0 10px 0の場合
  ```

#### ⚠️ 【重要】letter-spacingはem単位で記述（rem()関数は使用禁止）

**letter-spacingは唯一の例外で、必ず`em`単位で記述してください。**

**計算方法:**
```
letter-spacing(px) ÷ font-size(px) = em値
```

**計算例:**

| font-size | letter-spacing (Figma) | 計算 | SCSS記述 |
|-----------|------------------------|------|----------|
| 24px | 2.4px | 2.4 ÷ 24 = 0.1 | `letter-spacing: 0.1em;` |
| 16px | 2px | 2 ÷ 16 = 0.125 | `letter-spacing: 0.125em;` |
| 50px | 4px | 4 ÷ 50 = 0.08 | `letter-spacing: 0.08em;` |
| 32px | 3.2px | 3.2 ÷ 32 = 0.1 | `letter-spacing: 0.1em;` |

**コード例:**
```scss
// ✅ OK
.p-hero__title {
  font-size: rem(48);
  letter-spacing: 0.1em;  // Figmaで4.8pxの場合: 4.8 ÷ 48 = 0.1
}

// ❌ NG
.p-hero__title {
  font-size: rem(48);
  letter-spacing: rem(4.8);  // rem()関数は使用禁止
  letter-spacing: 4.8px;     // px単位も禁止
}
```

**理由:** `em`単位はフォントサイズに対する相対値なので、フォントサイズが変わっても文字間隔の比率が維持されます。

### 4. パディング・マージンの方向統一
- **パディングは上方向と右方向に統一**
  ```scss
  // OK
  padding-top: rem(20);
  padding-right: rem(15);
  
  // NG
  padding-bottom: rem(20); // 下方向は使わない
  padding-left: rem(15);   // 左方向は使わない
  ```

- **パディングは上下方向と左右方向は以下の書き方**
```scss
// OK
padding-block: rem(50);
padding-inline: rem(25);

// NG
padding: rem(80) rem(0) rem(80) rem(0);
padding: rem(0) rem(25) rem(0) rem(25);
```

### 5. パディング・マージンの書き方

```scss
// OK
margin-inline: auto;

// NG
margin: 0 auto;
```
- **ベースリセットで処理済みのため、個別コンポーネントでは`margin: 0;`や`padding: 0;`などのゼロ指定は極力書かない**

### 6. display:flexの使い方

#### 縦方向の余白
PCのコーディング時に縦方向の余白をつけるためにdisplay: flex;とflex-direction: column;を使わない。
余白をつけるときは下の要素のmargin-topを使う。

**ただし、セクションタイトル（heading）だけは `margin-bottom` を使用する。**
タイトルはそれ自体が余白の起点であるため、タイトル要素に `margin-bottom` をつける。

```scss
// OK: 一般要素 → 下の要素にmargin-top
.p-aboutIntro__below {
  margin-top: rem(40);

  @include mq("md") {
    margin-top: rem(30);
  }
}

// OK: タイトル → タイトル自体にmargin-bottom
.p-about__heading {
  text-align: center;
  margin-bottom: rem(50);
}

// NG: 一般要素にmargin-bottom
.p-aboutIntro__above {
  margin-bottom: rem(40); // ❌ タイトル以外はmargin-topを使う
}

// NG: flex-direction: column + gapで縦余白
.p-aboutIntro__above {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: rem(40); // ❌

  @include mq("md") {
    gap: rem(30);
  }
}
```

#### 横方向の余白（横並びflex）
横並び（`flex-direction: row`）のアイテム間の余白には `gap` を使用する。
`margin-left` や `margin-right` で間隔を空けない。
※ `margin-left: auto`（右寄せ）や `margin-right: auto`（左寄せ）による配置は別用途なのでOK。

```scss
// OK: 横並びはgapで余白
.p-price__cards {
  display: flex;
  gap: rem(55);
}

// NG: 横並びでmarginで余白
.p-price__card + .p-price__card {
  margin-left: rem(55); // ❌ gapを使う
}

// OK: auto配置は別用途
.p-knowhow__cardButton {
  margin-left: auto; // ✅ 右寄せ配置
}

.p-example__element {
  margin-right: auto; // ✅ 左寄せ配置
}
```


### 7. HTMLの構造
pタグが単体の場合はdivで囲わない

```html
<!-- OK -->
<p class="p-topAbout__text">
  texttext
</p>

<!-- NG -->
<div class="p-topAbout__textLabel">
  <p class="p-topAbout__textLabelText">
    texttext
  </p>
</div>
```

但し、以下の場合はdivで囲って良い  
pタグが単体じゃない。またはpタグでも別のclassがついている。

```html
<div class="p-flow__stepContent">
  <h3 class="p-flow__stepTitle">タイトル</h3>
  <p class="p-flow__stepDescription">
    テキストテキストテキストテキスト
  </p>
</div>

<div class="p-flow__stepNumber">
  <p class="p-flow__stepText">STEP</p>
  <p class="p-flow__stepDigit">02</p>
</div>
```

### 8. Googleフォントの読み込み
- Figma MCPで使用フォントが特定できたら、`<head>`内に該当するGoogle Fontsの読み込みタグを必ず追記する
- 追加したフォントは`_variables.scss`に変数として登録し、各コンポーネントはその変数を参照する

### 9. 形状・画像指定に関するルール
- 正円は`border-radius: 100%`で指定する（`9999px`などの値は使用しない）
- `object-fit: contain`は使用禁止。必要な場合は事前に相談する

### 10. ビルド・コンパイルについて
- **コーディング完了後の手動コンパイル（`npm run build`等）は不要**
- 開発環境ではGulpのwatchモードが常時動作しているため、ファイル保存時に自動的にコンパイルされる
- AIはコーディング完了後にビルドコマンドを実行しないこと

### 11. 複合背景の画像取得ルール

#### 基本方針
Figmaで複数レイヤー（マスク/ブレンド/グラデーション）が組み合わされた背景は、**個別レイヤーではなくグループ単位で1枚の画像として書き出す**のが原則。

#### 判断基準

| パターン | 対応 | 理由 |
|---------|------|------|
| 3層以上のマスク/ブレンドを含むグループ | **1枚画像として書き出し** | CSS再現が困難、トークン消費大 |
| 単純なグラデーション + 単色背景 | CSSで実装 | CSSで十分再現可能 |
| 写真1枚 + オーバーレイ1層 | CSSで実装 | `background` + 疑似要素で対応可能 |
| テクスチャ + マスク + 写真 + グラデーション | **1枚画像として書き出し** | FVの背景など |

#### 1枚画像として書き出す方法

**テキストを含まない背景グループのノードIDを特定し、Figma APIでレンダリングする。**

```bash
# 背景グループのノードIDで1枚画像として書き出し（2倍解像度）
GET /v1/images/{fileKey}?ids={背景グループのnodeId}&format=png&scale=2
```

**注意:** テキスト要素を含むノードをレンダリングするとテキストもラスタライズされるため、背景のみのグループを選ぶこと。

#### ユーザーによる個別指示

ユーザーは以下の形式で背景の取得方法を明示的に指定できる：

```
この背景はnode-id=xxx で1枚画像として取得して
```

```
FVの背景レイヤー（テキスト除く）を1枚の画像にまとめて取得して
```

ユーザーから指定がない場合は、上記の判断基準に従ってAIが自動判断する。

#### CSS実装（1枚画像を使う場合）

```scss
.p-sectionFv {
  position: relative;
  background-image: url("../img/top/fv-bg.png");
  background-size: cover;
  background-position: center;
}
```

これにより `mask-image` や `mix-blend-mode` の組み合わせが不要になり、ブラウザ互換性も向上する。

#### PNGグループのサイズ検証

ダウンロード後にReadツールで画像を確認し、**サイズが親フレームの期待値と異なる場合**（子要素のはみ出し等）は、ユーザーにFigmaからの手動書き出しを依頼する。Figma REST APIはノード単体のバウンディングボックスで書き出すため、親フレームのクリップが反映されない。





## 🎨 変数管理ルール

### 変数定義の原則（コーディング開始前）
**⚠️ コンポーネント実装前に必ず実施すること**

1. **Figmaからの変数抽出**
   - コーディングを始める前に、必ずFigmaのVariable/Stylesを確認する
   - 確認した色・フォント情報を `_variables.scss` にすべて定義する
   - **推測で変数を定義しない**（必ずFigmaの定義名や値を正解とする）

2. **未知のスタイルへの対処**
   - 実装中に `_variables.scss` にない新しい色やフォントサイズが出てきた場合：
     - ① まずFigmaを確認する（見落としがないか）
     - ② 本当に新しいスタイルなら、まず `_variables.scss` に変数を追加する
     - ③ その後でコンポーネントで使用する
   - **その場で直接HEXコードなどを書かないこと**

### 色指定
**_variables.scssに定義されている色変数を必ず使用すること**
- カラーコードを直接記述せず、必ず変数で指定する
- 例: `color: #000000;` ❌ → `color: $black;` ✅



### フォント設定
**_variables.scssに定義されているフォント変数を必ず使用すること**
- フォントファミリーを直接記述せず、必ず変数で指定する
- 例: `font-family: "游ゴシック", sans-serif;` ❌ → `font-family: $base-font-family;` ✅






### レスポンシブ対応
```scss
// メディアクエリを入れ子で使用
@include mq("md") {
  // タブレット・スマホ対応
}
@include mq("sm") {
  // スマホ対応
}
```

### レスポンシブはみ出し防止ルール

#### 1. Flexアイテムの縮小許可
Flexコンテナの子要素が画面幅に応じて縮小されるように設定する。

```scss
.p-example__item {
  flex-shrink: 1;  // 縮小を許可
  min-width: 0;    // flex子要素の最小幅制限を解除
}
```

**理由**: `min-width: auto`（デフォルト）だとコンテンツ幅より小さくならず、はみ出しの原因になる

#### 2. 固定幅と柔軟性の両立
固定幅を指定する場合は、必ず`max-width: 100%`をセットで指定する。

```scss
// OK
.p-example__card {
  width: rem(500);     // 理想の幅
  max-width: 100%;     // 親要素を超えない
}

// NG
.p-example__card {
  width: rem(500);     // これだけだと親を超えてはみ出す可能性
}
```

#### 3. Figma座標→CSS変換ルール（position: absolute を使う場合）

Figma MCPが返す座標（px値）は**デザインカンプの固定幅（例: 1920px）基準の絶対値**である。
これをそのまま `rem()` 固定値に変換すると、異なる画面幅で位置がずれる。

```scss
// ❌ NG: Figmaの座標をそのまま使用
.p-example__title {
  position: absolute;
  right: rem(181);   // 1920px基準の固定値 → 画面幅が変わるとずれる
  top: rem(619);     // 1080px基準の固定値
}

// ✅ OK: 親要素に対する割合に変換
.p-example__title {
  position: absolute;
  right: 9.43%;      // 181 / 1920 = 9.43%
  top: 57.3%;        // 619 / 1080 = 57.3%
}
```

**変換ルール:**

| Figma値 | 変換先 | 計算式 |
|---------|--------|--------|
| 水平位置（left, right） | `%` | Figma値 ÷ 親要素の幅 × 100 |
| 垂直位置（top, bottom） | `%` | Figma値 ÷ 親要素の高さ × 100 |
| ナビゲーション等の配置 | flexbox + `margin-left: auto` | absoluteを避ける |
| gap・余白 | `clamp()` | `clamp(最小rem, vw値, 最大rem)` |

**ナビゲーションの配置は `position: absolute` ではなく flexbox を使う:**

```scss
// ❌ NG: absoluteでナビを固定位置に配置
.l-header__nav {
  position: absolute;
  left: rem(852);  // 画面幅が変わると位置が破綻
}

// ✅ OK: flexboxで配置
.l-header {
  display: flex;
  align-items: center;
}

.l-header__nav {
  margin-left: auto;  // 右寄せ
  display: flex;
  gap: clamp(#{rem(8)}, 1.5vw, #{rem(30)});  // 画面幅に応じて縮小
}
```

#### 4. 装飾要素（アシライ）の非表示タイミング
大きな装飾画像や擬似要素は、コンテンツと重なる前に非表示にする。

```scss
.p-example__decoration {
  position: absolute;
  // ... 装飾のスタイル

  @include mq("xl") {  // lgより早めに非表示
    display: none;
  }
}
```

**基準**:
| 状況 | 非表示タイミング |
|------|-----------------|
| コンテンツに重なる可能性がある | `xl`で非表示 |
| レイアウトが崩れる | `lg`で非表示 |
| スマホで不要 | `md`で非表示 |

#### 5. セクション背景のmax-width
背景色・背景画像を持つ要素は、Figmaのセクション幅を`max-width`に設定し、中央配置する。

```scss
.p-section__bg {
  max-width: rem(1760);  // Figmaのセクション幅を指定
  margin-inline: auto;   // 中央配置
  background-color: $bg-color;
  // ...
}
```

**判断基準**:
- Figma MCPの`get_design_context`で取得したセクションの`width`値を使用
- デザインカンプ全体の幅（1920px等）ではなく、そのセクション要素の実際の幅を指定
- これにより大画面（2560px等）でも背景が広がりすぎない

#### 6. スマホでの中央寄せ
PCで左寄せだった要素がスマホで縦並びになる場合、中央寄せにする。

```scss
.p-section__left {
  @include mq("md") {
    width: fit-content;    // 内容に合わせた幅
    margin-inline: auto;   // 中央配置
  }
}
```

**適用条件**:
- テキストブロックが単独で存在する
- PCで横並びだったものがスマホで縦並びになる
- Figmaのスマホデザインで中央配置されている

#### 7. グリッドの最終行（奇数枚）の中央寄せ
2カラムのグリッドで要素数が奇数になる場合、最後の1枚が左寄りになりやすい。  
スマホ時は最終行を全幅にして中央配置する。

```scss
.p-example__item:last-child {
  @include mq("md") {
    grid-column: 1 / -1; // 最終行を1行全体に広げて中央寄せ
  }
}
```

**適用条件**:
- `grid-template-columns` が2カラムになる
- 要素数が奇数
- Figmaで最終行が中央配置

---

## 📝 HTMLセマンティックタグルール（SEO対応）

### 1. セマンティックHTML5タグの使用
- **適切なセマンティックタグを使用する**

```html
<!-- OK: セマンティックタグを使用 -->
<header class="l-header">
  <nav class="p-nav">
    <ul class="p-nav__list">
      <li class="p-nav__item">
        <a href="#" class="p-nav__link">ホーム</a>
      </li>
    </ul>
  </nav>
</header>

<main class="l-main">
  <article class="p-article">
    <section class="p-article__section">
      <h2 class="c-headline1">セクションタイトル</h2>
      <p class="p-article__text">コンテンツ</p>
    </section>
  </article>
</main>

<aside class="p-sidebar">
  <section class="p-sidebar__section">
    <h3 class="p-sidebar__title">関連記事</h3>
  </section>
</aside>

<footer class="l-footer">
  <p class="l-footer__copyright">&copy; 2024 Company</p>
</footer>

<!-- NG: divのみを使用 -->
<div class="l-header">
  <div class="p-nav">
    <div class="p-nav__list">
      <div class="p-nav__item">
        <a href="#" class="p-nav__link">ホーム</a>
      </div>
    </div>
  </div>
</div>
```

### 2. 見出しタグの階層ルール
- **見出しは必ず階層順に使用する（h1→h2→h3）**
- **h1は1ページに1つのみ**

```html
<!-- OK: 階層順に使用 -->
<h1 class="p-page__title">ページタイトル</h1>
<section>
  <h2 class="c-headline1">セクション1</h2>
  <h3 class="p-section__subtitle">サブセクション1-1</h3>
  <h3 class="p-section__subtitle">サブセクション1-2</h3>
</section>
<section>
  <h2 class="c-headline1">セクション2</h2>
</section>

<!-- NG: 階層を飛ばす -->
<h1 class="p-page__title">ページタイトル</h1>
<h3 class="p-section__subtitle">いきなりh3</h3> <!-- h2を飛ばしている -->
```

### 3. リストタグの適切な使用
- **ナビゲーション、項目リストは必ずul/ol/liタグを使用**

```html
<!-- OK: リストにはulタグ -->
<nav class="p-nav">
  <ul class="p-nav__list">
    <li class="p-nav__item">
      <a href="#" class="p-nav__link">ホーム</a>
    </li>
    <li class="p-nav__item">
      <a href="#" class="p-nav__link">サービス</a>
    </li>
  </ul>
</nav>

<!-- NG: divで代用 -->
<nav class="p-nav">
  <div class="p-nav__list">
    <div class="p-nav__item">
      <a href="#" class="p-nav__link">ホーム</a>
    </div>
  </div>
</nav>
```

### 4. 画像のalt属性ルール
- **すべての画像に適切なalt属性を設定**
- **装飾的な画像はalt=""**

```html
<!-- OK: 意味のある画像 -->
<img src="sample.jpg" alt="弊社の外観写真" class="p-company__image">

<!-- OK: 装飾的な画像 -->
<img src="decoration.svg" alt="" class="p-section__decoration">

<!-- NG: alt属性なし -->
<img src="sample.jpg" class="p-company__image">
```

### 5. フォームのアクセシビリティ
- **すべての入力項目にlabel要素を関連付け**

```html
<!-- OK: labelとinputを関連付け -->
<div class="p-form__item">
  <label for="name" class="p-form__label">お名前</label>
  <input type="text" id="name" name="name" class="p-form__input" required>
</div>

<!-- NG: labelなし -->
<div class="p-form__item">
  <input type="text" name="name" class="p-form__input" placeholder="お名前" required>
</div>
```


### 13. design-context.md は仕様書である

> **design-context.md に記録された全ての値を、コーディング後にSCSSと1:1で突合し、未実装の値がゼロであることを確認する。**

design-context.md は「参考資料」ではなく「仕様書」である。記録された値は解釈・簡略化せず、忠実に転写する。
1つのCSSプロパティで再現できない値（色の分割、複合ボーダー等）は、計画段階（工程3）で代替技法を決定してからコーディングに入る。

---

## 🔍 デザイン再現性チェック（Figmaとの差異を防ぐ）

### 【重要】実装前の確認手順

Figmaデザインを実装する前に、以下の手順で詳細を確認すること：

1. **`get_screenshot` で視覚的に確認**
   - MCPからコード情報を取得する前に、必ずスクリーンショットを取得
   - 全体のレイアウトと細部のスタイルを目視で把握

2. **テキストスタイリングを個別にチェック**
   - 文中の **太字** 箇所を特定
   - 文中の **色違い** 箇所を特定（オレンジ、青など）
   - 同じ行内でも複数のスタイルが混在している可能性を考慮

### よくある見逃しパターン

| 見逃しパターン | 原因 | 対策 |
|--------------|------|------|
| テキストの一部だけ太字 | MCPのコード情報にスタイル詳細が含まれない | スクリーンショットで確認 |
| テキストの一部だけ色違い | 「強調=オレンジ」と一般化してしまう | 個別に色を確認 |
| 複数スタイルの組み合わせ | `<span>`を1つしか付けない | 各スタイルに対応した`<span>`を入れ子にする |

### 実装時のチェックリスト

- [ ] スクリーンショットを取得したか
- [ ] テキスト内の **太字箇所** を特定したか
- [ ] テキスト内の **色違い箇所** を特定したか
- [ ] 各スタイルに対応した `<span>` クラスを作成したか
- [ ] 実装後にブラウザでスクリーンショットと比較したか

### コード例

```html
<!-- ❌ NG: スタイルの一部しか適用されていない -->
<p>同じ耐震等級3でも<span class="p-quality__textAccent">reco.</span>は最高レベルです。</p>

<!-- ✅ OK: 太字と色を個別に指定 -->
<p>同じ耐震等級3でも<span class="p-quality__textAccent">reco.</span>は<span class="p-quality__textBold">最高レベル</span>です。</p>
```

```scss
// 色のみ（オレンジ + 太字）
.p-quality__textAccent {
  color: #f27d27;
  font-weight: 700;
}

// 太字のみ（黒 + 太字）
.p-quality__textBold {
  font-weight: 700;
  color: $text;
}
```

### 抽象的なルール

> **「MCPのコード情報はあくまで構造の参考であり、スタイリングの詳細は必ずスクリーンショットで確認すること」**

MCPから取得したコードはReact+Tailwindの概要であり、以下の情報が省略されることがある：
- 文中の部分的なスタイル変化（太字、色）
- 行間・文字間隔の微調整
- ホバー状態や遷移アニメーション

そのため、**スクリーンショットとの視覚的比較**を実装の最終チェックとして必ず行うこと。


---

## 📜 JavaScript記述ルール

### 12. JSはHTMLにインラインで書かない

**JavaScriptは必ず `src/js/script.js` に記述すること。HTMLファイル内に `<script>` タグで直接JSを書かない。**

```html
<!-- ❌ NG: HTMLにインラインで記述 -->
<script>
    var swiper = new Swiper(".js-slider", { ... });
</script>

<!-- ✅ OK: 外部ファイルを参照 -->
<script src="./js/script.js"></script>
```

**理由:**
- JSが複数のHTMLファイルに散らばると管理・修正が困難になる
- `script.js` に集約することで、Gulpのビルドパイプライン（minify・concat等）の対象になる
- 機能の追加・削除時に `script.js` だけ確認すれば良い

**補足:**
- CDN（Swiper、GSAP等）の読み込みタグは `<script src="https://...">` でHTMLに記述してOK
- あくまで「自分で書くJS」を外部ファイルに書くというルール

---

