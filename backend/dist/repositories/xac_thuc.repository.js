"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.capNhatAvatarNguoiDung = exports.taoNguoiDungMoi = exports.timNguoiDungTheoId = exports.timNguoiDungTheoEmail = void 0;
const client_1 = require("@prisma/client");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
// Khởi tạo Database Connection ở tầng Repository
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
const timNguoiDungTheoEmail = async (email) => {
    return prisma.user.findUnique({
        where: { email },
    });
};
exports.timNguoiDungTheoEmail = timNguoiDungTheoEmail;
const timNguoiDungTheoId = async (id) => {
    return prisma.user.findUnique({
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
    return prisma.user.create({
        data: thongTinNguoiDung,
    });
};
exports.taoNguoiDungMoi = taoNguoiDungMoi;
const capNhatAvatarNguoiDung = async (id, urlAnh) => {
    return prisma.user.update({
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