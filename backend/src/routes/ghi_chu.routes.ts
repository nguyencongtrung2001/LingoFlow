import express from "express";
import {
  layBangGhiChuController,
  taoCotMoiController,
  capNhatCotController,
  xoaCotController,
  taoGhiChuController,
  capNhatGhiChuController,
  xoaGhiChuController,
  sapXepLaiController,
} from "../controllers/ghi_chu.controller";
import { xacThucNguoiDung } from "../middleware/kiem_tra_token";

const router = express.Router();

// Tất cả các routes đều yêu cầu đăng nhập
router.use(xacThucNguoiDung);

// Bảng ghi chú (Board)
router.get("/", layBangGhiChuController);

// Cột (Column)
router.post("/cot", taoCotMoiController);
router.put("/cot/:id", capNhatCotController);
router.delete("/cot/:id", xoaCotController);

// Ghi chú (Note)
router.post("/ghi-chu", taoGhiChuController);
router.put("/ghi-chu/:id", capNhatGhiChuController);
router.delete("/ghi-chu/:id", xoaGhiChuController);

// Sắp xếp lại (Drag & Drop Reorder)
router.patch("/sap-xep", sapXepLaiController);

export default router;
