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

        {/* Row 1: 2 Pie charts + Media + Streak (fixed width or all same size) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 lg:h-[300px]">
          <div className="h-full min-h-[300px] lg:min-h-0">
            <VocabCountChart />
          </div>
          <div className="h-full min-h-[300px] lg:min-h-0">
            <LearnedStatusChart />
          </div>
          <div className="h-full min-h-[300px] lg:min-h-0">
            <MediaCard />
          </div>
          <div className="h-full min-h-[300px] lg:min-h-0">
            <StreakCard />
          </div>
        </div>

        {/* Row 2: Linear chart + Heatmap (50/50 width) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div className="h-full min-h-[300px]">
            <StudyTimeChart />
          </div>
          <div className="h-full min-h-[300px]">
            <HeatmapCard />
          </div>
        </div>
      </main>
    </div>
  );
}
