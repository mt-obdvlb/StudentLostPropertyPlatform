import { http, unwrap } from "./axios";
import type {
  DuplicateCheckResult,
  PageResult,
  Post,
  PostCreateRequest,
  PostQuery,
  PostUpdateRequest,
} from "@/lib/types";

export const postsApi = {
  list: (params: PostQuery) =>
    unwrap<PageResult<Post>>(http.get("/posts", { params })),
  detail: (id: number) => unwrap<Post>(http.get(`/posts/${id}`)),
  create: (body: PostCreateRequest) =>
    unwrap<Post>(http.post("/posts", body)),
  update: (id: number, body: PostUpdateRequest) =>
    unwrap<Post>(http.put(`/posts/${id}`, body)),
  remove: (id: number) => unwrap<void>(http.delete(`/posts/${id}`)),
  duplicateCheck: (body: PostCreateRequest) =>
    unwrap<DuplicateCheckResult>(http.post("/posts/duplicate-check", body)),
};
