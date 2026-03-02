const { PNG } = require('pngjs');
const fs = require('fs');

const [, , path1, path2] = process.argv;
const img1 = PNG.sync.read(fs.readFileSync(path1));
const img2 = PNG.sync.read(fs.readFileSync(path2));

console.log(`Image 1: ${img1.width}x${img1.height}`);
console.log(`Image 2: ${img2.width}x${img2.height}`);

if (img1.width !== img2.width || img1.height !== img2.height) {
  const maxW = Math.max(img1.width, img2.width);
  const maxH = Math.max(img1.height, img2.height);
  
  function padImage(img, w, h, bgR, bgG, bgB) {
    if (img.width === w && img.height === h) return img;
    const padded = new PNG({ width: w, height: h });
    // Fill with background
    for (let i = 0; i < padded.data.length; i += 4) {
      padded.data[i] = bgR; padded.data[i+1] = bgG; padded.data[i+2] = bgB; padded.data[i+3] = 255;
    }
    // Copy original
    for (let y = 0; y < img.height; y++) {
      for (let x = 0; x < img.width; x++) {
        const srcIdx = (y * img.width + x) * 4;
        const dstIdx = (y * w + x) * 4;
        padded.data[dstIdx] = img.data[srcIdx];
        padded.data[dstIdx+1] = img.data[srcIdx+1];
        padded.data[dstIdx+2] = img.data[srcIdx+2];
        padded.data[dstIdx+3] = img.data[srcIdx+3];
      }
    }
    return padded;
  }
  
  const padded1 = padImage(img1, maxW, maxH, 255, 255, 255);
  const padded2 = padImage(img2, maxW, maxH, 255, 255, 255);
  fs.writeFileSync(path1, PNG.sync.write(padded1));
  fs.writeFileSync(path2, PNG.sync.write(padded2));
  console.log(`Padded both to: ${maxW}x${maxH}`);
} else {
  console.log('Sizes match, no padding needed');
}
