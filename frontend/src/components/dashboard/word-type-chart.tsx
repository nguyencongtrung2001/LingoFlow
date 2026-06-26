"use client";

import { IconChartDonut } from "@tabler/icons-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

ChartJS.defaults.font.family = "Inter, sans-serif";
ChartJS.defaults.font.size = 11;
ChartJS.defaults.color = "#9998aa";

export function WordTypeChart() {
  const posColors = ["#7F77DD", "#1D9E75", "#EF9F27", "#D4537E", "#888780"];
  const posLabels = ["Danh từ", "Động từ", "Tính từ", "Trạng từ", "Cụm từ"];
  const posData = [45, 30, 15, 8, 2];

  const data = {
    labels: posLabels,
    datasets: [
      {
        data: posData,
        backgroundColor: posColors,
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "72%",
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (c: { label: string; raw: number | unknown }) => ` ${c.label}: ${c.raw}%`,
        },
      },
    },
  };

  return (
    <div className="bg-white border-[0.5px] border-[rgba(70,69,90,0.10)] rounded-[16px] p-5 flex flex-col shadow-[0_2px_12px_-2px_rgba(70,72,212,0.04)] h-full">
      <div className="text-[11px] font-bold text-[#5f5e6e] uppercase tracking-[0.06em] flex items-center gap-[6px] mb-[0.8rem]">
        <IconChartDonut className="w-[14px] h-[14px] text-[#4648d4]" />
        Phân bổ từ loại
      </div>

      <div className="flex flex-wrap gap-x-[14px] gap-y-[6px] mb-[12px]">
        {posLabels.map((label, i) => (
          <span
            key={label}
            className="flex items-center gap-[5px] text-[11px] text-[#5f5e6e] font-medium"
          >
            <span
              className="w-[9px] h-[9px] rounded-[2px] shrink-0"
              style={{ backgroundColor: posColors[i] }}
            ></span>
            {label} — {posData[i]}%
          </span>
        ))}
      </div>

      <div className="relative h-[200px] flex justify-center mt-auto">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}
