import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { ClaimStatus } from "@/lib/types";

const badge = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
  {
    variants: {
      status: {
        PENDING: "bg-apple-orange-soft text-apple-amber-text",
        APPROVED: "bg-apple-green-soft text-apple-green-text",
        REJECTED: "bg-apple-red-soft text-apple-red-text",
        CANCELLED: "bg-canvas text-muted-ink",
      },
    },
    defaultVariants: { status: "PENDING" },
  },
);

const LABELS: Record<ClaimStatus, string> = {
  PENDING: "待审核",
  APPROVED: "已通过",
  REJECTED: "已驳回",
  CANCELLED: "已取消",
};

export function ClaimStatusBadge({
  status,
  className,
}: {
  status: ClaimStatus;
  className?: string;
} & VariantProps<typeof badge>) {
  return (
    <span className={cn(badge({ status }), className)}>{LABELS[status]}</span>
  );
}
