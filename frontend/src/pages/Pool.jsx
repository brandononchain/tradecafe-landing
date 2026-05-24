import { useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import {
  ArrowUpRight,
  ArrowRight,
  Wallet,
  Cpu,
  TrendingUp,
  LogOut,
  Bot,
  Layers,
  Eye,
  FileSignature,
  AlertTriangle,
  Activity,
  Users,
  CheckCircle2,
  Hourglass,
  ShieldCheck,
  Network,
} from "lucide-react";
import Nav from "../components/Nav";
import { EXTERNAL } from "../lib/brand";

const POOL_STEPS = [
  { key: "alloc",  n: "01", title: "Allocate",            Icon: Wallet,    desc: "Commit capital into the pool through TradeCafe's defined participation terms." },
  { key: "run",    n: "02", title: "Strategy Runs",       Icon: Cpu,       desc: "Pool capital is deployed by TradeCafe's strategy logic across markets and timeframes." },
  { key: "accrue", n: "03", title: "Returns Accumulate",  Icon: TrendingUp,desc: "Performance — positive or negative — is reported transparently throughout the term." },
  { key: "draw",   n: "04", title: "Withdraw After Term", Icon: LogOut,    desc: "At the end of the agreed term, allocations and accrued performance settle for withdrawal." },
];

const COMPARISON_ROWS = [
  { label: "Time commitment",     bot: "Active / supervised",    pool: "Passive · set & forget" },
  { label: "Control level",       bot: "You set every rule",     pool: "Strategy team manages" },
  { label: "Trade visibility",    bot: "Per-trade detail",       pool: "Pool-level reporting" },
  { label: "Capital access",      bot: "Anytime",                pool: "Locked for the term" },
  { label: "Skill required",      bot: "Some trading literacy",  pool: "None required" },
  { label: "Fee model",           bot: "Per execution",          pool: "Performance-based" },
  { label: "Best for",            bot: "Hands-on traders",       pool: "Passive participants" },
];

const TRUST_CARDS = [
  { key: "report",  title: "Transparent performance reporting", Icon: Eye,           desc: "Pool returns, drawdowns, allocations, and changes are reported on a defined cadence." },
  { key: "terms",   title: "Defined participation terms",       Icon: FileSignature, desc: "Lock periods, allocation limits, fee structure, and exit windows are agreed up front." },
  { key: "risk",    title: "Risk acknowledgement required",     Icon: AlertTriangle, desc: "Participation requires an explicit understanding that trading involves loss of capital." },
  { key: "status",  title: "Pool status dashboard",             Icon: Activity,      desc: "Live status of strategy posture, exposure, and risk metrics from inside the terminal." },
  { key: "loop",    title: "Partner-compatible growth loop",    Icon: Network,       desc: "Participation integrates with the TradeCafe partner network for ecosystem growth." },
];

export default function Pool() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-p='eyebrow']",  { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.1 });
      gsap.fromTo("[data-p='title']",    { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.2 });
      gsap.fromTo("[data-p='sub']",      { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.35 });
      gsap.fromTo("[data-p='ctas'] > *", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.5, stagger: 0.08 });
      gsap.fromTo("[data-p='snap']",     { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.6 });
      gsap.fromTo("[data-p='step']",     { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.75, stagger: 0.07 });
      gsap.fromTo("[data-p='trust']",    { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 1.0, stagger: 0.05 });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-tradeWhite font-body" data-testid="pool-page">
      {/* Atmospheric bg */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0 opacity-[0.30]"
          style={{ backgroundImage: "url('/tradecafebackground-poster.jpg')", backgroundSize: "cover", backgroundPosition: "center", filter: "blur(3px) saturate(115%)" }} />
        <div className="absolute inset-0"
          style={{
            background:
              "radial-gradient(900px 700px at 12% 0%, rgba(0,180,166,0.14), transparent 55%)," +
              "radial-gradient(1100px 800px at 95% 100%, rgba(232,120,42,0.10), transparent 55%)," +
              "linear-gradient(180deg, rgba(2,8,9,0.82) 0%, rgba(2,8,9,0.92) 60%, rgba(2,8,9,0.96) 100%)",
          }} />
        <div className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
          style={{
            backgroundImage:
              "url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')",
          }} />
      </div>

      <section className="hero-frame !min-h-[unset] relative z-10 pb-16 sm:pb-20 md:pb-24">
        <Nav />

        {/* ===== Hero ===== */}
        <header className="relative z-20 pt-28 sm:pt-36 md:pt-40 lg:pt-44 px-6 sm:px-10 md:px-14 lg:px-16 pb-12 sm:pb-16 max-w-[1280px] mx-auto">
          <div data-p="eyebrow" className="hero-kicker text-[11px] text-tradeTeal/95 flex items-center gap-2 mb-5">
            <span className="trade-pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-tradeTeal" />
            Trading Pool
          </div>
          <h1
            data-p="title"
            data-testid="pool-title"
            className="font-heading font-semibold text-tradeWhite max-w-[960px]"
            style={{ fontSize: "clamp(34px, 5.4vw, 76px)", lineHeight: "1.02", letterSpacing: "-0.04em" }}
          >
            Passive exposure to{" "}
            <span className="italic font-light text-white/95">the TradeCafe strategy</span>.
          </h1>
          <p
            data-p="sub"
            data-testid="pool-subheadline"
            className="mt-6 sm:mt-7 text-[15px] sm:text-[17px] leading-[1.6] text-white/72 max-w-[760px]"
          >
            Allocate capital into a managed trading pool powered by TradeCafe's strategy
            logic, optimized execution, and ecosystem-level trading infrastructure.
          </p>
          <div data-p="ctas" className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <a href={EXTERNAL.launchTerminal} className="cta-primary justify-center sm:justify-start sm:self-start" data-testid="pool-cta-access">
              Explore Pool Access
              <ArrowUpRight className="w-4 h-4" strokeWidth={2.4} />
            </a>
            <a href="#how" className="cta-ghost justify-center sm:justify-start sm:self-start group" data-testid="pool-cta-model">
              View Pool Model
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
            </a>
          </div>

          {/* Risk acknowledgment row */}
          <div className="mt-8 sm:mt-10 max-w-[820px] flex items-start gap-3 text-[13px] leading-[1.55] text-white/55">
            <span className="mt-1 inline-flex w-5 h-5 items-center justify-center rounded-md bg-tradeOrange/10 border border-tradeOrange/30 shrink-0">
              <AlertTriangle className="w-3 h-3 text-tradeOrange" strokeWidth={2.2} />
            </span>
            <p>
              <span className="text-white/80">Not guaranteed income.</span> The Pool is passive
              exposure to a live trading strategy. Performance — positive or negative —
              is reported transparently and capital is subject to market risk.
            </p>
          </div>
        </header>

        {/* ===== Pool Snapshot ===== */}
        <div className="relative z-20 px-4 sm:px-6 md:px-10 lg:px-14 max-w-[1280px] mx-auto">
          <div data-p="snap" className="tc-pool-snap" data-testid="pool-snapshot">
            <div className="tc-pool-snap-head">
              <div className="flex items-center gap-2.5">
                <span className="tc-pool-snap-dot trade-pulse-dot" />
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/65">
                  Pool · Live Snapshot
                </span>
              </div>
              <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/40">
                Indicative · subject to change
              </span>
            </div>
            <div className="tc-pool-snap-grid">
              <SnapStat label="Strategy" value="Multi-strat" sub="Spot · perps · pairs" />
              <SnapStat label="AUM" value="$3.12M" sub="412 participants" />
              <SnapStat label="Cycle" value="Quarterly" sub="90-day term · 7-day exit window" />
              <SnapStat label="MTD" value="+1.84%" sub="As of last close" accent="teal" />
            </div>
            <Sparkline className="mt-5" />
          </div>
        </div>

        {/* ===== How the Pool Works ===== */}
        <div id="how" className="relative z-20 px-4 sm:px-6 md:px-10 lg:px-14 max-w-[1280px] mx-auto mt-20 sm:mt-24">
          <SectionLabel index="01" title="How the Pool works" caption="Four phases. Defined terms throughout." />
          <div className="tc-pipeline" data-testid="pool-how">
            {POOL_STEPS.map((s, i) => {
              const Ic = s.Icon;
              return (
                <div key={s.key} data-p="step" data-testid={`pool-step-${s.key}`} className="tc-pipe-card">
                  <div className="tc-pipe-num">{s.n}</div>
                  <div className="tc-pipe-icon"><Ic className="w-5 h-5" strokeWidth={1.8} /></div>
                  <div className="tc-pipe-title">{s.title}</div>
                  <div className="tc-pipe-desc">{s.desc}</div>
                  {i < POOL_STEPS.length - 1 && (
                    <div className="tc-pipe-link" aria-hidden>
                      <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== Comparison ===== */}
        <div className="relative z-20 px-4 sm:px-6 md:px-10 lg:px-14 max-w-[1280px] mx-auto mt-20 sm:mt-24">
          <SectionLabel index="02" title="Trading Bot vs Trading Pool" caption="Two ways to engage. Same ecosystem behind both." />
          <div className="tc-compare" data-testid="pool-compare">
            {/* Header */}
            <div className="tc-compare-row tc-compare-head">
              <div className="tc-compare-cell tc-compare-cell-label" />
              <div className="tc-compare-cell">
                <div className="tc-compare-h">
                  <span className="tc-compare-h-icon"><Bot className="w-4 h-4" strokeWidth={2} /></span>
                  <div>
                    <div className="tc-compare-h-eyebrow">Hands-on</div>
                    <div className="tc-compare-h-title">Trading Bot</div>
                  </div>
                </div>
              </div>
              <div className="tc-compare-cell">
                <div className="tc-compare-h is-teal">
                  <span className="tc-compare-h-icon is-teal"><Layers className="w-4 h-4" strokeWidth={2} /></span>
                  <div>
                    <div className="tc-compare-h-eyebrow">Passive</div>
                    <div className="tc-compare-h-title">Trading Pool</div>
                  </div>
                </div>
              </div>
            </div>
            {COMPARISON_ROWS.map((r) => (
              <div key={r.label} className="tc-compare-row">
                <div className="tc-compare-cell tc-compare-cell-label">{r.label}</div>
                <div className="tc-compare-cell">{r.bot}</div>
                <div className="tc-compare-cell tc-compare-cell-pool">{r.pool}</div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <Link to="/automation" className="cta-ghost justify-center sm:self-start group" data-testid="pool-link-bot">
              Open Trading Bot
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
            </Link>
          </div>
        </div>

        {/* ===== Trust section ===== */}
        <div className="relative z-20 px-4 sm:px-6 md:px-10 lg:px-14 max-w-[1280px] mx-auto mt-20 sm:mt-24">
          <SectionLabel index="03" title="What the Pool guarantees" caption="Process and transparency — not returns." />
          <div className="tc-includes" data-testid="pool-trust">
            {TRUST_CARDS.map((t) => {
              const Ic = t.Icon;
              const accent = t.key === "risk" ? "is-orange" : "is-teal";
              return (
                <div key={t.key} data-p="trust" data-testid={`pool-trust-${t.key}`} className={`tc-inc-card ${accent}`}>
                  <div className="tc-inc-icon"><Ic className="w-4 h-4" strokeWidth={2} /></div>
                  <div className="tc-inc-title">{t.title}</div>
                  <p className="tc-inc-desc">{t.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== Final CTA + Risk language ===== */}
        <div className="relative z-20 px-4 sm:px-6 md:px-10 lg:px-14 max-w-[1280px] mx-auto mt-20 sm:mt-24">
          <div className="tc-final-cta">
            <div className="flex-1 min-w-0">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-tradeTeal/95 mb-2 flex items-center gap-2">
                <Hourglass className="w-3 h-3" /> Quarterly cycle · capacity-limited
              </div>
              <h3 className="font-heading text-[22px] sm:text-[26px] font-semibold text-white leading-tight tracking-tight">
                Step back from the screen.{" "}
                <span className="italic font-light">Let the strategy work.</span>
              </h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a href={EXTERNAL.launchTerminal} className="cta-primary justify-center" data-testid="pool-final-cta">
                Explore Pool Access
                <ArrowUpRight className="w-4 h-4" strokeWidth={2.4} />
              </a>
              <Link to="/terminal" className="cta-ghost justify-center group" data-testid="pool-link-terminal">
                View Terminal
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
              </Link>
            </div>
          </div>

          {/* Risk disclaimer block */}
          <div className="mt-8 sm:mt-10 tc-risk-disclaimer" data-testid="pool-risk-disclaimer">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-white/55" strokeWidth={2} />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">Risk acknowledgement</span>
            </div>
            <p className="text-[12.5px] leading-[1.6] text-white/55">
              Participation in the TradeCafe Trading Pool involves market risk and the
              potential loss of allocated capital. Past performance is not indicative of
              future results. TradeCafe makes no guarantee, express or implied, of return
              outcomes. All participants are required to read and acknowledge full
              participation terms and risk disclosures prior to allocation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* === Subcomponents === */
function SectionLabel({ index, title, caption }) {
  return (
    <div className="flex items-end justify-between gap-6 mb-7 sm:mb-9 px-2">
      <div>
        <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-tradeTeal/85 mb-2">{index} · Section</div>
        <h2 className="font-heading text-[22px] sm:text-[28px] font-semibold tracking-tight text-white">{title}</h2>
      </div>
      {caption && <p className="hidden sm:block text-[13px] text-white/55 max-w-[360px] text-right">{caption}</p>}
    </div>
  );
}

function SnapStat({ label, value, sub, accent }) {
  const v = accent === "teal" ? "text-tradeTeal" : "text-white";
  return (
    <div className="tc-snap-stat">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">{label}</span>
      <span className={`font-heading text-[22px] sm:text-[26px] font-semibold leading-none mt-1.5 ${v}`}>{value}</span>
      {sub && <span className="font-mono text-[10.5px] text-white/45 mt-2">{sub}</span>}
    </div>
  );
}

function Sparkline({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 1100 80" preserveAspectRatio="none" style={{ width: "100%", height: 80 }} aria-hidden>
      <defs>
        <linearGradient id="poolFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#00B4A6" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#00B4A6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 64 L70 60 L140 56 L210 58 L280 50 L350 52 L420 44 L490 46 L560 38 L630 40 L700 30 L770 28 L840 22 L910 18 L980 12 L1050 14 L1100 8 L1100 80 L0 80 Z"
        fill="url(#poolFill)" />
      <path d="M0 64 L70 60 L140 56 L210 58 L280 50 L350 52 L420 44 L490 46 L560 38 L630 40 L700 30 L770 28 L840 22 L910 18 L980 12 L1050 14 L1100 8"
        fill="none" stroke="#00B4A6" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
