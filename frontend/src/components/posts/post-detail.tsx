"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  Tag,
  User as UserIcon,
  Phone,
  CalendarClock,
  History,
  ArrowLeft,
  HandHelping,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PostTypeBadge } from "./post-type-badge";
import { PostStatusBadge } from "./post-status-badge";
import { ExpiryCountdown } from "./expiry-countdown";
import { ClaimDialog } from "@/components/claims/claim-dialog";
import { formatDate } from "@/lib/utils/format";
import { useAuthStore } from "@/lib/store/auth-store";
import { useMyClaimsQuery } from "@/lib/hooks/use-claims";
import type { ClaimStatus, Post } from "@/lib/types";

export function PostDetail({ post }: { post: Post }) {
  const [now, setNow] = useState(() => Date.now());
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const myClaims = useMyClaimsQuery({ page: 1, pageSize: 100 });
  const existingClaim = myClaims.data?.records.find(
    (claim) => claim.postId === post.id && claim.status !== "CANCELLED",
  );

  const isOwner = !!user && user.id === post.ownerId;
  const isExpired =
    post.status === "EXPIRED" || new Date(post.expiredAt).getTime() <= now;

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(timer);
  }, []);
  const canClaim =
    post.type === "FOUND" &&
    post.status === "PROCESSING" &&
    !isExpired &&
    !existingClaim &&
    !!user &&
    !isOwner;
  const needLogin =
    !token &&
    post.type === "FOUND" &&
    post.status === "PROCESSING" &&
    !isExpired;

  const claimTrigger = (
    <Button
      disabled={!canClaim && !needLogin}
      variant={needLogin ? "outline" : "default"}
    >
      <HandHelping className="mr-2 size-4" />
      {needLogin ? "登录后申请认领" : "申请认领"}
    </Button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <Button
          nativeButton={false}
          variant="ghost"
          size="sm"
          render={<Link href="/posts" />}
        >
          <ArrowLeft className="mr-1 size-4" />
          返回列表
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardContent className="p-0">
            <div className="aspect-[16/10] w-full overflow-hidden rounded-t-2xl bg-muted">
              {post.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
                  暂无图片
                </div>
              )}
            </div>
            <div className="space-y-4 p-6">
              <div className="flex flex-wrap items-center gap-2">
                <PostTypeBadge type={post.type} />
                <PostStatusBadge status={post.status} />
                <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  <Tag className="size-3" />
                  {post.category}
                </span>
              </div>
              <h1 className="text-2xl font-semibold leading-tight">
                {post.title}
              </h1>
              <p className="whitespace-pre-wrap text-sm leading-7 text-foreground/90">
                {post.description}
              </p>
              <ExpiryCountdown expiredAt={post.expiredAt} status={post.status} />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">物品信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <InfoRow icon={MapPin} label="地点" value={post.location} />
              <InfoRow
                icon={Clock}
                label="发生时间"
                value={formatDate(post.occurredAt)}
              />
              <InfoRow
                icon={Phone}
                label="联系方式"
                value={post.contact}
              />
              <Separator />
              <InfoRow
                icon={UserIcon}
                label="发布者"
                value={post.ownerName ?? `#${post.ownerId}`}
              />
              <InfoRow
                icon={CalendarClock}
                label="发布时间"
                value={formatDate(post.createdAt)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">操作</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {canClaim ? (
                <ClaimDialog post={post} trigger={claimTrigger} />
              ) : needLogin ? (
                <Button
                  variant="outline"
                  className="w-full"
                  render={
                    <Link
                      href={`/login?from=${encodeURIComponent(`/posts/${post.id}`)}`}
                    />
                  }
                >
                  登录后申请认领
                </Button>
              ) : existingClaim ? (
                <p className="text-xs text-muted-foreground">
                  你已提交认领申请，当前状态：{claimStatusLabel(existingClaim.status)}。
                </p>
              ) : post.type === "LOST" ? (
                <p className="text-xs text-muted-foreground">
                  失物信息不开放在线认领，请联系发布者。
                </p>
              ) : post.status === "CLAIMED" ? (
                <p className="text-xs text-muted-foreground">
                  该物品已被认领。
                </p>
              ) : isExpired ? (
                <p className="text-xs text-muted-foreground">
                  该物品已过期，无法申请认领。
                </p>
              ) : post.status === "REMOVED" ? (
                <p className="text-xs text-muted-foreground">
                  该物品已被管理员下架。
                </p>
              ) : isOwner ? (
                <p className="text-xs text-muted-foreground">
                  这是你发布的物品，不能自己认领。
                </p>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <History className="size-4" />
                状态时间线
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 text-xs">
                <TimelineItem
                  label="发布"
                  time={formatDate(post.createdAt)}
                  active
                />
                <TimelineItem
                  label={statusLabel(post.status)}
                  time={
                    post.status === "PROCESSING"
                      ? "进行中"
                      : formatDate(post.updatedAt)
                  }
                  tone={
                    post.status === "CLAIMED"
                      ? "text-apple-green-text"
                      : post.status === "EXPIRED"
                        ? "text-muted-ink"
                        : post.status === "REMOVED"
                          ? "text-apple-red-text"
                          : "text-apple-blue"
                  }
                />
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

function claimStatusLabel(status: ClaimStatus) {
  const map: Record<ClaimStatus, string> = {
    PENDING: "待审核",
    APPROVED: "已通过",
    REJECTED: "已驳回",
    CANCELLED: "已取消",
  };
  return map[status];
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 size-4 text-muted-foreground" />
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

function TimelineItem({
  label,
  time,
  active,
  tone,
}: {
  label: string;
  time: string;
  active?: boolean;
  tone?: string;
}) {
  return (
    <li className="flex items-center gap-3">
      <span
        className={`size-2 rounded-full ${
          active ? "bg-primary" : tone ? "bg-current" : "bg-muted-foreground/40"
        } ${tone ?? ""}`}
      />
      <span className="font-medium">{label}</span>
      <span className="ml-auto text-muted-foreground">{time}</span>
    </li>
  );
}

function statusLabel(status: Post["status"]): string {
  switch (status) {
    case "PROCESSING":
      return "寻找 / 等待认领";
    case "CLAIMED":
      return "已认领";
    case "EXPIRED":
      return "已过期";
    case "REMOVED":
      return "已下架";
  }
}
