---
name: rca
description: "pixelmatch検証で不合格になった差分画像を分析し、根本原因を特定して修正する。差分画像の赤い部分を7カテゴリ(A:位置ズレ〜G:レンダリング差異)に分類し、「なぜ」3回で根本原因に到達する。/pixeldiff の結果を受けて使う。"
argument-hint: "[diff画像のパス or セクション名]"
allowed-tools: Read, Edit, Grep, Glob, Bash(node *), Bash(npx gulp build)
---

# /rca - 根本原因分析

## 使い方

```
/rca docs/screenshots/price-diff.png
/rca price  (セクション名で推測)
```

## 差分カテゴリ分類

diff画像の赤い部分を以下に分類する:

| カテゴリ | 説明 | 修正アプローチ |
|---------|------|--------------|
| **A. 位置ズレ** | 要素がX/Y方向にずれ | 親のflex/grid確認 → margin-top/padding確認 → 上位要素のサイズ伝播確認 |
| **B. サイズ差異** | width/heightが異なる | width/height/max-width照合 → padding含有確認 → flex-shrink/grow確認 |
| **C. 余白差異** | margin/padding/gapが異なる | gap/margin/padding照合 → ショートハンド方向確認 → block/inline確認 |
| **D. テキスト差異** | フォント関連が異なる | font-size → line-height → letter-spacing(em計算) → weight → family |
| **E. 色差異** | 背景色/テキスト色が異なる | 変数定義値確認 → Figma HEX照合 → opacity確認 → rgba確認 |
| **F. 形状差異** | radius/shadow/border | border-radius照合 → box-shadow照合 → border幅・色・スタイル |
| **G. レンダリング差異** | フォントレンダリング等 | **コード修正不可 → 許容** |

## 「なぜ」3回掘り下げ

```
差分: [具体的な差分内容]

なぜ1: [直接的な原因]
なぜ2: [その原因の原因]
なぜ3: [根本原因]

→ 修正: [根本原因に対する具体的な修正内容]
```

## よくある根本原因パターン

| # | 根本原因 | 頻度 |
|---|---------|------|
| 1 | Figma値の読み間違い | 高 |
| 2 | 変数の値が不正確 | 中 |
| 3 | レイアウト手法の選択ミス | 中 |
| 4 | レスポンシブ切り替え不足 | 中 |
| 5 | 画像取得の不備 | 低〜中 |
| 6 | 複合背景のCSS実装失敗 | 低 |
| 7 | フォントレンダリング差異 | 高（許容） |

## 実行手順

1. diff画像を確認し、赤い部分をカテゴリに分類
2. 各差分について「なぜ」3回を実施
3. MCPログ（`docs/mcp-log/{page}/design-context.md`）とSCSSの値を突き合わせ
4. 根本原因に対してSCSS/HTMLを修正
5. ビルド → 再スクショ → 再比較
6. 修正結果をユーザーに報告
