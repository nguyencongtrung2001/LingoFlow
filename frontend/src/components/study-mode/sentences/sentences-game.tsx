"use client";

import { useState } from "react";
import { FolderDetail, Word } from "@/types/folder";
import { GradeResult } from "@/api/words.api";
import { useGradeSentence } from "@/feature/words/hooks/useWords";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lightbulb,
  Volume2,
} from "lucide-react";
import { SentencesResult, SentenceHistoryItem } from "./sentences-result";

export interface SentencesGameProps {
  folder: FolderDetail;
  onBack: () => void;
  onRestart?: () => void;
}

export function SentencesGame({ folder, onBack, onRestart }: SentencesGameProps) {
  const gradeMutation = useGradeSentence();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null);
  const [history, setHistory] = useState<SentenceHistoryItem[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime] = useState(() => Date.now());

  const currentWord = folder.words[currentIndex];
  const totalCount = folder.words.length;
  const progressPercent = ((currentIndex + (gradeResult ? 1 : 0)) / totalCount) * 100;

  const handleGrade = () => {
    if (!inputValue.trim() || !currentWord) return;

    gradeMutation.mutate(
      { wordId: currentWord.id, sentence: inputValue.trim() },
      {
        onSuccess: (result) => {
          setGradeResult(result);
          setHistory((prev) => [
            ...prev,
            {
              word: currentWord.word,
              meaning: currentWord.meaning,
              sentence: inputValue.trim(),
              score: result.score,
              isCorrect: result.isCorrect,
              feedback: result.feedback,
            },
          ]);
        },
      }
    );
  };

  const handleNext = () => {
    if (currentIndex < totalCount - 1) {
      setCurrentIndex(currentIndex + 1);
      setInputValue("");
      setGradeResult(null);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePronounce = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (gradeResult) {
        handleNext();
      } else {
        handleGrade();
      }
    }
  };

  if (isCompleted) {
    const timeSeconds = Math.floor((Date.now() - startTime) / 1000);
    const avgScore = history.length > 0 ? Math.round(history.reduce((s, h) => s + h.score, 0) / history.length) : 0;
    const correctCount = history.filter((h) => h.isCorrect).length;

    return (
      <SentencesResult
        folderName={folder.name}
        timeSeconds={timeSeconds}
        totalCount={totalCount}
        correctCount={correctCount}
        avgScore={avgScore}
        history={history}
        onRestart={onRestart || onBack}
        onBack={onBack}
      />
    );
  }

  if (!currentWord) return null;

  return (
    <div className="bg-[#eff4ff] text-[#0b1c30] flex flex-col overflow-hidden relative w-full rounded-3xl border border-[#e5eeff]/50 shadow-md">
      <main className="grow flex flex-col w-full max-w-3xl mx-auto px-4 md:px-6 py-6">
        {/* Header */}
        <header className="flex items-center justify-between w-full shrink-0 mb-6">
          <div className="grow mr-6 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[12px] font-bold text-[#464554]">
                Câu {currentIndex + 1} / {totalCount}
              </span>
              <button
                onClick={onBack}
                className="flex items-center gap-1.5 text-[12px] font-semibold text-[#464554] hover:text-[#4648d4] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Quay lại
              </button>
            </div>
            <div className="w-full h-[8px] bg-[#e5eeff] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#4648d4] to-[#7a7cff] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <div className="bg-gradient-to-r from-[#f0e6ff] to-[#e1e0ff] text-[#4648d4] font-bold text-[13px] px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm border border-[#d0c8ff] shrink-0">
            <Sparkles className="w-4 h-4" />
            <span>AI Chấm</span>
          </div>
        </header>

        {/* Word Display Card */}
        <div className="bg-white rounded-[24px] p-5 md:p-6 shadow-sm border border-[#c7c4d7]/20 mb-5 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between mb-3">
            <span className="px-3 py-1 bg-[#dce9ff] text-[#4648d4] text-[11px] rounded-full font-bold uppercase">
              {currentWord.pos || "Word"}
            </span>
            <button
              onClick={() => handlePronounce(currentWord.word)}
              className="p-2 text-[#464554]/60 hover:text-[#4648d4] hover:bg-[#eff4ff] rounded-full transition-colors"
              title="Nghe phát âm"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
          <h2 className="text-[24px] md:text-[28px] font-extrabold text-[#0b1c30] mb-1 tracking-tight">
            {currentWord.word}
          </h2>
          {currentWord.phonetic && (
            <p className="text-[14px] text-[#464554] italic mb-2">{currentWord.phonetic}</p>
          )}
          <p className="text-[15px] text-[#4648d4] font-semibold">{currentWord.meaning}</p>
        </div>

        {/* Input Area */}
        <div className="mb-5">
          <label className="text-[13px] font-bold text-[#464554] mb-2 block">
            ✍️ Viết một câu sử dụng từ <span className="text-[#4648d4]">&quot;{currentWord.word}&quot;</span>
          </label>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ví dụ: I like to eat ${currentWord.word} every day.`}
            disabled={!!gradeResult}
            className="w-full h-[100px] px-4 py-3 bg-white rounded-2xl border border-[#e2e8f0] text-[15px] text-[#0b1c30] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#4648d4]/30 focus:border-[#4648d4] transition-all resize-none disabled:opacity-60 disabled:cursor-not-allowed"
            autoFocus
          />
        </div>

        {/* Action Button */}
        {!gradeResult && (
          <button
            onClick={handleGrade}
            disabled={!inputValue.trim() || gradeMutation.isPending}
            className="w-full py-3.5 bg-gradient-to-r from-[#4648d4] to-[#6063ee] text-white rounded-2xl font-bold text-[15px] hover:shadow-lg hover:shadow-[#4648d4]/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {gradeMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                AI đang chấm điểm...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Chấm điểm bằng AI
              </>
            )}
          </button>
        )}

        {/* Grade Result Display */}
        {gradeResult && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-4">
            {/* Score Badge */}
            <div className={`flex items-center justify-between p-4 rounded-2xl border ${
              gradeResult.isCorrect
                ? "bg-[#f0fff4] border-[#1d9e75]/30"
                : "bg-[#fff5f5] border-[#e53e3e]/30"
            }`}>
              <div className="flex items-center gap-3">
                {gradeResult.isCorrect ? (
                  <CheckCircle className="w-8 h-8 text-[#1d9e75]" />
                ) : (
                  <XCircle className="w-8 h-8 text-[#e53e3e]" />
                )}
                <div>
                  <p className={`text-[16px] font-bold ${gradeResult.isCorrect ? "text-[#1d9e75]" : "text-[#e53e3e]"}`}>
                    {gradeResult.isCorrect ? "Đạt! Tuyệt vời 🎉" : "Chưa đạt — Cố gắng hơn nhé!"}
                  </p>
                  <p className="text-[13px] text-[#464554] mt-0.5">{gradeResult.feedback}</p>
                </div>
              </div>
              <div className={`text-[28px] font-black font-mono ${gradeResult.isCorrect ? "text-[#1d9e75]" : "text-[#e53e3e]"}`}>
                {gradeResult.score}
              </div>
            </div>

            {/* Errors List */}
            {gradeResult.errors.length > 0 && (
              <div className="bg-white rounded-2xl p-4 border border-[#fde68a]/50 shadow-sm">
                <h4 className="text-[13px] font-bold text-[#b45309] mb-3 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Danh sách lỗi ({gradeResult.errors.length})
                </h4>
                <div className="space-y-2.5">
                  {gradeResult.errors.map((err, i) => (
                    <div key={i} className="flex gap-3 text-[13px] bg-[#fffbeb] rounded-xl p-3 border border-[#fde68a]/30">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-[#fde68a] text-[#92400e] flex items-center justify-center font-bold text-[11px]">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-[#92400e] font-semibold">{err.position}: {err.error}</p>
                        <p className="text-[#b45309] mt-0.5">💡 {err.suggestion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Alternatives */}
            {gradeResult.alternatives.length > 0 && (
              <div className="bg-white rounded-2xl p-4 border border-[#d0f4e7]/50 shadow-sm">
                <h4 className="text-[13px] font-bold text-[#00714d] mb-3 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4" />
                  Câu mẫu tham khảo
                </h4>
                <div className="space-y-2">
                  {gradeResult.alternatives.map((alt, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-[14px] bg-[#f0fff4] rounded-xl p-3 border border-[#d0f4e7]/50">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-[#6cf8bb] text-[#00714d] flex items-center justify-center font-bold text-[10px] mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-[#0b1c30] font-medium italic">&quot;{alt}&quot;</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="w-full py-3.5 bg-gradient-to-r from-[#4648d4] to-[#6063ee] text-white rounded-2xl font-bold text-[15px] hover:shadow-lg hover:shadow-[#4648d4]/25 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {currentIndex === totalCount - 1 ? "Xem kết quả" : "Từ tiếp theo"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Error state from mutation */}
        {gradeMutation.isError && !gradeResult && (
          <div className="mt-4 p-4 bg-[#fff5f5] border border-[#e53e3e]/30 rounded-2xl text-[13px] text-[#e53e3e] font-medium">
            ⚠️ Có lỗi xảy ra khi chấm điểm. Vui lòng thử lại.
          </div>
        )}
      </main>
    </div>
  );
}
