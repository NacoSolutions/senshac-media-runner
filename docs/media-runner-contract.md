# Media-runner ownership and command contract

This repository owns a rootless, batch media transformer. The runner is a
boundary between a producer that stages one raw object and a consumer that
publishes verified results. It is not an application or a content system.

## Ownership boundary

| Concern | Owner |
| --- | --- |
| Stage raw input, choose an operation, and provide mounts | Producer (for example, the media workflow) |
| Decode, transform, and validate media | This media runner |
| R2 download/upload and the R2 bucket names | Transfer helpers and their invoking workflow |
| Read generated files and publish URLs | Consumer (site, API, or publishing workflow) |
| Astro components, Tina/content records, and layout loading policy | Owning web/content repository |
| Instagram scheduling and the canonical Senshac tracker | Owning scheduling/tracker repository |

The runner does not inspect or update content records, schedule posts, call
Astro, or decide canonical media metadata.

## Mount and process contract

A producer must invoke the image with a rootless container runtime and explicit
mounts. The input mount is read-only; only the output mount is writable:

```sh
podman run --rm --userns=keep-id \
  -v "$PWD/input:/work/input:ro" \
  -v "$PWD/output:/work/output" \
  ghcr.io/nacosolutions/senshac-media-processor@sha256:<verified-digest> \
  object /work/input/source.jpg /work/output images/example.jpg
```

The producer owns directory creation and input naming. The runner must not
require a host checkout, write outside `/work/output` (except temporary files
inside the image), or require root privileges. A producer must treat a non-zero
exit status as a failed batch and must not publish a partial output tree.

The executable is `scripts/media-runner` in the image. Its machine-readable
contract can be inspected with `media-runner contract`; the contract version is
`1`.

| Operation | Arguments | Output |
| --- | --- | --- |
| `images` | `[input-root] [output-root]` | `images/<id>/<width>.avif` and `.webp` for widths 320, 480, 640, 768, 1024, 1280, 1920 |
| `object` | `<input-file> [output-root] [media-key]` | Routes one supported image, MP4/MOV video, or WOFF2 font using the same stable paths |
| `video` | `<input.mp4> [output-root] [media-id]` | HLS playlist and segments under `videos/<media-id>/` |
| `font` | `<input.ttf|otf> <output.woff2>` | The explicitly requested WOFF2 file |
| `verify` | `[output-root]` | Non-zero unless output is non-empty, non-zero-sized, and a recognized image, HLS, or font tree |
| `download` | `<bucket> <key> [output-file]` | One R2 object in the input area; requires transfer credentials |
| `upload` | `[output-root] [bucket]` | Uploads the output tree; requires transfer credentials |
| `verify-r2` | `[output-root] [bucket]` | Compares output with R2; requires transfer credentials |

Image IDs derive from the producer's relative path or supplied R2 key, with
leading slashes and `images/` or `videos/` stripped. The same input key and
runner image therefore produce the same output paths and format set. Consumers
must use the output tree as the source of truth rather than infer filenames.

## Credentials and integration points

Local processing (`images`, `object`, `video`, `font`, and `verify`) receives no
cloud credentials. R2 credentials are available only to the explicit transfer
commands through `CLOUDFLARE_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, and
`R2_SECRET_ACCESS_KEY` (with the S3-compatible aliases accepted by the helper).
They must not be mounted beside media, written to output, logged, or baked into
an image layer.

The producer flow is: download or stage one object, invoke `object` (or a
specialized operation), invoke `verify`, then hand the verified output tree to
`upload`. The consumer flow begins after upload and owns URL construction,
content association, layout decisions, and publication. The workflow in
`.github/workflows/process-media.yml` is the reference producer/transfer
integration; published consumers pin a verified image digest, never `latest`.
