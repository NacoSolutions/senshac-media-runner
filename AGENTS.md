# Senshac Media Runner

This focused repository owns the rootless media-processing image, its command
contract, R2 transfer helpers, and publication workflow. It does not own Astro
components, Tina content, layout loading policy, Instagram scheduling, or the
canonical Senshac tracker.

Build and test image changes locally before publishing. The ownership and CLI
contract is documented in `docs/media-runner-contract.md`. Consumers must pin a
verified digest; never change a checked-in consumer to `latest`.

## Bounded Warren Tasks

Use [`.agents/skills/bounded-warren-task/SKILL.md`](.agents/skills/bounded-warren-task/SKILL.md) for focused autonomous changes. Apply positive phrasing, specific instructions, defense in depth, gentle coding, direct execution, and token economy. Keep work scoped to the media-processing, R2, image/video pipeline; inspect narrowly, execute directly, preserve adjacent behavior, and run a focused gate.

## Seeds and Mulch

- Start work with `sd prime` for tracker context, then use `sd ready` to find unblocked work.
- Capture durable project knowledge with `ml record <domain> --type <type> "..."`; run `ml prime` before and during work when existing expertise may apply.
- Keep `.seeds/`, `.mulch/`, and `.gitattributes` changes in the same commit as related setup or workflow changes.
- On onboarding, run `sd prime`, `sd ready`, and `ml prime --all`; create a focused local Seed before implementation.
- Before handoff, run `sd doctor` and `ml validate`; record durable media-runner conventions with `ml record media-runner`.
