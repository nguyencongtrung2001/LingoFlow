import Link from "next/link";

export default function FolderDetailNotFound() {
  return (
    <main className="flex-1 flex items-center justify-center p-6 min-h-[60vh]">
      <div className="text-center p-8 bg-white rounded-2xl border border-[#e5eeff] max-w-md w-full shadow-[0_8px_24px_-4px_rgba(70,72,212,0.08)] mx-auto mt-12">
        <div className="w-16 h-16 rounded-full bg-[#e1e0ff] flex items-center justify-center mx-auto mb-5 text-[28px]">
          📂
        </div>
        <h2 className="text-[22px] font-bold text-[#0b1c30] mb-2">
          Thư mục không tồn tại
        </h2>
        <p className="text-[15px] text-[#464554] mb-8 leading-relaxed">
          Thư mục từ vựng này không tồn tại, chưa được tạo hoặc có thể đã bị xóa.
        </p>
        <Link
          href="/folders"
          className="inline-flex items-center gap-2 px-8 py-3 bg-[#4648d4] text-white rounded-xl font-semibold text-[15px] hover:bg-[#6063ee] transition-all duration-200 hover:-translate-y-0.5 shadow-[0_4px_12px_-2px_rgba(70,72,212,0.2)]"
        >
          ← Danh sách thư mục
        </Link>
      </div>
    </main>
  );
}
