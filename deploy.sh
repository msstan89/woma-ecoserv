#!/bin/bash
set -e
export PATH="$HOME/.local/node/bin:$PATH"
cd "$(dirname "$0")"

echo "→ Deploy Woma Ecoserv pe Surge.sh..."
if ! command -v surge &>/dev/null; then
  npx surge --version >/dev/null
  SURGE="npx surge"
else
  SURGE="surge"
fi

$SURGE . woma-ecoserv.surge.sh
echo "✓ Site live: https://woma-ecoserv.surge.sh"