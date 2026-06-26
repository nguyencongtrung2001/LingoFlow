import { Router } from "express";
import {
  xuLyDangKy,
  xuLyDangNhap,
  xuLyDangXuat,
  layThongTinCaNhan,
  xuLyCapNhatAvatar,
} from "../controllers/xac_thuc.controller";
import { xacThucNguoiDung } from "../middleware/kiem_tra_token";
import { taiLenBoNhoTam } from "../middleware/xu_ly_file";

const router = Router();

router.post("/dang-ky", xuLyDangKy);
router.post("/dang-nhap", xuLyDangNhap);
router.post("/dang-xuat", xuLyDangXuat);

// Các API cần xác thực
router.get("/thong-tin", xacThucNguoiDung, layThongTinCaNhan);
router.post("/cap-nhat-avatar", xacThucNguoiDung, taiLenBoNhoTam.single("avatar"), xuLyCapNhatAvatar);

export default router;
