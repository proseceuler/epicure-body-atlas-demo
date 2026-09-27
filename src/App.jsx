import { useEffect, useMemo, useState } from 'react';
import BodyFigure from './BodyFigure.jsx';
import {
  REGIONS,
  SESSION_TYPES,
  loadState,
  saveState,
  todayISO,
  regionHeat,
  weekSessions,
} from './data.js';

const NAV = [
  { group: 'Core', items: ['Dashboard', 'Grades', 'Class Hub'] },
  { group: 'Work', items: ['To-Do', 'Kanban', 'Calendar', 'Notes'] },
  { group: 'Pulse', items: ['Focus', 'Habits', 'Body Atlas', 'Baon'] },
];

const TABS = [
  { id: 'home', label: 'Home' },
  { id: 'log', label: 'Log' },
  { id: 'atlas', label: 'Atlas' },
  { id: 'insights', label: 'Insights' },
];

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function App() {
  const [state, setState] = useState(() => loadState());
  const [tab, setTab] = useState('atlas');
  const [layer, setLayer] = useState('muscle');
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    type: 'Full body',
    durationMin: 30,
    effort: 2,
    regions: [],
    note: '',
    date: todayISO(),
  });

  useEffect(() => {
    saveState(state);
  }, [state]);

  const heat = useMemo(() => regionHeat(state.sessions), [state.sessions]);
  const week = useMemo(() => weekSessions(state.sessions), [state.sessions]);
  const today = todayISO();
  const daily = state.daily[today] || { sleepHrs: 7, energy: 3, soreness: 2 };

  const setDaily = (patch) => {
    setState((s) => ({
      ...s,
      daily: { ...s.daily, [today]: { ...daily, ...patch } },
    }));
  };

  const toggleRegion = (id) => {
    setForm((f) => ({
      ...f,
      regions: f.regions.includes(id) ? f.regions.filter((x) => x !== id) : [...f.regions, id],
    }));
  };

  const addSession = (e) => {
    e.preventDefault();
    if (!form.regions.length) {
      alert('Tap at least one body region (or pick from the chips).');
      return;
    }
    const session = {
      id: uid(),
      date: form.date || today,
      type: form.type,
      durationMin: Number(form.durationMin) || 20,
      effort: Number(form.effort) || 2,
      regions: [...form.regions],
      note: form.note.trim(),
    };
    setState((s) => ({ ...s, sessions: [session, ...s.sessions] }));
    setForm((f) => ({ ...f, note: '', regions: [] }));
    setTab('atlas');
  };

  const removeSession = (id) => {
    setState((s) => ({ ...s, sessions: s.sessions.filter((x) => x.id !== id) }));
  };

  const regionSessions = selected
    ? state.sessions.filter((s) => s.regions?.includes(selected)).slice(0, 8)
    : [];

  const totalMin = week.reduce((a, s) => a + (s.durationMin || 0), 0);
  const topRegions = [...REGIONS]
    .map((r) => ({ ...r, h: heat[r.id] || 0 }))
    .sort((a, b) => b.h - a.h)
    .slice(0, 5);

  return (
    <div className="shell">
      <aside className="sidebar glass-dark">
        <div className="brand">
          <span className="brand-f">f</span>
          <span className="brand-sub">epicure demo</span>
        </div>
        <nav>
          {NAV.map((g) => (
            <div key={g.group} className="nav-group">
              <p className="nav-label">{g.group}</p>
              {g.items.map((label) => {
                const active = label === 'Body Atlas';
                return (
                  <button
                    key={label}
                    type="button"
                    className={`nav-item ${active ? 'is-active' : ''}`}
                    onClick={() => active && setTab('atlas')}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
        <p className="sidebar-foot">Simulation only · not wired to epicure</p>
      </aside>

      <div className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">Pulse</p>
            <h1>Body Atlas</h1>
          </div>
          <p className="topbar-note">Track the frame — load, recovery, lifestyle</p>
        </header>

        <div className="subtabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`subtab ${tab === t.id ? 'is-active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="content">
          {tab === 'home' && (
            <div className="grid-2">
              <section className="card">
                <h2>Today</h2>
                <div className="dials">
                  <label>
                    Sleep (hrs)
                    <input
                      type="range"
                      min="4"
                      max="10"
                      step="0.5"
                      value={daily.sleepHrs}
                      onChange={(e) => setDaily({ sleepHrs: Number(e.target.value) })}
                    />
                    <span>{daily.sleepHrs}h</span>
                  </label>
                  <label>
                    Energy
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={daily.energy}
                      onChange={(e) => setDaily({ energy: Number(e.target.value) })}
                    />
                    <span>{daily.energy}/5</span>
                  </label>
                  <label>
                    Soreness
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={daily.soreness}
                      onChange={(e) => setDaily({ soreness: Number(e.target.value) })}
                    />
                    <span>{daily.soreness}/5</span>
                  </label>
                </div>
              </section>
              <section className="card">
                <h2>This week</h2>
                <p className="stat-lg">{week.length} sessions</p>
                <p className="muted">{totalMin} minutes logged · heat feeds the Atlas</p>
                <ul className="session-list compact">
                  {week.slice(0, 5).map((s) => (
                    <li key={s.id}>
                      <strong>{s.type}</strong>
                      <span>{s.date} · {s.durationMin}m</span>
                    </li>
                  ))}
                  {!week.length && <li className="muted">No sessions yet — use Log</li>}
                </ul>
              </section>
            </div>
          )}

          {tab === 'log' && (
            <div className="grid-2">
              <form className="card" onSubmit={addSession}>
                <h2>Log session</h2>
                <label className="field">
                  Date
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </label>
                <label className="field">
                  Type
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    {SESSION_TYPES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <div className="row-2">
                  <label className="field">
                    Minutes
                    <input
                      type="number"
                      min="5"
                      max="240"
                      value={form.durationMin}
                      onChange={(e) => setForm({ ...form, durationMin: e.target.value })}
                    />
                  </label>
                  <label className="field">
                    Effort (1–5)
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={form.effort}
                      onChange={(e) => setForm({ ...form, effort: e.target.value })}
                    />
                  </label>
                </div>
                <p className="field-label">Regions</p>
                <div className="chips">
                  {REGIONS.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      className={`chip ${form.regions.includes(r.id) ? 'is-on' : ''}`}
                      onClick={() => toggleRegion(r.id)}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
                <label className="field">
                  Note
                  <input
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    placeholder="Optional"
                  />
                </label>
                <button type="submit" className="btn-primary">
                  Save session
                </button>
              </form>
              <section className="card">
                <h2>Recent</h2>
                <ul className="session-list">
                  {state.sessions.slice(0, 12).map((s) => (
                    <li key={s.id}>
                      <div>
                        <strong>{s.type}</strong>
                        <span className="muted">
                          {' '}
                          {s.date} · {s.durationMin}m · effort {s.effort}
                        </span>
                        <div className="mini-chips">
                          {s.regions.map((id) => (
                            <span key={id}>{REGIONS.find((r) => r.id === id)?.label || id}</span>
                          ))}
                        </div>
                      </div>
                      <button type="button" className="btn-ghost" onClick={() => removeSession(s.id)}>
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          )}

          {tab === 'atlas' && (
            <div className="atlas-layout">
              <section className="card atlas-card">
                <div className="layer-bar">
                  {['skin', 'muscle', 'bone'].map((L) => (
                    <button
                      key={L}
                      type="button"
                      className={`layer-btn ${layer === L ? 'is-active' : ''}`}
                      onClick={() => setLayer(L)}
                    >
                      {L.charAt(0).toUpperCase() + L.slice(1)}
                    </button>
                  ))}
                </div>
                <BodyFigure
                  layer={layer}
                  heat={heat}
                  selected={selected}
                  onSelect={setSelected}
                />
                <p className="muted center">
                  Amber heat = recent load (7 days). Tap a region.
                </p>
              </section>
              <section className="card">
                <h2>{selected ? REGIONS.find((r) => r.id === selected)?.label : 'Region detail'}</h2>
                {!selected && (
                  <p className="muted">Select a body region on the figure to see history and heat.</p>
                )}
                {selected && (
                  <>
                    <p className="stat-lg">{Math.round((heat[selected] || 0) * 100)}% relative load</p>
                    <ul className="session-list">
                      {regionSessions.map((s) => (
                        <li key={s.id}>
                          <strong>{s.type}</strong>
                          <span className="muted">
                            {' '}
                            {s.date} · {s.durationMin}m
                          </span>
                        </li>
                      ))}
                      {!regionSessions.length && <li className="muted">No sessions tagged here yet.</li>}
                    </ul>
                    <button type="button" className="btn-primary" onClick={() => { setTab('log'); toggleRegion(selected); setForm((f) => ({ ...f, regions: f.regions.includes(selected) ? f.regions : [...f.regions, selected] })); }}>
                      Log work for this region
                    </button>
                  </>
                )}
              </section>
            </div>
          )}

          {tab === 'insights' && (
            <div className="grid-2">
              <section className="card">
                <h2>Week volume</h2>
                <p className="stat-lg">{totalMin} min</p>
                <p className="muted">{week.length} sessions in the last 7 days</p>
                <div className="bars">
                  {topRegions.map((r) => (
                    <div key={r.id} className="bar-row">
                      <span>{r.label}</span>
                      <div className="bar-track">
                        <div className="bar-fill" style={{ width: `${Math.round(r.h * 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              <section className="card">
                <h2>Signals</h2>
                <ul className="signals">
                  <li>
                    {daily.sleepHrs < 6.5
                      ? 'Sleep is light — consider easier load today.'
                      : 'Sleep looks reasonable for recovery.'}
                  </li>
                  <li>
                    {daily.soreness >= 4
                      ? 'High soreness — mobility or rest may fit better than hard volume.'
                      : 'Soreness is in a workable range.'}
                  </li>
                  <li>
                    {(heat.legs || 0) > 0.7 && (heat.chest || 0) < 0.2
                      ? 'Legs are hot relative to upper body — balance if that was not intentional.'
                      : 'Regional balance is within a normal demo spread.'}
                  </li>
                  <li className="muted">Demo heuristics only — not medical advice.</li>
                </ul>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
