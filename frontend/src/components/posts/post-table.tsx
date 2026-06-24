"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Clock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PostTypeBadge } from "./post-type-badge";
import { PostStatusBadge } from "./post-status-badge";
import { formatDate } from "@/lib/utils/format";
import type { Post } from "@/lib/types";

export function PostTable({ posts }: { posts: Post[] }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="rounded-xl border border-border bg-card"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">类型</TableHead>
            <TableHead className="min-w-[200px]">标题</TableHead>
            <TableHead className="w-[100px]">分类</TableHead>
            <TableHead className="w-[140px]">地点</TableHead>
            <TableHead className="w-[100px]">状态</TableHead>
            <TableHead className="w-[160px]">发布时间</TableHead>
            <TableHead className="w-[100px]">发布者</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((p) => (
            <TableRow key={p.id}>
              <TableCell>
                <PostTypeBadge type={p.type} />
              </TableCell>
              <TableCell>
                <Link
                  href={`/posts/${p.id}`}
                  className="line-clamp-1 font-medium hover:text-primary hover:underline"
                >
                  {p.title}
                </Link>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {p.category}
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3" />
                  {p.location}
                </span>
              </TableCell>
              <TableCell>
                <PostStatusBadge status={p.status} />
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3" />
                  {formatDate(p.createdAt)}
                </span>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {p.ownerName ?? `#${p.ownerId}`}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}
