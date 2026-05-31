import { useMemo, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { CalendarDays, PieChart, BarChart3, Clock, Share2, ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from "lucide-react";
import { PageHead, Panel } from "../ui";
import { JOURNAL } from "../data";

const PERIODS = ["1W", "1M", "3M", "6M", "1Y", "ALL"];
const EXCHANGES = ["ALL", "Binance", "Bybit", "OKX"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const fmtMoney = (n) => `${n >= 0 ? "+" : "-"}$${Math.abs(n).toLocaleString()}`;

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
                    className={`px-3 py-1.5 rounded-full font-mono text-[9.5px] tracking-[0.1em] uppercase border transition-colors ${exch === e ? "bg-tradeTeal/15 text-tradeTeal border-tradeTeal/30" : "text-white/50 border-white/[0.05]"}`}>{e}</button>
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
                  <CartesianGrid stroke="rgb(var(--tc-ink-rgb) / 0.07)" vertical={false} />
                  <XAxis dataKey="t" tick={{ fill: "rgb(var(--tc-ink-rgb) / 0.45)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgb(var(--tc-ink-rgb) / 0.45)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} width={48} domain={[0, 3000]} ticks={[0, 750, 1500, 2250, 3000]} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v} />
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
                    className={`px-3 py-1.5 rounded-full text-[11px] border transition-colors ${breakdown === b ? "bg-tradeTeal/15 text-tradeTeal border-tradeTeal/30" : "text-white/55 border-white/[0.05] hover:text-white/85"}`}>{b}</button>
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
  const today = new Date();
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  // Deterministic mock PnL per day, seeded by month so each month feels different.
  const dayPnl = useMemo(() => {
    const seed = (cursor.year * 13 + cursor.month + 1) * 31;
    const days = new Date(cursor.year, cursor.month + 1, 0).getDate();
    const out = {};
    for (let d = 1; d <= days; d++) {
      const wd = new Date(cursor.year, cursor.month, d).getDay();
      // No trading on Sat/Sun, light otherwise. A few zero days mid-month.
      if (wd === 0 || wd === 6) { out[d] = 0; continue; }
      const r = ((seed + d * 91) % 100) - 38; // -38..+61 distribution
      if (r > -5 && r < 5) { out[d] = 0; continue; }
      out[d] = Math.round(r * 11); // ≈ -$420..+$680
    }
    return out;
  }, [cursor]);

  const firstDow = new Date(cursor.year, cursor.month, 1).getDay();
  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();
  const cells = Array.from({ length: 42 }, (_, i) => {
    const d = i - firstDow + 1;
    return d >= 1 && d <= daysInMonth ? d : null;
  });

  const tradingDays = Object.values(dayPnl).filter((v) => v !== 0).length;
  const monthPnl = Object.values(dayPnl).reduce((a, v) => a + v, 0);
  const selectedPnl = dayPnl[selectedDay] ?? null;
  const shiftMonth = (delta) => {
    const m = cursor.month + delta;
    const year = cursor.year + Math.floor(m / 12);
    const month = ((m % 12) + 12) % 12;
    setCursor({ year, month });
    setSelectedDay(1);
  };

  return (
    <div data-testid="journal-calendar">
      {/* Header: prev / month + year / next */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => shiftMonth(-1)} className="tc-iconbtn" style={{ width: 28, height: 28 }} aria-label="Previous month" data-testid="cal-prev">
          <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2} />
        </button>
        <span className="font-heading text-[14px] font-semibold text-tradeWhite">
          {MONTH_NAMES[cursor.month]} <span className="text-white/45 font-normal">{cursor.year}</span>
        </span>
        <button onClick={() => shiftMonth(1)} className="tc-iconbtn" style={{ width: 28, height: 28 }} aria-label="Next month" data-testid="cal-next">
          <ChevronRight className="w-3.5 h-3.5" strokeWidth={2} />
        </button>
      </div>

      {/* Month totals */}
      <div className="flex items-center justify-between mb-3 px-1 font-mono text-[10px]">
        <span className="text-white/40">{tradingDays} trading days</span>
        <span className={monthPnl >= 0 ? "text-tradeTeal" : "text-[#FF8A82]"}>{fmtMoney(monthPnl)}</span>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="text-center font-mono text-[9px] text-white/35">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d == null) return <div key={i} className="aspect-square" />;
          const p = dayPnl[d];
          const isSelected = d === selectedDay;
          const tone = !p ? "text-white/45" : p > 0 ? "text-tradeTeal" : "text-[#FF8A82]";
          const bg = !p ? "bg-white/[0.02] border-white/[0.04]"
            : p > 0 ? "bg-tradeTeal/10 border-tradeTeal/25"
            : "bg-[#F23645]/10 border-[#F23645]/25";
          return (
            <button key={i} onClick={() => setSelectedDay(d)} type="button"
              title={p ? `${MONTH_NAMES[cursor.month]} ${d} · ${fmtMoney(p)}` : `${MONTH_NAMES[cursor.month]} ${d}`}
              data-testid={`cal-day-${d}`}
              className={`aspect-square rounded-md flex items-center justify-center text-[10.5px] border transition-all ${bg} ${tone} ${isSelected ? "ring-1 ring-tradeTeal/60 scale-[1.04]" : "hover:scale-[1.04]"}`}>
              {d}
            </button>
          );
        })}
      </div>

      {/* Selected-day footer */}
      <div className="mt-3 flex items-center justify-between px-1 font-mono text-[10.5px]">
        <span className="text-white/55">
          {selectedDay ? `${MONTH_NAMES[cursor.month]} ${selectedDay}` : "Select a day"}
        </span>
        <span className={!selectedPnl ? "text-white/40" : selectedPnl > 0 ? "text-tradeTeal" : "text-[#FF8A82]"}>
          {selectedPnl == null ? "—" : selectedPnl === 0 ? "No trades" : fmtMoney(selectedPnl)}
        </span>
      </div>
    </div>
  );
}

function MoneyDonut() {
  const total = JOURNAL.exchanges.reduce((a, e) => a + e.balance, 0);
  const monthPnl = JOURNAL.monthly[JOURNAL.monthly.length - 1].v;
  const monthPct = (monthPnl / total) * 100;
  let offset = 0;
  const R = 56;
  const C = 2 * Math.PI * R;
  return (
    <div className="flex flex-col gap-4" data-testid="journal-money">
      <div className="flex items-center gap-5">
        <div className="relative shrink-0" style={{ width: 140, height: 140 }}>
          <svg viewBox="0 0 140 140" className="-rotate-90">
            {JOURNAL.exchanges.map((e) => {
              const frac = e.balance / total;
              const dash = `${frac * C} ${C}`;
              const el = (
                <circle key={e.name} cx="70" cy="70" r={R} fill="none" stroke={e.color} strokeWidth="14"
                  strokeDasharray={dash} strokeDashoffset={-offset} strokeLinecap="butt" />
              );
              offset += frac * C;
              return el;
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-white/40">Total</span>
            <span className="font-heading text-[22px] font-bold text-tradeWhite">${(total / 1000).toFixed(1)}K</span>
            <span className={`font-mono text-[10px] mt-0.5 ${monthPnl >= 0 ? "text-tradeTeal" : "text-[#FF8A82]"}`}>
              {monthPnl >= 0 ? "+" : ""}{monthPct.toFixed(1)}% MTD
            </span>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2.5">
          {JOURNAL.exchanges.map((e) => {
            const pct = (e.balance / total) * 100;
            return (
              <div key={e.name}>
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: e.color }} />
                  <span className="text-[12.5px] text-white/85 flex-1 font-medium">{e.name}</span>
                  <span className="font-mono text-[12px] text-white/85">${e.balance.toLocaleString()}</span>
                </div>
                <div className="mt-1.5 ml-5 flex items-center gap-2">
                  <span className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                    <span className="block h-full rounded-full" style={{ width: `${pct}%`, background: e.color }} />
                  </span>
                  <span className="font-mono text-[10px] text-white/45 w-10 text-right">{pct.toFixed(1)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer stats — fills the desktop column instead of leaving it sparse */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/[0.05]">
        {[
          { k: "Best", v: "Binance", tone: "teal", sub: `${((6240 / total) * 100).toFixed(0)}%` },
          { k: "Month PnL", v: fmtMoney(monthPnl), tone: monthPnl >= 0 ? "teal" : "neg" },
          { k: "Connected", v: `${JOURNAL.exchanges.length} venues`, sub: "Read + trade" },
        ].map((s) => (
          <div key={s.k} className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-2.5">
            <div className="font-mono text-[8.5px] tracking-[0.12em] uppercase text-white/40 mb-1">{s.k}</div>
            <div className={`font-mono text-[12.5px] font-semibold ${s.tone === "teal" ? "text-tradeTeal" : s.tone === "neg" ? "text-[#FF8A82]" : "text-tradeWhite"}`}>{s.v}</div>
            {s.sub && <div className="font-mono text-[9.5px] text-white/40 mt-0.5">{s.sub}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function MonthlyBars() {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const max = Math.max(...JOURNAL.monthly.map((m) => Math.abs(m.v))) || 1;
  const activeIdx = hovered ?? selected;
  const activeMonth = activeIdx != null ? JOURNAL.monthly[activeIdx] : null;
  const totalPnl = JOURNAL.monthly.reduce((a, m) => a + m.v, 0);
  const summary = activeMonth ? activeMonth : { m: "Year", v: totalPnl };

  return (
    <div data-testid="journal-monthly">
      <div className="flex items-baseline justify-between mb-2.5">
        <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-white/45">
          {activeMonth ? activeMonth.m : "Year to date"}
        </span>
        <span className={`font-heading text-[18px] font-semibold ${summary.v >= 0 ? "text-tradeTeal" : "text-[#FF8A82]"}`}>
          {fmtMoney(summary.v)}
        </span>
      </div>
      <div className="flex items-end gap-1.5 h-[150px]" onMouseLeave={() => setHovered(null)}>
        {JOURNAL.monthly.map((m, i) => {
          const h = (Math.abs(m.v) / max) * 100;
          const isActive = activeIdx === i;
          return (
            <button key={m.m} type="button"
              onMouseEnter={() => setHovered(i)}
              onClick={() => setSelected(selected === i ? null : i)}
              title={`${m.m} · ${fmtMoney(m.v)}`}
              data-testid={`bar-${m.m}`}
              className="group flex-1 flex flex-col items-center justify-end h-full gap-1 cursor-pointer">
              <div className="w-full flex-1 flex flex-col justify-end relative">
                <div className={`w-full rounded-sm transition-all ${m.v >= 0 ? "bg-tradeTeal/70 group-hover:bg-tradeTeal" : "bg-[#F23645]/60 group-hover:bg-[#F23645]/85"} ${isActive ? "ring-1 ring-white/30" : ""}`}
                  style={{ height: `${h}%` }} />
                {isActive && (
                  <div className={`absolute left-1/2 -translate-x-1/2 -top-5 font-mono text-[9px] font-semibold whitespace-nowrap ${m.v >= 0 ? "text-tradeTeal" : "text-[#FF8A82]"}`}>
                    {fmtMoney(m.v)}
                  </div>
                )}
              </div>
              <span className={`font-mono text-[9px] transition-colors ${isActive ? "text-tradeTeal" : "text-white/45 group-hover:text-white/70"}`}>{m.m}</span>
            </button>
          );
        })}
      </div>
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
