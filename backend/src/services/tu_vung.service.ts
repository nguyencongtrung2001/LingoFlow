import { prisma } from "../config/prisma";
import {
  layDanhSachTuVungRepo,
  taoTuVungRepo,
  suaTuVungRepo,
  xoaTuVungRepo,
  taoNhieuTuVungRepo,
  taoPhienHocRepo,
  layDanhSachTuCuonChieuRepo,
} from "../repositories/tu_vung.repository";
import { uploadImageFromUrl } from "../utils/cloudinary_upload";

export const layDanhSachTuVungService = async (folderId: number, userId: string) => {
  // Xác thực thư mục có thuộc về người dùng không
  const folder = await prisma.folder.findFirst({
    where: { id: folderId, userId },
  });

  if (!folder) {
    throw new Error("Thư mục không tồn tại hoặc không có quyền truy cập.");
  }

  return await layDanhSachTuVungRepo(folderId);
};

export const taoTuVungService = async (userId: string, folderId: number, data: any) => {
  // Xác thực quyền sở hữu thư mục
  const folder = await prisma.folder.findFirst({
    where: { id: folderId, userId },
  });

  if (!folder) {
    throw new Error("Thư mục không tồn tại hoặc không có quyền truy cập.");
  }

  // Tải gián tiếp ảnh từ URL và đưa lên Cloudinary trước khi tạo từ
  const cloneData = { ...data };
  if (cloneData.image) {
    cloneData.image = await uploadImageFromUrl(cloneData.image, "lingoflow/words", `word_${userId}`);
  }

  return await taoTuVungRepo(userId, folderId, cloneData);
};

export const taoNhieuTuVungService = async (userId: string, folderId: number, danhSachTu: any[]) => {
  // Xác thực quyền sở hữu thư mục
  const folder = await prisma.folder.findFirst({
    where: { id: folderId, userId },
  });

  if (!folder) {
    throw new Error("Thư mục không tồn tại hoặc không có quyền truy cập.");
  }

  return await taoNhieuTuVungRepo(userId, folderId, danhSachTu);
};

export const suaTuVungService = async (wordId: number, userId: string, data: any) => {
  // Bảo mật tối cao: Ép điều kiện Folder cha phải thuộc về User này
  const tuVung = await prisma.word.findFirst({
    where: {
      id: wordId,
      folder: { userId },
    },
  });

  if (!tuVung) {
    throw new Error("Từ vựng không tồn tại hoặc không có quyền truy cập.");
  }

  // Tải gián tiếp ảnh từ URL và đưa lên Cloudinary trước khi cập nhật từ
  const cloneData = { ...data };
  if (cloneData.image !== undefined) {
    cloneData.image = await uploadImageFromUrl(cloneData.image, "lingoflow/words", `word_${userId}`);
  }

  return await suaTuVungRepo(wordId, cloneData);
};

export const xoaTuVungService = async (wordId: number, userId: string) => {
  // Bảo mật tối cao: Ép điều kiện Folder cha phải thuộc về User này
  const tuVung = await prisma.word.findFirst({
    where: {
      id: wordId,
      folder: { userId },
    },
  });

  if (!tuVung) {
    throw new Error("Từ vựng không tồn tại hoặc không có quyền truy cập.");
  }

  return await xoaTuVungRepo(wordId);
};

export const ghiNhanPhienHocService = async (
  userId: string,
  folderId: number,
  thongTinPhien: any
) => {
  // Xác thực quyền sở hữu thư mục
  const folder = await prisma.folder.findFirst({
    where: { id: folderId, userId },
  });

  if (!folder) {
    throw new Error("Thư mục không tồn tại hoặc không có quyền truy cập.");
  }

  return await taoPhienHocRepo(userId, folderId, thongTinPhien);
};

export const layDanhSachTuCuonChieuService = async (
  userId: string,
  folderId: number,
  trang: number
) => {
  // Xác thực quyền sở hữu thư mục
  const folder = await prisma.folder.findFirst({
    where: { id: folderId, userId },
  });

  if (!folder) {
    throw new Error("Thư mục không tồn tại hoặc không có quyền truy cập.");
  }

  return await layDanhSachTuCuonChieuRepo(folderId, trang);
};
