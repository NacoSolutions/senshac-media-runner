# Senshac Media Runner

This focused repository owns the rootless media-processing image, its command
contract, R2 transfer helpers, and publication workflow. It does not own Astro
components, Tina content, layout loading policy, Instagram scheduling, or the
canonical Senshac tracker.

Build and test image changes locally before publishing. The ownership and CLI
contract is documented in `docs/media-runner-contract.md`. Consumers must pin a
verified digest; never change a checked-in consumer to `latest`.

## Bounded work

- Keep each change focused on the requested media-runner contract, image, transfer helper, or publication workflow.
- Read `docs/media-runner-contract.md` before changing behavior, and preserve the ownership boundary described there.
- Do not change Astro/content, scheduling, or canonical tracker concerns in this repository.
- Preserve tracker state and `.seeds/issues.jsonl` unless the task explicitly requests tracker work.
- Use the positive bounded-task workflow in `.agents/skills/bounded-warren-task/SKILL.md`: limit the file set, validate the requested surface, inspect the diff, and commit the result.

## Seeds and Mulch

- Start work with `sd prime` for tracker context, then use `sd ready` for unblocked work; do not mutate tracker state for documentation-only work unless requested.
- Capture durable project knowledge with `ml record <domain> --type <type> "..."`; run `ml prime` before and during work when existing expertise may apply.
- Keep `.seeds/`, `.mulch/`, and `.gitattributes` changes in the same commit as related setup or workflow changes.
- On onboarding, run `sd prime`, `sd ready`, and `ml prime --all`; create a focused local Seed before implementation when tracker changes are in scope.
- Before handoff, run `sd doctor` and `ml validate`; record durable media-runner conventions with `ml record media-runner` when new reusable knowledge was discovered.

## Validation and publication

- Run the focused configuration or documentation validation for guidance changes.
- Run `bun test && bun run typecheck` before handoff; build and test image changes locally before publishing.
- Consumers must pin a verified image digest. Never use `latest` in checked-in workflow or consumer configuration.
