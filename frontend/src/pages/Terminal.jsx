import { useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import {
  ArrowUpRight,
  Activity,
  Bot,
  LineChart,
  Layers,
  Users,
  Radio,
  Shield,
  Wallet,
  Brain,
  Sparkles,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
} from "lucide-react";
import Nav from "../components/Nav";
import LiveTerminalPreview from "../components/LiveTerminalPreview";
import { EXTERNAL } from "../lib/brand";

const SIGNAL_FEED = [
  { sym: "BTC/USDT",  dir: "LONG",  price: "67,420.50", change: "+2.4%",  time: "12s",  conf: 92 },
  { sym: "ETH/USDT",  dir: "LONG",  price: "3,512.18",  change: "+1.8%",  time: "1m",   conf: 88 },
  { sym: "SOL/USDT",  dir: "SHORT", price: "184.62",    change: "-0.9%",  time: "3m",   conf: 76 },
  { sym: "AVAX/USDT", dir: "LONG",  price: "42.81",     change: "+3.2%",  time: "6m",   conf: 84 },
  { sym: "ARB/USDT",  dir: "LONG",  price: "1.246",     change: "+0.6%",  time: "11m",  conf: 71 },
];

const OPEN_POSITIONS = [
  { sym: "BTC/USDT",  side: "LONG",  pnl: "+$4,820",  pct: "+2.18%", up: true  },
  { sym: "ETH/USDT",  side: "LONG",  pnl: "+$1,612",  pct: "+0.92%", up: true  },
  { sym: "SOL/USDT",  side: "SHORT", pnl: "-$284",    pct: "-0.31%", up: false },
];

const AI_INSIGHTS = [
  { t: "now",  text: "BTC volatility regime shift detected, tightening stops by 12%.",        icon: Brain },
  { t: "2m",   text: "Routing 3 signals through high-confidence filter (conf > 85%).",        icon: Sparkles },
  { t: "8m",   text: "ETH momentum cluster forming on 4H, partial entry executed.",          icon: Activity },
  { t: "14m",  text: "Risk model dampened SOL exposure after correlation spike.",             icon: Shield },
];

export default function Terminal() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-t='eyebrow']",  { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.1 });
      gsap.fromTo("[data-t='title']",    { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.2 });
      gsap.fromTo("[data-t='sub']",      { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.35 });
      gsap.fromTo("[data-t='ctas'] > *", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.5, stagger: 0.08 });
      gsap.fromTo("[data-t='module']",   { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.7, stagger: 0.06 });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-tradeWhite font-body" data-testid="terminal-page">
      {/* Atmospheric background, static poster + tints, no video */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
        <div
          className="absolute inset-0 opacity-[0.42]"
          style={{
            backgroundImage: "url('/tradecafebackground-poster.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(2px) saturate(118%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(900px 600px at 20% 0%, rgba(232,120,42,0.10), transparent 55%)," +
              "radial-gradient(1100px 800px at 90% 100%, rgba(0,180,166,0.14), transparent 55%)," +
              "linear-gradient(180deg, rgba(2,8,9,0.78) 0%, rgba(2,8,9,0.88) 50%, rgba(2,8,9,0.94) 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
          style={{
            backgroundImage:
              "url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')",
          }}
        />
      </div>

      {/* Page card wrapper, same hero-frame shell for visual continuity */}
      <section className="hero-frame !min-h-[unset] relative z-10 pb-12 sm:pb-16 md:pb-20">
        <Nav />

        {/* ===== HERO ===== */}
        <header className="relative z-20 pt-28 sm:pt-36 md:pt-40 lg:pt-44 px-6 sm:px-10 md:px-14 lg:px-16 pb-10 sm:pb-14 max-w-[1280px] mx-auto">
          <div data-t="eyebrow" className="hero-kicker text-[11px] text-tradeTeal/95 flex items-center gap-2 mb-5">
            <span className="trade-pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-tradeTeal" />
            TradeCafe Terminal
          </div>
          <h1
            data-t="title"
            data-testid="terminal-title"
            className="font-heading font-semibold text-tradeWhite max-w-[920px]"
            style={{ fontSize: "clamp(34px, 5.4vw, 76px)", lineHeight: "1.02", letterSpacing: "-0.04em" }}
          >
            Your trading ecosystem,{" "}
            <span className="italic font-light text-white/95">in one command center</span>.
          </h1>
          <p
            data-t="sub"
            data-testid="terminal-subheadline"
            className="mt-6 sm:mt-7 text-[15px] sm:text-[17px] leading-[1.6] text-white/72 max-w-[720px]"
          >
            Monitor signals, active bots, pool performance, account status, partner growth,
            and AI insights from one calm trading interface.
          </p>
          <div data-t="ctas" className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <a href={EXTERNAL.launchTerminal} className="cta-primary justify-center sm:justify-start sm:self-start" data-testid="terminal-cta-launch">
              Launch Terminal
              <ArrowUpRight className="w-4 h-4" strokeWidth={2.4} />
            </a>
            <Link to="/#signals" className="cta-ghost justify-center sm:justify-start sm:self-start group" data-testid="terminal-cta-signals">
              View Signal Engine
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
            </Link>
          </div>
        </header>

        {/* ===== LIVE CHART (real platform component) ===== */}
        <div data-t="module" className="relative z-20 px-4 sm:px-6 md:px-10 lg:px-14 max-w-[1280px] mx-auto mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="trade-pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-tradeTeal" />
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/50">Live component · interactive</span>
          </div>
          <LiveTerminalPreview />
        </div>

        {/* ===== DASHBOARD PREVIEW ===== */}
        <div className="relative z-20 px-4 sm:px-6 md:px-10 lg:px-14 max-w-[1280px] mx-auto">
          <div className="tc-dashboard" data-testid="dashboard-preview">
            {/* Dashboard chrome bar */}
            <div className="tc-dashboard-chrome">
              <div className="flex items-center gap-2.5">
                <span className="tc-dot tc-dot-red" />
                <span className="tc-dot tc-dot-amber" />
                <span className="tc-dot tc-dot-green" />
                <span className="ml-3 font-mono text-[11px] tracking-[0.18em] uppercase text-white/55">
                  TradeCafe • Command Center
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-3 font-mono text-[10.5px] text-white/55 tracking-[0.14em] uppercase">
                <span className="flex items-center gap-1.5">
                  <span className="trade-pulse-dot w-1.5 h-1.5 rounded-full bg-tradeTeal inline-block" />
                  Live
                </span>
                <span className="opacity-50">·</span>
                <span>v 2.4.1</span>
              </div>
            </div>

            {/* Grid of modules */}
            <div className="tc-dashboard-grid">

              {/* Live Signal Feed, large */}
              <Module data-t="module" className="md:col-span-2 md:row-span-2" testid="mod-signal-feed"
                icon={Radio} title="Live Signal Feed" status="STREAMING">
                <ul className="flex flex-col gap-2 mt-1">
                  {SIGNAL_FEED.map((s, i) => (
                    <li key={i} className="tc-signal-row" style={{ animationDelay: `${i * 60}ms` }}>
                      <span className={`tc-signal-side ${s.dir === "LONG" ? "is-long" : "is-short"}`}>
                        {s.dir === "LONG" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {s.dir}
                      </span>
                      <span className="tc-signal-sym">{s.sym}</span>
                      <span className="tc-signal-price font-mono">{s.price}</span>
                      <span className={`tc-signal-change font-mono ${s.dir === "LONG" ? "text-tradeTeal" : "text-tradeOrange"}`}>
                        {s.change}
                      </span>
                      <span className="tc-signal-conf">
                        <span className="tc-conf-bar"><span style={{ width: `${s.conf}%` }} /></span>
                        <span className="font-mono text-[10px] text-white/55">{s.conf}</span>
                      </span>
                      <span className="tc-signal-time font-mono">{s.time}</span>
                    </li>
                  ))}
                </ul>
              </Module>

              {/* Bot Status */}
              <Module data-t="module" testid="mod-bot-status" icon={Bot} title="Bot Status" status="ACTIVE">
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-mono text-[34px] font-semibold text-tradeWhite leading-none">12</span>
                  <span className="font-mono text-[11px] text-white/55 tracking-[0.14em] uppercase">/ 14 ONLINE</span>
                </div>
                <div className="mt-4 flex gap-1">
                  {[1,1,1,1,1,1,1,1,1,1,1,1,0,0].map((v, i) => (
                    <span key={i} className="flex-1 h-2 rounded-sm" style={{ background: v ? "linear-gradient(180deg, #00B4A6, #058073)" : "rgba(255,255,255,0.06)" }} />
                  ))}
                </div>
                <div className="mt-3 font-mono text-[10.5px] text-white/45 tracking-[0.06em]">
                  Last cycle 0.42s · CPU 18%
                </div>
              </Module>

              {/* Risk Status */}
              <Module data-t="module" testid="mod-risk" icon={Shield} title="Risk Status" status="STABLE">
                <div className="mt-1">
                  <div className="flex items-end justify-between gap-2">
                    <span className="font-mono text-[28px] font-semibold text-tradeWhite leading-none">2.1<span className="text-[14px] text-white/45 ml-1">/ 10</span></span>
                    <span className="font-mono text-[10.5px] text-tradeTeal tracking-[0.16em] uppercase">LOW</span>
                  </div>
                  <div className="mt-3 tc-risk-track">
                    <div className="tc-risk-fill" style={{ width: "21%" }} />
                  </div>
                  <div className="mt-2 flex justify-between font-mono text-[9.5px] text-white/40 tracking-[0.1em]">
                    <span>0</span><span>5</span><span>10</span>
                  </div>
                </div>
              </Module>

              {/* Open Positions */}
              <Module data-t="module" testid="mod-positions" icon={Wallet} title="Open Positions" status={`${OPEN_POSITIONS.length} OPEN`}>
                <ul className="flex flex-col gap-2 mt-1">
                  {OPEN_POSITIONS.map((p, i) => (
                    <li key={i} className="flex items-center justify-between text-[12px]">
                      <span className="flex items-center gap-2">
                        <span className={`tc-pos-side ${p.up ? "is-long" : "is-short"}`}>{p.side}</span>
                        <span className="text-white/80">{p.sym}</span>
                      </span>
                      <span className="flex items-baseline gap-2">
                        <span className={`font-mono ${p.up ? "text-tradeTeal" : "text-tradeOrange"}`}>{p.pnl}</span>
                        <span className="font-mono text-[10.5px] text-white/45">{p.pct}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </Module>

              {/* Pool Performance */}
              <Module data-t="module" testid="mod-pool" icon={Layers} title="Pool Performance" status="+18.4% MTD">
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-mono text-[26px] font-semibold text-tradeWhite leading-none">$3.12M</span>
                  <span className="font-mono text-[11px] text-tradeTeal">+0.62%</span>
                </div>
                <Sparkline className="mt-3" />
                <div className="mt-2 font-mono text-[10px] text-white/45 tracking-[0.06em]">
                  AUM · 30d sparkline · 412 LPs
                </div>
              </Module>

              {/* AI Insight Log, wide */}
              <Module data-t="module" className="md:col-span-2" testid="mod-ai-insights" icon={Brain} title="AI Insight Log" status="LIVE">
                <ul className="flex flex-col gap-2 mt-1">
                  {AI_INSIGHTS.map((it, i) => {
                    const Ic = it.icon;
                    return (
                      <li key={i} className="flex items-start gap-3 text-[12.5px] text-white/72">
                        <span className="mt-0.5 inline-flex w-6 h-6 items-center justify-center rounded-md bg-tradeTeal/10 border border-tradeTeal/30 shrink-0">
                          <Ic className="w-3.5 h-3.5 text-tradeTeal" strokeWidth={2} />
                        </span>
                        <span className="flex-1 leading-[1.45]">{it.text}</span>
                        <span className="font-mono text-[10px] text-white/40 shrink-0 mt-0.5">{it.t}</span>
                      </li>
                    );
                  })}
                </ul>
              </Module>

              {/* Partner Growth */}
              <Module data-t="module" testid="mod-partners" icon={Users} title="Partner Growth" status="+24 / 7D">
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-mono text-[26px] font-semibold text-tradeWhite leading-none">1,284</span>
                  <span className="font-mono text-[11px] text-tradeTeal">+1.9%</span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  {[1,2,3,4,5].map((n) => (
                    <span key={n} className="w-7 h-7 rounded-full border border-white/[0.07]" style={{
                      background: `conic-gradient(from ${n*60}deg, #00B4A6, #0B3A48 ${n*15}%, #051418)`,
                    }} />
                  ))}
                  <span className="font-mono text-[10.5px] text-white/50 ml-2">+ 1.27K more</span>
                </div>
              </Module>

              {/* Proof Cards */}
              <Module data-t="module" className="md:col-span-2" testid="mod-proof" icon={CheckCircle2} title="Proof Cards" status="VERIFIED">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                  <ProofCard symbol="BTC/USDT" pnl="+4.8%" closed="2h ago" verified />
                  <ProofCard symbol="ETH/USDT" pnl="+2.1%" closed="5h ago" verified />
                </div>
              </Module>

            </div>
          </div>

          {/* Footnote */}
          <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-2 font-mono text-[10.5px] text-white/40 tracking-[0.14em] uppercase">
            <span className="flex items-center gap-2">
              <Clock className="w-3 h-3" /> Updated live · Mock preview
            </span>
            <span>Bloomberg Terminal × Luxury Café × AI Automation</span>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============== Subcomponents ============== */

function Module({ icon: Icon, title, status, className = "", testid, children, ...rest }) {
  return (
    <div className={`tc-module ${className}`} data-testid={testid} {...rest}>
      <div className="tc-module-header">
        <span className="tc-module-icon"><Icon className="w-3.5 h-3.5" strokeWidth={2} /></span>
        <span className="tc-module-title">{title}</span>
        {status && <span className="tc-module-status">{status}</span>}
      </div>
      <div className="tc-module-body">{children}</div>
    </div>
  );
}

function Sparkline({ className = "" }) {
  // calm uptrending sparkline (svg)
  return (
    <svg className={className} viewBox="0 0 220 56" preserveAspectRatio="none" style={{ width: "100%", height: 56 }}>
      <defs>
        <linearGradient id="sparkfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#00B4A6" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#00B4A6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 40 L20 36 L36 38 L52 32 L70 30 L90 28 L108 22 L128 24 L150 18 L172 14 L196 10 L220 6 L220 56 L0 56 Z" fill="url(#sparkfill)" />
      <path d="M0 40 L20 36 L36 38 L52 32 L70 30 L90 28 L108 22 L128 24 L150 18 L172 14 L196 10 L220 6"
        fill="none" stroke="#00B4A6" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function ProofCard({ symbol, pnl, closed, verified }) {
  return (
    <div className="tc-proof">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] text-white/55 tracking-[0.14em] uppercase">{symbol}</span>
        {verified && (
          <span className="inline-flex items-center gap-1 text-[10px] text-tradeTeal font-mono uppercase tracking-[0.14em]">
            <CheckCircle2 className="w-3 h-3" /> Verified
          </span>
        )}
      </div>
      <div className="mt-2 flex items-baseline justify-between">
        <span className="font-mono text-[22px] text-tradeTeal font-semibold leading-none">{pnl}</span>
        <span className="font-mono text-[10.5px] text-white/45">{closed}</span>
      </div>
    </div>
  );
}
