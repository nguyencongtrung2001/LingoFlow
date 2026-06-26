import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Book, Loader2 } from "lucide-react";
import { useUpdateFolder } from "../hooks/useFolders";
import type { Folder } from "@/api/folders.api";

interface UpdateFolderModalProps {
  folder: Folder;
}

export function UpdateFolderModal({ folder }: UpdateFolderModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(folder.name);
  const [description, setDescription] = useState(folder.description || "");
  const updateFolderMutation = useUpdateFolder();

  const handleUpdate = () => {
    if (!name.trim()) return;
    
    updateFolderMutation.mutate(
      { id: folder.id, data: { name, description } },
      {
        onSuccess: () => {
          setOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button 
            className="p-1.5 text-gray-400 hover:text-[#4648d4] hover:bg-[#f0f1ff] rounded-md transition-colors"
            onClick={(e) => e.preventDefault()}
            title="Sửa thư mục"
          >
            <Book className="w-4 h-4" />
          </button>
        }
      />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#1a1a2e]">Cập nhật thư mục</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor={`name-${folder.id}`} className="text-sm font-semibold text-[#374151]">
              Tên thư mục <span className="text-red-500">*</span>
            </Label>
            <Input
              id={`name-${folder.id}`}
              placeholder="VD: Từ vựng TOEIC"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-[44px] rounded-[10px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`description-${folder.id}`} className="text-sm font-semibold text-[#374151]">
              Mô tả (tùy chọn)
            </Label>
            <Textarea
              id={`description-${folder.id}`}
              placeholder="Nhập mô tả ngắn gọn..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none h-[80px] rounded-[10px]"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)} className="rounded-[10px]">
            Hủy
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={!name.trim() || updateFolderMutation.isPending || (name === folder.name && description === (folder.description || ""))}
            className="bg-[#4648d4] hover:bg-[#3b3db8] text-white rounded-[10px]"
          >
            {updateFolderMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Cập nhật
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
