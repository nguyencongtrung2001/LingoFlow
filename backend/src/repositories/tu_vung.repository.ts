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
        useWord: data.useWord || null,
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
            useWord: tu.UseWord ? tu.UseWord.toString().trim() : null,
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
      useWord: data.useWord !== undefined ? (data.useWord || null) : undefined,
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

      // "learned" dựa trên tổng corrects tích lũy (>=7), không dựa trên box
      const tongDungSauCapNhat = (tienDoHienTai?.corrects ?? 0) + (chiTiet.isCorrect ? 1 : 0);
      updateData.learned = tongDungSauCapNhat >= 7;

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
          learned: false // Mới tạo, corrects tối đa = 1, chưa thể >= 7
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

export const diChuyenTuVungRepo = async (wordIds: number[], targetFolderId: number) => {
  return await prisma.word.updateMany({
    where: {
      id: { in: wordIds },
    },
    data: {
      folderId: targetFolderId,
    },
  });
};

/**
 * Thuật toán Hàng đợi Động (Dynamic Queue) — Bốc từ thông minh
 * 
 * Corrects-based Mastery:
 *   - corrects 0, attempts 0: Chưa học (chưa từng ôn)
 *   - corrects 1-6 (attempts > 0): Đang ôn (đã bắt đầu học, chưa thuộc)
 *   - corrects >= 7: Đã thuộc (loại khỏi queue chính)
 * 
 * Quy trình (FIX: Ưu tiên tuyệt đối từ đang ôn):
 * 1. Lấy từ ĐANG ÔN (attempts > 0, corrects < 7) — ĐÂY LÀ ƯU TIÊN SỐ 1
 * 2. Nếu chưa đủ 15, lấp bằng từ CHƯA HỌC (attempts = 0, corrects = 0)
 * 3. Nếu chưa đủ, lấy từ MỚI TINH (chưa có WordProgress)
 * 4. Nếu vẫn chưa đủ, lấy từ ĐÃ THUỘC (corrects >= 7) để bù
 */
export const layTuThongMinhRepo = async (userId: string, folderId: number, limit: number = 15) => {
  // 1. Ưu tiên SỐ 1: Từ ĐANG ÔN (đã bắt đầu học, chưa thuộc)
  const tuDangOn = await prisma.wordProgress.findMany({
    where: {
      userId,
      word: { folderId },
      corrects: { lt: 7 },
      attempts: { gt: 0 },  // ← KEY FIX: chỉ lấy từ ĐÃ BẮT ĐẦU ÔN
    },
    include: { word: true },
    orderBy: [
      { corrects: "asc" },   // Ưu tiên từ yếu nhất
      { wordId: "asc" },     // Deterministic: đảm bảo cùng query = cùng kết quả
    ],
    take: limit,
  });

  const soTuDangOn = tuDangOn.length;
  let soSlotTrong = Math.max(0, limit - soTuDangOn);

  // 2. Lấp slot trống bằng từ CHƯA HỌC (có WordProgress nhưng chưa từng ôn)
  let tuChuaHoc: any[] = [];
  if (soSlotTrong > 0) {
    tuChuaHoc = await prisma.wordProgress.findMany({
      where: {
        userId,
        word: { folderId },
        attempts: 0,        // Chưa từng ôn lần nào
        corrects: 0,
      },
      include: { word: true },
      orderBy: { wordId: "asc" },  // Deterministic: luôn lấy cùng batch
      take: soSlotTrong,
    });
    soSlotTrong = Math.max(0, soSlotTrong - tuChuaHoc.length);
  }

  // 3. Nếu vẫn thiếu, lấy từ MỚI TINH (chưa có bản ghi WordProgress)
  let tuMoiTinh: any[] = [];
  if (soSlotTrong > 0) {
    tuMoiTinh = await prisma.word.findMany({
      where: {
        folderId,
        progress: { none: { userId } },
      },
      orderBy: { createdAt: "asc" },
      take: soSlotTrong,
    });
    soSlotTrong = Math.max(0, soSlotTrong - tuMoiTinh.length);
  }

  // 4. Backup cuối: lấy từ ĐÃ THUỘC (corrects >= 7) nếu vẫn chưa đủ
  let tuDaThuocBu: any[] = [];
  if (soSlotTrong > 0) {
    const tuDaThuocProgress = await prisma.wordProgress.findMany({
      where: {
        userId,
        word: { folderId },
        corrects: { gte: 7 },
      },
      include: { word: true },
      orderBy: { updatedAt: "asc" },
      take: soSlotTrong,
    });
    tuDaThuocBu = tuDaThuocProgress.map((p) => p.word);
  }

  // 5. Trộn dữ liệu: [đang ôn] + [chưa học] + [mới tinh] + [đã thuộc bù]
  return {
    words: [
      ...tuDangOn.map((p) => p.word),
      ...tuChuaHoc.map((p) => p.word),
      ...tuMoiTinh,
      ...tuDaThuocBu,
    ],
    meta: {
      dangOn: soTuDangOn,
      chuaHoc: tuChuaHoc.length,
      moiTinh: tuMoiTinh.length,
      daThuocBu: tuDaThuocBu.length,
    },
  };
};

/**
 * Lấy danh sách từ ĐÃ THUỘC (corrects >= 7) để ôn tập lại
 * Dùng cho chế độ "Ôn tập từ đã thuộc" (Review Mastered Words)
 */
export const layTuDaThuocRepo = async (userId: string, folderId: number) => {
  const daThuoc = await prisma.wordProgress.findMany({
    where: {
      userId,
      word: { folderId },
      corrects: { gte: 7 },
    },
    include: { word: true },
    orderBy: { updatedAt: "asc" }, // Ưu tiên từ lâu chưa ôn nhất
  });

  return daThuoc.map((p) => p.word);
};

/**
 * Lấy thống kê tiến độ cho một thư mục:
 *   - daThuoc: corrects >= 7
 *   - dangOn: attempts > 0 AND corrects < 7
 *   - chuaHoc: attempts = 0 (hoặc chưa có WordProgress)
 */
export const layTienDoThuMucRepo = async (userId: string, folderId: number) => {
  // Đếm tổng số từ trong thư mục
  const tongSoTu = await prisma.word.count({ where: { folderId } });

  // Đếm từ ĐÃ THUỘC (corrects >= 7)
  const daThuoc = await prisma.wordProgress.count({
    where: {
      userId,
      word: { folderId },
      corrects: { gte: 7 },
    },
  });

  // Đếm từ ĐANG ÔN (attempts > 0, corrects < 7)
  const dangOn = await prisma.wordProgress.count({
    where: {
      userId,
      word: { folderId },
      attempts: { gt: 0 },
      corrects: { lt: 7 },
    },
  });

  // Chưa học = tổng - đã thuộc - đang ôn
  const chuaHoc = Math.max(0, tongSoTu - daThuoc - dangOn);

  return { tongSoTu, daThuoc, dangOn, chuaHoc };
};

