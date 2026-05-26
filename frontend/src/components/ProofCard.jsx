import { TrendingUp, BadgeCheck, Share2 } from "lucide-react";

/**
 * A shareable PNL "proof card" — the real component the Network/Proof Cards
 * feature generates, with embedded referral handle and TradeCafe branding.
 */
export default function ProofCard({
  sym = "BTCUSDT", dir = "LONG", pnl = "+412.8%", entry = "61,240", exit = "84,910",
  handle = "@brandononchain", code = "BRANDON8",
}) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-tradeTeal/25 p-6 w-full max-w-[400px]"
      style={{
        background:
          "radial-gradient(120% 120% at 0% 0%, rgba(0,180,166,0.16), transparent 55%), radial-gradient(120% 120% at 100% 100%, rgba(232,120,42,0.1), transparent 55%), #050c10",
        boxShadow: "0 30px 80px rgba(0,0,0,0.55), 0 0 60px rgba(0,180,166,0.1)",
      }}
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-tradeTeal">
          <BadgeCheck className="w-3.5 h-3.5" strokeWidth={2} /> Verified PnL
        </span>
        <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/40">TradeCafe</span>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[10px] tracking-[0.08em] ${dir === "LONG" ? "bg-tradeTeal/15 text-tradeTeal" : "bg-[#F23645]/15 text-[#FF8A82]"}`}>
          <TrendingUp className="w-3 h-3" strokeWidth={2.4} /> {dir}
        </span>
        <span className="text-[17px] font-semibold text-tradeWhite">{sym}</span>
      </div>

      <div className="mt-3 font-heading font-bold text-tradeTeal tracking-[-0.03em]" style={{ fontSize: 54, lineHeight: 1 }}>
        {pnl}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
          <div className="font-mono text-[9px] tracking-[0.12em] uppercase text-white/40 mb-1">Entry</div>
          <div className="font-mono text-[14px] text-tradeWhite">{entry}</div>
        </div>
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
          <div className="font-mono text-[9px] tracking-[0.12em] uppercase text-white/40 mb-1">Exit</div>
          <div className="font-mono text-[14px] text-tradeWhite">{exit}</div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between">
        <div>
          <div className="text-[13px] font-medium text-white/85">{handle}</div>
          <div className="font-mono text-[10px] text-white/45">Ref code · <span className="text-tradeTeal">{code}</span></div>
        </div>
        <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-tradeTeal/15 text-tradeTeal text-[12px] font-medium hover:bg-tradeTeal/25 transition-colors">
          <Share2 className="w-3.5 h-3.5" strokeWidth={2} /> Share
        </button>
      </div>
    </div>
  );
}
