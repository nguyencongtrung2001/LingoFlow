import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getAdminUsers, updateUserRole, updateUserStatus } from "@/api/admin.api";
import { toast } from "sonner";

export function useGetAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: getAdminUsers,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: "LEARNER" | "ADMIN" }) =>
      updateUserRole(userId, role),
    onSuccess: (data) => {
      toast.success(data.message || "Cập nhật vai trò thành công!");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "Lỗi khi cập nhật vai trò!");
      } else {
        toast.error("Lỗi không xác định khi cập nhật vai trò!");
      }
    },
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
      updateUserStatus(userId, isActive),
    onSuccess: (data) => {
      toast.success(data.message || "Cập nhật trạng thái thành công!");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "Lỗi khi cập nhật trạng thái!");
      } else {
        toast.error("Lỗi không xác định khi cập nhật trạng thái!");
      }
    },
  });
}
