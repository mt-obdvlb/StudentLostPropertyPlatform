"use client";

import { motion } from "framer-motion";
import {
  Boxes,
  Clock,
  CheckCircle2,
  CalendarX2,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { AdminStats } from "@/lib/types";

type Stat = {
  label: string;
  value: number;
  icon: LucideIcon;
  tone: string;
  highlight?: boolean;
};

export function AdminStatsCards({ stats }: { stats: AdminStats }) {
  const items: Stat[] = [
    {
      label: "总发布",
      value: stats.lostPostCount + stats.foundPostCount,
      icon: Boxes,
      tone: "bg-apple-blue-soft text-apple-blue",
    },
    {
      label: "进行中",
      value: stats.processingPostCount,
      icon: Clock,
      tone: "bg-apple-orange-soft text-apple-amber-text",
      highlight: true,
    },
    {
      label: "已认领",
      value: stats.claimedPostCount,
      icon: CheckCircle2,
      tone: "bg-apple-green-soft text-apple-green-text",
    },
    {
      label: "已过期",
      value: stats.expiredPostCount,
      icon: CalendarX2,
      tone: "bg-canvas text-muted-ink",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Card
              className={
                item.highlight
                  ? "rounded-[24px] border-hairline bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                  : "rounded-[24px] border-hairline bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
              }
            >
              <CardContent className="flex flex-col gap-4 p-0">
                <div
                  className={`flex size-12 items-center justify-center rounded-full ${item.tone}`}
                >
                  <Icon className="size-5" />
                </div>
                <div className="leading-tight">
                  <p className="text-[15px] font-medium text-muted-ink">
                    {item.label}
                  </p>
                  <p className="mt-1 text-[44px] font-semibold tracking-[-0.04em] text-ink">
                    {item.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
