Prompt 041: System consolidation, self audit, and readiness check

Title: Prompt 041 – Consolidate Workshop state and perform a self audit
Phase: Meta maintenance and quality hardening
Goal:
Bring the Workshop repo into a clean, reproducible state after prompts 025 to 040, reconcile the dirty working tree, and produce a written self evaluation so future prompts run from a stable, well understood baseline.

Codex, you have full visibility into the repository. In this prompt you are acting as both engineer and auditor. Move in deliberate passes. At each major pass, update a human readable log so that the maintainer can see what you did and why.

Create and maintain this audit log file as you go:

docs/INTERNAL_AUDIT_PROMPT_041.md

Use simple sections and checklists, not prose novels.

Step 0 – Ground rules for this prompt

Before you begin, write a short intro section in docs/INTERNAL_AUDIT_PROMPT_041.md that states:

What this prompt is trying to achieve

What previous prompt range it is consolidating (at least 025 to 040)

The high level rules you will follow, including:

Do not discard work without clear justification

Prefer new commits over history rewriting

Keep the working tree clean at the end

All standard checks must pass: npm run check:assets, npm run lint, npm run build, npm test

Use a simple checklist at the top of the file:

 Working tree clean

 All checks passing

 Docs aligned with behavior

 Next prompt entry point identified

You will come back and tick these as you complete this prompt.

Step 1 – Inspect and describe the current state

Inspect current git status and branch situation:

Note the current branch name

Note all staged files

Note all modified but unstaged files

Note all untracked files

In docs/INTERNAL_AUDIT_PROMPT_041.md, add a section:

## Current state snapshot

Summarize:

Which prompts have clearly been applied (from commit messages and file changes)

Any obvious mismatches between branches and prompts (for example, multiple prompts worth of work on one branch)

A bullet list of untracked directories or files that look like real features vs scratch or temporary artifacts

Do not modify any files yet except the audit doc.

Self evaluation entry:

Add a short bullet list under ### Step 1 – Self evaluation stating:

Whether you successfully listed all relevant file categories

Any uncertainties you see and plan to revisit in later steps

Step 2 – Create a safe consolidation branch

Create a new branch from the current state for this consolidation work. Use a name like:

prompt-041-consolidation

Record this in the audit doc under a new section:

## Branching for consolidation

Include:

The source branch you started from

The name of the new consolidation branch

Confirm that you are now operating on prompt-041-consolidation for the rest of this prompt.

Self evaluation entry:

Under ### Step 2 – Self evaluation, note:

The branch name

Whether the transition was clean (no conflicts or errors)

Step 3 – Classify changes and artifacts

You are now going to classify everything that git status shows so we can decide what to keep, commit, or clean.

Group changes (staged, unstaged, untracked) into categories:

Core Workshop code and UI (stations, pages, stores, runtime, AI)

Documentation (including docs/user, architecture docs, specs)

Tooling and CI (tests, config, workflows, eslint, vitest, etc)

Temporary or scratch artifacts (notes, unused scripts, leftovers)

In the audit doc, add a section:

## Change classification

For each category, list the key paths and files, with one line describing what they appear to represent.

Do not commit or delete yet. This step is purely about understanding.

Self evaluation entry:

Under ### Step 3 – Self evaluation, state:

Any files you are uncertain about

Any suspicious patterns (for example duplicated docs, old variants of the same page)

Step 4 – Decide consolidation strategy for 025 to 040

You are not trying to perfectly reconstruct one commit per prompt at this point. Instead, define a pragmatic, explicit consolidation strategy.

In the audit doc, create:

## Consolidation strategy for prompts 025 to 040

Describe, in a few bullet lists:

Which logical groups of work you will treat as one consolidated commit or a small set of commits. For example:

Group A: Import/export and telemetry (around prompts 025 to 027)

Group B: Documentation and hosting (prompts 031 to 034)

Group C: Profiles and AI mentor foundation (prompts 035 to 040)

For each group, note:

Which major files belong to it

Whether those files are already committed or still dirty

This is a planning section. No changes yet.

Self evaluation entry:

Under ### Step 4 – Self evaluation, note:

Whether any work seems half applied

Any open questions that might affect how you structure commits

Step 5 – Bring the working tree to a coherent, passing state

Now you move from analysis to action. The target is:

All intended features from 025 to 040 are present

No partial or obviously broken leftover code

All four checks pass

Follow this order:

If there are obvious temporary or scratch files that should not be versioned:

Either remove them, or

Move them under a clearly named scratch directory that is git ignored

Document this in a short bullet list under ## Cleanup actions in the audit doc

For real feature or doc changes that are not yet tracked but clearly part of the Workshop:

Stage them into the appropriate logical group as defined in Step 4

Do not commit yet, but be explicit about what group each staged set belongs to

Once the tree reflects exactly what you believe the Workshop should be after prompt 040:

Run, in this order:

npm run check:assets

npm run lint

npm run build

npm test

Write the results of each command into a new section in the audit doc:

## Verification commands

For each command, record:

Command name

Pass or fail

If fail, a brief summary of the error and how you resolved it

If any command fails, stop, fix the problem, and repeat until all four pass. Record the iterations briefly in the audit doc.

Self evaluation entry:

Under ### Step 5 – Self evaluation, state:

Whether all commands passed on the final run

Any fixes you had to apply that diverged from previous prompts’ wording

Step 6 – Commit consolidation work with clear messages

Once the tree is in a coherent state and all checks pass, you will create one or a small number of consolidation commits.

Using the plan from Step 4, create one or more commits on prompt-041-consolidation. For example:

chore: consolidate prompts 025 to 029

chore: consolidate prompts 031 to 034

chore: consolidate prompts 035 to 040

If that seems too fine grained based on how changes are interleaved, it is acceptable to produce a single commit:

chore: consolidate prompts 025 to 040

Be explicit in the audit doc about which path you chose and why.

After commits are created, verify:

git status shows a clean working tree

All tests and checks still pass (you do not need to rerun if no files changed, but if in doubt, run at least npm test and npm run build once more)

Record in the audit doc under:

## Consolidation commits

For each commit, note:

Commit hash

Commit message

Short summary of what it represents

Self evaluation entry:

Under ### Step 6 – Self evaluation, confirm:

That the working tree is clean

That the commits match the consolidation strategy from Step 4

Step 7 – Check documentation alignment

Now audit your own docs against behavior.

Review these key docs in the context of what actually exists in the code and UI:

docs/user/WORKSHOP_OVERVIEW.md

docs/user/GETTING_STARTED_KIDS.md

docs/user/GETTING_STARTED_ADULTS.md

docs/user/EDUCATOR_GUIDE.md

docs/user/SAFETY_AND_PRIVACY_SUMMARY.md

docs/ARCHITECTURE_OVERVIEW.md

docs/STATION_LIFECYCLE.md

docs/EXTENSION_POINTS.md

docs/AI_BEHAVIOR_AND_SAFETY.md

docs/MULTI_PROFILE_SPEC.md

docs/DEPLOYMENT_GUIDE.md

docs/HOSTING_OPTIONS.md

In the audit doc, add:

## Documentation alignment check

For each doc, in one or two lines, state whether:

It accurately describes current behavior

It references any feature that does not exist yet

It omits any major feature that now exists

If you find clear, low risk inconsistencies, you may fix them in this prompt and include those changes in a small follow up commit on the same branch:

chore: sync docs with consolidated behavior

Record that in the audit doc.

Self evaluation entry:

Under ### Step 7 – Self evaluation, explicitly call out:

Any known mismatches you chose to leave for later prompts

Any assumptions you had to make

Step 8 – Confirm readiness for future prompts

Finally, define the state you are handing off to the next prompt.

In the audit doc, add:

## Ready for next prompt

Summarize:

Current branch and its relationship to main or the primary integration branch

That the working tree is clean

That all checks pass

Any known issues or TODOs that are intentionally left for Prompt 042 or later

At the top checklist in INTERNAL_AUDIT_PROMPT_041.md, update the boxes so they reflect reality, for example:

 Working tree clean

 All checks passing

 Docs aligned with behavior

 Next prompt entry point identified

Self evaluation entry:

Under ### Step 8 – Self evaluation, write a short paragraph evaluating how well you believe this prompt met its goal, including:

Any remaining uncertainty

Anything you would recommend that the human maintainer review manually

Acceptance criteria for Prompt 041

Prompt 041 counts as complete and successful when all of the following are true:

docs/INTERNAL_AUDIT_PROMPT_041.md exists and clearly documents:

The starting state

The consolidation strategy

The verification commands and their results

The final clean state

Any intentional open issues

A branch such as prompt-041-consolidation exists with one or more commits that consolidate the work from prompts 025 to 040 into a coherent, passing state.

git status on that branch shows a clean working tree, with no untracked or modified files that are part of the Workshop product.

The following commands succeed on the consolidated branch:

npm run check:assets

npm run lint

npm run build

npm test

The key docs listed in Step 7 do not contain obvious lies about current behavior. Minor omissions are acceptable, but direct contradictions must be fixed or called out in the audit doc.

The audit doc clearly states a recommended next prompt number and suggested focus area, so the next step is obvious.