const { chromium } = require('playwright');
const args = process.argv.slice(2);
const selector = args[0];
const outputPath = args[1] || 'screenshot.png';
const viewportWidth = parseInt(args[2] || '1440');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: viewportWidth, height: 1080 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Hide Browsersync notification
  await page.evaluate(() => {
    const bs = document.getElementById('__bs_notify__');
    if (bs) bs.style.display = 'none';
  });
  await page.waitForTimeout(500);

  const el = page.locator(selector);
  await el.screenshot({ path: outputPath });
  const box = await el.boundingBox();
  console.log(`Captured: ${outputPath} (${box.width}x${box.height})`);
  await browser.close();
})();
