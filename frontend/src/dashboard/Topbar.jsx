import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Bell, ArrowUpRight, Sun, Moon } from "lucide-react";
import { ACCOUNT } from "./data";
import { useTheme } from "./ThemeContext";
import { useNotifications, NOTIF_ICON } from "./NotificationContext";

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
  const { pathname } = useLocation();
  const onTerminal = pathname.startsWith("/app/terminal");

  return (
    <header className="tc-topbar" data-testid="app-topbar">
      <span className="inline-flex lg:hidden shrink-0">
        <button
          className="tc-iconbtn"
          onClick={onOpenMobile}
          aria-label="Open menu"
          data-testid="topbar-menu"
        >
          <Menu className="w-4 h-4" strokeWidth={2} />
        </button>
      </span>

      <div className="min-w-0 flex-1">
        <div className="tc-topbar-title truncate">{title}</div>
        {sub && <div className="tc-topbar-sub truncate">{sub}</div>}
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <span className="tc-clock hidden xl:inline">{time}</span>

        <span className="hidden md:inline-flex">
          <span className="tc-balance-pill" data-testid="topbar-balance">
            <span className="lbl">Balance</span>
            <span className="val">${ACCOUNT.balance.toFixed(2)}</span>
            <span className="text-[10px] font-mono text-tradeTeal">{ACCOUNT.currency}</span>
          </span>
        </span>

        <ModeToggle />
        <NotificationsMenu />

        {!onTerminal && (
          <span className="hidden lg:inline-flex">
            <Link
              to="/app/terminal"
              className="tc-btn tc-btn-ghost"
              style={{ padding: "9px 16px", fontSize: 12.5 }}
              data-testid="topbar-launch"
            >
              Launch Terminal
              <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.4} />
            </Link>
          </span>
        )}
      </div>
    </header>
  );
}

function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const { notifications: items, unread, markAllRead } = useNotifications();
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button className="tc-iconbtn relative" aria-label="Notifications" onClick={() => setOpen((v) => !v)} data-testid="topbar-notifications">
        <Bell className="w-4 h-4" strokeWidth={2} />
        {unread > 0 && <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-tradeTeal text-[#042024] font-mono text-[9px] leading-[16px] text-center ring-2 ring-[var(--tc-surface,#0a1418)]">{unread}</span>}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-[320px] rounded-xl bg-surface border border-white/[0.05] shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.045]">
            <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-white/50">Notifications</span>
            <button className="font-mono text-[10px] text-tradeTeal hover:opacity-80" onClick={markAllRead}>
              Mark all read
            </button>
          </div>
          <div className="max-h-[360px] overflow-y-auto">
            {items.map((n) => {
              const Icon = NOTIF_ICON[n.type] || Bell;
              return (
                <div key={n.id} className={`flex items-start gap-3 px-4 py-3 border-b border-white/[0.03] last:border-0 ${n.unread ? "bg-tradeTeal/[0.04]" : ""}`}>
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
