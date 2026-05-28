import { Users, Repeat, Layers, Trophy, Gauge, BadgeCheck, UserPlus, Share2, GitBranch, Wallet, Sparkles } from "lucide-react";
import { EXTERNAL } from "../../lib/brand";
import { SolutionLayout, Section, SectionLabel, FeatureGrid, StepFlow, StatRow, FinalCTA } from "../solutions/SolutionLayout";

const STATS = [
  { label: "Revenue streams", value: "4", sub: "Compounding", accent: "teal" },
  { label: "Rank tiers", value: "7", sub: "Starter → Ambassador" },
  { label: "Attribution", value: "Lifetime", sub: "Per referral line" },
  { label: "Network", value: "20K+", sub: "Active members" },
];

const STREAMS = [
  { title: "Referral bonus", Icon: Users, desc: "A defined share each time a partner you refer subscribes to a TradeCafe product." },
  { title: "Turnover bonus", Icon: Repeat, desc: "Earn from the trading volume your network generates across automation and signals." },
  { title: "Pool sharing", Icon: Layers, desc: "Share network-level rewards when your members participate in the Trading Pool." },
  { title: "Rank rewards", Icon: Trophy, desc: "Milestone multipliers, recognition, and exclusive programs as your rank climbs." },
  { title: "Partner dashboard", Icon: Gauge, desc: "Live network size, earnings, conversions, and rank progress in one console." },
  { title: "Proof cards", Icon: BadgeCheck, desc: "Auto-generated, referral-embedded cards from your network's wins." },
];

const STEPS = [
  { title: "Enroll", Icon: UserPlus, desc: "Activate your partner account and claim a branded landing page and link." },
  { title: "Share", Icon: Share2, desc: "Distribute your link, proof cards, and content across your audience." },
  { title: "Attribute", Icon: GitBranch, desc: "Every signup, subscription, and trade is tracked back to your line for life." },
  { title: "Earn", Icon: Wallet, desc: "Collect recurring payouts across all four streams as the network compounds." },
];

export default function PartnerProgram() {
  return (
    <SolutionLayout
      testid="partner-program-page"
      eyebrow="Network · Partner Program"
      title="Recurring income from"
      accent="the whole ecosystem"
      sub="The TradeCafe Partner Program pays across four streams, subscriptions, trading volume, pool participation, and rank progression, with lifetime attribution and a live earnings console."
      ctas={[
        { label: "Become a Partner", to: EXTERNAL.launchTerminal, primary: true, testid: "pp-cta-join" },
        { label: "Partners & Affiliates", to: "/solutions/partners-affiliates", testid: "pp-cta-solution" },
      ]}
    >
      <Section className="!mt-12 sm:!mt-14">
        <div className="flex items-center gap-2 mb-4">
          <span className="trade-pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-tradeTeal" />
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/50">Program economics</span>
        </div>
        <StatRow stats={STATS} />
      </Section>

      <Section>
        <SectionLabel index="01" title="What you earn from" caption="Four compounding revenue streams. One network." />
        <FeatureGrid items={STREAMS} />
      </Section>

      <Section>
        <SectionLabel index="02" title="How enrollment works" caption="Live in minutes. Attributed for life." />
        <StepFlow steps={STEPS} />
      </Section>

      <Section>
        <FinalCTA
          kicker="Build for the long term" KickerIcon={Sparkles}
          title="Grow your line inside" accent="the TradeCafe economy."
          primary={{ label: "Become a Partner", to: EXTERNAL.launchTerminal, testid: "pp-final-cta" }}
          secondary={{ label: "Broker Campaigns", to: "/network/broker-campaigns", testid: "pp-link-campaigns" }}
        />
      </Section>
    </SolutionLayout>
  );
}
