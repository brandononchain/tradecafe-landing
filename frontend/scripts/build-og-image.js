/* eslint-disable */
// Rasterize public/og-image.svg → public/og-image.jpg (1200x630)
// Run: node scripts/build-og-image.js
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const SVG = path.join(__dirname, "..", "public", "og-image.svg");
const OUT = path.join(__dirname, "..", "public", "og-image.jpg");
const OUT_PNG = path.join(__dirname, "..", "public", "og-image.png");

async function main() {
  const svg = fs.readFileSync(SVG);
  await sharp(svg, { density: 220 })
    .resize(1200, 630, { fit: "cover" })
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(OUT);
  await sharp(svg, { density: 220 })
    .resize(1200, 630, { fit: "cover" })
    .png({ compressionLevel: 9 })
    .toFile(OUT_PNG);
  const j = fs.statSync(OUT);
  const p = fs.statSync(OUT_PNG);
  console.log(`og-image.jpg ${(j.size / 1024).toFixed(1)} KB`);
  console.log(`og-image.png ${(p.size / 1024).toFixed(1)} KB`);
}
main().catch((e) => { console.error(e); process.exit(1); });
