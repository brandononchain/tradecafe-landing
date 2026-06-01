import { useState } from "react";
import { CreditCard, Check, Wifi, ArrowUpRight, Snowflake } from "lucide-react";
import { PageHead, Panel } from "../ui";
import { CARD } from "../data";
import PaymentModal from "../components/PaymentModal";

export default function Card() {
  const [tier, setTier] = useState("Plus");
  const [pay, setPay] = useState(false);

  return (
    <div className="tc-fade flex flex-col gap-6">
      <PageHead eyebrow="Spend" title="TradeCafe Card" desc="Spend your trading profits anywhere with the TradeCafe VISA card.">
        <button className="tc-btn tc-btn-primary" onClick={() => setPay(true)} data-testid="card-order">
          <CreditCard className="w-3.5 h-3.5" strokeWidth={2} /> Order card
        </button>
      </PageHead>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-6 items-start">
        {/* Card visual */}
        <Panel glow className="flex flex-col items-center justify-center !p-8">
          <div
            className="relative w-full max-w-[360px] aspect-[1.586/1] rounded-2xl p-5 flex flex-col justify-between overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #0b3a44 0%, #042024 45%, #06181c 100%)",
              border: "1px solid rgba(0,180,166,0.4)",
              boxShadow: "0 30px 70px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 50px rgba(0,180,166,0.12)",
            }}
          >
            <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full" style={{ background: "radial-gradient(circle, rgba(0,180,166,0.25), transparent 70%)" }} />
            <div className="flex items-center justify-between relative">
              <span className="trade-wordmark text-[18px] text-tradeWhite">TradeCafe</span>
              <Wifi className="w-5 h-5 text-tradeTeal rotate-90" strokeWidth={2} />
            </div>
            <div className="relative">
              <div className="w-11 h-8 rounded-md mb-4" style={{ background: "linear-gradient(135deg, #d9c178, #b8923f)" }} />
              <div className="font-mono text-[17px] tracking-[0.18em] text-tradeWhite/90">5412 •••• •••• 8842</div>
              <div className="flex items-center justify-between mt-3">
                <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/55">B. ONCHAIN</span>
                <span className="font-mono text-[11px] text-white/55">VISA</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full max-w-[360px] mt-6">
            {CARD.stats.map((s) => (
              <div key={s.k} className="text-center p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.045]">
                <div className="font-heading text-[16px] font-bold text-tradeTeal">{s.v}</div>
                <div className="font-mono text-[8px] tracking-[0.08em] uppercase text-white/40 mt-0.5">{s.k}</div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Features + tiers */}
        <div className="flex flex-col gap-5">
          <Panel title="Why the TradeCafe Card" icon={CreditCard}>
            <ul className="grid sm:grid-cols-2 gap-3">
              {CARD.features.map((f) => (
                <li key={f.title} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.045]">
                  <div className="flex items-center gap-2 text-[13px] font-semibold text-tradeWhite">
                    <Check className="w-3.5 h-3.5 text-tradeTeal" strokeWidth={2.5} /> {f.title}
                  </div>
                  <p className="text-[11.5px] text-white/50 mt-1.5 leading-[1.45]">{f.text}</p>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Choose your tier" icon={Snowflake}>
            <div className="grid grid-cols-3 gap-2.5">
              {CARD.tiers.map((t) => (
                <button key={t.name} onClick={() => setTier(t.name)}
                  className={`relative p-3.5 rounded-xl border text-left transition-colors ${tier === t.name ? "bg-tradeTeal/10 border-tradeTeal/40" : "bg-white/[0.02] border-white/[0.05] hover:border-white/[0.1]"}`}>
                  {t.popular && <span className="absolute -top-2 right-2 font-mono text-[8px] tracking-[0.1em] uppercase px-1.5 py-0.5 rounded bg-tradeTeal text-[#042024]">Popular</span>}
                  <div className="text-[13px] font-semibold text-tradeWhite">{t.name}</div>
                  <div className="font-mono text-[15px] font-bold mt-1" style={{ color: t.color }}>{t.cashback}</div>
                  <div className="font-mono text-[9px] tracking-[0.08em] uppercase text-white/40">cashback</div>
                  <div className="mt-2 pt-2 border-t border-white/[0.05] font-mono text-[10px] text-white/55">{t.price}</div>
                  <div className="font-mono text-[9.5px] text-white/40 mt-1">{t.limit}</div>
                </button>
              ))}
            </div>
            <button className="tc-btn tc-btn-primary w-full mt-4" onClick={() => setPay(true)}>
              Get {tier} card <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.4} />
            </button>
          </Panel>
        </div>
      </div>

      {pay && <PaymentModal item={`TradeCafe Card · ${tier}`} total="0.00" onClose={() => setPay(false)} />}
    </div>
  );
}
