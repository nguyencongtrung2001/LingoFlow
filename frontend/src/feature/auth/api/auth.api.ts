import axios from "axios";

// Cấu hình Axios instance
export const authClient = axios.create({
  baseURL: "http://localhost:5000/api/xac-thuc",
  withCredentials: true, // Cho phép nhận HttpOnly Cookies từ Backend
});

export const loginUser = async (data: any) => {
  const response = await authClient.post("/dang-nhap", data);
  return response.data;
};

export const registerUser = async (data: any) => {
  const response = await authClient.post("/dang-ky", data);
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
