import { Request, Response } from "express";
import {
  taoTaiKhoanMoi,
  kiemTraDangNhap,
  taoTheXacThuc,
  layDuLieuNguoiDung,
  capNhatAnhDaiDien,
} from "../services/xac_thuc.service";
import cloudinary from "../config/cloudinary";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: string };
      file?: any;
    }
  }
}

// Cấu hình chuẩn cho Cookie
const isProd = process.env.NODE_ENV === "production";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,
  sameSite: (isProd ? "none" : "lax") as "none" | "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
};

export const xuLyDangKy = async (yeuCau: Request, phanHoi: Response) => {
  try {
    const { email, password, name } = yeuCau.body;

    if (!email || !password || !name) {
      return phanHoi.status(400).json({ error: "Vui lòng cung cấp đầy đủ thông tin!" });
    }

    const nguoiDung = await taoTaiKhoanMoi({ email, matKhau: password, hoTen: name });
    const token = taoTheXacThuc(nguoiDung.id, nguoiDung.role);

    // Gắn cookie
    phanHoi.cookie("token_xac_thuc", token, COOKIE_OPTIONS);

    return phanHoi.status(201).json({
      message: "Đăng ký thành công!",
      user: {
        id: nguoiDung.id,
        email: nguoiDung.email,
        name: nguoiDung.name,
        avatar: nguoiDung.avatar,
        role: nguoiDung.role,
      },
    });
  } catch (loi: any) {
    return phanHoi.status(400).json({ error: loi.message || "Đăng ký thất bại!" });
  }
};

export const xuLyDangNhap = async (yeuCau: Request, phanHoi: Response) => {
  try {
    const { email, password } = yeuCau.body;

    if (!email || !password) {
      return phanHoi.status(400).json({ error: "Vui lòng nhập email và mật khẩu!" });
    }

    const nguoiDung = await kiemTraDangNhap(email, password);
    const token = taoTheXacThuc(nguoiDung.id, nguoiDung.role);

    // Gắn cookie
    phanHoi.cookie("token_xac_thuc", token, COOKIE_OPTIONS);

    return phanHoi.status(200).json({
      message: "Đăng nhập thành công!",
      user: {
        id: nguoiDung.id,
        email: nguoiDung.email,
        name: nguoiDung.name,
        avatar: nguoiDung.avatar,
        role: nguoiDung.role,
      },
    });
  } catch (loi: any) {
    return phanHoi.status(401).json({ error: loi.message || "Đăng nhập thất bại!" });
  }
};

export const xuLyDangXuat = async (yeuCau: Request, phanHoi: Response) => {
  try {
    phanHoi.cookie("token_xac_thuc", "", {
      ...COOKIE_OPTIONS,
      maxAge: 0,
      expires: new Date(0),
    });

    return phanHoi.status(200).json({ message: "Đăng xuất thành công!" });
  } catch (loi) {
    return phanHoi.status(500).json({ error: "Có lỗi xảy ra khi đăng xuất." });
  }
};

export const layThongTinCaNhan = async (yeuCau: Request, phanHoi: Response) => {
  try {
    const maNguoiDung = yeuCau.user?.id;
    
    if (!maNguoiDung) {
      return phanHoi.status(401).json({ error: "Chưa được xác thực!" });
    }

    const thongTin = await layDuLieuNguoiDung(maNguoiDung);
    
    return phanHoi.status(200).json({ user: thongTin });
  } catch (loi: any) {
    return phanHoi.status(404).json({ error: loi.message || "Không thể lấy thông tin." });
  }
};

export const xuLyCapNhatAvatar = async (yeuCau: Request, phanHoi: Response) => {
  try {
    const maNguoiDung = yeuCau.user?.id;
    const file = yeuCau.file;

    if (!maNguoiDung) {
      return phanHoi.status(401).json({ error: "Chưa được xác thực!" });
    }

    if (!file) {
      return phanHoi.status(400).json({ error: "Vui lòng chọn ảnh để tải lên!" });
    }

    // Upload file stream qua Cloudinary
    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataURI = "data:" + file.mimetype + ";base64," + b64;
    
    const ketQuaUpload = await cloudinary.uploader.upload(dataURI, {
      folder: "lingoflow/avatar",
      public_id: `user_${maNguoiDung}_${Date.now()}`,
      overwrite: true,
      transformation: [{ width: 250, height: 250, crop: "fill" }],
    });

    // Cập nhật Database
    const nguoiDungDaCapNhat = await capNhatAnhDaiDien(maNguoiDung, ketQuaUpload.secure_url);

    return phanHoi.status(200).json({
      message: "Cập nhật ảnh đại diện thành công!",
      user: nguoiDungDaCapNhat,
    });
  } catch (loi: any) {
    return phanHoi.status(500).json({ error: loi.message || "Lỗi tải ảnh lên Cloudinary!" });
  }
};
