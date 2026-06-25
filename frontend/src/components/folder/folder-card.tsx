"use client";

import { Edit, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface FolderCardProps {
  id: string;
  title: string;
  description: string;
  wordCount: number;
  colorTheme?: "primary" | "secondary";
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function FolderCard({
  id,
  title,
  description,
  wordCount,
  colorTheme = "primary",
  onEdit,
  onDelete,
}: FolderCardProps) {
  // Theme variants based on the original HTML (tech uses primary, comm uses secondary)
  const themeClasses = {
    primary: {
      text: "text-[#4648d4]",
      hoverText: "hover:text-[#494bd6]",
      hoverBg: "hover:bg-[#6063ee]/20",
    },
    secondary: {
      text: "text-[#006c49]",
      hoverText: "hover:text-[#00714d]",
      hoverBg: "hover:bg-[#6cf8bb]/20",
    },
  };

  const theme = themeClasses[colorTheme];

  return (
    <div
      className="bg-[#f8f9ff] rounded-xl p-6 shadow-[0_8px_16px_-4px_rgba(70,72,212,0.04)] hover:shadow-[0_16px_32px_-8px_rgba(70,72,212,0.08)] hover:-translate-y-1 transition-all duration-200 border border-[#e5eeff] relative group cursor-pointer flex flex-col"
      onClick={() => {
        // Handle navigation to folder detail (would normally use router)
        window.location.href = `/folders/${id}`;
      }}
    >
      <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <button
          aria-label="Sửa thư mục"
          className={`text-[#464554] ${theme.hoverText} ${theme.hoverBg} bg-[#dce9ff] rounded-full w-8 h-8 flex items-center justify-center transition-colors`}
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.(id);
          }}
        >
          <Edit className="w-[18px] h-[18px]" />
        </button>

        <AlertDialog>
          <AlertDialogTrigger
            render={
              <button
                aria-label="Xóa thư mục"
                className="text-[#464554] hover:text-[#ba1a1a] hover:bg-[#ffdad6] bg-[#dce9ff] rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                onClick={(e) => e.stopPropagation()}
              />
            }
          >
            <Trash2 className="w-[18px] h-[18px]" />
          </AlertDialogTrigger>
          <AlertDialogContent onClick={(e) => e.stopPropagation()}>
            <AlertDialogHeader>
              <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
              <AlertDialogDescription>
                Thao tác này không thể hoàn tác. Thư mục &quot;{title}&quot; và toàn bộ từ vựng bên trong sẽ bị xóa vĩnh viễn khỏi hệ thống.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Hủy</AlertDialogCancel>
              <AlertDialogAction
                className="bg-[#ba1a1a] text-white hover:bg-[#93000a] transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(id);
                }}
              >
                Xóa thư mục
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <h3 className="font-semibold text-[24px] mb-1 text-[#0b1c30]">
        {title}
      </h3>
      <p className="text-[16px] text-[#464554] mb-4 h-12 overflow-hidden leading-[24px]">
        {description}
      </p>
      
      <div className="flex justify-between items-center border-t border-[#d3e4fe] pt-2 mt-auto">
        <span className={`font-semibold text-[14px] ${theme.text}`}>
          {wordCount} từ
        </span>
        <Link
          href={`/folders/${id}`}
          onClick={(e) => e.stopPropagation()}
          className={`${theme.text} ${theme.hoverText} font-semibold text-[14px] flex items-center gap-1`}
        >
          Học ngay <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
