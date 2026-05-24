import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { NAV_LINKS, EXTERNAL } from "../lib/brand";

/**
 * Premium floating nav — used on every TradeCafe page.
 * Sits inside the page's hero-frame card.
 */
export default function Nav() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const renderLink = (l, isActive) => {
    const isInternal = l.to.startsWith("/") && !l.to.startsWith("/#");
    const cls = `nav-link ${isActive ? "is-active" : ""}`;
    if (isInternal) {
      return (
        <Link key={l.label} to={l.to} className={cls} data-testid={`nav-link-${l.label.toLowerCase()}`}>
          {l.label}
        </Link>
      );
    }
    return (
      <a key={l.label} href={l.to} className={cls} data-testid={`nav-link-${l.label.toLowerCase()}`}>
        {l.label}
      </a>
    );
  };

  return (
    <>
      <nav
        data-anim="nav"
        data-testid="tradecafe-nav"
        className="absolute top-3 sm:top-4 md:top-5 lg:top-5 left-5 right-5 sm:left-8 sm:right-8 md:left-10 md:right-10 lg:left-12 lg:right-12 z-40 flex items-center justify-between gap-3 sm:gap-6"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center shrink-0 relative" data-testid="tradecafe-logo-link" aria-label="TradeCafe">
          <img
            src="/tradecafe-wordmark.svg?v=2"
            alt="TradeCafe"
            className="h-10 sm:h-12 lg:h-14 w-auto select-none"
            draggable={false}
            style={{ filter: "drop-shadow(0 1px 0 rgba(0,0,0,0.4)) drop-shadow(0 2px 14px rgba(0,180,166,0.18))" }}
          />
        </Link>

        {/* Center: nav links (lg+) */}
        <div className="hidden lg:flex items-center gap-7 xl:gap-9 absolute left-1/2 -translate-x-1/2">
          {NAV_LINKS.map((l) => renderLink(l, pathname === l.to))}
        </div>

        {/* Right: auth + CTA */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0 relative">
          <a
            href={EXTERNAL.launchTerminal}
            className="hidden lg:inline-flex text-[13px] text-white/65 hover:text-white transition-colors"
            data-testid="nav-signin"
          >
            Sign in
          </a>
          <a
            href={EXTERNAL.launchTerminal}
            data-testid="nav-launch-terminal"
            className="nav-cta-outline hidden lg:inline-flex"
          >
            Launch Terminal
            <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.2} />
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="tc-burger lg:hidden"
            data-testid="mobile-menu-toggle"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span className={`tc-burger-bar ${open ? "is-open-top" : ""}`} />
            <span className={`tc-burger-bar ${open ? "is-open-mid" : ""}`} />
            <span className={`tc-burger-bar ${open ? "is-open-bot" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`tc-drawer lg:hidden ${open ? "is-open" : ""}`}
        data-testid="mobile-drawer"
        aria-hidden={!open}
      >
        <div className="tc-drawer-glow" />
        <div className="tc-drawer-kicker">
          <span className="trade-pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-tradeTeal" />
          <span>Navigation</span>
        </div>
        <ul className="tc-drawer-list">
          {NAV_LINKS.map((l, i) => (
            <li key={l.label} style={{ "--i": i }}>
              {l.to.startsWith("/") && !l.to.startsWith("/#") ? (
                <Link to={l.to} className="tc-drawer-link" onClick={() => setOpen(false)} data-testid={`mobile-nav-link-${l.label.toLowerCase()}`}>
                  <span className="tc-drawer-link-num">0{i + 1}</span>
                  <span className="tc-drawer-link-label">{l.label}</span>
                  <ArrowUpRight className="tc-drawer-link-arrow" strokeWidth={2} />
                </Link>
              ) : (
                <a href={l.to} className="tc-drawer-link" onClick={() => setOpen(false)} data-testid={`mobile-nav-link-${l.label.toLowerCase()}`}>
                  <span className="tc-drawer-link-num">0{i + 1}</span>
                  <span className="tc-drawer-link-label">{l.label}</span>
                  <ArrowUpRight className="tc-drawer-link-arrow" strokeWidth={2} />
                </a>
              )}
            </li>
          ))}
        </ul>
        <div className="tc-drawer-divider" />
        <div className="tc-drawer-actions">
          <a href={EXTERNAL.launchTerminal} className="tc-drawer-signin" onClick={() => setOpen(false)} data-testid="mobile-signin">
            Sign in
          </a>
          <a href={EXTERNAL.launchTerminal} className="cta-primary justify-center w-full" onClick={() => setOpen(false)} data-testid="mobile-cta-launch">
            Launch Terminal
            <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.2} />
          </a>
        </div>
        <div className="tc-drawer-footnote">
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/40">
            TradeCafe • AI Trading Ecosystem
          </span>
        </div>
      </div>
    </>
  );
}
