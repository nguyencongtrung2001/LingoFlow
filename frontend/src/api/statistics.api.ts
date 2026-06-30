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

export interface StudySessionHistoryItem {
  id: string;
  folderId: number;
  mode: "FLASHCARD" | "QUIZ" | "MATCH" | "WRITE";
  totalWords: number;
  correctCount: number;
  accuracy: number;
  maxStreak: number;
  timeSeconds: number | null;
  startedAt: string;
  completedAt: string;
  folder: {
    name: string;
  };
}

export const getStudyHistory = async (): Promise<StudySessionHistoryItem[]> => {
  const res = await axios.get(`${API_URL}/api/thong-ke/lich-su`, { withCredentials: true });
  return res.data;
};
