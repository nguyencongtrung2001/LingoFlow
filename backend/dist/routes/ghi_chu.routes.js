"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ghi_chu_controller_1 = require("../controllers/ghi_chu.controller");
const kiem_tra_token_1 = require("../middleware/kiem_tra_token");
const router = express_1.default.Router();
// Tất cả các routes đều yêu cầu đăng nhập
router.use(kiem_tra_token_1.xacThucNguoiDung);
// Bảng ghi chú (Board)
router.get("/", ghi_chu_controller_1.layBangGhiChuController);
// Cột (Column)
router.post("/cot", ghi_chu_controller_1.taoCotMoiController);
router.put("/cot/:id", ghi_chu_controller_1.capNhatCotController);
router.delete("/cot/:id", ghi_chu_controller_1.xoaCotController);
// Ghi chú (Note)
router.post("/ghi-chu", ghi_chu_controller_1.taoGhiChuController);
router.put("/ghi-chu/:id", ghi_chu_controller_1.capNhatGhiChuController);
router.delete("/ghi-chu/:id", ghi_chu_controller_1.xoaGhiChuController);
// Sắp xếp lại (Drag & Drop Reorder)
router.patch("/sap-xep", ghi_chu_controller_1.sapXepLaiController);
exports.default = router;
//# sourceMappingURL=ghi_chu.routes.js.map