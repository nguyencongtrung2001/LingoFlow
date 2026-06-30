import { Router } from "express";
import { layThongKeTongHop, layLichSuHocTap } from "../controllers/thong_ke.controller";
import { xacThucNguoiDung } from "../middleware/kiem_tra_token";

const router = Router();

router.use(xacThucNguoiDung);

router.get("/", layThongKeTongHop);
router.get("/lich-su", layLichSuHocTap);

export default router;
