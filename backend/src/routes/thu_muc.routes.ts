import express from "express";
import {
  danhSachThuMuc,
  chiTietThuMuc,
  taoMoiThuMuc,
  suaThuMuc,
  xoaBoThuMuc,
} from "../controllers/thu_muc.controller";
import { kiemTraXacThuc } from "../middlewares/auth.middleware";

const router = express.Router();

// Tất cả các routes đều yêu cầu đăng nhập
router.use(kiemTraXacThuc);

router.get("/", danhSachThuMuc);
router.post("/", taoMoiThuMuc);
router.get("/:id", chiTietThuMuc);
router.put("/:id", suaThuMuc);
router.delete("/:id", xoaBoThuMuc);

export default router;
