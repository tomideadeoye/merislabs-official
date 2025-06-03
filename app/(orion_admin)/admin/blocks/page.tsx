"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AdminBlocksPage() {
  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg text-purple-300">Blocks</CardTitle>
      </CardHeader>
      <CardContent className="text-gray-400">
        <p>Manage your reusable content blocks here (value props, stories, tailored snippets, etc.).</p>
        <p className="mt-2 text-xs text-gray-500">(Feature coming soon)</p>
      </CardContent>
    </Card>
  );
}
