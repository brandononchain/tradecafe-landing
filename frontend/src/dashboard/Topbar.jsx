import { useEffect, useState } from "react";
import { Menu, Bell, Eye, ArrowUpRight } from "lucide-react";
import { ACCOUNT } from "./data";

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
