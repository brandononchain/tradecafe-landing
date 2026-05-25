import { useEffect, useRef, useState } from "react";
import { Menu, Bell, Eye, ArrowUpRight, Palette, Check } from "lucide-react";
import { ACCOUNT } from "./data";
import { useTheme, THEMES } from "./ThemeContext";

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

        <ThemeMenu />

        <button className="tc-iconbtn" aria-label="Notifications" data-testid="topbar-notifications">
          <Bell className="w-4 h-4" strokeWidth={2} />
        </button>
        <button className="tc-iconbtn hidden sm:inline-flex" aria-label="Watchlist">
          <Eye className="w-4 h-4" strokeWidth={2} />
        </button>

        <a
          href="https://terminal.tradecafe.ai"
          className="tc-btn tc-btn-primary hidden sm:inline-flex"
          style={{ padding: "9px 16px", fontSize: 12.5 }}
          data-testid="topbar-launch"
        >
          Launch Terminal
          <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.4} />
        </a>
      </div>
    </header>
  );
}

function ThemeMenu() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        className="tc-iconbtn"
        aria-label="Theme"
        onClick={() => setOpen((v) => !v)}
        data-testid="theme-menu"
      >
        <Palette className="w-4 h-4" strokeWidth={2} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-52 p-1.5 rounded-xl bg-[#070d12] border border-white/10 shadow-xl z-50">
          <div className="px-2.5 py-1.5 font-mono text-[9px] tracking-[0.16em] uppercase text-white/40">Theme</div>
          {THEMES.map((t) => (
            <button
              key={t.key}
              onClick={() => { setTheme(t.key); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left hover:bg-white/[0.04] transition-colors"
              data-testid={`theme-${t.key}`}
            >
              <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ background: t.swatch }} />
              <span className="flex-1 text-[12.5px] text-white/80">{t.label}</span>
              {theme === t.key && <Check className="w-3.5 h-3.5 text-tradeTeal" strokeWidth={2.5} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
