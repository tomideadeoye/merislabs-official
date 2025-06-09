/**
 * ProgressBar Component
 * GOAL: Visually engaging, customizable progress bar for async operations and feedback.
 * Used throughout the Orion UI for progress indication.
 * All usage and progress updates are logged for debugging and performance monitoring.
 */

import React, { useEffect } from "react";

export interface ProgressBarProps {
  progress: number; // 0 to 100
  label?: string;
  color?: string;
  height?: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label = "",
  color = "#6366f1",
  height = 12,
  className = "",
}) => {
  useEffect(() => {
    // [LOG][INFO] ProgressBar mounted/updated
    console.info("[PROGRESS_BAR][MOUNTED_OR_UPDATED]", { progress, label, color, height });
    return () => {
      // [LOG][INFO] ProgressBar unmounted
      console.info("[PROGRESS_BAR][UNMOUNTED]", { label });
    };
  }, [progress, label, color, height]);

  const safeProgress = Math.max(0, Math.min(progress, 100));

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="mb-1 text-xs font-medium text-gray-700 flex justify-between">
          <span>{label}</span>
          <span>{safeProgress}%</span>
        </div>
      )}
      <div
        className="w-full bg-gray-200 rounded-full overflow-hidden"
        style={{ height }}
        aria-label={label || "Progress"}
      >
        <div
          className="transition-all duration-300"
          style={{
            width: `${safeProgress}%`,
            background: color,
            height: "100%",
            borderRadius: "inherit",
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
