---
name: mcp-check
description: "MCPログの必須項目が揃っているか検証する。コーディング（工程4）に着手する前に自動発動する。HEXコード、px値、グラデーション、box-shadow、font-weight範囲等の必須項目が1つでも欠けていればコーディング禁止。design-context.mdとvariables.mdの両方を検証する。"
user-invocable: false
allowed-tools: Read, Grep, Glob
---

# MCPログ検証（自動発動）

**コーディング（工程4）着手前に自動発動する。MCPログが不完全ならコーディング禁止。**

## 検証対象ファイル

1. `docs/mcp-log/{page}/design-context.md` — デザイン情報
2. `docs/mcp-log/{page}/variables.md` — カラー・フォント変数

## 必須項目チェックリスト

design-context.md に以下が**すべて**含まれているか確認する。

| # | 項目 | NG例 | OK例 |
|---|------|------|------|
| 1 | グラデーション | `青→濃い青` | `103.67deg, #3e9ccd 0.15%, #1e7aaa 98.4%` |
| 2 | 背景色 | `白` | `#eef6fa` |
| 3 | gap/padding/margin | `適度な間隔` | `gap: 28px` |
| 4 | テキストweight | `Bold混在` | `「〜強化したい」まで700、「など、」以降400` |
| 5 | 要素の座標 | `右下に配置` | `left: 246px, top: 130px` |
| 6 | border-radius | `角丸` | `6px` |
| 7 | box-shadow | `影あり` | `0 0 30px rgba(6,56,82,0.08)` |
| 8 | opacity | `薄い` | `0.1` |
| 9 | font-size | 必須 | `48px` |
| 10 | line-height | 必須 | `1.4` |
| 11 | letter-spacing | 必須 | `2.4px` |
| 12 | color（HEX） | `ネイビー` | `#042275` |

## 検証手順

1. `docs/mcp-log/{page}/design-context.md` を読む
2. 上記12項目が**具体的な数値/HEXコード**で記載されているか確認
3. 自然言語（「白」「青系」「適度な」等）での記述を検出したら**NG**
4. 項目が存在しないセクションがあれば**NG**

## NGの場合

```
⚠️ MCPログ不完全: {不足項目のリスト}
→ Figma MCPで不足情報を再取得し、MCPログに追記してからコーディングに進む
```

## OKの場合

```
✅ MCPログ検証OK: design-context.md の全必須項目が揃っています
→ コーディング（工程4）に進行
```
