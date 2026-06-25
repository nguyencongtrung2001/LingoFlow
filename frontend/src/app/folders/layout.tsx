import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thư mục từ vựng",
  description:
    "Quản lý và tổ chức thư mục từ vựng tiếng Anh của bạn. Tạo, chỉnh sửa và ôn tập từ vựng hiệu quả cùng LingoFlow.",
};

export default function FoldersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
