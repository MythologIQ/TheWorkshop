# AI Safety Pipeline for MythologIQ Creation Lab

MythologIQ Creation Lab couples the Safety Contract with a deterministic AI harness so every station receives predictable, kid-safe assistance. This document explains how the child-mode governor, the harness, and the incident log work together without changing the core AI behavior described in `docs/AI_BEHAVIOR_AND_SAFETY.md`.

## Child-mode governor
The governor (`app/src/runtime/safety/child_mode_governor.ts`) centralizes the tone, reading level, and content filters applied to every response before it reaches the UI. It:

- rewrites direct negatives (`don't`, `can't`, `shouldn't`) into gentler language so the voice stays encouraging.
- clamps output to three short sentences and trims overly long sentences, keeping reading level accessible for kids.
- replaces disallowed words (violence, self-harm, weapons, etc.) with a `[filtered]` placeholder.

These heuristics are intentionally simple. They can be refined later with more context-aware rewriting or safety scoring, but they already keep the Creation Lab voice calm and readable.

## Deterministic AI harness
The harness (`app/src/runtime/ai/safeAIHarness.ts`) is the single entry point for all station-level requests. It:

- accepts a structured request that includes the station, intent, user prompt, and optional system prompt.
- forwards the combined prompt to the existing loader (`app/src/runtime/llm/webllm_loader.ts`) so current model and token-cap logic remain untouched.
- runs the raw output through the child-mode governor, trims it to a fixed maximum, and splits it into sanitized tokens before streaming it back to the caller.

Stations now call `safeStream` instead of hitting the loader directly, which keeps AI responses deterministic and ensures every token has already passed the safety checks.

## Failure handling and incident logging
If the loader throws, returns nothing, or the governor removes every word, the harness:

- logs a privacy-safe incident (station, category, timestamp) in `app/src/runtime/store/aiIncidentStore.ts`.
- returns a friendly fallback message (“Let’s try again together...”) instead of exposing raw errors or empty output.
- leaves the log readable for future Adult Insights or diagnostics panels, while keeping all data on-device.

This incident store can be reset via code (and eventually via UI) so adults can clear the log after reviewing it.

## Expectations and limitations
- The governor is a lightweight filter—edge cases (e.g., sarcasm detection, advanced paraphrasing) are not covered yet and will need richer NLP components later.
- The harness currently aggregates the full response before emitting tokens, so token-by-token streaming is slightly delayed. Future work may stream sanitized tokens directly.
- All logging stays local and honor the privacy guarantees in `docs/PRIVACY_NOTES.md`.

This pipeline ensures MythologIQ Creation Lab remains safe, deterministic, and transparent while keeping the Safety Contract enforced in every Station.
