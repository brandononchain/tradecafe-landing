import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { NAV_MENUS, EXTERNAL } from "../lib/brand";

/**
 * Enterprise-grade floating nav — glass capsule with premium mega-menus.
 * Sits inside the page's hero-frame card.
 */
export default function Nav() {
  const [open, setOpen] = useState(false); // mobile drawer
  const [active, setActive] = useState(null); // open mega-menu index
  const [expanded, setExpanded] = useState(null); // mobile accordion section
  const closeTimer = useRef(null);
  const { pathname } = useLocation();

  const openMenu = (i) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActive(i);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setActive(null), 140);
  };
  const cancelClose = () => closeTimer.current && clearTimeout(closeTimer.current);

  useEffect(() => () => closeTimer.current && clearTimeout(closeTimer.current), []);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  // Close any open menu when navigating.
  useEffect(() => { setActive(null); setOpen(false); }, [pathname]);

  const renderTarget = (item, cls, onClick, children) => {
    const isInternal = item.to.startsWith("/") && !item.to.startsWith("/#") && !item.external;
    if (isInternal) {
      return <Link to={item.to} className={cls} onClick={onClick}>{children}</Link>;
    }
    return <a href={item.to} className={cls} onClick={onClick}>{children}</a>;
  };

  return (
    <>
      <nav
        data-anim="nav"
        data-testid="tradecafe-nav"
        className="absolute top-3 sm:top-4 md:top-5 lg:top-5 left-5 right-5 sm:left-8 sm:right-8 md:left-10 md:right-10 lg:left-12 lg:right-12 z-40 flex items-center justify-between gap-3 sm:gap-6"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center shrink-0 relative z-10" data-testid="tradecafe-logo-link" aria-label="TradeCafe">
          <img
            src="/tradecafe-wordmark.svg?v=2"
            alt="TradeCafe"
            className="h-10 sm:h-12 lg:h-14 w-auto select-none"
            draggable={false}
            style={{ filter: "drop-shadow(0 1px 0 rgba(0,0,0,0.4)) drop-shadow(0 2px 14px rgba(0,180,166,0.18))" }}
          />
        </Link>

        {/* Center: glass capsule + mega-menus (lg+) */}
        <div
          className="hidden lg:block absolute left-1/2 -translate-x-1/2"
          onMouseLeave={scheduleClose}
          onMouseEnter={cancelClose}
        >
          <div className="nav-capsule" data-testid="nav-capsule">
            {NAV_MENUS.map((m, i) => (
              <button
                key={m.label}
                className={`nav-cap-item ${active === i ? "is-active" : ""}`}
                onMouseEnter={() => openMenu(i)}
                onClick={() => setActive(active === i ? null : i)}
                aria-expanded={active === i}
                data-testid={`nav-trigger-${m.label.toLowerCase()}`}
              >
                {m.label}
                <ChevronDown className="nav-cap-chev w-3 h-3" strokeWidth={2.4} />
              </button>
            ))}
          </div>

          {/* Mega-menu panel */}
          <div
            className={`nav-mega ${active !== null ? "is-open" : ""}`}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
            role="region"
            aria-hidden={active === null}
            data-testid="nav-mega"
          >
            {active !== null && (
              <div className="nav-mega-grid">
                <div className="nav-feature">
                  <span className="nav-feature-eyebrow">{NAV_MENUS[active].featured.eyebrow}</span>
                  <h3 className="nav-feature-title">{NAV_MENUS[active].featured.title}</h3>
                  <p className="nav-feature-desc">{NAV_MENUS[active].featured.desc}</p>
                  {renderTarget(
                    NAV_MENUS[active].featured.cta,
                    "nav-feature-cta",
                    () => setActive(null),
                    <>
                      {NAV_MENUS[active].featured.cta.label}
                      <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.2} />
                    </>
                  )}
                </div>
                <div className="nav-links-grid">
                  {NAV_MENUS[active].items.map((item) =>
                    renderTarget(
                      item,
                      "nav-menu-link",
                      () => setActive(null),
                      <>
                        <span className="nav-menu-link-label">
                          {item.label}
                          <ArrowUpRight className="nav-menu-link-arrow" strokeWidth={2} />
                        </span>
                        <span className="nav-menu-link-desc">{item.desc}</span>
                      </>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Contact Sales + CTA */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0 relative z-10">
          <a
            href={EXTERNAL.contactSales}
            className="hidden lg:inline-flex text-[13px] font-medium text-white/70 hover:text-white transition-colors"
            data-testid="nav-contact-sales"
          >
            Contact Sales
          </a>
          <Link
            to={EXTERNAL.launchTerminal}
            data-testid="nav-launch-terminal"
            className="nav-cta-outline hidden lg:inline-flex"
          >
            Launch Terminal
            <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.2} />
          </Link>
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

      {/* Mobile drawer — grouped accordion */}
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
          {NAV_MENUS.map((m, i) => (
            <li key={m.label} style={{ "--i": i }}>
              <button
                className={`tc-drawer-group ${expanded === i ? "is-expanded" : ""}`}
                onClick={() => setExpanded(expanded === i ? null : i)}
                data-testid={`mobile-nav-group-${m.label.toLowerCase()}`}
              >
                <span className="tc-drawer-link-num">0{i + 1}</span>
                <span className="tc-drawer-link-label">{m.label}</span>
                <ChevronDown className={`tc-drawer-group-chev ${expanded === i ? "is-open" : ""}`} strokeWidth={2} />
              </button>
              <div className={`tc-drawer-sub ${expanded === i ? "is-open" : ""}`}>
                <div className="tc-drawer-sub-inner">
                  {m.items.map((item) =>
                    renderTarget(
                      item,
                      "tc-drawer-sublink",
                      () => setOpen(false),
                      <>
                        <span>{item.label}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-50" strokeWidth={2} />
                      </>
                    )
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="tc-drawer-divider" />
        <div className="tc-drawer-actions">
          <a href={EXTERNAL.contactSales} className="tc-drawer-signin" onClick={() => setOpen(false)} data-testid="mobile-contact-sales">
            Contact Sales
          </a>
          <Link to={EXTERNAL.launchTerminal} className="cta-primary justify-center w-full" onClick={() => setOpen(false)} data-testid="mobile-cta-launch">
            Launch Terminal
            <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.2} />
          </Link>
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
