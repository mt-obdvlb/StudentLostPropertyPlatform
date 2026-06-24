import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { PostStatus } from "@/lib/types";

const badge = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
  {
    variants: {
      status: {
        PROCESSING: "bg-apple-blue-soft text-apple-blue",
        CLAIMED: "bg-apple-green-soft text-apple-green-text",
        EXPIRED: "bg-canvas text-muted-ink",
        REMOVED: "bg-apple-red-soft text-apple-red-text",
      },
    },
    defaultVariants: { status: "PROCESSING" },
  },
);

const LABELS: Record<PostStatus, string> = {
  PROCESSING: "进行中",
  CLAIMED: "已认领",
  EXPIRED: "已过期",
  REMOVED: "已下架",
};

export function PostStatusBadge({
  status,
  className,
}: {
  status: PostStatus;
  className?: string;
} & VariantProps<typeof badge>) {
  return (
    <span className={cn(badge({ status }), className)}>{LABELS[status]}</span>
  );
}
