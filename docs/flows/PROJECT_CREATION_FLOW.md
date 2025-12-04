# Project Creation Flow (v0)

Goal: help an existing user start a new Project, move through the Idea Station (Design Dock), and leave with a project summary plus first steps.

## Steps
1) Start from Home/Main view (Station: none)
   - User sees recent Projects list and a clear "New Project" button.
   - Clicking "New Project" opens a lightweight modal or page to begin.

2) Capture the spark (Station: Design Dock intro)
   - Prompt: "What do you want to make?" with open text.
   - Optional quick toggles: time available today, tools on hand, who it's for.

3) Clarify the mission (Station: Design Dock)
   - Questions: audience, goal, why it matters; surface the Safety Contract briefly.
   - System drafts a mission brief; user can edit and approve.
   - Suggest a project name; allow quick rename.

4) Draft starter steps (Station: Design Dock)
   - Suggest 3-5 small steps sized for beginners; show time/effort hints.
   - Allow reordering and editing; ensure at least one clear first step.

5) Review and confirm (Station: Design Dock -> ready state)
   - Summary screen: project name, mission brief, starter steps.
   - Choices:
     - "Start building now" -> continue to Assembly Bay with first step selected.
     - "Save for later" -> saves Project and returns to Home with new entry pinned.

6) Handoff to build (Station: Assembly Bay entry)
   - If "Start building now": loads Assembly Bay with the first step active and a short welcome: "Let's tackle this step first."
   - Shows next actions and a quick link back to the mission brief if needed.
