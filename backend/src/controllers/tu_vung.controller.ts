import { Request, Response } from "express";
import {
  layDanhSachTuVungService,
  taoTuVungService,
  taoNhieuTuVungService,
  suaTuVungService,
  xoaTuVungService,
  ghiNhanPhienHocService,
  layDanhSachTuCuonChieuService,
  diChuyenTuVungService,
  layTuThongMinhService,
  layTuDaThuocService,
} from "../services/tu_vung.service";

export const xuLyLayDanhSachTu = async (yeuCau: Request, phanHoi: Response) => {
  try {
    const maNguoiDung = yeuCau.user?.id;
    const folderId = parseInt(yeuCau.params.folderId as string);

    if (!maNguoiDung) return phanHoi.status(401).json({ error: "Chưa được xác thực!" });
    if (isNaN(folderId)) return phanHoi.status(400).json({ error: "ID thư mục không hợp lệ." });

    const danhSach = await layDanhSachTuVungService(folderId, maNguoiDung);
    return phanHoi.status(200).json(danhSach);
  } catch (loi: any) {
    return phanHoi.status(403).json({ error: loi.message });
  }
};

export const xuLyThemTu = async (yeuCau: Request, phanHoi: Response) => {
  try {
    const maNguoiDung = yeuCau.user?.id;
    const { folderId, word, meaning, pos, phonetic, example, image } = yeuCau.body;

    if (!maNguoiDung) return phanHoi.status(401).json({ error: "Chưa được xác thực!" });
    if (!folderId || isNaN(parseInt(folderId))) return phanHoi.status(400).json({ error: "Thư mục không hợp lệ." });
    if (!word || !meaning) return phanHoi.status(400).json({ error: "Thiếu thông tin từ vựng hoặc nghĩa." });

    const tuMoi = await taoTuVungService(maNguoiDung, parseInt(folderId), {
      word, meaning, pos, phonetic, example, image
    });
    return phanHoi.status(201).json(tuMoi);
  } catch (loi: any) {
    return phanHoi.status(403).json({ error: loi.message });
  }
};

export const xuLyThemNhieuTu = async (yeuCau: Request, phanHoi: Response) => {
  try {
    const maNguoiDung = yeuCau.user?.id;
    const { folderId, wordsArray } = yeuCau.body;

    if (!maNguoiDung) return phanHoi.status(401).json({ error: "Chưa được xác thực!" });
    if (!folderId || isNaN(parseInt(folderId))) return phanHoi.status(400).json({ error: "Thư mục không hợp lệ." });
    if (!Array.isArray(wordsArray) || wordsArray.length === 0) return phanHoi.status(400).json({ error: "Danh sách từ vựng trống." });

    const ketQua = await taoNhieuTuVungService(maNguoiDung, parseInt(folderId), wordsArray);
    return phanHoi.status(201).json(ketQua);
  } catch (loi: any) {
    return phanHoi.status(403).json({ error: loi.message });
  }
};

export const xuLyCapNhatTu = async (yeuCau: Request, phanHoi: Response) => {
  try {
    const maNguoiDung = yeuCau.user?.id;
    const wordId = parseInt(yeuCau.params.id as string);
    const data = yeuCau.body;

    if (!maNguoiDung) return phanHoi.status(401).json({ error: "Chưa được xác thực!" });
    if (isNaN(wordId)) return phanHoi.status(400).json({ error: "ID từ vựng không hợp lệ." });

    const tuCapNhat = await suaTuVungService(wordId, maNguoiDung, data);
    return phanHoi.status(200).json(tuCapNhat);
  } catch (loi: any) {
    return phanHoi.status(403).json({ error: loi.message });
  }
};

export const xuLyXoaTu = async (yeuCau: Request, phanHoi: Response) => {
  try {
    const maNguoiDung = yeuCau.user?.id;
    const wordId = parseInt(yeuCau.params.id as string);

    if (!maNguoiDung) return phanHoi.status(401).json({ error: "Chưa được xác thực!" });
    if (isNaN(wordId)) return phanHoi.status(400).json({ error: "ID từ vựng không hợp lệ." });

    await xoaTuVungService(wordId, maNguoiDung);
    return phanHoi.status(200).json({ message: "Xóa từ vựng thành công." });
  } catch (loi: any) {
    return phanHoi.status(403).json({ error: loi.message });
  }
};

export const xuLyLuuPhienHoc = async (yeuCau: Request, phanHoi: Response) => {
  try {
    const maNguoiDung = yeuCau.user?.id;
    const { folderId, mode, totalWords, correctCount, accuracy, timeSeconds, maxStreak, details } = yeuCau.body;

    if (!maNguoiDung) return phanHoi.status(401).json({ error: "Chưa được xác thực!" });
    if (!folderId || isNaN(parseInt(folderId))) return phanHoi.status(400).json({ error: "Thư mục không hợp lệ." });
    if (!mode) return phanHoi.status(400).json({ error: "Thiếu chế độ học tập (mode)." });
    if (!Array.isArray(details) || details.length === 0) return phanHoi.status(400).json({ error: "Danh sách chi tiết phiên học trống." });

    const ketQua = await ghiNhanPhienHocService(maNguoiDung, parseInt(folderId), {
      mode,
      totalWords: parseInt(totalWords) || details.length,
      correctCount: parseInt(correctCount) || 0,
      accuracy: parseFloat(accuracy) || 0,
      timeSeconds: parseInt(timeSeconds) || 0,
      maxStreak: parseInt(maxStreak) || 0,
      details,
    });

    return phanHoi.status(201).json(ketQua);
  } catch (loi: any) {
    return phanHoi.status(403).json({ error: loi.message });
  }
};

export const xuLyLayTuCuonChieu = async (yeuCau: Request, phanHoi: Response) => {
  try {
    const maNguoiDung = yeuCau.user?.id;
    const folderId = parseInt(String(yeuCau.params.folderId || "0"), 10);
    const trang = parseInt(typeof yeuCau.query.page === "string" ? yeuCau.query.page : "1", 10) || 1;

    if (!maNguoiDung) return phanHoi.status(401).json({ error: "Chưa được xác thực!" });
    if (isNaN(folderId)) {
      return phanHoi.status(400).json({ error: "Mã thư mục không hợp lệ." });
    }

    const danhSachTu = await layDanhSachTuCuonChieuService(maNguoiDung, folderId, trang);
    return phanHoi.status(200).json(danhSachTu);
  } catch (loi: any) {
    return phanHoi.status(403).json({ error: loi.message });
  }
};

export const xuLyDiChuyenTu = async (yeuCau: Request, phanHoi: Response) => {
  try {
    const maNguoiDung = yeuCau.user?.id;
    const { wordIds, targetFolderId } = yeuCau.body;

    if (!maNguoiDung) return phanHoi.status(401).json({ error: "Chưa được xác thực!" });
    if (!Array.isArray(wordIds) || wordIds.length === 0) {
      return phanHoi.status(400).json({ error: "Danh sách từ vựng không hợp lệ." });
    }
    if (!targetFolderId || isNaN(parseInt(targetFolderId))) {
      return phanHoi.status(400).json({ error: "Thư mục đích không hợp lệ." });
    }

    const ketQua = await diChuyenTuVungService(maNguoiDung, wordIds, parseInt(targetFolderId));
    return phanHoi.status(200).json({ message: "Di chuyển thành công.", count: ketQua.count });
  } catch (loi: any) {
    return phanHoi.status(403).json({ error: loi.message });
  }
};

export const xuLyLayTuThongMinh = async (yeuCau: Request, phanHoi: Response) => {
  try {
    const maNguoiDung = yeuCau.user?.id;
    const folderId = parseInt(String(yeuCau.params.folderId || "0"), 10);

    if (!maNguoiDung) return phanHoi.status(401).json({ error: "Chưa được xác thực!" });
    if (isNaN(folderId)) return phanHoi.status(400).json({ error: "Mã thư mục không hợp lệ." });

    const ketQua = await layTuThongMinhService(maNguoiDung, folderId);
    return phanHoi.status(200).json(ketQua);
  } catch (loi: any) {
    return phanHoi.status(403).json({ error: loi.message });
  }
};

export const xuLyLayTuDaThuoc = async (yeuCau: Request, phanHoi: Response) => {
  try {
    const maNguoiDung = yeuCau.user?.id;
    const folderId = parseInt(String(yeuCau.params.folderId || "0"), 10);

    if (!maNguoiDung) return phanHoi.status(401).json({ error: "Chưa được xác thực!" });
    if (isNaN(folderId)) return phanHoi.status(400).json({ error: "Mã thư mục không hợp lệ." });

    const danhSach = await layTuDaThuocService(maNguoiDung, folderId);
    return phanHoi.status(200).json(danhSach);
  } catch (loi: any) {
    return phanHoi.status(403).json({ error: loi.message });
  }
};
