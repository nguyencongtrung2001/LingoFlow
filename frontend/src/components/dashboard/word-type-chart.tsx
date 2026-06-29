"use client"

import { Pie, PieChart, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const chartData = [
  { name: "Danh từ (N)", value: 120, fill: "#4338ca" },
  { name: "Động từ (V)", value: 85, fill: "#4f46e5" },
  { name: "Tính từ (Adj)", value: 65, fill: "#6366f1" },
  { name: "Trạng từ (Adv)", value: 30, fill: "#818cf8" },
  { name: "Cụm từ", value: 45, fill: "#a5b4fc" },
]

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      name: string;
      value: number;
      fill: string;
    };
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white px-3 py-2 border rounded-lg shadow-sm text-sm">
        <span className="font-medium" style={{ color: data.fill }}>{data.name}</span>
        <span className="text-slate-600"> - {data.value} từ</span>
      </div>
    );
  }
  return null;
};

export function ChartPieLegend({ serverData }: { serverData?: Array<{ pos: string; _count: { id: number } }> }) {
  // Map server data to chartData format, mapping English POS to Vietnamese
  const posMap: Record<string, { name: string; fill: string }> = {
    NOUN: { name: "Danh từ (N)", fill: "#4338ca" },
    VERB: { name: "Động từ (V)", fill: "#4f46e5" },
    ADJECTIVE: { name: "Tính từ (Adj)", fill: "#6366f1" },
    ADVERB: { name: "Trạng từ (Adv)", fill: "#818cf8" },
    PHRASE: { name: "Cụm từ", fill: "#a5b4fc" },
  };

  const dynamicData = serverData && serverData.length > 0
    ? serverData.map(item => ({
        name: posMap[item.pos]?.name || item.pos,
        value: item._count.id,
        fill: posMap[item.pos]?.fill || "#cbd5e1"
      }))
    : chartData; // Fallback to dummy data if no data

  return (
    <Card className="flex flex-col h-full justify-between">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-base font-semibold">Cơ cấu loại từ</CardTitle>
        <CardDescription>Phân loại tổng hợp kho từ</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-4 pt-4 flex flex-col justify-center">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={dynamicData} 
                dataKey="value" 
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={85}
              >
                {dynamicData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                wrapperStyle={{ fontSize: "12px", paddingTop: "15px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}