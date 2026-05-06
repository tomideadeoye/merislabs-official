#!/bin/bash
# MCP SuperAssistant - Persists after terminal closes
# Double-click to run, stays running in background

cd /Users/mac/Documents/GitHub/merislabs-official

# Kill existing
for port in 3006 3007; do
  lsof -ti :$port | xargs kill 2>/dev/null || true
done
sleep 1

# Desktop Commander
nohup npx -y @srbhptl39/mcp-superassistant-proxy@latest \
  --config ./config.json --outputTransport sse --port 3006 \
  > /tmp/mcp-dc.log 2>&1 &

echo "Started Desktop Commander on :3006..."

sleep 3

# Orion
nohup npx -y @srbhptl39/mcp-superassistant-proxy@latest \
  --streamableHttp http://localhost:6000/mcp --outputTransport sse --port 3007 \
  > /tmp/mcp-orion.log 2>&1 &

echo "Started Orion on :3007..."
echo ""
echo "✅ MCP SuperAssistant ready!"
echo "   Desktop Commander: http://localhost:3006/sse"
echo "   Orion:       http://localhost:3007/sse"
echo ""
echo "Add these URLs in the MCP SuperAssistant sidebar."

# Keep terminal open briefly
read -p "Press Enter to close..."