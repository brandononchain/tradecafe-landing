import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  ArrowUpRight,
  Activity,
  Bot,
  LineChart,
  Layers,
  Users,
  Menu,
  X,
} from "lucide-react";
import "@/App.css";

const NAV_LINKS = ["Terminal", "Signals", "Trading Bot", "Trading Pool", "Partners"];
const VIDEO_SRC = "/tradecafebackground.mp4";

const TRUST_METRICS = [
  { label: "Win Rate", value: "81%" },
  { label: "Trades", value: "20k+" },
  { label: "Signals", value: "8,782" },
  { label: "Managed", value: "$2M+" },
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

      {/* ===== NAV — floating lens-glass capsule ===== */}
      <nav
        data-anim="nav"
        data-testid="tradecafe-nav"
        className="nav-shell"
      >
        <div className="flex items-center justify-between gap-4 sm:gap-6 w-full">
          {/* Left: logo + wordmark */}
          <a
            href="https://tradecafe.ai"
            className="flex items-center gap-2.5 relative"
            data-testid="tradecafe-logo-link"
          >
            <img
              src="/tradecafe-logo.png"
              alt="TradeCafe"
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
            />
            <span className="trade-wordmark text-lg sm:text-xl text-white">
              TradeCafe
            </span>
          </a>

          {/* Center: nav links (desktop) */}
          <div className="hidden lg:flex items-center gap-7 relative">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                data-testid={`nav-link-${link.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-[13px] font-medium hover:text-white transition-colors"
                style={{ color: "rgba(255,255,255,0.72)" }}
              >
                {link}
              </a>
            ))}
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2 sm:gap-3 relative">
            <a
              href="https://terminal.tradecafe.ai"
              className="hidden sm:inline-flex text-[13px] text-white/70 hover:text-white transition-colors px-2 py-1"
              data-testid="nav-signin"
            >
              Sign in
            </a>
            <a
              href="https://terminal.tradecafe.ai"
              data-testid="nav-launch-terminal"
              className="liquid-glass-strong rounded-pill inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 text-[13px] font-medium text-white transition-transform duration-300 hover:scale-[1.04]"
            >
              Launch Terminal
              <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.2} />
            </a>
            <button
              onClick={() => setMobileNavOpen((v) => !v)}
              className="lg:hidden inline-flex items-center justify-center w-9 h-9 text-white/80 relative"
              data-testid="mobile-menu-toggle"
              aria-label="Toggle menu"
            >
              {mobileNavOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile nav dropdown */}
      {mobileNavOpen && (
        <div className="lg:hidden fixed top-[92px] left-4 right-4 z-[55] liquid-glass rounded-[28px] px-5 py-5 flex flex-col gap-3.5">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-sm text-white/80 hover:text-white"
              onClick={() => setMobileNavOpen(false)}
              data-testid={`mobile-nav-link-${link.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {link}
            </a>
          ))}
          <a
            href="https://terminal.tradecafe.ai"
            className="text-sm text-white/80 hover:text-white"
          >
            Sign in
          </a>
        </div>
      )}

      {/* ===== HERO LAYOUT: bottom-left content, video stays center stage ===== */}
      <main
        ref={heroContentRef}
        className="relative z-20 min-h-[calc(100vh-40px)]"
        data-testid="hero-main"
      >
        {/* Bottom-left content block */}
        <div className="absolute left-8 sm:left-12 right-8 sm:right-auto bottom-24 sm:bottom-28 max-w-[640px]">
          {/* Kicker */}
          <div
            data-anim="kicker"
            data-testid="hero-kicker"
            className="hero-kicker text-[10.5px] sm:text-[11px] text-tradeTeal/95 flex items-center gap-2 mb-5 sm:mb-6"
          >
            <span className="trade-pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-tradeTeal" />
            AI Trading Ecosystem
          </div>

          {/* Main title — calm, restrained, left-aligned */}
          <h1
            data-anim="title"
            data-testid="hero-title"
            className="text-left font-heading font-semibold text-tradeWhite leading-[0.98] tracking-[-0.04em]"
            style={{ fontSize: "clamp(34px, 4.6vw, 64px)" }}
          >
            The calm way to trade{" "}
            <span className="italic font-light text-white/95">with AI</span>.
          </h1>

          {/* Subtitle — readable, generous spacing */}
          <p
            data-anim="subtitle"
            data-testid="hero-subtitle"
            className="mt-5 sm:mt-6 text-[14px] sm:text-[15px] leading-[1.65] text-white/72 max-w-[540px] font-body"
          >
            A 24/7 trading environment where AI agents scan, signal, execute, and
            help your network grow — while you stay in control.
          </p>

          {/* Single calm CTA + subtle text link */}
          <div
            data-anim="ctas"
            data-testid="hero-ctas"
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6"
          >
            <a
              href="https://terminal.tradecafe.ai"
              data-testid="cta-launch-terminal"
              className="liquid-glass-strong rounded-pill inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 text-[13px] font-medium text-white transition-transform duration-300 hover:scale-[1.04] self-start"
            >
              Launch Terminal
              <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.2} />
            </a>
            <a
              href="https://tradecafe.ai"
              data-testid="cta-join-ecosystem"
              className="inline-flex items-center gap-1.5 text-[13px] text-white/65 hover:text-white transition-colors self-start group"
            >
              Or join the ecosystem
              <ArrowUpRight
                className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={2}
              />
            </a>
          </div>
        </div>

        {/* Bottom-right rail: Live pill + compact metrics (desktop only) */}
        <div
          data-anim="bottom"
          data-testid="hero-right-rail"
          className="hidden lg:flex absolute right-12 bottom-28 flex-col items-end gap-2.5 z-20"
        >
          <div className="liquid-glass rounded-pill px-3.5 py-1.5 inline-flex items-center gap-2">
            <span className="trade-pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-tradeTeal" />
            <span className="font-mono text-[10.5px] tracking-[0.18em] uppercase text-white/85">
              Live 24/7 Signal Engine
            </span>
          </div>

          <div
            data-testid="hero-metrics"
            className="flex flex-col items-end gap-1.5"
          >
            {TRUST_METRICS.map((m, i) => (
              <div
                key={m.label}
                data-anim="metric"
                data-testid={`metric-${m.label.toLowerCase().replace(/\s+/g, "-")}`}
                className="liquid-glass rounded-pill px-3 py-1.5 flex items-center gap-2"
              >
                <MetricIcon i={i} />
                <span className="font-mono text-[12px] text-white tracking-tight">
                  {m.value}
                </span>
                <span className="text-[10.5px] text-white/55 uppercase tracking-[0.14em]">
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile metrics — compact row */}
        <div className="lg:hidden absolute left-8 right-8 bottom-10 flex flex-wrap gap-1.5 z-20">
          {TRUST_METRICS.slice(0, 3).map((m) => (
            <div
              key={m.label}
              data-testid={`metric-mobile-${m.label.toLowerCase().replace(/\s+/g, "-")}`}
              className="liquid-glass rounded-pill px-2.5 py-1 flex items-center gap-1.5"
            >
              <span className="font-mono text-[10.5px] text-white">{m.value}</span>
              <span className="text-[9.5px] text-white/55 uppercase tracking-[0.12em]">{m.label}</span>
            </div>
          ))}
        </div>
      </main>
      </section>
      {/* ===== /hero-frame ===== */}

      {/* ===== Risk disclaimer ===== */}
      <div
        data-testid="risk-disclaimer"
        className="fixed bottom-2 left-0 right-0 text-center z-30 pointer-events-none px-4"
      >
        <p className="text-[10px] text-white/35 font-mono tracking-[0.06em]">
          Trading involves risk. Past performance does not guarantee future results.
        </p>
      </div>
    </div>
  );
}

function MetricIcon({ i }) {
  const cls = "w-3.5 h-3.5 text-tradeTeal";
  const icons = [
    <Activity key="a" className={cls} strokeWidth={2} />,
    <LineChart key="l" className={cls} strokeWidth={2} />,
    <Bot key="b" className={cls} strokeWidth={2} />,
    <Layers key="ly" className={cls} strokeWidth={2} />,
    <Users key="u" className={cls} strokeWidth={2} />,
  ];
  return icons[i % icons.length];
}

export default App;
