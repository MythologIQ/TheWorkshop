# The Workshop Project Plan

Version: v0.1  
Owner: Product and Engineering

## 1. Overview

The Workshop is a kids first AI creative studio that runs directly in the browser on a local WebGPU accelerated language model via WebLLM. It helps children turn ideas into small, buildable projects through a series of themed stations, each aligned with a simple learning loop: Ask, Reflect, Plan, Act, Review.

This document describes the end to end project plan from foundation to release. It is written for a team that includes humans and AI assisted agents and assumes a Git backed workflow.

## 2. Scope

In scope for v1:

- Browser based application using WebLLM for local inference.
- Core station set: Idea, Build, Test, Memory, Reflect, Share, Replay.
- Project creation and library.
- Station aware navigation and progress tracking.
- Safety Contract enforcement and Creativity Boundary adherence.
- Minimal but coherent visual identity suitable for children.
- Local storage of projects without backend services.

Out of scope for v1:

- Multi user collaboration in real time.  
- Cloud sync or accounts.  
- Mobile native apps.  
- Advanced analytics or telemetry.

## 3. Assumptions

- Target devices include Chromebooks, low to mid range laptops, tablets, and desktops with WebGPU support.  
- Users are primarily children aged roughly 8 to 14, supervised by adults.  
- The system must be usable without reading long instructions.  
- Internet connectivity may be intermittent.  
- The host environment can serve static assets and model files.

## 4. Technical Stack

- Frontend: React with TypeScript.  
- Build: Vite or comparable bundler.  
- Styling: CSS modules or Tailwind utility classes, kept simple for readability.  
- AI runtime: WebLLM embedded in the browser, loading a quantized small model, for example a Phi or Qwen class model.  
- Storage: LocalStorage or IndexedDB via a simple abstraction, storing project documents and station logs as JSON.  
- Testing: Vitest or Jest for unit tests, Playwright or similar for basic end to end flows.

Exact choices can be refined during Phase 0, but the plan assumes a React plus WebLLM baseline.

## 5. Phases And Milestones

### Phase 0: Project Bootstrap

Goals:

- Create initial repository and folder layout (app, docs, ops, roadmap, prompts, ui).  
- Configure tooling: TypeScript, bundler, linting, testing.  
- Integrate WebLLM with a simple echo sample to validate WebGPU and model loading.  
- Document setup steps for local development.

Deliverables:

- Running "Hello Workshop" page.  
- WebLLM model loads and responds to a trivial prompt.  
- CONTRIBUTING and GOVERNANCE documents in place.  
- Baseline STYLE_GUIDE and this project plan committed.

### Phase 1: Core Framework

Goals:

- Implement application shell with routing and navigation bar.  
- Define Project domain model and Station state types.  
- Implement project create, load, and save using local storage abstraction.  
- Implement basic station container that can render different station views based on current project state.  
- Embed Safety Contract into a central module for reuse in prompts and documentation.

Deliverables:

- User can create a new project, give it a title, and see a list of available stations, even if some are stubbed.  
- Project is persisted locally and reloaded on page refresh.  
- Station routing works through a simple navigation control.  
- Safety and creativity boundary docs are visible and referenced in code comments.

### Phase 2: Idea Station End To End

Goals:

- Implement Idea Station UI within the design bounds.  
- Connect Idea Station to WebLLM via an AI adapter that uses the idea station system prompt.  
- Save idea summary and starter steps into the project.  
- Validate that the resulting data shape matches the shared Project model.

Deliverables:

- Children can describe an idea and receive structured help summarizing it and creating up to three starter steps.  
- All idea data is persisted and visible when returning to the project.  
- System prompt file exists and passes basic tests for safety and format.

### Phase 3: Build Station And Test Station

Goals:

- Implement Build Station, Assembly Bay, with single active step workflow and optional AI hints.  
- Implement Test Station, Diagnostics Corridor, with a simple chat like interface focused on clarity checks.  
- Ensure both stations respect the Creativity Boundary Specification and Safety Contract.  
- Wire transitions so that after Idea Station, a user can move to Build, then Test.

Deliverables:

- Users can work on one starter step at a time, mark it done, and log notes.  
- Users can ask the Test Station whether their work makes sense and receive concrete feedback.  
- Both stations write entries into the project log for later review.

### Phase 4: Memory And Reflect Stations

Goals:

- Implement Memory Station, Stellar Archive, to record wins, lessons, and intentions.  
- Implement Reflect Station, Orbiter Bridge, to summarize patterns and help the child notice their own learning.  
- Integrate both with project timeline and snapshots where appropriate.  
- Add simple visual timeline of project activity.

Deliverables:

- Users can add reflection entries tied to project milestones.  
- The system can highlight simple patterns across multiple reflections.  
- The Archive feels like a story of their work, not a grading sheet.

### Phase 5: Share And Replay Stations

Goals:

- Implement Share Station, Broadcast Deck, to turn project data into a short shareable artifact, such as a simple printable page or slide like summary.  
- Implement Replay Station, Time Tunnels, to revisit earlier project snapshots and branch or restore from them under clear safeguards.  
- Ensure that exports never include sensitive personal data and encourage adult review before sharing.  
- Confirm that Replay does not cause data loss and always preserves at least one safe snapshot.

Deliverables:

- Child can generate a simple summary or artifact of their project journey.  
- Child can inspect earlier versions of their project and optionally branch from them.  
- Safety and privacy messaging is clear and aligned with the Safety Contract.

### Phase 6: Polish, Accessibility, And Release Prep

Goals:

- Perform accessibility review for basic keyboard navigation, contrast, font sizes, and screen reader hints.  
- Conduct copy review to ensure tone is warm, clear, and non patronizing.  
- Run stress tests on low powered devices and refine model settings if necessary.  
- Finalize documentation for parents, educators, and developers.

Deliverables:

- v1 tagged release with a stable feature set.  
- Documentation hub updated: Workshop Atlas, Station specs, Creativity boundaries, Safety guidelines, this project plan, and a high level roadmap.  
- Known issues list maintained for future phases.

## 6. Workstreams And Parallelism

Several workstreams can run in parallel as long as the core framework keeps advancing:

- Pedagogy and safety documentation can iterate while Phase 1 and 2 code is built.  
- Visual design and station branding can progress while Build and Test implementation begins.  
- Prompt engineering for later stations like Share and Replay can start once their specs are drafted, even before the UI is complete.  
- Automation scripts can evolve as the repo structure stabilizes.

The critical path runs through: project model, station framework, Idea Station, Build Station, Test Station, then the remaining stations.

## 7. Specialist Agent Roles

The plan assumes role separation, whether performed by humans or AI assisted agents:

- Architect: Owns the overall architecture and ensures integrity across modules.  
- Product Designer: Owns experience, copy tone, and visual consistency.  
- Systems Engineer: Builds core app shell, routing, state management, and station plumbing.  
- Station Engineers: Implement individual station UIs and logic.  
- Prompt Engineer: Maintains prompts and structured output formats for all stations.  
- Documentation Lead: Keeps specs, feature docs, and change logs synchronized.  
- QA Lead: Designs test scenarios and validates against safety, pedagogy, and UX standards.

## 8. Risk And Mitigation

Key risks:

1. WebGPU compatibility gaps on some devices.  
   - Mitigation: Provide feature detection, degrade gracefully, and document requirements clearly.

2. Model quality too low for satisfying kid experiences.  
   - Mitigation: Tune prompts, limit complexity, and consider shipping slightly larger models for more capable devices.

3. Scope creep in station features.  
   - Mitigation: Enforce the Creativity Boundary Specification and keep station responsibilities narrow.

4. Safety regressions due to prompt changes.  
   - Mitigation: Maintain unit tests for prompts and run scenario tests after updates.

## 9. Success Criteria

The Workshop v1 is considered successful if:

- A child can open it on a mid range device and complete a small project with minimal adult intervention.  
- The experience feels fun, guided, and safe.  
- Projects are small but meaningful, such as a single comic page, a short story scene, or a simple game concept outline.  
- Adults can understand what the system does and why it is safe, simply by reading the documentation and using it briefly.  
- Developers can extend the system by adding new stations that follow the existing patterns and constraints.

This project plan is a living document. Changes must be tracked through version control and associated with specific feature or governance updates.
