/**
 * Loader Component
 * GOAL: Visually engaging loader for async operations, with robust logging for traceability.
 * Used throughout the Orion UI for loading states.
 * All usage is logged for debugging and performance monitoring.
 */

import React, { useEffect } from "react";

export interface LoaderProps {
  message?: string;
  size?: number;
  color?: string;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  message = "Loading...",
  size = 48,
  color = "#6366f1",
  className = "",
}) => {
  useEffect(() => {
    // [LOG][INFO] Loader mounted
    console.info("[LOADER][MOUNTED]", { message, size, color });
    return () => {
      // [LOG][INFO] Loader unmounted
      console.info("[LOADER][UNMOUNTED]", { message });
    };
  }, [message, size, color]);

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg
        className="animate-spin"
        width={size}
        height={size}
        viewBox="0 0 50 50"
        style={{ color }}
        aria-label="Loading"
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray="31.4 31.4"
          strokeLinecap="round"
        />
      </svg>
      <span className="mt-2 text-sm text-gray-600">{message}</span>
    </div>
  );
};

export default Loader;
