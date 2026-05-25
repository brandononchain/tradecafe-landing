import {
  CandlestickChart,
  ArrowUpRight,
  LineChart,
  Gauge,
  Wallet,
  Layers,
} from "lucide-react";
import { PageHead, Panel } from "../ui";

const FEATURES = [
  { icon: CandlestickChart, title: "TradingView Charts", desc: "Full-featured candlestick charts with multi-timeframe support." },
  { icon: LineChart, title: "Indicators & Drawing", desc: "RSI, MACD, EMA bands, Fibonacci, and custom studies." },
  { icon: Gauge, title: "One-Click Execution", desc: "Market, limit, and bracket orders with live risk preview." },
  { icon: Wallet, title: "Position Manager", desc: "Track open positions, PnL, and margin in real time." },
];

export default function Terminal() {
  return (
    <div className="tc-fade flex flex-col gap-6">
      <PageHead
        eyebrow="Live Trading Desk"
        title="Trading Terminal"
        desc="A professional trading desk with integrated TradingView charts, indicators, and one-click execution — landing in the next release."
      >
        <a href="https://terminal.tradecafe.ai" className="tc-btn tc-btn-primary">
          Open current terminal <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.4} />
        </a>
      </PageHead>

      <Panel glow>
        <div className="tc-soon">
          <span className="tc-soon-ico"><CandlestickChart className="w-7 h-7" strokeWidth={1.8} /></span>
          <div>
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-tradeTeal mb-2">Coming Next</div>
            <h2 className="font-heading text-[26px] font-semibold tracking-[-0.02em] text-tradeWhite">
              The full trading terminal is on its way
            </h2>
            <p className="text-[14px] text-white/55 mt-3 max-w-[520px] mx-auto leading-[1.6]">
              We&apos;re wiring TradingView charts, live order books, and execution into this view.
              Until then, the existing terminal stays fully available.
            </p>
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <Panel key={f.title} hover>
              <span className="tc-action-ico mb-3"><Icon className="w-4 h-4" strokeWidth={2} /></span>
              <div className="text-[14px] font-semibold text-tradeWhite tracking-[-0.01em]">{f.title}</div>
              <p className="text-[12.5px] text-white/55 mt-1.5 leading-[1.5]">{f.desc}</p>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
