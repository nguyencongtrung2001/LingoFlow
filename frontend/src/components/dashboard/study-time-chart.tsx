"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

// Định dạng dữ liệu mẫu theo ngày/tuần
const chartData = [
  { label: "Thứ 2", phut: 45 },
  { label: "Thứ 3", phut: 80 },
  { label: "Thứ 4", phut: 120 }, // Mốc tối đa 2h
  { label: "Thứ 5", phut: 30 },
  { label: "Thứ 6", phut: 95 },
  { label: "Thứ Bảy", phut: 60 },
  { label: "Chủ Nhật", phut: 110 },
]

const chartConfig = {
  phut: {
    label: "Thời gian học (phút)",
    color: "#4f46e5",
  },
} satisfies ChartConfig

export function ChartLineLinear({ serverData }: { serverData?: Array<{ startedAt: string; timeSeconds: number }> }) {
  const dynamicData = React.useMemo(() => {
    if (!serverData || serverData.length === 0) return chartData;

    // Group by day of week
    const daysMap = new Map<string, number>();
    const days = ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ Bảy"];
    
    serverData.forEach(session => {
      const date = new Date(session.startedAt);
      const dayLabel = days[date.getDay()];
      const currentMinutes = daysMap.get(dayLabel) || 0;
      daysMap.set(dayLabel, currentMinutes + (session.timeSeconds / 60));
    });

    const result = Array.from(daysMap.entries()).map(([label, phut]) => ({
      label,
      phut: Math.round(phut)
    })).reverse(); // Reverse because query is desc

    return result.length > 0 ? result : chartData;
  }, [serverData]);

  return (
    <Card className="flex flex-col h-full justify-between">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Thời gian ôn tập</CardTitle>
        <CardDescription>Dữ liệu theo phiên học (Phút)</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer config={chartConfig} className="h-[180px] w-full">
          <LineChart
            accessibilityLayer
            data={dynamicData}
            margin={{ left: 16, right: 16, top: 10 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
            />
            <YAxis 
              domain={[0, 120]} 
              tickCount={5}
              tickLine={false}
              axisLine={false}
              className="text-xs"
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="phut"
              type="linear"
              stroke="var(--color-phut)"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "var(--color-phut)" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-sm border-t pt-3">
        <div className="flex gap-2 leading-none font-medium text-green-600">
          Tăng trưởng 12.4% so với tuần trước <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-xs text-muted-foreground">
          Thời gian học khống chế tối đa 120 phút/ngày
        </div>
      </CardFooter>
    </Card>
  )
}