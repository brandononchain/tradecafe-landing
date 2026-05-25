import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { CalendarDays, PieChart, BarChart3, Clock, Share2 } from "lucide-react";
import { PageHead, Panel } from "../ui";
import { JOURNAL } from "../data";

const PERIODS = ["1W", "1M", "3M", "6M", "1Y", "ALL"];
const EXCHANGES = ["ALL", "Binance", "Bybit", "OKX"];

export default function Journal() {
  const [tab, setTab] = useState("dashboard");
  const [period, setPeriod] = useState("3M");
  const [exch, setExch] = useState("ALL");
  const [breakdown, setBreakdown] = useState("Hourly");

  return (
    <div className="tc-fade flex flex-col gap-6">
      <PageHead eyebrow="Trade Journal" title="Journal & Reports" desc="Review your trading performance, money management, and trade analytics." />

      {/* Global metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {JOURNAL.globalMetrics.map((m) => (
          <div key={m.k} className="tc-stat !p-3.5">
            <div className="tc-stat-label !mb-2 text-[9px]">{m.k}</div>
            <div className={`font-heading text-[19px] font-bold tracking-[-0.02em] ${m.up === true ? "text-tradeTeal" : m.up === false ? "text-[#FF8A82]" : "text-tradeWhite"}`}>{m.v}</div>
          </div>
        ))}
      </div>

      <div className="tc-segment w-full sm:w-[300px]">
        <div className={`tc-segment-btn ${tab === "dashboard" ? "is-active" : ""}`} onClick={() => setTab("dashboard")} data-testid="journal-tab-dashboard">Dashboard</div>
        <div className={`tc-segment-btn ${tab === "reports" ? "is-active" : ""}`} onClick={() => setTab("reports")} data-testid="journal-tab-reports">Reports</div>
      </div>

      {tab === "dashboard" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Panel icon={CalendarDays} title="This Month"><MiniCalendar /></Panel>
          <Panel icon={PieChart} title="Money Management"><MoneyDonut /></Panel>
          <Panel icon={BarChart3} title="Monthly PnL"><MonthlyBars /></Panel>
          <Panel icon={Clock} title="Hold Time"><HoldTime /></Panel>
        </div>
      ) : (
        <>
          {/* Filters */}
          <Panel>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 flex-wrap">
                {PERIODS.map((p) => (
                  <button key={p} onClick={() => setPeriod(p)}
                    className={`px-3 py-1.5 rounded-lg font-mono text-[10.5px] tracking-[0.08em] transition-colors ${period === p ? "bg-tradeTeal/15 text-tradeTeal" : "text-white/50 hover:text-white/80"}`}>{p}</button>
                ))}
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {EXCHANGES.map((e) => (
                  <button key={e} onClick={() => setExch(e)}
                    className={`px-3 py-1.5 rounded-full font-mono text-[9.5px] tracking-[0.1em] uppercase border transition-colors ${exch === e ? "bg-tradeTeal/15 text-tradeTeal border-tradeTeal/30" : "text-white/50 border-white/8"}`}>{e}</button>
                ))}
              </div>
            </div>
          </Panel>

          {/* Cumulative chart */}
          <Panel glow>
            <div className="flex items-baseline justify-between mb-3">
              <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-white/45">Accumulative Return (Net)</span>
              <span className="font-heading text-[22px] font-bold text-tradeTeal tracking-[-0.02em]">+$2,914</span>
            </div>
            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer>
                <AreaChart data={JOURNAL.cumulative} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="jfill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00B4A6" stopOpacity={0.32} />
                      <stop offset="100%" stopColor="#00B4A6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="t" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} width={44} />
                  <Tooltip contentStyle={{ background: "#041014", border: "1px solid rgba(0,180,166,0.3)", borderRadius: 8, fontSize: 12 }} labelStyle={{ color: "rgba(255,255,255,0.5)" }} />
                  <Area type="monotone" dataKey="v" stroke="#00B4A6" strokeWidth={2} fill="url(#jfill)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          {/* Metric cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {JOURNAL.metricCards.map((c) => (
              <div key={c.k} className="tc-stat !p-4">
                <div className="tc-stat-label !mb-2 text-[9px]">{c.k}</div>
                <div className={`font-heading text-[20px] font-bold tracking-[-0.02em] ${c.v.startsWith("-") ? "text-[#FF8A82]" : "text-tradeWhite"}`}>{c.v}</div>
                <div className="mt-2.5 h-1 rounded-full bg-white/8 overflow-hidden">
                  <div className="h-full bg-tradeTeal" style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Breakdown + recent trades */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-5">
            <Panel title="Trade Breakdown" icon={BarChart3}>
              <div className="flex flex-wrap gap-1.5">
                {JOURNAL.breakdowns.map((b) => (
                  <button key={b} onClick={() => setBreakdown(b)}
                    className={`px-3 py-1.5 rounded-full text-[11px] border transition-colors ${breakdown === b ? "bg-tradeTeal/15 text-tradeTeal border-tradeTeal/30" : "text-white/55 border-white/8 hover:text-white/85"}`}>{b}</button>
                ))}
              </div>
              <div className="mt-4 flex items-end gap-1.5 h-[120px]">
                {[40, 65, 30, 80, 55, 72, 45, 90, 60].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-tradeTeal/30 to-tradeTeal/70" style={{ height: `${h}%` }} />
                ))}
              </div>
              <div className="mt-2 font-mono text-[10px] text-white/40 text-center">{breakdown} distribution</div>
            </Panel>

            <Panel title="Recent Trades" icon={Share2}>
              <div className="tc-table-wrap">
                <table className="tc-table">
                  <thead><tr><th>Status</th><th>Date</th><th>Symbol</th><th>Return</th><th>Side</th></tr></thead>
                  <tbody>
                    {JOURNAL.recentTrades.map((t, i) => (
                      <tr key={i}>
                        <td><StatusBadge s={t.status} /></td>
                        <td className="mono text-white/55">{t.date}</td>
                        <td className="sym">{t.sym}</td>
                        <td><span className={t.ret.startsWith("-") ? "tc-pl-neg" : "tc-pl-pos"}>{t.ret}</span></td>
                        <td><span className={t.side === "LONG" ? "tc-tag-long" : "tc-tag-short"}>{t.side}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        </>
      )}
    </div>
  );
}

function StatusBadge({ s }) {
  const map = {
    WIN: "tc-tag-long",
    LOSS: "tc-tag-short",
    OPEN: "tc-chip tc-chip-active",
  };
  return <span className={map[s]}>{s}</span>;
}

function MiniCalendar() {
  const days = Array.from({ length: 35 }, (_, i) => i - 2); // offset start
  const pnl = (d) => (d > 0 && d <= 31 ? ((d * 37) % 11) - 4 : null);
  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="text-center font-mono text-[9px] text-white/35">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => {
          const valid = d > 0 && d <= 31;
          const p = pnl(d);
          const tone = p == null ? "" : p > 0 ? "bg-tradeTeal/12 text-tradeTeal" : p < 0 ? "bg-[#F23645]/12 text-[#FF8A82]" : "";
          return (
            <div key={i} className={`aspect-square rounded-md flex items-center justify-center text-[10px] ${valid ? `border border-white/5 ${tone}` : "opacity-0"}`}>
              {valid ? d : ""}
            </div>
          );
        })}
      </div>
      <div className="mt-3 font-mono text-[10px] text-white/45 text-center">18 trading days this month</div>
    </div>
  );
}

function MoneyDonut() {
  const total = JOURNAL.exchanges.reduce((a, e) => a + e.balance, 0);
  let offset = 0;
  const R = 52;
  const C = 2 * Math.PI * R;
  return (
    <div className="flex items-center gap-5">
      <div className="relative shrink-0" style={{ width: 130, height: 130 }}>
        <svg viewBox="0 0 130 130" className="-rotate-90">
          {JOURNAL.exchanges.map((e) => {
            const frac = e.balance / total;
            const dash = `${frac * C} ${C}`;
            const el = (
              <circle key={e.name} cx="65" cy="65" r={R} fill="none" stroke={e.color} strokeWidth="13"
                strokeDasharray={dash} strokeDashoffset={-offset} />
            );
            offset += frac * C;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-[9px] text-white/40">Total</span>
          <span className="font-heading text-[18px] font-bold text-tradeWhite">${(total / 1000).toFixed(1)}K</span>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-2.5">
        {JOURNAL.exchanges.map((e) => (
          <div key={e.name} className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: e.color }} />
            <span className="text-[12.5px] text-white/75 flex-1">{e.name}</span>
            <span className="font-mono text-[12px] text-white/85">${e.balance.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MonthlyBars() {
  const max = Math.max(...JOURNAL.monthly.map((m) => Math.abs(m.v)));
  return (
    <div className="flex items-center gap-2 h-[150px]">
      {JOURNAL.monthly.map((m) => (
        <div key={m.m} className="flex-1 flex flex-col items-center justify-end h-full gap-1">
          <div className="w-full flex-1 flex flex-col justify-end">
            <div className={`w-full rounded-sm ${m.v >= 0 ? "bg-tradeTeal/70" : "bg-[#F23645]/60"}`} style={{ height: `${(Math.abs(m.v) / max) * 100}%` }} />
          </div>
          <span className="font-mono text-[8px] text-white/40">{m.m}</span>
        </div>
      ))}
    </div>
  );
}

function HoldTime() {
  const max = Math.max(...JOURNAL.holdTime.map((h) => Math.abs(h.v)));
  return (
    <div className="flex flex-col gap-2">
      {JOURNAL.holdTime.map((h) => (
        <div key={h.b} className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-white/45 w-14 shrink-0">{h.b}</span>
          <span className="flex-1 h-3 rounded bg-white/5 overflow-hidden">
            <span className={`block h-full ${h.v >= 0 ? "bg-tradeTeal/60" : "bg-[#F23645]/55"}`} style={{ width: `${(Math.abs(h.v) / max) * 100}%` }} />
          </span>
          <span className={`font-mono text-[10.5px] w-12 text-right ${h.v >= 0 ? "text-tradeTeal" : "text-[#FF8A82]"}`}>{h.v >= 0 ? "+" : ""}{h.v}</span>
        </div>
      ))}
    </div>
  );
}
