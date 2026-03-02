# 工程6: 視覚的検証（ピクセルパーフェクト確認）

## 概要

**オンデマンド実行**: この工程はユーザーがこのmdファイルを渡したときにのみ実行する。
自動ワークフロー（工程0〜5）には含まれない。

**ユーザーが指定したセクションのみ**、実装とFigmaデザインを比較し、**90%以上のマッチ率**を達成するまで修正を繰り返す。
最大反復回数: **3回**

この工程はコーディング（工程4）・セルフレビュー（工程5）完了後に実行する。
工程5のクイック視覚チェックで明らかな差異は解消済みの前提で、精密なピクセルレベルの検証を行う。

**修正ループ**: 差分分類 → RCA（根本原因分析）→ 根本原因への修正 → 再検証
参照: [ROOT_CAUSE_ANALYSIS.md](../05-review/ROOT_CAUSE_ANALYSIS.md)

---

## 使い方（指示テンプレート）

### 基本: Figma URLを投げるだけ

```
docs/06-pixeldiff/PIXELDIFF.md に従って
このセクションをピクセルパーフェクト検証して。

https://www.figma.com/design/xxxxx?node-id=2-4053
```

### 複数セクションを一括で

```
docs/06-pixeldiff/PIXELDIFF.md に従って
以下のセクションをピクセルパーフェクト検証して。

https://www.figma.com/design/xxxxx?node-id=2-4053
https://www.figma.com/design/xxxxx?node-id=2-5012
https://www.figma.com/design/xxxxx?node-id=2-6789
```

### AIの処理フロー

```
Figma URLをパース → fileKey と node-id を抽出
  ↓
Figma REST APIでノード情報を取得 → セクション名・フレーム幅を特定
  ↓
HTMLを確認 → 対応するCSSセレクタ(.p-xxx)を特定
  ↓
⚠️ 事前準備（既知の落とし穴を回避）:
  - Figmaフレーム幅を確認（ビューポート幅として使用）
  - Figma画像の背景合成準備
  ↓
セクションごとに検証ループ:
  1. Playwrightで実装スクショ撮影（font-size固定・通知非表示）
  2. Figma REST APIで参照画像取得（scale=1）
  3. Figma画像を実装の背景色に合成
  4. pixelmatchで比較
  5. 90%未満なら修正 → 再比較（最大3回）
  ↓
90%達成後 → 目視チェックリスト実施
  ↓
全対象セクション完了 → 結果報告
```

---

## ⚠️ 既知の落とし穴と解決策（重要・必読）

以下は毎回確実に発生する問題。**比較前に必ず対処すること。**
対処しないと大量のトークンを無駄にデバッグに費やすことになる。

### 1. Figma画像の透明背景問題

**症状**: マッチ率が異常に低い（50-60%程度）
**原因**: Figma REST APIでエクスポートした画像は、フレームに背景色がない場合**完全に透明**になる。実装は`background-color`を持つため、全背景ピクセルがミスマッチになる。

**解決策**: 比較前にFigma画像を実装の背景色に合成する。

```javascript
// Figma画像を背景色に合成するスクリプト
const { PNG } = require('pngjs');
const fs = require('fs');
const img = PNG.sync.read(fs.readFileSync('figma-image.png'));

// 実装の背景色を設定（SCSSの$bg変数を確認すること）
const bg = { r: 245, g: 245, b: 245 }; // 例: #f5f5f5

for (let i = 0; i < img.data.length; i += 4) {
  const a = img.data[i+3] / 255;
  img.data[i]   = Math.round(img.data[i] * a + bg.r * (1 - a));
  img.data[i+1] = Math.round(img.data[i+1] * a + bg.g * (1 - a));
  img.data[i+2] = Math.round(img.data[i+2] * a + bg.b * (1 - a));
  img.data[i+3] = 255;
}

fs.writeFileSync('figma-image-composited.png', PNG.sync.write(img));
```

**確認方法**: Figma画像の左上ピクセルが`(0,0,0,0)`（透明）なら合成が必要。

### 2. Browsersync通知の映り込み

**症状**: スクリーンショット右上に"Browsersync: connected"が表示される
**解決策**: スクリーンショット撮影前に非表示にする。

```javascript
await page.evaluate(() => {
  const bs = document.getElementById('__bs_notify__');
  if (bs) bs.style.display = 'none';
});
```

### 4. スクリーンショットのビューポートクリップ

**症状**: セクションの下部が切れる（ビューポート高さで切り詰められる）
**原因**: Playwright MCPのscreenshotツールやscreenshot.cjsスクリプトは、ビューポート内の表示部分しかキャプチャしないことがある。
**解決策**: Playwrightの`element.screenshot()`を直接使用する（下記「実装スクリーンショット撮影」参照）。

---

## 検証の単位: セクションごと（重要）

**フルページではなく、セクション単位でスクリーンショット比較を行うこと。**

### なぜセクション単位か

フルページでの比較には致命的な問題がある:

```
例: ヘッダーが10px高い場合

ヘッダー → 差分あり（本当の問題）
FV       → 差分あり（ヘッダーのズレが伝播しただけ）
About    → 差分あり（同上）
Service  → 差分あり（同上）

→ マッチ率 30% と出るが、実際の問題はヘッダーだけ
```

セクション単位なら:
- 各セクションが独立して90%を超えているか確認できる
- 問題箇所が即座に特定できる
- 修正の効率が大幅に上がる

---

## 実行フロー

### 1. Figma URLの解析

ユーザーが渡したFigma URLから情報を抽出する。

```
URL: https://www.figma.com/design/{fileKey}/...?node-id={nodeId}&m=dev

例: https://www.figma.com/design/gaau2jhfNSbjm3ui50Du74/...?node-id=2-4053&m=dev
  → fileKey: gaau2jhfNSbjm3ui50Du74
  → node-id: 2-4053（REST APIでは 2:4053 に変換）
```

### 2. 検証環境の確認

```bash
# ローカルサーバーが起動しているか確認（複数ポートを試す）
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
curl -s -o /dev/null -w "%{http_code}" http://localhost:3002
```

### 3. 対象セクションの特定とフレーム幅の取得

1. Figma REST APIでノード情報を取得し、**セクション名**と**フレーム幅**を確認

```bash
export FIGMA_ACCESS_TOKEN=$(grep FIGMA_ACCESS_TOKEN .env | cut -d= -f2)

curl -s -H "X-Figma-Token: $FIGMA_ACCESS_TOKEN" \
  "https://api.figma.com/v1/files/{fileKey}/nodes?ids={nodeId}&depth=1"
```

→ レスポンスの `absoluteBoundingBox.width` がフレーム幅（= スクリーンショットのビューポート幅として使用）

2. HTMLファイルで対応するCSSセレクタ（`.p-xxx`）を特定
3. **セクションの背景色をSCSSから確認する**（Figma画像の合成に必要）

### 4. 実装のスクリーンショット撮影

**既存のscreenshot.cjsはカスタムビューポート幅に非対応。以下のPlaywrightスクリプトを使用すること。**

```javascript
// docs/scripts/capture-section.cjs として保存
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  // Figmaフレーム幅をビューポート幅に設定
  await page.setViewportSize({ width: {FIGMA_FRAME_WIDTH}, height: 1080 });
  await page.goto('http://localhost:{PORT}', { waitUntil: 'networkidle' });

  await page.evaluate(() => {
    // ⚠️ Browsersync通知を非表示
    const bs = document.getElementById('__bs_notify__');
    if (bs) bs.style.display = 'none';
  });
  await page.waitForTimeout(500); // リフロー待ち

  const el = await page.locator('{CSS_SELECTOR}');
  await el.screenshot({ path: 'docs/screenshots/{section}-impl.png' });
  const box = await el.boundingBox();
  console.log('Element size:', box.width, 'x', box.height);
  await browser.close();
})();
```

**重要ポイント:**
- `{FIGMA_FRAME_WIDTH}`: 手順3で取得したフレーム幅を使用
- `el.screenshot()`: ビューポートクリップなしでセクション全体をキャプチャ

### 5. Figma参照画像の準備

**Figma REST API** でセクションの画像をファイルとして保存する。

**⚠️ 重要: Figma MCPの `get_screenshot` はインライン表示のみでファイル保存されない。
比較にはファイルが必要なので、必ず REST API を使うこと。**

```bash
# Step 1: Figma REST API で画像URLを取得（scale=1 でFigmaフレームと同じサイズ）
export FIGMA_ACCESS_TOKEN=$(grep FIGMA_ACCESS_TOKEN .env | cut -d= -f2)

curl -s -H "X-Figma-Token: $FIGMA_ACCESS_TOKEN" \
  "https://api.figma.com/v1/images/{fileKey}?ids={nodeId}&format=png&scale=1" \
  | node -e "process.stdin.resume(); let d=''; process.stdin.on('data',c=>d+=c); process.stdin.on('end',()=>console.log(JSON.parse(d).images['{nodeId}']))"

# Step 2: 返されたURLから画像をダウンロード
curl -L -o docs/screenshots/{section}-figma.png "{上記で取得したURL}"
```

**⚠️ scale=1を使うこと（scale=2ではない）。** font-size固定により実装スクリーンショットの幅がFigmaフレーム幅と一致するため、scale=1でサイズが揃う。

**注意:**
- `{fileKey}` と `{nodeId}` は実際の値に置き換える（nodeIdの `-` は `:` に変換）
- 参考スクリプト: `docs/scripts/download-figma-assets.cjs`

### 6. Figma画像の背景合成（必須）

**⚠️ この手順を飛ばすとマッチ率が30%以上低下する。必ず実行すること。**

Figma REST APIでエクスポートした画像は背景が透明。実装の背景色に合成する。

```javascript
const { PNG } = require('pngjs');
const fs = require('fs');
const img = PNG.sync.read(fs.readFileSync('docs/screenshots/{section}-figma.png'));

// 実装の背景色（SCSSの変数を確認して設定）
const bg = { r: 245, g: 245, b: 245 }; // $bg-light: #f5f5f5 の場合

for (let i = 0; i < img.data.length; i += 4) {
  const a = img.data[i+3] / 255;
  img.data[i]   = Math.round(img.data[i] * a + bg.r * (1 - a));
  img.data[i+1] = Math.round(img.data[i+1] * a + bg.g * (1 - a));
  img.data[i+2] = Math.round(img.data[i+2] * a + bg.b * (1 - a));
  img.data[i+3] = 255;
}

fs.writeFileSync('docs/screenshots/{section}-figma-composited.png', PNG.sync.write(img));
```

**背景色の確認方法**: SCSSで対象セクションの`background-color`を確認する。

### 7. 比較の実行

```bash
node docs/scripts/compare.cjs <実装画像パス> <Figma合成済み画像パス> <差分結果パス>
```

例:
```bash
node docs/scripts/compare.cjs docs/screenshots/price-impl.png docs/screenshots/price-figma-composited.png docs/screenshots/price-diff.png
```

**画像の高さが異なる場合**: 実装とFigmaの高さが異なる場合は、短い方を白でパディングしてから比較する。`compare.cjs`がサイズ不一致エラーを出す場合は、パディング対応版スクリプトを使用する。

### 7.5. 半透明オーバーレイ画像の生成（必須）

**pixelmatch差分だけでは位置ズレの方向や量が分かりにくい。ユーザーが直感的に確認できるよう、毎回オーバーレイ画像を生成すること。**

```javascript
// 実装画像とFigma画像を50%ずつブレンドする
const { PNG } = require('pngjs');
const fs = require('fs');

const impl = PNG.sync.read(fs.readFileSync('{実装画像パス}'));
const figma = PNG.sync.read(fs.readFileSync('{Figma画像パス}'));
const { width, height } = impl;
const out = new PNG({ width, height });

for (let i = 0; i < impl.data.length; i += 4) {
  out.data[i]   = Math.round(impl.data[i] * 0.5 + figma.data[i] * 0.5);
  out.data[i+1] = Math.round(impl.data[i+1] * 0.5 + figma.data[i+1] * 0.5);
  out.data[i+2] = Math.round(impl.data[i+2] * 0.5 + figma.data[i+2] * 0.5);
  out.data[i+3] = 255;
}

fs.writeFileSync('docs/screenshots/overlay/{section}-overlay.png', PNG.sync.write(out));
```

**保存先**: `docs/screenshots/overlay/` （差分画像と分けて管理する）

**ユーザーへの結果表示**: 検証結果をユーザーに報告する際は、以下の**2枚のみ**を表示する:
1. **pixelmatch差分画像** — 数値（マッチ率）+ 問題箇所の特定用
2. **半透明オーバーレイ画像** — ユーザーの目視確認用

実装画像・Figma画像の個別表示は不要（AIの内部処理で使用するのみ）。

### 8. 分析と修正ループ

- **マッチ率 >= 90% の場合**: pixelmatch検証合格。→ 目視チェックリストへ進む。
- **マッチ率 < 90% の場合**: 検証不合格。修正が必要。

#### 修正手順（RCAベース）

[ROOT_CAUSE_ANALYSIS.md](../05-review/ROOT_CAUSE_ANALYSIS.md) に従って構造化された原因分析を行う。

1. **差分を分類する**: `diff-result.png` の赤い部分を7カテゴリ（A:位置ズレ〜G:レンダリング差異）に分類
2. **「なぜ」3回で根本原因を特定する**: 表面的な差分ではなく、なぜその差分が生じたかを掘り下げる
3. **根本原因に対して修正する**: カテゴリ別の修正アプローチに従う
4. 必要に応じてFigma REST APIで該当要素の正確な値を再取得する（`depth=5`で詳細取得）
5. SCSS/HTMLを修正する
6. **手順1〜5を繰り返す（最大3回）**

---

## 90%達成後の目視チェックリスト（必須）

pixelmatchは数値比較のみで、**構造的なレイアウト差異を見逃す**ことがある。
90%達成後、以下を目視で確認すること。

### レイアウト構造の確認

- [ ] **要素間の相対位置**: 特定の要素だけ上下にずれていないか（例: おすすめカードが他より上に突出している等）
- [ ] **要素のアラインメント**: 左揃え・中央揃え・右揃えがFigmaと一致しているか
- [ ] **要素の重なり**: リボンやバッジなどの重なり順がFigmaと一致しているか

### 装飾プロパティの確認

- [ ] **border-radius**: 角丸の有無と値がFigmaと一致しているか
- [ ] **box-shadow**: 影の有無・色・ぼかし量がFigmaと一致しているか
- [ ] **border**: 線の有無・色・太さがFigmaと一致しているか
- [ ] **background**: グラデーションや色がFigmaと一致しているか

### テキスト品質の確認

- [ ] **単語途中の改行**: 「ブラ|ンディング」のように単語の途中で改行されていないか
- [ ] **改行位置**: Figmaと大きく異なる改行をしていないか
- [ ] **文字化け・欠落**: テキストが正しく表示されているか

→ テキスト改行の問題は2種類ある:
  - **許容すべき差異**: フォントレンダリングの微差による1-2文字のずれ
  - **修正すべき差異**: 単語の途中で改行される等、**読みやすさに影響する**もの → `width`調整や`word-break`で修正

### SVGアイコンの確認

- [ ] **自作SVGの有無**: CSSにインラインdata URIで自作されたSVGがないか確認
- [ ] **自作されていた場合**: FigmaからSVGをダウンロードして差し替える（工程4のマニュアル「SVG・アイコンの自作禁止」を参照）

---

## 3回反復しても90%未満の場合

サブエージェントレベルでは解決できない構造的問題の可能性がある。

1. **RCA結果の明示**: これまでの3回の分析で特定した根本原因を一覧にまとめる
2. 全体を俯瞰して根本的な問題を特定する（計画書との乖離、パターン選択ミス等）
3. 設計レベルの問題（レイアウト方式の変更など）を検討する
4. ユーザーに報告する際、以下を含める:
   - 各反復でのRCA結果（差分カテゴリ + 根本原因 + 実施した修正）
   - 残存する差分の原因分析
   - 推奨する次のアクション

---

## 差分画像の見方

| 色 | 意味 |
|----|------|
| **赤** | 差異のある箇所（修正が必要） |
| **緑/透明** | 一致している箇所 |

---

## 出力ファイルの構成

```
docs/screenshots/
  ├── {section}-impl.png          # 実装スクリーンショット
  ├── {section}-figma.png         # Figma参照画像
  ├── {section}-diff.png          # pixelmatch差分画像
  └── overlay/
      └── {section}-overlay.png   # 半透明オーバーレイ（ユーザー確認用）
```

## コマンドリファレンス

| コマンド | 用途 |
|----------|------|
| `node docs/scripts/capture-section.cjs` | Playwrightでセクション撮影（カスタムビューポート対応） |
| `node docs/scripts/compare.cjs` | pixelmatchで画像比較 |
| `node docs/scripts/screenshot.cjs` | 旧スクリーンショット（pc/spのみ、カスタム幅非対応） |

---

## 注意事項

- 差分画像を必ず確認してから修正に入る
- 同じ問題が2回以上発生する場合は、根本原因を見直す
- **検証はユーザーが指定したセクションのみ実行する（全セクション自動実行はしない）**
- フォントレンダリングやアンチエイリアスの差異など、コードで修正不可能な差分は許容する
- **90%達成後も目視チェックリストを必ず実施する**（pixelmatchが見逃す構造差異を補完）
