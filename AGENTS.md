# Senshac Media Runner

This focused repository owns the rootless media-processing image, its command
contract, R2 transfer helpers, and publication workflow. It does not own Astro
components, Tina content, layout loading policy, Instagram scheduling, or the
canonical Senshac tracker.

Build and test image changes locally before publishing. Consumers must pin a
verified digest; never change a checked-in consumer to `latest`.
