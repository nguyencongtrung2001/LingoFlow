"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.capNhatTrangThaiNguoiDung = exports.capNhatVaiTroNguoiDung = exports.layDanhSachNguoiDungWithStats = void 0;
const prisma_1 = require("../config/prisma");
const layDanhSachNguoiDungWithStats = async () => {
    return prisma_1.prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
            role: true,
            isActive: true,
            createdAt: true,
            _count: {
                select: {
                    folders: true,
                    studySessions: true,
                },
            },
            folders: {
                select: {
                    _count: {
                        select: { words: true },
                    },
                },
            },
            activities: {
                select: {
                    studyTimeSeconds: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
exports.layDanhSachNguoiDungWithStats = layDanhSachNguoiDungWithStats;
const capNhatVaiTroNguoiDung = async (id, role) => {
    return prisma_1.prisma.user.update({
        where: { id },
        data: { role },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });
};
exports.capNhatVaiTroNguoiDung = capNhatVaiTroNguoiDung;
const capNhatTrangThaiNguoiDung = async (id, isActive) => {
    return prisma_1.prisma.user.update({
        where: { id },
        data: { isActive },
        select: {
            id: true,
            name: true,
            email: true,
            isActive: true,
        },
    });
};
exports.capNhatTrangThaiNguoiDung = capNhatTrangThaiNguoiDung;
//# sourceMappingURL=quan_tri.repository.js.map