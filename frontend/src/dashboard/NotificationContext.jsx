import { createContext, useContext, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { Radio, Bot, Layers, ShieldCheck, Users, Bell, CheckCircle2, Gem, Pickaxe, X } from "lucide-react";
import { NOTIFICATIONS } from "./data";
import { usePersistentState } from "./lib/usePersistentState";

export const NOTIF_ICON = {
  signal: Radio, trade: Bot, pool: Layers, system: ShieldCheck,
  affiliate: Users, stake: Gem, mining: Pickaxe, success: CheckCircle2,
};

const NotificationContext = createContext(null);
export const useNotifications = () =>
  useContext(NotificationContext) || { notifications: [], unread: 0, notify: () => {}, markAllRead: () => {} };

let seq = 0;

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = usePersistentState("tc-notifications", NOTIFICATIONS);
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const notify = useCallback(({ type = "system", title, body, toast = true }) => {
    const id = `live-${Date.now()}-${seq++}`;
    setNotifications((p) => [{ id, type, title, body, time: "now", unread: true }, ...p]);
    if (toast) {
      setToasts((t) => [...t, { id, type, title, body }]);
      setTimeout(() => dismissToast(id), 4200);
    }
  }, [dismissToast]);

  const markAllRead = useCallback(() => setNotifications((p) => p.map((n) => ({ ...n, unread: false }))), []);
  const unread = notifications.filter((n) => n.unread).length;

  return (
    <NotificationContext.Provider value={{ notifications, unread, notify, markAllRead }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </NotificationContext.Provider>
  );
}

function ToastViewport({ toasts, onDismiss }) {
  if (!toasts.length) return null;
  return createPortal(
    <div className="fixed z-[95] bottom-4 right-4 left-4 sm:left-auto flex flex-col gap-2 items-stretch sm:items-end pointer-events-none"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }} data-testid="toast-viewport">
      {toasts.map((t) => {
        const Icon = NOTIF_ICON[t.type] || CheckCircle2;
        return (
          <div key={t.id} className="tc-fade pointer-events-auto w-full sm:w-[330px] flex items-start gap-3 px-4 py-3 rounded-xl bg-surface border border-tradeTeal/30 shadow-2xl" data-testid="toast">
            <span className="w-7 h-7 rounded-lg bg-tradeTeal/12 border border-tradeTeal/25 flex items-center justify-center shrink-0">
              <Icon className="w-3.5 h-3.5 text-tradeTeal" strokeWidth={2} />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-[12.5px] font-semibold text-tradeWhite leading-snug">{t.title}</span>
              {t.body && <span className="block text-[11.5px] text-white/50 leading-snug mt-0.5">{t.body}</span>}
            </span>
            <button onClick={() => onDismiss(t.id)} className="tc-iconbtn shrink-0" style={{ width: 24, height: 24 }} aria-label="Dismiss notification">
              <X className="w-3 h-3" strokeWidth={2} />
            </button>
          </div>
        );
      })}
    </div>,
    document.body
  );
}
