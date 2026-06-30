import { prisma } from "../config/prisma";

export const layThongKeTongHopRepo = async (userId: string) => {
  // 1. Tính toán cơ cấu loại từ (Noun, Verb, Adj...)
  const coCauLoaiTu = await prisma.word.groupBy({
    by: ['pos'],
    where: { folder: { userId } },
    _count: { id: true }
  });

  // 2. Tính toán phân cấp tiến độ Leitner Box
  const tienDoLeitner = await prisma.wordProgress.groupBy({
    by: ['box'],
    where: { userId },
    _count: { id: true }
  });

  // 3. Lấy 371 ngày dữ liệu DailyActivity cho Heatmap Chart
  const duLieuHeatmap = await prisma.dailyActivity.findMany({
    where: { userId },
    orderBy: { date: 'asc' }
  });

  // 4. Lấy thời gian ôn tập 14 ngày gần nhất để tính toán tăng trưởng tuần
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  const thoiGianOnTap = await prisma.studySession.findMany({
    where: {
      userId,
      startedAt: { gte: fourteenDaysAgo }
    },
    orderBy: { startedAt: 'desc' },
    select: { startedAt: true, timeSeconds: true }
  });

  return { coCauLoaiTu, tienDoLeitner, duLieuHeatmap, thoiGianOnTap };
};

export const layLichSuHocTapRepo = async (userId: string) => {
  return await prisma.studySession.findMany({
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

export const ghiNhanHeartbeatRepo = async (userId: string, seconds: number) => {
  const vnDateStr = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Ho_Chi_Minh" });
  const today = new Date(vnDateStr);

  return await prisma.dailyActivity.upsert({
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
