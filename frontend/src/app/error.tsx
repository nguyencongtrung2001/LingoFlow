"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <main className="flex-1 flex items-center justify-center p-6 min-h-[60vh]">
      <div className="text-center p-8 bg-white rounded-2xl border border-[#e5eeff] max-w-md w-full shadow-[0_8px_24px_-4px_rgba(70,72,212,0.08)]">
        <div className="w-16 h-16 rounded-full bg-[#ffdad6] flex items-center justify-center mx-auto mb-5 text-[28px]">
          ⚠️
        </div>
        <h2 className="text-[22px] font-bold text-[#0b1c30] mb-2">
          Đã xảy ra lỗi
        </h2>
        <p className="text-[15px] text-[#464554] mb-6 leading-relaxed">
          Trang bạn đang truy cập gặp sự cố. Hãy thử tải lại hoặc quay về
          trang chủ.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="px-6 py-2.5 bg-[#4648d4] text-white rounded-xl font-semibold text-[14px] hover:bg-[#6063ee] transition-all duration-200 hover:-translate-y-0.5 shadow-[0_2px_8px_-2px_rgba(70,72,212,0.2)]"
          >
            Thử lại
          </button>
          <Link
            href="/"
            className="px-6 py-2.5 bg-white text-[#4648d4] border border-[#4648d4] rounded-xl font-semibold text-[14px] hover:bg-[#e1e0ff] transition-all duration-200"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </main>
  );
}
