import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { PostType } from "@/lib/types";

const badge = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
  {
    variants: {
      type: {
        LOST: "bg-apple-orange-soft text-apple-amber-text",
        FOUND: "bg-apple-blue-soft text-apple-blue",
      },
    },
    defaultVariants: { type: "LOST" },
  },
);

export function PostTypeBadge({
  type,
  className,
}: {
  type: PostType;
  className?: string;
} & VariantProps<typeof badge>) {
  return (
    <span className={cn(badge({ type }), className)}>
      {type === "LOST" ? "寻物" : "招领"}
    </span>
  );
}
