import { useEffect, useRef } from "react";
import { createChart, ColorType } from "lightweight-charts";
import { genCandles } from "../lib/candles";

export default function TradingChart({ symbol, timeframe }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const chart = createChart(el, {
      width: el.clientWidth,
      height: el.clientHeight,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "rgba(245,246,242,0.55)",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10,
      },
      grid: {
        vertLines: { color: "rgba(255,255,255,0.04)" },
        horzLines: { color: "rgba(255,255,255,0.04)" },
      },
      crosshair: {
        mode: 0,
        vertLine: { color: "rgba(0,180,166,0.4)", width: 1, style: 2, labelBackgroundColor: "#0B3A48" },
        horzLine: { color: "rgba(0,180,166,0.4)", width: 1, style: 2, labelBackgroundColor: "#0B3A48" },
      },
      rightPriceScale: { borderColor: "rgba(255,255,255,0.06)" },
      timeScale: { borderColor: "rgba(255,255,255,0.06)", timeVisible: true, secondsVisible: false },
      handleScale: { mouseWheel: true },
    });

    const series = chart.addCandlestickSeries({
      upColor: "#1FB8A6",
      downColor: "#F23645",
      borderUpColor: "#1FB8A6",
      borderDownColor: "#F23645",
      wickUpColor: "rgba(31,184,166,0.7)",
      wickDownColor: "rgba(242,54,69,0.7)",
    });
    series.setData(genCandles(symbol, timeframe));
    chart.timeScale().fitContent();

    const ro = new ResizeObserver(() => {
      chart.applyOptions({ width: el.clientWidth, height: el.clientHeight });
    });
    ro.observe(el);

    return () => {
      ro.disconnect();
      chart.remove();
    };
  }, [symbol, timeframe]);

  return <div ref={containerRef} className="w-full h-full" data-testid="trading-chart" />;
}
