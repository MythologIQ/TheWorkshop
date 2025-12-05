# Data Model (v0)

## Goals
- Provide a minimal, shared shape for storing Workshop data across Stations.
- Stay implementation neutral (files, local DB, hosted API can all use these shapes).
- Keep fields small and readable for kids-first workflows while leaving room to extend.

## Core types and fields

### User
Fields:
- id (string): Stable unique id (e.g., UUID).
- displayName (string): The name shown in the app.
- role (enum): "kid" | "mentor" | "admin" (optional roles for supervision).
- createdAt (datetime ISO-8601): When the user was created.
- lastActiveAt (datetime ISO-8601, optional): Last activity timestamp.

### Project
Fields:
- id (string): Unique project id.
- ownerId (string): User.id of the creator/owner.
- title (string): Short, child-chosen project name.
- description (string): Brief mission summary from the Design Dock.
- status (enum): "draft" | "in_progress" | "paused" | "completed" | "archived".
- currentStation (enum): "idea" | "build" | "test" | "memory" | "reflect" | "share" | "replay" (where the child is now).
- steps (array<Step>): Ordered list of steps for this project.
- stationStates (object<StationState>): Map keyed by stationKey for per-station context.
- tags (array<string>, optional): Simple labels (e.g., "comic", "robot").
- createdAt (datetime ISO-8601): Creation timestamp.
- updatedAt (datetime ISO-8601): Last modification timestamp.

### Step
Fields:
- id (string): Unique step id.
- projectId (string): Parent Project.id.
- title (string): Short action the child can do.
- summary (string, optional): Extra guidance for the step.
- status (enum): "todo" | "in_progress" | "blocked" | "done".
- order (number): Display/order index within the project.
- originStation (enum, optional): "idea" | "build" | "test" | "memory" | "reflect" | "share" | "replay" (where it was created).
- acceptanceCriteria (string, optional): How we know this step is done.
- notes (string, optional): Quick notes or hints.
- createdAt (datetime ISO-8601): Creation timestamp.
- updatedAt (datetime ISO-8601): Last modification timestamp.

### StationState
Represents the latest context and artifacts for a Project inside one Station.
Fields:
- id (string): Unique station state id.
- projectId (string): Parent Project.id.
- stationKey (enum): "idea" | "build" | "test" | "memory" | "reflect" | "share" | "replay".
- inputs (object): Station-specific inputs (e.g., child goal, constraints).
- outputs (object): Station-specific outputs (e.g., mission brief, test findings).
- activeStepIds (array<string>): Step ids currently in focus here.
- reflections (array<object>): Time-stamped notes or learnings (text + createdAt).
- lastVisitedAt (datetime ISO-8601): Last time this Station was used for the project.
- createdAt (datetime ISO-8601): Creation timestamp.
- updatedAt (datetime ISO-8601): Last modification timestamp.

## Examples

### Project with Steps
```json
{
  "id": "proj_123",
  "ownerId": "user_001",
  "title": "Robot Dog Comic",
  "description": "A comic where a robot dog rescues a kite for friends.",
  "status": "in_progress",
  "currentStation": "build",
  "tags": ["comic", "robot"],
  "steps": [
    {
      "id": "step_1",
      "projectId": "proj_123",
      "title": "Sketch robot dog head",
      "status": "done",
      "order": 1,
      "originStation": "build",
      "createdAt": "2025-12-04T00:10:00Z",
      "updatedAt": "2025-12-04T00:25:00Z"
    },
    {
      "id": "step_2",
      "projectId": "proj_123",
      "title": "Draw kite in trouble",
      "status": "in_progress",
      "order": 2,
      "originStation": "idea",
      "createdAt": "2025-12-04T00:26:00Z",
      "updatedAt": "2025-12-04T00:40:00Z"
    },
    {
      "id": "step_3",
      "projectId": "proj_123",
      "title": "Write 4 speech bubbles",
      "status": "todo",
      "order": 3,
      "originStation": "idea",
      "createdAt": "2025-12-04T00:27:00Z",
      "updatedAt": "2025-12-04T00:27:00Z"
    }
  ],
  "stationStates": {},
  "createdAt": "2025-12-04T00:05:00Z",
  "updatedAt": "2025-12-04T00:40:00Z"
}
```

### StationState (Design Dock example)
```json
{
  "id": "state_idea_proj_123",
  "projectId": "proj_123",
  "stationKey": "idea",
  "inputs": {
    "childGoal": "Make a comic for friends",
    "constraints": {
      "timeMinutes": 60,
      "tools": ["paper", "markers"]
    }
  },
  "outputs": {
    "missionBrief": "Robot dog rescues a kite for friends.",
    "projectName": "Robot Dog Comic",
    "starterSteps": ["Draw head", "Draw kite trouble", "Write 4 bubbles"]
  },
  "activeStepIds": ["step_2"],
  "reflections": [
    {
      "note": "Drawing big goggles makes the dog look friendlier.",
      "createdAt": "2025-12-04T00:30:00Z"
    }
  ],
  "lastVisitedAt": "2025-12-04T00:35:00Z",
  "createdAt": "2025-12-04T00:05:00Z",
  "updatedAt": "2025-12-04T00:35:00Z"
}
```
