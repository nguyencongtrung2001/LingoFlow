"use client";

import { useMemo } from "react";
import { Flame } from "lucide-react";

interface HeatmapDataPoint {
  date: string;
  wordsStudied: number;
}

const getDayLabel = (date: Date): string => {
  const day = date.getDay();
  if (day === 0) return "CN";
  return `T${day + 1}`;
};

const calculateStreak = (serverData?: HeatmapDataPoint[]) => {
  if (!serverData || serverData.length === 0) {
    return { currentStreak: 0, studiedDays: new Set<string>() };
  }

  const studiedDays = new Set<string>();
  serverData.forEach(item => {
    if (item.wordsStudied > 0) {
      const dateKey = item.date.split("T")[0];
      studiedDays.add(dateKey);
    }
  });

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (!studiedDays.has(todayStr) && !studiedDays.has(yesterdayStr)) {
    return { currentStreak: 0, studiedDays };
  }

  let currentStreak = 0;
  const checkDate = new Date(studiedDays.has(todayStr) ? today : yesterday);

  while (true) {
    const checkStr = checkDate.toISOString().split("T")[0];
    if (studiedDays.has(checkStr)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return { currentStreak, studiedDays };
};

export function StreakCard({ serverData }: { serverData?: HeatmapDataPoint[] }) {
  const { currentStreak, days } = useMemo(() => {
    const { currentStreak, studiedDays } = calculateStreak(serverData);
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    const generatedDays = Array.from({ length: 7 }).map((_, idx) => {
      // Offset from -5 to +1
      const offset = idx - 5;
      const date = new Date(today);
      date.setDate(today.getDate() + offset);
      const dateStr = date.toISOString().split("T")[0];

      const isToday = dateStr === todayStr;
      const isFuture = date > today && !isToday;
      const hasStudied = studiedDays.has(dateStr);

      return {
        label: getDayLabel(date),
        isToday,
        isFuture,
        hasStudied,
      };
    });

    return { currentStreak, days: generatedDays };
  }, [serverData]);

  return (
    <div className="bg-[#4648d4] rounded-[16px] p-5 h-full flex flex-col justify-between shadow-[0_2px_12px_-2px_rgba(70,72,212,0.04)]">
      <div>
        <div className="flex items-center gap-[7px]">
          <Flame className="w-[18px] h-[18px] text-[#c4c5f7]" />
          <span className="text-[10px] font-bold tracking-[.09em] uppercase text-[#c4c5f7]">
            Chuỗi ngày học
          </span>
        </div>
        <div className="mt-2">
          <span className="text-[58px] font-extrabold leading-none text-white">
            {currentStreak}
          </span>
          <span className="text-[15px] text-[#a5a6ef] ml-[5px]">
            ngày
          </span>
        </div>
      </div>
      
      <div className="flex gap-[6px] mt-auto">
        {days.map((day, idx) => {
          if (day.hasStudied) {
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold bg-white text-[#4648d4] ${day.isToday ? "animate-pulse-flame" : ""}`}>
                  <Flame className="w-[15px] h-[15px]" fill="currentColor" />
                </div>
                <span className={`text-[10px] ${day.isToday ? "font-bold text-white" : "font-semibold text-white/50"}`}>
                  {day.label}
                </span>
              </div>
            );
          } else if (day.isToday) {
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold bg-transparent border-[1.5px] border-dashed border-white text-white"></div>
                <span className="text-[10px] font-bold text-white">
                  {day.label}
                </span>
              </div>
            );
          } else if (day.isFuture) {
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold bg-transparent border-[1.5px] border-white/30 text-white/35"></div>
                <span className="text-[10px] font-semibold text-white/50">
                  {day.label}
                </span>
              </div>
            );
          } else {
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold bg-white/10 text-white/45"></div>
                <span className="text-[10px] font-semibold text-white/50">
                  {day.label}
                </span>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
