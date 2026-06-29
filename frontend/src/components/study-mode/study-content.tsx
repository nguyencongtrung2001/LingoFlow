"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { FolderDetail } from "@/types/folder";
import { useGetFolderById } from "@/feature/folders/hooks/useFolders";
import { useGetWords, useGetWordsSequential } from "@/feature/words/hooks/useWords";
import { Loader2, ArrowLeft, BookOpen, HelpCircle, Layers, Edit3, ChevronLeft, ChevronRight } from "lucide-react";

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
  const page = parseInt(searchParams?.get("page") || "1", 10);
  const type = searchParams?.get("type") || "flashcard";

  const { data: folder, isLoading: isLoadingFolder } = useGetFolderById(slug);
  
  // Lấy toàn bộ từ vựng để đếm tổng số trang và chạy rào chắn Guard Clause
  const { data: allWords = [], isLoading: isLoadingAllWords } = useGetWords(folder?.id || 0);

  // Lấy 15 từ cuốn chiếu của trang hiện tại
  const { data: paginatedWords = [], isLoading: isLoadingPaginatedWords } = useGetWordsSequential(folder?.id || 0, page);

  if (isLoadingFolder || isLoadingAllWords || isLoadingPaginatedWords) {
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

  const totalPages = Math.max(1, Math.ceil(allWords.length / 15));

  // Tự động chuyển trang hợp lệ nếu người dùng gõ bậy trên URL
  if (page < 1 || page > totalPages) {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("page", "1");
    router.replace(`/folders/${slug}/study?${params.toString()}`);
  }

  // Khởi tạo FolderDetail chứa 15 từ cuốn chiếu để truyền vào Game
  const folderDetail: FolderDetail = {
    id: folder.id.toString(),
    name: folder.name,
    desc: folder.description || "",
    words: paginatedWords.map((w) => ({
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

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("page", newPage.toString());
    router.push(`/folders/${slug}/study?${params.toString()}`);
  };

  const handleModeChange = (newType: string) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("type", newType);
    router.push(`/folders/${slug}/study?${params.toString()}`);
  };

  const handleBack = () => {
    router.push(`/folders/${slug}`);
  };

  return (
    <div className="flex-1 flex flex-col w-full bg-[#f8fafc] min-h-[90vh]">
      {/* Top Header Điều Hướng Cao Cấp */}
      <header className="bg-white border-b border-[#e2e8f0] px-4 py-3 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Back button & Folder title */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-[#f1f5f9] rounded-xl transition-all duration-200 text-[#475569] hover:text-[#0f172a]"
              title="Quay lại thư mục"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-[16px] font-bold text-[#0f172a] line-clamp-1">
                {folder.name}
              </h1>
              <p className="text-[11px] text-[#64748b]">
                Tổng số từ: {allWords.length}
              </p>
            </div>
          </div>

          {/* Pagination Cuốn Chiếu */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2 bg-[#f1f5f9] p-1.5 rounded-xl shadow-inner">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="p-1.5 rounded-lg hover:bg-white transition-all disabled:opacity-40 disabled:hover:bg-transparent text-[#475569]"
                title="Đợt trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[12px] font-bold text-[#334155] px-2">
                Đợt {page} / {totalPages} (từ {(page - 1) * 15 + 1} - {Math.min(page * 15, allWords.length)})
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg hover:bg-white transition-all disabled:opacity-40 disabled:hover:bg-transparent text-[#475569]"
                title="Đợt sau"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-[#f1f5f9] p-1 rounded-xl shadow-inner w-full sm:w-auto overflow-x-auto">
            {[
              { id: "flashcard", label: "Flashcard", icon: Layers },
              { id: "quiz", label: "Quiz", icon: HelpCircle },
              { id: "match", label: "Ghép từ", icon: BookOpen },
              { id: "write", label: "Gõ từ", icon: Edit3 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = type === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleModeChange(tab.id)}
                  className={`flex items-center justify-center gap-1.5 py-1.5 px-3.5 text-[12px] font-bold rounded-lg transition-all whitespace-nowrap grow sm:grow-0 ${
                    isActive
                      ? "bg-white text-[#4648d4] shadow-sm"
                      : "text-[#64748b] hover:text-[#475569] hover:bg-white/50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

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
