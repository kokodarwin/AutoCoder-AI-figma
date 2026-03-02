---
name: pixeldiff
description: "工程6のピクセルパーフェクト検証をオンデマンドで実行する。Figma URLを渡すと、実装スクショ撮影→Figma画像DL→背景合成→pixelmatch比較→RCA修正→再検証のループを実行する。90%以上のマッチ率を目標とする。"
argument-hint: "[Figma URL(s)]"
allowed-tools: Read, Edit, Grep, Glob, Bash(node *), Bash(npx gulp build), Bash(curl *), Bash(export *)
---

# /pixeldiff - ピクセルパーフェクト検証

## 使い方

```
/pixeldiff https://www.figma.com/design/xxxxx?node-id=2-4053
/pixeldiff url1 url2 url3  (複数セクション)
```

## 実行フロー

### 1. Figma URLをパース

```
URL → fileKey + node-id を抽出（`-` を `:` に変換）
```

### 2. セクション情報の取得

```bash
export FIGMA_ACCESS_TOKEN=$(grep FIGMA_ACCESS_TOKEN .env | cut -d= -f2)
curl -s -H "X-Figma-Token: $FIGMA_ACCESS_TOKEN" \
  "https://api.figma.com/v1/files/{fileKey}/nodes?ids={nodeId}&depth=1"
```

→ `absoluteBoundingBox.width` = ビューポート幅
→ HTML内の対応CSSセレクタ（`.p-xxx`）を特定
→ SCSSから背景色を確認（Figma画像合成に必要）

### 3. 実装スクリーンショット撮影

Playwright で要素スクリーンショットを撮影:
- ビューポート幅 = Figmaフレーム幅
- Browsersync通知を非表示にする（`#__bs_notify__`）
- `el.screenshot()` を使う（ビューポートクリップ防止）

### 4. Figma参照画像の準備

**REST API でダウンロード（MCPの get_screenshot はファイル保存不可）:**

```bash
curl -s -H "X-Figma-Token: $FIGMA_ACCESS_TOKEN" \
  "https://api.figma.com/v1/images/{fileKey}?ids={nodeId}&format=png&scale=1"
```

**scale=1 を使うこと（scale=2ではない）。**

### 5. Figma画像の背景合成（必須・スキップ厳禁）

**これを飛ばすとマッチ率が30%以上低下する。**

```javascript
const { PNG } = require('pngjs');
const fs = require('fs');
const img = PNG.sync.read(fs.readFileSync('figma-image.png'));
const bg = { r: 245, g: 245, b: 245 }; // SCSSの背景色
for (let i = 0; i < img.data.length; i += 4) {
  const a = img.data[i+3] / 255;
  img.data[i]   = Math.round(img.data[i] * a + bg.r * (1 - a));
  img.data[i+1] = Math.round(img.data[i+1] * a + bg.g * (1 - a));
  img.data[i+2] = Math.round(img.data[i+2] * a + bg.b * (1 - a));
  img.data[i+3] = 255;
}
fs.writeFileSync('figma-composited.png', PNG.sync.write(img));
```

### 6. pixelmatch比較

```bash
node docs/scripts/compare.cjs {impl.png} {figma-composited.png} {diff.png}
```

画像の高さが異なる場合は短い方を白パディング。

### 7. 半透明オーバーレイ画像の生成（必須）

実装とFigmaを50%ブレンドした画像を `docs/screenshots/overlay/` に保存。

### 8. 結果判定

- **90%以上**: 合格 → 目視チェックリストへ
- **90%未満**: RCA修正ループ（最大3回）

### 9. 修正ループ（RCA）

1. diff画像の赤い部分を7カテゴリ(A〜G)に分類
2. 「なぜ」3回で根本原因を特定
3. 根本原因に対して修正
4. 再検証（最大3回）

### 10. 90%達成後の目視チェックリスト

- [ ] 要素間の相対位置がFigmaと一致
- [ ] アラインメント（左/中央/右揃え）が一致
- [ ] border-radius, box-shadow, border が一致
- [ ] 背景のグラデーション/色が一致
- [ ] 単語途中の改行がないか
- [ ] SVGアイコンが自作されていないか

## ユーザーへの結果表示

以下の**2枚のみ**を表示:
1. pixelmatch差分画像（マッチ率 + 問題箇所）
2. 半透明オーバーレイ画像（目視確認用）

## 3回反復しても90%未満の場合

1. 3回のRCA結果を一覧にまとめる
2. 残存差分の原因分析
3. 推奨アクションとともにユーザーに報告
