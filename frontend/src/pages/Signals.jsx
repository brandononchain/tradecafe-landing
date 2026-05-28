import { useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import {
  ArrowUpRight,
  ArrowRight,
  Database,
  Target,
  Filter,
  Network,
  Zap,
  TrendingUp,
  TrendingDown,
  Shield,
  FileText,
  Gauge,
  CheckCircle2,
} from "lucide-react";
import Nav from "../components/Nav";
import LiveTerminalPreview from "../components/LiveTerminalPreview";
import { EXTERNAL } from "../lib/brand";

const PIPELINE = [
  { key: "ref",     n: "01", title: "Reference Updated",  Icon: Database, desc: "Macro, sector, and on-chain references refresh continuously to anchor every read." },
  { key: "zone",    n: "02", title: "Zone Detected",      Icon: Target,   desc: "Algorithms identify supply / demand zones, liquidity pockets and key structure." },
  { key: "filters", n: "03", title: "Filters Passed",     Icon: Filter,   desc: "Volatility, volume, regime and risk filters strip out noisy, low-edge setups." },
  { key: "confirm", n: "04", title: "Market Confirmation",Icon: Network,  desc: "Cross-market correlation, BTC dominance and sector flow must agree before publishing." },
  { key: "fire",    n: "05", title: "Signal Fired",       Icon: Zap,      desc: "A complete setup is published with entries, exits, stops, context and confidence." },
];

const SIGNAL_INCLUDES = [
  { key: "entry",   title: "Entry Level",       Icon: TrendingUp,    accent: "teal",
    desc: "Exact price to enter, limit or zone, with optional scaled-in laddering." },
  { key: "tp",      title: "Take Profit",       Icon: Target,        accent: "teal",
    desc: "Tiered TP levels (TP1, TP2, TP3) with suggested partial close ratios." },
  { key: "sl",      title: "Stop Loss",         Icon: Shield,        accent: "orange",
    desc: "Hard invalidation, structurally placed, not arbitrary percentages." },
  { key: "context", title: "Signal Context",    Icon: FileText,      accent: "teal",
    desc: "Plain-language reasoning: what setup, what timeframe, what bias, why now." },
  { key: "conf",    title: "Confidence Layer",  Icon: Gauge,         accent: "teal",
    desc: "An AI-graded confidence score so you size proportional to edge, not emotion." },
];

const SAMPLE_SIGNAL = {
  sym: "ETH/USDT",
  dir: "LONG",
  entry: "3,498 – 3,512",
  tp1: "3,612",
  tp2: "3,748",
  tp3: "3,920",
  sl: "3,418",
  conf: 86,
  context: "Reclaim of 3,500 after liquidity sweep · BTC trend supportive · 4H regime: risk-on",
};

export default function Signals() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-s='eyebrow']",  { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.1 });
      gsap.fromTo("[data-s='title']",    { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.2 });
      gsap.fromTo("[data-s='sub']",      { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.35 });
      gsap.fromTo("[data-s='ctas'] > *", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.5, stagger: 0.08 });
      gsap.fromTo("[data-s='pipe']",     { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.65, stagger: 0.07 });
      gsap.fromTo("[data-s='inc']",      { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.9, stagger: 0.06 });
      gsap.fromTo("[data-s='sample']",   { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 1.1 });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-tradeWhite font-body" data-testid="signals-page">
      {/* Atmospheric bg */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0 opacity-[0.32]"
          style={{ backgroundImage: "url('/tradecafebackground-poster.jpg')", backgroundSize: "cover", backgroundPosition: "center", filter: "blur(3px) saturate(115%)" }} />
        <div className="absolute inset-0"
          style={{
            background:
              "radial-gradient(900px 700px at 80% 0%, rgba(0,180,166,0.16), transparent 55%)," +
              "radial-gradient(1100px 800px at 10% 100%, rgba(232,120,42,0.12), transparent 55%)," +
              "linear-gradient(180deg, rgba(2,8,9,0.82) 0%, rgba(2,8,9,0.92) 60%, rgba(2,8,9,0.96) 100%)",
          }} />
        {/* faint chart lines */}
        <ChartLinesBg />
        <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
          style={{
            backgroundImage:
              "url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')",
          }} />
      </div>

      <section className="hero-frame !min-h-[unset] relative z-10 pb-16 sm:pb-20 md:pb-24">
        <Nav />

        {/* ===== Hero ===== */}
        <header className="relative z-20 pt-28 sm:pt-36 md:pt-40 lg:pt-44 px-6 sm:px-10 md:px-14 lg:px-16 pb-12 sm:pb-16 max-w-[1280px] mx-auto">
          <div data-s="eyebrow" className="hero-kicker text-[11px] text-tradeTeal/95 flex items-center gap-2 mb-5">
            <span className="trade-pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-tradeTeal" />
            Signal Bot
          </div>
          <h1
            data-s="title"
            data-testid="signals-title"
            className="font-heading font-semibold text-tradeWhite max-w-[960px]"
            style={{ fontSize: "clamp(34px, 5.4vw, 76px)", lineHeight: "1.02", letterSpacing: "-0.04em" }}
          >
            AI-powered signals{" "}
            <span className="italic font-light text-white/95">without the noise</span>.
          </h1>
          <p
            data-s="sub"
            data-testid="signals-subheadline"
            className="mt-6 sm:mt-7 text-[15px] sm:text-[17px] leading-[1.6] text-white/72 max-w-[760px]"
          >
            TradeCafe scans markets 24/7 and surfaces high-probability setups with entry
            levels, exits, TP/SL, and the context behind every signal.
          </p>
          <div data-s="ctas" className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <a href={EXTERNAL.launchTerminal} className="cta-primary justify-center sm:justify-start sm:self-start" data-testid="signals-cta-start">
              Start With Signals
              <ArrowUpRight className="w-4 h-4" strokeWidth={2.4} />
            </a>
            <a href="#pipeline" className="cta-ghost justify-center sm:justify-start sm:self-start group" data-testid="signals-cta-how">
              See How Signals Work
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
            </a>
          </div>

          {/* Anti-blackbox line */}
          <div className="mt-8 sm:mt-10 max-w-[760px] flex items-start gap-3 text-[13px] leading-[1.55] text-white/55">
            <span className="mt-1 inline-flex w-5 h-5 items-center justify-center rounded-md bg-tradeTeal/10 border border-tradeTeal/30 shrink-0">
              <CheckCircle2 className="w-3 h-3 text-tradeTeal" strokeWidth={2.2} />
            </span>
            <p>
              <span className="text-white/80">Not black-box predictions.</span> Every TradeCafe signal is a
              structured setup, built from references, zones, filters, cross-market
              confirmation, and exact entry levels you can audit.
            </p>
          </div>
        </header>

        {/* ===== Live signal, charted (real component) ===== */}
        <div className="relative z-20 px-4 sm:px-6 md:px-10 lg:px-14 max-w-[1280px] mx-auto mb-16 sm:mb-20">
          <div className="flex items-center gap-2 mb-3">
            <span className="trade-pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-tradeTeal" />
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/50">AI-charted signal · interactive</span>
          </div>
          <LiveTerminalPreview
            symbol="ETHUSDT"
            label="ETHUSDT · LONG signal · Entry / TP / SL"
            signal={{ entry: 3512.18, target: 3640, stop: 3440, dir: "LONG" }}
          />
        </div>

        {/* ===== Signal Pipeline ===== */}
        <div id="pipeline" className="relative z-20 px-4 sm:px-6 md:px-10 lg:px-14 max-w-[1280px] mx-auto">
          <SectionLabel index="01" title="Signal Pipeline" caption="From raw markets to a clean, audited setup." />

          <div className="tc-pipeline" data-testid="signal-pipeline">
            {PIPELINE.map((p, i) => {
              const Ic = p.Icon;
              return (
                <div key={p.key} data-s="pipe" data-testid={`pipeline-${p.key}`} className="tc-pipe-card">
                  <div className="tc-pipe-num">{p.n}</div>
                  <div className="tc-pipe-icon"><Ic className="w-5 h-5" strokeWidth={1.8} /></div>
                  <div className="tc-pipe-title">{p.title}</div>
                  <div className="tc-pipe-desc">{p.desc}</div>
                  {i < PIPELINE.length - 1 && (
                    <div className="tc-pipe-link" aria-hidden>
                      <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== Every signal includes ===== */}
        <div className="relative z-20 px-4 sm:px-6 md:px-10 lg:px-14 max-w-[1280px] mx-auto mt-20 sm:mt-24">
          <SectionLabel index="02" title="Every signal includes" caption="Structured, transparent, and built to be acted on." />

          <div className="tc-includes" data-testid="signal-includes">
            {SIGNAL_INCLUDES.map((s) => {
              const Ic = s.Icon;
              return (
                <div key={s.key} data-s="inc" data-testid={`include-${s.key}`} className={`tc-inc-card is-${s.accent}`}>
                  <div className="tc-inc-icon"><Ic className="w-4 h-4" strokeWidth={2} /></div>
                  <div className="tc-inc-title">{s.title}</div>
                  <p className="tc-inc-desc">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== Sample Signal ===== */}
        <div className="relative z-20 px-4 sm:px-6 md:px-10 lg:px-14 max-w-[1280px] mx-auto mt-20 sm:mt-24">
          <SectionLabel index="03" title="A sample signal" caption="What you actually receive." />
          <div data-s="sample" className="tc-sample" data-testid="signal-sample">
            <div className="tc-sample-head">
              <div className="flex items-center gap-3">
                <span className={`tc-signal-side ${SAMPLE_SIGNAL.dir === "LONG" ? "is-long" : "is-short"}`}>
                  {SAMPLE_SIGNAL.dir === "LONG" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {SAMPLE_SIGNAL.dir}
                </span>
                <span className="font-heading text-[18px] font-semibold tracking-tight text-white">{SAMPLE_SIGNAL.sym}</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/55">
                <span className="trade-pulse-dot w-1.5 h-1.5 rounded-full bg-tradeTeal inline-block" />
                Live setup
              </div>
            </div>

            <div className="tc-sample-grid">
              <SampleRow label="Entry"        value={SAMPLE_SIGNAL.entry}  tone="white" />
              <SampleRow label="TP1 · Partial" value={SAMPLE_SIGNAL.tp1}   tone="teal" />
              <SampleRow label="TP2 · Partial" value={SAMPLE_SIGNAL.tp2}   tone="teal" />
              <SampleRow label="TP3 · Final"   value={SAMPLE_SIGNAL.tp3}   tone="teal" />
              <SampleRow label="Stop Loss"     value={SAMPLE_SIGNAL.sl}    tone="orange" />
              <div className="tc-sample-row">
                <span className="tc-sample-label">Confidence</span>
                <div className="flex items-center gap-3 flex-1">
                  <span className="tc-conf-bar flex-1"><span style={{ width: `${SAMPLE_SIGNAL.conf}%` }} /></span>
                  <span className="font-mono text-[12px] text-tradeTeal">{SAMPLE_SIGNAL.conf}</span>
                </div>
              </div>
            </div>

            <div className="tc-sample-context">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">Context</span>
              <p className="mt-1.5 text-[13.5px] leading-[1.55] text-white/78">{SAMPLE_SIGNAL.context}</p>
            </div>
          </div>
        </div>

        {/* ===== Final CTA strip ===== */}
        <div className="relative z-20 px-4 sm:px-6 md:px-10 lg:px-14 max-w-[1280px] mx-auto mt-20 sm:mt-24">
          <div className="tc-final-cta">
            <div className="flex-1 min-w-0">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-tradeTeal/95 mb-2">Ready when you are</div>
              <h3 className="font-heading text-[22px] sm:text-[26px] font-semibold text-white leading-tight tracking-tight">
                Stop guessing. Start trading{" "}
                <span className="italic font-light">structured setups</span>.
              </h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a href={EXTERNAL.launchTerminal} className="cta-primary justify-center" data-testid="signals-final-cta">
                Start With Signals
                <ArrowUpRight className="w-4 h-4" strokeWidth={2.4} />
              </a>
              <Link to="/terminal" className="cta-ghost justify-center group" data-testid="signals-final-terminal">
                Open Terminal
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============== Subcomponents ============== */

function SectionLabel({ index, title, caption }) {
  return (
    <div className="flex items-end justify-between gap-6 mb-7 sm:mb-9 px-2">
      <div>
        <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-tradeTeal/85 mb-2">{index} · Section</div>
        <h2 className="font-heading text-[22px] sm:text-[28px] font-semibold tracking-tight text-white">{title}</h2>
      </div>
      {caption && <p className="hidden sm:block text-[13px] text-white/55 max-w-[320px] text-right">{caption}</p>}
    </div>
  );
}

function SampleRow({ label, value, tone }) {
  const toneCls = tone === "teal" ? "text-tradeTeal" : tone === "orange" ? "text-tradeOrange" : "text-white";
  return (
    <div className="tc-sample-row">
      <span className="tc-sample-label">{label}</span>
      <span className={`font-mono text-[14px] tabular-nums ${toneCls}`}>{value}</span>
    </div>
  );
}

function ChartLinesBg() {
  // subtle horizontal chart-style gridlines + a couple of diagonal price paths
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.07]"
      preserveAspectRatio="none"
      viewBox="0 0 1600 900"
      aria-hidden
    >
      <defs>
        <linearGradient id="lineFade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#00B4A6" stopOpacity="0" />
          <stop offset="50%" stopColor="#00B4A6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#00B4A6" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[120, 240, 360, 480, 600, 720, 840].map((y) => (
        <line key={y} x1="0" x2="1600" y1={y} y2={y} stroke="#F5F6F2" strokeWidth="0.6" />
      ))}
      <path d="M0 620 L200 600 L320 615 L460 560 L600 540 L760 500 L900 520 L1080 460 L1240 430 L1400 380 L1600 360"
        fill="none" stroke="url(#lineFade)" strokeWidth="1.4" />
      <path d="M0 740 L240 720 L420 695 L580 680 L740 650 L920 660 L1100 610 L1280 600 L1450 560 L1600 545"
        fill="none" stroke="url(#lineFade)" strokeWidth="1.2" opacity="0.7" />
    </svg>
  );
}
