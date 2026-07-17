"use client"

import { useDashboardStats } from "@/feature/dashboard/hooks/useDashboardStats";
import { StreakCard } from "@/components/dashboard/streak-card"
import { HeatmapCard } from "@/components/dashboard/heatmap-card"

import { LearnedStatusChart } from "@/components/dashboard/learned-status-chart"
import { ChartLineLinear } from "@/components/dashboard/study-time-chart"

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="p-8 max-w-[1400px] mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-32 animate-pulse bg-slate-100 rounded-xl" />
          <div className="h-32 animate-pulse bg-slate-100 rounded-xl" />
          <div className="h-32 animate-pulse bg-slate-100 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-64 animate-pulse bg-slate-50 rounded-xl" />
          <div className="h-64 animate-pulse bg-slate-50 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in duration-300">
      {/* Hàng 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 items-stretch">
        <div className="flex flex-col h-full"><StreakCard serverData={stats?.duLieuHeatmap} /></div>
        <div className="flex flex-col h-full"><LearnedStatusChart serverData={stats?.tienDoLeitner} /></div>
      </div>

      {/* Hàng 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        <div className="flex flex-col h-full"><HeatmapCard serverData={stats?.duLieuHeatmap} /></div>
        <div className="flex flex-col h-full"><ChartLineLinear serverData={stats?.duLieuHeatmap} /></div>
      </div>
    </div>
  )
}