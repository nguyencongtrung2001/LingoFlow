"use client";

import { useEffect, useState } from "react";
import { IconCalendarStats } from "@tabler/icons-react";
import "./dashboard-styles.css";

export function HeatmapCard() {
  const [gridData, setGridData] = useState<string[]>([]);

  useEffect(() => {
    const lvls = ["hc0", "hc1", "hc2", "hc3", "hc4"];
    const generated: string[] = [];
    for (let i = 0; i < 7 * 52; i++) {
      let l = "hc0";
      if (Math.floor(i / 7) >= 31) {
        const r = Math.random();
        if (r > 0.55) l = lvls[Math.floor(Math.random() * 4) + 1];
      }
      generated.push(l);
    }
    setTimeout(() => setGridData(generated), 0);
  }, []);

  return (
    <div className="bg-white border-[0.5px] border-[rgba(70,69,90,0.10)] rounded-[16px] p-5 flex flex-col justify-between shadow-[0_2px_12px_-2px_rgba(70,72,212,0.04)] h-full">
      <div className="text-[11px] font-bold text-[#5f5e6e] uppercase tracking-[0.06em] flex items-center gap-[6px] mb-[0.8rem]">
        <IconCalendarStats className="w-[14px] h-[14px] text-[#4648d4]" />
        Tần suất ôn tập từ vựng
      </div>

      <div className="overflow-x-auto py-1 flex-1">
        <div className="flex pl-[32px] mb-[6px]">
          <div className="flex w-full justify-between min-w-[689px]">
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month) => (
              <div key={month} className="text-[10px] text-[#9998aa] font-medium flex-1 text-left">
                {month}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 items-start">
          <div className="flex flex-col gap-[3px] text-[10px] text-[#9998aa] font-medium min-w-[24px]">
            <span className="h-[10px] leading-[10px]">Mon</span>
            <span className="h-[10px] leading-[10px]">Tue</span>
            <span className="h-[10px] leading-[10px]">Wed</span>
            <span className="h-[10px] leading-[10px]">Thu</span>
            <span className="h-[10px] leading-[10px]">Fri</span>
            <span className="h-[10px] leading-[10px]">Sat</span>
            <span className="h-[10px] leading-[10px]">Sun</span>
          </div>
          <div className="hm-grid">
            {gridData.map((level, i) => (
              <div key={i} className={`hc ${level}`}></div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-[14px] text-[11px] text-[#9998aa]">
        <span>Learn how we count contributions</span>
        <div className="flex items-center gap-[3px]">
          <span>Less</span>
          <div className="hc hc0"></div>
          <div className="hc hc1"></div>
          <div className="hc hc2"></div>
          <div className="hc hc3"></div>
          <div className="hc hc4"></div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
