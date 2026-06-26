export function FolderSkeleton() {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-2xl p-5 h-[160px] animate-pulse flex flex-col">
      <div className="flex items-start justify-between mb-4 mt-1">
        <div className="w-11 h-11 bg-gray-200 rounded-xl" />
        <div className="w-14 h-6 bg-gray-200 rounded-full" />
      </div>
      <div className="w-3/4 h-5 bg-gray-200 rounded mb-3" />
      <div className="w-full h-4 bg-gray-200 rounded mb-1.5" />
      <div className="w-2/3 h-4 bg-gray-200 rounded" />
    </div>
  );
}
