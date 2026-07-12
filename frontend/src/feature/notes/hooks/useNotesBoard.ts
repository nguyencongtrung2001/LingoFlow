import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import {
  getBoard,
  createColumn,
  updateColumn,
  deleteColumn,
  createNote,
  updateNote,
  deleteNote,
  reorderNotes,
} from "@/api/notes.api";
import type { ReorderItem } from "@/api/notes.api";

const BOARD_KEY = ["notes", "board"];

export function useGetBoard() {
  return useQuery({
    queryKey: BOARD_KEY,
    queryFn: getBoard,
    refetchOnWindowFocus: false,
  });
}

export function useCreateColumn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (title: string) => createColumn(title),
    onSuccess: () => {
      toast.success("Đã tạo danh mục mới!");
      queryClient.invalidateQueries({ queryKey: BOARD_KEY });
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "Lỗi khi tạo danh mục!");
      } else {
        toast.error("Lỗi không xác định!");
      }
    },
  });
}

export function useUpdateColumn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) => updateColumn(id, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOARD_KEY });
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "Lỗi khi cập nhật danh mục!");
      } else {
        toast.error("Lỗi không xác định!");
      }
    },
  });
}

export function useDeleteColumn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteColumn(id),
    onSuccess: () => {
      toast.success("Đã xóa danh mục!");
      queryClient.invalidateQueries({ queryKey: BOARD_KEY });
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "Lỗi khi xóa danh mục!");
      } else {
        toast.error("Lỗi không xác định!");
      }
    },
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ columnId, title, content }: { columnId: string; title: string; content?: string }) =>
      createNote(columnId, title, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOARD_KEY });
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "Lỗi khi tạo ghi chú!");
      } else {
        toast.error("Lỗi không xác định!");
      }
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { title?: string; content?: string | null } }) =>
      updateNote(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOARD_KEY });
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "Lỗi khi cập nhật ghi chú!");
      } else {
        toast.error("Lỗi không xác định!");
      }
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      toast.success("Đã xóa ghi chú!");
      queryClient.invalidateQueries({ queryKey: BOARD_KEY });
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "Lỗi khi xóa ghi chú!");
      } else {
        toast.error("Lỗi không xác định!");
      }
    },
  });
}

export function useReorderNotes() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: ReorderItem[]) => reorderNotes(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOARD_KEY });
    },
    onError: (error: unknown) => {
      // Rollback sẽ được xử lý ở component level
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "Lỗi khi sắp xếp lại!");
      } else {
        toast.error("Lỗi không xác định khi sắp xếp lại!");
      }
      // Refetch board data to rollback
      queryClient.invalidateQueries({ queryKey: BOARD_KEY });
    },
  });
}
