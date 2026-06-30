export default function DashboardLoading() {
  return (
    <div className="bg-[#f2f2f7] text-[#1a1a2e] min-h-screen font-sans flex flex-col pb-16 md:pb-0">
      <main className="w-full max-w-[1600px] mx-auto p-[2rem_2.5rem] grow max-lg:p-5 max-sm:p-4">
        <div className="h-[30px] w-48 bg-[#e1e0ff]/50 rounded-lg mb-6 animate-pulse" />

        {/* Row 1: Streak + ChartPie + LearnedStatus skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-[#4648d4]/20 rounded-[16px] h-[200px] animate-pulse" />
          <div className="bg-white border border-[#e5eeff] rounded-[16px] h-[200px] animate-pulse" />
          <div className="bg-white border border-[#e5eeff] rounded-[16px] h-[200px] animate-pulse" />
        </div>

        {/* Row 2: Heatmap + Chart skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6">
          <div className="bg-white border border-[#e5eeff] rounded-[16px] h-[240px] animate-pulse" />
          <div className="bg-white border border-[#e5eeff] rounded-[16px] h-[240px] animate-pulse" />
        </div>
      </main>
    </div>
  );
}
