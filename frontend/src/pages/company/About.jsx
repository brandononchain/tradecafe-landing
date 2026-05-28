import { Eye, Scale, Network, Cpu, Radar, Bot, Layers, Users, Sparkles } from "lucide-react";
import { EXTERNAL } from "../../lib/brand";
import { SolutionLayout, Section, SectionLabel, FeatureGrid, StatRow, FinalCTA } from "../solutions/SolutionLayout";

const STATS = [
  { label: "Active traders", value: "20K+", sub: "And growing", accent: "teal" },
  { label: "Signals streamed", value: "8,782", sub: "All-time" },
  { label: "Managed capital", value: "$3M+", sub: "Across strategies" },
  { label: "Engine uptime", value: "99.9%", sub: "Always on" },
];

const VALUES = [
  { title: "Transparency", Icon: Eye, desc: "We publish performance, methodology, and risk openly, numbers over narratives." },
  { title: "Risk first", Icon: Scale, desc: "Capital preservation is a feature, not an afterthought. Survival before performance." },
  { title: "Ecosystem", Icon: Network, desc: "Traders, partners, brokers, and funds grow together inside one connected economy." },
];

const PILLARS = [
  { title: "Terminal", Icon: Cpu, desc: "One command center for charting, execution, and the full ecosystem." },
  { title: "Signal Engine", Icon: Radar, desc: "AI setups with entries, exits, and the context behind every call." },
  { title: "Execution Engine", Icon: Bot, desc: "Automated trading and position management with risk logic built in." },
  { title: "Trading Pool", Icon: Layers, desc: "Passive access to TradeCafe-managed strategy infrastructure." },
  { title: "Partner Network", Icon: Users, desc: "Referrals, ranks, proof cards, and commissions that compound." },
];

export default function About() {
  return (
    <SolutionLayout
      testid="about-page"
      eyebrow="Company · About"
      title="Building the"
      accent="TradeCafe economy"
      sub="TradeCafe unifies signals, execution, pooled strategies, and a partner network into one AI-driven trading ecosystem, built so every participant, from solo trader to institution, can grow on shared infrastructure."
      ctas={[
        { label: "Launch Terminal", to: EXTERNAL.launchTerminal, primary: true, testid: "ab-cta-launch" },
        { label: "View Roadmap", to: "/company/roadmap", testid: "ab-cta-roadmap" },
      ]}
    >
      <Section className="!mt-10 sm:!mt-12">
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 sm:p-9" data-s="reveal">
          <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-tradeTeal/90 mb-3">Our mission</div>
          <p className="font-heading text-[20px] sm:text-[26px] font-medium leading-[1.4] text-white/90 max-w-[920px]">
            Make professional-grade trading infrastructure, AI analysis, disciplined execution, and
            transparent performance, <span className="italic font-light text-tradeTeal">accessible to everyone</span>,
            and let the people who grow the network share in its success.
          </p>
        </div>
      </Section>

      <Section className="!mt-16 sm:!mt-20">
        <div className="flex items-center gap-2 mb-4">
          <span className="trade-pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-tradeTeal" />
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/50">The ecosystem in numbers</span>
        </div>
        <StatRow stats={STATS} />
      </Section>

      <Section>
        <SectionLabel index="01" title="What we stand for" caption="Three principles behind every decision." />
        <FeatureGrid items={VALUES} />
      </Section>

      <Section>
        <SectionLabel index="02" title="The five pillars" caption="One ecosystem, five connected products." />
        <FeatureGrid items={PILLARS} />
      </Section>

      <Section>
        <FinalCTA
          kicker="Join the economy" KickerIcon={Sparkles}
          title="Trade, allocate, or" accent="build with us."
          primary={{ label: "Launch Terminal", to: EXTERNAL.launchTerminal, testid: "ab-final-cta" }}
          secondary={{ label: "Talk to our team", href: EXTERNAL.contactSales, external: true, testid: "ab-link-contact" }}
        />
      </Section>
    </SolutionLayout>
  );
}
