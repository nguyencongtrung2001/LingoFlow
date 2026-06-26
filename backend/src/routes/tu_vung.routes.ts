import { Router } from "express";
import { 
  xuLyLayDanhSachTu, 
  xuLyThemTu, 
  xuLyThemNhieuTu,
  xuLyCapNhatTu, 
  xuLyXoaTu 
} from "../controllers/tu_vung.controller";
import { xacThucNguoiDung } from "../middleware/kiem_tra_token";

const router = Router();

// Áp dụng lớp bảo vệ token cho tất cả các API nghiệp vụ từ vựng
router.use(xacThucNguoiDung);

router.get("/thu-muc/:folderId", xuLyLayDanhSachTu);
router.post("/", xuLyThemTu);
router.post("/batch", xuLyThemNhieuTu);
router.put("/:id", xuLyCapNhatTu);
router.delete("/:id", xuLyXoaTu);

export default router;
