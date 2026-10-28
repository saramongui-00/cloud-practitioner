import { useEffect, useRef } from 'react';

const COLORS = ['#d8ecf8', '#98c0ef', '#b6d9fc', '#ffffff', '#663af3', '#c7d3ea'];

// Confeti en canvas: se lanza cada vez que cambia `fire`.
export default function Confetti({ fire }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!fire) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = (canvas.width = window.innerWidth * dpr);
    const h = (canvas.height = window.innerHeight * dpr);
    const parts = Array.from({ length: 140 }, () => {
      const a = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
      const v = (9 + Math.random() * 12) * dpr;
      return {
        x: w / 2, y: h * 0.62,
        vx: Math.cos(a) * v, vy: Math.sin(a) * v,
        s: (4 + Math.random() * 6) * dpr,
        r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.4,
        c: COLORS[(Math.random() * COLORS.length) | 0],
        life: 1,
      };
    });
    let id;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      let alive = false;
      for (const p of parts) {
        p.vy += 0.32 * dpr;
        p.vx *= 0.99;
        p.x += p.vx; p.y += p.vy; p.r += p.vr;
        p.life -= 0.0085;
        if (p.life > 0 && p.y < h + 40) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = Math.max(p.life, 0);
          ctx.translate(p.x, p.y);
          ctx.rotate(p.r);
          ctx.fillStyle = p.c;
          ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
          ctx.restore();
        }
      }
      if (alive) id = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, w, h);
    };
    tick();
    return () => cancelAnimationFrame(id);
  }, [fire]);

  return <canvas ref={ref} className="confetti" aria-hidden="true" />;
}
