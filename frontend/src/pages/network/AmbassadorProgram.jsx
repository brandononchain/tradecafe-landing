import { Megaphone, Gift, GraduationCap, Star, Calendar, ShieldCheck, ClipboardCheck, Send, TrendingUp, Crown } from "lucide-react";
import { EXTERNAL } from "../../lib/brand";
import { SolutionLayout, Section, SectionLabel, FeatureGrid, StepFlow, StatRow, FinalCTA } from "../solutions/SolutionLayout";

const STATS = [
  { label: "Reward multiplier", value: "Up to 2×", sub: "On partner streams", accent: "teal" },
  { label: "Content support", Icon: null, value: "Built-in", sub: "Assets & playbooks" },
  { label: "Early access", value: "First", sub: "New features" },
  { label: "Tier", value: "Top 1%", sub: "Of the network" },
];

const PERKS = [
  { title: "Boosted rewards", Icon: Star, desc: "Elevated commission multipliers across every partner revenue stream." },
  { title: "Co-marketing", Icon: Megaphone, desc: "Featured placement, AMAs, and co-branded campaigns with the TradeCafe team." },
  { title: "Exclusive drops", Icon: Gift, desc: "Limited proof-card designs, merch, and event access for your community." },
  { title: "Education loop", Icon: GraduationCap, desc: "Ready-to-use content, onboarding flows, and playbooks that scale your work." },
  { title: "Early access", Icon: Calendar, desc: "Preview and shape new features before they reach the wider network." },
  { title: "Dedicated support", Icon: ShieldCheck, desc: "A direct line to the team and priority handling for your members." },
];

const STEPS = [
  { title: "Apply", Icon: ClipboardCheck, desc: "Submit your profile, audience, and track record for review." },
  { title: "Onboard", Icon: Send, desc: "Get your ambassador toolkit, assets, and elevated reward structure." },
  { title: "Grow", Icon: TrendingUp, desc: "Activate your community with campaigns, content, and proof cards." },
  { title: "Ascend", Icon: Crown, desc: "Climb ambassador tiers to unlock the highest multipliers and perks." },
];

export default function AmbassadorProgram() {
  return (
    <SolutionLayout
      testid="ambassador-program-page"
      eyebrow="Network · Ambassador Program"
      title="For the voices of"
      accent="the TradeCafe economy"
      sub="Turn creators, educators, and top performers into ecosystem growth partners with boosted rewards, co-marketing, early access, and dedicated support."
      ctas={[
        { label: "Apply to the program", href: EXTERNAL.contactSales, external: true, primary: true, testid: "ap-cta-apply" },
        { label: "Partner Program", to: "/network/partner-program", testid: "ap-cta-program" },
      ]}
    >
      <Section className="!mt-12 sm:!mt-14">
        <div className="flex items-center gap-2 mb-4">
          <span className="trade-pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-tradeTeal" />
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/50">Ambassador tier</span>
        </div>
        <StatRow stats={STATS} />
      </Section>

      <Section>
        <SectionLabel index="01" title="Ambassador perks" caption="More than a referral link — a partnership." />
        <FeatureGrid items={PERKS} />
      </Section>

      <Section>
        <SectionLabel index="02" title="How to become one" caption="Apply, onboard, grow, ascend." />
        <StepFlow steps={STEPS} />
      </Section>

      <Section>
        <FinalCTA
          kicker="Limited cohort" KickerIcon={Crown}
          title="Lead a community inside" accent="the ecosystem."
          primary={{ label: "Apply to the program", href: EXTERNAL.contactSales, external: true, testid: "ap-final-cta" }}
          secondary={{ label: "View Proof Cards", to: "/network/proof-cards", testid: "ap-link-proof" }}
        />
      </Section>
    </SolutionLayout>
  );
}
