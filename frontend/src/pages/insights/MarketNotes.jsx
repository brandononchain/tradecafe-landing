import { ArrowUpRight, Newspaper } from "lucide-react";
import { EXTERNAL } from "../../lib/brand";
import { SolutionLayout, Section, SectionLabel, FinalCTA } from "../solutions/SolutionLayout";

const NOTES = [
  { tag: "Recap", tone: "teal", title: "Weekly recap: rotation into majors as funding cools", excerpt: "BTC and ETH led the tape while perp funding normalized. The engine trimmed exposure into strength and rebuilt on the retest.", date: "May 26, 2026", read: "4 min" },
  { tag: "Signal note", tone: "violet", title: "Anatomy of a high-confidence SOL long", excerpt: "Walking through the confluence — trend channel, retest, and TSR alignment — behind a +12% swing setup.", date: "May 22, 2026", read: "6 min" },
  { tag: "Ecosystem", tone: "teal", title: "Pool cycle update: Q2 posture and exposure", excerpt: "How the managed pool is positioned this quarter, where risk is capped, and what the reporting cadence looks like.", date: "May 18, 2026", read: "5 min" },
  { tag: "Macro", tone: "orange", title: "Volatility regime: what changed this month", excerpt: "Realized vol compressed across majors. We unpack what that means for position sizing and signal cadence.", date: "May 12, 2026", read: "7 min" },
  { tag: "Product", tone: "violet", title: "Drawing tools and AI overlays: a quick tour", excerpt: "A short walkthrough of the terminal's anchored drawing engine and the AI layers that redraw on every candle.", date: "May 6, 2026", read: "3 min" },
  { tag: "Recap", tone: "teal", title: "Monthly review: win rate, R, and lessons", excerpt: "The numbers behind the month — profit factor, average R, and the trades that taught us the most.", date: "Apr 30, 2026", read: "8 min" },
];

const TONES = {
  teal: "text-tradeTeal bg-tradeTeal/10 border-tradeTeal/25",
  violet: "text-[#9B8AFB] bg-[#9B8AFB]/10 border-[#9B8AFB]/25",
  orange: "text-tradeOrange bg-tradeOrange/10 border-tradeOrange/30",
};

export default function MarketNotes() {
  return (
    <SolutionLayout
      testid="market-notes-page"
      eyebrow="Insights · Market Notes"
      title="Trading insights,"
      accent="shared openly"
      sub="Recaps, signal breakdowns, ecosystem updates, and macro reads from the TradeCafe desk — written to teach, not to hype."
      ctas={[
        { label: "Open the Terminal", to: EXTERNAL.launchTerminal, primary: true, testid: "mn-cta-open" },
        { label: "View Performance", to: "/insights/performance", testid: "mn-cta-perf" },
      ]}
    >
      <Section className="!mt-12 sm:!mt-14">
        <div className="flex items-center gap-2 mb-5">
          <span className="trade-pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-tradeTeal" />
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/50">Latest notes</span>
        </div>
        <div className="flex flex-col gap-3" data-testid="notes-feed">
          {NOTES.map((n) => (
            <article key={n.title} data-s="reveal"
              className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-tradeTeal/30 transition-colors p-4 sm:p-5 cursor-pointer">
              <span className={`self-start font-mono text-[9px] tracking-[0.1em] uppercase px-2 py-1 rounded-full border shrink-0 ${TONES[n.tone]}`}>{n.tag}</span>
              <div className="min-w-0 flex-1">
                <h3 className="text-[15px] sm:text-[16px] font-semibold text-white/90 leading-snug">{n.title}</h3>
                <p className="mt-1.5 text-[13px] leading-[1.55] text-white/55 max-w-[760px]">{n.excerpt}</p>
                <div className="mt-2 font-mono text-[10.5px] tracking-[0.06em] text-white/40">{n.date} · {n.read} read</div>
              </div>
              <ArrowUpRight className="hidden sm:block w-4 h-4 text-white/30 group-hover:text-tradeTeal transition-colors shrink-0" strokeWidth={2} />
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <FinalCTA
          kicker="New notes weekly" KickerIcon={Newspaper}
          title="Read the market with" accent="the desk."
          primary={{ label: "Open the Terminal", to: EXTERNAL.launchTerminal, testid: "mn-final-cta" }}
          secondary={{ label: "Browse Docs", to: "/insights/docs", testid: "mn-link-docs" }}
        />
      </Section>
    </SolutionLayout>
  );
}
