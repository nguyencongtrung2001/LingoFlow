"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import { FolderDetail, Word } from "@/types/folder";
import { CheckCircle, ArrowRight, Flame, Volume2, X } from "lucide-react";
import { MixedResult, MixedHistoryItem } from "./mixed-result";
import { useSaveStudySession } from "@/feature/words/hooks/useWords";

export interface MixedGameProps {
  folder: FolderDetail;
  onBack: () => void;
  onRestart?: () => void;
}

function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
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

export function MixedGame({ folder, onBack, onRestart }: MixedGameProps) {
  const folderId = parseInt(folder.id);
  const saveSessionMutation = useSaveStudySession(folderId);

  const [queue, setQueue] = useState<Word[]>(() => shuffleArray(folder.words));
  const [dbPayload, setDbPayload] = useState<Array<{ wordId: number; isCorrect: boolean }>>([]);
  const [history, setHistory] = useState<MixedHistoryItem[]>([]);
  const [totalCount] = useState(folder.words.length);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime] = useState<number>(() => Date.now());

  // Game state cho từ hiện tại
  const [questionType, setQuestionType] = useState<"QUIZ" | "WRITE">(() => Math.random() > 0.5 ? "QUIZ" : "WRITE");
  const [direction, setDirection] = useState<"EN_TO_VI" | "VI_TO_EN">(() => Math.random() > 0.5 ? "EN_TO_VI" : "VI_TO_EN");
  
  // Trạng thái của QUIZ
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  
  // Trạng thái của WRITE
  const [inputValue, setInputValue] = useState("");
  const [showWriteFeedback, setShowWriteFeedback] = useState(false);
  const [isWriteCorrect, setIsWriteCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const currentWord = queue[0];
  const progressPercent = totalCount > 0 ? ((totalCount - queue.length) / totalCount) * 100 : 0;

  const expectedAnswer = currentWord
    ? (direction === "EN_TO_VI" ? currentWord.meaning : currentWord.word)
    : "";

  // Tạo options cho chế độ QUIZ
  const options = useMemo(() => {
    if (!currentWord || questionType !== "QUIZ") return [];

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
  }, [currentWord, direction, questionType, folder.words]);

  // --- LOGIC: CHỌN ĐÁP ÁN (QUIZ) ---
  const handleSelectOption = (opt: string) => {
    if (selectedAnswer !== null) return; 
    setSelectedAnswer(opt);

    const isCorrect = opt === expectedAnswer;
    handleAnswerResult(isCorrect, opt);
  };

  // --- LOGIC: GÕ TỪ (WRITE) ---
  const handleCheckWrite = () => {
    if (!inputValue.trim() || !currentWord) return;

    const isCorrect = checkMultipleAnswers(inputValue, expectedAnswer);
    setIsWriteCorrect(isCorrect);
    setShowWriteFeedback(true);
    handleAnswerResult(isCorrect, inputValue.trim());
  };

  // --- LOGIC CHUNG KHI TRẢ LỜI ---
  const handleAnswerResult = (isCorrect: boolean, userAnswer: string) => {
    if (!currentWord) return;
    
    // Ghi nhận DB ở lần trả lời đầu
    const hasAttempted = dbPayload.some((item) => item.wordId === currentWord.id);
    if (!hasAttempted) {
      setDbPayload((prev) => [...prev, { wordId: currentWord.id, isCorrect }]);
    }

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      const inHistory = history.some((item) => item.word === currentWord.word);
      if (!inHistory) {
        setHistory((prev) => [
          ...prev,
          {
            word: currentWord.word,
            expected: expectedAnswer,
            userAnswer,
            isCorrect: true,
            type: questionType,
          },
        ]);
      }
    } else {
      setStreak(0);
    }
  };

  // --- LOGIC CHUYỂN CÂU ---
  const handleNext = () => {
    if (!currentWord) return;

    const isCorrect = questionType === "QUIZ" 
      ? selectedAnswer === expectedAnswer 
      : isWriteCorrect;

    const remaining = queue.slice(1);

    if (isCorrect) {
      if (remaining.length === 0) {
        finishGame();
      } else {
        setQueue(remaining);
        resetCurrentState();
      }
    } else {
      // Đẩy lại cuối hàng đợi
      setQueue([...remaining, currentWord]);
      resetCurrentState();
    }
  };

  const isAnswered = questionType === "QUIZ" ? selectedAnswer !== null : showWriteFeedback;
  const isCurrentlyCorrect = questionType === "QUIZ" 
    ? selectedAnswer === expectedAnswer 
    : isWriteCorrect;

  const handleNextRef = useRef(handleNext);
  useEffect(() => {
    handleNextRef.current = handleNext;
  });

  useEffect(() => {
    if (isAnswered && isCurrentlyCorrect) {
      const timer = setTimeout(() => {
        handleNextRef.current();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isAnswered, isCurrentlyCorrect]);

  const resetCurrentState = () => {
    setSelectedAnswer(null);
    setInputValue("");
    setShowWriteFeedback(false);
    setShowHint(false);
    setQuestionType(Math.random() > 0.5 ? "QUIZ" : "WRITE");
    setDirection(Math.random() > 0.5 ? "EN_TO_VI" : "VI_TO_EN");
  };

  const finishGame = () => {
    const endTimeVal = Date.now();
    setIsCompleted(true);

    const timeSeconds = Math.floor((endTimeVal - startTime) / 1000);
    const realCorrectCount = dbPayload.filter((d) => d.isCorrect).length;
    const realAccuracy = totalCount > 0 ? (realCorrectCount / totalCount) * 100 : 0;

    saveSessionMutation.mutate({
      folderId,
      mode: "QUIZ", // Lưu chung là QUIZ hoặc MIXED nếu DB hỗ trợ
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
  };

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
    setIsCompleted(false);
    resetCurrentState();
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
      if (questionType === "WRITE") {
        if (showWriteFeedback) handleNext();
        else handleCheckWrite();
      }
    }
  };

  if (!currentWord) return null;

  if (isCompleted) {
    return (
      <MixedResult
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
          
          <div className="flex-1 px-4 md:px-8">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[12px] font-bold text-[#464554]">
                Tiến độ: {totalCount - queue.length} / {totalCount}
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                questionType === "QUIZ" ? "bg-[#dce9ff] text-[#4648d4]" : "bg-[#fce7f3] text-[#be185d]"
              }`}>
                {questionType === "QUIZ" ? "TRẮC NGHIỆM" : "GÕ TỪ"}
              </span>
            </div>
            <div className="w-full h-[6px] bg-[#e5eeff] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4648d4] transition-all duration-300 ease-out rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-[#fffbeb] text-[#b45309] px-3 md:px-4 py-1.5 md:py-2 rounded-xl border border-[#fde68a] shadow-sm shrink-0">
            <Flame className="w-4 h-4 fill-[#b45309]" />
            <span className="text-[13px] font-bold">Streak: {streak}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="grow flex flex-col px-4 py-6 items-center w-full max-w-3xl mx-auto">
        
        {/* Word Card */}
        <div className="relative w-full bg-[#ffffff] rounded-[24px] p-6 shadow-sm mb-6 border border-[#c7c4d7]/20 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4">
          {direction === "EN_TO_VI" && (
            <button
              onClick={(e) => handlePronounce(e, currentWord.word)}
              className="absolute top-4 right-4 p-2 text-[#464554]/60 hover:text-[#4648d4] hover:bg-[#eff4ff] rounded-full transition-colors"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          )}

          <h2 className="text-[28px] md:text-[36px] font-black text-[#4648d4] mb-2 leading-tight text-center">
            {direction === "EN_TO_VI" ? currentWord.word : currentWord.meaning}
          </h2>

          <div className="flex items-center justify-center gap-4 mb-2">
            <span className="px-3 py-1 bg-[#dce9ff] text-[#4648d4] text-[11px] font-bold rounded-full uppercase">
              {currentWord.pos || "Word"}
            </span>
            {direction === "EN_TO_VI" && currentWord.phonetic && (
              <span className="italic text-[#64748b] text-[14px]">
                {currentWord.phonetic}
              </span>
            )}
          </div>

          {currentWord.image && (
            <div className="w-full max-w-[200px] aspect-video rounded-xl overflow-hidden mt-3 relative shadow-inner">
              <Image className="object-cover" src={currentWord.image} alt={currentWord.word} fill />
            </div>
          )}
        </div>

        {/* --- KHU VỰC TRẢ LỜI --- */}
        <div className="w-full shrink-0 flex flex-col gap-4">
          
          {/* UI CHẾ ĐỘ QUIZ */}
          {questionType === "QUIZ" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 w-full">
              {options.map((opt, idx) => {
                const isThisSelected = selectedAnswer === opt;
                const isThisCorrect = opt === expectedAnswer;
                let btnClass = "bg-[#ffffff] border-[#e2e8f0] text-[#334155] hover:border-[#4648d4] hover:bg-[#f8fafc]";

                if (isAnswered) {
                  if (isThisCorrect) btnClass = "bg-[#f0fff4] border-[#1d9e75] text-[#1d9e75] font-bold";
                  else if (isThisSelected) btnClass = "bg-[#fff5f5] border-[#e53e3e] text-[#e53e3e] font-bold";
                  else btnClass = "bg-white border-[#e2e8f0] text-[#94a3b8] opacity-60";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(opt)}
                    disabled={isAnswered}
                    className={`p-4 md:p-5 border rounded-2xl flex justify-between items-center text-left transition-all duration-200 ${!isAnswered ? "hover:-translate-y-0.5 shadow-sm" : ""} ${btnClass}`}
                  >
                    <span className="text-[15px] font-semibold pr-4">{opt}</span>
                    {isAnswered && isThisCorrect && <CheckCircle className="text-[#1d9e75] w-5 h-5 shrink-0" />}
                    {isAnswered && isThisSelected && !isThisCorrect && <div className="text-[#e53e3e] font-bold">✗</div>}
                    {!isAnswered && <div className="w-5 h-5 rounded-full border border-gray-300 shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* UI CHẾ ĐỘ WRITE */}
          {questionType === "WRITE" && (
            <div className="w-full">
              {!showWriteFeedback ? (
                <div className="w-full flex flex-col gap-3">
                  <div className="w-full flex gap-3">
                    <input
                      type="text"
                      placeholder={direction === "EN_TO_VI" ? "Nhập nghĩa tiếng Việt..." : "Type the English word..."}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      autoFocus
                      className="w-full text-center py-4 px-4 text-[18px] font-semibold border border-[#e2e8f0] rounded-2xl bg-white focus:border-[#4648d4] focus:ring-0 transition-all outline-none text-[#0f172a] shadow-sm"
                    />
                    <button
                      onClick={handleCheckWrite}
                      disabled={!inputValue.trim()}
                      className="px-6 py-4 rounded-2xl bg-[#4648d4] text-white font-bold text-[16px] shadow-sm hover:bg-[#6063ee] active:scale-95 disabled:opacity-50 shrink-0"
                    >
                      Kiểm tra
                    </button>
                  </div>
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
                  {isWriteCorrect ? (
                    <div className="p-4 bg-[#f0fff4] rounded-2xl border border-[#bbf7d0] text-center">
                      <p className="text-[14px] text-[#1d9e75] font-bold">Chính xác!</p>
                      <p className="text-[20px] font-bold text-[#0f172a] mt-1">{expectedAnswer}</p>
                    </div>
                  ) : (
                    <div className="p-4 bg-[#fff5f5] rounded-2xl border border-[#feb2b2] text-center">
                      <p className="text-[14px] text-[#e53e3e] font-bold">Chưa chính xác!</p>
                      <div className="mt-2 text-[14px] text-[#334155] font-semibold">
                        Đáp án đúng là:
                        <p className="text-[22px] font-extrabold text-[#1d9e75] mt-1">{expectedAnswer}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Nút Next Chung (Khi đã trả lời) */}
          {isAnswered && (
            <div className="flex justify-center w-full animate-in slide-in-from-bottom-2 fade-in mt-2">
              <button
                onClick={handleNext}
                className="bg-[#4648d4] hover:bg-[#6063ee] text-white font-bold text-[16px] w-full px-12 py-4 rounded-2xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                Tiếp tục <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
          
        </div>
      </main>
    </div>
  );
}
