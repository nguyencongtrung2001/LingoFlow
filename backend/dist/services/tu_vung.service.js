"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xoaTuVungService = exports.suaTuVungService = exports.taoNhieuTuVungService = exports.taoTuVungService = exports.layDanhSachTuVungService = void 0;
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
    if (cloneData.image !== undefined) {
        cloneData.image = await (0, cloudinary_upload_1.uploadImageFromUrl)(cloneData.image, "lingoflow/words", `word_${userId}`);
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
    return await (0, tu_vung_repository_1.xoaTuVungRepo)(wordId);
};
exports.xoaTuVungService = xoaTuVungService;
//# sourceMappingURL=tu_vung.service.js.map