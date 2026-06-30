"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/feature/auth/stores/auth-store";
import { sendStudyHeartbeat } from "@/api/statistics.api";

export function ActivityTracker() {
  const { isAuthenticated } = useAuthStore();
  const lastActiveRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Khởi tạo thời gian hoạt động ban đầu khi component mount
    lastActiveRef.current = Date.now();

    // 1. Lắng nghe các cử chỉ tương tác để xác định người dùng không treo máy (AFK)
    const ghiNhanTuongTac = () => {
      lastActiveRef.current = Date.now();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("mousemove", ghiNhanTuongTac);
      window.addEventListener("keydown", ghiNhanTuongTac);
      window.addEventListener("scroll", ghiNhanTuongTac);
    }

    // 2. Thiết lập chu kỳ kiểm tra và gửi Heartbeat cứ sau mỗi 30 giây
    intervalRef.current = setInterval(async () => {
      // Chỉ gửi heartbeat nếu người dùng đã đăng nhập và trang đang được xem (không ẩn tab)
      if (!isAuthenticated || document.visibilityState !== "visible") {
        return;
      }

      const bayGio = Date.now();
      const haiPhut = 2 * 60 * 1000;

      // Nếu khoảng thời gian từ lần tương tác cuối nhỏ hơn 2 phút -> Tính là ĐANG HỌC THẬT
      if (bayGio - lastActiveRef.current < haiPhut) {
        try {
          // Gửi ping ngầm cộng dồn 30 giây lên Backend
          await sendStudyHeartbeat(30);
        } catch (error) {
          console.error("Lỗi đồng bộ nhịp tim thời gian học ngầm:", error);
        }
      }
    }, 30000); // 30 giây kích hoạt 1 lần

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("mousemove", ghiNhanTuongTac);
        window.removeEventListener("keydown", ghiNhanTuongTac);
        window.removeEventListener("scroll", ghiNhanTuongTac);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAuthenticated]);

  return null; // Component chạy ngầm, không render giao diện UI
}
