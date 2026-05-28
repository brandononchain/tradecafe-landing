import { useEffect, useMemo, useRef } from "react";
import { createChart, ColorType, LineStyle } from "lightweight-charts";
import { genCandles } from "../lib/candles";
import { useTheme } from "../ThemeContext";
import {
  sma, ema, wma, hma, bollinger, vwap, supertrend, ichimoku,
  rsi, macd, stochastic, cci, williamsR, atrSeries, obv, volumeSeries,
  supportResistance, pivotPoints, trendChannel, breakRetests, trendFinder, insideBars,
} from "../lib/indicators";

const OVERLAY_COLORS = { SMA: "#F0B90B", EMA: "#9B8AFB", WMA: "#38BDF8", HMA: "#FF7AB6", VWAP: "#E8782A" };
const DRAW_COLOR = "#5FE0CF";

function chartTheme(light) {
  const ink = light ? "16,26,30" : "255,255,255";
  return {
    layout: {
      background: { type: ColorType.Solid, color: "transparent" },
      textColor: `rgba(${ink},0.55)`,
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 10,
    },
    grid: {
      vertLines: { color: `rgba(${ink},${light ? 0.07 : 0.035})` },
      horzLines: { color: `rgba(${ink},${light ? 0.07 : 0.035})` },
    },
    border: `rgba(${ink},${light ? 0.1 : 0.06})`,
  };
}

export default function TradingChart({
  symbol, timeframe, chartType = "candles",
  overlays = {}, oscillator = null, ai = {}, drawTool = null, logScale = false, signal = null,
}) {
  const mainRef = useRef(null);
  const oscRef = useRef(null);
  const overlayRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const symbolRef = useRef(symbol);
  symbolRef.current = symbol;
  const storeRef = useRef({});          // { [symbol]: [drawing,...] }
  const draftRef = useRef(null);        // in-progress drawing
  const drawToolRef = useRef(drawTool);
  drawToolRef.current = drawTool;
  const { mode } = useTheme();
  const light = mode === "light";

  const candles = useMemo(() => genCandles(symbol, timeframe), [symbol, timeframe]);

  // Main chart
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const t = chartTheme(light);
    const chart = createChart(el, {
      width: el.clientWidth, height: el.clientHeight,
      layout: t.layout, grid: t.grid,
      crosshair: {
        mode: 0,
        vertLine: { color: "rgba(0,180,166,0.4)", width: 1, style: 2, labelBackgroundColor: "#0B3A48" },
        horzLine: { color: "rgba(0,180,166,0.4)", width: 1, style: 2, labelBackgroundColor: "#0B3A48" },
      },
      handleScroll: !drawTool,
      handleScale: !drawTool,
      rightPriceScale: { borderColor: t.border, mode: logScale ? 1 : 0 },
      timeScale: { borderColor: t.border, timeVisible: true, secondsVisible: false },
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
    chartRef.current = chart;
    seriesRef.current = series;

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

    if (ai.pivots) {
      pivotPoints(candles).forEach((lvl) =>
        series.createPriceLine({ price: lvl.price, color: lvl.label === "P" ? "#E8782A" : "rgba(155,138,251,0.8)", lineWidth: 1, lineStyle: LineStyle.Dotted, axisLabelVisible: true, title: lvl.label }));
    }
    if (ai.sr) {
      supportResistance(candles).forEach((lvl) =>
        series.createPriceLine({ price: lvl.price, color: lvl.type === "support" ? "rgba(31,184,166,0.7)" : "rgba(242,54,69,0.7)", lineWidth: 1, lineStyle: LineStyle.Dashed, axisLabelVisible: true, title: lvl.type === "support" ? "S" : "R" }));
    }
    if (ai.channel) {
      const ch = trendChannel(candles);
      addLine(ch.upper, "rgba(155,138,251,0.6)", 1, LineStyle.Dashed);
      addLine(ch.mid, "rgba(155,138,251,0.9)", 1.5);
      addLine(ch.lower, "rgba(155,138,251,0.6)", 1, LineStyle.Dashed);
    }
    if (ai.breaks) {
      breakRetests(candles).forEach((lvl) =>
        series.createPriceLine({ price: lvl.price, color: lvl.type === "break-up" ? "#1FB8A6" : "#F23645", lineWidth: 2, lineStyle: LineStyle.Solid, axisLabelVisible: true, title: lvl.label }));
    }
    if (ai.tsr) {
      const ch = trendChannel(candles);
      addLine(ch.mid, "rgba(240,185,11,0.9)", 1.5);
      const lv = supportResistance(candles);
      const res = lv.filter((l) => l.type === "resistance").slice(-1)[0];
      const sup = lv.filter((l) => l.type === "support").slice(-1)[0];
      if (res) series.createPriceLine({ price: res.price, color: "rgba(242,54,69,0.7)", lineWidth: 1, lineStyle: LineStyle.Dashed, axisLabelVisible: true, title: "R" });
      if (sup) series.createPriceLine({ price: sup.price, color: "rgba(31,184,166,0.7)", lineWidth: 1, lineStyle: LineStyle.Dashed, axisLabelVisible: true, title: "S" });
    }
    if (ai.trendFinder) {
      const tf2 = trendFinder(candles);
      if (tf2.line.length) addLine(tf2.line, tf2.up ? "#1FB8A6" : "#F23645", 2);
    }
    let markers = [];
    if (ai.insideBB) {
      const bb = bollinger(candles, 20, 2);
      addLine(bb.upper, "rgba(155,138,251,0.5)", 1);
      addLine(bb.lower, "rgba(155,138,251,0.5)", 1);
      markers = insideBars(candles);
    }
    if (signal) {
      const sigLine = (price, color, title, style = LineStyle.Solid) =>
        price != null && !Number.isNaN(price) &&
        series.createPriceLine({ price, color, lineWidth: 2, lineStyle: style, axisLabelVisible: true, title });
      sigLine(signal.entry, "#5FE0CF", "Entry", LineStyle.Dashed);
      sigLine(signal.target, "#1FB8A6", "TP");
      sigLine(signal.stop, "#F23645", "SL");
    }
    if (markers.length && series.setMarkers) series.setMarkers(markers);

    chart.timeScale().fitContent();
    const ro = new ResizeObserver(() => chart.applyOptions({ width: el.clientWidth, height: el.clientHeight }));
    ro.observe(el);

    return () => { ro.disconnect(); chart.remove(); chartRef.current = null; seriesRef.current = null; };
  }, [symbol, timeframe, chartType, overlays, ai, candles, logScale, light, signal, drawTool]);

  // ===== Drawing overlay (anchored to logical index + price, rAF-synced) =====
  useEffect(() => {
    const svg = overlayRef.current;
    const host = mainRef.current;
    if (!svg || !host) return;
    let raf, drawing = false;

    const toScreen = (pt) => {
      const chart = chartRef.current, series = seriesRef.current;
      if (!chart || !series) return null;
      const x = chart.timeScale().logicalToCoordinate(pt.logical);
      const y = series.priceToCoordinate(pt.price);
      if (x == null || y == null) return null;
      return { x, y };
    };
    const getPt = (e) => {
      const chart = chartRef.current, series = seriesRef.current;
      if (!chart || !series) return null;
      const r = host.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const logical = chart.timeScale().coordinateToLogical(x);
      const price = series.coordinateToPrice(y);
      if (logical == null || price == null) return null;
      return { logical, price, x, y };
    };
    const list = () => storeRef.current[symbolRef.current] || (storeRef.current[symbolRef.current] = []);

    const render = () => {
      const w = host.clientWidth, h = host.clientHeight;
      const all = list().concat(draftRef.current ? [draftRef.current] : []);
      let out = "";
      for (const d of all) {
        const color = d.color || DRAW_COLOR;
        const dash = d.draft ? ' stroke-dasharray="5 4"' : "";
        if (d.tool === "horizontal") {
          const p = toScreen(d.pts[0]); if (!p) continue;
          out += `<line x1="0" y1="${p.y}" x2="${w}" y2="${p.y}" stroke="${color}" stroke-width="1.5"${dash}/>`;
        } else if (d.tool === "trendline" || d.tool === "ray" || d.tool === "measure") {
          const a = toScreen(d.pts[0]), b = toScreen(d.pts[1] || d.pts[0]); if (!a || !b) continue;
          let bx = b.x, by = b.y;
          if (d.tool === "ray") {
            const dx = b.x - a.x, dy = b.y - a.y;
            const k = dx > 0 ? (w - a.x) / dx : dx < 0 ? -a.x / dx : (dy > 0 ? (h - a.y) / dy : 1);
            bx = a.x + dx * Math.max(k, 1); by = a.y + dy * Math.max(k, 1);
          }
          out += `<line x1="${a.x}" y1="${a.y}" x2="${bx}" y2="${by}" stroke="${color}" stroke-width="2"${dash}/>`;
          if (d.tool === "measure") {
            const p0 = d.pts[0].price, p1 = (d.pts[1] || d.pts[0]).price;
            const pct = p0 ? (((p1 - p0) / p0) * 100).toFixed(2) : "0";
            out += `<rect x="${b.x + 6}" y="${b.y - 18}" width="62" height="16" rx="3" fill="#041014" stroke="${color}" stroke-opacity="0.5"/><text x="${b.x + 12}" y="${b.y - 6}" fill="${color}" font-size="10" font-family="JetBrains Mono">${pct > 0 ? "+" : ""}${pct}%</text>`;
          }
        } else if (d.tool === "rectangle") {
          const a = toScreen(d.pts[0]), b = toScreen(d.pts[1] || d.pts[0]); if (!a || !b) continue;
          const x = Math.min(a.x, b.x), y = Math.min(a.y, b.y), rw = Math.abs(b.x - a.x), rh = Math.abs(b.y - a.y);
          out += `<rect x="${x}" y="${y}" width="${rw}" height="${rh}" fill="${color}22" stroke="${color}" stroke-width="1.5"${dash}/>`;
        } else if (d.tool === "brush") {
          const pts = d.pts.map(toScreen).filter(Boolean); if (pts.length < 2) continue;
          out += `<polyline points="${pts.map((p) => `${p.x},${p.y}`).join(" ")}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"${dash}/>`;
        }
      }
      svg.innerHTML = out;
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    const distToSeg = (px, py, a, b) => {
      const dx = b.x - a.x, dy = b.y - a.y;
      const len2 = dx * dx + dy * dy || 1;
      let t = ((px - a.x) * dx + (py - a.y) * dy) / len2;
      t = Math.max(0, Math.min(1, t));
      return Math.hypot(px - (a.x + t * dx), py - (a.y + t * dy));
    };
    const eraseAt = (pt) => {
      const arr = list();
      for (let i = arr.length - 1; i >= 0; i--) {
        const d = arr[i];
        const sp = d.pts.map(toScreen).filter(Boolean);
        if (!sp.length) continue;
        let hit = false;
        if (d.tool === "horizontal") hit = Math.abs(pt.y - sp[0].y) < 8;
        else for (let j = 0; j < sp.length - 1; j++) if (distToSeg(pt.x, pt.y, sp[j], sp[j + 1]) < 8) { hit = true; break; }
        if (d.tool === "rectangle" && sp[1]) {
          const x = Math.min(sp[0].x, sp[1].x), y = Math.min(sp[0].y, sp[1].y);
          hit = pt.x >= x - 8 && pt.x <= Math.max(sp[0].x, sp[1].x) + 8 && pt.y >= y - 8 && pt.y <= Math.max(sp[0].y, sp[1].y) + 8;
        }
        if (hit) { arr.splice(i, 1); return; }
      }
    };

    const onDown = (e) => {
      const tool = drawToolRef.current;
      if (!tool) return;
      const pt = getPt(e); if (!pt) return;
      e.preventDefault();
      const P = { logical: pt.logical, price: pt.price };
      if (tool === "eraser") { eraseAt(pt); return; }
      if (tool === "text") return;
      if (tool === "horizontal") { list().push({ tool, color: DRAW_COLOR, pts: [P] }); return; }
      draftRef.current = { tool, color: DRAW_COLOR, draft: true, pts: tool === "brush" ? [P] : [P, { ...P }] };
      drawing = true;
      svg.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e) => {
      if (!drawing || !draftRef.current) return;
      const pt = getPt(e); if (!pt) return;
      const P = { logical: pt.logical, price: pt.price };
      if (draftRef.current.tool === "brush") draftRef.current.pts.push(P);
      else draftRef.current.pts[1] = P;
    };
    const onUp = () => {
      if (!drawing) return;
      drawing = false;
      const d = draftRef.current; draftRef.current = null;
      if (!d) return;
      const a = toScreen(d.pts[0]), b = toScreen(d.pts[d.pts.length - 1]);
      if (d.tool !== "brush" && a && b && Math.hypot(b.x - a.x, b.y - a.y) < 4) return;
      d.draft = false;
      list().push(d);
    };

    svg.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      cancelAnimationFrame(raf);
      svg.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  // Oscillator pane
  useEffect(() => {
    const el = oscRef.current;
    if (!el || !oscillator) return;
    const t = chartTheme(light);
    const chart = createChart(el, {
      width: el.clientWidth, height: el.clientHeight,
      layout: t.layout, grid: t.grid,
      rightPriceScale: { borderColor: t.border },
      timeScale: { borderColor: t.border, timeVisible: true, secondsVisible: false },
      crosshair: { mode: 0 },
    });
    const osc = (color, w = 1.5) => chart.addLineSeries({ color, lineWidth: w, priceLineVisible: false, lastValueVisible: true });
    if (oscillator === "RSI") {
      const s = osc("#9B8AFB"); s.setData(rsi(candles, 14));
      [30, 70].forEach((lvl) => s.createPriceLine({ price: lvl, color: `rgba(${light ? "16,26,30" : "255,255,255"},0.2)`, lineWidth: 1, lineStyle: LineStyle.Dashed }));
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
      [20, 80].forEach((lvl) => k.createPriceLine({ price: lvl, color: `rgba(${light ? "16,26,30" : "255,255,255"},0.2)`, lineWidth: 1, lineStyle: LineStyle.Dashed }));
    } else if (oscillator === "CCI") {
      const s = osc("#9B8AFB"); s.setData(cci(candles, 20));
      [-100, 100].forEach((lvl) => s.createPriceLine({ price: lvl, color: `rgba(${light ? "16,26,30" : "255,255,255"},0.2)`, lineWidth: 1, lineStyle: LineStyle.Dashed }));
    } else if (oscillator === "WILLR") {
      const s = osc("#FF7AB6"); s.setData(williamsR(candles, 14));
      [-20, -80].forEach((lvl) => s.createPriceLine({ price: lvl, color: `rgba(${light ? "16,26,30" : "255,255,255"},0.2)`, lineWidth: 1, lineStyle: LineStyle.Dashed }));
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
  }, [symbol, timeframe, oscillator, candles, light]);

  const drawingActive = !!drawTool;
  return (
    <div className="flex flex-col w-full h-full">
      <div className={`relative w-full ${oscillator ? "flex-1" : "h-full"}`}>
        <div ref={mainRef} className="w-full h-full" data-testid="trading-chart" />
        <svg
          ref={overlayRef}
          className="absolute inset-0 w-full h-full"
          style={{
            pointerEvents: drawingActive ? "auto" : "none",
            cursor: drawingActive ? (drawTool === "eraser" ? "cell" : "crosshair") : "default",
            touchAction: "none",
          }}
          data-testid="draw-overlay"
        />
      </div>
      {oscillator && (
        <div className="border-t border-white/[0.04] h-[130px] shrink-0">
          <div ref={oscRef} className="w-full h-full" />
        </div>
      )}
    </div>
  );
}
