"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.capNhatAvatarNguoiDung = exports.taoNguoiDungMoi = exports.timNguoiDungTheoId = exports.timNguoiDungTheoEmail = void 0;
const prisma_1 = require("../config/prisma");
const timNguoiDungTheoEmail = async (email) => {
    return prisma_1.prisma.user.findUnique({
        where: { email },
    });
};
exports.timNguoiDungTheoEmail = timNguoiDungTheoEmail;
const timNguoiDungTheoId = async (id) => {
    return prisma_1.prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
            role: true,
            createdAt: true,
        },
    });
};
exports.timNguoiDungTheoId = timNguoiDungTheoId;
const taoNguoiDungMoi = async (thongTinNguoiDung) => {
    return prisma_1.prisma.user.create({
        data: thongTinNguoiDung,
    });
};
exports.taoNguoiDungMoi = taoNguoiDungMoi;
const capNhatAvatarNguoiDung = async (id, urlAnh) => {
    return prisma_1.prisma.user.update({
        where: { id },
        data: { avatar: urlAnh },
        select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
            role: true,
        },
    });
};
exports.capNhatAvatarNguoiDung = capNhatAvatarNguoiDung;
//# sourceMappingURL=xac_thuc.repository.js.map