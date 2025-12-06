# Station Integration Specification

Version: v0.1  
Owner: Architecture

This document describes how stations in The Workshop interact with:

- The runtime application shell.  
- The WebLLM model.  
- The project and storage layer.  
- The pedagogy loop.  
- The Creativity Boundary and Safety Contract.

It defines the contract each station must satisfy in order to plug into the system.

## 1. Station Lifecycle

Stations share a common lifecycle:

1. Entry: The child navigates into the station with a current project selected.  
2. Context load: The station receives relevant slices of project state.  
3. Interaction: The child and optional AI persona work through a bounded task.  
4. Output: The station produces structured changes to the project.  
5. Logging: The station writes a short log entry for later review and reflection.  
6. Exit: The child navigates onward or back out to the project overview.

The station is responsible for its own UI and local interaction logic. The application shell is responsible for navigation and project selection.

## 2. Data Contracts

Every station must define:

- Its station key, for example `idea`, `build`, or `test`.  
- The subset of Project state it requires as input.  
- The structure of any station specific state it writes back.  
- A minimal station log shape for the project timeline.

Example for Idea Station:

- Station key: `idea`.  
- Reads: project id, title, existing idea fields if any.  
- Writes: idea summary, goal, starter steps.  
- Log entry: timestamp, station key, short description of what changed.

Station state must be serializable to JSON and reasonably compact.

## 3. AI Call Pattern

All AI calls go through a shared adapter that:

1. Looks up the appropriate station system prompt from `prompts/stations`.  
2. Injects shared safety and creativity boundary reminders.  
3. Injects station specific context from the project.  
4. Encodes the request for WebLLM and handles token limits.  
5. Parses structured responses into station friendly types.

Stations do not call WebLLM directly. Instead, they use a small API such as:

- `callStationModel(stationKey, payload)` returning a typed result or error.

This ensures that safety, truncation, and logging can be enforced centrally.

## 4. Learning Loop Alignment

Each station must document how its flow maps to the learning loop:

- Ask: What question or desire brings the child here.  
- Reflect: What thinking happens before action.  
- Plan: What plan or outline emerges.  
- Act: What the child does or produces.  
- Review: How the child looks back on this part of the journey.

The station implementation should then make that mapping visible in the UI and prompts where possible.

Example for Build Station:

- Ask: "What step am I working on right now."  
- Reflect: "What do I already know about how to do this."  
- Plan: "What small pieces can I try first."  
- Act: "Work on the step and mark it done or adjust it."  
- Review: "Note what went well or what needs another pass."

New stations must include this mapping in their spec before implementation.

## 4.5 Replay Station (Time Tunnels)

- Station key: `replay`.  
- Reads: project snapshots plus the current project state for context.  
- Writes: a new snapshot entry or a restored branch after explicit confirmation.  
- Log entry: timestamp, snapshot label, and a short note that the time tunnel was navigated.  
- Bound snapshots to around 10 entries and only store the essential slices (title, description, steps, tests, reflections, memory, reflect, share, and current station) so the archive stays compact.  
- Restores or branching actions must warn that the current path is being replaced and that Replay is about exploring alternate possibilities, not regret.

## 5. Creativity Boundary Compliance

Stations must enforce the Creativity Boundary Specification at three points:

1. When presenting UI elements, for example limiting number and size of fields.  
2. When calling the AI, for example ensuring prompts ask for small, realistic tasks.  
3. When writing back to the project, for example enforcing caps on steps and reflections.

Any station behavior that appears to expand scope in a way that conflicts with the boundaries must be reconsidered or redesigned.

## 6. Safety Contract Compliance

Stations must:

- Refuse or redirect unsafe requests.  
- Avoid collecting sensitive personal information.  
- Never present themselves as formal authorities.  
- Maintain a kind, encouraging tone and communicate uncertainty honestly.

The shared AI adapter and prompts provide a baseline. Stations must not override those safety features.

If a station needs to handle potentially sensitive topics, its spec must include explicit handling instructions.

## 7. Navigation And Progress

The application shell tracks which stations have been visited for a project and may provide high level progress indicators.

Stations can influence navigation by:

- Suggesting natural next stations, for example Idea suggests Build.  
- Marking when their core task is "completed" for this project.  
- Providing hints about when returning later might be useful, for example after changes in another station.

However, the child should always retain agency to revisit stations in any order, within reasonable safety limits.

## 8. Error Handling

Stations must behave gracefully when:

- Project state is incomplete or inconsistent.  
- AI calls fail or time out.  
- Storage read or write fails.

In such cases the station should:

- Show a simple, human friendly error.  
- Offer recovery options where possible, for example retry, go back, or proceed without AI.  
- Avoid leaving project state partially updated.

## 9. Adding New Stations

To add a new station:

1. Draft a station spec including purpose, learning loop mapping, inputs, outputs, and safety profile.  
2. Define its data contract and add types to the project model.  
3. Create a system prompt with safety and boundary instructions.  
4. Implement station UI and wiring to the shared AI adapter.  
5. Write tests and update documentation and changelog.

New stations should feel like they belong in the same Workshop universe and should not undermine the simplicity or constraints that make v1 usable.

## 10. Observability

For v1 there is no external telemetry, but internal logs can:

- Record station usage per session in memory for debugging.  
- Indicate how often AI requests are refused for safety reasons.  
- Help identify stations where children seem to get stuck frequently, through later research rather than automated analysis.

Any observability added in future versions must respect privacy and follow any applicable regulations for children.

This integration spec is the glue that keeps stations consistent with each other and with the overall goals of The Workshop. Changes must be made deliberately and documented alongside updates to station level specs.
