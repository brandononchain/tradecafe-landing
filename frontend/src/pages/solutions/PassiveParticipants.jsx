import {
  Eye, FileSignature, Sparkle, ShieldCheck, CalendarClock, Network,
  Wallet, Cpu, TrendingUp, LogOut, AlertTriangle, Hourglass,
} from "lucide-react";
import { EXTERNAL } from "../../lib/brand";
import { SolutionLayout, Section, SectionLabel, FeatureGrid, StepFlow, StatRow, FinalCTA, RiskNote } from "./SolutionLayout";

const STATS = [
  { label: "Pool AUM", value: "$3.12M", sub: "412 participants" },
  { label: "Strategy", value: "Multi-strat", sub: "Spot · perps · pairs" },
  { label: "Cycle", value: "Quarterly", sub: "90-day term" },
  { label: "MTD", value: "+1.84%", sub: "As of last close", accent: "teal" },
];

const FEATURES = [
  { title: "Transparent reporting", Icon: Eye, desc: "Returns, drawdowns, and allocation changes reported on a defined cadence, no black box." },
  { title: "Defined terms", Icon: FileSignature, desc: "Lock periods, allocation limits, fees, and exit windows are all agreed up front." },
  { title: "No skill required", Icon: Sparkle, desc: "You don't watch charts or place trades. The strategy team manages everything." },
  { title: "Risk-managed", Icon: ShieldCheck, desc: "Position limits, exposure caps, and drawdown controls run on the pool continuously." },
  { title: "Quarterly cycle", Icon: CalendarClock, desc: "A 90-day term with a defined 7-day exit window keeps the strategy disciplined." },
  { title: "Ecosystem-linked", Icon: Network, desc: "Participation plugs into the partner network for additional ecosystem rewards." },
];

const STEPS = [
  { title: "Allocate", Icon: Wallet, desc: "Commit capital into the pool under TradeCafe's defined participation terms." },
  { title: "Strategy runs", Icon: Cpu, desc: "Capital is deployed by the strategy logic across markets and timeframes." },
  { title: "Returns accrue", Icon: TrendingUp, desc: "Performance, positive or negative, is reported transparently through the term." },
  { title: "Withdraw", Icon: LogOut, desc: "At term end, allocations and accrued performance settle for withdrawal." },
];

export default function PassiveParticipants() {
  return (
    <SolutionLayout
      testid="passive-participants-page"
      eyebrow="Solutions · Passive Participants"
      title="Markets working"
      accent="while you don't"
      sub="Allocate into the managed Trading Pool and get set-and-forget exposure to TradeCafe's strategy logic, optimized execution, and ecosystem-level infrastructure. No charts, no screens."
      ctas={[
        { label: "Explore Pool Access", to: EXTERNAL.launchTerminal, primary: true, testid: "pp-cta-access" },
        { label: "View Trading Pool", to: "/pool", testid: "pp-cta-pool" },
      ]}
    >
      <Section className="!mt-12 sm:!mt-14">
        <div className="flex items-center gap-2 mb-4">
          <span className="trade-pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-tradeTeal" />
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/50">Pool snapshot · indicative</span>
        </div>
        <StatRow stats={STATS} />
        <div className="mt-6 max-w-[820px] flex items-start gap-3 text-[13px] leading-[1.55] text-white/55">
          <span className="mt-1 inline-flex w-5 h-5 items-center justify-center rounded-md bg-tradeOrange/10 border border-tradeOrange/30 shrink-0">
            <AlertTriangle className="w-3 h-3 text-tradeOrange" strokeWidth={2.2} />
          </span>
          <p>
            <span className="text-white/80">Not guaranteed income.</span> The Pool is passive exposure
            to a live trading strategy. Performance is reported transparently and capital is subject to market risk.
          </p>
        </div>
      </Section>

      <Section>
        <SectionLabel index="01" title="Why go passive" caption="Process and transparency, not promises." />
        <FeatureGrid items={FEATURES} />
      </Section>

      <Section>
        <SectionLabel index="02" title="How allocation works" caption="Four phases. Defined terms throughout." />
        <StepFlow steps={STEPS} />
      </Section>

      <Section>
        <FinalCTA
          kicker="Quarterly cycle · capacity-limited" KickerIcon={Hourglass}
          title="Step back from the screen." accent="Let the strategy work."
          primary={{ label: "Explore Pool Access", to: EXTERNAL.launchTerminal, testid: "pp-final-cta" }}
          secondary={{ label: "Compare with Automation", to: "/automation", testid: "pp-link-automation" }}
        />
        <RiskNote testid="pp-risk">
          Participation in the TradeCafe Trading Pool involves market risk and the potential loss of
          allocated capital. Past performance is not indicative of future results. TradeCafe makes no
          guarantee, express or implied, of return outcomes. All participants must read and acknowledge
          full participation terms and risk disclosures prior to allocation.
        </RiskNote>
      </Section>
    </SolutionLayout>
  );
}
