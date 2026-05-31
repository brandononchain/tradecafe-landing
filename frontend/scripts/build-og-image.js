/* eslint-disable */
// Capture the live landing page hero as the OG image (1200x630).
// Usage:
//   1. Build:  yarn build
//   2. Serve:  npx serve -s build -l 5577
//   3. Run:    node scripts/build-og-image.js
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { chromium } = require("playwright");

const URL = process.env.OG_URL || "http://127.0.0.1:5577/";
const OUT_JPG = path.join(__dirname, "..", "public", "og-image.jpg");
const OUT_PNG = path.join(__dirname, "..", "public", "og-image.png");
const EXE = process.env.PW_CHROMIUM || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

async function main() {
  const browser = await chromium.launch({
    executablePath: fs.existsSync(EXE) ? EXE : undefined,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  const ctx = await browser.newContext({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 2,
    colorScheme: "dark",
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
  // Hide cursor, scrollbars, anything fixed (cookie banner, sticky nav glow seams).
  await page.addStyleTag({ content: `
    *,*::before,*::after { animation: none !important; transition: none !important; }
    html, body { overflow: hidden !important; cursor: none !important; }
    [data-testid="cookie-banner"], .cookie-banner { display: none !important; }
  `});
  // Let fonts settle.
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.waitForTimeout(800);
  const buf = await page.screenshot({ type: "png", clip: { x: 0, y: 0, width: 1200, height: 630 } });
  await browser.close();

  await sharp(buf).resize(1200, 630, { fit: "cover" }).jpeg({ quality: 92, mozjpeg: true }).toFile(OUT_JPG);
  await sharp(buf).resize(1200, 630, { fit: "cover" }).png({ compressionLevel: 9 }).toFile(OUT_PNG);
  console.log(`og-image.jpg ${(fs.statSync(OUT_JPG).size / 1024).toFixed(1)} KB`);
  console.log(`og-image.png ${(fs.statSync(OUT_PNG).size / 1024).toFixed(1)} KB`);
}
main().catch((e) => { console.error(e); process.exit(1); });
