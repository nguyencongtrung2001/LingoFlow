import https from "https";
import http from "http";
import cloudinary from "../config/cloudinary";

/**
 * Tải file ảnh từ URL bên ngoài bằng module Node.js truyền thống (Tương thích mọi phiên bản Node.js)
 */
function downloadImage(url: string): Promise<{ buffer: Buffer; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client.get(
      url,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
        }
      },
      (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Failed to get image, status code: ${res.statusCode}`));
          return;
        }

        const data: Buffer[] = [];
        res.on("data", (chunk) => {
          data.push(chunk);
        });

        res.on("end", () => {
          const buffer = Buffer.concat(data);
          const mimeType = res.headers["content-type"] || "image/jpeg";
          resolve({ buffer, mimeType });
        });
      }
    ).on("error", (err) => {
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
    const { buffer, mimeType } = await downloadImage(imageUrl);
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

/**
 * Trích xuất publicId của ảnh từ URL Cloudinary
 */
export function extractPublicIdFromUrl(url: string): string | null {
  if (!url || !url.includes("res.cloudinary.com")) return null;

  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;

    const pathAfterUpload = parts[1];
    if (!pathAfterUpload) return null;

    const segments = pathAfterUpload.split("/");
    const firstSegment = segments[0];
    
    // Loại bỏ version (ví dụ: v1688133593) nếu có
    if (firstSegment && firstSegment.startsWith("v") && !isNaN(Number(firstSegment.substring(1)))) {
      segments.shift();
    }

    const fullPathWithoutVersion = segments.join("/");
    const lastDotIndex = fullPathWithoutVersion.lastIndexOf(".");
    if (lastDotIndex !== -1) {
      return fullPathWithoutVersion.substring(0, lastDotIndex);
    }
    return fullPathWithoutVersion;
  } catch (error) {
    console.error("Lỗi khi giải mã publicId từ URL Cloudinary:", error);
    return null;
  }
}

/**
 * Xóa ảnh khỏi Cloudinary dựa trên URL
 */
export async function deleteImageFromCloudinary(url: string | null | undefined): Promise<boolean> {
  if (!url) return false;

  const publicId = extractPublicIdFromUrl(url);
  if (!publicId) return false;

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(`Xóa ảnh thành công trên Cloudinary! publicId: ${publicId}. Kết quả:`, result);
    return result.result === "ok";
  } catch (error) {
    console.error(`Lỗi khi xóa ảnh trên Cloudinary với publicId ${publicId}:`, error);
    return false;
  }
}
