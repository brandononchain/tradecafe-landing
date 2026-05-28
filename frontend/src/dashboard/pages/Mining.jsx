import { useState } from "react";
import { Pickaxe, Copy, Check, Gift, Layers, Clock, ArrowUpRight } from "lucide-react";
import { PageHead, Panel } from "../ui";
import { MINING } from "../data";
import { ConfirmModal } from "../components/AccountModals";
import { useNotifications } from "../NotificationContext";

// Derived figures per contract
function derive(c) {
  const totalReward = c.productPrice * c.rewardPercent;     // total VIT to pay out
  const daily = totalReward / c.totalRewards;               // per-payout VIT
  const accrued = daily * c.currentRewards;                 // mined so far
  const remaining = totalReward - accrued;
  const pct = Math.round((c.currentRewards / c.totalRewards) * 100);
  return { totalReward, daily, accrued, remaining, pct };
}

export default function Mining() {
  const { notify } = useNotifications();
  const [claim, setClaim] = useState(false);
  const [copied, setCopied] = useState(false);

  const rows = MINING.contracts.map((c) => ({ ...c, ...derive(c) }));
  const totalMined = rows.reduce((a, r) => a + r.accrued, 0);
  const dailyAccrual = rows.filter((r) => r.active).reduce((a, r) => a + r.daily, 0);
  const activeCount = rows.filter((r) => r.active).length;

  const [claimable, setClaimable] = useState(() => rows.filter((r) => r.active).reduce((a, r) => a + r.daily, 0));
  const [payouts, setPayouts] = useState(MINING.payouts);

  const today = () => new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const claimRewards = () => {
    if (claimable <= 0) return;
    const amt = claimable;
    setPayouts((p) => [{ date: today(), amountVIT: amt, status: "Paid", tx: "0x" + Math.random().toString(16).slice(2, 6) + "…" + Math.random().toString(16).slice(2, 6) }, ...p]);
    setClaimable(0);
    notify({ type: "mining", title: `Claimed ${fmt(amt)} VIT`, body: "Mining rewards sent to your VIT wallet." });
  };
  const fmt = (n) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const copyAddr = () => {
    navigator.clipboard?.writeText(MINING.walletAddress).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tc-fade flex flex-col gap-6">
      <PageHead eyebrow="Earn · Mining Pool" title="Mining Pool"
        desc="Every product and Trading Pool deposit mints a mining contract that pays VIT rewards back to you, daily.">
        <button className="tc-btn tc-btn-primary" onClick={() => setClaim(true)} disabled={claimable <= 0}
          style={claimable <= 0 ? { opacity: 0.5, pointerEvents: "none" } : undefined} data-testid="mining-claim">
          <Gift className="w-3.5 h-3.5" strokeWidth={2} /> {claimable > 0 ? `Claim ${fmt(claimable)} VIT` : "Claimed"}
        </button>
      </PageHead>

      {/* Stat row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { k: "Total mined", v: `${fmt(totalMined)} VIT`, teal: true },
          { k: "Claimable now", v: `${fmt(claimable)} VIT`, teal: true },
          { k: "Daily accrual", v: `${fmt(dailyAccrual)} VIT` },
          { k: "Active contracts", v: activeCount },
        ].map((s) => (
          <div key={s.k} className="tc-stat">
            <div className="tc-stat-label">{s.k}</div>
            <div className={`tc-stat-value ${s.teal ? "is-teal" : "is-white"}`}>{s.v}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-5">
        {/* Contracts */}
        <Panel icon={Layers} title="Mining Contracts">
          <div className="flex flex-col gap-3">
            {rows.map((c) => (
              <div key={c.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[13.5px] font-semibold text-tradeWhite">{c.source}</div>
                    <div className="font-mono text-[10.5px] text-white/45 mt-0.5">
                      ${c.productPrice.toLocaleString()} principal · {Math.round(c.rewardPercent * 100)}% reward
                    </div>
                  </div>
                  <span className={`tc-chip ${c.active ? "tc-chip-active" : ""}`}>
                    {c.active && <span className="tc-chip-dot" />} {c.active ? "Mining" : "Completed"}
                  </span>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between font-mono text-[10px] text-white/45 mb-1.5">
                    <span>{c.currentRewards} / {c.totalRewards} payouts</span>
                    <span className="text-tradeTeal">{c.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div className="h-full bg-tradeTeal" style={{ width: `${c.pct}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3">
                  {[["Daily", `${fmt(c.daily)} VIT`], ["Mined", `${fmt(c.accrued)} VIT`], ["Remaining", `${fmt(c.remaining)} VIT`]].map(([k, v]) => (
                    <div key={k} className="text-center p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                      <div className="font-mono text-[8.5px] tracking-[0.08em] uppercase text-white/40">{k}</div>
                      <div className="font-mono text-[12px] text-white/85 mt-0.5">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Wallet + how it works */}
        <div className="flex flex-col gap-5">
          <Panel icon={Pickaxe} title="Mining Wallet">
            <div className="text-center py-2">
              <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-white/40">Total mined</div>
              <div className="font-heading text-[30px] font-bold text-tradeTeal tracking-[-0.02em] mt-1">{fmt(totalMined)} <span className="text-[16px]">VIT</span></div>
            </div>
            <div className="font-mono text-[9px] tracking-[0.12em] uppercase text-white/40 mt-2 mb-1.5">Payout address (VIT)</div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <span className="font-mono text-[11px] text-white/70 truncate flex-1">{MINING.walletAddress}</span>
              <button className="tc-iconbtn" style={{ width: 30, height: 30 }} onClick={copyAddr} aria-label="Copy address">
                {copied ? <Check className="w-3.5 h-3.5 text-tradeTeal" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <button className="tc-btn tc-btn-primary w-full mt-3" onClick={() => setClaim(true)} disabled={claimable <= 0}
              style={claimable <= 0 ? { opacity: 0.5, pointerEvents: "none" } : undefined}>
              <Gift className="w-3.5 h-3.5" strokeWidth={2} /> {claimable > 0 ? "Claim rewards" : "Rewards claimed"}
            </button>
          </Panel>

          <Panel icon={Clock} title="How mining works">
            <ol className="flex flex-col gap-2.5">
              {[
                "Buy a bot, the Terminal, or deposit into a Trading Pool.",
                "A mining contract mints automatically for that purchase.",
                "It accrues VIT daily — a % of the principal — until fully paid.",
                "Claim to your VIT wallet anytime; staking VIT boosts the rate.",
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[12.5px] text-white/60 leading-[1.5]">
                  <span className="w-5 h-5 rounded-full bg-tradeTeal/15 text-tradeTeal font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  {t}
                </li>
              ))}
            </ol>
          </Panel>
        </div>
      </div>

      {/* Payout history */}
      <Panel icon={ArrowUpRight} title="Payout History">
        <div className="tc-table-wrap">
          <table className="tc-table">
            <thead><tr><th>Date</th><th>Amount</th><th>Status</th><th>Tx</th></tr></thead>
            <tbody>
              {payouts.map((p, i) => (
                <tr key={i}>
                  <td className="mono text-white/55">{p.date}</td>
                  <td className="mono text-tradeTeal">+{fmt(p.amountVIT)} VIT</td>
                  <td><span className={p.status === "Paid" ? "tc-tag-long" : "tc-chip tc-chip-active"}>{p.status}</span></td>
                  <td className="mono text-white/45">{p.tx || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {claim && (
        <ConfirmModal
          title="Claim mining rewards"
          sub={`${fmt(claimable)} VIT available`}
          body={`Claim ${fmt(claimable)} VIT to your mining wallet (${MINING.walletAddress.slice(0, 10)}…). Payouts settle on-chain within a few minutes.`}
          confirmLabel="Claim rewards"
          onConfirm={claimRewards}
          onClose={() => setClaim(false)}
        />
      )}
    </div>
  );
}
