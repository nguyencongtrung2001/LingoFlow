import cloudinary from "../config/cloudinary";

/**
 * Tải ảnh từ URL bên ngoài và upload lên Cloudinary của dự án
 * @param imageUrl URL của ảnh cần tải
 * @param folder Thư mục lưu trữ trên Cloudinary
 * @param publicIdPrefix Tiền tố tên file trên Cloudinary
 * @returns Link URL ảnh mới trên Cloudinary hoặc link gốc nếu có lỗi/đã là link Cloudinary
 */
export async function uploadImageFromUrl(
  imageUrl: string | null | undefined,
  folder: string = "lingoflow/words",
  publicIdPrefix: string = "word"
): Promise<string | null> {
  if (!imageUrl) return null;

  // Nếu đã là link Cloudinary của hệ thống, không cần upload lại
  if (imageUrl.includes("res.cloudinary.com")) {
    return imageUrl;
  }

  // Kiểm tra xem có phải là URL hợp lệ không (phải bắt đầu bằng http:// hoặc https://)
  if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  try {
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
      }
    });
    if (!response.ok) {
      console.warn(`Không thể tải ảnh từ URL: ${imageUrl}, Status: ${response.status}`);
      return imageUrl; // Fallback về link gốc
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = response.headers.get("content-type") || "image/jpeg";
    const base64 = buffer.toString("base64");
    const dataURI = `data:${mimeType};base64,${base64}`;

    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      folder: folder,
      public_id: `${publicIdPrefix}_${Date.now()}`,
      overwrite: true,
    });

    console.log(`Tải gián tiếp ảnh thành công lên Cloudinary! URL mới: ${uploadResult.secure_url}`);
    return uploadResult.secure_url;
  } catch (error) {
    console.error("Lỗi khi tải gián tiếp ảnh lên Cloudinary:", error);
    return imageUrl; // Fallback về link gốc nếu xảy ra lỗi
  }
}
