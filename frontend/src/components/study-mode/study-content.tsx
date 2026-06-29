"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { FolderDetail } from "@/types/folder";
import { useGetFolderById } from "@/feature/folders/hooks/useFolders";
import { useGetWords } from "@/feature/words/hooks/useWords";
import { Loader2 } from "lucide-react";

import { QuizGame } from "@/components/study-mode/quiz/quiz-game";
import { FlashcardGame } from "@/components/study-mode/flashcard/flashcard-game";
import { MatchGame } from "@/components/study-mode/match/match-game";
import { WriteGame } from "@/components/study-mode/write/write-game";

interface StudyContentProps {
  slug: string;
}

export default function StudyContent({ slug }: StudyContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams?.get("type") || "flashcard";

  const { data: folder, isLoading: isLoadingFolder } = useGetFolderById(slug);
  const { data: words = [], isLoading: isLoadingWords } = useGetWords(folder?.id || 0);

  if (isLoadingFolder || isLoadingWords) {
    return (
      <main className="grow flex flex-col items-center justify-center w-full p-6 min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#4648d4] mx-auto mb-4" />
          <p className="text-[15px] text-[#464554] font-medium">
            Đang tải dữ liệu ôn tập...
          </p>
        </div>
      </main>
    );
  }

  if (!folder) {
    return (
      <main className="grow flex flex-col items-center justify-center w-full p-6">
        <div className="text-center p-8 bg-[#ffffff] rounded-2xl border border-dashed border-[#ba1a1a] max-w-md w-full shadow-sm">
          <p className="text-[18px] text-[#ba1a1a] font-medium">
            Thư mục không tồn tại!
          </p>
          <button
            onClick={() => router.push("/folders")}
            className="mt-6 py-2 px-6 bg-[#4648d4] text-white rounded-xl font-semibold hover:bg-[#6063ee] transition-all"
          >
            Quay về danh sách thư mục
          </button>
        </div>
      </main>
    );
  }

  // Construct FolderDetail object expected by the games
  const folderDetail: FolderDetail = {
    id: folder.id.toString(),
    name: folder.name,
    desc: folder.description || "",
    words: words.map((w) => ({
      id: w.id,
      word: w.word,
      meaning: w.meaning,
      phonetic: w.phonetic || "",
      pos: w.pos,
      example: w.example || "",
      image: w.image || "",
      learned: w.learned,
    })),
  };

  // Guard Clause: Thư mục cần tối thiểu 4 từ vựng để kích hoạt chế độ ôn luyện
  if (folderDetail.words.length < 4) {
    return (
      <main className="grow flex flex-col items-center justify-center w-full p-6 min-h-[60vh]">
        <div className="text-center p-8 bg-[#ffffff] rounded-2xl border border-dashed border-[#ff4d6d] max-w-md w-full shadow-md animate-in fade-in zoom-in-95 duration-200">
          <p className="text-[18px] text-[#cc2244] font-bold mb-2">
            Không đủ từ vựng để ôn tập
          </p>
          <p className="text-[14px] text-[#464554] leading-relaxed mb-6 font-medium">
            Thư mục cần tối thiểu 4 từ vựng để kích hoạt chế độ ôn luyện. Hãy thêm từ trước nhé!
          </p>
          <button
            onClick={() => router.push(`/folders/${slug}`)}
            className="py-2.5 px-6 bg-[#4648d4] text-white rounded-xl font-semibold hover:bg-[#6063ee] transition-all duration-200 shadow-sm"
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
      return <FlashcardGame folder={folderDetail} onBack={handleBack} />;
    case "quiz":
      return <QuizGame folder={folderDetail} onBack={handleBack} />;
    case "match":
      return <MatchGame folder={folderDetail} onBack={handleBack} />;
    case "type":
    case "write":
      return <WriteGame folder={folderDetail} onBack={handleBack} />;
    default:
      return (
        <div className="p-8 text-center text-[#ba1a1a]">
          Chế độ học không hợp lệ. Vui lòng quay lại.
        </div>
      );
  }
}
