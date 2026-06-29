"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xoaThuMucRepo = exports.capNhatThuMucRepo = exports.taoThuMucRepo = exports.layThuMucChiTietQuaNameRepo = exports.layThuMucChiTietRepo = exports.layDanhSachThuMucRepo = void 0;
const prisma_1 = require("../config/prisma");
const layDanhSachThuMucRepo = async (userId) => {
    return await prisma_1.prisma.folder.findMany({
        where: { userId },
        include: {
            _count: {
                select: { words: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });
};
exports.layDanhSachThuMucRepo = layDanhSachThuMucRepo;
const layThuMucChiTietRepo = async (id, userId) => {
    return await prisma_1.prisma.folder.findFirst({
        where: { id, userId },
        include: {
            words: {
                orderBy: { createdAt: "desc" },
            },
        },
    });
};
exports.layThuMucChiTietRepo = layThuMucChiTietRepo;
const layThuMucChiTietQuaNameRepo = async (name, userId) => {
    return await prisma_1.prisma.folder.findFirst({
        where: { name, userId },
        include: {
            words: {
                orderBy: { createdAt: "desc" },
            },
        },
    });
};
exports.layThuMucChiTietQuaNameRepo = layThuMucChiTietQuaNameRepo;
const taoThuMucRepo = async (userId, name, description) => {
    return await prisma_1.prisma.folder.create({
        data: {
            name,
            description: description || null,
            userId,
        },
    });
};
exports.taoThuMucRepo = taoThuMucRepo;
const capNhatThuMucRepo = async (id, userId, data) => {
    return await prisma_1.prisma.folder.update({
        where: { id },
        data,
    });
};
exports.capNhatThuMucRepo = capNhatThuMucRepo;
const xoaThuMucRepo = async (id, userId) => {
    return await prisma_1.prisma.folder.delete({
        where: { id },
    });
};
exports.xoaThuMucRepo = xoaThuMucRepo;
//# sourceMappingURL=thu_muc.repository.js.map