# Agent Knowledge Base

**このファイルは新しいセッション開始時に必ず読み込むこと。**
過去のセッションで発見されたパターン、落とし穴、改善事項を記録している。
同じミスを繰り返さないための知識ベース。

---

## 1. MCP設定とトークン管理

### 発見: 不要なMCPサーバーがトークンを大量消費する

- グローバル設定（`~/.claude/config.json`）に登録したMCPサーバーは**全プロジェクトで読み込まれる**
- 各MCPサーバーのツール定義だけで数千〜1万トークンを消費する
- 例: Playwright（25ツール）、Serena（18ツール）、n8n、figma-developer-mcp
- **対策**: プロジェクトで使うMCPのみをグローバルに置く。使わないものはプロジェクト単位の `.mcp.json` で管理
- Serenaはプラグインマーケットプレイスから自動起動するため、`~/.serena/` を削除しても再生成される。プラグイン定義ごと削除が必要

### 現在のグローバル設定

- Figma（公式MCP）: 全プロジェクトで使用
- Playwright: 全プロジェクトで使用（スクショ比較に必須）

---

## 2. 画像ダウンロード

### 落とし穴: Figma REST APIはノードを単独でレンダリングする

Figma REST APIで画像をエクスポートすると、**そのノードが単独でレンダリング**される。
親要素のコンテキスト（背景色、ブレンドモード）は反映されない。

**実例**: `bg-overlay.png`（node 2:91）はFigmaで `mix-blend-mode: overlay` が適用されていた。
しかしREST APIでエクスポートすると、overlayなしのフル不透明度画像として出力された。
結果、実装で背景に配置した際にダークなネットワークパターンが目立ちすぎた。

**対策**:
1. ダウンロード後に各画像をReadツールで表示して内容を目視確認する
2. `get_design_context` で対象ノードの `mix-blend-mode`、`opacity` を確認する
3. ブレンドモードがある場合、CSSで `background-blend-mode` を設定する
4. 同じ要素が複数の画像に含まれていないか（背景画像と前景画像の重複）確認する

### 落とし穴: ノードIDの誤特定

- テキストノードのIDを画像ノードと間違えてダウンロードした事例あり
- `get_metadata` で構造を確認してから、正しいフレームIDを使用すること
- ダウンロード後のファイルサイズと寸法で妥当性を確認する

---

## 3. CSS実装の落とし穴

### 落とし穴: `justify-content: space-between` のgapが消える

`space-between` は**コンテナ幅 > 子要素の合計幅**のときだけgapを生む。
コンテナが子要素と同じ幅なら gap=0 になる。

**実例**: `.p-threeConcepts__itemContents` に `max-width: 1095.727px` と `space-between` を設定。
子要素は690+360=1050px。コンテナが1095.727pxなら45.73pxのgapが生まれるはず。
しかし**祖先の`.p-threeConcepts__inner`に`padding-inline: 25px`があり**、itemの実効幅が1190pxに縮小。
item自体のpadding 72px*2を引くとcontent area=1046px。コンテナは1050pxに収まらず1050pxになり、gap=0。

**対策**:
1. `space-between` を使う際は、Playwrightの `evaluate` で**実際のgap値を数値で確認**する
2. 祖先要素のpadding-inlineがコンテナの実効幅に与える影響を計算チェーンで検証する
3. Figmaのメタデータから「コンテナ幅 - 子要素合計 = 期待gap」を事前に計算しておく

### 落とし穴: Figmaエクスポート画像が親フレームごとダウンロードされアイコンが縮小する

Figma REST APIでアイコンをエクスポートする際、アイコン単体ではなく**親フレーム（白背景ボックス等）ごと**ダウンロードされる場合がある。
CSSでアイコンサイズを直接指定すると、フレーム画像全体がそのサイズに圧縮され、実際のアイコンは意図の1/3程度になる。

**実例**: ノウハウページのSNSアイコン（Google, YouTube, LINE, TikTok, X）。
Figma上ではアイコン54x54pxが150x100pxの白背景ボックス内に中央配置。
REST APIでダウンロードすると、画像は300x200px（150x100をscale=2で出力）。
`.p-knowhowPage__snsIconImg` に `width: rem(54); height: auto` を指定すると、
300x200px画像全体が54pxに縮小 → 実際のアイコンは約19px（54 × 54/150 ≈ 19）になった。

**対策**:
1. ダウンロード後にReadツールで画像の実寸を確認する（期待サイズと一致するか）
2. 画像が親フレームごとの場合：コンテナ（150x100px）を作り `width: 100%; height: 100%` でフィットさせる
3. 画像がアイコン単体の場合：`width: rem(54)` 等で直接サイズ指定する
4. Figma `get_metadata` でノード構造を確認し、画像ノードの親子関係を把握する

### 落とし穴: `background-blend-mode` の適用忘れ

Figmaで `mix-blend-mode: overlay` が適用されている背景要素は、CSSでも `background-blend-mode: overlay` が必要。
`get_design_context` の出力に `mix-blend-overlay` があれば、対応するCSSプロパティを必ず追加する。

---

## 4. 視覚的比較の方法論

### 原則: 「修正前 vs 修正後」ではなく「実装 vs Figma」で判断する

修正後に「前より良くなった」ことを確認するだけでは**確認バイアス**に陥る。
必ず**Figmaのスクリーンショットと実装のスクリーンショットを直接比較**する。

**実例**: `background-blend-mode: overlay` を追加後、「背景が薄くなった→OK」と判断。
しかし実際にはFigmaと比較すると背景パターンがまだ濃すぎ、地球画像が2重に見えていた。
「修正前→修正後」の改善に満足して、「修正後→Figma」の差異を見落とした。

### 方法: インベントリ（要素一覧）方式

「見て確認する」ではバイアスが入る。以下の構造化された手順を使う:

```
STEP 1: Figmaスクショから見える要素をすべてリストアップ
STEP 2: 実装スクショから見える要素をすべてリストアップ
STEP 3: 2つのリストを突き合わせて差異を明示的に記述
```

差異が0件でなければNGとする。「なんとなく同じに見える」は判定NG。

### Playwrightでの数値検証

視覚的な比較だけでなく、`playwright_evaluate` で実際のピクセル値を取得する:

```javascript
// gap, width, heightの実測値を取得
const el = document.querySelector('.p-xxx__contents');
const child1 = el.querySelector('.p-xxx__text');
const child2 = el.querySelector('.p-xxx__img');
const gap = child2.getBoundingClientRect().left - child1.getBoundingClientRect().right;
```

Figmaのメタデータの数値と実測値を突き合わせることで、微妙な余白の差異も検出できる。

---

## 5. レイアウト検証の落とし穴

### 落とし穴: inner幅の不一致による全体位置ズレ

Figmaのフレーム幅とCSS `.p-xxx__inner` の `width` が異なると、全要素が水平にずれる。
pixelmatchでは90%超でも、オーバーレイで見ると全要素がダブって見える。

**実例**: `.p-column__inner` を `width: rem(1340)` で実装。
Figmaのレイヤー構造では side left:110, items left:420 → 実効content幅は1220px。
結果、inner左端が43px（Figma: 110px）、記事リスト左端が358px（Figma: 420px）と全体が67px左にずれた。

**検知方法**: セクション実装後に `playwright_evaluate` で主要要素のleft座標を測定し、MCPログの値と比較する。

```javascript
// 実装後チェック（MCPログの left 値と比較）
const el = document.querySelector('.p-column__list');
const left = Math.round(el.getBoundingClientRect().left);
// Figma MCPログ: left:420 → |left - 420| > 10 ならズレあり
```

**対策**: inner幅はFigmaの「最左要素のleft」と「最右要素のright」から算出する。
`inner幅 = 最右要素right - 最左要素left`（フレーム幅ではない）

### 落とし穴: flex stretchによるナビ項目の段落ち

`display: flex` のデフォルト `align-items: stretch` により、
サブメニュー付きの項目（高さ92px）に合わせて全項目が引き伸ばされる。
テキスト自体は折り返していなくても、項目ボックスが92pxになりdiff画像では「段落ち」に見える。

**実例**: `.p-footer__nav` のnavGroupにサブメニュー（高さ92px）があり、
隣接する「コンセプト」「料金」等のリンクも全て92px高になった。
pixelmatchでは92%だが、オーバーレイではナビ文字が全てダブって見えた。

**検知方法**: テキスト要素の高さと `font-size × line-height` の期待値を比較する。

```javascript
// 段落ちチェック
document.querySelectorAll('.p-footer__navItem').forEach(el => {
  const h = el.getBoundingClientRect().height;
  const lh = parseFloat(getComputedStyle(el).lineHeight);
  if (h > lh * 1.3) console.warn('段落ち:', el.textContent, h, '>', lh);
});
```

**対策**:
1. ナビ等のflex行には `align-items: flex-start` を明示する
2. テキスト要素には `white-space: nowrap` を追加して折り返しを防止する

### 落とし穴: 絶対配置アイコンとテキストの重なり

アイコンを `position: absolute` で配置し、親要素の `padding-top` でテキストを下げるパターンで、
アイコンサイズやpaddingが不正確だとテキストに重なる。pixelmatchでは色の差が小さいため検出しにくい。

**実例**: `.p-price__cardTargetIcon` が58x58px（Figma: 50x50px）、
親の `padding-top: 29px` では不足。アイコン下端58px > テキスト上端43px = 15px重なり。
同時にテキスト幅が262pxに狭まり、Figmaで2行のテキストが3行に折り返し。

**検知方法**: アイコンとテキストのbounding boxが交差するか確認する。

```javascript
// 重なり検知
const iconBottom = icon.getBoundingClientRect().bottom;
const textTop = text.getBoundingClientRect().top;
if (iconBottom > textTop) console.warn('重なり:', iconBottom - textTop, 'px');

// 行数チェック（期待行数と比較）
const lines = Math.round(textRect.height / lineHeight);
if (lines > expectedLines) console.warn('行数超過:', lines, '行 (期待:', expectedLines, ')');
```

**対策**:
1. アイコンサイズはFigma MCPログの値を正確に使う（50x50なら50x50）
2. `padding-top` はアイコンサイズ + box上padding以上にする（テキスト開始位置 >= アイコン下端）
3. 不要な `padding-inline` がテキスト幅を圧迫していないか確認する

---

## 6. セクション間余白の取得方法

### 落とし穴: 個別セクションURLだけではセクション間の余白が正確に取れない

`get_design_context` は個別ノードのスタイル情報を返すが、**兄弟ノード間のgap（セクション間余白）は含まれない**。
各ノードの絶対Y座標から差分を計算する方法もあるが、精度が低い。

**実例**: FV（node 2059:3743）とAbout Us（node 1:1160）の余白を、
FV下端（y:199 + height:946 = 1145）とAbout上端（y:1250）から105pxと算出。
しかしこれは各ノードを個別に取得した絶対座標の差分であり、正確性に不安が残る。

### 対策: フルページフレームURLを併用する

ユーザーに**ページ全体のフレームURL**を個別セクションURLと一緒に提供してもらう。

```
【トップページ全体フレーム（セクション間余白の参照用）】
https://figma.com/design/xxx/yyy?node-id=0-1

【個別セクション】
- PC Header: https://figma.com/design/xxx/yyy?node-id=1:1188
- PC FV: https://figma.com/design/xxx/yyy?node-id=2059:3743
- ...
```

**手順**:
1. フルページフレームURLに対して `get_metadata` を実行
2. 返されるXMLから各子ノードの `y` と `height` を取得
3. `次セクションのy - (前セクションのy + height) = セクション間余白` で正確に算出
4. 個別セクションURLに対して `get_design_context` で詳細スタイルを取得

**ユーザーへの推奨**: フルページURLには「全体フレーム」「セクション間余白参照用」等の明示的なラベルを付けてもらう。URLが多い場合に役割が明確になり、最適な取得戦略を即座に選択できる。

---

## 7. ワークフローの構造

### 工程の分離: 自動実行 vs オンデマンド

- **工程0〜5**: AIが自動進行（コーディング完了まで）
- **工程6（pixelmatch検証）**: ユーザーがmdファイルを渡したときのみ実行
- 工程6は重い処理のため毎回自動実行するとスキップされやすい。オンデマンドにすることで確実に実行される

### 工程5の重要性

工程5（セルフレビュー）は以下の5セクションで構成:
- A: 計画書との照合
- B: パターンライブラリとの照合
- C: CODING_RULES.md全項目の照合
- D: Figma値の正確性（**レイアウト計算の検証を含む**）
- E: クイック視覚チェック（**インベントリ方式**）

特にDとEが重要。Dで数値的な正確性を、Eで視覚的な正確性を二重に検証する。

---

## 8. 開発環境

### Gulpビルド

- `NODE_ENV=development npx gulp build` でSCSSコンパイル＋画像圧縮
- 出力先: `dist/`
- BrowserSyncのポートは3000だが、Apache等と競合する場合がある

### 開発サーバー

- `python3 -m http.server 3002 --directory dist` でdistを配信
- ユーザーは `http://localhost:3002/` で確認

### Figma REST API

- トークン: 環境変数またはcurl直接指定
- URLのnode IDは `-` を `:` に変換する（例: `2-90` → `2:90`）
- curlはシングルクォートを使う（ダブルクォートだとURLエンコード問題が起きる）

---

## 9. 画像取得の落とし穴（MCP vs REST API）

### 落とし穴: Figma MCPはPNGグループを分解して返す

Figma MCP の `get_design_context` でグループノードを取得すると、**子要素が個別に分解**されて返される。
「png」と命名された合成グループを1枚の画像として取得する機能はMCPにない。

**実例**: About Usセクションの写真グループ（node `3001:2511`、3枚の写真を含むグループ名「png」）を `get_design_context` で取得。
結果: 3枚の写真が個別の `<img>` として返された。合成画像は取得できなかった。

**対策**:
1. 工程2（SCAN）でレイヤー名「png」のグループを検出・記録する
2. Figma REST API `/v1/images` でグループのノードIDを指定してダウンロードする（自動フラット化される）
3. `.env` の `FIGMA_ACCESS_TOKEN` を使用する
4. 詳細: [ASSETS.md - PNGグループの自動ダウンロード](./01-assets/ASSETS.md#pngグループの自動ダウンロード)

### 落とし穴: 複雑なSVGの合成で大量のトークンを消費する

Figma MCPで複雑なSVGイラスト（人物イラスト等）をダウンロードしようとすると、マスク・カラー・パーツの個別レイヤーに分解される。
これらを手動で合成しようとすると、1つのイラスト（62x79px程度）で**数万トークン**を消費し、結果も不正確。

**実例**: `introduction-illust-blue.png` と `introduction-illust-yellow.png`（人物イラスト）を取得しようとした。
`get_design_context` が返したのは body, face, hair 等の個別VECTORノード。
各レイヤーをSVGでダウンロードし、viewBox調整・色変換を試みたが、約30%のセッショントークンを消費した。

**対策**:
1. 複雑なSVGは**ダウンロードを試みない**
2. コーディング完了報告時にユーザーへ手動エクスポートを依頼する
3. シンプルなSVG（単一VECTORノード、アイコン等）のみダウンロード可
4. 詳細: [ASSETS.md - 複雑なSVGの取り扱い](./01-assets/ASSETS.md#複雑なsvgの取り扱いトークン節約)

### 落とし穴: 修正セッションでMCPログを参照せず再取得する

修正・調整セッションで、既にMCPログに記録済みのデザイン情報をFigma MCPから再取得すると、同じ情報の二重取得でトークンを浪費する。

**実例**: 5つの修正タスクで、各セクションの `get_design_context` と `get_screenshot` を再実行。
初回コーディング時に `docs/mcp-log/top/` に保存済みのHEXコード・px値と同じ情報を再取得し、約20%のトークンを浪費した。

**対策**:
1. 修正セッション開始時にまず `docs/mcp-log/` を確認する
2. ログに存在する情報はそのまま使用する
3. ログに**ない**情報のみFigma MCPで取得し、ログに追記する
4. 詳細: PIPELINE.md 絶対ルール6

### 落とし穴: Figma MCP アセットURLはFigma上のtransform（回転・反転・スケール）が未適用のRAW素材を返す

`get_design_context`が返すアセットURLは**Figma上で適用されたtransform（回転・反転・スケール）が反映されていないRAW素材**。
返却されるReact+Tailwindコードに含まれるtransformクラスを見落とすと、向きや角度が間違った実装になる。

**実例1（写真の反転）**: FV写真（node 80:2156）に `-scale-y-100 rotate-180`（= `scaleX(-1)`）が適用。
ダウンロードした写真は反転前の向き。`.p-juliiFv__photo { transform: scaleX(-1); }` で修正。

**実例2（アイコンの回転）**: 矢印アイコン（node 80:2416）に `-rotate-90 -scale-y-100`（= `rotate(90deg)`）が適用。
ダウンロードしたSVGは上向き。`.p-juliiNews__btnArrowIcon { transform: rotate(90deg); }` で修正。

**実例3（複合イラスト）**: Newsデコレーション（node 80:2357）は4つの黄色花びらfill + 1つのoutlineストロークグループで構成。
`imgGroup` URLはサブグループ（80:2362）のoutlineのみを返し、花びらfillは別ノード。
各ベクターを個別にDLし、座標をFigma metadataから取得して合成SVGを手動作成。

**対策**:
1. `get_design_context` の返却コードの**transformクラスを全て洗い出す**（`-scale-y-100`, `rotate-180`, `-rotate-90`等）
2. 各transformに対応するCSS transformを実装する（`-scale-y-100 rotate-180` → `scaleX(-1)`, `-rotate-90 -scale-y-100` → `rotate(90deg)`）
3. 複合イラスト（Vector×複数 + blend mode）は `get_metadata` で全子ノードの構造を確認
4. `imgGroup` のnode-idが**完全なイラストか、サブグループか**を判断してからDL

### 落とし穴: Figma MCP SVGの `preserveAspectRatio="none" width="100%" height="100%"` が `height: auto` を破壊する

Figma MCPがダウンロードするSVGには以下の属性が自動付与される:
```
<svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="...">
```
これを `<img>` タグで `CSS width: Xpx; height: auto;` で使うと、ブラウザが固有サイズを算出できず **300×150デフォルト** にフォールバックする。

**実例**: `arrow.svg`（viewBox `0 0 28.5 28.5`）を `width: rem(29); height: auto;` で表示。
期待: 29×29px → 実際: 29×150px（300:150のデフォルト比率）。`rotate(90deg)` 後に150×29pxの横棒になった。

**原因の連鎖**:
1. `width="100%" height="100%"` → ブラウザが固有寸法を算出できない
2. `preserveAspectRatio="none"` → viewBoxのアスペクト比も使えない
3. ブラウザが置換要素デフォルト 300×150 にフォールバック
4. `height: auto` が150pxになる

**対策（SVGダウンロード後の必須サニタイズ）**:
1. `preserveAspectRatio="none"` を削除
2. `width="100%" height="100%"` を削除（viewBoxのみ残す）
3. `overflow="visible"` を削除
4. `style="display: block;"` を削除
5. `fill="var(--fill-0, X)"` → `fill="X"`（`<img>`ではCSS変数が効かない）
6. `stroke="var(--stroke-0, X)"` → `stroke="X"`

---

## 10. design-context.md の値の忠実な転写

### 原則: design-context.md は仕様書であり、参考資料ではない

記録された値を「解釈」「簡略化」して実装すると、デザインとの差異が生まれる。

**実例1**: design-context.md に `Separator: border lines (left: bold #1a1a1a for 196px, right: lighter #ddd for remaining)` と記録。
実装では `border-bottom: rem(1) solid $gray-border` 1本に簡略化。2色の罫線パターンが1色になった。

**実例2**: design-context.md にマップ幅832px（親1100px内）と記録。
実装では `width: rem(832)` のみで `margin-inline: auto` を省略。中央配置が左寄せになった。

**対策**: コーディング後にdesign-context.mdの全行をSCSSと1:1で突合する（レビュー工程D）。

---

## 11. PNGグループのはみ出し検出

### 落とし穴: PNGグループの子要素が親フレームをはみ出している場合、APIエクスポートで意図しないサイズになる

Figma REST APIはノード単体のバウンディングボックスで書き出すため、親フレームの「コンテンツを隠す」（Clip content）が反映されない。

**実例**: FVの「png」グループ（node 2078:3805）は1561x866だが、親FVフレームは1440x581。
Mask groupが x=-122, y=-285 にはみ出しているため、APIが1561x866で書き出した。

**対策**:
1. PNGグループダウンロード後にReadツールで画像を確認する
2. サイズが期待値（親フレームのサイズ）と異なる場合、ユーザーにFigmaからの手動書き出しを依頼する
3. ユーザーはFigmaのマスク機能で正しいサイズにクリップしてエクスポートできる

---

## 12. Swiper CSS競合パターン

### 落とし穴: swiper-wrapper に独自レイアウトCSS を指定するとスライドが動かない

Swiperは `.swiper-wrapper` に `transform: translate3d()` でスライド位置を制御する。
`.swiper-wrapper` と同じ要素に `justify-content: center` や `flex-wrap: wrap` を指定すると、
Swiperの位置計算と競合し、スライドが切り替わらなくなる。

**実例**: `.p-juliiVoice__list`（= `.swiper-wrapper`）に以下を指定:
```scss
@include mq("md") {
  flex-wrap: nowrap;
  gap: 0;
  // justify-content: center; ← これがSwiperのtransformと競合
}
```
矢印ボタンをクリックしてもスライドが動かない。

**対策**:
1. `.swiper-wrapper` と同じ要素にPC用レイアウトを指定した場合、SP（Swiper有効時）には `initial` でリセットする
2. `justify-content`, `flex-wrap`, `gap` は全て `initial` に戻す
3. Swiperが管理するプロパティ（display, transform, transition）を上書きしない

```scss
// ✅ OK: SP時にSwiper用にリセット
.p-voice__list {
  display: flex;
  flex-wrap: wrap;
  gap: rem(50) rem(75);
  justify-content: center;

  @include mq("md") {
    flex-wrap: initial;
    gap: initial;
    justify-content: initial;
  }
}
```

### 落とし穴: Swiperナビゲーション矢印が表示されない

Swiperの `.swiper-button-prev/next` は `::after` 疑似要素で `swiper-icons` フォント（リガチャ）を使い矢印を表示する。
しかし `swiper-icons` フォントは環境によってグリフが **width: 0px** でレンダリングされることがある
（原因: `font-weight: 700` の継承、ブラウザのリガチャ処理差異、file://プロトコルでのフォント読み込み等）。

**推奨対策**: `swiper-icons` フォントに依存せず、**CSSボーダーで矢印を描画**する。
```scss
.p-voice__prev,
.p-voice__next {
  width: rem(40);
  height: rem(40);
  border: rem(2) solid $yellow;
  border-radius: 100%;

  &::after {
    content: "" !important;        // Swiperの content: 'prev'/'next' を上書き
    font-family: initial !important; // swiper-icons フォントを解除
    display: block;
    width: rem(8);
    height: rem(8);
    border-top: rem(2) solid $yellow;
    border-right: rem(2) solid $yellow;
  }
}

.p-voice__prev {
  &::after {
    transform: rotate(-135deg);  // 左矢印
    margin-left: rem(3);         // 視覚的中央寄せ
  }
}

.p-voice__next {
  &::after {
    transform: rotate(45deg);    // 右矢印
    margin-right: rem(3);
  }
}
```

**なぜ font-size 調整だけでは不十分か**: `font-size: rem(14)` でサイズを縮小しても、フォントグリフ自体がレンダリングされない（width: 0px）場合は効果がない。CSSボーダー矢印はフォント依存がなく確実に表示される。

### 落とし穴: jQuery未読み込みでSwiper初期化コードが実行されない

`script.js` が `jQuery(function($) { ... })` でラップされている場合、
jQuery の `<script>` タグが `script.js` より前にないと全JSが実行されない。
Swiperの初期化コードもjQuery内にあるため、Swiper自体は読み込まれていても初期化されない。

**対策**: HTMLの `<script>` タグの順序を確認する（jQuery → ライブラリ → script.js）。

---

## 13. このファイルの更新ルール

**このファイルはワークフロー実行中に自動更新される。**（PIPELINE.md 絶対ルール6）

### 自動書き込みトリガー

以下のいずれかに該当したら、ユーザーの指示なしに即座に追記する:

- バグ修正で根本原因が非自明だった
- Figma→CSS変換で落とし穴があった
- ワークフローの手順不足で問題を見落とした
- ビルド・環境で予想外の動作があった
- 同じ種類のミスを2回以上した

### 書き込みルール

- 各エントリには**具体的な実例**（セレクター名、CSS値、計算式など）を含める
- 抽象的な教訓ではなく、再現可能な具体例を書く
- 既存エントリと重複する場合は、新規追加ではなく既存エントリに実例を追加する
- 書き込み後、ユーザーに「agent.mdに〇〇を追記しました」と1行で報告する

### 自動分割ルール（1000行超で発動）

このファイルが1000行を超えた場合、PIPELINE.md 絶対ルール6の「自動分割の手順」に従い、
トピック別ファイルに分割され、本ファイルはインデックス（目次）に置き換わる。
500行超の時点で追記時に警告が報告される。詳細はPIPELINE.mdを参照。
