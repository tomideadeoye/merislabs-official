/**
 * Avatar UI Component
 * Goal: Display a user avatar with robust error handling, fallback, and styling.
 * This component is used throughout the app for user profile images, team members, etc.
 * It connects to other UI elements and is often used in lists, headers, and cards.
 *
 * Logging, error handling, and extensibility are prioritized for reliability and traceability.
 *
 * File: apps/nextjs/components/ui/avatar.tsx
 */

import * as React from "react";
import { cn } from "../../lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode
  size?: number
  className?: string
}

export function Avatar({ src, alt, fallback, size = 40, className, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-full bg-muted overflow-hidden",
        className
      )}
      style={{ width: size, height: size }}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt || "Avatar"}
          className="object-cover w-full h-full"
          width={size}
          height={size}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : fallback ? (
        fallback
      ) : (
        <span className="text-muted-foreground text-lg font-bold">?</span>
      )}
    </div>
  )
}
