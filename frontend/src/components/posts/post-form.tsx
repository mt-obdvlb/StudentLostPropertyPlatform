"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DuplicateCheckHint } from "./duplicate-check-hint";
import { useCreatePostMutation, useDuplicateCheckMutation } from "@/lib/hooks/use-posts";
import { errorMessage } from "@/lib/utils/format";
import type { DuplicateCheckResult, PostType } from "@/lib/types";

const CATEGORIES = [
  "生活用品",
  "电子设备",
  "证件卡片",
  "书籍资料",
  "服饰配件",
  "钥匙",
  "其他",
];

const schema = z.object({
  title: z.string().min(2, "标题至少 2 字").max(100, "标题最多 100 字"),
  type: z.enum(["LOST", "FOUND"]),
  category: z.string().min(1, "请选择分类"),
  description: z
    .string()
    .min(10, "描述至少 10 字")
    .max(2000, "描述最多 2000 字"),
  imageUrl: z
    .string()
    .max(15_000_000, "图片数据过大，请压缩后上传（最大 15MB）")
    .optional()
    .or(z.literal("")),
  location: z.string().min(1, "请填写地点").max(128, "地点最多 128 字"),
  occurredAt: z.string().min(1, "请选择发生时间"),
  expiredAt: z.string().min(1, "请选择过期时间"),
  contact: z.string().min(1, "请填写联系方式").max(128, "联系方式最多 128 字"),
}).refine(
  (v) => new Date(v.expiredAt).getTime() > new Date(v.occurredAt).getTime(),
  {
    path: ["expiredAt"],
    message: "过期时间必须晚于发生时间",
  },
).refine(
  (v) => new Date(v.expiredAt).getTime() > Date.now(),
  { path: ["expiredAt"], message: "过期时间必须晚于当前时间" },
);

type FormValues = z.infer<typeof schema>;

function toIso(local: string): string {
  if (!local) return "";
  const d = new Date(local);
  if (Number.isNaN(d.getTime())) return local;
  return d.toISOString();
}

export function PostForm() {
  const router = useRouter();
  const [dup, setDup] = useState<DuplicateCheckResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const createPost = useCreatePostMutation();
  const dupCheck = useDuplicateCheckMutation();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      type: "FOUND",
      category: "",
      description: "",
      imageUrl: "",
      location: "",
      occurredAt: "",
      expiredAt: "",
      contact: "",
    },
  });

  const type = useWatch({ control, name: "type" });
  const category = useWatch({ control, name: "category" });
  const imageUrl = useWatch({ control, name: "imageUrl" });

  const buildPayload = (v: FormValues) => ({
    title: v.title,
    type: v.type,
    category: v.category,
    description: v.description,
    imageUrl: v.imageUrl || undefined,
    location: v.location,
    occurredAt: toIso(v.occurredAt),
    expiredAt: toIso(v.expiredAt),
    contact: v.contact,
  });

  const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
  const onFileSelected = (file: File | undefined) => {
    if (!file) {
      setValue("imageUrl", "");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("仅支持图片文件");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error("图片过大，请压缩后上传（最大 10MB）");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setValue("imageUrl", result, { shouldValidate: true });
      }
    };
    reader.onerror = () => toast.error("图片读取失败");
    reader.readAsDataURL(file);
  };

  const onConfirmDuplicate = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const created = await createPost.mutateAsync({
        ...buildPayload(values),
        confirmDuplicate: true,
      });
      toast.success("发布成功");
      router.push(`/posts/${created.id}`);
    } catch (err) {
      toast.error(errorMessage(err, "发布失败"));
      setDup(null);
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const result = await dupCheck.mutateAsync(buildPayload(values));
      if (result && result.matchedPost && result.level !== "NORMAL") {
        setDup(result);
        setSubmitting(false);
        return;
      }
      const created = await createPost.mutateAsync({
        ...buildPayload(values),
        confirmDuplicate: false,
      });
      toast.success("发布成功");
      router.push(`/posts/${created.id}`);
    } catch (err) {
      toast.error(errorMessage(err, "发布失败"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-3xl space-y-6"
    >
      <div>
        <h1 className="text-2xl font-semibold">发布失物 / 拾物信息</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          请如实填写，提交前会进行重复检测以避免重复发布。
        </p>
      </div>

      {dup && (
        <DuplicateCheckHint
          result={dup}
          loading={submitting}
          onCancel={() => {
            setDup(null);
            toast.info("已取消发布");
          }}
          onConfirm={handleSubmit(onConfirmDuplicate)}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>基础信息</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="title">标题</Label>
              <Input
                id="title"
                placeholder="例：图书馆捡到黑色雨伞"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-xs text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>类型</Label>
                <Select
                  value={type}
                  onValueChange={(v) => v && setValue("type", v as PostType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOST">寻物</SelectItem>
                    <SelectItem value="FOUND">招领</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-xs text-destructive">
                    {errors.type.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>分类</Label>
                <Select
                  value={category}
                  onValueChange={(v) => v && setValue("category", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择分类" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-xs text-destructive">
                    {errors.category.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">详细描述</Label>
              <Textarea
                id="description"
                rows={5}
                placeholder="颜色、形状、特征、品牌等可识别信息"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-xs text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="imageUrl">图片（可选，最大 10MB）</Label>
              <Input
                id="imageUrl"
                type="file"
                accept="image/*"
                onChange={(e) => onFileSelected(e.target.files?.[0])}
              />
              {imageUrl && (
                <div className="mt-2 flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="预览"
                    className="size-20 rounded-md border border-border object-cover"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setValue("imageUrl", "")}
                  >
                    移除图片
                  </Button>
                </div>
              )}
              {errors.imageUrl && (
                <p className="text-xs text-destructive">
                  {errors.imageUrl.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                选择本地图片后将以 Base64 编码直接保存到数据库。
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="location">地点</Label>
                <Input
                  id="location"
                  placeholder="例：图书馆二楼"
                  {...register("location")}
                />
                {errors.location && (
                  <p className="text-xs text-destructive">
                    {errors.location.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contact">联系方式</Label>
                <Input
                  id="contact"
                  placeholder="站内信 / 邮箱 / 手机号"
                  {...register("contact")}
                />
                {errors.contact && (
                  <p className="text-xs text-destructive">
                    {errors.contact.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="occurredAt">发生时间</Label>
                <Input
                  id="occurredAt"
                  type="datetime-local"
                  {...register("occurredAt")}
                />
                {errors.occurredAt && (
                  <p className="text-xs text-destructive">
                    {errors.occurredAt.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="expiredAt">过期时间</Label>
                <Input
                  id="expiredAt"
                  type="datetime-local"
                  {...register("expiredAt")}
                />
                {errors.expiredAt && (
                  <p className="text-xs text-destructive">
                    {errors.expiredAt.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={submitting}
              >
                取消
              </Button>
              <Button type="submit" disabled={submitting || isSubmitting}>
                {submitting ? "提交中…" : "提交并检测重复"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
