"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { FolderDetail } from "@/types/folder";

import { QuizGame } from "@/components/study-mode/quiz/quiz-game";
import { FlashcardGame } from "@/components/study-mode/flashcard/flashcard-game";
import { MatchGame } from "@/components/study-mode/match/match-game";
import { WriteGame } from "@/components/study-mode/write/write-game";

interface StudyContentProps {
  folder: FolderDetail;
  slug: string;
}

export default function StudyContent({ folder, slug }: StudyContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams?.get("type") || "flashcard";

  // Handle empty state
  if (!folder.words || folder.words.length === 0) {
    return (
      <main className="grow flex flex-col items-center justify-center w-full p-6">
        <div className="text-center p-8 bg-[#ffffff] rounded-2xl border border-dashed border-[#c7c4d7] max-w-md w-full shadow-sm">
          <p className="text-[18px] text-[#0b1c30] font-medium">
            Thư mục hiện tại chưa có từ vựng.
          </p>
          <p className="text-[12px] text-[#464554] mt-2 mb-6">
            Vui lòng thêm từ mới trước khi ôn tập.
          </p>
          <button
            onClick={() => router.push(`/folders/${slug}`)}
            className="py-2 px-6 bg-[#4648d4] text-white rounded-xl font-semibold hover:bg-[#6063ee] transition-all"
          >
            Quay về Thư mục
          </button>
        </div>
      </main>
    );
  }

  const handleBack = () => {
    router.push(`/folders/${slug}`);
  };

  switch (type) {
    case "flashcard":
      return <FlashcardGame folder={folder} onBack={handleBack} />;
    case "quiz":
      return <QuizGame folder={folder} onBack={handleBack} />;
    case "match":
      return <MatchGame folder={folder} onBack={handleBack} />;
    case "type": // Ensure "type" maps to WriteGame because StudyModes buttons use "type"
    case "write":
      return <WriteGame folder={folder} onBack={handleBack} />;
    default:
      return (
        <div className="p-8 text-center text-[#ba1a1a]">
          Chế độ học không hợp lệ. Vui lòng quay lại.
        </div>
      );
  }
}
