export function PageHead({ eyebrow, title, desc, children }) {
  return (
    <div className="tc-page-head flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div>
        {eyebrow && (
          <div className="tc-page-eyebrow">
            <span className="trade-pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-tradeTeal" />
            {eyebrow}
          </div>
        )}
        <h1 className="tc-page-title">{title}</h1>
        {desc && <p className="tc-page-desc">{desc}</p>}
      </div>
      {children && <div className="flex items-center gap-3 shrink-0">{children}</div>}
    </div>
  );
}

export function Panel({ icon: Icon, title, link, onLink, className = "", glow, hover, children, ...rest }) {
  return (
    <section
      className={`tc-panel ${glow ? "is-glow" : ""} ${hover ? "is-hover" : ""} ${className}`}
      {...rest}
    >
      {(title || Icon || link) && (
        <div className="tc-panel-head">
          {Icon && <span className="ico"><Icon className="w-4 h-4" strokeWidth={2} /></span>}
          {title && <span className="ttl">{title}</span>}
          {link && (
            <span className="tc-panel-link" onClick={onLink}>{link}</span>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
