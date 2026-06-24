import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight, ArrowRight, Sparkles, Radio, Bot, Layers,
  Users, ShieldCheck, Plus, Minus, Zap, TrendingUp, LineChart, CandlestickChart,
} from "lucide-react";
import LiveTerminalPreview from "../components/LiveTerminalPreview";
import { BrandLogo } from "../dashboard/lib/brandLogos";

/* ============================================================
   HOME — sectioned, knotch-inspired editorial landing for TradeCafe
   Calm late-night palette (#020809 → teal #22D3B4), editorial sans
   for display + body, JetBrains Mono for eyebrows/labels.
   ============================================================ */

export default function HomeBody() {
  return (
    <div className="relative z-20 bg-[#020809] text-white">
      <LogoTrustStrip />
      <EditorialIntro />
      <BentoFeatures />
      <SplitTerminal />
      <SplitSignals />
      <SplitPool />
      <Marquee />
      <HowItWorks />
      <Testimonial />
      <ProofMetrics />
      <Faq />
      <BigCTA />
    </div>
  );
}

/* -----------------------------------------------------------
   Section primitives
   ----------------------------------------------------------- */

function Section({ children, className = "" }) {
  return (
    <section className={`max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 ${className}`}>
      {children}
    </section>
  );
}

function Eyebrow({ index, children }) {
  return (
    <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-tradeTeal/90 flex items-center gap-2">
      {index && <span className="text-white/35">{index}</span>}
      <span>{children}</span>
    </div>
  );
}

/* -----------------------------------------------------------
   1. Trust strip — venues TradeCafe connects to
   ----------------------------------------------------------- */
function LogoTrustStrip() {
  const venues = ["binance", "bybit", "bitget", "okx", "kucoin", "weex", "bingx"];
  return (
    <section className="border-t border-b border-white/[0.04] bg-black/40">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 py-7 sm:py-9 flex flex-col lg:flex-row items-start lg:items-center gap-5 lg:gap-12">
        <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/45 shrink-0">
          Connects to · live
        </div>
        <div className="flex items-center gap-5 sm:gap-9 flex-wrap">
          {venues.map((v) => (
            <span key={v} className="opacity-80 hover:opacity-100 transition-opacity inline-flex items-center gap-2">
              <BrandLogo id={v} size={26} />
              <span className="hidden sm:inline font-mono text-[11px] tracking-[0.12em] uppercase text-white/55">{v}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -----------------------------------------------------------
   2. Editorial intro — what TradeCafe is, in one sentence
   ----------------------------------------------------------- */
function EditorialIntro() {
  return (
    <Section className="pt-24 sm:pt-32 pb-16 sm:pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16 items-start">
        <div>
          <Eyebrow index="01">What is TradeCafe</Eyebrow>
          <h2
            className="mt-5 font-heading font-semibold text-white leading-[1.02] tracking-[-0.035em]"
            style={{ fontSize: "clamp(36px, 5.6vw, 72px)" }}
          >
            A trading desk that thinks <span className="italic font-light text-white/85">with you</span>,
            <br className="hidden sm:block" /> not <span className="italic font-light text-white/85">at you</span>.
          </h2>
          <p className="mt-7 text-[15px] sm:text-[17px] leading-[1.6] text-white/65 max-w-[560px]">
            TradeCafe is the calm side of crypto trading. One workspace for charts, AI signals,
            automated strategies, and pooled vaults — wired into the venues and the chains you already use.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/app/terminal" className="cta-primary">
              Launch Terminal <ArrowUpRight className="w-4 h-4" strokeWidth={2.4} />
            </Link>
            <Link to="/insights/docs" className="cta-ghost">
              Read the docs <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
            </Link>
          </div>
        </div>

        <DeviceCard />
      </div>
    </Section>
  );
}

function DeviceCard() {
  return (
    <div className="relative">
      <div
        className="absolute -inset-8 rounded-[40px] pointer-events-none opacity-70"
        style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(34,211,180,0.18), transparent 70%)" }}
      />
      <div className="relative rounded-3xl border border-white/[0.06] bg-[#04090d] overflow-hidden shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.05]">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
            <span className="ml-3 font-mono text-[10.5px] tracking-[0.16em] uppercase text-white/55">tradecafe · BTCUSDT</span>
          </div>
          <span className="hidden sm:flex items-center gap-1.5 font-mono text-[9.5px] tracking-[0.14em] uppercase text-tradeTeal">
            <span className="trade-pulse-dot w-1.5 h-1.5 rounded-full bg-tradeTeal inline-block" /> Live
          </span>
        </div>
        <div className="h-[320px] sm:h-[400px]">
          <LiveTerminalPreview symbol="BTCUSDT" label="tradecafe · BTCUSDT" />
        </div>
      </div>
    </div>
  );
}

/* -----------------------------------------------------------
   3. Bento — four pillars with mini visuals
   ----------------------------------------------------------- */
function BentoFeatures() {
  const cards = [
    {
      eyebrow: "Terminal", title: "Pro multi-chart desk",
      body: "Charts, order tickets, alerts, and AI signals — one calm bento layout.",
      to: "/terminal", visual: <MiniChart />,
    },
    {
      eyebrow: "Signals", title: "Live AI signal feed",
      body: "Entry, target, stop, conviction. Tap once to load a ticket.",
      to: "/signals", visual: <MiniSignals />,
    },
    {
      eyebrow: "Automation", title: "Strategies that work overnight",
      body: "Trend, breakout, grid, DCA — with strict risk caps.",
      to: "/automation", visual: <MiniBot />,
    },
    {
      eyebrow: "Trading Pool", title: "Pooled, transparent alpha",
      body: "Allocate to managed strategies with on-chain reporting.",
      to: "/pool", visual: <MiniPool />,
    },
  ];
  return (
    <Section className="py-14 sm:py-20">
      <div className="flex items-end justify-between gap-6 mb-9 px-1">
        <div>
          <Eyebrow index="02">The Platform</Eyebrow>
          <h2 className="mt-3 font-heading text-[26px] sm:text-[36px] font-semibold tracking-[-0.02em] text-white">
            One workspace, every part of trading.
          </h2>
        </div>
        <p className="hidden sm:block text-[13px] text-white/55 max-w-[320px] text-right">
          Charts, signals, automation, vaults — calmly connected.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((c) => (
          <Link
            key={c.eyebrow}
            to={c.to}
            className="group relative rounded-2xl bg-white/[0.022] border border-white/[0.06] hover:border-tradeTeal/35 transition-colors overflow-hidden flex flex-col"
          >
            <div className="h-[120px] border-b border-white/[0.045] bg-[#04090d] relative">
              {c.visual}
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-tradeTeal/85">{c.eyebrow}</div>
              <div className="mt-2 font-heading text-[18px] font-semibold text-white leading-snug">{c.title}</div>
              <p className="mt-2 text-[13px] text-white/55 leading-[1.55] flex-1">{c.body}</p>
              <div className="mt-4 inline-flex items-center gap-1.5 text-[12px] text-white/70 group-hover:text-tradeTeal">
                Explore <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2.2} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}

/* Bento mini visuals — pure SVG, no deps */
function MiniChart() {
  return (
    <svg viewBox="0 0 320 120" className="w-full h-full">
      <defs>
        <linearGradient id="mc" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#22D3B4" stopOpacity="0.32" />
          <stop offset="1" stopColor="#22D3B4" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 96 L25 84 L50 90 L75 70 L100 78 L125 56 L150 64 L175 44 L200 50 L225 30 L250 38 L275 22 L300 30 L320 16 L320 120 L0 120 Z" fill="url(#mc)" />
      <path d="M0 96 L25 84 L50 90 L75 70 L100 78 L125 56 L150 64 L175 44 L200 50 L225 30 L250 38 L275 22 L300 30 L320 16" fill="none" stroke="#22D3B4" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx="320" cy="16" r="3" fill="#7BE5CC" />
      <circle cx="320" cy="16" r="7" fill="#22D3B4" opacity="0.35" />
    </svg>
  );
}
function MiniSignals() {
  const rows = [
    { sym: "BTC", dir: "L", v: 92 },
    { sym: "ETH", dir: "L", v: 88 },
    { sym: "SOL", dir: "S", v: 76 },
  ];
  return (
    <div className="absolute inset-0 p-3 flex flex-col gap-1.5 justify-center">
      {rows.map((r) => (
        <div key={r.sym} className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-white/[0.03] border border-white/[0.05]">
          <span className="font-mono text-[10px] text-white/70 w-7">{r.sym}</span>
          <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${r.dir === "L" ? "bg-tradeTeal/15 text-tradeTeal" : "bg-[#F23645]/15 text-[#FF8A82]"}`}>{r.dir === "L" ? "LONG" : "SHORT"}</span>
          <div className="flex-1 h-1 rounded-full bg-white/[0.05] overflow-hidden">
            <div className="h-full bg-tradeTeal" style={{ width: `${r.v}%` }} />
          </div>
          <span className="font-mono text-[9.5px] text-tradeTeal w-7 text-right">{r.v}%</span>
        </div>
      ))}
    </div>
  );
}
function MiniBot() {
  return (
    <div className="absolute inset-0 p-3 flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center">
        <svg viewBox="0 0 200 80" className="w-full max-w-[200px]">
          {/* baseline */}
          <line x1="0" y1="40" x2="200" y2="40" stroke="#1A3B40" strokeDasharray="2,4" />
          {/* candles */}
          {[10, 26, 42, 58, 74, 90, 106, 122, 138, 154, 170, 186].map((x, i) => {
            const up = [0, 2, 3, 5, 6, 8, 9, 11].includes(i);
            const h = 12 + ((i * 7) % 22);
            const y = 40 - h / 2;
            return (
              <g key={x}>
                <line x1={x} y1={y - 4} x2={x} y2={y + h + 4} stroke={up ? "#22D3B4" : "#F23645"} />
                <rect x={x - 3} y={y} width="6" height={h} fill={up ? "#22D3B4" : "#F23645"} opacity="0.85" />
              </g>
            );
          })}
          {/* execution arrow */}
          <path d="M170 60 L186 22" stroke="#7BE5CC" strokeWidth="1.5" markerEnd="" />
          <circle cx="186" cy="22" r="3.5" fill="#7BE5CC" />
        </svg>
      </div>
    </div>
  );
}
function MiniPool() {
  return (
    <div className="absolute inset-0 p-3 flex items-center justify-center">
      <svg viewBox="0 0 200 90" className="w-full max-w-[200px]">
        <defs>
          <linearGradient id="mp" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#22D3B4" stopOpacity="0.32" />
            <stop offset="1" stopColor="#22D3B4" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0 70 L20 64 L40 60 L60 52 L80 50 L100 44 L120 40 L140 34 L160 30 L180 22 L200 18 L200 90 L0 90 Z" fill="url(#mp)" />
        <path d="M0 70 L20 64 L40 60 L60 52 L80 50 L100 44 L120 40 L140 34 L160 30 L180 22 L200 18" fill="none" stroke="#22D3B4" strokeWidth="1.6" />
        <text x="6" y="14" fontFamily="JetBrains Mono" fontSize="9" fill="rgba(255,255,255,0.45)">POOL · Q2</text>
        <text x="194" y="14" fontFamily="JetBrains Mono" fontSize="9" fill="#22D3B4" textAnchor="end">+18.4%</text>
      </svg>
    </div>
  );
}

/* -----------------------------------------------------------
   4–6. Alternating split features
   ----------------------------------------------------------- */
function SplitTerminal() {
  return (
    <Split
      reverse={false}
      eyebrow="03 · Terminal"
      title="Charts, orders, alerts — in one calm desk."
      body="A multi-chart workspace built for traders who hold many positions. Lightweight charts, multi-leg orders with DCA, price alerts, and an AI signal banner that lives one tap from the ticket."
      bullets={[
        "Market or Limit, with editable DCA averaging multipliers",
        "Quick-pick size chips (% balance or USDT)",
        "Long / Short color-coded so the order action is unambiguous",
      ]}
      cta={{ label: "Open the terminal", to: "/terminal" }}
      visual={<TerminalVisual />}
    />
  );
}
function SplitSignals() {
  return (
    <Split
      reverse
      eyebrow="04 · Signals"
      title="AI signals that load straight into a trade."
      body="Conviction-scored setups with entry, target, and stop. Click a signal and the chart redraws with the levels, the order ticket pre-fills, and a Trade Signal button is one tap away."
      bullets={[
        "Open + projected-close markers drawn on the chart",
        "R/R, strategy, and timeframe shown inline",
        "One-click route — Limit @ entry with your size and leverage",
      ]}
      cta={{ label: "See the signal feed", to: "/signals" }}
      visual={<SignalsVisual />}
    />
  );
}
function SplitPool() {
  return (
    <Split
      reverse={false}
      eyebrow="05 · Trading Pool"
      title="Pooled alpha, transparently reported."
      body="Allocate to managed strategies running on Arbitrum One. Performance, drawdowns, and allocations are published on a defined cadence — not whispered."
      bullets={[
        "Defined exit windows, no surprise lockups",
        "On-chain settlement; you stay non-custodial",
        "Returns are a target, never a guarantee",
      ]}
      cta={{ label: "Explore the pool", to: "/pool" }}
      visual={<PoolVisual />}
    />
  );
}

function Split({ reverse, eyebrow, title, body, bullets, cta, visual }) {
  return (
    <Section className="py-16 sm:py-24">
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h3 className="mt-4 font-heading text-[28px] sm:text-[40px] font-semibold tracking-[-0.025em] text-white leading-[1.08]">
            {title}
          </h3>
          <p className="mt-5 text-[15px] sm:text-[16px] leading-[1.6] text-white/65 max-w-[520px]">{body}</p>
          <ul className="mt-6 flex flex-col gap-2.5">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-[13.5px] text-white/75">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-tradeTeal shrink-0" />
                <span className="leading-[1.6]">{b}</span>
              </li>
            ))}
          </ul>
          <Link to={cta.to} className="mt-7 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-tradeTeal hover:text-white transition-colors">
            {cta.label} <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
          </Link>
        </div>
        <div className="relative">
          <div className="absolute -inset-6 rounded-[36px] pointer-events-none opacity-70" style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(34,211,180,0.12), transparent 70%)" }} />
          <div className="relative rounded-3xl border border-white/[0.06] bg-[#04090d] overflow-hidden shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]">
            {visual}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* Split visuals */
function TerminalVisual() {
  return (
    <div className="h-[380px] sm:h-[440px]">
      <LiveTerminalPreview symbol="ETHUSDT" label="tradecafe · ETHUSDT" />
    </div>
  );
}
function SignalsVisual() {
  const rows = [
    { sym: "BTCUSDT", dir: "LONG", strat: "Swing", tf: "4H", entry: "67,420", t: "69,800", s: "65,200", c: 92 },
    { sym: "ETHUSDT", dir: "LONG", strat: "Scalp", tf: "15M", entry: "3,512", t: "3,640", s: "3,440", c: 88 },
    { sym: "SOLUSDT", dir: "SHORT", strat: "Scalp", tf: "5M", entry: "184.62", t: "178.20", s: "188.90", c: 76 },
    { sym: "AVAXUSDT", dir: "LONG", strat: "Swing", tf: "1H", entry: "42.81", t: "45.60", s: "41.10", c: 84 },
  ];
  return (
    <div className="p-4 sm:p-5 h-[380px] sm:h-[440px] flex flex-col gap-2">
      <div className="flex items-center gap-2 font-mono text-[9.5px] tracking-[0.14em] uppercase text-white/40">
        <Sparkles className="w-3 h-3 text-tradeTeal" strokeWidth={2} /> Live signal feed
      </div>
      <div className="flex flex-col gap-2 flex-1 overflow-hidden">
        {rows.map((r, i) => (
          <div key={r.sym} className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3" style={{ opacity: 1 - i * 0.05 }}>
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-white/90">{r.sym}</span>
              <span className={`font-mono text-[9.5px] tracking-[0.08em] uppercase px-2 py-0.5 rounded ${r.dir === "LONG" ? "bg-tradeTeal/15 text-tradeTeal" : "bg-[#F23645]/15 text-[#FF8A82]"}`}>{r.dir}</span>
            </div>
            <div className="font-mono text-[10px] text-white/45 mt-1">{r.strat} · {r.tf}</div>
            <div className="grid grid-cols-3 gap-1 mt-2 font-mono text-[10.5px]">
              <span className="text-white/55">@ {r.entry}</span>
              <span className="text-tradeTeal text-center">T {r.t}</span>
              <span className="text-[#FF8A82] text-right">S {r.s}</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                <div className="h-full bg-tradeTeal" style={{ width: `${r.c}%` }} />
              </div>
              <span className="font-mono text-[9.5px] text-tradeTeal">{r.c}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function PoolVisual() {
  return (
    <div className="p-5 sm:p-6 h-[380px] sm:h-[440px] flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-mono text-[9.5px] tracking-[0.14em] uppercase text-white/40">Trading Pool · Q2</div>
          <div className="font-heading text-[26px] font-bold tracking-[-0.02em] text-white mt-1">$3.12M <span className="text-tradeTeal text-[15px]">+18.4%</span></div>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-mono text-[9.5px] tracking-[0.14em] uppercase text-white/40">APY (target)</span>
          <span className="font-heading text-[20px] font-bold text-tradeTeal mt-1">120%</span>
        </div>
      </div>
      <svg viewBox="0 0 600 200" className="mt-4 w-full flex-1">
        <defs>
          <linearGradient id="pv" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#22D3B4" stopOpacity="0.38" />
            <stop offset="1" stopColor="#22D3B4" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g stroke="#0E2A2E">
          {[40, 80, 120, 160].map((y) => <line key={y} x1="0" y1={y} x2="600" y2={y} />)}
        </g>
        <path d="M0 160 L40 150 L80 152 L120 132 L160 138 L200 118 L240 122 L280 96 L320 104 L360 82 L400 92 L440 70 L480 76 L520 54 L560 60 L600 38 L600 200 L0 200 Z" fill="url(#pv)" />
        <path d="M0 160 L40 150 L80 152 L120 132 L160 138 L200 118 L240 122 L280 96 L320 104 L360 82 L400 92 L440 70 L480 76 L520 54 L560 60 L600 38" fill="none" stroke="#22D3B4" strokeWidth="2" />
      </svg>
      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/[0.045]">
        {[
          ["AUM", "$3.12M"], ["LPs", "412"], ["Window", "Quarterly"],
        ].map(([k, v]) => (
          <div key={k} className="text-center">
            <div className="font-heading text-[15px] font-semibold text-white">{v}</div>
            <div className="font-mono text-[9px] tracking-[0.12em] uppercase text-white/40 mt-0.5">{k}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -----------------------------------------------------------
   7. Marquee
   ----------------------------------------------------------- */
function Marquee() {
  const words = ["alpha", "execution", "discipline", "24/7", "pooled", "transparent", "on-chain", "calm", "signals", "automation", "ranked", "verifiable"];
  const seq = [...words, ...words];
  return (
    <section className="relative overflow-hidden border-t border-b border-white/[0.04] bg-black/40 py-10 sm:py-12">
      <div className="flex gap-10 sm:gap-14 whitespace-nowrap tc-marquee">
        {seq.map((w, i) => (
          <span key={i} className="font-heading text-[32px] sm:text-[44px] font-semibold tracking-[-0.02em] text-white/85 flex items-center gap-10 sm:gap-14">
            {w}
            <span className="text-tradeTeal/70 text-[24px] sm:text-[30px]">·</span>
          </span>
        ))}
      </div>
    </section>
  );
}

/* -----------------------------------------------------------
   8. How it works
   ----------------------------------------------------------- */
function HowItWorks() {
  const steps = [
    { n: "01", t: "Connect once", b: "Link an exchange via API or sign in with a wallet. Custody stays where it should." },
    { n: "02", t: "Pick a lane", b: "Trade manually in the terminal, follow AI signals, hand off to a bot, or allocate to the Pool." },
    { n: "03", t: "Stay in control", b: "Every action is logged, risk-capped, and reported. Pause or pull at any moment." },
  ];
  return (
    <Section className="py-20 sm:py-28">
      <div className="flex items-end justify-between gap-6 mb-9 px-1">
        <div>
          <Eyebrow index="06">How it works</Eyebrow>
          <h2 className="mt-3 font-heading text-[26px] sm:text-[36px] font-semibold tracking-[-0.02em] text-white">
            Three steps. No surprises.
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {steps.map((s, i) => (
          <div key={s.n} className="relative rounded-2xl bg-white/[0.022] border border-white/[0.06] p-6">
            <div className="font-mono text-[10.5px] tracking-[0.18em] uppercase text-tradeTeal">{s.n}</div>
            <h4 className="mt-3 font-heading text-[20px] font-semibold text-white">{s.t}</h4>
            <p className="mt-2 text-[13.5px] text-white/60 leading-[1.6]">{s.b}</p>
            {i < steps.length - 1 && (
              <span className="hidden md:block absolute top-1/2 -right-1.5 w-3 h-3 rounded-full bg-[#020809] border border-white/[0.08]" />
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}

/* -----------------------------------------------------------
   9. Testimonial
   ----------------------------------------------------------- */
function Testimonial() {
  return (
    <Section className="pb-20 sm:pb-28">
      <div className="rounded-3xl border border-white/[0.06] bg-gradient-to-br from-tradeTeal/[0.06] via-transparent to-transparent px-7 sm:px-14 py-12 sm:py-16">
        <Eyebrow>From the desk</Eyebrow>
        <p className="mt-6 font-heading text-[22px] sm:text-[34px] font-semibold tracking-[-0.02em] text-white/95 leading-[1.25] max-w-[920px]">
          “The first trading tool I've used that feels like an extension of how I already think.
          It doesn't push me to trade — it sharpens the trades I was already making.”
        </p>
        <div className="mt-7 flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-tradeTeal/20 border border-tradeTeal/30 flex items-center justify-center text-tradeTeal font-heading font-semibold">J</span>
          <div>
            <div className="text-[13.5px] font-semibold text-white">Jules R.</div>
            <div className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-white/45">discretionary trader · TradeCafe early access</div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* -----------------------------------------------------------
   10. Proof metrics
   ----------------------------------------------------------- */
function ProofMetrics() {
  const m = [
    { v: "$3.12M", l: "Managed in Pool" },
    { v: "81%", l: "Avg signal win rate" },
    { v: "20K+", l: "Trades placed" },
    { v: "24/7", l: "AI coverage" },
  ];
  return (
    <Section className="pb-20">
      <div className="rounded-2xl border border-tradeTeal/15 bg-gradient-to-br from-tradeTeal/[0.06] to-transparent px-6 sm:px-10 py-8 sm:py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        {m.map((x) => (
          <div key={x.l}>
            <div className="font-heading text-[30px] sm:text-[38px] font-semibold tracking-[-0.02em] text-white">{x.v}</div>
            <div className="font-mono text-[10.5px] tracking-[0.18em] uppercase text-white/55 mt-1">{x.l}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* -----------------------------------------------------------
   11. FAQ
   ----------------------------------------------------------- */
function Faq() {
  const items = [
    { q: "Does TradeCafe ever hold my funds?", a: "No. CEX accounts stay yours — we route through API keys with trade-only permissions. On-chain, you sign every transaction from your own wallet." },
    { q: "Are the AI signals advice?", a: "They're trade ideas with explicit entry, target, stop, and a conviction score. Nothing on TradeCafe is investment advice." },
    { q: "What's the Trading Pool actually doing?", a: "Aggregating capital into a small set of managed strategies on Arbitrum One, with defined exit windows and periodic, public performance reporting." },
    { q: "Can I run my own strategy on top of TradeCafe?", a: "Yes — every bot exposes risk caps, kill-switches, and a full audit trail. You can also build with our docs." },
    { q: "What does it cost?", a: "Core terminal access is free. Strategy bots and the signal layer have tiered plans. The Pool charges performance fees only on positive months." },
  ];
  const [open, setOpen] = useState(0);
  return (
    <Section className="pb-20 sm:pb-28">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-16">
        <div>
          <Eyebrow index="07">FAQ</Eyebrow>
          <h2 className="mt-3 font-heading text-[26px] sm:text-[36px] font-semibold tracking-[-0.02em] text-white leading-[1.08]">
            Questions worth answering up front.
          </h2>
          <p className="mt-4 text-[13.5px] text-white/55 max-w-[360px]">If yours isn't here, the team replies fast — try Support.</p>
          <Link to="/company/support" className="mt-5 inline-flex items-center gap-1.5 text-[13px] text-tradeTeal hover:text-white transition-colors">
            Contact support <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.2} />
          </Link>
        </div>
        <div className="flex flex-col">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <button
                key={i}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className={`text-left border-b border-white/[0.06] py-5 transition-colors ${isOpen ? "" : "hover:bg-white/[0.015]"}`}
                aria-expanded={isOpen}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-heading text-[16px] sm:text-[18px] font-semibold text-white">{it.q}</span>
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center border ${isOpen ? "bg-tradeTeal/15 border-tradeTeal/40 text-tradeTeal" : "border-white/15 text-white/55"} transition-colors shrink-0`}>
                    {isOpen ? <Minus className="w-3.5 h-3.5" strokeWidth={2} /> : <Plus className="w-3.5 h-3.5" strokeWidth={2} />}
                  </span>
                </div>
                <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr] mt-3" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <p className="text-[14px] text-white/60 leading-[1.65] max-w-[640px]">{it.a}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

/* -----------------------------------------------------------
   12. Big CTA band
   ----------------------------------------------------------- */
function BigCTA() {
  return (
    <Section className="pb-24 sm:pb-32">
      <div className="relative rounded-3xl overflow-hidden border border-tradeTeal/25">
        <div className="absolute inset-0 bg-gradient-to-br from-tradeTeal/[0.12] via-transparent to-tradeTeal/[0.06]" />
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-tradeTeal/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-tradeTeal/10 blur-3xl" />
        <div className="relative px-7 sm:px-14 py-14 sm:py-20 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 items-end lg:items-center">
          <div>
            <Eyebrow>Ready when you are</Eyebrow>
            <h2
              className="mt-5 font-heading font-semibold text-white leading-[1.04] tracking-[-0.03em]"
              style={{ fontSize: "clamp(34px, 4.6vw, 60px)" }}
            >
              Open the terminal. <span className="italic font-light text-white/85">Stay in control.</span>
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-stretch lg:max-w-[260px] lg:ml-auto">
            <Link to="/app/terminal" className="cta-primary justify-center">
              Launch Terminal <ArrowUpRight className="w-4 h-4" strokeWidth={2.4} />
            </Link>
            <Link to="/insights/performance" className="cta-ghost justify-center">
              See performance <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
