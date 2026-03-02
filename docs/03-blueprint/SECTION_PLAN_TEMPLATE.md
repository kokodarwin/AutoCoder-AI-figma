# セクション計画書テンプレート

以下をコピーして `docs/mcp-log/{page}/{section}-plan.md` に保存する。

---

```markdown
# {セクション名} 実装計画

## 基本情報

| 項目 | 値 |
|------|-----|
| セクション名 | {section} |
| Figma Node ID | {node-id} |
| 参照パターン | パターン{XX} + パターン{YY} |
| 参照実装例 | {example-file.md}（該当あれば） |

## HTML構造概略

```
section.p-{section}
├── div.p-{section}__inner
│   ├── div.p-{section}__heading
│   │   ├── span.p-{section}__title → "English Title"
│   │   └── h2.p-{section}__lead → "日本語見出し"
│   ├── div.p-{section}__list
│   │   ├── div.p-{section}__item
│   │   │   ├── figure.p-{section}__itemImage
│   │   │   └── div.p-{section}__itemBody
│   │   └── ...
│   └── ...
└── ...
```

## SCSS方針

| 要素 | レイアウト | レスポンシブ（md以下） | 備考 |
|------|----------|---------------------|------|
| __inner | max-width + margin:auto | padding縮小 | |
| __heading | text-align: center | font-size縮小 | |
| __list | grid 3列 | 1列に変更 | |
| __item | flex column | 変更なし | |
| __itemImage | aspect-ratio固定 | 変更なし | overflow:hidden |

## 画像リスト

| ファイル名 | ノードID | 形式 | scale | 用途 |
|-----------|---------|------|-------|------|
| {section}-bg.png | {node-id} | PNG | 2 | 背景画像 |
| {section}-icon.svg | {node-id} | SVG | - | アイコン |
| {section}-photo1.jpg | {node-id} | JPG | 2 | カード写真 |

## リスク箇所

| 箇所 | リスク | 対処方針 |
|------|--------|---------|
| 背景レイヤー | 3層以上のブレンド | 1枚画像書き出し |
| テキスト内の太字 | 部分スタイル | spanで分離 |
| SP時のカード並び | 崩れやすい | flex-direction:columnに切替 |

## セルフレビュー用チェックポイント

- [ ] HTML構造がこの計画書と一致しているか
- [ ] SCSS方針（レイアウト手法）がこの計画書と一致しているか
- [ ] 画像リストの全画像が取得・配置されているか
- [ ] CODING_RULES.md の規約に準拠しているか
  - [ ] `@use "foundation" as *;` のみ
  - [ ] rem()関数の使用
  - [ ] letter-spacingはem単位
  - [ ] カラー変数の使用
  - [ ] FLOCSS命名規則
- [ ] Figma値が正確に反映されているか（丸め込みなし）
```
