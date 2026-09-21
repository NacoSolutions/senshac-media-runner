---
name: senshac-agent-principles
description: Portable operating principles for focused, safe Senshac repository work.
---

# Senshac agent principles

- **Direct execution:** inspect the relevant contract, make the smallest useful edit, and run the narrowest repository-native check; avoid speculative abstractions.
- **Instruction specificity:** turn the request into explicit files, commands, and acceptance checks before editing; distinguish repository rules from task scope.
- **Positive phrasing:** state what to do and what success looks like. Use precise, affirmative acceptance criteria rather than vague prohibitions.
- **Defense in depth:** validate at more than one boundary: inspect the diff, check configuration/docs, run tests or typechecking, and verify the final commit.
- **Gentle coding:** preserve existing behavior, tracker state, and ownership boundaries; prefer additive documentation and reversible, reviewable changes.
- **Token economy:** read only relevant files, reuse existing commands, keep skills concise, and avoid duplicating guidance already present in `AGENTS.md` or the contract.

## Acceptance checks

- The requested files are the only tracked files changed.
- Documentation/config validation and the repository quality gate exit zero.
- `git diff --check` is clean and the final change is committed.
