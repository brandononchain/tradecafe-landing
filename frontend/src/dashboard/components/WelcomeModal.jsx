import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Radio, Bot, Layers, Check, ArrowRight } from "lucide-react";
import Modal from "./Modal";
import { BOT_MARKETS } from "../data";

const STEPS = ["Welcome", "Markets", "Get started"];

export default function WelcomeModal({ onClose }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [markets, setMarkets] = useState(["crypto"]);

  const go = (path) => { onClose(); navigate(path); };
  const toggle = (id) => setMarkets((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]));

  return (
    <Modal title="Welcome to TradeCafe" sub={`Step ${step + 1} of 3 · ${STEPS[step]}`} width={520} onClose={onClose}
      footer={
        <>
          {step > 0 && <button className="tc-btn tc-btn-ghost flex-1" onClick={() => setStep((s) => s - 1)}>Back</button>}
          {step < 2
            ? <button className="tc-btn tc-btn-primary flex-1" onClick={() => setStep((s) => s + 1)}>Continue <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.2} /></button>
            : <button className="tc-btn tc-btn-primary flex-1" onClick={onClose}>Enter dashboard</button>}
        </>
      }
    >
      <div className="flex items-center gap-2 mb-5">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[11px] ${i <= step ? "bg-tradeTeal text-[#042024]" : "bg-white/[0.06] text-white/40"}`}>
              {i < step ? <Check className="w-3 h-3" strokeWidth={3} /> : i + 1}
            </span>
            {i < STEPS.length - 1 && <span className={`flex-1 h-px ${i < step ? "bg-tradeTeal/50" : "bg-white/[0.08]"}`} />}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="text-center py-3">
          <span className="w-14 h-14 mx-auto rounded-2xl bg-tradeTeal/12 border border-tradeTeal/25 flex items-center justify-center mb-4">
            <Sparkles className="w-7 h-7 text-tradeTeal" strokeWidth={1.8} />
          </span>
          <div className="text-[17px] font-semibold text-tradeWhite">Your AI trading ecosystem</div>
          <p className="text-[13px] text-white/55 mt-2 max-w-[380px] mx-auto leading-[1.6]">
            Signals, automated execution, a pro terminal, and a managed pool — all in one place. Let's set you up in a few seconds.
          </p>
          <div className="grid grid-cols-3 gap-2.5 mt-5">
            {[["Signals", Radio], ["Automation", Bot], ["Pool", Layers]].map(([t, Ic]) => (
              <div key={t} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.045]">
                <Ic className="w-4 h-4 text-tradeTeal mx-auto" strokeWidth={2} />
                <div className="text-[11.5px] text-white/70 mt-1.5">{t}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <div className="text-[13px] text-white/60 mb-3">Which markets do you want signals for?</div>
          <div className="grid grid-cols-2 gap-2">
            {BOT_MARKETS.map((m) => {
              const on = markets.includes(m.id);
              return (
                <button key={m.id} disabled={!m.enabled} onClick={() => m.enabled && toggle(m.id)}
                  className={`p-3 rounded-xl border text-left transition-colors ${!m.enabled ? "opacity-40 cursor-not-allowed border-white/[0.04]" : on ? "bg-tradeTeal/10 border-tradeTeal/35" : "bg-white/[0.02] border-white/[0.05] hover:border-white/[0.1]"}`}>
                  <div className="text-[13px] font-semibold text-tradeWhite">{m.title}{!m.enabled && <span className="text-white/35 font-normal"> · Soon</span>}</div>
                  <div className="text-[11px] text-white/45 mt-0.5">{m.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-2.5">
          <div className="text-[13px] text-white/60 mb-1">Pick where to start:</div>
          {[
            { label: "Open the live Terminal", desc: "Charts, indicators, AI analysis & orders.", to: "/app/terminal" },
            { label: "Connect a trade bot", desc: "Automate execution via exchange API.", to: "/app/automation" },
            { label: "Browse live signals", desc: "AI setups with entries, targets & stops.", to: "/app/signals" },
          ].map((o) => (
            <button key={o.to} onClick={() => go(o.to)}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-tradeTeal/30 transition-colors text-left">
              <span className="flex-1">
                <span className="block text-[13px] font-medium text-tradeWhite">{o.label}</span>
                <span className="block text-[11.5px] text-white/45 mt-0.5">{o.desc}</span>
              </span>
              <ArrowRight className="w-4 h-4 text-tradeTeal" strokeWidth={2} />
            </button>
          ))}
        </div>
      )}
    </Modal>
  );
}
