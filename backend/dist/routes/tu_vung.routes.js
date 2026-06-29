"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tu_vung_controller_1 = require("../controllers/tu_vung.controller");
const kiem_tra_token_1 = require("../middleware/kiem_tra_token");
const router = (0, express_1.Router)();
// Áp dụng lớp bảo vệ token cho tất cả các API nghiệp vụ từ vựng
router.use(kiem_tra_token_1.xacThucNguoiDung);
router.get("/thu-muc/:folderId", tu_vung_controller_1.xuLyLayDanhSachTu);
router.post("/", tu_vung_controller_1.xuLyThemTu);
router.post("/batch", tu_vung_controller_1.xuLyThemNhieuTu);
router.put("/:id", tu_vung_controller_1.xuLyCapNhatTu);
router.delete("/:id", tu_vung_controller_1.xuLyXoaTu);
exports.default = router;
//# sourceMappingURL=tu_vung.routes.js.map