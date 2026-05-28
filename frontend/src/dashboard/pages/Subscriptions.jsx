import { useState } from "react";
import { Check, CreditCard, Download } from "lucide-react";
import { PageHead, Panel } from "../ui";
import PaymentModal from "../components/PaymentModal";
import { ConfirmModal } from "../components/AccountModals";
import { useNotifications } from "../NotificationContext";
import { usePersistentState } from "../lib/usePersistentState";
import { PLANS, INVOICES } from "../data";

export default function Subscriptions() {
  const { notify } = useNotifications();
  const [active, setActive] = usePersistentState("tc-plan-active", PLANS.reduce((m, p) => ({ ...m, [p.name]: !!p.active }), {}));
  const [pay, setPay] = useState(null);      // plan being subscribed to
  const [cancel, setCancel] = useState(null); // plan being cancelled

  const subscribe = (p) => {
    setActive((m) => ({ ...m, [p.name]: true }));
    notify({ type: "system", title: `${p.name} activated`, body: `Your ${p.name} subscription is now active.` });
  };
  const doCancel = (p) => {
    setActive((m) => ({ ...m, [p.name]: false }));
    notify({ type: "system", title: `${p.name} cancelled`, body: "You'll keep access until the end of the billing period." });
  };

  return (
    <div className="tc-fade flex flex-col gap-6">
      <PageHead
        eyebrow="Billing"
        title="Subscriptions"
        desc="Manage your TradeCafe products, plans, and billing history."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {PLANS.map((p) => {
          const isActive = active[p.name];
          return (
          <div
            key={p.name}
            className={`tc-panel ${p.featured ? "is-glow" : ""} flex flex-col`}
            style={p.featured ? { borderColor: "rgba(0,212,170,0.32)" } : undefined}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-white/45">{p.name}</span>
              {isActive ? (
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
            <button className={`tc-btn w-full mt-5 ${isActive ? "tc-btn-ghost" : "tc-btn-primary"}`}
              onClick={() => (isActive ? setCancel(p) : setPay(p))} data-testid={`plan-${isActive ? "manage" : "subscribe"}-${p.name.replace(/\s+/g, "-").toLowerCase()}`}>
              {isActive ? "Manage" : "Subscribe"}
            </button>
          </div>
          );
        })}
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

      {pay && (
        <PaymentModal
          item={`${pay.name} · monthly`}
          total={pay.price.replace("$", "") + ".00"}
          onSuccess={() => subscribe(pay)}
          onClose={() => setPay(null)}
        />
      )}
      {cancel && (
        <ConfirmModal
          title={`Cancel ${cancel.name}?`}
          sub="Manage subscription"
          body={`Your ${cancel.name} plan stays active until the end of the current billing period, then won't renew. You can re-subscribe anytime.`}
          confirmLabel="Cancel plan"
          danger
          onConfirm={() => doCancel(cancel)}
          onClose={() => setCancel(null)}
        />
      )}
    </div>
  );
}
