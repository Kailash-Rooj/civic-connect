#!/usr/bin/env bash
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT/server" && npm install
cd "$ROOT/../client" && npm install
cd "$ROOT/server"
[ -f .env ] || cp .env.example .env
printf '\nDependencies installed. Fill server/.env with SESSION_SECRET and Cloudinary credentials.\n'
