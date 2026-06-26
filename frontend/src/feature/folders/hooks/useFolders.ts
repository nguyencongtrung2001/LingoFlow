import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFolders,
  getFolderById,
  createFolder,
  updateFolder,
  deleteFolder,
  Folder,
} from "@/api/folders.api";
import { toast } from "sonner";

export function useGetFolders() {
  return useQuery({
    queryKey: ["folders"],
    queryFn: getFolders,
  });
}

export function useGetFolderById(id: number) {
  return useQuery({
    queryKey: ["folders", id],
    queryFn: () => getFolderById(id),
    enabled: !!id, // Only run if ID is provided
  });
}

export function useCreateFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newFolder: { name: string; description?: string }) => createFolder(newFolder),
    onSuccess: () => {
      toast.success("Tạo thư mục thành công!");
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Lỗi khi tạo thư mục!");
    },
  });
}

export function useUpdateFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { name?: string; description?: string } }) =>
      updateFolder(id, data),
    onSuccess: (_, variables) => {
      toast.success("Cập nhật thư mục thành công!");
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["folders", variables.id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Lỗi khi cập nhật thư mục!");
    },
  });
}

export function useDeleteFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteFolder(id),
    onSuccess: () => {
      toast.success("Xóa thư mục thành công!");
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Lỗi khi xóa thư mục!");
    },
  });
}
