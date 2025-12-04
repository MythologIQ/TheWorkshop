# Codex Runbook v1 – The Workshop

You are Codex inside the `TheWorkshop` repo. 
You are working with a Product Manager and Lead Designer (Reed) who has defined the architecture and rules.

Your job is to keep the repo clean, traceable, and aligned with the design. 
Follow these steps **in order** unless the user tells you otherwise.

General rules:
- Always show which files you read or changed.
- Prefer editing existing files over inventing new ones.
- Respect the governance rules in `GOVERNANCE.md` and `CONTRIBUTING.md`.
- Keep prompts, specs, and code in their proper folders.
- Use small, focused commits with clear messages.

---

## STEP 0 – Get your bearings

**Prompt to Codex:**

> Open a terminal in the current workspace and run the following commands:
>
> ```bash
> pwd
> ls
> ls docs
> ls prompts
> git status
> ```
>
> Then summarize:
> - What repo you are in
> - Which key folders exist
> - Whether there are uncommitted changes

---

## STEP 1 – Load the project rules into your head

**Prompt to Codex:**

> Open and read the following files and summarize their rules and expectations:
> - `README.md`
> - `GOVERNANCE.md`
> - `CONTRIBUTING.md`
> - `docs/WORKSHOP_ATLAS.md`
> - `docs/PEDAGOGY_LOOP.md`
> - `docs/SAFETY_CONTRACT.md`
>
> In your own words, explain:
> - What The Workshop is for
> - Who it serves
> - The non negotiable rules for features, prompts, and changes
> - The purpose of Stations and the learning loop
>
> Do not edit any files in this step. This is orientation only.

---

## STEP 2 – Align station specs

Goal: make sure each Station spec is fully aligned with the design vision and is self contained.

**Prompt to Codex:**

> Open the following files:
> - `docs/stations/IDEA_STATION.md`
> - `docs/stations/BUILD_STATION.md`
> - `docs/stations/TEST_STATION.md`
> - `docs/stations/MEMORY_STATION.md`
>
> For each file:
> - Ensure it includes these sections: Purpose, Role in the learning loop, Inputs, Outputs, User experience, Safety behavior, Example child dialogue.
> - Rewrite or extend the content so it reflects a Starship Shipyard theme with the Station names:
>   - Idea Station → Design Dock
>   - Build Station → Assembly Bay
>   - Test Station → Diagnostics Corridor
>   - Memory Station → Stellar Archive
> - Make the language clear, concrete, and kid friendly without being childish.
>
> When you are done, show me a diff style summary of what changed in each file, but do not commit yet.

After Codex completes edits and shows changes, you run:

```bash
git diff docs/stations
```

If you are happy with the changes:

```bash
git add docs/stations
git commit -m "Refine Workshop Station specs for v0 (Shipyard theme)"
```

---

## STEP 3 – Align Station system prompts

Goal: have clean, consistent system prompts for each Station that match the specs.

**Prompt to Codex:**

> Open the following prompt files:
> - `prompts/stations/idea_station_system.txt`
> - `prompts/stations/build_station_system.txt`
> - `prompts/stations/test_station_system.txt`
> - `prompts/stations/memory_station_system.txt`
>
> For each file:
> - Make sure the prompt:
>   - Names the Station and its Shipyard alias
>   - States the Station's job in one or two sentences
>   - References the five step loop: Ask, Reflect, Plan, Act, Review (with emphasis appropriate to the Station)
>   - Mentions the Safety Contract and how the Station uses it
>   - Includes 4–6 short, clear behavioral rules
> - Keep the style simple and direct, suitable for use as a system prompt.
>
> Show me the full contents of each file after editing, and do not commit yet.

After Codex updates them and you are satisfied:

```bash
git add prompts/stations
git commit -m "Align Station system prompts with v0 specs"
```

---

## STEP 4 – Flesh out the data model

Goal: define a concrete v0 data model that supports Projects, Steps, and StationState.

**Prompt to Codex:**

> Open `docs/DATA_MODEL.md`.
>
> Expand it into a clear v0 spec that includes:
> - A short description of the data model goals.
> - Definitions for:
>   - User
>   - Project
>   - Step
>   - StationState
> - For each type, list fields with:
>   - Name
>   - Type
>   - Description
> - Include one or two small JSON examples that show:
>   - A Project with a few Steps
>   - How StationState is used to track work in a Station.
>
> Keep it implementation neutral (no specific database) but concrete enough that a backend can be implemented from this doc.
>
> Show me the full file content when you are done, and do not commit yet.

After review:

```bash
git add docs/DATA_MODEL.md
git commit -m "Define v0 data model for Projects, Steps, and StationState"
```

---

## STEP 5 – Describe onboarding and project creation flows

Goal: have solid textual flow specs before we touch any UI code.

**Prompt to Codex:**

> Open:
> - `docs/flows/ONBOARDING_FLOW.md`
> - `docs/flows/PROJECT_CREATION_FLOW.md`
>
> For `ONBOARDING_FLOW.md`:
> - Write a step by step narrative of what a brand new child user experiences:
>   - First launch
>   - Meeting The Workshop
>   - Being introduced to Stations
>   - Creating their first Project
>
> For `PROJECT_CREATION_FLOW.md`:
> - Describe how an existing user:
>   - Creates a new Project from the main view
>   - Moves into the Idea Station
>   - Comes out with a Project summary and a first set of Steps
>
> In each file, separate the flow into clearly numbered steps, and call out which Station is active at each step.
>
> Show me both files when you are done, and do not commit yet.

After review:

```bash
git add docs/flows/ONBOARDING_FLOW.md docs/flows/PROJECT_CREATION_FLOW.md
git commit -m "Define onboarding and project creation flows for The Workshop"
```

---

## STEP 6 – Create the first feature spec file

Goal: start the FEATURE-WS tracking discipline from the beginning.

**Prompt to Codex:**

> Create a new file `docs/features/FEATURE-WS-0001-idea-station-v1.md` using `docs/features/FEATURE_TEMPLATE.md` as a base.
>
> Fill it out to describe the v1 implementation of the Idea Station (Design Dock):
> - Its purpose and scope
> - What is in scope for v1 and what is explicitly out of scope
> - Affected Stations (only IdeaStation for this feature)
> - User type (Kid first, Mentor second)
> - Acceptance criteria for a minimal working Idea Station
>
> Show me the full file content when you are done.

After review:

```bash
git add docs/features/FEATURE-WS-0001-idea-station-v1.md
git commit -m "Add feature spec FEATURE-WS-0001 for Idea Station v1"
```

---

## STEP 7 – Update roadmap and changelog

Goal: tie the design work into the project history.

**Prompt to Codex:**

> Open:
> - `roadmap/ROADMAP_V0_V1.md`
> - `roadmap/CHANGELOG.md`
>
> In `ROADMAP_V0_V1.md`:
> - Add a short list of milestones for v0:
>   - Station specs and prompts finalized
>   - Data model defined
>   - Onboarding and project flows defined
>   - Idea Station v1 implemented
>
> In `CHANGELOG.md`:
> - Add entries for today capturing the work done so far (station specs, prompts, data model, flows, first feature spec). You can leave the exact date for the user to fill in.
>
> Show me both files when you are done, and do not commit yet.

After review:

```bash
git add roadmap/ROADMAP_V0_V1.md roadmap/CHANGELOG.md
git commit -m "Update roadmap and changelog for initial design work"
```

---

## STEP 8 – Prepare for future app scaffolding

Goal: set the stage without bloating the dev server yet.

**Prompt to Codex:**

> Open `app/frontend/README.md` and `app/backend/README.md`.
>
> In `app/frontend/README.md`, write a brief plan for a local first desktop style app using web tech, including:
> - Likely choice of framework (for example, React with Vite)
> - High level structure of pages or main screens based on the flows
> - A note that v0 will not implement multiplayer
>
> In `app/backend/README.md`, write a brief plan for a simple backend that:
> - Stores Projects, Steps, and StationState locally
> - Could later be swapped for a hosted API without breaking the app
>
> Show me both files when you are done.

After review:

```bash
git add app/frontend/README.md app/backend/README.md
git commit -m "Outline frontend and backend approach for v0 Workshop app"
```

---

## STEP 9 – Sanity check and status

**Prompt to Codex:**

> Run:
> ```bash
> git status
> ```
> Then summarize:
> - What has been committed in this session
> - What design pieces are now in place
> - What you recommend as the next implementation step (likely starting small with Idea Station UI or storage)

This completes Runbook v1.

Future runbooks will cover:
- Implementing a minimal UI shell for the four Stations
- Adding a simple local file or JSON based storage layer
- Wiring Station prompts into an AI backend
- Gradual steps toward a real child facing prototype
