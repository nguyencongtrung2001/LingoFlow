"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xuLyDiChuyenTu = exports.xuLyLayTuCuonChieu = exports.xuLyLuuPhienHoc = exports.xuLyXoaTu = exports.xuLyCapNhatTu = exports.xuLyThemNhieuTu = exports.xuLyThemTu = exports.xuLyLayDanhSachTu = void 0;
const tu_vung_service_1 = require("../services/tu_vung.service");
const xuLyLayDanhSachTu = async (yeuCau, phanHoi) => {
    try {
        const maNguoiDung = yeuCau.user?.id;
        const folderId = parseInt(yeuCau.params.folderId);
        if (!maNguoiDung)
            return phanHoi.status(401).json({ error: "Chưa được xác thực!" });
        if (isNaN(folderId))
            return phanHoi.status(400).json({ error: "ID thư mục không hợp lệ." });
        const danhSach = await (0, tu_vung_service_1.layDanhSachTuVungService)(folderId, maNguoiDung);
        return phanHoi.status(200).json(danhSach);
    }
    catch (loi) {
        return phanHoi.status(403).json({ error: loi.message });
    }
};
exports.xuLyLayDanhSachTu = xuLyLayDanhSachTu;
const xuLyThemTu = async (yeuCau, phanHoi) => {
    try {
        const maNguoiDung = yeuCau.user?.id;
        const { folderId, word, meaning, pos, phonetic, example, image } = yeuCau.body;
        if (!maNguoiDung)
            return phanHoi.status(401).json({ error: "Chưa được xác thực!" });
        if (!folderId || isNaN(parseInt(folderId)))
            return phanHoi.status(400).json({ error: "Thư mục không hợp lệ." });
        if (!word || !meaning)
            return phanHoi.status(400).json({ error: "Thiếu thông tin từ vựng hoặc nghĩa." });
        const tuMoi = await (0, tu_vung_service_1.taoTuVungService)(maNguoiDung, parseInt(folderId), {
            word, meaning, pos, phonetic, example, image
        });
        return phanHoi.status(201).json(tuMoi);
    }
    catch (loi) {
        return phanHoi.status(403).json({ error: loi.message });
    }
};
exports.xuLyThemTu = xuLyThemTu;
const xuLyThemNhieuTu = async (yeuCau, phanHoi) => {
    try {
        const maNguoiDung = yeuCau.user?.id;
        const { folderId, wordsArray } = yeuCau.body;
        if (!maNguoiDung)
            return phanHoi.status(401).json({ error: "Chưa được xác thực!" });
        if (!folderId || isNaN(parseInt(folderId)))
            return phanHoi.status(400).json({ error: "Thư mục không hợp lệ." });
        if (!Array.isArray(wordsArray) || wordsArray.length === 0)
            return phanHoi.status(400).json({ error: "Danh sách từ vựng trống." });
        const ketQua = await (0, tu_vung_service_1.taoNhieuTuVungService)(maNguoiDung, parseInt(folderId), wordsArray);
        return phanHoi.status(201).json(ketQua);
    }
    catch (loi) {
        return phanHoi.status(403).json({ error: loi.message });
    }
};
exports.xuLyThemNhieuTu = xuLyThemNhieuTu;
const xuLyCapNhatTu = async (yeuCau, phanHoi) => {
    try {
        const maNguoiDung = yeuCau.user?.id;
        const wordId = parseInt(yeuCau.params.id);
        const data = yeuCau.body;
        if (!maNguoiDung)
            return phanHoi.status(401).json({ error: "Chưa được xác thực!" });
        if (isNaN(wordId))
            return phanHoi.status(400).json({ error: "ID từ vựng không hợp lệ." });
        const tuCapNhat = await (0, tu_vung_service_1.suaTuVungService)(wordId, maNguoiDung, data);
        return phanHoi.status(200).json(tuCapNhat);
    }
    catch (loi) {
        return phanHoi.status(403).json({ error: loi.message });
    }
};
exports.xuLyCapNhatTu = xuLyCapNhatTu;
const xuLyXoaTu = async (yeuCau, phanHoi) => {
    try {
        const maNguoiDung = yeuCau.user?.id;
        const wordId = parseInt(yeuCau.params.id);
        if (!maNguoiDung)
            return phanHoi.status(401).json({ error: "Chưa được xác thực!" });
        if (isNaN(wordId))
            return phanHoi.status(400).json({ error: "ID từ vựng không hợp lệ." });
        await (0, tu_vung_service_1.xoaTuVungService)(wordId, maNguoiDung);
        return phanHoi.status(200).json({ message: "Xóa từ vựng thành công." });
    }
    catch (loi) {
        return phanHoi.status(403).json({ error: loi.message });
    }
};
exports.xuLyXoaTu = xuLyXoaTu;
const xuLyLuuPhienHoc = async (yeuCau, phanHoi) => {
    try {
        const maNguoiDung = yeuCau.user?.id;
        const { folderId, mode, totalWords, correctCount, accuracy, timeSeconds, maxStreak, details } = yeuCau.body;
        if (!maNguoiDung)
            return phanHoi.status(401).json({ error: "Chưa được xác thực!" });
        if (!folderId || isNaN(parseInt(folderId)))
            return phanHoi.status(400).json({ error: "Thư mục không hợp lệ." });
        if (!mode)
            return phanHoi.status(400).json({ error: "Thiếu chế độ học tập (mode)." });
        if (!Array.isArray(details) || details.length === 0)
            return phanHoi.status(400).json({ error: "Danh sách chi tiết phiên học trống." });
        const ketQua = await (0, tu_vung_service_1.ghiNhanPhienHocService)(maNguoiDung, parseInt(folderId), {
            mode,
            totalWords: parseInt(totalWords) || details.length,
            correctCount: parseInt(correctCount) || 0,
            accuracy: parseFloat(accuracy) || 0,
            timeSeconds: parseInt(timeSeconds) || 0,
            maxStreak: parseInt(maxStreak) || 0,
            details,
        });
        return phanHoi.status(201).json(ketQua);
    }
    catch (loi) {
        return phanHoi.status(403).json({ error: loi.message });
    }
};
exports.xuLyLuuPhienHoc = xuLyLuuPhienHoc;
const xuLyLayTuCuonChieu = async (yeuCau, phanHoi) => {
    try {
        const maNguoiDung = yeuCau.user?.id;
        const folderId = parseInt(String(yeuCau.params.folderId || "0"), 10);
        const trang = parseInt(typeof yeuCau.query.page === "string" ? yeuCau.query.page : "1", 10) || 1;
        if (!maNguoiDung)
            return phanHoi.status(401).json({ error: "Chưa được xác thực!" });
        if (isNaN(folderId)) {
            return phanHoi.status(400).json({ error: "Mã thư mục không hợp lệ." });
        }
        const danhSachTu = await (0, tu_vung_service_1.layDanhSachTuCuonChieuService)(maNguoiDung, folderId, trang);
        return phanHoi.status(200).json(danhSachTu);
    }
    catch (loi) {
        return phanHoi.status(403).json({ error: loi.message });
    }
};
exports.xuLyLayTuCuonChieu = xuLyLayTuCuonChieu;
const xuLyDiChuyenTu = async (yeuCau, phanHoi) => {
    try {
        const maNguoiDung = yeuCau.user?.id;
        const { wordIds, targetFolderId } = yeuCau.body;
        if (!maNguoiDung)
            return phanHoi.status(401).json({ error: "Chưa được xác thực!" });
        if (!Array.isArray(wordIds) || wordIds.length === 0) {
            return phanHoi.status(400).json({ error: "Danh sách từ vựng không hợp lệ." });
        }
        if (!targetFolderId || isNaN(parseInt(targetFolderId))) {
            return phanHoi.status(400).json({ error: "Thư mục đích không hợp lệ." });
        }
        const ketQua = await (0, tu_vung_service_1.diChuyenTuVungService)(maNguoiDung, wordIds, parseInt(targetFolderId));
        return phanHoi.status(200).json({ message: "Di chuyển thành công.", count: ketQua.count });
    }
    catch (loi) {
        return phanHoi.status(403).json({ error: loi.message });
    }
};
exports.xuLyDiChuyenTu = xuLyDiChuyenTu;
//# sourceMappingURL=tu_vung.controller.js.map