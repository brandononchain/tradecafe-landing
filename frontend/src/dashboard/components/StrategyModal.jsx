import { TrendingUp, Check } from "lucide-react";
import Modal from "./Modal";

// Deterministic demo metrics from the strategy id so they stay stable.
function metrics(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  const win = 64 + (h % 28);
  const ret = (8 + (h % 40)) + ((h >> 3) % 9) / 10;
  const trades = 120 + (h % 900);
  const spark = Array.from({ length: 16 }, (_, i) => 30 + ((h >> i) % 60));
  return { win, ret: ret.toFixed(1), trades, spark };
}

export default function StrategyModal({ strategy, onEnable, onClose }) {
  const m = metrics(strategy.id);
  const max = Math.max(...m.spark);
  return (
    <Modal title={strategy.name} sub={`${strategy.mode} · ${strategy.market}`} width={480} onClose={onClose}
      footer={
        <>
          <button className="tc-btn tc-btn-ghost flex-1" onClick={onClose}>Close</button>
          <button className="tc-btn tc-btn-primary flex-1" onClick={() => { onEnable?.(strategy); onClose(); }}>
            <Check className="w-3.5 h-3.5" strokeWidth={2.4} /> Enable strategy
          </button>
        </>
      }
    >
      <p className="text-[13px] text-white/60 leading-[1.6] mb-4">{strategy.desc}</p>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {[["Win rate", `${m.win}%`, true], ["Avg return", `+${m.ret}%`, true], ["Trades", m.trades, false]].map(([k, v, teal]) => (
          <div key={k} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.045] text-center">
            <div className={`font-heading text-[18px] font-bold tracking-[-0.02em] ${teal ? "text-tradeTeal" : "text-tradeWhite"}`}>{v}</div>
            <div className="font-mono text-[8.5px] tracking-[0.08em] uppercase text-white/40 mt-0.5">{k}</div>
          </div>
        ))}
      </div>

      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.045]">
        <div className="flex items-center justify-between mb-2.5">
          <span className="font-mono text-[9.5px] tracking-[0.12em] uppercase text-white/45">90-day equity</span>
          <span className="flex items-center gap-1 font-mono text-[11px] text-tradeTeal"><TrendingUp className="w-3 h-3" strokeWidth={2.4} /> +{m.ret}%</span>
        </div>
        <div className="flex items-end gap-1 h-[64px]">
          {m.spark.map((v, i) => (
            <span key={i} className="flex-1 rounded-t bg-gradient-to-t from-tradeTeal/25 to-tradeTeal/70" style={{ height: `${(v / max) * 100}%` }} />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-4">
        {["Risk-managed", "Auto TP/SL", `${strategy.mode} mode`, "Backtested"].map((t) => (
          <span key={t} className="font-mono text-[9.5px] tracking-[0.06em] uppercase px-2 py-1 rounded-md bg-white/[0.03] text-white/55 border border-white/[0.05]">{t}</span>
        ))}
      </div>
    </Modal>
  );
}
