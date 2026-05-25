import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Layers, ArrowDownToLine, ArrowUpToLine, Info } from "lucide-react";
import { PageHead, Panel } from "../ui";
import { POOL } from "../data";

export default function Pool() {
  return (
    <div className="tc-fade flex flex-col gap-6">
      <PageHead
        eyebrow="Pooled Strategies"
        title="Trading Pool"
        desc="Deposit funds into pooled AI strategies and earn a target yield — managed end-to-end."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Panel glow className="lg:col-span-2 flex flex-col">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-white/45">Target Return</div>
              <div className="font-heading text-[52px] font-bold tracking-[-0.03em] leading-none text-tradeWhite mt-1">
                {POOL.apy}<span className="text-tradeTeal">%</span>
                <span className="text-[15px] text-white/45 font-mono font-normal ml-2">/ month</span>
              </div>
            </div>
            <div className="flex gap-2.5">
              <button className="tc-btn tc-btn-primary"><ArrowDownToLine className="w-4 h-4" strokeWidth={2.2} /> Deposit</button>
              <button className="tc-btn tc-btn-ghost"><ArrowUpToLine className="w-4 h-4" strokeWidth={2} /> Withdraw</button>
            </div>
          </div>

          <div style={{ width: "100%", height: 180 }} className="mt-5">
            <ResponsiveContainer>
              <AreaChart data={POOL.series} margin={{ top: 6, right: 6, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="poolfill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00B4A6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#00B4A6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="t" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} width={38} />
                <Tooltip
                  contentStyle={{ background: "#041014", border: "1px solid rgba(0,180,166,0.3)", borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: "rgba(255,255,255,0.5)" }}
                />
                <Area type="monotone" dataKey="v" stroke="#00B4A6" strokeWidth={2} fill="url(#poolfill)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel icon={Layers} title="Your Position" className="flex flex-col">
          <div className="text-center py-3">
            <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-white/45">Deposited</div>
            <div className="font-heading text-[34px] font-bold tracking-[-0.02em] text-tradeWhite mt-1">
              ${POOL.myDeposit.toFixed(2)}
            </div>
            <div className="font-mono text-[11px] text-white/40 mt-1">0.00 earned this month</div>
          </div>
          <div className="mt-auto p-3 rounded-xl bg-tradeTeal/5 border border-tradeTeal/15 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-tradeTeal shrink-0 mt-0.5" strokeWidth={2} />
            <p className="text-[11.5px] text-white/55 leading-[1.5]">
              Deposits open a Mining Pool automatically. Returns are a target, not guaranteed.
            </p>
          </div>
        </Panel>
      </div>

      <div className="tc-statgrid">
        <Stat label="Pool AUM" value={POOL.aum} />
        <Stat label="Active LPs" value={POOL.lps} />
        <Stat label="MTD Return" value={POOL.mtd} teal />
        <Stat label="APY (Target)" value={`${POOL.apy * 12}%`} teal />
      </div>
    </div>
  );
}

function Stat({ label, value, teal }) {
  return (
    <div className="tc-stat">
      <div className="tc-stat-label">{label}</div>
      <div className={`tc-stat-value ${teal ? "is-teal" : "is-white"}`}>{value}</div>
    </div>
  );
}
