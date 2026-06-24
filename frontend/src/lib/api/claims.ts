import { http, unwrap } from "./axios";
import type {
  Claim,
  ClaimCreateRequest,
  ClaimQuery,
  PageResult,
} from "@/lib/types";

export const claimsApi = {
  create: (body: ClaimCreateRequest) =>
    unwrap<Claim>(http.post("/claims", body)),
  my: (params: ClaimQuery) =>
    unwrap<PageResult<Claim>>(http.get("/claims/my", { params })),
  detail: (id: number) => unwrap<Claim>(http.get(`/claims/${id}`)),
  cancel: (id: number) => unwrap<Claim>(http.post(`/claims/${id}/cancel`)),
};
