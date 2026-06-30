"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const thong_ke_controller_1 = require("../controllers/thong_ke.controller");
const kiem_tra_token_1 = require("../middleware/kiem_tra_token");
const router = (0, express_1.Router)();
router.use(kiem_tra_token_1.xacThucNguoiDung);
router.get("/", thong_ke_controller_1.layThongKeTongHop);
router.get("/lich-su", thong_ke_controller_1.layLichSuHocTap);
router.post("/heartbeat", thong_ke_controller_1.xuLyHeartbeat);
exports.default = router;
//# sourceMappingURL=thong_ke.routes.js.map