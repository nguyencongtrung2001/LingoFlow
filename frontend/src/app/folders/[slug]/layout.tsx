import type { Metadata } from "next";
import { defaultFolderData } from "@/lib/data";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // In a real app, fetch from API. Here we use mock data.
  const folder = defaultFolderData.find((f) => f.id === slug);

  return {
    title: `${folder?.name || "Chi tiết thư mục"}`,
    description:
      folder?.desc ||
      "Ôn tập từ vựng thông minh cùng LingoFlow. Quản lý, học và kiểm tra từ vựng hiệu quả.",
    openGraph: {
      title: `${folder?.name || "Chi tiết thư mục"} - LingoFlow`,
      description:
        folder?.desc ||
        "Ôn tập từ vựng thông minh cùng LingoFlow.",
    },
  };
}

export default function FolderDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
