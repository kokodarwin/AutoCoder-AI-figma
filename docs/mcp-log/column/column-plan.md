# 集客設計ノート(Column) 実装計画

## 基本情報

| 項目 | 値 |
|------|-----|
| セクション名 | column |
| Figma Node ID | 2:1561, 2096:4567 |
| 参照パターン | 2カラムレイアウト、カードUI |
| 参照実装例 | concept.html |

## HTML構造概略

```html
<main>
    <section class="p-columnFv">
        <!-- CONCEPTと同様だが背景画像のみ調整、COLOMNの文字 -->
    </section>
    
    <div class="l-container p-columnLayout">
        <div class="p-columnLayout__inner">
            <div class="p-columnLayout__main">
                <div class="p-columnLayout__header">
                    <h2 class="c-headline1">全ての記事一覧</h2>
                </div>
                <div class="p-articleList">
                    <article class="p-articleCard">...</article>
                </div>
                <!-- ページネーション -->
                <nav class="p-pagination">...</nav>
            </div>
            <aside class="p-columnLayout__sidebar">
                <section class="p-sidebarSection">
                    <h2 class="p-sidebarSection__title">カテゴリ</h2>
                    <ul class="p-sidebarTags">...</ul>
                </section>
                <section class="p-sidebarSection">
                    <h2 class="p-sidebarSection__title">アーカイブ</h2>
                    <ul class="p-sidebarArchives">...</ul>
                </section>
            </aside>
        </div>
    </div>
</main>
```

## SCSS方針

| 要素 | レイアウト | レスポンシブ（md以下） | 備考 |
|------|----------|---------------------|------|
| p-columnLayout | `display: flex; gap: 60px;` | `flex-direction: column` または1列 | 2カラム構造 |
| p-articleList | `display: grid; grid-template-columns: repeat(2, 1fr); gap: 60px;` | 1カラムに変更 | |
| p-articleCard | `display: flex; flex-direction: column;` | 画像アスペクト比固定 | |
| p-pagination | `display: flex; gap: 12px` | wrapさせる | 中央寄せ |

## セルフレビュー用チェックポイント

- [ ] HTML構造がこの計画書と一致しているか
- [ ] SCSS方針（レイアウト手法）がこの計画書と一致しているか
- [ ] CODING_RULES.md の規約に準拠しているか
  - [ ] `@use "foundation" as *;` のみ
  - [ ] rem()関数の使用
  - [ ] letter-spacingはem単位
  - [ ] カラー変数の使用
  - [ ] FLOCSS命名規則
- [ ] Figma値が正確に反映されているか
- [ ] JSはHTML内にインラインで書かれていないか
