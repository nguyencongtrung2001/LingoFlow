"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FolderDetail, Word } from "@/types/folder";
import { X, Flame, Volume2, AlertCircle, Lightbulb, Languages, CheckCircle, ArrowRight } from "lucide-react";
import { WriteResult, WriteHistoryItem } from "./write-result";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export interface WriteGameProps {
  folder: FolderDetail;
  onBack: () => void;
}

export function WriteGame({ folder, onBack }: WriteGameProps) {
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [history, setHistory] = useState<WriteHistoryItem[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setWords(shuffleArray(folder.words));
    setIsMounted(true);
  }, [folder.words]);

  if (!isMounted || words.length === 0) {
    return null;
  }

  const currentWord = words[currentIndex];
  const totalCount = words.length;
  const currentCount = currentIndex + 1;
  const progressPercent = totalCount > 0 ? (currentCount / totalCount) * 100 : 0;

  const handleCheck = () => {
    if (!inputValue.trim()) return;
    
    const isAnsCorrect = inputValue.trim().toLowerCase() === currentWord.word.toLowerCase();
    setIsCorrect(isAnsCorrect);
    setShowFeedback(true);
    setShowTranslation(false);

    if (isAnsCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      setCorrectCount(prev => prev + 1);
    } else {
      setStreak(0);
    }

    setHistory((prev) => [
      ...prev,
      {
        expectedWord: currentWord.word,
        expectedMeaning: currentWord.meaning,
        typedWord: inputValue.trim(),
        isCorrect: isAnsCorrect,
      },
    ]);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setInputValue("");
    if (currentIndex < totalCount - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleSkip = () => {
    setStreak(0);
    setIsCorrect(false);
    setShowFeedback(true);
    setInputValue("");

    setHistory((prev) => [
      ...prev,
      {
        expectedWord: currentWord.word,
        expectedMeaning: currentWord.meaning,
        typedWord: "",
        isCorrect: false,
      },
    ]);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectCount(0);
    setHistory([]);
    setInputValue("");
    setShowFeedback(false);
    setIsCompleted(false);
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
        correctCount={correctCount}
        totalCount={totalCount}
        accuracy={(correctCount / totalCount) * 100}
        maxStreak={maxStreak}
        history={history}
        onRestart={handleRestart}
        onBack={onBack}
      />
    );
  }

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen flex flex-col overflow-hidden relative">
      <div className="fixed inset-0 -z-10 bg-linear-to-br from-[#4648d4]/5 via-transparent to-[#006c49]/5 pointer-events-none" />

      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[#f8f9ff] shadow-sm h-16 flex items-center justify-center">
        <div className="flex justify-between items-center px-4 md:px-6 w-full max-w-[1200px] mx-auto">
          <button
            onClick={onBack}
            className="hover:bg-[#e5eeff] p-2 rounded-full transition-colors duration-200"
          >
            <X className="text-[#464554] w-6 h-6" />
          </button>
          <h1 className="text-[20px] md:text-[24px] font-bold text-[#4648d4]">
            Gõ từ: {folder.name}
          </h1>
          <div className="flex items-center gap-1 bg-[#ffddb8] text-[#825100] px-3 py-1 rounded-full animate-pulse shadow-sm">
            <Flame className="w-4 h-4 fill-current" />
            <span className="text-[14px] font-semibold">{streak}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="grow flex flex-col pt-24 pb-32 px-4 items-center w-full">
        {/* Progress */}
        <div className="w-full max-w-xl mb-8">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[14px] font-semibold text-[#464554]">
              Câu {currentCount} / {totalCount}
            </span>
            <span className="text-[12px] font-medium text-[#4648d4]">
              {Math.round(progressPercent)}% hoàn thành
            </span>
          </div>
          <div className="h-[10px] w-full bg-[#e5eeff] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4648d4] transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Word Card */}
        <div className="relative w-full max-w-xl bg-[#ffffff] rounded-[24px] p-6 shadow-[0_8px_16px_-4px_rgba(70,72,212,0.08)] transition-all duration-200 text-center mb-8 border border-[#e5eeff]">
          <button
            onClick={(e) => handlePronounce(e, currentWord.word)}
            className="absolute top-4 right-4 p-2 text-[#464554]/60 hover:text-[#4648d4] hover:bg-[#eff4ff] rounded-full transition-colors"
            title="Nghe phát âm"
          >
            <Volume2 className="w-[22px] h-[22px]" />
          </button>
          
          <div className="mb-6 flex justify-center">
            <div className="w-32 h-32 rounded-xl overflow-hidden bg-[#eff4ff] flex items-center justify-center border border-[#c7c4d7] relative">
              {currentWord.image ? (
                <Image
                  src={currentWord.image}
                  alt={currentWord.word}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-[#464554]">No Image</span>
              )}
            </div>
          </div>
          <h2 className="text-[40px] md:text-[48px] font-extrabold text-[#4648d4] mb-6">
            {currentWord.word}
          </h2>
          <div className="flex items-center justify-center gap-6 mb-10">
            <span className="px-3 py-1 bg-[#dce9ff] text-[#4648d4] text-[12px] font-bold rounded-full uppercase">
              {currentWord.pos || "Word"}
            </span>
            <span className="italic text-[#464554] text-[16px]">
              {currentWord.phonetic || "..."}
            </span>
          </div>

          <div className="relative w-full">
            <input
              id="vocab-input"
              type="text"
              placeholder="Nhập nghĩa tiếng Việt..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={showFeedback}
              autoFocus
              className="w-full text-center py-4 px-4 text-[20px] font-medium border-2 border-[#c7c4d7] rounded-xl bg-[#eff4ff] focus:border-[#4648d4] focus:ring-0 transition-all outline-none text-[#0b1c30] disabled:opacity-70 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-xl flex gap-4 mt-auto md:mt-0 shrink-0">
          {!showFeedback ? (
            <>
              <button
                onClick={handleSkip}
                className="flex-1 py-4 px-6 rounded-xl border-2 border-[#4648d4] text-[#4648d4] font-semibold hover:bg-[#4648d4]/5 active:scale-95 transition-all duration-200"
              >
                Bỏ qua
              </button>
              <button
                onClick={handleCheck}
                disabled={!inputValue.trim()}
                className="flex-2 py-4 px-6 rounded-xl bg-[#4648d4] text-white font-semibold shadow-lg shadow-[#4648d4]/20 hover:opacity-90 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Kiểm tra
              </button>
            </>
          ) : (
            <button
              onClick={handleNext}
              className="w-full py-4 px-6 rounded-xl bg-[#4648d4] hover:bg-[#2f2ebe] text-white font-bold text-[18px] shadow-lg shadow-[#4648d4]/20 hover:shadow-xl active:scale-95 transition-all duration-200 flex items-center justify-center gap-3 animate-in zoom-in-95"
            >
              Tiếp tục
              <ArrowRight className="w-6 h-6" />
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
