import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/store/auth-store";
import type { LoginRequest, RegisterRequest } from "@/lib/types";

export function useLoginMutation() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: (body: LoginRequest) => authApi.login(body),
    onSuccess: (data) => setAuth(data.token, data.user),
  });
}

export function useRegisterMutation() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: (body: RegisterRequest) => authApi.register(body),
    onSuccess: (data) => setAuth(data.token, data.user),
  });
}

export function useLogoutMutation() {
  const clear = useAuthStore((s) => s.clear);
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => clear(),
  });
}
