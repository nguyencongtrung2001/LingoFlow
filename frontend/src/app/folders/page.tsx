"use client";

import { useState } from "react";
import { FolderStats } from "@/components/folder/folder-stats";
import { FolderGrid } from "@/components/folder/folder-grid";
import { CreateFolderModal } from "@/components/folder/create-folder-modal";
import { Plus } from "lucide-react";

export default function FoldersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Mock data representing folders
  const [folders, setFolders] = useState([
    {
      id: "tech",
      title: "Công nghệ",
      description: "Các từ về AI, Web, Data và Lập trình phần mềm.",
      wordCount: 15,
      colorTheme: "primary" as const,
    },
    {
      id: "comm",
      title: "Giao tiếp",
      description: "Tiếng Anh hàng ngày, đàm thoại công sở.",
      wordCount: 42,
      colorTheme: "secondary" as const,
    },
    {
      id: "comm-2",
      title: "Giao tiếp 2",
      description: "Tiếng Anh hàng ngày, đàm thoại công sở nâng cao.",
      wordCount: 42,
      colorTheme: "secondary" as const,
    },
    {
      id: "comm-3",
      title: "Giao tiếp 3",
      description: "Tiếng Anh hàng ngày, đàm thoại công sở chuyên nghiệp.",
      wordCount: 42,
      colorTheme: "secondary" as const,
    },
  ]);

  const handleCreateFolder = (data: { name: string; description: string }) => {
    // Determine alternating theme for mock purpose
    const theme = folders.length % 2 === 0 ? "primary" : "secondary";
    
    setFolders([
      {
        id: `folder-${Date.now()}`,
        title: data.name,
        description: data.description || "Chưa có mô tả ngắn cho thư mục này.",
        wordCount: 0,
        colorTheme: theme,
      },
      ...folders,
    ]);
  };

  const handleEditFolder = (id: string) => {
    console.log("Edit folder", id);
    // TODO: Implement edit folder logic
  };

  const handleDeleteFolder = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thư mục này không?")) {
      setFolders(folders.filter((f) => f.id !== id));
    }
  };

  return (
    <div className="bg-[#f2f2f7] text-[#1a1a2e] min-h-screen font-sans flex flex-col pb-16 md:pb-0">
      <main className="w-full max-w-[1200px] mx-auto p-[20px] grow mt-4">
        <FolderStats
          totalFolders={12}
          totalWords={348}
          masteryRate={61}
          quizAccuracy={82}
        />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 pt-4">
          <h2 className="font-bold text-[32px] tracking-[-0.01em]">
            Thư mục từ vựng
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#4648d4] text-white font-semibold text-[14px] px-6 py-2 rounded-full shadow-[0_8px_16px_-4px_rgba(70,72,212,0.04)] hover:shadow-[0_16px_32px_-8px_rgba(70,72,212,0.08)] hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
          >
            <Plus className="w-[18px] h-[18px]" />
            Thêm thư mục mới
          </button>
        </div>

        <FolderGrid
          folders={folders}
          onEditFolder={handleEditFolder}
          onDeleteFolder={handleDeleteFolder}
        />

        <CreateFolderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateFolder}
        />
      </main>
    </div>
  );
}
