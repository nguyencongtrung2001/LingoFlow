import axios from "axios";

export interface DashboardStatsResponse {
  coCauLoaiTu: Array<{ pos: string; _count: { id: number } }>;
  tienDoLeitner: Array<{ box: number; _count: { id: number } }>;
  duLieuHeatmap: Array<{ date: string; wordsStudied: number }>;
  thoiGianOnTap: Array<{ startedAt: string; timeSeconds: number }>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const getDashboardStats = async (): Promise<DashboardStatsResponse> => {
  const res = await axios.get(`${API_URL}/api/thong-ke`, { withCredentials: true });
  return res.data;
};
