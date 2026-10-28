import { useRef } from 'react';

// "Magnetic letters": las letras se desplazan y se apartan del cursor.
export default function MagneticText({ text, className = '', radius = 140, strength = 26 }) {
  const wrap = useRef(null);
  const raf = useRef(0);

  const move = (e) => {
    cancelAnimationFrame(raf.current);
    const { clientX, clientY } = e;
    raf.current = requestAnimationFrame(() => {
      wrap.current?.querySelectorAll('.mag__char').forEach((el) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = cx - clientX;
        const dy = cy - clientY;
        const dist = Math.hypot(dx, dy);
        if (dist < radius) {
          const f = (1 - dist / radius) ** 2 * strength;
          const nx = dist ? dx / dist : 0;
          const ny = dist ? dy / dist : 0;
          el.style.transform = `translate(${nx * f}px, ${ny * f}px)`;
        } else {
          el.style.transform = '';
        }
      });
    });
  };

  const leave = () => {
    cancelAnimationFrame(raf.current);
    wrap.current?.querySelectorAll('.mag__char').forEach((el) => (el.style.transform = ''));
  };

  return (
    <span
      ref={wrap}
      className={`mag ${className}`}
      onMouseMove={move}
      onMouseLeave={leave}
      aria-label={text}
    >
      {[...text].map((ch, i) => (
        <span
          key={i}
          className="mag__char"
          aria-hidden="true"
          style={{ '--i': i }}
        >
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </span>
  );
}
