// Deterministic-ish mock OHLC generator for the terminal preview.
// Seeded per symbol so each symbol looks consistent across renders.
function seeded(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

const BASE = {
  BTCUSDT: 67000,
  ETHUSDT: 3500,
  SOLUSDT: 184,
  AVAXUSDT: 42,
  ARBUSDT: 1.24,
  LINKUSDT: 14.9,
  DOTUSDT: 6.2,
};

const TF_SECONDS = {
  "1m": 60,
  "5m": 300,
  "15m": 900,
  "1H": 3600,
  "4H": 14400,
  "1D": 86400,
};

export function genCandles(symbol = "BTCUSDT", tf = "1H", count = 160) {
  const rnd = seeded((symbol.charCodeAt(0) + symbol.length * 17) * (TF_SECONDS[tf] || 3600));
  const step = TF_SECONDS[tf] || 3600;
  const now = Math.floor(Date.now() / 1000);
  const start = now - step * count;
  let price = BASE[symbol] || 100;
  const vol = price * 0.012;

  const candles = [];
  for (let i = 0; i < count; i++) {
    const drift = (rnd() - 0.48) * vol;
    const open = price;
    const close = Math.max(0.0001, open + drift);
    const high = Math.max(open, close) + rnd() * vol * 0.6;
    const low = Math.min(open, close) - rnd() * vol * 0.6;
    candles.push({
      time: start + i * step,
      open: round(open),
      high: round(high),
      low: round(low),
      close: round(close),
    });
    price = close;
  }
  return candles;
}

function round(n) {
  if (n >= 1000) return Math.round(n * 100) / 100;
  if (n >= 1) return Math.round(n * 10000) / 10000;
  return Math.round(n * 1000000) / 1000000;
}
