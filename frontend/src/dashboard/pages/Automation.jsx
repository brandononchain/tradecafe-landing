import { useState } from "react";
import { Bot, Power, Settings2, Activity, Layers3, ChevronRight, Share2 } from "lucide-react";
import { PageHead, Panel } from "../ui";
import { BOTS, AI_INSIGHTS, STRATEGIES } from "../data";
import { SignalConfigModal, TradeConfigModal, MarginSettingsModal } from "../components/ConfigModals";
import TradeAccountModal from "../components/TradeAccountModal";
import StrategyModal from "../components/StrategyModal";
import SharePnlModal from "../components/SharePnlModal";

export default function Automation() {
  const [modal, setModal] = useState(null);
  const [paused, setPaused] = useState({});
  const [strategy, setStrategy] = useState(null);
  const [share, setShare] = useState(null);
  const shareBot = (b) => setShare({
    source: "auto", sym: b.name, dir: "LONG",
    pnl: b.metrics.find((m) => m.k === "Profit")?.v || "+0%",
    entry: b.metrics.find((m) => m.k === "Win Rate")?.v || "—",
    exit: `${b.metrics[0].v} ${b.metrics[0].k.toLowerCase()}`,
  });
  const togglePause = (key) => setPaused((p) => ({ ...p, [key]: !p[key] }));
  return (
    <div className="tc-fade flex flex-col gap-6">
      <PageHead
        eyebrow="Trading Bots"
        title="Automation"
        desc="Configure analysis and trade bots that run your strategy 24/7 — while you stay in control."
      >
        <button className="tc-btn tc-btn-ghost" onClick={() => setModal("margin")}><Settings2 className="w-3.5 h-3.5" strokeWidth={2} /> Manage</button>
      </PageHead>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {BOTS.map((b) => (
          <Panel key={b.key} hover>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="tc-action-ico" style={{ width: 42, height: 42 }}>
                  <Bot className="w-5 h-5" strokeWidth={1.8} />
                </span>
                <div>
                  <div className="text-[15px] font-semibold text-tradeWhite">{b.name}</div>
                  <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-white/45 mt-0.5">
                    Renews {b.next}
                  </div>
                </div>
              </div>
              {paused[b.key] ? (
                <span className="tc-chip">Paused</span>
              ) : (
                <span className="tc-chip tc-chip-active"><span className="tc-chip-dot" /> {b.status}</span>
              )}
            </div>

            <p className="text-[13px] text-white/55 leading-[1.55] mt-4">{b.desc}</p>

            <div className="grid grid-cols-3 gap-2 mt-4">
              {b.metrics.map((m) => (
                <div key={m.k} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center">
                  <div className="font-mono text-[9px] tracking-[0.12em] uppercase text-white/45">{m.k}</div>
                  <div className="font-mono text-[15px] font-semibold text-tradeWhite mt-1">{m.v}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-2.5 mt-5">
              <button className="tc-btn tc-btn-ghost flex-1" onClick={() => togglePause(b.key)} data-testid={`pause-${b.key}`}>
                <Power className="w-3.5 h-3.5" strokeWidth={2} /> {paused[b.key] ? "Resume" : "Pause"}
              </button>
              <button className="tc-btn tc-btn-primary flex-1" onClick={() => setModal(b.key)} data-testid={`configure-${b.key}`}>
                <Settings2 className="w-3.5 h-3.5" strokeWidth={2} /> Configure
              </button>
              <button className="tc-btn tc-btn-ghost" style={{ padding: "0 12px" }} onClick={() => shareBot(b)} aria-label="Share PnL" data-testid={`share-bot-${b.key}`}>
                <Share2 className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
            </div>
          </Panel>
        ))}
      </div>

      <Panel icon={Activity} title="Recent Bot Activity">
        <ul className="flex flex-col gap-2">
          {AI_INSIGHTS.map((it, i) => (
            <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-[12.5px] text-white/72">
              <span className="inline-flex w-6 h-6 items-center justify-center rounded-md bg-tradeTeal/10 border border-tradeTeal/25 shrink-0">
                <Activity className="w-3 h-3 text-tradeTeal" strokeWidth={2} />
              </span>
              <span className="flex-1 leading-[1.45]">{it.text}</span>
              <span className="font-mono text-[10px] text-white/40 shrink-0 mt-0.5">{it.t}</span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel icon={Layers3} title="Strategy Library">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {STRATEGIES.map((s) => (
            <button key={s.id} onClick={() => setStrategy(s)} data-testid={`strategy-${s.id}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.045] hover:border-tradeTeal/30 transition-colors text-left">
              <span className="flex-1 min-w-0">
                <span className="block text-[13px] font-medium text-tradeWhite">{s.name} <span className="text-white/35 text-[11px]">{s.mode}</span></span>
                <span className="block text-[11px] text-white/45 truncate mt-0.5">{s.desc}</span>
              </span>
              <ChevronRight className="w-4 h-4 text-white/30 shrink-0" strokeWidth={2} />
            </button>
          ))}
        </div>
      </Panel>

      {modal === "signal" && <SignalConfigModal onClose={() => setModal(null)} />}
      {modal === "trade" && <TradeConfigModal onClose={() => setModal(null)} onOpenAccount={() => setModal("account")} />}
      {modal === "margin" && <MarginSettingsModal onClose={() => setModal(null)} />}
      {modal === "account" && <TradeAccountModal onClose={() => setModal(null)} />}
      {strategy && <StrategyModal strategy={strategy} onClose={() => setStrategy(null)} />}
      {share && <SharePnlModal data={share} onClose={() => setShare(null)} />}
    </div>
  );
}
