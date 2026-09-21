---
name: dependency-hygiene
description: Prevent unnecessary dependency and lockfile churn in the media runner.
---

# Dependency hygiene

- Inspect `package.json` and `bun.lock` before considering dependency edits.
- Keep documentation/config-only work free of package and lockfile changes.
- If a dependency is explicitly required, use the repository's Bun tooling, review the lockfile diff, and explain the version choice.
- Run the repository's typecheck after any dependency change.

## Acceptance checks

- Skill/configuration work changes no dependency manifest or lockfile.
- Any required dependency has a reproducible lockfile entry and a focused reason.
- `bun run typecheck` exits zero.
