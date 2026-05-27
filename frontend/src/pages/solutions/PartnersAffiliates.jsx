import {
  Users, Repeat, Layers, Trophy, BadgeCheck, Gauge,
  Globe2, GitBranch, Share2, Wallet, Sparkles,
} from "lucide-react";
import { EXTERNAL } from "../../lib/brand";
import { SolutionLayout, Section, SectionLabel, FeatureGrid, StepFlow, StatRow, FinalCTA } from "./SolutionLayout";

const STATS = [
  { label: "Revenue streams", value: "4", sub: "Compounding", accent: "teal" },
  { label: "Rank tiers", value: "7", sub: "Starter → Ambassador" },
  { label: "Attribution", value: "Lifetime", sub: "Every click tracked" },
  { label: "Payouts", value: "Recurring", sub: "Across the network" },
];

const FEATURES = [
  { title: "Referral bonus", Icon: Users, desc: "Earn a defined share every time a partner you refer subscribes to a TradeCafe product." },
  { title: "Turnover bonus", Icon: Repeat, desc: "Earn from the trading volume your network generates across automation and signals." },
  { title: "Pool sharing", Icon: Layers, desc: "When your network participates in the Trading Pool, you share network-level rewards." },
  { title: "Rank rewards", Icon: Trophy, desc: "Hit milestones to unlock multipliers, recognition, and exclusive partner programs." },
  { title: "Proof cards", Icon: BadgeCheck, desc: "Auto-generated, share-ready cards from your network's wins — passive credibility." },
  { title: "Partner dashboard", Icon: Gauge, desc: "Live view of network size, earnings, conversions, pool exposure, and rank progress." },
];

const STEPS = [
  { title: "Get your link", Icon: Globe2, desc: "Claim a branded landing page and referral link assigned uniquely to you." },
  { title: "Share", Icon: Share2, desc: "Post proof cards, content, and your link across your audience and communities." },
  { title: "Attribute", Icon: GitBranch, desc: "Every signup, subscription, and trade is tracked and credited back to your line." },
  { title: "Earn", Icon: Wallet, desc: "Collect recurring income across four streams as your network compounds." },
];

export default function PartnersAffiliates() {
  return (
    <SolutionLayout
      testid="partners-affiliates-page"
      eyebrow="Solutions · Partners & Affiliates"
      title="Turn your audience into"
      accent="recurring income"
      sub="Invite traders, creators, and communities into TradeCafe. Earn from subscriptions, network trading volume, pool participation, and rank progression — all tracked and attributed automatically."
      ctas={[
        { label: "Become a Partner", to: EXTERNAL.launchTerminal, primary: true, testid: "pa-cta-join" },
        { label: "View Partner Network", to: "/partners", testid: "pa-cta-network" },
      ]}
    >
      <Section className="!mt-12 sm:!mt-14">
        <div className="flex items-center gap-2 mb-4">
          <span className="trade-pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-tradeTeal" />
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/50">Partner economics</span>
        </div>
        <StatRow stats={STATS} />
      </Section>

      <Section>
        <SectionLabel index="01" title="Four ways partners grow" caption="Four compounding revenue streams. One network." />
        <FeatureGrid items={FEATURES} />
      </Section>

      <Section>
        <SectionLabel index="02" title="From link to income" caption="Tools, not just a referral code." />
        <StepFlow steps={STEPS} />
      </Section>

      <Section>
        <FinalCTA
          kicker="Build for the long term" KickerIcon={Sparkles}
          title="Build your network inside" accent="the TradeCafe economy."
          primary={{ label: "Become a Partner", to: EXTERNAL.launchTerminal, testid: "pa-final-cta" }}
          secondary={{ label: "Brokers & Exchanges", to: "/solutions/brokers-exchanges", testid: "pa-link-brokers" }}
        />
      </Section>
    </SolutionLayout>
  );
}
