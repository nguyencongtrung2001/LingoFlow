"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.capNhatTrangThai = exports.capNhatVaiTro = exports.layDanhSachNguoiDung = void 0;
const quan_tri_repository_1 = require("../repositories/quan_tri.repository");
const layDanhSachNguoiDung = async (yeuCau, phanHoi) => {
    try {
        const users = await (0, quan_tri_repository_1.layDanhSachNguoiDungWithStats)();
        // Định dạng lại thống kê chi tiết cho từng người dùng
        const usersFormatted = users.map((user) => {
            const wordsCount = user.folders.reduce((sum, folder) => sum + folder._count.words, 0);
            const studyTimeSeconds = user.activities.reduce((sum, act) => sum + act.studyTimeSeconds, 0);
            return {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                role: user.role,
                isActive: user.isActive,
                createdAt: user.createdAt,
                foldersCount: user._count.folders,
                studySessionsCount: user._count.studySessions,
                wordsCount,
                studyTimeSeconds,
            };
        });
        return phanHoi.status(200).json(usersFormatted);
    }
    catch (loi) {
        return phanHoi.status(500).json({ error: loi.message || "Không thể lấy danh sách người dùng." });
    }
};
exports.layDanhSachNguoiDung = layDanhSachNguoiDung;
const capNhatVaiTro = async (yeuCau, phanHoi) => {
    try {
        const { id } = yeuCau.params;
        const { role } = yeuCau.body;
        if (!id || typeof id !== "string") {
            return phanHoi.status(400).json({ error: "ID người dùng không hợp lệ!" });
        }
        if (!role || (role !== "LEARNER" && role !== "ADMIN")) {
            return phanHoi.status(400).json({ error: "Vai trò không hợp lệ!" });
        }
        // Bảo vệ: Quản trị viên không được tự hạ cấp chính mình
        if (yeuCau.user?.id === id) {
            return phanHoi.status(400).json({ error: "Bạn không thể tự thay đổi vai trò của chính mình!" });
        }
        const ketQua = await (0, quan_tri_repository_1.capNhatVaiTroNguoiDung)(id, role);
        return phanHoi.status(200).json({
            message: `Đã cập nhật vai trò của ${ketQua.name} thành ${role === "ADMIN" ? "Quản trị viên" : "Người học"}.`,
            user: ketQua,
        });
    }
    catch (loi) {
        return phanHoi.status(500).json({ error: loi.message || "Cập nhật vai trò thất bại." });
    }
};
exports.capNhatVaiTro = capNhatVaiTro;
const capNhatTrangThai = async (yeuCau, phanHoi) => {
    try {
        const { id } = yeuCau.params;
        const { isActive } = yeuCau.body;
        if (!id || typeof id !== "string") {
            return phanHoi.status(400).json({ error: "ID người dùng không hợp lệ!" });
        }
        if (isActive === undefined || typeof isActive !== "boolean") {
            return phanHoi.status(400).json({ error: "Trạng thái hoạt động không hợp lệ!" });
        }
        // Bảo vệ: Quản trị viên không được tự khóa tài khoản của chính mình
        if (yeuCau.user?.id === id) {
            return phanHoi.status(400).json({ error: "Bạn không thể tự khóa tài khoản của chính mình!" });
        }
        const ketQua = await (0, quan_tri_repository_1.capNhatTrangThaiNguoiDung)(id, isActive);
        return phanHoi.status(200).json({
            message: `Đã ${isActive ? "mở khóa" : "khóa"} tài khoản của ${ketQua.name}.`,
            user: ketQua,
        });
    }
    catch (loi) {
        return phanHoi.status(500).json({ error: loi.message || "Cập nhật trạng thái tài khoản thất bại." });
    }
};
exports.capNhatTrangThai = capNhatTrangThai;
//# sourceMappingURL=quan_tri.controller.js.map