"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sapXepLaiController = exports.xoaGhiChuController = exports.capNhatGhiChuController = exports.taoGhiChuController = exports.xoaCotController = exports.capNhatCotController = exports.taoCotMoiController = exports.layBangGhiChuController = void 0;
const ghi_chu_service_1 = require("../services/ghi_chu.service");
// ========== CỘT (COLUMN) ==========
const layBangGhiChuController = async (yeuCau, phanHoi) => {
    try {
        const maNguoiDung = yeuCau.user?.id;
        if (!maNguoiDung)
            return phanHoi.status(401).json({ error: "Chưa được xác thực!" });
        const bangGhiChu = await (0, ghi_chu_service_1.layBangGhiChu)(maNguoiDung);
        return phanHoi.status(200).json(bangGhiChu);
    }
    catch (loi) {
        return phanHoi.status(500).json({ error: loi.message || "Lỗi khi lấy bảng ghi chú." });
    }
};
exports.layBangGhiChuController = layBangGhiChuController;
const taoCotMoiController = async (yeuCau, phanHoi) => {
    try {
        const maNguoiDung = yeuCau.user?.id;
        if (!maNguoiDung)
            return phanHoi.status(401).json({ error: "Chưa được xác thực!" });
        const { title } = yeuCau.body;
        const cotMoi = await (0, ghi_chu_service_1.taoCotMoi)(maNguoiDung, title);
        return phanHoi.status(201).json(cotMoi);
    }
    catch (loi) {
        return phanHoi.status(400).json({ error: loi.message || "Không thể tạo danh mục." });
    }
};
exports.taoCotMoiController = taoCotMoiController;
const capNhatCotController = async (yeuCau, phanHoi) => {
    try {
        const maNguoiDung = yeuCau.user?.id;
        const cotId = yeuCau.params.id;
        if (!maNguoiDung)
            return phanHoi.status(401).json({ error: "Chưa được xác thực!" });
        if (!cotId)
            return phanHoi.status(400).json({ error: "ID danh mục không hợp lệ." });
        const { title } = yeuCau.body;
        const cotCapNhat = await (0, ghi_chu_service_1.capNhatCot)(cotId, maNguoiDung, title);
        return phanHoi.status(200).json(cotCapNhat);
    }
    catch (loi) {
        return phanHoi.status(400).json({ error: loi.message || "Không thể cập nhật danh mục." });
    }
};
exports.capNhatCotController = capNhatCotController;
const xoaCotController = async (yeuCau, phanHoi) => {
    try {
        const maNguoiDung = yeuCau.user?.id;
        const cotId = yeuCau.params.id;
        if (!maNguoiDung)
            return phanHoi.status(401).json({ error: "Chưa được xác thực!" });
        if (!cotId)
            return phanHoi.status(400).json({ error: "ID danh mục không hợp lệ." });
        await (0, ghi_chu_service_1.xoaCot)(cotId, maNguoiDung);
        return phanHoi.status(200).json({ message: "Xóa danh mục thành công." });
    }
    catch (loi) {
        return phanHoi.status(400).json({ error: loi.message || "Không thể xóa danh mục." });
    }
};
exports.xoaCotController = xoaCotController;
// ========== GHI CHÚ (NOTE) ==========
const taoGhiChuController = async (yeuCau, phanHoi) => {
    try {
        const maNguoiDung = yeuCau.user?.id;
        if (!maNguoiDung)
            return phanHoi.status(401).json({ error: "Chưa được xác thực!" });
        const { columnId, title, content } = yeuCau.body;
        const ghiChuMoi = await (0, ghi_chu_service_1.taoGhiChu)(maNguoiDung, columnId, title, content);
        return phanHoi.status(201).json(ghiChuMoi);
    }
    catch (loi) {
        return phanHoi.status(400).json({ error: loi.message || "Không thể tạo ghi chú." });
    }
};
exports.taoGhiChuController = taoGhiChuController;
const capNhatGhiChuController = async (yeuCau, phanHoi) => {
    try {
        const maNguoiDung = yeuCau.user?.id;
        const ghiChuId = yeuCau.params.id;
        if (!maNguoiDung)
            return phanHoi.status(401).json({ error: "Chưa được xác thực!" });
        if (!ghiChuId)
            return phanHoi.status(400).json({ error: "ID ghi chú không hợp lệ." });
        const { title, content } = yeuCau.body;
        const ghiChuCapNhat = await (0, ghi_chu_service_1.capNhatGhiChu)(ghiChuId, maNguoiDung, { title, content });
        return phanHoi.status(200).json(ghiChuCapNhat);
    }
    catch (loi) {
        return phanHoi.status(400).json({ error: loi.message || "Không thể cập nhật ghi chú." });
    }
};
exports.capNhatGhiChuController = capNhatGhiChuController;
const xoaGhiChuController = async (yeuCau, phanHoi) => {
    try {
        const maNguoiDung = yeuCau.user?.id;
        const ghiChuId = yeuCau.params.id;
        if (!maNguoiDung)
            return phanHoi.status(401).json({ error: "Chưa được xác thực!" });
        if (!ghiChuId)
            return phanHoi.status(400).json({ error: "ID ghi chú không hợp lệ." });
        await (0, ghi_chu_service_1.xoaGhiChu)(ghiChuId, maNguoiDung);
        return phanHoi.status(200).json({ message: "Xóa ghi chú thành công." });
    }
    catch (loi) {
        return phanHoi.status(400).json({ error: loi.message || "Không thể xóa ghi chú." });
    }
};
exports.xoaGhiChuController = xoaGhiChuController;
// ========== SẮP XẾP LẠI (REORDER) ==========
const sapXepLaiController = async (yeuCau, phanHoi) => {
    try {
        const maNguoiDung = yeuCau.user?.id;
        if (!maNguoiDung)
            return phanHoi.status(401).json({ error: "Chưa được xác thực!" });
        const { updates } = yeuCau.body;
        await (0, ghi_chu_service_1.sapXepLai)(maNguoiDung, updates);
        return phanHoi.status(200).json({ message: "Sắp xếp lại thành công." });
    }
    catch (loi) {
        return phanHoi.status(400).json({ error: loi.message || "Không thể sắp xếp lại." });
    }
};
exports.sapXepLaiController = sapXepLaiController;
//# sourceMappingURL=ghi_chu.controller.js.map