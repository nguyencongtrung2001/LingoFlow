"use client";

import { useState, useMemo } from "react";
import { StudyModes } from "@/components/folder-detail/study-modes";
import { Toolbar, ViewMode } from "@/components/folder-detail/toolbar";
import { AddWordPanel } from "@/components/folder-detail/add-word-panel";
import { WordList } from "@/components/folder-detail/word-list";
import { FolderHeader } from "@/components/folder-detail/folder-header";
import { MoveWordsModal } from "@/components/folder-detail/MoveWordsModal";
import { useGetFolderById } from "@/feature/folders/hooks/useFolders";
import { useGetWords, useCreateWord, useUpdateWord, useDeleteWord, useMoveWords } from "@/feature/words/hooks/useWords";
import { Loader2, CheckSquare, X, FolderSymlink } from "lucide-react";
import type { Word, PartOfSpeech } from "@/api/words.api";

export interface FolderDetailClientProps {
  slug: string;
}

export default function FolderDetailClient({ slug }: FolderDetailClientProps) {
  // Query data
  const { data: folder, isLoading: isLoadingFolder } = useGetFolderById(slug);
  
  // Real folderId from DB
  const folderId = folder?.id as number;

  const { data: words = [], isLoading: isLoadingWords } = useGetWords(folderId || 0);

  // Mutations
  const createMutation = useCreateWord(folderId || 0);
  const updateMutation = useUpdateWord(folderId || 0);
  const deleteMutation = useDeleteWord(folderId || 0);
  const moveMutation = useMoveWords(folderId || 0);

  // UI States
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [posFilter, setPosFilter] = useState("all");
  const [showAddPanel, setShowAddPanel] = useState(false);
  
  // Selection States
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showMoveModal, setShowMoveModal] = useState(false);

  // Derived State: Filtered Words
  const filteredWords = useMemo(() => {
    return words.filter((w) => {
      const matchSearch =
        w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.meaning.toLowerCase().includes(searchQuery.toLowerCase());
      const matchPos = posFilter === "all" || w.pos === posFilter;

      return matchSearch && matchPos;
    });
  }, [words, searchQuery, posFilter]);

  // Handlers
  const handleAddWord = (wordData: {
    word: string;
    meaning: string;
    phonetic: string;
    pos: PartOfSpeech;
    example: string;
    useWord: string;
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
      // Remove from selection if it was selected
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    }
  };

  const handleToggleLearned = () => {
    // TODO: Implement toggle favorite API
  };

  const handleToggleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredWords.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredWords.map(w => w.id));
    }
  };

  const handleConfirmMove = (targetFolderId: number) => {
    moveMutation.mutate({ wordIds: selectedIds, targetFolderId }, {
      onSuccess: () => {
        setShowMoveModal(false);
        setIsSelectionMode(false);
        setSelectedIds([]);
      }
    });
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

  return (
    <>
      <FolderHeader folderId={folderId} name={folder.name} desc={folder.description || "Không có mô tả"} />

      <StudyModes />

      <Toolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        posFilter={posFilter}
        setPosFilter={setPosFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onAddWordClick={() => setShowAddPanel(true)}
        folderId={folderId}
      />

      <AddWordPanel
        isVisible={showAddPanel}
        onClose={() => setShowAddPanel(false)}
        onAddWord={handleAddWord}
      />

      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <p className="text-[14px] text-[#464554] font-medium">
              {filteredWords.length} / {totalWords} từ
            </p>
            <button
              onClick={() => {
                setIsSelectionMode(!isSelectionMode);
                if (isSelectionMode) setSelectedIds([]);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-colors ${
                isSelectionMode 
                  ? "bg-[#4648d4] text-white" 
                  : "bg-white text-[#464554] border border-[#c7c4d7] hover:border-[#4648d4] hover:text-[#4648d4]"
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              {isSelectionMode ? "Tắt chọn" : "Chọn nhiều"}
            </button>
          </div>
        </div>
        <WordList
          words={filteredWords}
          viewMode={viewMode}
          heartFilterOn={false}
          onEditWord={handleEditWord}
          onDeleteWord={handleDeleteWord}
          onToggleLearned={handleToggleLearned}
          isSelectionMode={isSelectionMode}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
        />
      </section>

      {/* Floating Toolbar for Selection */}
      {isSelectionMode && selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#0b1c30] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 animate-in slide-in-from-bottom-5 z-40 border border-[#e5eeff]/20">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 bg-[#4648d4] text-white rounded-full text-[13px] font-bold">
              {selectedIds.length}
            </span>
            <span className="text-[14px] font-medium text-[#e5eeff]">từ được chọn</span>
          </div>
          
          <div className="w-px h-5 bg-white/20" />

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMoveModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-bold bg-[#e5eeff] text-[#4648d4] hover:bg-white transition-colors"
            >
              <FolderSymlink className="w-4 h-4" />
              Di chuyển
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-bold text-[#c7c4d7] hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
              Bỏ chọn
            </button>
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-bold text-[#c7c4d7] hover:bg-white/10 hover:text-white transition-colors"
            >
              <CheckSquare className="w-4 h-4" />
              Chọn tất cả
            </button>
          </div>
        </div>
      )}

      <MoveWordsModal
        isOpen={showMoveModal}
        onClose={() => setShowMoveModal(false)}
        onConfirm={handleConfirmMove}
        currentFolderId={folderId}
        selectedCount={selectedIds.length}
        isMoving={moveMutation.isPending}
      />
    </>
  );
}
