import { useState } from "react";
import { Activity, Target, Repeat, Clock, Layers, Gauge, ShieldCheck } from "lucide-react";
import { EXTERNAL } from "../../lib/brand";
import { SolutionLayout, Section, SectionLabel, StatRow, FinalCTA, RiskNote } from "../solutions/SolutionLayout";

const STATS = [
  { label: "Win rate", value: "81%", sub: "Trailing 90 days", accent: "teal" },
  { label: "Trades", value: "20K+", sub: "Executed all-time" },
  { label: "Signals", value: "8,782", sub: "Streamed" },
  { label: "Managed", value: "$3M+", sub: "Strategy capital" },
];

const BREAKDOWN = [
  { label: "Avg. R per trade", value: "1.9R", Icon: Target },
  { label: "Profit factor", value: "2.4", Icon: Activity },
  { label: "Signal cadence", value: "~38 / wk", Icon: Repeat },
  { label: "Median hold", value: "6h 12m", Icon: Clock },
  { label: "Markets covered", value: "120+", Icon: Layers },
  { label: "Engine uptime", value: "99.9%", Icon: Gauge },
];

const CURVES = {
  "30D": "M0 70 L60 66 L120 62 L180 64 L240 55 L300 57 L360 48 L420 50 L480 40 L540 42 L600 33 L660 30 L720 24 L780 20 L840 14 L900 16 L960 9",
  "90D": "M0 74 L60 72 L120 60 L180 64 L240 50 L300 54 L360 40 L420 44 L480 30 L540 36 L600 26 L660 30 L720 18 L780 22 L840 12 L900 14 L960 6",
  "1Y": "M0 76 L60 70 L120 66 L180 54 L240 58 L300 44 L360 48 L420 34 L480 38 L540 26 L600 30 L660 20 L720 24 L780 14 L840 18 L900 8 L960 4",
};

export default function Performance() {
  const [tf, setTf] = useState("90D");
  return (
    <SolutionLayout
      testid="performance-page"
      eyebrow="Insights · Performance"
      title="Transparency"
      accent="by design"
      sub="Win rate, trade history, uptime, signals, and managed volume — documented and shared openly. Numbers, not narratives."
      ctas={[
        { label: "Open the Terminal", to: EXTERNAL.launchTerminal, primary: true, testid: "perf-cta-open" },
        { label: "AI Methodology", to: "/insights/ai-methodology", testid: "perf-cta-method" },
      ]}
    >
      <Section className="!mt-12 sm:!mt-14">
        <div className="flex items-center gap-2 mb-4">
          <span className="trade-pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-tradeTeal" />
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/50">Headline metrics · live</span>
        </div>
        <StatRow stats={STATS} />
      </Section>

      <Section>
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5 sm:p-6" data-testid="equity-curve">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/45 mb-1">Cumulative performance</div>
              <div className="font-heading text-[24px] sm:text-[28px] font-semibold text-tradeTeal leading-none">+{tf === "30D" ? "9.4" : tf === "90D" ? "26.1" : "74.8"}%</div>
            </div>
            <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              {Object.keys(CURVES).map((k) => (
                <button key={k} onClick={() => setTf(k)}
                  className={`px-3 py-1.5 rounded-md font-mono text-[11px] tracking-[0.06em] transition-colors ${tf === k ? "bg-tradeTeal/15 text-tradeTeal" : "text-white/45 hover:text-white/80"}`}
                  data-testid={`perf-tf-${k}`}>{k}</button>
              ))}
            </div>
          </div>
          <svg viewBox="0 0 960 84" preserveAspectRatio="none" style={{ width: "100%", height: 110 }} aria-hidden>
            <defs>
              <linearGradient id="perfFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00B4A6" stopOpacity="0.30" />
                <stop offset="100%" stopColor="#00B4A6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={`${CURVES[tf]} L960 84 L0 84 Z`} fill="url(#perfFill)" />
            <path d={CURVES[tf]} fill="none" stroke="#00B4A6" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
          <p className="mt-3 font-mono text-[10.5px] text-white/35">Illustrative equity curve · not an offer or guarantee of future results.</p>
        </div>
      </Section>

      <Section>
        <SectionLabel index="01" title="Under the hood" caption="The numbers behind the headline." />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {BREAKDOWN.map((b) => {
            const Ic = b.Icon;
            return (
              <div key={b.label} data-s="reveal" className="flex items-center gap-3 rounded-xl bg-white/[0.02] border border-white/[0.06] p-4">
                <span className="inline-flex w-9 h-9 items-center justify-center rounded-lg bg-tradeTeal/10 border border-tradeTeal/25 text-tradeTeal shrink-0">
                  <Ic className="w-4 h-4" strokeWidth={2} />
                </span>
                <span className="min-w-0">
                  <span className="block font-heading text-[18px] font-semibold text-white leading-none">{b.value}</span>
                  <span className="block font-mono text-[10px] tracking-[0.1em] uppercase text-white/45 mt-1.5">{b.label}</span>
                </span>
              </div>
            );
          })}
        </div>
      </Section>

      <Section>
        <FinalCTA
          kicker="Verifiable, ongoing" KickerIcon={ShieldCheck}
          title="See the engine work in" accent="real time."
          primary={{ label: "Open the Terminal", to: EXTERNAL.launchTerminal, testid: "perf-final-cta" }}
          secondary={{ label: "Risk Framework", to: "/insights/risk-framework", testid: "perf-link-risk" }}
        />
        <RiskNote testid="perf-risk">
          All figures are illustrative and provided for informational purposes only. Past performance is
          not indicative of future results. Trading involves substantial risk and the potential loss of
          capital. TradeCafe makes no guarantee, express or implied, of any return outcome.
        </RiskNote>
      </Section>
    </SolutionLayout>
  );
}
