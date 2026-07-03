import { Request, Response } from "express";
import {
  layBangGhiChu,
  taoCotMoi,
  capNhatCot,
  xoaCot,
  taoGhiChu,
  capNhatGhiChu,
  xoaGhiChu,
  sapXepLai,
} from "../services/ghi_chu.service";

// ========== CỘT (COLUMN) ==========

export const layBangGhiChuController = async (yeuCau: Request, phanHoi: Response) => {
  try {
    const maNguoiDung = yeuCau.user?.id;
    if (!maNguoiDung) return phanHoi.status(401).json({ error: "Chưa được xác thực!" });

    const bangGhiChu = await layBangGhiChu(maNguoiDung);
    return phanHoi.status(200).json(bangGhiChu);
  } catch (loi: any) {
    return phanHoi.status(500).json({ error: loi.message || "Lỗi khi lấy bảng ghi chú." });
  }
};

export const taoCotMoiController = async (yeuCau: Request, phanHoi: Response) => {
  try {
    const maNguoiDung = yeuCau.user?.id;
    if (!maNguoiDung) return phanHoi.status(401).json({ error: "Chưa được xác thực!" });

    const { title } = yeuCau.body;
    const cotMoi = await taoCotMoi(maNguoiDung, title);
    return phanHoi.status(201).json(cotMoi);
  } catch (loi: any) {
    return phanHoi.status(400).json({ error: loi.message || "Không thể tạo danh mục." });
  }
};

export const capNhatCotController = async (yeuCau: Request, phanHoi: Response) => {
  try {
    const maNguoiDung = yeuCau.user?.id;
    const cotId = yeuCau.params.id as string;

    if (!maNguoiDung) return phanHoi.status(401).json({ error: "Chưa được xác thực!" });
    if (!cotId) return phanHoi.status(400).json({ error: "ID danh mục không hợp lệ." });

    const { title } = yeuCau.body;
    const cotCapNhat = await capNhatCot(cotId, maNguoiDung, title);
    return phanHoi.status(200).json(cotCapNhat);
  } catch (loi: any) {
    return phanHoi.status(400).json({ error: loi.message || "Không thể cập nhật danh mục." });
  }
};

export const xoaCotController = async (yeuCau: Request, phanHoi: Response) => {
  try {
    const maNguoiDung = yeuCau.user?.id;
    const cotId = yeuCau.params.id as string;

    if (!maNguoiDung) return phanHoi.status(401).json({ error: "Chưa được xác thực!" });
    if (!cotId) return phanHoi.status(400).json({ error: "ID danh mục không hợp lệ." });

    await xoaCot(cotId, maNguoiDung);
    return phanHoi.status(200).json({ message: "Xóa danh mục thành công." });
  } catch (loi: any) {
    return phanHoi.status(400).json({ error: loi.message || "Không thể xóa danh mục." });
  }
};

// ========== GHI CHÚ (NOTE) ==========

export const taoGhiChuController = async (yeuCau: Request, phanHoi: Response) => {
  try {
    const maNguoiDung = yeuCau.user?.id;
    if (!maNguoiDung) return phanHoi.status(401).json({ error: "Chưa được xác thực!" });

    const { columnId, title, content } = yeuCau.body;
    const ghiChuMoi = await taoGhiChu(maNguoiDung, columnId, title, content);
    return phanHoi.status(201).json(ghiChuMoi);
  } catch (loi: any) {
    return phanHoi.status(400).json({ error: loi.message || "Không thể tạo ghi chú." });
  }
};

export const capNhatGhiChuController = async (yeuCau: Request, phanHoi: Response) => {
  try {
    const maNguoiDung = yeuCau.user?.id;
    const ghiChuId = yeuCau.params.id as string;

    if (!maNguoiDung) return phanHoi.status(401).json({ error: "Chưa được xác thực!" });
    if (!ghiChuId) return phanHoi.status(400).json({ error: "ID ghi chú không hợp lệ." });

    const { title, content } = yeuCau.body;
    const ghiChuCapNhat = await capNhatGhiChu(ghiChuId, maNguoiDung, { title, content });
    return phanHoi.status(200).json(ghiChuCapNhat);
  } catch (loi: any) {
    return phanHoi.status(400).json({ error: loi.message || "Không thể cập nhật ghi chú." });
  }
};

export const xoaGhiChuController = async (yeuCau: Request, phanHoi: Response) => {
  try {
    const maNguoiDung = yeuCau.user?.id;
    const ghiChuId = yeuCau.params.id as string;

    if (!maNguoiDung) return phanHoi.status(401).json({ error: "Chưa được xác thực!" });
    if (!ghiChuId) return phanHoi.status(400).json({ error: "ID ghi chú không hợp lệ." });

    await xoaGhiChu(ghiChuId, maNguoiDung);
    return phanHoi.status(200).json({ message: "Xóa ghi chú thành công." });
  } catch (loi: any) {
    return phanHoi.status(400).json({ error: loi.message || "Không thể xóa ghi chú." });
  }
};

// ========== SẮP XẾP LẠI (REORDER) ==========

export const sapXepLaiController = async (yeuCau: Request, phanHoi: Response) => {
  try {
    const maNguoiDung = yeuCau.user?.id;
    if (!maNguoiDung) return phanHoi.status(401).json({ error: "Chưa được xác thực!" });

    const { updates } = yeuCau.body;
    await sapXepLai(maNguoiDung, updates);
    return phanHoi.status(200).json({ message: "Sắp xếp lại thành công." });
  } catch (loi: any) {
    return phanHoi.status(400).json({ error: loi.message || "Không thể sắp xếp lại." });
  }
};
