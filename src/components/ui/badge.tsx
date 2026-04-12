import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-950",
  {
    variants: {
      variant: {
        default: "border-transparent bg-emerald-600 text-slate-50",
        secondary: "border-transparent bg-slate-800 text-slate-100",
        destructive: "border-transparent bg-red-900 text-slate-50",
        outline: "text-slate-100 border-slate-700",
        success: "border-transparent bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
        warning: "border-transparent bg-amber-500/10 text-amber-400 border border-amber-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }