#!/usr/bin/env bash
# Haggle Protocol - OpenClaw Skill Setup
# Accessed env vars: HAGGLE_PRIVATE_KEY
# Accessed endpoints: https://registry.npmjs.org (npm install)
set -euo pipefail

echo "Installing Haggle Protocol MCP Server..."
npm install -g @haggle-protocol/mcp

if [ -z "${HAGGLE_PRIVATE_KEY:-}" ]; then
  echo ""
  echo "WARNING: HAGGLE_PRIVATE_KEY is not set."
  echo "Set it in your environment to enable transaction signing:"
  echo "  export HAGGLE_PRIVATE_KEY=\"0x...\""
  echo ""
  echo "Without it, you can only read negotiation state (read-only mode)."
else
  echo "HAGGLE_PRIVATE_KEY is configured."
fi

echo ""
echo "Haggle Protocol skill is ready!"
echo "Run: npx @haggle-protocol/mcp"
