# Senshac Media Runner

This focused repository owns the rootless media-processing image, its command
contract, R2 transfer helpers, and publication workflow. It does not own Astro
components, Tina content, layout loading policy, Instagram scheduling, or the
canonical Senshac tracker.

## Agent guidance

Use [Bounded Warren Task](.agents/skills/bounded-warren-task/SKILL.md) for focused
changes to this media-processing, R2, and image/video pipeline repository. State
the desired outcome with positive, specific instructions; use defense in depth
and gentle coding to preserve adjacent behavior. Execute directly on the
smallest relevant surface, keep the task bounded, and practice token economy.

Build and test image changes locally before publishing. The ownership and CLI
contract is documented in `docs/media-runner-contract.md`. Consumers must pin a
verified digest; never change a checked-in consumer to `latest`.

## Seeds and Mulch

- Start work with `sd prime` for tracker context, then use `sd ready` to find unblocked work.
- Capture durable project knowledge with `ml record <domain> --type <type> "..."`; run `ml prime` before and during work when existing expertise may apply.
- Keep `.seeds/`, `.mulch/`, and `.gitattributes` changes in the same commit as related setup or workflow changes.
- On onboarding, run `sd prime`, `sd ready`, and `ml prime --all`; create a focused local Seed before implementation.
- Before handoff, run `sd doctor` and `ml validate`; record durable media-runner conventions with `ml record media-runner`.
