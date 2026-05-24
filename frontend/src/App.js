import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  ArrowUpRight,
  Activity,
  Bot,
  LineChart,
  Layers,
  Users,
} from "lucide-react";
import "@/App.css";

const NAV_LINKS = ["Terminal", "Signals", "Automation", "Pool", "Partners"];
const VIDEO_SRC = "/tradecafebackground.mp4";

const TRUST_METRICS = [
  { label: "24/7 AI Signal Engine", value: null, type: "status" },
  { label: "Win Rate", value: "81%" },
  { label: "Trades", value: "20K+" },
  { label: "Signals", value: "8,782" },
  { label: "Managed", value: "$3M+" },
  { label: "Uptime", value: "99.9%" },
];

function App() {
  const [mounted, setMounted] = useState(false);
  const [framesReady, setFramesReady] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const videoRef = useRef(null);
  const videoBgRef = useRef(null);
  const displayCanvasRef = useRef(null);
  const framesRef = useRef([]);
  const heroContentRef = useRef(null);

  // Mount flag for entrance animations
  useEffect(() => {
    setMounted(true);
  }, []);

  // ===== Frame capture (boomerang) =====
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    let captureCanvas = null;
    let captureCtx = null;
    let capturedWidth = 0;
    let capturedHeight = 0;

    const setupCapture = () => {
      const MAX_W = 960;
      const ratio = video.videoWidth ? video.videoHeight / video.videoWidth : 9 / 16;
      capturedWidth = Math.min(video.videoWidth || MAX_W, MAX_W);
      capturedHeight = Math.round(capturedWidth * ratio);
      captureCanvas = document.createElement("canvas");
      captureCanvas.width = capturedWidth;
      captureCanvas.height = capturedHeight;
      captureCtx = captureCanvas.getContext("2d");
    };

    const captureFrame = () => {
      if (!captureCtx || cancelled) return;
      const off = document.createElement("canvas");
      off.width = capturedWidth;
      off.height = capturedHeight;
      const offCtx = off.getContext("2d");
      offCtx.drawImage(video, 0, 0, capturedWidth, capturedHeight);
      framesRef.current.push(off);
    };

    const onLoadedMeta = () => {
      setupCapture();
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }

      if ("requestVideoFrameCallback" in video) {
        const step = () => {
          if (cancelled) return;
          captureFrame();
          video.requestVideoFrameCallback(step);
        };
        video.requestVideoFrameCallback(step);
      } else {
        const interval = setInterval(() => {
          if (cancelled || video.ended) {
            clearInterval(interval);
            return;
          }
          captureFrame();
        }, 33);
      }
    };

    const onEnded = () => {
      if (framesRef.current.length > 0) {
        setFramesReady(true);
      }
    };

    video.addEventListener("loadedmetadata", onLoadedMeta);
    video.addEventListener("ended", onEnded);

    return () => {
      cancelled = true;
      video.removeEventListener("loadedmetadata", onLoadedMeta);
      video.removeEventListener("ended", onEnded);
    };
  }, []);

  // ===== Boomerang playback on canvas =====
  useEffect(() => {
    if (!framesReady) return;
    const canvas = displayCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const frames = framesRef.current;
    if (!frames.length) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let idx = 0;
    let dir = 1;
    let last = performance.now();
    const fpsInterval = 1000 / 30;
    let rafId;

    const drawFrame = (frame) => {
      const cw = canvas.width;
      const ch = canvas.height;
      const fw = frame.width;
      const fh = frame.height;
      const canvasRatio = cw / ch;
      const frameRatio = fw / fh;
      let dw, dh, dx, dy;
      if (frameRatio > canvasRatio) {
        dh = ch;
        dw = ch * frameRatio;
        dx = (cw - dw) / 2;
        dy = 0;
      } else {
        dw = cw;
        dh = cw / frameRatio;
        dx = 0;
        dy = (ch - dh) / 2;
      }
      ctx.drawImage(frame, dx, dy, dw, dh);
    };

    const loop = (now) => {
      rafId = requestAnimationFrame(loop);
      const elapsed = now - last;
      if (elapsed < fpsInterval) return;
      last = now - (elapsed % fpsInterval);

      const frame = frames[idx];
      if (frame) drawFrame(frame);

      idx += dir;
      if (idx >= frames.length - 1) {
        idx = frames.length - 1;
        dir = -1;
      } else if (idx <= 0) {
        idx = 0;
        dir = 1;
      }
    };

    rafId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [framesReady]);

  // ===== Parallax disabled per user request — screen stays still =====

  // ===== Entrance animation =====
  useEffect(() => {
    if (!mounted) return;
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-anim='kicker']", { y: 14, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.15,
      });
      gsap.fromTo("[data-anim='title']", { y: 36, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1.1, ease: "power3.out", delay: 0.25,
      });
      gsap.fromTo("[data-anim='subtitle']", { y: 18, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.5,
      });
      gsap.fromTo("[data-anim='body']", { y: 16, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.65,
      });
      gsap.fromTo("[data-anim='ctas'] > *", { y: 18, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.08, delay: 0.8,
      });
      gsap.fromTo("[data-anim='metric']", { y: 14, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.06, delay: 0.95,
      });
      gsap.fromTo("[data-anim='bottom']", { opacity: 0 }, {
        opacity: 1, duration: 1.0, ease: "power2.out", delay: 1.2,
      });
      gsap.fromTo("[data-anim='nav']", { y: -20, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.1,
      });
    });
    return () => ctx.revert();
  }, [mounted]);

  return (
    <div
      className="relative min-h-screen bg-black text-tradeWhite font-body overflow-hidden"
      data-testid="tradecafe-hero"
    >
      {/* ===== Cinematic hero frame ===== */}
      <section className="hero-frame" data-testid="hero-frame">
      {/* ===== Video background ===== */}
      <div
        ref={videoBgRef}
        className="absolute inset-0 z-0 scale-[1.06] origin-center"
        data-testid="video-bg-layer"
      >
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          poster="/tradecafebackground-poster.jpg"
          autoPlay
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
          style={{ display: framesReady ? "none" : "block" }}
        />
        <canvas
          ref={displayCanvasRef}
          className="w-full h-full object-cover"
          style={{ display: framesReady ? "block" : "none" }}
        />
        {/* Fallback dark gradient if video fails */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(1200px 600px at 20% 10%, rgba(0,180,166,0.18), transparent 60%), radial-gradient(900px 500px at 80% 80%, rgba(232,120,42,0.14), transparent 55%), #05080D",
          }}
        />
      </div>

      {/* Video overlay tint */}
      <div className="absolute inset-0 z-10 video-overlay pointer-events-none" />

      {/* Subtle grain */}
      <div
        className="absolute inset-0 z-10 opacity-[0.08] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            "url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')",
        }}
      />

      {/* ===== NAV — inside hero-frame, fluid responsive layout ===== */}
      <nav
        data-anim="nav"
        data-testid="tradecafe-nav"
        className="absolute top-3 sm:top-4 md:top-5 lg:top-5 left-5 right-5 sm:left-8 sm:right-8 md:left-10 md:right-10 lg:left-12 lg:right-12 z-40 flex items-center justify-between gap-3 sm:gap-6"
      >
        {/* Left: TradeCafe logo lockup (SVG includes custom wordmark) */}
        <a
          href="https://tradecafe.ai"
          className="flex items-center shrink-0 relative"
          data-testid="tradecafe-logo-link"
          aria-label="TradeCafe"
        >
          <img
            src="/tradecafe-wordmark.svg?v=2"
            alt="TradeCafe"
            className="h-10 sm:h-12 lg:h-14 w-auto select-none"
            draggable={false}
            style={{
              filter:
                "drop-shadow(0 1px 0 rgba(0,0,0,0.4)) drop-shadow(0 2px 14px rgba(0,180,166,0.18))",
            }}
          />
        </a>

        {/* Center: nav links (lg+ only) — absolutely centered within nav */}
        <div className="hidden lg:flex items-center gap-7 xl:gap-9 absolute left-1/2 -translate-x-1/2">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              data-testid={`nav-link-${link.toLowerCase()}`}
              className="nav-link"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Right: auth + CTA */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0 relative">
          <a
            href="https://terminal.tradecafe.ai"
            className="hidden lg:inline-flex text-[13px] text-white/65 hover:text-white transition-colors"
            data-testid="nav-signin"
          >
            Sign in
          </a>
          <a
            href="https://terminal.tradecafe.ai"
            data-testid="nav-launch-terminal"
            className="nav-cta-outline hidden lg:inline-flex"
          >
            Launch Terminal
            <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.2} />
          </a>
          <button
            onClick={() => setMobileNavOpen((v) => !v)}
            className="tc-burger lg:hidden"
            data-testid="mobile-menu-toggle"
            aria-label="Toggle menu"
            aria-expanded={mobileNavOpen}
          >
            <span className={`tc-burger-bar ${mobileNavOpen ? "is-open-top" : ""}`} />
            <span className={`tc-burger-bar ${mobileNavOpen ? "is-open-mid" : ""}`} />
            <span className={`tc-burger-bar ${mobileNavOpen ? "is-open-bot" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile nav drawer — branded */}
      <div
        className={`tc-drawer lg:hidden ${mobileNavOpen ? "is-open" : ""}`}
        data-testid="mobile-drawer"
        aria-hidden={!mobileNavOpen}
      >
        <div className="tc-drawer-glow" />
        <div className="tc-drawer-kicker">
          <span className="trade-pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-tradeTeal" />
          <span>Navigation</span>
        </div>
        <ul className="tc-drawer-list">
          {NAV_LINKS.map((link, i) => (
            <li key={link} style={{ "--i": i }}>
              <a
                href={`#${link.toLowerCase()}`}
                className="tc-drawer-link"
                onClick={() => setMobileNavOpen(false)}
                data-testid={`mobile-nav-link-${link.toLowerCase()}`}
              >
                <span className="tc-drawer-link-num">0{i + 1}</span>
                <span className="tc-drawer-link-label">{link}</span>
                <ArrowUpRight className="tc-drawer-link-arrow" strokeWidth={2} />
              </a>
            </li>
          ))}
        </ul>
        <div className="tc-drawer-divider" />
        <div className="tc-drawer-actions">
          <a
            href="https://terminal.tradecafe.ai"
            className="tc-drawer-signin"
            onClick={() => setMobileNavOpen(false)}
            data-testid="mobile-signin"
          >
            Sign in
          </a>
          <a
            href="https://terminal.tradecafe.ai"
            className="cta-primary justify-center w-full"
            onClick={() => setMobileNavOpen(false)}
            data-testid="mobile-cta-launch"
          >
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

      {/* ===== HERO LAYOUT: mobile-first stacked, desktop bottom-left absolute ===== */}
      <main
        ref={heroContentRef}
        className="relative z-20 min-h-[calc(100vh-40px)] flex flex-col"
        data-testid="hero-main"
      >
        {/* Hero content block — flex flow on mobile, absolute bottom-left on sm+ */}
        <div className="flex-1 flex items-end sm:block">
          <div className="w-full px-6 sm:px-0 pb-10 sm:pb-0 pt-0 sm:absolute sm:left-8 md:left-10 lg:left-12 sm:right-auto sm:bottom-12 md:bottom-16 lg:bottom-28 sm:max-w-[520px] md:max-w-[560px] lg:max-w-[640px]">
            {/* Kicker */}
            <div
              data-anim="kicker"
              data-testid="hero-kicker"
              className="hero-kicker text-[10.5px] sm:text-[11px] text-tradeTeal/95 flex items-center gap-2 mb-3 sm:mb-5"
            >
              <span className="trade-pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-tradeTeal" />
              AI Trading Ecosystem
            </div>

          {/* Main title — two-line premium hero (responsive) */}
          <h1
            data-anim="title"
            data-testid="hero-title"
            className="text-left font-heading font-semibold text-tradeWhite"
            style={{
              fontSize: "clamp(30px, 6.6vw, 84px)",
              lineHeight: "1.02",
              letterSpacing: "-0.045em",
            }}
          >
            <span className="block">The calm way</span>
            <span className="block">
              to trade{" "}
              <span className="italic font-light text-white/95">with AI</span>.
            </span>
          </h1>

          {/* Subtitle — readable, responsive sizing */}
          <p
            data-anim="subtitle"
            data-testid="hero-subtitle"
            className="mt-3 sm:mt-5 lg:mt-7 text-[13px] sm:text-[15px] lg:text-[17px] leading-[1.55] sm:leading-[1.6] text-white/74 max-w-[520px] lg:max-w-[560px] font-body"
          >
            A 24/7 trading environment where AI agents scan, signal, execute, and
            help your network grow — while you stay in control.
          </p>

          {/* Premium CTAs — full-width on mobile */}
          <div
            data-anim="ctas"
            data-testid="hero-ctas"
            className="mt-5 sm:mt-7 lg:mt-10 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
          >
            <a
              href="https://terminal.tradecafe.ai"
              data-testid="cta-launch-terminal"
              className="cta-primary justify-center sm:justify-start sm:self-start"
            >
              Launch Terminal
              <ArrowUpRight className="w-4 h-4" strokeWidth={2.4} />
            </a>
            <a
              href="https://tradecafe.ai"
              data-testid="cta-explore-ecosystem"
              className="cta-ghost justify-center sm:justify-start sm:self-start group"
            >
              Explore Ecosystem
              <ArrowUpRight
                className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={2}
              />
            </a>
          </div>

          {/* Inline metric strip on mobile/tablet — replaces absolute floating rail */}
          <div
            data-testid="hero-metrics-inline"
            className="lg:hidden mt-5 sm:mt-6 flex flex-wrap gap-1.5 sm:gap-2"
          >
            <div className="stat-pill is-status">
              <span className="stat-dot" />
              <span className="stat-label">24/7 AI Signals</span>
            </div>
            {TRUST_METRICS.filter((m) => m.type !== "status").slice(0, 3).map((m, i) => (
              <div
                key={m.label}
                data-testid={`metric-mobile-${m.label.toLowerCase().replace(/\s+/g, "-")}`}
                className="stat-pill"
              >
                <MetricIcon i={i} />
                <span className="stat-value">{m.value}</span>
                <span className="stat-label">{m.label}</span>
              </div>
            ))}
          </div>
          </div>
        </div>

        {/* Right-side instrument panel — desktop only, anchored lower-right */}
        <div
          data-anim="bottom"
          data-testid="hero-right-rail"
          className="hidden lg:flex absolute right-12 bottom-24 flex-col items-end gap-2.5 z-20"
        >
          {TRUST_METRICS.map((m, i) => {
            if (m.type === "status") {
              return (
                <div
                  key={m.label}
                  data-anim="metric"
                  data-testid="metric-status"
                  className="stat-pill is-status"
                >
                  <span className="stat-dot" />
                  <span className="stat-label">{m.label}</span>
                </div>
              );
            }
            return (
              <div
                key={m.label}
                data-anim="metric"
                data-testid={`metric-${m.label.toLowerCase().replace(/\s+/g, "-")}`}
                className="stat-pill"
              >
                <MetricIcon i={i - 1} />
                <span className="stat-value">{m.value}</span>
                <span className="stat-label">{m.label}</span>
              </div>
            );
          })}
        </div>
      </main>
      </section>
      {/* ===== /hero-frame ===== */}
    </div>
  );
}

function MetricIcon({ i }) {
  const cls = "stat-icon";
  const icons = [
    <Activity key="a" className={cls} strokeWidth={2} />,
    <LineChart key="l" className={cls} strokeWidth={2} />,
    <Bot key="b" className={cls} strokeWidth={2} />,
    <Layers key="ly" className={cls} strokeWidth={2} />,
    <Users key="u" className={cls} strokeWidth={2} />,
  ];
  return icons[((i % icons.length) + icons.length) % icons.length];
}

export default App;

