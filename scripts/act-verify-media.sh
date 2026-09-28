#!/usr/bin/env bash
set -euo pipefail
repo="$(git rev-parse --show-toplevel)"
image="${1:-senshac-media-runner:candidate}"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
sed -E "s#(image: ).*@sha256:[a-f0-9]+#\\1$image#" \
  "$repo/.github/workflows/process-media.yml" > "$tmp/process-media.yml"
cat > "$tmp/event.json" <<'JSON'
{"inputs":{"key":"images/act-smoke.png","dry_run":"true"}}
JSON
runtime_dir="${XDG_RUNTIME_DIR:-/run/user/$(id -u)}"
act workflow_dispatch -W "$tmp/process-media.yml" -j process -e "$tmp/event.json" --pull=false --container-daemon-socket "unix://${runtime_dir}/podman/podman.sock" --secret GITHUB_TOKEN=local-dummy
