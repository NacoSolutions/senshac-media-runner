---
name: media-runner-operations
description: Validate Senshac media processing, R2 transfer, and immutable image publication boundaries.
---

# Media runner operations

Read `docs/media-runner-contract.md` and `docs/media-runner-image.md` before changing media processing, transfer, or publication guidance.

## Processing and transfer

- Use the rootless container contract with an explicit read-only input mount and a separate writable output mount.
- Keep local transforms credential-free. Pass R2 credentials only to the explicit `download`, `upload`, or `verify-r2` commands; never mount them with media or bake them into image layers.
- Verify a complete output tree before upload; treat non-zero exit and partial output as failure and do not publish it.
- Keep producer staging, media transformation, and consumer URL/content publication responsibilities separate.

## Build and publish

- Run `bun test && bun run typecheck` for contract or transfer changes. Use `devenv shell -- scripts/act-verify-media.sh <candidate-image>` to test the real workflow against a local candidate when workflow integration changes.
- Build via the repository's pinned devenv/Nix `dockerTools` path and inspect the image contract before publication.
- Publish and smoke-test the commit-addressed image, record its verified digest, and keep consumers pinned to that digest. Never update a consumer to `latest`.

## Acceptance checks

- The media contract tests and typecheck pass.
- Input/output mounts, rootless execution, transfer-only credentials, and consumer digest pinning remain intact.
- No secrets, generated runtime state, or unrelated content/application behavior enters the change.
