"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="vi">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f2f2f7",
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "3rem 2rem",
            maxWidth: 480,
            backgroundColor: "#ffffff",
            borderRadius: 16,
            border: "1px solid #e5eeff",
            boxShadow: "0 8px 24px -4px rgba(70,72,212,0.08)",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              backgroundColor: "#ffdad6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
              fontSize: 28,
            }}
          >
            ⚠️
          </div>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#0b1c30",
              marginBottom: 8,
            }}
          >
            Đã xảy ra lỗi nghiêm trọng
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "#464554",
              marginBottom: 24,
              lineHeight: 1.6,
            }}
          >
            Ứng dụng gặp sự cố không mong muốn. Vui lòng thử lại hoặc liên hệ
            hỗ trợ nếu lỗi tiếp tục xảy ra.
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: "12px 32px",
              backgroundColor: "#4648d4",
              color: "#ffffff",
              border: "none",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#6063ee")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#4648d4")
            }
          >
            Thử lại
          </button>
        </div>
      </body>
    </html>
  );
}
