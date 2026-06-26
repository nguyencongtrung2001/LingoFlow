"use client";

import { useGetFolders } from "@/feature/folders/hooks/useFolders";
import { FolderCard } from "@/feature/folders/components/FolderCard";
import { FolderSkeleton } from "@/feature/folders/components/FolderSkeleton";
import { CreateFolderModal } from "@/feature/folders/components/CreateFolderModal";
import { FolderStats } from "@/feature/folders/components/FolderStats";
import { FolderOpen } from "lucide-react";

export default function FoldersPage() {
  const { data: folders, isLoading, isError } = useGetFolders();

  return (
    <div className="bg-[#f8f9ff] min-h-screen pb-20">
      <div className="max-w-[1200px] mx-auto px-5 py-8 md:py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1a1a2e] tracking-tight">Thư mục của bạn</h1>
            <p className="text-[#6b7280] mt-1.5 font-medium">Quản lý và tổ chức từ vựng theo các chủ đề riêng biệt.</p>
          </div>
          <CreateFolderModal />
        </div>

        {isError && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium text-sm">
            Đã xảy ra lỗi khi tải danh sách thư mục. Vui lòng thử lại sau.
          </div>
        )}

        {/* Thống kê chung (Chỉ hiện khi đã load xong và có dữ liệu) */}
        {!isLoading && folders && folders.length > 0 && (
          <FolderStats folders={folders} />
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <FolderSkeleton key={i} />
            ))}
          </div>
        ) : folders?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-3xl border border-dashed border-[#d1d5db] text-center">
            <div className="w-20 h-20 bg-[#f0f1ff] rounded-full flex items-center justify-center mb-5">
              <FolderOpen className="w-10 h-10 text-[#4648d4]" />
            </div>
            <h3 className="text-xl font-bold text-[#111827] mb-2">Chưa có thư mục nào</h3>
            <p className="text-[#6b7280] max-w-md mx-auto mb-6">
              Bạn chưa tạo thư mục nào. Hãy tạo thư mục đầu tiên để bắt đầu lưu trữ từ vựng nhé!
            </p>
            <CreateFolderModal />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {folders?.map((folder) => (
              <FolderCard key={folder.id} folder={folder} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
