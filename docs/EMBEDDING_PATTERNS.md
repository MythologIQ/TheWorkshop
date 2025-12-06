# Embedding Patterns for MythologIQ Creation Lab

MythologIQ Creation Lab is built as a focused, accessible SPA. Embedding it inside another page can work when the host retains control over focus and navigation, but keep in mind the creation experience expects full attention.

## When to embed
- Use an iframe when you want to preview a limited portion of the Studio (for example, a replay highlight or guided teaser) inside a storytelling page.
- Embeds are appropriate for controlled kiosks or curated demos where custom keyboard shortcuts are disabled, and there is clear affordance to enter the full Creation Lab if needed.
- Always provide a clearly labeled button (per the tone guidance in `docs/marketing/BRAND_VOICE_AND_TONE.md`) that opens the full app in a new tab or dedicated section so visitors can get the full station loop.

## When to avoid embeds
- Avoid iframe embeds when the experience must be fully immersive—MythologIQ Creation Lab relies on BrowserRouter routes and expects the host to respect the Safety Contract and navigation order.
- Do not embed the Studio where focus or keyboard navigation cannot be handed to the iframe, or where screen reader users cannot activate the embedded content and also reach the outer page.
- If you need Replay, Share, or Export features, redirect visitors to the standalone URL instead of trying to recreate those flows inside an iframe.

## Example embed snippet
```html
<iframe
  title="MythologIQ Creation Lab preview"
  src="https://lab.mythologiq.studio/embed/preview"
  width="100%"
  height="720"
  style="border: none;"
  loading="lazy"
  allow="fullscreen"
></iframe>
```

- Recommended size: at least 720px tall or use `min-height: 80vh` to accommodate the station navigation. Avoid scrollbars by matching the iframe height to the Creation Lab surface.
- Set `allow="fullscreen"` and `loading="lazy"` so the embedded frame feels responsive and performs well.
- Ensure the host page provides focusable controls before and after the iframe so keyboard users can move in and out of the embed reliably.

## Accessibility and tradeoffs
- Keyboard navigation should remain seamless. The host page must not trap focus outside the iframe; allow users to tab into the Creation Lab, and ensure the iframe title is descriptive so screen readers announce it.
- Inform visitors that embedded flows are a preview and that the full experience lives on `https://lab.mythologiq.studio` (or whichever dedicated URL you host) to keep the MythologIQ Creation Lab brand intact.
- Monitor the Safety Contract tone inside the embed—if you notice interactions that feel unsafe, close the embed and direct visitors to the full site where the Safety Contract enforcement is consistent.
