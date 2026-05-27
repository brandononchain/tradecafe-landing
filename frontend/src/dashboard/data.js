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
// ===== Exchanges (integrated) =====
export const EXCHANGES = [
  { key: "binance", name: "Binance", count: 612 },
  { key: "bybit", name: "Bybit", count: 487 },
  { key: "bitget", name: "BitGet", count: 421 },
  { key: "okx", name: "OKX", count: 534 },
  { key: "weex", name: "Weex", count: 198 },
  { key: "bingx", name: "BingX", count: 356 },
  { key: "kucoin", name: "KuCoin", count: 503 },
];

// Trading instruments. `cat`: Spot | Futures | Stocks.
export const WATCHLIST = [
  { sym: "BTCUSDT", name: "Bitcoin", last: "67,420.50", chg: "+2.41%", up: true, cat: "Spot" },
  { sym: "ETHUSDT", name: "Ethereum", last: "3,512.18", chg: "+1.83%", up: true, cat: "Spot" },
  { sym: "SOLUSDT", name: "Solana", last: "184.62", chg: "-0.94%", up: false, cat: "Spot" },
  { sym: "BNBUSDT", name: "BNB", last: "658.06", chg: "+0.03%", up: true, cat: "Spot" },
  { sym: "XRPUSDT", name: "XRP", last: "1.3399", chg: "-0.81%", up: false, cat: "Spot" },
  { sym: "ADAUSDT", name: "Cardano", last: "0.4214", chg: "-0.33%", up: false, cat: "Spot" },
  { sym: "AVAXUSDT", name: "Avalanche", last: "42.81", chg: "+3.22%", up: true, cat: "Spot" },
  { sym: "DOGEUSDT", name: "Dogecoin", last: "0.10102", chg: "-1.39%", up: false, cat: "Spot" },
  { sym: "LINKUSDT", name: "Chainlink", last: "14.91", chg: "+1.12%", up: true, cat: "Spot" },
  { sym: "DOTUSDT", name: "Polkadot", last: "6.201", chg: "-0.42%", up: false, cat: "Spot" },
  { sym: "ARBUSDT", name: "Arbitrum", last: "1.2460", chg: "+0.61%", up: true, cat: "Spot" },
  { sym: "MATICUSDT", name: "Polygon", last: "0.7184", chg: "+2.04%", up: true, cat: "Spot" },
  { sym: "ATOMUSDT", name: "Cosmos", last: "9.842", chg: "-0.58%", up: false, cat: "Spot" },
  { sym: "NEARUSDT", name: "NEAR", last: "6.731", chg: "+4.11%", up: true, cat: "Spot" },
  { sym: "OPUSDT", name: "Optimism", last: "2.418", chg: "+1.27%", up: true, cat: "Spot" },
  { sym: "SUIUSDT", name: "Sui", last: "3.842", chg: "+5.63%", up: true, cat: "Spot" },
  { sym: "BTCUSDT.P", name: "Bitcoin Perp", last: "67,448.10", chg: "+2.39%", up: true, cat: "Futures" },
  { sym: "ETHUSDT.P", name: "Ethereum Perp", last: "3,513.40", chg: "+1.81%", up: true, cat: "Futures" },
  { sym: "SOLUSDT.P", name: "Solana Perp", last: "184.71", chg: "-0.90%", up: false, cat: "Futures" },
  { sym: "COMPUSDT", name: "Compound", last: "19.29", chg: "-4.08%", up: false, cat: "Futures" },
  { sym: "INJUSDT.P", name: "Injective Perp", last: "24.18", chg: "+2.92%", up: true, cat: "Futures" },
  { sym: "AAPL", name: "Apple Inc.", last: "228.52", chg: "+0.74%", up: true, cat: "Stocks" },
  { sym: "TSLA", name: "Tesla Inc.", last: "344.18", chg: "-1.22%", up: false, cat: "Stocks" },
  { sym: "NVDA", name: "NVIDIA Corp.", last: "138.07", chg: "+2.18%", up: true, cat: "Stocks" },
  { sym: "AMZN", name: "Amazon.com", last: "207.89", chg: "+0.41%", up: true, cat: "Stocks" },
  { sym: "MSFT", name: "Microsoft", last: "428.15", chg: "-0.18%", up: false, cat: "Stocks" },
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

// ===== Bot configuration (Analysis + Trade bots) =====
export const BOT_MARKETS = [
  { id: "crypto", title: "Crypto", desc: "Spot & perpetual futures", enabled: true },
  { id: "forex", title: "Forex", desc: "Major & minor FX pairs", enabled: false },
  { id: "stocks", title: "Stocks", desc: "US equities & ETFs", enabled: false },
  { id: "commodities", title: "Commodities", desc: "Metals & energy", enabled: false },
];

export const STRATEGIES = [
  { id: "sw-f", name: "Swing", desc: "Multi-day trend continuation entries.", mode: "Futures", market: "Crypto" },
  { id: "sc-f", name: "Scalping", desc: "Fast intraday momentum scalps.", mode: "Futures", market: "Crypto" },
  { id: "br-f", name: "Breakout", desc: "Range breakouts with volume confirmation.", mode: "Futures", market: "Crypto" },
  { id: "mo-f", name: "Momentum", desc: "Trend-following on strong movers.", mode: "Futures", market: "Crypto" },
  { id: "sw-s", name: "Swing", desc: "Spot accumulation on pullbacks.", mode: "Spot", market: "Crypto" },
  { id: "mr-s", name: "Mean Reversion", desc: "Buy oversold, sell overbought.", mode: "Spot", market: "Crypto" },
  { id: "gr-s", name: "Grid", desc: "Automated range grid orders.", mode: "Spot", market: "Crypto" },
  { id: "dca-s", name: "DCA", desc: "Scheduled dollar-cost averaging.", mode: "Spot", market: "Crypto" },
];

export const SYMBOL_POOL = [
  "AAVEUSDT", "ADAUSDT", "ALGOUSDT", "ALICEUSDT", "APTUSDT", "ARBUSDT", "ATOMUSDT", "AVAXUSDT",
  "AXSUSDT", "BNBUSDT", "BTCUSDT", "COMPUSDT", "DOGEUSDT", "DOTUSDT", "EGLDUSDT", "ENJUSDT",
  "ETHUSDT", "FILUSDT", "GALAUSDT", "ICPUSDT", "ILVUSDT", "INJUSDT", "LINKUSDT", "LTCUSDT",
  "MATICUSDT", "NEARUSDT", "NEOUSDT", "OPUSDT", "RUNEUSDT", "SANDUSDT", "SNXUSDT", "SOLUSDT",
  "SUIUSDT", "UNIUSDT", "XRPUSDT",
];

export const TRADE_MODES = [
  { id: "auto", label: "Full Auto", desc: "Bot opens and closes trades automatically." },
  { id: "semi", label: "Semi-Auto", desc: "Bot prepares trades; you approve each one." },
  { id: "assist", label: "Assistant", desc: "Bot only marks setups on your chart." },
];

// ===== Trade account (API connection) =====
export const API_EXCHANGES = [
  { id: "binance", label: "Binance", enabled: true, passphrase: false },
  { id: "bybit", label: "Bybit", enabled: true, passphrase: false },
  { id: "bitget", label: "Bitget", enabled: true, passphrase: true },
  { id: "okx", label: "OKX", enabled: true, passphrase: true },
  { id: "weex", label: "WEEX", enabled: true, passphrase: false },
  { id: "bingx", label: "BingX", enabled: true, passphrase: false },
  { id: "kucoin", label: "KuCoin", enabled: true, passphrase: true },
];

// TradFi / FX brokers — connect via REST API token + account id.
export const API_BROKERS = [
  { id: "oanda", label: "OANDA", enabled: true, account: true },
  { id: "forexcom", label: "Forex.com", enabled: true, account: true },
  { id: "ibkr", label: "Interactive Brokers", enabled: true, account: true },
  { id: "ig", label: "IG", enabled: false, account: true },
  { id: "pepperstone", label: "Pepperstone", enabled: false, account: true },
  { id: "saxo", label: "Saxo", enabled: false, account: true },
];

export const ACCOUNT_MARKET_TABS = [
  { id: "crypto", label: "Crypto", enabled: true },
  { id: "forex", label: "Forex", enabled: false },
  { id: "stocks", label: "Stocks", enabled: false },
  { id: "commodities", label: "Commodities", enabled: false },
];

export const TRADE_ACCOUNT = {
  connected: true,
  status: "Active",
  exchange: "bybit",
  apiKey: "bg_8aea6dac3a1f4e2b9c77",
  apiKeyExpires: "May 16, 2027",
  wallet: 1210.51,
  unrealized: -29.04,
  available: 1111.03,
};

export const EXCHANGE_GUIDES = {
  bybit: {
    title: "How to create a Bybit API key",
    steps: [
      'Log in to Bybit and open "API Management".',
      'Click "Create New Key" → "System Generated".',
      "Permissions: read + trading only (no withdrawals). Bind an IP if possible.",
      "Choose the Unified account type.",
      "Confirm with 2FA, then copy the API Key and Secret once shown.",
      "Paste both into the form above and save.",
    ],
    note: "Bybit shows the API secret only once. If lost, create a new key.",
  },
};

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

// ===== Mining Pool =====
// A mining contract is created with each product / Trading Pool purchase.
// It pays back rewardPercent of productPrice as VIT, accrued over
// totalRewards daily payouts (currentRewards completed so far).
export const MINING = {
  walletAddress: "TVk7Xm2pQ9rLfWcN8aZ3hYbE6sJ1tUd4o",
  contracts: [
    { id: "m1", source: "Trade Bot", productPrice: 990, rewardPercent: 1.0, totalRewards: 200, currentRewards: 84, active: true },
    { id: "m2", source: "Trading Pool deposit", productPrice: 2000, rewardPercent: 0.6, totalRewards: 180, currentRewards: 36, active: true },
    { id: "m3", source: "Signal Bot", productPrice: 490, rewardPercent: 0.8, totalRewards: 150, currentRewards: 150, active: false },
  ],
  payouts: [
    { date: "May 26, 2026", amountVIT: 9.45, status: "Paid", tx: "0x8f2a…c41d" },
    { date: "May 25, 2026", amountVIT: 9.45, status: "Paid", tx: "0x71b9…a0e2" },
    { date: "May 24, 2026", amountVIT: 9.45, status: "Paid", tx: "0x3cd4…77fa" },
    { date: "May 23, 2026", amountVIT: 9.45, status: "Pending", tx: null },
    { date: "May 22, 2026", amountVIT: 9.45, status: "Paid", tx: "0x55e1…9b2c" },
  ],
};

// ===== Notifications =====
export const NOTIFICATIONS = [
  { id: "n1", type: "signal", title: "New LONG signal · BTCUSDT", body: "Breakout · 88% confidence", time: "2m", unread: true },
  { id: "n2", type: "trade", title: "Trade Bot opened ETHUSDT", body: "Semi-Auto · awaiting your approval", time: "14m", unread: true },
  { id: "n3", type: "pool", title: "Pool payout received", body: "+42.18 USDT distributed to your balance", time: "1h", unread: true },
  { id: "n4", type: "system", title: "2FA reminder", body: "Enable two-factor auth to secure withdrawals", time: "3h", unread: false },
  { id: "n5", type: "affiliate", title: "New referral joined", body: "kofi signed up with your code", time: "1d", unread: false },
];

// ===== Journal / Reports =====
export const JOURNAL = {
  globalMetrics: [
    { k: "Account Balance", v: "$12,480" },
    { k: "Net Return", v: "+$2,914", up: true },
    { k: "Biggest Profit", v: "+$842", up: true },
    { k: "Biggest Loss", v: "-$316", up: false },
    { k: "Win %", v: "78%" },
    { k: "Total Trades", v: "124" },
    { k: "Avg Hold", v: "2h 14m" },
  ],
  exchanges: [
    { name: "Binance", balance: 6240, color: "#F3BA2F" },
    { name: "Bybit", balance: 3880, color: "#F7A600" },
    { name: "OKX", balance: 2360, color: "#9BA6B2" },
  ],
  monthly: [
    { m: "Jan", v: 320 }, { m: "Feb", v: 540 }, { m: "Mar", v: -180 }, { m: "Apr", v: 760 },
    { m: "May", v: 980 }, { m: "Jun", v: 210 }, { m: "Jul", v: -90 }, { m: "Aug", v: 430 },
    { m: "Sep", v: 620 }, { m: "Oct", v: 340 }, { m: "Nov", v: -140 }, { m: "Dec", v: 510 },
  ],
  holdTime: [
    { b: "0-5m", v: 180, n: 12 }, { b: "6-10m", v: 240, n: 18 }, { b: "11-30m", v: 410, n: 24 },
    { b: "31m-1h", v: 320, n: 16 }, { b: "1-4h", v: 680, n: 28 }, { b: "4-9h", v: 240, n: 14 },
    { b: "9-72h", v: -80, n: 8 }, { b: "72h+", v: 120, n: 4 },
  ],
  cumulative: [
    { t: "W1", v: 0 }, { t: "W2", v: 320 }, { t: "W3", v: 540 }, { t: "W4", v: 480 },
    { t: "W5", v: 920 }, { t: "W6", v: 1240 }, { t: "W7", v: 1180 }, { t: "W8", v: 1680 },
    { t: "W9", v: 2120 }, { t: "W10", v: 2460 }, { t: "W11", v: 2680 }, { t: "W12", v: 2914 },
  ],
  metricCards: [
    { k: "Acc. Return Net", v: "+$2,914", pct: 78 },
    { k: "Acc. Return Gross", v: "+$3,180", pct: 82 },
    { k: "Account Balance", v: "$12,480", pct: 64 },
    { k: "Daily Return", v: "+$121", pct: 55 },
    { k: "Return on Winners", v: "+$4,210", pct: 88 },
    { k: "Return on Losers", v: "-$1,296", pct: 32 },
    { k: "Return on Long", v: "+$2,140", pct: 72 },
    { k: "Return on Short", v: "+$774", pct: 48 },
    { k: "Biggest Profit", v: "+$842", pct: 92 },
    { k: "Biggest Loss", v: "-$316", pct: 24 },
    { k: "Profit / Loss Ratio", v: "3.24", pct: 76 },
    { k: "Expectancy", v: "+$23.5", pct: 61 },
  ],
  recentTrades: [
    { status: "WIN", date: "May-24", sym: "EGLD", ret: "+$128", side: "LONG" },
    { status: "WIN", date: "May-24", sym: "NEO", ret: "+$94", side: "LONG" },
    { status: "LOSS", date: "May-23", sym: "SNX", ret: "-$42", side: "SHORT" },
    { status: "WIN", date: "May-23", sym: "ILV", ret: "+$210", side: "LONG" },
    { status: "OPEN", date: "May-22", sym: "BTC", ret: "+$621", side: "LONG" },
    { status: "WIN", date: "May-22", sym: "APE", ret: "+$31", side: "LONG" },
  ],
  breakdowns: ["Hourly", "Weekday", "Month", "Year", "Entry Price", "Cost", "Volume", "Side", "Hold Time"],
};

// ===== VITchat =====
export const VITCHAT_ME = { username: "brandononchain", status: "online" };
export const VITCHAT_FRIENDS = [
  { id: "1", username: "alex_fx", status: "online", unread: 2, last: "gg on that BTC long 🚀", fromMe: false },
  { id: "2", username: "mira.trades", status: "online", unread: 0, last: "you: sent the chart", fromMe: true },
  { id: "3", username: "jun_w", status: "dnd", unread: 0, last: "in a session, brb", fromMe: false },
  { id: "4", username: "kofi", status: "offline", unread: 0, last: "later!", fromMe: false },
  { id: "5", username: "sara_k", status: "offline", unread: 0, last: "thanks 🙏", fromMe: false },
];
export const VITCHAT_REQUESTS = [
  { id: "r1", username: "trader_zoe" },
  { id: "r2", username: "moon_dev" },
];
export const VITCHAT_THREAD = [
  { id: "m1", fromMe: false, text: "yo did you catch the ETH breakout?", t: "09:41" },
  { id: "m2", fromMe: true, text: "yeah got in at 3,448 — riding it", t: "09:42" },
  { id: "m3", fromMe: false, text: "nice 🔥 target?", t: "09:42" },
  { id: "m4", fromMe: true, text: "3,640 first TP then trail", t: "09:43" },
  { id: "m5", fromMe: false, text: "gg on that BTC long 🚀", t: "09:51" },
];

// ===== VITworld =====
export const VITWORLD_USERS = [
  { id: "u1", username: "alex_fx", country: "United States", lat: 40.7, lng: -74, online: true },
  { id: "u2", username: "mira.trades", country: "United Kingdom", lat: 51.5, lng: -0.12, online: true },
  { id: "u3", username: "jun_w", country: "Japan", lat: 35.6, lng: 139.6, online: true },
  { id: "u4", username: "kofi", country: "Ghana", lat: 5.6, lng: -0.18, online: false },
  { id: "u5", username: "sara_k", country: "Germany", lat: 52.5, lng: 13.4, online: true },
  { id: "u6", username: "leo_br", country: "Brazil", lat: -23.5, lng: -46.6, online: true },
  { id: "u7", username: "anya", country: "UAE", lat: 25.2, lng: 55.3, online: false },
  { id: "u8", username: "wei", country: "Singapore", lat: 1.35, lng: 103.8, online: true },
];

// ===== TradeCafe Card =====
export const CARD = {
  stats: [
    { k: "Cashback", v: "2%" },
    { k: "Currencies", v: "30+" },
    { k: "Monthly fee", v: "$0" },
    { k: "Issued", v: "Instant" },
  ],
  features: [
    { title: "Virtual & physical", text: "Spin up a virtual card instantly; order a metal card to your door." },
    { title: "Crypto top-up", text: "Fund directly from your TradeCafe balance or any supported asset." },
    { title: "Global acceptance", text: "Spend anywhere VISA is accepted, online and in-store." },
    { title: "Real-time controls", text: "Freeze, set limits, and view every transaction live in-app." },
  ],
  tiers: [
    { name: "Core", price: "Free", cashback: "1%", color: "#9BA6B2", limit: "$10k / mo" },
    { name: "Plus", price: "$9 / mo", cashback: "2%", color: "#00B4A6", limit: "$50k / mo", popular: true },
    { name: "Metal", price: "$29 / mo", cashback: "3%", color: "#E8782A", limit: "Unlimited" },
  ],
};

// ===== Invoice / payment =====
export const INVOICE = {
  id: "INV-20518",
  item: "Trade Bot · 12 months",
  total: "990.00",
  currency: "USDT",
  network: "TRC20",
  address: "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbX9p",
  minutes: 30,
};

// ===== Support chat =====
export const SUPPORT_THREAD = [
  { id: "s1", fromMe: false, text: "Hi! 👋 You're chatting with TradeCafe support. How can we help?", t: "09:30" },
  { id: "s2", fromMe: true, text: "How long do withdrawals take?", t: "09:31" },
  { id: "s3", fromMe: false, text: "TRC20 withdrawals usually confirm in 2–5 minutes after approval.", t: "09:31" },
];

// ===== Products =====
export const PRODUCTS = [
  {
    key: "signal", name: "Signal Bot", tag: "AI", icon: "Radio",
    lead: "Real-time AI signals across crypto, stocks, metals & forex — 24/7.",
    stats: [{ k: "Signals", v: "20K+" }, { k: "Win Rate", v: "83%" }, { k: "PnL", v: "473%" }, { k: "Monitoring", v: "24/7" }],
    features: ["Real-time analytics feed", "Personal watchlist", "Multi-market coverage", "Confidence scoring"],
  },
  {
    key: "trade", name: "Trade Bot", tag: "AUTO", icon: "Bot",
    lead: "Automated execution with Full-Auto, Semi-Auto, and Assistant modes.",
    stats: [{ k: "Trades", v: "8K+" }, { k: "Win Rate", v: "78%" }, { k: "Modes", v: "3" }, { k: "Auto", v: "24/7" }],
    features: ["Full Auto mode", "Semi-Auto confirmations", "Assistant markers", "Risk guardrails"],
  },
  {
    key: "terminal", name: "Trading Terminal", tag: "PRO", icon: "CandlestickChart",
    lead: "Pro charts, 50+ indicators, AI auto-analysis and one-click execution.",
    stats: [{ k: "Indicators", v: "50+" }, { k: "Charts", v: "200+" }, { k: "Latency", v: "<10ms" }, { k: "Access", v: "24/7" }],
    features: ["Live TradingView charts", "Premium indicators", "AI auto-analysis", "Order book + DOM"],
  },
  {
    key: "card", name: "TradeCafe Card", tag: "VISA", icon: "CreditCard",
    lead: "Spend your trading profits anywhere with the TradeCafe VISA card.",
    stats: [{ k: "Cashback", v: "2%" }, { k: "Currencies", v: "30+" }, { k: "Fees", v: "$0" }, { k: "Issued", v: "Instant" }],
    features: ["Virtual & physical", "Crypto top-up", "Global acceptance", "Real-time controls"],
  },
];
