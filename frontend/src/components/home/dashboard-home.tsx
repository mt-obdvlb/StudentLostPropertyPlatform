"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  PlusCircle,
  ShieldCheck,
  ArrowRight,
  Hourglass,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminStatsCards } from "@/components/admin/admin-stats-cards";
import { PostCard } from "@/components/posts/post-card";
import { CardSkeleton } from "@/components/common/loading-skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { useAdminStatsQuery } from "@/lib/hooks/use-admin";
import { usePostsQuery } from "@/lib/hooks/use-posts";
import { useAuthStore } from "@/lib/store/auth-store";
import type { AdminStats } from "@/lib/types";

export function DashboardHome() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  return isAdmin ? <AdminDashboard /> : <UserDashboard />;
}

function AdminDashboard() {
  const stats = useAdminStatsQuery();
  const latestLost = usePostsQuery({
    type: "LOST",
    pageSize: 4,
    sortBy: "createdAtDesc",
  });
  const latestFound = usePostsQuery({
    type: "FOUND",
    pageSize: 4,
    sortBy: "createdAtDesc",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <PageHeader
        title="管理员控制台"
        description="系统总览、待审核申请、最新发布。"
        action={
          <Button nativeButton={false} render={<Link href="/admin/claims" />}>
            <ShieldCheck className="mr-2 size-4" />
            前往审核
          </Button>
        }
      />

      {stats.isLoading || !stats.data ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : stats.isError ? (
        <ErrorCard message="统计加载失败，请确认后端 /admin/stats 已实现" />
      ) : (
        <>
          <AdminStatsCards stats={stats.data as AdminStats} />
          {((stats.data as AdminStats).pendingClaimCount ?? 0) > 0 && (
            <PendingClaimHint
              count={(stats.data as AdminStats).pendingClaimCount ?? 0}
            />
          )}
        </>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <PostSection
          title="最新失物"
          link="/posts?type=LOST"
          data={latestLost.data}
          isLoading={latestLost.isLoading}
          isError={latestLost.isError}
        />
        <PostSection
          title="最新拾物"
          link="/posts?type=FOUND"
          data={latestFound.data}
          isLoading={latestFound.isLoading}
          isError={latestFound.isError}
        />
      </div>
    </motion.div>
  );
}

function UserDashboard() {
  const processingLost = usePostsQuery({
    type: "LOST",
    status: "PROCESSING",
    pageSize: 1,
  });
  const processingFound = usePostsQuery({
    type: "FOUND",
    status: "PROCESSING",
    pageSize: 1,
  });
  const latestLost = usePostsQuery({
    type: "LOST",
    pageSize: 4,
    sortBy: "createdAtDesc",
  });
  const latestFound = usePostsQuery({
    type: "FOUND",
    pageSize: 4,
    sortBy: "createdAtDesc",
  });

  const lostCount = processingLost.data?.total ?? 0;
  const foundCount = processingFound.data?.total ?? 0;

  const items: { label: string; value: number; icon: LucideIcon; tone: string }[] = [
    {
      label: "寻物中",
      value: lostCount,
      icon: Hourglass,
      tone: "bg-apple-orange-soft text-apple-amber-text",
    },
    {
      label: "招领中",
      value: foundCount,
      icon: PlusCircle,
      tone: "bg-apple-blue-soft text-apple-blue",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <PageHeader
        title={`你好，${useAuthStore.getState().user?.nickname ?? "同学"}`}
        description="发布失物 / 拾物信息，追踪你的认领申请。"
        action={
          <Button nativeButton={false} render={<Link href="/posts/create" />}>
            <PlusCircle className="mr-2 size-4" />
            快捷发布
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card>
                <CardContent className="flex items-center gap-4 p-5">
                  <div
                    className={`flex size-12 items-center justify-center rounded-full ${item.tone}`}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div className="leading-tight">
                    <p className="text-[15px] font-medium text-muted-ink">
                      {item.label}
                    </p>
                    <p className="text-[40px] font-semibold tracking-[-0.04em] text-ink">{item.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PostSection
          title="最新失物"
          link="/posts?type=LOST"
          data={latestLost.data}
          isLoading={latestLost.isLoading}
          isError={latestLost.isError}
        />
        <PostSection
          title="最新拾物"
          link="/posts?type=FOUND"
          data={latestFound.data}
          isLoading={latestFound.isLoading}
          isError={latestFound.isError}
        />
      </div>
    </motion.div>
  );
}

function PendingClaimHint({ count }: { count: number }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-5">
        <ShieldCheck className="size-5 text-apple-blue" />
        <p className="flex-1 text-[15px] text-ink">
          当前有 <span className="font-semibold">{count}</span> 条认领申请待审核
        </p>
        <Button
          nativeButton={false}
          variant="outline"
          size="sm"
          render={<Link href="/admin/claims" />}
        >
          前往审核
          <ArrowRight className="ml-1 size-3" />
        </Button>
      </CardContent>
    </Card>
  );
}

function PostSection({
  title,
  link,
  data,
  isLoading,
  isError,
}: {
  title: string;
  link: string;
  data?: { records: import("@/lib/types").Post[] };
  isLoading: boolean;
  isError: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-[18px] font-semibold tracking-[-0.02em] text-ink">{title}</CardTitle>
        <Link
          href={link}
          className="inline-flex items-center text-[15px] font-medium text-apple-blue hover:text-apple-blue-hover hover:underline"
        >
          查看全部
          <ArrowRight className="ml-1 size-3" />
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} className="p-3" />
            ))}
          </div>
        ) : isError ? (
          <ErrorCard message="加载失败，请确认后端 /posts 接口可用" />
        ) : !data?.records.length ? (
          <EmptyState title="暂无数据" description="后端尚未返回任何记录" />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {data.records.map((p, i) => (
              <PostCard key={p.id} post={p} index={i} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.035em] text-ink">{title}</h1>
        <p className="mt-2 text-[15px] leading-6 text-muted-ink">{description}</p>
      </div>
      {action}
    </div>
  );
}

function ErrorCard({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
      {message}
    </div>
  );
}
