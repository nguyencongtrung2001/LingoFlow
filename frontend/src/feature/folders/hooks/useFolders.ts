import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  getFolders,
  getFolderById,
  createFolder,
  updateFolder,
  deleteFolder,
} from "@/api/folders.api";
import { toast } from "sonner";

export function useGetFolders() {
  return useQuery({
    queryKey: ["folders"],
    queryFn: getFolders,
  });
}

export function useGetFolderById(id: string) {
  return useQuery({
    queryKey: ["folders", id],
    queryFn: () => getFolderById(id),
    enabled: !!id, // Only run if ID is provided
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export function useCreateFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newFolder: { name: string; description?: string }) => createFolder(newFolder),
    onSuccess: () => {
      toast.success("Tạo thư mục thành công!");
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "Lỗi khi tạo thư mục!");
      } else {
        toast.error("Lỗi không xác định khi tạo thư mục!");
      }
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
      queryClient.invalidateQueries({ queryKey: ["folders", variables.id.toString()] });
      queryClient.invalidateQueries({ queryKey: ["folders", variables.id] });
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "Lỗi khi cập nhật thư mục!");
      } else {
        toast.error("Lỗi không xác định khi cập nhật thư mục!");
      }
    },
  });
}

export function useDeleteFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteFolder(id),
    onSuccess: (_, variables) => {
      toast.success("Xóa thư mục thành công!");
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["folders", variables.toString()] });
      queryClient.invalidateQueries({ queryKey: ["folders", variables] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "Lỗi khi xóa thư mục!");
      } else {
        toast.error("Lỗi không xác định khi xóa thư mục!");
      }
    },
  });
}
