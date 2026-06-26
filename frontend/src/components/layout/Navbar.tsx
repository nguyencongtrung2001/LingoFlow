"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Folder, Home, LogOut, Loader2 } from "lucide-react";
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
              className="text-[24px] font-extrabold text-[#4648d4] tracking-tight"
            >
              LingoFlow
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
            </div>
          </div>
          {isAuthenticated && (
            <div className="flex items-center gap-[16px]">
              <button
                aria-label="Exit"
                onClick={handleLogout}
                className="text-[#464554] hover:text-red-500 transition-colors duration-200"
              >
                <LogOut className="w-6 h-6" />
              </button>
              
              <div className="relative cursor-pointer ml-[8px]" onClick={handleAvatarClick}>
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
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
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
      </nav>
    </>
  );
}
