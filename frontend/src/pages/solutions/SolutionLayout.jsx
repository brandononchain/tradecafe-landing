import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ArrowUpRight, ArrowRight, ChevronDown } from "lucide-react";
import Nav from "../../components/Nav";

/* Shared scaffold for the marketing Solutions pages — atmospheric
   background, nav, animated hero, and a set of section primitives that
   reuse the site's existing tc-* component classes. Responsive across
   mobile → desktop via the same breakpoints used by the platform pages. */
export function SolutionLayout({ eyebrow, title, accent, tail = ".", sub, ctas = [], children, testid }) {
  const root = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-s='eyebrow']", { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.1 });
      gsap.fromTo("[data-s='title']", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.2 });
      gsap.fromTo("[data-s='sub']", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.35 });
      gsap.fromTo("[data-s='ctas'] > *", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.5, stagger: 0.08 });
      gsap.fromTo("[data-s='reveal']", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.65, stagger: 0.05 });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="relative min-h-screen bg-black text-tradeWhite font-body" data-testid={testid}>
      {/* Atmospheric bg */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0 opacity-[0.28]"
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
        <header className="relative z-20 pt-28 sm:pt-36 md:pt-40 lg:pt-44 px-6 sm:px-10 md:px-14 lg:px-16 pb-2 sm:pb-4 max-w-[1280px] mx-auto">
          <div data-s="eyebrow" className="hero-kicker text-[11px] text-tradeTeal/95 flex items-center gap-2 mb-5">
            <span className="trade-pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-tradeTeal" />
            {eyebrow}
          </div>
          <h1 data-s="title" data-testid={`${testid}-title`}
            className="font-heading font-semibold text-tradeWhite max-w-[960px]"
            style={{ fontSize: "clamp(34px, 5.4vw, 76px)", lineHeight: "1.02", letterSpacing: "-0.04em" }}>
            {title}{" "}
            <span className="italic font-light text-white/95">{accent}</span>{tail}
          </h1>
          <p data-s="sub" className="mt-6 sm:mt-7 text-[15px] sm:text-[17px] leading-[1.6] text-white/72 max-w-[780px]">
            {sub}
          </p>
          {ctas.length > 0 && (
            <div data-s="ctas" className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
              {ctas.map((c, i) => <Cta key={i} c={c} />)}
            </div>
          )}
        </header>

        {children}
      </section>
    </div>
  );
}

function Cta({ c }) {
  const primary = !!c.primary;
  const cls = primary
    ? "cta-primary justify-center sm:justify-start sm:self-start"
    : "cta-ghost justify-center sm:justify-start sm:self-start group";
  const inner = (
    <>
      {c.label}
      {primary
        ? <ArrowUpRight className="w-4 h-4" strokeWidth={2.4} />
        : <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />}
    </>
  );
  if (c.to && c.to.startsWith("/") && !c.external) {
    return <Link to={c.to} className={cls} data-testid={c.testid}>{inner}</Link>;
  }
  return (
    <a href={c.href || c.to} className={cls} data-testid={c.testid}
      {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {inner}
    </a>
  );
}

export function Section({ children, id, className = "" }) {
  return (
    <div id={id} className={`relative z-20 px-4 sm:px-6 md:px-10 lg:px-14 max-w-[1280px] mx-auto mt-20 sm:mt-24 ${className}`}>
      {children}
    </div>
  );
}

export function SectionLabel({ index, title, caption }) {
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

export function FeatureGrid({ items }) {
  return (
    <div className="tc-includes">
      {items.map((it) => {
        const Ic = it.Icon;
        return (
          <div key={it.title} data-s="reveal" className={`tc-inc-card ${it.accent || "is-teal"}`} data-testid={`feature-${slug(it.title)}`}>
            <div className="tc-inc-icon"><Ic className="w-4 h-4" strokeWidth={2} /></div>
            <div className="tc-inc-title">{it.title}</div>
            <p className="tc-inc-desc">{it.desc}</p>
          </div>
        );
      })}
    </div>
  );
}

export function StepFlow({ steps }) {
  return (
    <div className="tc-pipeline">
      {steps.map((s, i) => {
        const Ic = s.Icon;
        return (
          <div key={s.title} data-s="reveal" className="tc-pipe-card" data-testid={`step-${slug(s.title)}`}>
            <div className="tc-pipe-num">{String(i + 1).padStart(2, "0")}</div>
            <div className="tc-pipe-icon"><Ic className="w-5 h-5" strokeWidth={1.8} /></div>
            <div className="tc-pipe-title">{s.title}</div>
            <div className="tc-pipe-desc">{s.desc}</div>
            {i < steps.length - 1 && (
              <div className="tc-pipe-link" aria-hidden><ArrowRight className="w-3.5 h-3.5" strokeWidth={2} /></div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function StatRow({ stats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div key={s.label} data-s="reveal" className="tc-snap-stat" data-testid={`stat-${slug(s.label)}`}>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">{s.label}</span>
          <span className={`font-heading text-[22px] sm:text-[26px] font-semibold leading-none mt-1.5 ${s.accent === "teal" ? "text-tradeTeal" : "text-white"}`}>{s.value}</span>
          {s.sub && <span className="font-mono text-[10.5px] text-white/45 mt-2">{s.sub}</span>}
        </div>
      ))}
    </div>
  );
}

export function FinalCTA({ kicker, KickerIcon, title, accent, primary, secondary }) {
  return (
    <div className="tc-final-cta">
      <div className="flex-1 min-w-0">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-tradeTeal/95 mb-2 flex items-center gap-2">
          {KickerIcon && <KickerIcon className="w-3 h-3" />} {kicker}
        </div>
        <h3 className="font-heading text-[22px] sm:text-[26px] font-semibold text-white leading-tight tracking-tight">
          {title} <span className="italic font-light">{accent}</span>
        </h3>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 shrink-0">
        {primary && <Cta c={{ ...primary, primary: true }} />}
        {secondary && <Cta c={secondary} />}
      </div>
    </div>
  );
}

export function RiskNote({ children, testid }) {
  return (
    <div className="mt-8 sm:mt-10 tc-risk-disclaimer" data-testid={testid}>
      <div className="flex items-center gap-2 mb-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">Risk acknowledgement</span>
      </div>
      <p className="text-[12.5px] leading-[1.6] text-white/55">{children}</p>
    </div>
  );
}

export function Accordion({ items, testid }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="flex flex-col gap-2.5" data-testid={testid}>
      {items.map((it, i) => (
        <div key={it.q} data-s="reveal" className="rounded-xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
          <button onClick={() => setOpen(open === i ? -1 : i)}
            className="w-full flex items-center justify-between gap-4 px-4 sm:px-5 py-4 text-left"
            data-testid={`faq-${slug(it.q)}`}>
            <span className="text-[14px] sm:text-[15px] font-medium text-white/90">{it.q}</span>
            <ChevronDown className={`w-4 h-4 text-white/45 shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} strokeWidth={2} />
          </button>
          {open === i && <div className="px-4 sm:px-5 pb-4 text-[13px] leading-[1.6] text-white/60 max-w-[760px]">{it.a}</div>}
        </div>
      ))}
    </div>
  );
}

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
