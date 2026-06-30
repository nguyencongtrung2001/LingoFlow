"use client";

import { useMemo, useState } from "react";
import { useStudyHistory } from "@/feature/dashboard/hooks/useStudyHistory";
import { Folder, Clock, Flame, Calendar, Trophy, RotateCcw, Filter, Activity } from "lucide-react";
import Link from "next/link";

const MODE_MAP = {
  FLASHCARD: { label: "Flashcard", icon: "🃏", colorClass: "bg-indigo-50 text-indigo-700 border-indigo-100" },
  QUIZ: { label: "Quiz", icon: "📝", colorClass: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  MATCH: { label: "Ghép thẻ", icon: "🔗", colorClass: "bg-violet-50 text-violet-700 border-violet-100" },
  WRITE: { label: "Viết từ", icon: "✍️", colorClass: "bg-amber-50 text-amber-700 border-amber-100" },
};

const formatDuration = (seconds: number | null): string => {
  if (!seconds) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export default function HistoryPage() {
  const { data: history, isLoading } = useStudyHistory();
  const [selectedMode, setSelectedMode] = useState<string>("ALL");
  const [selectedFolder, setSelectedFolder] = useState<string>("ALL");

  // Extract unique folders from history
  const uniqueFolders = useMemo(() => {
    if (!history) return [];
    const folders = history.map((session) => session.folder.name);
    return Array.from(new Set(folders));
  }, [history]);

  // Filter history based on user selection
  const filteredHistory = useMemo(() => {
    if (!history) return [];
    return history.filter((session) => {
      const matchMode = selectedMode === "ALL" || session.mode === selectedMode;
      const matchFolder = selectedFolder === "ALL" || session.folder.name === selectedFolder;
      return matchMode && matchFolder;
    });
  }, [history, selectedMode, selectedFolder]);

  if (isLoading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="h-10 w-48 bg-slate-100 animate-pulse rounded-lg" />
        <div className="h-12 w-full bg-slate-50 animate-pulse rounded-xl" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 w-full bg-slate-50 animate-pulse rounded-xl border border-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[26px] font-black text-[#0b1c30] tracking-tight flex items-center gap-2">
            <Activity className="w-7 h-7 text-[#4648d4]" />
            Lịch sử học tập
          </h1>
          <p className="text-slate-400 text-sm mt-1">Theo dõi lại các phiên ôn luyện và mức độ tiến bộ của bạn</p>
        </div>
      </div>

      {!history || history.length === 0 ? (
        <div className="bg-white border border-[#e5eeff] rounded-2xl p-12 text-center flex flex-col items-center justify-center shadow-sm select-none">
          <span className="text-5xl mb-3">🕒</span>
          <h2 className="text-lg font-bold text-slate-700">Chưa có lịch sử học tập</h2>
          <p className="text-sm text-slate-400 mt-2 max-w-sm">
            Bạn chưa thực hiện phiên ôn tập nào. Hãy chọn một thư mục từ vựng và bắt đầu luyện tập ngay!
          </p>
          <Link
            href="/folders"
            className="mt-6 bg-[#4648d4] text-white px-6 py-2.5 rounded-[12px] font-semibold hover:bg-[#3b3db8] transition-all shadow-[0_4px_12px_rgba(70,72,212,0.15)]"
          >
            Đến danh sách Thư mục
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white border border-[#e5eeff] rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-4">
              {/* Filter Mode */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 select-none">
                  <Filter className="w-3.5 h-3.5" /> Chế độ:
                </span>
                <select
                  value={selectedMode}
                  onChange={(e) => setSelectedMode(e.target.value)}
                  className="bg-[#f8f9fc] border border-[#e2e8f0] rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-700 outline-none focus:border-[#4648d4] transition-colors cursor-pointer"
                >
                  <option value="ALL">Tất cả</option>
                  <option value="FLASHCARD">🃏 Flashcard</option>
                  <option value="QUIZ">📝 Quiz</option>
                  <option value="MATCH">🔗 Ghép thẻ</option>
                  <option value="WRITE">✍️ Viết từ</option>
                </select>
              </div>

              {/* Filter Folder */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 select-none">
                  <Folder className="w-3.5 h-3.5" /> Thư mục:
                </span>
                <select
                  value={selectedFolder}
                  onChange={(e) => setSelectedFolder(e.target.value)}
                  className="bg-[#f8f9fc] border border-[#e2e8f0] rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-700 outline-none focus:border-[#4648d4] transition-colors cursor-pointer max-w-[200px]"
                >
                  <option value="ALL">Tất cả</option>
                  {uniqueFolders.map((folderName, idx) => (
                    <option key={idx} value={folderName}>
                      {folderName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Reset Button */}
            {(selectedMode !== "ALL" || selectedFolder !== "ALL") && (
              <button
                onClick={() => {
                  setSelectedMode("ALL");
                  setSelectedFolder("ALL");
                }}
                className="text-xs font-semibold text-[#4648d4] hover:text-[#3b3db8] flex items-center gap-1 self-start md:self-auto transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset bộ lọc
              </button>
            )}
          </div>

          {/* Results List */}
          {filteredHistory.length === 0 ? (
            <div className="bg-white border border-[#e5eeff] rounded-xl p-8 text-center text-slate-400 text-sm select-none shadow-sm">
              Không tìm thấy phiên học nào khớp với bộ lọc đã chọn.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredHistory.map((session) => {
                const modeDetail = MODE_MAP[session.mode] || { label: session.mode, icon: "🎮", colorClass: "bg-slate-50 text-slate-700 border-slate-100" };
                const isPerfect = session.accuracy >= 100;

                return (
                  <div
                    key={session.id}
                    className="bg-white border border-[#e8edf6] rounded-xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:border-[#cbdff7] hover:shadow-[0_4px_12px_rgba(70,72,212,0.02)] transition-all duration-200"
                  >
                    {/* Left: Mode & Folder Info */}
                    <div className="flex items-start md:items-center gap-4">
                      {/* Mode Icon/Tag */}
                      <span
                        className={`text-xs font-bold border px-2.5 py-1 rounded-lg flex items-center gap-1.5 shrink-0 select-none ${modeDetail.colorClass}`}
                      >
                        <span className="text-[14px]">{modeDetail.icon}</span>
                        {modeDetail.label}
                      </span>

                      {/* Folder & Words */}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Folder className="w-3.5 h-3.5 text-slate-400" />
                          <h3 className="font-semibold text-slate-700 text-sm sm:text-base leading-tight">
                            {session.folder.name}
                          </h3>
                        </div>
                        <p className="text-slate-400 text-xs mt-1">
                          Tổng số từ: <span className="font-semibold text-slate-600">{session.totalWords} từ</span> (Đúng {session.correctCount})
                        </p>
                      </div>
                    </div>

                    {/* Right: Stats & Date */}
                    <div className="flex flex-wrap items-center justify-between md:justify-end gap-6 md:gap-10 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                      {/* Streak */}
                      {session.maxStreak > 0 && (
                        <div className="flex items-center gap-1.5" title="Chuỗi trả lời đúng liên tiếp dài nhất">
                          <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Max Streak</p>
                            <p className="text-sm font-extrabold text-slate-700 mt-0.5">{session.maxStreak}</p>
                          </div>
                        </div>
                      )}

                      {/* Time */}
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Thời lượng</p>
                          <p className="text-sm font-semibold text-slate-700 mt-0.5">{formatDuration(session.timeSeconds)}</p>
                        </div>
                      </div>

                      {/* Accuracy */}
                      <div className="flex items-center gap-1.5">
                        <Trophy className={`w-4.5 h-4.5 ${isPerfect ? "text-yellow-500 fill-yellow-500" : "text-[#4648d4]"}`} />
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Chính xác</p>
                          <p className={`text-sm font-extrabold mt-0.5 ${isPerfect ? "text-yellow-600 font-black" : "text-[#4648d4]"}`}>
                            {Math.round(session.accuracy)}%
                          </p>
                        </div>
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-1.5 md:min-w-[120px]">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Thời gian học</p>
                          <p className="text-xs font-semibold text-slate-500 mt-0.5 whitespace-nowrap">{formatDate(session.startedAt)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
