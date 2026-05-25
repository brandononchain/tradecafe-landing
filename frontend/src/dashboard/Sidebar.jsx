import { NavLink, useNavigate } from "react-router-dom";
import { ChevronsLeft, LogOut } from "lucide-react";
import { APP_NAV, APP_NAV_FOOTER } from "./nav";
import { ACCOUNT } from "./data";

export default function Sidebar({ collapsed, mobileOpen, onToggleCollapse, onCloseMobile }) {
  const navigate = useNavigate();

  const renderItem = (item) => {
    const Icon = item.icon;
    return (
      <NavLink
        key={item.to}
        to={item.to}
        end={item.end}
        onClick={onCloseMobile}
        className={({ isActive }) => `tc-nav-item ${isActive ? "is-active" : ""}`}
        data-testid={`appnav-${item.label.toLowerCase()}`}
        title={item.label}
      >
        <Icon className="tc-nav-ico" strokeWidth={2} />
        <span className="tc-nav-label">{item.label}</span>
        {item.badge && <span className="tc-nav-badge">{item.badge}</span>}
      </NavLink>
    );
  };

  return (
    <>
      <div
        className={`tc-sidebar-backdrop lg:hidden ${mobileOpen ? "is-open" : ""}`}
        onClick={onCloseMobile}
        aria-hidden
      />
      <aside
        className={`tc-sidebar ${collapsed ? "is-collapsed" : ""} ${mobileOpen ? "is-mobile-open" : ""}`}
        data-testid="app-sidebar"
      >
        <div className="tc-sidebar-head">
          <NavLink to="/" className="flex items-center gap-2 overflow-hidden" aria-label="TradeCafe home">
            <img src="/tradecafe-logo.svg" alt="TradeCafe" className="tc-sidebar-logo" draggable={false} />
            {!collapsed && (
              <span className="trade-wordmark text-[17px] text-tradeWhite hidden lg:inline whitespace-nowrap">
                TradeCafe
              </span>
            )}
          </NavLink>
          <button
            className="tc-iconbtn ml-auto hidden lg:inline-flex"
            onClick={onToggleCollapse}
            aria-label="Collapse sidebar"
            data-testid="sidebar-collapse"
            style={{ width: 30, height: 30 }}
          >
            <ChevronsLeft
              className="w-4 h-4 transition-transform"
              style={{ transform: collapsed ? "rotate(180deg)" : "none" }}
              strokeWidth={2}
            />
          </button>
        </div>

        <nav className="tc-sidebar-scroll">
          {APP_NAV.map((group) => (
            <div key={group.section}>
              <div className="tc-nav-section">{collapsed ? "·" : group.section}</div>
              {group.items.map(renderItem)}
            </div>
          ))}
        </nav>

        <div className="tc-sidebar-foot">
          {APP_NAV_FOOTER.map(renderItem)}
          <div
            className="tc-side-user mt-2"
            onClick={() => navigate("/app/settings")}
            data-testid="sidebar-user"
          >
            <span className="tc-avatar">{ACCOUNT.username.slice(0, 1).toUpperCase()}</span>
            <div className="tc-side-user-meta min-w-0">
              <div className="text-[13px] font-semibold text-tradeWhite truncate">{ACCOUNT.username}</div>
              <div className="text-[10.5px] text-white/45 truncate">{ACCOUNT.email}</div>
            </div>
            <LogOut className="tc-side-user-meta w-4 h-4 text-white/40 shrink-0" strokeWidth={2} />
          </div>
        </div>
      </aside>
    </>
  );
}
