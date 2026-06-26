import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FolderPlus, Loader2 } from "lucide-react";
import { useCreateFolder } from "../hooks/useFolders";

export function CreateFolderModal() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const createFolderMutation = useCreateFolder();

  const handleCreate = () => {
    if (!name.trim()) return;
    
    createFolderMutation.mutate(
      { name, description },
      {
        onSuccess: () => {
          setOpen(false);
          setName("");
          setDescription("");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="bg-[#4648d4] hover:bg-[#3b3db8] text-white flex items-center gap-2">
            <FolderPlus className="w-4 h-4" />
            <span>Tạo thư mục mới</span>
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#1a1a2e]">Thêm thư mục mới</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold text-[#374151]">
              Tên thư mục <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="VD: Từ vựng TOEIC"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-[44px] rounded-[10px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold text-[#374151]">
              Mô tả (tùy chọn)
            </Label>
            <Textarea
              id="description"
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
            onClick={handleCreate}
            disabled={!name.trim() || createFolderMutation.isPending}
            className="bg-[#4648d4] hover:bg-[#3b3db8] text-white rounded-[10px]"
          >
            {createFolderMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Lưu thư mục
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
