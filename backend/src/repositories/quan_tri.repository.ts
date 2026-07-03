import { prisma } from "../config/prisma";

export const layDanhSachNguoiDungWithStats = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      role: true,
      isActive: true,
      createdAt: true,
      _count: {
        select: {
          folders: true,
          studySessions: true,
        },
      },
      folders: {
        select: {
          _count: {
            select: { words: true },
          },
        },
      },
      activities: {
        select: {
          studyTimeSeconds: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const capNhatVaiTroNguoiDung = async (id: string, role: "LEARNER" | "ADMIN") => {
  return prisma.user.update({
    where: { id },
    data: { role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
};

export const capNhatTrangThaiNguoiDung = async (id: string, isActive: boolean) => {
  return prisma.user.update({
    where: { id },
    data: { isActive },
    select: {
      id: true,
      name: true,
      email: true,
      isActive: true,
    },
  });
};
