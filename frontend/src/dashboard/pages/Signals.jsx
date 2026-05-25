import { useMemo, useState } from "react";
import { TrendingUp, TrendingDown, Target, ShieldAlert } from "lucide-react";
import { PageHead, Panel } from "../ui";
import { SIGNALS } from "../data";

const FILTERS = ["All", "Long", "Short", "High conf"];

export default function Signals() {
  const [filter, setFilter] = useState("All");

  const rows = useMemo(() => {
    if (filter === "Long") return SIGNALS.filter((s) => s.dir === "LONG");
    if (filter === "Short") return SIGNALS.filter((s) => s.dir === "SHORT");
    if (filter === "High conf") return SIGNALS.filter((s) => s.conf >= 85);
    return SIGNALS;
  }, [filter]);

  const longs = SIGNALS.filter((s) => s.dir === "LONG").length;
  const avgConf = Math.round(SIGNALS.reduce((a, s) => a + s.conf, 0) / SIGNALS.length);

  return (
    <div className="tc-fade flex flex-col gap-6">
      <PageHead
        eyebrow="AI Signal Engine"
        title="Live Signals"
        desc="High-confidence entries streamed 24/7 across crypto markets, with targets and stops."
      />

      <div className="tc-statgrid">
        <Stat label="Active Signals" value={SIGNALS.length} />
        <Stat label="Long / Short" value={`${longs} / ${SIGNALS.length - longs}`} />
        <Stat label="Avg Confidence" value={`${avgConf}%`} teal />
        <Stat label="Win Rate · 30d" value="81%" teal />
      </div>

      <Panel>
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-full font-mono text-[10.5px] tracking-[0.1em] uppercase transition-colors ${
                filter === f ? "bg-tradeTeal/15 text-tradeTeal border border-tradeTeal/30" : "text-white/50 border border-white/8 hover:text-white/80"
              }`}
              data-testid={`signal-filter-${f.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {f}
            </button>
          ))}
          <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] uppercase text-white/45">
            <span className="tc-chip-dot" /> Streaming
          </span>
        </div>

        <div className="tc-table-wrap">
          <table className="tc-table">
            <thead>
              <tr>
                <th>Symbol</th><th>Signal</th><th>Strategy</th><th>TF</th>
                <th>Entry</th><th>Target</th><th>Stop</th><th>Confidence</th><th>Age</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s, i) => (
                <tr key={i} data-testid={`signal-row-${i}`}>
                  <td className="sym">{s.sym}</td>
                  <td>
                    <span className={s.dir === "LONG" ? "tc-tag-long" : "tc-tag-short"}>
                      {s.dir === "LONG" ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />} {s.dir}
                    </span>
                  </td>
                  <td className="text-white/70">{s.strat}</td>
                  <td className="mono text-white/55">{s.tf}</td>
                  <td className="mono">{s.price}</td>
                  <td className="mono text-tradeTeal"><Target className="w-3 h-3 inline mr-1 -mt-0.5" />{s.target}</td>
                  <td className="mono text-[#FF8A82]"><ShieldAlert className="w-3 h-3 inline mr-1 -mt-0.5" />{s.stop}</td>
                  <td>
                    <span className="flex items-center gap-2 min-w-[120px]">
                      <span className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
                        <span className="block h-full bg-tradeTeal" style={{ width: `${s.conf}%` }} />
                      </span>
                      <span className="font-mono text-[10.5px] text-white/60">{s.conf}</span>
                    </span>
                  </td>
                  <td className="mono text-white/45">{s.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
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
