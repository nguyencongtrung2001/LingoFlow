import { prisma } from "../config/prisma";

// Lấy toàn bộ bảng ghi chú (Cột + Notes) của một User
export const layBangGhiChuRepo = async (userId: string) => {
  return await prisma.noteColumn.findMany({
    where: { userId },
    include: {
      notes: {
        orderBy: { position: "asc" },
      },
    },
    orderBy: { position: "asc" },
  });
};

// Tạo cột mới
export const taoCotMoiRepo = async (userId: string, title: string, position: number) => {
  return await prisma.noteColumn.create({
    data: { title, position, userId },
    include: { notes: true },
  });
};

// Cập nhật tên cột
export const capNhatCotRepo = async (id: string, title: string) => {
  return await prisma.noteColumn.update({
    where: { id },
    data: { title },
  });
};

// Xóa cột (cascade xóa notes)
export const xoaCotRepo = async (id: string) => {
  return await prisma.noteColumn.delete({
    where: { id },
  });
};

// Tìm cột theo ID (kiểm tra quyền sở hữu)
export const timCotTheoIdRepo = async (id: string) => {
  return await prisma.noteColumn.findUnique({
    where: { id },
    select: { id: true, userId: true },
  });
};

// Lấy position lớn nhất của cột trong bảng của user
export const layPositionCotLonNhatRepo = async (userId: string) => {
  const result = await prisma.noteColumn.findFirst({
    where: { userId },
    orderBy: { position: "desc" },
    select: { position: true },
  });
  return result?.position ?? -1;
};

// Tạo ghi chú mới
export const taoGhiChuRepo = async (columnId: string, title: string, content: string | null, position: number) => {
  return await prisma.note.create({
    data: { title, content, position, columnId },
  });
};

// Cập nhật ghi chú (title + content)
export const capNhatGhiChuRepo = async (id: string, data: { title?: string; content?: string | null }) => {
  return await prisma.note.update({
    where: { id },
    data,
  });
};

// Xóa ghi chú
export const xoaGhiChuRepo = async (id: string) => {
  return await prisma.note.delete({
    where: { id },
  });
};

// Tìm ghi chú theo ID (kèm thông tin cột để kiểm tra quyền)
export const timGhiChuTheoIdRepo = async (id: string) => {
  return await prisma.note.findUnique({
    where: { id },
    include: {
      column: {
        select: { userId: true },
      },
    },
  });
};

// Lấy position lớn nhất của ghi chú trong một cột
export const layPositionGhiChuLonNhatRepo = async (columnId: string) => {
  const result = await prisma.note.findFirst({
    where: { columnId },
    orderBy: { position: "desc" },
    select: { position: true },
  });
  return result?.position ?? -1;
};

// Bulk update positions (Drag & Drop) — dùng Transaction đơn lẻ
export const sapXepLaiRepo = async (updates: { id: string; position: number; columnId: string }[]) => {
  const operations = updates.map((item) =>
    prisma.note.update({
      where: { id: item.id },
      data: { position: item.position, columnId: item.columnId },
    })
  );
  return await prisma.$transaction(operations);
};
