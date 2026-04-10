#!/bin/bash
set -e

echo "=== Post-merge setup ==="

echo "Installing dependencies..."
npm install --legacy-peer-deps < /dev/null

echo "Running database migrations..."
npx drizzle-kit push < /dev/null || echo "Migration push skipped or failed (non-blocking)"

echo "=== Post-merge setup complete ==="
