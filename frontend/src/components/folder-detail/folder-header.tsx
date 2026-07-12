import { useGetFolderProgress } from "@/feature/words/hooks/useWords";
import { CheckCircle2, RotateCcw, Inbox } from "lucide-react";

export interface FolderHeaderProps {
  folderId: number;
  name: string;
  desc: string;
}

export function FolderHeader({ folderId, name, desc }: FolderHeaderProps) {
  const { data: progress } = useGetFolderProgress(folderId);

  return (
    <section className="space-y-4">
      <div className="flex items-start lg:items-center justify-between flex-col lg:flex-row gap-5">
        <div>
          <h1 className="text-[28px] md:text-[32px] text-[#0b1c30] font-bold tracking-[-0.01em]">
            Thư mục: {name}
          </h1>
          <p className="text-[16px] text-[#464554] mt-1">{desc}</p>
        </div>

        {/* Premium Progress Display */}
        {progress && progress.tongSoTu > 0 && (
          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
            {/* Đã thuộc */}
            <div className="flex items-center gap-3 bg-emerald-50/70 hover:bg-emerald-50 border border-emerald-100/80 px-3 py-2 md:px-4 md:py-2.5 rounded-2xl transition-all shadow-sm shadow-emerald-100/50">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[10px] md:text-[11px] font-bold text-emerald-600/80 uppercase tracking-wider mb-0.5">Đã thuộc</span>
                <span className="text-[18px] md:text-[20px] font-black text-emerald-700 leading-none font-mono">
                  {progress.daThuoc.toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Đang ôn */}
            <div className="flex items-center gap-3 bg-blue-50/70 hover:bg-blue-50 border border-blue-100/80 px-3 py-2 md:px-4 md:py-2.5 rounded-2xl transition-all shadow-sm shadow-blue-100/50">
              <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[10px] md:text-[11px] font-bold text-blue-600/80 uppercase tracking-wider mb-0.5">Đang ôn</span>
                <span className="text-[18px] md:text-[20px] font-black text-blue-700 leading-none font-mono">
                  {progress.dangOn.toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Chưa học */}
            <div className="flex items-center gap-3 bg-orange-50/70 hover:bg-orange-50 border border-orange-100/80 px-3 py-2 md:px-4 md:py-2.5 rounded-2xl transition-all shadow-sm shadow-orange-100/50">
              <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shadow-inner">
                <Inbox className="w-5 h-5" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[10px] md:text-[11px] font-bold text-orange-600/80 uppercase tracking-wider mb-0.5">Chưa học</span>
                <span className="text-[18px] md:text-[20px] font-black text-orange-700 leading-none font-mono">
                  {progress.chuaHoc.toString().padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
