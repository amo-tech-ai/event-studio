#!/bin/bash
# Load environment variables and start Claude Code
# This ensures MCP servers can access tokens from .env

set -a  # Automatically export all variables
source .env
set +a

# Start Claude Code with all env vars available
claude "$@"
