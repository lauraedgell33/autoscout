import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success"
  size?: "sm" | "md"
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", size = "sm", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full font-medium transition-colors",
          {
            "bg-teal-100 text-teal-800": variant === "default",
            "bg-gray-100 text-gray-800": variant === "secondary",
            "bg-red-100 text-red-800": variant === "destructive",
            "border border-teal-200 text-teal-800": variant === "outline",
            "bg-green-100 text-green-800": variant === "success",
            "px-2 py-0.5 text-xs": size === "sm",
            "px-2.5 py-1 text-sm": size === "md",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge }