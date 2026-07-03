"use client";

import { useState, useEffect, useRef } from "react";
import { X, Save, Trash2, FileText } from "lucide-react";

interface NoteEditModalProps {
  isOpen: boolean;
  noteId: string;
  initialTitle: string;
  initialContent: string;
  onClose: () => void;
  onSave: (id: string, title: string, content: string) => void;
  onDelete: (id: string) => void;
}

export function NoteEditModal({
  isOpen,
  noteId,
  initialTitle,
  initialContent,
  onClose,
  onSave,
  onDelete,
}: NoteEditModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
  }, [initialTitle, initialContent, noteId]);

  useEffect(() => {
    if (isOpen) {
      // Focus title input khi modal mở
      setTimeout(() => titleInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Đóng modal bằng Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim()) return;
    onSave(noteId, title.trim(), content);
    onClose();
  };

  const handleDelete = () => {
    onDelete(noteId);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal Content */}
      <div
        className="relative w-full max-w-lg bg-slate-800 border border-slate-700/60 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <div className="flex items-center gap-2 text-slate-300">
            <FileText className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-semibold uppercase tracking-wider">Chỉnh sửa ghi chú</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded-lg hover:bg-slate-700/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-2 space-y-4">
          {/* Title Input */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Tiêu đề
            </label>
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề ghi chú..."
              className="w-full bg-slate-900/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          {/* Content Textarea */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Nội dung
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Viết nội dung ghi chú tại đây... (hỗ trợ xuống dòng)"
              rows={8}
              className="w-full bg-slate-900/60 border border-slate-600/50 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-700/50">
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-3 py-2 rounded-lg transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Xóa ghi chú
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="text-xs font-semibold text-slate-400 hover:text-slate-200 px-4 py-2 rounded-lg hover:bg-slate-700/50 transition-all cursor-pointer"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              className="flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2 rounded-lg transition-all cursor-pointer shadow-lg shadow-blue-600/20"
            >
              <Save className="w-3.5 h-3.5" />
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
