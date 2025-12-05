# The Workshop Creativity Boundary Specification

Version: v0.1  
Owner: Architecture and Pedagogy Group  
Runtime Target: Browser based, WebGPU local LLM (WebLLM)

## 1. Purpose

This document defines how The Workshop balances open ended imagination with practical, buildable outcomes for children and beginners.

The core principle is simple:

> Creativity is unbounded in the imagination, but execution is always shaped into small, finishable pieces.

These boundaries are not intended to restrict children. They exist to help them complete projects, experience follow through, and learn how ideas become real.

This specification is a first class constraint on system behavior. Stations, prompts, UI flows, and storage must all respect it.

## 2. Design Objectives

1. Encourage wild ideas but gently steer toward achievable outcomes.
2. Keep project scope small enough for a child to finish a slice in a short session.
3. Make constraints feel like support, not punishment.
4. Align with the Workshop learning loop: Ask, Reflect, Plan, Act, Review.
5. Support low resource local models by keeping interactions simple and focused.
6. Preserve safety and privacy at all times.

## 3. Constraint Layers

Creativity boundaries are implemented across four main layers and one cross cutting safety layer.

1. Model layer  
2. Prompt layer  
3. UI layer  
4. Engine and data layer  
5. Safety and ethics layer

Each layer contributes its own limits. Together they form the Creativity Boundary System (CBS).

### 3.1 Model Layer

The Workshop runs on a small WebGPU accelerated model via WebLLM. Target scale: 1.3B to 3B parameters, quantized for speed and low memory usage.

This implies natural constraints:

- Reasoning depth is moderate rather than extreme.
- Long, branching storylines are harder for the model to maintain.
- Responses tend toward concise, concrete instructions when prompted correctly.

We treat these limitations as a feature. The system never expects long chains of reasoning from the model. Instead it asks for short steps, simple reflections, and small summaries.

### 3.2 Prompt Layer

All station prompts share these global reality anchors:

- Ask for concrete, small actions that can be done in minutes, not days.
- Frame suggestions in terms of tools a child is likely to have: paper, pencils, basic craft materials, simple digital tools.
- When a request is impossible or unsafe, redirect gently to the closest real world equivalent.
- Encourage honesty about what the child can actually do today.

Typical language patterns in system prompts:

- "Let us turn this big idea into something you could really make."
- "Suggest only a few small steps that a child could try this week."
- "If the idea is too huge, help gently shrink it into a smaller scene, page, or example."

All prompts must include:

1. Role description for the station.  
2. Safety recap, including refusal and redirection rules.  
3. Pedagogy loop mapping for that station.  
4. Output schema so the engine can consume the result.  
5. Creativity boundary reminders.

### 3.3 UI Layer

The UI layer imposes visible, understandable limits that help children focus instead of spinning out.

Key rules:

- Limit the number of primary inputs per station.
- Avoid open ended giant text areas without guidance.
- Normalize the idea that "you can always come back later with another version."

Station level UI constraints:

- Idea Station  
  - One idea title.  
  - One short mission description.  
  - One goal statement.  
  - At most three starter steps.

- Build Station  
  - Shows a finite list of steps from Idea Station.  
  - Only one step can be "active" at a time.  
  - UI steers toward completing one small piece rather than many simultaneous tasks.

- Test Station  
  - One active question or concern per turn.  
  - Encourages focused testing instead of vague "does this work" feelings.  
  - Result is a short list of up to five findings.

- Memory Station  
  - Shows a timeline with discrete entries.  
  - Reflection prompts are limited to a handful of fields (for example "win", "lesson", "next time").

- Reflect Station  
  - Offers a small set of reflection prompts and tags.  
  - Encourages pattern noticing, not long essays.

- Share Station  
  - Guides toward a single artifact at a time, for example a short presentation, a one page comic, a mini script, or similar.  
  - Output is always a bounded format, not an entire book in one go.

- Replay Station  
  - Allows selecting one prior snapshot or moment at a time.  
  - New branches are created deliberately, not accidentally.

### 3.4 Engine And Data Layer

The engine layer enforces hard caps that the UI and prompts rely on.

Key constraints:

- Maximum size for user input fields, for example 512 to 1024 characters per major field.
- Maximum number of steps per project, for example 10 to 12 for v1.
- Maximum number of reflections per session, for example 3 new reflections per visit to Memory or Reflect Stations.
- Token budget per AI call so that prompts and outputs remain small and manageable.
- Strict versioning and snapshot size limits for Replay Station to avoid unbounded history.

These constraints must be encoded in:

- Type definitions for Project and Station state.  
- Validation logic in the application layer.  
- Guard rails when rendering station UIs.  
- AI adapters that truncate or summarize inputs before sending them to the model.

### 3.5 Safety And Ethics Layer

The Safety Contract overlays the CBS and takes precedence if a creative idea crosses ethical, safety, or legal boundaries.

Guard rails include:

- No assistance with self harm, violence, abuse, or illegal activity.  
- No detailed instructions for dangerous experiments or actions.  
- No collection or retention of sensitive personal information.  
- No pretending to be a doctor, therapist, or any formal authority.  
- Truth is favored over sounding impressive, and guesses are labeled as guesses.  

If a child proposes an unsafe idea, the system must:

1. Politely decline to help with that specific part.  
2. Offer a safe adjacent activity.  
3. Encourage talking with a trusted adult when appropriate.

The Creativity Boundary Specification must never be implemented in a way that overrides or weakens the Safety Contract.

## 4. Station Specific Bounds

This section captures constraints for each station so that the boundaries are explicit and testable.

### 4.1 Idea Station (Design Dock)

Role: Help the child turn a vague idea into a small, buildable mission.

Hard bounds:

- Title: up to 60 characters.  
- Mission description: up to 400 characters.  
- Goal description: up to 200 characters.  
- Starter steps: 1 to 3, each step up to 140 characters.

Design guidance:

- Encourage the child to think about one scene or one small piece rather than an entire franchise.  
- If the idea is huge, guide toward selecting a single moment to work on first.  
- The AI should never output more than three steps for the first version.

### 4.2 Build Station (Assembly Bay)

Role: Support the child in working through specific steps from their plan.

Hard bounds:

- Only one active step at a time.  
- Notes per step: up to 300 characters.  
- Optional AI expansion: at most three sub suggestions per step.

Design guidance:

- Encourage finishing the active step or deciding to move it back to todo, rather than starting many steps at once.  
- AI suggestions should be small and actionable.  
- If the child asks for many ideas, the AI should help them choose one to start with.

### 4.3 Test Station (Diagnostics Corridor)

Role: Help the child check if their work makes sense and is understandable to others.

Hard bounds:

- One focus question per test cycle.  
- Maximum of five AI turns per test session before suggesting a break.  
- Test summary limited to a short list of up to five findings.

Design guidance:

- Focus on clarity, not perfection.  
- Present any issues as normal parts of making things, not as failures.  
- Offer one or two concrete improvements, not a long list of criticisms.

### 4.4 Memory Station (Stellar Archive)

Role: Capture reflections and celebrate progress.

Hard bounds:

- Per visit, at most:  
  - One "proud of" entry.  
  - One "lesson learned" entry.  
  - One "next time" intention.  
- Reflection entries limited to about 240 characters each.

Design guidance:

- Emphasize effort, curiosity, and learning over outcome.  
- Normalize changing your mind and iterating.  
- Make the Archive feel like a log of growth, not a scoreboard.

### 4.5 Reflect Station (Orbiter Bridge)

Role: Point out patterns across work and reflections.

Hard bounds:

- Tags per session: up to three, for example "brave", "patient", "curious".  
- Pattern notes: one or two short observations.

Design guidance:

- Do not psychoanalyze or label the child.  
- Keep observations strictly tied to the project and behaviors within the Workshop.  
- Stay future focused, for example "Next time, you might enjoy trying X."

### 4.6 Share Station (Broadcast Deck)

Role: Turn a project journey into a single shareable artifact for a safe audience.

Hard bounds:

- One selected audience type per export, for example family, teacher, or friend.  
- One chosen export format per session.  
- Export content derived from existing project data and user text, not arbitrary web content.

Design guidance:

- Always remind the child to get adult permission before sending or posting anything.  
- Strip or avoid any sensitive personal details in templates.  
- Keep exports short and clear, suitable for reading in a few minutes.

### 4.7 Replay Station (Time Tunnels)

Role: Let the child revisit earlier versions of their project and optionally branch or restore them.

Hard bounds:

- Maintain a finite number of snapshots per project, for example 10 recent snapshots.  
- Allow only one branch creation per snapshot per session.  
- Require confirmation before overwriting the current state with a past snapshot.

Design guidance:

- Frame revisiting the past as exploration, not regret.  
- Encourage using what was learned since that snapshot when making changes.  
- Make it clear that backups exist and work will not be lost accidentally.

## 5. Interaction With The Learning Loop

The Ask, Reflect, Plan, Act, Review loop is the backbone of The Workshop.

Creativity boundaries are aligned with this loop as follows:

- Ask: Boundaries encourage questions that are specific and actionable.  
- Reflect: Prompts and UI constraints steer toward short, honest reflections.  
- Plan: Step counts and lengths prevent unmanageable plans.  
- Act: Single active steps and small tasks create achievable actions.  
- Review: Timeline and snapshot limits make review feel paced and digestible.

Any new station or feature must document how it respects both the learning loop and the Creativity Boundary Specification.

## 6. Testing And Validation

To validate adherence to this spec:

- Automated tests can check field length limits and step counts.  
- Prompt unit tests can confirm that outputs never exceed structured limits.  
- Scenario tests can simulate extreme inputs and verify that the system de scopes huge ideas gracefully.  
- UX reviews with adults can evaluate whether the boundaries feel supportive rather than restrictive.

## 7. Governance

This document is version controlled alongside the codebase. Changes must:

1. Be proposed in a pull request.  
2. Reference real or anticipated user needs.  
3. Include updates to affected station or prompt specs.  
4. Be reviewed with explicit attention to safety and pedagogy.

The Creativity Boundary Specification is not optional guidance. It is a core part of The Workshop architecture.
