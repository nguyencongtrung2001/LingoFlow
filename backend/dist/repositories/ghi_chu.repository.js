"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sapXepLaiRepo = exports.layPositionGhiChuLonNhatRepo = exports.timGhiChuTheoIdRepo = exports.xoaGhiChuRepo = exports.capNhatGhiChuRepo = exports.taoGhiChuRepo = exports.layPositionCotLonNhatRepo = exports.timCotTheoIdRepo = exports.xoaCotRepo = exports.capNhatCotRepo = exports.taoCotMoiRepo = exports.layBangGhiChuRepo = void 0;
const prisma_1 = require("../config/prisma");
// Lấy toàn bộ bảng ghi chú (Cột + Notes) của một User
const layBangGhiChuRepo = async (userId) => {
    return await prisma_1.prisma.noteColumn.findMany({
        where: { userId },
        include: {
            notes: {
                orderBy: { position: "asc" },
            },
        },
        orderBy: { position: "asc" },
    });
};
exports.layBangGhiChuRepo = layBangGhiChuRepo;
// Tạo cột mới
const taoCotMoiRepo = async (userId, title, position) => {
    return await prisma_1.prisma.noteColumn.create({
        data: { title, position, userId },
        include: { notes: true },
    });
};
exports.taoCotMoiRepo = taoCotMoiRepo;
// Cập nhật tên cột
const capNhatCotRepo = async (id, title) => {
    return await prisma_1.prisma.noteColumn.update({
        where: { id },
        data: { title },
    });
};
exports.capNhatCotRepo = capNhatCotRepo;
// Xóa cột (cascade xóa notes)
const xoaCotRepo = async (id) => {
    return await prisma_1.prisma.noteColumn.delete({
        where: { id },
    });
};
exports.xoaCotRepo = xoaCotRepo;
// Tìm cột theo ID (kiểm tra quyền sở hữu)
const timCotTheoIdRepo = async (id) => {
    return await prisma_1.prisma.noteColumn.findUnique({
        where: { id },
        select: { id: true, userId: true },
    });
};
exports.timCotTheoIdRepo = timCotTheoIdRepo;
// Lấy position lớn nhất của cột trong bảng của user
const layPositionCotLonNhatRepo = async (userId) => {
    const result = await prisma_1.prisma.noteColumn.findFirst({
        where: { userId },
        orderBy: { position: "desc" },
        select: { position: true },
    });
    return result?.position ?? -1;
};
exports.layPositionCotLonNhatRepo = layPositionCotLonNhatRepo;
// Tạo ghi chú mới
const taoGhiChuRepo = async (columnId, title, content, position) => {
    return await prisma_1.prisma.note.create({
        data: { title, content, position, columnId },
    });
};
exports.taoGhiChuRepo = taoGhiChuRepo;
// Cập nhật ghi chú (title + content)
const capNhatGhiChuRepo = async (id, data) => {
    return await prisma_1.prisma.note.update({
        where: { id },
        data,
    });
};
exports.capNhatGhiChuRepo = capNhatGhiChuRepo;
// Xóa ghi chú
const xoaGhiChuRepo = async (id) => {
    return await prisma_1.prisma.note.delete({
        where: { id },
    });
};
exports.xoaGhiChuRepo = xoaGhiChuRepo;
// Tìm ghi chú theo ID (kèm thông tin cột để kiểm tra quyền)
const timGhiChuTheoIdRepo = async (id) => {
    return await prisma_1.prisma.note.findUnique({
        where: { id },
        include: {
            column: {
                select: { userId: true },
            },
        },
    });
};
exports.timGhiChuTheoIdRepo = timGhiChuTheoIdRepo;
// Lấy position lớn nhất của ghi chú trong một cột
const layPositionGhiChuLonNhatRepo = async (columnId) => {
    const result = await prisma_1.prisma.note.findFirst({
        where: { columnId },
        orderBy: { position: "desc" },
        select: { position: true },
    });
    return result?.position ?? -1;
};
exports.layPositionGhiChuLonNhatRepo = layPositionGhiChuLonNhatRepo;
// Bulk update positions (Drag & Drop) — dùng Transaction đơn lẻ
const sapXepLaiRepo = async (updates) => {
    const operations = updates.map((item) => prisma_1.prisma.note.update({
        where: { id: item.id },
        data: { position: item.position, columnId: item.columnId },
    }));
    return await prisma_1.prisma.$transaction(operations);
};
exports.sapXepLaiRepo = sapXepLaiRepo;
//# sourceMappingURL=ghi_chu.repository.js.map