"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xoaBoThuMuc = exports.suaThuMuc = exports.taoMoiThuMuc = exports.chiTietThuMuc = exports.danhSachThuMuc = void 0;
const thu_muc_service_1 = require("../services/thu_muc.service");
const danhSachThuMuc = async (yeuCau, phanHoi) => {
    try {
        const maNguoiDung = yeuCau.user?.id;
        if (!maNguoiDung) {
            return phanHoi.status(401).json({ error: "Chưa được xác thực!" });
        }
        const danhSach = await (0, thu_muc_service_1.layDanhSachThuMuc)(maNguoiDung);
        return phanHoi.status(200).json(danhSach);
    }
    catch (loi) {
        return phanHoi.status(500).json({ error: loi.message || "Lỗi khi lấy danh sách thư mục." });
    }
};
exports.danhSachThuMuc = danhSachThuMuc;
const chiTietThuMuc = async (yeuCau, phanHoi) => {
    try {
        const maNguoiDung = yeuCau.user?.id;
        const slug = yeuCau.params.id; // slug is the name
        if (!maNguoiDung)
            return phanHoi.status(401).json({ error: "Chưa được xác thực!" });
        if (!slug)
            return phanHoi.status(400).json({ error: "Tên thư mục không hợp lệ." });
        const thuMuc = await (0, thu_muc_service_1.layThuMucChiTietQuaName)(slug, maNguoiDung);
        return phanHoi.status(200).json(thuMuc);
    }
    catch (loi) {
        return phanHoi.status(404).json({ error: loi.message || "Không tìm thấy thư mục." });
    }
};
exports.chiTietThuMuc = chiTietThuMuc;
const taoMoiThuMuc = async (yeuCau, phanHoi) => {
    try {
        const maNguoiDung = yeuCau.user?.id;
        const { name, description } = yeuCau.body;
        if (!maNguoiDung)
            return phanHoi.status(401).json({ error: "Chưa được xác thực!" });
        const thuMucMoi = await (0, thu_muc_service_1.taoThuMuc)(maNguoiDung, name, description);
        return phanHoi.status(201).json(thuMucMoi);
    }
    catch (loi) {
        return phanHoi.status(400).json({ error: loi.message || "Không thể tạo thư mục." });
    }
};
exports.taoMoiThuMuc = taoMoiThuMuc;
const suaThuMuc = async (yeuCau, phanHoi) => {
    try {
        const maNguoiDung = yeuCau.user?.id;
        const folderId = parseInt(yeuCau.params.id);
        const { name, description } = yeuCau.body;
        if (!maNguoiDung)
            return phanHoi.status(401).json({ error: "Chưa được xác thực!" });
        if (isNaN(folderId))
            return phanHoi.status(400).json({ error: "ID thư mục không hợp lệ." });
        const thuMucCapNhat = await (0, thu_muc_service_1.capNhatThuMuc)(folderId, maNguoiDung, { name, description });
        return phanHoi.status(200).json(thuMucCapNhat);
    }
    catch (loi) {
        return phanHoi.status(400).json({ error: loi.message || "Không thể cập nhật thư mục." });
    }
};
exports.suaThuMuc = suaThuMuc;
const xoaBoThuMuc = async (yeuCau, phanHoi) => {
    try {
        const maNguoiDung = yeuCau.user?.id;
        const folderId = parseInt(yeuCau.params.id);
        if (!maNguoiDung)
            return phanHoi.status(401).json({ error: "Chưa được xác thực!" });
        if (isNaN(folderId))
            return phanHoi.status(400).json({ error: "ID thư mục không hợp lệ." });
        await (0, thu_muc_service_1.xoaThuMuc)(folderId, maNguoiDung);
        return phanHoi.status(200).json({ message: "Xóa thư mục thành công." });
    }
    catch (loi) {
        return phanHoi.status(400).json({ error: loi.message || "Không thể xóa thư mục." });
    }
};
exports.xoaBoThuMuc = xoaBoThuMuc;
//# sourceMappingURL=thu_muc.controller.js.map