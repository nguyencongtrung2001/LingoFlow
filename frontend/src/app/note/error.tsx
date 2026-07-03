"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Note route error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
      <h2 className="text-xl font-bold text-slate-800">Đã xảy ra lỗi tại trang ghi chú</h2>
      <button
        onClick={() => reset()}
        className="mt-4 px-4 py-2 bg-[#4648d4] text-white rounded-lg font-semibold text-sm hover:bg-[#3b3db8] transition-all"
      >
        Thử lại
      </button>
    </div>
  );
}
