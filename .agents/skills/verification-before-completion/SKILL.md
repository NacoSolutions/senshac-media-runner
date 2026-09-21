---
name: verification-before-completion
description: Apply the media-runner validation and handoff checks before declaring success.
---

# Verification before completion

- Run one bounded check for the requested documentation/configuration surface, including required skill paths and `.warren/config.yaml` values.
- Run the repository gate: `bun test && bun run typecheck`.
- Inspect `git diff --check`, `git diff --stat`, and the full diff for scope and wording.
- Run `sd doctor` and `ml validate`; preserve `.seeds/` and `.mulch/` as repository state.
- Repeat the quality gate after the final edits, then verify the commit and working tree.

## Acceptance checks

- Every validation command exits zero.
- The diff is limited to documentation, skills, and configuration.
- The final report names the checks and commit; Warren handles publication.
