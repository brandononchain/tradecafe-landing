// Indicator calculations for the terminal. Inputs are candle arrays
// ({ time, open, high, low, close, volume }); outputs are arrays of
// { time, value } (or multi-series objects) aligned to candle times.

export const OVERLAYS = [
  { key: "SMA", label: "SMA", defaults: { period: 20 } },
  { key: "EMA", label: "EMA", defaults: { period: 20 } },
  { key: "WMA", label: "WMA", defaults: { period: 20 } },
  { key: "BB", label: "Bollinger Bands", defaults: { period: 20, mult: 2 } },
  { key: "VWAP", label: "VWAP", defaults: {} },
];

export const OSCILLATORS = [
  { key: "RSI", label: "RSI", defaults: { period: 14 } },
  { key: "MACD", label: "MACD", defaults: { fast: 12, slow: 26, signal: 9 } },
  { key: "VOL", label: "Volume", defaults: {} },
];

const src = (c) => c.close;

export function sma(candles, period = 20) {
  const out = [];
  let sum = 0;
  for (let i = 0; i < candles.length; i++) {
    sum += src(candles[i]);
    if (i >= period) sum -= src(candles[i - period]);
    if (i >= period - 1) out.push({ time: candles[i].time, value: round(sum / period) });
  }
  return out;
}

export function ema(candles, period = 20) {
  const out = [];
  const k = 2 / (period + 1);
  let prev;
  for (let i = 0; i < candles.length; i++) {
    const v = src(candles[i]);
    prev = i === 0 ? v : v * k + prev * (1 - k);
    if (i >= period - 1) out.push({ time: candles[i].time, value: round(prev) });
  }
  return out;
}

export function wma(candles, period = 20) {
  const out = [];
  const denom = (period * (period + 1)) / 2;
  for (let i = period - 1; i < candles.length; i++) {
    let acc = 0;
    for (let j = 0; j < period; j++) acc += src(candles[i - j]) * (period - j);
    out.push({ time: candles[i].time, value: round(acc / denom) });
  }
  return out;
}

export function bollinger(candles, period = 20, mult = 2) {
  const mid = sma(candles, period);
  const upper = [];
  const lower = [];
  const offset = period - 1;
  for (let i = 0; i < mid.length; i++) {
    const slice = candles.slice(i, i + period).map(src);
    const m = mid[i].value;
    const variance = slice.reduce((a, x) => a + (x - m) ** 2, 0) / period;
    const sd = Math.sqrt(variance) * mult;
    upper.push({ time: candles[i + offset].time, value: round(m + sd) });
    lower.push({ time: candles[i + offset].time, value: round(m - sd) });
  }
  return { upper, middle: mid, lower };
}

export function vwap(candles) {
  const out = [];
  let pv = 0;
  let vol = 0;
  for (const c of candles) {
    const typical = (c.high + c.low + c.close) / 3;
    const v = c.volume || 1;
    pv += typical * v;
    vol += v;
    out.push({ time: c.time, value: round(pv / vol) });
  }
  return out;
}

export function rsi(candles, period = 14) {
  const out = [];
  let gain = 0;
  let loss = 0;
  for (let i = 1; i < candles.length; i++) {
    const diff = src(candles[i]) - src(candles[i - 1]);
    const g = Math.max(diff, 0);
    const l = Math.max(-diff, 0);
    if (i <= period) {
      gain += g;
      loss += l;
      if (i === period) {
        gain /= period;
        loss /= period;
        out.push({ time: candles[i].time, value: rsiVal(gain, loss) });
      }
    } else {
      gain = (gain * (period - 1) + g) / period;
      loss = (loss * (period - 1) + l) / period;
      out.push({ time: candles[i].time, value: rsiVal(gain, loss) });
    }
  }
  return out;
}
const rsiVal = (g, l) => round(l === 0 ? 100 : 100 - 100 / (1 + g / l));

export function macd(candles, fast = 12, slow = 26, signal = 9) {
  const emaFast = emaSeries(candles.map(src), fast);
  const emaSlow = emaSeries(candles.map(src), slow);
  const macdLine = [];
  for (let i = 0; i < candles.length; i++) {
    if (emaFast[i] == null || emaSlow[i] == null) continue;
    macdLine.push({ time: candles[i].time, value: round(emaFast[i] - emaSlow[i]) });
  }
  const sig = emaSeries(macdLine.map((d) => d.value), signal).map((v, i) =>
    v == null ? null : { time: macdLine[i].time, value: round(v) }
  ).filter(Boolean);
  const sigStart = macdLine.length - sig.length;
  const hist = sig.map((s, i) => ({
    time: s.time,
    value: round(macdLine[sigStart + i].value - s.value),
  }));
  return { macd: macdLine, signal: sig, histogram: hist };
}

function emaSeries(values, period) {
  const k = 2 / (period + 1);
  const out = [];
  let prev;
  for (let i = 0; i < values.length; i++) {
    prev = i === 0 ? values[i] : values[i] * k + prev * (1 - k);
    out.push(i >= period - 1 ? prev : null);
  }
  return out;
}

export function volumeSeries(candles) {
  return candles.map((c) => ({
    time: c.time,
    value: c.volume || 0,
    color: c.close >= c.open ? "rgba(31,184,166,0.5)" : "rgba(242,54,69,0.5)",
  }));
}

// ===== Simple AI analysis: swing-based support/resistance + pivots =====
export function supportResistance(candles, lookback = 5) {
  const levels = [];
  for (let i = lookback; i < candles.length - lookback; i++) {
    const h = candles[i].high;
    const l = candles[i].low;
    let isHigh = true;
    let isLow = true;
    for (let j = 1; j <= lookback; j++) {
      if (candles[i - j].high >= h || candles[i + j].high >= h) isHigh = false;
      if (candles[i - j].low <= l || candles[i + j].low <= l) isLow = false;
    }
    if (isHigh) levels.push({ price: h, type: "resistance" });
    if (isLow) levels.push({ price: l, type: "support" });
  }
  return levels.slice(-6);
}

export function pivotPoints(candles) {
  const last = candles[candles.length - 1];
  const recent = candles.slice(-24);
  const high = Math.max(...recent.map((c) => c.high));
  const low = Math.min(...recent.map((c) => c.low));
  const close = last.close;
  const p = (high + low + close) / 3;
  return [
    { label: "R2", price: round(p + (high - low)) },
    { label: "R1", price: round(2 * p - low) },
    { label: "P", price: round(p) },
    { label: "S1", price: round(2 * p - high) },
    { label: "S2", price: round(p - (high - low)) },
  ];
}

function round(n) {
  if (Math.abs(n) >= 1000) return Math.round(n * 100) / 100;
  if (Math.abs(n) >= 1) return Math.round(n * 10000) / 10000;
  return Math.round(n * 1000000) / 1000000;
}
