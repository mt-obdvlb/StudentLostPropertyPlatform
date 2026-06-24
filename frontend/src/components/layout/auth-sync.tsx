"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore, useHydratedAuth } from "@/lib/store/auth-store";
import { authApi } from "@/lib/api/auth";

const PUBLIC_PATHS = ["/login", "/register"];

export function AuthSync() {
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useHydratedAuth();
  const token = useAuthStore((s) => s.token);
  const setUser = useAuthStore((s) => s.setUser);
  const clear = useAuthStore((s) => s.clear);

  useEffect(() => {
    if (!hydrated) return;
    const isPublic = PUBLIC_PATHS.includes(pathname);
    if (!token && !isPublic) return;
    if (!token) return;
    let cancelled = false;
    authApi
      .me()
      .then((u) => {
        if (!cancelled) setUser(u);
      })
      .catch(() => {
        if (!cancelled) {
          clear();
          if (!isPublic) {
            const from =
              pathname +
              (typeof window !== "undefined" ? window.location.search : "");
            router.replace(`/login?from=${encodeURIComponent(from)}`);
          }
        }
      });
    return () => {
      cancelled = true;
    };
  }, [hydrated, token, pathname, router, setUser, clear]);

  return null;
}
