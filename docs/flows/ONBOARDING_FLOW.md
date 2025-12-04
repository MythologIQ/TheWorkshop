# Onboarding Flow (v0)

Goal: introduce a brand new child user to The Workshop, the Stations, and help them launch their first Project.

## Steps
1) First launch splash (Station: none)
   - The app opens with a friendly welcome screen that says "Welcome aboard The Workshop" with a brief line: "A place to turn your ideas into real projects, step by step."
   - Shows two buttons: "Start" and "What is The Workshop?" (an optional info panel).

2) Name yourself (Station: none)
   - Prompt: "What should we call you?" with a single text field (displayName) and a clear "Continue" button.
   - Safety hint: "Keep it friendly; no last names needed."

3) Meet The Workshop (Station: none)
   - A short 3-card intro carousel (skippable):
     - Card 1: "Stations are rooms that help you think, build, test, and remember."
     - Card 2: "You choose the mission; we keep you safe and kind."
     - Card 3: "You'll start at the Design Dock to shape your idea."
   - Button: "Let's visit the Stations."

4) Stations overview (Station: overview)
   - Simple grid or list with brief kid-friendly blurbs and icons:
     - Design Dock (Idea Station): "Shape your mission."
     - Assembly Bay (Build Station): "Build one small part at a time."
     - Diagnostics Corridor (Test Station): "Check what works and fix what doesn't."
     - Stellar Archive (Memory Station): "Remember wins, lessons, and next steps."
   - Button: "Create my first project."

5) Start first project setup (Station: Design Dock intro)
   - Prompt: "What do you want to make?" with an open text field for the raw idea.
   - Optional prompts: interests, time available, tools on hand.
   - Safety reminder displayed subtly: "We keep ideas safe, kind, and honest."

6) Shape the mission (Station: Design Dock)
   - Guided questions: audience, goal, why it matters to them.
   - The system drafts a short mission brief; the child can edit/approve.
   - Shows a one-line project name suggestion the child can accept or change.

7) Create starter steps (Station: Design Dock)
   - Suggests 3-5 tiny starter steps; child can reorder or tweak labels.
   - Confirms scope is doable (time/tools check); offers to shrink steps if needed.

8) Confirm and launch (Station: Design Dock -> ready state)
   - Summary screen: project name, mission brief, first steps.
   - Button: "Launch project" which saves Project and steps, sets currentStation to Design Dock or Assembly Bay depending on next action chosen.
   - Offer: "Jump to Assembly Bay to start building" or "Save and explore later."

9) Wrap-up / handoff (Station: optional next)
   - If continuing: moves to Assembly Bay with the first step selected.
   - If pausing: returns to a simple Home with the project pinned and a prompt to resume later.
