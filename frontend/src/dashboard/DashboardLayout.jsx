import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { ThemeProvider, useTheme } from "./ThemeContext";
import ChatWidget from "./components/ChatWidget";
import WelcomeModal from "./components/WelcomeModal";

const PAGE_META = {
  "/app": { title: "Overview", sub: "My Account" },
  "/app/analytics": { title: "Analytics", sub: "Analysis & Trading" },
  "/app/journal": { title: "Journal", sub: "Trades & Reports" },
  "/app/terminal": { title: "Terminal", sub: "Live Trading Desk" },
  "/app/signals": { title: "Signals", sub: "AI Signal Engine" },
  "/app/automation": { title: "Automation", sub: "Trading Bots" },
  "/app/pool": { title: "Trading Pool", sub: "Pooled Strategies" },
  "/app/mining": { title: "Mining Pool", sub: "VIT Rewards" },
  "/app/vitriol": { title: "VITRIOL", sub: "Staking" },
  "/app/vitchat": { title: "VITchat", sub: "Community" },
  "/app/vitworld": { title: "VITworld", sub: "Social Globe" },
  "/app/products": { title: "Products", sub: "Ecosystem" },
  "/app/card": { title: "TradeCafe Card", sub: "Spend" },
  "/app/affiliate": { title: "Affiliate Program", sub: "Partner Network" },
  "/app/subscriptions": { title: "Subscriptions", sub: "Billing" },
  "/app/settings": { title: "Settings", sub: "Account & Security" },
};

export default function DashboardLayout() {
  return (
    <ThemeProvider>
      <DashboardShell />
    </ThemeProvider>
  );
}

function DashboardShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const { mode } = useTheme();
  const [welcome, setWelcome] = useState(() => {
    try { return !localStorage.getItem("tc-onboarded"); } catch { return false; }
  });
  const dismissWelcome = () => {
    try { localStorage.setItem("tc-onboarded", "1"); } catch { /* ignore */ }
    setWelcome(false);
  };

  // Close the mobile drawer whenever the route changes.
  useEffect(() => setMobileOpen(false), [pathname]);

  const meta = PAGE_META[pathname] || { title: "Dashboard", sub: "TradeCafe" };

  return (
    <div className="tc-app font-body" data-theme={mode} data-testid="dashboard-app">
      <div className="tc-app-bg" aria-hidden />

      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapse={() => setCollapsed((v) => !v)}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className={`tc-app-main ${collapsed ? "is-collapsed" : ""}`}>
        <Topbar title={meta.title} sub={meta.sub} onOpenMobile={() => setMobileOpen(true)} />
        <main className="tc-content">
          <Outlet />
        </main>
      </div>

      <ChatWidget />
      {welcome && <WelcomeModal onClose={dismissWelcome} />}
    </div>
  );
}
