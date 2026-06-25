"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { FolderHeader } from "@/components/folder-detail/folder-header";
import { StudyModes } from "@/components/folder-detail/study-modes";
import { Toolbar, ViewMode } from "@/components/folder-detail/toolbar";
import { AddWordPanel } from "@/components/folder-detail/add-word-panel";
import { WordList } from "@/components/folder-detail/word-list";
import { FolderDetail, Word, PartOfSpeech } from "@/types/folder";
import { defaultFolderData } from "@/lib/data";

export default function FolderDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  // Initialize state based on the slug
  const initialFolder = defaultFolderData.find((f) => f.id === slug) || defaultFolderData[0];
  const [folder, setFolder] = useState<FolderDetail>(initialFolder);

  // UI States
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [posFilter, setPosFilter] = useState("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showAddPanel, setShowAddPanel] = useState(false);

  // Derived State: Filtered Words
  const filteredWords = useMemo(() => {
    return folder.words.filter((w) => {
      const matchSearch =
        w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.meaning.toLowerCase().includes(searchQuery.toLowerCase());
      const matchPos = posFilter === "all" || w.pos === posFilter;
      const matchHeart = !showFavoritesOnly || w.learned;

      return matchSearch && matchPos && matchHeart;
    });
  }, [folder.words, searchQuery, posFilter, showFavoritesOnly]);

  // Handlers
  const handleAddWord = (wordData: {
    word: string;
    meaning: string;
    phonetic: string;
    pos: PartOfSpeech;
    example: string;
    image: string;
  }) => {
    const newWord: Word = {
      id: Date.now(),
      ...wordData,
      image:
        wordData.image ||
        "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=200",
      learned: false,
    };
    setFolder((prev) => ({
      ...prev,
      words: [newWord, ...prev.words],
    }));
  };

  const handleEditWord = (id: number) => {
    console.log("Edit word:", id);
    alert(`Chức năng chỉnh sửa từ #${id}`);
  };

  const handleDeleteWord = (id: number) => {
    if (confirm("Xóa từ vựng này khỏi thư mục?")) {
      setFolder((prev) => ({
        ...prev,
        words: prev.words.filter((w) => w.id !== id),
      }));
    }
  };

  const handleToggleLearned = (id: number) => {
    setFolder((prev) => ({
      ...prev,
      words: prev.words.map((w) =>
        w.id === id ? { ...w, learned: !w.learned } : w
      ),
    }));
  };

  const totalWords = folder.words.length;
  const lovedWords = folder.words.filter((w) => w.learned).length;

  return (
    <main className="w-full max-w-[1200px] mx-auto p-4 md:p-6 space-y-8 grow mb-16 md:mb-0">
      <FolderHeader name={folder.name} desc={folder.desc} />

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
      />

      <section>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[14px] text-[#464554] font-medium">
            {filteredWords.length} / {totalWords} từ
            {showFavoritesOnly ? ` · ❤️ ${lovedWords} yêu thích` : ""}
          </p>
        </div>
        <WordList
          words={filteredWords}
          viewMode={viewMode}
          heartFilterOn={showFavoritesOnly}
          onEditWord={handleEditWord}
          onDeleteWord={handleDeleteWord}
          onToggleLearned={handleToggleLearned}
        />
      </section>
    </main>
  );
}
