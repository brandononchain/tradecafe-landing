import { Users, Copy, Check, Share2 } from "lucide-react";
import { useState } from "react";
import { PageHead, Panel } from "../ui";
import { AFFILIATE } from "../data";

export default function Affiliate() {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(AFFILIATE.referralUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="tc-fade flex flex-col gap-6">
      <PageHead
        eyebrow="Partner Network"
        title="Affiliate Program"
        desc="Grow your network and earn from referrals, ranks, and pooled partner rewards."
      />

      <div className="tc-statgrid">
        {AFFILIATE.stats.map((s) => (
          <div key={s.k} className="tc-stat">
            <div className="tc-stat-label">{s.k}</div>
            <div className={`tc-stat-value ${s.k.includes("Earn") || s.k.includes("Unpaid") ? "is-teal" : "is-white"}`}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Referral link */}
      <Panel glow icon={Share2} title="Your Referral Link">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center px-4 py-3 rounded-xl bg-white/[0.025] border border-white/8 font-mono text-[12.5px] text-white/75 truncate">
            {AFFILIATE.referralUrl}
          </div>
          <button className="tc-btn tc-btn-primary sm:w-auto" onClick={copy} data-testid="copy-referral">
            {copied ? <Check className="w-4 h-4" strokeWidth={2.4} /> : <Copy className="w-4 h-4" strokeWidth={2} />}
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>
        <div className="mt-3 font-mono text-[11px] text-white/45">
          Code · <span className="text-tradeTeal">{AFFILIATE.referralCode}</span>
        </div>
      </Panel>

      {/* Rank progression */}
      <Panel icon={Users} title="Rank Progression">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {AFFILIATE.ranks.map((r, i) => {
            const active = i <= AFFILIATE.rankIndex;
            const current = i === AFFILIATE.rankIndex;
            return (
              <div key={r} className="flex items-center gap-2 shrink-0">
                <div className="flex flex-col items-center gap-2">
                  <span
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-[12px] border ${
                      current
                        ? "bg-tradeTeal/15 border-tradeTeal/50 text-tradeTeal"
                        : active
                        ? "bg-tradeTeal/8 border-tradeTeal/25 text-tradeTeal/80"
                        : "bg-white/[0.03] border-white/8 text-white/40"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className={`text-[11px] font-medium ${current ? "text-white" : "text-white/55"}`}>{r}</span>
                </div>
                {i < AFFILIATE.ranks.length - 1 && (
                  <span className={`w-8 h-px ${active ? "bg-tradeTeal/40" : "bg-white/10"}`} />
                )}
              </div>
            );
          })}
        </div>
      </Panel>

      {/* Recent referrals */}
      <Panel icon={Users} title="Recent Referrals">
        <div className="tc-table-wrap">
          <table className="tc-table">
            <thead>
              <tr><th>User</th><th>Tier</th><th>Joined</th><th>Earned</th></tr>
            </thead>
            <tbody>
              {AFFILIATE.recent.map((r, i) => (
                <tr key={i}>
                  <td className="text-white/85 font-medium">{r.user}</td>
                  <td className="text-white/60">{r.tier}</td>
                  <td className="mono text-white/55">{r.joined}</td>
                  <td><span className="tc-pl-pos">{r.earned}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
