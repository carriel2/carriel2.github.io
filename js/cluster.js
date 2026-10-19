/*
 * Cluster: canvas renderer with two modes.
 *  - "ambient": drifting plexus of nodes behind the hero
 *  - "topology": control plane → namespaces → pods, interactive
 */
(function () {
  const TAU = Math.PI * 2;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const hexToRgb = (hex) => {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const rgba = (hex, a) => { const [r, g, b] = hexToRgb(hex); return `rgba(${r},${g},${b},${a})`; };

  function hexPath(ctx, x, y, r) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (TAU / 6) * i + Math.PI / 6;
      const px = x + r * Math.cos(a), py = y + r * Math.sin(a);
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
    ctx.closePath();
  }

  class Cluster {
    constructor(canvas, opts = {}) {
      this.c = canvas;
      this.ctx = canvas.getContext("2d");
      this.mode = opts.mode || "ambient";
      this.onSelect = opts.onSelect || (() => {});
      this.filter = null;
      this.mouse = { x: -9999, y: -9999, in: false };
      this.hover = null;
      this.packets = [];
      this.rings = [];
      this.running = false;
      this.visible = true;
      this.t = 0;

      this.resize = this.resize.bind(this);
      this.frame = this.frame.bind(this);

      new ResizeObserver(this.resize).observe(canvas);
      new IntersectionObserver(([e]) => {
        this.visible = e.isIntersecting;
        if (this.visible) this.start();
      }).observe(canvas);

      const target = this.mode === "ambient" ? canvas.parentElement : canvas;
      target.addEventListener("pointermove", (e) => {
        const r = canvas.getBoundingClientRect();
        this.mouse = { x: e.clientX - r.left, y: e.clientY - r.top, in: true };
        if (reduced) this.draw();
      });
      target.addEventListener("pointerleave", () => { this.mouse.in = false; this.mouse.x = -9999; this.hover = null; if (reduced) this.draw(); });
      if (this.mode === "topology") {
        canvas.addEventListener("click", () => { if (this.hover && this.hover.kind === "pod") this.onSelect(this.hover.p); });
      }
      this.resize();
    }

    resize() {
      const r = this.c.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.w = r.width; this.h = r.height;
      this.c.width = Math.round(r.width * dpr);
      this.c.height = Math.round(r.height * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.mode === "ambient" ? this.seedAmbient() : this.layoutTopology();
      this.draw();
    }

    setFilter(ns) { this.filter = ns; if (reduced) this.draw(); }

    start() {
      if (this.running || reduced) return;
      this.running = true;
      requestAnimationFrame(this.frame);
    }

    frame(ts) {
      if (!this.visible || document.hidden) { this.running = false; return; }
      this.t = ts;
      this.step();
      this.draw();
      requestAnimationFrame(this.frame);
    }

    /* ─────────── ambient ─────────── */
    seedAmbient() {
      const area = this.w * this.h;
      const count = Math.max(26, Math.min(80, Math.round(area / 17000)));
      const pods = U.projects;
      this.nodes = Array.from({ length: count }, (_, i) => {
        const p = pods[i % pods.length];
        const colored = i < pods.length;
        return {
          x: Math.random() * this.w, y: Math.random() * this.h,
          vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
          r: colored ? (p.featured ? 2.6 : 2) : 1.2,
          color: colored ? NAMESPACES[p.ns].color : "#5c6878",
          colored
        };
      });
    }

    /* ─────────── topology ─────────── */
    layoutTopology() {
      const { w, h } = this;
      const cx = w / 2, cy = h / 2;
      const m = Math.min(w, h);
      const narrow = w < 640;
      const R = m * (narrow ? 0.3 : 0.27);
      const rp = m * (narrow ? 0.13 : 0.15);
      const nsKeys = Object.keys(NAMESPACES);
      this.root = { kind: "root", x: cx, y: cy, bx: cx, by: cy, ph: 0 };
      this.hubs = nsKeys.map((ns, i) => {
        const a = (TAU / nsKeys.length) * i - Math.PI / 2;
        const x = cx + Math.cos(a) * R * (w > h ? 1.35 : 1), y = cy + Math.sin(a) * R;
        return { kind: "hub", ns, a, x, y, bx: x, by: y, ph: Math.random() * TAU, color: NAMESPACES[ns].color };
      });
      this.pods = [];
      this.hubs.forEach((hub) => {
        const list = U.projects.filter((p) => p.ns === hub.ns);
        const spread = Math.min(Math.PI * 1.25, 0.55 * list.length);
        list.forEach((p, j) => {
          const a = hub.a + (list.length === 1 ? 0 : -spread / 2 + (spread * j) / (list.length - 1));
          const x = hub.bx + Math.cos(a) * rp, y = hub.by + Math.sin(a) * rp;
          this.pods.push({ kind: "pod", p, hub, x, y, bx: x, by: y, ph: Math.random() * TAU, color: hub.color, r: p.featured ? 7 : 5 });
        });
      });
      this.edges = [
        ...this.hubs.map((hb) => ({ a: this.root, b: hb, color: hb.color })),
        ...this.pods.map((pd) => ({ a: pd.hub, b: pd, color: pd.color }))
      ];
    }

    step() {
      if (!this.w) this.resize();
      if (this.mode === "ambient" ? !this.nodes : !this.pods) return;
      if (this.mode === "ambient") {
        for (const n of this.nodes) {
          n.x += n.vx; n.y += n.vy;
          if (n.x < -20) n.x = this.w + 20; if (n.x > this.w + 20) n.x = -20;
          if (n.y < -20) n.y = this.h + 20; if (n.y > this.h + 20) n.y = -20;
          if (this.mouse.in) {
            const dx = this.mouse.x - n.x, dy = this.mouse.y - n.y, d = Math.hypot(dx, dy);
            if (d < 180 && d > 1) { n.x += (dx / d) * 0.12; n.y += (dy / d) * 0.12; }
          }
        }
        if (Math.random() < 0.02) {
          const n = this.nodes[(Math.random() * this.nodes.length) | 0];
          if (n.colored) this.rings.push({ n, t: 0 });
        }
        this.rings = this.rings.filter((r) => (r.t += 0.012) < 1);
        return;
      }

      const t = this.t * 0.0007;
      for (const n of [...this.hubs, ...this.pods]) {
        n.x = n.bx + Math.sin(t + n.ph) * 3;
        n.y = n.by + Math.cos(t * 1.3 + n.ph) * 3;
      }
      // hover
      let best = null, bd = 22;
      for (const n of [...this.pods, ...this.hubs]) {
        const d = Math.hypot(n.x - this.mouse.x, n.y - this.mouse.y);
        if (d < bd) { bd = d; best = n; }
      }
      this.hover = best;
      this.c.style.cursor = best && best.kind === "pod" ? "pointer" : "default";

      if (Math.random() < 0.09 && this.packets.length < 40) {
        const e = this.edges[(Math.random() * this.edges.length) | 0];
        this.packets.push({ e, t: 0, v: 0.008 + Math.random() * 0.01 });
      }
      this.packets = this.packets.filter((pk) => (pk.t += pk.v) < 1);
    }

    draw() {
      const { ctx, w, h } = this;
      if (!w || (this.mode === "ambient" ? !this.nodes : !this.pods)) return;
      ctx.clearRect(0, 0, w, h);
      this.mode === "ambient" ? this.drawAmbient(ctx) : this.drawTopology(ctx);
    }

    drawAmbient(ctx) {
      const N = this.nodes, max = 140;
      ctx.lineWidth = 1;
      for (let i = 0; i < N.length; i++) {
        for (let j = i + 1; j < N.length; j++) {
          const a = N[i], b = N[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < max) {
            ctx.strokeStyle = `rgba(148,163,184,${(1 - d / max) * 0.14})`;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        if (this.mouse.in) {
          const n = N[i], d = Math.hypot(n.x - this.mouse.x, n.y - this.mouse.y);
          if (d < 180) {
            ctx.strokeStyle = rgba(n.colored ? n.color : "#4ff0b4", (1 - d / 180) * 0.35);
            ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(this.mouse.x, this.mouse.y); ctx.stroke();
          }
        }
      }
      for (const r of this.rings) {
        ctx.strokeStyle = rgba(r.n.color, (1 - r.t) * 0.6);
        ctx.beginPath(); ctx.arc(r.n.x, r.n.y, 3 + r.t * 26, 0, TAU); ctx.stroke();
      }
      for (const n of N) {
        if (n.colored) {
          ctx.fillStyle = rgba(n.color, 0.14);
          ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 4, 0, TAU); ctx.fill();
        }
        ctx.fillStyle = n.colored ? n.color : "rgba(148,163,184,.5)";
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, TAU); ctx.fill();
      }
    }

    drawTopology(ctx) {
      const f = this.filter;
      const hov = this.hover;
      const on = (ns) => !f || f === ns;
      const lit = (n) => hov && (hov === n || hov === n.hub || (hov.kind === "hub" && n.hub === hov));

      // edges
      for (const e of this.edges) {
        const ns = e.b.ns || e.b.hub?.ns;
        const active = on(ns);
        const hl = hov && (e.b === hov || (hov.kind === "hub" && (e.a === hov || e.b === hov)) || (hov.kind === "pod" && e.b === hov.hub));
        ctx.strokeStyle = rgba(e.color, hl ? 0.7 : active ? 0.22 : 0.05);
        ctx.lineWidth = hl ? 1.6 : 1;
        ctx.setLineDash(e.a.kind === "root" ? [3, 5] : []);
        ctx.beginPath(); ctx.moveTo(e.a.x, e.a.y); ctx.lineTo(e.b.x, e.b.y); ctx.stroke();
      }
      ctx.setLineDash([]);

      // packets
      for (const pk of this.packets) {
        const { a, b, color } = pk.e;
        const ns = b.ns || b.hub?.ns;
        if (!on(ns)) continue;
        const x = a.x + (b.x - a.x) * pk.t, y = a.y + (b.y - a.y) * pk.t;
        ctx.fillStyle = rgba(color, 0.25);
        ctx.beginPath(); ctx.arc(x, y, 5, 0, TAU); ctx.fill();
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(x, y, 1.8, 0, TAU); ctx.fill();
      }

      // root
      const R = this.root;
      ctx.fillStyle = "rgba(79,240,180,.06)";
      hexPath(ctx, R.x, R.y, 34); ctx.fill();
      ctx.strokeStyle = "rgba(79,240,180,.7)"; ctx.lineWidth = 1.5;
      hexPath(ctx, R.x, R.y, 26); ctx.stroke();
      ctx.fillStyle = "#4ff0b4";
      ctx.font = "600 13px 'Geist Mono', monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("PC", R.x, R.y + 1);
      ctx.font = "11px 'Geist Mono', monospace";
      ctx.fillStyle = "#94a1b2";
      ctx.fillText("control-plane", R.x, R.y + 48);

      // hubs
      for (const hb of this.hubs) {
        const active = on(hb.ns);
        const a = active ? 1 : 0.25;
        ctx.fillStyle = rgba(hb.color, 0.08 * a);
        hexPath(ctx, hb.x, hb.y, 18); ctx.fill();
        ctx.strokeStyle = rgba(hb.color, (hov === hb ? 1 : 0.75) * a); ctx.lineWidth = 1.3;
        hexPath(ctx, hb.x, hb.y, 13); ctx.stroke();
        ctx.fillStyle = rgba(hb.color, a);
        ctx.font = "500 11px 'Geist Mono', monospace";
        const below = hb.y >= this.root.y - 4;
        ctx.fillText(`ns/${hb.ns}`, hb.x, hb.y + (below ? 32 : -32));
      }

      // pods
      for (const pd of this.pods) {
        const active = on(pd.hub.ns);
        const a = active ? 1 : 0.2;
        const isHover = hov === pd;
        const glow = isHover || lit(pd);
        ctx.fillStyle = rgba(pd.color, (glow ? 0.28 : 0.12) * a);
        ctx.beginPath(); ctx.arc(pd.x, pd.y, pd.r * (glow ? 3.4 : 2.6), 0, TAU); ctx.fill();
        if (pd.p.private) {
          ctx.strokeStyle = rgba(pd.color, a); ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.arc(pd.x, pd.y, pd.r, 0, TAU); ctx.stroke();
          ctx.fillStyle = rgba("#b99bff", a);
          ctx.beginPath(); ctx.arc(pd.x, pd.y, 1.8, 0, TAU); ctx.fill();
        } else {
          ctx.fillStyle = rgba(pd.color, a);
          ctx.beginPath(); ctx.arc(pd.x, pd.y, pd.r, 0, TAU); ctx.fill();
        }
        if ((glow || pd.p.featured) && active && !isHover) {
          ctx.font = "11px 'Geist Mono', monospace";
          ctx.fillStyle = glow ? "#e7edf3" : "rgba(148,163,184,.75)";
          ctx.fillText(pd.p.title, pd.x, pd.y - pd.r - 12);
        }
      }

      // tooltip
      if (hov && hov.kind === "pod") this.tooltip(ctx, hov);
    }

    tooltip(ctx, pd) {
      const p = pd.p;
      const title = p.title;
      const sub = `${p.ns} · ${p.private ? I18N.t("pods.private") : I18N.t("pods.public")} · ${U.langShare(p.langs)[0]?.name || "config"}`;
      ctx.font = "600 13px 'Geist', sans-serif";
      const w1 = ctx.measureText(title).width;
      ctx.font = "11px 'Geist Mono', monospace";
      const w2 = ctx.measureText(sub).width;
      const bw = Math.max(w1, w2) + 28, bh = 52;
      let x = pd.x + 16, y = pd.y - bh - 12;
      if (x + bw > this.w - 8) x = pd.x - bw - 16;
      if (y < 8) y = pd.y + 16;
      ctx.fillStyle = "rgba(10,14,19,.94)";
      ctx.strokeStyle = rgba(pd.color, 0.6); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.roundRect(x, y, bw, bh, 9); ctx.fill(); ctx.stroke();
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#e7edf3"; ctx.font = "600 13px 'Geist', sans-serif";
      ctx.fillText(title, x + 14, y + 21);
      ctx.fillStyle = pd.color; ctx.font = "11px 'Geist Mono', monospace";
      ctx.fillText(sub, x + 14, y + 39);
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
    }
  }

  window.Cluster = Cluster;
})();
