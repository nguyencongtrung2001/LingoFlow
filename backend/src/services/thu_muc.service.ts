import {
  layDanhSachThuMucRepo,
  layThuMucChiTietRepo,
  taoThuMucRepo,
  capNhatThuMucRepo,
  xoaThuMucRepo,
  layThuMucChiTietQuaNameRepo,
} from "../repositories/thu_muc.repository";
import { deleteImageFromCloudinary } from "../utils/cloudinary_upload";

export const layDanhSachThuMuc = async (userId: string) => {
  return await layDanhSachThuMucRepo(userId);
};

export const layThuMucChiTiet = async (id: number, userId: string) => {
  const thuMuc = await layThuMucChiTietRepo(id, userId);
  if (!thuMuc) {
    throw new Error("Không tìm thấy thư mục hoặc bạn không có quyền truy cập.");
  }
  return thuMuc;
};

export const layThuMucChiTietQuaName = async (name: string, userId: string) => {
  const thuMuc = await layThuMucChiTietQuaNameRepo(name, userId);
  if (!thuMuc) {
    throw new Error("Không tìm thấy thư mục hoặc bạn không có quyền truy cập.");
  }
  return thuMuc;
};

export const taoThuMuc = async (userId: string, name: string, description?: string) => {
  if (!name || name.trim() === "") {
    throw new Error("Tên thư mục không được để trống.");
  }
  return await taoThuMucRepo(userId, name, description);
};

export const capNhatThuMuc = async (id: number, userId: string, data: { name?: string; description?: string }) => {
  // Kiểm tra quyền sở hữu
  const thuMuc = await layThuMucChiTietRepo(id, userId);
  if (!thuMuc) {
    throw new Error("Không tìm thấy thư mục hoặc bạn không có quyền truy cập.");
  }

  if (data.name !== undefined && data.name.trim() === "") {
    throw new Error("Tên thư mục không được để trống.");
  }

  return await capNhatThuMucRepo(id, userId, data);
};

export const xoaThuMuc = async (id: number, userId: string) => {
  // Kiểm tra quyền sở hữu
  const thuMuc = await layThuMucChiTietRepo(id, userId);
  if (!thuMuc) {
    throw new Error("Không tìm thấy thư mục hoặc bạn không có quyền truy cập.");
  }

  // Xóa toàn bộ ảnh của các từ vựng thuộc thư mục này trên Cloudinary
  if (thuMuc.words && thuMuc.words.length > 0) {
    for (const word of thuMuc.words) {
      if (word.image) {
        await deleteImageFromCloudinary(word.image);
      }
    }
  }

  return await xoaThuMucRepo(id, userId);
};
