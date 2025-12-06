# The Workshop Accessibility Checklist

## Scope
- Primary stations (Design Dock, Assembly Bay, Diagnostics Corridor, Stellar Archive, Orbiter Bridge, Broadcast Deck, Replay Station).
- Support surfaces (Navigation bar, Settings page, Snapshot actions).
- Keyboard-only navigation, focus visibility, and screen reader announcements.

## Steps
1. Tab through each navigation link in `NavOverlay` and confirm focus outlines are visible, `aria-current` is exposed, and extra labels (when enabled) describe the destination.
2. Visit every station page and the settings page with only Tab/Shift+Tab:
   - Ensure all buttons, links, and inputs are in the tab order and provide a pronounced focus ring.
   - Use headings/sections (`<main>`, `<section>`, `<header>`, etc.) to describe content areas for assistive tech.
3. Review the Replay Station snapshot list:
   - Verify action buttons (save, restore, branch) have clear labels, focusable states, and confirmation prompts before destructive actions.
   - Confirm the status text lives in an `aria-live` region and extra helper labels/rules appear when the accessibility toggle is engaged.
4. Check color contrast for text on dark backgrounds (Replay Station) and ensure alternative text or hints exist for descriptive copy.
5. Validate reader hints in the Settings panel (language selector, extra labels, larger font toggle) have `legend`, `label`, and helper text with `aria-describedby`.
6. Run a measurement of the `prefers-reduced-motion` or `color-scheme` if available and note any outstanding issues for future passes.

## Reporting
- Record each finding with a location (page/section) and the assistive technology effect (keyboard, screen reader, etc.).
- Prioritize missing focus states, unlabeled controls, or high contrast failures before feature work continues.
