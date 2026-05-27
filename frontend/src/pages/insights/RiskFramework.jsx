import { Scale, Gauge, TrendingDown, ShieldAlert, Layers, PowerOff, ClipboardList, SlidersHorizontal, Eye, Bell, ShieldCheck } from "lucide-react";
import { EXTERNAL } from "../../lib/brand";
import { SolutionLayout, Section, SectionLabel, FeatureGrid, StepFlow, FinalCTA, RiskNote } from "../solutions/SolutionLayout";

const CONTROLS = [
  { title: "Position sizing", Icon: Scale, desc: "Every order is sized against balance and a defined per-trade risk budget." },
  { title: "Leverage caps", Icon: Gauge, desc: "Hard ceilings on leverage prevent oversized exposure on any single position." },
  { title: "Trailing protection", Icon: TrendingDown, desc: "Stops trail into profit to lock gains and cut losers automatically." },
  { title: "Drawdown limits", Icon: ShieldAlert, desc: "Strategy posture tightens as drawdown thresholds are approached." },
  { title: "Exposure caps", Icon: Layers, desc: "Aggregate exposure is bounded across correlated symbols and venues." },
  { title: "Kill switch", Icon: PowerOff, desc: "A single control halts new entries and flattens risk when conditions demand." },
];

const STEPS = [
  { title: "Define", Icon: ClipboardList, desc: "Set risk budget, leverage ceiling, and drawdown thresholds up front." },
  { title: "Enforce", Icon: SlidersHorizontal, desc: "Limits are applied to every order before it ever reaches the venue." },
  { title: "Monitor", Icon: Eye, desc: "Live exposure, PnL, and risk metrics stream into the terminal continuously." },
  { title: "Intervene", Icon: Bell, desc: "Automated guardrails and alerts trigger the moment a threshold is breached." },
];

export default function RiskFramework() {
  return (
    <SolutionLayout
      testid="risk-framework-page"
      eyebrow="Insights · Risk Framework"
      title="Risk is the"
      accent="first feature"
      sub="Capital logic, position limits, trailing protection, and drawdown controls are enforced on every order — automated, transparent, and always on. Survival before performance."
      ctas={[
        { label: "Open the Terminal", to: EXTERNAL.launchTerminal, primary: true, testid: "rf-cta-open" },
        { label: "View Automation", to: "/automation", testid: "rf-cta-automation" },
      ]}
    >
      <Section>
        <SectionLabel index="01" title="The controls" caption="Six guardrails on every position." />
        <FeatureGrid items={CONTROLS} />
      </Section>

      <Section>
        <SectionLabel index="02" title="How risk is enforced" caption="Defined, enforced, monitored, intervened." />
        <StepFlow steps={STEPS} />
      </Section>

      <Section>
        <FinalCTA
          kicker="Always on" KickerIcon={ShieldCheck}
          title="Trade with guardrails" accent="that never sleep."
          primary={{ label: "Open the Terminal", to: EXTERNAL.launchTerminal, testid: "rf-final-cta" }}
          secondary={{ label: "See Performance", to: "/insights/performance", testid: "rf-link-perf" }}
        />
        <RiskNote testid="rf-risk">
          Risk controls reduce but cannot eliminate the possibility of loss. Trading involves substantial
          risk, including the potential loss of all capital, and no framework guarantees against losses.
          Past performance is not indicative of future results.
        </RiskNote>
      </Section>
    </SolutionLayout>
  );
}
