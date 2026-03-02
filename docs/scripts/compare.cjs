const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatchModule = require('pixelmatch');
const pixelmatch = pixelmatchModule.default || pixelmatchModule;
const path = require('path');

const args = process.argv.slice(2);
if (args.length < 2) {
    console.error('Usage: node compare.cjs <img1> <img2> [output]');
    process.exit(1);
}

const img1Path = args[0];
const img2Path = args[1];
const diffPath = args[2] || 'diff.png';

try {
    const img1 = PNG.sync.read(fs.readFileSync(img1Path));
    const img2 = PNG.sync.read(fs.readFileSync(img2Path));
    const { width, height } = img1;
    const diff = new PNG({ width, height });

    const numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1 });
    const totalPixels = width * height;
    const mismatchRate = (numDiffPixels / totalPixels) * 100;

    fs.writeFileSync(diffPath, PNG.sync.write(diff));

    console.log(JSON.stringify({
        matchRate: 100 - mismatchRate,
        mismatchRate: mismatchRate,
        diffPixels: numDiffPixels,
        diffPath: diffPath
    }));

} catch (error) {
    console.error('Error comparing images:', error);
    process.exit(1);
}
