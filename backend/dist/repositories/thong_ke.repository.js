"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ghiNhanHeartbeatRepo = exports.layLichSuHocTapRepo = exports.layThongKeTongHopRepo = void 0;
const prisma_1 = require("../config/prisma");
const layThongKeTongHopRepo = async (userId) => {
    // 1. Tính toán cơ cấu loại từ (Noun, Verb, Adj...)
    const coCauLoaiTu = await prisma_1.prisma.word.groupBy({
        by: ['pos'],
        where: { folder: { userId } },
        _count: { id: true }
    });
    // 2. Tính toán phân cấp tiến độ Leitner Box
    const tienDoLeitner = await prisma_1.prisma.wordProgress.groupBy({
        by: ['box'],
        where: { userId },
        _count: { id: true }
    });
    // 3. Lấy 371 ngày dữ liệu DailyActivity cho Heatmap Chart
    const duLieuHeatmap = await prisma_1.prisma.dailyActivity.findMany({
        where: { userId },
        orderBy: { date: 'asc' }
    });
    // 4. Lấy thời gian ôn tập 14 ngày gần nhất để tính toán tăng trưởng tuần
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    const thoiGianOnTap = await prisma_1.prisma.studySession.findMany({
        where: {
            userId,
            startedAt: { gte: fourteenDaysAgo }
        },
        orderBy: { startedAt: 'desc' },
        select: { startedAt: true, timeSeconds: true }
    });
    return { coCauLoaiTu, tienDoLeitner, duLieuHeatmap, thoiGianOnTap };
};
exports.layThongKeTongHopRepo = layThongKeTongHopRepo;
const layLichSuHocTapRepo = async (userId) => {
    return await prisma_1.prisma.studySession.findMany({
        where: { userId },
        orderBy: { startedAt: "desc" },
        include: {
            folder: {
                select: {
                    name: true,
                },
            },
        },
    });
};
exports.layLichSuHocTapRepo = layLichSuHocTapRepo;
const ghiNhanHeartbeatRepo = async (userId, seconds) => {
    const vnDateStr = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Ho_Chi_Minh" });
    const today = new Date(vnDateStr);
    return await prisma_1.prisma.dailyActivity.upsert({
        where: {
            userId_date: { userId, date: today }
        },
        update: {
            studyTimeSeconds: { increment: seconds }
        },
        create: {
            userId,
            date: today,
            sessionsCount: 0,
            wordsStudied: 0,
            studyTimeSeconds: seconds
        }
    });
};
exports.ghiNhanHeartbeatRepo = ghiNhanHeartbeatRepo;
//# sourceMappingURL=thong_ke.repository.js.map