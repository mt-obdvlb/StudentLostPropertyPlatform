"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegisterMutation } from "@/lib/hooks/use-auth";
import { errorMessage } from "@/lib/utils/format";
import { useAuthStore } from "@/lib/store/auth-store";

const schema = z.object({
  username: z
    .string()
    .min(3, "用户名至少 3 位")
    .max(32, "用户名最多 32 位")
    .regex(/^[a-zA-Z0-9_]+$/, "仅支持字母、数字、下划线"),
  nickname: z.string().min(1, "请输入昵称").max(64, "昵称最多 64 位"),
  email: z.string().email("邮箱格式不正确"),
  phone: z
    .string()
    .optional()
    .refine(
      (v) => !v || /^1[3-9]\d{9}$/.test(v),
      "手机号格式不正确",
    ),
  password: z
    .string()
    .min(6, "密码至少 6 位")
    .max(64, "密码最多 64 位"),
  confirm: z.string(),
}).refine((v) => v.password === v.confirm, {
  path: ["confirm"],
  message: "两次密码不一致",
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const registerMutation = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      nickname: "",
      email: "",
      phone: "",
      password: "",
      confirm: "",
    },
  });

  useEffect(() => {
    if (token) router.replace("/");
  }, [token, router]);

  const onSubmit = async (values: FormValues) => {
    try {
      await registerMutation.mutateAsync({
        username: values.username,
        nickname: values.nickname,
        email: values.email,
        phone: values.phone || undefined,
        password: values.password,
      });
      toast.success("注册成功，已自动登录");
      router.replace("/");
    } catch (err) {
      toast.error(errorMessage(err, "注册失败"));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="username">用户名</Label>
        <Input id="username" autoComplete="username" {...register("username")} />
        {errors.username && (
          <p className="text-xs text-destructive">{errors.username.message}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="nickname">昵称</Label>
        <Input id="nickname" {...register("nickname")} />
        {errors.nickname && (
          <p className="text-xs text-destructive">{errors.nickname.message}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">邮箱</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="phone">手机号（可选）</Label>
        <Input id="phone" autoComplete="tel" {...register("phone")} />
        {errors.phone && (
          <p className="text-xs text-destructive">{errors.phone.message}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="password">密码</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirm">确认密码</Label>
          <Input
            id="confirm"
            type="password"
            autoComplete="new-password"
            {...register("confirm")}
          />
          {errors.confirm && (
            <p className="text-xs text-destructive">
              {errors.confirm.message}
            </p>
          )}
        </div>
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || registerMutation.isPending}
      >
        {registerMutation.isPending ? "注册中…" : "注册并登录"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        已有账号？{" "}
        <Link
          href="/login"
          className="text-primary underline-offset-4 hover:underline"
        >
          前往登录
        </Link>
      </p>
    </form>
  );
}
