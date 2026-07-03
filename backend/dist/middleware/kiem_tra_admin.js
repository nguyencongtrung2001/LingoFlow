"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xacThucAdmin = void 0;
const xacThucAdmin = (yeuCau, phanHoi, tiepTuc) => {
    if (yeuCau.user?.role !== "ADMIN") {
        return phanHoi.status(403).json({ error: "Quyền truy cập bị từ chối! Chỉ dành cho Quản trị viên." });
    }
    tiepTuc();
};
exports.xacThucAdmin = xacThucAdmin;
//# sourceMappingURL=kiem_tra_admin.js.map