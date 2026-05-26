import { TrendingUp, TrendingDown, BadgeCheck } from "lucide-react";

const SOURCE_LABEL = { signal: "AI SIGNAL", auto: "AUTO-TRADE", manual: "MANUAL", pool: "POOL" };

/**
 * Premium shareable PnL "proof card" used across the app (Signals,
 * Automation, manual trades) and the marketing Partners page.
 */
export default function ProofCard({
  sym = "BTCUSDT",
  dir = "LONG",
  pnl = "+412.8%",
  pnlAmount,
  entry = "61,240",
  exit = "84,910",
  leverage,
  source = "manual",
  date = "May 26, 2026",
  handle = "@brandononchain",
  code = "BRANDON8",
  spark = [22, 30, 26, 40, 38, 52, 48, 64, 60, 78, 72, 92],
}) {
  const up = !String(pnl).startsWith("-");
  const max = Math.max(...spark);
  const min = Math.min(...spark);
  const pts = spark
    .map((v, i) => `${(i / (spark.length - 1)) * 100},${36 - ((v - min) / (max - min || 1)) * 32}`)
    .join(" ");

  return (
    <div
      className="relative rounded-2xl overflow-hidden p-6 w-full max-w-[400px]"
      style={{
        background:
          "radial-gradient(130% 130% at 0% 0%, rgba(0,180,166,0.20), transparent 52%), radial-gradient(120% 120% at 100% 100%, rgba(232,120,42,0.12), transparent 55%), #050d11",
        border: "1px solid rgba(0,180,166,0.3)",
        boxShadow: "0 30px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 60px rgba(0,180,166,0.12)",
      }}
    >
      {/* subtle grid texture */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <img src="/tradecafe-logo.png" alt="" className="w-5 h-5" style={{ filter: "drop-shadow(0 0 6px rgba(0,180,166,0.6))" }} />
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/55">TradeCafe</span>
          </span>
          <span className="font-mono text-[8.5px] tracking-[0.14em] uppercase px-2 py-1 rounded-md bg-tradeTeal/15 text-tradeTeal border border-tradeTeal/25">
            {SOURCE_LABEL[source] || "TRADE"}
          </span>
        </div>

        <div className="mt-5 flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[10px] tracking-[0.08em] ${up ? "bg-tradeTeal/15 text-tradeTeal" : "bg-[#F23645]/15 text-[#FF8A82]"}`}>
            {dir === "LONG" ? <TrendingUp className="w-3 h-3" strokeWidth={2.4} /> : <TrendingDown className="w-3 h-3" strokeWidth={2.4} />} {dir}
          </span>
          <span className="text-[17px] font-semibold text-tradeWhite">{sym}</span>
          {leverage && <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-white/60">{leverage}×</span>}
        </div>

        <div className="mt-3 flex items-end gap-3">
          <span className={`font-heading font-bold tracking-[-0.03em] ${up ? "text-tradeTeal" : "text-[#FF8A82]"}`} style={{ fontSize: 52, lineHeight: 1 }}>{pnl}</span>
          {pnlAmount && <span className={`font-mono text-[15px] mb-1.5 ${up ? "text-tradeTeal/80" : "text-[#FF8A82]/80"}`}>{pnlAmount}</span>}
        </div>

        {/* sparkline */}
        <svg viewBox="0 0 100 38" preserveAspectRatio="none" className="w-full h-9 mt-3" aria-hidden>
          <polyline points={pts} fill="none" stroke={up ? "#1FB8A6" : "#F23645"} strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
        </svg>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
            <div className="font-mono text-[9px] tracking-[0.12em] uppercase text-white/40 mb-1">Entry</div>
            <div className="font-mono text-[13px] text-tradeWhite">{entry}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
            <div className="font-mono text-[9px] tracking-[0.12em] uppercase text-white/40 mb-1">{up ? "Exit / Target" : "Exit"}</div>
            <div className="font-mono text-[13px] text-tradeWhite">{exit}</div>
          </div>
        </div>

        <div className="mt-4 pt-3.5 border-t border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-tradeTeal" strokeWidth={2} />
            <div>
              <div className="text-[12.5px] font-medium text-white/85">{handle}</div>
              <div className="font-mono text-[9.5px] text-white/40">{date}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[8.5px] tracking-[0.12em] uppercase text-white/40">Ref code</div>
            <div className="font-mono text-[12px] text-tradeTeal">{code}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
