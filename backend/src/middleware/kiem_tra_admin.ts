import { Request, Response, NextFunction } from "express";

export const xacThucAdmin = (
  yeuCau: Request,
  phanHoi: Response,
  tiepTuc: NextFunction
) => {
  if (yeuCau.user?.role !== "ADMIN") {
    return phanHoi.status(403).json({ error: "Quyền truy cập bị từ chối! Chỉ dành cho Quản trị viên." });
  }
  tiepTuc();
};
