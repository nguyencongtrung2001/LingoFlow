import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// Khởi tạo Database Connection ở tầng Repository
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const timNguoiDungTheoEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const timNguoiDungTheoId = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      role: true,
      createdAt: true,
    },
  });
};

export const taoNguoiDungMoi = async (thongTinNguoiDung: any) => {
  return prisma.user.create({
    data: thongTinNguoiDung,
  });
};

export const capNhatAvatarNguoiDung = async (id: string, urlAnh: string) => {
  return prisma.user.update({
    where: { id },
    data: { avatar: urlAnh },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      role: true,
    },
  });
};
