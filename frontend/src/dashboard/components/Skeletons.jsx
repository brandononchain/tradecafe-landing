// Layout-matching shimmer placeholders used while lazy routes load.
// Reads cleaner than a centered spinner and previews the destination
// structure so the next paint feels seamless.

const shimmer =
  "relative overflow-hidden bg-[rgb(var(--tc-ink-rgb)/0.05)] before:absolute before:inset-0 before:-translate-x-full before:animate-[tcShimmer_1.4s_infinite] before:bg-gradient-to-r before:from-transparent before:via-[rgb(var(--tc-ink-rgb)/0.07)] before:to-transparent";

function Block({ h = 16, w = "100%", r = 8, className = "", style }) {
  return (
    <div className={`${shimmer} ${className}`} style={{ height: h, width: w, borderRadius: r, ...style }} />
  );
}

// Generic dashboard page skeleton: header strip, stat row, large card.
export function DashboardSkeleton() {
  return (
    <div className="tc-fade flex flex-col gap-5" aria-busy="true" data-testid="dashboard-skeleton">
      <div className="flex flex-col gap-2">
        <Block h={12} w={120} />
        <Block h={28} w={260} />
        <Block h={12} w={340} />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="tc-panel">
            <Block h={10} w={80} className="mb-3" />
            <Block h={26} w="60%" />
            <Block h={10} w={70} className="mt-3" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="tc-panel lg:col-span-2" style={{ minHeight: 280 }}>
          <Block h={14} w={140} className="mb-4" />
          <Block h={220} w="100%" r={12} />
        </div>
        <div className="tc-panel" style={{ minHeight: 280 }}>
          <Block h={14} w={120} className="mb-4" />
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Block h={34} w={34} r={10} />
                <div className="flex-1 flex flex-col gap-1.5">
                  <Block h={11} w="60%" />
                  <Block h={9} w="40%" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Full app shell shimmer for the very first Suspense fallback —
// matches the sidebar + topbar + content frame.
export function AppShellSkeleton() {
  return (
    <div className="tc-app font-body" data-testid="app-shell-skeleton">
      <div className="tc-app-bg" aria-hidden />
      <aside className="fixed left-0 top-0 bottom-0 w-[256px] z-30 hidden lg:flex flex-col gap-3 p-4 border-r"
        style={{ background: "rgb(var(--tc-surface-rgb))", borderColor: "rgb(var(--tc-ink-rgb) / 0.06)" }}>
        <Block h={36} w="60%" />
        <div className="mt-4 flex flex-col gap-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-2 py-2">
              <Block h={16} w={16} r={4} />
              <Block h={10} w="55%" />
            </div>
          ))}
        </div>
      </aside>
      <div className="tc-app-main">
        <header className="tc-topbar">
          <Block h={20} w={160} />
          <div className="ml-auto flex items-center gap-3">
            <Block h={32} w={32} r={11} />
            <Block h={32} w={32} r={11} />
            <Block h={32} w={120} r={12} />
          </div>
        </header>
        <main className="tc-content">
          <DashboardSkeleton />
        </main>
      </div>
    </div>
  );
}
