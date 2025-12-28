import * as React from "react"
import { cn } from "../../lib/utils"

const ModernCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow",
      className
    )}
    {...props}
  />
))
ModernCard.displayName = "ModernCard"

const ModernCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6", className)} {...props} />
))
ModernCardContent.displayName = "ModernCardContent"

export { ModernCard, ModernCardContent }
