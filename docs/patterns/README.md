# パターンライブラリ

過去プロジェクト（Project Alpha / Project Beta / Project Gamma）の実際のコードから抽出したUIパターン集。
新規セクション実装時に、適合するパターンを選定し参照する。

## 参照元プロジェクト

| プロジェクト | 命名規則 | import文 | MQ記法 |
|-------------|---------|----------|--------|
| Project Alpha | BEM（接頭辞なし） | `@use "global" as *` | `@include mq{}` (引数なし=md) |
| Project Beta | FLOCSS（p-/l-/c-/u-） | `@use "global" as *` | `@include mq("md")` |
| Project Gamma | FLOCSS（p-接頭辞） | `@use "global" as g` | `@include g.mq()` |
| **現プロジェクト** | **FLOCSS（p-接頭辞）** | **`@use "foundation" as *`** | **`@include mq("md")`** |

## 統合方針

- **命名規則**: 現プロジェクトの FLOCSS に統一（`p-` 接頭辞）
- **Project Alpha**: レイアウト構造・装飾手法の参考として活用
- **Project Beta**: 命名規則 + レイアウト構造の参考として活用
- 各パターンに両プロジェクトの実コードを掲載し、構造の比較が可能

## パターン一覧

| # | パターン名 | ファイル | 主な用途 |
|---|-----------|---------|---------|
| 01 | [レイアウトコンテナ](01-LAYOUT_CONTAINER.md) | inner + section spacing | ページ幅制御・セクション余白 |
| 02 | [ヘッダー・ナビ](02-HEADER_NAV.md) | header + nav | 固定/非固定ヘッダー + PC/SPナビ |
| 03 | [ハンバーガー・ドロワー](03-HAMBURGER_DRAWER.md) | hamburger + drawer | SPメニュー開閉 |
| 04 | [セクションタイトル](04-SECTION_TITLE.md) | section-ttl / headline | 共通見出しパターン |
| 05 | [カードグリッド](05-CARD_GRID.md) | card + grid | 一覧表示（2列/3列/4列） |
| 06 | [メディアブロック](06-MEDIA_BLOCK.md) | image + text | 画像+テキスト横並び |
| 07 | [CTA・コンタクト](07-CTA_CONTACT.md) | CTA banner | 行動喚起・問い合わせ誘導 |
| 08 | [ボタン](08-BUTTON.md) | btn / more | リンクボタン |
| 09 | [フッター](09-FOOTER.md) | footer | 複数列フッター |
| 10 | [フロー・ステップ](10-FLOW_STEPS.md) | flow | 手順・流れ表示 |
| 11 | [重なり・並び替え](11-LAYOUT_OVERLAP.md) | negative margin + order | absolute不使用の重なり・SP並び替え |
| 12 | [背景装飾（波・半円・三角）](12-BG_DECORATION.md) | pseudo-element + clamp + aspect-ratio | セクション境界の装飾背景 |
| 13 | [ピークスライダー](13-PEEK_SLIDER.md) | Swiper + clip-path + overflow:visible | 片側ビューポート貼り付きスライダー |
| 14 | [FAQアコーディオン](14-FAQ_ACCORDION.md) | details/summary + fadeIn animation | よくある質問・折りたたみ |
