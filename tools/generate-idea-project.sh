#!/usr/bin/env bash

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SOURCE_DIR="$PROJECT_DIR/tools/idea/"
DESTINATION_DIR="$PROJECT_DIR/.idea/"

# Copy the contents of `<project>/tools/idea/` to `<project>/.idea/`.
mkdir -p "$DESTINATION_DIR"
cp -R "$SOURCE_DIR/." "$DESTINATION_DIR/"
