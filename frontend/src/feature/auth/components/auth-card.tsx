"use client";

import { useState } from "react";
import { Layers } from "lucide-react";
import { toast } from "sonner";

import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";

export function AuthCard() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="w-full max-w-[1000px] mx-auto z-10 flex flex-col md:flex-row items-center gap-10 md:gap-20">
      {/* Brand Header - Left Column */}
      <div className="flex-1 text-center md:text-left flex flex-col items-center md:items-start">
        <div className="inline-flex items-center justify-center w-[60px] h-[60px] md:w-[80px] md:h-[80px] bg-linear-to-br from-[#4F46E5] to-[#818CF8] text-white rounded-2xl shadow-[0_8px_16px_rgba(79,70,229,0.3)] mb-6">
          <Layers className="h-8 w-8 md:h-10 md:w-10" />
        </div>
        <h1 className="text-[#4F46E5] text-[36px] md:text-[48px] font-extrabold tracking-[-1px] mb-4 leading-tight">
          LingoFlow
        </h1>
        <p className="text-[16px] md:text-[18px] text-[#6B7280] max-w-md">
          Làm chủ ngôn ngữ, khơi nguồn dòng chảy tư duy. Nền tảng học từ vựng thông minh giúp bạn ghi nhớ nhanh hơn, hiệu quả hơn.
        </p>
      </div>

      {/* Auth Card - Right Column */}
      <div className="flex-1 w-full max-w-[460px]">
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-[#E5E7EB]">
        {/* Title & subtitle */}
        <h2 className="text-[22px] font-bold text-[#1F2937] mb-2">
          {mode === "login" ? "Chào mừng trở lại!" : "Tạo tài khoản mới"}
        </h2>
        <p className="text-[14px] text-[#6B7280] mb-5">
          {mode === "login"
            ? "Đăng nhập để tiếp tục hành trình học tập của bạn."
            : "Bắt đầu trải nghiệm học ngôn ngữ thông minh ngay hôm nay."}
        </p>

        {/* Form */}
        {mode === "login" ? (
          <LoginForm />
        ) : (
          <RegisterForm onSuccess={() => setMode("login")} />
        )}

        {/* Footer switch - matching login.html .auth-footer */}
        <div className="text-center text-[14px] text-[#6B7280]">
          {mode === "login" ? (
            <>
              Chưa có tài khoản?{" "}
              <button
                type="button"
                onClick={() => setMode("register")}
                className="font-semibold text-[#4F46E5] hover:underline focus:outline-none cursor-pointer"
              >
                Đăng ký ngay
              </button>
            </>
          ) : (
            <>
              Đã có tài khoản?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="font-semibold text-[#4F46E5] hover:underline focus:outline-none cursor-pointer"
              >
                Đăng nhập
              </button>
            </>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
