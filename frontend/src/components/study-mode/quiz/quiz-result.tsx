"use client";

import { Trophy, CheckCircle2, Percent, Flame, ClipboardList, RotateCcw, Folder } from "lucide-react";

export interface QuizHistoryItem {
  word: string;
  expected: string;
  selected: string;
  isCorrect: boolean;
}

export interface QuizResultProps {
  correctCount: number;
  totalCount: number;
  accuracy: number;
  maxStreak: number;
  history: QuizHistoryItem[];
  onRestart: () => void;
  onBack: () => void;
}

export function QuizResult({
  correctCount,
  totalCount,
  accuracy,
  maxStreak,
  history,
  onRestart,
  onBack,
}: QuizResultProps) {
  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen w-full overflow-hidden flex flex-col items-center justify-center p-4 md:p-6">
      <main className="w-full max-w-4xl bg-white rounded-[24px] border border-[#e5eeff]/60 p-4 md:p-8 flex flex-col items-center justify-between gap-6 shadow-[0_4px_12px_-2px_rgba(70,72,212,0.04)] max-h-[95vh]">
        
        {/* Header */}
        <div className="text-center w-full flex flex-col items-center shrink-0">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#d3e4fe] rounded-full mb-3 animate-bounce">
            <Trophy className="text-[#4648d4] w-10 h-10" />
          </div>
          <h1 className="text-[24px] md:text-[32px] text-[#4648d4] font-extrabold tracking-tight mb-1">
            Hoàn Thành Bài Quiz! 🎯
          </h1>
          <p className="text-[14px] md:text-[18px] text-[#464554]">
            Bạn đã vượt qua bài trắc nghiệm lựa chọn đáp án
          </p>
        </div>

        {/* Bento Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 my-2 shrink-0">
          {/* Correct Count */}
          <div className="bg-[#f0fff4] border border-[#bbf7d0] rounded-xl p-4 flex flex-col items-center text-center justify-center shadow-sm">
            <CheckCircle2 className="text-[#1d9e75] w-6 h-6 mb-1" />
            <span className="text-[24px] font-extrabold text-[#1d9e75]">
              {correctCount} / {totalCount}
            </span>
            <span className="text-[11px] font-bold text-[#464554] uppercase tracking-wider mt-1">
              Số câu đúng
            </span>
          </div>

          {/* Accuracy */}
          <div className="bg-[#eff4ff] border border-[#dce9ff] rounded-xl p-4 flex flex-col items-center text-center justify-center shadow-sm">
            <Percent className="text-[#4648d4] w-6 h-6 mb-1" />
            <span className="text-[24px] font-extrabold text-[#4648d4]">
              {Math.round(accuracy)}%
            </span>
            <span className="text-[11px] font-bold text-[#464554] uppercase tracking-wider mt-1">
              Độ chính xác
            </span>
          </div>

          {/* Max Streak */}
          <div className="bg-[#fffbeb] border border-[#fff9b3] rounded-xl p-4 flex flex-col items-center text-center justify-center shadow-sm">
            <Flame className="text-[#825100] w-6 h-6 mb-1 fill-[#825100]" />
            <span className="text-[24px] font-extrabold text-[#825100]">
              {maxStreak} câu
            </span>
            <span className="text-[11px] font-bold text-[#464554] uppercase tracking-wider mt-1">
              Chuỗi Streak lớn nhất
            </span>
          </div>
        </div>

        {/* Review Box */}
        <div className="w-full flex-1 overflow-y-auto bg-[#f8f9ff] border border-[#e5eeff] rounded-xl p-3 md:p-4 min-h-[140px] max-h-[240px] custom-scrollbar">
          <p className="text-[12px] text-[#464554] font-bold uppercase tracking-wider mb-2 flex items-center gap-1 sticky top-0 bg-[#f8f9ff] pb-2 z-10">
            <ClipboardList className="w-4 h-4" /> Nhật ký đáp án đã chọn
          </p>
          <div className="space-y-2">
            {history.map((item, idx) => {
              if (item.isCorrect) {
                return (
                  <div key={idx} className="flex justify-between items-center bg-[#e6fffa] p-3 rounded-lg border border-[#a3f7e2] shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#00cc66] text-white flex items-center justify-center text-[12px] font-black">
                        ✓
                      </span>
                      <span className="font-bold text-[#0b1c30] text-[14px]">
                        {item.word}
                      </span>
                    </div>
                    <span className="text-[14px] font-bold text-[#00994d] text-right">
                      {item.expected}
                    </span>
                  </div>
                );
              } else {
                return (
                  <div key={idx} className="flex justify-between items-center bg-[#fff5f5] p-3 rounded-lg border border-[#feb2b2] shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#ff3333] text-white flex items-center justify-center text-[12px] font-black">
                        ✗
                      </span>
                      <span className="font-bold text-[#0b1c30] text-[14px]">
                        {item.word}
                      </span>
                    </div>
                    <span className="text-[14px] font-bold text-[#cc0000] text-right">
                      {item.expected}
                    </span>
                  </div>
                );
              }
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row gap-4 justify-center items-center shrink-0 pt-2">
          <button
            onClick={onRestart}
            className="w-full sm:w-1/2 bg-[#4648d4] text-white py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md hover:bg-[#6063ee] active:scale-[0.98] transition-all font-bold"
          >
            <RotateCcw className="w-5 h-5" />
            Làm bài Quiz mới
          </button>
          <button
            onClick={onBack}
            className="w-full sm:w-1/2 bg-white border-2 border-[#c7c4d7] text-[#464554] py-3 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-[#eff4ff] active:scale-[0.98] transition-all font-semibold"
          >
            <Folder className="w-5 h-5" />
            Quay về thư mục
          </button>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #c7c4d7;
          border-radius: 20px;
        }
      `}} />
    </div>
  );
}
