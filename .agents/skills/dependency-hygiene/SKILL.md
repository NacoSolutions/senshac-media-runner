---
name: dependency-hygiene
description: Prevent unnecessary dependency and lockfile churn in the media runner.
---

# Dependency hygiene

- Inspect `package.json` and `bun.lock` before considering dependency edits.
- Keep documentation/configuration work focused on guidance files and configuration.
- When a dependency is required, use the repository's Bun tooling, review the lockfile diff, and document the version choice.
- Run the repository's typecheck after every dependency change.

## Acceptance checks

- Skill/configuration work leaves dependency manifests and lockfiles unchanged.
- Every required dependency has a reproducible lockfile entry and a focused reason.
- `bun run typecheck` exits zero.
