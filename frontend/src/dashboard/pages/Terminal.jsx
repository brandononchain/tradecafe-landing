import { useEffect, useMemo, useState } from "react";
import {
  TrendingUp, TrendingDown, Search, Minus, X, ChevronDown, Check,
  CandlestickChart, LineChart as LineIcon, AreaChart as AreaIcon, BarChart3,
  Brain, Sparkles, MousePointer2, MoveUpRight, Type, Square, Magnet, Lock, Eraser, Ruler,
  Settings2, Keyboard,
} from "lucide-react";
import TradingChart from "../components/TradingChart";
import Modal from "../components/Modal";
import { WATCHLIST, OPEN_POSITIONS, TIMEFRAMES, SIGNALS } from "../data";
import { OVERLAYS, OSCILLATORS } from "../lib/indicators";

const CHART_TYPES = [
  { key: "candles", icon: CandlestickChart, label: "Candles" },
  { key: "bars", icon: BarChart3, label: "Bars" },
  { key: "line", icon: LineIcon, label: "Line" },
  { key: "area", icon: AreaIcon, label: "Area" },
];

const DRAW_TOOLS = [
  { key: null, icon: MousePointer2, label: "Cursor" },
  { key: "trendline", icon: MoveUpRight, label: "Trend line" },
  { key: "horizontal", icon: Minus, label: "Horizontal line" },
  { key: "ray", icon: TrendingUp, label: "Ray" },
  { key: "rectangle", icon: Square, label: "Rectangle" },
  { key: "measure", icon: Ruler, label: "Measure" },
  { key: "text", icon: Type, label: "Text" },
];

const LEVERAGE = [1, 2, 3, 5, 10, 20, 25, 50];

export default function Terminal() {
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [tf, setTf] = useState("1H");
  const [chartType, setChartType] = useState("candles");
  const [overlays, setOverlays] = useState({});
  const [oscillator, setOscillator] = useState(null);
  const [ai, setAi] = useState({ sr: false, pivots: false, channel: false, breaks: false });
  const [drawTool, setDrawTool] = useState(null);
  const [magnet, setMagnet] = useState(false);
  const [locked, setLocked] = useState(false);
  const [rightTab, setRightTab] = useState("order");
  const [side, setSide] = useState("buy");
  const [marginMode, setMarginMode] = useState("percent");
  const [leverage, setLeverage] = useState(10);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [logScale, setLogScale] = useState(false);

  // Keyboard shortcuts: 1–6 switch timeframe.
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      const idx = parseInt(e.key, 10) - 1;
      if (idx >= 0 && idx < TIMEFRAMES.length) setTf(TIMEFRAMES[idx]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const active = useMemo(() => WATCHLIST.find((w) => w.sym === symbol) || WATCHLIST[0], [symbol]);
  const list = useMemo(
    () => WATCHLIST.filter((w) => w.sym.includes(query.trim().toUpperCase())),
    [query]
  );

  const toggleOverlay = (k, defaults) =>
    setOverlays((prev) => {
      const next = { ...prev };
      if (next[k]) delete next[k];
      else next[k] = { ...defaults };
      return next;
    });

  const activeIndicatorCount = Object.keys(overlays).length + (oscillator ? 1 : 0);

  return (
    <div className="tc-fade flex flex-col gap-3">
      {/* Symbol header */}
      <div className="tc-panel flex flex-wrap items-center gap-x-8 gap-y-3 !py-3.5">
        <button className="flex items-center gap-2 hover:opacity-80" onClick={() => setSearchOpen(true)} data-testid="open-symbol-search">
          <span className="font-heading text-[19px] font-semibold tracking-[-0.02em] text-tradeWhite">{active.sym}</span>
          <ChevronDown className="w-4 h-4 text-white/40" />
        </button>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-[19px] font-semibold text-tradeWhite">{active.last}</span>
          <span className={`font-mono text-[12px] ${active.up ? "text-tradeTeal" : "text-[#FF8A82]"}`}>{active.chg}</span>
        </div>
        <div className="hidden md:flex items-center gap-6 ml-auto font-mono text-[11px]">
          <Mini label="24h High" value={active.last} />
          <Mini label="24h Vol" value="1.24B" />
          <Mini label="Funding" value="0.011%" teal />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[230px_1fr_300px] gap-3">
        {/* Watchlist */}
        <div className="tc-panel !p-3 order-2 xl:order-1">
          <div className="tc-search mb-3">
            <Search className="w-4 h-4 text-white/35" strokeWidth={2} />
            <input placeholder="Search market…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1 max-h-[560px] xl:max-h-[680px] overflow-y-auto">
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

        {/* Chart + toolbar + drawing rail */}
        <div className="tc-panel !p-0 overflow-hidden order-1 xl:order-2 flex flex-col">
          {/* Toolbar */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-white/5 flex-wrap">
            <div className="flex items-center gap-0.5">
              {CHART_TYPES.map((c) => {
                const Ic = c.icon;
                return (
                  <button key={c.key} onClick={() => setChartType(c.key)} title={c.label}
                    className={`tc-iconbtn ${chartType === c.key ? "!border-tradeTeal/40 !text-tradeTeal" : ""}`}
                    style={{ width: 32, height: 32 }} data-testid={`charttype-${c.key}`}>
                    <Ic className="w-3.5 h-3.5" strokeWidth={2} />
                  </button>
                );
              })}
            </div>
            <span className="w-px h-5 bg-white/8" />
            <div className="flex items-center gap-0.5">
              {TIMEFRAMES.map((t) => (
                <button key={t} onClick={() => setTf(t)}
                  className={`px-2.5 py-1.5 rounded-md font-mono text-[11px] transition-colors ${t === tf ? "bg-tradeTeal/15 text-tradeTeal" : "text-white/45 hover:text-white/80"}`}
                  data-testid={`tf-${t}`}>{t}</button>
              ))}
            </div>
            <span className="w-px h-5 bg-white/8" />
            <Dropdown
              label="Indicators"
              badge={activeIndicatorCount || null}
              testid="menu-indicators"
            >
              <MenuLabel>Overlays</MenuLabel>
              {OVERLAYS.map((o) => (
                <MenuItem key={o.key} checked={!!overlays[o.key]} onClick={() => toggleOverlay(o.key, o.defaults)}>
                  {o.label}
                </MenuItem>
              ))}
              <MenuLabel>Oscillators</MenuLabel>
              {OSCILLATORS.map((o) => (
                <MenuItem key={o.key} checked={oscillator === o.key} onClick={() => setOscillator(oscillator === o.key ? null : o.key)}>
                  {o.label}
                </MenuItem>
              ))}
            </Dropdown>
            <Dropdown label="AI" icon={Brain} testid="menu-ai">
              <MenuItem checked={ai.sr} onClick={() => setAi((a) => ({ ...a, sr: !a.sr }))}>Support / Resistance</MenuItem>
              <MenuItem checked={ai.pivots} onClick={() => setAi((a) => ({ ...a, pivots: !a.pivots }))}>Pivot Points</MenuItem>
              <MenuItem checked={ai.channel} onClick={() => setAi((a) => ({ ...a, channel: !a.channel }))}>Trend Channel</MenuItem>
              <MenuItem checked={ai.breaks} onClick={() => setAi((a) => ({ ...a, breaks: !a.breaks }))}>Breaks &amp; Retests</MenuItem>
            </Dropdown>
            <button className="tc-iconbtn ml-auto" style={{ width: 32, height: 32 }} onClick={() => setSettingsOpen(true)} title="Chart settings" data-testid="chart-settings">
              <Settings2 className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
          </div>

          {/* Chart area with drawing rail */}
          <div className="flex flex-1">
            <div className="flex flex-col items-center gap-1 py-2 px-1.5 border-r border-white/5">
              {DRAW_TOOLS.map((d) => {
                const Ic = d.icon;
                const isActive = drawTool === d.key;
                return (
                  <button key={d.label} onClick={() => setDrawTool(d.key)} title={d.label}
                    className={`tc-iconbtn ${isActive ? "!border-tradeTeal/40 !text-tradeTeal" : ""}`}
                    style={{ width: 30, height: 30 }} data-testid={`draw-${d.label.replace(/\s+/g, "-").toLowerCase()}`}>
                    <Ic className="w-3.5 h-3.5" strokeWidth={2} />
                  </button>
                );
              })}
              <span className="w-5 h-px bg-white/8 my-1" />
              <button onClick={() => setMagnet((v) => !v)} title="Magnet"
                className={`tc-iconbtn ${magnet ? "!border-tradeTeal/40 !text-tradeTeal" : ""}`} style={{ width: 30, height: 30 }}>
                <Magnet className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
              <button onClick={() => setLocked((v) => !v)} title="Lock"
                className={`tc-iconbtn ${locked ? "!border-tradeTeal/40 !text-tradeTeal" : ""}`} style={{ width: 30, height: 30 }}>
                <Lock className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
              <button onClick={() => setDrawTool("eraser")} title="Eraser"
                className={`tc-iconbtn ${drawTool === "eraser" ? "!border-[#FF8A82]/50 !text-[#FF8A82]" : ""}`} style={{ width: 30, height: 30 }}>
                <Eraser className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
            </div>
            <div className="flex-1 h-[540px] sm:h-[620px] xl:h-[720px]">
              <TradingChart symbol={symbol} timeframe={tf} chartType={chartType} overlays={overlays} oscillator={oscillator} ai={ai} drawTool={locked ? null : drawTool} logScale={logScale} />
            </div>
          </div>
        </div>

        {/* Right rail */}
        <div className="order-3 flex flex-col gap-3">
          <div className="tc-segment">
            {["order", "signals", "ai"].map((t) => (
              <div key={t} className={`tc-segment-btn ${rightTab === t ? "is-active" : ""}`} style={{ padding: "8px 0" }} onClick={() => setRightTab(t)} data-testid={`righttab-${t}`}>
                {t === "ai" ? "AI" : t.charAt(0).toUpperCase() + t.slice(1)}
              </div>
            ))}
          </div>

          {rightTab === "order" && (
            <OrderPanel
              active={active} side={side} setSide={setSide}
              marginMode={marginMode} setMarginMode={setMarginMode}
              leverage={leverage} setLeverage={setLeverage}
            />
          )}
          {rightTab === "signals" && <SignalsRail />}
          {rightTab === "ai" && <AIRail ai={ai} setAi={setAi} symbol={symbol} timeframe={tf} />}
        </div>
      </div>

      {/* Signal history bar */}
      <div className="tc-panel !py-3">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="tc-chip-dot" />
          <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/45">Signal History</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {SIGNALS.map((s, i) => (
            <button key={i} onClick={() => setSymbol(s.sym)} className="shrink-0 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/6 hover:border-tradeTeal/30 transition-colors text-left">
              <div className="flex items-center gap-2">
                <span className={s.dir === "LONG" ? "tc-tag-long" : "tc-tag-short"}>{s.dir}</span>
                <span className="text-[12px] font-medium text-white/85">{s.sym}</span>
              </div>
              <div className="font-mono text-[10px] text-white/45 mt-1">{s.strat} · {s.tf} · {s.time}</div>
            </button>
          ))}
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
            <thead><tr><th>Symbol</th><th>Side</th><th>Size</th><th>Entry</th><th>Mark</th><th>PnL</th><th></th></tr></thead>
            <tbody>
              {OPEN_POSITIONS.map((p, i) => (
                <tr key={i} data-testid={`pos-${i}`}>
                  <td className="sym">{p.sym}</td>
                  <td><span className={p.side === "LONG" ? "tc-tag-long" : "tc-tag-short"}>{p.side === "LONG" ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />} {p.side}</span></td>
                  <td className="mono">{p.size}</td>
                  <td className="mono">{p.entry}</td>
                  <td className="mono">{p.mark}</td>
                  <td><span className="tc-pl-pos">{p.pnl} · {p.pct}</span></td>
                  <td className="text-right"><button className="tc-iconbtn" style={{ width: 30, height: 30 }} aria-label="Close position"><X className="w-3.5 h-3.5" strokeWidth={2} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {searchOpen && <SymbolSearch onClose={() => setSearchOpen(false)} onPick={(s) => { setSymbol(s); setSearchOpen(false); }} />}
      {settingsOpen && (
        <Modal title="Terminal settings" sub="Chart preferences" onClose={() => setSettingsOpen(false)}
          footer={<button className="tc-btn tc-btn-primary flex-1" onClick={() => setSettingsOpen(false)}>Done</button>}>
          <ToggleRow label="Logarithmic price scale" on={logScale} onClick={() => setLogScale((v) => !v)} />
          <ToggleRow label="Magnet (snap to price)" on={magnet} onClick={() => setMagnet((v) => !v)} />
          <ToggleRow label="Lock drawings" on={locked} onClick={() => setLocked((v) => !v)} />
          <div className="mt-4 pt-4 border-t border-white/6">
            <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] uppercase text-white/45 mb-3">
              <Keyboard className="w-3.5 h-3.5" /> Shortcuts
            </div>
            <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-white/55">
              <span>1 – 6</span><span className="text-right text-white/80">Timeframe</span>
              <span>Esc</span><span className="text-right text-white/80">Close dialog</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ToggleRow({ label, on, onClick }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-[13px] text-white/75">{label}</span>
      <button onClick={onClick} className={`relative w-11 h-6 rounded-full transition-colors ${on ? "bg-tradeTeal" : "bg-white/12"}`}>
        <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform" style={{ transform: on ? "translateX(20px)" : "none" }} />
      </button>
    </div>
  );
}

/* ===== Order panel ===== */
function OrderPanel({ active, side, setSide, marginMode, setMarginMode, leverage, setLeverage }) {
  const dca = [
    { lvl: "Entry", mult: "×1" },
    { lvl: "Avg 1", mult: "×1.5" },
    { lvl: "Avg 2", mult: "×2" },
    { lvl: "Avg 3", mult: "×3" },
  ];
  return (
    <div className="tc-panel flex flex-col gap-4">
      <div className="tc-segment">
        <div className={`tc-segment-btn ${side === "buy" ? "is-active" : ""}`} style={{ padding: "9px 0" }} onClick={() => setSide("buy")}>Long</div>
        <div className="tc-segment-btn" style={side === "sell" ? { padding: "9px 0", color: "#042024", background: "linear-gradient(135deg,#FF9B91,#F23645)" } : { padding: "9px 0" }} onClick={() => setSide("sell")}>Short</div>
      </div>

      <div className="flex items-center gap-1.5 p-1 rounded-lg bg-white/[0.025] border border-white/8">
        {["percent", "usd"].map((m) => (
          <button key={m} onClick={() => setMarginMode(m)}
            className={`flex-1 py-1.5 rounded-md font-mono text-[10px] tracking-[0.1em] uppercase transition-colors ${marginMode === m ? "bg-tradeTeal/15 text-tradeTeal" : "text-white/50"}`}>
            {m === "percent" ? "% Balance" : "USD"}
          </button>
        ))}
      </div>

      <Field label="Order Type" value="Market" />
      <Field label="Price" value={active.last} mono />
      <Field label={marginMode === "percent" ? "Size (% balance)" : "Amount (USDT)"} value={marginMode === "percent" ? "10%" : "0.00"} mono />

      <div>
        <div className="flex justify-between font-mono text-[10px] tracking-[0.1em] uppercase text-white/45 mb-2">
          <span>Leverage</span><span className="text-tradeTeal">{leverage}×</span>
        </div>
        <div className="flex items-center gap-1">
          {LEVERAGE.map((l) => (
            <button key={l} onClick={() => setLeverage(l)}
              className={`flex-1 py-1 rounded font-mono text-[10px] transition-colors ${leverage === l ? "bg-tradeTeal/20 text-tradeTeal" : "text-white/45 hover:text-white/75"}`}>{l}</button>
          ))}
        </div>
      </div>

      <div>
        <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-white/45 mb-2">DCA / Averaging</div>
        <div className="grid grid-cols-4 gap-1.5">
          {dca.map((d) => (
            <div key={d.lvl} className="p-2 rounded-lg bg-white/[0.02] border border-white/5 text-center">
              <div className="font-mono text-[8.5px] tracking-[0.08em] uppercase text-white/40">{d.lvl}</div>
              <div className="font-mono text-[12px] text-tradeTeal mt-0.5">{d.mult}</div>
            </div>
          ))}
        </div>
      </div>

      <button className={`tc-btn w-full ${side === "buy" ? "tc-btn-primary" : ""}`}
        style={side === "sell" ? { color: "#042024", background: "linear-gradient(135deg,#FF9B91,#F23645)" } : undefined}
        data-testid="order-submit">
        {side === "buy" ? "Buy / Long" : "Sell / Short"} {active.sym}
      </button>

      <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-white/50">
        <span>Avail.</span><span className="text-right text-white/80">$0.00</span>
        <span>Cost</span><span className="text-right text-white/80">$0.00</span>
        <span>Fees</span><span className="text-right text-white/80">0.04%</span>
      </div>
    </div>
  );
}

/* ===== Signals rail ===== */
function SignalsRail() {
  const [mkt, setMkt] = useState("All");
  const markets = ["All", "Crypto"];
  return (
    <div className="tc-panel flex flex-col gap-3">
      <div className="flex gap-1.5">
        {markets.map((m) => (
          <button key={m} onClick={() => setMkt(m)}
            className={`px-3 py-1.5 rounded-full font-mono text-[9.5px] tracking-[0.1em] uppercase border transition-colors ${mkt === m ? "bg-tradeTeal/15 text-tradeTeal border-tradeTeal/30" : "text-white/50 border-white/8"}`}>{m}</button>
        ))}
      </div>
      <div className="flex flex-col gap-2 max-h-[460px] overflow-y-auto">
        {SIGNALS.map((s, i) => (
          <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/6">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-white/90">{s.sym}</span>
              <span className={s.dir === "LONG" ? "tc-tag-long" : "tc-tag-short"}>{s.dir}</span>
            </div>
            <div className="font-mono text-[10px] text-white/45 mt-1">{s.strat} · {s.tf}</div>
            <div className="grid grid-cols-3 gap-1 mt-2 font-mono text-[10.5px]">
              <span className="text-white/55">@ {s.price}</span>
              <span className="text-tradeTeal text-center">T {s.target}</span>
              <span className="text-[#FF8A82] text-right">S {s.stop}</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="flex-1 h-1 rounded-full bg-white/8 overflow-hidden"><span className="block h-full bg-tradeTeal" style={{ width: `${s.conf}%` }} /></span>
              <span className="font-mono text-[9.5px] text-white/50">{s.conf}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== AI rail ===== */
function AIRail({ ai, setAi }) {
  return (
    <div className="tc-panel flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-tradeTeal" strokeWidth={2} />
        <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/55">AI Analysis Layers</span>
      </div>
      {[
        { k: "sr", label: "Support / Resistance", desc: "Swing-based zones plotted on the chart." },
        { k: "pivots", label: "Pivot Points", desc: "Classic P / S1–S2 / R1–R2 levels." },
        { k: "channel", label: "Trend Channel", desc: "Linear-regression channel with ±2σ bands." },
        { k: "breaks", label: "Breaks & Retests", desc: "Most recent broken level + retest zone." },
      ].map((o) => (
        <button key={o.k} onClick={() => setAi((a) => ({ ...a, [o.k]: !a[o.k] }))}
          className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-colors ${ai[o.k] ? "bg-tradeTeal/8 border-tradeTeal/30" : "bg-white/[0.02] border-white/6"}`}
          data-testid={`ai-${o.k}`}>
          <span className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 ${ai[o.k] ? "bg-tradeTeal text-[#042024]" : "border border-white/15"}`}>
            {ai[o.k] && <Check className="w-3 h-3" strokeWidth={3} />}
          </span>
          <span>
            <span className="block text-[12.5px] font-medium text-white/85">{o.label}</span>
            <span className="block text-[11px] text-white/45 mt-0.5">{o.desc}</span>
          </span>
        </button>
      ))}
      <p className="text-[11px] text-white/40 leading-[1.5] mt-1">
        Layers compute client-side from the loaded candles and redraw on each symbol or timeframe change.
      </p>
    </div>
  );
}

/* ===== Symbol search modal ===== */
function SymbolSearch({ onClose, onPick }) {
  const [q, setQ] = useState("");
  const results = WATCHLIST.filter((w) => w.sym.includes(q.trim().toUpperCase()));
  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center pt-[12vh] px-4" data-testid="symbol-search-modal">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-[440px] rounded-2xl bg-surface border border-white/8 overflow-hidden">
        <div className="tc-search !rounded-none !border-0 border-b border-white/8 px-4 py-3.5">
          <Search className="w-4 h-4 text-white/40" strokeWidth={2} />
          <input autoFocus placeholder="Search symbol…" value={q} onChange={(e) => setQ(e.target.value)} />
          <button onClick={onClose} className="tc-iconbtn" style={{ width: 28, height: 28 }}><X className="w-3.5 h-3.5" /></button>
        </div>
        <div className="max-h-[340px] overflow-y-auto p-1.5">
          {results.map((w) => (
            <button key={w.sym} onClick={() => onPick(w.sym)} className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white/[0.04] transition-colors text-left">
              <span className="text-[13px] font-medium text-white/85">{w.sym}</span>
              <span className={`font-mono text-[11px] ${w.up ? "text-tradeTeal" : "text-[#FF8A82]"}`}>{w.chg}</span>
            </button>
          ))}
          {results.length === 0 && <div className="text-center text-white/40 py-8 text-[13px]">No markets found.</div>}
        </div>
      </div>
    </div>
  );
}

/* ===== Small shared bits ===== */
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
      <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-white/45 mb-2">{label}</div>
      <div className={`px-3 py-2.5 rounded-lg bg-white/[0.025] border border-white/8 text-[13px] text-white/85 ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}

function Dropdown({ label, icon: Icon, badge, testid, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)} onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] text-white/70 hover:text-white hover:bg-white/[0.04] transition-colors"
        data-testid={testid}>
        {Icon && <Icon className="w-3.5 h-3.5" strokeWidth={2} />}
        {label}
        {badge != null && <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-full bg-tradeTeal/15 text-tradeTeal">{badge}</span>}
        <ChevronDown className="w-3 h-3 opacity-60" />
      </button>
      {open && (
        <div className="absolute left-0 mt-1.5 w-56 p-1.5 rounded-xl bg-surface border border-white/8 shadow-xl z-50 max-h-[320px] overflow-y-auto">
          {children}
        </div>
      )}
    </div>
  );
}
function MenuLabel({ children }) {
  return <div className="px-2.5 py-1.5 font-mono text-[9px] tracking-[0.16em] uppercase text-white/35">{children}</div>;
}
function MenuItem({ checked, onClick, children }) {
  return (
    <button onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left hover:bg-white/[0.04] transition-colors">
      <span className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${checked ? "bg-tradeTeal text-[#042024]" : "border border-white/15"}`}>
        {checked && <Check className="w-3 h-3" strokeWidth={3} />}
      </span>
      <span className="flex-1 text-[12.5px] text-white/80">{children}</span>
    </button>
  );
}
