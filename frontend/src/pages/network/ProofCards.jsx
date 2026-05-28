import { TrendingUp, Flag, Radar, Link2, Share2, Image, Sparkles } from "lucide-react";
import { EXTERNAL } from "../../lib/brand";
import ProofCard from "../../components/ProofCard";
import { SolutionLayout, Section, SectionLabel, FeatureGrid, StepFlow, FinalCTA } from "../solutions/SolutionLayout";

const TYPES = [
  { title: "PnL cards", Icon: TrendingUp, desc: "Closed-trade results with entry, exit, and return, clean enough to post anywhere." },
  { title: "Milestone cards", Icon: Flag, desc: "Rank-ups, streaks, and account milestones rendered as share-ready graphics." },
  { title: "Signal cards", Icon: Radar, desc: "Snapshot a live AI setup with entry, target, and stop to share your edge." },
  { title: "Referral-embedded", Icon: Link2, desc: "Every card carries your attribution link so shares convert into signups." },
  { title: "One-tap share", Icon: Share2, desc: "Export to X, Telegram, or image straight from the terminal." },
  { title: "On-brand templates", Icon: Image, desc: "Consistent, premium designs that make your wins look the part." },
];

const STEPS = [
  { title: "Trigger", Icon: Radar, desc: "Close a trade, hit a milestone, or pick a live signal worth sharing." },
  { title: "Generate", Icon: Image, desc: "A proof card renders automatically with your handle and referral code." },
  { title: "Share", Icon: Share2, desc: "Post to social or send directly, every view carries your link." },
  { title: "Convert", Icon: Link2, desc: "Clicks are attributed to you and credited across the partner streams." },
];

export default function ProofCards() {
  return (
    <SolutionLayout
      testid="proof-cards-page"
      eyebrow="Network · Proof Cards"
      title="Social proof that"
      accent="compounds"
      sub="Shareable PnL, milestone, and signal cards with embedded referral links. Turn every win into credibility, and every share into attributed network growth."
      ctas={[
        { label: "Open the Terminal", to: EXTERNAL.launchTerminal, primary: true, testid: "pc-cta-open" },
        { label: "Partner Program", to: "/network/partner-program", testid: "pc-cta-program" },
      ]}
    >
      <Section className="!mt-12 sm:!mt-14">
        <div className="flex items-center gap-2 mb-4">
          <span className="trade-pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-tradeTeal" />
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/50">Live examples · referral-embedded</span>
        </div>
        <div className="flex flex-wrap gap-5 justify-center sm:justify-start" data-s="reveal">
          <ProofCard sym="BTCUSDT" dir="LONG" pnl="+412.8%" entry="61,240" exit="84,910" />
          <ProofCard sym="SOLUSDT" dir="LONG" pnl="+128.4%" entry="142.10" exit="184.62" handle="@mira.trades" code="MIRA5" />
        </div>
      </Section>

      <Section>
        <SectionLabel index="01" title="Card types" caption="One system. Every kind of win." />
        <FeatureGrid items={TYPES} />
      </Section>

      <Section>
        <SectionLabel index="02" title="How proof cards work" caption="From trigger to attributed signup." />
        <StepFlow steps={STEPS} />
      </Section>

      <Section>
        <FinalCTA
          kicker="Make your wins work twice" KickerIcon={Sparkles}
          title="Every share is" accent="a growth loop."
          primary={{ label: "Open the Terminal", to: EXTERNAL.launchTerminal, testid: "pc-final-cta" }}
          secondary={{ label: "View Leaderboards", to: "/network/leaderboards", testid: "pc-link-leaderboards" }}
        />
      </Section>
    </SolutionLayout>
  );
}
