"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageFromUrl = uploadImageFromUrl;
const https_1 = __importDefault(require("https"));
const http_1 = __importDefault(require("http"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
/**
 * Tải file ảnh từ URL bên ngoài bằng module Node.js truyền thống (Tương thích mọi phiên bản Node.js)
 */
function downloadImage(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith("https") ? https_1.default : http_1.default;
        client.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
            }
        }, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`Failed to get image, status code: ${res.statusCode}`));
                return;
            }
            const data = [];
            res.on("data", (chunk) => {
                data.push(chunk);
            });
            res.on("end", () => {
                const buffer = Buffer.concat(data);
                const mimeType = res.headers["content-type"] || "image/jpeg";
                resolve({ buffer, mimeType });
            });
        }).on("error", (err) => {
            reject(err);
        });
    });
}
/**
 * Tải ảnh từ URL bên ngoài và upload lên Cloudinary của dự án
 * @param imageUrl URL của ảnh cần tải
 * @param folder Thư mục lưu trữ trên Cloudinary
 * @param publicIdPrefix Tiền tố tên file trên Cloudinary
 * @returns Link URL ảnh mới trên Cloudinary hoặc link gốc nếu có lỗi/đã là link Cloudinary
 */
async function uploadImageFromUrl(imageUrl, folder = "lingoflow/words", publicIdPrefix = "word") {
    if (!imageUrl)
        return null;
    // Nếu đã là link Cloudinary của hệ thống, không cần upload lại
    if (imageUrl.includes("res.cloudinary.com")) {
        return imageUrl;
    }
    // Kiểm tra xem có phải là URL hợp lệ không (phải bắt đầu bằng http:// hoặc https://)
    if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
        return imageUrl;
    }
    try {
        const { buffer, mimeType } = await downloadImage(imageUrl);
        const base64 = buffer.toString("base64");
        const dataURI = `data:${mimeType};base64,${base64}`;
        const uploadResult = await cloudinary_1.default.uploader.upload(dataURI, {
            folder: folder,
            public_id: `${publicIdPrefix}_${Date.now()}`,
            overwrite: true,
        });
        console.log(`Tải gián tiếp ảnh thành công lên Cloudinary! URL mới: ${uploadResult.secure_url}`);
        return uploadResult.secure_url;
    }
    catch (error) {
        console.error("Lỗi khi tải gián tiếp ảnh lên Cloudinary:", error);
        return imageUrl; // Fallback về link gốc nếu xảy ra lỗi
    }
}
//# sourceMappingURL=cloudinary_upload.js.map