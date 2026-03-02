# Section 2: News (お知らせ)

## PC (node: 80:2317)

### レイアウト
- 背景色: #F9F8F5 (bg_beige), y:1080, h:801
- naminami_white (80:2319): y:1503, 1920x384 (セクション下部の波形)
- コンテンツ幅: 1008px (リスト)

### 見出し (80:2347-80:2348)
- heading位置: x:535, y:1180
- サブテキスト "text": Zen Maru Gothic Bold 16px, #F5BC42, leading: none
- メインテキスト "テキスト" (=お知らせ): Zen Maru Gothic Bold 32px, #4A3A12, leading: 1.5
- 見出しとリスト間: gap 13px (サブ→メイン)
- あしらい: ミモザ花装飾 (複雑SVG - 手動エクスポート推奨)

### ニュースリスト (80:2324)
- 位置: 中央配置, y:1364
- 幅: 1008px
- アイテム間gap: 30px (flex-column)
- 区切り線: ドット罫線 (各アイテム下部)

### ニュースアイテム (80:2325等)
- 日付: Noto Sans JP Bold 14px, #4A3A12, leading: 1.8
- タグ: Noto Sans JP Bold 12px, white, leading: none
  - タグbg (相談会): #7BACC1
  - タグbg (お知らせ): #F5BC42
  - rounded: 15px, min-w: 88px, px: 20px, py: 9px
- タイトル: Noto Sans JP Bold 16px, #4A3A12, leading: 1.8
- アイテム内gap: 34.482px (横並び)

### 「すべて見る」ボタン (80:2368)
- 位置: x:1277, y:1650 (右寄せ)
- テキスト: Zen Maru Gothic Bold 18px, #4A3A12
- 矢印ボタン: 円形71x71px, bg: #F5BC42, rounded-full
  - 矢印アイコン: 28.5x28.5px, white, rotate(-90deg) + scaleY(-1)
  - padding: 21px
- テキスト〜ボタン間gap: 26px

## SP (node: 80:6140)
- 要取得
