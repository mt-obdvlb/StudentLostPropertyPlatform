import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { UserRole } from "@/lib/types";

const badge = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
  {
    variants: {
      role: {
        VISITOR: "bg-canvas text-muted-ink",
        USER: "bg-apple-blue-soft text-apple-blue",
        ADMIN: "bg-apple-green-soft text-apple-green-text",
        SUPER_ADMIN: "bg-apple-orange-soft text-apple-amber-text",
      },
    },
    defaultVariants: { role: "USER" },
  },
);

const LABELS: Record<UserRole, string> = {
  VISITOR: "访客",
  USER: "普通用户",
  ADMIN: "管理员",
  SUPER_ADMIN: "超级管理员",
};

export function UserRoleBadge({
  role,
  className,
}: {
  role: UserRole;
  className?: string;
} & VariantProps<typeof badge>) {
  return (
    <span className={cn(badge({ role }), className)}>{LABELS[role]}</span>
  );
}
