import { useEffect, useMemo, useRef } from "react";
import { createChart, ColorType, LineStyle } from "lightweight-charts";
import { genCandles } from "../lib/candles";
import {
  sma, ema, wma, hma, bollinger, vwap, supertrend, ichimoku,
  rsi, macd, stochastic, cci, williamsR, atrSeries, obv, volumeSeries,
  supportResistance, pivotPoints,
} from "../lib/indicators";

const OVERLAY_COLORS = { SMA: "#F0B90B", EMA: "#9B8AFB", WMA: "#38BDF8", HMA: "#FF7AB6", VWAP: "#E8782A" };

const baseLayout = {
  background: { type: ColorType.Solid, color: "transparent" },
  textColor: "rgba(245,246,242,0.5)",
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 10,
};
const grid = {
  vertLines: { color: "rgba(255,255,255,0.035)" },
  horzLines: { color: "rgba(255,255,255,0.035)" },
};

export default function TradingChart({
  symbol, timeframe, chartType = "candles",
  overlays = {}, oscillator = null, ai = {}, drawTool = null, logScale = false,
}) {
  const mainRef = useRef(null);
  const oscRef = useRef(null);
  const drawToolRef = useRef(drawTool);
  drawToolRef.current = drawTool;
  const drawnLines = useRef([]);

  const candles = useMemo(() => genCandles(symbol, timeframe), [symbol, timeframe]);

  // Main chart
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const chart = createChart(el, {
      width: el.clientWidth, height: el.clientHeight,
      layout: baseLayout, grid,
      crosshair: {
        mode: 0,
        vertLine: { color: "rgba(0,180,166,0.4)", width: 1, style: 2, labelBackgroundColor: "#0B3A48" },
        horzLine: { color: "rgba(0,180,166,0.4)", width: 1, style: 2, labelBackgroundColor: "#0B3A48" },
      },
      rightPriceScale: { borderColor: "rgba(255,255,255,0.06)", mode: logScale ? 1 : 0 },
      timeScale: { borderColor: "rgba(255,255,255,0.06)", timeVisible: true, secondsVisible: false },
    });

    let series;
    if (chartType === "line") {
      series = chart.addLineSeries({ color: "#1FB8A6", lineWidth: 2 });
      series.setData(candles.map((c) => ({ time: c.time, value: c.close })));
    } else if (chartType === "area") {
      series = chart.addAreaSeries({ lineColor: "#1FB8A6", topColor: "rgba(31,184,166,0.3)", bottomColor: "rgba(31,184,166,0)", lineWidth: 2 });
      series.setData(candles.map((c) => ({ time: c.time, value: c.close })));
    } else if (chartType === "bars") {
      series = chart.addBarSeries({ upColor: "#1FB8A6", downColor: "#F23645" });
      series.setData(candles);
    } else {
      series = chart.addCandlestickSeries({
        upColor: "#1FB8A6", downColor: "#F23645",
        borderUpColor: "#1FB8A6", borderDownColor: "#F23645",
        wickUpColor: "rgba(31,184,166,0.7)", wickDownColor: "rgba(242,54,69,0.7)",
      });
      series.setData(candles);
    }

    // Overlays
    const addLine = (data, color, width = 1.5, style = LineStyle.Solid) => {
      const s = chart.addLineSeries({ color, lineWidth: width, lineStyle: style, priceLineVisible: false, lastValueVisible: false, crosshairMarkerVisible: false });
      s.setData(data);
      return s;
    };
    Object.keys(overlays).forEach((k) => {
      const p = overlays[k];
      if (k === "SMA") addLine(sma(candles, p.period), OVERLAY_COLORS.SMA);
      else if (k === "EMA") addLine(ema(candles, p.period), OVERLAY_COLORS.EMA);
      else if (k === "WMA") addLine(wma(candles, p.period), OVERLAY_COLORS.WMA);
      else if (k === "HMA") addLine(hma(candles, p.period), OVERLAY_COLORS.HMA);
      else if (k === "VWAP") addLine(vwap(candles), OVERLAY_COLORS.VWAP);
      else if (k === "BB") {
        const bb = bollinger(candles, p.period, p.mult);
        addLine(bb.upper, "rgba(0,180,166,0.55)", 1);
        addLine(bb.middle, "rgba(0,180,166,0.35)", 1, LineStyle.Dashed);
        addLine(bb.lower, "rgba(0,180,166,0.55)", 1);
      } else if (k === "SUPERTREND") {
        addLine(supertrend(candles, p.period, p.mult).map((d) => ({ time: d.time, value: d.value })), "#1FB8A6", 2);
      } else if (k === "ICHIMOKU") {
        const ich = ichimoku(candles);
        addLine(ich.tenkan, "#38BDF8", 1.5);
        addLine(ich.kijun, "#E8782A", 1.5);
      }
    });

    // AI layers as price lines
    if (ai.pivots) {
      pivotPoints(candles).forEach((lvl) =>
        series.createPriceLine({
          price: lvl.price, color: lvl.label === "P" ? "#E8782A" : "rgba(155,138,251,0.8)",
          lineWidth: 1, lineStyle: LineStyle.Dotted, axisLabelVisible: true, title: lvl.label,
        })
      );
    }
    if (ai.sr) {
      supportResistance(candles).forEach((lvl) =>
        series.createPriceLine({
          price: lvl.price, color: lvl.type === "support" ? "rgba(31,184,166,0.7)" : "rgba(242,54,69,0.7)",
          lineWidth: 1, lineStyle: LineStyle.Dashed, axisLabelVisible: true,
          title: lvl.type === "support" ? "S" : "R",
        })
      );
    }

    // Re-apply drawn horizontal lines
    drawnLines.current = drawnLines.current.map((d) =>
      series.createPriceLine({ price: d.price, color: "#5FE0CF", lineWidth: 1, lineStyle: LineStyle.Solid, axisLabelVisible: true })
        && d
    );

    // Drawing / eraser via click
    const onClick = (param) => {
      const tool = drawToolRef.current;
      if (!tool || !param.point) return;
      if (tool === "eraser") {
        drawnLines.current = [];
        // cheap clear: refit by resetting data triggers no removal; recreate handled on next deps change
        return;
      }
      if (tool === "horizontal" || tool === "trendline" || tool === "ray") {
        const price = series.coordinateToPrice(param.point.y);
        if (price == null) return;
        series.createPriceLine({ price, color: "#5FE0CF", lineWidth: 1, lineStyle: LineStyle.Solid, axisLabelVisible: true });
        drawnLines.current.push({ price });
      }
    };
    chart.subscribeClick(onClick);

    chart.timeScale().fitContent();
    const ro = new ResizeObserver(() => chart.applyOptions({ width: el.clientWidth, height: el.clientHeight }));
    ro.observe(el);

    return () => { ro.disconnect(); chart.unsubscribeClick(onClick); chart.remove(); };
  }, [symbol, timeframe, chartType, overlays, ai, candles, logScale]);

  // Oscillator pane
  useEffect(() => {
    const el = oscRef.current;
    if (!el || !oscillator) return;
    const chart = createChart(el, {
      width: el.clientWidth, height: el.clientHeight,
      layout: baseLayout, grid,
      rightPriceScale: { borderColor: "rgba(255,255,255,0.06)" },
      timeScale: { borderColor: "rgba(255,255,255,0.06)", timeVisible: true, secondsVisible: false },
      crosshair: { mode: 0 },
    });

    const osc = (color, w = 1.5) => chart.addLineSeries({ color, lineWidth: w, priceLineVisible: false, lastValueVisible: true });
    if (oscillator === "RSI") {
      const s = osc("#9B8AFB");
      s.setData(rsi(candles, 14));
      [30, 70].forEach((lvl) => s.createPriceLine({ price: lvl, color: "rgba(255,255,255,0.18)", lineWidth: 1, lineStyle: LineStyle.Dashed }));
    } else if (oscillator === "MACD") {
      const m = macd(candles);
      const hist = chart.addHistogramSeries({ priceLineVisible: false });
      hist.setData(m.histogram.map((d) => ({ time: d.time, value: d.value, color: d.value >= 0 ? "rgba(31,184,166,0.5)" : "rgba(242,54,69,0.5)" })));
      osc("#38BDF8").setData(m.macd);
      osc("#E8782A").setData(m.signal);
    } else if (oscillator === "STOCH") {
      const s = stochastic(candles);
      const k = osc("#38BDF8"); k.setData(s.k);
      osc("#E8782A").setData(s.d);
      [20, 80].forEach((lvl) => k.createPriceLine({ price: lvl, color: "rgba(255,255,255,0.18)", lineWidth: 1, lineStyle: LineStyle.Dashed }));
    } else if (oscillator === "CCI") {
      const s = osc("#9B8AFB"); s.setData(cci(candles, 20));
      [-100, 100].forEach((lvl) => s.createPriceLine({ price: lvl, color: "rgba(255,255,255,0.18)", lineWidth: 1, lineStyle: LineStyle.Dashed }));
    } else if (oscillator === "WILLR") {
      const s = osc("#FF7AB6"); s.setData(williamsR(candles, 14));
      [-20, -80].forEach((lvl) => s.createPriceLine({ price: lvl, color: "rgba(255,255,255,0.18)", lineWidth: 1, lineStyle: LineStyle.Dashed }));
    } else if (oscillator === "ATR") {
      osc("#F0B90B").setData(atrSeries(candles, 14));
    } else if (oscillator === "OBV") {
      osc("#1FB8A6").setData(obv(candles));
    } else if (oscillator === "VOL") {
      const v = chart.addHistogramSeries({ priceLineVisible: false });
      v.setData(volumeSeries(candles));
    }

    chart.timeScale().fitContent();
    const ro = new ResizeObserver(() => chart.applyOptions({ width: el.clientWidth, height: el.clientHeight }));
    ro.observe(el);
    return () => { ro.disconnect(); chart.remove(); };
  }, [symbol, timeframe, oscillator, candles]);

  return (
    <div className="flex flex-col w-full h-full">
      <div ref={mainRef} className={`w-full ${oscillator ? "flex-1" : "h-full"}`} data-testid="trading-chart" />
      {oscillator && (
        <div className="border-t border-white/5 h-[130px] shrink-0">
          <div ref={oscRef} className="w-full h-full" />
        </div>
      )}
    </div>
  );
}
