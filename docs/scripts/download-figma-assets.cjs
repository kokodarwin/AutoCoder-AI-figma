/**
 * Figma画像ダウンロードスクリプト
 * 
 * Usage: node docs/scripts/download-figma-assets.cjs
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// .envファイルを読み込む
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  });
}

// 設定
const FIGMA_FILE_KEY = 'fZGdydgtVUQVWKXNd1irqh';
const OUTPUT_DIR = path.join(__dirname, '../src/img/fv');

// ダウンロードする画像のノードIDとファイル名のマッピング
const ASSETS = [
  { nodeId: '0:1945', filename: 'fv-main.png', format: 'png', scale: 2 },
  { nodeId: '0:1942', filename: 'naminami-white.svg', format: 'svg', scale: 1 },
  { nodeId: '0:1950', filename: 'white-corner.svg', format: 'svg', scale: 1 },
  { nodeId: '0:1961', filename: 'illust-characters.png', format: 'png', scale: 2 },
];

// APIキーを環境変数から取得
const FIGMA_TOKEN = process.env.FIGMA_ACCESS_TOKEN;

if (!FIGMA_TOKEN) {
  console.error('❌ Error: FIGMA_ACCESS_TOKEN environment variable is not set');
  console.log('Usage: FIGMA_ACCESS_TOKEN=your_token node docs/scripts/download-figma-assets.cjs');
  process.exit(1);
}

// 出力ディレクトリを作成
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`📁 Created directory: ${OUTPUT_DIR}`);
}

/**
 * HTTPSリクエストを実行
 */
function httpsRequest(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // リダイレクト処理
        httpsRequest(res.headers.location, headers).then(resolve).catch(reject);
        return;
      }

      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const body = Buffer.concat(chunks);
        if (res.statusCode === 200) {
          resolve({ body, contentType: res.headers['content-type'] });
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body.toString()}`));
        }
      });
    });
    req.on('error', reject);
  });
}

/**
 * Figma APIから画像URLを取得
 */
async function getImageUrls(nodeIds, format) {
  const ids = nodeIds.join(',');
  const url = `https://api.figma.com/v1/images/${FIGMA_FILE_KEY}?ids=${ids}&format=${format}&scale=2`;
  
  console.log(`🔍 Fetching image URLs for: ${ids}`);
  
  const { body } = await httpsRequest(url, {
    'X-Figma-Token': FIGMA_TOKEN
  });
  
  const data = JSON.parse(body.toString());
  
  if (data.err) {
    throw new Error(`Figma API Error: ${data.err}`);
  }
  
  return data.images;
}

/**
 * 画像をダウンロードして保存
 */
async function downloadImage(imageUrl, outputPath) {
  console.log(`⬇️ Downloading: ${path.basename(outputPath)}`);
  
  const { body } = await httpsRequest(imageUrl);
  fs.writeFileSync(outputPath, body);
  
  console.log(`✅ Saved: ${outputPath}`);
}

/**
 * メイン処理
 */
async function main() {
  console.log('🎨 Figma Asset Downloader');
  console.log('========================\n');

  // フォーマット別にグループ化
  const pngAssets = ASSETS.filter(a => a.format === 'png');
  const svgAssets = ASSETS.filter(a => a.format === 'svg');

  try {
    // PNG画像のダウンロード
    if (pngAssets.length > 0) {
      console.log('\n📷 Downloading PNG images...');
      const pngNodeIds = pngAssets.map(a => a.nodeId);
      const pngUrls = await getImageUrls(pngNodeIds, 'png');
      
      for (const asset of pngAssets) {
        const imageUrl = pngUrls[asset.nodeId];
        if (imageUrl) {
          const outputPath = path.join(OUTPUT_DIR, asset.filename);
          await downloadImage(imageUrl, outputPath);
        } else {
          console.log(`⚠️ No URL found for ${asset.nodeId}`);
        }
      }
    }

    // SVG画像のダウンロード
    if (svgAssets.length > 0) {
      console.log('\n🎨 Downloading SVG images...');
      const svgNodeIds = svgAssets.map(a => a.nodeId);
      const svgUrls = await getImageUrls(svgNodeIds, 'svg');
      
      for (const asset of svgAssets) {
        const imageUrl = svgUrls[asset.nodeId];
        if (imageUrl) {
          const outputPath = path.join(OUTPUT_DIR, asset.filename);
          await downloadImage(imageUrl, outputPath);
        } else {
          console.log(`⚠️ No URL found for ${asset.nodeId}`);
        }
      }
    }

    console.log('\n🎉 All assets downloaded successfully!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
