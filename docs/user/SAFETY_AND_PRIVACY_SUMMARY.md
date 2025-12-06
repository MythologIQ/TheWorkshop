# Safety and Privacy Summary

The Workshop is designed so kids can create safely, and adults can understand exactly what happens with their data.

## What stays on the device

- Projects, templates, and creativity notes are stored locally in the browser or app storage.
- Telemetry tracks counts such as total projects created or station visits, but **all** metrics stay on the device and never leave unless you export them yourself.
- When you export a project, the `.workshop.json` file includes the creative content and station snapshots but no secret device identifiers.

## Safety foundations

- The same SafetyContract that guides the stations also runs in every build. The AI helper never bypasses those rules, and adults can review the contract in `docs/SAFETY_CONTRACT.md`.
- The app ships with a local-only Service Worker when the offline build is used. It only caches the app shell (UI files and icons) and does not try to download or cache WebLLM model binaries. That keeps performance stable without introducing new safety gaps.

## Telemetry and diagnostics

- Diagnostics show the telemetry counts so you can check how many projects or station visits have happened. You can reset those counts at any time or turn telemetry off from the same page.
- The only data recorded in telemetry is the counts themselves—no text, no recordings, and nothing sent to the internet.
- For a deeper dive into how privacy works, read `docs/PRIVACY_NOTES.md`.

## Supporting responsible use

When sharing projects, remind kids they are exporting personal creative stories. Encourage them to work with a trusted adult before sharing widely, and always keep backups on devices you control.
