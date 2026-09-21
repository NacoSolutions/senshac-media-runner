---
name: bounded-warren-task
description: Complete a small Warren task with explicit scope, repository-aware checks, and a clean handoff.
---

# Bounded Warren task

Use this skill for focused changes that can be completed and verified in one
working session.

## Work in bounds

- State the requested outcome and the files that may change before editing.
- Read the repository guidance and the relevant contract first.
- Change only the requested files and the smallest necessary sections.
- Treat generated files, tracker data, and unrelated working-tree changes as
  out of scope unless the request explicitly includes them.
- Prefer a direct, reviewable implementation over speculative refactoring.

## Verify positively

- Use the repository's documented validation command, or discover the narrowest
  project-native test/typecheck command when none is documented.
- Add one focused check for configuration or documentation changes when that is
  the requested surface.
- Resolve every failure before handoff; do not dismiss warnings or leave a red
  gate.
- Inspect the diff and confirm that only in-scope files changed.

## Finish cleanly

- Preserve tracker state unless the task explicitly asks for tracker updates.
- Record durable repository knowledge only when the work reveals a reusable
  convention or decision.
- Commit the completed change. Report the validation commands and commit, and
  call out any remaining limitation plainly.
