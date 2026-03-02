# 工程0: デザインシステム構築（フォント・カラー変数の準備）

## 概要

Figma MCP経由でデザインからフォントとカラー情報を取得し、SCSS変数として登録する。
コーディング開始前に必ず実施すること。

---

## 手順

### 1. Figmaからデザイン情報を取得

#### 1-1. カラー変数の取得

`get_variable_defs` を使用してFigmaのカラー変数を取得する。

#### 1-2. フォント情報の取得

**複数のテキスト要素を確認して、使用されているフォントを漏れなく取得する。**

- 日本語テキストと英語テキストで異なるフォントが使われている可能性がある
- `get_design_context` で複数のテキスト要素（ノードID）を指定して確認
- 確認対象: 見出し、本文、英語テキストなど、異なるタイプのテキスト要素

**確認すべきポイント:**
- 日本語フォント（例: YuGothic, Noto Sans, ヒラギノ角ゴなど）
- 英語フォント（例: Lexend, Inter, Roboto など）
- 各フォントのウェイト（Light, Regular, Bold など）

### 2. MCPログの保存（必須）

取得した情報を `docs/mcp-log/{page}/variables.md` に保存する。
保存ルール: [mcp-log/README.md](../mcp-log/README.md) を参照

### 3. Google Fontsの読み込み

`<head>` 内にGoogle Fontsの読み込みタグを追記する。

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family={フォント名}:wght@{ウェイト}&display=swap" rel="stylesheet">
```

**注意:**
- **システムフォント（YuGothic、游ゴシック、Hiragino など）は読み込み不要**
- **Google Fontsなど外部フォントのみ読み込む**
- フォント名にスペースがある場合、URLでは `+` に置換（例: `Noto Sans` → `Noto+Sans`）
- 使用されているウェイトをすべて含める

### 4. _variables.scss の初期化

変数ファイル（`src/scss/foundation/_variables.scss`）に取得した値を登録する。

#### フォント変数

```scss
$base-font-family: "{Figmaから取得した日本語フォント名}", "{フォールバック}", sans-serif;
$second-font-family: "{Figmaから取得した英語フォント名}", sans-serif;
```

#### カラー変数

```scss
$primary: {プライマリカラー};
$black: {黒};
$white: {白};
$bg-color: {背景色};
// その他、デザインで使用されている色を追加
```

**ルール:**
- カラーコードを直接使用せず、必ず変数定義する
- 変数名はFigmaの定義名を参考にする
- **推測で変数を定義しない**（必ずFigmaの値を正解とする）

### 5. 確認

- ブラウザでフォントが正しく読み込まれているか確認
- 開発者ツールでCSS変数が正しく定義されているか確認
- 日本語テキストと英語テキストでそれぞれ正しいフォントが適用されているか確認

---

## 注意事項

- **このステップを飛ばしてコンポーネント実装に入らないこと**
- 実装中に `_variables.scss` にない新しい色やフォントが出てきた場合:
  1. まずFigmaを確認する（見落としがないか）
  2. 本当に新しいスタイルなら、まず `_variables.scss` に変数を追加
  3. その後でコンポーネントで使用する
- **その場で直接HEXコードなどを書かないこと**
