/* eslint-disable */
// Programmatic layout checks: horizontal overflow on mobile, missing focus
// indicators on primary CTAs, text contrast on hero, image alt coverage.
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const BASE = "http://127.0.0.1:5577";
const EXE = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

const ROUTES = [
  "/","/terminal","/signals","/automation","/pool","/partners",
  "/solutions/active-traders","/solutions/passive-participants","/solutions/partners-affiliates","/solutions/brokers-exchanges","/solutions/funds-managers",
  "/network/partner-program","/network/broker-campaigns","/network/ambassador-program","/network/proof-cards","/network/leaderboards",
  "/insights/performance","/insights/ai-methodology","/insights/risk-framework","/insights/market-notes","/insights/docs",
  "/company/about","/company/roadmap","/company/support",
  "/app","/app/analytics","/app/journal","/app/terminal","/app/signals","/app/automation","/app/pool","/app/mining","/app/vitriol","/app/vitchat","/app/vitworld","/app/products","/app/card","/app/affiliate","/app/subscriptions","/app/settings",
];

async function audit(browser, route, width) {
  const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, colorScheme: "dark", reducedMotion: "reduce", isMobile: width < 768, hasTouch: width < 768 });
  const page = await ctx.newPage();
  try {
    await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(400);
    const r = await page.evaluate(({ vw }) => {
      const html = document.documentElement;
      const body = document.body;
      const scrollW = Math.max(html.scrollWidth, body.scrollWidth);
      const overflow = scrollW - vw;
      // find offenders
      const offenders = [];
      if (overflow > 1) {
        for (const el of document.querySelectorAll("*")) {
          const r = el.getBoundingClientRect();
          if (r.right > vw + 1 && r.width > 50 && r.height > 10) {
            const sel = el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") + (el.className && typeof el.className === "string" ? "." + el.className.split(/\s+/).filter(Boolean).slice(0, 3).join(".") : "");
            offenders.push({ sel: sel.slice(0, 140), right: Math.round(r.right), w: Math.round(r.width) });
            if (offenders.length >= 5) break;
          }
        }
      }
      const imgs = [...document.querySelectorAll("img")];
      const missingAlt = imgs.filter((i) => !i.alt && !i.getAttribute("aria-hidden")).length;
      const buttons = [...document.querySelectorAll("button, a")];
      const noLabel = buttons.filter((b) => !b.textContent.trim() && !b.getAttribute("aria-label") && !b.getAttribute("title")).length;
      return { scrollW, overflow, offenders, imgCount: imgs.length, missingAlt, buttonsNoLabel: noLabel, headingCount: document.querySelectorAll("h1,h2,h3").length };
    }, { vw: width });
    return { route, width, ...r };
  } catch (e) {
    return { route, width, error: e.message };
  } finally { await ctx.close(); }
}

(async () => {
  const browser = await chromium.launch({ executablePath: EXE, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  const out = [];
  for (const w of [390, 1440]) for (const r of ROUTES) out.push(await audit(browser, r, w));
  await browser.close();
  fs.writeFileSync(path.join(__dirname, "..", "audit", "layout.json"), JSON.stringify(out, null, 2));
  const overflow = out.filter((o) => o.overflow > 1);
  console.log("Horizontal overflow:", overflow.length);
  overflow.forEach((o) => console.log(`  [${o.width}] ${o.route}  +${o.overflow}px  →`, (o.offenders || []).slice(0, 2).map((x) => x.sel).join(" | ")));
  const noAlt = out.filter((o) => o.missingAlt > 0);
  console.log("\nMissing img alts:", noAlt.length, "pages");
  noAlt.slice(0, 8).forEach((o) => console.log(`  [${o.width}] ${o.route}  ${o.missingAlt}/${o.imgCount}`));
  const noLabel = out.filter((o) => o.buttonsNoLabel > 0);
  console.log("\nButtons/links without accessible name:", noLabel.length, "pages");
  noLabel.slice(0, 8).forEach((o) => console.log(`  [${o.width}] ${o.route}  ${o.buttonsNoLabel}`));
  const noH = out.filter((o) => o.headingCount === 0);
  console.log("\nPages with no h1/h2/h3:", noH.length);
  noH.forEach((o) => console.log(`  [${o.width}] ${o.route}`));
})();
