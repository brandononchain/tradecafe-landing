// TradeCafe shared brand constants

export const EXTERNAL = {
  // Points at the in-app dashboard/terminal so the full UI is reachable
  // from every "Launch Terminal" CTA across the marketing site.
  launchTerminal: "/app/terminal",
  app: "/app",
  joinEcosystem: "https://tradecafe.ai",
  contactSales: "mailto:sales@tradecafe.ai",
};

// Enterprise mega-menu navigation. Each top-level entry renders a glass
// mega-menu with a left featured block and a right link grid.
export const NAV_MENUS = [
  {
    label: "Platform",
    featured: {
      eyebrow: "Platform",
      title: "One ecosystem. One command center.",
      desc: "Signals, execution, pooled strategies, and partner tools — unified in a single AI-driven trading platform.",
      cta: { label: "Launch Terminal", to: EXTERNAL.launchTerminal },
    },
    items: [
      { label: "Terminal", desc: "One command center for the full TradeCafe ecosystem.", to: "/terminal" },
      { label: "Signal Engine", desc: "AI-powered market setups with entries, exits, and context.", to: "/signals" },
      { label: "Execution Engine", desc: "Automated trading, position management, and risk logic.", to: "/automation" },
      { label: "Trading Pool", desc: "Passive access to TradeCafe-managed strategy infrastructure.", to: "/pool" },
      { label: "Partner Dashboard", desc: "Referrals, ranks, proof cards, commissions, and network growth.", to: "/partners" },
    ],
  },
  {
    label: "Solutions",
    featured: {
      eyebrow: "Solutions",
      title: "Built for how you trade.",
      desc: "From hands-on active traders to passive participants and institutional partners — TradeCafe adapts to your role.",
      cta: { label: "Talk to our team", to: EXTERNAL.contactSales, external: true },
    },
    items: [
      { label: "Active Traders", desc: "Use signals and automation while staying in control.", to: "/solutions/active-traders" },
      { label: "Passive Participants", desc: "Access managed strategy exposure through the Trading Pool.", to: "/solutions/passive-participants" },
      { label: "Partners & Affiliates", desc: "Build recurring income through the TradeCafe Partner Network.", to: "/solutions/partners-affiliates" },
      { label: "Brokers & Exchanges", desc: "Drive volume, leads, competitions, and co-branded growth.", to: "/solutions/brokers-exchanges" },
      { label: "Funds & Managers", desc: "Infrastructure for managed strategies, reporting, and execution workflows.", to: "/solutions/funds-managers" },
    ],
  },
  {
    label: "Network",
    featured: {
      eyebrow: "Network",
      title: "Grow with the ecosystem.",
      desc: "Recurring income, co-branded campaigns, and social proof that compounds across the TradeCafe network.",
      cta: { label: "Become a partner", to: "/network/partner-program" },
    },
    items: [
      { label: "Partner Program", desc: "Earn from subscriptions, network activity, pool participation, and rank growth.", to: "/network/partner-program" },
      { label: "Broker Campaigns", desc: "Co-branded competitions, leaderboard systems, and referral tracking.", to: "/network/broker-campaigns" },
      { label: "Ambassador Program", desc: "Turn creators and top performers into ecosystem growth partners.", to: "/network/ambassador-program" },
      { label: "Proof Cards", desc: "Shareable PNL, milestone, and signal cards with embedded referral links.", to: "/network/proof-cards" },
      { label: "Leaderboards", desc: "Competitions, performance rankings, and social growth loops.", to: "/network/leaderboards" },
    ],
  },
  {
    label: "Insights",
    featured: {
      eyebrow: "Insights",
      title: "Transparency by design.",
      desc: "Performance, methodology, and risk — documented and shared openly across the ecosystem.",
      cta: { label: "View performance", to: "/insights/performance" },
    },
    items: [
      { label: "Performance", desc: "Win rate, trade history, uptime, signals, and managed volume.", to: "/insights/performance" },
      { label: "AI Methodology", desc: "How TradeCafe identifies setups through references, filters, and confirmations.", to: "/insights/ai-methodology" },
      { label: "Risk Framework", desc: "Capital logic, position limits, trailing protection, and drawdown controls.", to: "/insights/risk-framework" },
      { label: "Market Notes", desc: "Trading insights, recaps, updates, and ecosystem reports.", to: "/insights/market-notes" },
      { label: "Docs", desc: "Guides, onboarding, FAQs, and technical resources.", to: "/insights/docs" },
    ],
  },
  {
    label: "Company",
    featured: {
      eyebrow: "Company",
      title: "The TradeCafe economy.",
      desc: "Our mission, roadmap, and the team building the future of AI-assisted trading.",
      cta: { label: "About TradeCafe", to: "/company/about" },
    },
    items: [
      { label: "About", desc: "Mission, vision, and the TradeCafe economy.", to: "/company/about" },
      { label: "Roadmap", desc: "Upcoming features, integrations, and ecosystem expansion.", to: "/company/roadmap" },
      { label: "Contact Sales", desc: "For brokers, funds, communities, and institutional partners.", to: EXTERNAL.contactSales, external: true },
      { label: "Support", desc: "Help center, account assistance, and onboarding.", to: "/company/support" },
    ],
  },
];

export const TRUST_METRICS = [
  { label: "24/7 AI Signal Engine", value: null, type: "status" },
  { label: "Win Rate", value: "81%" },
  { label: "Trades", value: "20K+" },
  { label: "Signals", value: "8,782" },
  { label: "Managed", value: "$3M+" },
  { label: "Uptime", value: "99.9%" },
];
