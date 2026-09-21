---
name: security-review
description: Review media-runner documentation and configuration for safe boundaries.
---

# Security review

- Read `docs/media-runner-contract.md` before changing runner guidance.
- Keep credentials limited to explicit transfer commands; never document secrets in media mounts, output trees, logs, or image layers.
- Check that examples use explicit mounts, rootless execution, and a verified digest rather than `latest`.
- Inspect the final diff for newly exposed tokens, unsafe shell snippets, or ownership-boundary drift.

## Acceptance checks

- No secret values or credential files are added.
- Consumer examples retain digest pinning and rootless, read-only input guidance.
- `git diff --check` and the focused documentation/config validation pass.
