# 工程1: 画像エクスポート

## 概要

Figma REST APIで画像をダウンロードし、命名規則に従って保存する。
**画像取得の指示がある場合のみ実施する。**

---

## 二段構えワークフロー（推奨）

### STEP 1: REST APIで画像をダウンロード

```bash
# 1. 画像URLを取得
curl -H 'X-Figma-Token: {TOKEN}' \
  'https://api.figma.com/v1/images/{FILE_KEY}?ids={NODE_ID1},{NODE_ID2}&format=png&scale=2'

# 2. レスポンスから画像URLを取得して、画像をダウンロード
curl -sL "{IMAGE_URL}" -o "src/img/{filename}.png"

# SVG形式の場合
curl -H 'X-Figma-Token: {TOKEN}' \
  'https://api.figma.com/v1/images/{FILE_KEY}?ids={NODE_ID}&format=svg'
```

### STEP 2: MCPでデザイン情報を取得

画像ダウンロード後、Figma MCPでレイアウト・サイズ・フォント・色の詳細情報を取得する。

### STEP 3: HTML/SCSSを実装

取得した画像とデザイン情報を基に実装する。

---

## 画像命名規則

```
{セクション名}{数字}.{拡張子}
例: hero1.jpg, feature2.svg, about1.png
```

**保存先:** `src/img/{page}/` （ページ単位で1フォルダにまとめる）

```
src/img/
├── top/          ← トップページの全画像
│   ├── fv-bg.png
│   ├── service1.png
│   └── ...
├── concept/      ← コンセプトページの全画像
│   ├── concept-hero.png
│   └── ...
└── column/       ← コラムページの全画像
    └── ...
```

---

## ファイル形式の選択

| 画像タイプ | 形式 |
|------------|------|
| **アイコン** | SVG |
| **写真・通常の画像** | JPEG |
| **背景透過が必要な画像** | PNG |
| **テキストが上に載る画像** | PNG |

---

## 親フレームの特定（重要）

### よくある失敗パターン

**症状:** ダウンロードした画像が数百バイト程度で、実質的に空ファイル

**原因:** 子ノード（Vector等）のIDを指定してしまった

Figmaのデザインは階層構造になっており、複合的なイラストは複数のベクター要素で構成されている。個別のベクター要素を指定すると、その要素だけが書き出され、イラスト全体は取得できない。

### 正しいワークフロー

**STEP A: 親フレームを特定する**

```
get_metadata または get_design_context で構造を確認

❌ NG: ベクター要素のID
<vector id="2:7195" name="Vector" .../>  → 個別のパーツ

✅ OK: 親フレームのID
<frame id="2:7131" name="img" ...>       → 複数の子要素を含む
```

**STEP B: スクリーンショットで確認**

```bash
# MCPでスクリーンショットを取得して内容を確認
get_screenshot(nodeId: "2:7131")
```

**STEP C: REST APIでダウンロード**

```bash
# 親フレームのIDを指定
curl -H 'X-Figma-Token: {TOKEN}' \
  'https://api.figma.com/v1/images/{FILE_KEY}?ids=2:7131&format=png&scale=2'
```

### 実例

| 画像 | 失敗時のID | 成功時のID | 失敗時サイズ | 成功時サイズ |
|------|-----------|-----------|-------------|-------------|
| house-miraie.png | 2:7232 (Vector) | 2:7131 (frame) | 372 bytes | 67KB |
| house-normal.png | 2:7195 (Vector) | 2:7008 (frame) | 264 bytes | 86KB |

---

## PNGグループの自動ダウンロード

### 概要

Figmaで複数の要素をグループ化し「png」と命名されたレイヤーは、**1枚のフラットな合成画像**としてダウンロードする。

### なぜ必要か

Figma MCP の `get_design_context` はグループを**個別の子要素に分解**して返す。
そのため、MCPだけではグループ全体を1枚の画像として取得できない。

**Figma REST API の `/v1/images` エンドポイント**を使えば、グループノードを指定することで自動的にフラット化された合成画像を取得できる。

### ダウンロード手順

```bash
# 1. .envからトークンを読み込む
FIGMA_TOKEN=$(grep FIGMA_ACCESS_TOKEN .env | cut -d= -f2)

# 2. REST APIで画像URLを取得（ノードIDはSCAN工程で特定済み）
RESPONSE=$(curl -sS -H "X-Figma-Token: $FIGMA_TOKEN" \
  "https://api.figma.com/v1/images/{FILE_KEY}?ids={NODE_ID}&format=png&scale=2")

# 3. 画像URLを抽出してダウンロード
IMG_URL=$(echo "$RESPONSE" | jq -r '.images["{NODE_ID}"]')
curl -sL "$IMG_URL" -o "src/img/{page}/{filename}.png"

# 4. ダウンロード結果を確認
file "src/img/{page}/{filename}.png"
```

### 実例

About Usセクションの3枚の写真グループ（node `3001:2511`）を1枚の合成画像としてダウンロード:

```bash
FIGMA_TOKEN=$(grep FIGMA_ACCESS_TOKEN .env | cut -d= -f2)
RESPONSE=$(curl -sS -H "X-Figma-Token: $FIGMA_TOKEN" \
  "https://api.figma.com/v1/images/mKEN3wUzUBeUIpao8pM5Tn?ids=3001:2511&format=png&scale=2")
IMG_URL=$(echo "$RESPONSE" | jq -r '.images["3001:2511"]')
curl -sL "$IMG_URL" -o "src/img/about/about-photo.png"
# 結果: 1876x948px の合成画像（3枚の写真が正しく配置された状態）
```

### 検出タイミング

- **工程2（SCAN）**: レイヤー分析時に「png」と命名されたグループを検出・記録する
- **工程4（BUILD）**: コーディング開始時にREST APIで自動ダウンロードする

---

## 複雑なSVGの取り扱い（トークン節約）

### 問題

Figma MCP で複雑なSVG（ベクターイラスト、マスク付き、複数レイヤー構成）をダウンロードしようとすると:
1. `get_design_context` が個別のマスク/カラー/パーツレイヤーに分解して返す
2. 各レイヤーのSVGを個別にダウンロードし、手動で合成する必要がある
3. この合成作業で**大量のトークンを消費**する（1つのイラストで数万トークン）

### ルール: 複雑なSVGはユーザーに手動エクスポートを依頼する

以下の条件に該当するSVGは、**ダウンロード・合成を試みず**、ユーザーに手動エクスポートを依頼する:

| 条件 | 例 |
|------|-----|
| マスクレイヤーを含む | `isMask: true` のノードがある |
| 3層以上のベクターで構成 | 体・顔・髪・服など複数VECTORノード |
| fills に複数のグラデーション | 複雑なイラスト表現 |
| ノード名に「illust」「character」「person」を含む | 人物イラスト等 |

### 対処フロー

```
IF SVGが複雑（上記条件に該当）:
  1. ダウンロードを試みない
  2. コーディングはSVG以外の部分を先に完了させる
  3. ユーザーに以下のように報告:
     「以下のSVGイラストはFigma MCPで直接取得すると大量のトークンを消費するため、
      手動でエクスポートをお願いします:
      - {イラスト名} (node-id: {NODE_ID})
      - 推奨形式: SVG または PNG (2x)
      - 保存先: src/img/{page}/{filename}」
  4. ユーザーがエクスポートしたファイルを受け取ってからコーディングに組み込む
```

### 例外: シンプルなSVG

以下のSVGはダウンロードしてよい:
- 単一のVECTORノード（アイコン等）
- パスが1〜2個のシンプルな形状
- `get_design_context` のアセットURLで直接取得できるもの

---

## マスク・クロップされた画像の取得

- 常に**親フレームまたはマスクレイヤー**を指定して書き出す
- REST APIでデザイン通りの切り抜きが適用された画像を取得できる
- CSSの `object-fit: cover` による位置調整が不要になる

---

## チェックリスト

- [ ] メタデータで構造を確認したか
- [ ] `<frame>` または `<instance>` のIDを使用しているか
- [ ] スクリーンショットで期待通りの画像か確認したか
- [ ] ダウンロード後のファイルサイズを確認したか（数十KB以上あるか）
- [ ] 命名規則に従ってリネームしたか
- [ ] 不要なファイル（ハッシュ名ファイル等）を削除したか

### ダウンロード後の画像検証（必須）

**全画像のダウンロード完了後、以下の検証を行う。1つでもNGなら再取得する。**

1. **画像の目視確認**: Readツールで各画像を表示し、意図した内容の画像かを確認する
2. **Figmaデザインとの照合**: Figma MCPの `get_screenshot` で対象セクション全体のスクリーンショットを取得し、ダウンロードした画像が実際のデザイン内のどの要素に対応するかを照合する
3. **用途の明確化**: 各画像がHTML/CSSでどう使われるか（`<img>` タグか、CSS `background-image` か）を確認し、ブレンドモードやopacity等の特殊な表示設定がないかデザインコンテキストで確認する

| チェック項目 | 確認方法 |
|------------|---------|
| 画像の内容が正しいか | Readツールで画像を表示して目視 |
| 画像の寸法が妥当か | `file` コマンドで確認（2x書き出しならFigmaの2倍） |
| 背景画像にブレンドモードがないか | `get_design_context` で `mix-blend` や `opacity` を確認 |
| 同じ要素が複数の画像に含まれていないか | ダウンロードした画像同士を見比べる |

---

## 各方法の比較

| 方法 | デザイン情報 | 画像取得 | 精度 | 安定性 |
|------|------------|---------|------|--------|
| **公式Figma MCP** | 最高 | 不可 | 最高 | 良い |
| **REST API** | 高い | 最高 | 高い | 非常に良い |
| **二段構え（推奨）** | 最高 | 最高 | 最高 | 最高 |
