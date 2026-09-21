---
name: git-workflow
description: Keep focused media-runner changes reviewable and committed.
---

# Git workflow

- Start with `git status --short` and note unrelated workspace files.
- Limit edits to the requested documentation, skill, and config files.
- Review `git diff --check` and `git diff --stat` before staging.
- Stage named files only, then commit with a concise imperative message.
- Confirm the commit with `git status --short` and `git log -1 --oneline`; do not push from the agent.

## Acceptance checks

- `.seeds/`, `.mulch/`, production code, and unrelated files are unchanged.
- The diff contains no whitespace errors and the intended files are in one commit.
- The handoff includes the commit ID and validation results.
