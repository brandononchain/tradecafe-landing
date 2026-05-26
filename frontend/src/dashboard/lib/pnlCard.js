// Self-contained PnL share card as an SVG string — used for the live
// preview AND for download / copy-image (no external assets, so it
// rasterizes cleanly to PNG). Includes a finder-pattern QR.

function hashStr(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

// Deterministic QR-style matrix with three finder patterns + data modules.
export function qrMatrix(text, n = 25) {
  const m = Array.from({ length: n }, () => Array(n).fill(false));
  const reserved = Array.from({ length: n }, () => Array(n).fill(false));
  const finder = (r, c) => {
    for (let i = -1; i <= 7; i++)
      for (let j = -1; j <= 7; j++) {
        const rr = r + i, cc = c + j;
        if (rr < 0 || cc < 0 || rr >= n || cc >= n) continue;
        reserved[rr][cc] = true;
        if (i < 0 || i > 6 || j < 0 || j > 6) { m[rr][cc] = false; continue; }
        const border = (j === 0 || j === 6) || (i === 0 || i === 6);
        const inner = i >= 2 && i <= 4 && j >= 2 && j <= 4;
        m[rr][cc] = border || inner;
      }
  };
  finder(0, 0); finder(0, n - 7); finder(n - 7, 0);
  let h = hashStr(text);
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++) {
      if (reserved[r][c]) continue;
      h = (Math.imul(h, 1103515245) + 12345) >>> 0;
      m[r][c] = ((h >>> 15) & 1) === 1 && (h >>> 6) % 100 < 50;
    }
  return m;
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function pnlSvg(data = {}) {
  const {
    sym = "BTCUSDT", dir = "LONG", pnl = "+0.00%", leverage,
    entry = "—", exit = "—", entryTime = "", exitTime = "",
    handle = "@trader", code = "TRADER", link = "https://tradecafe.ai",
    spark = [22, 28, 24, 34, 30, 44, 40, 52, 48, 64, 58, 76, 70, 92],
  } = data;
  const up = !String(pnl).trim().startsWith("-");
  const accent = up ? "#1FB8A6" : "#F23645";
  const W = 380, H = 600;

  // sparkline
  const max = Math.max(...spark), min = Math.min(...spark);
  const x0 = 26, x1 = W - 26, y0 = 320, y1 = 232;
  const pts = spark.map((v, i) => {
    const x = x0 + (i / (spark.length - 1)) * (x1 - x0);
    const y = y0 - ((v - min) / (max - min || 1)) * (y0 - y1);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const last = pts[pts.length - 1].split(",");

  // QR
  const n = 25, qs = 4.4, qx = W - 26 - n * qs, qy = H - 26 - n * qs;
  const mat = qrMatrix(link, n);
  let qr = `<rect x="${qx - 7}" y="${qy - 7}" width="${n * qs + 14}" height="${n * qs + 14}" rx="10" fill="#ffffff"/>`;
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++)
      if (mat[r][c]) qr += `<rect x="${(qx + c * qs).toFixed(2)}" y="${(qy + r * qs).toFixed(2)}" width="${qs}" height="${qs}" rx="0.8" fill="#06181c"/>`;

  const pill = `${dir}${leverage ? ` · ${leverage}×` : ""}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Geist, Manrope, sans-serif">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#072a30"/><stop offset="0.45" stop-color="#050d11"/><stop offset="1" stop-color="#06181c"/>
    </linearGradient>
    <radialGradient id="glow" cx="0" cy="0" r="1"><stop offset="0" stop-color="${accent}" stop-opacity="0.28"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient>
    <linearGradient id="spk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${accent}" stop-opacity="0.35"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></linearGradient>
  </defs>
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="24" fill="url(#bg)" stroke="${accent}" stroke-opacity="0.4"/>
  <rect x="${W - 220}" y="-40" width="260" height="220" fill="url(#glow)"/>

  <!-- header -->
  <circle cx="38" cy="42" r="11" fill="none" stroke="${accent}" stroke-width="2.4"/>
  <circle cx="38" cy="42" r="4" fill="${accent}"/>
  <text x="58" y="47" font-size="16" font-weight="700" fill="#F5F6F2">TradeCafe</text>
  <rect x="${W - 150}" y="30" width="124" height="26" rx="13" fill="none" stroke="${accent}" stroke-opacity="0.5"/>
  <text x="${W - 88}" y="47" font-size="12" font-weight="600" letter-spacing="1" fill="${accent}" text-anchor="middle">${esc(pill)}</text>

  <!-- symbol + pnl -->
  <text x="26" y="118" font-size="34" font-weight="700" fill="#F5F6F2">${esc(sym)}</text>
  <text x="24" y="196" font-size="64" font-weight="800" letter-spacing="-2" fill="${accent}">${esc(pnl)}</text>

  <!-- sparkline -->
  <polygon points="${x0},${y0} ${pts.join(" ")} ${x1},${y0}" fill="url(#spk)"/>
  <polyline points="${pts.join(" ")}" fill="none" stroke="${accent}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
  <circle cx="${last[0]}" cy="${last[1]}" r="4.5" fill="${accent}"/>
  <circle cx="${last[0]}" cy="${last[1]}" r="9" fill="${accent}" fill-opacity="0.25"/>

  <!-- entry / exit -->
  <text x="26" y="372" font-size="10" letter-spacing="1.5" fill="#ffffff" fill-opacity="0.4">ENTRY</text>
  <text x="26" y="394" font-size="17" font-weight="600" fill="#F5F6F2">${esc(entry)}</text>
  <text x="26" y="412" font-size="10" fill="#ffffff" fill-opacity="0.4">${esc(entryTime)}</text>
  <text x="${W - 26}" y="372" font-size="10" letter-spacing="1.5" fill="#ffffff" fill-opacity="0.4" text-anchor="end">${up ? "EXIT / TARGET" : "EXIT"}</text>
  <text x="${W - 26}" y="394" font-size="17" font-weight="600" fill="#F5F6F2" text-anchor="end">${esc(exit)}</text>
  <text x="${W - 26}" y="412" font-size="10" fill="#ffffff" fill-opacity="0.4" text-anchor="end">${esc(exitTime)}</text>

  <line x1="26" y1="436" x2="${W - 26}" y2="436" stroke="#ffffff" stroke-opacity="0.08"/>

  <!-- footer: tagline + QR -->
  <text x="26" y="${H - 92}" font-size="15" font-weight="700" fill="#F5F6F2">TradeCafe</text>
  <text x="26" y="${H - 72}" font-size="11" fill="#ffffff" fill-opacity="0.5">Trade Smarter.</text>
  <text x="26" y="${H - 56}" font-size="11" fill="#ffffff" fill-opacity="0.5">Earn Steadier. Sleep Better.</text>
  <text x="26" y="${H - 28}" font-size="11" fill="${accent}" font-weight="600">${esc(handle)} · ref ${esc(code)}</text>

  <rect x="${qx - 7}" y="${qy - 34}" width="${n * qs + 14}" height="22" rx="11" fill="${accent}"/>
  <text x="${qx + (n * qs) / 2}" y="${qy - 19}" font-size="11" font-weight="700" fill="#042024" text-anchor="middle">Get 7 days free!</text>
  ${qr}
</svg>`;
}

export function svgToPngBlob(svg, scale = 2) {
  return new Promise((resolve, reject) => {
    const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.width * scale;
      c.height = img.height * scale;
      const ctx = c.getContext("2d");
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      c.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png");
    };
    img.onerror = reject;
    img.src = url;
  });
}
