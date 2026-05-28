import { useEffect, useState } from "react";
import { Copy, Check, Clock, ShieldCheck, Loader2 } from "lucide-react";
import Modal from "./Modal";
import { INVOICE } from "../data";

const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export default function PaymentModal({ item = INVOICE.item, total = INVOICE.total, onClose, onSuccess }) {
  const [stage, setStage] = useState("invoice"); // invoice | verifying | paid
  const [left, setLeft] = useState(INVOICE.minutes * 60);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (stage !== "invoice") return;
    const id = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [stage]);

  useEffect(() => {
    if (stage === "paid") onSuccess?.();
  }, [stage, onSuccess]);

  const copy = () => {
    navigator.clipboard?.writeText(INVOICE.address).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const confirm = () => {
    setStage("verifying");
    setTimeout(() => setStage("paid"), 1800);
  };

  return (
    <Modal title="Complete payment" sub={`${item} · ${total} ${INVOICE.currency}`} width={460} onClose={onClose}
      footer={
        stage === "invoice" ? (
          <>
            <button className="tc-btn tc-btn-ghost flex-1" onClick={onClose}>Cancel</button>
            <button className="tc-btn tc-btn-primary flex-1" onClick={confirm}>I've paid</button>
          </>
        ) : (
          <button className="tc-btn tc-btn-primary flex-1" onClick={onClose}>{stage === "paid" ? "Done" : "Close"}</button>
        )
      }
    >
      {stage === "invoice" && (
        <>
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#E8782A]/8 border border-[#E8782A]/20 mb-4">
            <span className="flex items-center gap-2 text-[12.5px] text-white/75"><Clock className="w-4 h-4 text-[#FFB68A]" strokeWidth={2} /> Pay within</span>
            <span className="font-mono text-[15px] font-semibold text-[#FFB68A]">{fmtTime(left)}</span>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="w-40 h-40 rounded-xl bg-white p-3 grid grid-cols-9 grid-rows-9 gap-px">
              {Array.from({ length: 81 }).map((_, i) => (
                <span key={i} style={{ background: (i * 5 + ((i * 11) % 7)) % 3 === 0 ? "#0a0a0a" : "transparent" }} />
              ))}
            </div>
            <div className="w-full">
              <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-white/40 mb-1.5">Payment address · {INVOICE.network}</div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span className="font-mono text-[11.5px] text-white/75 truncate flex-1">{INVOICE.address}</span>
                <button className="tc-iconbtn" style={{ width: 30, height: 30 }} onClick={copy} aria-label="Copy address">
                  {copied ? <Check className="w-3.5 h-3.5 text-tradeTeal" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <div className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <span className="font-mono text-[9.5px] tracking-[0.14em] uppercase text-white/45">Total</span>
              <span className="text-[14px] font-semibold text-tradeWhite">{total} {INVOICE.currency}</span>
            </div>
          </div>
        </>
      )}

      {stage === "verifying" && (
        <div className="py-10 flex flex-col items-center text-center">
          <Loader2 className="w-9 h-9 text-tradeTeal animate-spin mb-4" strokeWidth={2} />
          <div className="text-[14px] font-semibold text-tradeWhite">Verifying your payment…</div>
          <p className="text-[12.5px] text-white/50 mt-1.5">This usually takes a moment on {INVOICE.network}.</p>
        </div>
      )}

      {stage === "paid" && (
        <div className="py-10 flex flex-col items-center text-center">
          <span className="w-12 h-12 rounded-full bg-tradeTeal/15 border border-tradeTeal/30 flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6 text-tradeTeal" strokeWidth={2} />
          </span>
          <div className="text-[15px] font-semibold text-tradeWhite">Payment confirmed</div>
          <p className="text-[12.5px] text-white/50 mt-1.5">{item} is now active on your account.</p>
        </div>
      )}
    </Modal>
  );
}
