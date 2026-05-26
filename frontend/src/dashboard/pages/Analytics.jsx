import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  SlidersHorizontal,
  DollarSign,
  Search,
  TrendingUp,
  Activity,
  Target,
  Layers3,
  Tag,
  Settings2,
  Download,
} from "lucide-react";
import { PageHead, Panel } from "../ui";
import { SignalConfigModal, TradeConfigModal, MarginSettingsModal } from "../components/ConfigModals";
import TradeAccountModal from "../components/TradeAccountModal";
import {
  ANALYSIS,
  TRADING,
  POSITIONS_SERIES,
  PNL_SERIES,
  TRADING_POSITIONS_SERIES,
  TRADING_PNL_SERIES,
  ANALYSIS_HISTORY,
  TRADING_HISTORY,
} from "../data";

function ChartTooltip({ active, payload, label, unit }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-tradeTeal/30 bg-surface/95 px-3 py-2 shadow-xl backdrop-blur">
      <div className="font-mono text-[9.5px] tracking-[0.14em] uppercase text-white/45">{label}</div>
      <div className="font-mono text-[13px] font-semibold text-tradeTeal mt-0.5">
        {payload[0].value}
        {unit}
      </div>
    </div>
  );
}

function AreaPanel({ title, color, data, unit = "" }) {
  const gid = `g-${title.replace(/\s+/g, "")}`;
  return (
    <Panel icon={title.includes("PNL") ? TrendingUp : Activity} title={title} hover>
      <div style={{ width: "100%", height: 200 }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="t"
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10, fontFamily: "JetBrains Mono" }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={24}
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10, fontFamily: "JetBrains Mono" }}
              axisLine={false}
              tickLine={false}
              width={42}
            />
            <Tooltip content={<ChartTooltip unit={unit} />} cursor={{ stroke: color, strokeOpacity: 0.3 }} />
            <Area
              type="monotone"
              dataKey="v"
              stroke={color}
              strokeWidth={2}
              fill={`url(#${gid})`}
              dot={false}
              activeDot={{ r: 4, fill: color, stroke: "#041014", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}

const SUMMARY_TABS = ["Active", "History"];

export default function Analytics() {
  const [tab, setTab] = useState("analysis");
  const [subTab, setSubTab] = useState("History");
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null);

  const isAnalysis = tab === "analysis";
  const cfg = isAnalysis ? ANALYSIS : TRADING;
  const positions = isAnalysis ? POSITIONS_SERIES : TRADING_POSITIONS_SERIES;
  const pnl = isAnalysis ? PNL_SERIES : TRADING_PNL_SERIES;
  const history = isAnalysis ? ANALYSIS_HISTORY : TRADING_HISTORY;

  const rows = useMemo(() => {
    const q = query.trim().toUpperCase();
    if (!q) return history;
    return history.filter((r) => r.sym.includes(q) || r.alias.toUpperCase().includes(q));
  }, [history, query]);

  const symbols = cfg.config.symbols;

  return (
    <div className="tc-fade flex flex-col gap-6">
      <PageHead
        eyebrow={isAnalysis ? "Signal Performance" : "Trade Performance"}
        title="Performance Analytics"
        desc="Track positions, PnL, and win rate across your analysis and auto-trading engines."
      />

      {/* Segment switch */}
      <div className="tc-segment w-full sm:w-[360px]">
        <div
          className={`tc-segment-btn ${isAnalysis ? "is-active" : ""}`}
          onClick={() => setTab("analysis")}
          data-testid="tab-analysis"
        >
          Analysis
        </div>
        <div
          className={`tc-segment-btn ${!isAnalysis ? "is-active" : ""}`}
          onClick={() => setTab("trading")}
          data-testid="tab-trading"
        >
          Trading
        </div>
      </div>

      {/* Current configuration */}
      <Panel glow data-testid="card-config">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
          <div className="flex items-center gap-2">
            <span className="tc-chip-dot" />
            <div>
              <div className="text-[14px] font-semibold text-tradeWhite">Current Configuration</div>
              <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/45 mt-0.5">
                {isAnalysis ? "Active signal settings" : "Active auto-trading settings"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <button className="tc-btn tc-btn-ghost" style={{ padding: "9px 14px", fontSize: 12 }} onClick={() => setModal("config")} data-testid="change-config">
              <Settings2 className="w-3.5 h-3.5" strokeWidth={2} /> Change Config
            </button>
            <button className="tc-btn tc-btn-ghost" style={{ padding: "9px 14px", fontSize: 12 }} onClick={() => setModal(isAnalysis ? "margin" : "account")} data-testid="config-secondary">
              <DollarSign className="w-3.5 h-3.5" strokeWidth={2} />
              {isAnalysis ? "Margin Settings" : "Configure API"}
            </button>
          </div>
        </div>

        <div className="tc-config-grid pt-4 border-t border-white/[0.04]">
          {isAnalysis && (
            <div className="tc-config-cell">
              <div className="lbl"><Layers3 className="w-3 h-3" /> Markets</div>
              <div className="val">{cfg.config.market}</div>
            </div>
          )}
          <div className="tc-config-cell">
            <div className="lbl"><SlidersHorizontal className="w-3 h-3" /> Strategies</div>
            <div className="val">
              {Array.isArray(cfg.config.strategies) ? cfg.config.strategies.join(", ") : cfg.config.strategies}
            </div>
          </div>
          <div className="tc-config-cell">
            <div className="lbl"><Tag className="w-3 h-3" /> Symbols</div>
            <div className="val">
              {symbols.join(", ")}
              <span className="text-tradeTeal"> +{cfg.config.symbolsMore}</span>
            </div>
          </div>
          {!isAnalysis && (
            <div className="tc-config-cell">
              <div className="lbl"><Target className="w-3 h-3" /> Trade Mode</div>
              <div className="val">{cfg.config.tradeMode}</div>
            </div>
          )}
        </div>
      </Panel>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AreaPanel title="Positions" color="#00B4A6" data={positions} />
        <AreaPanel title={isAnalysis ? "PNL" : "Daily PNL %"} color="#38BDF8" data={pnl} unit={isAnalysis ? "" : "%"} />
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="tc-stat">
          <div className="tc-stat-label">Total Quantity</div>
          <div className="tc-stat-value is-white">{cfg.totalQuantity}</div>
        </div>
        <div className="tc-stat">
          <div className="tc-stat-label flex items-center justify-between">
            Approx. PNL %
            <Download className="w-3.5 h-3.5 text-white/35" strokeWidth={2} />
          </div>
          <div className="tc-stat-value is-teal">{cfg.pnl}</div>
        </div>
        <div className="tc-stat">
          <div className="tc-stat-label">Win Rate</div>
          <div className="tc-stat-value is-teal">{cfg.winRate}%</div>
        </div>
      </div>

      {/* History table */}
      <Panel data-testid="card-history">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="tc-segment">
            {SUMMARY_TABS.map((t) => (
              <div
                key={t}
                className={`tc-segment-btn ${subTab === t ? "is-active" : ""}`}
                style={{ padding: "8px 20px" }}
                onClick={() => setSubTab(t)}
              >
                {t}
              </div>
            ))}
          </div>
          <div className="tc-search sm:w-[280px]">
            <Search className="w-4 h-4 text-white/35" strokeWidth={2} />
            <input
              placeholder="Search symbol…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              data-testid="history-search"
            />
          </div>
        </div>

        {subTab === "Active" ? (
          <div className="py-14 text-center">
            <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-white/40">
              No active positions
            </div>
            <p className="text-[13px] text-white/40 mt-2">Open positions will stream here in real time.</p>
          </div>
        ) : (
          <div className="tc-table-wrap">
            <table className="tc-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Alias</th>
                  <th>Type</th>
                  <th>Open</th>
                  <th>Close</th>
                  <th>Open Time</th>
                  <th>Close Time</th>
                  <th>P/L</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} data-testid={`history-row-${i}`}>
                    <td className="sym">{r.sym}</td>
                    <td className="mono text-white/55">{r.alias}</td>
                    <td>
                      <span className={r.type === "LONG" ? "tc-tag-long" : "tc-tag-short"}>
                        <TrendingUp className="w-2.5 h-2.5" strokeWidth={2.4} /> {r.type}
                      </span>
                    </td>
                    <td className="mono">{r.open}</td>
                    <td className="mono">{r.close}</td>
                    <td className="mono text-white/55">{r.openTime}</td>
                    <td className="mono text-white/55">{r.closeTime}</td>
                    <td><span className="tc-pl-pos">{r.pl}</span></td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center text-white/40 py-8">No matching trades.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {modal === "config" && (isAnalysis
        ? <SignalConfigModal onClose={() => setModal(null)} />
        : <TradeConfigModal onClose={() => setModal(null)} onOpenAccount={() => setModal("account")} />)}
      {modal === "margin" && <MarginSettingsModal onClose={() => setModal(null)} />}
      {modal === "account" && <TradeAccountModal onClose={() => setModal(null)} />}
    </div>
  );
}
