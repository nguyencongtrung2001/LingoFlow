export default function FolderDetailLoading() {
  return (
    <main className="w-full max-w-[1200px] mx-auto p-4 md:p-6 space-y-8 grow mb-16 md:mb-0">
      {/* Header skeleton */}
      <section className="space-y-4">
        <div className="h-8 w-64 bg-[#e1e0ff]/50 rounded-lg animate-pulse" />
        <div className="h-5 w-96 bg-[#e1e0ff]/30 rounded animate-pulse" />
      </section>

      {/* Study modes skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-6 bg-[#f8f9ff] rounded-xl border border-[#e5eeff] animate-pulse"
          >
            <div className="w-12 h-12 rounded-lg bg-[#e1e0ff]/60 shrink-0" />
            <div className="flex-1">
              <div className="h-4 w-24 bg-[#e1e0ff]/50 rounded mb-2" />
              <div className="h-3 w-32 bg-[#e1e0ff]/30 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar skeleton */}
      <div className="flex gap-3 items-center">
        <div className="h-[38px] flex-1 max-w-xs bg-[#e1e0ff]/30 rounded-lg animate-pulse" />
        <div className="h-[38px] w-[160px] bg-[#e1e0ff]/30 rounded-lg animate-pulse" />
        <div className="h-[38px] w-[100px] bg-[#e1e0ff]/30 rounded-lg animate-pulse" />
        <div className="ml-auto h-[38px] w-[120px] bg-[#4648d4]/20 rounded-lg animate-pulse" />
      </div>

      {/* Word cards skeleton */}
      <section>
        <div className="h-4 w-24 bg-[#e1e0ff]/30 rounded mb-3 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-[#f8f9ff] rounded-xl p-6 border border-[#c7c4d7]/30 animate-pulse"
            >
              <div className="w-16 h-16 rounded-lg bg-[#e1e0ff]/40 mb-3" />
              <div className="h-5 w-28 bg-[#e1e0ff]/50 rounded mb-2" />
              <div className="h-3 w-20 bg-[#e1e0ff]/30 rounded mb-3" />
              <div className="h-5 w-32 bg-[#e1e0ff]/40 rounded mb-2" />
              <div className="h-12 w-full bg-[#e1e0ff]/20 rounded mt-2" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
