import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng nhập",
  description:
    "Đăng nhập hoặc tạo tài khoản LingoFlow để bắt đầu hành trình học từ vựng thông minh.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
