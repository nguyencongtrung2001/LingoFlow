"use client"

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

export const description = "A linear line chart for study time"

// Dummy data for study time (minutes) over 7 days
const chartData = [
  { day: "Thứ 2", minutes: 45 },
  { day: "Thứ 3", minutes: 60 },
  { day: "Thứ 4", minutes: 30 },
  { day: "Thứ 5", minutes: 90 },
  { day: "Thứ 6", minutes: 120 },
  { day: "Thứ 7", minutes: 85 },
  { day: "CN", minutes: 110 },
]

const chartConfig = {
  minutes: {
    label: "Phút",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function StudyTimeChart() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Thời gian học (phút)</CardTitle>
        <CardDescription>Tuần này</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="h-full min-h-[200px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 0,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis 
              domain={[0, 120]} 
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}p`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="minutes"
              type="linear"
              stroke="var(--color-minutes)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
