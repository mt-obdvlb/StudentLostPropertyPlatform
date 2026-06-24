"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, XCircle } from "lucide-react";
import type { Claim } from "@/lib/types";
import { formatDate } from "@/lib/utils/format";

const STEPS = [
  { key: "PENDING", label: "申请提交" },
  { key: "REVIEW", label: "管理员审核" },
  { key: "FINAL", label: "结果" },
] as const;

export function ClaimTimeline({ claim }: { claim: Claim }) {
  const approved = claim.status === "APPROVED";
  const rejected = claim.status === "REJECTED";
  const cancelled = claim.status === "CANCELLED";
  const pending = claim.status === "PENDING";

  return (
    <ol className="relative space-y-4 pl-6">
      <span className="absolute left-2 top-1 h-[calc(100%-1rem)] w-px bg-hairline" />
      {STEPS.map((step, i) => {
        let icon: "pending" | "done" | "rejected" | "current" = "pending";
        if (i === 0) {
          icon = "done";
        } else if (i === 1) {
          if (pending) {
            icon = "current";
          } else if (approved || rejected || cancelled) {
            icon = "done";
          }
        } else if (i === 2) {
          if (approved) {
            icon = "done";
          } else if (rejected) {
            icon = "rejected";
          } else if (cancelled) {
            icon = "rejected";
          }
        }
        return (
          <motion.li
            key={step.key}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: i * 0.08 }}
            className="relative"
          >
            <span className="absolute -left-6 top-0.5 flex size-4 items-center justify-center">
              {icon === "done" ? (
                <CheckCircle2 className="size-4 text-apple-green" />
              ) : icon === "rejected" ? (
                <XCircle className="size-4 text-apple-red" />
              ) : icon === "current" ? (
                <span className="size-3 animate-pulse rounded-full bg-apple-blue" />
              ) : (
                <Circle className="size-4 text-muted-ink-light/50" />
              )}
            </span>
            <p className="text-sm font-medium text-ink">{step.label}</p>
            <p className="text-xs text-muted-ink">
              {i === 0 && `申请时间：${formatDate(claim.createdAt)}`}
              {i === 1 &&
                claim.reviewedAt &&
                `审核时间：${formatDate(claim.reviewedAt)}`}
              {i === 2 && claim.reviewComment && `备注：${claim.reviewComment}`}
              {i === 2 && !claim.reviewComment && cancelled && "用户已取消"}
            </p>
          </motion.li>
        );
      })}
    </ol>
  );
}
