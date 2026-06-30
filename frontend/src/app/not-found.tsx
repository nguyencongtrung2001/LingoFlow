import { SearchIcon } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center p-6 min-h-[60vh]">
      <div className="text-center max-w-md w-full">
        <div className="text-[120px] font-extrabold text-[#4648d4]/10 leading-none select-none mb-2">
          404
        </div>
        <div className="w-16 h-16 rounded-full bg-[#e1e0ff] flex items-center justify-center mx-auto mb-5 text-[28px]">
          <SearchIcon />
        </div>
        <h1 className="text-[24px] font-bold text-[#0b1c30] mb-2">
          Không tìm thấy trang
        </h1>
        <p className="text-[15px] text-[#464554] mb-8 leading-relaxed">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển đến địa
          chỉ khác.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3 bg-[#4648d4] text-white rounded-xl font-semibold text-[15px] hover:bg-[#6063ee] transition-all duration-200 hover:-translate-y-0.5 shadow-[0_4px_12px_-2px_rgba(70,72,212,0.2)]"
        >
          ← Về trang chủ
        </Link>
      </div>
    </main>
  );
}
