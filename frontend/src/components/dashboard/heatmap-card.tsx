"use client";

import { useState } from "react";
import { IconCalendarStats } from "@tabler/icons-react";
import "./dashboard-styles.css";

// Tách hàm khởi tạo dữ liệu thuần khiết ra ngoài phạm vi Render của Component để giữ tính thuần khiết (Pure Function)
const khoiTaoDuLieuGiaLap = (): string[] => {
  const lvls = ["hc0", "hc1", "hc2", "hc3", "hc4"];
  const generated: string[] = [];
  
  // 7 ngày * 53 tuần = 371 ô vuông đại diện cho toàn năm
  for (let i = 0; i < 7 * 53; i++) {
    let l = "hc0";
    const r = Math.random();
    if (r > 0.4) {
      const randomIndex = Math.floor(Math.random() * 4) + 1;
      l = lvls[randomIndex] || "hc0";
    }
    generated.push(l);
  }
  return generated;
};

export function HeatmapCard() {
  // KHỬ HOÀN TOÀN USEEFFECT: Nạp trực tiếp hàm khởi tạo vào useState (Lazy Initial State)
  const [gridData] = useState<string[]>(() => khoiTaoDuLieuGiaLap());

  return (
    <div className="bg-white border-[0.5px] border-slate-100 rounded-[16px] p-5 flex flex-col justify-between shadow-sm h-full">
      
      {/* Tiêu đề Card */}
      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.06em] flex items-center gap-[6px] mb-4">
        <IconCalendarStats className="w-[14px] h-[14px] text-[#4648d4]" />
        Tần suất ôn tập từ vựng
      </div>

      <div className="overflow-x-auto py-1 flex-1 scrollbar-none">
        {/* TRỤC NGANG: Tiến độ tháng rải đều từ Jan đến Dec */}
        <div className="flex justify-between pl-8 pr-2 mb-2 text-[10px] text-slate-400 font-medium select-none min-w-[500px]">
          <span>Jan</span>
          <span>Feb</span>
          <span>Mar</span>
          <span>Apr</span>
          <span>May</span>
          <span>Jun</span>
          <span>Jul</span>
          <span>Aug</span>
          <span>Sep</span>
          <span>Oct</span>
          <span>Nov</span>
          <span>Dec</span>
        </div>

        <div className="flex gap-3 items-start min-w-[500px]">
          {/* TRỤC DỌC: Thứ tự ngày xếp cân đối từ Mon đến Sun */}
          <div className="flex flex-col justify-between h-[88px] text-[10px] text-slate-400 font-medium pt-px select-none">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
            <span>Sun</span>
          </div>

          {/* KHU VỰC LƯỚI Ô VUÔNG TỰ ĐỘNG BẺ DÒNG THEO CỘT */}
          <div className="hm-grid">
            {gridData.map((level, i) => (
              <div key={i} className={`hc ${level}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Thanh chú giải Cấp độ thắp sáng (Legend) */}
      <div className="flex justify-between items-center mt-4 text-[11px] text-slate-400 border-t border-slate-50 pt-3 select-none">
        <span>Ghi nhận dựa trên số lượng phiên học</span>
        <div className="flex items-center gap-[4px] font-medium text-[10px]">
          <span className="mr-1 text-slate-400">Less</span>
          <div className="hc hc0 border border-slate-200/40"></div>
          <div className="hc hc1"></div>
          <div className="hc hc2"></div>
          <div className="hc hc3"></div>
          <div className="hc hc4"></div>
          <span className="ml-1 text-slate-500">More</span>
        </div>
      </div>

    </div>
  );
}