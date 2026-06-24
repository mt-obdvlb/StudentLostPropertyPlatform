"use client";

import { AppShell } from "@/components/layout/app-shell";
import { AuthSync } from "@/components/layout/auth-sync";

export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell>
      <AuthSync />
      {children}
    </AppShell>
  );
}
