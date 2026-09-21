---
name: security-review
description: Review media-runner documentation and configuration for safe boundaries.
---

# Security review

- Read `docs/media-runner-contract.md` before changing runner guidance.
- Keep credentials limited to explicit transfer commands and describe their safe handling in media mounts, output trees, logs, and image layers.
- Use explicit mounts, rootless execution, and a verified digest rather than a floating image tag in examples.
- Inspect the final diff for exposed tokens, unsafe shell snippets, and ownership-boundary drift.

## Acceptance checks

- The change contains no secret values or credential files.
- Consumer examples retain digest pinning and rootless, read-only input guidance.
- `git diff --check` and the focused documentation/configuration validation pass.
