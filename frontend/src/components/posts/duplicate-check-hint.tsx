"use client";

import { AlertTriangle, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { DuplicateCheckResult } from "@/lib/types";
import { PostTypeBadge } from "./post-type-badge";
import { formatDate } from "@/lib/utils/format";

export function DuplicateCheckHint({
  result,
  onConfirm,
  onCancel,
  loading,
}: {
  result: DuplicateCheckResult;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}) {
  const { level, duplicateScore, matchedPost } = result;
  const tone =
    level === "HIGH"
      ? "border-apple-red/20 bg-apple-red-soft text-apple-red-text"
      : level === "MEDIUM"
        ? "border-apple-amber-text/20 bg-apple-orange-soft text-apple-amber-text"
        : "border-hairline bg-canvas text-muted-ink";

  const title =
    level === "HIGH"
      ? "高度疑似重复发布"
      : level === "MEDIUM"
        ? "可能与已有信息重复"
        : "未发现明显重复";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-[18px] border p-4 ${tone}`}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0" />
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-sm font-semibold">{title}</p>
            <p className="text-xs opacity-80">
              相似度评分：{(duplicateScore * 100).toFixed(0)}%
            </p>
          </div>
          {matchedPost && (
            <ul className="space-y-2">
              <li className="rounded-[12px] border border-hairline bg-surface p-2 text-xs">
                <div className="flex items-center gap-2">
                  <PostTypeBadge type={matchedPost.type} />
                  <span className="line-clamp-1 font-medium text-ink">
                    {matchedPost.title}
                  </span>
                </div>
                <p className="mt-1 text-muted-ink">
                  {matchedPost.location} · {formatDate(matchedPost.occurredAt)}
                </p>
              </li>
            </ul>
          )}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              <X className="mr-1 size-3.5" />
              取消发布
            </Button>
            <Button
              size="sm"
              onClick={onConfirm}
              disabled={loading}
              variant={level === "HIGH" ? "destructive" : "default"}
            >
              <Check className="mr-1 size-3.5" />
              仍然继续发布
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
