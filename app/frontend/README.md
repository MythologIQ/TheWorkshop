# Frontend (v0 plan)

Goal: local-first, desktop-style app built with familiar web tech.

## Stack
- React + Vite for fast dev and simple bundling.
- TypeScript for type safety.
- Lightweight state management (React Query or Zustand) to keep fetch/cache simple.

## Main screens (aligned to flows)
- Home: recent Projects, "New Project" button, entry to Stations.
- Design Dock (Idea Station): capture spark, audience/goal, generate mission brief, suggest project name, draft 3-5 starter steps.
- Assembly Bay (Build Station): ordered steps list, active step detail, quick progress updates.
- Diagnostics Corridor (Test Station): simple test checklist view, log of findings/fixes.
- Stellar Archive (Memory Station): recap timeline, reminders, reflections.
- Settings/Help: user display name, safety notice, onboarding recap.

## Local-first notes
- Store data locally first (e.g., file/IndexedDB) with a clean data API layer so a future hosted backend can be swapped in.
- v0 will not implement multiplayer; design UI assuming single user on one device.
