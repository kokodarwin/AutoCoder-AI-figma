# プロジェクトルール

## ゲート（違反時は即中断）

1. コーディング完了報告の前に、必ず /review スキルを実行すること。未実行の完了報告は禁止。
2. コーディング着手前に docs/PIPELINE.md の工程順序を確認すること。工程のスキップは禁止。
3. 判断に迷ったら docs/ 内の該当ファイルを再読み込みすること。「覚えていない」は省略の理由にならない。

## Figmaデータ取得のコンテキスト隔離（必須）

Figma MCPの `get_design_context` / `get_metadata` は、必ず Task ツール（サブエージェント）経由で実行すること。
取得結果は docs/mcp-log/ にファイルとして保存し、メインエージェントはファイルを読んで作業する。
メインコンテキストにFigma生データを直接流入させない。

## ドキュメント体系

- パイプライン手順: docs/PIPELINE.md
- コーディング規約: docs/CODING_RULES.md
- セルフレビュー項目: docs/05-review/REVIEW.md
- パターンライブラリ: docs/patterns/README.md
