"use client";

import { useState, useMemo } from "react";
import { StudyModes } from "@/components/folder-detail/study-modes";
import { Toolbar, ViewMode } from "@/components/folder-detail/toolbar";
import { AddWordPanel } from "@/components/folder-detail/add-word-panel";
import { WordList } from "@/components/folder-detail/word-list";
import { FolderHeader } from "@/components/folder-detail/folder-header";
import { useGetFolderById } from "@/feature/folders/hooks/useFolders";
import { useGetWords, useCreateWord, useUpdateWord, useDeleteWord } from "@/feature/words/hooks/useWords";
import { Loader2 } from "lucide-react";
import type { Word, PartOfSpeech } from "@/api/words.api";

export interface FolderDetailClientProps {
  folderId: number;
}

export default function FolderDetailClient({ folderId }: FolderDetailClientProps) {
  // Query data
  const { data: folder, isLoading: isLoadingFolder } = useGetFolderById(folderId);
  const { data: words = [], isLoading: isLoadingWords } = useGetWords(folderId);

  // Mutations
  const createMutation = useCreateWord(folderId);
  const updateMutation = useUpdateWord(folderId);
  const deleteMutation = useDeleteWord(folderId);

  // UI States
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [posFilter, setPosFilter] = useState("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showAddPanel, setShowAddPanel] = useState(false);

  // Derived State: Filtered Words
  const filteredWords = useMemo(() => {
    return words.filter((w) => {
      const matchSearch =
        w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.meaning.toLowerCase().includes(searchQuery.toLowerCase());
      const matchPos = posFilter === "all" || w.pos === posFilter;
      // const matchHeart = !showFavoritesOnly || w.learned; // Will need to implement favorites logic later

      return matchSearch && matchPos;
    });
  }, [words, searchQuery, posFilter, showFavoritesOnly]);

  // Handlers
  const handleAddWord = (wordData: {
    word: string;
    meaning: string;
    phonetic: string;
    pos: PartOfSpeech;
    example: string;
    image: string;
  }) => {
    createMutation.mutate(wordData, {
      onSuccess: () => setShowAddPanel(false),
    });
  };

  const handleEditWord = (id: number, updates: Partial<Word>) => {
    updateMutation.mutate({ id, data: updates });
  };

  const handleDeleteWord = (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa từ này không?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleAddMultipleWords = (newWords: any[]) => {
    // Để sau nếu cần (hiện tại AddWordPanel chưa hỗ trợ add multiple bằng hook dễ dàng)
  };

  const handleToggleLearned = (id: number) => {
    // TODO: Implement toggle favorite API
  };

  if (isLoadingFolder || isLoadingWords) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#4648d4]" />
      </div>
    );
  }

  if (!folder) {
    return <div className="text-center py-10 text-red-500">Thư mục không tồn tại!</div>;
  }

  const totalWords = words.length;
  // const lovedWords = words.filter((w) => w.learned).length;
  const lovedWords = 0;

  return (
    <>
      <FolderHeader name={folder.name} desc={folder.description || "Không có mô tả"} />

      <StudyModes />

      <Toolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        posFilter={posFilter}
        setPosFilter={setPosFilter}
        showFavoritesOnly={showFavoritesOnly}
        setShowFavoritesOnly={setShowFavoritesOnly}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onAddWordClick={() => setShowAddPanel(true)}
      />

      <AddWordPanel
        isVisible={showAddPanel}
        onClose={() => setShowAddPanel(false)}
        onAddWord={handleAddWord}
        onAddMultipleWords={handleAddMultipleWords}
      />

      <section>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[14px] text-[#464554] font-medium">
            {filteredWords.length} / {totalWords} từ
            {showFavoritesOnly ? ` · ❤️ ${lovedWords} yêu thích` : ""}
          </p>
        </div>
        <WordList
          words={filteredWords as any} // Ép kiểu tạm thời vì Word từ API chưa có cờ learned
          viewMode={viewMode}
          heartFilterOn={showFavoritesOnly}
          onEditWord={handleEditWord}
          onDeleteWord={handleDeleteWord}
          onToggleLearned={handleToggleLearned}
        />
      </section>
    </>
  );
}
