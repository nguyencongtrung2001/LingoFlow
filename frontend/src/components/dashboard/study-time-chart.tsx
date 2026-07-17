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

export function ChartLineLinear({ serverData }: { serverData?: Array<{ date: string; studyTimeSeconds: number }> }) {
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
      serverData.forEach(item => {
        const dateKey = item.date.split("T")[0];
        const currentMin = dataMap.get(dateKey) || 0;
        dataMap.set(dateKey, currentMin + ((item.studyTimeSeconds || 0) / 60));
      });
    }

    const formatLocalDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    return last7Days.map(date => {
      const dateKey = formatLocalDate(date);
      const phut = dataMap.get(dateKey) || 0;
      // Khống chế kịch trần 120 phút bảo vệ an toàn tỉ lệ trục quạt đồ thị
      const phutHienThi = phut > 120 ? 120 : phut;
      return {
        label: days[date.getDay()],
        phut: Math.round(phutHienThi)
      };
    });
  }, [serverData]);

  const growthRate = React.useMemo(() => {
    if (!serverData || serverData.length === 0) return 0;

    const today = new Date();
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const sevenDaysAgo = new Date(todayMidnight);
    sevenDaysAgo.setDate(todayMidnight.getDate() - 6);
    
    const fourteenDaysAgo = new Date(todayMidnight);
    fourteenDaysAgo.setDate(todayMidnight.getDate() - 13);

    let thisWeekSeconds = 0;
    let lastWeekSeconds = 0;

    serverData.forEach(item => {
      const activityDate = new Date(item.date);
      const activityDateMidnight = new Date(activityDate.getFullYear(), activityDate.getMonth(), activityDate.getDate());
      
      if (activityDateMidnight >= sevenDaysAgo) {
        thisWeekSeconds += item.studyTimeSeconds || 0;
      } else if (activityDateMidnight >= fourteenDaysAgo && activityDateMidnight < sevenDaysAgo) {
        lastWeekSeconds += item.studyTimeSeconds || 0;
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
        <CardDescription>Thời gian tương tác học thực tế (Phút)</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer config={chartConfig} className="h-[180px] min-h-[180px] w-full">
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
          Thời gian học khống chế tối đa 120 phút/ngày
        </div>
      </CardFooter>
    </Card>
  )
}