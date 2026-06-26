import { Request, Response } from "express";
import {
  layDanhSachThuMuc,
  layThuMucChiTiet,
  taoThuMuc,
  capNhatThuMuc,
  xoaThuMuc,
  layThuMucChiTietQuaName,
} from "../services/thu_muc.service";

export const danhSachThuMuc = async (yeuCau: Request, phanHoi: Response) => {
  try {
    const maNguoiDung = yeuCau.user?.id;
    if (!maNguoiDung) {
      return phanHoi.status(401).json({ error: "Chưa được xác thực!" });
    }

    const danhSach = await layDanhSachThuMuc(maNguoiDung);
    return phanHoi.status(200).json(danhSach);
  } catch (loi: any) {
    return phanHoi.status(500).json({ error: loi.message || "Lỗi khi lấy danh sách thư mục." });
  }
};

export const chiTietThuMuc = async (yeuCau: Request, phanHoi: Response) => {
  try {
    const maNguoiDung = yeuCau.user?.id;
    const slug = yeuCau.params.id as string; // slug is the name

    if (!maNguoiDung) return phanHoi.status(401).json({ error: "Chưa được xác thực!" });
    if (!slug) return phanHoi.status(400).json({ error: "Tên thư mục không hợp lệ." });

    const thuMuc = await layThuMucChiTietQuaName(slug, maNguoiDung);
    return phanHoi.status(200).json(thuMuc);
  } catch (loi: any) {
    return phanHoi.status(404).json({ error: loi.message || "Không tìm thấy thư mục." });
  }
};

export const taoMoiThuMuc = async (yeuCau: Request, phanHoi: Response) => {
  try {
    const maNguoiDung = yeuCau.user?.id;
    const { name, description } = yeuCau.body;

    if (!maNguoiDung) return phanHoi.status(401).json({ error: "Chưa được xác thực!" });

    const thuMucMoi = await taoThuMuc(maNguoiDung, name, description);
    return phanHoi.status(201).json(thuMucMoi);
  } catch (loi: any) {
    return phanHoi.status(400).json({ error: loi.message || "Không thể tạo thư mục." });
  }
};

export const suaThuMuc = async (yeuCau: Request, phanHoi: Response) => {
  try {
    const maNguoiDung = yeuCau.user?.id;
    const folderId = parseInt(yeuCau.params.id as string);
    const { name, description } = yeuCau.body;

    if (!maNguoiDung) return phanHoi.status(401).json({ error: "Chưa được xác thực!" });
    if (isNaN(folderId)) return phanHoi.status(400).json({ error: "ID thư mục không hợp lệ." });

    const thuMucCapNhat = await capNhatThuMuc(folderId, maNguoiDung, { name, description });
    return phanHoi.status(200).json(thuMucCapNhat);
  } catch (loi: any) {
    return phanHoi.status(400).json({ error: loi.message || "Không thể cập nhật thư mục." });
  }
};

export const xoaBoThuMuc = async (yeuCau: Request, phanHoi: Response) => {
  try {
    const maNguoiDung = yeuCau.user?.id;
    const folderId = parseInt(yeuCau.params.id as string);

    if (!maNguoiDung) return phanHoi.status(401).json({ error: "Chưa được xác thực!" });
    if (isNaN(folderId)) return phanHoi.status(400).json({ error: "ID thư mục không hợp lệ." });

    await xoaThuMuc(folderId, maNguoiDung);
    return phanHoi.status(200).json({ message: "Xóa thư mục thành công." });
  } catch (loi: any) {
    return phanHoi.status(400).json({ error: loi.message || "Không thể xóa thư mục." });
  }
};
