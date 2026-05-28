import { createContext, useContext, useEffect, useState, useRef } from "react";
import { WATCHLIST } from "./data";

// Lightweight "live tape" — every couple seconds nudges each watched
// symbol price by a small ±drift so the dashboard feels alive without a
// backend. Consumers read prices[sym] and prev[sym] to animate changes.

const parse = (s) => Number(String(s).replace(/,/g, "")) || 0;
const seedPrices = Object.fromEntries(WATCHLIST.map((w) => [w.sym, parse(w.last)]));

const TickerContext = createContext(null);
export const useTicker = () => useContext(TickerContext) || { prices: seedPrices, prev: seedPrices };

export function TickerProvider({ children, intervalMs = 2400 }) {
  const [prices, setPrices] = useState(seedPrices);
  const prevRef = useRef(seedPrices);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setPrices((p) => {
        prevRef.current = p;
        const next = {};
        for (const sym of Object.keys(p)) {
          const base = p[sym];
          // ±0.09% per tick keeps movement visible but not chaotic.
          const drift = base * (Math.random() - 0.5) * 0.0018;
          next[sym] = Math.max(0.0001, base + drift);
        }
        return next;
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return (
    <TickerContext.Provider value={{ prices, prev: prevRef.current }}>
      {children}
    </TickerContext.Provider>
  );
}
