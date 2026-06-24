"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useCreateClaimMutation } from "@/lib/hooks/use-claims";
import { errorMessage } from "@/lib/utils/format";
import type { Post } from "@/lib/types";

const schema = z.object({
  reason: z
    .string()
    .min(10, "请详细描述认领理由（至少 10 字）")
    .max(512, "理由最多 512 字"),
  proofDescription: z
    .string()
    .min(5, "请提供至少 5 字的证明说明")
    .max(1000, "证明最多 1000 字"),
});

type FormValues = z.infer<typeof schema>;

export function ClaimDialog({
  post,
  trigger,
}: {
  post: Post;
  trigger: React.ReactNode;
}) {
  const router = useRouter();
  const createClaim = useCreateClaimMutation();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { reason: "", proofDescription: "" },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await createClaim.mutateAsync({
        postId: post.id,
        reason: values.reason,
        proofDescription: values.proofDescription,
      });
      toast.success("认领申请已提交，等待管理员审核");
      reset();
      setOpen(false);
      router.push("/claims");
    } catch (err) {
      toast.error(errorMessage(err, "提交失败"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<span />}>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>申请认领：{post.title}</DialogTitle>
          <DialogDescription>
            请描述物品独有特征以供管理员核对。提交后将进入待审核队列。
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="reason">认领理由 *</Label>
            <Textarea
              id="reason"
              rows={4}
              placeholder="例：物品颜色、品牌、特殊标记等可识别信息"
              {...register("reason")}
            />
            {errors.reason && (
              <p className="text-xs text-destructive">
                {errors.reason.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="proofDescription">证明说明 *</Label>
            <Textarea
              id="proofDescription"
              rows={3}
              placeholder="可附上购入凭证、照片 URL 等信息"
              {...register("proofDescription")}
            />
            {errors.proofDescription && (
              <p className="text-xs text-destructive">
                {errors.proofDescription.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <DialogClose
              render={<Button type="button" variant="outline" />}
            >
              取消
            </DialogClose>
            <Button type="submit" disabled={isSubmitting || createClaim.isPending}>
              {createClaim.isPending ? "提交中…" : "提交申请"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
