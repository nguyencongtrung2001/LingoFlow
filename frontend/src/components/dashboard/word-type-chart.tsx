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

const chartData = [
  { loaiTu: "noun", soLuong: 120, fill: "var(--color-noun)" },
  { loaiTu: "verb", soLuong: 85, fill: "var(--color-verb)" },
  { loaiTu: "adj", soLuong: 65, fill: "var(--color-adj)" },
  { loaiTu: "adv", soLuong: 30, fill: "var(--color-adv)" },
  { loaiTu: "phrase", soLuong: 45, fill: "var(--color-phrase)" },
]

const chartConfig = {
  soLuong: { label: "Số lượng" },
  noun: { label: "Danh từ (Noun)", color: "#4338ca" },
  verb: { label: "Động từ (Verb)", color: "#4f46e5" },
  adj: { label: "Tính từ (Adj)", color: "#6366f1" },
  adv: { label: "Trạng từ (Adv)", color: "#818cf8" },
  phrase: { label: "Cụm từ (Phrase)", color: "#a5b4fc" },
} satisfies ChartConfig

export function ChartPieLegend() {
  return (
    <Card className="flex flex-col h-full justify-between">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-base font-semibold">Cơ cấu loại từ</CardTitle>
        <CardDescription>Phân loại tổng hợp kho từ</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-2">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[160px] w-full"
        >
          <PieChart>
            <Pie data={chartData} dataKey="soLuong" nameKey="loaiTu" />
            <ChartLegend
              content={<ChartLegendContent nameKey="loaiTu" />}
              className="flex-wrap gap-x-2 gap-y-1 justify-center mt-2 text-[11px]"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}