"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xoaThuMuc = exports.capNhatThuMuc = exports.taoThuMuc = exports.layThuMucChiTiet = exports.layDanhSachThuMuc = void 0;
const thu_muc_repository_1 = require("../repositories/thu_muc.repository");
const layDanhSachThuMuc = async (userId) => {
    return await (0, thu_muc_repository_1.layDanhSachThuMucRepo)(userId);
};
exports.layDanhSachThuMuc = layDanhSachThuMuc;
const layThuMucChiTiet = async (id, userId) => {
    const thuMuc = await (0, thu_muc_repository_1.layThuMucChiTietRepo)(id, userId);
    if (!thuMuc) {
        throw new Error("Không tìm thấy thư mục hoặc bạn không có quyền truy cập.");
    }
    return thuMuc;
};
exports.layThuMucChiTiet = layThuMucChiTiet;
const taoThuMuc = async (userId, name, description) => {
    if (!name || name.trim() === "") {
        throw new Error("Tên thư mục không được để trống.");
    }
    return await (0, thu_muc_repository_1.taoThuMucRepo)(userId, name, description);
};
exports.taoThuMuc = taoThuMuc;
const capNhatThuMuc = async (id, userId, data) => {
    // Kiểm tra quyền sở hữu
    const thuMuc = await (0, thu_muc_repository_1.layThuMucChiTietRepo)(id, userId);
    if (!thuMuc) {
        throw new Error("Không tìm thấy thư mục hoặc bạn không có quyền truy cập.");
    }
    if (data.name !== undefined && data.name.trim() === "") {
        throw new Error("Tên thư mục không được để trống.");
    }
    return await (0, thu_muc_repository_1.capNhatThuMucRepo)(id, userId, data);
};
exports.capNhatThuMuc = capNhatThuMuc;
const xoaThuMuc = async (id, userId) => {
    // Kiểm tra quyền sở hữu
    const thuMuc = await (0, thu_muc_repository_1.layThuMucChiTietRepo)(id, userId);
    if (!thuMuc) {
        throw new Error("Không tìm thấy thư mục hoặc bạn không có quyền truy cập.");
    }
    return await (0, thu_muc_repository_1.xoaThuMucRepo)(id, userId);
};
exports.xoaThuMuc = xoaThuMuc;
//# sourceMappingURL=thu_muc.service.js.map