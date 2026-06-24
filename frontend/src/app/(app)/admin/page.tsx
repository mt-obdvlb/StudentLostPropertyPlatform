"use client";

import { motion } from "framer-motion";
import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminStatsCards } from "@/components/admin/admin-stats-cards";
import { PendingClaimPanel } from "@/components/admin/pending-claim-panel";
import { CardSkeleton } from "@/components/common/loading-skeleton";
import { EmptyState } from "@/components/common/empty-state";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAdminStatsQuery } from "@/lib/hooks/use-admin";
import type { AdminStats, PostStatus } from "@/lib/types";

const STATUS_LABELS: Record<PostStatus, string> = {
  PROCESSING: "进行中",
  CLAIMED: "已认领",
  EXPIRED: "已过期",
  REMOVED: "已下架",
};

function AdminHomeInner() {
  const stats = useAdminStatsQuery();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.035em] text-ink">管理员控制台</h1>
        <p className="mt-2 text-[15px] leading-6 text-muted-ink">
          查看系统总览、待审核申请与状态分布。
        </p>
      </div>

      {stats.isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : stats.isError ? (
        <EmptyState
          title="统计加载失败"
          description="请确认后端 /admin/stats 已实现且账号有 ADMIN 权限"
        />
      ) : (
        <>
          <AdminStatsCards stats={stats.data as AdminStats} />
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <PendingClaimPanel />
            <Card>
              <CardHeader>
                <CardTitle className="text-[18px] font-semibold tracking-[-0.02em] text-ink">状态分布</CardTitle>
              </CardHeader>
              <CardContent>
                <StatusDistribution
                  fallback={{
                    PROCESSING: (stats.data as AdminStats).processingPostCount,
                    CLAIMED: (stats.data as AdminStats).claimedPostCount,
                    EXPIRED: (stats.data as AdminStats).expiredPostCount,
                    REMOVED: (stats.data as AdminStats).removedPostCount,
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </motion.div>
  );
}

function StatusDistribution({
  fallback,
}: {
  fallback: Record<PostStatus, number>;
}) {
  const map: Record<PostStatus, number> = fallback;
  const total =
    (map.PROCESSING ?? 0) +
    (map.CLAIMED ?? 0) +
    (map.EXPIRED ?? 0) +
    (map.REMOVED ?? 0);
  const tones: Record<PostStatus, string> = {
    PROCESSING: "bg-apple-blue",
    CLAIMED: "bg-apple-green",
    EXPIRED: "bg-muted-ink-light",
    REMOVED: "bg-apple-red",
  };
  return (
    <div className="space-y-3">
      <div className="flex h-3 overflow-hidden rounded-full bg-canvas">
        {(["PROCESSING", "CLAIMED", "EXPIRED", "REMOVED"] as PostStatus[]).map(
          (s) => {
            const count = map[s] ?? 0;
            if (!count) return null;
            const pct = total > 0 ? (count / total) * 100 : 0;
            return (
              <div
                key={s}
                className={`${tones[s]}`}
                style={{ width: `${pct}%` }}
              />
            );
          },
        )}
      </div>
      <ul className="grid grid-cols-2 gap-2 text-sm">
        {(["PROCESSING", "CLAIMED", "EXPIRED", "REMOVED"] as PostStatus[]).map(
          (s) => (
            <li
              key={s}
              className="flex items-center justify-between rounded-[12px] border border-hairline bg-surface px-3 py-1.5"
            >
              <span className="inline-flex items-center gap-2 text-xs text-muted-ink">
                <span className={`size-2 rounded-full ${tones[s]}`} />
                {STATUS_LABELS[s]}
              </span>
              <span className="font-medium text-ink">{map[s] ?? 0}</span>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}

export default function AdminHomePage() {
  return (
    <AdminGuard>
      <AdminHomeInner />
    </AdminGuard>
  );
}
