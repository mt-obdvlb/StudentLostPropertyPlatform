"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import type { PostStatus, PostType, SortBy } from "@/lib/types";

export type PostFilters = {
  keyword: string;
  type: PostType | "ALL";
  status: PostStatus | "ALL";
  location: string;
  sortBy: SortBy;
};

export function FilterBar({
  value,
  onChange,
  className,
}: {
  value: PostFilters;
  onChange: (next: PostFilters) => void;
  className?: string;
}) {
  const update = <K extends keyof PostFilters>(key: K, v: PostFilters[K]) =>
    onChange({ ...value, [key]: v });

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-border bg-card p-4 lg:flex-row lg:items-center",
        className,
      )}
    >
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value.keyword}
          onChange={(e) => update("keyword", e.target.value)}
          placeholder="搜索标题或描述"
          className="pl-9"
        />
      </div>
      <div className="grid grid-cols-2 gap-3 lg:flex lg:items-center">
        <Select
          value={value.type}
          onValueChange={(v) => update("type", v as PostFilters["type"])}
        >
          <SelectTrigger className="w-full lg:w-[140px]">
            <SelectValue placeholder="类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">全部类型</SelectItem>
            <SelectItem value="LOST">寻物</SelectItem>
            <SelectItem value="FOUND">招领</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={value.status}
          onValueChange={(v) => update("status", v as PostFilters["status"])}
        >
          <SelectTrigger className="w-full lg:w-[140px]">
            <SelectValue placeholder="状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">全部状态</SelectItem>
            <SelectItem value="PROCESSING">进行中</SelectItem>
            <SelectItem value="CLAIMED">已认领</SelectItem>
            <SelectItem value="EXPIRED">已过期</SelectItem>
          </SelectContent>
        </Select>
        <Input
          value={value.location}
          onChange={(e) => update("location", e.target.value)}
          placeholder="地点"
          className="w-full lg:w-[160px]"
        />
        <Select
          value={value.sortBy}
          onValueChange={(v) => update("sortBy", v as SortBy)}
        >
          <SelectTrigger className="w-full lg:w-[160px]">
            <SelectValue placeholder="排序" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAtDesc">最新发布</SelectItem>
            <SelectItem value="updatedAtDesc">最近更新</SelectItem>
            <SelectItem value="expiredAtAsc">即将过期</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
        variant="outline"
        onClick={() =>
          onChange({
            keyword: "",
            type: "ALL",
            status: "ALL",
            location: "",
            sortBy: "createdAtDesc",
          })
        }
      >
        重置
      </Button>
    </div>
  );
}
