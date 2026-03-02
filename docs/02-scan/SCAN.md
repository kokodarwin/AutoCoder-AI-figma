# 工程2: Figmaレイヤー分析

## 概要

コーディング前にFigmaレイヤー構造を分析し、HTML構造の設計材料を整理する。
この工程はAIが自動進行する（ユーザーの承認不要）。

---

## 目的

- Figmaのレイヤー構造からHTML要素の対応関係を把握する
- autoLayout の有無・layoutMode でFlex/Grid/通常フローへの変換方針を決める
- 問題レイヤー（CSS再現困難な要素）を事前に検出する
- 結果を `docs/mcp-log/{page}/{section}-layer-analysis.md` に保存する

---

## 手順

### 1. レイヤーツリーの取得

```
get_metadata でセクションのレイヤーツリーを取得（depth=3以上）
```

取得すべき情報:
- ノード名とノードID
- ノードタイプ（FRAME, GROUP, TEXT, VECTOR, INSTANCE等）
- autoLayout の有無
- layoutMode（HORIZONTAL / VERTICAL / NONE）
- blendMode（NORMAL以外は要注意）
- opacity（1.0未満は要注意）
- clipsContent（true は overflow:hidden 相当）
- fills のタイプ（SOLID, GRADIENT_LINEAR, IMAGE等）

### 2. autoLayout → HTMLマッピング

| Figma autoLayout | HTML/CSS変換 |
|-----------------|-------------|
| layoutMode: HORIZONTAL | `display: flex` |
| layoutMode: VERTICAL | `display: flex; flex-direction: column` または通常フロー（margin-top） |
| layoutMode: NONE（子が均等配置） | `display: grid` |
| layoutMode: NONE（子が自由配置） | 要注意: `position: absolute` が必要な可能性 |

**重要**: CODING_RULES.md では `position: absolute` の使用は原則禁止。自由配置のレイヤーは画像書き出しを検討する。

### 3. PNGグループの検出

レイヤーツリー内で**「png」と命名されたグループ**を検出し、画像リストに記録する。

これらのグループは Figma MCP では個別要素に分解されるため、**Figma REST API** でフラット化した1枚画像としてダウンロードする必要がある。

```
検出条件:
- ノードタイプが GROUP または FRAME
- ノード名に「png」を含む（大文字小文字不問）
- 子ノードに複数の画像・ベクター要素を含む

記録する情報:
- ノードID（REST APIダウンロードに使用）
- ノード名
- 含まれる子要素の概要
- ダウンロード後のファイル名（命名規則に従う）
```

ダウンロード方法の詳細: [ASSETS.md - PNGグループの自動ダウンロード](../01-assets/ASSETS.md#pngグループの自動ダウンロード)

### 4. 複雑なSVGの検出

レイヤーツリー内で**複雑なSVGイラスト**を検出し、ユーザーへの手動エクスポート依頼リストに記録する。

```
検出条件:
- マスクレイヤー（isMask: true）を含む
- 3層以上のVECTORノードで構成されている
- ノード名に「illust」「character」「person」を含む

記録する情報:
- ノードID
- ノード名
- 「ユーザー手動エクスポート」フラグ
- 推奨形式（SVG or PNG）
```

詳細: [ASSETS.md - 複雑なSVGの取り扱い](../01-assets/ASSETS.md#複雑なsvgの取り扱いトークン節約)

### 5. 問題レイヤーの検出

以下の特徴を持つレイヤーをリストアップする:

| 検出パターン | リスク | 対処方針 |
|-------------|--------|---------|
| `layoutMode: NONE` + 子要素の自由配置 | absolute必要 | 1枚画像書き出し or レイアウト再設計 |
| `blendMode` ≠ NORMAL | CSS `mix-blend-mode` | 互換性確認、困難なら画像書き出し |
| `clipsContent: true` + 複雑な子要素 | overflow制御 | `overflow: hidden` + 構造検討 |
| 3層以上の`opacity` < 1.0 レイヤー | 複合透過 | 1枚画像書き出し（パターン10参照） |
| VECTOR ノード | SVGアイコン | Figma APIからSVGダウンロード |
| 回転（rotation ≠ 0） | transform: rotate | 角度をそのまま使用 |

### 6. 結果の保存

分析結果を `docs/mcp-log/{page}/{section}-layer-analysis.md` に保存する。

---

## 保存テンプレート

```markdown
# {セクション名} レイヤー分析

## 基本情報
- Figma Node ID: {node-id}
- フレーム幅: {width}px
- フレーム高さ: {height}px

## レイヤー構造

```
{セクション名} (FRAME, autoLayout: VERTICAL)
├── heading (FRAME, autoLayout: VERTICAL)
│   ├── title (TEXT) → span
│   └── lead (TEXT) → h2
├── list (FRAME, autoLayout: HORIZONTAL / GRID)
│   ├── item-1 (FRAME, autoLayout: VERTICAL)
│   │   ├── image (FRAME, IMAGE fill)
│   │   └── body (FRAME, autoLayout: VERTICAL)
│   └── item-2 ...
└── background (GROUP) → 画像書き出し候補
```

## HTML変換マッピング

| Figmaレイヤー | HTMLタグ | CSSレイアウト | 備考 |
|-------------|---------|-------------|------|
| heading | div | flex-direction: column | セクション見出し |
| list | div | grid 3列 or flex | カードコンテナ |
| item | div | flex-direction: column | 各カード |

## 問題レイヤー

| レイヤー名 | 問題 | 対処方針 |
|-----------|------|---------|
| background | 3層以上のブレンド | 1枚画像書き出し |

## 画像リスト

| ファイル名 | ノードID | 形式 | 用途 |
|-----------|---------|------|------|
| {section}-bg.png | {node-id} | PNG (scale=2) | 背景画像 |
| {section}-icon.svg | {node-id} | SVG | アイコン |

## PNGグループ（REST APIで自動ダウンロード）

| ファイル名 | ノードID | 子要素概要 |
|-----------|---------|-----------|
| {section}-photo.png | {node-id} | 写真3枚の合成グループ |

## ユーザー手動エクスポート依頼

| ファイル名 | ノードID | 理由 | 推奨形式 |
|-----------|---------|------|---------|
| {section}-illust.svg | {node-id} | マスク+複数VECTOR（トークン節約） | SVG |
```

---

## 次の工程

分析完了後、[工程3: 実装計画](../03-blueprint/BLUEPRINT.md) に進む。
