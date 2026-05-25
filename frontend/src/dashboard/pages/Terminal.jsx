import { useMemo, useState } from "react";
import { TrendingUp, TrendingDown, Search, Plus, Minus, X } from "lucide-react";
import TradingChart from "../components/TradingChart";
import { WATCHLIST, OPEN_POSITIONS, TIMEFRAMES } from "../data";

export default function Terminal() {
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [tf, setTf] = useState("1H");
  const [side, setSide] = useState("buy");
  const [query, setQuery] = useState("");

  const active = useMemo(() => WATCHLIST.find((w) => w.sym === symbol) || WATCHLIST[0], [symbol]);
  const list = useMemo(
    () => WATCHLIST.filter((w) => w.sym.includes(query.trim().toUpperCase())),
    [query]
  );

  return (
    <div className="tc-fade flex flex-col gap-4">
      {/* Symbol header */}
      <div className="tc-panel flex flex-wrap items-center gap-x-8 gap-y-3 !py-4">
        <div className="flex items-center gap-3">
          <span className="font-heading text-[20px] font-semibold tracking-[-0.02em] text-tradeWhite">
            {active.sym}
          </span>
          <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/40">Perp · Cross</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-[20px] font-semibold text-tradeWhite">{active.last}</span>
          <span className={`font-mono text-[12px] ${active.up ? "text-tradeTeal" : "text-[#FF8A82]"}`}>{active.chg}</span>
        </div>
        <div className="hidden md:flex items-center gap-6 ml-auto font-mono text-[11px]">
          <Mini label="24h High" value={active.last} />
          <Mini label="24h Vol" value="1.24B" />
          <Mini label="Funding" value="0.011%" teal />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[240px_1fr_300px] gap-4">
        {/* Watchlist */}
        <div className="tc-panel !p-3 order-2 xl:order-1">
          <div className="tc-search mb-3">
            <Search className="w-4 h-4 text-white/35" strokeWidth={2} />
            <input placeholder="Search market…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1 max-h-[420px] overflow-y-auto">
            {list.map((w) => (
              <button
                key={w.sym}
                onClick={() => setSymbol(w.sym)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors ${
                  w.sym === symbol ? "bg-tradeTeal/10" : "hover:bg-white/[0.03]"
                }`}
                data-testid={`watch-${w.sym}`}
              >
                <span className="text-[12.5px] font-medium text-white/85">{w.sym}</span>
                <span className="text-right">
                  <span className="block font-mono text-[11.5px] text-white/75">{w.last}</span>
                  <span className={`block font-mono text-[10px] ${w.up ? "text-tradeTeal" : "text-[#FF8A82]"}`}>{w.chg}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="tc-panel !p-0 overflow-hidden order-1 xl:order-2 flex flex-col">
          <div className="flex items-center gap-1 px-3 py-2.5 border-b border-white/5">
            {TIMEFRAMES.map((t) => (
              <button
                key={t}
                onClick={() => setTf(t)}
                className={`px-3 py-1.5 rounded-md font-mono text-[11px] transition-colors ${
                  t === tf ? "bg-tradeTeal/15 text-tradeTeal" : "text-white/45 hover:text-white/80"
                }`}
                data-testid={`tf-${t}`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="h-[380px] sm:h-[440px]">
            <TradingChart symbol={symbol} timeframe={tf} />
          </div>
        </div>

        {/* Order panel */}
        <div className="tc-panel order-3 flex flex-col gap-4">
          <div className="tc-segment">
            <div className={`tc-segment-btn ${side === "buy" ? "is-active" : ""}`} style={{ padding: "9px 0" }} onClick={() => setSide("buy")}>
              Buy / Long
            </div>
            <div
              className="tc-segment-btn"
              style={side === "sell" ? { padding: "9px 0", color: "#042024", background: "linear-gradient(135deg,#FF9B91,#F23645)" } : { padding: "9px 0" }}
              onClick={() => setSide("sell")}
            >
              Sell / Short
            </div>
          </div>

          <Field label="Order Type" value="Market" />
          <Field label="Price" value={side === "buy" ? active.last : active.last} mono />
          <Field label="Amount (USDT)" value="0.00" mono />

          <div>
            <div className="flex justify-between font-mono text-[10px] tracking-[0.12em] uppercase text-white/45 mb-2">
              <span>Leverage</span><span className="text-tradeTeal">10×</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="tc-iconbtn" style={{ width: 32, height: 32 }}><Minus className="w-3.5 h-3.5" /></button>
              <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
                <div className="h-full bg-tradeTeal" style={{ width: "40%" }} />
              </div>
              <button className="tc-iconbtn" style={{ width: 32, height: 32 }}><Plus className="w-3.5 h-3.5" /></button>
            </div>
          </div>

          <button
            className="tc-btn w-full"
            style={
              side === "buy"
                ? { color: "#042024", background: "linear-gradient(135deg,#7FE0D1,#2EBFAC)" }
                : { color: "#042024", background: "linear-gradient(135deg,#FF9B91,#F23645)" }
            }
            data-testid="order-submit"
          >
            {side === "buy" ? "Buy / Long" : "Sell / Short"} {active.sym}
          </button>

          <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-white/50 pt-1">
            <span>Avail.</span><span className="text-right text-white/80">$0.00</span>
            <span>Margin</span><span className="text-right text-white/80">$0.00</span>
            <span>Fees</span><span className="text-right text-white/80">0.04%</span>
          </div>
        </div>
      </div>

      {/* Positions */}
      <div className="tc-panel">
        <div className="tc-panel-head">
          <span className="ttl">Open Positions</span>
          <span className="tc-chip tc-chip-active"><span className="tc-chip-dot" /> {OPEN_POSITIONS.length} Open</span>
        </div>
        <div className="tc-table-wrap">
          <table className="tc-table">
            <thead>
              <tr>
                <th>Symbol</th><th>Side</th><th>Size</th><th>Entry</th><th>Mark</th><th>PnL</th><th></th>
              </tr>
            </thead>
            <tbody>
              {OPEN_POSITIONS.map((p, i) => (
                <tr key={i} data-testid={`pos-${i}`}>
                  <td className="sym">{p.sym}</td>
                  <td>
                    <span className={p.side === "LONG" ? "tc-tag-long" : "tc-tag-short"}>
                      {p.side === "LONG" ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />} {p.side}
                    </span>
                  </td>
                  <td className="mono">{p.size}</td>
                  <td className="mono">{p.entry}</td>
                  <td className="mono">{p.mark}</td>
                  <td><span className="tc-pl-pos">{p.pnl} · {p.pct}</span></td>
                  <td className="text-right">
                    <button className="tc-iconbtn" style={{ width: 30, height: 30 }} aria-label="Close position">
                      <X className="w-3.5 h-3.5" strokeWidth={2} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Mini({ label, value, teal }) {
  return (
    <span className="flex flex-col">
      <span className="text-[9px] tracking-[0.14em] uppercase text-white/40">{label}</span>
      <span className={`text-[12px] ${teal ? "text-tradeTeal" : "text-white/80"}`}>{value}</span>
    </span>
  );
}

function Field({ label, value, mono }) {
  return (
    <div>
      <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-white/45 mb-2">{label}</div>
      <div className={`px-3 py-2.5 rounded-lg bg-white/[0.025] border border-white/8 text-[13px] text-white/85 ${mono ? "font-mono" : ""}`}>
        {value}
      </div>
    </div>
  );
}
