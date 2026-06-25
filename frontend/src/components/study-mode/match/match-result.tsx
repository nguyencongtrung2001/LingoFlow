"use client";

import { Timer, Award, Zap, Link as LinkIcon, RotateCcw, Folder } from "lucide-react";

export interface MatchResultProps {
  timeSeconds: number;
  bestRecordSeconds: number | null;
  averageSpeed: string;
  matchedPairs: Array<{ word: string; meaning: string; phonetic?: string }>;
  onRestart: () => void;
  onBack: () => void;
}

export function MatchResult({
  timeSeconds,
  bestRecordSeconds,
  averageSpeed,
  matchedPairs,
  onRestart,
  onBack,
}: MatchResultProps) {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    // Show milliseconds if we want it to look exactly like the design (00:18.42), 
    // but standard seconds is fine here since timeSeconds is an integer.
    return `${m}:${s}.00`; 
  };

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen w-full overflow-hidden flex flex-col items-center justify-center p-4 md:p-6">
      <main className="w-full max-w-4xl bg-white rounded-[24px] border border-[#e5eeff]/60 p-4 md:p-8 flex flex-col items-center justify-between gap-6 shadow-[0_4px_12px_-2px_rgba(70,72,212,0.04)] max-h-[95vh]">
        {/* Header */}
        <div className="text-center w-full flex flex-col items-center shrink-0">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#fffdeb] rounded-full mb-3 animate-bounce">
            <Zap className="text-[#825100] w-10 h-10 fill-current" />
          </div>
          <h1 className="text-[24px] md:text-[32px] text-[#4648d4] font-extrabold tracking-tight mb-1">
            Ghép Thẻ Hoàn Thành! ⚡
          </h1>
          <p className="text-[14px] md:text-[18px] text-[#464554]">
            Bạn đã xuất sắc dọn sạch toàn bộ các cặp thẻ từ vựng
          </p>
        </div>

        {/* Bento Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 my-2 shrink-0">
          {/* Time */}
          <div className="bg-[#eff4ff] border border-[#dce9ff] rounded-xl p-4 flex flex-col items-center text-center justify-center shadow-sm">
            <Timer className="text-[#4648d4] w-6 h-6 mb-1" />
            <span className="text-[24px] font-extrabold text-[#4648d4]">
              {formatTime(timeSeconds)}
            </span>
            <span className="text-[11px] font-bold text-[#464554] uppercase tracking-wider mt-1">
              Thời gian hoàn thành
            </span>
          </div>

          {/* Best Record */}
          <div className="bg-[#f0fff4] border border-[#bbf7d0] rounded-xl p-4 flex flex-col items-center text-center justify-center shadow-sm">
            <Award className="text-[#006c49] w-6 h-6 mb-1 fill-current" />
            <span className="text-[24px] font-extrabold text-[#006c49]">
              {bestRecordSeconds ? formatTime(bestRecordSeconds) : formatTime(timeSeconds)}
            </span>
            <span className="text-[11px] font-bold text-[#464554] uppercase tracking-wider mt-1">
              Kỷ lục tốt nhất
            </span>
          </div>

          {/* Average Speed */}
          <div className="bg-[#fffbeb] border border-[#fff9b3] rounded-xl p-4 flex flex-col items-center text-center justify-center shadow-sm">
            <Zap className="text-[#825100] w-6 h-6 mb-1" />
            <span className="text-[24px] font-extrabold text-[#825100]">
              {averageSpeed}
            </span>
            <span className="text-[11px] font-bold text-[#464554] uppercase tracking-wider mt-1">
              Tốc độ trung bình
            </span>
          </div>
        </div>

        {/* Review Box */}
        <div className="w-full flex-1 overflow-y-auto bg-[#f8f9ff] border border-[#e5eeff] rounded-xl p-3 md:p-4 min-h-[140px] max-h-[240px] custom-scrollbar">
          <p className="text-[12px] text-[#464554] font-bold uppercase tracking-wider mb-2 flex items-center gap-1 sticky top-0 bg-[#f8f9ff] pb-2 z-10">
            <LinkIcon className="w-4 h-4" /> Danh sách các cặp từ đã ghép
          </p>
          <div className="space-y-2">
            {matchedPairs.map((pair, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-[#f0fff4] p-3 rounded-xl border border-[#bbf7d0] shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <LinkIcon className="text-[#006c49] w-5 h-5" />
                  <span className="font-bold text-[#0b1c30] text-[14px]">
                    {pair.word}
                  </span>
                  {pair.phonetic && (
                    <span className="text-[12px] text-[#464554] italic hidden sm:inline-block">
                      {pair.phonetic}
                    </span>
                  )}
                </div>
                <span className="text-[14px] font-bold text-[#006c49] text-right">
                  {pair.meaning}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col sm:flex-row gap-4 justify-center items-center shrink-0 pt-2">
          <button
            onClick={onRestart}
            className="w-full sm:w-1/2 bg-[#4648d4] text-white py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md hover:bg-[#6063ee] active:scale-[0.98] transition-all font-bold"
          >
            <RotateCcw className="w-5 h-5" />
            Chơi lại ván mới
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
