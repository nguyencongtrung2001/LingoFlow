"use client";

import { useState } from "react";
import { Layers } from "lucide-react";
import { toast } from "sonner";

import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";

export function AuthCard() {
  const [mode, setMode] = useState<"login" | "register">("login");

  const handleSocialAuth = (provider: "Google" | "Facebook") => {
    toast.info(`Đang kết nối cổng OAuth với ${provider}...`);
  };

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

        {/* Divider - matching login.html .divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-[#E5E7EB]" />
          <span className="px-3 text-[12px] text-[#6B7280] uppercase tracking-[0.5px]">
            {mode === "login" ? "Hoặc tiếp tục với" : "Hoặc đăng ký với"}
          </span>
          <div className="flex-1 border-t border-[#E5E7EB]" />
        </div>

        {/* Social Auth Grid - matching login.html .social-grid */}
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={() => handleSocialAuth("Google")}
            className=" mb-3 py-5 px-10 flex items-center justify-center gap-2 h-[44px] rounded-[10px] border border-[#E5E7EB] bg-white text-[14px] font-medium text-[#1F2937] hover:bg-[#EEF2F6] hover:border-[#CCD3FF] transition-all duration-200 cursor-pointer"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3A11.935 11.935 0 0 0 12 0C7.33 0 3.295 2.502 1.159 6.205l4.107 3.56z" />
              <path fill="#4285F4" d="M23.514 12.273c0-.827-.074-1.623-.21-2.392H12v4.531h6.46A5.523 5.523 0 0 1 16.1 18.062l3.82 2.96c2.235-2.057 3.594-5.086 3.594-8.749z" />
              <path fill="#FBBC05" d="M5.266 14.235A7.086 7.086 0 0 1 4.909 12c0-.79.13-1.55.357-2.265L1.16 6.175A11.95 11.95 0 0 0 0 12c0 2.1.543 4.07 1.491 5.807l3.775-3.572z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.957-1.075 7.942-2.915l-3.82-2.96c-1.06.713-2.418 1.134-4.122 1.134-3.177 0-5.864-2.145-6.824-5.03l-4.132 3.2C3.253 21.463 7.284 24 12 24z" />
            </svg>
            Google
          </button>
        </div>

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
