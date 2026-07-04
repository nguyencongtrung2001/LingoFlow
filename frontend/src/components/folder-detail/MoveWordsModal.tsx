"use client";

import { X, Folder, ArrowRight, Loader2 } from "lucide-react";
import { useGetFolders } from "@/feature/folders/hooks/useFolders";

interface MoveWordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (targetFolderId: number) => void;
  currentFolderId: number;
  selectedCount: number;
  isMoving: boolean;
}

export function MoveWordsModal({
  isOpen,
  onClose,
  onConfirm,
  currentFolderId,
  selectedCount,
  isMoving,
}: MoveWordsModalProps) {
  const { data: folders, isLoading } = useGetFolders();

  if (!isOpen) return null;

  const otherFolders = folders?.filter((f) => f.id !== currentFolderId) || [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001f3f]/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl flex flex-col max-h-[80vh] overflow-hidden animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5eeff]">
          <div>
            <h3 className="font-bold text-[#0b1c30] text-[18px]">Di chuyển từ vựng</h3>
            <p className="text-[13px] text-[#464554] mt-0.5">
              Đang chọn <span className="font-bold text-[#4648d4]">{selectedCount}</span> từ để chuyển
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-[#464554] hover:bg-[#e5eeff] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-2 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-[#4648d4]">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-[14px] font-medium">Đang tải danh sách thư mục...</span>
            </div>
          ) : otherFolders.length === 0 ? (
            <div className="text-center py-10 text-[#464554]">
              <Folder className="w-12 h-12 mx-auto mb-3 text-[#c7c4d7]" />
              <p className="font-medium text-[15px]">Bạn chưa có thư mục nào khác</p>
              <p className="text-[13px] mt-1">Hãy tạo thư mục mới để chuyển từ vựng.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1 p-2">
              <p className="text-[13px] font-semibold text-[#464554] px-2 mb-1 uppercase tracking-wide">
                Chọn thư mục đích:
              </p>
              {otherFolders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => onConfirm(folder.id)}
                  disabled={isMoving}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-[#f8f9ff] transition-colors group text-left disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#e5eeff] text-[#4648d4] flex items-center justify-center shrink-0">
                      <Folder className="w-[18px] h-[18px]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0b1c30] text-[15px] group-hover:text-[#4648d4] transition-colors">
                        {folder.name}
                      </h4>
                      <p className="text-[12px] text-[#464554] font-medium">
                        {folder._count?.words || 0} từ vựng
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#c7c4d7] group-hover:text-[#4648d4] transition-colors opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 duration-200" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
