import { Router } from "express";
import {
  layDanhSachNguoiDung,
  capNhatVaiTro,
  capNhatTrangThai,
} from "../controllers/quan_tri.controller";
import { xacThucNguoiDung } from "../middleware/kiem_tra_token";
import { xacThucAdmin } from "../middleware/kiem_tra_admin";

const router = Router();

// Toàn bộ API quản trị yêu cầu đăng nhập và phải là ADMIN
router.use(xacThucNguoiDung);
router.use(xacThucAdmin);

router.get("/users", layDanhSachNguoiDung);
router.patch("/users/:id/role", capNhatVaiTro);
router.patch("/users/:id/trang-thai", capNhatTrangThai);

export default router;
