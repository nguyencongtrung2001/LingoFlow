"use client";

import { Word } from "@/types/folder";
import { ViewMode } from "./toolbar";
import { WordCard } from "./word-card";

export interface WordListProps {
  words: Word[];
  viewMode: ViewMode;
  heartFilterOn: boolean;
  onEditWord: (id: number, updates: Partial<Word>) => void;
  onDeleteWord: (id: number) => void;
  onToggleLearned: (id: number) => void;
  isSelectionMode?: boolean;
  selectedIds?: number[];
  onToggleSelect?: (id: number) => void;
}

export function WordList({
  words,
  viewMode,
  heartFilterOn,
  onEditWord,
  onDeleteWord,
  onToggleLearned,
  isSelectionMode = false,
  selectedIds = [],
  onToggleSelect,
}: WordListProps) {
  if (words.length === 0) {
    return (
      <div className="col-span-full text-center py-12 text-[#464554] bg-[#f8f9ff] rounded-xl border border-dashed border-[#c7c4d7]">
        {heartFilterOn
          ? "Chưa có từ yêu thích nào. Nhấn vào trái tim trên các thẻ từ để thêm vào danh sách yêu thích!"
          : "Không tìm thấy từ vựng nào."}
      </div>
    );
  }

  // Adjust container class based on view mode
  const containerClass =
    viewMode === "grid"
      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      : viewMode === "row"
      ? "flex flex-col gap-2"
      : "flex flex-col gap-[1px] bg-[#e5eeff] border-[0.5px] border-[#e5eeff] rounded-xl overflow-hidden";

  return (
    <div className={containerClass}>
      {words.map((w) => (
        <WordCard
          key={w.id}
          word={w}
          viewMode={viewMode}
          onEdit={onEditWord}
          onDelete={onDeleteWord}
          onToggleLearned={onToggleLearned}
          isSelectionMode={isSelectionMode}
          isSelected={selectedIds.includes(w.id)}
          onToggleSelect={onToggleSelect}
        />
      ))}
    </div>
  );
}
