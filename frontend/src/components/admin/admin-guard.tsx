"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { useAuthStore, useHydratedAuth } from "@/lib/store/auth-store";
import type { UserRole } from "@/lib/types";

export function AdminGuard({
  children,
  roles = ["ADMIN", "SUPER_ADMIN"],
}: {
  children: React.ReactNode;
  roles?: UserRole[];
}) {
  const router = useRouter();
  const hydrated = useHydratedAuth();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (!hydrated) return;
    if (!token) {
      router.replace(`/login?from=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname : "/admin")}`);
      return;
    }
    if (!user || !roles.includes(user.role)) {
      router.replace("/");
    }
  }, [hydrated, token, user, roles, router]);

  if (!hydrated || !token) {
    return (
      <div className="p-10 text-center text-sm text-muted-foreground">
        加载中…
      </div>
    );
  }

  if (!user || !roles.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-10 text-center text-sm text-muted-foreground">
        <ShieldAlert className="size-6 text-destructive" />
        你没有权限访问该页面，正在跳转…
      </div>
    );
  }

  return <>{children}</>;
}
