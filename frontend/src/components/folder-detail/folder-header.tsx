import { useGetFolderProgress } from "@/feature/words/hooks/useWords";

export interface FolderHeaderProps {
  folderId: number;
  name: string;
  desc: string;
}

export function FolderHeader({ folderId, name, desc }: FolderHeaderProps) {
  const { data: progress } = useGetFolderProgress(folderId);

  return (
    <section className="space-y-4">
      <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4">
        <div>
          <h1 className="text-[28px] md:text-[32px] text-[#0b1c30] font-bold tracking-[-0.01em]">
            Thư mục: {name}
          </h1>
          <p className="text-[16px] text-[#464554] mt-1">{desc}</p>
        </div>

        {/* Progress Display (Digital Clock Style) */}
        {progress && progress.tongSoTu > 0 && (
          <div className="flex items-center gap-1 md:gap-2 bg-[#f4f7fc] p-1.5 md:p-2 rounded-xl border border-[#e5eeff] shadow-sm">
            {/* Đã thuộc */}
            <div className="flex flex-col items-center justify-center min-w-[60px] md:min-w-[70px] bg-white rounded-lg py-1 px-2 border-b-2 border-[#00714d] shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
              <span className="text-[20px] md:text-[24px] font-black text-[#00714d] leading-none tracking-tight font-mono">
                {progress.daThuoc.toString().padStart(2, '0')}
              </span>
            </div>

            <div className="text-[#c7c4d7] font-black text-xl">:</div>

            {/* Đang ôn */}
            <div className="flex flex-col items-center justify-center min-w-[60px] md:min-w-[70px] bg-white rounded-lg py-1 px-2 border-b-2 border-[#4648d4] shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
              <span className="text-[20px] md:text-[24px] font-black text-[#4648d4] leading-none tracking-tight font-mono">
                {progress.dangOn.toString().padStart(2, '0')}
              </span>
            </div>

            <div className="text-[#c7c4d7] font-black text-xl">:</div>

            {/* Chưa học */}
            <div className="flex flex-col items-center justify-center min-w-[60px] md:min-w-[70px] bg-white rounded-lg py-1 px-2 border-b-2 border-[#ff9500] shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
              <span className="text-[20px] md:text-[24px] font-black text-[#ff9500] leading-none tracking-tight font-mono">
                {progress.chuaHoc.toString().padStart(2, '0')}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
