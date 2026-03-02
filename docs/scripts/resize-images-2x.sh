#!/bin/bash

# 2倍書き出しスクリプト
# 
# 使用方法:
#   ./docs/scripts/resize-images-2x.sh <画像ディレクトリ>
#
# 例:
#   ./docs/scripts/resize-images-2x.sh src/img/top/
#   ./docs/scripts/resize-images-2x.sh src/img/about/
#
# 注意:
#   - macOS専用（sipsコマンドを使用）
#   - PNG/JPGファイルを2倍にリサイズ
#   - 元のファイルを上書きします

# ディレクトリ引数のチェック
if [ -z "$1" ]; then
  echo "❌ エラー: 画像ディレクトリを指定してください"
  echo ""
  echo "使用方法:"
  echo "  ./docs/scripts/resize-images-2x.sh <画像ディレクトリ>"
  echo ""
  echo "例:"
  echo "  ./docs/scripts/resize-images-2x.sh src/img/top/"
  exit 1
fi

TARGET_DIR="$1"

# ディレクトリの存在確認
if [ ! -d "$TARGET_DIR" ]; then
  echo "❌ エラー: ディレクトリが存在しません: $TARGET_DIR"
  exit 1
fi

echo "🖼️  2倍書き出しを開始: $TARGET_DIR"
echo ""

# 処理カウンター
processed=0
failed=0

# PNG/JPGファイルを処理
cd "$TARGET_DIR" || exit 1

for file in *.png *.jpg *.PNG *.JPG 2>/dev/null; do
  # ファイルが存在するか確認
  if [ -f "$file" ]; then
    # 現在の解像度を取得
    width=$(sips -g pixelWidth "$file" 2>/dev/null | grep pixelWidth | awk '{print $2}')
    height=$(sips -g pixelHeight "$file" 2>/dev/null | grep pixelHeight | awk '{print $2}')
    
    if [ -n "$width" ] && [ -n "$height" ]; then
      new_width=$((width * 2))
      new_height=$((height * 2))
      
      echo "📐 処理中: $file (${width}x${height} → ${new_width}x${new_height})"
      
      # 2倍にリサイズ（元のファイルを上書き）
      if sips -z "$new_height" "$new_width" "$file" > /dev/null 2>&1; then
        echo "   ✅ 完了"
        ((processed++))
      else
        echo "   ❌ エラー"
        ((failed++))
      fi
    else
      echo "⚠️  スキップ（サイズ取得失敗）: $file"
      ((failed++))
    fi
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 処理結果"
echo "   成功: $processed ファイル"
echo "   失敗: $failed ファイル"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $failed -eq 0 ]; then
  echo "✅ すべての画像を2倍にリサイズしました"
else
  echo "⚠️  一部のファイルでエラーが発生しました"
  exit 1
fi
