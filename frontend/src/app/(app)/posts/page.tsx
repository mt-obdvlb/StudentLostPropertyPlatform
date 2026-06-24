"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LayoutGrid, List, PlusCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FilterBar,
  type PostFilters,
} from "@/components/common/filter-bar";
import { PostCard } from "@/components/posts/post-card";
import { PostTable } from "@/components/posts/post-table";
import { Pagination } from "@/components/common/pagination";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { usePostsQuery } from "@/lib/hooks/use-posts";
import type { PostStatus, PostType, SortBy } from "@/lib/types";

const DEFAULT_FILTERS: PostFilters = {
  keyword: "",
  type: "ALL",
  status: "ALL",
  location: "",
  sortBy: "createdAtDesc",
};

const PAGE_SIZE = 9;

function PostsListInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [view, setView] = useState<"card" | "table">("card");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<PostFilters>(() => ({
    keyword: params.get("keyword") ?? "",
    type: (params.get("type") as PostFilters["type"]) ?? "ALL",
    status: (params.get("status") as PostFilters["status"]) ?? "ALL",
    location: params.get("location") ?? "",
    sortBy:
      (params.get("sortBy") as SortBy | null) ?? DEFAULT_FILTERS.sortBy,
  }));

  useEffect(() => {
    const usp = new URLSearchParams();
    if (filters.keyword) usp.set("keyword", filters.keyword);
    if (filters.type !== "ALL") usp.set("type", filters.type);
    if (filters.status !== "ALL") usp.set("status", filters.status);
    if (filters.location) usp.set("location", filters.location);
    usp.set("sortBy", filters.sortBy);
    const qs = usp.toString();
    router.replace(qs ? `/posts?${qs}` : "/posts");
  }, [filters, router]);

  const updateFilters = (next: PostFilters) => {
    setFilters(next);
    setPage(1);
  };

  const query = useMemo(
    () => ({
      keyword: filters.keyword || undefined,
      type:
        filters.type !== "ALL" ? (filters.type as PostType) : undefined,
      status:
        filters.status !== "ALL"
          ? (filters.status as PostStatus)
          : undefined,
      location: filters.location || undefined,
      sortBy: filters.sortBy,
      page,
      pageSize: PAGE_SIZE,
    }),
    [filters, page],
  );

  const { data, isLoading, isError, error } = usePostsQuery(query);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">失物 / 拾物</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            浏览校园失物招领信息，点击查看详情或申请认领。
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/posts/create" />}>
          <PlusCircle className="mr-2 size-4" />
          发布信息
        </Button>
      </div>

      <FilterBar value={filters} onChange={updateFilters} />

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {data ? `共 ${data.total} 条记录` : "加载中…"}
        </p>
        <Tabs
          value={view}
          onValueChange={(v) => setView(v as "card" | "table")}
        >
          <TabsList>
            <TabsTrigger value="card">
              <LayoutGrid className="size-4" />
              <span className="ml-1 hidden sm:inline">卡片</span>
            </TabsTrigger>
            <TabsTrigger value="table">
              <List className="size-4" />
              <span className="ml-1 hidden sm:inline">表格</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isError ? (
        <EmptyState
          title="加载失败"
          description={
            error && typeof error === "object" && "message" in error
              ? String((error as { message: string }).message)
              : "请确认后端 /posts 接口可用"
          }
        />
      ) : isLoading ? (
        <LoadingSkeleton rows={4} />
      ) : !data?.records.length ? (
        <EmptyState
          title="暂无记录"
          description="没有符合条件的失物 / 拾物信息"
          action={
            <Button
              nativeButton={false}
              variant="outline"
              render={<Link href="/posts/create" />}
            >
              立即发布
            </Button>
          }
        />
      ) : view === "card" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.records.map((p, i) => (
            <PostCard key={p.id} post={p} index={i} />
          ))}
        </div>
      ) : (
        <PostTable posts={data.records} />
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

export default function PostsPage() {
  return (
    <Suspense
      fallback={<div className="p-10 text-center text-sm">加载中…</div>}
    >
      <PostsListInner />
    </Suspense>
  );
}
