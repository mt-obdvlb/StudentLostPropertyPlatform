"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ListChecks,
  PlusCircle,
  Inbox,
  ShieldCheck,
  ScrollText,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { User } from "@/lib/types";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const USER_NAV: NavItem[] = [
  { href: "/", label: "首页", icon: LayoutDashboard },
  { href: "/posts", label: "失物 / 拾物", icon: ListChecks },
  { href: "/posts/create", label: "发布信息", icon: PlusCircle },
  { href: "/claims", label: "我的认领", icon: Inbox },
];

const ADMIN_NAV: NavItem[] = [
  { href: "/admin", label: "管理后台", icon: ShieldCheck },
  { href: "/admin/posts", label: "物品管理", icon: ScrollText },
  { href: "/admin/claims", label: "认领审核", icon: Inbox },
  { href: "/admin/users", label: "用户管理", icon: Users },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function NavList({
  user,
  onNavigate,
}: {
  user: User;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const isAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";

  const renderNav = (items: NavItem[]) =>
    items.map((item) => {
      const active = isActive(pathname, item.href);
      const Icon = item.icon;
      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-[16px] px-4 py-3 text-[15px] font-medium transition-colors",
            active
              ? "bg-apple-blue-soft text-apple-blue"
              : "text-ink hover:bg-canvas",
          )}
        >
          <Icon
            className={cn(
              "size-5 shrink-0",
              active ? "text-apple-blue" : "text-muted-ink-light",
            )}
          />
          <span className="truncate">{item.label}</span>
        </Link>
      );
    });

  return (
    <nav className="mt-6 flex flex-1 flex-col gap-1">
      <p className="px-4 pb-1 text-[11px] font-medium uppercase tracking-wider text-muted-ink-light">
        主导航
      </p>
      {renderNav(USER_NAV)}
      {isAdmin && (
        <>
          <p className="px-4 pb-1 pt-4 text-[11px] font-medium uppercase tracking-wider text-muted-ink-light">
            管理员
          </p>
          {renderNav(ADMIN_NAV)}
        </>
      )}
    </nav>
  );
}

export function BrandHeader() {
  return (
    <div className="flex items-center gap-3 px-2 py-1">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-[12px] border border-apple-blue/15 bg-apple-blue-soft text-[17px] font-semibold tracking-[-0.02em] text-apple-blue shadow-none">
        失
      </div>
      <div className="min-w-0 leading-tight">
        <p className="text-[16px] font-semibold tracking-[-0.02em] text-ink">失物招领</p>
        <p className="mt-0.5 text-[13px] leading-none text-muted-ink">校园管理系统</p>
      </div>
    </div>
  );
}

export function UserCard({ user }: { user: User }) {
  return (
    <div className="rounded-[14px] border border-hairline bg-surface p-3 text-xs text-muted-ink">
      <p className="font-medium text-ink">{user.nickname}</p>
      <p className="truncate">{user.email ?? "—"}</p>
      <p className="mt-1">角色：{user.role}</p>
    </div>
  );
}

export function Sidebar({ user }: { user: User }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[280px] flex-col border-r border-hairline bg-sidebar px-4 py-6 backdrop-blur-xl lg:flex">
      <BrandHeader />
      <NavList user={user} />
      <UserCard user={user} />
    </aside>
  );
}

export function MobileNav({
  user,
  open,
  onOpenChange,
}: {
  user: User;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[280px] border-hairline bg-sidebar p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>导航</SheetTitle>
        </SheetHeader>
        <div className="flex h-full flex-col px-4 py-6">
          <BrandHeader />
          <NavList user={user} onNavigate={() => onOpenChange(false)} />
          <UserCard user={user} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
