import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const layDanhSachThuMucRepo = async (userId: string) => {
  return await prisma.folder.findMany({
    where: { userId },
    include: {
      _count: {
        select: { words: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const layThuMucChiTietRepo = async (id: number, userId: string) => {
  return await prisma.folder.findFirst({
    where: { id, userId },
    include: {
      words: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
};

export const taoThuMucRepo = async (userId: string, name: string, description?: string) => {
  return await prisma.folder.create({
    data: {
      name,
      description,
      userId,
    },
  });
};

export const capNhatThuMucRepo = async (id: number, userId: string, data: { name?: string; description?: string }) => {
  return await prisma.folder.update({
    where: { id },
    data,
  });
};

export const xoaThuMucRepo = async (id: number, userId: string) => {
  return await prisma.folder.delete({
    where: { id },
  });
};
