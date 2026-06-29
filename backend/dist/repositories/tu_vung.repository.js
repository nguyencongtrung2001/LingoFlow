"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xoaTuVungRepo = exports.suaTuVungRepo = exports.taoNhieuTuVungRepo = exports.taoTuVungRepo = exports.layDanhSachTuVungRepo = void 0;
const prisma_1 = require("../config/prisma");
const client_1 = require("@prisma/client");
const layDanhSachTuVungRepo = async (folderId) => {
    return await prisma_1.prisma.word.findMany({
        where: { folderId },
        orderBy: { createdAt: "desc" },
    });
};
exports.layDanhSachTuVungRepo = layDanhSachTuVungRepo;
const taoTuVungRepo = async (userId, folderId, data) => {
    return await prisma_1.prisma.$transaction(async (tx) => {
        // 1. Tạo từ vựng mới
        const tuMoi = await tx.word.create({
            data: {
                word: data.word,
                meaning: data.meaning,
                phonetic: data.phonetic || null,
                pos: data.pos || client_1.PartOfSpeech.NOUN,
                example: data.example || null,
                image: data.image || null,
                folderId,
            },
        });
        // 2. Kích hoạt hộp Leitner 1 ngay lập tức cho từ này
        await tx.wordProgress.create({
            data: {
                userId,
                wordId: tuMoi.id,
                box: 1,
            },
        });
        return tuMoi;
    });
};
exports.taoTuVungRepo = taoTuVungRepo;
const taoNhieuTuVungRepo = async (userId, folderId, danhSachTu) => {
    // Chia nhỏ mảng từ vựng thành từng cụm 50 từ để bảo vệ kết nối Database
    const KICH_THUOC_CUM = 50;
    const ketQuaTraVe = [];
    for (let i = 0; i < danhSachTu.length; i += KICH_THUOC_CUM) {
        const cumHienTai = danhSachTu.slice(i, i + KICH_THUOC_CUM);
        // Chạy transaction an toàn cho từng cụm nhỏ
        const cumKetQua = await prisma_1.prisma.$transaction(async (tx) => {
            const cumTuMoi = [];
            for (const tu of cumHienTai) {
                // 1. Tạo từ vựng
                const tuVungMoi = await tx.word.create({
                    data: {
                        word: tu.Word.trim(),
                        meaning: tu.Meaning.trim(),
                        phonetic: tu.Phonetic ? tu.Phonetic.toString().trim() : null,
                        pos: tu.Pos ? tu.Pos.toString().trim() : "NOUN",
                        example: tu.Example ? tu.Example.toString().trim() : null,
                        folderId: folderId
                    }
                });
                // 2. Kích hoạt Leitner Box 1 đồng thời
                await tx.wordProgress.create({
                    data: {
                        userId: userId,
                        wordId: tuVungMoi.id,
                        box: 1
                    }
                });
                cumTuMoi.push(tuVungMoi);
            }
            return cumTuMoi;
        });
        ketQuaTraVe.push(...cumKetQua);
    }
    return ketQuaTraVe;
};
exports.taoNhieuTuVungRepo = taoNhieuTuVungRepo;
const suaTuVungRepo = async (wordId, data) => {
    return await prisma_1.prisma.word.update({
        where: { id: wordId },
        data: {
            word: data.word,
            meaning: data.meaning,
            phonetic: data.phonetic || null,
            pos: data.pos,
            example: data.example || null,
            image: data.image || null,
        },
    });
};
exports.suaTuVungRepo = suaTuVungRepo;
const xoaTuVungRepo = async (wordId) => {
    return await prisma_1.prisma.word.delete({
        where: { id: wordId },
    });
};
exports.xoaTuVungRepo = xoaTuVungRepo;
//# sourceMappingURL=tu_vung.repository.js.map