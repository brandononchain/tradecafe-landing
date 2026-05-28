import {
  BarChart3, UserPlus, Trophy, Medal, Palette, Plug,
  Handshake, Rocket, LineChart, Mail,
} from "lucide-react";
import { EXTERNAL } from "../../lib/brand";
import { BrandLogo, BRANDS } from "../../dashboard/lib/brandLogos";
import { SolutionLayout, Section, SectionLabel, FeatureGrid, StepFlow, StatRow, FinalCTA } from "./SolutionLayout";

const SUPPORTED_VENUES = ["binance", "bybit", "okx", "kucoin", "bitget", "bingx", "weex"];
const SUPPORTED_BROKERS = ["ibkr", "oanda", "forexcom", "ig", "pepperstone", "saxo"];

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
  { title: "Co-branded UI", Icon: Palette, desc: "Your brand inside the terminal, campaigns, landing pages, and proof cards." },
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
      sub="Partner with TradeCafe to drive trading volume, generate qualified leads, and run co-branded competitions and campaigns, powered by the same terminal your traders already love."
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
        <SectionLabel index="01" title="Supported venues" caption="Crypto exchanges and TradFi brokers, ready to plug in." />
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5 sm:p-7" data-testid="venues-grid">
          <div className="font-mono text-[9.5px] tracking-[0.14em] uppercase text-white/40 mb-3">Crypto exchanges</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {SUPPORTED_VENUES.map((id) => (
              <div key={id} data-s="reveal" className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-tradeTeal/30 transition-colors">
                <BrandLogo id={id} size={40} />
                <span className="text-[11.5px] font-medium text-white/80 truncate max-w-full">{BRANDS[id]?.name}</span>
              </div>
            ))}
          </div>
          <div className="font-mono text-[9.5px] tracking-[0.14em] uppercase text-white/40 mt-6 mb-3">TradFi brokers</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {SUPPORTED_BROKERS.map((id) => (
              <div key={id} data-s="reveal" className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-tradeTeal/30 transition-colors">
                <BrandLogo id={id} size={40} />
                <span className="text-[11.5px] font-medium text-white/80 text-center truncate max-w-full">{BRANDS[id]?.name}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <SectionLabel index="02" title="Growth levers" caption="Volume, leads, and engagement, co-branded." />
        <FeatureGrid items={FEATURES} />
      </Section>

      <Section>
        <SectionLabel index="03" title="How we integrate" caption="From API connection to live campaign." />
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
