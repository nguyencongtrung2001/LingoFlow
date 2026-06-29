import { prisma } from "../config/prisma";
import { PartOfSpeech, StudyMode } from "@prisma/client";

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

export const taoNhieuTuVungRepo = async (userId: string, folderId: number, danhSachTu: any[]) => {
  // Chia nhỏ mảng từ vựng thành từng cụm 50 từ để bảo vệ kết nối Database
  const KICH_THUOC_CUM = 50;
  const ketQuaTraVe = [];

  for (let i = 0; i < danhSachTu.length; i += KICH_THUOC_CUM) {
    const cumHienTai = danhSachTu.slice(i, i + KICH_THUOC_CUM);

    // Chạy transaction an toàn cho từng cụm nhỏ
    const cumKetQua = await prisma.$transaction(async (tx) => {
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

export const taoPhienHocRepo = async (
  maNguoiDung: string,
  folderId: number,
  thongTinPhien: {
    mode: StudyMode;
    totalWords: number;
    correctCount: number;
    accuracy: number;
    timeSeconds: number;
    maxStreak: number;
    details: Array<{ wordId: number; isCorrect: boolean; userAnswer?: string; expectedAnswer?: string }>
  }
) => {
  // Chuẩn hóa ngày theo múi giờ Việt Nam để triệt tiêu lỗi lệch Heatmap
  const chuoiNgayVN = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Ho_Chi_Minh" });
  const ngayFormat = new Date(chuoiNgayVN);

  // Kích hoạt Prisma ACID Transaction tổng hợp
  return await prisma.$transaction(async (tx) => {
    
    // 1. Ghi nhận phiên học tổng quan vào bảng StudySession
    const phienHocMoi = await tx.studySession.create({
      data: {
        userId: maNguoiDung,
        folderId: folderId,
        mode: thongTinPhien.mode,
        totalWords: thongTinPhien.totalWords,
        correctCount: thongTinPhien.correctCount,
        accuracy: thongTinPhien.accuracy,
        timeSeconds: thongTinPhien.timeSeconds,
        maxStreak: thongTinPhien.maxStreak,
        // Tiện ích Prisma lồng ghi chi tiết SessionDetail cùng một lúc
        details: {
          create: thongTinPhien.details.map((ct, chiSo) => ({
            wordId: ct.wordId,
            isCorrect: ct.isCorrect,
            userAnswer: ct.userAnswer || null,
            expectedAnswer: ct.expectedAnswer || null,
            orderIndex: chiSo
          }))
        }
      }
    });

    // 2. Vòng lặp cập nhật hoặc khởi tạo tiến độ Leitner cho từng từ
    for (const chiTiet of thongTinPhien.details) {
      // Tìm bản ghi tiến độ hiện tại của User cho từ này
      const tienDoHienTai = await tx.wordProgress.findFirst({
        where: { userId: maNguoiDung, wordId: chiTiet.wordId }
      });

      const hopHienTai = tienDoHienTai ? tienDoHienTai.box : 1;
      let hopMoi = hopHienTai;

      if (chiTiet.isCorrect) {
        // Đúng: Tăng lên 1 cấp (Kịch trần là hộp 5)
        hopMoi = hopHienTai < 5 ? hopHienTai + 1 : 5;
      } else {
        // Sai: Đẩy lùi về hộp 1 học lại từ đầu
        hopMoi = 1;
      }

      // Tạo đối tượng update động tránh truyền undefined cho exactOptionalPropertyTypes
      const updateData: any = {
        box: hopMoi,
        lastResult: chiTiet.isCorrect,
        attempts: { increment: 1 }
      };

      if (chiTiet.isCorrect) {
        updateData.corrects = { increment: 1 };
      }
      if (hopMoi === 5) {
        updateData.learned = true;
      }

      // Thực hiện cập nhật hoặc tạo mới nếu từ chưa có bản ghi tiến độ
      await tx.wordProgress.upsert({
        where: {
          userId_wordId: { userId: maNguoiDung, wordId: chiTiet.wordId }
        },
        update: updateData,
        create: {
          userId: maNguoiDung,
          wordId: chiTiet.wordId,
          box: hopMoi,
          lastResult: chiTiet.isCorrect,
          attempts: 1,
          corrects: chiTiet.isCorrect ? 1 : 0,
          learned: hopMoi === 5
        }
      });
    }

    // 3. Cộng dồn dữ liệu hoạt động hàng ngày phục vụ vẽ Heatmap Card
    await tx.dailyActivity.upsert({
      where: {
        userId_date: { userId: maNguoiDung, date: ngayFormat }
      },
      update: {
        sessionsCount: { increment: 1 },
        wordsStudied: { increment: thongTinPhien.totalWords }
      },
      create: {
        userId: maNguoiDung,
        date: ngayFormat,
        sessionsCount: 1,
        wordsStudied: thongTinPhien.totalWords
      }
    });

    return phienHocMoi;
  });
};

export const layDanhSachTuCuonChieuRepo = async (folderId: number, trang: number) => {
  const SO_TU_MOI_LUOT = 15;
  
  return await prisma.word.findMany({
    where: { folderId },
    orderBy: { createdAt: "asc" },
    skip: (trang - 1) * SO_TU_MOI_LUOT,
    take: SO_TU_MOI_LUOT,
  });
};
