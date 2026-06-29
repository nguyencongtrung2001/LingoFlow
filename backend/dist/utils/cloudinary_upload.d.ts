/**
 * Tải ảnh từ URL bên ngoài và upload lên Cloudinary của dự án
 * @param imageUrl URL của ảnh cần tải
 * @param folder Thư mục lưu trữ trên Cloudinary
 * @param publicIdPrefix Tiền tố tên file trên Cloudinary
 * @returns Link URL ảnh mới trên Cloudinary hoặc link gốc nếu có lỗi/đã là link Cloudinary
 */
export declare function uploadImageFromUrl(imageUrl: string | null | undefined, folder?: string, publicIdPrefix?: string): Promise<string | null>;
//# sourceMappingURL=cloudinary_upload.d.ts.map