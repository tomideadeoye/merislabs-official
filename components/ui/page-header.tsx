"use client";

import React, { useEffect, useState } from "react";

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
  // Use state to handle client-side rendering
  const [isClient, setIsClient] = useState(false);
  
  // Only update the state after component mounts on client
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return (
    <header className="mb-6 flex items-center space-x-4">
      <div className="text-blue-400">{icon}</div>
      <div>
        <h1 className="text-2xl font-semibold text-gray-100">{title}</h1>
        {description && <p className="text-gray-400">{description}</p>}
        {showMemoryStatus && (
          <p
            className={`mt-1 text-sm ${
              // Only show dynamic styling on client-side to prevent hydration mismatch
              isClient 
                ? (memoryInitialized ? "text-green-400" : "text-yellow-400")
                : "text-gray-400" // Neutral color for server rendering
            }`}
          >
            Memory Status: {isClient ? (memoryInitialized ? "Initialized" : "Not Initialized") : "Loading..."}
          </p>
        )}
      </div>
    </header>
  );
}