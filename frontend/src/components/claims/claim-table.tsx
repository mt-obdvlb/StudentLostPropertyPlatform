"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ClaimStatusBadge } from "./claim-status-badge";
import { formatDate } from "@/lib/utils/format";
import type { Claim } from "@/lib/types";

export function ClaimTable({
  claims,
  onCancel,
  cancelingId,
}: {
  claims: Claim[];
  onCancel?: (claim: Claim) => void;
  cancelingId?: number | null;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="overflow-x-auto rounded-xl border border-border bg-card"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[220px]">物品</TableHead>
            <TableHead className="min-w-[240px]">认领理由</TableHead>
            <TableHead className="w-[100px]">状态</TableHead>
            <TableHead className="w-[200px]">审核备注</TableHead>
            <TableHead className="w-[160px]">申请时间</TableHead>
            <TableHead className="w-[120px] text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {claims.map((c) => (
            <TableRow key={c.id}>
              <TableCell>
                <Link
                  href={`/posts/${c.postId}`}
                  className="line-clamp-1 font-medium hover:text-primary hover:underline"
                >
                  {c.postTitle}
                </Link>
                <p className="text-xs text-muted-foreground">
                  申请人：{c.claimerName}
                </p>
              </TableCell>
              <TableCell>
                <p className="line-clamp-2 text-xs text-muted-foreground">
                  {c.reason}
                </p>
              </TableCell>
              <TableCell>
                <ClaimStatusBadge status={c.status} />
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {c.reviewComment ?? "—"}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatDate(c.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                {c.status === "PENDING" && onCancel ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCancel(c)}
                    disabled={cancelingId === c.id}
                  >
                    {cancelingId === c.id ? "处理中…" : "取消申请"}
                  </Button>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}
