"use client";

import { useState, useMemo } from "react";
import { FolderGrid } from "@/components/folder/folder-grid";
import { CreateFolderModal } from "@/components/folder/create-folder-modal";
import { Plus, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FoldersClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Mock data representing folders
  const [folders, setFolders] = useState(() => [
    {
      id: "tech",
      title: "Công nghệ",
      description: "Các từ về AI, Web, Data và Lập trình phần mềm.",
      wordCount: 15,
      colorTheme: "primary" as const,
      createdAt: Date.now() - 400000,
    },
    {
      id: "comm",
      title: "Giao tiếp",
      description: "Tiếng Anh hàng ngày, đàm thoại công sở.",
      wordCount: 42,
      colorTheme: "secondary" as const,
      createdAt: Date.now() - 300000,
    },
    {
      id: "comm-2",
      title: "Giao tiếp 2",
      description: "Tiếng Anh hàng ngày, đàm thoại công sở nâng cao.",
      wordCount: 42,
      colorTheme: "secondary" as const,
      createdAt: Date.now() - 200000,
    },
    {
      id: "comm-3",
      title: "Giao tiếp 3",
      description: "Tiếng Anh hàng ngày, đàm thoại công sở chuyên nghiệp.",
      wordCount: 42,
      colorTheme: "secondary" as const,
      createdAt: Date.now() - 100000,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date_desc" | "date_asc" | "az" | "za">("date_desc");

  const filteredAndSortedFolders = useMemo(() => {
    return folders
      .filter(
        (f) =>
          f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === "date_desc") return b.createdAt - a.createdAt;
        if (sortBy === "date_asc") return a.createdAt - b.createdAt;
        if (sortBy === "az") return a.title.localeCompare(b.title);
        if (sortBy === "za") return b.title.localeCompare(a.title);
        return 0;
      });
  }, [folders, searchQuery, sortBy]);

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
        createdAt: Date.now(),
      },
      ...folders,
    ]);
  };

  const handleEditFolder = (id: string, title: string, description: string) => {
    setFolders(
      folders.map((f) =>
        f.id === id ? { ...f, title, description } : f
      )
    );
  };

  const handleDeleteFolder = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thư mục này không?")) {
      setFolders(folders.filter((f) => f.id !== id));
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 pt-4">
        <h2 className="font-bold text-[32px] tracking-[-0.01em] shrink-0">
          Thư mục từ vựng
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#767586] w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm thư mục..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#c7c4d7] rounded-full text-[14px] text-[#0b1c30] placeholder-[#767586] focus:outline-none focus:border-[#4648d4] focus:ring-1 focus:ring-[#4648d4] transition-all"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Select value={sortBy} onValueChange={(value) => value && setSortBy(value as "date_desc" | "date_asc" | "az" | "za")}>
              <SelectTrigger className="flex-1 sm:w-[140px] px-4 py-2 bg-white border border-[#c7c4d7] rounded-full text-[14px] text-[#0b1c30] focus:outline-none focus:border-[#4648d4] focus:ring-1 focus:ring-[#4648d4] transition-all cursor-pointer h-auto">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date_desc">Mới nhất</SelectItem>
                <SelectItem value="date_asc">Cũ nhất</SelectItem>
                <SelectItem value="az">Tên A-Z</SelectItem>
                <SelectItem value="za">Tên Z-A</SelectItem>
              </SelectContent>
            </Select>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#4648d4] text-white font-semibold text-[14px] px-6 py-2 rounded-full shadow-[0_8px_16px_-4px_rgba(70,72,212,0.04)] hover:shadow-[0_16px_32px_-8px_rgba(70,72,212,0.08)] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 shrink-0 flex-1 sm:flex-none sm:w-auto"
            >
              <Plus className="w-[18px] h-[18px]" />
              <span className="whitespace-nowrap">Thêm mới</span>
            </button>
          </div>
        </div>
      </div>

      {filteredAndSortedFolders.length === 0 ? (
        <div className="w-full bg-white rounded-xl border border-[#e5eeff] p-8 text-center mt-6">
          <p className="text-[#464554] text-[16px]">Không tìm thấy thư mục nào phù hợp với tìm kiếm của bạn.</p>
          <button onClick={() => setSearchQuery("")} className="mt-2 text-[#4648d4] hover:underline font-semibold text-[14px]">
            Xóa tìm kiếm
          </button>
        </div>
      ) : (
        <FolderGrid
          folders={filteredAndSortedFolders}
          onEditFolder={handleEditFolder}
          onDeleteFolder={handleDeleteFolder}
        />
      )}

      <CreateFolderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateFolder}
      />
    </>
  );
}
