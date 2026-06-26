import { Folder } from "lucide-react";
import Link from "next/link";
import type { Folder as FolderType } from "@/api/folders.api";

interface FolderCardProps {
  folder: FolderType;
}

export function FolderCard({ folder }: FolderCardProps) {
  const wordsCount = folder._count?.words || 0;

  return (
    <Link href={`/folders/${folder.id}`}>
      <div className="group relative bg-white border border-[#e5e7eb] rounded-2xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden flex flex-col h-[160px]">
        {/* Top Accent line */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#4648d4] opacity-80 group-hover:opacity-100 transition-opacity" />

        <div className="flex items-start justify-between mb-4 mt-1">
          <div className="p-2.5 bg-[#f0f1ff] rounded-xl text-[#4648d4]">
            <Folder className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-[#f3f4f6] text-[#4b5563] rounded-full">
            {wordsCount} từ
          </span>
        </div>

        <h3 className="font-bold text-lg text-[#111827] truncate mb-1.5 group-hover:text-[#4648d4] transition-colors">
          {folder.name}
        </h3>
        
        <p className="text-sm text-[#6b7280] line-clamp-2 leading-snug">
          {folder.description || "Không có mô tả"}
        </p>
      </div>
    </Link>
  );
}
