"use client";

import { useState } from "react";
import { FolderPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string }) => void;
}

export function CreateFolderModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateFolderModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      description: description.trim(),
    });

    // Reset and close
    setName("");
    setDescription("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-[#f8f9ff] border-[#e5eeff] p-0 overflow-hidden rounded-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="px-6 py-4 border-b border-[#dce9ff] bg-[#eff4ff]">
            <DialogTitle className="text-[24px] font-bold text-[#0b1c30] flex items-center gap-2">
              <FolderPlus className="w-6 h-6 text-[#4648d4]" />
              Tạo thư mục mới
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 flex flex-col gap-4">
            <div>
              <label
                htmlFor="folder-name"
                className="block font-semibold text-[14px] text-[#464554] mb-1"
              >
                Tên thư mục <span className="text-[#ba1a1a]">*</span>
              </label>
              <Input
                id="folder-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Du lịch, IELTS Academic..."
                className="w-full rounded-xl border-[#c7c4d7] bg-[#f8f9ff] focus-visible:ring-[#4648d4]/20 focus-visible:border-[#4648d4] text-[16px]"
                required
              />
            </div>

            <div>
              <label
                htmlFor="folder-desc"
                className="block font-semibold text-[14px] text-[#464554] mb-1"
              >
                Mô tả ngắn
              </label>
              <Textarea
                id="folder-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Ghi chú nhanh về mục đích của thư mục này..."
                className="w-full rounded-xl border-[#c7c4d7] bg-[#f8f9ff] focus-visible:ring-[#4648d4]/20 focus-visible:border-[#4648d4] resize-none text-[16px]"
              />
            </div>
          </div>

          <DialogFooter className="mb-3 px-6 py-4 bg-[#eff4ff] border-t border-[#dce9ff] flex sm:justify-end items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-full border-[#767586] text-[#0b1c30] hover:bg-[#dce9ff] font-semibold text-[14px] px-6"
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              className="bg-[#4648d4] hover:bg-[#494bd6] text-white rounded-full shadow-[0_8px_16px_-4px_rgba(70,72,212,0.04)] hover:shadow-[0_16px_32px_-8px_rgba(70,72,212,0.08)] hover:-translate-y-0.5 transition-all duration-200 font-semibold text-[14px] px-8"
              disabled={!name.trim()}
            >
              Tạo thư mục
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
