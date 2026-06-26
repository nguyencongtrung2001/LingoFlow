"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.xacThucNguoiDung = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const xacThucNguoiDung = (yeuCau, phanHoi, tiepTuc) => {
    try {
        // Ưu tiên đọc token từ Cookie (Bảo mật hơn) hoặc Header (phòng hờ)
        const token = yeuCau.cookies?.token_xac_thuc || yeuCau.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return phanHoi.status(401).json({ error: "Không tìm thấy token xác thực, vui lòng đăng nhập!" });
        }
        const JWT_SECRET = process.env.JWT_SECRET || "lingoflow_secret_key";
        // Giải mã token
        const thongTinGiaiMa = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Gắn thông tin vào Request
        yeuCau.user = thongTinGiaiMa;
        tiepTuc();
    }
    catch (loi) {
        return phanHoi.status(403).json({ error: "Token xác thực không hợp lệ hoặc đã hết hạn!" });
    }
};
exports.xacThucNguoiDung = xacThucNguoiDung;
//# sourceMappingURL=kiem_tra_token.js.map