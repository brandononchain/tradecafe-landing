import { useMemo, useState, lazy, Suspense } from "react";
import { Users, Copy, Check, Share2, TrendingUp, Award, Sparkles, Network, ChevronRight, Search } from "lucide-react";
import { PageHead, Panel } from "../ui";
import { AFFILIATE, AFFILIATE_TREE } from "../data";
import { useTheme } from "../ThemeContext";

const AffiliateGraph = lazy(() => import("../components/AffiliateGraph"));

const fmtMoney = (n) => `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

export default function Affiliate() {
  const { mode } = useTheme();
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [, setHoverId] = useState(null);
  const [filter, setFilter] = useState("");
  const [tierFilter, setTierFilter] = useState("All");

  const copy = (text, kind) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    if (kind === "url") { setCopied(true); setTimeout(() => setCopied(false), 1600); }
    else { setCodeCopied(true); setTimeout(() => setCodeCopied(false), 1600); }
  };

  const { currentRank, nextRank, progress, toNext } = useMemo(() => {
    const turnover = AFFILIATE.turnover;
    let idx = 0;
    for (let i = 0; i < AFFILIATE.ranks.length; i++) {
      if (turnover >= AFFILIATE.ranks[i].min) idx = i;
    }
    const current = AFFILIATE.ranks[idx];
    const next = AFFILIATE.ranks[idx + 1];
    const p = next ? Math.min(1, (turnover - current.min) / (next.min - current.min)) : 1;
    const remaining = next ? next.min - turnover : 0;
    return { currentRank: current, nextRank: next, progress: p, toNext: remaining };
  }, []);

  const flatRefs = useMemo(() => AFFILIATE_TREE.filter((n) => n.parentId !== null), []);
  const childCount = useMemo(() => {
    const m = new Map();
    for (const n of AFFILIATE_TREE) if (n.parentId) m.set(n.parentId, (m.get(n.parentId) || 0) + 1);
    return m;
  }, []);
  const totalNetworkEarned = useMemo(() => flatRefs.reduce((s, n) => s + n.earned, 0), [flatRefs]);
  const directCount = flatRefs.filter((n) => n.depth === 1).length;

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return flatRefs.filter((n) => {
      if (tierFilter !== "All" && n.tier !== tierFilter) return false;
      if (!q) return true;
      return n.name.toLowerCase().includes(q) || (n.country || "").toLowerCase().includes(q);
    });
  }, [filter, tierFilter, flatRefs]);

  const selectedNode = selectedId ? AFFILIATE_TREE.find((n) => n.id === selectedId) : null;
  const selectedChildren = selectedNode ? flatRefs.filter((n) => n.parentId === selectedNode.id) : [];
  const selectedParent = selectedNode ? AFFILIATE_TREE.find((n) => n.id === selectedNode.parentId) : null;

  return (
    <div className="tc-fade flex flex-col gap-5">
      <PageHead
        eyebrow="Partner Network"
        title="Affiliate Program"
        desc="Grow your network and earn from referrals, ranks, and pooled partner rewards."
      >
        <span className="tc-chip tc-chip-active"><span className="tc-chip-dot" /> Program active</span>
      </PageHead>

      <div className="tc-statgrid">
        {AFFILIATE.stats.map((s) => (
          <div key={s.k} className="tc-stat">
            <div className="tc-stat-label">{s.k}</div>
            <div className={`tc-stat-value ${s.k.includes("Earn") || s.k.includes("Unpaid") ? "is-teal" : "is-white"}`}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Row 1 — Rank progression + commission levels */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-5">
        <Panel icon={Award} title="Rank Progression">
          <div className="flex flex-col gap-5">
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-white/45">Current rank</div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-heading text-[28px] font-bold tracking-[-0.02em] text-tradeWhite">{currentRank.name}</span>
                  <span className="hidden sm:inline font-mono text-[11px] text-tradeTeal">{currentRank.perks}</span>
                </div>
              </div>
              {nextRank && (
                <div className="text-right">
                  <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-white/45">Next</div>
                  <div className="font-heading text-[16px] font-semibold text-white mt-1">{nextRank.name}</div>
                  <div className="font-mono text-[11px] text-white/55">{fmtMoney(toNext)} to go</div>
                </div>
              )}
            </div>

            <div className="relative h-12">
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 rounded-full bg-white/[0.05] overflow-hidden">
                <div className="h-full bg-gradient-to-r from-tradeTeal/40 via-tradeTeal to-tradeTeal/80" style={{ width: `${Math.max(2, progress * 100)}%` }} />
              </div>
              <div className="absolute inset-x-0 top-0 h-full flex justify-between">
                {AFFILIATE.ranks.map((r) => {
                  const reached = AFFILIATE.turnover >= r.min;
                  const isCurrent = r.name === currentRank.name;
                  return (
                    <div key={r.name} className="flex flex-col items-center gap-1.5" style={{ width: 0 }}>
                      <span className={`w-3 h-3 rounded-full border-2 mt-[18px] ${isCurrent ? "border-tradeTeal bg-tradeTeal" : reached ? "border-tradeTeal/60 bg-tradeTeal/30" : "border-white/15 bg-[#04161A]"}`} />
                      <span className={`font-mono text-[9px] tracking-[0.08em] uppercase whitespace-nowrap ${isCurrent ? "text-tradeTeal" : reached ? "text-white/65" : "text-white/35"}`}>
                        {r.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-white/[0.04]">
              <SubStat k="Turnover" v={fmtMoney(AFFILIATE.turnover)} />
              <SubStat k="To next rank" v={nextRank ? fmtMoney(toNext) : "Maxed"} accent={!!nextRank} />
              <SubStat k="Progress" v={`${Math.round(progress * 100)}%`} />
            </div>
          </div>
        </Panel>

        <Panel icon={Sparkles} title="Commission Levels">
          <div className="flex flex-col gap-1.5">
            {AFFILIATE.commissionLevels.map((l) => (
              <div key={l.level} className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/40 w-10">L{l.level}</span>
                  <span className="text-[12.5px] text-white/80">{l.label}</span>
                </div>
                <span className="font-mono text-[13px] font-semibold text-tradeTeal">{l.pct}%</span>
              </div>
            ))}
            <div className="flex items-center justify-between px-3 py-2.5 mt-1 rounded-lg bg-tradeTeal/[0.06] border border-tradeTeal/20">
              <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-tradeTeal">Across all levels</span>
              <span className="font-mono text-[13px] font-semibold text-tradeTeal">
                {AFFILIATE.commissionLevels.reduce((s, l) => s + l.pct, 0)}%
              </span>
            </div>
          </div>
        </Panel>
      </div>

      {/* Row 2 — Referral link + earnings */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-5">
        <Panel glow icon={Share2} title="Your Referral Link">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="flex-1 flex items-center px-4 py-3 rounded-xl bg-white/[0.025] border border-white/[0.05] font-mono text-[12.5px] text-white/80 truncate">
              {AFFILIATE.referralUrl}
            </div>
            <button className="tc-btn tc-btn-primary sm:w-auto" onClick={() => copy(AFFILIATE.referralUrl, "url")} data-testid="copy-referral">
              {copied ? <Check className="w-4 h-4" strokeWidth={2.4} /> : <Copy className="w-4 h-4" strokeWidth={2} />}
              {copied ? "Copied" : "Copy link"}
            </button>
          </div>
          <div className="mt-3 flex items-center gap-3 flex-wrap">
            <button onClick={() => copy(AFFILIATE.referralCode, "code")} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] hover:border-tradeTeal/30 transition-colors" data-testid="copy-code">
              <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-white/45">Code</span>
              <span className="font-mono text-[12px] text-tradeTeal">{AFFILIATE.referralCode}</span>
              {codeCopied ? <Check className="w-3 h-3 text-tradeTeal" strokeWidth={2.4} /> : <Copy className="w-3 h-3 text-white/45" strokeWidth={2} />}
            </button>
            <span className="font-mono text-[11px] text-white/40">Share anywhere — pays from L1 to L5.</span>
          </div>
        </Panel>

        <Panel icon={TrendingUp} title="Earnings">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="font-mono text-[9.5px] tracking-[0.14em] uppercase text-white/40">Total earned</div>
              <div className="font-heading text-[24px] font-bold text-tradeTeal mt-1">{fmtMoney(totalNetworkEarned * 0.1)}</div>
              <div className="font-mono text-[10px] text-white/35 mt-1">Across all levels</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="font-mono text-[9.5px] tracking-[0.14em] uppercase text-white/40">Unpaid</div>
              <div className="font-heading text-[24px] font-bold text-tradeWhite mt-1">{fmtMoney(AFFILIATE.unpaid)}</div>
              <div className="font-mono text-[10px] text-white/35 mt-1">Settles weekly</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] col-span-2">
              <div className="font-mono text-[9.5px] tracking-[0.14em] uppercase text-white/40">Network turnover</div>
              <div className="font-heading text-[20px] font-bold text-white mt-1">{fmtMoney(AFFILIATE.turnover)}</div>
              <div className="font-mono text-[10px] text-white/35 mt-1">{directCount} direct · {flatRefs.length} total</div>
            </div>
          </div>
        </Panel>
      </div>

      {/* Row 3 — Live 3D graph */}
      <Panel icon={Network} title="Your Network · Live Graph">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-3">
          <div className="relative rounded-xl bg-[#02090C] border border-white/[0.04] overflow-hidden" style={{ height: 520 }}>
            <Suspense fallback={<GraphFallback />}>
              <AffiliateGraph
                nodes={AFFILIATE_TREE}
                selectedId={selectedId}
                onSelect={(id) => setSelectedId((cur) => cur === id ? null : id)}
                onHover={setHoverId}
                light={mode === "light"}
              />
            </Suspense>
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-black/45 backdrop-blur-sm border border-white/[0.06]">
                <span className="trade-pulse-dot w-1.5 h-1.5 rounded-full bg-tradeTeal inline-block" />
                <span className="font-mono text-[9.5px] tracking-[0.14em] uppercase text-white/65">{AFFILIATE_TREE.length} nodes · live</span>
              </div>
              <div className="hidden sm:block font-mono text-[9.5px] tracking-[0.14em] uppercase text-white/35">drag · scroll · click</div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {selectedNode ? (
              <NodeDetail node={selectedNode} childrenOf={selectedChildren} onClear={() => setSelectedId(null)} parentName={selectedParent?.name} />
            ) : (
              <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-tradeTeal" strokeWidth={2} />
                  <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-tradeTeal/90">How to read this</span>
                </div>
                <p className="text-[12.5px] text-white/65 leading-[1.6]">
                  You're the bright node at the center. Each ring outward is a level of your network — Direct, Tier&nbsp;2, Tier&nbsp;3. Click any node to see who they brought in.
                </p>
              </div>
            )}

            <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-4">
              <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/45 mb-3">By tier</div>
              {[1, 2, 3].map((d) => {
                const count = flatRefs.filter((n) => n.depth === d).length;
                const earned = flatRefs.filter((n) => n.depth === d).reduce((s, n) => s + n.earned, 0);
                const pct = AFFILIATE.commissionLevels[d - 1]?.pct || 0;
                return (
                  <div key={d} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${d === 1 ? "bg-tradeTeal" : d === 2 ? "bg-tradeTeal/60" : "bg-tradeTeal/35"}`} />
                      <span className="text-[12.5px] text-white/80">Tier {d}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10.5px] text-white/50">{count}</span>
                      <span className="font-mono text-[10.5px] text-tradeTeal">{fmtMoney(earned * pct / 100)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Panel>

      {/* Row 4 — Referrals list */}
      <Panel icon={Users} title="Referral Structure">
        <div className="flex flex-col sm:flex-row gap-2.5 mb-4">
          <div className="tc-search flex-1">
            <Search className="w-4 h-4 text-white/35" strokeWidth={2} />
            <input
              placeholder="Search by username or country…"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              data-testid="referral-search"
            />
          </div>
          <div className="flex items-center gap-1 p-1 rounded-lg bg-white/[0.025] border border-white/[0.05]">
            {["All", "Direct", "Tier 2", "Tier 3"].map((t) => (
              <button
                key={t}
                onClick={() => setTierFilter(t)}
                className={`px-3 py-1.5 rounded-md font-mono text-[10px] tracking-[0.08em] uppercase transition-colors ${tierFilter === t ? "bg-tradeTeal/15 text-tradeTeal" : "text-white/55 hover:text-white/85"}`}
                data-testid={`tier-filter-${t.replace(/\s+/g, "-").toLowerCase()}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="tc-table-wrap">
          <table className="tc-table" data-testid="referral-structure">
            <thead>
              <tr>
                <th>User</th><th>Tier</th><th>Country</th><th>Joined</th><th>Brought in</th><th>Their turnover</th><th>Your cut</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="py-8 text-center text-white/45 text-[12.5px]">No referrals match.</td></tr>
              )}
              {filtered.slice(0, 24).map((r) => {
                const cut = (AFFILIATE.commissionLevels[r.depth - 1]?.pct || 0) * r.earned / 100;
                return (
                  <tr
                    key={r.id}
                    className={selectedId === r.id ? "is-active" : ""}
                    onMouseEnter={() => setHoverId(r.id)}
                    onMouseLeave={() => setHoverId(null)}
                  >
                    <td className="text-white/85 font-medium">{r.name}</td>
                    <td>
                      <span className={`font-mono text-[10px] tracking-[0.08em] uppercase px-2 py-0.5 rounded-full border ${r.depth === 1 ? "text-tradeTeal border-tradeTeal/30 bg-tradeTeal/10" : r.depth === 2 ? "text-white/65 border-white/15 bg-white/[0.03]" : "text-white/45 border-white/10 bg-white/[0.015]"}`}>
                        {r.tier}
                      </span>
                    </td>
                    <td className="text-white/55 font-mono text-[11px]">{r.country}</td>
                    <td className="mono text-white/55">{r.joined}</td>
                    <td className="mono text-white/70">{childCount.get(r.id) || 0}</td>
                    <td className="mono text-white/55">{fmtMoney(r.earned)}</td>
                    <td><span className="tc-pl-pos">{fmtMoney(cut)}</span></td>
                    <td className="text-right">
                      <button onClick={() => setSelectedId(r.id)} aria-label="Show in graph" className="text-white/40 hover:text-tradeTeal transition-colors">
                        <ChevronRight className="w-4 h-4" strokeWidth={2} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length > 24 && (
          <div className="mt-3 font-mono text-[10.5px] text-white/35 text-center">
            Showing 24 of {filtered.length}. Use search or tier filter to narrow.
          </div>
        )}
      </Panel>
    </div>
  );
}

function SubStat({ k, v, accent }) {
  return (
    <div className="text-center p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
      <div className="font-mono text-[9.5px] tracking-[0.12em] uppercase text-white/40">{k}</div>
      <div className={`font-heading text-[15px] font-semibold mt-0.5 ${accent ? "text-tradeTeal" : "text-white/90"}`}>{v}</div>
    </div>
  );
}

function NodeDetail({ node, childrenOf, onClear, parentName }) {
  const earnedChildren = childrenOf.reduce((s, n) => s + n.earned, 0);
  return (
    <div className="rounded-xl bg-tradeTeal/[0.05] border border-tradeTeal/20 p-4" data-testid="graph-node-detail">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-tradeTeal mb-1">{node.tier} · {node.country}</div>
          <div className="font-heading text-[18px] font-semibold text-white">{node.name}</div>
          {parentName && <div className="font-mono text-[10.5px] text-white/45 mt-1">Brought in by {parentName}</div>}
        </div>
        <button onClick={onClear} className="font-mono text-[10px] text-white/40 hover:text-white/80" aria-label="Clear selection">clear</button>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-3">
        <Mini k="Earned" v={`$${node.earned}`} teal />
        <Mini k="Joined" v={node.joined} />
        <Mini k="Brought in" v={childrenOf.length} />
      </div>
      {childrenOf.length > 0 && (
        <div className="mt-3">
          <div className="font-mono text-[9.5px] tracking-[0.14em] uppercase text-white/45 mb-1.5">
            Their sub-network · {childrenOf.length} · ${earnedChildren} earned
          </div>
          <div className="flex flex-wrap gap-1.5">
            {childrenOf.slice(0, 8).map((c) => (
              <span key={c.id} className="font-mono text-[10px] px-1.5 py-0.5 rounded border border-white/[0.08] bg-white/[0.025] text-white/65">{c.name}</span>
            ))}
            {childrenOf.length > 8 && <span className="font-mono text-[10px] text-white/35">+{childrenOf.length - 8} more</span>}
          </div>
        </div>
      )}
    </div>
  );
}

function Mini({ k, v, teal }) {
  return (
    <div className="text-center p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
      <div className="font-mono text-[8.5px] tracking-[0.08em] uppercase text-white/40">{k}</div>
      <div className={`font-mono text-[12px] mt-0.5 ${teal ? "text-tradeTeal" : "text-white/85"}`}>{v}</div>
    </div>
  );
}

function GraphFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-white/40">Loading network…</div>
    </div>
  );
}
