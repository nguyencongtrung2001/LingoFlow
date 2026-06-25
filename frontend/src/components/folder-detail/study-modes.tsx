"use client";

import { Subtitles, HelpCircle, Puzzle, Edit3 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export function StudyModes() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const launchGame = (mode: string) => {
    if (!slug) return;
    router.push(`/folders/${slug}/study?type=${mode}`);
  };

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button
          onClick={() => launchGame("flashcard")}
          className="flex items-center gap-4 p-6 bg-[#f8f9ff] rounded-xl shadow-[0_2px_8px_-2px_rgba(70,72,212,0.04)] hover:shadow-[0_8px_16px_-4px_rgba(70,72,212,0.08)] hover:-translate-y-1 transition-all duration-200 border border-transparent hover:border-[#4648d4]/20 group text-left w-full"
        >
          <div className="w-12 h-12 rounded-lg bg-[#6063ee] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
            <Subtitles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-[14px] text-[#0b1c30]">
              Thẻ ghi nhớ
            </h3>
            <p className="font-medium text-[12px] text-[#464554]">
              Lật thẻ để học từ mới
            </p>
          </div>
        </button>

        <button
          onClick={() => launchGame("quiz")}
          className="flex items-center gap-4 p-6 bg-[#f8f9ff] rounded-xl shadow-[0_2px_8px_-2px_rgba(70,72,212,0.04)] hover:shadow-[0_8px_16px_-4px_rgba(70,72,212,0.08)] hover:-translate-y-1 transition-all duration-200 border border-transparent hover:border-[#6cf8bb]/50 group text-left w-full"
        >
          <div className="w-12 h-12 rounded-lg bg-[#6cf8bb] text-[#00714d] flex items-center justify-center group-hover:scale-110 transition-transform">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-[14px] text-[#0b1c30]">
              Trắc nghiệm
            </h3>
            <p className="font-medium text-[12px] text-[#464554]">
              Kiểm tra kiến thức
            </p>
          </div>
        </button>

        <button
          onClick={() => launchGame("match")}
          className="flex items-center gap-4 p-6 bg-[#f8f9ff] rounded-xl shadow-[0_2px_8px_-2px_rgba(70,72,212,0.04)] hover:shadow-[0_8px_16px_-4px_rgba(70,72,212,0.08)] hover:-translate-y-1 transition-all duration-200 border border-transparent hover:border-[#ffddb8]/50 group text-left w-full"
        >
          <div className="w-12 h-12 rounded-lg bg-[#ffddb8] text-[#2a1700] flex items-center justify-center group-hover:scale-110 transition-transform">
            <Puzzle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-[14px] text-[#0b1c30]">
              Ghép từ
            </h3>
            <p className="font-medium text-[12px] text-[#464554]">
              Trò chơi nối nghĩa
            </p>
          </div>
        </button>

        <button
          onClick={() => launchGame("type")}
          className="flex items-center gap-4 p-6 bg-[#f8f9ff] rounded-xl shadow-[0_2px_8px_-2px_rgba(70,72,212,0.04)] hover:shadow-[0_8px_16px_-4px_rgba(70,72,212,0.08)] hover:-translate-y-1 transition-all duration-200 border border-transparent hover:border-[#e1e0ff]/50 group text-left w-full"
        >
          <div className="w-12 h-12 rounded-lg bg-[#e1e0ff] text-[#07006c] flex items-center justify-center group-hover:scale-110 transition-transform">
            <Edit3 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-[14px] text-[#0b1c30]">Gõ từ</h3>
            <p className="font-medium text-[12px] text-[#464554]">
              Gõ nhanh từ vựng
            </p>
          </div>
        </button>
      </div>
    </section>
  );
}
