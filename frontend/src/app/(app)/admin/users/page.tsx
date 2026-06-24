"use client";

import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { AdminGuard } from "@/components/admin/admin-guard";
import { UserRoleBadge } from "@/components/admin/user-role-badge";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { Pagination } from "@/components/common/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAdminUsersQuery,
  useUpdateUserRoleMutation,
  useUpdateUserStatusMutation,
} from "@/lib/hooks/use-admin";
import { errorMessage, formatDate } from "@/lib/utils/format";
import { useAuthStore } from "@/lib/store/auth-store";
import type { User, UserRole, UserStatus } from "@/lib/types";

const PAGE_SIZE = 10;

function AdminUsersInner() {
  const [keyword, setKeyword] = useState("");
  const [role, setRole] = useState<UserRole | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [targetId, setTargetId] = useState<number | null>(null);
  const [targetRole, setTargetRole] = useState<UserRole>("USER");

  const { data, isLoading, isError } = useAdminUsersQuery({
    keyword: keyword || undefined,
    role: role !== "ALL" ? role : undefined,
    page,
    pageSize: PAGE_SIZE,
  });
  const updateRole = useUpdateUserRoleMutation();
  const updateStatus = useUpdateUserStatusMutation();

  const onApplyRole = async (user: User) => {
    try {
      await updateRole.mutateAsync({
        id: user.id,
        body: { role: targetRole },
      });
      toast.success(`${user.nickname} 角色已更新为 ${targetRole}`);
      setTargetId(null);
    } catch (err) {
      toast.error(errorMessage(err, "更新失败"));
    }
  };

  const onToggleStatus = async (user: User) => {
    const next: UserStatus = user.status === "ACTIVE" ? "DISABLED" : "ACTIVE";
    const verb = next === "DISABLED" ? "禁用" : "启用";
    try {
      await updateStatus.mutateAsync({
        id: user.id,
        body: { status: next },
      });
      toast.success(`${user.nickname} 已${verb}`);
    } catch (err) {
      toast.error(errorMessage(err, `${verb}失败`));
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
        <h1 className="text-2xl font-semibold">用户管理</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          查看用户列表并调整角色。
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
            placeholder="用户名 / 邮箱"
          />
        </div>
        <div className="w-full space-y-1.5 md:w-[180px]">
          <Label>角色</Label>
          <Select
            value={role}
            onValueChange={(v) => {
              setRole(v as UserRole | "ALL");
              setPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="全部角色" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">全部角色</SelectItem>
              <SelectItem value="USER">普通用户</SelectItem>
              <SelectItem value="ADMIN">管理员</SelectItem>
              <SelectItem value="SUPER_ADMIN">超级管理员</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isError ? (
        <EmptyState title="加载失败" description="请确认后端 /admin/users 可用" />
      ) : isLoading ? (
        <LoadingSkeleton rows={5} />
      ) : !data?.records.length ? (
        <EmptyState title="暂无用户" description="没有符合条件的用户" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">ID</TableHead>
                <TableHead className="min-w-[160px]">用户</TableHead>
                <TableHead className="min-w-[180px]">邮箱</TableHead>
                <TableHead className="w-[120px]">当前角色</TableHead>
                <TableHead className="w-[100px]">状态</TableHead>
                <TableHead className="w-[160px]">注册时间</TableHead>
                <TableHead className="w-[120px] text-right">状态操作</TableHead>
                <TableHead className="w-[220px] text-right">角色操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.records.map((u) => {
                const disabled = u.status === "DISABLED";
                const isSelf = u.id === useAuthStore.getState().user?.id;
                return (
                  <TableRow key={u.id}>
                    <TableCell className="text-xs text-muted-foreground">
                      #{u.id}
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{u.nickname}</p>
                      <p className="text-xs text-muted-foreground">
                        @{u.username}
                      </p>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {u.email ?? "—"}
                    </TableCell>
                    <TableCell>
                      <UserRoleBadge role={u.role} />
                    </TableCell>
                    <TableCell className="text-xs">
                      {disabled ? (
                        <span className="text-apple-red-text">禁用</span>
                      ) : (
                        <span className="text-apple-green-text">正常</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(u.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant={disabled ? "outline" : "destructive"}
                        disabled={updateStatus.isPending || isSelf}
                        onClick={() => onToggleStatus(u)}
                      >
                        {disabled ? "启用" : "禁用"}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Select
                          value={targetId === u.id ? targetRole : u.role}
                          onValueChange={(v) => {
                            setTargetId(u.id);
                            setTargetRole(v as UserRole);
                          }}
                        >
                          <SelectTrigger className="h-8 w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USER">普通用户</SelectItem>
                            <SelectItem value="ADMIN">管理员</SelectItem>
                            <SelectItem value="SUPER_ADMIN">超级管理员</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          disabled={
                            updateRole.isPending ||
                            (targetId === u.id && targetRole === u.role)
                          }
                          onClick={() => onApplyRole(u)}
                        >
                          保存
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
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

      <p className="rounded-lg border border-dashed border-border bg-muted/30 p-3 text-xs text-muted-foreground">
        提示：禁用 / 启用走 <code className="font-mono">PUT /admin/users/{`{id}`}/status</code>，角色变更走 <code className="font-mono">PUT /admin/users/{`{id}`}/role</code>；当前登录账号不可禁用自身。
      </p>
    </motion.div>
  );
}

export default function AdminUsersPage() {
  return (
    <AdminGuard>
      <AdminUsersInner />
    </AdminGuard>
  );
}
