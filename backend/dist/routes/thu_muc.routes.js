"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const thu_muc_controller_1 = require("../controllers/thu_muc.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
// Tất cả các routes đều yêu cầu đăng nhập
router.use(auth_middleware_1.kiemTraXacThuc);
router.get("/", thu_muc_controller_1.danhSachThuMuc);
router.post("/", thu_muc_controller_1.taoMoiThuMuc);
router.get("/:id", thu_muc_controller_1.chiTietThuMuc);
router.put("/:id", thu_muc_controller_1.suaThuMuc);
router.delete("/:id", thu_muc_controller_1.xoaBoThuMuc);
exports.default = router;
//# sourceMappingURL=thu_muc.routes.js.map