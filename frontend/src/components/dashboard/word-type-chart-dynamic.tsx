"use client";

import dynamic from "next/dynamic";

export const WordTypeChartDynamic = dynamic(
  () => import("./word-type-chart").then((mod) => mod.ChartPieLegend),
  {
    ssr: false,
    loading: () => (
      <div className="h-full bg-white border border-[#e5eeff] rounded-[16px] animate-pulse" />
    ),
  }
);
