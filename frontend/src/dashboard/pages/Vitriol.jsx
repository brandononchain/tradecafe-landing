import { useState } from "react";
import { Gem, ArrowUpRight, Copy, Check, Lock, Gift } from "lucide-react";
import { PageHead, Panel } from "../ui";
import Modal, { ModalField, ModalInput } from "../components/Modal";
import { useNotifications } from "../NotificationContext";
import { usePersistentState } from "../lib/usePersistentState";
import { VITRIOL } from "../data";

const fmt = (n) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const today = () => new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export default function Vitriol() {
  const { notify } = useNotifications();
  const [modal, setModal] = useState(null); // "stake" | "unstake"
  const [agreed, setAgreed] = useState(false);
  const [amount, setAmount] = useState("");
  const [copied, setCopied] = useState(false);

  const [balance, setBalance] = usePersistentState("tc-vitriol-balance", VITRIOL.balance);
  const [staked, setStaked] = usePersistentState("tc-vitriol-staked", VITRIOL.staked);
  const [rewards, setRewards] = usePersistentState("tc-vitriol-rewards", VITRIOL.rewards);
  const [history, setHistory] = usePersistentState("tc-vitriol-history", VITRIOL.history);

  const usd = balance * parseFloat(VITRIOL.price);
  const amt = parseFloat(amount) || 0;
  const max = modal === "unstake" ? staked : balance;
  const valid = amt > 0 && amt <= max && (modal !== "stake" || agreed);

  const closeModal = () => { setModal(null); setAmount(""); setAgreed(false); };
  const openModal = (m) => { setModal(m); setAmount(""); setAgreed(false); };

  const addHistory = (entry) => setHistory((h) => [{ ...entry, date: today() }, ...h]);

  const doStake = () => {
    if (!valid) return;
    setBalance((b) => +(b - amt).toFixed(2));
    setStaked((s) => +(s + amt).toFixed(2));
    addHistory({ type: "Stake", amount: `+${fmt(amt)}`, status: "Confirmed" });
    notify({ type: "stake", title: `Staked ${fmt(amt)} VITRIOL`, body: `Now earning ${VITRIOL.apr}% APR on ${fmt(staked + amt)} VIT.` });
    closeModal();
  };

  const doUnstake = () => {
    if (!valid) return;
    setStaked((s) => +(s - amt).toFixed(2));
    setBalance((b) => +(b + amt).toFixed(2));
    addHistory({ type: "Unstake", amount: `-${fmt(amt)}`, status: "Confirmed" });
    notify({ type: "stake", title: `Unstaked ${fmt(amt)} VITRIOL`, body: `${fmt(amt)} VIT returned to your balance.` });
    closeModal();
  };

  const doClaim = () => {
    if (rewards <= 0) return;
    const claimed = rewards;
    setBalance((b) => +(b + claimed).toFixed(2));
    setRewards(0);
    addHistory({ type: "Reward claim", amount: `+${fmt(claimed)}`, status: "Confirmed" });
    notify({ type: "stake", title: `Claimed ${fmt(claimed)} VITRIOL`, body: "Staking rewards added to your balance." });
  };

  const copyAddr = () => {
    navigator.clipboard?.writeText(VITRIOL.wallet).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tc-fade flex flex-col gap-6">
      <PageHead
        eyebrow="Staking"
        title="VITRIOL"
        desc="Stake VITRIOL to earn protocol rewards and unlock ecosystem benefits."
      >
        <a href="https://vitriol.network" target="_blank" rel="noreferrer" className="tc-btn tc-btn-ghost">
          vitriol.network <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2} />
        </a>
      </PageHead>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Panel glow className="lg:col-span-2">
          <div className="flex items-center gap-4">
            <span className="tc-action-ico" style={{ width: 52, height: 52 }}>
              <Gem className="w-6 h-6" strokeWidth={1.8} />
            </span>
            <div>
              <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-white/45">Total Balance</div>
              <div className="font-heading text-[40px] font-bold tracking-[-0.03em] text-tradeWhite leading-none mt-1">
                {fmt(balance)}
                <span className="text-[14px] text-white/45 font-mono font-normal ml-2">VITRIOL</span>
              </div>
              <div className="font-mono text-[12px] text-white/40 mt-1">≈ ${fmt(usd)} USD · 1 VIT = ${VITRIOL.price}</div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 mt-5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] font-mono text-[11.5px] text-white/60">
            <span className="truncate">{VITRIOL.wallet}</span>
            <button className="tc-iconbtn" style={{ width: 30, height: 30 }} aria-label="Copy address" onClick={copyAddr}>
              {copied ? <Check className="w-3.5 h-3.5 text-tradeTeal" /> : <Copy className="w-3.5 h-3.5" strokeWidth={2} />}
            </button>
          </div>

          <div className="flex gap-2.5 mt-4">
            <button className="tc-btn tc-btn-primary flex-1" onClick={() => openModal("stake")} data-testid="stake-open"><Lock className="w-4 h-4" strokeWidth={2.2} /> Stake</button>
            <button className="tc-btn tc-btn-ghost flex-1" onClick={() => openModal("unstake")} disabled={staked <= 0}
              style={staked <= 0 ? { opacity: 0.5, pointerEvents: "none" } : undefined} data-testid="unstake-open">Unstake</button>
          </div>
        </Panel>

        <div className="flex flex-col gap-5">
          <Panel icon={Lock} title="Staked">
            <div className="font-heading text-[26px] font-bold text-tradeWhite tracking-[-0.02em]">{fmt(staked)}</div>
            <div className="font-mono text-[11px] text-tradeTeal mt-1">{VITRIOL.apr}% APR</div>
          </Panel>
          <Panel icon={Gift} title="Rewards">
            <div className="font-heading text-[26px] font-bold text-tradeWhite tracking-[-0.02em]">{fmt(rewards)}</div>
            <div className="font-mono text-[11px] text-white/45 mt-1 mb-3">Claimable</div>
            <button className="tc-btn tc-btn-primary w-full" onClick={doClaim} disabled={rewards <= 0}
              style={rewards <= 0 ? { opacity: 0.5, pointerEvents: "none" } : undefined} data-testid="claim-rewards">
              <Gift className="w-3.5 h-3.5" strokeWidth={2} /> Claim rewards
            </button>
          </Panel>
        </div>
      </div>

      <Panel icon={Gift} title="Reward History">
        <div className="tc-table-wrap">
          <table className="tc-table">
            <thead>
              <tr><th>Type</th><th>Amount</th><th>Date</th><th>Status</th></tr>
            </thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={i}>
                  <td className="text-white/80">{h.type}</td>
                  <td className={`mono ${h.amount.startsWith("-") ? "text-[#FF8A82]" : "text-tradeTeal"}`}>{h.amount}</td>
                  <td className="mono text-white/55">{h.date}</td>
                  <td><span className="tc-chip">{h.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {modal && (
        <Modal
          title={modal === "stake" ? "Stake VITRIOL" : "Unstake VITRIOL"}
          sub={modal === "stake" ? `${VITRIOL.apr}% APR · flexible` : "Withdraw staked balance"}
          onClose={closeModal}
          footer={
            <button className="tc-btn tc-btn-primary flex-1" disabled={!valid}
              style={!valid ? { opacity: 0.5, pointerEvents: "none" } : undefined}
              onClick={modal === "stake" ? doStake : doUnstake} data-testid="stake-confirm">
              {modal === "stake" ? "Stake now" : "Unstake now"}
            </button>
          }>
          <ModalField label="Amount (VITRIOL)">
            <ModalInput type="number" min="0" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} data-testid="stake-amount" />
          </ModalField>
          <div className="flex items-center justify-between font-mono text-[11px] text-white/45 mb-4">
            <span>{modal === "stake" ? "Available" : "Staked"}</span>
            <button className="text-white/80 hover:text-tradeTeal transition-colors" onClick={() => setAmount(String(max))}>
              {fmt(max)} VIT · Max
            </button>
          </div>
          {amt > max && <div className="text-[11.5px] text-[#FF8A82] mb-3">Amount exceeds your {modal === "stake" ? "balance" : "staked balance"}.</div>}
          {modal === "stake" && (
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 accent-[color:var(--tc-accent)]" />
              <span className="text-[12px] text-white/60 leading-[1.5]">I understand staking rewards are variable and subject to the protocol terms.</span>
            </label>
          )}
        </Modal>
      )}
    </div>
  );
}
