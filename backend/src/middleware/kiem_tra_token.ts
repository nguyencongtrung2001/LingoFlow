import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: string };
    }
  }
}

export const xacThucNguoiDung = async (
  yeuCau: Request,
  phanHoi: Response,
  tiepTuc: NextFunction
) => {
  try {
    // Ưu tiên đọc token từ Cookie (Bảo mật hơn) hoặc Header (phòng hờ)
    const token = yeuCau.cookies?.token_xac_thuc || yeuCau.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return phanHoi.status(401).json({ error: "Không tìm thấy token xác thực, vui lòng đăng nhập!" });
    }

    const JWT_SECRET = process.env.JWT_SECRET || "lingoflow_secret_key";
    
    // Giải mã token
    const thongTinGiaiMa = jwt.verify(token, JWT_SECRET) as { id: string; role: string };

    // Kiểm tra trạng thái hoạt động và vai trò thực tế trong cơ sở dữ liệu
    const nguoiDung = await prisma.user.findUnique({
      where: { id: thongTinGiaiMa.id },
      select: { isActive: true, role: true },
    });

    if (!nguoiDung) {
      return phanHoi.status(401).json({ error: "Tài khoản không tồn tại trên hệ thống!" });
    }

    if (!nguoiDung.isActive) {
      return phanHoi.status(403).json({ error: "Tài khoản của bạn đã bị khóa bởi Quản trị viên!" });
    }

    // Gắn thông tin cập nhật vào Request
    yeuCau.user = { id: thongTinGiaiMa.id, role: nguoiDung.role };

    tiepTuc();
  } catch (loi) {
    return phanHoi.status(403).json({ error: "Token xác thực không hợp lệ hoặc đã hết hạn!" });
  }
};
