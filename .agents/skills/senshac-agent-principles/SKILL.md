---
name: senshac-agent-principles
description: Portable operating principles for focused, safe Senshac repository work.
---

# Senshac agent principles

Apply these six principles to every repository task:

- **Direct execution:** Inspect the relevant contract, make the smallest useful edit, and run the narrowest repository-native check.
- **Instruction specificity:** Translate the request into explicit files, commands, and acceptance checks before editing; distinguish repository rules from task scope.
- **Positive phrasing:** State the desired action and its successful outcome with precise, affirmative acceptance criteria.
- **Defense in depth:** Validate each boundary by inspecting the diff, checking documentation or configuration, running tests or typechecking, and verifying the final commit.
- **Gentle coding:** Preserve existing behavior, tracker state, and ownership boundaries with additive, reversible, reviewable changes.
- **Token economy:** Read relevant files, reuse existing commands, keep skills concise, and reference guidance in `AGENTS.md` or the contract instead of duplicating it.

## Acceptance checks

- The requested guidance and configuration files are the only tracked files changed.
- The focused documentation/configuration check and repository quality gate exit zero.
- `git diff --check` is clean and the final change is committed.
