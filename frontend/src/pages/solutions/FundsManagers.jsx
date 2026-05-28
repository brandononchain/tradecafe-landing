import {
  Boxes, Bot, FileBarChart, ShieldCheck, Layers, Headset,
  ClipboardList, Plug, Rocket, LineChart, AlertTriangle, Building2,
} from "lucide-react";
import { EXTERNAL } from "../../lib/brand";
import { SolutionLayout, Section, SectionLabel, FeatureGrid, StepFlow, StatRow, FinalCTA, RiskNote } from "./SolutionLayout";

const STATS = [
  { label: "Managed", value: "$3M+", sub: "Strategy capital", accent: "teal" },
  { label: "Uptime", value: "99.9%", sub: "Execution layer" },
  { label: "Markets", value: "Multi", sub: "Spot · perps · equities" },
  { label: "Reporting", value: "On-demand", sub: "Per-account detail" },
];

const FEATURES = [
  { title: "Multi-account execution", Icon: Boxes, desc: "Route and manage orders across multiple sub-accounts from a single workflow." },
  { title: "Strategy automation", Icon: Bot, desc: "Encode strategies with risk logic and let the execution engine run them hands-free." },
  { title: "Performance reporting", Icon: FileBarChart, desc: "Per-account returns, drawdowns, exposure, and attribution, exportable on demand." },
  { title: "Risk framework", Icon: ShieldCheck, desc: "Position limits, leverage caps, trailing protection, and drawdown controls enforced." },
  { title: "Pool infrastructure", Icon: Layers, desc: "Stand up managed strategy pools on the same infrastructure that powers TradeCafe." },
  { title: "White-glove onboarding", Icon: Headset, desc: "Dedicated integration support, documentation, and a direct line to our team." },
];

const STEPS = [
  { title: "Scope", Icon: ClipboardList, desc: "We map your strategies, accounts, venues, and reporting requirements together." },
  { title: "Integrate", Icon: Plug, desc: "Connect exchanges and accounts through the execution and data API layer." },
  { title: "Deploy", Icon: Rocket, desc: "Go live with automated execution and risk controls across managed capital." },
  { title: "Report", Icon: LineChart, desc: "Deliver transparent, per-account performance reporting on your cadence." },
];

export default function FundsManagers() {
  return (
    <SolutionLayout
      testid="funds-managers-page"
      eyebrow="Solutions · Funds & Managers"
      title="Infrastructure for"
      accent="managed strategies"
      sub="Execution workflows, automated strategy logic, risk tooling, and per-account reporting for funds, managers, and professional desks, on the infrastructure that runs TradeCafe."
      ctas={[
        { label: "Talk to our team", href: EXTERNAL.contactSales, external: true, primary: true, testid: "fm-cta-contact" },
        { label: "View Trading Pool", to: "/pool", testid: "fm-cta-pool" },
      ]}
    >
      <Section className="!mt-12 sm:!mt-14">
        <div className="flex items-center gap-2 mb-4">
          <span className="trade-pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-tradeTeal" />
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/50">Desk infrastructure</span>
        </div>
        <StatRow stats={STATS} />
      </Section>

      <Section>
        <SectionLabel index="01" title="Built for desks" caption="The tooling professional managers expect." />
        <FeatureGrid items={FEATURES} />
      </Section>

      <Section>
        <SectionLabel index="02" title="Engagement model" caption="From scope to live reporting." />
        <StepFlow steps={STEPS} />
      </Section>

      <Section>
        <FinalCTA
          kicker="Institutional desk" KickerIcon={Building2}
          title="Run your strategy on" accent="TradeCafe infrastructure."
          primary={{ label: "Talk to our team", href: EXTERNAL.contactSales, external: true, testid: "fm-final-cta" }}
          secondary={{ label: "Passive Participants", to: "/solutions/passive-participants", testid: "fm-link-passive" }}
        />
        <RiskNote testid="fm-risk">
          TradeCafe provides trading infrastructure and tooling and does not provide investment advice.
          Trading involves substantial risk and the potential loss of capital. Past performance is not
          indicative of future results. Engagements are subject to eligibility, contractual terms, and
          applicable regulatory requirements in your jurisdiction.
        </RiskNote>
      </Section>
    </SolutionLayout>
  );
}
