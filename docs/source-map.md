# Media Runner Extraction Source Map

Seed: `senshac-10fe`

Initial extraction from `NacoSolutions/senshac`:

| Focused file | Original responsibility |
| --- | --- |
| `scripts/media/process-images.ts` | Responsive AVIF/WebP generation |
| `scripts/media/process-video.sh` | Adaptive HLS encoding |
| `scripts/media/process-font.ts` | WOFF2 language subsetting |
| `scripts/media/process-object.ts` | Extension-based object routing |
| `scripts/media/{download,upload,verify}-r2.ts` | Explicit R2 transfer and verification |
| `scripts/build-media-runner` | Reproducible Flox-to-OCI build |
| `.github/workflows/publish-media-runner.yml` | Immutable GHCR publication |

Astro components, Tina content, layout loading behavior, source-media staging,
Instagram scheduling, and canonical Seeds remain in `senshac-web`.
