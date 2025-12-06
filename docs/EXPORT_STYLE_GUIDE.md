# Export Style Guide

## Structured export
- All `.workshop.json` exports (via `runtime/export/export_project.ts`) now include:
  - `schemaVersion`: `1.0`
  - `creationLabSignature`: `Created in the MythologIQ Creation Lab`
  - `project`: the sanitized project payload
- The JSON payload remains free of timestamps beyond `exportedAt`, and no user identifiers are appended.

## Visual export stamp
- Any final artifact view (Share Station preview, Replay export confirmation, template list) presents the `CreationLabStamp` block with:
  - `creationLab.brandName` (`MythologIQ Creation Lab`)
  - `creationLab.stamp` (`Created in the MythologIQ Creation Lab`)
  - A light border, uppercase tracking, and small text so the stamp is noticeable but unobtrusive.
- The stamp is rendered via `CreationLabStamp` (app/src/components/CreationLabStamp.tsx) so the placement and styling stay uniform across surfaces.

## Translation guidance
- English text currently powers every locale (translations fall back to the English copy). Keep new locales aligned with `creationLab.brandName` and `creationLab.stamp` keys as defined in `app/src/i18n/translations.ts`.
