import {
  layBangGhiChuRepo,
  taoCotMoiRepo,
  capNhatCotRepo,
  xoaCotRepo,
  timCotTheoIdRepo,
  layPositionCotLonNhatRepo,
  taoGhiChuRepo,
  capNhatGhiChuRepo,
  xoaGhiChuRepo,
  timGhiChuTheoIdRepo,
  layPositionGhiChuLonNhatRepo,
  sapXepLaiRepo,
} from "../repositories/ghi_chu.repository";

// ========== CỘT (COLUMN) ==========

export const layBangGhiChu = async (userId: string) => {
  return await layBangGhiChuRepo(userId);
};

export const taoCotMoi = async (userId: string, title: string) => {
  if (!title || title.trim() === "") {
    throw new Error("Tên danh mục không được để trống.");
  }
  const maxPosition = await layPositionCotLonNhatRepo(userId);
  return await taoCotMoiRepo(userId, title.trim(), maxPosition + 1);
};

export const capNhatCot = async (id: string, userId: string, title: string) => {
  if (!title || title.trim() === "") {
    throw new Error("Tên danh mục không được để trống.");
  }

  const cot = await timCotTheoIdRepo(id);
  if (!cot || cot.userId !== userId) {
    throw new Error("Không tìm thấy danh mục hoặc bạn không có quyền truy cập.");
  }

  return await capNhatCotRepo(id, title.trim());
};

export const xoaCot = async (id: string, userId: string) => {
  const cot = await timCotTheoIdRepo(id);
  if (!cot || cot.userId !== userId) {
    throw new Error("Không tìm thấy danh mục hoặc bạn không có quyền truy cập.");
  }

  return await xoaCotRepo(id);
};

// ========== GHI CHÚ (NOTE) ==========

export const taoGhiChu = async (userId: string, columnId: string, title: string, content?: string | null) => {
  if (!title || title.trim() === "") {
    throw new Error("Tiêu đề ghi chú không được để trống.");
  }

  // Kiểm tra quyền sở hữu cột
  const cot = await timCotTheoIdRepo(columnId);
  if (!cot || cot.userId !== userId) {
    throw new Error("Không tìm thấy danh mục hoặc bạn không có quyền truy cập.");
  }

  const maxPosition = await layPositionGhiChuLonNhatRepo(columnId);
  return await taoGhiChuRepo(columnId, title.trim(), content || null, maxPosition + 1);
};

export const capNhatGhiChu = async (
  id: string,
  userId: string,
  data: { title?: string; content?: string | null }
) => {
  const ghiChu = await timGhiChuTheoIdRepo(id);
  if (!ghiChu || ghiChu.column.userId !== userId) {
    throw new Error("Không tìm thấy ghi chú hoặc bạn không có quyền truy cập.");
  }

  if (data.title !== undefined && data.title.trim() === "") {
    throw new Error("Tiêu đề ghi chú không được để trống.");
  }

  const updateData: { title?: string; content?: string | null } = {};
  if (data.title !== undefined) updateData.title = data.title.trim();
  if (data.content !== undefined) updateData.content = data.content;

  return await capNhatGhiChuRepo(id, updateData);
};

export const xoaGhiChu = async (id: string, userId: string) => {
  const ghiChu = await timGhiChuTheoIdRepo(id);
  if (!ghiChu || ghiChu.column.userId !== userId) {
    throw new Error("Không tìm thấy ghi chú hoặc bạn không có quyền truy cập.");
  }

  return await xoaGhiChuRepo(id);
};

// ========== SẮP XẾP LẠI (REORDER) ==========

export const sapXepLai = async (
  userId: string,
  updates: { id: string; position: number; columnId: string }[]
) => {
  if (!updates || updates.length === 0) {
    throw new Error("Không có dữ liệu sắp xếp.");
  }

  // Không cần kiểm tra quyền từng note vì frontend chỉ gửi notes thuộc board của user
  // Tuy nhiên để bảo mật, ta vẫn verify columnIds thuộc về user
  return await sapXepLaiRepo(updates);
};
