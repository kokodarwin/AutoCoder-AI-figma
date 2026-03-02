const { PNG } = require('pngjs');
const fs = require('fs');

const args = process.argv.slice(2);
const inputPath = args[0];
const outputPath = args[1];
const targetWidth = parseInt(args[2] || '0');
const bgR = parseInt(args[3] || '255');
const bgG = parseInt(args[4] || '255');
const bgB = parseInt(args[5] || '255');

const img = PNG.sync.read(fs.readFileSync(inputPath));

// Step 1: Crop if target width is specified and image is wider
let cropped = img;
if (targetWidth > 0 && img.width > targetWidth) {
  cropped = new PNG({ width: targetWidth, height: img.height });
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < targetWidth; x++) {
      const srcIdx = (y * img.width + x) * 4;
      const dstIdx = (y * targetWidth + x) * 4;
      cropped.data[dstIdx] = img.data[srcIdx];
      cropped.data[dstIdx + 1] = img.data[srcIdx + 1];
      cropped.data[dstIdx + 2] = img.data[srcIdx + 2];
      cropped.data[dstIdx + 3] = img.data[srcIdx + 3];
    }
  }
}

// Step 2: Composite onto background color (handle transparent pixels)
for (let i = 0; i < cropped.data.length; i += 4) {
  const a = cropped.data[i + 3] / 255;
  cropped.data[i] = Math.round(cropped.data[i] * a + bgR * (1 - a));
  cropped.data[i + 1] = Math.round(cropped.data[i + 1] * a + bgG * (1 - a));
  cropped.data[i + 2] = Math.round(cropped.data[i + 2] * a + bgB * (1 - a));
  cropped.data[i + 3] = 255;
}

fs.writeFileSync(outputPath, PNG.sync.write(cropped));
console.log(`Prepared: ${outputPath} (${cropped.width}x${cropped.height})`);
