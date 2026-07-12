"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.layTienDoThuMucService = exports.layTuDaThuocService = exports.layTuThongMinhService = exports.diChuyenTuVungService = exports.layDanhSachTuCuonChieuService = exports.ghiNhanPhienHocService = exports.xoaTuVungService = exports.suaTuVungService = exports.taoNhieuTuVungService = exports.taoTuVungService = exports.layDanhSachTuVungService = void 0;
const prisma_1 = require("../config/prisma");
const tu_vung_repository_1 = require("../repositories/tu_vung.repository");
const cloudinary_upload_1 = require("../utils/cloudinary_upload");
const layDanhSachTuVungService = async (folderId, userId) => {
    // Xác thực thư mục có thuộc về người dùng không
    const folder = await prisma_1.prisma.folder.findFirst({
        where: { id: folderId, userId },
    });
    if (!folder) {
        throw new Error("Thư mục không tồn tại hoặc không có quyền truy cập.");
    }
    return await (0, tu_vung_repository_1.layDanhSachTuVungRepo)(folderId);
};
exports.layDanhSachTuVungService = layDanhSachTuVungService;
const taoTuVungService = async (userId, folderId, data) => {
    // Xác thực quyền sở hữu thư mục
    const folder = await prisma_1.prisma.folder.findFirst({
        where: { id: folderId, userId },
    });
    if (!folder) {
        throw new Error("Thư mục không tồn tại hoặc không có quyền truy cập.");
    }
    // Tải gián tiếp ảnh từ URL và đưa lên Cloudinary trước khi tạo từ
    const cloneData = { ...data };
    if (cloneData.image) {
        cloneData.image = await (0, cloudinary_upload_1.uploadImageFromUrl)(cloneData.image, "lingoflow/words", `word_${userId}`);
    }
    return await (0, tu_vung_repository_1.taoTuVungRepo)(userId, folderId, cloneData);
};
exports.taoTuVungService = taoTuVungService;
const taoNhieuTuVungService = async (userId, folderId, danhSachTu) => {
    // Xác thực quyền sở hữu thư mục
    const folder = await prisma_1.prisma.folder.findFirst({
        where: { id: folderId, userId },
    });
    if (!folder) {
        throw new Error("Thư mục không tồn tại hoặc không có quyền truy cập.");
    }
    return await (0, tu_vung_repository_1.taoNhieuTuVungRepo)(userId, folderId, danhSachTu);
};
exports.taoNhieuTuVungService = taoNhieuTuVungService;
const suaTuVungService = async (wordId, userId, data) => {
    // Bảo mật tối cao: Ép điều kiện Folder cha phải thuộc về User này
    const tuVung = await prisma_1.prisma.word.findFirst({
        where: {
            id: wordId,
            folder: { userId },
        },
    });
    if (!tuVung) {
        throw new Error("Từ vựng không tồn tại hoặc không có quyền truy cập.");
    }
    // Tải gián tiếp ảnh từ URL và đưa lên Cloudinary trước khi cập nhật từ
    const cloneData = { ...data };
    if (cloneData.image !== undefined && cloneData.image !== tuVung.image) {
        // Xóa ảnh cũ trên Cloudinary nếu có
        if (tuVung.image) {
            await (0, cloudinary_upload_1.deleteImageFromCloudinary)(tuVung.image);
        }
        // Upload ảnh mới nếu có
        if (cloneData.image) {
            cloneData.image = await (0, cloudinary_upload_1.uploadImageFromUrl)(cloneData.image, "lingoflow/words", `word_${userId}`);
        }
    }
    return await (0, tu_vung_repository_1.suaTuVungRepo)(wordId, cloneData);
};
exports.suaTuVungService = suaTuVungService;
const xoaTuVungService = async (wordId, userId) => {
    // Bảo mật tối cao: Ép điều kiện Folder cha phải thuộc về User này
    const tuVung = await prisma_1.prisma.word.findFirst({
        where: {
            id: wordId,
            folder: { userId },
        },
    });
    if (!tuVung) {
        throw new Error("Từ vựng không tồn tại hoặc không có quyền truy cập.");
    }
    // Xóa ảnh liên kết trên Cloudinary nếu có trước khi xóa từ vựng khỏi Database
    if (tuVung.image) {
        await (0, cloudinary_upload_1.deleteImageFromCloudinary)(tuVung.image);
    }
    return await (0, tu_vung_repository_1.xoaTuVungRepo)(wordId);
};
exports.xoaTuVungService = xoaTuVungService;
const ghiNhanPhienHocService = async (userId, folderId, thongTinPhien) => {
    // Xác thực quyền sở hữu thư mục
    const folder = await prisma_1.prisma.folder.findFirst({
        where: { id: folderId, userId },
    });
    if (!folder) {
        throw new Error("Thư mục không tồn tại hoặc không có quyền truy cập.");
    }
    return await (0, tu_vung_repository_1.taoPhienHocRepo)(userId, folderId, thongTinPhien);
};
exports.ghiNhanPhienHocService = ghiNhanPhienHocService;
const layDanhSachTuCuonChieuService = async (userId, folderId, trang) => {
    // Xác thực quyền sở hữu thư mục
    const folder = await prisma_1.prisma.folder.findFirst({
        where: { id: folderId, userId },
    });
    if (!folder) {
        throw new Error("Thư mục không tồn tại hoặc không có quyền truy cập.");
    }
    return await (0, tu_vung_repository_1.layDanhSachTuCuonChieuRepo)(folderId, trang);
};
exports.layDanhSachTuCuonChieuService = layDanhSachTuCuonChieuService;
const diChuyenTuVungService = async (userId, wordIds, targetFolderId) => {
    if (!wordIds || wordIds.length === 0) {
        throw new Error("Không có từ vựng nào được chọn.");
    }
    // Xác thực thư mục đích có thuộc về người dùng không
    const folder = await prisma_1.prisma.folder.findFirst({
        where: { id: targetFolderId, userId },
    });
    if (!folder) {
        throw new Error("Thư mục đích không tồn tại hoặc không có quyền truy cập.");
    }
    // Xác thực các từ vựng này có thuộc về thư mục của người dùng không
    const validWordsCount = await prisma_1.prisma.word.count({
        where: {
            id: { in: wordIds },
            folder: { userId },
        },
    });
    if (validWordsCount !== wordIds.length) {
        throw new Error("Một số từ vựng không tồn tại hoặc không thuộc quyền sở hữu của bạn.");
    }
    return await (0, tu_vung_repository_1.diChuyenTuVungRepo)(wordIds, targetFolderId);
};
exports.diChuyenTuVungService = diChuyenTuVungService;
/**
 * Service: Bốc từ thông minh (Dynamic Queue)
 * Loại bỏ từ đã thuộc khỏi hàng đợi chính, gối đầu từ mới
 */
const layTuThongMinhService = async (userId, folderId) => {
    const folder = await prisma_1.prisma.folder.findFirst({
        where: { id: folderId, userId },
    });
    if (!folder) {
        throw new Error("Thư mục không tồn tại hoặc không có quyền truy cập.");
    }
    return await (0, tu_vung_repository_1.layTuThongMinhRepo)(userId, folderId, 15);
};
exports.layTuThongMinhService = layTuThongMinhService;
/**
 * Service: Lấy danh sách từ đã thuộc để ôn tập lại
 * Dùng cho chế độ "Review Mastered Words"
 */
const layTuDaThuocService = async (userId, folderId) => {
    const folder = await prisma_1.prisma.folder.findFirst({
        where: { id: folderId, userId },
    });
    if (!folder) {
        throw new Error("Thư mục không tồn tại hoặc không có quyền truy cập.");
    }
    return await (0, tu_vung_repository_1.layTuDaThuocRepo)(userId, folderId);
};
exports.layTuDaThuocService = layTuDaThuocService;
/**
 * Service: Lấy thống kê tiến độ học thư mục
 * Trả về số lượng từ: đã thuộc, đang ôn, chưa học
 */
const layTienDoThuMucService = async (userId, folderId) => {
    const folder = await prisma_1.prisma.folder.findFirst({
        where: { id: folderId, userId },
    });
    if (!folder) {
        throw new Error("Thư mục không tồn tại hoặc không có quyền truy cập.");
    }
    return await (0, tu_vung_repository_1.layTienDoThuMucRepo)(userId, folderId);
};
exports.layTienDoThuMucService = layTienDoThuMucService;
//# sourceMappingURL=tu_vung.service.js.map