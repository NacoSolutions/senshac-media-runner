# Media Runner Image

The image transforms explicit mounted inputs into explicit outputs:

```bash
podman run --rm --userns=keep-id \
  -v "$PWD/input:/work/input:ro" \
  -v "$PWD/output:/work/output" \
  senshac-media-runner:candidate images

Published images use `ghcr.io/nacosolutions/senshac-media-processor`. The
package name intentionally differs from the repository name because the legacy
web repository owns the historical `senshac-media-runner` package.
```

Use `scripts/build-media-runner` for local builds. R2 credentials are passed
only to `download`, `upload`, or `verify-r2` at runtime. They are never copied
into image layers.

Publication pushes `sha-<full-commit>`, pulls and smoke-tests that registry
artifact, then advances `latest`. Consumers pin the resulting digest and may
override it with `SENSHAC_MEDIA_RUNNER_IMAGE` during candidate acceptance.
