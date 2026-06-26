import axios from "axios";

// Cấu hình Axios instance
export const folderClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/thu-muc`,
  withCredentials: true, // Cho phép nhận HttpOnly Cookies từ Backend
});

export interface Folder {
  id: number;
  name: string;
  description?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    words: number;
  };
}

export const getFolders = async (): Promise<Folder[]> => {
  const response = await folderClient.get("/");
  return response.data;
};

export const getFolderById = async (id: number): Promise<Folder> => {
  const response = await folderClient.get(`/${id}`);
  return response.data;
};

export const createFolder = async (data: { name: string; description?: string }): Promise<Folder> => {
  const response = await folderClient.post("/", data);
  return response.data;
};

export const updateFolder = async (id: number, data: { name?: string; description?: string }): Promise<Folder> => {
  const response = await folderClient.put(`/${id}`, data);
  return response.data;
};

export const deleteFolder = async (id: number): Promise<{ message: string }> => {
  const response = await folderClient.delete(`/${id}`);
  return response.data;
};
