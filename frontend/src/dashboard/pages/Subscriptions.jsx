import { Check, CreditCard, Download } from "lucide-react";
import { PageHead, Panel } from "../ui";
import { PLANS, INVOICES } from "../data";

export default function Subscriptions() {
  return (
    <div className="tc-fade flex flex-col gap-6">
      <PageHead
        eyebrow="Billing"
        title="Subscriptions"
        desc="Manage your TradeCafe products, plans, and billing history."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {PLANS.map((p) => (
          <div
            key={p.name}
            className={`tc-panel ${p.featured ? "is-glow" : ""} flex flex-col`}
            style={p.featured ? { borderColor: "rgba(0,212,170,0.32)" } : undefined}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-white/45">{p.name}</span>
              {p.active ? (
                <span className="tc-chip tc-chip-active"><span className="tc-chip-dot" /> Active</span>
              ) : p.featured ? (
                <span className="tc-chip tc-chip-active">Popular</span>
              ) : null}
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="font-heading text-[34px] font-bold tracking-[-0.03em] text-tradeWhite">{p.price}</span>
              <span className="font-mono text-[12px] text-white/45">{p.period}</span>
            </div>
            <ul className="flex flex-col gap-2.5 mt-5 flex-1">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[12.5px] text-white/70">
                  <Check className="w-3.5 h-3.5 text-tradeTeal shrink-0 mt-0.5" strokeWidth={2.4} />
                  {f}
                </li>
              ))}
            </ul>
            <button className={`tc-btn w-full mt-5 ${p.active ? "tc-btn-ghost" : "tc-btn-primary"}`}>
              {p.active ? "Manage" : "Subscribe"}
            </button>
          </div>
        ))}
      </div>

      <Panel icon={CreditCard} title="Billing History">
        <div className="tc-table-wrap">
          <table className="tc-table">
            <thead>
              <tr><th>Invoice</th><th>Item</th><th>Amount</th><th>Date</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {INVOICES.map((inv) => (
                <tr key={inv.id}>
                  <td className="mono text-white/70">{inv.id}</td>
                  <td className="text-white/80">{inv.item}</td>
                  <td className="mono">{inv.amount}</td>
                  <td className="mono text-white/55">{inv.date}</td>
                  <td><span className="tc-chip tc-chip-active">{inv.status}</span></td>
                  <td className="text-right">
                    <button className="tc-iconbtn" style={{ width: 30, height: 30 }} aria-label="Download invoice">
                      <Download className="w-3.5 h-3.5" strokeWidth={2} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
