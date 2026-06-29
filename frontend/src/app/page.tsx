"use client"

import { StreakCard } from "@/components/dashboard/streak-card"
import { MediaCard } from "@/components/dashboard/media-card"
import { HeatmapCard } from "@/components/dashboard/heatmap-card"
import { ChartPieLegend } from "@/components/dashboard/word-type-chart"
import { LearnedStatusChart } from "@/components/dashboard/learned-status-chart"
import { ChartLineLinear } from "@/components/dashboard/study-time-chart"

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in duration-300">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        <div className="flex flex-col h-full">
          <StreakCard />
        </div>
        <div className="flex flex-col h-full">
          <ChartPieLegend />
        </div>
        <div className="flex flex-col h-full">
          <LearnedStatusChart />
        </div>
        <div className="flex flex-col h-full">
          <MediaCard />
        </div>
      </div>

      {/* 🧩 HÀNG 2: HEATMAP CARD CHIA ĐỀU NHAU TỶ LỆ 50/50 WIDTH VỚI LINE CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        <div className="flex flex-col h-full">
          <HeatmapCard />
        </div>
        <div className="flex flex-col h-full">
          <ChartLineLinear />
        </div>
      </div>

    </div>
  )
}