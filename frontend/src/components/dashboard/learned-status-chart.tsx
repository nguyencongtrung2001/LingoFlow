"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "A donut chart for learned status"

const chartData = [
  { status: "learned", count: 275, fill: "var(--color-learned)" },
  { status: "learning", count: 200, fill: "var(--color-learning)" },
  { status: "unlearned", count: 187, fill: "var(--color-unlearned)" },
]

const chartConfig = {
  count: {
    label: "Từ vựng",
  },
  learned: {
    label: "Đã thuộc",
    color: "#4f46e5",
  },
  learning: {
    label: "Đang ôn",
    color: "#818cf8",
  },
  unlearned: {
    label: "Chưa thuộc",
    color: "#c7d2fe",
  },
} satisfies ChartConfig

export function LearnedStatusChart({ serverData }: { serverData?: Array<{ box: number; _count: { id: number } }> }) {
  const dynamicData = React.useMemo(() => {
    if (!serverData || serverData.length === 0) {
      return [
        { status: "learned", count: 0, fill: "var(--color-learned)" },
        { status: "learning", count: 0, fill: "var(--color-learning)" },
        { status: "unlearned", count: 0, fill: "var(--color-unlearned)" },
      ];
    }

    let learnedCount = 0;
    let learningCount = 0;
    let unlearnedCount = 0;

    serverData.forEach(item => {
      if (item.box === 5) {
        learnedCount += item._count.id;
      } else if (item.box === 1) {
        unlearnedCount += item._count.id;
      } else {
        learningCount += item._count.id;
      }
    });

    return [
      { status: "learned", count: learnedCount, fill: "var(--color-learned)" },
      { status: "learning", count: learningCount, fill: "var(--color-learning)" },
      { status: "unlearned", count: unlearnedCount, fill: "var(--color-unlearned)" },
    ];
  }, [serverData]);

  const totalWords = React.useMemo(() => {
    return dynamicData.reduce((acc, curr) => acc + curr.count, 0)
  }, [dynamicData])

  return (
    <Card className="flex flex-col h-full w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Tiến độ học</CardTitle>
        <CardDescription>Trạng thái từ vựng</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 flex items-center justify-center min-h-[200px]">
        {totalWords === 0 ? (
          <div className="flex flex-col items-center justify-center text-slate-400 text-sm px-4 text-center select-none py-6">
            <span className="text-3xl mb-1">📊</span>
            <p className="font-semibold text-slate-500">Chưa có tiến độ học tập</p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-[220px]">Các từ vựng bạn học qua hệ thống Leitner sẽ được thống kê tại đây.</p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[200px] w-full"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={dynamicData}
                dataKey="count"
                nameKey="status"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalWords.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Từ
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
