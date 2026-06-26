import multer from "multer";

// Sử dụng Memory Storage để có thể lấy được buffer ngay trong backend trước khi up lên Cloudinary
const luuTruTam = multer.memoryStorage();

// Cấu hình multer chỉ cho phép nhận các file ảnh
export const taiLenBoNhoTam = multer({
  storage: luuTruTam,
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn kích thước 5MB
  },
  fileFilter: (yeuCau, tapTin, tiepTuc) => {
    if (tapTin.mimetype.startsWith("image/")) {
      tiepTuc(null, true);
    } else {
      tiepTuc(new Error("Chỉ cho phép tải lên file hình ảnh!"));
    }
  },
});
