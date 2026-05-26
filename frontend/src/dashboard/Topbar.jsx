import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Bell, Eye, ArrowUpRight, Sun, Moon, Radio, Bot, Layers, ShieldCheck, Users } from "lucide-react";
import { ACCOUNT, NOTIFICATIONS } from "./data";
import { useTheme } from "./ThemeContext";

const NOTIF_ICON = { signal: Radio, trade: Bot, pool: Layers, system: ShieldCheck, affiliate: Users };

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function Topbar({ title, sub, onOpenMobile }) {
  const time = useClock();

  return (
    <header className="tc-topbar" data-testid="app-topbar">
      <button
        className="tc-iconbtn lg:hidden"
        onClick={onOpenMobile}
        aria-label="Open menu"
        data-testid="topbar-menu"
      >
        <Menu className="w-4 h-4" strokeWidth={2} />
      </button>

      <div className="min-w-0">
        <div className="tc-topbar-title truncate">{title}</div>
        {sub && <div className="tc-topbar-sub truncate">{sub}</div>}
      </div>

      <div className="ml-auto flex items-center gap-3">
        <span className="tc-clock hidden sm:inline">{time}</span>

        <div className="tc-balance-pill hidden md:inline-flex" data-testid="topbar-balance">
          <span className="lbl">Balance</span>
          <span className="val">${ACCOUNT.balance.toFixed(2)}</span>
          <span className="text-[10px] font-mono text-tradeTeal">{ACCOUNT.currency}</span>
        </div>

        <ModeToggle />
        <NotificationsMenu />
        <button className="tc-iconbtn hidden sm:inline-flex" aria-label="Watchlist">
          <Eye className="w-4 h-4" strokeWidth={2} />
        </button>

        <Link
          to="/app/terminal"
          className="tc-btn tc-btn-primary hidden sm:inline-flex"
          style={{ padding: "9px 16px", fontSize: 12.5 }}
          data-testid="topbar-launch"
        >
          Launch Terminal
          <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.4} />
        </Link>
      </div>
    </header>
  );
}

function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(NOTIFICATIONS);
  const ref = useRef(null);
  const unread = items.filter((n) => n.unread).length;

  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button className="tc-iconbtn relative" aria-label="Notifications" onClick={() => setOpen((v) => !v)} data-testid="topbar-notifications">
        <Bell className="w-4 h-4" strokeWidth={2} />
        {unread > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-[15px] h-[15px] px-1 rounded-full bg-tradeTeal text-[#042024] font-mono text-[9px] leading-[15px] text-center">{unread}</span>}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-[320px] rounded-xl bg-surface border border-white/8 shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/6">
            <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-white/50">Notifications</span>
            <button className="font-mono text-[10px] text-tradeTeal hover:opacity-80" onClick={() => setItems((p) => p.map((n) => ({ ...n, unread: false })))}>
              Mark all read
            </button>
          </div>
          <div className="max-h-[360px] overflow-y-auto">
            {items.map((n) => {
              const Icon = NOTIF_ICON[n.type] || Bell;
              return (
                <div key={n.id} className={`flex items-start gap-3 px-4 py-3 border-b border-white/4 last:border-0 ${n.unread ? "bg-tradeTeal/[0.04]" : ""}`}>
                  <span className="w-7 h-7 rounded-lg bg-tradeTeal/10 border border-tradeTeal/20 flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 text-tradeTeal" strokeWidth={2} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[12.5px] font-medium text-white/85 leading-snug">{n.title}</span>
                    <span className="block text-[11.5px] text-white/45 leading-snug mt-0.5">{n.body}</span>
                  </span>
                  <span className="font-mono text-[9.5px] text-white/35 shrink-0">{n.time}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ModeToggle() {
  const { mode, toggle } = useTheme();
  const dark = mode === "dark";
  return (
    <button
      className="tc-iconbtn"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
      onClick={toggle}
      data-testid="mode-toggle"
    >
      {dark ? <Sun className="w-4 h-4" strokeWidth={2} /> : <Moon className="w-4 h-4" strokeWidth={2} />}
    </button>
  );
}
