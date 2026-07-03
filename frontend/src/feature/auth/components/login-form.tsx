"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { loginSchema, type LoginInput } from "../schemas/auth.schema";
import { loginUser } from "../api/auth.api";
import { useAuthStore } from "../stores/auth-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useAuthStore();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const rememberMe = useWatch({ control: form.control, name: "rememberMe" });

  const onSubmit = async (data: LoginInput) => {
    try {
      const response = await loginUser(data);
      setUser(response.user);
      toast.success("Đăng nhập vào LingoFlow thành công!");
      
      if (response.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error) {
      toast.error(
        // @ts-expect-error - Error from axios response
        error.response?.data?.error || "Đăng nhập thất bại!"
      );
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      {/* Email field */}
      <div className="space-y-1.5">
        <Label htmlFor="login-email" className="text-[13px] font-semibold text-[#374151]">
          Địa chỉ Email
        </Label>
        <div className="relative flex items-center">
          <Mail className="absolute left-[14px] h-4 w-4 text-[#6B7280] pointer-events-none" />
          <Input
            id="login-email"
            type="email"
            placeholder="name@example.com"
            autoComplete="username"
            className="h-[46px] pl-[42px] pr-4 rounded-[10px] border-[#E5E7EB] bg-[#FAFAFA] text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus-visible:border-[#4F46E5] focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-[#4F46E5]/10"
            {...form.register("email")}
          />
        </div>
        {form.formState.errors.email && (
          <p className="text-xs font-medium text-red-500">{form.formState.errors.email.message}</p>
        )}
      </div>

      {/* Password field */}
      <div className="space-y-1.5">
        <Label htmlFor="login-password" className="text-[13px] font-semibold text-[#374151]">
          Mật khẩu
        </Label>
        <div className="relative flex items-center">
          <Lock className="absolute left-[14px] h-4 w-4 text-[#6B7280] pointer-events-none" />
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            className="h-[46px] pl-[42px] pr-10 rounded-[10px] border-[#E5E7EB] bg-[#FAFAFA] text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus-visible:border-[#4F46E5] focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-[#4F46E5]/10"
            {...form.register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-[14px] text-[#6B7280] hover:text-[#1F2937] focus:outline-none transition-colors p-1"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {form.formState.errors.password && (
          <p className="text-xs font-medium text-red-500">{form.formState.errors.password.message}</p>
        )}
      </div>

      {/* Options row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            id="rememberMe"
            checked={rememberMe}
            onCheckedChange={(checked) => form.setValue("rememberMe", !!checked)}
            className="data-checked:bg-[#4F46E5] data-checked:border-[#4F46E5]"
          />
          <Label htmlFor="rememberMe" className="text-[13px] text-[#6B7280] font-normal cursor-pointer">
            Ghi nhớ đăng nhập
          </Label>
        </div>
        <button
          type="button"
          onClick={() => toast.info("Tính năng khôi phục đang được bảo trì!")}
          className="text-[13px] font-medium text-[#4F46E5] hover:underline focus:outline-none"
        >
          Quên mật khẩu?
        </button>
      </div>

      {/* Submit button */}
      <Button
        type="submit"
        className="w-full h-[48px] rounded-[10px] bg-[#4F46E5] hover:bg-[#4338CA] text-white text-[15px] font-semibold shadow-[0_4px_12px_rgba(79,70,229,0.15)] hover:-translate-y-px transition-all duration-200 cursor-pointer"
      >
        <span>Đăng nhập</span>
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
}
