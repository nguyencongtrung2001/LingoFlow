import { Request, Response } from "express";
import {
  layDanhSachTuVungService,
  taoTuVungService,
  suaTuVungService,
  xoaTuVungService,
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
