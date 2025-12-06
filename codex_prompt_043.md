Prompt 043 — MythologIQ Creation Lab Stamp Integration

Title: Add branded “Creation Lab” identity markers + final-stage output stamp
Purpose: Ensure every final creative artifact exported from the Workshop app carries a consistent, branded MythologIQ identity marker:
“Created in the MythologIQ Creation Lab”

This prompt updates:

Export templates

Storybook / template preview surfaces

Final screens inside the app

Metadata inside .workshop.json

The logo or mark panel where applicable

Prompt 043 (Full Instructions)

Goal:
Integrate the branded end-of-journey mark across the entire Creation Lab experience so that every exported work signals its origin clearly to users, educators, and adults.

Required changes:

1. Export Layer Enhancements

Update all export templates (PDF, text, image export, structured export) so that the footer or metadata block includes:

Created in the MythologIQ Creation Lab


Ensure consistent capitalization and spacing.

Where applicable (PDF, image), place it in a clear but unobtrusive footer.
Where applicable for .workshop.json, add:

"creationLabSignature": "Created in the MythologIQ Creation Lab"


Do not include timestamps or user identifiers.

2. UI Surfaces That Display the Final Creation

Add the Creation Lab stamp to:

Share Station final preview

Replay Station export confirmation

Any “Final Artifact” or “Your Creation Is Ready” page

Template preview modals

Placement must be visually consistent with your UI system.

3. Branding Integration

If the logo exists:

Keep the logo unchanged.

Add an optional “mark panel” or “identity block” that pairs the logo with:
MythologIQ Creation Lab

This should not override the main in-app branding (“Creation Lab” remains the product name inside the Workshop environment).

4. I18n Integration

Add translation keys:

creationLab: {
  stamp: "Created in the MythologIQ Creation Lab",
  brandName: "MythologIQ Creation Lab"
}


Add placeholders for other locales, but English is sufficient for now.

5. Asset Manifest

If the stamp appears as an SVG:

Add it to public/assets/

Update public/assets/manifest.csv

Validate with npm run check:assets

6. Documentation Updates

Create or update:

docs/BRANDING.md — explaining the Creation Lab identity

docs/EXPORT_STYLE_GUIDE.md — specifying where and how the stamp appears

Reference the new user-facing name: MythologIQ Creation Lab.

7. Tests

Add tests that confirm:

Exported .workshop.json includes creationLabSignature

Stamp appears in export preview components

i18n loads the new labels without regression

8. Validation

Confirm:

npm run check:assets

npm run lint

npm run build

npm test (ensure no regressions)

Expected Output Summary

Once Codex completes Prompt 043, you should see:

Creation Lab signature integrated across exports

UI stamp visible on final screens

I18n updated

New branding docs

Tests passing

Asset manifest updated if using SVG assets