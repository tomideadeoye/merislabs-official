# server.py
import asyncio
import json

import websockets
from mcp.server.fastmcp import FastMCP

# Create an MCP server
mcp = FastMCP("Demo")


# Add an addition tool
@mcp.tool()
def add(a: int, b: int) -> int:
    """Add two numbers"""
    return a + b


# Add a dynamic greeting resource
@mcp.resource("greeting://{name}")
def get_greeting(name: str) -> str:
    """Get a personalized greeting"""
    return f"Hello, {name}!"


# WebSocket server configuration
WEBSOCKET_PORT = 55155
connected_clients = set()


async def handle_client(websocket, path):
    """Handles communication with a connected WebSocket client."""
    connected_clients.add(websocket)
    try:
        async for message in websocket:
            data = json.loads(message)
            action = data.get("action")

            if action == "initialize-chats":
                print(f"Initializing chats with data: {data}")
                # Handle chat initialization logic here

            elif action == "update-saved-websites":
                print(f"Updating saved websites with data: {data}")
                # Handle website saving logic here

            elif action == "browser-connection-status":
                print(f"Browser connection status: {data}")
                # Handle browser connection status updates

            else:
                print(f"Unknown action received: {action}")

    except websockets.exceptions.ConnectionClosed:
        print("Client disconnected")
    finally:
        connected_clients.remove(websocket)


async def ping_clients():
    """Periodically sends ping messages to connected clients."""
    while True:
        await asyncio.sleep(30)
        for client in connected_clients:
            try:
                await client.send(json.dumps({"action": "ping"}))
            except websockets.exceptions.ConnectionClosed:
                connected_clients.remove(client)


async def main():
    """Starts the WebSocket server."""
    server = await websockets.serve(handle_client, "0.0.0.0", WEBSOCKET_PORT)
    print(f"WebSocket server started on port {WEBSOCKET_PORT}")

    # Run the server and the ping task concurrently
    await asyncio.gather(server.wait_closed(), ping_clients())


if __name__ == "__main__":
    asyncio.run(main())
