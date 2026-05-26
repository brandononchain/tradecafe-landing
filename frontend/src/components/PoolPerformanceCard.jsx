import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const DATA = [
  { t: "Wk 1", v: 0 }, { t: "Wk 2", v: 1.8 }, { t: "Wk 3", v: 3.1 }, { t: "Wk 4", v: 2.6 },
  { t: "Wk 5", v: 4.9 }, { t: "Wk 6", v: 6.4 }, { t: "Wk 7", v: 6.0 }, { t: "Wk 8", v: 8.7 },
  { t: "Wk 9", v: 10.4 }, { t: "Wk 10", v: 11.8 }, { t: "Wk 11", v: 12.6 }, { t: "Wk 12", v: 14.2 },
];
const STATS = [
  { k: "Pool TVL", v: "$3.1M" },
  { k: "Net APY", v: "+38.4%", teal: true },
  { k: "Depositors", v: "1,284" },
  { k: "Max Drawdown", v: "-4.2%" },
];

export default function PoolPerformanceCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-tradeTeal/20 bg-[#04090d]" style={{ boxShadow: "0 30px 80px rgba(0,0,0,0.5), 0 0 60px rgba(0,180,166,0.08)" }}>
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.05]">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-white/55">TradeCafe Pool · Net performance</span>
        </div>
        <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] uppercase text-tradeTeal">
          <span className="trade-pulse-dot w-1.5 h-1.5 rounded-full bg-tradeTeal inline-block" /> Live
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-white/[0.05]">
        {STATS.map((s, i) => (
          <div key={s.k} className={`p-4 ${i < STATS.length - 1 ? "border-r border-white/[0.04]" : ""}`}>
            <div className="font-mono text-[9px] tracking-[0.12em] uppercase text-white/40 mb-1.5">{s.k}</div>
            <div className={`font-heading text-[20px] font-bold tracking-[-0.02em] ${s.teal ? "text-tradeTeal" : "text-tradeWhite"}`}>{s.v}</div>
          </div>
        ))}
      </div>
      <div className="px-3 py-4" style={{ height: 280 }}>
        <ResponsiveContainer>
          <AreaChart data={DATA} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="poolfill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00B4A6" stopOpacity={0.34} />
                <stop offset="100%" stopColor="#00B4A6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="t" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} minTickGap={20} />
            <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} width={44} unit="%" />
            <Tooltip contentStyle={{ background: "#041014", border: "1px solid rgba(0,180,166,0.3)", borderRadius: 8, fontSize: 12 }} labelStyle={{ color: "rgba(255,255,255,0.5)" }} formatter={(v) => [`+${v}%`, "Return"]} />
            <Area type="monotone" dataKey="v" stroke="#00B4A6" strokeWidth={2} fill="url(#poolfill)" dot={false} activeDot={{ r: 4, fill: "#00B4A6", stroke: "#041014", strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
