import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  timNguoiDungTheoEmail,
  timNguoiDungTheoId,
  taoNguoiDungMoi,
  capNhatAvatarNguoiDung,
} from "../repositories/xac_thuc.repository";

const JWT_SECRET = process.env.JWT_SECRET || "lingoflow_secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// 1. Tạo JWT Token
export const taoTheXacThuc = (maNguoiDung: string, vaiTro: string) => {
  return jwt.sign({ id: maNguoiDung, role: vaiTro }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as any,
  });
};

// 2. Tạo Tài Khoản Mới
export const taoTaiKhoanMoi = async (thongTin: {
  email: string;
  matKhau: string;
  hoTen: string;
}) => {
  const { email, matKhau, hoTen } = thongTin;

  // Kiểm tra email đã tồn tại chưa ở tầng Repository
  const emailTonTai = await timNguoiDungTheoEmail(email);

  if (emailTonTai) {
    throw new Error("Email này đã được sử dụng!");
  }

  // Mã hóa mật khẩu
  const salt = await bcrypt.genSalt(10);
  const matKhauDaMaHoa = await bcrypt.hash(matKhau, salt);

  // Avatar mặc định
  const avatarMacDinh = "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg";

  // Lưu vào Database qua Repository
  const nguoiDungMoi = await taoNguoiDungMoi({
    email,
    password: matKhauDaMaHoa,
    name: hoTen,
    avatar: avatarMacDinh,
    role: "LEARNER",
  });

  return nguoiDungMoi;
};

// 3. Kiểm Tra Đăng Nhập
export const kiemTraDangNhap = async (email: string, matKhau: string) => {
  const nguoiDung = await timNguoiDungTheoEmail(email);

  if (!nguoiDung || !nguoiDung.password) {
    throw new Error("Email hoặc mật khẩu không chính xác!");
  }

  const matKhauHopLe = await bcrypt.compare(matKhau, nguoiDung.password);
  
  if (!matKhauHopLe) {
    throw new Error("Email hoặc mật khẩu không chính xác!");
  }

  return nguoiDung;
};

// 4. Lấy Thông Tin Người Dùng
export const layDuLieuNguoiDung = async (maNguoiDung: string) => {
  const nguoiDung = await timNguoiDungTheoId(maNguoiDung);

  if (!nguoiDung) {
    throw new Error("Không tìm thấy người dùng!");
  }

  return nguoiDung;
};

// 5. Cập Nhật Avatar
export const capNhatAnhDaiDien = async (maNguoiDung: string, urlAnh: string) => {
  const nguoiDungDaCapNhat = await capNhatAvatarNguoiDung(maNguoiDung, urlAnh);
  return nguoiDungDaCapNhat;
};
