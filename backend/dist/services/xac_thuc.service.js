"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.capNhatAnhDaiDien = exports.layDuLieuNguoiDung = exports.kiemTraDangNhap = exports.taoTaiKhoanMoi = exports.taoTheXacThuc = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const xac_thuc_repository_1 = require("../repositories/xac_thuc.repository");
const JWT_SECRET = process.env.JWT_SECRET || "lingoflow_secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
// 1. Tạo JWT Token
const taoTheXacThuc = (maNguoiDung, vaiTro) => {
    return jsonwebtoken_1.default.sign({ id: maNguoiDung, role: vaiTro }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
};
exports.taoTheXacThuc = taoTheXacThuc;
// 2. Tạo Tài Khoản Mới
const taoTaiKhoanMoi = async (thongTin) => {
    const { email, matKhau, hoTen } = thongTin;
    // Kiểm tra email đã tồn tại chưa ở tầng Repository
    const emailTonTai = await (0, xac_thuc_repository_1.timNguoiDungTheoEmail)(email);
    if (emailTonTai) {
        throw new Error("Email này đã được sử dụng!");
    }
    // Mã hóa mật khẩu
    const salt = await bcryptjs_1.default.genSalt(10);
    const matKhauDaMaHoa = await bcryptjs_1.default.hash(matKhau, salt);
    // Avatar mặc định
    const avatarMacDinh = "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg";
    // Lưu vào Database qua Repository
    const nguoiDungMoi = await (0, xac_thuc_repository_1.taoNguoiDungMoi)({
        email,
        password: matKhauDaMaHoa,
        name: hoTen,
        avatar: avatarMacDinh,
        role: "LEARNER",
    });
    return nguoiDungMoi;
};
exports.taoTaiKhoanMoi = taoTaiKhoanMoi;
// 3. Kiểm Tra Đăng Nhập
const kiemTraDangNhap = async (email, matKhau) => {
    const nguoiDung = await (0, xac_thuc_repository_1.timNguoiDungTheoEmail)(email);
    if (!nguoiDung || !nguoiDung.password) {
        throw new Error("Email hoặc mật khẩu không chính xác!");
    }
    const matKhauHopLe = await bcryptjs_1.default.compare(matKhau, nguoiDung.password);
    if (!matKhauHopLe) {
        throw new Error("Email hoặc mật khẩu không chính xác!");
    }
    return nguoiDung;
};
exports.kiemTraDangNhap = kiemTraDangNhap;
// 4. Lấy Thông Tin Người Dùng
const layDuLieuNguoiDung = async (maNguoiDung) => {
    const nguoiDung = await (0, xac_thuc_repository_1.timNguoiDungTheoId)(maNguoiDung);
    if (!nguoiDung) {
        throw new Error("Không tìm thấy người dùng!");
    }
    return nguoiDung;
};
exports.layDuLieuNguoiDung = layDuLieuNguoiDung;
// 5. Cập Nhật Avatar
const capNhatAnhDaiDien = async (maNguoiDung, urlAnh) => {
    const nguoiDungDaCapNhat = await (0, xac_thuc_repository_1.capNhatAvatarNguoiDung)(maNguoiDung, urlAnh);
    return nguoiDungDaCapNhat;
};
exports.capNhatAnhDaiDien = capNhatAnhDaiDien;
//# sourceMappingURL=xac_thuc.service.js.map