export const REGIONS = [
  { id: 'head', label: 'Head / neck' },
  { id: 'shoulders', label: 'Shoulders' },
  { id: 'chest', label: 'Chest' },
  { id: 'arms', label: 'Arms' },
  { id: 'core', label: 'Core' },
  { id: 'back', label: 'Back' },
  { id: 'hips', label: 'Hips' },
  { id: 'legs', label: 'Legs' },
  { id: 'calves', label: 'Calves' },
];

export const SESSION_TYPES = [
  'Push',
  'Pull',
  'Legs',
  'Full body',
  'Run / cardio',
  'Sport / PE',
  'Mobility',
  'Rest active',
];

export const STORAGE_KEY = 'epicure-body-atlas-demo-v1';

export function todayISO() {
  return new Date().toLocaleDateString('en-CA');
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* */ }
  return seedState();
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* */ }
}

function seedState() {
  const t = todayISO();
  const d = new Date();
  const days = (n) => {
    const x = new Date(d);
    x.setDate(x.getDate() - n);
    return x.toLocaleDateString('en-CA');
  };
  return {
    sessions: [
      { id: 's1', date: days(1), type: 'Legs', durationMin: 40, effort: 3, regions: ['legs', 'calves', 'hips'], note: 'Squats + walks' },
      { id: 's2', date: days(3), type: 'Push', durationMin: 35, effort: 2, regions: ['chest', 'shoulders', 'arms'], note: '' },
      { id: 's3', date: days(5), type: 'Run / cardio', durationMin: 25, effort: 2, regions: ['legs', 'calves'], note: 'Easy jog' },
      { id: 's4', date: days(6), type: 'Pull', durationMin: 30, effort: 3, regions: ['back', 'arms', 'shoulders'], note: '' },
    ],
    daily: {
      [t]: { sleepHrs: 7.5, energy: 3, soreness: 2 },
      [days(1)]: { sleepHrs: 6, energy: 2, soreness: 3 },
    },
  };
}

/** Heat 0–1 per region from last 7 days of sessions. */
export function regionHeat(sessions, days = 7) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const heat = Object.fromEntries(REGIONS.map((r) => [r.id, 0]));
  for (const s of sessions) {
    const dt = new Date(s.date + 'T12:00:00');
    if (dt < cutoff) continue;
    const w = (s.effort || 2) * (s.durationMin || 20);
    for (const id of s.regions || []) {
      if (heat[id] != null) heat[id] += w;
    }
  }
  const max = Math.max(1, ...Object.values(heat));
  for (const id of Object.keys(heat)) heat[id] = heat[id] / max;
  return heat;
}

export function weekSessions(sessions) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);
  return sessions.filter((s) => new Date(s.date + 'T12:00:00') >= cutoff);
}
