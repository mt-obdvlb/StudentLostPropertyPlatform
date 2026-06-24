"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { ClaimTable } from "@/components/claims/claim-table";
import { EmptyState } from "@/components/common/empty-state";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMyClaimsQuery } from "@/lib/hooks/use-claims";
import { useCancelClaimMutation } from "@/lib/hooks/use-claims";
import { errorMessage } from "@/lib/utils/format";
import type { Claim, ClaimStatus } from "@/lib/types";

export default function MyClaimsPage() {
  const [status, setStatus] = useState<ClaimStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isError } = useMyClaimsQuery({
    status: status !== "ALL" ? status : undefined,
    page,
    pageSize,
  });
  const cancelMutation = useCancelClaimMutation();
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [confirmClaim, setConfirmClaim] = useState<Claim | null>(null);

  const onConfirmCancel = async () => {
    if (!confirmClaim) return;
    setPendingId(confirmClaim.id);
    try {
      await cancelMutation.mutateAsync(confirmClaim.id);
      toast.success("已取消申请");
      setConfirmClaim(null);
    } catch (err) {
      toast.error(errorMessage(err, "取消失败"));
    } finally {
      setPendingId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">我的认领申请</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            查看你提交的认领申请状态与审核结果。
          </p>
        </div>
        <div className="w-full md:w-[200px]">
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v as ClaimStatus | "ALL");
              setPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="状态筛选" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">全部状态</SelectItem>
              <SelectItem value="PENDING">待审核</SelectItem>
              <SelectItem value="APPROVED">已通过</SelectItem>
              <SelectItem value="REJECTED">已驳回</SelectItem>
              <SelectItem value="CANCELLED">已取消</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Dialog
        open={!!confirmClaim}
        onOpenChange={(v) => !v && setConfirmClaim(null)}
      >
        {confirmClaim && (
          <DialogContent className="sm:max-w-[420px]">
            <DialogHeader>
              <DialogTitle>取消认领申请</DialogTitle>
              <DialogDescription>
                确定取消对「{confirmClaim.postTitle}」的认领申请？该操作不可撤销。
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose
                render={<Button type="button" variant="outline" />}
              >
                再想想
              </DialogClose>
              <Button
                variant="destructive"
                onClick={onConfirmCancel}
                disabled={pendingId === confirmClaim.id}
              >
                {pendingId === confirmClaim.id ? "处理中…" : "确认取消"}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
        <DialogTrigger className="hidden">
          <span />
        </DialogTrigger>
      </Dialog>

      {isError ? (
        <EmptyState
          title="加载失败"
          description="请确认后端 /claims/my 接口可用且已登录"
        />
      ) : isLoading ? (
        <LoadingSkeleton rows={4} />
      ) : !data?.records.length ? (
        <EmptyState
          title="暂无认领申请"
          description="前往列表页找到拾物信息即可发起认领"
          icon={<Inbox className="size-5" />}
          action={
            <Button
              nativeButton={false}
              variant="outline"
              render={<Link href="/posts?status=PROCESSING&type=FOUND" />}
            >
              浏览招领信息
            </Button>
          }
        />
      ) : (
        <ClaimTable
          claims={data.records}
          onCancel={(c) => setConfirmClaim(c)}
          cancelingId={pendingId}
        />
      )}

      {data && data.total > pageSize && (
        <div className="flex items-center justify-end gap-2 text-sm">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            上一页
          </Button>
          <span className="text-xs text-muted-foreground">
            {page} / {Math.ceil(data.total / pageSize)}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= Math.ceil(data.total / pageSize)}
            onClick={() => setPage((p) => p + 1)}
          >
            下一页
          </Button>
        </div>
      )}
    </motion.div>
  );
}
