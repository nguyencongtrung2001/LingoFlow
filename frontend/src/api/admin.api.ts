import axios from "axios";

export const adminClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/quan-tri`,
  withCredentials: true, // Cho phép nhận HttpOnly Cookies từ Backend
});

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  role: "LEARNER" | "ADMIN";
  isActive: boolean;
  createdAt: string;
  foldersCount: number;
  studySessionsCount: number;
  wordsCount: number;
  studyTimeSeconds: number;
}

export const getAdminUsers = async (): Promise<AdminUser[]> => {
  const response = await adminClient.get("/users");
  return response.data;
};

export const updateUserRole = async (userId: string, role: "LEARNER" | "ADMIN"): Promise<any> => {
  const response = await adminClient.patch(`/users/${userId}/role`, { role });
  return response.data;
};

export const updateUserStatus = async (userId: string, isActive: boolean): Promise<any> => {
  const response = await adminClient.patch(`/users/${userId}/trang-thai`, { isActive });
  return response.data;
};
