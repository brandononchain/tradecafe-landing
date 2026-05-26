import { useState } from "react";
import { ArrowDownToLine, ShieldCheck, Check, Copy, AlertTriangle } from "lucide-react";
import Modal, { ModalField, ModalInput } from "./Modal";

/* ===== Withdraw — 3 steps: amount -> address -> review ===== */
export function WithdrawModal({ balance = 0, onClose }) {
  const [step, setStep] = useState(0);
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const steps = ["Amount", "Address", "Review"];

  const next = () => setStep((s) => Math.min(s + 1, 2));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <Modal
      title="Withdraw funds"
      sub={`Step ${step + 1} of 3 · ${steps[step]}`}
      onClose={onClose}
      footer={
        <>
          {step > 0 && <button className="tc-btn tc-btn-ghost flex-1" onClick={back}>Back</button>}
          {step < 2 ? (
            <button className="tc-btn tc-btn-primary flex-1" onClick={next} disabled={step === 0 ? !amount : !address}
              style={(step === 0 ? !amount : !address) ? { opacity: 0.5, pointerEvents: "none" } : undefined}>
              Continue
            </button>
          ) : (
            <button className="tc-btn tc-btn-primary flex-1" onClick={onClose}>Confirm withdrawal</button>
          )}
        </>
      }
    >
      <div className="flex items-center gap-2 mb-5">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[11px] ${i <= step ? "bg-tradeTeal text-[#042024]" : "bg-white/8 text-white/40"}`}>
              {i < step ? <Check className="w-3 h-3" strokeWidth={3} /> : i + 1}
            </span>
            {i < steps.length - 1 && <span className={`flex-1 h-px ${i < step ? "bg-tradeTeal/50" : "bg-white/10"}`} />}
          </div>
        ))}
      </div>

      {step === 0 && (
        <>
          <ModalField label="Amount (USDT)">
            <ModalInput type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </ModalField>
          <div className="flex items-center justify-between font-mono text-[11px] text-white/45">
            <span>Available</span><span className="text-white/80">${balance.toFixed(2)}</span>
          </div>
        </>
      )}
      {step === 1 && (
        <>
          <ModalField label="Destination address (TRC20)">
            <ModalInput placeholder="T..." value={address} onChange={(e) => setAddress(e.target.value)} />
          </ModalField>
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#E8782A]/8 border border-[#E8782A]/20">
            <AlertTriangle className="w-4 h-4 text-[#FFB68A] shrink-0 mt-0.5" strokeWidth={2} />
            <p className="text-[11.5px] text-white/55 leading-[1.5]">Double-check the network and address. Withdrawals are irreversible.</p>
          </div>
        </>
      )}
      {step === 2 && (
        <div className="flex flex-col gap-2.5">
          {[["Amount", `${amount || "0.00"} USDT`], ["Network", "TRC20"], ["Address", address || "—"], ["Fee", "1.00 USDT"]].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="font-mono text-[9.5px] tracking-[0.14em] uppercase text-white/45">{k}</span>
              <span className="text-[12.5px] text-white/85 font-medium truncate ml-3 max-w-[60%]">{v}</span>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}

/* ===== Support request ===== */
export function SupportModal({ onClose }) {
  return (
    <Modal title="Support request" sub="We typically reply within a few hours" onClose={onClose}
      footer={<button className="tc-btn tc-btn-primary flex-1" onClick={onClose}>Send request</button>}>
      <ModalField label="Subject"><ModalInput placeholder="How can we help?" /></ModalField>
      <ModalField label="Message">
        <textarea rows={5} placeholder="Describe your issue…"
          className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/8 text-[13px] text-white outline-none focus:border-tradeTeal/40 resize-none" />
      </ModalField>
    </Modal>
  );
}

/* ===== 2FA setup ===== */
export function TwoFAModal({ onClose }) {
  return (
    <Modal title="Enable two-factor auth" sub="Scan with an authenticator app" onClose={onClose}
      footer={<button className="tc-btn tc-btn-primary flex-1" onClick={onClose}>Verify & enable</button>}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-40 h-40 rounded-xl bg-white p-3 grid grid-cols-7 grid-rows-7 gap-0.5">
          {Array.from({ length: 49 }).map((_, i) => (
            <span key={i} className="rounded-[1px]" style={{ background: (i * 7 + ((i * 13) % 5)) % 3 === 0 ? "#0a0a0a" : "transparent" }} />
          ))}
        </div>
        <div className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 font-mono text-[12px] text-white/70">
          <span className="truncate">JBSWY3DPEHPK3PXP</span>
          <button className="tc-iconbtn" style={{ width: 28, height: 28 }}><Copy className="w-3.5 h-3.5" /></button>
        </div>
        <ModalField label="6-digit code"><ModalInput placeholder="000000" maxLength={6} /></ModalField>
      </div>
    </Modal>
  );
}

/* ===== Referral binding ===== */
export function ReferralModal({ onClose }) {
  return (
    <Modal title="Bind a referrer" sub="Enter the code of who invited you" onClose={onClose}
      footer={<button className="tc-btn tc-btn-primary flex-1" onClick={onClose}>Bind referrer</button>}>
      <ModalField label="Referral code"><ModalInput placeholder="e.g. BRANDON8" /></ModalField>
      <p className="text-[11.5px] text-white/45 leading-[1.5]">This can only be set once and links your account to your referrer's network.</p>
    </Modal>
  );
}

/* ===== Generic confirm ===== */
export function ConfirmModal({ title, sub, body, confirmLabel = "Confirm", danger, onClose }) {
  return (
    <Modal title={title} sub={sub} onClose={onClose}
      footer={
        <>
          <button className="tc-btn tc-btn-ghost flex-1" onClick={onClose}>Cancel</button>
          <button className="tc-btn flex-1" onClick={onClose}
            style={danger ? { color: "#042024", background: "linear-gradient(135deg,#FF9B91,#F23645)" } : { color: "#042024", background: "linear-gradient(135deg,var(--tc-accent-light),var(--tc-accent))" }}>
            {confirmLabel}
          </button>
        </>
      }>
      <p className="text-[13px] text-white/65 leading-[1.6]">{body}</p>
    </Modal>
  );
}

export { ShieldCheck, ArrowDownToLine };
