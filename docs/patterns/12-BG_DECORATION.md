# 12: 背景装飾（波・半円・三角）

## 概要
セクションの上下に波形・半円・三角などの装飾的な背景画像を擬似要素で配置するパターン。
画面幅が変化しても装飾の形状と位置がデザインカンプ通りに保たれるよう、`clamp()` + `aspect-ratio` で制御する。

## 適用場面
- セクション境界に波形（naminami）の装飾がある
- セクション上部/下部に半円・三角・曲線の背景画像がある
- 装飾画像がセクション外にはみ出す（negative position）

## Figmaでの特徴
- セクションの上端・下端に装飾レイヤーが配置されている
- 装飾画像がセクション境界をまたいでいる
- PC用とSP用で別の装飾画像が用意されていることが多い

---

## 構造

```
┌─────────────────────────────┐
│  ::before（上部装飾）         │ ← aspect-ratio で形状維持
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│                             │
│  padding-top: clamp(...)    │ ← 装飾分のスペース確保
│                             │
│  ┌───────────────────────┐  │
│  │    コンテンツ領域       │  │
│  └───────────────────────┘  │
│                             │
│  padding-bottom: clamp(...) │ ← 装飾分のスペース確保
│                             │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│  ::after（下部装飾）         │ ← aspect-ratio で形状維持
└─────────────────────────────┘
```

---

## HTML

```html
<section class="p-section">
    <div class="p-section__inner l-inner">
        <!-- コンテンツ -->
    </div>
</section>
```

装飾は擬似要素で実装するため、HTML に装飾用の要素は不要。

---

## SCSS

### 基本パターン

```scss
@use "foundation" as *;

.p-section {
  position: relative;
  z-index: 1;
  background-color: #f8f4f4;

  // ① padding で装飾分のスペースを確保（clamp で可変）
  padding-top: clamp(/* 後述の計算式で算出 */);
  padding-bottom: clamp(/* 後述の計算式で算出 */);

  @include mq("md") {
    padding-top: rem(120);    // SP は固定値
    padding-bottom: rem(60);
  }

  // ② 上部装飾（擬似要素）
  &::before {
    position: absolute;
    content: '';
    top: rem(-5);        // 微調整用の negative offset
    left: 0;
    right: 0;
    width: 100%;
    height: auto;                        // ← 必須: aspect-ratio に任せる
    aspect-ratio: 1920 / 165;            // ← PC装飾画像の元サイズ比率
    background: url(../img/deco-top.png) center center / contain no-repeat;
    z-index: -1;

    @include mq("md") {
      background: url(../img/deco-top-sp.png) center center / contain no-repeat;
      aspect-ratio: 375 / 122;           // SP装飾画像の比率
    }
  }

  // ③ 下部装飾（擬似要素）
  &::after {
    position: absolute;
    content: '';
    left: 0;
    right: 0;
    bottom: rem(-8);     // 微調整用の negative offset
    width: 100%;
    height: auto;
    aspect-ratio: 1920 / 165;
    background: url(../img/deco-bottom.png) center center / contain no-repeat;
    z-index: -1;

    @include mq("md") {
      display: none;     // SPで不要な場合
    }
  }
}
```

---

## 核心技術: clamp() による位置・余白の自動調整

### なぜ clamp が必要か

装飾画像は `aspect-ratio` で形状を維持するが、画面幅が変わると装飾画像の高さも変わる。
そのため、コンテンツとの間の余白（padding）も画面幅に連動して変化させないと、装飾とコンテンツが重なったり離れたりする。

```
1920px 幅: 装飾画像の高さ = 大  → padding-top も大きく必要
 768px 幅: 装飾画像の高さ = 小  → padding-top は小さくてよい
```

### clamp() の計算方法

2つのビューポート幅での必要な値がわかれば、自動的に clamp を算出できる。

**入力値:**
| パラメータ | 説明 | 例 |
|-----------|------|-----|
| `vw_min` | 小さい方のビューポート幅（px） | 769 |
| `val_at_min` | `vw_min` 時の必要な値（px） | 130 |
| `vw_max` | 大きい方のビューポート幅（px） | 2560 |
| `val_at_max` | `vw_max` 時の必要な値（px） | 300 |

**計算式:**
```
slope     = (val_at_max - val_at_min) / (vw_max - vw_min)
intercept = val_at_min - slope × vw_min
slope_vw  = slope × 100           （vw 単位に変換）
intercept_rem = intercept / 16    （rem 単位に変換）

min_val_rem = min(val_at_min, val_at_max) / 16
max_val_rem = max(val_at_min, val_at_max) / 16
```

**出力:**
```scss
clamp(min_val_rem, intercept_rem + slope_vw × 1vw, max_val_rem)
```

**計算例:**
```
vw_min = 769,  val_at_min = 130
vw_max = 2560, val_at_max = 300

slope     = (300 - 130) / (2560 - 769) = 170 / 1791 ≈ 0.09492
intercept = 130 - 0.09492 × 769 ≈ 56.99
slope_vw  = 0.09492 × 100 ≈ 9.492
intercept_rem = 56.99 / 16 ≈ 3.562

→ clamp(8.125rem, 3.562rem + 9.492vw, 18.75rem)
```

---

## AI 自動化手順

AI がコーディングする際、以下の手順で clamp 値を自動算出する。

### Step 1: Figma から基準値を取得

Figma MCP (`get_design_context`) で以下を取得:
- **装飾画像の元サイズ**（width × height）→ `aspect-ratio` に使用
- **PC デザイン幅**（通常 1440px か 1920px）での装飾画像の高さ
- **PC デザイン幅**でのセクション padding-top / padding-bottom
- **SP デザイン幅**（通常 375px）での同値

### Step 2: 2つのビューポートでの必要値を決定

装飾画像の高さは `aspect-ratio` により画面幅に比例する。

```
画像の高さ = 画面幅 / aspect-ratio の幅側 × aspect-ratio の高さ側
```

例: `aspect-ratio: 1920 / 165` の場合
- 769px 幅時の画像高さ = 769 / 1920 × 165 ≈ 66px
- 2560px 幅時の画像高さ = 2560 / 1920 × 165 ≈ 220px

Figma の PC デザイン幅での padding から、装飾画像の高さを考慮して各ビューポートでの必要 padding を算出:

```
必要 padding = Figma の padding値 × (現在のビューポート幅 / Figma デザイン幅)
```

または、以下の方法でも可:
- Figma PC カンプの padding をそのまま `vw_max` 側の値とする
- `vw_min`（769px）側は、比率で縮小した値を使う

### Step 3: clamp を算出

Step 2 で得た 2 点を上記の計算式に代入して clamp 値を生成する。

### Step 4: ブラウザで検証

Playwright で複数の画面幅でスクリーンショットを撮り、装飾の位置が正しいか確認する。

```
検証すべき画面幅: 769px, 1024px, 1440px, 1920px, 2560px
確認ポイント:
  - 装飾画像がコンテンツに重なっていないか
  - 装飾画像とコンテンツの間に不自然な隙間がないか
  - 装飾画像の形状が崩れていないか
```

ずれが発生した場合は padding 値を微調整して再計算する。

---

## 擬似要素の設定ルール

| プロパティ | 値 | 理由 |
|-----------|-----|------|
| `position` | `absolute` | セクション基準で配置 |
| `width` | `100%` | 画面幅いっぱいに |
| `height` | `auto` | aspect-ratio に任せる（固定値にしない） |
| `aspect-ratio` | `元画像の幅 / 高さ` | 形状を常に維持 |
| `background` | `url(...) center center / contain no-repeat` | 画像を比率維持で表示 |
| `z-index` | `-1` | コンテンツの背面に |
| `top` / `bottom` | `rem(-5)` 程度 | 境界の隙間を埋める微調整 |

---

## バリエーション

### 上部のみ装飾

```scss
.p-section {
  position: relative;
  padding-top: clamp(...);

  &::before {
    /* 上部装飾のみ */
  }
  // ::after は不要
}
```

### SP で別の装飾画像に切り替え

```scss
&::before {
  background: url(../img/deco-pc.png) center center / contain no-repeat;
  aspect-ratio: 1920 / 165;

  @include mq("md") {
    background: url(../img/deco-sp.png) center center / contain no-repeat;
    aspect-ratio: 375 / 122;  // SP画像の比率に変更
  }
}
```

### SP で装飾を非表示

```scss
&::after {
  /* PC装飾 */

  @include mq("md") {
    display: none;
  }
}
```

### 装飾がセクション中央に配置される場合

```scss
&::before {
  top: 50%;
  transform: translateY(-50%);
  /* 他は同じ */
}
```

---

## 実装時の注意

- **`height: auto` は必須** — `height` を固定値にすると画面幅が変わったとき形状が崩れる
- **`aspect-ratio` の値は元画像のサイズから取得** — Figma のエクスポート時に確認
- **`contain` と `cover` の使い分け** — 装飾全体を表示する場合は `contain`、はみ出して良い場合は `cover`
- **`z-index: -1`** — コンテンツが装飾の上に来るよう必ず設定
- **親要素に `position: relative` と `z-index: 1`** — 擬似要素の `z-index: -1` が正しく機能するために必要
- **SP の padding は固定値でOK** — SP は画面幅の変動幅が小さいため clamp 不要（rem 固定で十分）

---

## 実コード参照

Project Beta で使用された実装:

```scss
// bg.html / _bg.scss より
.p-section {
  position: relative;
  z-index: 1;
  margin-top: rem(50);
  background-color: #f8f4f4;
  padding-top: clamp(8.125rem, 3.571rem + 9.487vw, 18.75rem);
  padding-bottom: clamp(20.5rem, -0.5rem + 10.938vw, 27.5rem);

  @include mq("md") {
    padding-top: rem(120);
    padding-bottom: rem(60);
  }

  &::before {
    position: absolute;
    content: '';
    top: rem(-5);
    left: 0;
    right: 0;
    width: 100%;
    height: auto;
    aspect-ratio: 1920 / 165;
    background: url(../img/bg_curve01.png) center center / contain no-repeat;
    z-index: -1;

    @include mq("md") {
      background: url(../img/bg_curve01Sp.png) center center / contain no-repeat;
      aspect-ratio: 375 / 122;
    }
  }

  &::after {
    position: absolute;
    content: '';
    left: 0;
    right: 0;
    bottom: rem(-8);
    width: 100%;
    height: auto;
    aspect-ratio: 1920 / 165;
    background: url(../img/bg_curve02-02.png) center center / contain no-repeat;
    z-index: -1;

    @include mq("md") {
      display: none;
    }
  }
}
```
