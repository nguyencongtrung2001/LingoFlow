"use client";

import { Flame } from "lucide-react";

export function StreakCard() {
  return (
    <div className="bg-[#4648d4] rounded-[16px] p-5 h-full flex flex-col justify-between shadow-[0_2px_12px_-2px_rgba(70,72,212,0.04)]">
      <div>
        <div className="flex items-center gap-[7px]">
          <Flame className="w-[18px] h-[18px] text-[#c4c5f7]" />
          <span className="text-[10px] font-bold tracking-[.09em] uppercase text-[#c4c5f7]">
            Chuỗi ngày học
          </span>
        </div>
        <div className="mt-2">
          <span className="text-[58px] font-extrabold leading-none text-white">
            1
          </span>
          <span className="text-[15px] text-[#a5a6ef] ml-[5px]">
            ngày
          </span>
        </div>
      </div>
      
      <div className="flex gap-[6px] mt-auto">
        {/* T5 - Off */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold bg-white/10 text-white/45"></div>
          <span className="text-[10px] font-semibold text-white/50">T5</span>
        </div>
        {/* T6 - Off */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold bg-white/10 text-white/45"></div>
          <span className="text-[10px] font-semibold text-white/50">T6</span>
        </div>
        {/* T7 - Off */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold bg-white/10 text-white/45"></div>
          <span className="text-[10px] font-semibold text-white/50">T7</span>
        </div>
        {/* CN - Off */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold bg-white/10 text-white/45"></div>
          <span className="text-[10px] font-semibold text-white/50">CN</span>
        </div>
        {/* T2 - Off */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold bg-white/10 text-white/45"></div>
          <span className="text-[10px] font-semibold text-white/50">T2</span>
        </div>
        {/* T3 - Today (On) */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold bg-white text-[#4648d4] animate-pulse-flame">
            <Flame className="w-[15px] h-[15px]" fill="currentColor" />
          </div>
          <span className="text-[10px] font-bold text-white">T3</span>
        </div>
        {/* T4 - Next */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold bg-transparent border-[1.5px] border-white/30 text-white/35"></div>
          <span className="text-[10px] font-semibold text-white/50">T4</span>
        </div>
      </div>
    </div>
  );
}
