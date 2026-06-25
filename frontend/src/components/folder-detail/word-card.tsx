"use client";

import { Edit, Trash2, Heart } from "lucide-react";
import { Word, PartOfSpeech } from "@/types/folder";
import { ViewMode } from "./toolbar";
import Image from "next/image";

export interface WordCardProps {
  word: Word;
  viewMode: ViewMode;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleLearned: (id: number) => void;
}

const posMap: Record<PartOfSpeech, { label: string; cls: string }> = {
  Noun: { label: "n", cls: "bg-[#e1e0ff] text-[#3c3489]" },
  Verb: { label: "v", cls: "bg-[#d0f4e7] text-[#00714d]" },
  Adjective: { label: "adj", cls: "bg-[#ffddb8] text-[#653e00]" },
  Adverb: { label: "adv", cls: "bg-[#f4c0d1] text-[#72243e]" },
  Phrase: { label: "phr", cls: "bg-[#d3e4fe] text-[#185fa5]" },
};

function PosBadge({ pos }: { pos: PartOfSpeech }) {
  const p = posMap[pos] || {
    label: pos.toLowerCase(),
    cls: "bg-[#e5eeff] text-[#464554]",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${p.cls}`}
    >
      {p.label}
    </span>
  );
}

export function WordCard({
  word,
  viewMode,
  onEdit,
  onDelete,
  onToggleLearned,
}: WordCardProps) {
  const isLoved = word.learned;

  if (viewMode === "list") {
    return (
      <div className="group relative flex flex-row items-center p-[10px_16px] gap-3 bg-[#f8f9ff] border-b border-[#e5eeff] last:border-b-0 hover:bg-[#eff4ff] transition-colors">
        <div className="flex-1 min-w-0 flex items-center gap-4">
          <div className="flex items-center gap-2 mb-0">
            <h3 className="text-[14px] font-bold text-[#4648d4] truncate">
              {word.word}
            </h3>
            <PosBadge pos={word.pos} />
          </div>
          <p className="text-[13px] text-[#464554] font-medium ml-auto shrink-0">
            {word.meaning}
          </p>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-3">
          <button
            onClick={() => onEdit(word.id)}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#464554]/60 hover:bg-[#6063ee]/20 hover:text-[#4648d4] transition-colors"
            title="Sửa"
          >
            <Edit className="w-[15px] h-[15px]" />
          </button>
          <button
            onClick={() => onDelete(word.id)}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#464554]/60 hover:bg-[#ffdad6] hover:text-[#ba1a1a] transition-colors"
            title="Xóa"
          >
            <Trash2 className="w-[15px] h-[15px]" />
          </button>
          <div className="w-px h-[18px] bg-[#e5eeff] mx-[2px] shrink-0" />
          <button
            onClick={() => onToggleLearned(word.id)}
            className={`w-[30px] h-[30px] flex items-center justify-center rounded-full shrink-0 transition-colors ${
              isLoved ? "bg-[#fff0f3]" : "hover:bg-[#fff0f3]"
            }`}
            title={isLoved ? "Bỏ yêu thích" : "Thêm yêu thích"}
          >
            <Heart
              className={`w-[18px] h-[18px] transition-colors ${
                isLoved ? "fill-[#ff4d6d] text-[#ff4d6d]" : "text-[#c7c4d7]"
              }`}
            />
          </button>
        </div>
      </div>
    );
  }

  return (
    <article
      className={`group relative bg-[#f8f9ff] rounded-xl shadow-[0_2px_8px_-2px_rgba(70,72,212,0.04)] border-2 border-[#c7c4d7]/30 hover:border-[#c7c4d7]/60 transition-all duration-300 animate-in fade-in zoom-in-95 p-6 ${
        viewMode === "row" ? "flex flex-row items-center gap-4 py-3 px-4" : ""
      }`}
    >
      {word.image && (
        <Image
          className={`rounded-lg object-cover bg-[#d3e4fe] shrink-0 border border-[#e5eeff] ${
            viewMode === "row" ? "w-12 h-12 mb-0" : "w-16 h-16 mb-3"
          }`}
          src={word.image}
          alt={word.word}
          width={64}
          height={64}
        />
      )}

      <div className="flex-1 min-w-0">
        <div className={`mb-3 ${viewMode === "row" ? "mb-0.5" : ""}`}>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-[20px] font-bold text-[#4648d4] truncate">
              {word.word}
            </h3>
            <PosBadge pos={word.pos} />
          </div>
          {word.phonetic && (
            <p className="text-[14px] text-[#464554] italic">
              {word.phonetic}
            </p>
          )}
        </div>

        <p
          className={`${
            viewMode === "row" ? "text-[15px]" : "text-[18px]"
          } text-[#0b1c30] font-semibold`}
        >
          {word.meaning}
        </p>

        {word.example && viewMode === "grid" && (
          <blockquote className="mt-2 border-l-4 border-[#4648d4] pl-3 py-1 text-[14px] text-[#464554] bg-[#eff4ff] rounded-r">
            {word.example}
          </blockquote>
        )}
      </div>

      <div
        className={`absolute top-3 right-3 flex items-center bg-[#f8f9ff]/90 backdrop-blur-sm rounded-full px-1 border border-[#e5eeff]/60 h-[34px] opacity-0 group-hover:opacity-100 transition-opacity shrink-0`}
      >
        <button
          onClick={() => onEdit(word.id)}
          className="w-7 h-7 rounded-full flex items-center justify-center text-[#464554]/60 hover:bg-[#6063ee]/20 hover:text-[#4648d4] transition-colors"
          title="Sửa"
        >
          <Edit className="w-[17px] h-[17px]" />
        </button>
        <button
          onClick={() => onDelete(word.id)}
          className="w-7 h-7 rounded-full flex items-center justify-center text-[#464554]/60 hover:bg-[#ffdad6] hover:text-[#ba1a1a] transition-colors"
          title="Xóa"
        >
          <Trash2 className="w-[17px] h-[17px]" />
        </button>
        <div className="w-px h-[18px] bg-[#e5eeff] mx-[2px] shrink-0" />
        <button
          onClick={() => onToggleLearned(word.id)}
          className={`w-[30px] h-[30px] flex items-center justify-center rounded-full shrink-0 transition-colors ${
            isLoved ? "bg-[#fff0f3]" : "hover:bg-[#fff0f3]"
          }`}
          title={isLoved ? "Bỏ yêu thích" : "Thêm yêu thích"}
        >
          <Heart
            className={`w-[20px] h-[20px] transition-colors ${
              isLoved ? "fill-[#ff4d6d] text-[#ff4d6d]" : "text-[#c7c4d7]"
            }`}
          />
        </button>
      </div>
    </article>
  );
}
