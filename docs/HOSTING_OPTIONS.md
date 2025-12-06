# Hosting Options

The Workshop is a static web app that can run on any modern host that supports SPAs (Idea → Build → …). The offline profile (`npm run build:offline`) adds a service worker and manifest for installability while the standard build (`npm run build`) targets fast delivery.

## Static host comparison

- **Netlify** – Ideal for MythologIQ subdomains (e.g., `workshop.mythologiql.com`). Point Netlify to `app/dist` or `app/dist-offline`, set the build command to `npm run build` (or `npm run build:offline` for the offline shell), and the publish directory to `app/dist` (or `app/dist-offline`). Use `_redirects` (see below) to forward SPA routes to `index.html`.
- **Vercel** – Works similarly with `npm run build` and `app/dist`. Use the Vercel dashboard to set the output directory, and configure rewrites via `vercel.json` to map `/*` to `/index.html`. Vercel supports subdomains and can host Workshop alongside other MythologIQ microsites.
- **Cloudflare Pages** – Configure `npm run build` as the build command and `app/dist` as the output folder. Pages has built-in SPA fallback rules (set `index.html` as the fallback) and free HTTPS.
- **GitHub Pages** – Serve the contents of `app/dist` via the `gh-pages` branch or `docs` folder. Use a custom `_config.yml` or `404.html` that redirects to `index.html` for SPA routing. GitHub Pages works best for documentation mirrors or demo deployments.
- **Simple static server** – Tools like `serve`, `http-server`, or `nginx` can host the built output for intranet use. Point the server to `app/dist` or `app/dist-offline`, enable HTTPS for the offline build, and manually add a fallback to `index.html` for SPA routing.

## Netlify redirect sample

Add a `_redirects` file at the repository root (or inside `app/dist` after building) with:

```
/*    /index.html   200
```

This ensures every unknown path (including `/dock/idea`, `/bridge/reflect`, `/station/xyz`) returns `index.html` so React Router can render the correct station.

## SPA routing and offline considerations

- Station URLs (`/dock/idea`, `/bay/build`, `/corridor/test`, `/vault/memory`, `/bridge/reflect`, `/deck/share`, `/tunnels/replay`) are client-side routes. Redirect all unknown paths to `index.html` to avoid 404s when refreshing or directly visiting them.
- The offline build bundles `public/service-worker.js`; host it alongside the other assets so it can register at `/service-worker.js`. The service worker precaches the shell and reuses the icons from `public/assets/manifest.csv`.
- Deploying the offline bundle requires HTTPS so browsers can install the service worker. Netlify, Vercel, Cloudflare Pages, and GitHub Pages all provide HTTPS by default.
- When hosting as a MythologIQ subdomain (e.g., `workshop.mythologiql.com`), point DNS or the CNAME to the host (Netlify/Vercel/Pages) and configure SSL through the provider’s dashboard.

## Verification checklist

- [ ] Navigation works across stations on the live deployment (no React route errors, nav overlay loads).
- [ ] Offline build registration occurs (`navigator.serviceWorker.controller` is truthy) when using `dist-offline`.
- [ ] WebLLM models load from their configured asset paths (`app/src/runtime/llm/model_config.ts`)—update the host or asset URLs if you mirror binaries locally.
- [ ] App shell load works after refreshing a deep link because `_redirects` or rewrite rules return `index.html`.

Follow this guidance alongside `docs/DEPLOYMENT_GUIDE.md` so new hosts match the Workshop’s offline-first, safety-first expectations.
