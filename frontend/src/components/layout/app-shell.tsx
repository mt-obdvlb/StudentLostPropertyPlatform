"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore, useHydratedAuth } from "@/lib/store/auth-store";
import { Sidebar, MobileNav } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

const PUBLIC_PATHS = ["/login", "/register"];

export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useHydratedAuth();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isPublic = PUBLIC_PATHS.includes(pathname);

  useEffect(() => {
    if (!hydrated) return;
    if (!token && !isPublic) {
      const from = pathname + (typeof window !== "undefined" ? window.location.search : "");
      router.replace(`/login?from=${encodeURIComponent(from)}`);
    }
  }, [hydrated, token, isPublic, pathname, router]);

  if (!hydrated) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
        加载中…
      </div>
    );
  }

  if (isPublic) {
    return <>{children}</>;
  }

  if (!token || !user) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
        正在跳转登录…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-canvas text-ink">
      <Sidebar user={user} />
      <MobileNav
        user={user}
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
      />
      <div className="flex flex-1 flex-col min-w-0 lg:pl-[280px]">
        <Header user={user} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
