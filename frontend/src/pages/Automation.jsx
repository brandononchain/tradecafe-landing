import { useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import {
  ArrowUpRight,
  ArrowRight,
  Bot,
  Hand,
  Headset,
  PieChart,
  ListChecks,
  Repeat,
  ShieldCheck,
  AlertOctagon,
  CheckCircle2,
  Crosshair,
  Calculator,
  PlayCircle,
  Activity,
  LogOut,
  FileText,
  Sparkles,
} from "lucide-react";
import Nav from "../components/Nav";
import { EXTERNAL } from "../lib/brand";

const LEVELS = [
  {
    key: "auto",
    label: "Automatic",
    eyebrow: "Hands-free",
    Icon: Bot,
    accent: "teal",
    tagline: "Full execution, you set the rails.",
    desc: "Signals → risk checks → execution → management → exit. You define the boundaries; TradeCafe handles every click.",
    bullets: [
      "Real-time signal-to-trade routing",
      "Auto position sizing & TP/SL placement",
      "24/7 management while you sleep",
    ],
    badge: "Recommended",
  },
  {
    key: "semi",
    label: "Semi-Automatic",
    eyebrow: "One-tap confirm",
    Icon: Hand,
    accent: "teal",
    tagline: "Your judgment, our execution.",
    desc: "Every signal arrives pre-sized with full context. One tap to fire, one tap to skip — TradeCafe handles the rest.",
    bullets: [
      "Pre-sized orders ready to fire",
      "Manual approval on every trade",
      "Auto management after approval",
    ],
  },
  {
    key: "assist",
    label: "Assistant",
    eyebrow: "Manual + intelligence",
    Icon: Headset,
    accent: "orange",
    tagline: "You trade. We watch your back.",
    desc: "Trade fully manually while TradeCafe runs risk monitoring, alerts you to invalidations, and surfaces context as it changes.",
    bullets: [
      "Risk + invalidation alerts",
      "Live market context overlays",
      "Audit log of every decision",
    ],
  },
];

const RISK_LOGIC = [
  { key: "7030",   title: "70/30 Capital Logic",         Icon: PieChart,
    desc: "70% steady-state risk, 30% reserved tactical capital — never both deployed at once." },
  { key: "limits", title: "Position Limits",             Icon: ListChecks,
    desc: "Hard caps per symbol, per sector, per side — automation refuses to violate them." },
  { key: "avg",    title: "Averaging Rules",             Icon: Repeat,
    desc: "Disciplined DCA with structural anchors, not emotional revenge entries." },
  { key: "trail",  title: "Trailing Protection",         Icon: ShieldCheck,
    desc: "Adaptive trailing stops that tighten as winners mature, lock profit by step." },
  { key: "circuit",title: "Drawdown Circuit Breaker",    Icon: AlertOctagon,
    desc: "Cool-off period auto-triggers at predefined drawdown — protects you from yourself." },
];

const FLOW = [
  { key: "sig",   title: "Signal Confirmed",   Icon: CheckCircle2 },
  { key: "risk",  title: "Risk Checked",       Icon: ShieldCheck },
  { key: "size",  title: "Position Sized",     Icon: Calculator },
  { key: "exec",  title: "Trade Executed",     Icon: PlayCircle },
  { key: "mng",   title: "Position Managed",   Icon: Activity },
  { key: "exit",  title: "Exit Triggered",     Icon: LogOut },
  { key: "log",   title: "Performance Logged", Icon: FileText },
];

export default function Automation() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-a='eyebrow']",  { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.1 });
      gsap.fromTo("[data-a='title']",    { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.2 });
      gsap.fromTo("[data-a='sub']",      { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.35 });
      gsap.fromTo("[data-a='ctas'] > *", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.5, stagger: 0.08 });
      gsap.fromTo("[data-a='lvl']",      { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.65, stagger: 0.10 });
      gsap.fromTo("[data-a='risk']",     { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.85, stagger: 0.06 });
      gsap.fromTo("[data-a='flow']",     { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 1.05, stagger: 0.05 });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-tradeWhite font-body" data-testid="automation-page">
      {/* Atmospheric bg */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0 opacity-[0.30]"
          style={{ backgroundImage: "url('/tradecafebackground-poster.jpg')", backgroundSize: "cover", backgroundPosition: "center", filter: "blur(3px) saturate(115%)" }} />
        <div className="absolute inset-0"
          style={{
            background:
              "radial-gradient(900px 700px at 20% 0%, rgba(0,180,166,0.14), transparent 55%)," +
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
          <div data-a="eyebrow" className="hero-kicker text-[11px] text-tradeTeal/95 flex items-center gap-2 mb-5">
            <span className="trade-pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-tradeTeal" />
            Trading Bot
          </div>
          <h1
            data-a="title"
            data-testid="automation-title"
            className="font-heading font-semibold text-tradeWhite max-w-[960px]"
            style={{ fontSize: "clamp(34px, 5.4vw, 76px)", lineHeight: "1.02", letterSpacing: "-0.04em" }}
          >
            Automated execution,{" "}
            <span className="italic font-light text-white/95">built for control</span>.
          </h1>
          <p
            data-a="sub"
            data-testid="automation-subheadline"
            className="mt-6 sm:mt-7 text-[15px] sm:text-[17px] leading-[1.6] text-white/72 max-w-[760px]"
          >
            TradeCafe can convert signals into live trades, manage positions, apply risk
            rules, and protect capital through defined execution logic.
          </p>
          <div data-a="ctas" className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <a href={EXTERNAL.launchTerminal} className="cta-primary justify-center sm:justify-start sm:self-start" data-testid="automation-cta-start">
              Automate Trading
              <ArrowUpRight className="w-4 h-4" strokeWidth={2.4} />
            </a>
            <a href="#risk" className="cta-ghost justify-center sm:justify-start sm:self-start group" data-testid="automation-cta-risk">
              Explore Risk Controls
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
            </a>
          </div>

          {/* Controlled execution row */}
          <div className="mt-8 sm:mt-10 max-w-[780px] flex items-start gap-3 text-[13px] leading-[1.55] text-white/55">
            <span className="mt-1 inline-flex w-5 h-5 items-center justify-center rounded-md bg-tradeTeal/10 border border-tradeTeal/30 shrink-0">
              <ShieldCheck className="w-3 h-3 text-tradeTeal" strokeWidth={2.2} />
            </span>
            <p>
              <span className="text-white/80">Controlled — not reckless.</span> Automation runs inside guardrails
              you define. Every order passes a risk check, every position sits inside a
              hard limit, and circuit breakers stop runaway drawdowns.
            </p>
          </div>
        </header>

        {/* ===== Levels of control ===== */}
        <div className="relative z-20 px-4 sm:px-6 md:px-10 lg:px-14 max-w-[1280px] mx-auto">
          <SectionLabel index="01" title="Choose your level of control" caption="Three execution modes — same underlying logic, different amounts of hands-on time." />
          <div className="tc-levels" data-testid="automation-levels">
            {LEVELS.map((lv) => {
              const Ic = lv.Icon;
              return (
                <div key={lv.key} data-a="lvl" data-testid={`level-${lv.key}`} className={`tc-level is-${lv.accent}`}>
                  {lv.badge && <span className="tc-level-badge">{lv.badge}</span>}
                  <div className="tc-level-icon"><Ic className="w-5 h-5" strokeWidth={1.8} /></div>
                  <div className="tc-level-eyebrow">{lv.eyebrow}</div>
                  <h3 className="tc-level-title">{lv.label}</h3>
                  <p className="tc-level-tag">{lv.tagline}</p>
                  <p className="tc-level-desc">{lv.desc}</p>
                  <ul className="tc-level-list">
                    {lv.bullets.map((b, i) => (
                      <li key={i}>
                        <CheckCircle2 className="w-3.5 h-3.5 text-tradeTeal shrink-0 mt-0.5" strokeWidth={2.2} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== Risk logic built in ===== */}
        <div id="risk" className="relative z-20 px-4 sm:px-6 md:px-10 lg:px-14 max-w-[1280px] mx-auto mt-20 sm:mt-24">
          <SectionLabel index="02" title="Risk logic built in" caption="Capital protection isn't a setting. It's the foundation." />
          <div className="tc-includes" data-testid="risk-logic">
            {RISK_LOGIC.map((r) => {
              const Ic = r.Icon;
              return (
                <div key={r.key} data-a="risk" data-testid={`risk-${r.key}`} className="tc-inc-card is-teal">
                  <div className="tc-inc-icon"><Ic className="w-4 h-4" strokeWidth={2} /></div>
                  <div className="tc-inc-title">{r.title}</div>
                  <p className="tc-inc-desc">{r.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== Automation Flow (horizontal) ===== */}
        <div className="relative z-20 px-4 sm:px-6 md:px-10 lg:px-14 max-w-[1320px] mx-auto mt-20 sm:mt-24">
          <SectionLabel index="03" title="The execution flow" caption="Every trade walks this exact 7-step path. No exceptions." />
          <div className="tc-flow" data-testid="automation-flow">
            {FLOW.map((f, i) => {
              const Ic = f.Icon;
              return (
                <div key={f.key} className="tc-flow-step" data-a="flow" data-testid={`flow-${f.key}`}>
                  <div className="tc-flow-node">
                    <Ic className="w-4 h-4" strokeWidth={2} />
                  </div>
                  <div className="tc-flow-meta">
                    <span className="tc-flow-num">0{i + 1}</span>
                    <span className="tc-flow-label">{f.title}</span>
                  </div>
                  {i < FLOW.length - 1 && (
                    <span className="tc-flow-arrow" aria-hidden>
                      <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Tiny stat row under the flow */}
          <div className="mt-8 sm:mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
            <FlowStat label="Avg cycle"     value="0.42s" />
            <FlowStat label="Pre-trade checks" value="14" />
            <FlowStat label="Slippage budget"  value="≤ 8 bps" />
            <FlowStat label="Logs retained"    value="100%" />
          </div>
        </div>

        {/* ===== Final CTA ===== */}
        <div className="relative z-20 px-4 sm:px-6 md:px-10 lg:px-14 max-w-[1280px] mx-auto mt-20 sm:mt-24">
          <div className="tc-final-cta">
            <div className="flex-1 min-w-0">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-tradeTeal/95 mb-2 flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> Ship with discipline
              </div>
              <h3 className="font-heading text-[22px] sm:text-[26px] font-semibold text-white leading-tight tracking-tight">
                Automate the trade.{" "}
                <span className="italic font-light">Keep the control.</span>
              </h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a href={EXTERNAL.launchTerminal} className="cta-primary justify-center" data-testid="automation-final-cta">
                Automate Trading
                <ArrowUpRight className="w-4 h-4" strokeWidth={2.4} />
              </a>
              <Link to="/signals" className="cta-ghost justify-center group" data-testid="automation-link-signals">
                Back to Signals
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
              </Link>
            </div>
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
      {caption && <p className="hidden sm:block text-[13px] text-white/55 max-w-[340px] text-right">{caption}</p>}
    </div>
  );
}

function FlowStat({ label, value }) {
  return (
    <div className="tc-flow-stat">
      <span className="font-mono text-[20px] font-semibold text-white leading-none">{value}</span>
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">{label}</span>
    </div>
  );
}
