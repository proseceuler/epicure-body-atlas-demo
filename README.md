# epicure · Body Atlas (demo)

Standalone **simulation** of a proposed **Body Atlas** module for [epicure](https://github.com/proseceuler/epicurus10) — same visual language as the student app (rice shell, glass sidebar, Pulse group), focused on whole-body tracking.

> Not wired into production epicure. Local-only demo data in `localStorage`.

## What you can try

- **Home** — today’s lifestyle dials (sleep, energy, soreness) + quick stats  
- **Log** — add a workout/session and tag body regions  
- **Atlas** — interactive body figure with **Skin / Muscle / Bone** layers, heat from recent load, region tap → detail  
- **Insights** — week balance, region volume, rest signals  

Fake left nav mirrors epicure (Dashboard, Grades, Habits, **Body Atlas**, …).

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Stack

Vite + React + plain CSS (no Three.js in this demo — SVG body for speed and clarity). A production epicure version could swap Atlas for R3F/GLB later on the same data model.

## Data model (demo)

```ts
session: { id, date, type, durationMin, effort, regions[], note }
daily:   { date, sleepHrs, energy, soreness }
```

Persisted under `epicure-body-atlas-demo-v1`.
