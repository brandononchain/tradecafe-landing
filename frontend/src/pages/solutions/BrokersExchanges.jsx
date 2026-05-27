import {
  BarChart3, UserPlus, Trophy, Medal, Palette, Plug,
  Handshake, Rocket, LineChart, Mail,
} from "lucide-react";
import { EXTERNAL } from "../../lib/brand";
import { SolutionLayout, Section, SectionLabel, FeatureGrid, StepFlow, StatRow, FinalCTA } from "./SolutionLayout";

const STATS = [
  { label: "Volume routed", value: "$3M+", sub: "Across venues", accent: "teal" },
  { label: "Active traders", value: "20K+", sub: "Engaged users" },
  { label: "Integrations", value: "7", sub: "CEX + on-chain" },
  { label: "Uptime", value: "99.9%", sub: "Execution layer" },
];

const FEATURES = [
  { title: "Volume routing", Icon: BarChart3, desc: "Send qualified, active flow to your venue through TradeCafe's execution layer." },
  { title: "Lead generation", Icon: UserPlus, desc: "Convert engaged traders into funded accounts with attributed, trackable onboarding." },
  { title: "Trading competitions", Icon: Trophy, desc: "Run co-branded competitions with live scoring to drive volume and engagement." },
  { title: "Leaderboards", Icon: Medal, desc: "Public performance rankings and social loops that keep your traders coming back." },
  { title: "Co-branded UI", Icon: Palette, desc: "Your brand inside the terminal — campaigns, landing pages, and proof cards." },
  { title: "API integration", Icon: Plug, desc: "Connect order routing, balances, and market data through a documented API." },
];

const STEPS = [
  { title: "Connect", Icon: Plug, desc: "Integrate order routing and market data through our exchange API layer." },
  { title: "Co-brand", Icon: Palette, desc: "Apply your brand to the terminal, campaign pages, and shareable proof cards." },
  { title: "Launch", Icon: Rocket, desc: "Go live with a competition, referral push, or co-branded acquisition campaign." },
  { title: "Scale", Icon: LineChart, desc: "Track volume, leads, and retention in a shared dashboard and optimize together." },
];

export default function BrokersExchanges() {
  return (
    <SolutionLayout
      testid="brokers-exchanges-page"
      eyebrow="Solutions · Brokers & Exchanges"
      title="Drive volume with"
      accent="co-branded growth"
      sub="Partner with TradeCafe to drive trading volume, generate qualified leads, and run co-branded competitions and campaigns — powered by the same terminal your traders already love."
      ctas={[
        { label: "Talk to our team", href: EXTERNAL.contactSales, external: true, primary: true, testid: "be-cta-contact" },
        { label: "Explore Campaigns", to: "/partners", testid: "be-cta-campaigns" },
      ]}
    >
      <Section className="!mt-12 sm:!mt-14">
        <div className="flex items-center gap-2 mb-4">
          <span className="trade-pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-tradeTeal" />
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/50">Network reach</span>
        </div>
        <StatRow stats={STATS} />
      </Section>

      <Section>
        <SectionLabel index="01" title="Growth levers" caption="Volume, leads, and engagement — co-branded." />
        <FeatureGrid items={FEATURES} />
      </Section>

      <Section>
        <SectionLabel index="02" title="How we integrate" caption="From API connection to live campaign." />
        <StepFlow steps={STEPS} />
      </Section>

      <Section>
        <FinalCTA
          kicker="Partnerships team" KickerIcon={Handshake}
          title="Put your venue in front of" accent="active traders."
          primary={{ label: "Talk to our team", href: EXTERNAL.contactSales, external: true, testid: "be-final-cta" }}
          secondary={{ label: "Partners & Affiliates", to: "/solutions/partners-affiliates", testid: "be-link-partners" }}
        />
      </Section>
    </SolutionLayout>
  );
}
