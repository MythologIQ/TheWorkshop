Prompt 042 – Release readiness and hosting validation

Title: Prompt 042 – Release readiness and hosting validation
Phase: Field hardening and deployment
Goal:
Confirm that the consolidated Workshop is ready to be deployed in the wild by:

creating a concrete release readiness checklist,

validating the deployment story (including a Netlify style static host),

and surfacing any remaining UX and behavior risks in a single doc.

You will work iteratively and log your own thinking.

Create a new doc for this prompt:

docs/RELEASE_READINESS_PROMPT_042.md

Use it the same way as the prior audit doc: structured, short sections, not essays.

Step 0 – Ground rules

Before changing anything, add an intro section to docs/RELEASE_READINESS_PROMPT_042.md that states:

Scope: release readiness for the current consolidated Workshop after Prompt 041.

Rule set:

Do not add new product features in this prompt.

Prefer documentation, configuration, and small fixes only.

Keep the working tree clean at the end.

All four checks must pass at the end.

Add a checklist at the top:

 Release checklist created

 Hosting path validated

 UX flows reviewed

 All checks passing

 Ready for tag and deployment

You will update this at the end.

Step 1 – Summarize current capabilities in one place

Inspect the code and docs to list the major capabilities that matter for release:

Stations and core project loop

Profiles and profile aware stores

Telemetry and Diagnostics

Import and export

Adult Insights

AI personas and mentoring

Offline and PWA behavior

Accessibility and settings

In RELEASE_READINESS_PROMPT_042.md, add:

## Capability snapshot

Under it, write a short bullet list for each capability, with:

“Implemented” or “Not implemented yet”

Reference to key files or docs

Do not change code yet.

Self evaluation:
Under ### Step 1 – Self evaluation, note any capability that felt ambiguous or partially implemented.

Step 2 – Construct a formal release readiness checklist

Build a checklist that another human could literally follow.

In the release doc, add:

## Release readiness checklist

Group items into sections:

Build and tests

Core UX flows

Safety, privacy, and telemetry

Profiles and Adult Insights

Import and export

Offline or PWA behavior

Hosting and routing

For each item, phrase it as a verifiable statement like:

“Visitor can create a new profile and start a project from a template”

“Adult Insights shows station balance without revealing project text”

“Offline build registers a service worker and allows revisiting the app after reload”

Where possible, link to the doc or file that describes the behavior.

Self evaluation:
Under ### Step 2 – Self evaluation, list any checklist item that is clearly “aspirational” rather than known to be working yet.

Step 3 – Validate the build and test layer again

This is a quick sanity pass.

Run:

npm run check:assets

npm run lint

npm run build

npm test

In the release doc, add:

## Build and test verification

For each command, record pass or fail, and if fail, what you changed and the re run result.

No code fixes beyond what is required to make commands pass are allowed here.

Self evaluation:
Under ### Step 3 – Self evaluation, state whether any fixes were necessary and whether they touched previously stable areas.

Step 4 – Hosting and Netlify validation

You are not executing a real deploy here, but you will make sure the config and docs are coherent and ready.

Inspect:

Vite config

build scripts in package.json

any SPA routing or _redirects examples

docs/DEPLOYMENT_GUIDE.md

docs/HOSTING_OPTIONS.md

In the release doc, add:

## Hosting validation

Cover:

Recommended build command and publish directory for Netlify.

Sample SPA redirect config (for example /* /index.html 200).

How offline build fits in, and whether it is recommended for public hosting or more for kiosk use.

If you find conflicting information between docs and actual build scripts, fix the docs first. Only change scripts if they are clearly wrong.

Optionally, if not already present, you may add a small public/_redirects or netlify.toml example that matches the documented pattern, as long as it does not break non Netlify hosts.

Self evaluation:
Under ### Step 4 – Self evaluation, explicitly call out whether you believe a Netlify deploy can be set up by following these docs alone.

Step 5 – UX pathway review: profiles, diagnostics, adult insights

Do a structured mental walk through of the core flows using the existing code and docs.

Identify these flows:

First run with no profiles

First run with profiles present

A child creating a project and visiting several stations

A child using Replay

An adult opening Diagnostics

An adult opening Adult Insights

In the release doc, add:

## UX flows and coverage

For each flow, describe:

Entry point (route or component)

Key stores or data touched

Any potential failure points or confusing states you can see by inspecting the code

Any missing confirmation messages or safety copy you notice

You are not making major UX changes in this prompt. You are documenting what exists and where it might need refinement later.

Self evaluation:
Under ### Step 5 – Self evaluation, list top two UX risks or rough edges you think should be addressed in a later prompt.

Step 6 – Safety, privacy, and telemetry cross check

Review:

docs/SAFETY_AND_PRIVACY_SUMMARY.md

docs/PRIVACY_NOTES.md

docs/AI_BEHAVIOR_AND_SAFETY.md

telemetry store and its use

In the release doc, add:

## Safety and privacy confirmation

Summarize in bullet points:

What is stored locally

What, if anything, is exported in .workshop.json

Telemetry scope and where it lives

Any remote calls made by the app, if present, or an explicit note that everything is local

If you find a mismatch between the docs and the implementation, either:

Correct the doc, or

Note the mismatch clearly and mark it for a future prompt

Self evaluation:
Under ### Step 6 – Self evaluation, say whether the system as implemented matches the “local first, privacy protective” story that the docs tell.

Step 7 – Define tag and release notes content

Now decide what you would tag and how you would describe it.

If RELEASE_NOTES.md already exists, update it. Otherwise create it.

Summarize this release as something like “Workshop v1 – Profiles, Telemetry, Adult Insights, and Offline Ready”.

List major additions in human language, not internal prompt numbers.

Link to the key docs: user guides, safety summary, deployment guide.

In RELEASE_READINESS_PROMPT_042.md, add:

## Tag and release candidate

Describe:

Suggested tag name (for example v1.0.0-workshop or similar).

Which branch should be tagged.

Any caveats you would want in a public release note.

This step does not actually create a git tag. It only defines what you would tag.

Self evaluation:
Under ### Step 7 – Self evaluation, call out any reason you think this should be considered a “beta” versus a “stable” release.

Step 8 – Finalize checklist and status

At the top of RELEASE_READINESS_PROMPT_042.md, update the checklist:

 Release checklist created

 Hosting path validated

 UX flows reviewed

 All checks passing

 Ready for tag and deployment

or leave any unchecked if they are not yet true, with an explanation.

Ensure git status is clean.

If you introduced additional small docs or config changes, commit them with:

chore: apply Prompt 042

In the release doc, add a final section:

## Prompt 042 outcome

and summarize:

Whether all acceptance criteria were met

Any recommended focus for Prompt 043

Acceptance criteria for Prompt 042

Prompt 042 is considered successfully completed when:

docs/RELEASE_READINESS_PROMPT_042.md exists and includes:

Capability snapshot

Release readiness checklist

Build and test verification results

Hosting validation section

UX flows review

Safety and privacy confirmation

Tag and release candidate description

Self evaluations at each step

RELEASE_NOTES.md is present and updated with a clear description of this release.

All of these commands succeed at the end of the prompt:

npm run check:assets

npm run lint

npm run build

npm test

The working tree is clean.

The recommended tag and release summary give you enough context that you could confidently deploy this to a Netlify site as a “real” Workshop instance.