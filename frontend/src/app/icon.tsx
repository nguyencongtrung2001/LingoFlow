// frontend/src/app/icon.tsx
import { ImageResponse } from "next/og";

// Cấu hình siêu dữ liệu cho Favicon
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Hàm tự động tạo Favicon 3 lớp đè nhau hệ màu Indigo của LingoFlow
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          backgroundColor: "transparent",
        }}
      >
        {/* LỚP 1: LỚP ĐÁY (Màu Indigo rất nhạt #E0E7FF - Xoay nhẹ) */}
        <div
          style={{
            position: "absolute",
            width: "24px",
            height: "24px",
            backgroundColor: "#E0E7FF",
            borderRadius: "6px",
            opacity: 0.6,
            transform: "rotate(-8deg)",
          }}
        />

        {/* LỚP 2: LỚP GIỮA (Tiến trình Leitner - Màu Indigo sáng #818CF8 - Xoay ngược) */}
        <div
          style={{
            position: "absolute",
            width: "24px",
            height: "24px",
            backgroundColor: "#818CF8",
            borderRadius: "6px",
            opacity: 0.85,
            transform: "rotate(4deg)",
          }}
        />

        {/* LỚP 3: LỚP TRÊN CÙNG (Khối Card bo góc chính diện #4648D4 - Indigo Đậm nét) */}
        <div
          style={{
            position: "absolute",
            width: "24px",
            height: "24px",
            backgroundColor: "#4648D4",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 4px rgba(70,72,212,0.2)",
          }}
        >
          {/* Biểu tượng chữ L uốn lượn màu trắng đại diện cho Dòng chảy (Flow) */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 4v12a3 3 0 0 0 3 3h9" />
          </svg>
        </div>
      </div>
    ),
    // Khai báo kích thước đầu ra cho biểu tượng trình duyệt
    {
      ...size,
    }
  );
}