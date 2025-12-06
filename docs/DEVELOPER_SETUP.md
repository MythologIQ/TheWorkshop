# Developer Setup

These steps describe the minimal tooling needed to work on The Workshop and the commands you will use.

## Tooling

- **Node.js** – Use Node.js 20.x or later (and the matching npm). The repo depends on native `fs/promises`, modern ESM, and Vite 5, which require a recent runtime.
- **Package manager** – `npm` ships with Node; no other package manager is required.

## Initial setup

1. Clone the repository and switch to the desired branch (e.g., `prompt-031`).
2. From the repo root, install dependencies:
   ```bash
   npm install
   ```
3. The main application lives inside `app/`. The root `package.json` delegates scripts into `app` so you can run everything from the workspace root.

## Main scripts

- `npm run dev` – Launches `cd app && vite` for hot-reloading local development.
- `npm run build` – Produces `app/dist` with the standard production bundle.
- `npm run build:offline` – Runs `vite build --mode offline`, writing to `app/dist-offline`, registering the service worker, and ensuring the PWA manifest is part of the output.
- `npm run lint` – Runs `cd app && eslint .` to enforce code style before merging.
- `npm run test` / `npm run test:watch` – Execute the Vitest suite (`cd app && vitest run` / `vitest`) for unit/component tests.
- `npm run check:assets` – Validates `public/assets/manifest.csv` against the files in `public/assets/`.

## Useful references

- `docs/CONTRIBUTING.md` for contribution guidelines and pull request expectations.
- `docs/ARCHITECTURE_OVERVIEW.md` and `docs/STATION_LIFECYCLE.md` for understanding how the app is composed.
- `docs/DEPLOYMENT_GUIDE.md` for offline build expectations and manifest requirements.

Follow the scripts above before committing so CI (`.github/workflows/ci.yml`) continues to run cleanly. When in doubt, rerun `npm run lint` and `npm run test` to catch regressions.
