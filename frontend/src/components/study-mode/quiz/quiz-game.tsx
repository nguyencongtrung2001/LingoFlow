"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { FolderDetail, Word } from "@/types/folder";
import { CheckCircle, ArrowRight, Flame } from "lucide-react";
import { QuizResult, QuizHistoryItem } from "./quiz-result";
import { useSaveStudySession } from "@/feature/words/hooks/useWords";

export interface QuizGameProps {
  folder: FolderDetail;
  onBack: () => void;
}

function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

export function QuizGame({ folder, onBack }: QuizGameProps) {
  const folderId = parseInt(folder.id);
  const saveSessionMutation = useSaveStudySession(folderId);

  const [queue, setQueue] = useState<Word[]>(() => shuffleArray(folder.words));
  const [dbPayload, setDbPayload] = useState<Array<{ wordId: number; isCorrect: boolean }>>([]);
  const [history, setHistory] = useState<QuizHistoryItem[]>([]);
  const [totalCount] = useState(folder.words.length);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime] = useState<number>(() => Date.now());
  const [direction, setDirection] = useState<"EN_TO_VI" | "VI_TO_EN">(() => Math.random() > 0.5 ? "EN_TO_VI" : "VI_TO_EN");

  const currentWord = queue[0];
  const progressPercent = totalCount > 0 ? ((totalCount - queue.length) / totalCount) * 100 : 0;

  // Tạo 4 đáp án (1 đúng + 3 nhiễu từ cùng thư mục)
  const options = useMemo(() => {
    if (!currentWord) return [];

    if (direction === "EN_TO_VI") {
      const wrongMeanings = folder.words
        .filter((w) => w.id !== currentWord.id)
        .map((w) => w.meaning);
      const shuffledWrong = shuffleArray(wrongMeanings).slice(0, 3);
      return shuffleArray([currentWord.meaning, ...shuffledWrong]);
    } else {
      const wrongWords = folder.words
        .filter((w) => w.id !== currentWord.id)
        .map((w) => w.word);
      const shuffledWrong = shuffleArray(wrongWords).slice(0, 3);
      return shuffleArray([currentWord.word, ...shuffledWrong]);
    }
  }, [currentWord, direction, folder.words]);

  const handleSelectOption = (opt: string) => {
    if (selectedAnswer !== null) return; // Đã trả lời rồi
    setSelectedAnswer(opt);

    const isCorrect = direction === "EN_TO_VI"
      ? opt === currentWord.meaning
      : opt === currentWord.word;

    // 1. Ghi nhận ngầm cho hệ thống chấm điểm Leitner ở lần trả lời ĐẦU TIÊN
    const hasAttempted = dbPayload.some((item) => item.wordId === currentWord.id);
    if (!hasAttempted) {
      setDbPayload((prev) => [...prev, { wordId: currentWord.id, isCorrect }]);
    }

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      // Thêm vào history hiển thị giao diện màu xanh lá (vì đã trả lời đúng)
      const inHistory = history.some((item) => item.word === currentWord.word);
      if (!inHistory) {
        setHistory((prev) => [
          ...prev,
          {
            word: currentWord.word,
            expected: currentWord.meaning,
            selected: direction === "EN_TO_VI" ? opt : currentWord.meaning,
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

    const isCorrect = direction === "EN_TO_VI"
      ? selectedAnswer === currentWord.meaning
      : selectedAnswer === currentWord.word;

    const remaining = queue.slice(1);

    if (isCorrect) {
      if (remaining.length === 0) {
        // Hoàn thành game
        const endTimeVal = Date.now();
        setIsCompleted(true);

        const timeSeconds = Math.floor((endTimeVal - startTime) / 1000);
        const realCorrectCount = dbPayload.filter((d) => d.isCorrect).length;
        const realAccuracy = totalCount > 0 ? (realCorrectCount / totalCount) * 100 : 0;

        saveSessionMutation.mutate({
          folderId,
          mode: "QUIZ",
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
        setSelectedAnswer(null);
        setDirection(Math.random() > 0.5 ? "EN_TO_VI" : "VI_TO_EN");
      }
    } else {
      // Trả lời sai -> Đẩy ngược xuống cuối hàng đợi
      setQueue([...remaining, currentWord]);
      setSelectedAnswer(null);
      setDirection(Math.random() > 0.5 ? "EN_TO_VI" : "VI_TO_EN");
    }
  };

  const handleRestart = () => {
    setQueue(shuffleArray(folder.words));
    setDbPayload([]);
    setHistory([]);
    setStreak(0);
    setMaxStreak(0);
    setSelectedAnswer(null);
    setIsCompleted(false);
    setDirection(Math.random() > 0.5 ? "EN_TO_VI" : "VI_TO_EN");
  };

  if (!currentWord) return null;

  if (isCompleted) {
    return (
      <QuizResult
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

  const isAnswered = selectedAnswer !== null;

  return (
    <div className="bg-[#eff4ff] text-[#0b1c30] flex flex-col overflow-hidden relative w-full rounded-3xl border border-[#e5eeff]/50 shadow-md">
      <main className="grow flex flex-col w-full max-w-3xl mx-auto px-4 md:px-6 py-6">
        {/* Header */}
        <header className="flex items-center justify-between w-full shrink-0 mb-6">
          <div className="grow mr-6 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[12px] font-bold text-[#464554]">
                Tiến độ đợt học: {totalCount - queue.length} / {totalCount} từ
              </span>
              <span className="text-[12px] font-bold text-[#464554]">
                Còn lại: {queue.length} câu
              </span>
            </div>
            <div className="w-full h-[8px] bg-[#e5eeff] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4648d4] rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <div className="bg-[#fffbeb] text-[#b45309] font-bold text-[13px] px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm border border-[#fde68a] shrink-0">
            <Flame className="w-4 h-4 fill-[#b45309] text-[#b45309]" />
            <span>Streak: {streak}</span>
          </div>
        </header>

        {/* Question Area */}
        <div className="flex flex-col gap-5 relative shrink-0">
          <div className="bg-[#ffffff] rounded-[24px] p-6 shadow-sm border border-[#c7c4d7]/20 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-[20px] md:text-[24px] font-extrabold text-[#0b1c30] mb-2 leading-tight">
              {direction === "EN_TO_VI" ? (
                <><span className="text-[#4648d4] font-black">&quot;{currentWord.word}&quot;</span> </>
              ) : (
                <><span className="text-[#4648d4] font-black">&quot;{currentWord.meaning}&quot;</span></>
              )}
            </h2>
            {currentWord.image && (
              <div className="w-full max-w-[280px] aspect-video rounded-xl overflow-hidden mt-3 relative shadow-inner">
                <Image
                  className="object-cover"
                  src={currentWord.image}
                  alt={currentWord.word}
                  fill
                />
              </div>
            )}
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 w-full">
            {options.map((opt, idx) => {
              const isThisSelected = selectedAnswer === opt;
              const isThisCorrect = direction === "EN_TO_VI"
                ? opt === currentWord.meaning
                : opt === currentWord.word;

              let btnClass = "bg-[#ffffff] border-[#e2e8f0] text-[#334155] hover:border-[#4648d4] hover:bg-[#f8fafc]";

              if (isAnswered) {
                if (isThisCorrect) {
                  btnClass = "bg-[#f0fff4] border-[#1d9e75] text-[#1d9e75] font-bold";
                } else if (isThisSelected && !isThisCorrect) {
                  btnClass = "bg-[#fff5f5] border-[#e53e3e] text-[#e53e3e] font-bold";
                } else {
                  btnClass = "bg-white border-[#e2e8f0] text-[#94a3b8] opacity-60";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  disabled={isAnswered}
                  className={`p-4 md:p-5 border rounded-2xl flex justify-between items-center text-left transition-all duration-200 ${
                    !isAnswered ? "hover:-translate-y-0.5 hover:shadow-md" : ""
                  } ${btnClass}`}
                >
                  <span className="text-[15px] font-semibold pr-4">
                    {opt}
                  </span>
                  {isAnswered && isThisCorrect && (
                    <CheckCircle className="text-[#1d9e75] w-5 h-5 shrink-0" />
                  )}
                  {isAnswered && isThisSelected && !isThisCorrect && (
                    <div className="text-[#e53e3e] shrink-0 font-bold text-sm">✗</div>
                  )}
                  {!isAnswered && (
                    <div className="w-5 h-5 rounded-full border border-gray-300 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          {isAnswered && (
            <div className="flex justify-center w-full animate-in slide-in-from-bottom-2 fade-in shrink-0">
              <button
                onClick={handleNext}
                className="bg-[#4648d4] hover:bg-[#6063ee] text-white font-bold text-[16px] w-full md:w-auto px-12 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {selectedAnswer === (direction === "EN_TO_VI" ? currentWord.meaning : currentWord.word) ? (
                  <>Tiếp tục</>
                ) : (
                  <>Sửa sai &amp; Tiếp tục</>
                )}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
