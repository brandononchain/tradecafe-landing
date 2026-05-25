// Mock data for the TradeCafe dashboard — mirrors the live platform values.
// Replace with API wiring when the backend is connected.

export const ACCOUNT = {
  username: "brandononchain",
  memberSince: "Feb 24, 2026",
  email: "brandononchain@gmail.com",
  language: "English",
  balance: 0.0,
  currency: "USDT",
  twoFA: false,
  referrer: null,
  wallet: "0x71...62fe",
  walletFull: "0x716F43Ac0F0b8DF569F7c91D2229cC2ec87A62fe",
};

export const STATS = [
  { key: "analyses", label: "Total Analyses", value: "787", sub: null, accent: "white" },
  { key: "trades", label: "Total Trades", value: "37", sub: null, accent: "white" },
  { key: "signal", label: "Signal Profit", value: "15.95%", sub: "253.90 USDT", accent: "teal", up: true },
  { key: "trade", label: "Trade Profit", value: "5.33%", sub: "38.7 USDT", accent: "teal", up: true },
];

export const SUBSCRIPTIONS = [
  { name: "Signal Bot", status: "Active", next: "Apr 26, 2027" },
  { name: "Trade Bot", status: "Active", next: "Apr 26, 2027" },
];

export const ANALYSIS = {
  winRate: 99,
  totalQuantity: 787,
  pnl: "15.95%",
  config: {
    market: "Crypto",
    strategies: ["Swing (Futures)", "Scalping (Futures)"],
    symbols: ["AAVEUSDT", "ADAUSDT", "ALGOUSDT", "ALICEUSDT"],
    symbolsMore: 103,
  },
};

export const TRADING = {
  winRate: 100,
  totalQuantity: 37,
  pnl: "5.33%",
  config: {
    strategies: "Futures",
    symbols: ["AAVEUSDT", "ADAUSDT", "ALGOUSDT", "ALICEUSDT"],
    symbolsMore: 103,
    tradeMode: "Full Auto",
  },
};

// Cumulative position count over the analysis window (matches screenshot curve).
export const POSITIONS_SERIES = [
  { t: "16 Apr", v: 4 },
  { t: "20 Apr", v: 18 },
  { t: "24 Apr", v: 42 },
  { t: "28 Apr", v: 88 },
  { t: "02 May", v: 150 },
  { t: "06 May", v: 248 },
  { t: "10 May", v: 372 },
  { t: "14 May", v: 498 },
  { t: "18 May", v: 612 },
  { t: "22 May", v: 712 },
  { t: "24 May", v: 787 },
];

export const PNL_SERIES = [
  { t: "16 Apr", v: 0.2 },
  { t: "20 Apr", v: 1.1 },
  { t: "24 Apr", v: 0.8 },
  { t: "28 Apr", v: 2.4 },
  { t: "02 May", v: 1.6 },
  { t: "06 May", v: 3.2 },
  { t: "10 May", v: 2.1 },
  { t: "14 May", v: 5.8 },
  { t: "18 May", v: 92.0 },
  { t: "20 May", v: 38.0 },
  { t: "22 May", v: 64.0 },
  { t: "24 May", v: 41.0 },
];

export const TRADING_POSITIONS_SERIES = [
  { t: "18 May", v: 0 },
  { t: "19 May", v: 2 },
  { t: "20 May", v: 6 },
  { t: "21 May", v: 11 },
  { t: "22 May", v: 18 },
  { t: "23 May", v: 27 },
  { t: "24 May", v: 33 },
  { t: "25 May", v: 37 },
];

export const TRADING_PNL_SERIES = [
  { t: "18 May", v: 0.0 },
  { t: "19 May", v: 0.1 },
  { t: "20 May", v: 0.35 },
  { t: "21 May", v: 0.9 },
  { t: "22 May", v: 1.7 },
  { t: "23 May", v: 2.15 },
  { t: "24 May", v: 0.05 },
  { t: "25 May", v: 2.2 },
];

export const ANALYSIS_HISTORY = [
  { sym: "EGLDUSDT", alias: "SC|Futures|10M", type: "LONG", open: "3.879", close: "3.889", openTime: "5/24/26, 4:33 PM", closeTime: "5/24/26, 5:03 PM", pl: "+12.835%" },
  { sym: "ARBUSDT", alias: "SC|Futures|30M", type: "LONG", open: "0.1846", close: "0.1848", openTime: "5/24/26, 4:33 PM", closeTime: "5/24/26, 5:01 PM", pl: "+9.585%" },
  { sym: "NEOUSDT", alias: "SC|Futures|15M", type: "LONG", open: "2.778", close: "2.785", openTime: "5/24/26, 4:35 PM", closeTime: "5/24/26, 4:37 PM", pl: "+12.544%" },
  { sym: "NEOUSDT", alias: "SC|Futures|15M", type: "LONG", open: "2.787", close: "2.794", openTime: "5/24/26, 4:35 PM", closeTime: "5/24/26, 4:35 PM", pl: "+12.503%" },
  { sym: "ARBUSDT", alias: "SC|Futures|30M", type: "LONG", open: "0.1846", close: "0.1848", openTime: "5/24/26, 4:30 PM", closeTime: "5/24/26, 4:31 PM", pl: "+9.585%" },
  { sym: "DOTUSDT", alias: "SW|Futures|1H", type: "LONG", open: "6.124", close: "6.201", openTime: "5/24/26, 3:58 PM", closeTime: "5/24/26, 4:22 PM", pl: "+8.112%" },
  { sym: "LINKUSDT", alias: "SC|Futures|15M", type: "LONG", open: "14.82", close: "14.91", openTime: "5/24/26, 3:40 PM", closeTime: "5/24/26, 3:52 PM", pl: "+6.073%" },
];

export const TRADING_HISTORY = [
  { sym: "EGLDUSDT", alias: "SW|Futures|10M", type: "LONG", open: "3.8897434", close: "3.89167206", openTime: "5/24/26, 4:29 PM", closeTime: "5/24/26, 5:06 PM", pl: "+11.633%" },
  { sym: "NEOUSDT", alias: "SW|Futures|15M", type: "LONG", open: "2.79046241", close: "2.796", openTime: "5/24/26, 4:33 PM", closeTime: "5/24/26, 5:05 PM", pl: "+9.938%" },
  { sym: "SNXUSDT", alias: "SW|Futures|30M", type: "LONG", open: "0.2983821", close: "0.2985", openTime: "5/24/26, 2:29 PM", closeTime: "5/24/26, 2:38 PM", pl: "+1.977%" },
  { sym: "ILVUSDT", alias: "SW|Futures|4H", type: "LONG", open: "4.218", close: "4.25259426", openTime: "5/24/26, 9:18 AM", closeTime: "5/24/26, 9:54 AM", pl: "+20.533%" },
  { sym: "APEUSDT", alias: "SW|Futures|10M", type: "LONG", open: "0.1363", close: "0.13609463", openTime: "5/24/26, 9:12 AM", closeTime: "5/24/26, 9:47 AM", pl: "+3.052%" },
  { sym: "FILUSDT", alias: "SW|Futures|1H", type: "LONG", open: "5.812", close: "5.901", openTime: "5/24/26, 8:02 AM", closeTime: "5/24/26, 8:44 AM", pl: "+7.214%" },
];

export const AI_INSIGHTS = [
  { t: "now", text: "BTC volatility regime shift detected — tightening stops by 12%." },
  { t: "2m", text: "Routing 3 signals through high-confidence filter (conf > 85%)." },
  { t: "8m", text: "ETH momentum cluster forming on 4H — partial entry executed." },
  { t: "14m", text: "Risk model dampened SOL exposure after correlation spike." },
];

// ===== Terminal =====
export const WATCHLIST = [
  { sym: "BTCUSDT", last: "67,420.50", chg: "+2.41%", up: true },
  { sym: "ETHUSDT", last: "3,512.18", chg: "+1.83%", up: true },
  { sym: "SOLUSDT", last: "184.62", chg: "-0.94%", up: false },
  { sym: "AVAXUSDT", last: "42.81", chg: "+3.22%", up: true },
  { sym: "ARBUSDT", last: "1.2460", chg: "+0.61%", up: true },
  { sym: "LINKUSDT", last: "14.91", chg: "+1.12%", up: true },
  { sym: "DOTUSDT", last: "6.201", chg: "-0.42%", up: false },
];

export const OPEN_POSITIONS = [
  { sym: "BTCUSDT", side: "LONG", size: "0.42", entry: "65,940", mark: "67,420", pnl: "+$621.60", pct: "+2.24%", up: true },
  { sym: "ETHUSDT", side: "LONG", size: "4.10", entry: "3,448", mark: "3,512", pnl: "+$262.40", pct: "+1.85%", up: true },
  { sym: "SOLUSDT", side: "SHORT", size: "18.0", entry: "186.40", mark: "184.62", pnl: "+$32.04", pct: "+0.95%", up: true },
];

export const TIMEFRAMES = ["1m", "5m", "15m", "1H", "4H", "1D"];

// ===== Signals =====
export const SIGNALS = [
  { sym: "BTCUSDT", dir: "LONG", strat: "Swing", tf: "4H", price: "67,420.50", target: "69,800", stop: "65,200", conf: 92, time: "12s" },
  { sym: "ETHUSDT", dir: "LONG", strat: "Scalp", tf: "15M", price: "3,512.18", target: "3,640", stop: "3,440", conf: 88, time: "1m" },
  { sym: "SOLUSDT", dir: "SHORT", strat: "Scalp", tf: "5M", price: "184.62", target: "178.20", stop: "188.90", conf: 76, time: "3m" },
  { sym: "AVAXUSDT", dir: "LONG", strat: "Swing", tf: "1H", price: "42.81", target: "45.60", stop: "41.10", conf: 84, time: "6m" },
  { sym: "ARBUSDT", dir: "LONG", strat: "Scalp", tf: "30M", price: "1.2460", target: "1.310", stop: "1.205", conf: 71, time: "11m" },
  { sym: "LINKUSDT", dir: "LONG", strat: "Swing", tf: "4H", price: "14.91", target: "16.20", stop: "14.10", conf: 81, time: "18m" },
  { sym: "DOTUSDT", dir: "SHORT", strat: "Scalp", tf: "15M", price: "6.201", target: "5.880", stop: "6.380", conf: 69, time: "24m" },
];

// ===== Bots / Automation =====
export const BOTS = [
  {
    key: "signal", name: "Signal Bot", status: "Active", next: "Apr 26, 2027",
    desc: "Scans markets 24/7 and streams high-confidence entries to your feed.",
    metrics: [{ k: "Signals", v: "8,782" }, { k: "Win Rate", v: "99%" }, { k: "Profit", v: "+15.95%" }],
  },
  {
    key: "trade", name: "Trade Bot", status: "Active", next: "Apr 26, 2027",
    desc: "Executes your strategy hands-free with built-in risk guardrails.",
    metrics: [{ k: "Trades", v: "37" }, { k: "Win Rate", v: "100%" }, { k: "Profit", v: "+5.33%" }],
  },
];

// ===== Pool =====
export const POOL = {
  apy: 10,
  aum: "$3.12M",
  lps: 412,
  mtd: "+18.4%",
  myDeposit: 0,
  series: POSITIONS_SERIESLIKE(),
};
function POSITIONS_SERIESLIKE() {
  return [
    { t: "Wk 1", v: 2.1 }, { t: "Wk 2", v: 2.6 }, { t: "Wk 3", v: 1.9 },
    { t: "Wk 4", v: 3.2 }, { t: "Wk 5", v: 2.8 }, { t: "Wk 6", v: 3.6 },
  ];
}

// ===== VITRIOL =====
export const VITRIOL = {
  balance: 0.0,
  usd: 0.0,
  staked: 0.0,
  rewards: 0.0,
  apr: 24,
  price: "0.0142",
  wallet: "0x716F43Ac0F0b8DF569F7c91D2229cC2ec87A62fe",
  history: [
    { type: "Reward", amount: "+0.00", date: "—", status: "Pending" },
  ],
};

// ===== Affiliate =====
export const AFFILIATE = {
  rankIndex: 2,
  ranks: ["Member", "Bronze", "Silver", "Gold", "Platinum", "Diamond", "Elite"],
  referralCode: "BRANDON8",
  referralUrl: "https://tradecafe.ai/join?ref=BRANDON8",
  stats: [
    { k: "Direct Referrals", v: "24" },
    { k: "Network Size", v: "1,284" },
    { k: "Total Earned", v: "$3,120" },
    { k: "Unpaid", v: "$284" },
  ],
  recent: [
    { user: "alex***", tier: "Direct", joined: "2d ago", earned: "+$42.00" },
    { user: "mira***", tier: "Direct", joined: "4d ago", earned: "+$28.50" },
    { user: "jun***", tier: "Tier 2", joined: "6d ago", earned: "+$12.10" },
    { user: "kofi***", tier: "Tier 2", joined: "9d ago", earned: "+$9.80" },
  ],
};

// ===== Subscriptions =====
export const PLANS = [
  {
    name: "Signal Bot", price: "$49", period: "/mo", active: true,
    features: ["24/7 AI signal feed", "Confidence scoring", "Push & webhook alerts", "Mining Pool eligibility"],
  },
  {
    name: "Trade Bot", price: "$99", period: "/mo", active: true, featured: true,
    features: ["Everything in Signal Bot", "Hands-free execution", "Risk guardrails", "Multi-exchange API"],
  },
  {
    name: "Trading Terminal", price: "$149", period: "/mo", active: false,
    features: ["Pro charts & indicators", "One-click execution", "Position manager", "Priority support"],
  },
];

export const INVOICES = [
  { id: "INV-20482", item: "Signal Bot · 12mo", amount: "$490.00", date: "Apr 26, 2026", status: "Paid" },
  { id: "INV-20471", item: "Trade Bot · 12mo", amount: "$990.00", date: "Apr 26, 2026", status: "Paid" },
];
