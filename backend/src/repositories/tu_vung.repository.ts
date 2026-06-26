import { prisma } from "../config/prisma";
import { PartOfSpeech } from "@prisma/client";

export const layDanhSachTuVungRepo = async (folderId: number) => {
  return await prisma.word.findMany({
    where: { folderId },
    orderBy: { createdAt: "desc" },
  });
};

export const taoTuVungRepo = async (userId: string, folderId: number, data: any) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Tạo từ vựng mới
    const tuMoi = await tx.word.create({
      data: {
        word: data.word,
        meaning: data.meaning,
        phonetic: data.phonetic || null,
        pos: data.pos || PartOfSpeech.NOUN,
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

export const suaTuVungRepo = async (wordId: number, data: any) => {
  return await prisma.word.update({
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

export const xoaTuVungRepo = async (wordId: number) => {
  return await prisma.word.delete({
    where: { id: wordId },
  });
};
