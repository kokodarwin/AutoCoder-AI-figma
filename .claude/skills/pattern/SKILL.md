---
name: pattern
description: "パターンライブラリから指定パターンのテンプレート（HTML/SCSS）を展開する。パターン番号または名前を渡すと、該当パターンの詳細を読み込んで表示する。工程3（実装計画）で使用。"
argument-hint: "[パターン番号 or 名前] (例: 05, card-grid, header)"
allowed-tools: Read, Glob, Grep
---

# /pattern - パターンライブラリ検索

## 使い方

```
/pattern 05           → カードグリッドパターンを表示
/pattern card-grid    → カードグリッドパターンを表示
/pattern header       → ヘッダー・ナビパターンを表示
```

## パターン一覧

| # | ファイル | パターン名 | キーワード |
|---|---------|-----------|-----------|
| 01 | `docs/patterns/01-LAYOUT_CONTAINER.md` | レイアウトコンテナ | inner, container, section, spacing |
| 02 | `docs/patterns/02-HEADER_NAV.md` | ヘッダー・ナビ | header, nav, navigation |
| 03 | `docs/patterns/03-HAMBURGER_DRAWER.md` | ハンバーガー・ドロワー | hamburger, drawer, sp-menu |
| 04 | `docs/patterns/04-SECTION_TITLE.md` | セクションタイトル | title, headline, heading |
| 05 | `docs/patterns/05-CARD_GRID.md` | カードグリッド | card, grid, list, column |
| 06 | `docs/patterns/06-MEDIA_BLOCK.md` | メディアブロック | media, image-text, horizontal |
| 07 | `docs/patterns/07-CTA_CONTACT.md` | CTA・コンタクト | cta, contact, banner |
| 08 | `docs/patterns/08-BUTTON.md` | ボタン | button, btn, link |
| 09 | `docs/patterns/09-FOOTER.md` | フッター | footer |
| 10 | `docs/patterns/10-FLOW_STEPS.md` | フロー・ステップ | flow, steps, process |
| 11 | `docs/patterns/11-LAYOUT_OVERLAP.md` | 重なり・並び替え | overlap, negative-margin, order |
| 12 | `docs/patterns/12-BG_DECORATION.md` | 背景装飾 | wave, arc, triangle, decoration, bg |

## 実行手順

1. `$ARGUMENTS` からパターン番号またはキーワードを特定
2. 該当パターンファイルを `docs/patterns/` から読み込む
3. パターンの以下を表示:
   - HTML テンプレート
   - SCSS テンプレート
   - よくある失敗と対策
   - レスポンシブ戦略

## 現プロジェクトの規約

パターンは過去プロジェクト（Alpha/Beta/Gamma）のコードを含むが、現プロジェクトでは:
- 命名: FLOCSS（`p-` 接頭辞）
- import: `@use "foundation" as *;`
- MQ: `@include mq("md")`
