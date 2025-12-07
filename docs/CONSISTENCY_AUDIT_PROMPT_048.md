# MythologIQ Creation Lab Consistency Audit (Prompt 048)

## Station copy and tone
- **Idea Station (IdeaDock, `app/src/pages/IdeaDock.tsx`):** The card is structured as a short hero (uppercase label, `stationNames.idea`) plus a single descriptive sentence from the translations ("Kick off a project by describing who it is for...") and a rounded button that starts the tutorial. Tone is encouraging, non-technical, and stays well within the 3–4 sentence bandwidth children expect.
- **Build Station (AssemblyBay, `app/src/pages/AssemblyBay.tsx`):** Mirrors the Idea card with the Build name, an abbreviated description ("Plan and ship one small step at a time..."), and no additional actions. The tone feels calm, but the copy is so minimal that it could be mistaken for a placeholder if the station ever needs more guidance.
- **Test Station (DiagnosticsCorridor, `app/src/pages/DiagnosticsCorridor.tsx`):** Uses the same template with the Test label and "Check clarity in the Diagnostics Corridor..." sentence. The tone stays gentle, but the phrase "Diagnostics Corridor" and the word "clarity" lean slightly older than the other cards—still readable, but the label itself may feel abstract for younger kids.
- **Memory Station (StellarArchive, `app/src/pages/StellarArchive.tsx`):** Continues the pattern with "Log wins and lessons..." which is clearly encouraging and easy to parse. The capitalized "Stellar Archive" heading matches the lore but may benefit from more descriptive context.
- **Reflect Station (OrbiterBridge, `app/src/pages/OrbiterBridge.tsx`):** The copy text invites students to "Notice patterns and gentle insights...", which is aligned with the calm, reflective tone established elsewhere.
- **Share Station (BroadcastDeck, `app/src/pages/BroadcastDeck.tsx`):** Adds the `CreationLabStamp` component, reinforcing the new brand. The sentence describing share is short and positive, though it reuses the same pattern as the other cards.
- **Replay Station (TimeTunnels, `app/src/pages/TimeTunnels.tsx`):** The page is currently a placeholder ("Placeholder for Replay Station UI") with a heading of "Time Tunnels" rather than a more explicit "Replay Station". If children navigate here, they encounter an unfinished tone and no actionable guidance, which clashes with the otherwise polished station cards.

## Reading level and accessibility
- All station cards rely on one-line descriptions and uppercase labels; the simplicity is good for a lower reading level, but the uniform structure means that children (or adults supporting them) must lean on the UI controls for context rather than the text itself. None of the cards provide additional explanations or longer paragraphs that could support novice readers.
- The nav bar is rendered with plain `Link` elements and no `aria-current` attribute, so keyboard users do not get an announcement that a station is active. There's also no screen-reader hint connecting the `Time Tunnels` label to the Replay experience, so the children must infer the mapping visually.
- The Replay page is a literal placeholder, so its reading level is undefined; the label "Time Tunnels" and the one-sentence note will not help a child understand the Replay mechanics if they click the link.

## Branding and naming consistency
- The document tree still refers to "The Workshop" almost everywhere (`docs/WORKSHOP_ATLAS.md`, `docs/PROJECT_PLAN_FULL.md`, `docs/SAFETY_CONTRACT.md`, `README.md`, `docs/DEPLOYMENT_GUIDE.md`, etc.), creating a split between the marketing docs (which now say MythologIQ Creation Lab) and the underlying guides.
- `app/index.html` has the title `<title>The Workshop</title>` and `public/manifest.json` still advertises `"name": "The Workshop"` / `"short_name": "Workshop"`, so browsers and installed PWAs will display the old identity instead of MythologIQ Creation Lab.
- The `docs/SAFETY_CONTRACT.md` copy talks repeatedly about "The Workshop" and so do the creativity/spec docs (`docs/CREATIVITY_BOUNDARY_SPEC.md`, `docs/STATION_INTEGRATION_SPEC.md`), meaning the written safety story is not yet consistent with the Creation Lab label.
- Within `app/src/runtime/ai/AIProvider.tsx` and later in `webllm_loader.ts`, the system prompt is hard-coded to `'Follow Workshop safety.'` and not updated to mention MythologIQ Creation Lab or the new Safety Contract wording.

## Navigation and flow
- `NavOverlay` lists the seven station routes, but it does not include any contextual helpers (no descriptive text, no aria labels). Users have to rely on the station names alone, and there is no fallback text if a link is clicked while the corresponding page is still under construction.
- The `App` routing block only maps `/dock/idea`, `/bay/build`, `/corridor/test`, `/vault/memory`, `/bridge/reflect`, `/deck/share`, and `/tunnels/replay`. Visiting any other path falls back to IdeaStation without explanation (`*` route), so a child typing a custom URL will suddenly find themselves at Idea without knowing why.
- The Replay route (`/tunnels/replay`) keeps the terminology "Time Tunnels" (see the nav label and page heading) rather than "Replay Station," which contrasts with the rest of the interface and with the marketing copy that spells out the station loop.
- Because there are no routes for diagnostics or settings yet, the nav stays compact, but it also means we cannot yet test how adults might guide children from the main navigation to support surfaces like Diagnostics or Preferences.

## AI interaction prompts and responses
- `AIProvider` streams tokens through `webllm_loader` with the fixed system prompt `'Follow Workshop safety.'`. The phrase references the old brand and does not mention MythologIQ Creation Lab, so the user-facing voice and the backend guardrails are mismatched from a branding perspective.
- The WebLLM stub in `webllm_loader.ts` scrubs a handful of violent keywords and tags uncertain statements, but it still allows fairly long, unstructured tokens; there are no station-specific prompt templates beyond the single system prompt, so the AI could respond in a style that feels too technical for kids.
- Because there is no `safeAIHarness` yet, stations call `useAI().stream(prompt)` directly, so there is no centralized place to enforce tone, limit sentence length, or keep adult/child instructions separated. `AIProvider` loads a generic loader and does not validate response shape before it hits the UI.

## Top 10 inconsistencies or risks
1. The browser title (`app/index.html`) still says “The Workshop,” so every tab or installed shortcut reverts to the old identity.
2. `public/manifest.json` advertises “The Workshop”/“Workshop,” which will surface in mobile device install banners and might confuse parents looking for MythologIQ Creation Lab.
3. Many core docs (`WORKSHOP_ATLAS`, `CREATIVITY_BOUNDARY_SPEC`, `SAFETY_CONTRACT`, `PROJECT_PLAN_FULL`, etc.) continue to call the product “The Workshop,” creating a split brand story.
4. The AI system prompt (`'Follow Workshop safety.'`) references the old brand, so both the model and the UI now speak with mixed identities.
5. The Replay page is still a placeholder entitled “Time Tunnels,” so the `/tunnels/replay` experience feels unfinished and uses inconsistent station naming.
6. The nav label “Time Tunnels” is not linked with “Replay Station” anywhere else, so children may not understand that “Replay” and “Time Tunnels” are the same focus.
7. Clicking a random URL yields Idea Station via the wildcard `*` route with no user feedback, which might confuse children who expect a distinct page (e.g., `/deck/share` after a reload).
8. There are no dedicated nav routes or supporting content for Diagnostics or Settings yet, so parents going to `/diagnostics` or `/settings` would hit Idea Station instead of a meaningful surface.
9. AI responses are not validated beyond a scrub, so a drifted model output could still slip through (no reading-level clamp, no tone enforcement, no fallback from a safe harness).
10. The station cards rely on single-sentence descriptions, so if the team ever expands a station’s content, the tone or reading level could easily drift out of alignment without an audit signal.

## Quick wins
- Update `app/index.html` and `public/manifest.json` so browsers install the MythologIQ Creation Lab name instead of “The Workshop.”
- Replace `'Follow Workshop safety.'` inside `AIProvider` and `webllm_loader` with a MythologIQ Creation Lab–centric hook (e.g., “Keep MythologIQ Creation Lab’s Safety Contract in mind.”) to align the AI voice with the marketing story.
- Flesh out `TimeTunnelsPage` with a real intro to Replay Station (even a short paragraph) and rename the heading to “Replay Station” so the navigation, copy, and brand all use the same terminology.
