"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xoaThuMucRepo = exports.capNhatThuMucRepo = exports.taoThuMucRepo = exports.layThuMucChiTietRepo = exports.layDanhSachThuMucRepo = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const layDanhSachThuMucRepo = async (userId) => {
    return await prisma.folder.findMany({
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
    return await prisma.folder.findFirst({
        where: { id, userId },
        include: {
            words: {
                orderBy: { createdAt: "desc" },
            },
        },
    });
};
exports.layThuMucChiTietRepo = layThuMucChiTietRepo;
const taoThuMucRepo = async (userId, name, description) => {
    return await prisma.folder.create({
        data: {
            name,
            description: description || null,
            userId,
        },
    });
};
exports.taoThuMucRepo = taoThuMucRepo;
const capNhatThuMucRepo = async (id, userId, data) => {
    return await prisma.folder.update({
        where: { id },
        data,
    });
};
exports.capNhatThuMucRepo = capNhatThuMucRepo;
const xoaThuMucRepo = async (id, userId) => {
    return await prisma.folder.delete({
        where: { id },
    });
};
exports.xoaThuMucRepo = xoaThuMucRepo;
//# sourceMappingURL=thu_muc.repository.js.map