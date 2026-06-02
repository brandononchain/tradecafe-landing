import { useEffect, useRef } from "react";

/**
 * Dependency-free 3D force-directed graph rendered on a 2D canvas.
 *
 * Renders a hierarchical referral tree as a living organism:
 * - Force simulation (parent/child springs + global repulsion + center gravity)
 * - Perspective projection with depth-based shading
 * - Drag to rotate; scroll to zoom
 * - Click a node to focus; hover for tooltip
 * - Pulse beams travel parent -> child to convey "live"
 *
 * Data shape: array of { id, name, parentId | null, depth, joined, earned }.
 * The root is the user (parentId === null).
 */
export default function AffiliateGraph({ nodes = [], selectedId = null, onSelect, onHover, light = false }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    rotY: -0.35, rotX: -0.12, zoom: 1,
    dragging: false, moved: false, lastX: 0, lastY: 0,
    sim: null, hoverId: null, t0: performance.now(),
  });
  const propsRef = useRef({ nodes, selectedId, onSelect, onHover, light });
  propsRef.current = { nodes, selectedId, onSelect, onHover, light };

  // --- Build / rebuild simulation when node set changes ---
  useEffect(() => {
    if (!nodes.length) return;
    // Group nodes by depth so we can seed positions on concentric shells.
    const byId = new Map(nodes.map((n) => [n.id, n]));
    const childrenOf = new Map();
    for (const n of nodes) {
      const list = childrenOf.get(n.parentId) || [];
      list.push(n.id);
      childrenOf.set(n.parentId, list);
    }
    const sim = new Map();
    const root = nodes.find((n) => n.parentId == null);
    // Seed positions: BFS layout on a unit sphere, depth -> radius.
    const queue = [{ id: root?.id, depth: 0, theta: 0, phi: 0 }];
    const seen = new Set();
    while (queue.length) {
      const { id, depth } = queue.shift();
      if (!id || seen.has(id)) continue;
      seen.add(id);
      const radius = depth === 0 ? 0 : 1.0 + depth * 1.05;
      const golden = Math.PI * (3 - Math.sqrt(5));
      const idx = sim.size;
      // Fibonacci-ish placement so siblings spread out naturally.
      const y = depth === 0 ? 0 : 1 - (idx / Math.max(nodes.length, 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const phi = golden * idx;
      sim.set(id, {
        x: radius * r * Math.cos(phi) + (Math.random() - 0.5) * 0.1,
        y: radius * y + (Math.random() - 0.5) * 0.1,
        z: radius * r * Math.sin(phi) + (Math.random() - 0.5) * 0.1,
        vx: 0, vy: 0, vz: 0,
        depth,
      });
      for (const cid of childrenOf.get(id) || []) queue.push({ id: cid, depth: depth + 1 });
    }
    // Any orphans (defensive) get random positions.
    for (const n of nodes) if (!sim.has(n.id)) {
      sim.set(n.id, { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2, z: (Math.random() - 0.5) * 2, vx: 0, vy: 0, vz: 0, depth: n.depth || 1 });
    }
    stateRef.current.sim = { positions: sim, byId, childrenOf };
  }, [nodes]);

  // --- Render + simulate loop ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf;
    let W = 0, H = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const project = (x, y, z, sin, cos, sinX, cosX) => {
      // Rotate Y then X.
      const xr = x * cos + z * sin;
      const zr = -x * sin + z * cos;
      const yr = y * cosX - zr * sinX;
      const zr2 = y * sinX + zr * cosX;
      return { xr, yr, zr2 };
    };

    const step = () => {
      const { rotY, rotX, zoom, sim, hoverId, t0 } = stateRef.current;
      const { nodes: nlist, selectedId: selId, light: isLight } = propsRef.current;
      ctx.clearRect(0, 0, W, H);
      if (!sim || !nlist.length) { raf = requestAnimationFrame(step); return; }

      // Physics step — slow, lo-fidelity Verlet-ish.
      const positions = sim.positions;
      const REPEL = 0.022;
      const SPRING = 0.012;
      const GRAVITY = 0.004;
      const DAMP = 0.86;
      const arr = [...positions.values()];
      const ids = [...positions.keys()];
      // Repulsion (sampled for performance on large graphs)
      const N = arr.length;
      const sampleStep = N > 80 ? 2 : 1;
      for (let i = 0; i < N; i++) {
        const a = arr[i];
        for (let j = i + 1; j < N; j += sampleStep) {
          const b = arr[j];
          const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
          const d2 = dx * dx + dy * dy + dz * dz + 0.02;
          const f = REPEL / d2;
          const dd = Math.sqrt(d2);
          const ux = dx / dd, uy = dy / dd, uz = dz / dd;
          a.vx += ux * f; a.vy += uy * f; a.vz += uz * f;
          b.vx -= ux * f; b.vy -= uy * f; b.vz -= uz * f;
        }
      }
      // Springs along parent->child edges
      for (const n of nlist) {
        if (n.parentId == null) continue;
        const a = positions.get(n.id), b = positions.get(n.parentId);
        if (!a || !b) continue;
        const dx = b.x - a.x, dy = b.y - a.y, dz = b.z - a.z;
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.001;
        const rest = 1.1;
        const f = (d - rest) * SPRING;
        a.vx += (dx / d) * f; a.vy += (dy / d) * f; a.vz += (dz / d) * f;
        b.vx -= (dx / d) * f; b.vy -= (dy / d) * f; b.vz -= (dz / d) * f;
      }
      // Pull root to origin
      const root = nlist.find((n) => n.parentId == null);
      if (root) {
        const p = positions.get(root.id);
        if (p) { p.x *= 0.7; p.y *= 0.7; p.z *= 0.7; p.vx = 0; p.vy = 0; p.vz = 0; }
      }
      // Integrate + center gravity for others
      for (let i = 0; i < N; i++) {
        const p = arr[i];
        if (ids[i] === root?.id) continue;
        p.vx -= p.x * GRAVITY;
        p.vy -= p.y * GRAVITY;
        p.vz -= p.z * GRAVITY;
        p.vx *= DAMP; p.vy *= DAMP; p.vz *= DAMP;
        p.x += p.vx; p.y += p.vy; p.z += p.vz;
      }

      // Render
      const cx = W / 2;
      const cy = H / 2;
      const baseScale = Math.min(W, H) * 0.16 * zoom;
      const focal = 5;
      const sinY = Math.sin(rotY), cosY = Math.cos(rotY);
      const sinX = Math.sin(rotX), cosX = Math.cos(rotX);

      // Project all
      const screen = new Map();
      for (const [id, p] of positions) {
        const { xr, yr, zr2 } = project(p.x, p.y, p.z, sinY, cosY, sinX, cosX);
        const pf = focal / (focal - zr2 * 0.45);
        screen.set(id, { sx: cx + xr * baseScale * pf, sy: cy + yr * baseScale * pf, depth: zr2, pf });
      }

      // Glow ground (subtle radial behind)
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.55);
      grd.addColorStop(0, isLight ? "rgba(0,180,166,0.08)" : "rgba(0,180,166,0.10)");
      grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);

      // Edges (sorted back-to-front)
      const edges = [];
      for (const n of nlist) {
        if (n.parentId == null) continue;
        const a = screen.get(n.id), b = screen.get(n.parentId);
        if (!a || !b) continue;
        edges.push({ a, b, depth: (a.depth + b.depth) / 2, n });
      }
      edges.sort((e1, e2) => e1.depth - e2.depth);

      const tNow = (performance.now() - t0) / 1000;
      for (const e of edges) {
        const alpha = Math.max(0.05, Math.min(0.45, 0.35 + e.depth * 0.18));
        ctx.strokeStyle = isLight ? `rgba(0,120,110,${alpha * 0.6})` : `rgba(34,211,180,${alpha})`;
        ctx.lineWidth = 1 * (0.6 + e.a.pf * 0.4);
        ctx.beginPath();
        ctx.moveTo(e.b.sx, e.b.sy);
        ctx.lineTo(e.a.sx, e.a.sy);
        ctx.stroke();
        // Pulse beam
        const seed = (e.n.id.charCodeAt(0) + e.n.id.length) % 7;
        const u = ((tNow * 0.45 + seed * 0.13) % 1);
        const bx = e.b.sx + (e.a.sx - e.b.sx) * u;
        const by = e.b.sy + (e.a.sy - e.b.sy) * u;
        ctx.fillStyle = isLight ? "rgba(0,140,128,0.9)" : "rgba(123,229,204,0.95)";
        ctx.beginPath();
        ctx.arc(bx, by, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // Nodes (sorted back-to-front)
      const order = nlist
        .map((n) => ({ n, s: screen.get(n.id) }))
        .filter((x) => x.s)
        .sort((a, b) => a.s.depth - b.s.depth);

      for (const { n, s } of order) {
        const isRoot = n.parentId == null;
        const isSel = selId === n.id;
        const isHov = hoverId === n.id;
        const sizeBase = isRoot ? 11 : Math.max(3.5, 6 - (n.depth || 1) * 0.9);
        const size = sizeBase * (0.7 + s.pf * 0.5);
        const depthShade = Math.max(0.35, Math.min(1, 0.55 + s.depth * 0.32));
        const accent = isLight ? "0,150,134" : "34,211,180";
        const accentLight = isLight ? "0,170,150" : "123,229,204";

        // Halo for root / selected / hover
        if (isRoot || isSel || isHov) {
          const g = ctx.createRadialGradient(s.sx, s.sy, 0, s.sx, s.sy, size * 4);
          g.addColorStop(0, `rgba(${accentLight}, ${isSel ? 0.55 : isRoot ? 0.55 : 0.35})`);
          g.addColorStop(1, "transparent");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(s.sx, s.sy, size * 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Body
        ctx.fillStyle = isRoot
          ? `rgba(${accentLight}, ${depthShade})`
          : `rgba(${accent}, ${depthShade * (isSel ? 1 : 0.85)})`;
        ctx.beginPath();
        ctx.arc(s.sx, s.sy, size, 0, Math.PI * 2);
        ctx.fill();

        // Outline
        ctx.strokeStyle = isLight ? `rgba(255,255,255,${0.5 * depthShade})` : `rgba(255,255,255,${0.3 * depthShade})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Root + selected label
        if (isRoot || isSel || isHov) {
          const label = isRoot ? "YOU" : (n.name || "user");
          ctx.font = "600 11px JetBrains Mono, monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          const ty = s.sy + size + 6;
          ctx.fillStyle = isLight ? "rgba(8,16,18,0.9)" : "rgba(244,251,250,0.95)";
          // small chip behind label
          const text = label.length > 14 ? label.slice(0, 13) + "…" : label;
          const w = ctx.measureText(text).width;
          ctx.fillStyle = isLight ? "rgba(255,255,255,0.85)" : "rgba(2,8,10,0.82)";
          const padX = 6, padY = 3, rW = w + padX * 2, rH = 15;
          ctx.beginPath();
          ctx.roundRect(s.sx - rW / 2, ty, rW, rH, 4);
          ctx.fill();
          ctx.strokeStyle = isLight ? "rgba(0,150,134,0.4)" : "rgba(34,211,180,0.4)";
          ctx.lineWidth = 0.8;
          ctx.stroke();
          ctx.fillStyle = isLight ? "rgba(0,140,128,0.95)" : "rgba(123,229,204,0.95)";
          ctx.fillText(text, s.sx, ty + padY);
        }
      }

      // Auto-spin slowly when not dragging
      if (!stateRef.current.dragging) {
        stateRef.current.rotY += 0.0017;
      }

      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    // Interaction
    const hitTest = (mx, my) => {
      const { sim, rotY, rotX, zoom } = stateRef.current;
      if (!sim) return null;
      const sinY = Math.sin(rotY), cosY = Math.cos(rotY);
      const sinX = Math.sin(rotX), cosX = Math.cos(rotX);
      const cx = W / 2, cy = H / 2;
      const baseScale = Math.min(W, H) * 0.16 * zoom;
      const focal = 5;
      let best = null, bestD = 20;
      for (const [id, p] of sim.positions) {
        const xr = p.x * cosY + p.z * sinY;
        const zr = -p.x * sinY + p.z * cosY;
        const yr = p.y * cosX - zr * sinX;
        const zr2 = p.y * sinX + zr * cosX;
        const pf = focal / (focal - zr2 * 0.45);
        const sx = cx + xr * baseScale * pf;
        const sy = cy + yr * baseScale * pf;
        const d = Math.hypot(mx - sx, my - sy);
        if (d < bestD) { bestD = d; best = id; }
      }
      return best;
    };

    const onDown = (e) => {
      const rect = canvas.getBoundingClientRect();
      stateRef.current.dragging = true;
      stateRef.current.moved = false;
      stateRef.current.lastX = e.clientX - rect.left;
      stateRef.current.lastY = e.clientY - rect.top;
    };
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const s = stateRef.current;
      if (s.dragging) {
        const dx = mx - s.lastX, dy = my - s.lastY;
        if (Math.abs(dx) + Math.abs(dy) > 2) s.moved = true;
        s.rotY += dx * 0.005;
        s.rotX = Math.max(-1.1, Math.min(1.1, s.rotX + dy * 0.004));
        s.lastX = mx; s.lastY = my;
      } else {
        const id = hitTest(mx, my);
        if (id !== s.hoverId) {
          s.hoverId = id;
          canvas.style.cursor = id ? "pointer" : "grab";
          propsRef.current.onHover?.(id);
        }
      }
    };
    const onUp = (e) => {
      const s = stateRef.current;
      if (!s.moved) {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const id = hitTest(mx, my);
        if (id) propsRef.current.onSelect?.(id);
      }
      s.dragging = false;
    };
    const onWheel = (e) => {
      e.preventDefault();
      const s = stateRef.current;
      const z = s.zoom * (e.deltaY > 0 ? 0.93 : 1.07);
      s.zoom = Math.max(0.45, Math.min(2.4, z));
    };
    canvas.style.cursor = "grab";
    canvas.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    // Touch
    const onTouch = (e) => {
      if (e.touches.length === 1) {
        const t = e.touches[0];
        onMove({ clientX: t.clientX, clientY: t.clientY });
      }
    };
    canvas.addEventListener("touchstart", (e) => { if (e.touches[0]) onDown({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY }); }, { passive: true });
    canvas.addEventListener("touchmove", onTouch, { passive: true });
    canvas.addEventListener("touchend", (e) => onUp({ clientX: stateRef.current.lastX, clientY: stateRef.current.lastY }), { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("wheel", onWheel);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="block w-full h-full select-none"
      style={{ touchAction: "none" }}
      data-testid="affiliate-graph"
      aria-label="3D referral network graph"
    />
  );
}
