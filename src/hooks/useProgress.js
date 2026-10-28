import { useCallback, useEffect, useMemo, useState } from 'react';
import { TOTAL_DAYS } from '../data/questions.js';

const KEY = 'clf-c02-journey-v1';
const DAY_MS = 86_400_000;

const pad = (n) => String(n).padStart(2, '0');
export const toYmd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// Cuenta días de calendario locales (inmune a cambios de horario de verano).
const utcDay = (y, m, d) => Date.UTC(y, m, d);
const parseYmd = (s) => {
  const [y, m, d] = s.split('-').map(Number);
  return { y, m: m - 1, d };
};

export function dayNumber(startYmd, now = new Date()) {
  const s = parseYmd(startYmd);
  const diff = utcDay(now.getFullYear(), now.getMonth(), now.getDate()) - utcDay(s.y, s.m, s.d);
  return Math.floor(diff / DAY_MS) + 1;
}

export function dateOfDay(startYmd, day) {
  const s = parseYmd(startYmd);
  return new Date(s.y, s.m, s.d + day - 1);
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data && typeof data.start === 'string' && data.answers) return data;
    }
  } catch {
    /* almacenamiento no disponible */
  }
  return { start: toYmd(new Date()), answers: {} };
}

function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignorar */
  }
}

// ?day=5 en la URL simula que hoy es el día 5 (útil para probar).
function devDay() {
  try {
    const v = Number(new URLSearchParams(window.location.search).get('day'));
    return Number.isInteger(v) && v >= 1 ? v : null;
  } catch {
    return null;
  }
}

export function useProgress() {
  const [state, setState] = useState(load);
  const [now, setNow] = useState(() => new Date());
  const override = useMemo(devDay, []);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => save(state), [state]);

  const todayDay = override ?? dayNumber(state.start, now);

  const answer = useCallback(
    (day, selected, correct) => {
      // Regla de oro: solo la pregunta de hoy, y una sola vez.
      if (day !== todayDay) return false;
      let accepted = false;
      setState((prev) => {
        if (prev.answers[day]) return prev;
        accepted = true;
        return {
          ...prev,
          answers: { ...prev.answers, [day]: { selected, correct, at: Date.now() } },
        };
      });
      return accepted || !state.answers[day];
    },
    [todayDay, state.answers]
  );

  const reset = useCallback(() => {
    setState({ start: toYmd(new Date()), answers: {} });
  }, []);

  const statusOf = useCallback(
    (day) => {
      const a = state.answers[day];
      if (a) return a.correct ? 'correct' : 'wrong';
      if (day === todayDay) return 'today';
      if (day < todayDay) return 'missed';
      return 'locked';
    },
    [state.answers, todayDay]
  );

  const stats = useMemo(() => {
    const answered = Object.values(state.answers);
    const correct = answered.filter((a) => a.correct).length;
    // Racha: días consecutivos respondidos, contando hacia atrás.
    let streak = 0;
    let d = Math.min(todayDay, TOTAL_DAYS);
    if (!state.answers[d]) d -= 1;
    while (d >= 1 && state.answers[d]) {
      streak += 1;
      d -= 1;
    }
    return { answered: answered.length, correct, streak };
  }, [state.answers, todayDay]);

  // Milisegundos hasta la medianoche local (cuando se abre la siguiente pregunta).
  const msToNext = useMemo(() => {
    const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    return Math.max(0, next - now);
  }, [now]);

  return {
    start: state.start,
    answers: state.answers,
    todayDay,
    statusOf,
    stats,
    msToNext,
    answer,
    reset,
    isDev: override !== null,
  };
}
