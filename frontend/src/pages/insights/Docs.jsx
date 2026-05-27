import { Rocket, Plug, Bot, Radar, Layers, Users, ArrowUpRight, BookOpen } from "lucide-react";
import { EXTERNAL } from "../../lib/brand";
import { SolutionLayout, Section, SectionLabel, Accordion, FinalCTA } from "../solutions/SolutionLayout";

const CATEGORIES = [
  { title: "Getting started", Icon: Rocket, count: 8, links: ["Create your account", "Tour the terminal", "Connect a wallet"] },
  { title: "Connect accounts", Icon: Plug, count: 11, links: ["Add exchange API keys", "Connect a broker", "Permissions & safety"] },
  { title: "Automation", Icon: Bot, count: 9, links: ["Configure a trading bot", "Risk settings", "Modes: auto / semi / assist"] },
  { title: "Signals", Icon: Radar, count: 7, links: ["Read a signal", "Auto-chart a setup", "Confidence scores"] },
  { title: "Trading Pool", Icon: Layers, count: 6, links: ["How allocation works", "Terms & exit windows", "Reporting cadence"] },
  { title: "Partner Network", Icon: Users, count: 10, links: ["Enroll as a partner", "Proof cards", "Payouts & attribution"] },
];

const FAQ = [
  { q: "Does TradeCafe hold my funds?", a: "No. For on-chain trading you connect a non-custodial wallet and TradeCafe never holds your keys. For exchange trading you provide API keys scoped to read and trade only — never withdrawals." },
  { q: "Which exchanges and brokers are supported?", a: "Crypto exchanges include Binance, Bybit, Bitget, OKX, WEEX, BingX, and KuCoin, plus on-chain venues across EVM chains and Solana. TradFi broker connections (FX) are available for select brokers, with more added over time." },
  { q: "Is this investment advice?", a: "No. TradeCafe provides tools, signals, and infrastructure for informational purposes only. Nothing on the platform is investment advice or a recommendation to trade. Trading involves substantial risk." },
  { q: "How are signals generated?", a: "Signals come from layered analysis — support/resistance, pivots, trend channels, and breaks & retests — that must show confluence before publishing, each with a confidence score and context. See the AI Methodology page." },
  { q: "What does it cost?", a: "TradeCafe offers tiered subscriptions for individuals and custom engagements for brokers, funds, and managers. Reach out to the team for institutional pricing." },
];

export default function Docs() {
  return (
    <SolutionLayout
      testid="docs-page"
      eyebrow="Insights · Docs"
      title="Everything you need to"
      accent="get going"
      sub="Guides, onboarding, and technical references for the whole ecosystem — from connecting your first account to running automated strategies and growing a partner network."
      ctas={[
        { label: "Open the Terminal", to: EXTERNAL.launchTerminal, primary: true, testid: "docs-cta-open" },
        { label: "Contact Support", to: "/company/support", testid: "docs-cta-support" },
      ]}
    >
      <Section className="!mt-12 sm:!mt-14">
        <SectionLabel index="01" title="Browse by topic" caption="Six tracks. Start anywhere." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" data-testid="docs-categories">
          {CATEGORIES.map((c) => {
            const Ic = c.Icon;
            return (
              <div key={c.title} data-s="reveal" className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5 hover:border-tradeTeal/30 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex w-9 h-9 items-center justify-center rounded-lg bg-tradeTeal/10 border border-tradeTeal/25 text-tradeTeal">
                    <Ic className="w-4 h-4" strokeWidth={2} />
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-white/35">{c.count} articles</span>
                </div>
                <h3 className="text-[15px] font-semibold text-white/90 mb-2.5">{c.title}</h3>
                <ul className="flex flex-col gap-1.5">
                  {c.links.map((l) => (
                    <li key={l}>
                      <span className="flex items-center gap-1.5 text-[12.5px] text-white/55 hover:text-tradeTeal transition-colors cursor-pointer">
                        <ArrowUpRight className="w-3 h-3 opacity-60" strokeWidth={2} /> {l}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Section>

      <Section>
        <SectionLabel index="02" title="Frequently asked" caption="The questions we hear most." />
        <Accordion items={FAQ} testid="docs-faq" />
      </Section>

      <Section>
        <FinalCTA
          kicker="Can't find it?" KickerIcon={BookOpen}
          title="Our team is" accent="one message away."
          primary={{ label: "Contact Support", to: "/company/support", testid: "docs-final-cta" }}
          secondary={{ label: "Read Market Notes", to: "/insights/market-notes", testid: "docs-link-notes" }}
        />
      </Section>
    </SolutionLayout>
  );
}
