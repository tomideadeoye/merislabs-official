import * as React from "react";

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  color?: string;
}

export function ProgressBar({ value, max = 100, color = "#6366f1", className, ...props }: ProgressBarProps) {
  const percent = Math.min(Math.max(value, 0), max) / max * 100;
  return (
    <div className={`w-full h-2 bg-gray-200 rounded ${className || ''}`} {...props}>
      <div
        className="h-2 rounded"
        style={{ width: `${percent}%`, background: color, transition: "width 0.3s" }}
      />
    </div>
  );
}
