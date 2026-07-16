"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tu_vung_controller_1 = require("../controllers/tu_vung.controller");
const kiem_tra_token_1 = require("../middleware/kiem_tra_token");
const router = (0, express_1.Router)();
// Áp dụng lớp bảo vệ token cho tất cả các API nghiệp vụ từ vựng
router.use(kiem_tra_token_1.xacThucNguoiDung);
router.get("/thu-muc/:folderId", tu_vung_controller_1.xuLyLayDanhSachTu);
router.get("/tien-do/:folderId", tu_vung_controller_1.xuLyLayTienDoThuMuc);
router.get("/cuon-chieu/:folderId", tu_vung_controller_1.xuLyLayTuCuonChieu);
router.get("/thong-minh/:folderId", tu_vung_controller_1.xuLyLayTuThongMinh);
router.get("/da-thuoc/:folderId", tu_vung_controller_1.xuLyLayTuDaThuoc);
router.post("/", tu_vung_controller_1.xuLyThemTu);
router.post("/batch", tu_vung_controller_1.xuLyThemNhieuTu);
router.post("/phien-hoc", tu_vung_controller_1.xuLyLuuPhienHoc);
router.post("/cham-diem-cau", tu_vung_controller_1.xuLyChamDiemCau);
router.put("/di-chuyen", tu_vung_controller_1.xuLyDiChuyenTu);
router.put("/:id", tu_vung_controller_1.xuLyCapNhatTu);
router.delete("/:id", tu_vung_controller_1.xuLyXoaTu);
exports.default = router;
//# sourceMappingURL=tu_vung.routes.js.map