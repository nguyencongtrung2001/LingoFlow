import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
      <h2 className="text-xl font-bold text-slate-800">Không tìm thấy ghi chú</h2>
      <Link
        href="/"
        className="mt-4 px-4 py-2 bg-[#4648d4] text-white rounded-lg font-semibold text-sm hover:bg-[#3b3db8] transition-all"
      >
        Quay lại trang chủ
      </Link>
    </div>
  );
}
