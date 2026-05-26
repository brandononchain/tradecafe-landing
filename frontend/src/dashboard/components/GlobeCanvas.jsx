import { useEffect, useRef } from "react";

/**
 * Dependency-free interactive 3D globe rendered on a 2D canvas.
 * Real spherical projection with auto-rotation, drag-to-rotate, depth-shaded
 * graticule, and clickable glowing markers. Brand teal throughout.
 */
export default function GlobeCanvas({ users = [], selectedId = null, onSelect, light = false }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({ rotY: -0.6, rotX: -0.25, dragging: false, moved: false, lastX: 0, lastY: 0 });
  const propsRef = useRef({ users, selectedId, onSelect, light });
  propsRef.current = { users, selectedId, onSelect, light };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // (lat,lng in degrees) -> rotated 3D unit-sphere coords
    const project = (lat, lng) => {
      const phi = (lat * Math.PI) / 180;
      const theta = (lng * Math.PI) / 180;
      let x = Math.cos(phi) * Math.sin(theta);
      let y = Math.sin(phi);
      let z = Math.cos(phi) * Math.cos(theta);
      const { rotY, rotX } = stateRef.current;
      // yaw (around Y)
      let x1 = x * Math.cos(rotY) + z * Math.sin(rotY);
      let z1 = -x * Math.sin(rotY) + z * Math.cos(rotY);
      // pitch (around X)
      let y2 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
      let z2 = y * Math.sin(rotX) + z1 * Math.cos(rotX);
      return { x: x1, y: y2, z: z2 };
    };

    const draw = () => {
      const { users: us, selectedId: sel, light: lt } = propsRef.current;
      const cx = (W / 2) * dpr;
      const cy = (H / 2) * dpr;
      const R = Math.min(W, H) * 0.42 * dpr;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Sphere body
      const grad = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.1, cx, cy, R);
      if (lt) {
        grad.addColorStop(0, "rgba(0,180,166,0.18)");
        grad.addColorStop(0.7, "rgba(210,230,228,0.55)");
        grad.addColorStop(1, "rgba(180,205,202,0.35)");
      } else {
        grad.addColorStop(0, "rgba(0,180,166,0.22)");
        grad.addColorStop(0.7, "rgba(6,20,24,0.92)");
        grad.addColorStop(1, "rgba(2,10,12,0.96)");
      }
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      // rim
      ctx.lineWidth = 1 * dpr;
      ctx.strokeStyle = "rgba(0,180,166,0.35)";
      ctx.stroke();

      // Graticule (front hemisphere only)
      const drawArc = (pts) => {
        ctx.beginPath();
        let started = false;
        for (const p of pts) {
          if (p.z <= 0) { started = false; continue; }
          const sx = cx + p.x * R;
          const sy = cy - p.y * R;
          if (!started) { ctx.moveTo(sx, sy); started = true; } else ctx.lineTo(sx, sy);
        }
        ctx.stroke();
      };
      ctx.lineWidth = 0.6 * dpr;
      ctx.strokeStyle = lt ? "rgba(0,137,126,0.25)" : "rgba(0,180,166,0.16)";
      for (let lat = -60; lat <= 60; lat += 30) {
        const pts = [];
        for (let lng = -180; lng <= 180; lng += 6) pts.push(project(lat, lng));
        drawArc(pts);
      }
      for (let lng = -180; lng < 180; lng += 30) {
        const pts = [];
        for (let lat = -90; lat <= 90; lat += 4) pts.push(project(lat, lng));
        drawArc(pts);
      }

      // Markers (depth-sorted)
      const pts = us
        .map((u) => ({ u, p: project(u.lat, u.lng) }))
        .sort((a, b) => a.p.z - b.p.z);
      for (const { u, p } of pts) {
        if (p.z <= 0.02) continue; // back hemisphere
        const sx = cx + p.x * R;
        const sy = cy - p.y * R;
        const depth = 0.5 + p.z * 0.5;
        const isSel = u.id === sel;
        const col = u.online ? "31,184,166" : "120,130,140";
        const r = (u.online ? 3.2 : 2.6) * dpr * depth;
        if (u.online) {
          ctx.beginPath();
          ctx.arc(sx, sy, r * 3.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${col},${0.18 * depth})`;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${col},${depth})`;
        ctx.fill();
        if (isSel) {
          ctx.beginPath();
          ctx.arc(sx, sy, r + 4 * dpr, 0, Math.PI * 2);
          ctx.lineWidth = 1.5 * dpr;
          ctx.strokeStyle = `rgba(95,224,207,${depth})`;
          ctx.stroke();
        }
      }

      if (!stateRef.current.dragging) stateRef.current.rotY += 0.0016;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    // Interaction
    const hitTest = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      const px = (clientX - rect.left) * dpr;
      const py = (clientY - rect.top) * dpr;
      const cx = (W / 2) * dpr;
      const cy = (H / 2) * dpr;
      const R = Math.min(W, H) * 0.42 * dpr;
      let best = null;
      let bestD = 16 * dpr;
      for (const u of propsRef.current.users) {
        const p = project(u.lat, u.lng);
        if (p.z <= 0.02) continue;
        const sx = cx + p.x * R;
        const sy = cy - p.y * R;
        const d = Math.hypot(sx - px, sy - py);
        if (d < bestD) { bestD = d; best = u; }
      }
      return best;
    };

    const onDown = (e) => {
      const s = stateRef.current;
      s.dragging = true; s.moved = false;
      s.lastX = e.clientX; s.lastY = e.clientY;
      canvas.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e) => {
      const s = stateRef.current;
      if (!s.dragging) return;
      const dx = e.clientX - s.lastX;
      const dy = e.clientY - s.lastY;
      if (Math.abs(dx) + Math.abs(dy) > 2) s.moved = true;
      s.rotY += dx * 0.006;
      s.rotX = Math.max(-1.2, Math.min(1.2, s.rotX + dy * 0.006));
      s.lastX = e.clientX; s.lastY = e.clientY;
    };
    const onUp = (e) => {
      const s = stateRef.current;
      s.dragging = false;
      if (!s.moved) {
        const hit = hitTest(e.clientX, e.clientY);
        if (hit) propsRef.current.onSelect?.(hit);
      }
    };

    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full touch-none cursor-grab active:cursor-grabbing"
      data-testid="globe-canvas"
    />
  );
}
