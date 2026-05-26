import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Globe,
  ShieldCheck,
  MessageSquare,
  UserPlus,
  Trash2,
  ArrowDownToLine,
  History,
  ArrowUpRight,
  ChevronRight,
  Coins,
  Layers,
  Pickaxe,
  TrendingUp,
} from "lucide-react";
import { PageHead, Panel } from "../ui";
import { ACCOUNT, STATS, SUBSCRIPTIONS } from "../data";
import { WithdrawModal, SupportModal, TwoFAModal, ReferralModal, ConfirmModal } from "../components/AccountModals";

const ACTIONS = [
  { key: "twofa", icon: ShieldCheck, title: "2FA", sub: ACCOUNT.twoFA ? "Enabled" : "Disabled" },
  { key: "support", icon: MessageSquare, title: "Support Request", sub: "Send a request to our team" },
  { key: "referrer", icon: UserPlus, title: "Referrer", sub: ACCOUNT.referrer || "Not set — tap to bind" },
  { key: "delete", icon: Trash2, title: "Delete Account", sub: "Request permanent deletion", danger: true },
];

export default function Overview() {
  const [modal, setModal] = useState(null);
  return (
    <div className="tc-fade flex flex-col gap-6">
      <PageHead
        eyebrow="My Account"
        title={`Welcome back, ${ACCOUNT.username}`}
        desc="Your calm command center — balances, subscriptions, pools, and account health at a glance."
      />

      {/* Account + Balance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Panel className="lg:col-span-2" data-testid="card-account">
          <div className="flex items-start gap-4">
            <span className="tc-avatar" style={{ width: 52, height: 52, fontSize: 20 }}>
              {ACCOUNT.username.slice(0, 1).toUpperCase()}
            </span>
            <div className="min-w-0">
              <div className="text-[18px] font-semibold text-tradeWhite leading-tight">{ACCOUNT.username}</div>
              <div className="flex items-center gap-1.5 mt-1 font-mono text-[10.5px] tracking-[0.12em] uppercase text-white/45">
                <span className="tc-chip-dot" /> Member since {ACCOUNT.memberSince}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
            <div className="tc-inforow">
              <Mail className="ic w-4 h-4" strokeWidth={2} />
              <span className="k">Email</span>
              <span className="v truncate">{ACCOUNT.email}</span>
            </div>
            <div className="tc-inforow">
              <Globe className="ic w-4 h-4" strokeWidth={2} />
              <span className="k">Language</span>
              <span className="v">{ACCOUNT.language}</span>
            </div>
          </div>
        </Panel>

        <Panel glow data-testid="card-balance" className="flex flex-col">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-white/50">Current Balance</span>
            <span className="tc-chip tc-chip-active"><span className="tc-chip-dot" /> {ACCOUNT.currency}</span>
          </div>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-[16px] text-white/55 font-semibold">$</span>
            <span className="font-heading text-[42px] font-bold tracking-[-0.03em] text-tradeWhite leading-none">
              {ACCOUNT.balance.toFixed(2)}
            </span>
          </div>
          <div className="mt-auto pt-5 flex gap-2.5">
            <button className="tc-btn tc-btn-primary flex-1" data-testid="btn-withdraw" onClick={() => setModal("withdraw")}>
              <ArrowDownToLine className="w-4 h-4" strokeWidth={2.2} /> Withdraw
            </button>
            <button className="tc-btn tc-btn-ghost" onClick={() => setModal("history")}>
              <History className="w-4 h-4" strokeWidth={2} /> History
            </button>
          </div>
        </Panel>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ACTIONS.map((a) => {
          const Icon = a.icon;
          return (
            <div key={a.title} onClick={() => setModal(a.key)} className={`tc-action ${a.danger ? "is-danger" : ""}`} data-testid={`action-${a.title.toLowerCase().replace(/\s+/g, "-")}`}>
              <span className="tc-action-ico"><Icon className="w-4 h-4" strokeWidth={2} /></span>
              <div className="min-w-0 flex-1">
                <div className="tc-action-title">{a.title}</div>
                <div className="tc-action-sub truncate">{a.sub}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/30 shrink-0" strokeWidth={2} />
            </div>
          );
        })}
      </div>

      {/* Stat tiles */}
      <div className="tc-statgrid">
        {STATS.map((s) => (
          <div key={s.key} className="tc-stat" data-testid={`stat-${s.key}`}>
            <div className="tc-stat-label">{s.label}</div>
            <div className={`tc-stat-value ${s.accent === "teal" ? "is-teal" : "is-white"}`}>{s.value}</div>
            {s.sub && (
              <div className="tc-stat-sub">
                {s.up && <TrendingUp className="w-3 h-3" strokeWidth={2.4} />} {s.sub}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Subscriptions + Pool */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Panel icon={Layers} title="Active Subscriptions" data-testid="card-subscriptions">
          <div className="flex flex-col gap-3">
            {SUBSCRIPTIONS.map((s) => (
              <div key={s.name} className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[13.5px] font-semibold text-tradeWhite">{s.name}</span>
                    <span className="tc-chip tc-chip-active"><span className="tc-chip-dot" /> {s.status}</span>
                  </div>
                  <div className="mt-1 font-mono text-[10.5px] text-white/45">Next payment · {s.next}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/30" strokeWidth={2} />
              </div>
            ))}
          </div>
        </Panel>

        <Panel glow icon={Coins} title="Trading Pool" link="Open" data-testid="card-pool" className="flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
            <div className="font-heading text-[52px] font-bold tracking-[-0.03em] leading-none text-tradeWhite">
              10<span className="text-tradeTeal">%</span>
            </div>
            <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/45 mt-2">/ Month</div>
            <p className="text-[13px] text-white/55 mt-3 max-w-[280px]">Deposit funds and earn 10% per month from pooled AI strategies.</p>
          </div>
        </Panel>
      </div>

      {/* VITRIOL + Mining */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Panel icon={Coins} title="V.I.T.R.I.O.L." link="vitriol.network" data-testid="card-vitriol">
          <div className="flex items-center gap-4">
            <span className="tc-action-ico" style={{ width: 46, height: 46 }}>
              <Coins className="w-5 h-5" strokeWidth={2} />
            </span>
            <div>
              <div className="font-mono text-[9.5px] tracking-[0.16em] uppercase text-white/45">Total Balance</div>
              <div className="font-heading text-[28px] font-bold tracking-[-0.02em] text-tradeWhite leading-none mt-1">
                0.00 <span className="text-[13px] text-white/45 font-mono font-normal">VITRIOL</span>
              </div>
              <div className="font-mono text-[11px] text-white/40 mt-1">≈ $0.00 USD</div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 font-mono text-[11px] text-white/55">
            <span className="truncate">{ACCOUNT.wallet}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-tradeTeal shrink-0" strokeWidth={2} />
          </div>
        </Panel>

        <Panel icon={Pickaxe} title="Mining Pool" data-testid="card-mining">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <Pickaxe className="w-5 h-5 text-white/40 shrink-0 mt-0.5" strokeWidth={1.8} />
            <p className="text-[13px] leading-[1.55] text-white/55">
              No mining pools yet. Activate the Mining Pool with a 12-month subscription to Analysis Bot,
              Trade Bot, or Trading Terminal. A Mining Pool is also created when you open a Trading Pool.
            </p>
          </div>
          <Link to="/app/automation" className="tc-btn tc-btn-ghost w-full mt-4">
            Explore products <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2} />
          </Link>
        </Panel>
      </div>

      {modal === "withdraw" && <WithdrawModal balance={ACCOUNT.balance} onClose={() => setModal(null)} />}
      {modal === "support" && <SupportModal onClose={() => setModal(null)} />}
      {modal === "twofa" && <TwoFAModal onClose={() => setModal(null)} />}
      {modal === "referrer" && <ReferralModal onClose={() => setModal(null)} />}
      {modal === "history" && (
        <ConfirmModal title="Withdrawal history" sub="No withdrawals yet"
          body="You haven't made any withdrawals. Completed withdrawals will appear here with date, amount, and status."
          confirmLabel="Close" onClose={() => setModal(null)} />
      )}
      {modal === "delete" && (
        <ConfirmModal title="Delete account" sub="This cannot be undone" danger confirmLabel="Request deletion"
          body="Requesting deletion will close your account and forfeit any active subscriptions, pool deposits, and rewards. Are you sure?"
          onClose={() => setModal(null)} />
      )}
    </div>
  );
}
