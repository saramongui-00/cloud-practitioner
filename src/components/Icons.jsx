const base = {
  width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none',
  stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round',
  'aria-hidden': true,
};
export const Cloud = (p) => (<svg {...base} {...p}><path d="M7 18a4 4 0 0 1-.6-7.96A5.5 5.5 0 0 1 17 9.5a4.25 4.25 0 0 1 0 8.5z" /></svg>);
export const Check = (p) => (<svg {...base} {...p}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>);
export const Cross = (p) => (<svg {...base} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>);
export const Lock = (p) => (<svg {...base} {...p}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>);
export const Flame = (p) => (<svg {...base} {...p}><path d="M12 3c1 3 4 4.5 4 9a4 4 0 0 1-8 0c0-1.5.6-2.6 1.5-3.5.2 1 .7 1.7 1.5 2C11 8 11 5.5 12 3z" /></svg>);
export const Target = (p) => (<svg {...base} {...p}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="0.5" /></svg>);
export const Clock = (p) => (<svg {...base} {...p}><circle cx="12" cy="12" r="8" /><path d="M12 7.5V12l3 2" /></svg>);
export const Dash = (p) => (<svg {...base} {...p}><path d="M7 12h10" /></svg>);
export const Arrow = (p) => (<svg {...base} {...p}><path d="M12 5v14M6 13l6 6 6-6" /></svg>);
