"use client";

import { useMemo, useState } from "react";
import { useAuthStore } from "@/feature/auth/stores/auth-store";
import {
  useGetAdminUsers,
  useUpdateUserRole,
  useUpdateUserStatus,
} from "@/feature/admin/hooks/useAdminUsers";
import {
  Users,
  UserCheck,
  UserX,
  Shield,
  Search,
  Calendar,
  FolderOpen,
  BookOpen,
  Activity,
  Clock,
  ShieldAlert,
  ShieldCheck,
  Ban,
  Unlock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Định dạng thời gian học
const formatStudyTime = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = (minutes / 60).toFixed(1);
  return `${hours}h`;
};

// Định dạng ngày đăng ký
const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function AdminPage() {
  const { user: currentUser } = useAuthStore();
  const { data: users, isLoading, isError } = useGetAdminUsers();

  const updateUserRoleMutation = useUpdateUserRole();
  const updateUserStatusMutation = useUpdateUserStatus();

  // State tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // State cho hộp thoại xác nhận (AlertDialog)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: "role" | "status";
    userId: string;
    userName: string;
    targetValue: any;
  }>({
    isOpen: false,
    type: "role",
    userId: "",
    userName: "",
    targetValue: null,
  });

  // 1. Tính toán thống kê tổng quan
  const stats = useMemo(() => {
    if (!users) return { total: 0, active: 0, blocked: 0, admins: 0 };
    return {
      total: users.length,
      active: users.filter((u) => u.isActive).length,
      blocked: users.filter((u) => !u.isActive).length,
      admins: users.filter((u) => u.role === "ADMIN").length,
    };
  }, [users]);

  // 2. Lọc danh sách người dùng theo tìm kiếm & dropdowns
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRole = roleFilter === "ALL" || u.role === roleFilter;
      const matchStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && u.isActive) ||
        (statusFilter === "BLOCKED" && !u.isActive);

      return matchSearch && matchRole && matchStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  // Kiểm tra quyền truy cập của người dùng hiện tại
  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] select-none text-center px-4">
        <AlertCircle className="w-16 h-16 text-slate-300 animate-pulse mb-4" />
        <h2 className="text-xl font-bold text-slate-700">Đang tải thông tin xác thực...</h2>
      </div>
    );
  }

  if (currentUser.role !== "ADMIN") {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6 animate-bounce">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-[#0b1c30] tracking-tight">Quyền truy cập bị từ chối</h1>
        <p className="text-slate-500 max-w-md mt-3 text-base">
          Xin lỗi, trang này chỉ dành riêng cho Quản trị viên của hệ thống LingoFlow.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="h-10 w-64 bg-slate-100 animate-pulse rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-slate-50 animate-pulse rounded-2xl border border-slate-100" />
          ))}
        </div>
        <div className="h-16 w-full bg-slate-50 animate-pulse rounded-xl border border-slate-100" />
        <div className="h-[400px] w-full bg-slate-50 animate-pulse rounded-2xl border border-slate-100" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-12 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-700">Đã xảy ra lỗi khi tải dữ liệu</h2>
        <p className="text-slate-400 text-sm mt-2">Vui lòng kiểm tra lại kết nối hoặc tải lại trang.</p>
      </div>
    );
  }

  // Mở hộp thoại xác nhận thay đổi
  const openConfirm = (type: "role" | "status", userId: string, userName: string, targetValue: any) => {
    setConfirmDialog({
      isOpen: true,
      type,
      userId,
      userName,
      targetValue,
    });
  };

  // Xác nhận thực hiện thay đổi
  const handleConfirmAction = async () => {
    const { type, userId, targetValue } = confirmDialog;
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));

    if (type === "role") {
      updateUserRoleMutation.mutate({ userId, role: targetValue });
    } else if (type === "status") {
      updateUserStatusMutation.mutate({ userId, isActive: targetValue });
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-black text-[#0b1c30] tracking-tight flex items-center gap-2 select-none">
            <Shield className="w-8 h-8 text-[#4648d4]" />
            Trang Quản trị LingoFlow
          </h1>
          <p className="text-slate-400 text-sm mt-1">Quản lý người dùng, phân quyền và kiểm soát trạng thái hoạt động.</p>
        </div>
      </div>

      {/* 1. Thống kê tổng quan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Users */}
        <div className="bg-white border border-[#e5eeff] rounded-2xl p-6 shadow-[0_4px_12px_rgba(70,72,212,0.02)] flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng người dùng</p>
            <h3 className="text-3xl font-black text-[#0b1c30] mt-1">{stats.total}</h3>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-[#4648d4] rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-white border border-[#e5eeff] rounded-2xl p-6 shadow-[0_4px_12px_rgba(70,72,212,0.02)] flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hoạt động</p>
            <h3 className="text-3xl font-black text-emerald-600 mt-1">{stats.active}</h3>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Blocked Users */}
        <div className="bg-white border border-[#e5eeff] rounded-2xl p-6 shadow-[0_4px_12px_rgba(70,72,212,0.02)] flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bị khóa</p>
            <h3 className="text-3xl font-black text-rose-600 mt-1">{stats.blocked}</h3>
          </div>
          <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center">
            <UserX className="w-6 h-6" />
          </div>
        </div>

        {/* Admin Users */}
        <div className="bg-white border border-[#e5eeff] rounded-2xl p-6 shadow-[0_4px_12px_rgba(70,72,212,0.02)] flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quản trị viên</p>
            <h3 className="text-3xl font-black text-violet-600 mt-1">{stats.admins}</h3>
          </div>
          <div className="w-12 h-12 bg-violet-50 text-violet-500 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2. Filters & Search Bar */}
      <div className="bg-white border border-[#e5eeff] rounded-2xl p-4 mb-6 shadow-[0_4px_12px_rgba(70,72,212,0.02)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên hoặc email người dùng..."
            className="w-full bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl pl-10 pr-4 py-2 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-[#4648d4] focus:bg-white transition-all"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Filter Role */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vai trò:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-[#4648d4] transition-colors cursor-pointer"
            >
              <option value="ALL">Tất cả</option>
              <option value="LEARNER">Người học (Learner)</option>
              <option value="ADMIN">Quản trị viên (Admin)</option>
            </select>
          </div>

          {/* Filter Status */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trạng thái:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#f8f9fc] border border-[#e2e8f0] rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-[#4648d4] transition-colors cursor-pointer"
            >
              <option value="ALL">Tất cả</option>
              <option value="ACTIVE">Hoạt động</option>
              <option value="BLOCKED">Đã khóa</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Bảng danh sách người dùng */}
      <div className="bg-white border border-[#e5eeff] rounded-2xl shadow-[0_4px_12px_rgba(70,72,212,0.02)] overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="p-16 text-center text-slate-400 text-sm select-none">
            Không tìm thấy người dùng nào khớp với bộ lọc tìm kiếm.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#f8f9fd] border-b border-[#e5eeff]">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Thành viên</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Ngày tham gia</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Tài liệu học</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Tiến trình học</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Vai trò</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8edf6]">
                {filteredUsers.map((user) => {
                  const isSelf = user.id === currentUser.id;

                  return (
                    <tr
                      key={user.id}
                      className={`hover:bg-[#f8f9ff]/50 transition-colors duration-150 ${
                        isSelf ? "bg-indigo-50/20" : ""
                      }`}
                    >
                      {/* Avatar & User Details */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Image
                            src={
                              user.avatar ||
                              "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
                            }
                            alt={user.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover border border-slate-100"
                          />
                          <div>
                            <h4 className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
                              {user.name}
                              {isSelf && (
                                <span className="bg-indigo-100 text-[#4648d4] text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                                  Bạn
                                </span>
                              )}
                            </h4>
                            <p className="text-slate-400 text-xs mt-0.5">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5 whitespace-nowrap">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {formatDate(user.createdAt)}
                        </span>
                      </td>

                      {/* Folders & Words Stats */}
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="text-sm font-bold text-slate-700">
                            {user.foldersCount} bộ
                          </span>
                          <span className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                            <BookOpen className="w-3 h-3 text-slate-300" /> {user.wordsCount} từ
                          </span>
                        </div>
                      </td>

                      {/* Study Sessions Stats */}
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="text-sm font-bold text-slate-700">
                            {user.studySessionsCount} phiên
                          </span>
                          <span className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-300" /> {formatStudyTime(user.studyTimeSeconds)}
                          </span>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="px-6 py-4">
                        {user.role === "ADMIN" ? (
                          <span className="bg-violet-50 text-violet-700 border border-violet-100 text-[11px] font-bold px-2 py-1 rounded-lg inline-flex items-center gap-1">
                            <Shield className="w-3.5 h-3.5" /> Admin
                          </span>
                        ) : (
                          <span className="bg-slate-50 text-slate-500 border border-slate-100 text-[11px] font-bold px-2 py-1 rounded-lg">
                            Learner
                          </span>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4">
                        {user.isActive ? (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[11px] font-bold px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Hoạt động
                          </span>
                        ) : (
                          <span className="bg-rose-50 text-rose-700 border border-rose-100 text-[11px] font-bold px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
                            <Ban className="w-3.5 h-3.5" /> Đã khóa
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          {/* Role Toggle Button */}
                          <button
                            disabled={isSelf}
                            onClick={() =>
                              openConfirm(
                                "role",
                                user.id,
                                user.name,
                                user.role === "ADMIN" ? "LEARNER" : "ADMIN"
                              )
                            }
                            className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all ${
                              isSelf
                                ? "opacity-30 cursor-not-allowed bg-slate-50 text-slate-300 border-slate-100"
                                : "bg-white border-[#e2e8f0] text-slate-600 hover:border-[#4648d4] hover:text-[#4648d4] cursor-pointer"
                            }`}
                            title={user.role === "ADMIN" ? "Hạ cấp xuống Learner" : "Thăng cấp lên Admin"}
                          >
                            {user.role === "ADMIN" ? (
                              <span className="flex items-center gap-1">
                                <ShieldAlert className="w-3.5 h-3.5" /> Hạ cấp
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5" /> Thăng cấp
                              </span>
                            )}
                          </button>

                          {/* Status Toggle Button */}
                          <button
                            disabled={isSelf}
                            onClick={() =>
                              openConfirm("status", user.id, user.name, !user.isActive)
                            }
                            className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all ${
                              isSelf
                                ? "opacity-30 cursor-not-allowed bg-slate-50 text-slate-300 border-slate-100"
                                : user.isActive
                                ? "bg-white border-[#fecaca] text-rose-600 hover:bg-rose-50 cursor-pointer"
                                : "bg-white border-[#bbf7d0] text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                            }`}
                            title={user.isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                          >
                            {user.isActive ? (
                              <span className="flex items-center gap-1">
                                <Ban className="w-3.5 h-3.5" /> Khóa
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <Unlock className="w-3.5 h-3.5" /> Mở khóa
                              </span>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Hộp thoại xác nhận hành động (AlertDialog) */}
      <AlertDialog
        open={confirmDialog.isOpen}
        onOpenChange={(isOpen) => setConfirmDialog((prev) => ({ ...prev, isOpen }))}
      >
        <AlertDialogContent className="rounded-2xl max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-slate-800">
              Xác nhận thay đổi
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 text-sm mt-2">
              {confirmDialog.type === "role" ? (
                <span>
                  Bạn có chắc chắn muốn thay đổi vai trò của <strong>{confirmDialog.userName}</strong> thành{" "}
                  <strong>
                    {confirmDialog.targetValue === "ADMIN" ? "Quản trị viên (Admin)" : "Người học (Learner)"}
                  </strong>?
                </span>
              ) : (
                <span>
                  Bạn có chắc chắn muốn{" "}
                  <strong>{confirmDialog.targetValue ? "mở khóa" : "khóa"}</strong> tài khoản của{" "}
                  <strong>{confirmDialog.userName}</strong>?{" "}
                  {!confirmDialog.targetValue && "Người dùng này sẽ không thể đăng nhập hoặc thực hiện bất kỳ hành động nào khác."}
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2">
            <AlertDialogCancel className="rounded-xl text-xs font-semibold">
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              className={`rounded-xl text-xs font-semibold text-white ${
                confirmDialog.type === "status" && !confirmDialog.targetValue
                  ? "bg-rose-500 hover:bg-rose-600"
                  : "bg-[#4648d4] hover:bg-[#3b3db8]"
              }`}
            >
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
