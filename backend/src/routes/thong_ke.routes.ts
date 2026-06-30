import { Router } from "express";
import { layThongKeTongHop, layLichSuHocTap, xuLyHeartbeat } from "../controllers/thong_ke.controller";
import { xacThucNguoiDung } from "../middleware/kiem_tra_token";

const router = Router();

router.use(xacThucNguoiDung);

router.get("/", layThongKeTongHop);
router.get("/lich-su", layLichSuHocTap);
router.post("/heartbeat", xuLyHeartbeat);

export default router;
