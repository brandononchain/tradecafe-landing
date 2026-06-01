/* eslint-disable */
// UI/UX audit screenshot harness.
// node scripts/audit-screenshots.js
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const BASE = process.env.AUDIT_BASE || "http://127.0.0.1:5577";
const EXE = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const OUT = path.join(__dirname, "..", "audit");

const MARKETING = [
  "/", "/terminal", "/signals", "/automation", "/pool", "/partners",
  "/solutions/active-traders", "/solutions/passive-participants",
  "/solutions/partners-affiliates", "/solutions/brokers-exchanges",
  "/solutions/funds-managers",
  "/network/partner-program", "/network/broker-campaigns",
  "/network/ambassador-program", "/network/proof-cards", "/network/leaderboards",
  "/insights/performance", "/insights/ai-methodology", "/insights/risk-framework",
  "/insights/market-notes", "/insights/docs",
  "/company/about", "/company/roadmap", "/company/support",
];

const APP = [
  "/app", "/app/analytics", "/app/journal", "/app/terminal", "/app/signals",
  "/app/automation", "/app/pool", "/app/mining", "/app/vitriol", "/app/vitchat",
  "/app/vitworld", "/app/products", "/app/card", "/app/affiliate",
  "/app/subscriptions", "/app/settings",
];

const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1440, height: 900 },
];

const slug = (p) => p.replace(/^\//, "") || "home";

async function capture(browser, route, vp, kind) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    colorScheme: "dark",
    reducedMotion: "reduce",
    isMobile: vp.name === "mobile",
    hasTouch: vp.name === "mobile",
  });
  // Pre-seed localStorage so the once-per-browser welcome modal stays dismissed.
  await ctx.addInitScript(() => {
    try { localStorage.setItem("tc-onboarded", "1"); } catch (e) {}
  });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(`pageerror: ${e.message}`));
  page.on("console", (m) => { if (m.type() === "error") errs.push(`console: ${m.text()}`); });
  try {
    await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 30000 });
    await page.addStyleTag({ content: `*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}` });
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await page.waitForTimeout(700);
    const dir = path.join(OUT, kind, vp.name);
    fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, slug(route).replace(/\//g, "_") + ".png");
    await page.screenshot({ path: file, fullPage: true });
    return { route, vp: vp.name, ok: true, errs };
  } catch (e) {
    return { route, vp: vp.name, ok: false, err: e.message, errs };
  } finally {
    await ctx.close();
  }
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: EXE, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  const log = [];
  for (const vp of VIEWPORTS) {
    for (const r of MARKETING) log.push(await capture(browser, r, vp, "marketing"));
    for (const r of APP) log.push(await capture(browser, r, vp, "app"));
  }
  await browser.close();
  fs.writeFileSync(path.join(OUT, "log.json"), JSON.stringify(log, null, 2));
  const failed = log.filter((l) => !l.ok);
  const withErrs = log.filter((l) => l.errs && l.errs.length);
  console.log(`captured ${log.length - failed.length}/${log.length}, ${failed.length} failed, ${withErrs.length} with console/page errors`);
  if (failed.length) failed.forEach((f) => console.log("FAIL", f.vp, f.route, f.err));
}
main().catch((e) => { console.error(e); process.exit(1); });
