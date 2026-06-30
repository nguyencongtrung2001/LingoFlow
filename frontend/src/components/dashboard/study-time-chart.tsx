"use client"

import * as React from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
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

const chartConfig = {
  phut: {
    label: "Thời gian học (phút)",
    color: "#4f46e5",
  },
} satisfies ChartConfig

export function ChartLineLinear({ serverData }: { serverData?: Array<{ startedAt: string; timeSeconds: number }> }) {
  const dynamicData = React.useMemo(() => {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }).map((_, idx) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - idx));
      return date;
    });

    const days = ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ Bảy"];

    const dataMap = new Map<string, number>();
    if (serverData && serverData.length > 0) {
      serverData.forEach(session => {
        const dateKey = new Date(session.startedAt).toISOString().split("T")[0];
        const currentMin = dataMap.get(dateKey) || 0;
        dataMap.set(dateKey, currentMin + (session.timeSeconds / 60));
      });
    }

    return last7Days.map(date => {
      const dateKey = date.toISOString().split("T")[0];
      const phut = dataMap.get(dateKey) || 0;
      return {
        label: days[date.getDay()],
        phut: Math.round(phut)
      };
    });
  }, [serverData]);

  const growthRate = React.useMemo(() => {
    if (!serverData || serverData.length === 0) return 0;

    const today = new Date();
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const sevenDaysAgo = new Date(todayMidnight);
    sevenDaysAgo.setDate(todayMidnight.getDate() - 6);

    let thisWeekSeconds = 0;
    let lastWeekSeconds = 0;

    serverData.forEach(session => {
      const sessionDate = new Date(session.startedAt);
      if (sessionDate >= sevenDaysAgo) {
        thisWeekSeconds += session.timeSeconds;
      } else {
        lastWeekSeconds += session.timeSeconds;
      }
    });

    if (lastWeekSeconds === 0) {
      return thisWeekSeconds > 0 ? 100 : 0;
    }

    const rate = ((thisWeekSeconds - lastWeekSeconds) / lastWeekSeconds) * 100;
    return parseFloat(rate.toFixed(1));
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
              domain={[0, 180]} 
              tickCount={7}
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
        {growthRate > 0 ? (
          <div className="flex gap-2 leading-none font-medium text-green-600">
            Tăng trưởng {growthRate}% so với tuần trước <TrendingUp className="h-4 w-4" />
          </div>
        ) : growthRate < 0 ? (
          <div className="flex gap-2 leading-none font-medium text-rose-600">
            Giảm {Math.abs(growthRate)}% so với tuần trước <TrendingDown className="h-4 w-4" />
          </div>
        ) : (
          <div className="flex gap-2 leading-none font-medium text-slate-400">
            Không đổi so với tuần trước
          </div>
        )}
        <div className="leading-none text-xs text-muted-foreground">
          Thời gian học khống chế tối đa 180 phút/ngày
        </div>
      </CardFooter>
    </Card>
  )
}