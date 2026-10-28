import { useRef } from 'react';
import MagneticText from './MagneticText.jsx';
import Eyebrow from './Eyebrow.jsx';
import { Flame, Target, Arrow } from './Icons.jsx';
import { TOTAL_DAYS } from '../data/questions.js';

function Ring({ value, total }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <svg className="ring" viewBox="0 0 88 88" aria-hidden="true">
      <circle cx="44" cy="44" r={r} className="ring__bg" />
      <circle
        cx="44" cy="44" r={r} className="ring__fg"
        strokeDasharray={c}
        strokeDashoffset={c - (c * value) / total}
        transform="rotate(-90 44 44)"
      />
      <text x="44" y="49" textAnchor="middle" className="ring__t">{value}/{total}</text>
    </svg>
  );
}

export default function Hero({ stats, todayDay, onCta }) {
  const ref = useRef(null);

  // Parallax: las tarjetas flotantes siguen al cursor.
  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    ref.current.style.setProperty('--mx', x.toFixed(3));
    ref.current.style.setProperty('--my', y.toFixed(3));
  };
  const leave = () => {
    ref.current.style.setProperty('--mx', 0);
    ref.current.style.setProperty('--my', 0);
  };

  const day = Math.min(todayDay, TOTAL_DAYS);

  return (
    <section className="hero" ref={ref} onMouseMove={move} onMouseLeave={leave}>
      <div className="rise" style={{ '--d': '0ms' }}>
        <Eyebrow>AWS Certified Cloud Practitioner · CLF-C02</Eyebrow>
      </div>

      <h1 className="hero__title">
        <span className="rise" style={{ '--d': '120ms' }}>
          <MagneticText text="Cloud" className="hero__word" />
        </span>
        <span className="rise" style={{ '--d': '240ms' }}>
          <MagneticText text="Practitioner" className="hero__word" />
        </span>
      </h1>

      <p className="hero__sub rise" style={{ '--d': '380ms' }}>
        20 días. 20 preguntas. Una por día, sin atajos. Responde, descubre por qué cada opción es
        correcta o no, y llega listo a tu examen.
      </p>

      <div className="hero__cta rise" style={{ '--d': '480ms' }}>
        <button type="button" className="btn-ghost" onClick={onCta}>
          Ir a la pregunta de hoy <Arrow />
        </button>
      </div>

      <div className="fan" aria-hidden="true">
        <div className="fan__card fan__card--l glass glass--modal tilt">
          <span className="fan__icon"><Flame /></span>
          <span className="fan__big">{stats.streak}</span>
          <span className="fan__cap">{stats.streak === 1 ? 'día de racha' : 'días de racha'}</span>
        </div>

        <div className="fan__card fan__card--c glass glass--modal tilt">
  <span className="badge">Día {day} de {TOTAL_DAYS}</span>
  <p className="fan__title">Una pregunta nueva cada día</p>
  <p className="fan__cap">Se abre a la medianoche y solo puedes responderla una vez.</p>
</div>

        <div className="fan__card fan__card--r glass glass--modal tilt">
          <Ring value={stats.answered} total={TOTAL_DAYS} />
          <span className="fan__cap">
            <Target /> {stats.correct} acertadas
          </span>
        </div>
      </div>
    </section>
  );
}
