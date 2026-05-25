import { Gem, ArrowUpRight, Copy, Lock, Gift } from "lucide-react";
import { PageHead, Panel } from "../ui";
import { VITRIOL } from "../data";

export default function Vitriol() {
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
                {VITRIOL.balance.toFixed(2)}
                <span className="text-[14px] text-white/45 font-mono font-normal ml-2">VITRIOL</span>
              </div>
              <div className="font-mono text-[12px] text-white/40 mt-1">≈ ${VITRIOL.usd.toFixed(2)} USD · 1 VIT = ${VITRIOL.price}</div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 mt-5 p-3 rounded-xl bg-white/[0.02] border border-white/5 font-mono text-[11.5px] text-white/60">
            <span className="truncate">{VITRIOL.wallet}</span>
            <button className="tc-iconbtn" style={{ width: 30, height: 30 }} aria-label="Copy address">
              <Copy className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
          </div>

          <div className="flex gap-2.5 mt-4">
            <button className="tc-btn tc-btn-primary flex-1"><Lock className="w-4 h-4" strokeWidth={2.2} /> Stake</button>
            <button className="tc-btn tc-btn-ghost flex-1">Unstake</button>
          </div>
        </Panel>

        <div className="flex flex-col gap-5">
          <Panel icon={Lock} title="Staked">
            <div className="font-heading text-[26px] font-bold text-tradeWhite tracking-[-0.02em]">{VITRIOL.staked.toFixed(2)}</div>
            <div className="font-mono text-[11px] text-tradeTeal mt-1">{VITRIOL.apr}% APR</div>
          </Panel>
          <Panel icon={Gift} title="Rewards">
            <div className="font-heading text-[26px] font-bold text-tradeWhite tracking-[-0.02em]">{VITRIOL.rewards.toFixed(2)}</div>
            <div className="font-mono text-[11px] text-white/45 mt-1">Claimable</div>
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
              {VITRIOL.history.map((h, i) => (
                <tr key={i}>
                  <td className="text-white/80">{h.type}</td>
                  <td className="mono text-tradeTeal">{h.amount}</td>
                  <td className="mono text-white/55">{h.date}</td>
                  <td><span className="tc-chip" style={{ color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>{h.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
