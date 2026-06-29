import { Router } from "express";
import { layThongKeTongHop } from "../controllers/thong_ke.controller";
import { xacThucNguoiDung } from "../middleware/kiem_tra_token";

const router = Router();

router.use(xacThucNguoiDung);

router.get("/", layThongKeTongHop);

export default router;
