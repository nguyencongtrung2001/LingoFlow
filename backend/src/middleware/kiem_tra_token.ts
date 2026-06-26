import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: string };
    }
  }
}

export const xacThucNguoiDung = (
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

    // Gắn thông tin vào Request
    yeuCau.user = thongTinGiaiMa;

    tiepTuc();
  } catch (loi) {
    return phanHoi.status(403).json({ error: "Token xác thực không hợp lệ hoặc đã hết hạn!" });
  }
};
