import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  TrendingUp, TrendingDown, Search, Minus, X, ChevronDown, Check,
  CandlestickChart, LineChart as LineIcon, AreaChart as AreaIcon, BarChart3,
  Brain, Sparkles, MousePointer2, MoveUpRight, Type, Square, Magnet, Lock, Eraser, Ruler,
  Settings2, Keyboard, Star, Plug, Pencil, Share2, Wallet, Loader2,
} from "lucide-react";
import TradingChart from "../components/TradingChart";
import Modal from "../components/Modal";
import TradeAccountModal from "../components/TradeAccountModal";
import SharePnlModal from "../components/SharePnlModal";
import { useWallet } from "../WalletContext";
import { useNotifications } from "../NotificationContext";
import { shortAddr } from "../lib/web3";
import { placeOrder, venueFor } from "../lib/orders";
import { BrandLogo } from "../lib/brandLogos";
import { WATCHLIST, OPEN_POSITIONS, TIMEFRAMES, SIGNALS, EXCHANGES, TRADE_ACCOUNT } from "../data";
import { OVERLAYS, OSCILLATORS } from "../lib/indicators";

const CATEGORIES = ["Favorites", "Spot", "Futures", "Stocks"];

const CHART_TYPES = [
  { key: "candles", icon: CandlestickChart, label: "Candles" },
  { key: "bars", icon: BarChart3, label: "Bars" },
  { key: "line", icon: LineIcon, label: "Line" },
  { key: "area", icon: AreaIcon, label: "Area" },
];

const DRAW_TOOLS = [
  { key: null, icon: MousePointer2, label: "Cursor" },
  { key: "brush", icon: Pencil, label: "Freehand" },
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
  const [ai, setAi] = useState({ sr: false, pivots: false, channel: false, breaks: false, tsr: false, trendFinder: false, insideBB: false });
  const [drawTool, setDrawTool] = useState(null);
  const [magnet, setMagnet] = useState(false);
  const [locked, setLocked] = useState(false);
  const [rightTab, setRightTab] = useState("signals");
  const [side, setSide] = useState("buy");
  const [marginMode, setMarginMode] = useState("percent");
  const [leverage, setLeverage] = useState(10);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [logScale, setLogScale] = useState(false);
  const [exchange, setExchange] = useState(EXCHANGES[2]); // BitGet
  const [exchOpen, setExchOpen] = useState(false);
  const [category, setCategory] = useState("Spot");
  const [favorites, setFavorites] = useState(() => ["BTCUSDT", "ETHUSDT", "SOLUSDT"]);

  const [positions, setPositions] = useState(OPEN_POSITIONS);
  const [activeSignal, setActiveSignal] = useState(null);
  const [openTabs, setOpenTabs] = useState(["BTCUSDT", "ETHUSDT", "SOLUSDT"]);
  const [accountOpen, setAccountOpen] = useState(false);
  const [accountMode, setAccountMode] = useState("api");
  const [sharePnl, setSharePnl] = useState(null);
  const [orderSheet, setOrderSheet] = useState(false); // mobile/tablet order ticket
  const openSheet = (s) => { setSide(s); setOrderSheet(true); };

  const toggleFav = (sym) =>
    setFavorites((prev) => (prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]));

  const addTab = (sym) => setOpenTabs((t) => (t.includes(sym) ? t : [...t, sym]));
  const closeTab = (sym) => setOpenTabs((t) => {
    const next = t.filter((s) => s !== sym);
    if (sym === symbol && next.length) setSymbol(next[next.length - 1]);
    return next.length ? next : t;
  });
  const pickSymbol = (sym) => { setSymbol(sym); setActiveSignal(null); addTab(sym); };

  // Click a signal -> AI auto-charts it: switch symbol/timeframe, enable AI
  // layers, and plot entry / TP / SL on the chart.
  const num = (v) => parseFloat(String(v).replace(/,/g, ""));
  const mapTf = (t) => {
    const u = String(t).toUpperCase();
    return { "1M": "1m", "5M": "5m", "15M": "15m", "30M": "15m", "1H": "1H", "4H": "4H", "1D": "1D" }[u] || tf;
  };
  const chartSignal = (s) => {
    setSymbol(s.sym);
    addTab(s.sym);
    setTf(mapTf(s.tf));
    setRightTab("signals");
    setSide(s.dir === "LONG" ? "buy" : "sell");
    setAi((a) => ({ ...a, sr: true, pivots: true }));
    setActiveSignal({ sym: s.sym, dir: s.dir, entry: num(s.price), target: num(s.target), stop: num(s.stop) });
  };

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
  const list = useMemo(() => {
    const q = query.trim().toUpperCase();
    return WATCHLIST.filter((w) => {
      const inCat = category === "Favorites" ? favorites.includes(w.sym) : w.cat === category;
      if (!inCat) return false;
      if (!q) return true;
      return w.sym.includes(q) || w.name.toUpperCase().includes(q);
    });
  }, [query, category, favorites]);

  const toggleOverlay = (k, defaults) =>
    setOverlays((prev) => {
      const next = { ...prev };
      if (next[k]) delete next[k];
      else next[k] = { ...defaults };
      return next;
    });

  const activeIndicatorCount = Object.keys(overlays).length + (oscillator ? 1 : 0);

  return (
    <div className="tc-fade flex flex-col gap-4 pb-20 xl:pb-0">

      {/* Symbol header */}
      <div className="tc-panel flex flex-wrap items-center gap-x-8 gap-y-3 !py-3.5">
        <button className="flex items-center gap-2.5 hover:opacity-80" onClick={() => setSearchOpen(true)} data-testid="open-symbol-search">
          <span className="text-left">
            <span className="flex items-center gap-2">
              <span className="font-heading text-[19px] font-semibold tracking-[-0.02em] text-tradeWhite">{active.sym}</span>
              <ChevronDown className="w-4 h-4 text-white/40" />
            </span>
            <span className="block font-mono text-[10px] tracking-[0.06em] text-white/40 mt-0.5">{active.name} · {exchange.name} · {active.cat}</span>
          </span>
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

      <div className="grid grid-cols-1 xl:grid-cols-[260px_1fr_320px] gap-3 xl:gap-4 xl:h-[760px]">
        {/* Watchlist */}
        <div className="tc-panel !p-3 order-2 xl:order-1 xl:h-full xl:flex xl:flex-col xl:min-h-0">
          {/* Exchange selector */}
          <div className="relative mb-2.5">
            <button
              onClick={() => setExchOpen((v) => !v)}
              onBlur={() => setTimeout(() => setExchOpen(false), 150)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05] hover:border-tradeTeal/30 transition-colors"
              data-testid="exchange-selector"
            >
              <span className="flex items-center gap-2 min-w-0">
                <BrandLogo id={exchange.key} size={24} />
                <span className="flex flex-col items-start min-w-0">
                  <span className="font-mono text-[8px] tracking-[0.12em] uppercase text-white/40 leading-none">Exchange</span>
                  <span className="text-[12.5px] font-semibold text-tradeWhite truncate">{exchange.name}</span>
                </span>
              </span>
              <span className="flex items-center gap-1.5 shrink-0">
                <span className="font-mono text-[10px] text-tradeTeal">{exchange.count}</span>
                <ChevronDown className="w-3.5 h-3.5 text-white/40" strokeWidth={2} />
              </span>
            </button>
            {exchOpen && (
              <div className="absolute left-0 right-0 mt-1.5 p-1.5 rounded-xl bg-surface border border-white/[0.05] shadow-xl z-50">
                {EXCHANGES.map((ex) => (
                  <button
                    key={ex.key}
                    onMouseDown={(e) => { e.preventDefault(); setExchange(ex); setExchOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors ${ex.key === exchange.key ? "bg-tradeTeal/10" : "hover:bg-white/[0.04]"}`}
                    data-testid={`exch-${ex.key}`}
                  >
                    <BrandLogo id={ex.key} size={22} />
                    <span className="flex-1 text-[12.5px] text-white/85">{ex.name}</span>
                    <span className="font-mono text-[10px] text-white/40">{ex.count}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Category tabs */}
          <div className="flex items-center gap-1 mb-2.5">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`flex-1 py-1.5 rounded-md font-mono text-[9.5px] tracking-[0.06em] uppercase transition-colors ${category === c ? "bg-tradeTeal/15 text-tradeTeal" : "text-white/45 hover:text-white/80"}`}
                data-testid={`cat-${c.toLowerCase()}`}
              >
                {c === "Favorites" ? <Star className="w-3 h-3 inline" strokeWidth={2} /> : c}
              </button>
            ))}
          </div>

          <div className="tc-search mb-2.5">
            <Search className="w-4 h-4 text-white/35" strokeWidth={2} />
            <input placeholder="Search symbol or name…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>

          <div className="flex flex-col gap-0.5 max-h-[520px] xl:max-h-none xl:flex-1 xl:min-h-0 overflow-y-auto">
            {list.map((w) => {
              const fav = favorites.includes(w.sym);
              return (
                <div
                  key={w.sym}
                  onClick={() => pickSymbol(w.sym)}
                  className={`group flex items-center gap-2 px-2.5 py-2 rounded-lg text-left cursor-pointer transition-colors ${
                    w.sym === symbol ? "bg-tradeTeal/10" : "hover:bg-white/[0.03]"
                  }`}
                  data-testid={`watch-${w.sym}`}
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFav(w.sym); }}
                    className="shrink-0"
                    aria-label={fav ? "Remove favorite" : "Add favorite"}
                  >
                    <Star className={`w-3.5 h-3.5 transition-colors ${fav ? "text-tradeTeal fill-tradeTeal" : "text-white/25 group-hover:text-white/45"}`} strokeWidth={2} />
                  </button>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12.5px] font-medium text-white/85 truncate">{w.sym}</span>
                    <span className="block text-[10px] text-white/40 truncate">{w.name}</span>
                  </span>
                  <span className="text-right shrink-0">
                    <span className="block font-mono text-[11.5px] text-white/75">{w.last}</span>
                    <span className={`block font-mono text-[10px] ${w.up ? "text-tradeTeal" : "text-[#FF8A82]"}`}>{w.chg}</span>
                  </span>
                </div>
              );
            })}
            {list.length === 0 && (
              <div className="text-center text-white/35 text-[12px] py-8">No instruments in {category}.</div>
            )}
          </div>
        </div>

        {/* Chart + toolbar + drawing rail */}
        <div className="tc-panel !p-0 overflow-hidden order-1 xl:order-2 flex flex-col h-[calc(100dvh-313px)] min-h-[320px] xl:h-full xl:min-h-0">
          {/* Toolbar */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.04] flex-wrap shrink-0">
            <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-white/[0.025]">
              {CHART_TYPES.map((c) => {
                const Ic = c.icon;
                return (
                  <button key={c.key} onClick={() => setChartType(c.key)} title={c.label}
                    className={`flex items-center justify-center rounded-md transition-colors ${chartType === c.key ? "bg-tradeTeal/15 text-tradeTeal" : "text-white/45 hover:text-white/80"}`}
                    style={{ width: 30, height: 30 }} data-testid={`charttype-${c.key}`}>
                    <Ic className="w-3.5 h-3.5" strokeWidth={2} />
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-white/[0.025]">
              {TIMEFRAMES.map((t) => (
                <button key={t} onClick={() => setTf(t)}
                  className={`px-2.5 py-1.5 rounded-md font-mono text-[11px] transition-colors ${t === tf ? "bg-tradeTeal/15 text-tradeTeal" : "text-white/45 hover:text-white/80"}`}
                  data-testid={`tf-${t}`}>{t}</button>
              ))}
            </div>
            {/* Filter / chart settings — sits where Indicators used to be */}
            <button className="tc-iconbtn shrink-0" style={{ width: 32, height: 32 }} onClick={() => setSettingsOpen(true)} title="Chart settings & filters" data-testid="chart-settings">
              <Settings2 className="w-3.5 h-3.5" strokeWidth={2} />
            </button>

            {/* Right cluster: AI quick toggles (desktop) + Indicators + AI */}
            <div className="ml-auto flex items-center gap-2 shrink-0">
              <div className="hidden lg:flex items-center gap-1">
                {[["Pivot P.", "pivots"], ["TSR", "tsr"], ["B&R", "breaks"], ["Trend F.", "trendFinder"]].map(([lbl, key]) => (
                  <button key={key} onClick={() => setAi((a) => ({ ...a, [key]: !a[key] }))}
                    className={`px-2 py-1.5 rounded-md font-mono text-[10px] tracking-[0.04em] transition-colors ${ai[key] ? "bg-tradeTeal/15 text-tradeTeal" : "text-white/45 hover:text-white/80"}`}
                    data-testid={`ai-quick-${key}`}>{lbl}</button>
                ))}
                <span className="w-px h-5 bg-white/[0.06] mx-1" />
              </div>
              <Dropdown label="Indicators" align="right" badge={activeIndicatorCount || null} testid="menu-indicators">
                <MenuLabel>Overlays</MenuLabel>
                {OVERLAYS.map((o) => (
                  <MenuItem key={o.key} checked={!!overlays[o.key]} onClick={() => toggleOverlay(o.key, o.defaults)}>{o.label}</MenuItem>
                ))}
                <MenuLabel>Oscillators</MenuLabel>
                {OSCILLATORS.map((o) => (
                  <MenuItem key={o.key} checked={oscillator === o.key} onClick={() => setOscillator(oscillator === o.key ? null : o.key)}>{o.label}</MenuItem>
                ))}
              </Dropdown>
              <Dropdown label="AI" icon={Brain} align="right" testid="menu-ai">
                <MenuItem checked={ai.sr} onClick={() => setAi((a) => ({ ...a, sr: !a.sr }))}>Support / Resistance</MenuItem>
                <MenuItem checked={ai.pivots} onClick={() => setAi((a) => ({ ...a, pivots: !a.pivots }))}>Pivot Points</MenuItem>
                <MenuItem checked={ai.tsr} onClick={() => setAi((a) => ({ ...a, tsr: !a.tsr }))}>TSR Analysis</MenuItem>
                <MenuItem checked={ai.channel} onClick={() => setAi((a) => ({ ...a, channel: !a.channel }))}>Trend Channel</MenuItem>
                <MenuItem checked={ai.trendFinder} onClick={() => setAi((a) => ({ ...a, trendFinder: !a.trendFinder }))}>Trend Finder</MenuItem>
                <MenuItem checked={ai.breaks} onClick={() => setAi((a) => ({ ...a, breaks: !a.breaks }))}>Breaks &amp; Retests</MenuItem>
                <MenuItem checked={ai.insideBB} onClick={() => setAi((a) => ({ ...a, insideBB: !a.insideBB }))}>Inside-Bar BB</MenuItem>
              </Dropdown>
            </div>
          </div>

          {/* Chart area with drawing rail */}
          <div className="flex flex-1 min-h-0">
            <div className="hidden sm:flex flex-col items-center gap-0.5 py-2 px-1.5 border-r border-white/[0.04]">
              {DRAW_TOOLS.map((d) => {
                const Ic = d.icon;
                const isActive = drawTool === d.key;
                return (
                  <button key={d.label} onClick={() => setDrawTool(d.key)} title={d.label}
                    className={`flex items-center justify-center rounded-md transition-colors ${isActive ? "bg-tradeTeal/15 text-tradeTeal" : "text-white/40 hover:text-white/85 hover:bg-white/[0.04]"}`}
                    style={{ width: 30, height: 30 }} data-testid={`draw-${d.label.replace(/\s+/g, "-").toLowerCase()}`}>
                    <Ic className="w-3.5 h-3.5" strokeWidth={2} />
                  </button>
                );
              })}
              <span className="w-5 h-px bg-white/[0.06] my-1" />
              <button onClick={() => setMagnet((v) => !v)} title="Magnet"
                className={`flex items-center justify-center rounded-md transition-colors ${magnet ? "bg-tradeTeal/15 text-tradeTeal" : "text-white/40 hover:text-white/85 hover:bg-white/[0.04]"}`} style={{ width: 30, height: 30 }}>
                <Magnet className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
              <button onClick={() => setLocked((v) => !v)} title="Lock"
                className={`flex items-center justify-center rounded-md transition-colors ${locked ? "bg-tradeTeal/15 text-tradeTeal" : "text-white/40 hover:text-white/85 hover:bg-white/[0.04]"}`} style={{ width: 30, height: 30 }}>
                <Lock className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
              <button onClick={() => setDrawTool("eraser")} title="Eraser"
                className={`flex items-center justify-center rounded-md transition-colors ${drawTool === "eraser" ? "bg-[#F23645]/15 text-[#FF8A82]" : "text-white/40 hover:text-white/85 hover:bg-white/[0.04]"}`} style={{ width: 30, height: 30 }}>
                <Eraser className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
            </div>
            <div className="flex-1 min-w-0 min-h-0">
              <TradingChart symbol={symbol} timeframe={tf} chartType={chartType} overlays={overlays} oscillator={oscillator} ai={ai} drawTool={locked ? null : drawTool} logScale={logScale} signal={activeSignal && activeSignal.sym === symbol ? activeSignal : null} />
            </div>
          </div>
        </div>

        {/* Right rail */}
        <div className="order-3 flex flex-col gap-3 xl:h-full xl:min-h-0">
          {/* Always-on order ticket (desktop) — trade without leaving the signals feed */}
          <div className="hidden xl:block xl:shrink-0">
            <OrderPanel
              active={active} side={side} setSide={setSide}
              marginMode={marginMode} setMarginMode={setMarginMode}
              leverage={leverage} setLeverage={setLeverage} compact
              signal={activeSignal && activeSignal.sym === symbol ? activeSignal : null}
              onConnectWallet={() => { setAccountMode("web3"); setAccountOpen(true); }}
            />
          </div>

          {/* Context tabs: research while the ticket stays put */}
          <div className="tc-segment xl:shrink-0">
            {["signals", "ai", "connect"].map((t) => (
              <div key={t} className={`tc-segment-btn ${rightTab === t ? "is-active" : ""}`} style={{ padding: "8px 0", fontSize: 11 }} onClick={() => setRightTab(t)} data-testid={`righttab-${t}`}>
                {t === "ai" ? "AI" : t.charAt(0).toUpperCase() + t.slice(1)}
              </div>
            ))}
          </div>

          <div className="xl:flex-1 xl:min-h-0 xl:overflow-y-auto">
            {rightTab === "signals" && <SignalsRail onPick={chartSignal} activeSym={activeSignal?.sym} />}
            {rightTab === "connect" && <ConnectPanel onManage={() => { setAccountMode("exchange"); setAccountOpen(true); }} onConnectWallet={() => { setAccountMode("web3"); setAccountOpen(true); }} />}
            {rightTab === "ai" && <AIRail ai={ai} setAi={setAi} symbol={symbol} timeframe={tf} />}
          </div>
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
            <button key={i} onClick={() => chartSignal(s)} className="shrink-0 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.045] hover:border-tradeTeal/30 transition-colors text-left">
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
          <span className="tc-chip tc-chip-active"><span className="tc-chip-dot" /> {positions.length} Open</span>
        </div>
        <div className="tc-table-wrap">
          <table className="tc-table">
            <thead><tr><th>Symbol</th><th>Side</th><th>Size</th><th>Entry</th><th>Mark</th><th>PnL</th><th></th></tr></thead>
            <tbody>
              {positions.map((p, i) => (
                <tr key={p.sym} data-testid={`pos-${i}`}>
                  <td className="sym">{p.sym}</td>
                  <td><span className={p.side === "LONG" ? "tc-tag-long" : "tc-tag-short"}>{p.side === "LONG" ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />} {p.side}</span></td>
                  <td className="mono">{p.size}</td>
                  <td className="mono">{p.entry}</td>
                  <td className="mono">{p.mark}</td>
                  <td><span className="tc-pl-pos">{p.pnl} · {p.pct}</span></td>
                  <td className="text-right">
                    <span className="inline-flex gap-1.5">
                      <button className="tc-iconbtn" style={{ width: 30, height: 30 }} aria-label="Share PnL" data-testid={`share-pos-${i}`}
                        onClick={() => setSharePnl({ source: "manual", sym: p.sym, dir: p.side, entry: p.entry, exit: p.mark, pnl: p.pct, pnlAmount: p.pnl, leverage: 10 })}>
                        <Share2 className="w-3.5 h-3.5" strokeWidth={2} />
                      </button>
                      <button className="tc-iconbtn" style={{ width: 30, height: 30 }} aria-label="Close position" onClick={() => setPositions((ps) => ps.filter((x) => x.sym !== p.sym))}><X className="w-3.5 h-3.5" strokeWidth={2} /></button>
                    </span>
                  </td>
                </tr>
              ))}
              {positions.length === 0 && (
                <tr><td colSpan={7} className="text-center text-white/35 py-6">No open positions.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {searchOpen && <SymbolSearch exchange={exchange} onClose={() => setSearchOpen(false)} onPick={(s) => { pickSymbol(s); setSearchOpen(false); }} />}
      {accountOpen && <TradeAccountModal initialMode={accountMode} onClose={() => setAccountOpen(false)} />}
      {sharePnl && <SharePnlModal data={sharePnl} onClose={() => setSharePnl(null)} />}
      {settingsOpen && (
        <Modal title="Terminal settings" sub="Chart preferences" onClose={() => setSettingsOpen(false)}
          footer={<button className="tc-btn tc-btn-primary flex-1" onClick={() => setSettingsOpen(false)}>Done</button>}>
          <ToggleRow label="Logarithmic price scale" on={logScale} onClick={() => setLogScale((v) => !v)} />
          <ToggleRow label="Magnet (snap to price)" on={magnet} onClick={() => setMagnet((v) => !v)} />
          <ToggleRow label="Lock drawings" on={locked} onClick={() => setLocked((v) => !v)} />
          <div className="mt-4 pt-4 border-t border-white/[0.045]">
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

      {/* Fixed Long/Short bar — mobile & tablet (portaled so it pins to the viewport) */}
      {createPortal(
        <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center gap-2 px-3 py-2.5 border-t border-white/[0.06]"
          style={{ background: "rgb(var(--tc-surface-rgb) / 0.96)", backdropFilter: "blur(10px)", paddingBottom: "max(10px, env(safe-area-inset-bottom))" }}>
          <div className="shrink-0 pr-1">
            <div className="font-mono text-[10px] text-white/45 leading-none">{active.sym}</div>
            <div className={`font-mono text-[13px] font-semibold ${active.up ? "text-tradeTeal" : "text-[#FF8A82]"}`}>{active.last}</div>
          </div>
          <button onClick={() => openSheet("buy")} className="tc-btn tc-btn-primary flex-1" data-testid="bar-long">Long</button>
          <button onClick={() => openSheet("sell")} className="tc-btn flex-1" style={{ color: "#042024", background: "linear-gradient(135deg,#FF9B91,#F23645)" }} data-testid="bar-short">Short</button>
        </div>,
        document.body
      )}

      {/* Order ticket bottom sheet */}
      {orderSheet && createPortal(
        <div className="fixed inset-0 z-[85] flex items-end justify-center" data-testid="order-sheet">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOrderSheet(false)} />
          <div className="relative w-full max-w-[440px] max-h-[88vh] overflow-y-auto rounded-t-2xl bg-surface border-t border-x border-white/[0.06] p-4" style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="font-heading text-[15px] font-semibold text-tradeWhite">{active.sym}</span>
                <span className={`font-mono text-[11px] ${active.up ? "text-tradeTeal" : "text-[#FF8A82]"}`}>{active.last}</span>
              </div>
              <button className="tc-iconbtn" style={{ width: 30, height: 30 }} onClick={() => setOrderSheet(false)}><X className="w-3.5 h-3.5" /></button>
            </div>
            <OrderPanel
              active={active} side={side} setSide={setSide}
              marginMode={marginMode} setMarginMode={setMarginMode}
              leverage={leverage} setLeverage={setLeverage} bare
              signal={activeSignal && activeSignal.sym === symbol ? activeSignal : null}
              onConnectWallet={() => { setOrderSheet(false); setAccountMode("web3"); setAccountOpen(true); }}
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

function ToggleRow({ label, on, onClick }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-[13px] text-white/75">{label}</span>
      <button onClick={onClick} className={`tc-switch ${on ? "is-on" : ""}`} role="switch" aria-checked={on}>
        <span className="tc-switch-knob" />
      </button>
    </div>
  );
}

/* ===== Order panel ===== */
function OrderPanel({ active, side, setSide, marginMode, setMarginMode, leverage, setLeverage, onConnectWallet, bare, compact, signal }) {
  const wallet = useWallet() || {};
  const { notify } = useNotifications();
  const { address, balance, network, nativeSymbol } = wallet;
  const venueObj = venueFor(network);
  const [venue, setVenue] = useState("cex"); // cex | onchain
  const [placed, setPlaced] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | signing | done | error | rejected
  const [sig, setSig] = useState("");

  const submit = () => {
    setPlaced(true);
    notify({ type: "trade", title: `${side === "buy" ? "Long" : "Short"} order submitted · ${active.sym}`, body: `Market order · ${leverage}× · @ ${active.last}` });
    setTimeout(() => setPlaced(false), 2400);
  };

  // One unified router for every chain.
  const submitOnchain = async () => {
    if (!address) { onConnectWallet?.(); return; }
    setStatus("signing"); setSig("");
    const res = await placeOrder(wallet, { symbol: active.sym, side, leverage, sizeUsd: 1000 });
    if (res.ok) {
      setSig(res.signature ? `${res.signature.slice(0, 10)}…${res.signature.slice(-6)}` : "0xsigned");
      setStatus("done");
      notify({ type: "trade", title: `${side === "buy" ? "Long" : "Short"} routed to ${venueObj.name}`, body: `${active.sym} · ${leverage}× · signed on ${network?.short || "chain"}` });
      setTimeout(() => setStatus("idle"), 5000);
    } else {
      setStatus(res.error === "REJECTED" ? "rejected" : "error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const dca = [
    { lvl: "Entry", mult: "×1" },
    { lvl: "Avg 1", mult: "×1.5" },
    { lvl: "Avg 2", mult: "×2" },
    { lvl: "Avg 3", mult: "×3" },
  ];
  const onchain = venue === "onchain";

  return (
    <div className={`flex flex-col gap-4 ${bare ? "" : "tc-panel"}`}>
      {/* Venue */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-white/[0.025] border border-white/[0.05]">
        {[["cex", "CEX"], ["onchain", "On-chain"]].map(([v, lbl]) => (
          <button key={v} onClick={() => setVenue(v)}
            className={`flex-1 py-1.5 rounded-md font-mono text-[10px] tracking-[0.08em] uppercase transition-colors flex items-center justify-center gap-1.5 ${venue === v ? "bg-tradeTeal/15 text-tradeTeal" : "text-white/50"}`}
            data-testid={`venue-${v}`}>
            {v === "onchain" && <Wallet className="w-3 h-3" strokeWidth={2} />}{lbl}
          </button>
        ))}
      </div>

      {onchain && (
        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.045] text-[11px]">
          {address ? (
            <>
              <span className="text-white/65">{network?.short || "Unknown"} · {shortAddr(address)}</span>
              <span className="font-mono text-tradeTeal">{balance ?? "…"} {nativeSymbol}</span>
            </>
          ) : (
            <span className="text-white/50">Wallet not connected</span>
          )}
        </div>
      )}

      {signal && (
        <button onClick={() => setSide(signal.dir === "LONG" ? "buy" : "sell")}
          className="flex flex-col gap-1.5 px-3 py-2.5 rounded-lg bg-tradeTeal/[0.08] border border-tradeTeal/25 text-left transition-colors hover:bg-tradeTeal/[0.12]"
          data-testid="order-signal-banner">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-tradeTeal" strokeWidth={2} />
            <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-tradeTeal">AI signal</span>
            <span className={signal.dir === "LONG" ? "tc-tag-long" : "tc-tag-short"} style={{ fontSize: 9, padding: "1px 6px" }}>{signal.dir}</span>
            <span className="ml-auto font-mono text-[10px] text-white/40">tap to load</span>
          </span>
          <span className="grid grid-cols-3 gap-1 font-mono text-[10.5px]">
            <span className="text-white/60">@ {Number(signal.entry).toLocaleString()}</span>
            <span className="text-tradeTeal text-center">T {Number(signal.target).toLocaleString()}</span>
            <span className="text-[#FF8A82] text-right">S {Number(signal.stop).toLocaleString()}</span>
          </span>
        </button>
      )}

      <div className="tc-segment">
        <div className={`tc-segment-btn ${side === "buy" ? "is-active" : ""}`} style={{ padding: "9px 0" }} onClick={() => setSide("buy")}>Long</div>
        <div className="tc-segment-btn" style={side === "sell" ? { padding: "9px 0", color: "#042024", background: "linear-gradient(135deg,#FF9B91,#F23645)" } : { padding: "9px 0" }} onClick={() => setSide("sell")}>Short</div>
      </div>

      <div className="flex items-center gap-1.5 p-1 rounded-lg bg-white/[0.025] border border-white/[0.05]">
        {["percent", "usd"].map((m) => (
          <button key={m} onClick={() => setMarginMode(m)}
            className={`flex-1 py-1.5 rounded-md font-mono text-[10px] tracking-[0.1em] uppercase transition-colors ${marginMode === m ? "bg-tradeTeal/15 text-tradeTeal" : "text-white/50"}`}>
            {m === "percent" ? "% Balance" : "USD"}
          </button>
        ))}
      </div>

      {!compact && <Field label="Order Type" value="Market" />}
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

      {!compact && (
        <div>
          <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-white/45 mb-2">DCA / Averaging</div>
          <div className="grid grid-cols-4 gap-1.5">
            {dca.map((d) => (
              <div key={d.lvl} className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] text-center">
                <div className="font-mono text-[8.5px] tracking-[0.08em] uppercase text-white/40">{d.lvl}</div>
                <div className="font-mono text-[12px] text-tradeTeal mt-0.5">{d.mult}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {onchain ? (
        <button className={`tc-btn w-full ${side === "buy" ? "tc-btn-primary" : ""}`}
          style={side === "sell" ? { color: "#042024", background: "linear-gradient(135deg,#FF9B91,#F23645)" } : undefined}
          onClick={submitOnchain} disabled={status === "signing"}
          data-testid="order-submit-onchain">
          {status === "signing"
            ? <><Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={2} /> Sign in wallet…</>
            : !address
              ? <><Wallet className="w-3.5 h-3.5" strokeWidth={2} /> Connect wallet to trade</>
              : <><Wallet className="w-3.5 h-3.5" strokeWidth={2} /> Sign &amp; {side === "buy" ? "Long" : "Short"} {active.sym}</>}
        </button>
      ) : (
        <button className={`tc-btn w-full ${side === "buy" ? "tc-btn-primary" : ""}`}
          style={side === "sell" ? { color: "#042024", background: "linear-gradient(135deg,#FF9B91,#F23645)" } : undefined}
          onClick={submit}
          data-testid="order-submit">
          {side === "buy" ? "Buy / Long" : "Sell / Short"} {active.sym}
        </button>
      )}

      {!onchain && placed && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-tradeTeal/10 border border-tradeTeal/25 text-[12px] text-tradeTeal">
          <Check className="w-3.5 h-3.5" strokeWidth={2.5} /> {side === "buy" ? "Long" : "Short"} order submitted (demo)
        </div>
      )}
      {onchain && status === "done" && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-tradeTeal/10 border border-tradeTeal/25 text-[12px] text-tradeTeal">
          <Check className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} /> Signed & routed to {venueObj.name} · {sig}
        </div>
      )}
      {onchain && (status === "error" || status === "rejected") && (
        <div className="px-3 py-2 rounded-lg bg-[#F23645]/10 border border-[#F23645]/25 text-[12px] text-[#FF8A82]">
          {status === "rejected" ? "Signature rejected — order not placed." : "Order failed — please try again."}
        </div>
      )}

      {onchain ? (
        <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-white/50">
          <span>Venue</span><span className="text-right text-tradeTeal">{venueObj.name}</span>
          <span>Network</span><span className="text-right text-white/80">{network?.short || "—"}</span>
          <span>Wallet</span><span className="text-right text-white/80">{balance ? `${balance} ${nativeSymbol}` : "—"}</span>
          <span>Settlement</span><span className="text-right text-white/80">{network?.ecosystem === "solana" ? "Solana tx" : "EIP-712"}</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-white/50">
          <span>Avail.</span><span className="text-right text-white/80">$0.00</span>
          <span>Cost</span><span className="text-right text-white/80">$0.00</span>
          <span>Fees</span><span className="text-right text-white/80">0.04%</span>
        </div>
      )}
    </div>
  );
}

/* ===== Signals rail ===== */
function SignalsRail({ onPick, activeSym }) {
  const [mkt, setMkt] = useState("All");
  const markets = ["All", "Crypto"];
  return (
    <div className="tc-panel flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-white/40">Tap a signal to chart it</span>
        <Sparkles className="w-3 h-3 text-tradeTeal" strokeWidth={2} />
      </div>
      <div className="flex gap-1.5">
        {markets.map((m) => (
          <button key={m} onClick={() => setMkt(m)}
            className={`px-3 py-1.5 rounded-full font-mono text-[9.5px] tracking-[0.1em] uppercase border transition-colors ${mkt === m ? "bg-tradeTeal/15 text-tradeTeal border-tradeTeal/30" : "text-white/50 border-white/[0.05]"}`}>{m}</button>
        ))}
      </div>
      <div className="flex flex-col gap-2 max-h-[460px] xl:max-h-none overflow-y-auto xl:overflow-visible">
        {SIGNALS.map((s, i) => (
          <button key={i} onClick={() => onPick && onPick(s)}
            className={`p-3 rounded-xl border text-left transition-colors ${activeSym === s.sym ? "bg-tradeTeal/10 border-tradeTeal/35" : "bg-white/[0.02] border-white/[0.045] hover:border-tradeTeal/25"}`}
            data-testid={`signal-card-${s.sym}`}>
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
              <span className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden"><span className="block h-full bg-tradeTeal" style={{ width: `${s.conf}%` }} /></span>
              <span className="font-mono text-[9.5px] text-white/50">{s.conf}%</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ===== Connect rail ===== */
function ConnectPanel({ onManage, onConnectWallet }) {
  const connected = TRADE_ACCOUNT.connected;
  const { address, balance, network, nativeSymbol, ecosystem } = useWallet() || {};
  return (
    <div className="tc-panel flex flex-col gap-4">
      {/* CEX */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/55">Exchange (CEX)</span>
          <span className={`tc-chip ${connected ? "tc-chip-active" : ""}`}>{connected && <span className="tc-chip-dot" />} {connected ? "Active" : "Off"}</span>
        </div>
        {connected ? (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.045]">
            <BrandLogo id={TRADE_ACCOUNT.exchange} size={28} />
            <span className="flex-1 text-[12.5px] text-white/70">Bybit · Unified</span>
            <span className="font-mono text-[11px] text-tradeTeal">${TRADE_ACCOUNT.available.toLocaleString()}</span>
          </div>
        ) : (
          <p className="text-[12px] text-white/50">No exchange connected.</p>
        )}
        <button className="tc-btn tc-btn-ghost w-full" onClick={onManage} data-testid="connect-manage">
          <Plug className="w-3.5 h-3.5" strokeWidth={2} /> {connected ? "Manage exchange" : "Connect exchange"}
        </button>
      </div>

      <div className="h-px bg-white/[0.05]" />

      {/* Web3 */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/55">Web3 · On-chain perps</span>
          <span className={`tc-chip ${address ? "tc-chip-active" : ""}`}>{address && <span className="tc-chip-dot" />} {address ? (ecosystem === "solana" ? "Solana" : "EVM") : "Off"}</span>
        </div>
        {address ? (
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.045]">
            <span className="text-[12.5px] text-white/70">{shortAddr(address)} · {network?.short || "Unknown"}</span>
            <span className="font-mono text-[11px] text-tradeTeal">{balance ?? "…"} {nativeSymbol}</span>
          </div>
        ) : (
          <p className="text-[12px] text-white/50">Connect EVM or Solana to trade on-chain perpetuals.</p>
        )}
        <button className="tc-btn tc-btn-primary w-full" onClick={onConnectWallet} data-testid="connect-wallet">
          <Wallet className="w-3.5 h-3.5" strokeWidth={2} /> {address ? "Manage wallet" : "Connect wallet"}
        </button>
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
        { k: "tsr", label: "TSR Analysis", desc: "Trend bias with nearest support & resistance." },
        { k: "channel", label: "Trend Channel", desc: "Linear-regression channel with ±2σ bands." },
        { k: "trendFinder", label: "Trend Finder", desc: "Auto trendline through recent swing points." },
        { k: "breaks", label: "Breaks & Retests", desc: "Most recent broken level + retest zone." },
        { k: "insideBB", label: "Inside-Bar BB", desc: "Bollinger bands with inside-bar markers." },
      ].map((o) => (
        <button key={o.k} onClick={() => setAi((a) => ({ ...a, [o.k]: !a[o.k] }))}
          className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-colors ${ai[o.k] ? "bg-tradeTeal/8 border-tradeTeal/30" : "bg-white/[0.02] border-white/[0.045]"}`}
          data-testid={`ai-${o.k}`}>
          <span className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 ${ai[o.k] ? "bg-tradeTeal text-[#042024]" : "border border-white/[0.07]"}`}>
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
const TYPE_TONE = {
  Spot: "text-tradeTeal bg-tradeTeal/12 border-tradeTeal/25",
  Futures: "text-[#9B8AFB] bg-[#9B8AFB]/12 border-[#9B8AFB]/25",
  Stocks: "text-[#E8782A] bg-[#E8782A]/12 border-[#E8782A]/25",
};

function SymbolSearch({ onClose, onPick, exchange }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const cats = ["All", ...CATEGORIES.filter((c) => c !== "Favorites")];
  const term = q.trim().toUpperCase();
  const results = WATCHLIST.filter((w) => {
    const inCat = cat === "All" || w.cat === cat;
    const match = !term || w.sym.includes(term) || w.name.toUpperCase().includes(term);
    return inCat && match;
  });

  // Lock the page behind so it doesn't scroll while the search is open,
  // and close on Escape — same UX as the shared Modal.
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-start justify-center pt-[6dvh] pb-[6dvh] px-3 sm:px-4 sm:items-start sm:pt-[10dvh]" data-testid="symbol-search-modal">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-[520px] rounded-2xl bg-surface border border-white/[0.06] overflow-hidden shadow-2xl flex flex-col" style={{ maxHeight: "88dvh" }}>
        {/* Search field */}
        <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-white/[0.05]">
          <Search className="w-4 h-4 text-tradeTeal shrink-0" strokeWidth={2} />
          <input autoFocus placeholder="Search markets — symbol or name…" value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && results[0]) onPick(results[0].sym); if (e.key === "Escape") onClose(); }}
            className="flex-1 min-w-0 bg-transparent text-[15px] text-white placeholder-white/35 outline-none" />
          <kbd className="hidden sm:inline font-mono text-[9px] tracking-[0.08em] text-white/40 px-1.5 py-0.5 rounded border border-white/[0.08]">ESC</kbd>
          <button onClick={onClose} className="tc-iconbtn shrink-0" style={{ width: 30, height: 30 }}><X className="w-3.5 h-3.5" /></button>
        </div>

        {/* Filters */}
        <div className="px-4 py-3 border-b border-white/[0.045]">
          <div className="flex items-center justify-between mb-2.5">
            <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-white/35">Filter by market</span>
            {exchange && (
              <span className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.1em] uppercase text-tradeTeal">
                <span className="w-1.5 h-1.5 rounded-full bg-tradeTeal" />{exchange.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 p-1 rounded-lg bg-white/[0.025] border border-white/[0.05]">
            {cats.map((c) => (
              <button key={c} onClick={() => setCat(c)}
                className={`flex-1 py-1.5 rounded-md font-mono text-[10px] tracking-[0.06em] uppercase transition-colors ${cat === c ? "bg-tradeTeal/15 text-tradeTeal" : "text-white/50 hover:text-white/80"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between px-4 pt-3 pb-1">
          <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-white/35">{term ? "Results" : "Popular markets"}</span>
          <span className="font-mono text-[9px] text-white/30">{results.length}</span>
        </div>

        {/* Results */}
        <div className="flex-1 min-h-0 overflow-y-auto px-1.5 pb-2">
          {results.map((w, i) => (
            <button key={w.sym} onClick={() => onPick(w.sym)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left ${i === 0 && term ? "bg-white/[0.04]" : "hover:bg-white/[0.04]"}`}
              data-testid={`search-result-${w.sym}`}>
              <span className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0 font-heading font-bold text-[12px] text-white/80">{w.sym[0]}</span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="text-[13.5px] font-semibold text-tradeWhite truncate">{w.sym}</span>
                  <span className={`font-mono text-[8px] tracking-[0.06em] uppercase px-1.5 py-0.5 rounded border ${TYPE_TONE[w.cat] || "text-white/50 border-white/10"}`}>{w.cat}</span>
                </span>
                <span className="block text-[10.5px] text-white/40 truncate mt-0.5">{w.name}</span>
              </span>
              <span className="text-right shrink-0">
                <span className="block font-mono text-[12px] text-white/80">{w.last}</span>
                <span className={`block font-mono text-[10px] ${w.up ? "text-tradeTeal" : "text-[#FF8A82]"}`}>{w.chg}</span>
              </span>
            </button>
          ))}
          {results.length === 0 && (
            <div className="flex flex-col items-center text-center py-10">
              <Search className="w-7 h-7 text-white/20 mb-3" strokeWidth={1.6} />
              <div className="text-[13px] text-white/55">No markets found for “{q}”.</div>
              <div className="text-[11.5px] text-white/35 mt-1">Try a different symbol or category.</div>
            </div>
          )}
        </div>

        {/* Footer hints */}
        <div className="hidden sm:flex items-center gap-4 px-4 py-2.5 border-t border-white/[0.045] font-mono text-[9.5px] text-white/35">
          <span><span className="text-white/55">↵</span> select</span>
          <span><span className="text-white/55">esc</span> close</span>
          <span className="ml-auto">{WATCHLIST.length} instruments</span>
        </div>
      </div>
    </div>,
    document.body
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
      <div className={`px-3 py-2.5 rounded-lg bg-white/[0.025] border border-white/[0.05] text-[13px] text-white/85 ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}

function Dropdown({ label, icon: Icon, badge, testid, children, align = "left" }) {
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
        <div className={`absolute ${align === "right" ? "right-0" : "left-0"} mt-1.5 w-56 p-1.5 rounded-xl bg-surface border border-white/[0.05] shadow-xl z-50 max-h-[320px] overflow-y-auto`}>
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
      <span className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${checked ? "bg-tradeTeal text-[#042024]" : "border border-white/[0.07]"}`}>
        {checked && <Check className="w-3 h-3" strokeWidth={3} />}
      </span>
      <span className="flex-1 text-[12.5px] text-white/80">{children}</span>
    </button>
  );
}
