"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, CalendarClock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export function ExpiryCountdown({
  expiredAt,
  status,
  className,
}: {
  expiredAt: string;
  status: "PROCESSING" | "CLAIMED" | "EXPIRED" | "REMOVED";
  className?: string;
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);

  const target = new Date(expiredAt).getTime();
  const diff = target - now;
  const expired = diff <= 0;

  const tone =
    status !== "PROCESSING"
      ? "text-muted-ink"
      : expired
        ? "text-muted-ink"
        : diff < 24 * 60 * 60 * 1000
          ? "text-apple-red-text"
          : diff < 3 * 24 * 60 * 60 * 1000
            ? "text-apple-amber-text"
            : "text-apple-green-text";

  const label =
    status === "CLAIMED"
      ? "已认领"
      : status === "EXPIRED" || expired
        ? "已过期"
        : status === "REMOVED"
          ? "已下架"
          : formatRemaining(diff);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-hairline bg-surface px-3 py-2 text-sm",
        className,
      )}
    >
      <motion.span
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={cn("inline-flex items-center gap-1.5 font-medium", tone)}
      >
        {status === "PROCESSING" && !expired ? (
          <Clock className="size-4" />
        ) : (
          <CalendarClock className="size-4" />
        )}
        {label}
      </motion.span>
      <span className="text-xs text-muted-ink">
        过期时间 {new Date(expiredAt).toLocaleString("zh-CN")}
      </span>
    </div>
  );
}

function formatRemaining(ms: number): string {
  const sec = Math.floor(ms / 1000);
  const day = Math.floor(sec / 86400);
  const hour = Math.floor((sec % 86400) / 3600);
  const minute = Math.floor((sec % 3600) / 60);
  if (day > 0) return `剩余 ${day} 天 ${hour} 小时`;
  if (hour > 0) return `剩余 ${hour} 小时 ${minute} 分钟`;
  return `即将过期（${minute} 分钟）`;
}

export function ExpiryWarning({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-apple-amber-text/20 bg-apple-orange-soft px-3 py-2 text-xs text-apple-amber-text">
      <AlertTriangle className="size-4" />
      {message}
    </div>
  );
}
