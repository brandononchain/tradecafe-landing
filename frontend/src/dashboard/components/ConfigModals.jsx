import { useMemo, useState } from "react";
import { Zap, Bot, SlidersHorizontal, Search, Plus, X, Check, Sparkles, Plug } from "lucide-react";
import Modal from "./Modal";
import { BOT_MARKETS, STRATEGIES, SYMBOL_POOL, TRADE_MODES } from "../data";

/* ===== shared controls ===== */
function Section({ label, sub, children }) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="font-mono text-[9.5px] tracking-[0.14em] uppercase text-white/45 mb-0.5">{label}</div>
      {sub && <div className="text-[11px] text-white/40 mb-2.5">{sub}</div>}
      <div className={sub ? "" : "mt-2.5"}>{children}</div>
    </div>
  );
}

function Toggle({ on, onClick }) {
  return (
    <button onClick={onClick} className={`tc-switch shrink-0 ${on ? "is-on" : ""}`} role="switch" aria-checked={on}>
      <span className="tc-switch-knob" />
    </button>
  );
}

function NumField({ label, value, onChange, placeholder, suffix }) {
  return (
    <label className="block">
      <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-white/40 block mb-1.5">{label}</span>
      <span className="relative block">
        <input type="number" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05] text-[13px] text-white outline-none focus:border-tradeTeal/40" />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-white/35">{suffix}</span>}
      </span>
    </label>
  );
}

const toggleIn = (arr, v) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

/* ===== Core bot config (Analysis = signal, Trading = trade) ===== */
function BotConfig({ kind, onClose, onOpenAccount }) {
  const isTrade = kind === "trade";
  const [markets, setMarkets] = useState(["crypto"]);
  const [strategyIds, setStrategyIds] = useState(isTrade ? ["sw-f", "sc-f"] : ["sw-f", "br-f"]);
  const [symbols, setSymbols] = useState(["BTCUSDT", "ETHUSDT", "SOLUSDT", "AAVEUSDT"]);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("semi");
  const [autoTpsl, setAutoTpsl] = useState(true);
  const [tp, setTp] = useState("");
  const [sl, setSl] = useState("");
  const [slPlus, setSlPlus] = useState("");
  const [ptp, setPtp] = useState("");

  const spot = STRATEGIES.filter((s) => s.mode === "Spot");
  const futures = STRATEGIES.filter((s) => s.mode === "Futures");
  const selectedStrategies = STRATEGIES.filter((s) => strategyIds.includes(s.id));
  const alloc = selectedStrategies.length ? Math.floor(100 / selectedStrategies.length) : 0;

  const available = useMemo(
    () => SYMBOL_POOL.filter((s) => !symbols.includes(s) && s.includes(search.trim().toUpperCase())),
    [symbols, search]
  );

  const StratCard = ({ s }) => {
    const on = strategyIds.includes(s.id);
    return (
      <button onClick={() => setStrategyIds((p) => toggleIn(p, s.id))}
        className={`p-3 rounded-xl border text-left transition-colors ${on ? "bg-tradeTeal/10 border-tradeTeal/35" : "bg-white/[0.02] border-white/[0.05] hover:border-white/[0.1]"}`}>
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-semibold text-tradeWhite">{s.name}</span>
          {on && <Check className="w-3.5 h-3.5 text-tradeTeal" strokeWidth={3} />}
        </div>
        <div className="text-[11px] text-white/45 mt-1 leading-[1.4]">{s.desc}</div>
        <div className="flex gap-1.5 mt-2">
          <span className="font-mono text-[8.5px] tracking-[0.06em] uppercase px-1.5 py-0.5 rounded bg-white/[0.04] text-white/50">{s.mode}</span>
          <span className="font-mono text-[8.5px] tracking-[0.06em] uppercase px-1.5 py-0.5 rounded bg-white/[0.04] text-white/50">{s.market}</span>
        </div>
      </button>
    );
  };

  return (
    <Modal
      title={isTrade ? "Trade Bot configuration" : "Analysis Bot configuration"}
      sub={isTrade ? "Strategies, symbols, allocation & risk" : "Markets, strategies & symbols"}
      width={560}
      onClose={onClose}
      footer={
        <>
          <button className="tc-btn tc-btn-ghost flex-1" onClick={onClose}>Cancel</button>
          <button className="tc-btn tc-btn-primary flex-1" onClick={onClose} data-testid="bot-config-save">Save configuration</button>
        </>
      }
    >
      {/* Markets */}
      <Section label="Choose market">
        <div className="grid grid-cols-2 gap-2">
          {BOT_MARKETS.map((m) => {
            const on = markets.includes(m.id);
            return (
              <button key={m.id} disabled={!m.enabled}
                onClick={() => m.enabled && setMarkets((p) => toggleIn(p, m.id))}
                className={`p-3 rounded-xl border text-left transition-colors ${
                  !m.enabled ? "opacity-40 cursor-not-allowed border-white/[0.04]" :
                  on ? "bg-tradeTeal/10 border-tradeTeal/35" : "bg-white/[0.02] border-white/[0.05] hover:border-white/[0.1]"}`}>
                <div className="text-[13px] font-semibold text-tradeWhite">{m.title}{!m.enabled && <span className="text-white/35 font-normal"> · Soon</span>}</div>
                <div className="text-[11px] text-white/45 mt-0.5">{m.desc}</div>
              </button>
            );
          })}
        </div>
      </Section>

      {/* Strategies */}
      <Section label="Choose strategies">
        <div className="font-mono text-[9px] tracking-[0.12em] uppercase text-white/35 mb-2">Futures</div>
        <div className="grid grid-cols-2 gap-2 mb-3">{futures.map((s) => <StratCard key={s.id} s={s} />)}</div>
        <div className="font-mono text-[9px] tracking-[0.12em] uppercase text-white/35 mb-2">Spot</div>
        <div className="grid grid-cols-2 gap-2">{spot.map((s) => <StratCard key={s.id} s={s} />)}</div>
      </Section>

      {/* Symbols */}
      <Section label="Select symbols" sub={`${symbols.length} selected`}>
        <div className="tc-search mb-2.5">
          <Search className="w-4 h-4 text-white/35" strokeWidth={2} />
          <input placeholder="Search symbol (e.g. BTCUSDT)" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-white/40">Available ({available.length})</span>
          <div className="flex gap-2">
            <button className="font-mono text-[10px] text-tradeTeal hover:opacity-80" onClick={() => setSymbols((p) => [...new Set([...p, ...available])])}>Add all</button>
            <button className="font-mono text-[10px] text-white/45 hover:text-white/70" onClick={() => setSymbols([])}>Clear</button>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto mb-3">
          {available.map((s) => (
            <button key={s} onClick={() => setSymbols((p) => [...p, s])}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05] text-[11px] text-white/70 hover:border-tradeTeal/30 hover:text-white transition-colors">
              <Plus className="w-3 h-3" strokeWidth={2.5} /> {s}
            </button>
          ))}
          {available.length === 0 && <span className="text-[11.5px] text-white/35 py-2">No symbols match.</span>}
        </div>
        <div className="font-mono text-[9px] tracking-[0.1em] uppercase text-white/40 mb-2">Selected ({symbols.length})</div>
        <div className="flex flex-wrap gap-1.5 max-h-[110px] overflow-y-auto">
          {symbols.map((s) => (
            <button key={s} onClick={() => setSymbols((p) => p.filter((x) => x !== s))}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-tradeTeal/12 border border-tradeTeal/30 text-[11px] text-tradeTeal">
              {s} <X className="w-3 h-3" strokeWidth={2.5} />
            </button>
          ))}
          {symbols.length === 0 && <span className="text-[11.5px] text-white/35 py-2">Nothing selected yet.</span>}
        </div>
      </Section>

      {/* Trade-only sections */}
      {isTrade && (
        <>
          <Section label="Trade mode">
            <div className="flex flex-wrap gap-1.5">
              {TRADE_MODES.map((m) => (
                <button key={m.id} onClick={() => setMode(m.id)}
                  className={`px-3 py-1.5 rounded-full text-[11px] border transition-colors ${mode === m.id ? "bg-tradeTeal/15 text-tradeTeal border-tradeTeal/30" : "text-white/55 border-white/[0.05] hover:text-white/85"}`}>
                  {m.label}
                </button>
              ))}
            </div>
            <p className="text-[11.5px] text-white/45 mt-2.5">{TRADE_MODES.find((m) => m.id === mode)?.desc}</p>
          </Section>

          <Section label="Strategy balance allocation" sub={selectedStrategies.length === 1 ? "100% of your trade balance is used for this strategy." : "Balance is split evenly across selected strategies."}>
            <div className="flex flex-col gap-1.5">
              {selectedStrategies.map((s) => (
                <div key={s.id} className="flex items-center gap-3">
                  <span className="text-[12px] text-white/70 w-28 shrink-0 truncate">{s.name} <span className="text-white/35">{s.mode}</span></span>
                  <span className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden"><span className="block h-full bg-tradeTeal" style={{ width: `${alloc}%` }} /></span>
                  <span className="font-mono text-[11px] text-tradeTeal w-9 text-right">{alloc}%</span>
                </div>
              ))}
              {selectedStrategies.length === 0 && <span className="text-[11.5px] text-white/35">Select a strategy to allocate balance.</span>}
            </div>
          </Section>

          <Section label="Take profit / stop loss">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] mb-3">
              <span className="flex items-center gap-2 text-[12.5px] text-white/80">
                <Sparkles className="w-3.5 h-3.5 text-tradeTeal" strokeWidth={2} /> Auto setup by TradeCafe
              </span>
              <Toggle on={autoTpsl} onClick={() => setAutoTpsl((v) => !v)} />
            </div>
            {!autoTpsl && (
              <div className="grid grid-cols-2 gap-2.5">
                <NumField label="Take Profit" value={tp} onChange={setTp} placeholder="e.g. 3" suffix="%" />
                <NumField label="Stop Loss" value={sl} onChange={setSl} placeholder="e.g. 2" suffix="%" />
                <NumField label="Stop Loss Plus" value={slPlus} onChange={setSlPlus} placeholder="optional" suffix="%" />
                <NumField label="Partial TP" value={ptp} onChange={setPtp} placeholder="optional" suffix="%" />
              </div>
            )}
          </Section>

          <button className="tc-btn tc-btn-ghost w-full" onClick={onOpenAccount} data-testid="open-account-from-config">
            <Plug className="w-3.5 h-3.5" strokeWidth={2} /> Connect exchange / broker API
          </button>
        </>
      )}
    </Modal>
  );
}

export function SignalConfigModal(props) {
  return <BotConfig kind="signal" {...props} />;
}
export function TradeConfigModal(props) {
  return <BotConfig kind="trade" {...props} />;
}

/* ===== Margin settings (analysis-side) ===== */
export function MarginSettingsModal({ onClose }) {
  const [marginMode, setMarginMode] = useState("Cross");
  const [lev, setLev] = useState(10);
  const [maxSize, setMaxSize] = useState(25);
  return (
    <Modal title="Margin settings" sub="Leverage & exposure" onClose={onClose}
      footer={<><button className="tc-btn tc-btn-ghost flex-1" onClick={onClose}>Cancel</button><button className="tc-btn tc-btn-primary flex-1" onClick={onClose}>Apply</button></>}>
      <Section label="Margin mode">
        <div className="flex gap-1.5">
          {["Cross", "Isolated"].map((m) => (
            <button key={m} onClick={() => setMarginMode(m)}
              className={`px-3 py-1.5 rounded-full text-[11px] border transition-colors ${marginMode === m ? "bg-tradeTeal/15 text-tradeTeal border-tradeTeal/30" : "text-white/55 border-white/[0.05]"}`}>{m}</button>
          ))}
        </div>
      </Section>
      <Section label="Leverage">
        <div className="flex justify-between font-mono text-[11px] mb-2"><span className="text-white/55">Default leverage</span><span className="text-tradeTeal">{lev}×</span></div>
        <input type="range" min={1} max={50} value={lev} onChange={(e) => setLev(Number(e.target.value))} className="w-full" style={{ "--val": `${((lev - 1) / 49) * 100}%` }} />
      </Section>
      <Section label="Exposure">
        <div className="flex justify-between font-mono text-[11px] mb-2"><span className="text-white/55">Max position size</span><span className="text-tradeTeal">{maxSize}%</span></div>
        <input type="range" min={5} max={100} value={maxSize} onChange={(e) => setMaxSize(Number(e.target.value))} className="w-full" style={{ "--val": `${((maxSize - 5) / 95) * 100}%` }} />
      </Section>
      <p className="text-[11.5px] text-white/45 leading-[1.5]">Higher leverage increases liquidation risk. Use isolated margin to cap losses per position.</p>
    </Modal>
  );
}

export { Zap, Bot };
