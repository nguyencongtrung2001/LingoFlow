"use client";

import { Folder, RotateCcw, Timer, XCircle, CheckCircle, Target } from "lucide-react";
import Image from "next/image";
import tropy from "@/public/tropy 1.png"
export interface FlashcardResultProps {
  folderName: string;
  timeSeconds: number;
  wrongCount: number;
  learnedCount: number;
  accuracy: number;
  onRestart: () => void;
  onBack: () => void;
}

export function FlashcardResult({
  folderName,
  timeSeconds,
  wrongCount,
  learnedCount,
  accuracy,
  onRestart,
  onBack,
}: FlashcardResultProps) {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen overflow-hidden flex items-center justify-center p-4">
      <main className="w-full max-w-5xl flex flex-col items-center justify-center">
        {/* Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#e0e7ff] mb-5 animate-bounce shadow-sm text-[48px]">
           <Image src={tropy} alt="Trophy" width={24} height={24} />
          </div>
          <h1 className="text-[32px] md:text-[48px] font-bold text-[#4f46e5] mb-3">
            Xuất Sắc!
          </h1>
          <p className="text-[#475569] text-[18px]">
            Bạn đã hoàn thành xuất sắc thẻ ghi nhớ &quot;{folderName}&quot;
          </p>
        </div>

        {/* Stats Grid */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Time */}
          <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e2e8f0] shadow-[0_4px_12px_-2px_rgba(79,70,229,0.04)] hover:shadow-[0_12px_20px_-4px_rgba(79,70,229,0.08)] hover:-translate-y-1 transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#e0e7ff] text-[#4f46e5] flex items-center justify-center mb-3">
                <Timer className="w-6 h-6" />
              </div>
              <div className="text-[24px] font-bold text-[#0f172a] mb-1">
                {formatTime(timeSeconds)}
              </div>
              <div className="text-[14px] text-[#64748b]">
                Thời gian hoàn thành
              </div>
            </div>
          </div>

          {/* Wrong Words */}
          <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e2e8f0] shadow-[0_4px_12px_-2px_rgba(79,70,229,0.04)] hover:shadow-[0_12px_20px_-4px_rgba(79,70,229,0.08)] hover:-translate-y-1 transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#fef3c7] text-[#d97706] flex items-center justify-center mb-3">
                <XCircle className="w-6 h-6" />
              </div>
              <div className="text-[24px] font-bold text-[#0f172a] mb-1">
                {wrongCount} từ
              </div>
              <div className="text-[14px] text-[#64748b]">
                Từ vựng chưa thuộc
              </div>
            </div>
          </div>

          {/* Learned */}
          <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e2e8f0] shadow-[0_4px_12px_-2px_rgba(79,70,229,0.04)] hover:shadow-[0_12px_20px_-4px_rgba(79,70,229,0.08)] hover:-translate-y-1 transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#dcfce7] text-[#16a34a] flex items-center justify-center mb-3">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="text-[24px] font-bold text-[#0f172a] mb-1">
                +{learnedCount} từ
              </div>
              <div className="text-[14px] text-[#64748b]">
                Từ vựng đã thuộc
              </div>
            </div>
          </div>

          {/* Accuracy */}
          <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e2e8f0] shadow-[0_4px_12px_-2px_rgba(79,70,229,0.04)] hover:shadow-[0_12px_20px_-4px_rgba(79,70,229,0.08)] hover:-translate-y-1 transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#f3e8ff] text-[#9333ea] flex items-center justify-center mb-3">
                <Target className="w-6 h-6" />
              </div>
              <div className="text-[24px] font-bold text-[#0f172a] mb-1">
                {Math.round(accuracy)}%
              </div>
              <div className="text-[14px] text-[#64748b]">
                Độ chính xác
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-xl">
          <button
            onClick={onRestart}
            className="flex-1 py-4 px-8 bg-[#4f46e5] text-white rounded-xl font-semibold hover:bg-[#4338ca] transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm"
          >
            <RotateCcw className="w-5 h-5" />
            Học lại từ đầu
          </button>
          <button
            onClick={onBack}
            className="flex-1 py-4 px-8 border-2 border-[#cbd5e1] text-[#475569] rounded-xl font-semibold hover:bg-[#f1f5f9] transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Folder className="w-5 h-5" />
            Quay về thư mục
          </button>
        </div>
      </main>
    </div>
  );
}
