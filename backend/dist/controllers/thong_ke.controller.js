"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xuLyHeartbeat = exports.layLichSuHocTap = exports.layThongKeTongHop = void 0;
const thong_ke_repository_1 = require("../repositories/thong_ke.repository");
const layThongKeTongHop = async (req, res) => {
    try {
        const maNguoiDung = req.user?.id;
        if (!maNguoiDung) {
            return res.status(401).json({ error: "Chưa được xác thực!" });
        }
        const thongKe = await (0, thong_ke_repository_1.layThongKeTongHopRepo)(maNguoiDung);
        return res.status(200).json(thongKe);
    }
    catch (error) {
        console.error("Lỗi khi lấy thống kê tổng hợp:", error);
        return res.status(500).json({ error: "Đã xảy ra lỗi hệ thống." });
    }
};
exports.layThongKeTongHop = layThongKeTongHop;
const layLichSuHocTap = async (req, res) => {
    try {
        const maNguoiDung = req.user?.id;
        if (!maNguoiDung) {
            return res.status(401).json({ error: "Chưa được xác thực!" });
        }
        const lichSu = await (0, thong_ke_repository_1.layLichSuHocTapRepo)(maNguoiDung);
        return res.status(200).json(lichSu);
    }
    catch (error) {
        console.error("Lỗi khi lấy lịch sử học tập:", error);
        return res.status(500).json({ error: "Đã xảy ra lỗi hệ thống." });
    }
};
exports.layLichSuHocTap = layLichSuHocTap;
const xuLyHeartbeat = async (req, res) => {
    try {
        const maNguoiDung = req.user?.id;
        if (!maNguoiDung) {
            return res.status(401).json({ error: "Chưa được xác thực!" });
        }
        const { seconds } = req.body;
        if (typeof seconds !== "number" || seconds <= 0) {
            return res.status(400).json({ error: "Số giây không hợp lệ!" });
        }
        await (0, thong_ke_repository_1.ghiNhanHeartbeatRepo)(maNguoiDung, seconds);
        return res.status(200).json({ success: true, message: "Ghi nhận heartbeat thành công." });
    }
    catch (error) {
        console.error("Lỗi khi xử lý heartbeat:", error);
        return res.status(500).json({ error: "Đã xảy ra lỗi hệ thống." });
    }
};
exports.xuLyHeartbeat = xuLyHeartbeat;
//# sourceMappingURL=thong_ke.controller.js.map