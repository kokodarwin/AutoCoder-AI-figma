# 工程7: 品質チェック（エディタ内で完結）

## 概要

エディタ上のコードとファイルだけで確認できる品質チェック項目をまとめる。
MCPログ（`docs/mcp-log/{page}/design-context.md`）に保存されたデザイン情報と、実装コードの整合性を確認する。

## 前提条件

- HTML / SCSS / JS の実装が完了していること
- 画像ファイルが配置済みであること
- MCPログが存在すること

---

## MCPログの参照

チェック開始前に、対象ページのMCPログを確認する:

```bash
cat docs/mcp-log/{page}/design-context.md
```

MCPログに記録されている情報:
- **フォント情報**: font-family, font-weight の一覧
- **カラー情報**: CSS変数名とカラーコードの対応表
- **タイポグラフィ詳細**: セクションごとのfont-size, line-height, letter-spacing
- **画像一覧**: 使用されている画像のファイル名と保存先パス

---

## チェック項目

### 1. タイポグラフィ

**参照**: MCPログの「フォント情報」「タイポグラフィ詳細」セクション

- [ ] フォント指定がデザイン通りか（font-family）
- [ ] フォントサイズがデザイン通りか（font-size）
  - `rem()` 関数で正しく指定されているか
- [ ] フォントウェイトがデザイン通りか（font-weight）
  - Regular (400), Medium (500), Bold (700) など
- [ ] 行間隔がデザイン通りか（line-height）
- [ ] 文字間隔がデザイン通りか（letter-spacing）
  - **必ず `em` 単位で記述されているか確認**
  - 計算: `letter-spacing(px) / font-size(px) = em値`

#### letter-spacing 計算例

| font-size | letter-spacing (Figma) | 計算 | SCSS記述 |
|-----------|------------------------|------|----------|
| 24px | 2.4px | 2.4 / 24 = 0.1 | `letter-spacing: 0.1em;` |
| 16px | 2px | 2 / 16 = 0.125 | `letter-spacing: 0.125em;` |
| 50px | 4px | 4 / 50 = 0.08 | `letter-spacing: 0.08em;` |

---

### 2. 色

**参照**: MCPログの「カラー情報」セクション

- [ ] テキスト色がデザイン通りか（color）
  - CSS変数が正しく使用されているか
- [ ] 背景色がデザイン通りか（background-color）
- [ ] ボーダー色がデザイン通りか（border-color）
- [ ] カラーコードが直接書かれていないか
  - ❌ `color: #000000;`
  - ✅ `color: $black;`

---

### 3. 画像

**参照**: MCPログの「画像一覧」セクション（ある場合）

- [ ] 使用画像のファイル名が命名規則通りか
  - `{セクション名}{数字}.{拡張子}` (例: hero1.jpg, feature2.svg)
- [ ] ファイル形式が適切か
  - **アイコン** → SVG
  - **写真・通常の画像** → JPEG
  - **背景透過が必要 / テキストが上に載る画像** → PNG
- [ ] 2倍書き出し前提の画像サイズになっているか
- [ ] 画像ファイルが実際に存在するか
- [ ] HTML内の画像パスが正しいか

---

### 4. SCSS規約

**参照**: [CODING_RULES.md](../CODING_RULES.md)

- [ ] `@use "foundation" as *;` のみがインポートされているか
- [ ] すべての数値が `rem()` 関数で囲まれているか
  - `letter-spacing` は例外（`em` 単位）
- [ ] ネストが使用されていないか（フラット記述）
- [ ] メディアクエリが各クラス内の最下部に記述されているか
  - ファイル末尾にまとめて書いていないか確認
- [ ] CSS変数が正しく使用されているか
- [ ] FLOCSS + BEM記法に従っているか

#### SCSS記述の確認例

```scss
// ✅ OK
.p-example__title {
  font-size: rem(24);
  letter-spacing: 0.1em;
  color: $base-color;

  @include mq("md") {
    font-size: rem(20);
  }
}

// ❌ NG
.p-example {
  &__title {  // ネスト禁止
    font-size: 24px;  // rem()未使用
    letter-spacing: rem(2.4);  // letter-spacingはem単位
  }
}

@include mq("md") {  // ファイル末尾にまとめるのはNG
  .p-example__title { ... }
}
```

---

### 5. HTML構造

- [ ] セマンティックHTMLが使用されているか
  - `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>` など
- [ ] 見出し構造が適切か（h1 → h2 → h3...）
- [ ] h1は1ページに1つのみか
- [ ] リンクとして機能すべき要素が `<a>` タグになっているか
- [ ] すべての `<img>` タグに `alt` 属性があるか
- [ ] すべての `<img>` タグは `<figure>` タグで囲まれているか
- [ ] FLOCSS + BEM記法のクラス名になっているか

---

### 6. meta / head

- [ ] `<title>` が設定されているか
- [ ] `<meta name="description">` が設定されているか
- [ ] OGP 画像（og:image）が設定されているか
- [ ] favicon の設定があるか

---

### 7. アクセシビリティ

- [ ] フォームの `<input>` に `<label>` が関連付けられているか
- [ ] 外部リンクに `target="_blank"` と `rel="noopener noreferrer"` があるか
- [ ] ホバー効果が `@media (any-hover: hover)` で実装されているか

---

## チェック手順

1. **MCPログの確認** - 対象ページのデザイン情報を開く
2. **コードとの照合** - HTML、SCSS、画像ファイルを確認
3. **不一致の記録と修正** - 不一致があれば修正し、再度チェック

---

## 注意事項

- ブラウザ操作が必要な確認（表示崩れ、レスポンシブ、コンソールエラー等）は工程6で実施済み
- SCSS規約・HTML構造の基本チェックは工程5（セルフレビュー）で実施済みだが、最終確認として再チェック
- MCPログに記録されていない情報は、Figmaから再取得する
- MCPログの情報が古い場合は、最新の情報を取得してからチェックする
