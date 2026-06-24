import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postsApi } from "@/lib/api/posts";
import type { PostCreateRequest, PostQuery } from "@/lib/types";

const POSTS_KEY = ["posts"] as const;
const POST_DETAIL_KEY = ["post"] as const;

export function usePostsQuery(query: PostQuery) {
  return useQuery({
    queryKey: [...POSTS_KEY, query],
    queryFn: () => postsApi.list(query),
  });
}

export function usePostDetailQuery(id: number) {
  return useQuery({
    queryKey: [...POST_DETAIL_KEY, id],
    queryFn: () => postsApi.detail(id),
    enabled: !!id && id > 0,
  });
}

export function useCreatePostMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: PostCreateRequest) => postsApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: POSTS_KEY });
      qc.invalidateQueries({ queryKey: ["admin", "posts"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}

export function useDuplicateCheckMutation() {
  return useMutation({
    mutationFn: (body: PostCreateRequest) => postsApi.duplicateCheck(body),
  });
}
