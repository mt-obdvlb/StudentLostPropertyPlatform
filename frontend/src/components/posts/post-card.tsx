"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Clock, CalendarClock, ImageOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PostTypeBadge } from "./post-type-badge";
import { PostStatusBadge } from "./post-status-badge";
import { formatDateShort } from "@/lib/utils/format";
import type { Post } from "@/lib/types";

export function PostCard({ post, index = 0 }: { post: Post; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.3) }}
      whileHover={{ y: -4 }}
    >
      <Link href={`/posts/${post.id}`} className="block">
        <Card className="h-full overflow-hidden border-hairline bg-white shadow-none transition-colors hover:border-apple-blue/40">
          <div className="aspect-[4/3] w-full overflow-hidden bg-canvas">
            {post.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.imageUrl}
                alt={post.title}
                className="size-full object-cover transition-transform duration-300 hover:scale-105"
              />
            ) : (
              <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-ink-light">
                <ImageOff className="size-7" />
                <span className="text-xs">暂无图片</span>
              </div>
            )}
          </div>
          <CardContent className="space-y-3 p-5">
            <div className="flex items-center gap-2">
              <PostTypeBadge type={post.type} />
              <PostStatusBadge status={post.status} />
              <span className="ml-auto text-xs text-muted-ink-light">
                {post.category}
              </span>
            </div>
            <h3 className="line-clamp-2 text-[17px] font-semibold leading-snug tracking-[-0.02em] text-ink">
              {post.title}
            </h3>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-ink">
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3" />
                {post.location}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3" />
                {formatDateShort(post.occurredAt)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-hairline-soft pt-2 text-xs">
              <span className="inline-flex items-center gap-1 text-muted-ink">
                <CalendarClock className="size-3" />
                {formatDateShort(post.expiredAt)} 过期
              </span>
              <span className="text-muted-ink-light">
                {post.ownerName ?? `#${post.ownerId}`}
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
