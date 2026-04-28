#!/bin/sh
set -e

sed -i "s|__API_URL__|${VITE_API_URL:-}|g" /app/public/env-config.js

exec node dist/main.js
