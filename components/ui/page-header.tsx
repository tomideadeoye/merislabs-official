"use client";

import React from "react";

interface PageHeaderProps {
  title: string;
  icon: React.ReactNode;
  description?: string;
  showMemoryStatus?: boolean;
  memoryInitialized?: boolean;
}

export function PageHeader({
  title,
  icon,
  description,
  showMemoryStatus = false,
  memoryInitialized = false,
}: PageHeaderProps) {
  return (
    <header className="mb-6 flex items-center space-x-4">
      <div className="text-blue-400">{icon}</div>
      <div>
        <h1 className="text-2xl font-semibold text-gray-100">{title}</h1>
        {description && <p className="text-gray-400">{description}</p>}
        {showMemoryStatus && (
          <p
            className={`mt-1 text-sm ${
              memoryInitialized ? "text-green-400" : "text-yellow-400"
            }`}
          >
            Memory Status: {memoryInitialized ? "Initialized" : "Not Initialized"}
          </p>
        )}
      </div>
    </header>
  );
}
