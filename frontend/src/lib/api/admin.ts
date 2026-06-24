import { http, unwrap } from "./axios";
import type {
  AdminStats,
  Claim,
  ClaimQuery,
  ClaimReviewRequest,
  PageResult,
  Post,
  PostQuery,
  RemovePostRequest,
  User,
  UserQuery,
  UserRoleUpdateRequest,
  UserStatusUpdateRequest,
} from "@/lib/types";

export const adminApi = {
  stats: () => unwrap<AdminStats>(http.get("/admin/stats")),
  posts: (params: PostQuery) =>
    unwrap<PageResult<Post>>(http.get("/admin/posts", { params })),
  claims: (params: ClaimQuery) =>
    unwrap<PageResult<Claim>>(http.get("/admin/claims", { params })),
  approveClaim: (id: number, body: ClaimReviewRequest) =>
    unwrap<Claim>(http.post(`/admin/claims/${id}/approve`, body)),
  rejectClaim: (id: number, body: ClaimReviewRequest) =>
    unwrap<Claim>(http.post(`/admin/claims/${id}/reject`, body)),
  removePost: (id: number, body: RemovePostRequest) =>
    unwrap<void>(http.post(`/admin/posts/${id}/remove`, body)),
  users: (params: UserQuery) =>
    unwrap<PageResult<User>>(http.get("/admin/users", { params })),
  updateUserRole: (id: number, body: UserRoleUpdateRequest) =>
    unwrap<User>(http.put(`/admin/users/${id}/role`, body)),
  updateUserStatus: (id: number, body: UserStatusUpdateRequest) =>
    unwrap<User>(http.put(`/admin/users/${id}/status`, body)),
};
