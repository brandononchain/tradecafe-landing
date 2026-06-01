import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Link, Outlet } from "react-router-dom";
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
import Footer from "./components/Footer";
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
import PartnerProgram from "./pages/network/PartnerProgram";
import BrokerCampaigns from "./pages/network/BrokerCampaigns";
import AmbassadorProgram from "./pages/network/AmbassadorProgram";
import ProofCards from "./pages/network/ProofCards";
import Leaderboards from "./pages/network/Leaderboards";
import Performance from "./pages/insights/Performance";
import AiMethodology from "./pages/insights/AiMethodology";
import RiskFramework from "./pages/insights/RiskFramework";
import MarketNotes from "./pages/insights/MarketNotes";
import Docs from "./pages/insights/Docs";
import About from "./pages/company/About";
import Roadmap from "./pages/company/Roadmap";
import Support from "./pages/company/Support";
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

import { AppShellSkeleton } from "./dashboard/components/Skeletons";

function AppLoader() {
  return <AppShellSkeleton />;
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

      <HomeBody />
    </div>
  );
}

function HomeBody() {
  return (
    <div className="relative z-20 bg-black">
      {/* Pillars */}
      <section className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 pt-20 sm:pt-28 pb-12">
        <div className="flex items-end justify-between gap-6 mb-9 px-2">
          <div>
            <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-tradeTeal/85 mb-2">01 · Platform</div>
            <h2 className="font-heading text-[24px] sm:text-[32px] font-semibold tracking-tight text-white">One workspace for every part of trading.</h2>
          </div>
          <p className="hidden sm:block text-[13px] text-white/55 max-w-[360px] text-right">Terminal, signals, automation, and pooled strategies — calmly connected.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { eyebrow: "Terminal", title: "Pro multi-chart desk", body: "Charts, order tickets, alerts, and AI signals in one bento layout.", to: "/terminal" },
            { eyebrow: "Signals", title: "Live AI signal feed", body: "Entry, target, stop, conviction — one tap to load into the terminal.", to: "/signals" },
            { eyebrow: "Automation", title: "Strategies that work overnight", body: "Trend, breakout, momentum, grid, DCA — with strict risk caps.", to: "/automation" },
            { eyebrow: "Trading Pool", title: "Pooled, transparent alpha", body: "Allocate to managed strategies with reported performance on Arbitrum.", to: "/pool" },
          ].map((c) => (
            <Link key={c.eyebrow} to={c.to} className="rounded-2xl bg-white/[0.025] border border-white/[0.06] p-5 hover:border-tradeTeal/30 transition-colors group">
              <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-tradeTeal/80 mb-3">{c.eyebrow}</div>
              <div className="font-heading text-[18px] font-semibold text-white leading-snug mb-2">{c.title}</div>
              <p className="text-[13px] text-white/55 leading-[1.55]">{c.body}</p>
              <div className="mt-5 inline-flex items-center gap-1 text-[12px] text-white/70 group-hover:text-tradeTeal">Explore <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.2} /></div>
            </Link>
          ))}
        </div>
      </section>

      {/* Proof strip */}
      <section className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <div className="rounded-2xl bg-gradient-to-br from-tradeTeal/[0.06] to-transparent border border-tradeTeal/15 px-6 sm:px-10 py-8 sm:py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { v: "$3.12M", l: "Managed in Pool" },
            { v: "81%", l: "Avg signal win rate" },
            { v: "20K+", l: "Trades placed" },
            { v: "24/7", l: "AI coverage" },
          ].map((m) => (
            <div key={m.l}>
              <div className="font-heading text-[28px] sm:text-[34px] font-semibold text-white tracking-tight">{m.v}</div>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/55 mt-1">{m.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Ecosystem */}
      <section className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="flex items-end justify-between gap-6 mb-9 px-2">
          <div>
            <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-tradeTeal/85 mb-2">02 · Ecosystem</div>
            <h2 className="font-heading text-[24px] sm:text-[32px] font-semibold tracking-tight text-white">Built for traders who stay in control.</h2>
          </div>
          <p className="hidden sm:block text-[13px] text-white/55 max-w-[360px] text-right">Centralized, on-chain, and pooled — your custody and your rules.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { t: "Multi-venue execution", b: "Route to CEX accounts or sign on-chain via Arbitrum One — same terminal, same workflow." },
            { t: "AI signal layer", b: "Conviction-scored signals, risk-gated, with a one-tap load into a live order ticket." },
            { t: "Strategy automation", b: "Battle-tested strategies with per-bot risk caps, kill-switches, and audit trails." },
            { t: "Pooled vaults", b: "Allocate to managed strategies with on-chain transparency and defined exit windows." },
            { t: "Performance & journal", b: "Equity curves, drawdown analytics, and a trade journal that learns with you." },
            { t: "Partner network", b: "Brokers, ambassadors, and creators with verifiable proof cards and clean payouts." },
          ].map((c, i) => (
            <div key={c.t} className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-5">
              <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-tradeTeal/80 mb-3">0{i + 1}</div>
              <div className="font-heading text-[16px] font-semibold text-white mb-1.5">{c.t}</div>
              <p className="text-[13px] text-white/55 leading-[1.55]">{c.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA band */}
      <section className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 pt-8 pb-20">
        <div className="rounded-2xl bg-tradeTeal/[0.08] border border-tradeTeal/25 px-6 sm:px-12 py-10 sm:py-14 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-tradeTeal/85 mb-2">// READY WHEN YOU ARE</div>
            <h3 className="font-heading text-[24px] sm:text-[30px] font-semibold tracking-tight text-white max-w-[640px] leading-[1.2]">
              Open the terminal. Stay in control.
            </h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link to="/app/terminal" className="cta-primary justify-center">
              Launch Terminal <ArrowUpRight className="w-4 h-4" strokeWidth={2.4} />
            </Link>
            <Link to="/insights/docs" className="cta-ghost justify-center">
              Read the docs <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </section>
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

function MarketingShell() {
  return (
    <>
      <Outlet />
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MarketingShell />}>
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

        {/* ===== Network ===== */}
        <Route path="/network/partner-program" element={<PartnerProgram />} />
        <Route path="/network/broker-campaigns" element={<BrokerCampaigns />} />
        <Route path="/network/ambassador-program" element={<AmbassadorProgram />} />
        <Route path="/network/proof-cards" element={<ProofCards />} />
        <Route path="/network/leaderboards" element={<Leaderboards />} />

        {/* ===== Insights ===== */}
        <Route path="/insights/performance" element={<Performance />} />
        <Route path="/insights/ai-methodology" element={<AiMethodology />} />
        <Route path="/insights/risk-framework" element={<RiskFramework />} />
        <Route path="/insights/market-notes" element={<MarketNotes />} />
        <Route path="/insights/docs" element={<Docs />} />

        {/* ===== Company ===== */}
        <Route path="/company/about" element={<About />} />
        <Route path="/company/roadmap" element={<Roadmap />} />
        <Route path="/company/support" element={<Support />} />
        </Route>

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

