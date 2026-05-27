import { Trophy, Coins, Zap, BarChart3, Palette, Medal, Plug, Rocket, LineChart, Handshake } from "lucide-react";
import { EXTERNAL } from "../../lib/brand";
import { SolutionLayout, Section, SectionLabel, FeatureGrid, StepFlow, StatRow, FinalCTA } from "../solutions/SolutionLayout";

const STATS = [
  { label: "Volume routed", value: "$3M+", sub: "Across venues", accent: "teal" },
  { label: "Campaign types", value: "5", sub: "Run solo or stacked" },
  { label: "Live scoring", value: "Real-time", sub: "On-chain & CEX" },
  { label: "Attribution", value: "Tracked", sub: "Every entry" },
];

const TYPES = [
  { title: "Trading competition", Icon: Trophy, desc: "Time-boxed PnL or volume contests with live leaderboards and prize pools." },
  { title: "Deposit race", Icon: Coins, desc: "Reward funded accounts and first deposits with milestone bonuses." },
  { title: "Referral sprint", Icon: Zap, desc: "Short, high-intensity referral pushes with tiered rewards and tracking." },
  { title: "Volume challenge", Icon: BarChart3, desc: "Drive sustained turnover with cumulative volume targets and unlocks." },
  { title: "Co-branded launch", Icon: Palette, desc: "Your brand inside the terminal — landing pages, proof cards, and UI." },
  { title: "Leaderboard series", Icon: Medal, desc: "Recurring seasonal rankings that keep traders engaged campaign after campaign." },
];

const STEPS = [
  { title: "Connect", Icon: Plug, desc: "Integrate order routing and market data through the exchange API layer." },
  { title: "Configure", Icon: Palette, desc: "Pick a campaign type, set rules, rewards, dates, and co-branding." },
  { title: "Launch", Icon: Rocket, desc: "Go live with live scoring, attribution, and shareable proof cards." },
  { title: "Measure", Icon: LineChart, desc: "Track volume, leads, and retention in a shared results dashboard." },
];

export default function BrokerCampaigns() {
  return (
    <SolutionLayout
      testid="broker-campaigns-page"
      eyebrow="Network · Broker Campaigns"
      title="Co-branded campaigns that"
      accent="move volume"
      sub="Run trading competitions, deposit races, and referral sprints with live scoring and full attribution — co-branded inside the same terminal your traders already use."
      ctas={[
        { label: "Talk to our team", href: EXTERNAL.contactSales, external: true, primary: true, testid: "bc-cta-contact" },
        { label: "Brokers & Exchanges", to: "/solutions/brokers-exchanges", testid: "bc-cta-solution" },
      ]}
    >
      <Section className="!mt-12 sm:!mt-14">
        <div className="flex items-center gap-2 mb-4">
          <span className="trade-pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-tradeTeal" />
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/50">Campaign reach</span>
        </div>
        <StatRow stats={STATS} />
      </Section>

      <Section>
        <SectionLabel index="01" title="Campaign types" caption="Run one, or stack them into a season." />
        <FeatureGrid items={TYPES} />
      </Section>

      <Section>
        <SectionLabel index="02" title="How a campaign runs" caption="From API connection to live results." />
        <StepFlow steps={STEPS} />
      </Section>

      <Section>
        <FinalCTA
          kicker="Partnerships team" KickerIcon={Handshake}
          title="Launch your next campaign on" accent="TradeCafe."
          primary={{ label: "Talk to our team", href: EXTERNAL.contactSales, external: true, testid: "bc-final-cta" }}
          secondary={{ label: "View Leaderboards", to: "/network/leaderboards", testid: "bc-link-leaderboards" }}
        />
      </Section>
    </SolutionLayout>
  );
}
