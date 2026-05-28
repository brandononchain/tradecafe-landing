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
  light = false,
}) {
  const up = !String(pnl).startsWith("-");
  const max = Math.max(...spark);
  const min = Math.min(...spark);
  const pts = spark
    .map((v, i) => `${(i / (spark.length - 1)) * 100},${36 - ((v - min) / (max - min || 1)) * 32}`)
    .join(" ");

  // Light variant — same structure with a clean off-white surface, dark
  // text, and the teal accent kept intact for brand continuity.
  const palette = light
    ? {
        cardStyle: {
          background:
            "radial-gradient(130% 130% at 0% 0%, rgba(0,180,166,0.10), transparent 52%), radial-gradient(120% 120% at 100% 100%, rgba(232,120,42,0.06), transparent 55%), #FFFFFF",
          border: "1px solid rgba(0,137,126,0.3)",
          boxShadow: "0 24px 60px rgba(15, 28, 35, 0.12), inset 0 1px 0 rgba(255,255,255,0.9), 0 0 40px rgba(0,180,166,0.08)",
        },
        grid:
          "linear-gradient(rgba(16,26,30,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(16,26,30,0.06) 1px, transparent 1px)",
        ink: "#101A1E",
        inkMuted: "rgba(16,26,30,0.55)",
        inkSubtle: "rgba(16,26,30,0.4)",
        chipBg: "rgba(16,26,30,0.05)",
        chipBorder: "rgba(16,26,30,0.1)",
        tile: "rgba(16,26,30,0.04)",
        tileBorder: "rgba(16,26,30,0.08)",
        divider: "rgba(16,26,30,0.1)",
        accent: "#00897E",
        accentSoft: "rgba(0,137,126,0.12)",
        accentBorder: "rgba(0,137,126,0.3)",
        down: "#D6334A",
        downSoft: "rgba(214,51,74,0.12)",
        downBorder: "rgba(214,51,74,0.25)",
      }
    : {
        cardStyle: {
          background:
            "radial-gradient(130% 130% at 0% 0%, rgba(0,180,166,0.20), transparent 52%), radial-gradient(120% 120% at 100% 100%, rgba(232,120,42,0.12), transparent 55%), #050d11",
          border: "1px solid rgba(0,180,166,0.3)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 60px rgba(0,180,166,0.12)",
        },
        grid:
          "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
        ink: "#F5F6F2",
        inkMuted: "rgba(255,255,255,0.55)",
        inkSubtle: "rgba(255,255,255,0.4)",
        chipBg: "rgba(255,255,255,0.06)",
        chipBorder: "rgba(255,255,255,0.08)",
        tile: "rgba(255,255,255,0.04)",
        tileBorder: "rgba(255,255,255,0.06)",
        divider: "rgba(255,255,255,0.08)",
        accent: "#1FB8A6",
        accentSoft: "rgba(31,184,166,0.15)",
        accentBorder: "rgba(31,184,166,0.25)",
        down: "#FF8A82",
        downSoft: "rgba(242,54,69,0.15)",
        downBorder: "rgba(242,54,69,0.25)",
      };
  const dirColor = up ? palette.accent : palette.down;
  const dirSoft = up ? palette.accentSoft : palette.downSoft;
  const dirBorder = up ? palette.accentBorder : palette.downBorder;

  return (
    <div
      className="relative rounded-2xl overflow-hidden p-6 w-full max-w-[400px]"
      style={palette.cardStyle}
    >
      {/* subtle grid texture */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: light ? 0.5 : 0.06, backgroundImage: palette.grid, backgroundSize: "28px 28px" }} />

      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <img src="/tradecafe-logo.png" alt="" className="w-5 h-5" style={{ filter: light ? "none" : "drop-shadow(0 0 6px rgba(0,180,166,0.6))" }} />
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase" style={{ color: palette.inkMuted }}>TradeCafe</span>
          </span>
          <span className="font-mono text-[8.5px] tracking-[0.14em] uppercase px-2 py-1 rounded-md" style={{ background: palette.accentSoft, color: palette.accent, border: `1px solid ${palette.accentBorder}` }}>
            {SOURCE_LABEL[source] || "TRADE"}
          </span>
        </div>

        <div className="mt-5 flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[10px] tracking-[0.08em]" style={{ background: dirSoft, color: dirColor, border: `1px solid ${dirBorder}` }}>
            {dir === "LONG" ? <TrendingUp className="w-3 h-3" strokeWidth={2.4} /> : <TrendingDown className="w-3 h-3" strokeWidth={2.4} />} {dir}
          </span>
          <span className="text-[17px] font-semibold" style={{ color: palette.ink }}>{sym}</span>
          {leverage && <span className="font-mono text-[10px] px-1.5 py-0.5 rounded" style={{ background: palette.chipBg, color: palette.inkMuted }}>{leverage}×</span>}
        </div>

        <div className="mt-3 flex items-end gap-3">
          <span className="font-heading font-bold tracking-[-0.03em]" style={{ fontSize: 52, lineHeight: 1, color: dirColor }}>{pnl}</span>
          {pnlAmount && <span className="font-mono text-[15px] mb-1.5" style={{ color: dirColor, opacity: 0.85 }}>{pnlAmount}</span>}
        </div>

        {/* sparkline */}
        <svg viewBox="0 0 100 38" preserveAspectRatio="none" className="w-full h-9 mt-3" aria-hidden>
          <polyline points={pts} fill="none" stroke={dirColor} strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
        </svg>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="p-2.5 rounded-xl" style={{ background: palette.tile, border: `1px solid ${palette.tileBorder}` }}>
            <div className="font-mono text-[9px] tracking-[0.12em] uppercase mb-1" style={{ color: palette.inkSubtle }}>Entry</div>
            <div className="font-mono text-[13px]" style={{ color: palette.ink }}>{entry}</div>
          </div>
          <div className="p-2.5 rounded-xl" style={{ background: palette.tile, border: `1px solid ${palette.tileBorder}` }}>
            <div className="font-mono text-[9px] tracking-[0.12em] uppercase mb-1" style={{ color: palette.inkSubtle }}>{up ? "Exit / Target" : "Exit"}</div>
            <div className="font-mono text-[13px]" style={{ color: palette.ink }}>{exit}</div>
          </div>
        </div>

        <div className="mt-4 pt-3.5 flex items-center justify-between" style={{ borderTop: `1px solid ${palette.divider}` }}>
          <div className="flex items-center gap-2">
            <BadgeCheck className="w-4 h-4" style={{ color: palette.accent }} strokeWidth={2} />
            <div>
              <div className="text-[12.5px] font-medium" style={{ color: palette.ink, opacity: 0.9 }}>{handle}</div>
              <div className="font-mono text-[9.5px]" style={{ color: palette.inkSubtle }}>{date}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[8.5px] tracking-[0.12em] uppercase" style={{ color: palette.inkSubtle }}>Ref code</div>
            <div className="font-mono text-[12px]" style={{ color: palette.accent }}>{code}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
