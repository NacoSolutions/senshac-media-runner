---
name: git-workflow
description: Keep focused media-runner changes reviewable and committed.
---

# Git workflow

- Start with `git status --short` and record unrelated workspace files.
- Limit edits to the requested documentation, skill, and configuration files.
- Review `git diff --check` and `git diff --stat` before staging.
- Stage named files only, then commit with a concise imperative message.
- Confirm the commit with `git status --short` and `git log -1 --oneline`; Warren handles publication.

## Acceptance checks

- `.seeds/`, `.mulch/`, production code, and unrelated files remain unchanged.
- The diff contains no whitespace errors and the intended files are in one commit.
- The handoff includes the commit ID and validation results.
