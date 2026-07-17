"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Folder, Home, LogOut, Loader2, Clock, Shield, StickyNote } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/feature/auth/stores/auth-store";
import { updateAvatar } from "@/feature/auth/api/auth.api";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { user, isAuthenticated, checkAuth, logout, setUser } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Role-based redirection
  useEffect(() => {
    if (user?.role === "ADMIN" && pathname === "/") {
      router.push("/admin");
    }
  }, [user, pathname, router]);

  // Hide navbar on auth and study routes
  if (pathname?.startsWith("/auth") || pathname?.includes("/study")) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push("/auth");
    toast.success("Đã đăng xuất!");
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const data = await updateAvatar(file);
      setUser(data.user);
      toast.success("Cập nhật ảnh đại diện thành công!");
    } catch {
      toast.error("Lỗi khi tải ảnh lên!");
    } finally {
      setIsUploading(false);
      // Reset input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <>
      {/* Desktop Top Navbar */}
      <nav className="bg-[#f8f9ff] shadow-sm sticky top-0 z-50 w-full">
        <div className="flex justify-between items-center px-[20px] py-[16px] w-full max-w-[1200px] mx-auto">
          <div className="flex items-center gap-[32px]">
            <Link
              href="/"
              className="text-[24px] font-extrabold text-[#4648d4] tracking-tight flex items-center"
            >
              <svg
                className="w-8 h-8 mr-2 animate-logo-flow transition-transform duration-300 hover:rotate-12 select-none"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 13.9021 3.59051 15.667 4.59868 17.1194L3 21L6.88063 19.4013C8.33296 20.4095 10.0979 21 12 21Z"
                  fill="url(#logoGrad)"
                />
                <path
                  d="M7 10C9.5 9 11.5 12 14 11C16.5 10 17 12 17 12"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 14C9.5 13 11.5 16 14 15C16.5 14 17 16 17 16"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient
                    id="logoGrad"
                    x1="3"
                    y1="3"
                    x2="21"
                    y2="21"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#4648d4" />
                    <stop offset="1" stopColor="#7a7cff" />
                  </linearGradient>
                </defs>
              </svg>
              <span>LingoFlow</span>
            </Link>
            <div className="hidden md:flex gap-[16px]">
              <Link
                href="/"
                className={`font-medium pb-1 transition-colors duration-200 ${
                  pathname === "/"
                    ? "text-[#4648d4] font-bold border-b-2 border-[#4648d4]"
                    : "text-[#464554] hover:text-[#4648d4]"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/folders"
                className={`font-medium pb-1 transition-colors duration-200 ${
                  pathname === "/folders"
                    ? "text-[#4648d4] font-bold border-b-2 border-[#4648d4]"
                    : "text-[#464554] hover:text-[#4648d4]"
                }`}
              >
                Thư mục
              </Link>
              <Link
                href="/history"
                className={`font-medium pb-1 transition-colors duration-200 ${
                  pathname === "/history"
                    ? "text-[#4648d4] font-bold border-b-2 border-[#4648d4]"
                    : "text-[#464554] hover:text-[#4648d4]"
                }`}
              >
                Lịch sử
              </Link>
              <Link
                href="/note"
                className={`font-medium pb-1 transition-colors duration-200 ${
                  pathname === "/note"
                    ? "text-[#4648d4] font-bold border-b-2 border-[#4648d4]"
                    : "text-[#464554] hover:text-[#4648d4]"
                }`}
              >
                Ghi chú
              </Link>
              {user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className={`font-medium pb-1 transition-colors duration-200 ${
                    pathname?.startsWith("/admin")
                      ? "text-[#4648d4] font-bold border-b-2 border-[#4648d4]"
                      : "text-[#464554] hover:text-[#4648d4]"
                  }`}
                >
                  Quản trị
                </Link>
              )}
            </div>
          </div>
          {isAuthenticated ? (
            <div className="flex items-center gap-[12px] sm:gap-[16px]">
              {/* Tên người dùng */}
              <span className="hidden sm:block text-[14px] font-semibold text-[#5f5e6e] select-none max-w-[100px] sm:max-w-[150px] truncate" title={user?.name}>
                {user?.name}
              </span>

              {/* Ảnh đại diện */}
              <div className="relative cursor-pointer" onClick={handleAvatarClick} title="Đổi ảnh đại diện">
                <Image
                  alt="User Avatar"
                  className={`w-8 h-8 rounded-full object-cover transition-opacity ${isUploading ? 'opacity-50' : 'hover:opacity-80'}`}
                  src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=60"}
                  width={32}
                  height={32}
                />
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 text-[#4648d4] animate-spin" />
                  </div>
                )}
              </div>

              {/* Đường phân cách */}
              <div className="w-px h-[16px] bg-[#e5eeff]" />

              {/* Nút đăng xuất (Exit) */}
              <button
                aria-label="Exit"
                onClick={handleLogout}
                className="text-[#464554] hover:text-red-500 transition-colors duration-200 flex items-center justify-center"
                title="Đăng xuất"
              >
                <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="flex items-center gap-[16px]">
              <Link href="/auth" className="text-[#464554] text-[15px] font-semibold hover:text-[#4648d4] transition-colors">
                Đăng nhập
              </Link>
              <Link href="/auth?tab=register" className="bg-[#4648d4] text-[15px] text-white px-5 py-2 rounded-[10px] font-semibold hover:bg-[#3b3db8] hover:-translate-y-0.5 shadow-[0_4px_12px_rgba(79,70,229,0.15)] transition-all duration-200">
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Bottom Navbar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 md:hidden bg-[#f8f9ff] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-xl border-t border-[#e5eeff]">
        <Link
          href="/"
          className="flex flex-col items-center justify-center text-[#464554] p-2 rounded-lg hover:text-[#4648d4]"
        >
          <Home className="w-6 h-6 mb-1" />
          <span className="text-[12px] font-medium">Dashboard</span>
        </Link>
        <Link
          href="/folders"
          className="flex flex-col items-center justify-center text-[#464554] p-2 rounded-lg hover:text-[#4648d4]"
        >
          <Folder className="w-6 h-6 mb-1" />
          <span className="text-[12px] font-medium">Thư mục</span>
        </Link>
        <Link
          href="/history"
          className="flex flex-col items-center justify-center text-[#464554] p-2 rounded-lg hover:text-[#4648d4]"
        >
          <Clock className="w-6 h-6 mb-1" />
          <span className="text-[12px] font-medium">Lịch sử</span>
        </Link>
        <Link
          href="/note"
          className="flex flex-col items-center justify-center text-[#464554] p-2 rounded-lg hover:text-[#4648d4]"
        >
          <StickyNote className="w-6 h-6 mb-1" />
          <span className="text-[12px] font-medium">Ghi chú</span>
        </Link>
        {user?.role === "ADMIN" && (
          <Link
            href="/admin"
            className="flex flex-col items-center justify-center text-[#464554] p-2 rounded-lg hover:text-[#4648d4]"
          >
            <Shield className="w-6 h-6 mb-1" />
            <span className="text-[12px] font-medium">Quản trị</span>
          </Link>
        )}
      </nav>
    </>
  );
}
