import { Request, Response } from "express";
import { layThongKeTongHopRepo, layLichSuHocTapRepo, ghiNhanHeartbeatRepo } from "../repositories/thong_ke.repository";

export const layThongKeTongHop = async (req: Request, res: Response) => {
  try {
    const maNguoiDung = req.user?.id;
    if (!maNguoiDung) {
      return res.status(401).json({ error: "Chưa được xác thực!" });
    }

    const thongKe = await layThongKeTongHopRepo(maNguoiDung);
    return res.status(200).json(thongKe);
  } catch (error: any) {
    console.error("Lỗi khi lấy thống kê tổng hợp:", error);
    return res.status(500).json({ error: "Đã xảy ra lỗi hệ thống." });
  }
};

export const layLichSuHocTap = async (req: Request, res: Response) => {
  try {
    const maNguoiDung = req.user?.id;
    if (!maNguoiDung) {
      return res.status(401).json({ error: "Chưa được xác thực!" });
    }

    const lichSu = await layLichSuHocTapRepo(maNguoiDung);
    return res.status(200).json(lichSu);
  } catch (error: any) {
    console.error("Lỗi khi lấy lịch sử học tập:", error);
    return res.status(500).json({ error: "Đã xảy ra lỗi hệ thống." });
  }
};

export const xuLyHeartbeat = async (req: Request, res: Response) => {
  try {
    const maNguoiDung = req.user?.id;
    if (!maNguoiDung) {
      return res.status(401).json({ error: "Chưa được xác thực!" });
    }

    const { seconds } = req.body;
    if (typeof seconds !== "number" || seconds <= 0) {
      return res.status(400).json({ error: "Số giây không hợp lệ!" });
    }

    await ghiNhanHeartbeatRepo(maNguoiDung, seconds);
    return res.status(200).json({ success: true, message: "Ghi nhận heartbeat thành công." });
  } catch (error: any) {
    console.error("Lỗi khi xử lý heartbeat:", error);
    return res.status(500).json({ error: "Đã xảy ra lỗi hệ thống." });
  }
};
