"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FolderDetail, Word } from "@/types/folder";
import { X, Flame, Volume2, ArrowRight } from "lucide-react";
import { WriteResult, WriteHistoryItem } from "./write-result";
import { useSaveStudySession } from "@/feature/words/hooks/useWords";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function checkMultipleAnswers(input: string, expected: string): boolean {
  if (!input.trim() || !expected.trim()) return false;
  const expectedList = expected.split(/[,;]/).map((s) => s.trim().toLowerCase());
  const userVal = input.trim().toLowerCase();
  return expectedList.includes(userVal);
}

function generateHint(text: string): string {
  return text.replace(/\b([a-zA-Z])([a-zA-Z]*)\b/g, (match, firstLetter, rest) => {
    return firstLetter + '_'.repeat(rest.length);
  });
}

export interface WriteGameProps {
  folder: FolderDetail;
  onBack: () => void;
  onRestart?: () => void;
}

export function WriteGame({ folder, onBack, onRestart }: WriteGameProps) {
  const folderId = parseInt(folder.id);
  const saveSessionMutation = useSaveStudySession(folderId);

  const [queue, setQueue] = useState<Word[]>(() => shuffleArray(folder.words));
  const [dbPayload, setDbPayload] = useState<Array<{ wordId: number; isCorrect: boolean }>>([]);
  const [history, setHistory] = useState<WriteHistoryItem[]>([]);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [totalCount] = useState(folder.words.length);

  const [inputValue, setInputValue] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime] = useState<number>(() => Date.now());
  const [direction, setDirection] = useState<"EN_TO_VI" | "VI_TO_EN">(() => Math.random() > 0.5 ? "EN_TO_VI" : "VI_TO_EN");

  const currentWord = queue[0];
  const progressPercent = totalCount > 0 ? ((totalCount - queue.length) / totalCount) * 100 : 0;

  const expectedAnswer = currentWord
    ? (direction === "EN_TO_VI" ? currentWord.meaning : currentWord.word)
    : "";

  const handleCheck = () => {
    if (!inputValue.trim() || !currentWord) return;

    const isCorrect = checkMultipleAnswers(inputValue, expectedAnswer);
    setIsAnswerCorrect(isCorrect);
    setShowFeedback(true);

    // 1. Ghi nhận ngầm cho hệ thống chấm điểm Leitner ở lần trả lời ĐẦU TIÊN
    const hasAttempted = dbPayload.some((item) => item.wordId === currentWord.id);
    if (!hasAttempted) {
      setDbPayload((prev) => [...prev, { wordId: currentWord.id, isCorrect }]);
    }

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      // Lưu vào history hiển thị trên UI với màu xanh lá
      const inHistory = history.some((item) => item.expectedWord === currentWord.word);
      if (!inHistory) {
        setHistory((prev) => [
          ...prev,
          {
            expectedWord: currentWord.word,
            expectedMeaning: currentWord.meaning,
            typedWord: direction === "EN_TO_VI" ? currentWord.meaning : currentWord.word,
            isCorrect: true,
          },
        ]);
      }
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (!currentWord) return;

    const remaining = queue.slice(1);

    if (isAnswerCorrect) {
      if (remaining.length === 0) {
        // Hoàn thành
        const endTimeVal = Date.now();
        setIsCompleted(true);

        const timeSeconds = Math.floor((endTimeVal - startTime) / 1000);
        const realCorrectCount = dbPayload.filter((d) => d.isCorrect).length;
        const realAccuracy = totalCount > 0 ? (realCorrectCount / totalCount) * 100 : 0;

        saveSessionMutation.mutate({
          folderId,
          mode: "WRITE",
          totalWords: totalCount,
          correctCount: realCorrectCount,
          accuracy: realAccuracy,
          timeSeconds,
          maxStreak,
          details: dbPayload.map((d) => ({
            wordId: d.wordId,
            isCorrect: d.isCorrect,
          })),
        });
      } else {
        setQueue(remaining);
        setInputValue("");
        setShowFeedback(false);
        setShowHint(false);
        setDirection(Math.random() > 0.5 ? "EN_TO_VI" : "VI_TO_EN");
      }
    } else {
      // Trả lời sai -> Đẩy ngược xuống cuối hàng đợi
      setQueue([...remaining, currentWord]);
      setInputValue("");
      setShowFeedback(false);
      setShowHint(false);
      setDirection(Math.random() > 0.5 ? "EN_TO_VI" : "VI_TO_EN");
    }
  };

  const handleNextRef = useRef(handleNext);
  useEffect(() => {
    handleNextRef.current = handleNext;
  });

  useEffect(() => {
    if (showFeedback && isAnswerCorrect) {
      const timer = setTimeout(() => {
        handleNextRef.current();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [showFeedback, isAnswerCorrect]);

  const handleRestart = () => {
    if (onRestart) {
      onRestart();
      return;
    }
    setQueue(shuffleArray(folder.words));
    setDbPayload([]);
    setHistory([]);
    setStreak(0);
    setMaxStreak(0);
    setInputValue("");
    setShowFeedback(false);
    setShowHint(false);
    setIsCompleted(false);
    setDirection(Math.random() > 0.5 ? "EN_TO_VI" : "VI_TO_EN");
  };

  const handlePronounce = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (showFeedback) {
        handleNext();
      } else {
        handleCheck();
      }
    }
  };

  if (totalCount === 0 || !currentWord) return null;

  if (isCompleted) {
    return (
      <WriteResult
        correctCount={totalCount}
        totalCount={totalCount}
        accuracy={100}
        maxStreak={maxStreak}
        history={history}
        onRestart={handleRestart}
        onBack={onBack}
      />
    );
  }

  return (
    <div className="bg-[#eff4ff] text-[#0b1c30] flex flex-col overflow-hidden relative w-full rounded-3xl border border-[#e5eeff]/50 shadow-md">
      {/* Header */}
      <header className="w-full shrink-0 px-4 md:px-6 py-4 flex items-center justify-between border-b border-[#e2e8f0] bg-white">
        <div className="flex justify-between items-center w-full max-w-[1200px] mx-auto">
          <button
            onClick={onBack}
            className="hover:bg-[#f1f5f9] p-2 rounded-xl transition-all text-[#475569]"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5 bg-[#fffbeb] text-[#b45309] px-4 py-2 rounded-xl border border-[#fde68a] shadow-sm">
            <Flame className="w-4 h-4 fill-[#b45309]" />
            <span className="text-[13px] font-bold">Streak: {streak}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="grow flex flex-col px-4 py-6 items-center w-full">
        {/* Progress */}
        <div className="w-full max-w-xl mb-6">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[12px] font-bold text-[#464554]">
              Tiến độ đợt học: {totalCount - queue.length} / {totalCount} từ
            </span>
            <span className="text-[12px] font-bold text-[#4648d4]">
              Còn lại: {queue.length} câu
            </span>
          </div>
          <div className="h-[8px] w-full bg-[#e5eeff] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4648d4] transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Word Card */}
        <div className="relative w-full max-w-xl bg-[#ffffff] rounded-[24px] p-6 shadow-sm mb-6 border border-[#e5eeff] flex flex-col items-center">
          {direction === "EN_TO_VI" && (
            <button
              onClick={(e) => handlePronounce(e, currentWord.word)}
              className="absolute top-4 right-4 p-2 text-[#464554]/60 hover:text-[#4648d4] hover:bg-[#eff4ff] rounded-full transition-colors"
              title="Nghe phát âm"
            >
              <Volume2 className="w-[22px] h-[22px]" />
            </button>
          )}



          <div className="mb-4 flex justify-center">
            {currentWord.image && (
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#eff4ff] border border-[#e2e8f0] relative">
                <Image
                  src={currentWord.image}
                  alt={currentWord.word}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          <h2 className="text-[36px] font-black text-[#4648d4] mb-2 leading-tight">
            {direction === "EN_TO_VI" ? currentWord.word : currentWord.meaning}
          </h2>

          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="px-3 py-1 bg-[#dce9ff] text-[#4648d4] text-[11px] font-bold rounded-full uppercase">
              {currentWord.pos || "Word"}
            </span>
            {direction === "EN_TO_VI" && currentWord.phonetic && (
              <span className="italic text-[#64748b] text-[14px]">
                {currentWord.phonetic}
              </span>
            )}
          </div>

          {!showFeedback ? (
            <div className="w-full flex flex-col gap-3">
              <input
                id="vocab-input"
                type="text"
                placeholder={direction === "EN_TO_VI" ? "Nhập nghĩa tiếng Việt..." : "Type the English word..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                className="w-full text-center py-3.5 px-4 text-[18px] font-semibold border border-gray-300 rounded-2xl bg-[#f8fafc] focus:border-[#4648d4] focus:ring-0 transition-all outline-none text-[#0f172a]"
              />
              {direction === "VI_TO_EN" && !showHint && (
                <button
                  onClick={() => setShowHint(true)}
                  className="text-[13px] text-[#4648d4] font-medium hover:underline self-start px-3 py-1.5 bg-[#eff4ff] rounded-lg transition-colors hover:bg-[#e0e7ff]"
                >
                  Quên từ? Xem gợi ý
                </button>
              )}
              {direction === "VI_TO_EN" && showHint && (
                <div className="text-[16px] font-mono font-bold text-[#b45309] bg-[#fffbeb] px-4 py-2.5 rounded-xl self-start border border-[#fde68a] tracking-widest shadow-sm">
                  Gợi ý: {generateHint(expectedAnswer)}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full animate-in fade-in zoom-in-95 duration-200">
              {isAnswerCorrect ? (
                <div className="p-4 bg-[#f0fff4] rounded-2xl border border-[#bbf7d0] text-center">
                  <p className="text-[14px] text-[#1d9e75] font-bold">Chính xác!</p>
                  <p className="text-[18px] font-bold text-[#0f172a] mt-1">{expectedAnswer}</p>
                </div>
              ) : (
                <div className="p-4 bg-[#fff5f5] rounded-2xl border border-[#feb2b2] text-center">
                  <p className="text-[14px] text-[#e53e3e] font-bold">Chưa chính xác!</p>
                  <div className="mt-2 text-[14px] text-[#334155] font-semibold">
                    Đáp án đúng là:
                    <p className="text-[20px] font-extrabold text-[#1d9e75] mt-1">{expectedAnswer}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-xl flex gap-3.5 shrink-0 mt-auto md:mt-0">
          {!showFeedback ? (
            <button
              onClick={handleCheck}
              disabled={!inputValue.trim()}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#4648d4] text-white font-bold text-[16px] shadow-md hover:bg-[#6063ee] active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Kiểm tra
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#4648d4] hover:bg-[#6063ee] text-white font-bold text-[16px] shadow-md active:scale-95 transition-all duration-150 flex items-center justify-center gap-2"
            >
              Tiếp tục
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
