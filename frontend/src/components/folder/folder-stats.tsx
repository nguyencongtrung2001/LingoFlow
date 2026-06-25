"use client";

import { FolderOpen, BookOpen, Award, CheckSquare } from "lucide-react";

export interface FolderStatsProps {
  totalFolders: number;
  totalWords: number;
  masteryRate: number; // percentage (0-100)
  quizAccuracy: number; // percentage (0-100)
}

export function FolderStats({
  totalFolders,
  totalWords,
  masteryRate,
  quizAccuracy,
}: FolderStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-[#f8f9ff] rounded-xl p-6 shadow-[0_8px_16px_-4px_rgba(70,72,212,0.04)] border border-[#e5eeff] flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#e1e0ff] flex items-center justify-center text-[#07006c]">
            <FolderOpen className="w-5 h-5" />
          </div>
          <span className="font-semibold text-[14px] text-[#464554]">
            Tổng thư mục
          </span>
        </div>
        <div className="font-extrabold text-[32px] text-[#4648d4] tracking-[-0.01em]">
          {totalFolders}
        </div>
      </div>

      <div className="bg-[#f8f9ff] rounded-xl p-6 shadow-[0_8px_16px_-4px_rgba(70,72,212,0.04)] border border-[#e5eeff] flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#6cf8bb] flex items-center justify-center text-[#00714d]">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="font-semibold text-[14px] text-[#464554]">
            Tổng từ vựng
          </span>
        </div>
        <div className="font-extrabold text-[32px] text-[#006c49] tracking-[-0.01em]">
          {totalWords}
        </div>
      </div>

      <div className="bg-[#f8f9ff] rounded-xl p-6 shadow-[0_8px_16px_-4px_rgba(70,72,212,0.04)] border border-[#e5eeff] flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#ffddb8] flex items-center justify-center text-[#2a1700]">
            <Award className="w-5 h-5" />
          </div>
          <span className="font-semibold text-[14px] text-[#464554]">
            Tỷ lệ thuộc
          </span>
        </div>
        <div className="font-extrabold text-[32px] text-[#825100] tracking-[-0.01em]">
          {masteryRate}%
        </div>
      </div>

      <div className="bg-[#f8f9ff] rounded-xl p-6 shadow-[0_8px_16px_-4px_rgba(70,72,212,0.04)] border border-[#e5eeff] flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#ffdad6] flex items-center justify-center text-[#93000a]">
            <CheckSquare className="w-5 h-5" />
          </div>
          <span className="font-semibold text-[14px] text-[#464554]">
            Tỷ lệ đúng (Quiz)
          </span>
        </div>
        <div className="font-extrabold text-[32px] text-[#ba1a1a] tracking-[-0.01em]">
          {quizAccuracy}%
        </div>
      </div>
    </div>
  );
}
