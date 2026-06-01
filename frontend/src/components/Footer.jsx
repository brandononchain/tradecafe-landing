import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const COLS = [
  {
    title: "Platform",
    links: [
      { label: "Terminal", to: "/terminal" },
      { label: "Signals", to: "/signals" },
      { label: "Automation", to: "/automation" },
      { label: "Trading Pool", to: "/pool" },
      { label: "Partners", to: "/partners" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Active traders", to: "/solutions/active-traders" },
      { label: "Passive participants", to: "/solutions/passive-participants" },
      { label: "Partners & affiliates", to: "/solutions/partners-affiliates" },
      { label: "Brokers & exchanges", to: "/solutions/brokers-exchanges" },
      { label: "Funds & managers", to: "/solutions/funds-managers" },
    ],
  },
  {
    title: "Network",
    links: [
      { label: "Partner Program", to: "/network/partner-program" },
      { label: "Broker Campaigns", to: "/network/broker-campaigns" },
      { label: "Ambassador Program", to: "/network/ambassador-program" },
      { label: "Proof Cards", to: "/network/proof-cards" },
      { label: "Leaderboards", to: "/network/leaderboards" },
    ],
  },
  {
    title: "Insights",
    links: [
      { label: "Performance", to: "/insights/performance" },
      { label: "AI methodology", to: "/insights/ai-methodology" },
      { label: "Risk framework", to: "/insights/risk-framework" },
      { label: "Market notes", to: "/insights/market-notes" },
      { label: "Docs", to: "/insights/docs" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/company/about" },
      { label: "Roadmap", to: "/company/roadmap" },
      { label: "Support", to: "/company/support" },
    ],
  },
];

const SOCIAL = [
  { label: "X", href: "https://x.com/tradecafe" },
  { label: "Discord", href: "https://discord.gg/tradecafe" },
  { label: "Telegram", href: "https://t.me/tradecafe" },
  { label: "GitHub", href: "https://github.com/tradecafe" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative bg-black border-t border-white/[0.06] text-white/70" data-testid="site-footer">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 pt-14 pb-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-10">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4" data-testid="footer-logo">
              <img src="/tradecafe-logo.png" alt="TradeCafe" className="w-7 h-7" />
              <span className="font-heading text-[17px] font-semibold text-white">TradeCafe</span>
            </Link>
            <p className="text-[12.5px] leading-[1.55] text-white/55 max-w-[260px]">
              A calm, 24/7 AI trading ecosystem — terminal, signals, automation, pooled strategies, and a partner network.
            </p>
            <Link
              to="/app"
              className="mt-5 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-tradeTeal/15 border border-tradeTeal/30 text-tradeTeal text-[12px] font-medium hover:bg-tradeTeal/20"
              data-testid="footer-cta"
            >
              Launch app <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.4} />
            </Link>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-white/45 mb-3">{col.title}</div>
              <ul className="flex flex-col gap-2">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-[13px] text-white/70 hover:text-tradeTeal transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-white/45">
            <span>© {year} TradeCafe</span>
            <Link to="/insights/risk-framework" className="hover:text-white/75">Risk disclosure</Link>
            <Link to="/insights/docs" className="hover:text-white/75">Docs</Link>
            <Link to="/company/support" className="hover:text-white/75">Support</Link>
            <a href="mailto:hello@tradecafe.ai" className="hover:text-white/75">hello@tradecafe.ai</a>
          </div>
          <div className="flex items-center gap-2">
            {SOCIAL.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full border border-white/[0.08] text-[11.5px] text-white/60 hover:text-tradeTeal hover:border-tradeTeal/30 transition-colors"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <p className="mt-6 text-[11px] leading-[1.55] text-white/35 max-w-3xl">
          TradeCafe provides trading tools, analytics, and signal services. Nothing on this site is investment advice. Trading
          digital assets and derivatives involves significant risk and may not be suitable for every participant. Past performance
          is not indicative of future results.
        </p>
      </div>
    </footer>
  );
}
