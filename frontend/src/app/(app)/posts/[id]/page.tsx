"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { PostDetail } from "@/components/posts/post-detail";
import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { usePostDetailQuery } from "@/lib/hooks/use-posts";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function PostDetailPage({ params }: PageProps) {
  const { id: idStr } = use(params);
  const id = Number(idStr);
  const router = useRouter();
  const { data, isLoading, isError } = usePostDetailQuery(id);

  if (Number.isNaN(id) || id <= 0) {
    return (
      <EmptyState
        title="无效的物品 ID"
        description="请通过列表页进入详情。"
      />
    );
  }

  if (isLoading) return <LoadingSkeleton rows={4} />;

  if (isError || !data) {
    return (
      <EmptyState
        title="加载失败"
        description="后端接口不可用或物品不存在"
        action={
          <button
            className="text-primary hover:underline"
            onClick={() => router.push("/posts")}
          >
            返回列表
          </button>
        }
      />
    );
  }

  return <PostDetail post={data} />;
}
