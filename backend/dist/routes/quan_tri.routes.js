"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const quan_tri_controller_1 = require("../controllers/quan_tri.controller");
const kiem_tra_token_1 = require("../middleware/kiem_tra_token");
const kiem_tra_admin_1 = require("../middleware/kiem_tra_admin");
const router = (0, express_1.Router)();
// Toàn bộ API quản trị yêu cầu đăng nhập và phải là ADMIN
router.use(kiem_tra_token_1.xacThucNguoiDung);
router.use(kiem_tra_admin_1.xacThucAdmin);
router.get("/users", quan_tri_controller_1.layDanhSachNguoiDung);
router.patch("/users/:id/role", quan_tri_controller_1.capNhatVaiTro);
router.patch("/users/:id/trang-thai", quan_tri_controller_1.capNhatTrangThai);
exports.default = router;
//# sourceMappingURL=quan_tri.routes.js.map