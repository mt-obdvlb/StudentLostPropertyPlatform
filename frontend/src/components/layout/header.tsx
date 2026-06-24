"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Menu,
  Search,
  LogOut,
  User as UserIcon,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogoutMutation } from "@/lib/hooks/use-auth";
import {
  useNotificationsQuery,
  useMarkAllNotificationsReadMutation,
} from "@/lib/hooks/use-notifications";
import { errorMessage, formatRelativeTime } from "@/lib/utils/format";
import { toast } from "sonner";
import type { User } from "@/lib/types";

export function Header({
  user,
  onMenuClick,
}: {
  user: User;
  onMenuClick: () => void;
}) {
  const router = useRouter();
  const logout = useLogoutMutation();
  const [search, setSearch] = useState("");
  const { data: notifData } = useNotificationsQuery({ page: 1, pageSize: 8 });
  const { data: unreadData } = useNotificationsQuery({
    readStatus: 0,
    page: 1,
    pageSize: 1,
  });
  const markAll = useMarkAllNotificationsReadMutation();

  const initials = user.nickname.slice(0, 1).toUpperCase();
  const unread = unreadData?.total ?? 0;

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    router.push(q ? `/posts?keyword=${encodeURIComponent(q)}` : "/posts");
  };

  const onLogout = async () => {
    try {
      await logout.mutateAsync();
      toast.success("已登出");
      router.replace("/login");
    } catch (err) {
      toast.error(errorMessage(err, "登出失败"));
    }
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-hairline bg-background/80 px-4 backdrop-blur-xl md:px-8">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
        aria-label="打开菜单"
      >
        <Menu className="size-5" />
      </Button>

      <form
        onSubmit={onSearchSubmit}
        className="relative hidden flex-1 max-w-md sm:block"
      >
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-ink-light" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索失物 / 拾物"
          className="h-11 rounded-full border-hairline bg-surface/80 pl-11 text-[15px] text-ink shadow-none placeholder:text-muted-ink-light focus-visible:border-apple-blue focus-visible:ring-2 focus-visible:ring-apple-blue/10"
        />
      </form>

      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label="通知"
              />
            }
          >
            <Bell className="size-5" />
            {unread > 0 && (
              <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-apple-red text-[10px] text-white">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm font-semibold text-ink">通知</span>
              <button
                className="text-xs text-apple-blue hover:underline disabled:opacity-50"
                disabled={markAll.isPending || unread === 0}
                onClick={() => markAll.mutate()}
              >
                全部已读
              </button>
            </div>
            <DropdownMenuSeparator />
            {notifData?.records.length ? (
              notifData.records.slice(0, 6).map((n) => (
                <DropdownMenuItem
                  key={n.id}
                  className="flex flex-col items-start py-2"
                >
                  <div className="flex w-full items-center justify-between gap-2">
                    <span className="text-sm font-medium text-ink">{n.title}</span>
                    {n.readStatus === 0 && (
                      <span className="size-1.5 rounded-full bg-apple-blue" />
                    )}
                  </div>
                  <span className="line-clamp-2 text-xs text-muted-ink">
                    {n.content}
                  </span>
                  <span className="text-[10px] text-muted-ink-light">
                    {formatRelativeTime(n.createdAt)}
                  </span>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="px-3 py-6 text-center text-xs text-muted-ink-light">
                暂无通知
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                className="flex items-center gap-2 rounded-full px-1 py-1 hover:bg-canvas"
                aria-label="用户菜单"
              />
            }
          >
            <Avatar className="size-8">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>
              <p className="text-sm font-medium text-ink">{user.nickname}</p>
              <p className="text-xs text-muted-ink">@{user.username}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/claims" />}>
              <Inbox className="mr-2 size-4" />
              我的认领
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/posts/create" />}>
              <UserIcon className="mr-2 size-4" />
              发布信息
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-apple-red-text">
              <LogOut className="mr-2 size-4" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
