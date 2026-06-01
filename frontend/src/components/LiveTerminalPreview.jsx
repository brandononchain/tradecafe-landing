import { useState } from "react";
import {
  CandlestickChart, LineChart as LineIcon, AreaChart as AreaIcon, BarChart3, Brain,
} from "lucide-react";
import TradingChart from "../dashboard/components/TradingChart";

const CHART_TYPES = [
  { key: "candles", icon: CandlestickChart },
  { key: "bars", icon: BarChart3 },
  { key: "line", icon: LineIcon },
  { key: "area", icon: AreaIcon },
];
const TFS = ["15m", "1H", "4H", "1D"];
const INDICATORS = [
  { key: "EMA", kind: "overlay" },
  { key: "BB", kind: "overlay" },
  { key: "VWAP", kind: "overlay" },
];

/**
 * A real, interactive slice of the TradeCafe terminal embedded on the
 * marketing site — the actual TradingChart component, not a mockup.
 */
export default function LiveTerminalPreview({ symbol = "BTCUSDT", signal = null, label }) {
  const [chartType, setChartType] = useState("candles");
  const [tf, setTf] = useState("1H");
  const [overlays, setOverlays] = useState({ EMA: { period: 20 } });
  // Default the oscillator pane OFF on small screens so the preview stays a
  // single clean chart; users can still toggle it on.
  const [osc, setOsc] = useState(() => {
    if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(max-width: 768px)").matches) return null;
    return "RSI";
  });
  const [ai, setAi] = useState({ sr: true, pivots: !!signal });

  const toggleOverlay = (k) =>
    setOverlays((p) => {
      const n = { ...p };
      if (n[k]) delete n[k];
      else n[k] = k === "BB" ? { period: 20, mult: 2 } : { period: 20 };
      return n;
    });

  return (
    <div className="rounded-2xl overflow-hidden border border-tradeTeal/20 bg-[#04090d]" style={{ boxShadow: "0 30px 80px rgba(0,0,0,0.5), 0 0 60px rgba(0,180,166,0.08)" }}>
      {/* chrome */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.05]">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
          <span className="ml-3 font-mono text-[11px] tracking-[0.16em] uppercase text-white/55">{label || `${symbol} · TradeCafe Terminal`}</span>
        </div>
        <span className="hidden sm:flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] uppercase text-tradeTeal">
          <span className="trade-pulse-dot w-1.5 h-1.5 rounded-full bg-tradeTeal inline-block" /> Live
        </span>
      </div>

      {/* toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.05] flex-wrap">
        <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-white/[0.03]">
          {CHART_TYPES.map((c) => {
            const Ic = c.icon;
            return (
              <button key={c.key} onClick={() => setChartType(c.key)}
                className={`flex items-center justify-center rounded-md transition-colors ${chartType === c.key ? "bg-tradeTeal/15 text-tradeTeal" : "text-white/45 hover:text-white/80"}`}
                style={{ width: 30, height: 30 }}>
                <Ic className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-white/[0.03]">
          {TFS.map((t) => (
            <button key={t} onClick={() => setTf(t)}
              className={`px-2.5 py-1.5 rounded-md font-mono text-[11px] transition-colors ${t === tf ? "bg-tradeTeal/15 text-tradeTeal" : "text-white/45 hover:text-white/80"}`}>{t}</button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 ml-auto flex-wrap">
          {INDICATORS.map((ind) => (
            <button key={ind.key} onClick={() => toggleOverlay(ind.key)}
              className={`px-2.5 py-1 rounded-full font-mono text-[10px] tracking-[0.06em] border transition-colors ${overlays[ind.key] ? "bg-tradeTeal/15 text-tradeTeal border-tradeTeal/30" : "text-white/50 border-white/[0.06]"}`}>
              {ind.key}
            </button>
          ))}
          <button onClick={() => setOsc(osc === "RSI" ? null : "RSI")}
            className={`px-2.5 py-1 rounded-full font-mono text-[10px] tracking-[0.06em] border transition-colors ${osc ? "bg-tradeTeal/15 text-tradeTeal border-tradeTeal/30" : "text-white/50 border-white/[0.06]"}`}>RSI</button>
          <button onClick={() => setAi((a) => ({ ...a, sr: !a.sr }))}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-mono text-[10px] tracking-[0.06em] border transition-colors ${ai.sr ? "bg-tradeTeal/15 text-tradeTeal border-tradeTeal/30" : "text-white/50 border-white/[0.06]"}`}>
            <Brain className="w-3 h-3" strokeWidth={2} /> AI
          </button>
        </div>
      </div>

      {/* the real chart */}
      <div className="h-[360px] sm:h-[440px]">
        <TradingChart symbol={symbol} timeframe={tf} chartType={chartType} overlays={overlays} oscillator={osc} ai={ai} signal={signal} />
      </div>
    </div>
  );
}
