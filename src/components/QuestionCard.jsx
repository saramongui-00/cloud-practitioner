import { useEffect, useState } from 'react';
import { Check, Cross, Clock } from './Icons.jsx';

const fmt = (ms) => {
  const s = Math.floor(ms / 1000);
  const p = (n) => String(n).padStart(2, '0');
  return `${p(Math.floor(s / 3600))}:${p(Math.floor((s % 3600) / 60))}:${p(s % 60)}`;
};

const sameSet = (a, b) => a.length === b.length && a.every((x) => b.includes(x));

export default function QuestionCard({ q, record, canAnswer, onSubmit, msToNext, isToday }) {
  const [selected, setSelected] = useState([]);
  const [shake, setShake] = useState(false);
  const answered = Boolean(record);

  // Al cambiar de pregunta se reinicia la selección.
  useEffect(() => setSelected([]), [q.day]);

  const toggle = (id) => {
    if (answered || !canAnswer) return;
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (q.pick === 1) return [id];
      return prev.length >= q.pick ? [...prev.slice(1), id] : [...prev, id];
    });
  };

  const submit = () => {
    if (selected.length !== q.pick) return;
    const ok = sameSet(selected, q.correct);
    if (!ok) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
    onSubmit(q.day, selected, ok);
  };

  const spot = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`);
  };

  const chosen = record?.selected ?? selected;

  return (
    <article className={`qcard glass glass--modal ${shake ? 'is-shaking' : ''}`} aria-live="polite">
      <header className="qcard__head">
        <span className="badge">Día {q.day}</span>
        <span className="badge badge--soft">{q.domain}</span>
        <span className="qcard__pick">
          {q.pick === 1 ? 'Elige 1 respuesta' : `Elige ${q.pick} respuestas`}
        </span>
      </header>

      <h3 className="qcard__text">{q.text}</h3>

      <ul className="options">
        {q.options.map((o) => {
          const isPicked = chosen.includes(o.id);
          const isRight = q.correct.includes(o.id);
          let state = '';
          if (answered) state = isRight ? (isPicked ? 'ok' : 'miss') : isPicked ? 'bad' : 'idle';
          else if (isPicked) state = 'picked';
          return (
            <li key={o.id}>
              <button
                type="button"
                className={`option option--${state}`}
                onMouseMove={spot}
                onClick={() => toggle(o.id)}
                disabled={answered || !canAnswer}
                aria-pressed={isPicked}
              >
                <span className="option__mark" aria-hidden="true">
                  {answered && isRight && <Check />}
                  {answered && !isRight && isPicked && <Cross />}
                  {!answered && (isPicked ? <Check /> : o.id.toUpperCase())}
                  {answered && !isRight && !isPicked && o.id.toUpperCase()}
                </span>
                <span className="option__body">
                  <span className="option__text">{o.text}</span>
                  {answered && (
                    <span className="option__why">
                      <strong>
                        {state === 'ok' && 'Tu respuesta · Correcta. '}
                        {state === 'miss' && 'Era correcta y no la elegiste. '}
                        {state === 'bad' && 'Tu respuesta · Incorrecta. '}
                      </strong>
                      {o.why.replace(/^(Correcta|Incorrecta)\.\s*/, '')}
                    </span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {!answered && canAnswer && (
        <footer className="qcard__foot">
          <p className="helper">Solo puedes responder una vez. Piénsalo bien.</p>
          <button
            type="button"
            className="btn-violet"
            disabled={selected.length !== q.pick}
            onClick={submit}
          >
            Enviar respuesta
          </button>
        </footer>
      )}

      {answered && (
        <footer className="qcard__result">
          <div className={`verdict ${record.correct ? 'verdict--ok' : 'verdict--bad'}`}>
            {record.correct ? <Check /> : <Cross />}
            <span>{record.correct ? '¡Respuesta correcta!' : 'Esta vez no, repasa las explicaciones.'}</span>
          </div>
          {isToday && (
            <div className="countdown">
              <Clock />
              <span>
                Próxima pregunta en <b className="mono">{fmt(msToNext)}</b>
              </span>
            </div>
          )}
        </footer>
      )}
    </article>
  );
}
