# The Workshop Master Timeline

Version: v0.1  
Owner: Product and Project Management

This timeline is expressed in relative sprints. A sprint can be interpreted as one or two weeks, depending on team capacity. The goal is to capture sequencing and dependencies, not precise dates.

## Sprint 0: Initialization

- Create repository structure and baseline docs.  
- Configure build tooling, TypeScript, linting, and testing.  
- Integrate WebLLM in a bare bones test page and confirm that a model can be loaded and queried in the browser.  
- Document local setup instructions.

## Sprint 1: Core Shell And Project Model

- Implement main App shell with basic routing.  
- Define Project and Station type definitions.  
- Implement local project storage abstraction.  
- Add a simple "Create Project" flow and list existing projects.  
- Add placeholder station routes for Idea, Build, and Test.

## Sprint 2: Idea Station Implementation

- Build Idea Station UI within the specified bounds.  
- Implement AI adapter for Idea Station using WebLLM.  
- Wire AI output into the Project model as idea summary and starter steps.  
- Add simple validation and error handling.  
- Write introductory help copy for Idea Station.

## Sprint 3: Build Station Implementation

- Create Build Station UI and logic for one active step at a time.  
- Allow toggling step status between todo and done, with optional notes.  
- Add AI hint button for steps that calls WebLLM with the Build Station prompt.  
- Persist progress and notes to project storage.  
- Update navigation so that users can move from Idea to Build naturally.

## Sprint 4: Test Station Implementation

- Implement Test Station UI as a focused chat around clarity and understanding.  
- Add AI adapter for Test Station with appropriate safety and boundary prompts.  
- Save concise test results into the project log.  
- Provide a clear way to conclude a test session and suggest next actions.  
- Begin simple timeline view that shows when Idea, Build, and Test were visited.

## Sprint 5: Memory Station

- Implement Memory Station UI for wins, lessons, and next time entries.  
- Connect Memory Station to the project timeline.  
- Integrate with previous stations so that significant events can be tagged and reflected on.  
- Ensure reflection entries follow the Creativity Boundary Specification.  
- Begin basic pattern surfacing for future Reflect Station use.

## Sprint 6: Reflect Station

- Implement Reflect Station UI and AI adapter.  
- Use prior reflections and project log to suggest simple patterns and gentle insights.  
- Ensure tone is supportive, not diagnostic.  
- Add an overview view that makes the child's growth visible across sessions.  
- Update documentation for Memory and Reflect interactions.

## Sprint 7: Share Station

- Implement Share Station UI with format selection, for example summary page or printable one pager.  
- Generate export drafts from project data and AI help.  
- Enforce safety rules that avoid exposing sensitive personal details.  
- Add messaging about seeking adult approval before sharing.  
- Test basic printing or saving behavior in browsers.

## Sprint 8: Replay Station

- Implement Replay Station UI showing snapshots or a simple time tunnel visual.  
- Add ability to inspect previous project states and branch or restore them with clear confirmation.  
- Ensure snapshots obey storage limits and are created at sensible moments.  
- Validate that no data is lost unexpectedly when using Replay.  
- Update timeline to reflect time travel actions.

## Sprint 9: Integration And UX Polish

- Smooth transitions between stations so the experience feels like a cohesive journey.  
- Refine copy for clarity and warmth.  
- Improve visual differentiation for each station, such as colors, icons, and metaphors.  
- Align all station prompts with the latest Safety and Creativity Boundary specs.  
- Run informal play tests with adults role playing as kids to identify confusion points.

## Sprint 10: Accessibility And Performance

- Evaluate contrast, font sizes, and keyboard navigation.  
- Add ARIA labels and screen reader hints where appropriate.  
- Test performance on low and mid range devices, adjust model settings and caching if necessary.  
- Address any major layout issues on smaller screens such as tablets or Chromebooks.

## Sprint 11: Documentation And Release Prep

- Finalize Workshop Atlas, Station specs, Creativity Boundary spec, Safety Contract, and this timeline.  
- Ensure docs/features and roadmap files reflect the actual implementation.  
- Create a simple site landing page explaining The Workshop to adults.  
- Tag v1.0.0 in version control and package a release build.

## Post v1: Future Opportunities

- Add optional account layer with parental control for saving across devices.  
- Introduce collaborative modes where multiple children can share projects.  
- Consider optional cloud backed inference as a premium or enhanced mode.  
- Integrate additional station types for specific disciplines such as science experiments, music, or coding.

This timeline is a guide, not a rigid script. Teams can merge or split sprints as needed, but should keep the critical path intact: Idea, Build, Test, Memory, Reflect, Share, then Replay.
