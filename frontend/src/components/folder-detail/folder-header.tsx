
export interface FolderHeaderProps {
  name: string;
  desc: string;
}

export function FolderHeader({ name, desc }: FolderHeaderProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4">
        <div>
          <h1 className="text-[28px] md:text-[32px] text-[#0b1c30] font-bold tracking-[-0.01em]">
            Thư mục: {name}
          </h1>
          <p className="text-[16px] text-[#464554] mt-1">{desc}</p>
        </div>
      </div>
    </section>
  );
}
