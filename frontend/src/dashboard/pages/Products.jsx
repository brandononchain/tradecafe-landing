import { useState } from "react";
import { Radio, Bot, CandlestickChart, CreditCard, Check, ArrowUpRight } from "lucide-react";
import { PageHead, Panel } from "../ui";
import { PRODUCTS } from "../data";
import PaymentModal from "../components/PaymentModal";

const ICONS = { Radio, Bot, CandlestickChart, CreditCard };

export default function Products() {
  const [buy, setBuy] = useState(null);
  return (
    <div className="tc-fade flex flex-col gap-6">
      <PageHead eyebrow="Ecosystem" title="Products" desc="The full TradeCafe toolkit — signals, automation, the pro terminal, and the card." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {PRODUCTS.map((p) => {
          const Icon = ICONS[p.icon] || Radio;
          return (
            <Panel key={p.key} hover className="flex flex-col">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="tc-action-ico" style={{ width: 44, height: 44 }}><Icon className="w-5 h-5" strokeWidth={1.8} /></span>
                  <div>
                    <div className="text-[16px] font-semibold text-tradeWhite">{p.name}</div>
                    <span className="font-mono text-[9px] tracking-[0.16em] uppercase text-tradeTeal">{p.tag}</span>
                  </div>
                </div>
              </div>

              <p className="text-[13px] text-white/60 leading-[1.55] mt-4">{p.lead}</p>

              <div className="grid grid-cols-4 gap-2 mt-4">
                {p.stats.map((s) => (
                  <div key={s.k} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center">
                    <div className="font-mono text-[14px] font-semibold text-tradeWhite">{s.v}</div>
                    <div className="font-mono text-[8.5px] tracking-[0.08em] uppercase text-white/40 mt-0.5">{s.k}</div>
                  </div>
                ))}
              </div>

              <ul className="flex flex-col gap-2 mt-4 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[12.5px] text-white/70">
                    <Check className="w-3.5 h-3.5 text-tradeTeal shrink-0 mt-0.5" strokeWidth={2.4} /> {f}
                  </li>
                ))}
              </ul>

              <button className="tc-btn tc-btn-primary w-full mt-5" onClick={() => setBuy(p)} data-testid={`buy-${p.key}`}>
                Get {p.name} <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.4} />
              </button>
            </Panel>
          );
        })}
      </div>

      {buy && <PaymentModal item={`${buy.name} · 12 months`} total={buy.key === "signal" ? "490.00" : buy.key === "trade" ? "990.00" : buy.key === "terminal" ? "690.00" : "0.00"} onClose={() => setBuy(null)} />}
    </div>
  );
}
