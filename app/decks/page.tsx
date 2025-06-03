import React from "react";
import fs from "fs";
import path from "path";

const decksPath = path.join(process.cwd(), "data", "decks.json");
const decks = JSON.parse(fs.readFileSync(decksPath, "utf-8"));

export default function DecksPage() {
  return (
    <div className="container mx-auto py-8 mt-16">
      <h1 className="text-3xl font-bold mb-6">MerisLabs Decks & Presentations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {decks.map((deck: any, idx: number) => (
          <div key={idx} className="bg-white rounded-lg shadow p-4">
            <div className="mb-2">
              <iframe
                src={deck.iframe}
                width="100%"
                height="400"
                frameBorder="0"
                allowFullScreen
                style={{ border: "1px solid #CCC", borderRadius: "8px" }}
                title={deck.title}
              />
            </div>
            <div>
              <a href={deck.link} target="_blank" rel="noopener" className="text-blue-600 font-semibold hover:underline">
                {deck.title}
              </a>
              <div className="text-sm text-gray-500">by {deck.author}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
