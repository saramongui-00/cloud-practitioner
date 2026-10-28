import { useState } from 'react';
import { Check, Cross, Lock, Dash } from './Icons.jsx';
import { dateOfDay } from '../hooks/useProgress.js';
import { TOTAL_DAYS } from '../data/questions.js';

const LABEL = {
  correct: 'Acertada',
  wrong: 'Respondida',
  today: 'Hoy',
  missed: 'Perdida',
  locked: 'Bloqueada',
};

export default function Timeline({ start, todayDay, statusOf, selectedDay, onSelect }) {
  const [msg, setMsg] = useState('Toca un día para ver su pregunta.');
  const [nope, setNope] = useState(null);

  const click = (day, status) => {
    if (status === 'locked') {
      const d = dateOfDay(start, day).toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' });
      setMsg(`El día ${day} se abre el ${d}.`);
    } else if (status === 'missed') {
      setMsg(`Día ${day}: no lo respondiste a tiempo y ya no se puede contestar.`);
    } else {
      setMsg(status === 'today' ? 'Esta es la pregunta de hoy.' : `Repaso del día ${day}.`);
      onSelect(day);
      return;
    }
    setNope(day);
    setTimeout(() => setNope(null), 500);
  };

  return (
    <div className="timeline-wrap">
      <ol className="timeline">
        {Array.from({ length: TOTAL_DAYS }, (_, i) => {
          const day = i + 1;
          const status = statusOf(day);
          return (
            <li key={day} className="timeline__item">
              <button
                type="button"
                className={`tile tile--${status} ${selectedDay === day ? 'is-selected' : ''} ${nope === day ? 'is-nope' : ''}`}
                onClick={() => click(day, status)}
                aria-label={`Día ${day}: ${LABEL[status]}`}
              >
                {status === 'correct' && <Check />}
                {status === 'wrong' && <Cross />}
                {status === 'missed' && <Dash />}
                {status === 'locked' && <Lock />}
                {status === 'today' && <span className="tile__num">{day}</span>}
              </button>
              <span className="tile__label">{status === 'today' ? 'Hoy' : `Día ${day}`}</span>
            </li>
          );
        })}
      </ol>
      <p className="timeline__msg" role="status">{msg}</p>
    </div>
  );
}
