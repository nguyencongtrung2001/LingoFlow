"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.xuLyCapNhatAvatar = exports.layThongTinCaNhan = exports.xuLyDangXuat = exports.xuLyDangNhap = exports.xuLyDangKy = void 0;
const xac_thuc_service_1 = require("../services/xac_thuc.service");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
// Cấu hình chuẩn cho Cookie
const isProd = process.env.NODE_ENV === "production";
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: isProd,
    sameSite: (isProd ? "none" : "lax"),
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
};
const xuLyDangKy = async (yeuCau, phanHoi) => {
    try {
        const { email, password, name } = yeuCau.body;
        if (!email || !password || !name) {
            return phanHoi.status(400).json({ error: "Vui lòng cung cấp đầy đủ thông tin!" });
        }
        const nguoiDung = await (0, xac_thuc_service_1.taoTaiKhoanMoi)({ email, matKhau: password, hoTen: name });
        const token = (0, xac_thuc_service_1.taoTheXacThuc)(nguoiDung.id, nguoiDung.role);
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
    }
    catch (loi) {
        return phanHoi.status(400).json({ error: loi.message || "Đăng ký thất bại!" });
    }
};
exports.xuLyDangKy = xuLyDangKy;
const xuLyDangNhap = async (yeuCau, phanHoi) => {
    try {
        const { email, password } = yeuCau.body;
        if (!email || !password) {
            return phanHoi.status(400).json({ error: "Vui lòng nhập email và mật khẩu!" });
        }
        const nguoiDung = await (0, xac_thuc_service_1.kiemTraDangNhap)(email, password);
        const token = (0, xac_thuc_service_1.taoTheXacThuc)(nguoiDung.id, nguoiDung.role);
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
    }
    catch (loi) {
        return phanHoi.status(401).json({ error: loi.message || "Đăng nhập thất bại!" });
    }
};
exports.xuLyDangNhap = xuLyDangNhap;
const xuLyDangXuat = async (yeuCau, phanHoi) => {
    try {
        phanHoi.cookie("token_xac_thuc", "", {
            ...COOKIE_OPTIONS,
            maxAge: 0,
            expires: new Date(0),
        });
        return phanHoi.status(200).json({ message: "Đăng xuất thành công!" });
    }
    catch (loi) {
        return phanHoi.status(500).json({ error: "Có lỗi xảy ra khi đăng xuất." });
    }
};
exports.xuLyDangXuat = xuLyDangXuat;
const layThongTinCaNhan = async (yeuCau, phanHoi) => {
    try {
        const maNguoiDung = yeuCau.user?.id;
        if (!maNguoiDung) {
            return phanHoi.status(401).json({ error: "Chưa được xác thực!" });
        }
        const thongTin = await (0, xac_thuc_service_1.layDuLieuNguoiDung)(maNguoiDung);
        return phanHoi.status(200).json({ user: thongTin });
    }
    catch (loi) {
        return phanHoi.status(404).json({ error: loi.message || "Không thể lấy thông tin." });
    }
};
exports.layThongTinCaNhan = layThongTinCaNhan;
const xuLyCapNhatAvatar = async (yeuCau, phanHoi) => {
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
        const ketQuaUpload = await cloudinary_1.default.uploader.upload(dataURI, {
            folder: "folder/avatar",
            public_id: `user_${maNguoiDung}_${Date.now()}`,
            overwrite: true,
            transformation: [{ width: 250, height: 250, crop: "fill" }],
        });
        // Cập nhật Database
        const nguoiDungDaCapNhat = await (0, xac_thuc_service_1.capNhatAnhDaiDien)(maNguoiDung, ketQuaUpload.secure_url);
        return phanHoi.status(200).json({
            message: "Cập nhật ảnh đại diện thành công!",
            user: nguoiDungDaCapNhat,
        });
    }
    catch (loi) {
        return phanHoi.status(500).json({ error: loi.message || "Lỗi tải ảnh lên Cloudinary!" });
    }
};
exports.xuLyCapNhatAvatar = xuLyCapNhatAvatar;
//# sourceMappingURL=xac_thuc.controller.js.map