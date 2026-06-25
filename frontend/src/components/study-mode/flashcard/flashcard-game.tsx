"use client";

import { useState} from "react";
import Image from "next/image";
import { FolderDetail, Word } from "@/types/folder";
import { ArrowLeft, ArrowRight, CheckCircle, Volume2 } from "lucide-react";
import { FlashcardResult } from "./flashcard-result";

export interface FlashcardGameProps {
  folder: FolderDetail;
  onBack: () => void;
}

export function FlashcardGame({ folder, onBack }: FlashcardGameProps) {
  const [words, setWords] = useState<Word[]>(folder.words);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState<number>(() => Date.now());
  const [endTime, setEndTime] = useState<number | null>(null);

  const currentWord = words[currentIndex];
  const totalCount = words.length;
  const currentCount = currentIndex + 1;
  const progressPercent = (currentCount / totalCount) * 100;

  const handleNext = () => {
    if (currentIndex < totalCount - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      setEndTime(Date.now());
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleToggleLearned = () => {
    setWords((prev) =>
      prev.map((w, i) =>
        i === currentIndex ? { ...w, learned: !w.learned } : w
      )
    );
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsCompleted(false);
    setStartTime(Date.now());
    setEndTime(null);
  };

  const handlePronounce = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US"; // Defaulting to English since LingoFlow is an English learning app
      window.speechSynthesis.speak(utterance);
    }
  };

  if (isCompleted) {
    const timeSeconds = endTime && startTime ? Math.floor((endTime - startTime) / 1000) : 0;
    const learnedCount = words.filter((w) => w.learned).length;
    const wrongCount = totalCount - learnedCount;
    const accuracy = totalCount > 0 ? (learnedCount / totalCount) * 100 : 0;

    return (
      <FlashcardResult
        folderName={folder.name}
        timeSeconds={timeSeconds}
        learnedCount={learnedCount}
        wrongCount={wrongCount}
        accuracy={accuracy}
        onRestart={handleRestart}
        onBack={onBack}
      />
    );
  }

  return (
    <div className="w-full flex flex-col items-center p-4 md:p-6 min-h-screen bg-[#f8f9ff]">
      {/* Header */}
      <header className="w-full max-w-[1200px] flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#4648d4] hover:text-[#6063ee] transition-colors font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại thư mục
        </button>
        <h1 className="text-[24px] font-bold text-[#0b1c30] truncate px-6">
          Thẻ ghi nhớ: {folder.name}
        </h1>
        <div className="flex flex-col items-end gap-1 w-full md:w-auto">
          <span className="text-[12px] font-semibold text-[#464554]">
            Từ {currentCount} / {totalCount}
          </span>
          <div className="w-full md:w-32 h-[10px] bg-[#dce9ff] rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-[#4648d4] to-[#7a7cff] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Flashcard Canvas */}
      <main className="grow flex flex-col items-center justify-center w-full max-w-[1200px] relative">
        <div
          className="w-full max-w-md h-[400px] cursor-pointer relative group perspective-1000"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div
            className={`w-full h-full relative transform-style-3d transition-transform duration-500 rounded-2xl ${
              isFlipped ? "rotate-y-180" : ""
            }`}
          >
            {/* Front of Card */}
            <div className="absolute inset-0 w-full h-full bg-[#ffffff] rounded-2xl p-6 flex flex-col items-center justify-center shadow-[0_8px_16px_-4px_rgba(70,72,212,0.08)] backface-hidden group-hover:-translate-y-1 transition-all duration-200 border border-[#e5eeff]">
              <button
                onClick={(e) => handlePronounce(e, currentWord.word)}
                className="absolute top-4 right-4 p-2 text-[#464554]/60 hover:text-[#4648d4] hover:bg-[#eff4ff] rounded-full transition-colors"
                title="Nghe phát âm"
              >
                <Volume2 className="w-[22px] h-[22px]" />
              </button>

              <span className="px-3 py-1 bg-[#dce9ff] text-[#4648d4] text-[12px] rounded-full mb-8 font-bold uppercase">
                {currentWord.pos || "Word"}
              </span>
              <h2 className="text-[32px] md:text-[48px] text-[#0b1c30] mb-6 text-center font-extrabold tracking-tight leading-none">
                {currentWord.word}
              </h2>
              <p className="text-[18px] text-[#464554] mb-10 italic">
                {currentWord.phonetic || "..."}
              </p>
              <p className="text-[12px] text-[#767586] absolute bottom-6 flex items-center gap-1 animate-pulse">
                Chạm để xem nghĩa
              </p>
            </div>

            {/* Back of Card */}
            <div className="absolute inset-0 w-full h-full bg-[#ffffff] rounded-2xl p-6 flex flex-col items-center justify-center shadow-[0_8px_16px_-4px_rgba(70,72,212,0.08)] backface-hidden rotate-y-180 border-2 border-[#006c49]/40">
              <h2 className="text-[32px] text-[#006c49] mb-8 text-center font-bold">
                {currentWord.meaning}
              </h2>
              <div className="w-full bg-[#eff4ff] rounded-xl p-4 flex flex-col gap-2 shadow-[0_2px_8px_-2px_rgba(70,72,212,0.04)] h-[160px] justify-center items-center">
                <p className="text-[16px] text-[#0b1c30] italic text-center px-2">
                  {currentWord.example
                    ? `"${currentWord.example}"`
                    : "Chưa có câu ví dụ."}
                </p>
                {currentWord.image && (
                  <div className="relative w-[120px] h-[80px] mt-2 rounded-lg overflow-hidden opacity-90 mx-auto">
                    <Image
                      src={currentWord.image}
                      alt={currentWord.word}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-center gap-4 mt-8 w-full max-w-md">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex-1 py-3 px-4 border border-[#4648d4] text-[#4648d4] rounded-xl font-semibold hover:bg-[#eff4ff] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 bg-white"
          >
            Trước
          </button>
          <button
            onClick={handleToggleLearned}
            className={`flex-none p-2 rounded-full transition-all duration-200 shadow-sm flex items-center justify-center w-14 h-14 ${
              currentWord.learned
                ? "text-[#006c49] bg-[#6cf8bb]"
                : "text-[#464554] bg-[#d3e4fe] hover:bg-[#6cf8bb] hover:text-[#006c49]"
            }`}
            title="Đánh dấu đã thuộc"
          >
            <CheckCircle className="w-8 h-8" />
          </button>
          <button
            onClick={handleNext}
            className="flex-1 py-3 px-4 bg-[#4648d4] text-white rounded-xl font-semibold hover:bg-[#6063ee] shadow-sm hover:shadow-md transition-all duration-200 flex justify-center items-center gap-2"
          >
            {currentIndex === totalCount - 1 ? "Hoàn thành" : "Tiếp theo"}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </main>

      {/* Tailwind classes for 3D card flipping */}
      <style dangerouslySetInnerHTML={{ __html: `
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}} />
    </div>
  );
}
