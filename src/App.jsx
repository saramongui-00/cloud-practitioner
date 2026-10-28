import { useRef, useState } from 'react';
import { QUESTIONS, TOTAL_DAYS } from './data/questions.js';
import { useProgress } from './hooks/useProgress.js';
import Hero from './components/Hero.jsx';
import Eyebrow from './components/Eyebrow.jsx';
import Reveal from './components/Reveal.jsx';
import Timeline from './components/Timeline.jsx';
import QuestionCard from './components/QuestionCard.jsx';
import Confetti from './components/Confetti.jsx';
import { Cloud, Flame, Target, Check } from './components/Icons.jsx';

function Stat({ icon, value, label }) {
  return (
    <div className="stat glass">
      <span className="icon-tile">{icon}</span>
      <span className="stat__v">{value}</span>
      <span className="stat__l">{label}</span>
    </div>
  );
}

export default function App() {
  const p = useProgress();
  const [picked, setPicked] = useState(null);
  const [boom, setBoom] = useState(0);
  const sectionRef = useRef(null);

  const inRange = p.todayDay >= 1 && p.todayDay <= TOTAL_DAYS;
  const finished = p.todayDay > TOTAL_DAYS;
  const shownDay = picked ?? (inRange ? p.todayDay : null);
  const q = shownDay ? QUESTIONS[shownDay - 1] : null;

  const submit = (day, selected, correct) => {
    p.answer(day, selected, correct);
    if (correct) setBoom((n) => n + 1);
  };

  const goToday = () => {
    setPicked(null);
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <div className="bg" aria-hidden="true">
        <div className="bg__grid" />
        <div className="bg__glow" />
      </div>
      <div className="bg__spot" aria-hidden="true" />
      <Confetti fire={boom} />

      <header className="nav">
        <a className="nav__logo" href="#top">
          <Cloud /> <span>Cloud Practitioner</span>
        </a>
        <span className="pill">
          Día <b className="mono">{Math.min(p.todayDay, TOTAL_DAYS)}</b> / {TOTAL_DAYS}
        </span>
      </header>

      <main id="top" className="page">
        <Hero stats={p.stats} todayDay={p.todayDay} onCta={goToday} />

        <section className="section" ref={sectionRef}>
          <Reveal>
            <Eyebrow>Pregunta del día</Eyebrow>
            <h2 className="h2">
              {picked
                ? `Repaso del día ${picked}`
                : finished
                ? 'Completaste los 20 días'
                : p.todayDay < 1
                ? 'Aún no empieza'
                : p.statusOf(p.todayDay) === 'today'
                ? 'Tu pregunta de hoy'
                : 'Ya respondiste hoy'}
            </h2>
            <p className="lede">
              {finished
                ? `Resultado final: ${p.stats.correct} de ${TOTAL_DAYS} acertadas. Repasa cualquier día respondido en la ruta de abajo.`
                : 'Una pregunta nueva se abre cada día a la medianoche. Cuando respondes, se revela por qué cada opción es correcta o incorrecta.'}
            </p>
          </Reveal>

          {q && (
            <Reveal delay={80}>
              <QuestionCard
                key={q.day}
                q={q}
                record={p.answers[q.day]}
                canAnswer={q.day === p.todayDay && !p.answers[q.day]}
                isToday={q.day === p.todayDay}
                msToNext={p.msToNext}
                onSubmit={submit}
              />
            </Reveal>
          )}

          {finished && (
            <Reveal delay={80}>
              <div className="final glass glass--modal">
                <span className="icon-tile"><Check /></span>
                <p className="final__score">{p.stats.correct}<small> / {TOTAL_DAYS}</small></p>
                <p className="helper">
                  {p.stats.correct >= 16
                    ? 'Excelente nivel. Estás en gran forma para presentar el examen.'
                    : p.stats.correct >= 12
                    ? 'Buen avance. Repasa las preguntas falladas y refuerza esos dominios.'
                    : 'Tienes base, pero conviene repasar a fondo. Revisa las explicaciones de cada día.'}
                </p>
              </div>
            </Reveal>
          )}
        </section>

        <section className="section">
          <Reveal>
            <Eyebrow>Tu ruta</Eyebrow>
            <h2 className="h2">20 días, un paso a la vez</h2>
            <p className="lede">Las preguntas futuras están bloqueadas y las que no respondas a tiempo se pierden.</p>
          </Reveal>

          <Reveal delay={80}>
            <div className="stats">
              <Stat icon={<Check />} value={`${p.stats.answered}/${TOTAL_DAYS}`} label="Respondidas" />
              <Stat icon={<Target />} value={p.stats.correct} label="Acertadas" />
              <Stat icon={<Flame />} value={p.stats.streak} label="Racha" />
            </div>
            <Timeline
              start={p.start}
              todayDay={p.todayDay}
              statusOf={p.statusOf}
              selectedDay={shownDay}
              onSelect={(d) => {
                setPicked(d === p.todayDay ? null : d);
                sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            />
          </Reveal>
        </section>
      </main>

      <footer className="foot">
        <p>Tu progreso se guarda en este navegador. Preguntas originales de práctica, no son preguntas oficiales de AWS.</p>
        <button
          type="button"
          className="btn-outline"
          onClick={() => {
            if (window.confirm('Se borrará tu progreso y el reto empezará de nuevo hoy. ¿Continuar?')) {
              setPicked(null);
              p.reset();
            }
          }}
        >
          Reiniciar reto
        </button>
        {p.isDev && <p className="helper">Modo prueba: simulando el día {p.todayDay} (?day=)</p>}
      </footer>
    </>
  );
}
