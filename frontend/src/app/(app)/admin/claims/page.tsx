"use client";

import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Link from "next/link";
import { AdminGuard } from "@/components/admin/admin-guard";
import { ReviewActionPanel } from "@/components/admin/review-action-panel";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { Pagination } from "@/components/common/pagination";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ClaimStatusBadge } from "@/components/claims/claim-status-badge";
import { formatDate } from "@/lib/utils/format";
import { errorMessage } from "@/lib/utils/format";
import {
  useAdminClaimsQuery,
  useApproveClaimMutation,
  useRejectClaimMutation,
} from "@/lib/hooks/use-admin";
import type { Claim, ClaimStatus } from "@/lib/types";

const PAGE_SIZE = 10;

function AdminClaimsInner() {
  const [tab, setTab] = useState<ClaimStatus | "ALL">("PENDING");
  const [page, setPage] = useState(1);
  const [activeId, setActiveId] = useState<number | null>(null);

  const { data, isLoading, isError } = useAdminClaimsQuery({
    status: tab !== "ALL" ? tab : undefined,
    page,
    pageSize: PAGE_SIZE,
  });
  const approve = useApproveClaimMutation();
  const reject = useRejectClaimMutation();

  const onApprove = async (c: Claim, comment: string) => {
    setActiveId(c.id);
    try {
      await approve.mutateAsync({ id: c.id, body: { reviewComment: comment } });
      toast.success(`已通过：${c.postTitle}`);
    } catch (err) {
      toast.error(errorMessage(err, "审核失败"));
    } finally {
      setActiveId(null);
    }
  };
  const onReject = async (c: Claim, comment: string) => {
    setActiveId(c.id);
    try {
      await reject.mutateAsync({ id: c.id, body: { reviewComment: comment } });
      toast.success(`已驳回：${c.postTitle}`);
    } catch (err) {
      toast.error(errorMessage(err, "审核失败"));
    } finally {
      setActiveId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-semibold">认领审核</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          处理用户提交的认领申请，通过后物品状态自动变更为已认领。
        </p>
      </div>

      <Tabs
        value={tab}
        onValueChange={(v) => {
          setTab(v as ClaimStatus | "ALL");
          setPage(1);
        }}
      >
        <TabsList>
          <TabsTrigger value="PENDING">待审核</TabsTrigger>
          <TabsTrigger value="APPROVED">已通过</TabsTrigger>
          <TabsTrigger value="REJECTED">已驳回</TabsTrigger>
          <TabsTrigger value="CANCELLED">已取消</TabsTrigger>
          <TabsTrigger value="ALL">全部</TabsTrigger>
        </TabsList>
      </Tabs>

      {isError ? (
        <EmptyState title="加载失败" description="请确认后端 /admin/claims 可用" />
      ) : isLoading ? (
        <LoadingSkeleton rows={4} />
      ) : !data?.records.length ? (
        <EmptyState title="暂无记录" description="该状态下没有认领申请" />
      ) : (
        <div className="space-y-4">
          {data.records.map((c) => (
            <Card key={c.id}>
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center gap-3">
                  <ClaimStatusBadge status={c.status} />
                  <Link
                    href={`/posts/${c.postId}`}
                    className="line-clamp-1 text-sm font-semibold hover:text-primary hover:underline"
                  >
                    {c.postTitle}
                  </Link>
                  <span className="ml-auto text-xs text-muted-foreground">
                    申请时间 {formatDate(c.createdAt)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 text-sm md:grid-cols-2">
                  <div>
                    <p className="text-xs text-muted-foreground">申请人</p>
                    <p className="font-medium">{c.claimerName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">审核人</p>
                    <p className="font-medium">
                      {c.reviewerName ?? "—"}
                      {c.reviewedAt && ` · ${formatDate(c.reviewedAt)}`}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">认领理由</p>
                  <p className="whitespace-pre-wrap text-sm">{c.reason}</p>
                </div>
                {c.proofDescription && (
                  <div>
                    <p className="text-xs text-muted-foreground">证明说明</p>
                    <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                      {c.proofDescription}
                    </p>
                  </div>
                )}
                {c.reviewComment && (
                  <div>
                    <p className="text-xs text-muted-foreground">原审核备注</p>
                    <p className="text-sm">{c.reviewComment}</p>
                  </div>
                )}

                {c.status === "PENDING" && (
                  <ReviewActionPanel
                    loading={activeId === c.id}
                    onApprove={(comment) => onApprove(c, comment)}
                    onReject={(comment) => onReject(c, comment)}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {data && data.total > PAGE_SIZE && (
        <Pagination
          page={page}
          pageSize={PAGE_SIZE}
          total={data.total}
          onChange={setPage}
        />
      )}
    </motion.div>
  );
}

export default function AdminClaimsPage() {
  return (
    <AdminGuard>
      <AdminClaimsInner />
    </AdminGuard>
  );
}
