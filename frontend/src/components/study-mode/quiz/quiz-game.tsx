"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { FolderDetail, Word } from "@/types/folder";
import { defaultFolderData } from "@/lib/data";
import { X, CheckCircle, ArrowRight } from "lucide-react";
import { QuizResult, QuizHistoryItem } from "./quiz-result";

export interface QuizGameProps {
  folder: FolderDetail;
  onBack: () => void;
}

// Collect all meanings from all folders to use as distractors
const allMeanings = defaultFolderData.flatMap((f) => f.words.map((w) => w.meaning));

function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

export function QuizGame({ folder, onBack }: QuizGameProps) {
  const [words, setWords] = useState<Word[]>(() => shuffleArray(folder.words));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [history, setHistory] = useState<QuizHistoryItem[]>([]);

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentWord = words[currentIndex];
  const totalCount = words.length;
  const currentCount = currentIndex + 1;
  const progressPercent = totalCount > 0 ? (currentCount / totalCount) * 100 : 0;

  // Generate options when current index changes
  const options = useMemo(() => {
    if (!currentWord) return [];
    
    // Get 3 wrong answers
    const wrongMeanings = allMeanings.filter((m) => m !== currentWord.meaning);
    const shuffledWrong = shuffleArray(wrongMeanings).slice(0, 3);
    
    // Mix with correct answer
    return shuffleArray([currentWord.meaning, ...shuffledWrong]);
  }, [currentWord]);

  const handleSelectOption = (opt: string) => {
    if (selectedAnswer !== null) return; // Already answered
    setSelectedAnswer(opt);
    
    const isThisCorrect = opt === currentWord.meaning;
    
    if (isThisCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      setCorrectCount((prev) => prev + 1);
    } else {
      setStreak(0);
    }

    setHistory((prev) => [
      ...prev,
      {
        word: currentWord.word,
        expected: currentWord.meaning,
        selected: opt,
        isCorrect: isThisCorrect,
      },
    ]);
  };

  const handleNext = () => {
    if (currentIndex < totalCount - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setWords(shuffleArray(folder.words));
    setCurrentIndex(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectCount(0);
    setHistory([]);
    setSelectedAnswer(null);
    setIsCompleted(false);
  };

  if (!currentWord) return null;

  if (isCompleted) {
    const accuracy = totalCount > 0 ? (correctCount / totalCount) * 100 : 0;
    return (
      <QuizResult
        correctCount={correctCount}
        totalCount={totalCount}
        accuracy={accuracy}
        maxStreak={maxStreak}
        history={history}
        onRestart={handleRestart}
        onBack={onBack}
      />
    );
  }

  const isAnswered = selectedAnswer !== null;

  return (
    <div className="bg-[#eff4ff] text-[#0b1c30] h-screen flex flex-col overflow-hidden relative w-full">
      <main className="grow flex flex-col w-full max-w-3xl mx-auto px-4 md:px-6 py-4">
        {/* Header */}
        <header className="flex items-center justify-between w-full shrink-0 mb-4">
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#e5eeff] transition-colors text-[#464554]"
          >
            <X className="w-6 h-6 hover:text-[#ba1a1a]" />
          </button>
          <div className="grow mx-6 flex flex-col items-center">
            <span className="text-[14px] font-semibold text-[#464554] mb-2">
              Câu {currentCount} / {totalCount}
            </span>
            <div className="w-full h-[10px] bg-[#e5eeff] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4648d4] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <div className="bg-[#fef3c7] text-[#b45309] font-semibold text-[14px] px-4 py-2 rounded-full flex items-center gap-2 shadow-sm border border-[#fde68a]">
            <span>Streak: {streak}</span>
            <span className="text-lg leading-none animate-bounce"></span>
          </div>
        </header>

        {/* Question Area */}
        <div className="flex flex-col gap-4 relative shrink-0 mt-4 md:mt-8">
          <div className="bg-[#ffffff] rounded-[24px] p-4 md:p-6 shadow-[0_8px_16px_-4px_rgba(70,72,212,0.08)] border border-[#c7c4d7]/30 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-[20px] md:text-[24px] font-semibold text-[#0b1c30] mb-4">
              Từ &quot;{currentWord.word}&quot; mang nghĩa nào sau đây?
            </h2>
            {currentWord.image && (
              <div className="w-full max-w-[400px] aspect-video rounded-xl overflow-hidden mb-4 relative shadow-[0_2px_8px_-2px_rgba(70,72,212,0.04)]">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {options.map((opt, idx) => {
              const isThisSelected = selectedAnswer === opt;
              const isThisCorrect = opt === currentWord.meaning;
              
              let btnClass = "bg-[#f8f9ff] border-[#c7c4d7] text-[#0b1c30] hover:border-[#4648d4] hover:bg-[#ffffff]";
              
              if (isAnswered) {
                if (isThisCorrect) {
                  btnClass = "bg-[#ecfdf5] border-[#006c49] text-[#006c49] shadow-[0_8px_16px_-4px_rgba(70,72,212,0.08)]";
                } else if (isThisSelected && !isThisCorrect) {
                  btnClass = "bg-[#fef2f2] border-[#ba1a1a] text-[#991b1b]";
                } else {
                  btnClass = "bg-[#f8f9ff] border-[#c7c4d7] text-[#0b1c30] opacity-60";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  disabled={isAnswered}
                  className={`p-4 md:p-5 border-2 rounded-xl flex justify-between items-center text-left transition-all duration-200 ${
                    !isAnswered ? "hover:-translate-y-1 hover:shadow-[0_8px_16px_-4px_rgba(70,72,212,0.08)]" : ""
                  } ${btnClass}`}
                >
                  <span className={`text-[16px] pr-4 ${isThisCorrect && isAnswered ? "font-bold" : "font-medium"}`}>
                    {opt}
                  </span>
                  {isAnswered && isThisCorrect && (
                    <CheckCircle className="text-[#006c49] w-6 h-6 shrink-0" />
                  )}
                  {isAnswered && isThisSelected && !isThisCorrect && (
                    <div className="text-[#ba1a1a] shrink-0 font-bold text-xl">X</div>
                  )}
                  {!isAnswered && (
                    <div className="w-6 h-6 rounded-full border-2 border-[#c7c4d7] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          {isAnswered && (
            <div className="flex justify-center w-full animate-in slide-in-from-bottom-4 fade-in shrink-0 mt-2">
              <button
                onClick={handleNext}
                className="bg-[#4648d4] hover:bg-[#2f2ebe] text-white font-bold text-[18px] w-full md:w-auto px-12 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
              >
                Câu tiếp theo
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
