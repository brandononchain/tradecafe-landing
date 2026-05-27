import { LifeBuoy, Mail, MessageCircle, Activity, BookOpen, Rocket, Headset } from "lucide-react";
import { EXTERNAL } from "../../lib/brand";
import { SolutionLayout, Section, SectionLabel, Accordion, FinalCTA } from "../solutions/SolutionLayout";

const CHANNELS = [
  { title: "Help center", Icon: BookOpen, desc: "Guides, onboarding, and answers to the most common questions.", action: "Browse docs", to: "/insights/docs" },
  { title: "Email support", Icon: Mail, desc: "Account, billing, and technical help from the TradeCafe team.", action: "Email us", href: "mailto:support@tradecafe.ai" },
  { title: "Community", Icon: MessageCircle, desc: "Connect with other traders and the team inside VITchat.", action: "Open VITchat", to: EXTERNAL.app + "/vitchat" },
  { title: "System status", Icon: Activity, desc: "Live status of the signal engine, execution layer, and venues.", action: "View status", to: "/insights/performance" },
];

const FAQ = [
  { q: "How do I connect my exchange or wallet?", a: "Open the Terminal, go to Connect, and choose an exchange (API keys), a TradFi broker, or a Web3 wallet. Exchange keys should be scoped to read and trade only — never withdrawals." },
  { q: "I need help with billing or my subscription.", a: "Email support@tradecafe.ai from your account address and the team will sort it out. Include your account handle and a short description of the issue." },
  { q: "Is my account and data secure?", a: "On-chain trading is fully non-custodial — TradeCafe never holds your keys. Exchange API keys are stored encrypted and used only for trading. We recommend enabling IP binding where your exchange supports it." },
  { q: "How fast is support?", a: "Most account and technical questions are answered within one business day. Brokers, funds, and managers receive prioritized, white-glove support." },
];

export default function Support() {
  return (
    <SolutionLayout
      testid="support-page"
      eyebrow="Company · Support"
      title="Help, whenever"
      accent="you need it"
      sub="Account assistance, onboarding help, and a live look at system status — plus a community of traders and a team that actually answers."
      ctas={[
        { label: "Email support", href: "mailto:support@tradecafe.ai", external: true, primary: true, testid: "sp-cta-email" },
        { label: "Browse Docs", to: "/insights/docs", testid: "sp-cta-docs" },
      ]}
    >
      <Section className="!mt-12 sm:!mt-14">
        <SectionLabel index="01" title="Ways to get help" caption="Pick the channel that fits." />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" data-testid="support-channels">
          {CHANNELS.map((c) => {
            const Ic = c.Icon;
            const isLink = c.to && c.to.startsWith("/");
            return (
              <div key={c.title} data-s="reveal" className="flex flex-col rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5 hover:border-tradeTeal/30 transition-colors">
                <span className="inline-flex w-10 h-10 items-center justify-center rounded-xl bg-tradeTeal/10 border border-tradeTeal/25 text-tradeTeal mb-3">
                  <Ic className="w-4.5 h-4.5" strokeWidth={2} />
                </span>
                <h3 className="text-[15px] font-semibold text-white/90">{c.title}</h3>
                <p className="mt-1.5 text-[13px] leading-[1.55] text-white/55 flex-1">{c.desc}</p>
                {isLink ? (
                  <a href={c.to} className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-tradeTeal hover:text-tradeTeal/80 transition-colors">{c.action} →</a>
                ) : (
                  <a href={c.href} className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-tradeTeal hover:text-tradeTeal/80 transition-colors">{c.action} →</a>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      <Section>
        <SectionLabel index="02" title="Common questions" caption="Quick answers before you reach out." />
        <Accordion items={FAQ} testid="support-faq" />
      </Section>

      <Section>
        <FinalCTA
          kicker="We're here to help" KickerIcon={Headset}
          title="Still stuck? Talk to" accent="a real human."
          primary={{ label: "Email support", href: "mailto:support@tradecafe.ai", external: true, testid: "sp-final-cta" }}
          secondary={{ label: "View Roadmap", to: "/company/roadmap", testid: "sp-link-roadmap" }}
        />
      </Section>
    </SolutionLayout>
  );
}
