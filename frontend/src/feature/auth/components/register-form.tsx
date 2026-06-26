"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Lock, Eye, EyeOff, UserPlus, CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { registerSchema, type RegisterInput } from "../schemas/auth.schema";
import { registerUser } from "../api/auth.api";
import { useAuthStore } from "../stores/auth-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface RegisterFormProps {
  onSuccess: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const { setUser } = useAuthStore();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", password: "", terms: undefined },
    mode: "onChange",
  });

  const passwordValue = useWatch({ control: form.control, name: "password" }) || "";
  const termsValue = useWatch({ control: form.control, name: "terms" });

  // Real-time password requirement validators (matching login.html)
  const requirements = [
    { isValid: passwordValue.length >= 8, label: "Ít nhất 8 ký tự" },
    { isValid: /[A-Z]/.test(passwordValue), label: "Có ít nhất 1 chữ hoa" },
    {
      isValid: /[0-9]/.test(passwordValue) || /[^A-Za-z0-9]/.test(passwordValue),
      label: "Có ít nhất 1 số hoặc ký tự đặc biệt",
    },
  ];

  const onSubmit = async (data: RegisterInput) => {
    try {
      const response = await registerUser(data);
      setUser(response.user);
      toast.success("Tạo tài khoản LingoFlow thành công!");
      router.push("/dashboard");
      onSuccess?.();
    } catch (error) {
      toast.error(
        // @ts-expect-error - Error from axios response
        error.response?.data?.error || "Đăng ký thất bại!"
      );
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* Full name field */}
      <div className="space-y-1.5">
        <Label htmlFor="register-name" className="text-[13px] font-semibold text-[#374151]">
          Họ và tên
        </Label>
        <div className="relative flex items-center">
          <User className="absolute left-[14px] h-4 w-4 text-[#6B7280] pointer-events-none" />
          <Input
            id="register-name"
            type="text"
            placeholder="Nguyễn Văn A"
            className="h-[44px] pl-[42px] pr-4 rounded-[10px] border-[#E5E7EB] bg-[#FAFAFA] text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus-visible:border-[#4F46E5] focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-[#4F46E5]/10"
            {...form.register("fullName")}
          />
        </div>
        {form.formState.errors.fullName && (
          <p className="text-xs font-medium text-red-500">{form.formState.errors.fullName.message}</p>
        )}
      </div>

      {/* Email field */}
      <div className="space-y-1.5">
        <Label htmlFor="register-email" className="text-[13px] font-semibold text-[#374151]">
          Địa chỉ Email
        </Label>
        <div className="relative flex items-center">
          <Mail className="absolute left-[14px] h-4 w-4 text-[#6B7280] pointer-events-none" />
          <Input
            id="register-email"
            type="email"
            placeholder="name@example.com"
            className="h-[44px] pl-[42px] pr-4 rounded-[10px] border-[#E5E7EB] bg-[#FAFAFA] text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus-visible:border-[#4F46E5] focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-[#4F46E5]/10"
            {...form.register("email")}
          />
        </div>
        {form.formState.errors.email && (
          <p className="text-xs font-medium text-red-500">{form.formState.errors.email.message}</p>
        )}
      </div>

      {/* Password field */}
      <div className="space-y-1.5">
        <Label htmlFor="register-password" className="text-[13px] font-semibold text-[#374151]">
          Mật khẩu
        </Label>
        <div className="relative flex items-center">
          <Lock className="absolute left-[14px] h-4 w-4 text-[#6B7280] pointer-events-none" />
          <Input
            id="register-password"
            type={showPassword ? "text" : "password"}
            placeholder="Tối thiểu 8 ký tự"
            className="h-[44px] pl-[42px] pr-10 rounded-[10px] border-[#E5E7EB] bg-[#FAFAFA] text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus-visible:border-[#4F46E5] focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-[#4F46E5]/10"
            {...form.register("password")}
            onFocus={() => setIsPasswordFocused(true)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-[14px] text-[#6B7280] hover:text-[#1F2937] focus:outline-none transition-colors p-1"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {/* Real-time password validation checklist (matching login.html) */}
        {isPasswordFocused && (
          <div className="mt-2 bg-[#F3F4F6] p-[10px_14px] rounded-[8px] space-y-1 transition-all duration-300">
            {requirements.map((req, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-1.5 text-[11px] transition-colors duration-200 ${
                  req.isValid ? "text-[#10B981] font-medium" : "text-[#6B7280]"
                }`}
              >
                {req.isValid ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" />
                ) : (
                  <Circle className="h-3.5 w-3.5 text-[#D1D5DB]" />
                )}
                <span>{req.label}</span>
              </div>
            ))}
          </div>
        )}
        {form.formState.errors.password && !isPasswordFocused && (
          <p className="text-xs font-medium text-red-500">{form.formState.errors.password.message}</p>
        )}
      </div>

      {/* Terms checkbox */}
      <div className="space-y-1.5">
        <label className="flex items-start gap-2 cursor-pointer text-[12px] text-[#6B7280]">
          <Checkbox
            id="terms"
            checked={!!termsValue}
            onCheckedChange={(checked) => form.setValue("terms", checked as true)}
            className="mt-0.5 data-checked:bg-[#4F46E5] data-checked:border-[#4F46E5]"
          />
          <span className="leading-relaxed">
            Tôi đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của LingoFlow.
          </span>
        </label>
        {form.formState.errors.terms && (
          <p className="text-xs font-medium text-red-500">{form.formState.errors.terms.message}</p>
        )}
      </div>

      {/* Submit button */}
      <Button
        type="submit"
        className="w-full h-[46px] rounded-[10px] bg-[#4F46E5] hover:bg-[#4338CA] text-white text-[15px] font-semibold shadow-[0_4px_12px_rgba(79,70,229,0.15)] hover:-translate-y-px transition-all duration-200 cursor-pointer"
      >
        <span>Đăng ký tài khoản</span>
        <UserPlus className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
}
