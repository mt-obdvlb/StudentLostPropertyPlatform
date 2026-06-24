"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClaimStatusBadge } from "@/components/claims/claim-status-badge";
import { EmptyState } from "@/components/common/empty-state";
import { CardSkeleton } from "@/components/common/loading-skeleton";
import { formatDate } from "@/lib/utils/format";
import { useAdminClaimsQuery } from "@/lib/hooks/use-admin";

export function PendingClaimPanel() {
  const { data, isLoading, isError } = useAdminClaimsQuery({
    status: "PENDING",
    page: 1,
    pageSize: 5,
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">待审核认领申请</CardTitle>
        <Button
          nativeButton={false}
          variant="outline"
          size="sm"
          render={<Link href="/admin/claims" />}
        >
          全部
          <ArrowRight className="ml-1 size-3" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} className="p-3" />
            ))}
          </div>
        ) : isError ? (
          <EmptyState title="加载失败" description="无法获取待审核申请" />
        ) : !data?.records.length ? (
          <EmptyState
            title="暂无待审核申请"
            description="所有认领申请都已处理完毕"
          />
        ) : (
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            {data.records.map((c) => (
              <li
                key={c.id}
                className="flex items-center gap-3 rounded-lg border border-border p-3"
              >
                <ClaimStatusBadge status={c.status} />
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/posts/${c.postId}`}
                    className="line-clamp-1 text-sm font-medium hover:text-primary hover:underline"
                  >
                    {c.postTitle}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    申请人 {c.claimerName} · {formatDate(c.createdAt)}
                  </p>
                </div>
                <Button
                  nativeButton={false}
                  variant="outline"
                  size="sm"
                  render={<Link href="/admin/claims" />}
                >
                  去审核
                </Button>
              </li>
            ))}
          </motion.ul>
        )}
      </CardContent>
    </Card>
  );
}
