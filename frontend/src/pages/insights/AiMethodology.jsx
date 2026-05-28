import { Crosshair, GitMerge, Spline, Activity, Radar, RefreshCcw, Database, Filter, CheckCheck, Send, Brain } from "lucide-react";
import { EXTERNAL } from "../../lib/brand";
import { SolutionLayout, Section, SectionLabel, FeatureGrid, StepFlow, FinalCTA, RiskNote } from "../solutions/SolutionLayout";

const LAYERS = [
  { title: "Support / Resistance", Icon: Crosshair, desc: "Swing-based zones that mark where price has repeatedly reacted." },
  { title: "Pivot points", Icon: GitMerge, desc: "Classic P / S1–S2 / R1–R2 levels computed from the prior session." },
  { title: "Trend channel", Icon: Spline, desc: "Linear-regression channel with ±2σ bands to frame the active trend." },
  { title: "TSR analysis", Icon: Activity, desc: "Trend bias paired with the nearest meaningful support and resistance." },
  { title: "Trend finder", Icon: Radar, desc: "Auto-fitted trendlines through recent swing points." },
  { title: "Breaks & retests", Icon: RefreshCcw, desc: "The most recent broken level and the zone where it is being retested." },
];

const STEPS = [
  { title: "Reference", Icon: Database, desc: "Ingest market structure, volatility, and multi-timeframe context." },
  { title: "Filter", Icon: Filter, desc: "Screen candidates against trend, liquidity, and risk conditions." },
  { title: "Confirm", Icon: CheckCheck, desc: "Require confluence across layers before a setup is promoted." },
  { title: "Signal", Icon: Send, desc: "Publish entry, target, and stop with a confidence score and context." },
];

export default function AiMethodology() {
  return (
    <SolutionLayout
      testid="ai-methodology-page"
      eyebrow="Insights · AI Methodology"
      title="How TradeCafe"
      accent="reads the market"
      sub="Setups are identified through layered references, filters, and confirmations, not a single indicator. Every signal carries the context behind it, computed client-side from live candles."
      ctas={[
        { label: "View Signal Engine", to: "/signals", primary: true, testid: "am-cta-signals" },
        { label: "See Performance", to: "/insights/performance", testid: "am-cta-perf" },
      ]}
    >
      <Section>
        <SectionLabel index="01" title="The analysis layers" caption="Confluence across many lenses, not one." />
        <FeatureGrid items={LAYERS} />
      </Section>

      <Section>
        <SectionLabel index="02" title="From data to signal" caption="Four gates before anything is published." />
        <StepFlow steps={STEPS} />
      </Section>

      <Section>
        <FinalCTA
          kicker="Computed in the open" KickerIcon={Brain}
          title="Watch the layers redraw" accent="on every candle."
          primary={{ label: "View Signal Engine", to: "/signals", testid: "am-final-cta" }}
          secondary={{ label: "Risk Framework", to: "/insights/risk-framework", testid: "am-link-risk" }}
        />
        <RiskNote testid="am-risk">
          AI-generated analysis and signals are informational tools, not investment advice or a
          recommendation to trade. Models can be wrong, and market conditions change. Trading involves
          substantial risk and the potential loss of capital. Always do your own research.
        </RiskNote>
      </Section>
    </SolutionLayout>
  );
}
