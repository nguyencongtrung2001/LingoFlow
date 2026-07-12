import { prisma } from "../config/prisma";
import {
  layDanhSachTuVungRepo,
  taoTuVungRepo,
  suaTuVungRepo,
  xoaTuVungRepo,
  taoNhieuTuVungRepo,
  taoPhienHocRepo,
  layDanhSachTuCuonChieuRepo,
  diChuyenTuVungRepo,
  layTuThongMinhRepo,
  layTuDaThuocRepo,
  layTienDoThuMucRepo,
} from "../repositories/tu_vung.repository";
import { uploadImageFromUrl, deleteImageFromCloudinary } from "../utils/cloudinary_upload";

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
  if (cloneData.image !== undefined && cloneData.image !== tuVung.image) {
    // Xóa ảnh cũ trên Cloudinary nếu có
    if (tuVung.image) {
      await deleteImageFromCloudinary(tuVung.image);
    }
    // Upload ảnh mới nếu có
    if (cloneData.image) {
      cloneData.image = await uploadImageFromUrl(cloneData.image, "lingoflow/words", `word_${userId}`);
    }
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

  // Xóa ảnh liên kết trên Cloudinary nếu có trước khi xóa từ vựng khỏi Database
  if (tuVung.image) {
    await deleteImageFromCloudinary(tuVung.image);
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

export const diChuyenTuVungService = async (userId: string, wordIds: number[], targetFolderId: number) => {
  if (!wordIds || wordIds.length === 0) {
    throw new Error("Không có từ vựng nào được chọn.");
  }

  // Xác thực thư mục đích có thuộc về người dùng không
  const folder = await prisma.folder.findFirst({
    where: { id: targetFolderId, userId },
  });

  if (!folder) {
    throw new Error("Thư mục đích không tồn tại hoặc không có quyền truy cập.");
  }

  // Xác thực các từ vựng này có thuộc về thư mục của người dùng không
  const validWordsCount = await prisma.word.count({
    where: {
      id: { in: wordIds },
      folder: { userId },
    },
  });

  if (validWordsCount !== wordIds.length) {
    throw new Error("Một số từ vựng không tồn tại hoặc không thuộc quyền sở hữu của bạn.");
  }

  return await diChuyenTuVungRepo(wordIds, targetFolderId);
};

/**
 * Service: Bốc từ thông minh (Dynamic Queue)
 * Loại bỏ từ đã thuộc khỏi hàng đợi chính, gối đầu từ mới
 */
export const layTuThongMinhService = async (userId: string, folderId: number) => {
  const folder = await prisma.folder.findFirst({
    where: { id: folderId, userId },
  });

  if (!folder) {
    throw new Error("Thư mục không tồn tại hoặc không có quyền truy cập.");
  }

  return await layTuThongMinhRepo(userId, folderId, 15);
};

/**
 * Service: Lấy danh sách từ đã thuộc để ôn tập lại
 * Dùng cho chế độ "Review Mastered Words"
 */
export const layTuDaThuocService = async (userId: string, folderId: number) => {
  const folder = await prisma.folder.findFirst({
    where: { id: folderId, userId },
  });

  if (!folder) {
    throw new Error("Thư mục không tồn tại hoặc không có quyền truy cập.");
  }

  return await layTuDaThuocRepo(userId, folderId);
};

/**
 * Service: Lấy thống kê tiến độ học thư mục
 * Trả về số lượng từ: đã thuộc, đang ôn, chưa học
 */
export const layTienDoThuMucService = async (userId: string, folderId: number) => {
  const folder = await prisma.folder.findFirst({
    where: { id: folderId, userId },
  });

  if (!folder) {
    throw new Error("Thư mục không tồn tại hoặc không có quyền truy cập.");
  }

  return await layTienDoThuMucRepo(userId, folderId);
};
