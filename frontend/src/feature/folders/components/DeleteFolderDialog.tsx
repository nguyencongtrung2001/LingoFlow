import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { useDeleteFolder } from "../hooks/useFolders";
import type { Folder } from "@/api/folders.api";

interface DeleteFolderDialogProps {
  folder: Folder;
}

export function DeleteFolderDialog({ folder }: DeleteFolderDialogProps) {
  const [open, setOpen] = useState(false);
  const deleteFolderMutation = useDeleteFolder();

  const handleDelete = () => {
    deleteFolderMutation.mutate(folder.id, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button 
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
            onClick={(e) => e.preventDefault()}
            title="Xóa thư mục"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        }
      />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-red-600">Xóa thư mục</DialogTitle>
          <DialogDescription className="mt-2 text-gray-600">
            Bạn có chắc chắn muốn xóa thư mục <span className="font-semibold text-gray-900">&quot;{folder.name}&quot;</span> không?
            Toàn bộ từ vựng bên trong cũng sẽ bị xóa vĩnh viễn và không thể khôi phục.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)} className="rounded-[10px]">
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteFolderMutation.isPending}
            className="rounded-[10px]"
          >
            {deleteFolderMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Xóa vĩnh viễn
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
