# Deployment Guide

This document captures the steps needed to run, build, and install The Workshop for standard and offline-friendly environments.

## Local development

1. Install dependencies from the repo root:
   ```bash
   npm install
   ```
2. Start the local dev server with hot reload and safety checks:
   ```bash
   cd app
   npm run dev
   ```
   (Running `npm run dev` from the repo root also works because the script proxies into `app`, but executing it from `app/` mirrors the hosted environment.)
3. The dev server serves `app/src`, and it intentionally does not register the service worker so you can iterate without cached assets interfering.

## Building for production

### Standard web build

- Run `npm run build` from the repo root (or `cd app && npm run build`) to emit the standard bundle under `app/dist`.
- The build is optimized for static hosts and still executes the same safety, telemetry, and AI contracts as the local environment.

### Offline/PWA-focused build

- Run `npm run build:offline` (equivalently `cd app && npm run build --mode offline`) to produce `app/dist-offline`.
- This profile includes `public/manifest.json` and `public/service-worker.js`, and it registers the service worker only when the offline bundle is served. The service worker precaches the core shell assets and the icons declared in `public/assets/manifest.csv`.
- Both builds ship the same SafetyContract rules and WebLLM helpers; the offline build simply adds caching and installability without changing content filters.

## Hosting on a local network or intranet

1. Build the desired bundle (`npm run build` or `npm run build:offline`).
2. Serve `app/dist` or `app/dist-offline` over any static file server (e.g., `serve`, `http-server`, `nginx`, `IIS`).
3. Ensure the server is reachable by the intended devices.
4. When using the offline build, serve over HTTPS or a secure context so browsers install the service worker declared in `public/service-worker.js`.

## Installing as a PWA

1. Open an offline-enabled deployment (or `dist-offline`) in a browser that supports PWAs (Chrome, Edge, Safari).
2. The `<link rel="manifest" href="/manifest.json" />` tag and theme-color meta signal that the site can be installed.
3. Accept the browser’s “Install” prompt or use the menu action to add The Workshop to the home screen or desktop.
4. On future launches, the service worker serves cached shell files so the UI loads without a network connection.

## Safety contract and offline behavior

- Offline builds continue to respect the Safety Contract. Token caps, scrubbers in `webllm_loader.ts`, and creativity clamps remain unchanged for both standard and offline bundles.
- The service worker only caches UI assets (HTML, JS, CSS, icons) and never the WebLLM model binaries or telemetry data.
- Projects, telemetry counts, and prompts stay in `localStorage`; exporting or importing `.workshop.json` files is still the only way to move data between devices.

## Verification checklist

- [ ] SPA navigation functions across Idea, Build, Test, Memory, Reflect, Share, and Replay without route errors on the deployed host.
- [ ] Offline build deploys register `public/service-worker.js` and serve cached shell assets (verify `navigator.serviceWorker.controller`).
- [ ] WebLLM tokens stream from the configured asset paths (`app/src/runtime/llm/model_config.ts`), even in the hosted environment.
- [ ] SafetyContract warnings, station routing, and telemetry behave identically to the local build.
- [ ] `/assets/manifest.csv` lists every binary asset referenced by the service worker or UI (per `scripts/check-assets.js`).
