---
name: review
description: "工程5セルフレビュー。コーディング完了後に自動発動する。計画書との照合(A)、パターンライブラリとの照合(B)、CODING_RULES.md全項目の照合(C)、Figma値の正確性確認(D)、クイック視覚チェック(E)の5セクションを漏れなく実行する。1セクションのコーディングが完了するたびに呼び出すこと。"
user-invocable: false
allowed-tools: Read, Grep, Glob, Edit, Bash(npx gulp build)
---

# 工程5: セルフレビュー（自動発動）

**1セクションのコーディング（工程4）が完了したら、このスキルが自動発動する。**
全5セクション(A〜E)を順に実行し、NGがあれば即修正→再レビュー。

## A. 計画書との照合

計画書: `docs/mcp-log/{page}/{section}-plan.md`

- [ ] HTML構造のネスト図と実装HTMLの構造が一致しているか
- [ ] クラス名が計画書通りか
- [ ] レイアウト手法（flex/grid/通常フロー）が計画通りか
- [ ] レスポンシブ方針が計画通りか
- [ ] 画像リストの全画像が取得・配置されているか

## B. パターンライブラリとの照合

参照: `docs/patterns/README.md` → 該当パターンファイル

- [ ] HTML構造がパターンテンプレートと整合しているか
- [ ] SCSSがパターンテンプレートと整合しているか
- [ ] パターンの「よくある失敗」に該当していないか

## C. CODING_RULES.md 全項目の照合

### SCSS規約（全項目チェック必須）
- [ ] `@use "foundation" as *;` のみがインポートされているか
- [ ] `style.scss` に手動追記していないか
- [ ] FLOCSS + BEM記法（`.p-{section}__{element}`）
- [ ] すべての数値が `rem()` 関数で囲まれているか
- [ ] `letter-spacing` は `em` 単位か（計算: px ÷ font-size = em）
- [ ] ネスト（`&__element`）を使用していないか（フラット記述）
- [ ] メディアクエリが各クラス内に記述されているか
- [ ] カラーコード直書きがないか（変数使用）
- [ ] フォントファミリー直書きがないか（変数使用）
- [ ] `position: absolute` が原則禁止に違反していないか
- [ ] `padding-bottom` / `padding-left` を使用していないか
- [ ] `margin: 0 auto` → `margin-inline: auto` を使用しているか
- [ ] 縦余白で `flex-direction: column` + `gap` を使っていないか（margin-top推奨）
- [ ] タイトル以外に `margin-bottom` を使っていないか
- [ ] 横並びアイテム間に `margin-left/right` → `gap` を使用しているか
- [ ] 固定幅に `max-width: 100%` がセットされているか
- [ ] `border-radius: 100%` を使っているか（`9999px` 不可）
- [ ] `object-fit: contain` を使用していないか

### HTML規約
- [ ] セマンティックHTMLタグが適切か
- [ ] 見出し階層順（h1→h2→h3）
- [ ] h1は1ページに1つのみか
- [ ] リストに ul/ol/li タグを使用しているか
- [ ] すべての `<img>` に `alt` 属性があるか
- [ ] 単体pタグをdivで囲っていないか

### 画像規約
- [ ] SVGアイコンが自作されていないか
- [ ] 画像パスが実在するか

## D. Figma値の正確性

MCPログ: `docs/mcp-log/{page}/design-context.md`

### design-context.md の全行突合（最重要）

design-context.md の**全ての値**が、SCSSに1:1で実装されていることを確認する。
未実装の値が1つでもあればNG。

- [ ] design-context.md の各行を順にSCSSと突合し、対応するCSS宣言が存在するか確認

### 個別プロパティの正確性
- [ ] font-size がFigma値と一致（小数点含む）
- [ ] line-height が一致
- [ ] letter-spacing が正確に計算されているか
- [ ] margin / padding が一致
- [ ] color が一致（変数経由）
- [ ] width / height が一致
- [ ] border-radius が一致
- [ ] gap が一致

### レイアウト計算の検証（必須）

`space-between` や `gap` のレイアウトでは、実効コンテナ幅と子要素合計幅の差分を計算する。
祖先の `padding-inline` がコンテナ実効幅を圧縮していないか確認。

## E. クイック視覚チェック（必須）

**「前より良くなった」ではなく「Figmaと一致しているか」で判断。**

### 手順
1. `npx gulp build` でSCSSコンパイル
2. Playwrightで実装スクリーンショット撮影
3. Figma MCP の `get_screenshot` でデザイン画像取得
4. インベントリ方式で比較:

**STEP 4a**: Figmaスクショの要素をすべてリストアップ
**STEP 4b**: 実装スクショの要素をすべてリストアップ
**STEP 4c**: 2つのリストを突き合わせ、差異を明示的に列挙

**差異が0件でなければNG。** 修正して再実行。

## 判定

- A〜E 全OK → コーディング完了。ユーザーに報告
- 1つでもNG → 即修正 → NGだった項目を再チェック
