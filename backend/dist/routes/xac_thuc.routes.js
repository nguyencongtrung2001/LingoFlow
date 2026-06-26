"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const xac_thuc_controller_1 = require("../controllers/xac_thuc.controller");
const kiem_tra_token_1 = require("../middleware/kiem_tra_token");
const xu_ly_file_1 = require("../middleware/xu_ly_file");
const router = (0, express_1.Router)();
router.post("/dang-ky", xac_thuc_controller_1.xuLyDangKy);
router.post("/dang-nhap", xac_thuc_controller_1.xuLyDangNhap);
router.post("/dang-xuat", xac_thuc_controller_1.xuLyDangXuat);
// Các API cần xác thực
router.get("/thong-tin", kiem_tra_token_1.xacThucNguoiDung, xac_thuc_controller_1.layThongTinCaNhan);
router.post("/cap-nhat-avatar", kiem_tra_token_1.xacThucNguoiDung, xu_ly_file_1.taiLenBoNhoTam.single("avatar"), xac_thuc_controller_1.xuLyCapNhatAvatar);
exports.default = router;
//# sourceMappingURL=xac_thuc.routes.js.map