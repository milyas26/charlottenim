"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all outline-none hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-9 px-3",
        sm: "h-8 px-2",
        xs: "h-7 w-7",
        lg: "h-10 px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Toggle = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> &
    VariantProps<typeof toggleVariants> & {
      pressed?: boolean
      onPressedChange?: (pressed: boolean) => void
    }
>(({ className, variant, size, pressed, onPressedChange, onClick, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={pressed}
      data-state={pressed ? "on" : "off"}
      className={cn(
        toggleVariants({ variant, size, className }),
        pressed && "bg-accent text-accent-foreground"
      )}
      onClick={(e) => {
        onClick?.(e)
        onPressedChange?.(!pressed)
      }}
      {...props}
    />
  )
})
Toggle.displayName = "Toggle"

export { Toggle, toggleVariants }
