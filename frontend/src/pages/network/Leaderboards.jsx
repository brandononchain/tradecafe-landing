import { useState } from "react";
import { Trophy, Flame, Medal, Award, Users, Zap } from "lucide-react";
import { EXTERNAL } from "../../lib/brand";
import { SolutionLayout, Section, SectionLabel, FeatureGrid, FinalCTA } from "../solutions/SolutionLayout";

const BOARDS = {
  "7D": [
    { h: "@apex.fx", ret: 318, vol: "$1.92M", w: 100 },
    { h: "@mira.trades", ret: 264, vol: "$1.41M", w: 83 },
    { h: "@nova_quant", ret: 211, vol: "$2.08M", w: 66 },
    { h: "@deltaedge", ret: 188, vol: "$880K", w: 59 },
    { h: "@solchaser", ret: 162, vol: "$1.12M", w: 51 },
    { h: "@vega.long", ret: 144, vol: "$640K", w: 45 },
    { h: "@cafe_whale", ret: 121, vol: "$3.04M", w: 38 },
    { h: "@trendrider", ret: 109, vol: "$510K", w: 34 },
  ],
  "30D": [
    { h: "@nova_quant", ret: 642, vol: "$8.4M", w: 100 },
    { h: "@cafe_whale", ret: 588, vol: "$12.1M", w: 92 },
    { h: "@apex.fx", ret: 511, vol: "$6.9M", w: 80 },
    { h: "@mira.trades", ret: 468, vol: "$5.2M", w: 73 },
    { h: "@deltaedge", ret: 402, vol: "$3.8M", w: 63 },
    { h: "@solchaser", ret: 356, vol: "$4.4M", w: 55 },
    { h: "@vega.long", ret: 298, vol: "$2.1M", w: 46 },
    { h: "@trendrider", ret: 264, vol: "$1.9M", w: 41 },
  ],
  "All": [
    { h: "@cafe_whale", ret: 2140, vol: "$58M", w: 100 },
    { h: "@nova_quant", ret: 1880, vol: "$41M", w: 88 },
    { h: "@apex.fx", ret: 1520, vol: "$33M", w: 71 },
    { h: "@mira.trades", ret: 1344, vol: "$28M", w: 63 },
    { h: "@deltaedge", ret: 1102, vol: "$19M", w: 51 },
    { h: "@solchaser", ret: 968, vol: "$22M", w: 45 },
    { h: "@vega.long", ret: 812, vol: "$11M", w: 38 },
    { h: "@trendrider", ret: 704, vol: "$9M", w: 33 },
  ],
};

const FEATURES = [
  { title: "Live rankings", Icon: Flame, desc: "Returns and volume update in real time across CEX and on-chain venues." },
  { title: "Seasons", Icon: Trophy, desc: "Recurring competitions with prize pools, resets, and seasonal hall-of-fame." },
  { title: "Verified results", Icon: Award, desc: "Rankings are computed from connected accounts — not self-reported claims." },
  { title: "Social loops", Icon: Users, desc: "Top performers auto-generate proof cards, pulling new traders into the network." },
];

const MEDALS = ["#F5C451", "#C7CBD1", "#D08A4E"];

export default function Leaderboards() {
  const [tf, setTf] = useState("7D");
  const rows = BOARDS[tf];
  return (
    <SolutionLayout
      testid="leaderboards-page"
      eyebrow="Network · Leaderboards"
      title="Compete on the"
      accent="public tape"
      sub="Live performance rankings, seasonal competitions, and social loops that turn results into reach. Verified from connected accounts — never self-reported."
      ctas={[
        { label: "Join a competition", to: EXTERNAL.launchTerminal, primary: true, testid: "lb-cta-join" },
        { label: "Broker Campaigns", to: "/network/broker-campaigns", testid: "lb-cta-campaigns" },
      ]}
    >
      <Section className="!mt-12 sm:!mt-14">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="trade-pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-tradeTeal" />
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/50">Global leaderboard · live</span>
          </div>
          <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            {Object.keys(BOARDS).map((k) => (
              <button key={k} onClick={() => setTf(k)}
                className={`px-3 py-1.5 rounded-md font-mono text-[11px] tracking-[0.06em] transition-colors ${tf === k ? "bg-tradeTeal/15 text-tradeTeal" : "text-white/45 hover:text-white/80"}`}
                data-testid={`lb-tf-${k}`}>{k}</button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden" data-testid="leaderboard-table">
          <div className="hidden sm:grid grid-cols-[64px_1fr_120px_140px] gap-3 px-5 py-3 border-b border-white/[0.06] font-mono text-[10px] tracking-[0.16em] uppercase text-white/40">
            <span>Rank</span><span>Trader</span><span className="text-right">Return</span><span className="text-right">Volume</span>
          </div>
          {rows.map((r, i) => (
            <div key={r.h} className="grid grid-cols-[44px_1fr_auto] sm:grid-cols-[64px_1fr_120px_140px] items-center gap-3 px-4 sm:px-5 py-3 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
              <span className="flex items-center justify-center">
                {i < 3 ? (
                  <span className="inline-flex w-7 h-7 items-center justify-center rounded-full" style={{ background: `${MEDALS[i]}22`, border: `1px solid ${MEDALS[i]}55` }}>
                    <Medal className="w-3.5 h-3.5" style={{ color: MEDALS[i] }} strokeWidth={2.2} />
                  </span>
                ) : (
                  <span className="font-mono text-[13px] text-white/45">{i + 1}</span>
                )}
              </span>
              <span className="min-w-0">
                <span className="block text-[13.5px] font-medium text-white/90 truncate">{r.h}</span>
                <span className="mt-1 hidden sm:block h-1 rounded-full bg-white/[0.06] overflow-hidden max-w-[260px]">
                  <span className="block h-full bg-tradeTeal" style={{ width: `${r.w}%` }} />
                </span>
              </span>
              <span className="font-mono text-[13px] text-tradeTeal text-right">+{r.ret}%</span>
              <span className="font-mono text-[12px] text-white/70 text-right hidden sm:block">{r.vol}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 font-mono text-[10.5px] text-white/35">Indicative ranking · figures are illustrative and refresh each session.</p>
      </Section>

      <Section>
        <SectionLabel index="01" title="How leaderboards work" caption="Verified, live, and built to spread." />
        <FeatureGrid items={FEATURES} />
      </Section>

      <Section>
        <FinalCTA
          kicker="Seasons run continuously" KickerIcon={Zap}
          title="Put your results on" accent="the board."
          primary={{ label: "Join a competition", to: EXTERNAL.launchTerminal, testid: "lb-final-cta" }}
          secondary={{ label: "View Proof Cards", to: "/network/proof-cards", testid: "lb-link-proof" }}
        />
      </Section>
    </SolutionLayout>
  );
}
