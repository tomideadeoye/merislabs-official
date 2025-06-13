"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@repo/ui";
import { Input } from "@repo/ui";
import { Textarea } from "@repo/ui";
import { Button } from "@repo/ui";
import { BLOCK_TYPES, BlockType, Block, CreateBlockPayload } from '@repo/shared';

const fetchBlocks = async (type?: BlockType): Promise<Block[]> => {
  const res = await fetch(`/api/orion/blocks/list${type ? `?type=${type}` : ""}`);
  const data = await res.json();
  return data.blocks || [];
};

const createBlock = async (payload: CreateBlockPayload): Promise<Block | null> => {
  const res = await fetch("/api/orion/blocks/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return data.block || null;
};

// Diagnostic console log for CardHeader type check
console.log('CardHeader type:', (CardHeader as any).$$typeof);
function AddBlockForm({ onBlockCreated }: { onBlockCreated: () => void }) {
  const [type, setType] = useState<BlockType>(BLOCK_TYPES[0]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await createBlock({
      type,
      title,
      content,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
    });
    setTitle("");
    setContent("");
    setTags("");
    setLoading(false);
    onBlockCreated();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-6">
      <div className="flex gap-2">
        <label className="text-sm text-gray-300">Type:</label>
        <select
          value={type}
          onChange={e => setType(e.target.value as BlockType)}
          className="bg-gray-800 border-gray-600 text-gray-200 rounded px-2 py-1"
        >
          {BLOCK_TYPES.map(bt => (
            <option key={bt} value={bt}>{bt.replace(/_/g, " ")}</option>
          ))}
        </select>
      </div>
      <Input
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <Textarea
        placeholder="Content"
        value={content}
        onChange={e => setContent(e.target.value)}
        required
      />
      <Input
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={e => setTags(e.target.value)}
      />
      <Button type="submit" disabled={loading} className="bg-blue-700 hover:bg-blue-800">
        {loading ? "Saving..." : "Add Block"}
      </Button>
    </form>
  );
}

function BlockList({ type }: { type: BlockType }) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBlocks = async () => {
    setLoading(true);
    setBlocks(await fetchBlocks(type));
    setLoading(false);
  };

  useEffect(() => {
    loadBlocks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  if (loading) return <div className="text-gray-400">Loading...</div>;
  if (!blocks.length) return <div className="text-gray-400">No blocks found.</div>;
  return (
    <div className="space-y-3">
      {blocks.map(block => (
        <Card key={block.id} className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-md text-blue-300">{block.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-400 mb-1">{block.type.replace(/_/g, " ")}</div>
            <div className="text-gray-200 whitespace-pre-line mb-2">{block.content}</div>
            {block.tags && block.tags.length > 0 && (
              <div className="text-xs text-gray-500">Tags: {block.tags.join(", ")}</div>
            )}
            <div className="text-xs text-gray-600 mt-2">Created: {new Date(block.createdAt).toLocaleString()}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function AdminBlocksPage() {
  const [activeTab, setActiveTab] = useState<BlockType>(BLOCK_TYPES[0]);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg text-purple-300">Blocks</CardTitle>
      </CardHeader>
      <CardContent>
        <AddBlockForm onBlockCreated={() => setRefreshKey(k => k + 1)} />
        <Tabs value={activeTab} onValueChange={v => setActiveTab(v as BlockType)} className="w-full">
          <TabsList className="mb-4">
            {BLOCK_TYPES.map(bt => (
              <TabsTrigger key={bt} value={bt}>{bt.replace(/_/g, " ")}</TabsTrigger>
            ))}
          </TabsList>
          {BLOCK_TYPES.map(bt => (
            <TabsContent key={bt} value={bt}>
              <BlockList key={refreshKey + bt} type={bt} />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
