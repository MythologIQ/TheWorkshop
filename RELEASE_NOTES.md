# The Workshop v1.0.0 Release Notes

## Highlights
- **Profiles & telemetry:** Multiple profiles stay in sync with `profileStore` and `telemetryStore`, giving per-profile metrics, Diagnostics controls, and telemetry views that stay local.
- **AI persona foundation:** Persona prompts, adaptive coaching, safety reminders, and performance controls keep each station’s assistant aligned with the Safety Contract and Creativity Boundary.
- **Adult Insights & export:** The new `/insights` page summarizes station balance, completed projects, tutorials, and exports a privacy-safe JSON file without exposing story text.
- **Offline & hosting polish:** Service worker, manifest, and Vite `build:offline` mode support kiosk/offline usage while standard Netlify builds rely on `cd app && vite build` plus `/* /index.html 200`.
- **Docs sync:** Architecture, deployment, hosting, persona, and user guides reflect the current state, supporting the release readiness story.

## Testing
- `npm run build`
- `npm run check:assets`
