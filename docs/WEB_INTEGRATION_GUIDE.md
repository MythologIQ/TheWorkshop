# Web Integration Guide for MythologIQ Creation Lab

MythologIQ Creation Lab is designed to live alongside the main MythologIQ site without touching the internal app code. This guide covers how to host it either as a dedicated destination (subdomain or subpath) and how to link to it from existing navigation and CTA buttons. Reference `docs/DEPLOYMENT_GUIDE.md` for the build commands and the service-worker / offline build notes rather than duplicating them here.

## Pattern 1: Dedicated subdomain or subpath
1. Run the standard build (`npm run build`) or offline build (`npm run build:offline`) from the repo root as described in `docs/DEPLOYMENT_GUIDE.md`. The artifacts live in `app/dist` or `app/dist-offline`.
2. Point your hosting (e.g., `lab.mythologiq.studio` or `mythologiq.studio/creation-lab`) to the corresponding publish directory. Configure the server to serve `index.html` for every request so the BrowserRouter routes (Idea, Build, Test, Memory, Reflect, Share, Replay) resolve.
3. Ensure SPA routing is preserved by rewriting `/*` to `/index.html`. On Netlify, add a `_redirects` file (per `docs/HOSTING_OPTIONS.md`) to the publish root with:
   ```
   /* /index.html 200
   ```
   This keeps deep links like `/stations/replay` from 404-ing.
4. Use the offline build (`app/dist-offline`) when you want service-worker support, but remember the same SPA routing rules and redirects apply.
5. Netlify or similar static hosts should additionally set appropriate headers or rewrites for service-worker paths (`/service-worker.js`, `/manifest.json`) so PWA installs still function. Define the `publish` folder as `app/dist` (or `app/dist-offline`) and let the platform run `npm run build` before deploying.

## Pattern 2: Linking from the main MythologIQ site
1. Treat MythologIQ Creation Lab as a full-screen experience. Link buttons or CTAs to the dedicated URL (`/creation-lab` or the subdomain) rather than embedding it inline.
2. Use the same redirect rules above to keep BrowserRouter client-side navigation alive when visitors click a CTA from the marketing site.
3. Optionally preload hints by linking to a quick start doc (for example `/creation-lab#quick-start`) so returning visitors land in the right station.
4. If MythologIQ’s marketing site uses proxying (e.g., rewrites to `/creation-lab`), ensure the proxy still serves `index.html`, `assets/manifest.csv`, and the service-worker files from the built `app/dist` bundle.

## Netlify and static host notes
- Netlify build command: `npm run build`, publish directory: `app/dist`. For offline builds update the publish directory to `app/dist-offline`.
- Add a `_redirects` file in the publish folder with `/* /index.html 200` so SPA routes always fall back to the entry point (`docs/HOSTING_OPTIONS.md` provides context). For Netlify `netlify.toml`, the same rule can be expressed under `[redirects]`.
- Confirm service-worker files (`/service-worker.js`) and `manifest.json` stay alongside the `index.html` payload when pushing offline builds.
- MIME types, caching policies, and headers should align with the standard static-host settings already outlined in `docs/DEPLOYMENT_GUIDE.md`.

Refer back to `docs/HOSTING_OPTIONS.md` for additional platform-specific rewrite snippets if you need to branch beyond Netlify (GitHub Pages, static S3, etc.).
