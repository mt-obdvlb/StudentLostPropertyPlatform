"use client";

import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Link from "next/link";
import { AdminGuard } from "@/components/admin/admin-guard";
import { Pagination } from "@/components/common/pagination";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PostTypeBadge } from "@/components/posts/post-type-badge";
import { PostStatusBadge } from "@/components/posts/post-status-badge";
import { useAdminPostsQuery, useRemovePostMutation } from "@/lib/hooks/use-admin";
import { errorMessage, formatDate } from "@/lib/utils/format";
import type { Post, PostStatus } from "@/lib/types";

const PAGE_SIZE = 10;

function AdminPostsInner() {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<PostStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [target, setTarget] = useState<Post | null>(null);
  const [reason, setReason] = useState("");
  const removeMutation = useRemovePostMutation();

  const { data, isLoading, isError } = useAdminPostsQuery({
    keyword: keyword || undefined,
    status: status !== "ALL" ? status : undefined,
    page,
    pageSize: PAGE_SIZE,
    sortBy: "createdAtDesc",
  });

  const onConfirmRemove = async () => {
    if (!target) return;
    try {
      await removeMutation.mutateAsync({
        id: target.id,
        body: { reason: reason || "管理员下架" },
      });
      toast.success(`已下架：${target.title}`);
      setTarget(null);
      setReason("");
    } catch (err) {
      toast.error(errorMessage(err, "下架失败"));
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
        <h1 className="text-2xl font-semibold">物品管理</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          查看全部失物 / 拾物信息，可按状态下架。
        </p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="keyword">关键词</Label>
          <Input
            id="keyword"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(1);
            }}
            placeholder="标题 / 描述"
          />
        </div>
        <div className="w-full space-y-1.5 md:w-[180px]">
          <Label>状态</Label>
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v as PostStatus | "ALL");
              setPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="全部状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">全部状态</SelectItem>
              <SelectItem value="PROCESSING">进行中</SelectItem>
              <SelectItem value="CLAIMED">已认领</SelectItem>
              <SelectItem value="EXPIRED">已过期</SelectItem>
              <SelectItem value="REMOVED">已下架</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isError ? (
        <EmptyState title="加载失败" description="请确认后端 /admin/posts 可用" />
      ) : isLoading ? (
        <LoadingSkeleton rows={5} />
      ) : !data?.records.length ? (
        <EmptyState title="暂无记录" description="没有符合条件的物品" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">类型</TableHead>
                <TableHead className="min-w-[220px]">标题</TableHead>
                <TableHead className="w-[140px]">地点</TableHead>
                <TableHead className="w-[100px]">状态</TableHead>
                <TableHead className="w-[160px]">发布时间</TableHead>
                <TableHead className="w-[120px]">发布者</TableHead>
                <TableHead className="w-[100px] text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.records.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <PostTypeBadge type={p.type} />
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/posts/${p.id}`}
                      className="line-clamp-1 font-medium hover:text-primary hover:underline"
                    >
                      {p.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {p.location}
                  </TableCell>
                  <TableCell>
                    <PostStatusBadge status={p.status} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(p.createdAt)}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {p.ownerName ?? `#${p.ownerId}`}
                  </TableCell>
                  <TableCell className="text-right">
                    {p.status === "PROCESSING" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTarget(p)}
                      >
                        下架
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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

      <Dialog
        open={!!target}
        onOpenChange={(v) => {
          if (!v) {
            setTarget(null);
            setReason("");
          }
        }}
      >
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>下架物品</DialogTitle>
            <DialogDescription>
              确定下架「{target?.title}」？下架后该物品将不再对外展示。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label htmlFor="reason">下架原因</Label>
            <Textarea
              id="reason"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="例：信息不实 / 违规内容"
            />
          </div>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              取消
            </DialogClose>
            <Button
              variant="destructive"
              onClick={onConfirmRemove}
              disabled={removeMutation.isPending}
            >
              {removeMutation.isPending ? "处理中…" : "确认下架"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

export default function AdminPostsPage() {
  return (
    <AdminGuard>
      <AdminPostsInner />
    </AdminGuard>
  );
}
