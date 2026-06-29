import { StreakCard } from "@/components/dashboard/streak-card";
import { MediaCard } from "@/components/dashboard/media-card";
import { HeatmapCard } from "@/components/dashboard/heatmap-card";
import { WordTypeChartDynamic } from "@/components/dashboard/word-type-chart-dynamic";
import "@/components/dashboard/dashboard-styles.css";

export default function Home() {
  return (
    <div className="bg-[#f2f2f7] text-[#1a1a2e] min-h-screen font-sans flex flex-col pb-16 md:pb-0">
      <main className="w-full max-w-[1600px] mx-auto p-[2rem_2.5rem] grow max-lg:p-5 max-sm:p-4">
        <p className="text-[24px] font-bold mb-6 tracking-[-0.01em]">
          Tổng quan học tập
        </p>

        {/* Row 1: Streak (fixed width) + Media (flexible) */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 mb-4 lg:h-[235px]">
          <div className="h-full min-h-[235px] lg:min-h-0">
            <StreakCard />
          </div>
          <div className="h-full min-h-[235px] lg:min-h-0">
            <MediaCard />
          </div>
        </div>

        {/* Row 2: Heatmap (flexible) + Donut Chart (fixed width) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-4 mb-4">
          <div className="h-full min-h-[235px]">
            <HeatmapCard />
          </div>
          <div className="h-full min-h-[235px]">
            <WordTypeChartDynamic />
          </div>
        </div>
      </main>
    </div>
  );
}
