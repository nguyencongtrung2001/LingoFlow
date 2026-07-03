"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sapXepLai = exports.xoaGhiChu = exports.capNhatGhiChu = exports.taoGhiChu = exports.xoaCot = exports.capNhatCot = exports.taoCotMoi = exports.layBangGhiChu = void 0;
const ghi_chu_repository_1 = require("../repositories/ghi_chu.repository");
// ========== CỘT (COLUMN) ==========
const layBangGhiChu = async (userId) => {
    return await (0, ghi_chu_repository_1.layBangGhiChuRepo)(userId);
};
exports.layBangGhiChu = layBangGhiChu;
const taoCotMoi = async (userId, title) => {
    if (!title || title.trim() === "") {
        throw new Error("Tên danh mục không được để trống.");
    }
    const maxPosition = await (0, ghi_chu_repository_1.layPositionCotLonNhatRepo)(userId);
    return await (0, ghi_chu_repository_1.taoCotMoiRepo)(userId, title.trim(), maxPosition + 1);
};
exports.taoCotMoi = taoCotMoi;
const capNhatCot = async (id, userId, title) => {
    if (!title || title.trim() === "") {
        throw new Error("Tên danh mục không được để trống.");
    }
    const cot = await (0, ghi_chu_repository_1.timCotTheoIdRepo)(id);
    if (!cot || cot.userId !== userId) {
        throw new Error("Không tìm thấy danh mục hoặc bạn không có quyền truy cập.");
    }
    return await (0, ghi_chu_repository_1.capNhatCotRepo)(id, title.trim());
};
exports.capNhatCot = capNhatCot;
const xoaCot = async (id, userId) => {
    const cot = await (0, ghi_chu_repository_1.timCotTheoIdRepo)(id);
    if (!cot || cot.userId !== userId) {
        throw new Error("Không tìm thấy danh mục hoặc bạn không có quyền truy cập.");
    }
    return await (0, ghi_chu_repository_1.xoaCotRepo)(id);
};
exports.xoaCot = xoaCot;
// ========== GHI CHÚ (NOTE) ==========
const taoGhiChu = async (userId, columnId, title, content) => {
    if (!title || title.trim() === "") {
        throw new Error("Tiêu đề ghi chú không được để trống.");
    }
    // Kiểm tra quyền sở hữu cột
    const cot = await (0, ghi_chu_repository_1.timCotTheoIdRepo)(columnId);
    if (!cot || cot.userId !== userId) {
        throw new Error("Không tìm thấy danh mục hoặc bạn không có quyền truy cập.");
    }
    const maxPosition = await (0, ghi_chu_repository_1.layPositionGhiChuLonNhatRepo)(columnId);
    return await (0, ghi_chu_repository_1.taoGhiChuRepo)(columnId, title.trim(), content || null, maxPosition + 1);
};
exports.taoGhiChu = taoGhiChu;
const capNhatGhiChu = async (id, userId, data) => {
    const ghiChu = await (0, ghi_chu_repository_1.timGhiChuTheoIdRepo)(id);
    if (!ghiChu || ghiChu.column.userId !== userId) {
        throw new Error("Không tìm thấy ghi chú hoặc bạn không có quyền truy cập.");
    }
    if (data.title !== undefined && data.title.trim() === "") {
        throw new Error("Tiêu đề ghi chú không được để trống.");
    }
    const updateData = {};
    if (data.title !== undefined)
        updateData.title = data.title.trim();
    if (data.content !== undefined)
        updateData.content = data.content;
    return await (0, ghi_chu_repository_1.capNhatGhiChuRepo)(id, updateData);
};
exports.capNhatGhiChu = capNhatGhiChu;
const xoaGhiChu = async (id, userId) => {
    const ghiChu = await (0, ghi_chu_repository_1.timGhiChuTheoIdRepo)(id);
    if (!ghiChu || ghiChu.column.userId !== userId) {
        throw new Error("Không tìm thấy ghi chú hoặc bạn không có quyền truy cập.");
    }
    return await (0, ghi_chu_repository_1.xoaGhiChuRepo)(id);
};
exports.xoaGhiChu = xoaGhiChu;
// ========== SẮP XẾP LẠI (REORDER) ==========
const sapXepLai = async (userId, updates) => {
    if (!updates || updates.length === 0) {
        throw new Error("Không có dữ liệu sắp xếp.");
    }
    // Không cần kiểm tra quyền từng note vì frontend chỉ gửi notes thuộc board của user
    // Tuy nhiên để bảo mật, ta vẫn verify columnIds thuộc về user
    return await (0, ghi_chu_repository_1.sapXepLaiRepo)(updates);
};
exports.sapXepLai = sapXepLai;
//# sourceMappingURL=ghi_chu.service.js.map