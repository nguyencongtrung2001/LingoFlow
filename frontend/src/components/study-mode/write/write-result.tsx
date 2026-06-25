"use client";

import { Edit3, SpellCheck, Percent, Flame, History, RotateCcw, Folder, Check, X } from "lucide-react";

export interface WriteHistoryItem {
  expectedWord: string;
  expectedMeaning: string;
  typedWord: string;
  isCorrect: boolean;
}

export interface WriteResultProps {
  correctCount: number;
  totalCount: number;
  accuracy: number;
  maxStreak: number;
  history: WriteHistoryItem[];
  onRestart: () => void;
  onBack: () => void;
}

export function WriteResult({
  correctCount,
  totalCount,
  accuracy,
  maxStreak,
  history,
  onRestart,
  onBack,
}: WriteResultProps) {
  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen w-full overflow-hidden flex flex-col items-center justify-center p-4 md:p-6">
      <main className="w-full max-w-4xl bg-white rounded-[24px] border border-[#e5eeff]/60 p-4 md:p-8 flex flex-col items-center justify-between gap-6 shadow-[0_4px_12px_-2px_rgba(70,72,212,0.04)] max-h-[95vh]">
        
        {/* Header */}
        <div className="text-center w-full flex flex-col items-center shrink-0">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#d3e4fe] rounded-full mb-3 animate-bounce">
            <Edit3 className="text-[#4648d4] w-10 h-10" />
          </div>
          <h1 className="text-[24px] md:text-[32px] text-[#4648d4] font-extrabold tracking-tight mb-1">
            Hoàn Thành Gõ Từ! ✍️
          </h1>
          <p className="text-[14px] md:text-[18px] text-[#464554]">
            Bạn đã hoàn thành lượt kiểm tra kỹ năng nhớ từ và chính tả
          </p>
        </div>

        {/* Bento Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 my-2 shrink-0">
          {/* Spell Check */}
          <div className="bg-[#f0fff4] border border-[#bbf7d0] rounded-xl p-4 flex flex-col items-center text-center justify-center shadow-sm">
            <SpellCheck className="text-[#1d9e75] w-6 h-6 mb-1" />
            <span className="text-[24px] font-extrabold text-[#1d9e75]">
              {correctCount} / {totalCount} từ
            </span>
            <span className="text-[11px] font-bold text-[#464554] uppercase tracking-wider mt-1">
              Đúng chính tả
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
              {maxStreak} từ
            </span>
            <span className="text-[11px] font-bold text-[#464554] uppercase tracking-wider mt-1">
              Chuỗi Streak
            </span>
          </div>
        </div>

        {/* Review Box */}
        <div className="w-full flex-1 overflow-y-auto bg-[#f8f9ff] border border-[#e5eeff] rounded-xl p-3 md:p-4 min-h-[140px] max-h-[240px] custom-scrollbar">
          <p className="text-[12px] text-[#464554] font-bold uppercase tracking-wider mb-2 flex items-center gap-1 sticky top-0 bg-[#f8f9ff] pb-2 z-10">
            <History className="w-4 h-4" /> Đối chiếu câu trả lời chi tiết
          </p>
          <div className="space-y-2">
            {history.map((item, idx) => {
              if (item.isCorrect) {
                return (
                  <div key={idx} className="flex justify-between items-center bg-[#e6fffa] p-3 rounded-lg border border-[#a3f7e2] shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 shrink-0 rounded-full bg-[#00cc66] text-white flex items-center justify-center">
                        <Check className="w-4 h-4 stroke-3" />
                      </span>
                      <div className="flex flex-col">
                        <span className="font-bold text-[#0b1c30] text-[14px]">
                          {item.expectedWord}
                        </span>
                        <span className="text-[11px] text-[#464554]">
                          Nghĩa gợi ý: {item.expectedMeaning}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[12px] text-[#464554] block">Bạn đã gõ:</span>
                      <span className="text-[14px] font-black text-[#00994d]">
                        {item.typedWord}
                      </span>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={idx} className="flex justify-between items-center bg-[#fff5f5] p-3 rounded-lg border border-[#feb2b2] shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 shrink-0 rounded-full bg-[#ff3333] text-white flex items-center justify-center">
                        <X className="w-4 h-4 stroke-3" />
                      </span>
                      <div className="flex flex-col">
                        <span className="font-bold text-[#0b1c30] text-[14px]">
                          {item.expectedWord}
                        </span>
                        <span className="text-[11px] text-[#464554]">
                          Nghĩa gợi ý: {item.expectedMeaning}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <div className="text-[12px] text-[#ba1a1a] font-medium">
                        Bạn gõ sai: <span className="line-through font-bold text-[#ff3333]">{item.typedWord || "(bỏ trống)"}</span>
                      </div>
                      <div className="text-[12px] text-[#00994d] font-bold bg-[#e6fffa] px-1.5 py-0.5 rounded border border-[#a3f7e2]">
                        Đáp án đúng: {item.expectedWord}
                      </div>
                    </div>
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
            Luyện gõ lại lượt này
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
