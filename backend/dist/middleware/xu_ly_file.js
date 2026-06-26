"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taiLenBoNhoTam = void 0;
const multer_1 = __importDefault(require("multer"));
// Sử dụng Memory Storage để có thể lấy được buffer ngay trong backend trước khi up lên Cloudinary
const luuTruTam = multer_1.default.memoryStorage();
// Cấu hình multer chỉ cho phép nhận các file ảnh
exports.taiLenBoNhoTam = (0, multer_1.default)({
    storage: luuTruTam,
    limits: {
        fileSize: 5 * 1024 * 1024, // Giới hạn kích thước 5MB
    },
    fileFilter: (yeuCau, tapTin, tiepTuc) => {
        if (tapTin.mimetype.startsWith("image/")) {
            tiepTuc(null, true);
        }
        else {
            tiepTuc(new Error("Chỉ cho phép tải lên file hình ảnh!"));
        }
    },
});
//# sourceMappingURL=xu_ly_file.js.map