import { useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import {
  ArrowUpRight,
  ArrowRight,
  Users,
  Repeat,
  Layers,
  Trophy,
  Globe2,
  GitBranch,
  Gauge,
  BadgeCheck,
  GraduationCap,
  Sparkles,
  Crown,
  Diamond,
  Award,
  Network,
} from "lucide-react";
import Nav from "../components/Nav";
import ProofCard from "../components/ProofCard";
import { EXTERNAL } from "../lib/brand";

const GROW_WAYS = [
  {
    key: "ref",
    title: "Referral Bonus",
    Icon: Users,
    desc: "Earn a defined share every time a partner you refer subscribes to TradeCafe products.",
    stat: "Per signup",
    tag: "Direct",
  },
  {
    key: "turn",
    title: "Turnover Bonus",
    Icon: Repeat,
    desc: "Earn from the trading volume your network generates, automation, signals, and execution.",
    stat: "Per volume",
    tag: "Recurring",
  },
  {
    key: "pool",
    title: "Pool Sharing",
    Icon: Layers,
    desc: "When your network participates in the Trading Pool, you share in network-level rewards.",
    stat: "Per cycle",
    tag: "Ecosystem",
  },
  {
    key: "rank",
    title: "Rank Rewards",
    Icon: Trophy,
    desc: "Hit rank milestones and unlock multipliers, recognition, and exclusive partner programs.",
    stat: "On progression",
    tag: "Status",
  },
];

const PARTNER_OS = [
  { key: "landing",  title: "Partner Landing Page", Icon: Globe2,       desc: "A branded TradeCafe landing page assigned to you, share it, and every signup is attributed back." },
  { key: "attr",     title: "Referral Attribution", Icon: GitBranch,    desc: "Every click, signup, subscription, and trade is tracked, attributed, and credited to your line." },
  { key: "dash",     title: "Partner Dashboard",    Icon: Gauge,        desc: "Live view of network size, earnings, conversions, pool exposure, and rank progress." },
  { key: "proof",    title: "Proof Cards",          Icon: BadgeCheck,   desc: "Auto-generated, share-ready proof cards from your network's wins, earn credibility passively." },
  { key: "edu",      title: "Education Loop",       Icon: GraduationCap,desc: "Drop-in education content, onboarding flows, and partner playbooks that scale your work." },
];

const RANKS = [
  { key: "starter",    label: "Starter",     Icon: Sparkles,  desc: "Day one. Your network begins." },
  { key: "bronze",     label: "Bronze",      Icon: Award,     desc: "First active referrals." },
  { key: "silver",     label: "Silver",      Icon: Award,     desc: "Network gaining momentum." },
  { key: "gold",       label: "Gold",        Icon: Trophy,    desc: "Material recurring earnings." },
  { key: "platinum",   label: "Platinum",    Icon: Crown,     desc: "Top-tier ecosystem partner." },
  { key: "diamond",    label: "Diamond",     Icon: Diamond,   desc: "Strategic network operator." },
  { key: "ambassador", label: "Ambassador",  Icon: Network,   desc: "Voice of the TradeCafe economy." },
];

export default function Partners() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-pn='eyebrow']",  { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.1 });
      gsap.fromTo("[data-pn='title']",    { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.2 });
      gsap.fromTo("[data-pn='sub']",      { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.35 });
      gsap.fromTo("[data-pn='ctas'] > *", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.5, stagger: 0.08 });
      gsap.fromTo("[data-pn='net']",      { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.6 });
      gsap.fromTo("[data-pn='grow']",     { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.75, stagger: 0.07 });
      gsap.fromTo("[data-pn='os']",       { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.95, stagger: 0.06 });
      gsap.fromTo("[data-pn='rank']",     { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 1.15, stagger: 0.05 });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-tradeWhite font-body" data-testid="partners-page">
      {/* Atmospheric bg */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0 opacity-[0.28]"
          style={{ backgroundImage: "url('/tradecafebackground-poster.jpg')", backgroundSize: "cover", backgroundPosition: "center", filter: "blur(3px) saturate(115%)" }} />
        <div className="absolute inset-0"
          style={{
            background:
              "radial-gradient(900px 700px at 90% 0%, rgba(0,180,166,0.14), transparent 55%)," +
              "radial-gradient(1100px 800px at 5% 100%, rgba(232,120,42,0.12), transparent 55%)," +
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
          <div data-pn="eyebrow" className="hero-kicker text-[11px] text-tradeTeal/95 flex items-center gap-2 mb-5">
            <span className="trade-pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-tradeTeal" />
            Partner Network
          </div>
          <h1
            data-pn="title"
            data-testid="partners-title"
            className="font-heading font-semibold text-tradeWhite max-w-[960px]"
            style={{ fontSize: "clamp(34px, 5.4vw, 76px)", lineHeight: "1.02", letterSpacing: "-0.04em" }}
          >
            Grow the{" "}
            <span className="italic font-light text-white/95">TradeCafe economy</span>.
          </h1>
          <p
            data-pn="sub"
            data-testid="partners-subheadline"
            className="mt-6 sm:mt-7 text-[15px] sm:text-[17px] leading-[1.6] text-white/72 max-w-[780px]"
          >
            Invite traders, builders, creators, and communities into TradeCafe. Earn from
            subscriptions, network activity, pool participation, and ecosystem growth.
          </p>
          <div data-pn="ctas" className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <a href={EXTERNAL.launchTerminal} className="cta-primary justify-center sm:justify-start sm:self-start" data-testid="partners-cta-become">
              Become a Partner
              <ArrowUpRight className="w-4 h-4" strokeWidth={2.4} />
            </a>
            <a href="#plan" className="cta-ghost justify-center sm:justify-start sm:self-start group" data-testid="partners-cta-plan">
              View Partner Plan
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
            </a>
          </div>

          {/* Network preview */}
          <div data-pn="net" className="mt-12 sm:mt-14" data-testid="partners-network-viz">
            <NetworkViz />
          </div>
        </header>

        {/* ===== Proof cards (real component) ===== */}
        <div className="relative z-20 px-4 sm:px-6 md:px-10 lg:px-14 max-w-[1280px] mx-auto mb-16 sm:mb-20">
          <div className="flex items-center gap-2 mb-4">
            <span className="trade-pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-tradeTeal" />
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/50">Proof cards · shareable, referral-embedded</span>
          </div>
          <div className="flex flex-wrap gap-5 justify-center sm:justify-start">
            <ProofCard sym="BTCUSDT" dir="LONG" pnl="+412.8%" entry="61,240" exit="84,910" />
            <ProofCard sym="SOLUSDT" dir="LONG" pnl="+128.4%" entry="142.10" exit="184.62" handle="@mira.trades" code="MIRA5" />
          </div>
        </div>

        {/* ===== Four ways partners grow ===== */}
        <div id="plan" className="relative z-20 px-4 sm:px-6 md:px-10 lg:px-14 max-w-[1280px] mx-auto mt-4 sm:mt-6">
          <SectionLabel index="01" title="Four ways partners grow" caption="Four compounding revenue streams. One network." />
          <div className="tc-grow" data-testid="grow-ways">
            {GROW_WAYS.map((g, i) => {
              const Ic = g.Icon;
              return (
                <div key={g.key} data-pn="grow" data-testid={`grow-${g.key}`} className="tc-grow-card">
                  <div className="tc-grow-head">
                    <div className="tc-grow-icon"><Ic className="w-5 h-5" strokeWidth={1.8} /></div>
                    <span className="tc-grow-tag">{g.tag}</span>
                  </div>
                  <div className="tc-grow-num">0{i + 1}</div>
                  <h3 className="tc-grow-title">{g.title}</h3>
                  <p className="tc-grow-desc">{g.desc}</p>
                  <div className="tc-grow-stat">
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">Reward</span>
                    <span className="font-mono text-[12.5px] text-tradeTeal">{g.stat}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== Partner Operating System ===== */}
        <div className="relative z-20 px-4 sm:px-6 md:px-10 lg:px-14 max-w-[1280px] mx-auto mt-20 sm:mt-24">
          <SectionLabel index="02" title="Partner operating system" caption="Tools, not just a referral link." />
          <div className="tc-includes" data-testid="partner-os">
            {PARTNER_OS.map((o) => {
              const Ic = o.Icon;
              return (
                <div key={o.key} data-pn="os" data-testid={`os-${o.key}`} className="tc-inc-card is-teal">
                  <div className="tc-inc-icon"><Ic className="w-4 h-4" strokeWidth={2} /></div>
                  <div className="tc-inc-title">{o.title}</div>
                  <p className="tc-inc-desc">{o.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Partner dashboard mock */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-3">
            <DashStat label="Network size" value="284" sub="+24 / 7d" />
            <DashStat label="MTD earnings" value="$3,418" sub="Across 4 streams" />
            <DashStat label="Active rank" value="Gold" sub="68% to Platinum" pct={68} />
          </div>
        </div>

        {/* ===== Rank Progression ===== */}
        <div className="relative z-20 px-4 sm:px-6 md:px-10 lg:px-14 max-w-[1280px] mx-auto mt-20 sm:mt-24">
          <SectionLabel index="03" title="Rank progression" caption="Every action compounds. Every rank unlocks more." />
          <div className="tc-rank-track" data-testid="rank-progression">
            <div className="tc-rank-line" aria-hidden />
            <div className="tc-rank-line-fill" aria-hidden style={{ width: "44%" }} />
            <div className="tc-rank-grid">
              {RANKS.map((r, i) => {
                const Ic = r.Icon;
                const active = i <= 3; // Gold (index 3) is current
                return (
                  <div key={r.key} className={`tc-rank-step ${active ? "is-active" : ""}`} data-pn="rank" data-testid={`rank-${r.key}`}>
                    <div className="tc-rank-node">
                      <Ic className="w-4 h-4" strokeWidth={2} />
                    </div>
                    <div className="tc-rank-meta">
                      <span className="tc-rank-label">{r.label}</span>
                      <span className="tc-rank-desc">{r.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ===== Final CTA ===== */}
        <div className="relative z-20 px-4 sm:px-6 md:px-10 lg:px-14 max-w-[1280px] mx-auto mt-20 sm:mt-24">
          <div className="tc-final-cta">
            <div className="flex-1 min-w-0">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-tradeTeal/95 mb-2 flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> Build for the long term
              </div>
              <h3 className="font-heading text-[22px] sm:text-[26px] font-semibold text-white leading-tight tracking-tight">
                Build your network inside{" "}
                <span className="italic font-light">the TradeCafe economy</span>.
              </h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a href={EXTERNAL.launchTerminal} className="cta-primary justify-center" data-testid="partners-final-cta">
                Become a Partner
                <ArrowUpRight className="w-4 h-4" strokeWidth={2.4} />
              </a>
              <Link to="/pool" className="cta-ghost justify-center group" data-testid="partners-link-pool">
                View Trading Pool
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
      {caption && <p className="hidden sm:block text-[13px] text-white/55 max-w-[360px] text-right">{caption}</p>}
    </div>
  );
}

function DashStat({ label, value, sub, pct }) {
  return (
    <div className="tc-snap-stat">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">{label}</span>
      <span className="font-heading text-[24px] sm:text-[26px] font-semibold leading-none mt-1.5 text-white">{value}</span>
      {sub && <span className="font-mono text-[10.5px] text-white/55 mt-2">{sub}</span>}
      {typeof pct === "number" && (
        <div className="mt-3 tc-conf-bar"><span style={{ width: `${pct}%` }} /></div>
      )}
    </div>
  );
}

function NetworkViz() {
  // Hub-and-spokes SVG with subtle pulses
  return (
    <div className="tc-network-viz" data-testid="network-viz">
      <svg viewBox="0 0 1000 280" preserveAspectRatio="xMidYMid meet" className="w-full h-auto block">
        <defs>
          <radialGradient id="nodeFill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#5FE0CF" />
            <stop offset="100%" stopColor="#00786E" />
          </radialGradient>
          <linearGradient id="lineFade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00B4A6" stopOpacity="0.05" />
            <stop offset="50%" stopColor="#00B4A6" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#00B4A6" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* lines from hub to spokes */}
        {[
          [180, 60],  [340, 40],  [520, 70],  [680, 38], [840, 70],
          [180, 220], [340, 240], [520, 215], [680, 240], [840, 215],
        ].map(([x, y], i) => (
          <line key={i} x1="500" y1="140" x2={x} y2={y} stroke="url(#lineFade)" strokeWidth="1.2" />
        ))}

        {/* outer ring */}
        <circle cx="500" cy="140" r="120" fill="none" stroke="rgba(0,180,166,0.12)" strokeDasharray="3 6" />
        <circle cx="500" cy="140" r="78" fill="none" stroke="rgba(0,180,166,0.20)" />

        {/* spokes */}
        {[
          [180, 60, 8], [340, 40, 10], [520, 70, 7], [680, 38, 9], [840, 70, 8],
          [180, 220, 9], [340, 240, 8], [520, 215, 7], [680, 240, 10], [840, 215, 8],
        ].map(([x, y, r], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={r + 6} fill="rgba(0,180,166,0.06)" />
            <circle cx={x} cy={y} r={r} fill="url(#nodeFill)" />
          </g>
        ))}

        {/* hub */}
        <circle cx="500" cy="140" r="26" fill="rgba(0,180,166,0.10)" />
        <circle cx="500" cy="140" r="18" fill="url(#nodeFill)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />

        {/* hub label */}
        <text x="500" y="200" textAnchor="middle" fill="#5FE0CF" fontFamily="JetBrains Mono, monospace" fontSize="9.5" letterSpacing="2.5">YOU · NETWORK CORE</text>
      </svg>
    </div>
  );
}
