import { useState } from "react";
import { Zap, Bot, SlidersHorizontal } from "lucide-react";
import Modal from "./Modal";

/* ===== shared controls ===== */
function Section({ label, children }) {
  return (
    <div className="mb-5 last:mb-0">
      <div className="font-mono text-[9.5px] tracking-[0.14em] uppercase text-white/45 mb-2.5">{label}</div>
      {children}
    </div>
  );
}

function Toggle({ label, on, onClick }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-[13px] text-white/75">{label}</span>
      <button onClick={onClick} className={`relative w-11 h-6 rounded-full transition-colors ${on ? "bg-tradeTeal" : "bg-white/12"}`}>
        <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform" style={{ transform: on ? "translateX(20px)" : "none" }} />
      </button>
    </div>
  );
}

function Slider({ label, value, min, max, step = 1, suffix = "", onChange }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between font-mono text-[11px] mb-2">
        <span className="text-white/55">{label}</span>
        <span className="text-tradeTeal">{value}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[color:var(--tc-accent)]" />
    </div>
  );
}

function Chips({ options, selected, onToggle, single, onPick }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const active = single ? selected === o : selected.includes(o);
        return (
          <button key={o} onClick={() => (single ? onPick(o) : onToggle(o))}
            className={`px-3 py-1.5 rounded-full text-[11px] border transition-colors ${active ? "bg-tradeTeal/15 text-tradeTeal border-tradeTeal/30" : "text-white/55 border-white/8 hover:text-white/85"}`}>
            {o}
          </button>
        );
      })}
    </div>
  );
}

/* ===== Signal Bot config ===== */
export function SignalConfigModal({ onClose }) {
  const ALL_MARKETS = ["Crypto", "Stocks", "Forex", "Metals", "Indices"];
  const ALL_STRATS = ["Breakout", "Mean Reversion", "Momentum", "Scalp", "Swing"];
  const [markets, setMarkets] = useState(["Crypto"]);
  const [strats, setStrats] = useState(["Breakout", "Momentum"]);
  const [conf, setConf] = useState(75);
  const [notify, setNotify] = useState(true);
  const toggle = (arr, set) => (v) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  return (
    <Modal title="Signal Bot settings" sub="AI signal preferences" onClose={onClose} width={500}
      footer={<><button className="tc-btn tc-btn-ghost flex-1" onClick={onClose}>Cancel</button><button className="tc-btn tc-btn-primary flex-1" onClick={onClose}>Save settings</button></>}>
      <Section label="Markets"><Chips options={ALL_MARKETS} selected={markets} onToggle={toggle(markets, setMarkets)} /></Section>
      <Section label="Strategies"><Chips options={ALL_STRATS} selected={strats} onToggle={toggle(strats, setStrats)} /></Section>
      <Section label="Filters"><Slider label="Min confidence" value={conf} min={50} max={99} suffix="%" onChange={setConf} /></Section>
      <Section label="Delivery"><Toggle label="Push notifications" on={notify} onClick={() => setNotify((v) => !v)} /></Section>
    </Modal>
  );
}

/* ===== Trade Bot config (modes) ===== */
export function TradeConfigModal({ onClose, onOpenMargin }) {
  const MODES = ["Full Auto", "Semi-Auto", "Assistant"];
  const [mode, setMode] = useState("Semi-Auto");
  const [risk, setRisk] = useState(2);
  const [maxPos, setMaxPos] = useState(5);
  const [tp, setTp] = useState(true);
  const [sl, setSl] = useState(true);
  const [dca, setDca] = useState(false);

  const modeDesc = {
    "Full Auto": "Bot opens and closes trades automatically.",
    "Semi-Auto": "Bot prepares trades; you approve each one.",
    Assistant: "Bot only marks setups on your chart.",
  };

  return (
    <Modal title="Trade Bot settings" sub="Execution & risk" onClose={onClose} width={500}
      footer={<><button className="tc-btn tc-btn-ghost flex-1" onClick={onClose}>Cancel</button><button className="tc-btn tc-btn-primary flex-1" onClick={onClose}>Save settings</button></>}>
      <Section label="Execution mode">
        <Chips options={MODES} selected={mode} single onPick={setMode} />
        <p className="text-[11.5px] text-white/45 mt-2.5 leading-[1.5]">{modeDesc[mode]}</p>
      </Section>
      <Section label="Risk">
        <Slider label="Risk per trade" value={risk} min={0.5} max={10} step={0.5} suffix="%" onChange={setRisk} />
        <Slider label="Max open positions" value={maxPos} min={1} max={20} onChange={setMaxPos} />
      </Section>
      <Section label="Exits">
        <Toggle label="Auto take-profit" on={tp} onClick={() => setTp((v) => !v)} />
        <Toggle label="Auto stop-loss" on={sl} onClick={() => setSl((v) => !v)} />
        <Toggle label="DCA / averaging" on={dca} onClick={() => setDca((v) => !v)} />
      </Section>
      <button className="tc-btn tc-btn-ghost w-full" onClick={onOpenMargin}>
        <SlidersHorizontal className="w-3.5 h-3.5" strokeWidth={2} /> Margin settings
      </button>
    </Modal>
  );
}

/* ===== Margin settings ===== */
export function MarginSettingsModal({ onClose }) {
  const [marginMode, setMarginMode] = useState("Cross");
  const [lev, setLev] = useState(10);
  const [maxSize, setMaxSize] = useState(25);
  return (
    <Modal title="Margin settings" sub="Leverage & exposure" onClose={onClose}
      footer={<><button className="tc-btn tc-btn-ghost flex-1" onClick={onClose}>Cancel</button><button className="tc-btn tc-btn-primary flex-1" onClick={onClose}>Apply</button></>}>
      <Section label="Margin mode"><Chips options={["Cross", "Isolated"]} selected={marginMode} single onPick={setMarginMode} /></Section>
      <Section label="Leverage"><Slider label="Default leverage" value={lev} min={1} max={50} suffix="×" onChange={setLev} /></Section>
      <Section label="Exposure"><Slider label="Max position size" value={maxSize} min={5} max={100} suffix="%" onChange={setMaxSize} /></Section>
      <p className="text-[11.5px] text-white/45 leading-[1.5]">Higher leverage increases liquidation risk. Use isolated margin to cap losses per position.</p>
    </Modal>
  );
}

export { Zap, Bot };
