import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/30 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Apple blue pill
        default:
          "bg-primary text-primary-foreground shadow-none hover:bg-apple-blue-hover",
        // Apple blue outline pill
        outline:
          "border-primary bg-surface text-primary shadow-none hover:bg-apple-blue-soft",
        // Soft surface pill
        secondary:
          "bg-surface text-ink border border-hairline shadow-none hover:bg-canvas",
        ghost:
          "text-ink hover:bg-canvas aria-expanded:bg-canvas aria-expanded:text-ink dark:hover:bg-muted/50",
        // Apple red soft pill
        destructive:
          "bg-apple-red-soft text-apple-red-text shadow-none hover:bg-apple-red/15",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 gap-1.5 px-5 text-[15px]",
        xs: "h-7 gap-1 px-3 text-xs",
        sm: "h-9 gap-1.5 px-4 text-[13px]",
        lg: "h-11 gap-2 px-7 text-[15px]",
        icon: "size-10 rounded-full",
        "icon-xs": "size-7",
        "icon-sm": "size-9",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
