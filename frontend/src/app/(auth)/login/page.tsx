"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/lib/hooks/use-auth";
import { errorMessage } from "@/lib/utils/format";
import { useAuthStore } from "@/lib/store/auth-store";

const schema = z.object({
  username: z.string().min(1, "请输入用户名"),
  password: z.string().min(6, "密码至少 6 位"),
});

type FormValues = z.infer<typeof schema>;

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") ?? "/";
  const token = useAuthStore((s) => s.token);
  const login = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: "", password: "" },
  });

  useEffect(() => {
    if (token) router.replace(from);
  }, [token, from, router]);

  const onSubmit = async (values: FormValues) => {
    try {
      await login.mutateAsync(values);
      toast.success("登录成功");
      router.replace(from);
    } catch (err) {
      toast.error(errorMessage(err, "登录失败"));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="username">用户名</Label>
        <Input
          id="username"
          autoComplete="username"
          placeholder="admin / user1 / user2"
          {...register("username")}
        />
        {errors.username && (
          <p className="text-xs text-destructive">{errors.username.message}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">密码</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || login.isPending}
      >
        {login.isPending ? "登录中…" : "登录"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        还没有账号？{" "}
        <Link
          href="/register"
          className="text-primary underline-offset-4 hover:underline"
        >
          立即注册
        </Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm">加载中…</div>}>
      <LoginInner />
    </Suspense>
  );
}
