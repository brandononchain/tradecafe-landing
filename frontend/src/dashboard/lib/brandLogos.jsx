// Self-contained brand marks for exchanges, TradFi brokers, and Web3 wallets.
// Rendered as inline SVG (geometric brands) or branded monogram tiles
// (wordmark brands) so they work offline, stay theme-aware, and never break.

export const BRANDS = {
  // ---- Crypto exchanges (CEX) ----
  binance: { name: "Binance", color: "#F0B90B" },
  bybit: { name: "Bybit", color: "#F7A600", mark: "B" },
  bitget: { name: "Bitget", color: "#00E0CE", mark: "B" },
  okx: { name: "OKX", color: "#C9CDD4" },
  weex: { name: "WEEX", color: "#00E0A0", mark: "W" },
  bingx: { name: "BingX", color: "#2B6FF6", mark: "B" },
  kucoin: { name: "KuCoin", color: "#24AE8F", mark: "K" },

  // ---- TradFi / FX brokers ----
  ibkr: { name: "Interactive Brokers", color: "#D81222", mark: "IB" },
  oanda: { name: "OANDA", color: "#C8102E", mark: "O" },
  forexcom: { name: "Forex.com", color: "#0B82C8", mark: "FX" },
  ig: { name: "IG", color: "#E4002B", mark: "IG" },
  pepperstone: { name: "Pepperstone", color: "#E2231A", mark: "P" },
  saxo: { name: "Saxo", color: "#3C77C2", mark: "S" },

  // ---- Web3 wallets ----
  metamask: { name: "MetaMask", color: "#E2761B", mark: "M" },
  phantom: { name: "Phantom", color: "#AB9FF2" },
  coinbase: { name: "Coinbase", color: "#0052FF" },
  rabby: { name: "Rabby", color: "#7084FF", mark: "R" },
  solflare: { name: "Solflare", color: "#FC8E2B" },
  backpack: { name: "Backpack", color: "#E33E3F" },
  injected: { name: "Browser Wallet", color: "#1FB8A6" },
};

export const brandColor = (id) => BRANDS[id]?.color || "#1FB8A6";
export const brandName = (id) => BRANDS[id]?.name || id;

// Geometric brand glyphs (inherit `currentColor`).
const GLYPHS = {
  coinbase: (
    <path fillRule="evenodd" clipRule="evenodd"
      d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.4 6.2h2.8a2.4 2.4 0 0 1 2.4 2.4v2.8a2.4 2.4 0 0 1-2.4 2.4h-2.8a2.4 2.4 0 0 1-2.4-2.4V10.6a2.4 2.4 0 0 1 2.4-2.4Z" />
  ),
  binance: (
    <>
      <path d="M12 4.3l2.4 2.4L12 9.1 9.6 6.7 12 4.3Z" />
      <path d="M6.7 9.6l2.4 2.4L6.7 14.4 4.3 12l2.4-2.4Z" />
      <path d="M17.3 9.6L19.7 12l-2.4 2.4L14.9 12l2.4-2.4Z" />
      <path d="M12 14.9l2.4 2.4L12 19.7l-2.4-2.4L12 14.9Z" />
      <path d="M12 9.7L14.3 12 12 14.3 9.7 12 12 9.7Z" />
    </>
  ),
  okx: (
    <>
      <rect x="2.6" y="2.6" width="5.6" height="5.6" rx="1" />
      <rect x="15.8" y="2.6" width="5.6" height="5.6" rx="1" />
      <rect x="9.2" y="9.2" width="5.6" height="5.6" rx="1" />
      <rect x="2.6" y="15.8" width="5.6" height="5.6" rx="1" />
      <rect x="15.8" y="15.8" width="5.6" height="5.6" rx="1" />
    </>
  ),
  phantom: (
    <path fillRule="evenodd" clipRule="evenodd"
      d="M12 3.2c-4.6 0-8.3 3.7-8.3 8.3v6.7c0 1 1.2 1.5 1.9.8l1.3-1.3c.3-.3.8-.3 1.1 0l1.1 1.1c.3.3.8.3 1.1 0l1.1-1.1c.3-.3.8-.3 1.1 0l1.1 1.1c.3.3.8.3 1.1 0l1.3 1.3c.7.7 1.9.2 1.9-.8v-6.6c0-4.6-3.7-8.3-8.3-8.3Zm-2.9 7a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8Zm5.5 0a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8Z" />
  ),
  solflare: (
    <>
      <circle cx="12" cy="12" r="3.4" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <rect key={a} x="11.2" y="2" width="1.6" height="3.2" rx="0.8" transform={`rotate(${a} 12 12)`} />
      ))}
    </>
  ),
  backpack: (
    <>
      <path d="M9 6a3 3 0 0 1 6 0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path fillRule="evenodd" clipRule="evenodd"
        d="M9 5.6h6a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4v-6a4 4 0 0 1 4-4Zm-0.5 8a1.5 1.5 0 0 0-1.5 1.5v.8a1.5 1.5 0 0 0 1.5 1.5h7a1.5 1.5 0 0 0 1.5-1.5v-.8a1.5 1.5 0 0 0-1.5-1.5h-7Z" />
    </>
  ),
  injected: (
    <>
      <path d="M4 8a2.5 2.5 0 0 1 2.5-2.5H16A2.5 2.5 0 0 1 18.4 8H6.5a.5.5 0 0 0 0 1H19a1.5 1.5 0 0 1 1.5 1.5V17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z" />
      <circle cx="16.6" cy="13" r="1.3" fill="#042024" />
    </>
  ),
};

export function BrandLogo({ id, size = 30, radius }) {
  const b = BRANDS[id] || { name: id, color: "#1FB8A6" };
  const glyph = GLYPHS[id];
  return (
    <span aria-hidden="true" className="inline-flex items-center justify-center shrink-0"
      style={{
        width: size, height: size, borderRadius: radius ?? Math.round(size * 0.32),
        background: `${b.color}1F`, border: `1px solid ${b.color}40`, color: b.color,
      }}>
      {glyph ? (
        <svg viewBox="0 0 24 24" width={Math.round(size * 0.62)} height={Math.round(size * 0.62)} fill="currentColor">
          {glyph}
        </svg>
      ) : (
        <span className="font-heading font-bold" style={{ fontSize: Math.round(size * 0.4), color: b.color, letterSpacing: "-0.02em" }}>
          {b.mark || b.name[0]}
        </span>
      )}
    </span>
  );
}
