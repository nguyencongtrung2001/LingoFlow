import { Router } from "express";
import { 
  xuLyLayDanhSachTu, 
  xuLyThemTu, 
  xuLyThemNhieuTu,
  xuLyCapNhatTu, 
  xuLyXoaTu,
  xuLyLuuPhienHoc,
  xuLyLayTuCuonChieu
} from "../controllers/tu_vung.controller";
import { xacThucNguoiDung } from "../middleware/kiem_tra_token";

const router = Router();

// Áp dụng lớp bảo vệ token cho tất cả các API nghiệp vụ từ vựng
router.use(xacThucNguoiDung);

router.get("/thu-muc/:folderId", xuLyLayDanhSachTu);
router.get("/cuon-chieu/:folderId", xuLyLayTuCuonChieu);
router.post("/", xuLyThemTu);
router.post("/batch", xuLyThemNhieuTu);
router.post("/phien-hoc", xuLyLuuPhienHoc);
router.put("/:id", xuLyCapNhatTu);
router.delete("/:id", xuLyXoaTu);

export default router;
