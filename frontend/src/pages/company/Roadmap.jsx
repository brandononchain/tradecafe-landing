import { CheckCircle2, Loader2, Circle, Rocket } from "lucide-react";
import { EXTERNAL } from "../../lib/brand";
import { SolutionLayout, Section, SectionLabel, FinalCTA } from "../solutions/SolutionLayout";

const PHASES = [
  {
    period: "Shipped", status: "done", label: "Live now",
    items: [
      "AI Signal Engine with confidence scoring",
      "Pro terminal: charting, drawing tools, AI overlays",
      "Cross-chain wallet, EVM + Solana on-chain perps",
      "Partner network, proof cards, and leaderboards",
    ],
  },
  {
    period: "Q3 2026", status: "active", label: "In progress",
    items: [
      "Multi-account execution for desks",
      "Expanded TradFi broker (FX) integrations",
      "Mobile-native terminal experience",
      "Strategy marketplace (beta)",
    ],
  },
  {
    period: "Q4 2026", status: "planned", label: "Planned",
    items: [
      "Copy-trading across the network",
      "Pool v2: configurable strategy sleeves",
      "Public performance API",
      "Ambassador studio & content tools",
    ],
  },
  {
    period: "2027", status: "planned", label: "Exploring",
    items: [
      "Institutional reporting & compliance suite",
      "Additional L1/L2 venue support",
      "On-chain proof & attribution standard",
      "Localized regional expansion",
    ],
  },
];

const STATUS = {
  done: { Icon: CheckCircle2, color: "#1FB8A6", chip: "text-tradeTeal bg-tradeTeal/10 border-tradeTeal/25" },
  active: { Icon: Loader2, color: "#9B8AFB", chip: "text-[#9B8AFB] bg-[#9B8AFB]/10 border-[#9B8AFB]/25" },
  planned: { Icon: Circle, color: "#6B7686", chip: "text-white/50 bg-white/[0.04] border-white/[0.1]" },
};

export default function Roadmap() {
  return (
    <SolutionLayout
      testid="roadmap-page"
      eyebrow="Company · Roadmap"
      title="Where TradeCafe is"
      accent="headed"
      sub="What we've shipped, what we're building, and what's next. Upcoming features, integrations, and ecosystem expansion, in the open."
      ctas={[
        { label: "Launch Terminal", to: EXTERNAL.launchTerminal, primary: true, testid: "rm-cta-launch" },
        { label: "About TradeCafe", to: "/company/about", testid: "rm-cta-about" },
      ]}
    >
      <Section className="!mt-12 sm:!mt-14">
        <SectionLabel index="01" title="The roadmap" caption="Directional, not a commitment to dates." />
        <div className="relative pl-7 sm:pl-9" data-testid="roadmap-timeline">
          <span className="absolute left-[10px] sm:left-[14px] top-1 bottom-1 w-px bg-white/[0.1]" aria-hidden />
          <div className="flex flex-col gap-5">
            {PHASES.map((p) => {
              const st = STATUS[p.status];
              const Ic = st.Icon;
              return (
                <div key={p.period} data-s="reveal" className="relative">
                  <span className="absolute -left-7 sm:-left-9 top-1 inline-flex w-5 h-5 items-center justify-center rounded-full bg-black"
                    style={{ border: `1px solid ${st.color}66` }}>
                    <Ic className={`w-3 h-3 ${p.status === "active" ? "animate-spin" : ""}`} style={{ color: st.color }} strokeWidth={2.4} />
                  </span>
                  <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className="font-heading text-[16px] font-semibold text-white">{p.period}</span>
                      <span className={`font-mono text-[9px] tracking-[0.1em] uppercase px-2 py-1 rounded-full border ${st.chip}`}>{p.label}</span>
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                      {p.items.map((it) => (
                        <li key={it} className="flex items-start gap-2 text-[13px] leading-[1.5] text-white/65">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: st.color }} />
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <p className="mt-4 font-mono text-[10.5px] text-white/35">Roadmap is indicative and subject to change without notice.</p>
      </Section>

      <Section>
        <FinalCTA
          kicker="Built in the open" KickerIcon={Rocket}
          title="Grow with the" accent="ecosystem."
          primary={{ label: "Launch Terminal", to: EXTERNAL.launchTerminal, testid: "rm-final-cta" }}
          secondary={{ label: "Contact Support", to: "/company/support", testid: "rm-link-support" }}
        />
      </Section>
    </SolutionLayout>
  );
}
