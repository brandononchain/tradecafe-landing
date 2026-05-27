import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
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
import Nav from "./components/Nav";
import { TRUST_METRICS, EXTERNAL } from "./lib/brand";
import Terminal from "./pages/Terminal";
import Signals from "./pages/Signals";
import Automation from "./pages/Automation";
import Pool from "./pages/Pool";
import Partners from "./pages/Partners";
import ActiveTraders from "./pages/solutions/ActiveTraders";
import PassiveParticipants from "./pages/solutions/PassiveParticipants";
import PartnersAffiliates from "./pages/solutions/PartnersAffiliates";
import BrokersExchanges from "./pages/solutions/BrokersExchanges";
import FundsManagers from "./pages/solutions/FundsManagers";
// Dashboard app — code-split so the marketing landing stays lean.
const DashboardLayout = lazy(() => import("./dashboard/DashboardLayout"));
const Overview = lazy(() => import("./dashboard/pages/Overview"));
const Analytics = lazy(() => import("./dashboard/pages/Analytics"));
const AppTerminal = lazy(() => import("./dashboard/pages/Terminal"));
const AppSignals = lazy(() => import("./dashboard/pages/Signals"));
const AppAutomation = lazy(() => import("./dashboard/pages/Automation"));
const AppPool = lazy(() => import("./dashboard/pages/Pool"));
const AppMining = lazy(() => import("./dashboard/pages/Mining"));
const AppVitriol = lazy(() => import("./dashboard/pages/Vitriol"));
const AppAffiliate = lazy(() => import("./dashboard/pages/Affiliate"));
const AppSubscriptions = lazy(() => import("./dashboard/pages/Subscriptions"));
const AppSettings = lazy(() => import("./dashboard/pages/Settings"));
const AppJournal = lazy(() => import("./dashboard/pages/Journal"));
const AppVitChat = lazy(() => import("./dashboard/pages/VitChat"));
const AppVitWorld = lazy(() => import("./dashboard/pages/VitWorld"));
const AppProducts = lazy(() => import("./dashboard/pages/Products"));
const AppCard = lazy(() => import("./dashboard/pages/Card"));

function AppLoader() {
  return (
    <div className="min-h-screen bg-[#02080A] flex items-center justify-center">
      <span className="w-6 h-6 rounded-full border-2 border-tradeTeal/30 border-t-tradeTeal animate-spin" />
    </div>
  );
}

const VIDEO_SRC = "/tradecafebackground.mp4";

function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [framesReady, setFramesReady] = useState(false);

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

      {/* ===== NAV (shared component) ===== */}
      <Nav />

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
            <Link
              to="/app/terminal"
              data-testid="cta-launch-terminal"
              className="cta-primary justify-center sm:justify-start sm:self-start"
            >
              Launch Terminal
              <ArrowUpRight className="w-4 h-4" strokeWidth={2.4} />
            </Link>
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/terminal" element={<Terminal />} />
        <Route path="/signals" element={<Signals />} />
        <Route path="/automation" element={<Automation />} />
        <Route path="/pool" element={<Pool />} />
        <Route path="/partners" element={<Partners />} />

        {/* ===== Solutions ===== */}
        <Route path="/solutions/active-traders" element={<ActiveTraders />} />
        <Route path="/solutions/passive-participants" element={<PassiveParticipants />} />
        <Route path="/solutions/partners-affiliates" element={<PartnersAffiliates />} />
        <Route path="/solutions/brokers-exchanges" element={<BrokersExchanges />} />
        <Route path="/solutions/funds-managers" element={<FundsManagers />} />

        {/* ===== Dashboard app ===== */}
        <Route
          path="/app"
          element={
            <Suspense fallback={<AppLoader />}>
              <DashboardLayout />
            </Suspense>
          }
        >
          <Route index element={<Overview />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="journal" element={<AppJournal />} />
          <Route path="terminal" element={<AppTerminal />} />
          <Route path="signals" element={<AppSignals />} />
          <Route path="automation" element={<AppAutomation />} />
          <Route path="pool" element={<AppPool />} />
          <Route path="mining" element={<AppMining />} />
          <Route path="vitriol" element={<AppVitriol />} />
          <Route path="vitchat" element={<AppVitChat />} />
          <Route path="vitworld" element={<AppVitWorld />} />
          <Route path="products" element={<AppProducts />} />
          <Route path="card" element={<AppCard />} />
          <Route path="affiliate" element={<AppAffiliate />} />
          <Route path="subscriptions" element={<AppSubscriptions />} />
          <Route path="settings" element={<AppSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

