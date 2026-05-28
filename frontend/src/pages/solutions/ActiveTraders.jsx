import {
  Brain, CandlestickChart, Zap, ShieldCheck, Layers, Share2,
  Radar, CheckCircle2, Play, Gauge, Sparkles,
} from "lucide-react";
import { EXTERNAL } from "../../lib/brand";
import { SolutionLayout, Section, SectionLabel, FeatureGrid, StepFlow, StatRow, FinalCTA } from "./SolutionLayout";

const STATS = [
  { label: "Signal win rate", value: "81%", sub: "Trailing 90 days", accent: "teal" },
  { label: "Signals streamed", value: "8,782", sub: "And counting" },
  { label: "Exchanges", value: "7", sub: "CEX + on-chain" },
  { label: "Avg. fill", value: "<120ms", sub: "Routed execution" },
];

const FEATURES = [
  { title: "AI Signal Engine", Icon: Brain, desc: "High-confidence setups with entries, targets, and stops streamed straight to your chart." },
  { title: "Pro charting", Icon: CandlestickChart, desc: "Drawing tools, indicators, and AI overlays, support/resistance, pivots, and trend channels." },
  { title: "One-click execution", Icon: Zap, desc: "Route market and limit orders to any connected exchange or on-chain venue in a tap." },
  { title: "Risk guardrails", Icon: ShieldCheck, desc: "Position sizing, leverage limits, and trailing protection enforced on every order." },
  { title: "Multi-market", Icon: Layers, desc: "Spot, perps, and equities across Binance, Bybit, OKX, and the rest, one terminal." },
  { title: "Shareable proof", Icon: Share2, desc: "Turn closed trades into proof cards with embedded referral links, credibility that compounds." },
];

const STEPS = [
  { title: "Scan", Icon: Radar, desc: "The engine surfaces setups around the clock, ranked by confidence and context." },
  { title: "Confirm", Icon: CheckCircle2, desc: "Tap a signal to auto-chart it with AI levels so you validate the thesis fast." },
  { title: "Execute", Icon: Play, desc: "Place the trade from the docked ticket, side, size, and leverage pre-filled." },
  { title: "Manage", Icon: Gauge, desc: "Track open positions, PnL, and risk live, then close or share with one click." },
];

export default function ActiveTraders() {
  return (
    <SolutionLayout
      testid="active-traders-page"
      eyebrow="Solutions · Active Traders"
      title="Trade hands-on,"
      accent="with an AI edge"
      sub="Stay in full control of every position while the AI Signal Engine, pro charting, and one-click execution do the heavy lifting. Built for traders who want speed without giving up the wheel."
      ctas={[
        { label: "Launch Terminal", to: EXTERNAL.launchTerminal, primary: true, testid: "at-cta-launch" },
        { label: "View Signal Engine", to: "/signals", testid: "at-cta-signals" },
      ]}
    >
      <Section className="!mt-12 sm:!mt-14">
        <div className="flex items-center gap-2 mb-4">
          <span className="trade-pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-tradeTeal" />
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/50">By the numbers · live</span>
        </div>
        <StatRow stats={STATS} />
      </Section>

      <Section>
        <SectionLabel index="01" title="Your edge, your rules" caption="Every tool a discretionary trader needs, nothing taken away." />
        <FeatureGrid items={FEATURES} />
      </Section>

      <Section>
        <SectionLabel index="02" title="From signal to position" caption="Four steps. Seconds, not minutes." />
        <StepFlow steps={STEPS} />
      </Section>

      <Section>
        <FinalCTA
          kicker="Open the terminal" KickerIcon={Sparkles}
          title="Bring the AI to your" accent="trading desk."
          primary={{ label: "Launch Terminal", to: EXTERNAL.launchTerminal, testid: "at-final-cta" }}
          secondary={{ label: "Explore Automation", to: "/automation", testid: "at-link-automation" }}
        />
      </Section>
    </SolutionLayout>
  );
}
