"use client"

import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "A pie chart with a legend for word types"

const chartData = [
  { type: "noun", count: 275, fill: "var(--color-noun)" },
  { type: "verb", count: 200, fill: "var(--color-verb)" },
  { type: "adj", count: 187, fill: "var(--color-adj)" },
  { type: "adv", count: 173, fill: "var(--color-adv)" },
  { type: "other", count: 90, fill: "var(--color-other)" },
]

const chartConfig = {
  count: {
    label: "Số lượng",
  },
  noun: {
    label: "Danh từ",
    color: "var(--chart-1)",
  },
  verb: {
    label: "Động từ",
    color: "var(--chart-2)",
  },
  adj: {
    label: "Tính từ",
    color: "var(--chart-3)",
  },
  adv: {
    label: "Trạng từ",
    color: "var(--chart-4)",
  },
  other: {
    label: "Khác",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export function VocabCountChart() {
  return (
    <Card className="flex flex-col h-full w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Phân loại từ vựng</CardTitle>
        <CardDescription>Theo loại từ</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 flex items-center justify-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] w-full"
        >
          <PieChart>
            <Pie data={chartData} dataKey="count" nameKey="type" />
            <ChartLegend
              content={<ChartLegendContent nameKey="type" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
