import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { thought, nextThoughtNeeded = true, thoughtNumber = 1, totalThoughts = 5 } = req.body;
    // Try to use a global MCP client if available (for dev environments)
    if (global.mcp_sequentialThinking) {
      const result = await global.mcp_sequentialThinking({
        thought,
        nextThoughtNeeded,
        thoughtNumber,
        totalThoughts,
      });
      return res.status(200).json(result);
    }
    // If you have a Node.js MCP client, require and use it here
    // Otherwise, return an error
    return res.status(500).json({ error: 'Sequential Thinking MCP tool is not available on the server.' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Unknown error' });
  }
}
