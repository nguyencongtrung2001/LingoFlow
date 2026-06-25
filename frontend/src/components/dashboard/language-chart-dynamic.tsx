"use client";

import dynamic from "next/dynamic";

export const LanguageChartDynamic = dynamic(
  () => import("./language-chart").then((mod) => mod.LanguageChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-full bg-white border border-[#e5eeff] rounded-[16px] animate-pulse" />
    ),
  }
);
