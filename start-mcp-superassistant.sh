#!/bin/bash
# MCP SuperAssistant Daemon - run via launchd or manually
cd /Users/mac/Documents/GitHub/merislabs-official
exec npx -y @srbhptl39/mcp-superassistant-proxy@latest "$@"