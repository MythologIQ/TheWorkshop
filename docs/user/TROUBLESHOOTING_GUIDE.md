# MythologIQ Creation Lab Troubleshooting Guide

## App not loading or staying stuck on the home screen
1. Refresh the browser/tab or restart the app to clear temporary glitches.
2. Confirm the device meets the minimum requirements listed in `docs/PROJECT_PLAN_FULL.md` and that no other heavy apps are draining resources.
3. Check that the MythologIQ Creation Lab is running offline or in the correct mode (see `docs/ARCHITECTURE_OVERVIEW.md` for how offline mode is enabled).
4. If the issue persists, clear the site data for the app and reload; projects stay safe as long as you exported any work you care about first.

## AI not responding or giving repeated suggestions
1. Make sure you are in a supported station (Idea, Build, Test, Memory, Reflect, Share, or Replay) and that the prompt card you see has an active “Try this” button.
2. Reload the station, then continue to the next step—AI prompts restart without losing your work.
3. If the AI still stalls, open Diagnostics/Adult Insights to confirm the app has enough resources and isn’t blocked by other tabs (`docs/user/EDUCATOR_GUIDE.md` explains what to look for).

## Projects seem to disappear or not load
1. Verify you selected the right profile; tap the profile icon and choose the correct name.
2. Visit `Project Selection` to see drafts and snapshots—maybe the project is still “draft” and was never opened.
3. If you exported a `.workshop.json` file earlier, re-import it from the same screen and the project will reappear (`docs/PROJECT_EXPORT_FORMAT.md` has import steps).

## Export or import problems
1. Ensure you are exporting from Share Station after saving your favorite moment; the file arrives as `<project-name>.workshop.json`.
2. For imports, drag the `.workshop.json` file into the app or use the import dialog; if it fails, make sure the file wasn’t renamed or corrupted (exports include schema info in the file).
3. If you see an error about versions, update to the latest MythologIQ Creation Lab build and try again (`docs/RELEASE_READINESS_PROMPT_042.md` describes the schema alignment).

## Offline surprises or missing telemetry
1. Open Diagnostics to see station counts and make sure you ran the `offline` build when needed (`docs/DEPLOYMENT_GUIDE.md` includes the offline checklist).
2. If telemetry looks wrong, tap the Diagnostics reset button to clear counts—nothing leaves the device unless you explicitly export data.
3. Use Adult Insights to spot patterns across stations if the group experience feels uneven (`docs/user/EDUCATOR_GUIDE.md`).
