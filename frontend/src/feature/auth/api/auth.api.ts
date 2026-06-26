import axios from "axios";
import type { LoginInput, RegisterInput } from "../schemas/auth.schema";

// Cấu hình Axios instance
export const authClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/xac-thuc`,
  withCredentials: true, // Cho phép nhận HttpOnly Cookies từ Backend
});

export const loginUser = async (data: LoginInput) => {
  const response = await authClient.post("/dang-nhap", data);
  return response.data;
};

export const registerUser = async (data: RegisterInput) => {
  const payload = {
    email: data.email,
    password: data.password,
    name: data.fullName,
  };
  const response = await authClient.post("/dang-ky", payload);
  return response.data;
};

export const logoutUser = async () => {
  const response = await authClient.post("/dang-xuat");
  return response.data;
};

export const getUserProfile = async () => {
  const response = await authClient.get("/thong-tin");
  return response.data;
};

export const updateAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await authClient.post("/cap-nhat-avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
