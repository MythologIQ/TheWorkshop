# The Workshop Execution Pipeline

Version: v0.1  
Owner: Engineering and DevOps

This document describes how changes move from concept to code to release for The Workshop. It is designed to support both human contributors and AI assisted tools.

## 1. Branching Model

- `main`: Always in a releasable state. Only accepts changes through pull requests.  
- `develop` (optional): Integration branch for features before merging to main.  
- `feature/*`: One branch per feature or station improvement, named with the feature id when possible, for example `feature/WS-0002-build-station`.

All work must begin from up to date `main` or `develop` if used.

## 2. Commit Policy

Commits should be:

- Small and focused.  
- Written in present tense and clear language.  
- Linked to a feature id, station, or document where relevant.

Examples:

- "Add basic Idea Station form and validation, FEATURE-WS-0001."  
- "Wire WebLLM adapter to Idea Station AI call."  
- "Update Creativity Boundary spec for new reflection fields."

AI assisted commits should be reviewed by a human before merging when possible.

## 3. Pull Request Workflow

1. Create a feature branch from `main`.  
2. Implement changes and ensure tests pass locally.  
3. Update any relevant docs, such as station specs, feature files, and changelog.  
4. Open a pull request with:  
   - Summary of changes.  
   - List of affected files and modules.  
   - Reference to feature ids and spec documents.  
5. Request review from at least one maintainer.  
6. After review and passing checks, squash merge into main.

PR descriptions should be written clearly enough that future maintainers can understand the intent without reading the entire diff.

## 4. Testing Expectations

Minimum testing expectations per change:

- Unit tests for new logic such as adapters, validators, and reducers.  
- At least one integration test for new station routes or flows.  
- Manual smoke test in a browser for visual and interaction changes.

Critical components, such as AI adapters and storage layers, should have additional tests that:

- Verify input length constraints.  
- Verify structured output parsing.  
- Verify graceful handling of timeouts or model failures.

## 5. Versioning

The Workshop uses semantic versioning:

- MAJOR: Breaking changes or fundamental architectural shifts.  
- MINOR: New stations, significant features, or visible behavior changes.  
- PATCH: Bug fixes, minor UI updates, and documentation only changes.

Examples:

- v1.0.0: First public release of the complete station set.  
- v1.1.0: New station or additional mode added.  
- v1.0.1: Fix for a prompt regression affecting safety handling.

## 6. Automation And AI Assistance

Automation tools can be used to generate:

- Boilerplate code for station views and adapters.  
- Initial versions of docs and specs.  
- Refactor proposals and unit tests.

However:

- All generated content must respect the Safety Contract and Creativity Boundary Specification.  
- Generated files must be checked into version control and treated like any other code.  
- Human review remains responsible for safety, pedagogy alignment, and architectural fit.

## 7. Documentation Discipline

For every meaningful feature or architectural change:

- Update or create a feature document under `docs/features`.  
- Add an entry to `roadmap/CHANGELOG.md` with date and summary.  
- Update any impacted station docs or specs.  
- If boundaries or safety behavior change, update the relevant specs accordingly.

The Workshop values traceability. The repository should tell the story of why changes were made, not just what changed.

## 8. Environments

For v1 the expected environments are:

- Local development: Ran from a dev server with hot reload.  
- Production: Static build served from a simple hosting provider or CDN.

There is no backend for core functionality in v1. Model files and assets are served like other static assets, with appropriate caching headers.

## 9. Release Process

1. Ensure main is green in continuous integration.  
2. Bump version number according to changes.  
3. Generate production build.  
4. Smoke test the build on at least one low and one mid range device.  
5. Tag the release in version control.  
6. Deploy artifacts to the production hosting environment.  
7. Update release notes and the roadmap with summary and any known issues.

## 10. Incident And Regression Handling

If a critical issue is discovered, especially one that affects safety or pedagogy:

- Create a dedicated issue describing the impact and conditions.  
- If necessary, roll back to the previous stable release.  
- Open a hotfix branch from the last stable tag.  
- Fix and test locally, then merge and tag a patch release.  
- Document the incident and resolution in the ops folder for future reference.

The goal is to keep The Workshop reliable and trustworthy, especially because it serves children.

## 11. Code Review Guidance

Reviewers should consider:

- Does the change respect the Creativity Boundary Specification and Safety Contract.  
- Are station responsibilities still narrow and clear.  
- Are docs updated and accurate.  
- Are error cases handled clearly and kindly, especially in user facing messages.  
- Is the code reasonably simple and well factored.

Approval means "I would be comfortable maintaining this code later."

This pipeline exists to keep momentum high without sacrificing quality, safety, or clarity.
