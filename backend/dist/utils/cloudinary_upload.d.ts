/**
 * Tải ảnh từ URL bên ngoài và upload lên Cloudinary của dự án
 * @param imageUrl URL của ảnh cần tải
 * @param folder Thư mục lưu trữ trên Cloudinary
 * @param publicIdPrefix Tiền tố tên file trên Cloudinary
 * @returns Link URL ảnh mới trên Cloudinary hoặc link gốc nếu có lỗi/đã là link Cloudinary
 */
export declare function uploadImageFromUrl(imageUrl: string | null | undefined, folder?: string, publicIdPrefix?: string): Promise<string | null>;
/**
 * Trích xuất publicId của ảnh từ URL Cloudinary
 */
export declare function extractPublicIdFromUrl(url: string): string | null;
/**
 * Xóa ảnh khỏi Cloudinary dựa trên URL
 */
export declare function deleteImageFromCloudinary(url: string | null | undefined): Promise<boolean>;
//# sourceMappingURL=cloudinary_upload.d.ts.map