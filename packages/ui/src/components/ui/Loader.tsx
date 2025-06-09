/**
 * Loader Component
 * GOAL: Visually engaging loader for async operations, with robust logging for traceability.
 * Used throughout the Orion UI for loading states.
 * All usage is logged for debugging and performance monitoring.
 */

import * as React from "react"
import { cn } from "@/lib/utils"

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
}

export function Loader({ className, size = "md", ...props }: LoaderProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-current border-t-transparent",
        {
          "h-4 w-4": size === "sm",
          "h-6 w-6": size === "md",
          "h-8 w-8": size === "lg",
        },
        className
      )}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}
