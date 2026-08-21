#!/usr/bin/env bash
set -euo pipefail

# This repository pins its dependencies with bun (bun.lock), so make sure bun
# is available before installing. The official installer places bun in
# ~/.bun/bin; re-running it is safe/idempotent.
if [ ! -x "$HOME/.bun/bin/bun" ] && ! command -v bun >/dev/null 2>&1; then
  curl -fsSL https://bun.sh/install | bash
fi
export PATH="$HOME/.bun/bin:$PATH"

bun --version
bun install --frozen-lockfile
