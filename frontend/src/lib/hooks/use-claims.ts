import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { claimsApi } from "@/lib/api/claims";
import type { ClaimCreateRequest, ClaimQuery } from "@/lib/types";

const MY_CLAIMS_KEY = ["my-claims"] as const;

export function useMyClaimsQuery(query: ClaimQuery) {
  return useQuery({
    queryKey: [...MY_CLAIMS_KEY, query],
    queryFn: () => claimsApi.my(query),
  });
}

export function useCreateClaimMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: ClaimCreateRequest) => claimsApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: MY_CLAIMS_KEY });
      qc.invalidateQueries({ queryKey: ["post"] });
      qc.invalidateQueries({ queryKey: ["admin", "claims"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useCancelClaimMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => claimsApi.cancel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: MY_CLAIMS_KEY });
      qc.invalidateQueries({ queryKey: ["admin", "claims"] });
    },
  });
}
