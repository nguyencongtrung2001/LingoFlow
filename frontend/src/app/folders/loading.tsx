export default function FoldersLoading() {
  return (
    <div className="bg-[#f2f2f7] text-[#1a1a2e] min-h-screen font-sans flex flex-col pb-16 md:pb-0">
      <main className="w-full max-w-[1200px] mx-auto p-[20px] grow mt-4">
        {/* Stats skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-[#f8f9ff] rounded-xl p-6 border border-[#e5eeff] animate-pulse"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#e1e0ff]/60" />
                <div className="h-4 w-24 bg-[#e1e0ff]/40 rounded" />
              </div>
              <div className="h-8 w-16 bg-[#e1e0ff]/50 rounded" />
            </div>
          ))}
        </div>

        {/* Header + Controls skeleton */}
        <div className="flex justify-between items-center mb-6 pt-4">
          <div className="h-8 w-56 bg-[#e1e0ff]/50 rounded-lg animate-pulse" />
          <div className="flex gap-3">
            <div className="h-10 w-[240px] bg-[#e1e0ff]/30 rounded-full animate-pulse" />
            <div className="h-10 w-[140px] bg-[#e1e0ff]/30 rounded-full animate-pulse" />
            <div className="h-10 w-[120px] bg-[#4648d4]/20 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Folder grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-[#f8f9ff] rounded-xl p-6 border border-[#e5eeff] animate-pulse"
            >
              <div className="h-6 w-3/4 bg-[#e1e0ff]/50 rounded mb-3" />
              <div className="h-4 w-full bg-[#e1e0ff]/30 rounded mb-2" />
              <div className="h-4 w-2/3 bg-[#e1e0ff]/30 rounded mb-6" />
              <div className="border-t border-[#d3e4fe] pt-3 flex justify-between">
                <div className="h-4 w-12 bg-[#e1e0ff]/40 rounded" />
                <div className="h-4 w-20 bg-[#e1e0ff]/40 rounded" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
