import express from "express";
import {
  danhSachThuMuc,
  chiTietThuMuc,
  taoMoiThuMuc,
  suaThuMuc,
  xoaBoThuMuc,
} from "../controllers/thu_muc.controller";
import { xacThucNguoiDung } from "../middleware/kiem_tra_token";

const router = express.Router();

// Tất cả các routes đều yêu cầu đăng nhập
router.use(xacThucNguoiDung);

router.get("/", danhSachThuMuc);
router.post("/", taoMoiThuMuc);
router.get("/:id", chiTietThuMuc);
router.put("/:id", suaThuMuc);
router.delete("/:id", xoaBoThuMuc);

export default router;
