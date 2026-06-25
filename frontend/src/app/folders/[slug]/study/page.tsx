import { Suspense } from "react";
import { defaultFolderData } from "@/lib/data";
import StudyContent from "@/components/study-mode/study-content";

type Props = {
  params: Promise<{ slug: string }>;
};

function StudyLoadingFallback() {
  return (
    <div className="flex-1 flex items-center justify-center p-6 min-h-[60vh]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#e1e0ff] border-t-[#4648d4] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[15px] text-[#464554] font-medium">
          Đang tải chế độ học...
        </p>
      </div>
    </div>
  );
}

export default async function StudyPage({ params }: Props) {
  const { slug } = await params;

  // In a real app, fetch from API. Here we use mock data.
  const folder = defaultFolderData.find((f) => f.id === slug) || defaultFolderData[0];

  if (!folder) {
    return (
      <div className="p-8 text-center text-[#464554]">
        Đang tải dữ liệu thư mục...
      </div>
    );
  }

  return (
    <Suspense fallback={<StudyLoadingFallback />}>
      <StudyContent folder={folder} slug={slug} />
    </Suspense>
  );
}
