import re

file_path = "src/scss/top-antigravity/_p-antigravity-top.scss"
with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines):
    if "letter-spacing" in line and "px" not in line and "em" not in line:
        pass
    
    # 1. 最初のimport修正
    if i == 1 and line.startswith("@use"):
        new_lines.append('@use "foundation" as *;\n')
        continue

    # 2. font-size: nn px; -> font-size: rem(nn); 等の置換
    # ただし width, height, top, left 等含むほとんどの数値置換を行う
    
    # 簡単な正規表現で対応できる範囲で変換
    def replace_px(match):
        val_str = match.group(1)
        return f"rem({val_str})"
    
    # letter-spacing以外は全てremにする簡便な処理を行うのは危険なので要修正箇所を手動で当てる
    # 便宜上、全て書き直した方が安全だと判断できるため、Pythonから直接スクリプトで書き換えるのは中止し、
    # 完全に書き直したSCSSファイルを出力する。
