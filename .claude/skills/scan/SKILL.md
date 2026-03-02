---
name: scan
description: "工程2のFigmaレイヤー分析を実行する。get_metadataでレイヤーツリーを取得し、autoLayout→HTML/CSSマッピング、PNGグループ検出、複雑なSVG検出、問題レイヤー検出を行い、結果をmcp-logに保存する。デザインコンテキスト取得後に自動発動する。"
user-invocable: false
allowed-tools: Read, Glob, Grep
---

# 工程2: Figmaレイヤー分析（自動発動）

**デザインコンテキスト（工程0-1）取得後に自動発動。レイヤー構造を分析してHTML設計材料を整理する。**

## 手順

### 1. レイヤーツリーの取得

`get_metadata` でセクションのレイヤーツリーを取得（depth=3以上）。

取得する情報:
- ノード名・ノードID・ノードタイプ
- autoLayout の有無・layoutMode
- blendMode（NORMAL以外は要注意）
- opacity（1.0未満は要注意）
- clipsContent（= overflow:hidden）
- fills のタイプ

### 2. autoLayout → HTMLマッピング

| Figma autoLayout | HTML/CSS変換 |
|-----------------|-------------|
| HORIZONTAL | `display: flex` |
| VERTICAL | `flex-direction: column` or 通常フロー(margin-top) |
| NONE（均等配置） | `display: grid` |
| NONE（自由配置） | **要注意**: absolute必要 → 画像書き出し検討 |

### 3. PNGグループの検出

レイヤー名に「png」を含むGROUP/FRAMEを検出 → REST APIでフラット化ダウンロード。
（MCP は個別要素に分解するため REST API が必要）

検出条件:
- GROUP/FRAMEでノード名に「png」を含む
- 子ノードに複数の画像/ベクター要素

### 4. 複雑なSVGの検出

以下を満たすノードをユーザー手動エクスポートリストに記録:
- マスクレイヤー（isMask: true）を含む
- 3層以上のVECTORノード
- ノード名に「illust」「character」「person」を含む

**ダウンロード試行禁止。トークン節約のため。**

### 5. 問題レイヤーの検出

| 検出パターン | リスク | 対処 |
|-------------|--------|------|
| `layoutMode: NONE` + 自由配置 | absolute必要 | 画像書き出し or 再設計 |
| `blendMode` ≠ NORMAL | mix-blend-mode | 互換性確認 or 画像書き出し |
| `clipsContent: true` + 複雑子要素 | overflow制御 | `overflow: hidden` |
| 3層以上の `opacity < 1.0` | 複合透過 | 1枚画像書き出し |
| VECTOR ノード | SVGアイコン | Figma APIからSVGダウンロード |
| rotation ≠ 0 | transform: rotate | 角度をそのまま使用 |

### 6. 結果の保存

`docs/mcp-log/{page}/{section}-layer-analysis.md` に保存。

保存項目:
- 基本情報（Node ID, フレーム幅/高さ）
- レイヤー構造（ツリー図）
- HTML変換マッピング表
- 問題レイヤー表
- 画像リスト
- PNGグループリスト
- ユーザー手動エクスポート依頼リスト
