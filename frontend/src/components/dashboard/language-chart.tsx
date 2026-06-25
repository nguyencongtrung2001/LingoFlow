"use client";

import { IconWorld } from "@tabler/icons-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

ChartJS.defaults.font.family = "Inter, sans-serif";
ChartJS.defaults.font.size = 11;
ChartJS.defaults.color = "#9998aa";

export function LanguageChart() {
  // Mock data for Language Distribution
  const langColors = ["#4648d4", "#EF9F27", "#D4537E", "#1D9E75", "#888780"];
  const langLabels = ["Tiếng Anh", "Tiếng Trung", "Tiếng Nhật", "Tiếng Hàn", "Khác"];
  const langData = [55, 20, 15, 8, 2];

  const data = {
    labels: langLabels,
    datasets: [
      {
        data: langData,
        backgroundColor: langColors,
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
        <IconWorld className="w-[14px] h-[14px] text-[#4648d4]" />
        Phân bổ ngôn ngữ
      </div>

      <div className="flex flex-wrap gap-x-[14px] gap-y-[6px] mb-[12px]">
        {langLabels.map((label, i) => (
          <span
            key={label}
            className="flex items-center gap-[5px] text-[11px] text-[#5f5e6e] font-medium"
          >
            <span
              className="w-[9px] h-[9px] rounded-[2px] shrink-0"
              style={{ backgroundColor: langColors[i] }}
            ></span>
            {label} — {langData[i]}%
          </span>
        ))}
      </div>

      <div className="relative h-[200px] flex justify-center mt-auto">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}
