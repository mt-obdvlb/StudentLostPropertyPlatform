import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/admin";
import type {
  ClaimQuery,
  ClaimReviewRequest,
  PostQuery,
  RemovePostRequest,
  UserQuery,
  UserRoleUpdateRequest,
  UserStatusUpdateRequest,
} from "@/lib/types";

export function useAdminStatsQuery() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => adminApi.stats(),
  });
}

export function useAdminPostsQuery(query: PostQuery) {
  return useQuery({
    queryKey: ["admin", "posts", query],
    queryFn: () => adminApi.posts(query),
  });
}

export function useAdminClaimsQuery(query: ClaimQuery) {
  return useQuery({
    queryKey: ["admin", "claims", query],
    queryFn: () => adminApi.claims(query),
  });
}

export function useApproveClaimMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: ClaimReviewRequest }) =>
      adminApi.approveClaim(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "claims"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
      qc.invalidateQueries({ queryKey: ["admin", "posts"] });
      qc.invalidateQueries({ queryKey: ["posts"] });
      qc.invalidateQueries({ queryKey: ["post"] });
      qc.invalidateQueries({ queryKey: ["my-claims"] });
    },
  });
}

export function useRejectClaimMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: ClaimReviewRequest }) =>
      adminApi.rejectClaim(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "claims"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
      qc.invalidateQueries({ queryKey: ["my-claims"] });
    },
  });
}

export function useRemovePostMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: RemovePostRequest }) =>
      adminApi.removePost(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "posts"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
      qc.invalidateQueries({ queryKey: ["posts"] });
      qc.invalidateQueries({ queryKey: ["post"] });
    },
  });
}

export function useAdminUsersQuery(query: UserQuery) {
  return useQuery({
    queryKey: ["admin", "users", query],
    queryFn: () => adminApi.users(query),
  });
}

export function useUpdateUserRoleMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UserRoleUpdateRequest }) =>
      adminApi.updateUserRole(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useUpdateUserStatusMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UserStatusUpdateRequest }) =>
      adminApi.updateUserStatus(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}
