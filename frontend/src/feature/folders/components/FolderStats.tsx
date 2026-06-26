import { FolderType } from "@/api/folders.api";
import { Folder, LibraryBig, TrendingUp } from "lucide-react";

interface FolderStatsProps {
  folders: FolderType[];
}

export function FolderStats({ folders }: FolderStatsProps) {
  const totalFolders = folders.length;
  const totalWords = folders.reduce((acc, folder) => acc + (folder._count?.words || 0), 0);
  
  // Lấy thư mục mới nhất nếu có
  const latestFolder = folders.length > 0 ? folders[0] : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Thẻ Tổng số thư mục */}
      <div className="bg-white rounded-2xl p-5 border border-[#e5e7eb] flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="w-12 h-12 rounded-full bg-[#f0f1ff] flex items-center justify-center text-[#4648d4] shrink-0">
          <Folder className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-[#6b7280]">Tổng thư mục</p>
          <h3 className="text-2xl font-bold text-[#111827]">{totalFolders}</h3>
        </div>
      </div>

      {/* Thẻ Tổng số từ vựng */}
      <div className="bg-white rounded-2xl p-5 border border-[#e5e7eb] flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="w-12 h-12 rounded-full bg-[#ecfdf5] flex items-center justify-center text-[#10b981] shrink-0">
          <LibraryBig className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-[#6b7280]">Tổng từ vựng</p>
          <h3 className="text-2xl font-bold text-[#111827]">{totalWords}</h3>
        </div>
      </div>

      {/* Thẻ Thư mục mới nhất */}
      <div className="bg-white rounded-2xl p-5 border border-[#e5e7eb] flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="w-12 h-12 rounded-full bg-[#fffbeb] flex items-center justify-center text-[#f59e0b] shrink-0">
          <TrendingUp className="w-6 h-6" />
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-medium text-[#6b7280]">Mới cập nhật</p>
          <h3 className="text-lg font-bold text-[#111827] truncate">
            {latestFolder ? latestFolder.name : "Chưa có"}
          </h3>
        </div>
      </div>
    </div>
  );
}
