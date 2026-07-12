"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { FolderDetail } from "@/types/folder";
import { useGetFolderById } from "@/feature/folders/hooks/useFolders";
import { useGetWords, useGetSmartWords, useGetMasteredWords } from "@/feature/words/hooks/useWords";
import { Loader2, Sparkles, BookCheck } from "lucide-react";

import { QuizGame } from "@/components/study-mode/quiz/quiz-game";
import { FlashcardGame } from "@/components/study-mode/flashcard/flashcard-game";
import { MatchGame } from "@/components/study-mode/match/match-game";
import { WriteGame } from "@/components/study-mode/write/write-game";
import { MixedGame } from "@/components/study-mode/mixed/mixed-game";

interface StudyContentProps {
  slug: string;
}

export default function StudyContent({ slug }: StudyContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams?.get("type") || "flashcard";
  const reviewMode = searchParams?.get("review") === "mastered";

  const { data: folder, isLoading: isLoadingFolder } = useGetFolderById(slug);
  
  // Lấy toàn bộ từ vựng để đếm tổng và chạy Guard Clause
  const { data: allWords = [], isLoading: isLoadingAllWords } = useGetWords(folder?.id || 0);

  // Bốc từ thông minh (Dynamic Queue) — thay thế cuốn chiếu cũ
  const { data: smartData, isLoading: isLoadingSmart } = useGetSmartWords(folder?.id || 0);

  // Lấy từ đã thuộc cho chế độ Review
  const { data: masteredWords = [], isLoading: isLoadingMastered } = useGetMasteredWords(folder?.id || 0);

  if (isLoadingFolder || isLoadingAllWords || isLoadingSmart || isLoadingMastered) {
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

  // Guard Clause: Thư mục cần tối thiểu 4 từ vựng để kích hoạt ôn luyện
  if (allWords.length < 4) {
    return (
      <main className="grow flex flex-col items-center justify-center w-full p-6 min-h-[70vh]">
        <div className="text-center p-8 bg-[#ffffff] rounded-3xl border border-dashed border-[#ff4d6d] max-w-md w-full shadow-lg transition-all duration-300">
          <div className="w-16 h-16 bg-[#fff0f2] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-[28px]">⚠️</span>
          </div>
          <p className="text-[20px] text-[#cc2244] font-bold mb-3">
            Không đủ từ vựng để ôn tập
          </p>
          <p className="text-[14px] text-[#464554] leading-relaxed mb-6 font-medium">
            Thư mục cần tối thiểu 4 từ vựng để kích hoạt chế độ ôn luyện. Hiện tại thư mục này chỉ có {allWords.length} từ. Vui lòng thêm từ trước nhé!
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

  // Quyết định nguồn dữ liệu: Review Mastered hoặc Smart Queue
  const activeWords = reviewMode ? masteredWords : (smartData?.words || []);
  const meta = smartData?.meta;

  // Guard: Nếu chế độ review nhưng không có từ đã thuộc
  if (reviewMode && masteredWords.length === 0) {
    return (
      <main className="grow flex flex-col items-center justify-center w-full p-6 min-h-[70vh]">
        <div className="text-center p-8 bg-[#ffffff] rounded-3xl border border-dashed border-[#4648d4] max-w-md w-full shadow-lg">
          <div className="w-16 h-16 bg-[#e1e0ff] rounded-full flex items-center justify-center mx-auto mb-4">
            <BookCheck className="w-8 h-8 text-[#4648d4]" />
          </div>
          <p className="text-[20px] text-[#4648d4] font-bold mb-3">
            Chưa có từ nào đã thuộc
          </p>
          <p className="text-[14px] text-[#464554] leading-relaxed mb-6 font-medium">
            Hãy tiếp tục ôn luyện để đưa các từ lên hộp 5. Khi đó bạn mới có thể sử dụng chế độ ôn tập lại!
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

  // Guard: Nếu không đủ 4 từ active
  if (activeWords.length < 4) {
    return (
      <main className="grow flex flex-col items-center justify-center w-full p-6 min-h-[70vh]">
        <div className="text-center p-8 bg-[#ffffff] rounded-3xl border border-dashed border-[#ff4d6d] max-w-md w-full shadow-lg">
          <div className="w-16 h-16 bg-[#fff0f2] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-[28px]">⚠️</span>
          </div>
          <p className="text-[20px] text-[#cc2244] font-bold mb-3">
            Không đủ từ vựng
          </p>
          <p className="text-[14px] text-[#464554] leading-relaxed mb-6 font-medium">
            Cần tối thiểu 4 từ để bắt đầu ôn luyện. {reviewMode ? "Hãy ôn tập thêm để có nhiều từ đã thuộc hơn." : "Hãy thêm từ vựng mới vào thư mục."}
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

  // Khởi tạo FolderDetail chứa từ vựng để truyền vào Game
  const folderDetail: FolderDetail = {
    id: folder.id.toString(),
    name: folder.name,
    desc: folder.description || "",
    words: activeWords.map((w) => ({
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

  const handleBack = () => {
    router.push(`/folders/${slug}`);
  };

  return (
    <div className="flex-1 flex flex-col w-full bg-[#f8fafc] min-h-[90vh]">

      {/* Banner thông tin thuật toán bốc từ — chỉ hiện ở chế độ bình thường */}
      {!reviewMode && meta && (
        <div className="flex items-center justify-center gap-3 py-2.5 px-4 bg-gradient-to-r from-[#e1e0ff] via-[#f0f4ff] to-[#d0f4e7] border-b border-[#e5eeff]">
          <Sparkles className="w-4 h-4 text-[#4648d4]" />
          <p className="text-[13px] font-medium text-[#464554]">
            <span className="text-[#4648d4] font-bold">{meta.dangOn}</span> từ đang ôn
            {(meta.chuaHoc > 0 || meta.moiTinh > 0) && (
              <> · <span className="text-[#00714d] font-bold">{(meta.chuaHoc || 0) + (meta.moiTinh || 0)}</span> từ mới gối đầu</>
            )}
            {meta.daThuocBu > 0 && (
              <> · <span className="text-[#653e00] font-bold">{meta.daThuocBu}</span> từ đã thuộc bù</>
            )}
          </p>
        </div>
      )}

      {/* Banner chế độ ôn tập từ đã thuộc */}
      {reviewMode && (
        <div className="flex items-center justify-center gap-3 py-2.5 px-4 bg-gradient-to-r from-[#ffddb8] via-[#fff8f0] to-[#ffddb8] border-b border-[#ffddb8]">
          <BookCheck className="w-4 h-4 text-[#653e00]" />
          <p className="text-[13px] font-bold text-[#653e00]">
            Chế độ ôn tập lại · {masteredWords.length} từ đã thuộc
          </p>
        </div>
      )}

      {/* Vùng Render Game Chính */}
      <main className="grow flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl min-h-[50vh] flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-300">
          {(() => {
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
              case "mixed":
                return <MixedGame folder={folderDetail} onBack={handleBack} />;
              default:
                return (
                  <div className="p-8 text-center text-[#ba1a1a]">
                    Chế độ học không hợp lệ. Vui lòng quay lại.
                  </div>
                );
            }
          })()}
        </div>
      </main>
    </div>
  );
}
