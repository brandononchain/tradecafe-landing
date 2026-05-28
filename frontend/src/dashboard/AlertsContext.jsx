import { createContext, useContext, useCallback, useEffect, useRef } from "react";
import { usePersistentState } from "./lib/usePersistentState";
import { useTicker } from "./TickerContext";
import { useNotifications } from "./NotificationContext";

// Price alerts — users set a target on a symbol with an "above" or
// "below" condition. The provider watches the live tick and fires a
// notification + toast the first time the threshold is crossed, then
// auto-removes the alert. Persisted across reloads.
const AlertsContext = createContext(null);
export const useAlerts = () => useContext(AlertsContext) || {
  alerts: [], addAlert: () => {}, removeAlert: () => {}, alertsFor: () => [],
};

let seq = 0;

export function AlertsProvider({ children }) {
  const [alerts, setAlerts] = usePersistentState("tc-alerts-list", []);
  const { prices } = useTicker();
  const { notify } = useNotifications();
  // Avoid double-firing inside a single render burst.
  const firedRef = useRef(new Set());

  const addAlert = useCallback((alert) => {
    setAlerts((a) => [...a, { id: `al-${Date.now()}-${seq++}`, createdAt: Date.now(), ...alert }]);
  }, [setAlerts]);

  const removeAlert = useCallback((id) => {
    setAlerts((a) => a.filter((x) => x.id !== id));
  }, [setAlerts]);

  const alertsFor = useCallback((sym) => alerts.filter((a) => a.symbol === sym), [alerts]);

  // Monitor ticked prices and trigger alerts when crossed.
  useEffect(() => {
    if (!alerts.length) return;
    const triggered = [];
    for (const a of alerts) {
      if (firedRef.current.has(a.id)) continue;
      const price = prices[a.symbol];
      if (price == null) continue;
      const crossed =
        (a.condition === "above" && price >= a.price) ||
        (a.condition === "below" && price <= a.price);
      if (crossed) {
        firedRef.current.add(a.id);
        triggered.push(a);
      }
    }
    if (triggered.length) {
      for (const a of triggered) {
        notify({
          type: "signal",
          title: `${a.symbol} ${a.condition === "above" ? "crossed above" : "fell below"} ${a.price.toLocaleString()}`,
          body: `Price alert · live tick`,
        });
      }
      setAlerts((curr) => curr.filter((x) => !triggered.some((t) => t.id === x.id)));
    }
  }, [prices, alerts, notify, setAlerts]);

  return (
    <AlertsContext.Provider value={{ alerts, addAlert, removeAlert, alertsFor }}>
      {children}
    </AlertsContext.Provider>
  );
}
